#!/usr/bin/env node
/**
 * Browser-based validation harness for the kepler.gl AI assistant.
 *
 * Validates the migrated ai-assistant-v2 feature set end-to-end in a real
 * browser (puppeteer + system Chrome):
 *
 *   Command-layer checks (no LLM required):
 *     1. Command registry exposes all expected command ids.
 *     2. `map.load-data` from a URL does NOT auto-create a layer.
 *     3. `map.add-layer` creates exactly one layer (no duplicates).
 *     4. `map.get-dataset-context` reports the loaded dataset.
 *     5. `geoda.analysis` (classify) returns break values.
 *     6. `geo.spatial-query` runs DuckDB spatial SQL and returns scalar values.
 *
 *   Lab-chapter command-layer checks (no LLM required) — cover the features
 *   from discussion 2843:
 *     Chapter 1 (Basic Operations): load polygon/point/CSV, point layer from
 *       CSV coords, grid, standardization, create-table, load-to-map, merge.
 *     Chapter 2 (GIS Operations): centroid, thiessen polygons, MST, dissolve,
 *       spatial join (point-in-polygon count).
 *     Chapter 3 (Basic Mapping): classify (quantile / natural breaks / equal
 *       interval / percentile / box / stddev), add-layer with colorMap,
 *       update-layer-color, histogram.
 *     Chapter 4 (Rate Mapping): rate (excessRisk + empiricalBayes) with
 *       sensible output values.
 *
 *   End-to-end checks (require a local Ollama server):
 *     7. A simple prompt round-trips through the assistant.
 *     8. "Load data from URL and show it on the map" → 1 dataset + 1 layer.
 *     9. "Classify a column into bins" → breaks returned.
 *    10. Lab Ch1: load a polygon dataset + layer via prompt.
 *    11. Lab Ch3: quantile map via prompt → layer with colorField.
 *    12. Lab Ch4: rate + box map via prompt → response mentions a rate.
 *    13. Lab Ch2: centroids via prompt → DuckDB table created.
 *
 * Prerequisites:
 *   - Dev server running: `yarn start` in examples/demo-app (port 8080).
 *   - Ollama running on http://localhost:11434 with model `deepseek-v4-flash:cloud`
 *     (or override via OLLAMA_MODEL env var).
 *   - System Chrome at /Applications/Google Chrome.app (falls back to bundled).
 *
 * Usage:
 *   node scripts/validate-ai-assistant.mjs
 *   DEMO_APP_URL=http://localhost:8080 node scripts/validate-ai-assistant.mjs
 *
 * Exit code 0 = all checks passed; 1 = at least one check failed.
 */

import puppeteer from 'puppeteer';
import {existsSync} from 'node:fs';

const BASE_URL = process.env.DEMO_APP_URL || 'http://localhost:8080/';
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'deepseek-v4-flash:cloud';
const SKIP_E2E = process.env.SKIP_E2E === '1';
const SYSTEM_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// Reachable datasets (geodacenter.github.io is unreachable from this network, so
// the lab scenarios use these public mirrors with equivalent shapes):
//   - us-states.json  : 52 Polygon features, props {name, density}
//   - bart.geo.json   : ~30 Point features (BART stations)
//   - cities15000.csv : tabular {name, longitude, latitude, population}
//   - time_zones.geojson : 120 MultiPolygon features, props {name, utc_name, ...}
const US_STATES_URL =
  'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json';
const BART_URL =
  'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart.geo.json';
const CITIES_URL =
  'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/cities15000.csv';
const TIME_ZONES_URL =
  'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/time_zones.geojson';

const results = [];
function check(name, pass, detail = '') {
  results.push({name, pass, detail});
  const tag = pass ? 'PASS' : 'FAIL';
  console.log(`${tag}  ${name}${detail ? ` — ${detail}` : ''}`);
}
function skip(name, detail) {
  results.push({name, pass: null, detail});
  console.log(`SKIP ${name} — ${detail}`);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

/** Close the auto-opened "Add Data To Map" modal, then open the AI panel. */
async function openAssistantPanel(page) {
  await page.evaluate(() => {
    const close = document.querySelector(
      '.ReactModal__Content .modal--close, .ReactModal__Content [class*="close"]'
    );
    if (close) close.click();
  });
  await sleep(1000);
  await page.evaluate(() => document.querySelector('.toggle-ai-assistant')?.click());
  await sleep(3000);
}

/**
 * Wait until the assistant has produced a reply after `beforeCount` messages.
 * Polls the session's uiMessages; returns the last assistant message state once
 * the run has fully finished. The terminal signal is `session.isRunning ===
 * false` — it stays true for the ENTIRE multi-step tool-call run (including
 * long skill executions), so waiting on message-count stability alone reads
 * intermediate "let me run the skill" text too early. A 30s stability fallback
 * covers the case where isRunning is unreliable. Returns null on timeout.
 */
async function waitForAssistantReply(page, beforeCount, timeoutMs) {
  const start = Date.now();
  let lastCount = beforeCount;
  let stableSince = Date.now();
  while (Date.now() - start < timeoutMs) {
    const state = await page.evaluate(() => {
      const store = window.__keplerRoomStore;
      const session = store.getState().ai.getCurrentSession();
      const msgs = session?.uiMessages || [];
      const last = msgs[msgs.length - 1];
      const text = (last?.parts || [])
        .filter(p => p.type === 'text')
        .map(p => p.text)
        .join(' ');
      return {
        count: msgs.length,
        lastRole: last?.role,
        lastText: text,
        isRunning: session?.isRunning
      };
    });
    if (state.count !== lastCount) {
      lastCount = state.count;
      stableSince = Date.now();
    }
    if (
      state.count > beforeCount &&
      state.lastRole === 'assistant' &&
      state.isRunning === false
    ) {
      return state;
    }
    // Fallback: message count stable for 30s (in case isRunning is unreliable).
    if (
      state.count > beforeCount &&
      state.lastRole === 'assistant' &&
      Date.now() - stableSince > 30000
    ) {
      return state;
    }
    await sleep(2000);
  }
  return null;
}

/**
 * Run one lab-chapter E2E prompt and evaluate the result. The small local model
 * is flaky at multi-step orchestration — it sometimes ends its run after an
 * intermediate "let me find the skill" message without completing the task, or
 * fails to act on the prompt at all — so a failed check is retried up to
 * `maxRetries` times, each on a freshly reloaded page. `checkFn` receives the
 * page and must return `{pass, detail}`.
 */
async function runE2EChapter(page, prompt, timeoutMs, checkFn, maxRetries = 2) {
  const attempt = async () => {
    const before = await page.evaluate(() => {
      const store = window.__keplerRoomStore;
      return store.getState().ai.getCurrentSession()?.uiMessages?.length || 0;
    });
    await page.type('textarea', prompt);
    await sleep(500);
    await page.keyboard.press('Enter');
    await waitForAssistantReply(page, before, timeoutMs);
    return checkFn(page);
  };
  let result = await attempt();
  for (let i = 0; i < maxRetries && !result.pass; i++) {
    // Retry on a clean page (the evaluateOnNewDocument session config survives
    // the reload).
    await page.reload({waitUntil: 'networkidle2', timeout: 60000});
    await sleep(4000);
    await openAssistantPanel(page);
    result = await attempt();
  }
  return result;
}

/**
 * Create a fresh page with the Ollama session config injected before the app
 * boots, navigate to the app, and open the AI panel. Each lab chapter gets its
 * own page so datasets don't accumulate across chapters (the 25k-row cities CSV
 * + grid + derived tables can OOM a single long-lived page) and a crash in one
 * chapter can't take down the rest of the harness.
 */
async function newPage(browser) {
  const page = await browser.newPage();
  await page.setViewport({width: 1440, height: 900});

  // Inject the Ollama session config before the app boots so the assistant
  // uses the local model. `sessionForks` must be an object (record), not an
  // array, or the AiSliceConfig schema parse fails and defaults are used.
  await page.evaluateOnNewDocument(
    ({ollamaBaseUrl, ollamaModel}) => {
      const state = {
        state: {
          ai: {
            sessions: [
              {
                id: 'e2e-session',
                name: 'E2E',
                modelProvider: 'ollama',
                model: ollamaModel
              }
            ],
            currentSessionId: 'e2e-session',
            openSessionTabs: [],
            sessionForks: {}
          },
          aiSettings: {
            providers: {
              ollama: {
                baseUrl: ollamaBaseUrl,
                apiKey: 'ollama',
                models: [{modelName: ollamaModel}]
              }
            },
            customModels: [],
            modelParameters: {maxSteps: 20, additionalInstruction: ''}
          }
        },
        version: 1
      };
      localStorage.setItem('kepler-ai-assistant-state', JSON.stringify(state));
    },
    {ollamaBaseUrl: OLLAMA_BASE_URL, ollamaModel: OLLAMA_MODEL}
  );

  await page.goto(BASE_URL, {waitUntil: 'networkidle2', timeout: 60000});
  await sleep(4000);
  await openAssistantPanel(page);
  return page;
}

/**
 * Run a chapter's page.evaluate with a try/catch so a page crash (e.g. OOM)
 * surfaces as `{ok:false, error}` instead of killing the whole harness.
 */
async function runChapter(page, fn, arg) {
  try {
    return {ok: true, value: await page.evaluate(fn, arg)};
  } catch (e) {
    return {ok: false, error: e?.message || String(e)};
  }
}

async function main() {
  // --- Preflight: dev server + Ollama ---
  let serverUp = false;
  try {
    const res = await fetch(BASE_URL);
    serverUp = res.ok;
  } catch {
    serverUp = false;
  }
  if (!serverUp) {
    console.error(`Dev server not reachable at ${BASE_URL}. Start it with: cd examples/demo-app && yarn start`);
    process.exit(1);
  }
  let ollamaUp = false;
  try {
    const res = await fetch('http://localhost:11434/api/tags');
    ollamaUp = res.ok;
  } catch {
    ollamaUp = false;
  }
  if (!ollamaUp) {
    console.warn('Ollama not reachable on localhost:11434 — E2E checks will be SKIPPED.');
  }

  const launchOpts = {headless: 'new', args: ['--no-sandbox']};
  if (existsSync(SYSTEM_CHROME)) {
    launchOpts.executablePath = SYSTEM_CHROME; // Chrome 98+ has structuredClone
  }
  const browser = await puppeteer.launch(launchOpts);
  let page = await newPage(browser);

  const storeReady = await page.evaluate(() => !!window.__keplerRoomStore);
  if (!storeReady) {
    console.error('Room store hook (window.__keplerRoomStore) not found. Is the dev server serving the latest build?');
    await browser.close();
    process.exit(1);
  }

  // =====================================================================
  // Command-layer checks
  // =====================================================================
  const cmd = await page.evaluate(() => {
    const store = window.__keplerRoomStore;
    const registry = store.getState().commands.registry;
    return Object.keys(registry || {});
  });
  const expected = [
    'map.set-basemap', 'map.add-layer', 'map.update-layer-color', 'map.load-data',
    'map.save-data', 'map.create-table', 'map.add-column', 'map.add-time-filter', 'map.toggle-time-filter',
    'map.split-view', 'map.get-boundary', 'map.get-dataset-context',
    'data.query', 'data.filter', 'data.create-table', 'data.merge-tables', 'data.load-to-map',
    'geo.routing', 'geo.isochrone', 'geo.geocode', 'geo.spatial-query', 'geo.grid',
    'geo.roads', 'geo.us-boundary', 'geoda.analysis',
    'chart.histogram', 'chart.boxplot', 'chart.scatterplot', 'chart.bubble', 'chart.pcp'
  ];
  const missing = expected.filter(id => !cmd.includes(id));
  check('Command registry exposes all expected commands', missing.length === 0,
    missing.length ? `missing: ${missing.join(', ')}` : `${cmd.length} commands registered`);

  // --- load-data → 0 layers; add-layer → 1 layer ---
  const layerFlow = await page.evaluate(async ({bartUrl}) => {
    const store = window.__keplerRoomStore;
    const invoke = (id, input) => store.getState().commands.invokeCommand(id, input);
    const out = {};
    const r1 = await invoke('map.load-data', {url: bartUrl});
    out.loadSuccess = r1.success;
    await new Promise(r => setTimeout(r, 3000));
    const ctx = await invoke('map.get-dataset-context', {});
    const ds = ctx.data?.datasets?.[0];
    out.datasetName = ds?.datasetName;
    out.layersAfterLoad = ds?.layers?.length;
    const r2 = await invoke('map.add-layer', {
      datasetName: ds?.datasetName,
      layerType: 'geojson',
      layerName: 'BART stations'
    });
    out.addLayerSuccess = r2.success;
    await new Promise(r => setTimeout(r, 2000));
    const ctx2 = await invoke('map.get-dataset-context', {});
    out.layersAfterAdd = ctx2.data?.datasets?.[0]?.layers?.length;
    return out;
  }, {bartUrl: BART_URL});

  check('map.load-data loads a dataset from URL', !!layerFlow.loadSuccess, layerFlow.datasetName);
  check('map.load-data does NOT auto-create a layer', layerFlow.layersAfterLoad === 0,
    `layers after load: ${layerFlow.layersAfterLoad}`);
  check('map.add-layer creates exactly one layer', layerFlow.addLayerSuccess && layerFlow.layersAfterAdd === 1,
    `layers after add: ${layerFlow.layersAfterAdd}`);

  // --- geoda.analysis classify ---
  const classify = await page.evaluate(async () => {
    const store = window.__keplerRoomStore;
    const invoke = (id, input) => store.getState().commands.invokeCommand(id, input);
    // Create a numeric table in DuckDB, load it, then classify.
    const conn = await store.getState().db.getConnector();
    await conn.query(
      'CREATE OR REPLACE TABLE test_numeric AS SELECT * FROM (VALUES (1, 10.5), (2, 20.1), (3, 30.7), (4, 40.2), (5, 50.9), (6, 60.3), (7, 70.8), (8, 80.4), (9, 90.1), (10, 100.0)) AS t(id, value)'
    );
    await invoke('map.save-data', {datasetNames: ['test_numeric']});
    await new Promise(r => setTimeout(r, 2000));
    const r = await invoke('geoda.analysis', {
      analysis: 'classify',
      datasetName: 'test_numeric',
      variableName: 'value',
      method: 'quantile',
      k: 3
    });
    return {success: r.success, breaks: r.data?.breaks, error: r.error};
  });
  check('geoda.analysis classify returns breaks', classify.success && Array.isArray(classify.breaks) && classify.breaks.length > 0,
    classify.success ? `breaks: [${classify.breaks.join(', ')}]` : classify.error);

  // --- geoda.analysis missing discriminator ---
  // Omitting `analysis` must yield an actionable message, not a bare Zod
  // "Invalid discriminator value" that reads as if the value were wrong.
  const missingAnalysis = await page.evaluate(async () => {
    const store = window.__keplerRoomStore;
    const invoke = (id, input) => store.getState().commands.invokeCommand(id, input);
    const r = await invoke('geoda.analysis', {
      datasetName: 'test_numeric', variableName: 'value', method: 'quantile', k: 3
    });
    return {success: r.success, error: r.error};
  });
  check('geoda.analysis missing analysis field gives actionable error',
    !missingAnalysis.success && /Missing or invalid required field "analysis"/.test(missingAnalysis.error || ''),
    missingAnalysis.error);

  // --- geo.spatial-query ---
  const spatial = await page.evaluate(async ({bartUrl}) => {
    const store = window.__keplerRoomStore;
    const invoke = (id, input) => store.getState().commands.invokeCommand(id, input);
    // Ensure the dataset is materialized in DuckDB (a layer already exists).
    const r = await invoke('geo.spatial-query', {
      datasetNames: ['bart.geo.json'],
      outputDatasetName: 'bart_centroids',
      sqlQuery:
        'SELECT ST_AsGeoJSON(ST_Centroid(ST_GeomFromGeoJSON(geometry))) AS geometry, name FROM __tbl0__',
      reasoning: 'Compute centroids of BART stations'
    });
    return {success: r.success, error: r.error, firstFiveRows: r.data?.firstFiveRows, outputDatasetName: r.data?.outputDatasetName, tableSchemas: r.data?.tableSchemas};
  }, {bartUrl: BART_URL});
  check('geo.spatial-query runs DuckDB spatial SQL', spatial.success,
    spatial.success ? `output: ${spatial.outputDatasetName}, rows: ${spatial.firstFiveRows?.length}` : spatial.error);
  // The result must report each input table's real column names (incl. the
  // `geometry` column) so the model can write follow-up SQL without guessing.
  const spatialSchema = spatial.tableSchemas?.find(s => s.tableName === 'tbl_bart_geo_json');
  check('geo.spatial-query reports input table schemas',
    Array.isArray(spatial.tableSchemas) && spatialSchema?.columns?.includes('geometry'),
    spatial.success ? `tableSchemas: ${JSON.stringify(spatial.tableSchemas)}` : spatial.error);

  // --- data.query on a DuckDB-only table ---
  // A table that exists in DuckDB but is NOT a kepler map dataset must not
  // produce a misleading "Dataset not found" — the model should be told it's a
  // DuckDB table and how to use it.
  const duckdbOnly = await page.evaluate(async () => {
    const store = window.__keplerRoomStore;
    const invoke = (id, input) => store.getState().commands.invokeCommand(id, input);
    const conn = await store.getState().db.getConnector();
    await conn.query(
      'CREATE OR REPLACE TABLE test_duckdb_only AS SELECT * FROM (VALUES (1, 10.5), (2, 20.1)) AS t(id, value)'
    );
    // Deliberately NOT loaded to the map.
    const r = await invoke('data.query', {
      datasetName: 'test_duckdb_only',
      variableNames: ['id', 'value'],
      sql: 'SELECT * FROM __TABLE__',
      resultDatasetName: 'duckdb_only_result'
    });
    return {success: r.success, error: r.error};
  });
  check('data.query on a DuckDB-only table gives a helpful hint',
    !duckdbOnly.success && /is a DuckDB table, not a map dataset/.test(duckdbOnly.error || ''),
    duckdbOnly.error);

  // =====================================================================
  // MCP contract checks (P1.6) — pins the registry as an exportable contract
  // =====================================================================
  // 1. Schema export (pins P1.1): every registered command exposes a valid
  //    inputSchema (JSON Schema) via listCommands({includeInputSchema:true}).
  // 2. Policy metadata (pins P1.3): every command carries non-default policy
  //    metadata (riskLevel / requiresConfirmation / readOnly).
  // 3. Output shape (pins P1.2): no renderer-only field (histogramData,
  //    barDataIndexes, source, meanPoint) appears at the top level of a tool
  //    result — renderer payloads live under `__ui` and must not leak to MCP.
  const contractChecks = await page.evaluate(async ({bartUrl}) => {
    const store = window.__keplerRoomStore;
    const invoke = (id, input) => store.getState().commands.invokeCommand(id, input);
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const out = {schemaErrors: [], policyErrors: [], outputLeaks: []};

    // (1) Schema export
    try {
      const descs = store.getState().commands.listCommands({includeInputSchema: true});
      for (const d of descs) {
        if (!d.inputSchema || !d.inputSchema.type || !d.inputSchema.properties) {
          out.schemaErrors.push(`${d.id}: missing/invalid JSON Schema`);
        }
      }
    } catch (e) {
      out.schemaErrors.push(`listCommands threw: ${e && e.message ? e.message : e}`);
    }

    // (2) Policy metadata (non-default)
    try {
      const descs = store.getState().commands.listCommands();
      const DEFAULT_RISK = 'low';
      for (const d of descs) {
        if (d.riskLevel === DEFAULT_RISK && !d.requiresConfirmation && d.readOnly === false) {
          out.policyErrors.push(`${d.id}: default policy metadata (riskLevel=${d.riskLevel})`);
        }
        // map.load-data and map.save-data must require confirmation (security)
        if ((d.id === 'map.load-data' || d.id === 'map.save-data') && !d.requiresConfirmation) {
          out.policyErrors.push(`${d.id}: must require confirmation`);
        }
      }
    } catch (e) {
      out.policyErrors.push(`listCommands threw: ${e && e.message ? e.message : e}`);
    }

    // (3) Output shape — chart.histogram result must not leak renderer fields
    const load = await invoke('map.load-data', {url: bartUrl});
    if (load.success) await sleep(3000);
    const dsCtx = (await invoke('map.get-dataset-context', {})).data;
    const ds = dsCtx?.datasets?.[0];
    const datasetName = ds?.datasetName;
    // ds.fields is an array of {fieldName: type}; pick the first numeric field
    const numericFieldEntry = (ds?.fields || []).find(f => {
      const type = String(Object.values(f || {})[0] || '');
      return /real|integer|float|int|bigint/i.test(type);
    });
    const numericField = numericFieldEntry ? Object.keys(numericFieldEntry)[0] : 'zipcode';
    const hist = await invoke('chart.histogram', {
      datasetName,
      variableName: numericField || 'zipcode'
    });
    const data = hist.data;
    if (data) {
      const leaked = ['histogramData', 'barDataIndexes', 'source', 'meanPoint'].filter(
        k => k in data
      );
      if (leaked.length) out.outputLeaks.push(`chart.histogram leaked: ${leaked.join(', ')}`);
      if (!data.__ui || !data.__ui.histogramData) {
        out.outputLeaks.push('chart.histogram __ui.histogramData missing');
      }
    } else {
      out.outputLeaks.push(`chart.histogram returned no data (${hist.error || 'no error'})`);
    }
    return out;
  }, {bartUrl: BART_URL});

  check('MCP: every command exports valid JSON Schema (P1.1)',
    contractChecks.schemaErrors.length === 0, contractChecks.schemaErrors.join('; '));
  check('MCP: every command carries non-default policy metadata (P1.3)',
    contractChecks.policyErrors.length === 0, contractChecks.policyErrors.join('; '));
  check('MCP: no renderer-only field leaks in tool results (P1.2)',
    contractChecks.outputLeaks.length === 0, contractChecks.outputLeaks.join('; '));

  // =====================================================================
  // Lab Chapter 1 — Spatial Data Wrangling (1): Basic Operations
  // =====================================================================
  const ch1 = await runChapter(page, async ({usStatesUrl, bartUrl, citiesUrl}) => {
    const store = window.__keplerRoomStore;
    const invoke = (id, input) => store.getState().commands.invokeCommand(id, input);
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const out = {};

    // Load polygon, point, and tabular datasets.
    const r1 = await invoke('map.load-data', {url: usStatesUrl});
    out.loadStates = r1.success;
    await sleep(2500);
    const r2 = await invoke('map.load-data', {url: bartUrl});
    out.loadBart = r2.success;
    await sleep(2500);
    const r3 = await invoke('map.load-data', {url: citiesUrl});
    out.loadCities = r3.success;
    await sleep(2500);

    // Add layers (polygon, point, point-from-CSV-coords).
    const r4 = await invoke('map.add-layer', {
      datasetName: 'us-states.json', layerType: 'geojson', layerName: 'US states'
    });
    out.addStatesLayer = r4.success;
    await sleep(1500);
    const r5 = await invoke('map.add-layer', {
      datasetName: 'bart.geo.json', layerType: 'point', layerName: 'BART stations'
    });
    out.addBartLayer = r5.success;
    await sleep(1500);
    const r6 = await invoke('map.add-layer', {
      datasetName: 'cities15000.csv', layerType: 'point',
      latitudeColumn: 'latitude', longitudeColumn: 'longitude', layerName: 'World cities'
    });
    out.addCitiesLayer = r6.success;
    await sleep(1500);

    // Grid layer over the states' bounding box.
    const r7 = await invoke('geo.grid', {
      datasetName: 'us-states.json', rows: 20, columns: 20, outputDatasetName: 'us_grid'
    });
    out.grid = {success: r7.success, details: r7.data?.details, error: r7.error};
    await sleep(1500);

    // Grid cells must use `col` (not the DuckDB-reserved `column`). The grid
    // command saves under the canonical `datasetNameToTableName` name
    // (`tbl_us_grid`).
    const gridColsResult = await (await store.getState().db.getConnector()).query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'tbl_us_grid'"
    );
    out.gridCols = gridColsResult.toArray().map(r => String(r.toJSON().column_name));

    // Variable standardization (Z-score).
    const r8 = await invoke('geoda.analysis', {
      analysis: 'standardize', datasetName: 'us-states.json',
      variableName: 'density', method: 'standardize', outputDatasetName: 'density_z'
    });
    out.standardize = {success: r8.success, output: r8.data?.outputDatasetName, count: r8.data?.count, error: r8.error};
    await sleep(1500);

    // Create a derived table (calculator-style new variable).
    const r9 = await invoke('data.create-table', {
      datasetName: 'us-states.json',
      variableNames: ['name', 'density'],
      sql: 'SELECT name, density, density * 2 AS density_double FROM __TABLE__',
      resultDatasetName: 'states_derived'
    });
    out.createTable = r9.success;
    await sleep(1500);

    // Load the derived table onto the map.
    const r10 = await invoke('data.load-to-map', {datasetName: 'states_derived'});
    out.loadToMap = r10.success;
    await sleep(2000);

    // Merge the derived table into the original (horizontal join on name).
    const r11 = await invoke('data.merge-tables', {
      datasetNameA: 'us-states.json',
      datasetNameB: 'states_derived',
      sql: 'SELECT A.name, A.density, B.density_double FROM __TABLE_A__ A JOIN __TABLE_B__ B USING (name)'
    });
    out.merge = {success: r11.success, result: r11.data?.resultDatasetName, error: r11.error};
    await sleep(1500);

    // Dataset context for layer-count assertions.
    const ctx = await invoke('map.get-dataset-context', {});
    out.datasets = (ctx.data?.datasets || []).map(d => ({
      name: d.datasetName, layers: d.layers?.length
    }));
    return out;
  }, {usStatesUrl: US_STATES_URL, bartUrl: BART_URL, citiesUrl: CITIES_URL});

  if (!ch1.ok) {
    check('Ch1: load polygon / point / CSV datasets', false, `evaluate failed: ${ch1.error}`);
    check('Ch1: add polygon / point / point-from-CSV layers', false, `evaluate failed: ${ch1.error}`);
    check('Ch1: point layer created from CSV coordinates', false, `evaluate failed: ${ch1.error}`);
    check('Ch1: geo.grid creates a 20x20 grid', false, `evaluate failed: ${ch1.error}`);
    check('Ch1: geoda.analysis standardize creates a new variable', false, `evaluate failed: ${ch1.error}`);
    check('Ch1: data.create-table + data.load-to-map', false, `evaluate failed: ${ch1.error}`);
    check('Ch1: data.merge-tables joins two tables', false, `evaluate failed: ${ch1.error}`);
  } else {
    const c1 = ch1.value;
    check('Ch1: load polygon / point / CSV datasets', c1.loadStates && c1.loadBart && c1.loadCities,
      `states:${c1.loadStates} bart:${c1.loadBart} cities:${c1.loadCities}`);
    check('Ch1: add polygon / point / point-from-CSV layers', c1.addStatesLayer && c1.addBartLayer && c1.addCitiesLayer,
      `states:${c1.addStatesLayer} bart:${c1.addBartLayer} cities:${c1.addCitiesLayer}`);
    const citiesDs = c1.datasets?.find(d => d.name === 'cities15000.csv');
    check('Ch1: point layer created from CSV coordinates', citiesDs?.layers === 1,
      citiesDs ? `cities15000.csv layers: ${citiesDs.layers}` : 'cities15000.csv not found');
    check('Ch1: geo.grid creates a 20x20 grid', c1.grid.success && /400 cells/.test(c1.grid.details || ''),
      c1.grid.details || c1.grid.error);
    check('Ch1: geo.grid uses col (not reserved column)',
      Array.isArray(c1.gridCols) && c1.gridCols.includes('col') && !c1.gridCols.includes('column'),
      c1.gridCols ? `grid columns: ${c1.gridCols.join(', ')}` : 'grid table not found');
    check('Ch1: geoda.analysis standardize creates a new variable', c1.standardize.success && c1.standardize.count === 52,
      c1.standardize.success ? `output: ${c1.standardize.output}, count: ${c1.standardize.count}` : c1.standardize.error);
    check('Ch1: data.create-table + data.load-to-map', c1.createTable && c1.loadToMap,
      `create:${c1.createTable} loadToMap:${c1.loadToMap}`);
    check('Ch1: data.merge-tables joins two tables', c1.merge.success,
      c1.merge.success ? `result: ${c1.merge.result}` : c1.merge.error);
  }

  // =====================================================================
  // Lab Chapter 2 — Spatial Data Wrangling (2): GIS Operations
  // =====================================================================
  // Fresh page: Ch1 left a 25k-row cities dataset + grid + derived tables on
  // the old page; loading time_zones on top of that OOM'd the renderer.
  await page.close();
  page = await newPage(browser);
  const ch2 = await runChapter(page, async ({timeZonesUrl, usStatesUrl, bartUrl}) => {
    const store = window.__keplerRoomStore;
    const invoke = (id, input) => store.getState().commands.invokeCommand(id, input);
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const out = {};

    // Ch2 needs the polygon + point datasets from Ch1, so reload them here.
    // Spatial ops (geo.spatial-query / geoda.analysis) materialize a dataset's
    // geometries from its layer, so each dataset needs a layer added.
    const rLoadStates = await invoke('map.load-data', {url: usStatesUrl});
    out.loadStates = rLoadStates.success;
    await sleep(2000);
    const rAddStatesLayer = await invoke('map.add-layer', {
      datasetName: 'us-states.json', layerType: 'geojson', layerName: 'US states'
    });
    out.addStatesLayer = rAddStatesLayer.success;
    await sleep(1500);
    const rLoadBart = await invoke('map.load-data', {url: bartUrl});
    out.loadBart = rLoadBart.success;
    await sleep(2000);
    const rAddBartLayer = await invoke('map.add-layer', {
      datasetName: 'bart.geo.json', layerType: 'point', layerName: 'BART stations'
    });
    out.addBartLayer = rAddBartLayer.success;
    await sleep(1500);

    // Load a second polygon layer (time zones) for dissolve.
    const r0 = await invoke('map.load-data', {url: timeZonesUrl});
    out.loadTimeZones = r0.success;
    await sleep(2500);
    const r0b = await invoke('map.add-layer', {
      datasetName: 'time_zones.geojson', layerType: 'geojson', layerName: 'Time zones'
    });
    out.addTimeZonesLayer = r0b.success;
    await sleep(1500);

    // Centroids of the US states (polygon → point).
    const r1 = await invoke('geo.spatial-query', {
      datasetNames: ['us-states.json'],
      outputDatasetName: 'us_centroids',
      sqlQuery:
        'SELECT ST_AsGeoJSON(ST_Centroid(ST_GeomFromGeoJSON(geometry))) AS geometry, name FROM __tbl0__',
      reasoning: 'Compute centroids of US states'
    });
    out.centroid = {success: r1.success, rows: r1.data?.firstFiveRows?.length, output: r1.data?.outputDatasetName, error: r1.error};
    await sleep(1500);

    // Thiessen polygons around the BART stations (points → polygons).
    const r2 = await invoke('geoda.analysis', {
      analysis: 'thiessen-polygons', datasetName: 'bart.geo.json', outputDatasetName: 'bart_thiessen'
    });
    out.thiessen = {success: r2.success, output: r2.data?.outputDatasetName, error: r2.error};
    await sleep(1500);

    // Minimum spanning tree of the BART stations.
    const r3 = await invoke('geoda.analysis', {
      analysis: 'mst', datasetName: 'bart.geo.json', outputDatasetName: 'bart_mst'
    });
    out.mst = {success: r3.success, output: r3.data?.outputDatasetName, error: r3.error};
    await sleep(1500);

    // Dissolve time zones by UTC offset (aggregate polygons).
    const r4 = await invoke('geo.spatial-query', {
      datasetNames: ['time_zones.geojson'],
      outputDatasetName: 'tz_dissolved',
      sqlQuery:
        'SELECT ST_AsGeoJSON(ST_Union_Agg(ST_GeomFromGeoJSON(geometry))) AS geometry, utc_name FROM __tbl0__ GROUP BY utc_name',
      reasoning: 'Dissolve time zones by UTC offset'
    });
    out.dissolve = {success: r4.success, rows: r4.data?.firstFiveRows?.length, output: r4.data?.outputDatasetName, error: r4.error};
    await sleep(1500);

    // Spatial join: count BART stations inside each US state (point in polygon).
    const r5 = await invoke('geo.spatial-query', {
      datasetNames: ['us-states.json', 'bart.geo.json'],
      outputDatasetName: 'state_bart_count',
      sqlQuery:
        'SELECT l.name, l.geometry, (SELECT COUNT(*) FROM __tbl1__ r WHERE ST_Intersects(ST_GeomFromGeoJSON(l.geometry), ST_GeomFromGeoJSON(r.geometry))) AS Count FROM __tbl0__ l',
      reasoning: 'Count BART stations in each state'
    });
    out.spatialJoin = {
      success: r5.success, rows: r5.data?.firstFiveRows?.length,
      output: r5.data?.outputDatasetName, firstRows: r5.data?.firstFiveRows, error: r5.error
    };
    await sleep(1500);

    return out;
  }, {timeZonesUrl: TIME_ZONES_URL, usStatesUrl: US_STATES_URL, bartUrl: BART_URL});

  if (!ch2.ok) {
    check('Ch2: load time_zones + layer', false, `evaluate failed: ${ch2.error}`);
    check('Ch2: centroids from polygons', false, `evaluate failed: ${ch2.error}`);
    check('Ch2: thiessen polygons from points', false, `evaluate failed: ${ch2.error}`);
    check('Ch2: minimum spanning tree from points', false, `evaluate failed: ${ch2.error}`);
    check('Ch2: dissolve polygons by attribute', false, `evaluate failed: ${ch2.error}`);
    check('Ch2: spatial join counts points in polygons', false, `evaluate failed: ${ch2.error}`);
  } else {
    const c2 = ch2.value;
    check('Ch2: load time_zones + layer', c2.loadTimeZones && c2.addTimeZonesLayer,
      `load:${c2.loadTimeZones} layer:${c2.addTimeZonesLayer}`);
    check('Ch2: centroids from polygons', c2.centroid.success && c2.centroid.rows === 5,
      c2.centroid.success ? `output: ${c2.centroid.output}` : c2.centroid.error);
    check('Ch2: thiessen polygons from points', c2.thiessen.success,
      c2.thiessen.success ? `output: ${c2.thiessen.output}` : c2.thiessen.error);
    check('Ch2: minimum spanning tree from points', c2.mst.success,
      c2.mst.success ? `output: ${c2.mst.output}` : c2.mst.error);
    check('Ch2: dissolve polygons by attribute', c2.dissolve.success && c2.dissolve.rows > 0,
      c2.dissolve.success ? `output: ${c2.dissolve.output}, rows: ${c2.dissolve.rows}` : c2.dissolve.error);
    const joinHasCount = (c2.spatialJoin.firstRows || []).some(r => r.Count > 0);
    check('Ch2: spatial join counts points in polygons', c2.spatialJoin.success && joinHasCount,
      c2.spatialJoin.success
        ? `output: ${c2.spatialJoin.output}, sample: ${JSON.stringify(c2.spatialJoin.firstRows?.slice(0, 2))}`
        : c2.spatialJoin.error);
  }

  // =====================================================================
  // Lab Chapter 3 — Basic Mapping
  // =====================================================================
  await page.close();
  page = await newPage(browser);
  const ch3 = await runChapter(page, async ({usStatesUrl}) => {
    const store = window.__keplerRoomStore;
    const invoke = (id, input) => store.getState().commands.invokeCommand(id, input);
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const out = {};

    // Ch3 needs the us-states polygon dataset.
    const rLoad = await invoke('map.load-data', {url: usStatesUrl});
    out.loadStates = rLoad.success;
    await sleep(2000);

    // All six classification methods used by thematic maps.
    const methods = [
      {method: 'quantile', k: 4},
      {method: 'natural breaks', k: 4},
      {method: 'equal interval', k: 4},
      {method: 'percentile'},
      {method: 'box'},
      {method: 'standard deviation'}
    ];
    out.classify = {};
    for (const m of methods) {
      const r = await invoke('geoda.analysis', {
        analysis: 'classify', datasetName: 'us-states.json',
        variableName: 'density', method: m.method, ...(m.k ? {k: m.k} : {})
      });
      out.classify[m.method] = {success: r.success, breaks: r.data?.breaks?.length, error: r.error};
      await sleep(800);
    }

    // Add a choropleth layer with a colorMap built from quantile breaks.
    const q = await invoke('geoda.analysis', {
      analysis: 'classify', datasetName: 'us-states.json',
      variableName: 'density', method: 'quantile', k: 4
    });
    const breaks = q.data?.breaks || [];
    const palette = ['#fee5d9', '#fcae91', '#fb6a4a', '#de2d26'];
    const colorMap = breaks.map((b, i) => ({value: b, color: palette[i % palette.length]}));
    colorMap.push({value: null, color: '#de2d26'});
    const r = await invoke('map.add-layer', {
      datasetName: 'us-states.json', layerType: 'geojson', layerName: 'Density quantile',
      colorBy: 'density', colorType: 'breaks', colorMap
    });
    out.addClassifiedLayer = r.success;
    await sleep(1500);

    // Verify the layer's colorField via the redux store.
    const redux = window.__keplerReduxStore;
    const layers = redux?.getState()?.demo?.keplerGl?.map?.visState?.layers || [];
    const densityLayer = layers.find(l => l.config?.colorField?.name === 'density');
    out.colorFieldLayer = densityLayer
      ? {id: densityLayer.id, colorScale: densityLayer.config?.colorScale, colorField: densityLayer.config?.colorField?.name}
      : null;

    // Update the layer's color palette.
    if (densityLayer) {
      const r2 = await invoke('map.update-layer-color', {
        layerId: densityLayer.id, numberOfColors: 4,
        customColors: ['#ffffcc', '#a1dab4', '#41b6c4', '#225ea8']
      });
      out.updateColor = r2.success;
      await sleep(1000);
    }

    // Histogram of the variable.
    const r3 = await invoke('chart.histogram', {
      datasetName: 'us-states.json', variableName: 'density', numberOfBins: 4
    });
    out.histogram = {success: r3.success, bins: r3.data?.__ui?.histogramData?.length, total: r3.data?.totalValues, error: r3.error};
    await sleep(1000);

    return out;
  }, {usStatesUrl: US_STATES_URL});

  if (!ch3.ok) {
    check('Ch3: all 6 classification methods return breaks', false, `evaluate failed: ${ch3.error}`);
    check('Ch3: add-layer with colorMap creates a classified layer', false, `evaluate failed: ${ch3.error}`);
    check('Ch3: map.update-layer-color updates the palette', false, `evaluate failed: ${ch3.error}`);
    check('Ch3: chart.histogram returns bins', false, `evaluate failed: ${ch3.error}`);
  } else {
    const c3 = ch3.value;
    const classifyOk = Object.values(c3.classify).every(c => c.success && c.breaks > 0);
    check('Ch3: all 6 classification methods return breaks', classifyOk,
      Object.entries(c3.classify).map(([m, c]) => `${m}:${c.success ? c.breaks : c.error}`).join(', '));
    check('Ch3: add-layer with colorMap creates a classified layer', c3.addClassifiedLayer && !!c3.colorFieldLayer,
      c3.colorFieldLayer ? `layer ${c3.colorFieldLayer.id} colorScale=${c3.colorFieldLayer.colorScale} colorField=${c3.colorFieldLayer.colorField}` : 'no layer with colorField=density');
    check('Ch3: map.update-layer-color updates the palette', c3.updateColor === true,
      c3.updateColor === true ? 'color updated' : 'no classified layer to update');
    check('Ch3: chart.histogram returns bins', c3.histogram.success && c3.histogram.bins === 4,
      c3.histogram.success ? `bins: ${c3.histogram.bins}, total: ${c3.histogram.total}` : c3.histogram.error);
  }

  // =====================================================================
  // Lab Chapter 4 — Rate Mapping
  // =====================================================================
  await page.close();
  page = await newPage(browser);
  const ch4 = await runChapter(page, async ({usStatesUrl}) => {
    const store = window.__keplerRoomStore;
    const invoke = (id, input) => store.getState().commands.invokeCommand(id, input);
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const out = {};

    // Ch4 needs the us-states polygon dataset.
    const rLoad = await invoke('map.load-data', {url: usStatesUrl});
    out.loadStates = rLoad.success;
    await sleep(2000);

    // Build an event/base table (counts + population at risk) from us-states.
    const r1 = await invoke('data.create-table', {
      datasetName: 'us-states.json',
      variableNames: ['name', 'density'],
      sql: 'SELECT name, density AS base, CAST(density * 0.1 + 0.05 AS DOUBLE) AS event FROM __TABLE__',
      resultDatasetName: 'rate_input'
    });
    out.createRateTable = r1.success;
    await sleep(1500);
    const r2 = await invoke('data.load-to-map', {datasetName: 'rate_input'});
    out.loadRateTable = r2.success;
    out.loadRateTableError = r2.error;
    await sleep(2000);

    // Raw/excess-risk rate.
    const r3 = await invoke('geoda.analysis', {
      analysis: 'rate', datasetName: 'rate_input',
      eventVariable: 'event', baseVariable: 'base', method: 'excessRisk',
      outputDatasetName: 'rate_excess'
    });
    out.excessRisk = {success: r3.success, output: r3.data?.outputDatasetName, variable: r3.data?.outputVariableName, count: r3.data?.count, error: r3.error};
    await sleep(1500);

    // Empirical Bayes smoothed rate.
    const r4 = await invoke('geoda.analysis', {
      analysis: 'rate', datasetName: 'rate_input',
      eventVariable: 'event', baseVariable: 'base', method: 'empiricalBayes',
      outputDatasetName: 'rate_eb'
    });
    out.empiricalBayes = {success: r4.success, output: r4.data?.outputDatasetName, variable: r4.data?.outputVariableName, count: r4.data?.count, error: r4.error};
    await sleep(1500);

    // Verify the rate values landed in DuckDB and are finite/sensible.
    // Cast to DOUBLE in SQL so the DECIMAL rate column comes back as a plain
    // number (row.toJSON() would return an opaque Arrow BigNum object).
    const conn = await store.getState().db.getConnector();
    try {
      const res = await conn.query(
        'SELECT CAST(event_excessRisk_rate AS DOUBLE) AS v FROM "tbl_rate_excess"'
      );
      const vals = res.toArray().map(r => Number(r.toJSON().v));
      out.rateValues = {
        rows: vals.length,
        allFinite: vals.every(Number.isFinite),
        min: vals.length ? Math.min(...vals) : null,
        max: vals.length ? Math.max(...vals) : null
      };
    } catch (e) {
      out.rateValues = {error: String(e)};
    }

    return out;
  }, {usStatesUrl: US_STATES_URL});

  if (!ch4.ok) {
    check('Ch4: create event/base table + load to map', false, `evaluate failed: ${ch4.error}`);
    check('Ch4: geoda.analysis rate (excessRisk)', false, `evaluate failed: ${ch4.error}`);
    check('Ch4: geoda.analysis rate (empiricalBayes)', false, `evaluate failed: ${ch4.error}`);
    check('Ch4: rate values are finite and near 1.0 (SMR)', false, `evaluate failed: ${ch4.error}`);
  } else {
    const c4 = ch4.value;
    check('Ch4: create event/base table + load to map', c4.createRateTable && c4.loadRateTable,
      `create:${c4.createRateTable} load:${c4.loadRateTable}${c4.loadRateTableError ? ` error: ${c4.loadRateTableError}` : ''}`);
    check('Ch4: geoda.analysis rate (excessRisk)', c4.excessRisk.success && c4.excessRisk.count === 52,
      c4.excessRisk.success ? `output: ${c4.excessRisk.output}, var: ${c4.excessRisk.variable}` : c4.excessRisk.error);
    check('Ch4: geoda.analysis rate (empiricalBayes)', c4.empiricalBayes.success && c4.empiricalBayes.count === 52,
      c4.empiricalBayes.success ? `output: ${c4.empiricalBayes.output}, var: ${c4.empiricalBayes.variable}` : c4.empiricalBayes.error);
    check('Ch4: rate values are finite and near 1.0 (SMR)', c4.rateValues?.allFinite && c4.rateValues?.rows === 52,
      c4.rateValues?.error || `rows: ${c4.rateValues?.rows}, min: ${c4.rateValues?.min?.toFixed(3)}, max: ${c4.rateValues?.max?.toFixed(3)}`);
  }

  // =====================================================================
  // End-to-end checks (require Ollama)
  // =====================================================================
  if (SKIP_E2E) {
    skip('E2E prompt round-trip', 'SKIP_E2E=1');
    skip('E2E load-data + layer via prompt', 'SKIP_E2E=1');
    skip('E2E classify via prompt', 'SKIP_E2E=1');
    skip('E2E Ch1: load polygon + layer via prompt', 'SKIP_E2E=1');
    skip('E2E Ch3: quantile map via prompt', 'SKIP_E2E=1');
    skip('E2E Ch4: rate + box map via prompt', 'SKIP_E2E=1');
    skip('E2E Ch2: centroids via prompt', 'SKIP_E2E=1');
  } else if (!ollamaUp) {
    skip('E2E prompt round-trip', 'Ollama not reachable');
    skip('E2E load-data + layer via prompt', 'Ollama not reachable');
    skip('E2E classify via prompt', 'Ollama not reachable');
    skip('E2E Ch1: load polygon + layer via prompt', 'Ollama not reachable');
    skip('E2E Ch3: quantile map via prompt', 'Ollama not reachable');
    skip('E2E Ch4: rate + box map via prompt', 'Ollama not reachable');
    skip('E2E Ch2: centroids via prompt', 'Ollama not reachable');
  } else {
    // Reload the page so the E2E prompts start from an EMPTY map — the
    // command-layer checks above loaded datasets/layers that would otherwise
    // pollute the E2E assertions. The evaluateOnNewDocument injection and the
    // Ollama session config survive the reload.
    await page.reload({waitUntil: 'networkidle2', timeout: 60000});
    await sleep(4000);
    await openAssistantPanel(page);

    // --- Simple round-trip ---
    await page.type('textarea', 'Reply with exactly the word OK and nothing else.');
    await sleep(500);
    await page.keyboard.press('Enter');
    await sleep(30000);
    const roundTrip = await page.evaluate(() => {
      const store = window.__keplerRoomStore;
      const session = store.getState().ai.getCurrentSession();
      const msgs = session?.uiMessages || [];
      const last = msgs[msgs.length - 1];
      const text = (last?.parts || [])
        .filter(p => p.type === 'text')
        .map(p => p.text)
        .join(' ');
      return {count: msgs.length, lastRole: last?.role, lastText: text};
    });
    check('E2E: assistant replies to a prompt', roundTrip.count >= 2 && roundTrip.lastRole === 'assistant',
      roundTrip.lastText?.slice(0, 80) || `messages: ${roundTrip.count}`);

    // --- Load data + layer via prompt ---
    await page.type('textarea', `Load the data from ${BART_URL} and show it on the map as a point layer.`);
    await sleep(500);
    await page.keyboard.press('Enter');
    await sleep(60000);
    const e2eLoad = await page.evaluate(() => {
      const store = window.__keplerRoomStore;
      const invoke = (id, input) => store.getState().commands.invokeCommand(id, input);
      return invoke('map.get-dataset-context', {}).then(r => {
        const datasets = r.data?.datasets || [];
        return {
          datasets: datasets.length,
          // Each dataset must have exactly one layer — the no-duplicate-layer
          // guarantee. (The command-layer checks above may have already loaded
          // bart.geo.json, so the total count can exceed 1; what matters is
          // that no dataset got a duplicate auto-created layer.)
          layersPerDataset: datasets.map(d => d.layers?.length)
        };
      });
    });
    check(
      'E2E: prompt loads data and creates a layer',
      e2eLoad.datasets >= 1 && e2eLoad.layersPerDataset.every(n => n === 1),
      `datasets: ${e2eLoad.datasets}, layers per dataset: [${e2eLoad.layersPerDataset.join(', ')}]`
    );

    // --- Classify via prompt (self-contained: the assistant must create the
    // data first, then run geoda.analysis classify) ---
    await page.type(
      'textarea',
      'Create a table with a column named value containing the numbers 10.5, 20.1, 30.7, 40.2, 50.9, 60.3, 70.8, 80.4, 90.1, 100.0, then classify the value column into 3 quantile bins.'
    );
    await sleep(500);
    await page.keyboard.press('Enter');
    await sleep(60000);
    const e2eClassify = await page.evaluate(() => {
      const store = window.__keplerRoomStore;
      const session = store.getState().ai.getCurrentSession();
      const msgs = session?.uiMessages || [];
      const last = msgs[msgs.length - 1];
      const text = (last?.parts || [])
        .filter(p => p.type === 'text')
        .map(p => p.text)
        .join(' ');
      return {lastText: text.slice(0, 300)};
    });
    check('E2E: prompt runs a classification', e2eClassify.lastText.length > 0,
      e2eClassify.lastText.slice(0, 120));

    // =====================================================================
    // Lab-chapter E2E checks — reload for a clean map, then one prompt per
    // chapter. Each prompt is self-contained (loads the dataset if needed).
    // =====================================================================
    await page.reload({waitUntil: 'networkidle2', timeout: 60000});
    await sleep(4000);
    await openAssistantPanel(page);

    // --- Ch1: load a polygon dataset + layer via prompt ---
    const e2eCh1 = await runE2EChapter(
      page,
      `Load the data from ${US_STATES_URL} and show it on the map as a polygon layer.`,
      90000,
      async p => {
        const r = await p.evaluate(() => {
          const store = window.__keplerRoomStore;
          const invoke = (id, input) => store.getState().commands.invokeCommand(id, input);
          return invoke('map.get-dataset-context', {}).then(r => {
            const datasets = r.data?.datasets || [];
            const states = datasets.filter(d => d.datasetName.includes('us-states'));
            return {
              statesDatasets: states.length,
              statesLayers: states.map(d => d.layers?.length)
            };
          });
        });
        return {
          pass: r.statesDatasets >= 1 && r.statesLayers.every(n => n === 1),
          detail: `us-states datasets: ${r.statesDatasets}, layers: [${r.statesLayers.join(', ')}]`
        };
      }
    );
    check('E2E Ch1: prompt loads polygon data + layer', e2eCh1.pass, e2eCh1.detail);

    // --- Ch3: quantile map via prompt ---
    const e2eCh3 = await runE2EChapter(
      page,
      `Load the data from ${US_STATES_URL} and show it on the map, then create a quantile map for the variable 'density' with 4 categories.`,
      120000,
      async p => {
        const r = await p.evaluate(() => {
          const redux = window.__keplerReduxStore;
          const layers = redux?.getState()?.demo?.keplerGl?.map?.visState?.layers || [];
          const classified = layers.filter(l => l.config?.colorField?.name === 'density');
          return {
            classifiedLayers: classified.length,
            colorScales: classified.map(l => l.config?.colorScale)
          };
        });
        return {
          pass: r.classifiedLayers >= 1,
          detail: r.classifiedLayers
            ? `layers: ${r.classifiedLayers}, scales: [${r.colorScales.join(', ')}]`
            : 'no layer with colorField=density'
        };
      }
    );
    check('E2E Ch3: prompt creates a quantile map (colorField=density)', e2eCh3.pass, e2eCh3.detail);

    // --- Ch4: rate mapping via prompt ---
    const e2eCh4 = await runE2EChapter(
      page,
      `Load the data from ${US_STATES_URL}, then create a new table from the us states dataset with columns name, base (equal to density), and event (equal to density * 0.1), then calculate the raw rates using event variable event and base variable base.`,
      150000,
      async p => {
        const r = await p.evaluate(() => {
          const store = window.__keplerRoomStore;
          const session = store.getState().ai.getCurrentSession();
          const msgs = session?.uiMessages || [];
          const last = msgs[msgs.length - 1];
          const text = (last?.parts || [])
            .filter(part => part.type === 'text')
            .map(part => part.text)
            .join(' ');
          // The rate command saves a `*_rate` column to a DuckDB table; verify
          // one exists (the event/base input table has no 'rate' column, so this
          // can't be a false positive from the input).
          return store.getState().db.getConnector().then(conn =>
            conn
              .query(
                "SELECT table_name, column_name FROM information_schema.columns WHERE column_name ILIKE '%rate%' AND table_schema = 'main'"
              )
              .then(res => {
                const cols = res.toArray().map(row => (typeof row.toJSON === 'function' ? row.toJSON() : row));
                return {
                  rateCols: cols.map(c => `${c.table_name}.${c.column_name}`),
                  lastText: text.slice(0, 500)
                };
              })
          );
        });
        return {
          pass: r.rateCols.length > 0,
          detail: r.rateCols.length
            ? `rate columns: [${r.rateCols.join(', ')}]`
            : r.lastText?.slice(0, 150) || 'no rate column'
        };
      }
    );
    check('E2E Ch4: prompt computes rates and maps them', e2eCh4.pass, e2eCh4.detail);

    // --- Ch2: centroids via prompt ---
    const e2eCh2 = await runE2EChapter(
      page,
      `Load the data from ${US_STATES_URL} and show it on the map, then get the centroids from the us states dataset.`,
      120000,
      async p => {
        const r = await p.evaluate(() => {
          const store = window.__keplerRoomStore;
          const session = store.getState().ai.getCurrentSession();
          const msgs = session?.uiMessages || [];
          const last = msgs[msgs.length - 1];
          const text = (last?.parts || [])
            .filter(part => part.type === 'text')
            .map(part => part.text)
            .join(' ');
          // The centroid output is saved to DuckDB (not auto-loaded to the map),
          // so verify a centroid table exists there.
          return store.getState().db.getConnector().then(conn =>
            conn
              .query("SELECT table_name FROM information_schema.tables WHERE table_name ILIKE '%centroid%'")
              .then(res => {
                const tables = res.toArray().map(row => (typeof row.toJSON === 'function' ? row.toJSON() : row));
                return {tables: tables.map(t => t.table_name), lastText: text.slice(0, 300)};
              })
          );
        });
        return {
          pass: r.tables.length > 0,
          detail: r.tables.length
            ? `tables: [${r.tables.join(', ')}]`
            : r.lastText?.slice(0, 120) || 'no centroid table'
        };
      }
    );
    check('E2E Ch2: prompt computes centroids (DuckDB table created)', e2eCh2.pass, e2eCh2.detail);
  }

  await browser.close();

  // --- Summary ---
  const failed = results.filter(r => r.pass === false);
  const passed = results.filter(r => r.pass === true);
  const skipped = results.filter(r => r.pass === null);
  console.log('\n' + '='.repeat(60));
  console.log(`Summary: ${passed.length} passed, ${failed.length} failed, ${skipped.length} skipped`);
  if (failed.length) {
    console.log('Failed checks:');
    for (const f of failed) console.log(`  - ${f.name}${f.detail ? ` (${f.detail})` : ''}`);
    process.exit(1);
  }
  process.exit(0);
}

main().catch(err => {
  console.error('Harness crashed:', err);
  process.exit(1);
});

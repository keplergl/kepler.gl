import puppeteer from 'puppeteer';

const CITIES_URL =
  'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/cities15000.csv';

const sleep = ms => new Promise(r => setTimeout(r, ms));
const results = [];
function check(name, pass, detail = '') {
  results.push({name, pass, detail});
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
}

const browser = await puppeteer.launch({
  headless: 'new',
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1600,1000']
});
const page = await browser.newPage();
await page.setViewport({width: 1600, height: 1000});
await page.goto('http://localhost:8080/', {waitUntil: 'networkidle2', timeout: 90000});
await sleep(6000);
// Close the auto-opened Add-Data modal and open the AI panel so the redux store
// bridge is wired (`window.__keplerReduxStore`).
await page.evaluate(() => {
  const close = document.querySelector(
    '.ReactModal__Content .modal--close, .ReactModal__Content [class*="close"]'
  );
  if (close) close.click();
});
await sleep(800);
await page.evaluate(() => document.querySelector('.toggle-ai-assistant')?.click());
await sleep(2500);

const storeReady = await page.evaluate(() => Boolean(window.__keplerRoomStore));
check('store exposed', storeReady);

const out = await page.evaluate(async ({citiesUrl}) => {
  const store = window.__keplerRoomStore;
  const invoke = (id, input) => store.getState().commands.invokeCommand(id, input);
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const r = {};

  // Load a CSV, add a point layer on `population`-bearing coords.
  const load = await invoke('map.load-data', {url: citiesUrl});
  r.load = load.success;
  await sleep(3000);

  const addLayer = await invoke('map.add-layer', {
    datasetName: 'cities15000.csv', layerType: 'point',
    latitudeColumn: 'latitude', longitudeColumn: 'longitude', layerName: 'World cities'
  });
  r.addLayer = addLayer.success;
  await sleep(1500);

  // Snapshot dataset id + fields before the copy.
  const before = await invoke('map.get-dataset-context', {});
  const dsBefore = (before.data?.datasets || []).find(d => d.datasetName === 'cities15000.csv');
  r.idBefore = dsBefore?.datasetId;
  r.fieldsBefore = (dsBefore?.fields || []).map(f => Object.keys(f)[0]);

  // 1. Happy path: copy an existing column to a new name.
  const copy = await invoke('map.add-column', {
    datasetName: 'cities15000.csv',
    newColumnName: 'population_copy',
    copyFromColumn: 'population'
  });
  r.copy = copy;
  await sleep(1500);

  // 2. Error: copy from a nonexistent column.
  const badSrc = await invoke('map.add-column', {
    datasetName: 'cities15000.csv',
    newColumnName: 'nope',
    copyFromColumn: 'does_not_exist'
  });
  r.badSrc = {success: badSrc.success, error: badSrc.error};

  // 3. Error: duplicate new-column name.
  const dup = await invoke('map.add-column', {
    datasetName: 'cities15000.csv',
    newColumnName: 'population_copy',
    copyFromColumn: 'population'
  });
  r.dup = {success: dup.success, error: dup.error};

  // 5. Schema guard: both copyFromColumn AND expression together → rejected.
  const both = await invoke('map.add-column', {
    datasetName: 'cities15000.csv',
    newColumnName: 'both_probe',
    copyFromColumn: 'population',
    expression: '1 + 1'
  });
  r.both = {success: both.success, error: both.error};

  // 4. Computed expression: add a z-score of `population` in place.
  const zscore = await invoke('map.add-column', {
    datasetName: 'cities15000.csv',
    newColumnName: 'population_z',
    expression: '("population" - AVG("population") OVER()) / STDDEV("population") OVER()'
  });
  r.zscore = zscore;
  await sleep(1500);

  // Aggregate stats for the z-score (mean must be ~0, std ~1).
  const zagg = await invoke('data.query', {
    datasetName: 'cities15000.csv',
    variableNames: ['population_z'],
    sql: 'SELECT AVG("population_z") AS z_mean, STDDEV("population_z") AS z_std, COUNT(*) AS z_n FROM __TABLE__',
    resultDatasetName: 'z_probe'
  });
  r.zagg = zagg;
  r.zaggText = zagg?.data?.truncatedQueryResult;

  // Verify the dataset exists + layers survived after BOTH adds.
  const after = await invoke('map.get-dataset-context', {});
  const dsAfter = (after.data?.datasets || []).find(d => d.datasetName === 'cities15000.csv');
  r.idAfter = dsAfter?.datasetId;
  r.fieldsAfter = (dsAfter?.fields || []).map(f => Object.keys(f)[0]);
  r.layersAfter = dsAfter?.layers?.length;

  // Verify copy semantics: first 3 values of the new column equal the source.
  const probe = await invoke('data.query', {
    datasetName: 'cities15000.csv',
    variableNames: ['population', 'population_copy'],
    sql: 'SELECT "population", "population_copy" FROM __TABLE__ LIMIT 3',
    resultDatasetName: 'pop_probe'
  });
  r.probe = probe;
  r.probeText = probe?.data?.truncatedQueryResult;

  return r;
}, {citiesUrl: CITIES_URL});

check('map.load-data succeeded', out.load);
check('map.add-layer succeeded', out.addLayer);

// Copy operation itself.
check('map.add-column succeeds', out.copy?.success, out.copy?.data?.details || out.copy?.error);
check(
  'reports addedColumns',
  Array.isArray(out.copy?.data?.addedColumns) && out.copy.data.addedColumns.includes('population_copy'),
  JSON.stringify(out.copy?.data?.addedColumns)
);

// Dataset identity preserved.
check('dataset id unchanged', out.idBefore && out.idBefore === out.idAfter,
  `before:${out.idBefore} after:${out.idAfter}`);
check('layer survived the copy', out.layersAfter === 1, `layers after: ${out.layersAfter}`);
check(
  'new column present, source column still present',
  out.fieldsAfter?.includes('population_copy') && out.fieldsAfter?.includes('population'),
  `fields: ${(out.fieldsAfter || []).join(', ')}`
);

// Error cases.
check('error on nonexistent source column', out.badSrc?.success === false && /does not exist/.test(out.badSrc?.error || ''),
  out.badSrc?.error);
check('error on duplicate new-column name', out.dup?.success === false && /already exists/.test(out.dup?.error || ''),
  out.dup?.error);

// Value equality probe: parse the pipe-table string, skip header + separator.
const probeOk = out.probe?.success && typeof out.probeText === 'string' &&
  (() => {
    const rows = out.probeText.split('\n').filter(l => l.startsWith('|'));
    const dataRows = rows.filter(l => !l.includes('---'));
    // dataRows[0] is the header (column names differ); the rest must match col-to-col.
    return dataRows.length >= 2 && dataRows.slice(1).every(l => {
      const cols = l.replace(/^\||\|$/g, '').split('|').map(s => s.trim());
      return cols.length >= 2 && String(cols[0]) === String(cols[1]);
    });
  })();
check('copied values equal source values', probeOk,
  (out.probeText || '').split('\n').slice(0, 6).join('  '));

check('rejects copyFromColumn + expression together', out.both?.success === false,
  out.both?.error || 'no error');

// Computed-expression (z-score) path.
check('map.add-column expression succeeds', out.zscore?.success,
  out.zscore?.data?.details || out.zscore?.error);
check(
  'expression adds the column in place (fields include population_z)',
  out.fieldsAfter?.includes('population_z') && !out.fieldsAfter?.includes('natregimes'),
  `fields: ${(out.fieldsAfter || []).join(', ')}`
);
check('dataset id still unchanged after expression add', out.idBefore === out.idAfter,
  `before:${out.idBefore} after:${out.idAfter}`);
check('layer survived the expression add', out.layersAfter === 1, `layers after: ${out.layersAfter}`);
const zaggOk = out.zagg?.success && typeof out.zaggText === 'string';
const dataRow = (out.zaggText || '')
  .split('\n')
  .filter(l => l.startsWith('|'))
  .find(l => !l.includes('---') && !l.includes('z_mean'));
const zMean = dataRow ? Number.parseFloat((dataRow.match(/\| *(-?[\d.e+-]+) *\|/) || [])[1] || 'NaN') : NaN;
check('z-score mean is ~0', Number.isFinite(zMean) && Math.abs(zMean) < 1e-6,
  out.zaggText ? `zagg: ${out.zaggText.replace(/\s+/g, ' ').slice(0, 200)}` : 'no aggregate text');

await browser.close();

const fails = results.filter(r => r.pass === false);
console.log(`\n${results.length - fails.length}/${results.length} passed`);
if (fails.length) {
  console.log('FAILED:');
  for (const f of fails) console.log(`  - ${f.name} — ${f.detail}`);
  process.exit(1);
}

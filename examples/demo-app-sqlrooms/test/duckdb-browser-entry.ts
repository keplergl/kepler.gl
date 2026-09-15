// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {DuckDBWasmAdapter, KeplerGlDuckDbTable} from '@kepler.gl/duckdb';
import {initApplicationConfig} from '@kepler.gl/utils';
import {getConnector, setKeplerStateAccessors} from '@openassistant/kepler-assistant/integration';
import type {createDefaultAiTools} from '@sqlrooms/ai';
import type {createAssistantSkillTools} from '../src/components/assistant-tools';
import {createDemoRoomStore} from '../src/components/sqlrooms-demo-layout';
import {
  AiAssistantPanel,
  assistantPersistence,
  connectAssistantToMap
} from '../src/components/assistant';
import {RoomStateProvider} from '@sqlrooms/room-store';
import {ThemeProvider, TooltipProvider} from '@sqlrooms/ui';
import {createElement} from 'react';
import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import {createStore} from 'redux';
import {borrowSqlConnector, getSqlConnector} from '../src/components/sql-connector';
import {
  executeSql,
  disposeSqlResult,
  readFullSqlResult,
  retainSqlResult
} from '../src/components/sql-query';

function check(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export async function run() {
  check(
    !('__keplerRoomStore' in window),
    'Importing the integration entry initialized the standalone room'
  );
  const assistantStore = createDemoRoomStore();
  const connector = await getSqlConnector();
  const adapter = new DuckDBWasmAdapter(Promise.resolve(connector.getDb()));
  initApplicationConfig({database: adapter});
  const db = connector.getDb();
  const assistantConnector = await assistantStore.getState().db.getConnector();
  check(
    (assistantConnector as typeof connector).getDb() === db,
    'Assistant created a second database'
  );
  check((await getConnector()) === connector, 'Analysis tools do not use the host connector');
  await borrowSqlConnector().destroy();
  check(connector.getDb() === db, 'Panel teardown replaced the shared database');

  const result = await executeSql(
    'CREATE TABLE source AS SELECT i FROM range(2500) t(i); SELECT * FROM source'
  );
  await assistantStore.getState().db.refreshTableSchemas();
  const tools = assistantStore.getState().ai.tools as ReturnType<typeof createDefaultAiTools> &
    ReturnType<typeof createAssistantSkillTools>;
  const options = {toolCallId: 'test-query', messages: []};
  const query = await tools.query.execute!(
    {type: 'query', sqlQuery: 'SELECT * FROM source', reasoning: 'Preview source'},
    options
  );
  check(
    'success' in query && query.success && query.data?.firstRows?.length === 5,
    'Standard query did not share five preview rows'
  );
  const largeInput = {
    type: 'query' as const,
    sqlQuery: "SELECT repeat('x', 5000) AS geometry",
    reasoning: 'Preview a large value'
  };
  const largeResult = await tools.query.execute!(largeInput, options);
  check('success' in largeResult && largeResult.success, 'Large-value query failed');
  const modelPreview = await tools.query.toModelOutput!({
    toolCallId: 'test-preview',
    input: largeInput,
    output: largeResult
  });
  check(
    modelPreview.type === 'text' && modelPreview.value.length < 1200,
    'Geometry preview exceeded the model context budget'
  );
  const rejectedWrite = await tools.query.execute!(
    {type: 'query', sqlQuery: 'DROP TABLE source', reasoning: 'Test read-only query'},
    options
  );
  check(
    'success' in rejectedWrite && !rejectedWrite.success,
    'Chat query unexpectedly allowed writes'
  );
  const listed = await tools.list_tables.execute!({pattern: 'source', includeViews: true}, options);
  // The 0.29.0 JS wraps this result in llmResult; its declarations still describe the flat result.
  check('llmResult' in listed, 'Missing table discovery result');
  const tableList = listed.llmResult as {success: boolean; tables: unknown[]};
  check(
    tableList.success && tableList.tables.length === 1,
    'Assistant cannot discover map/SQL tables'
  );
  const tablesBefore = await connector.query(
    "SELECT count(*) FROM duckdb_tables() WHERE starts_with(table_name, 'tbl_')"
  );
  check(
    Number(tablesBefore.getChildAt(0)!.get(0)) === 0,
    'Plain AI query copied data into a legacy table'
  );

  const stateAccessors: Parameters<typeof setKeplerStateAccessors>[0] = {
    getVisState: () => ({datasets: {}, layers: [], layerData: [], loaders: [], loadOptions: {}}),
    getMapBoundary: () => ({nw: [-123, 38], se: [-121, 36]})
  };
  const reduxStore = createStore((state = {}) => state);
  const disconnectMap = connectAssistantToMap(assistantStore, {reduxStore, stateAccessors});
  const boundary = await tools.execute_command.execute!(
    {commandId: 'map.get-boundary', input: {}, confirmed: false},
    options
  );
  check(
    'success' in boundary && boundary.success,
    'Standard command tool cannot access Kepler viewport'
  );
  const chart = await tools.execute_command.execute!(
    {
      commandId: 'chart.histogram',
      input: {datasetName: 'source', variableName: 'i'},
      confirmed: false
    },
    options
  );
  check(
    'success' in chart && chart.success,
    `Chart command failed on the shared database: ${JSON.stringify(chart)}`
  );
  const sendPrompt = assistantStore.getState().ai.sendPrompt;
  assistantStore.setState(s => ({
    ai: {
      ...s.ai,
      sendPrompt: async () =>
        JSON.stringify({
          skills: [{id: 'charts', name: 'Charts', why: 'Draw the requested chart'}],
          nextStep: 'Use charts'
        })
    }
  }));
  const discovered = await tools.discoverSkill.execute!(
    {query: 'charts', reasoning: 'Find chart skill'},
    options
  );
  assistantStore.setState(s => ({ai: {...s.ai, sendPrompt}}));
  check(discovered.success, 'Skill discovery did not survive host composition');
  check(
    Boolean(tools.runSkill && assistantStore.getState().ai.toolRenderers.executeApi),
    'Skill execution/chart renderer missing'
  );

  // Mount/unmount the actual stock chat panel under the one host room.
  const sessionId = assistantStore
    .getState()
    .ai.createSession('Persistence test', 'openai', 'gpt-4o');
  assistantStore.getState().ai.setSessionUiMessages(sessionId, [
    {id: 'test-user', role: 'user', parts: [{type: 'text', text: 'Remember this conversation'}]},
    {
      id: 'test-assistant',
      role: 'assistant',
      parts: [
        {
          type: 'tool-execute_command',
          toolCallId: 'histogram-test',
          state: 'output-available',
          input: {commandId: 'chart.histogram'},
          output: chart
        },
        {type: 'text', text: 'Here is your histogram.'}
      ]
    }
  ]);
  assistantStore.getState().aiSettings.updateProvider('openai', {apiKey: 'test-only-key'});
  const generation = new AbortController();
  assistantStore.getState().ai.setAbortController(sessionId, generation);
  const mount = document.createElement('div');
  document.body.appendChild(mount);
  mount.style.cssText = 'width: 600px; height: 800px';
  const root = createRoot(mount);
  const panel = createElement(ThemeProvider, {
    children: createElement(TooltipProvider, {
      children: createElement(
        RoomStateProvider,
        {roomStore: assistantStore},
        createElement(AiAssistantPanel)
      )
    })
  });
  flushSync(() => root.render(panel));
  check(
    mount.textContent?.includes('Remember this conversation'),
    'Stock chat did not render the session'
  );
  for (let i = 0; i < 100 && !mount.querySelector('canvas'); i++)
    await new Promise(resolve => setTimeout(resolve, 20));
  check(
    mount.querySelector('canvas'),
    `Standard command output did not render its chart: ${mount.textContent}`
  );
  const settingsButton = mount.querySelector<HTMLButtonElement>('button[aria-label="AI Settings"]');
  check(settingsButton, 'Missing AI settings button');
  flushSync(() => settingsButton.click());
  check(
    document.querySelector('[role="dialog"]')?.textContent?.includes('AI Assistant Settings'),
    'AI settings dialog did not open in the host room'
  );
  flushSync(() => root.render(null));
  check(!generation.signal.aborted, 'Closing the panel aborted the room-owned run');
  check(
    assistantStore.getState().ai.getCurrentSession()?.id === sessionId,
    'Closing assistant lost the conversation'
  );
  check((await connector.query('SELECT 42')).numRows === 1, 'Closing assistant destroyed DuckDB');
  flushSync(() => root.render(panel));
  flushSync(() => root.unmount());
  mount.remove();
  check(
    assistantStore.getState().aiSettings.config.providers.openai.apiKey === 'test-only-key',
    'Closing assistant lost provider settings'
  );
  const persisted = JSON.parse(localStorage.getItem('kepler-ai-assistant-state')!);
  check(
    persisted.state.ai.sessions.some((s: {id: string}) => s.id === sessionId),
    'Existing persistence key was not retained'
  );
  check(
    assistantPersistence.migrate(persisted.state, 1) === persisted.state,
    'Current settings were unnecessarily migrated'
  );
  check(result && result.table.numRows === 1000, 'Preview must be bounded');
  check((await readFullSqlResult(result)).numRows === 2500, 'Export must include all rows');
  await retainSqlResult(result);
  const before = await connector.query('SELECT count(*) AS n FROM duckdb_tables()');
  const table = new KeplerGlDuckDbTable({
    info: {id: 'snapshot', label: 'snapshot', format: 'arrow'}
  });
  await table.importData({data: {fields: [], rows: [], duckdbTableName: result.tableName}});
  check(table.length === 2500, 'Map must include all rows');
  const after = await connector.query('SELECT count(*) AS n FROM duckdb_tables()');
  check(
    before.getChildAt(0)!.get(0) === after.getChildAt(0)!.get(0),
    'Map re-imported the existing table'
  );
  const originalConnect = adapter.connect.bind(adapter);
  let closedConnections = 0;
  adapter.connect = async () => {
    const connection = await originalConnect();
    const close = connection.close.bind(connection);
    connection.close = async () => {
      closedConnections++;
      await close();
    };
    return connection;
  };
  let failedImport = false;
  try {
    await table.importData({data: {fields: [], rows: [], duckdbTableName: 'missing_relation'}});
  } catch {
    failedImport = true;
  }
  check(failedImport && closedConnections === 1, 'Failed import leaked its connection');
  adapter.connect = originalConnect;
  await disposeSqlResult(result);
  check(
    (await connector.query(`SELECT * FROM "${result.tableName}" LIMIT 1`)).numRows === 1,
    'Mapped snapshot was dropped'
  );

  const spatial = await executeSql(
    "SELECT ST_Point(-122, 37) AS geom, 1700000000000::BIGINT AS t, TIMESTAMP '2025-01-01' AS time"
  );
  check(spatial, 'Missing spatial result');
  check(
    spatial.table.schema.fields[0].metadata.get('ARROW:extension:name') === 'geoarrow.wkb',
    'Lost GeoArrow metadata'
  );
  await disposeSqlResult(spatial);

  const empty = await executeSql('SELECT 1 AS n WHERE false');
  check(empty?.table.numRows === 0 && empty.table.numCols === 1, 'Empty preview lost its schema');
  check((await readFullSqlResult(empty)).numCols === 1, 'Empty export lost its header');
  await disposeSqlResult(empty);

  const controller = new AbortController();
  const cancelled = executeSql(
    'SELECT sum(a.i * b.i) FROM range(10000000) a(i), range(10000000) b(i)',
    controller.signal
  );
  setTimeout(() => controller.abort(), 100);
  let aborted = false;
  try {
    await cancelled;
  } catch {
    aborted = true;
  }
  check(aborted, 'Expensive query was not cancelled');
  check((await connector.query('SELECT 42')).numRows === 1, 'Database unusable after cancellation');
  const remaining = await connector.query(
    "SELECT count(*) FROM duckdb_tables() WHERE starts_with(table_name, '__sqlrooms_kepler_result_')"
  );
  check(Number(remaining.getChildAt(0)!.get(0)) === 0, 'Unretained snapshots leaked');
  disconnectMap();
  await assistantStore.getState().room.destroy();
  check(
    (await connector.query('SELECT 42')).numRows === 1,
    'Room teardown destroyed the page database'
  );
  return {previewRows: result.table.numRows, mapRows: table.length, version: await db.getVersion()};
}

export async function verifyRestoredAssistant() {
  const store = createDemoRoomStore();
  await store.getState().db.getConnector();
  check(
    store.getState().ai.getCurrentSession()?.name === 'Persistence test',
    'Reload lost the existing session'
  );
  check(
    store.getState().ai.getCurrentSession()?.uiMessages.length === 2,
    'Reload lost chat/tool messages'
  );
  check(
    store.getState().aiSettings.config.providers.openai.apiKey === 'test-only-key',
    'Reload lost provider settings'
  );
}

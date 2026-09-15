// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const assert = require('node:assert/strict');
const {test} = require('node:test');
const path = require('node:path');
const {buildSync} = require('esbuild');

const bundle = buildSync({
  stdin: {
    contents: `
      export {getOpenAiModel} from './src/components/assistant-model';
      export {generateText, tool, stepCountIs} from 'ai';
      export {z} from 'zod';
    `,
    resolveDir: path.resolve(__dirname, '..')
  },
  bundle: true,
  platform: 'node',
  format: 'cjs',
  write: false
});
const moduleExports = {exports: {}};
new Function('require', 'module', 'exports', bundle.outputFiles[0].text)(
  require,
  moduleExports,
  moduleExports.exports
);
const {getOpenAiModel, generateText, tool, stepCountIs, z} = moduleExports.exports;

function setup() {
  const config = {
    modelProvider: 'openai',
    model: 'gpt-5.6-sol',
    apiKey: 'test-key',
    baseURL: 'https://api.openai.com/v1'
  };
  const ai = {
    getSelectedModel: () => config,
    getApiKeyFromSettings: (provider, model) => {
      assert.equal(provider, config.modelProvider);
      assert.equal(model, config.model);
      return config.apiKey;
    },
    getBaseUrlFromSettings: () => config.baseURL
  };
  return {config, store: {getState: () => ({ai})}};
}

function response(output, id = 'resp_test') {
  return new Response(
    JSON.stringify({
      id,
      object: 'response',
      created_at: 1,
      status: 'completed',
      model: 'gpt-5.6-sol',
      output,
      usage: {input_tokens: 10, output_tokens: 5, total_tokens: 15}
    }),
    {headers: {'Content-Type': 'application/json'}}
  );
}
const message = text => ({
  type: 'message',
  id: 'msg_test',
  role: 'assistant',
  status: 'completed',
  content: [{type: 'output_text', text, annotations: []}]
});

test('OpenAI uses Responses and replays reasoning and tool results without disabling reasoning', async t => {
  const requests = [];
  t.mock.method(globalThis, 'fetch', async (url, init) => {
    requests.push({url: String(url), body: JSON.parse(init.body)});
    return requests.length === 1
      ? response([
          {type: 'reasoning', id: 'rs_test', summary: [], encrypted_content: 'opaque-reasoning'},
          {
            type: 'function_call',
            id: 'fc_test',
            call_id: 'call_test',
            name: 'countRows',
            arguments: '{}',
            status: 'completed'
          }
        ])
      : response([message('54936 earthquakes')], 'resp_final');
  });
  const {store} = setup();
  let toolCalls = 0;
  const result = await generateText({
    model: getOpenAiModel(store),
    prompt: 'Count the earthquakes',
    tools: {
      countRows: tool({
        inputSchema: z.object({}),
        execute: async () => {
          toolCalls++;
          return {count: 54936};
        }
      })
    },
    stopWhen: stepCountIs(2)
  });
  assert.equal(result.text, '54936 earthquakes');
  assert.equal(toolCalls, 1);
  assert.equal(requests.length, 2);
  for (const {url, body} of requests) {
    assert.equal(url, 'https://api.openai.com/v1/responses');
    assert.equal(body.model, 'gpt-5.6-sol');
    assert.equal(body.store, false);
    assert.notEqual(body.reasoning?.effort, 'none');
    assert.ok(body.tools.some(t => t.name === 'countRows'));
  }
  assert.ok(
    requests[1].body.input.some(
      item =>
        item.type === 'function_call_output' &&
        item.call_id === 'call_test' &&
        item.output.includes('54936')
    )
  );
  assert.ok(
    requests[1].body.input.some(
      item => item.type === 'reasoning' && item.encrypted_content === 'opaque-reasoning'
    )
  );
});

test('resolver reads current model, key, and base URL together on every request', async t => {
  const requests = [];
  t.mock.method(globalThis, 'fetch', async (url, init) => {
    requests.push({
      url: String(url),
      model: JSON.parse(init.body).model,
      authorization: new Headers(init.headers).get('authorization')
    });
    return response([message('ok')]);
  });
  const {store, config} = setup();
  await generateText({model: getOpenAiModel(store), prompt: 'hi'});
  Object.assign(config, {
    model: 'gpt-5.6-terra',
    apiKey: 'replacement-test-key',
    baseURL: 'https://openai-gateway.example/v1'
  });
  await generateText({model: getOpenAiModel(store), prompt: 'hi'});
  assert.deepEqual(requests, [
    {
      url: 'https://api.openai.com/v1/responses',
      model: 'gpt-5.6-sol',
      authorization: 'Bearer test-key'
    },
    {
      url: 'https://openai-gateway.example/v1/responses',
      model: 'gpt-5.6-terra',
      authorization: 'Bearer replacement-test-key'
    }
  ]);
});

test('missing credentials and other providers retain SQLRooms default resolution', () => {
  const {store, config} = setup();
  config.apiKey = '';
  assert.equal(getOpenAiModel(store), undefined);
  config.apiKey = 'test-key';
  for (const modelProvider of ['anthropic', 'google', 'ollama', 'custom']) {
    config.modelProvider = modelProvider;
    assert.equal(getOpenAiModel(store), undefined);
  }
});

/** @jest-environment node */

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {InMemoryTransport} from '@modelcontextprotocol/sdk/inMemory.js';
import {ToolListChangedNotificationSchema} from '@modelcontextprotocol/sdk/types.js';
import WebSocket from 'ws';
import {createStore, applyMiddleware} from 'redux';
import {keplerGlReducer} from '@kepler.gl/reducers';
import type {KeplerGlState} from '@kepler.gl/reducers';
import {taskMiddleware} from '@kepler.gl/tasks';
import {registerEntry, wrapTo} from '@kepler.gl/actions';
import {KeplerTable} from '@kepler.gl/table';
import {getKeplerCommands} from '../commands';
import type {KeplerContext} from '../commands';
import {KeplerMcpBridge} from './bridge-server';
import {createKeplerMcpServer} from './mcp-server';

describe('kepler-mcp protocol', () => {
  it('waits for a delayed project through MCP before the first successful layer lookup', async () => {
    const store = createStore(
      keplerGlReducer.initialState({mapStyle: {styleType: 'no_map'}}),
      applyMiddleware(taskMiddleware)
    );
    store.dispatch(registerEntry({id: 'map'}));
    const ctx = {
      getKeplerState: () => (store.getState() as {map: KeplerGlState}).map,
      getVisState: () => (store.getState() as {map: KeplerGlState}).map.visState,
      dispatch: action => store.dispatch(wrapTo('map', action))
    } as unknown as KeplerContext;
    const commands = getKeplerCommands(ctx);
    const bridge = new KeplerMcpBridge({port: 0});
    const started = await bridge.start();
    const server = createKeplerMcpServer(bridge, 'test-build');
    const client = new Client({name: 'readiness-client', version: '1.0'});
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        datasets: [
          {
            version: 'v1',
            data: {
              id: 'points',
              fields: [
                {name: 'lat', type: 'real'},
                {name: 'lng', type: 'real'}
              ],
              allData: [[1, 2]]
            }
          }
        ],
        config: {
          version: 'v1',
          config: {
            mapStyle: {styleType: 'no_map'},
            visState: {
              layers: [
                {
                  id: 'known-layer',
                  type: 'point',
                  config: {dataId: 'points', columns: {lat: 'lat', lng: 'lng'}}
                }
              ]
            }
          }
        }
      })
    });
    let release!: () => void;
    const gate = new Promise<void>(resolve => {
      release = resolve;
    });
    let importing!: () => void;
    const importStarted = new Promise<void>(resolve => {
      importing = resolve;
    });
    const originalImport = KeplerTable.prototype.importData;
    const importData = jest
      .spyOn(KeplerTable.prototype, 'importData')
      .mockImplementation(async function (this: KeplerTable, data) {
        importing();
        await gate;
        return originalImport.call(this, data);
      });
    let waiting!: () => void;
    const waitStarted = new Promise<void>(resolve => {
      waiting = resolve;
    });
    let page: WebSocket | undefined;
    let opening: Promise<unknown> | undefined;
    try {
      await server.connect(serverTransport);
      await client.connect(clientTransport);
      page = new WebSocket(`ws://127.0.0.1:${started.port}/ws?token=${started.token}`);
      await new Promise<void>(resolve => page!.once('open', resolve));
      page.on('message', async raw => {
        const message = JSON.parse(String(raw));
        if (message.type !== 'call') return;
        const pending = commands[message.tool].execute({} as any, message.input);
        if (message.tool === 'map.get-project-status' && message.input.waitUntilReady) waiting();
        page!.send(JSON.stringify({type: 'result', callId: message.callId, result: await pending}));
      });
      const negotiated = new Promise<void>(resolve => {
        client.setNotificationHandler(ToolListChangedNotificationSchema, () => resolve());
      });
      page.send(
        JSON.stringify({type: 'hello', commands: Object.values(commands).map(({id}) => ({id}))})
      );
      await negotiated;
      const data = (result: any) => JSON.parse(result.content[0].text);
      opening = client.callTool({
        name: 'map_open-project',
        arguments: {url: 'https://example.com/project.json'}
      });
      await importStarted;
      expect(
        data(await client.callTool({name: 'map_get-status', arguments: {}})).project.state
      ).toBe('loading');
      let ready = false;
      const status = client
        .callTool({name: 'map_get-status', arguments: {waitUntilReady: true}})
        .then(result => {
          ready = true;
          return result;
        });
      await waitStarted;
      expect(ready).toBe(false);
      release();
      expect(data(await status).project).toEqual({state: 'ready', scope: 'mcp-open-project'});
      const layer = await client.callTool({
        name: 'map_get-layer-options',
        arguments: {layerId: 'known-layer'}
      });
      expect(layer.isError).not.toBe(true);
      expect(data(layer).layerId).toBe('known-layer');
      await opening;
    } finally {
      release();
      await opening;
      page?.terminate();
      await client.close();
      await server.close();
      await bridge.close();
      importData.mockRestore();
      global.fetch = originalFetch;
    }
  });

  it('advertises catalog notifications and publishes page negotiation and disconnect changes', async () => {
    const bridge = new KeplerMcpBridge({port: 0});
    const started = await bridge.start();
    const server = createKeplerMcpServer(bridge, 'test-build');
    const client = new Client({name: 'test-client', version: '1.0'});
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    let page: WebSocket | undefined;
    const nextCatalogChange = () =>
      new Promise<void>(resolve => {
        client.setNotificationHandler(ToolListChangedNotificationSchema, () => resolve());
      });

    try {
      await server.connect(serverTransport);
      await client.connect(clientTransport);
      expect(client.getServerCapabilities()?.tools?.listChanged).toBe(true);

      const initialTools = await client.listTools();
      expect(initialTools.tools.map(tool => tool.name)).toContain('map_get-status');
      const status = await client.callTool({name: 'map_get-status', arguments: {}});
      expect(status.isError).not.toBe(true);
      expect(status.content).toEqual([
        expect.objectContaining({type: 'text', text: expect.stringContaining('disconnected')})
      ]);

      page = new WebSocket(`ws://127.0.0.1:${started.port}/ws?token=${started.token}`);
      await new Promise<void>(resolve => page!.once('open', () => resolve()));
      const negotiated = nextCatalogChange();
      page.send(
        JSON.stringify({
          type: 'hello',
          commands: [{id: 'map.test-command', name: 'Test command'}],
          app: {name: 'test-page', version: '1.0'}
        })
      );
      await negotiated;
      expect((await client.listTools()).tools.map(tool => tool.name).sort()).toEqual([
        'map_get-status',
        'map_test-command'
      ]);
      const negotiatedStatus = await client.callTool({name: 'map_get-status', arguments: {}});
      const content = negotiatedStatus.content as Array<{type: string; text: string}>;
      expect(content[0].type).toBe('text');
      expect(JSON.parse(content[0].text)).toMatchObject({
        state: 'negotiated',
        project: {state: 'unknown'},
        app: {name: 'test-page', version: '1.0'}
      });

      const disconnected = nextCatalogChange();
      page.close();
      await disconnected;
      expect((await client.listTools()).tools).toEqual(initialTools.tools);
    } finally {
      page?.terminate();
      await client.close();
      await server.close();
      await bridge.close();
    }
  });

  it('preserves preview images and exposes exported videos and projects through MCP resources', async () => {
    const bridge = new KeplerMcpBridge();
    const artifact = {
      uri: 'kepler://video/export.webm',
      name: 'export.webm',
      fileName: 'export.webm',
      filePath: '/private/video/export.webm',
      mimeType: 'video/webm' as const,
      size: 5
    };
    const resourceContent = {uri: artifact.uri, mimeType: artifact.mimeType, blob: 'dmlkZW8='};
    const project = {
      uri: 'http://127.0.0.1:8765/artifacts/project.json',
      name: 'kepler-project.json',
      mimeType: 'application/json' as const,
      size: 2,
      description: 'Saved project'
    };
    const projectContent = {uri: project.uri, mimeType: project.mimeType, text: '{}'};
    jest.spyOn(bridge, 'getResources').mockReturnValue([project]);
    jest.spyOn(bridge, 'readResource').mockReturnValue(projectContent);
    jest.spyOn(bridge, 'listVideoResources').mockReturnValue([artifact]);
    jest.spyOn(bridge, 'readVideoResource').mockResolvedValue(resourceContent);
    jest
      .spyOn(bridge, 'callTool')
      .mockResolvedValueOnce({
        success: true,
        commandId: 'map.render-preview',
        data: {mimeType: 'image/png', width: 640, height: 480, data: 'cG5n'}
      })
      .mockResolvedValueOnce({
        success: true,
        commandId: 'map.export-video',
        data: {artifact}
      })
      .mockResolvedValueOnce({
        success: true,
        commandId: 'map.save-project',
        data: {artifact: {uri: project.uri}}
      })
      .mockResolvedValueOnce({
        success: false,
        commandId: 'map.export-video',
        error: 'Export failed',
        data: {artifact}
      });
    const server = createKeplerMcpServer(bridge, 'test-build');
    const client = new Client({name: 'test-client', version: '1.0'});
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    try {
      await server.connect(serverTransport);
      await client.connect(clientTransport);
      expect(client.getServerCapabilities()).toMatchObject({
        tools: {listChanged: true},
        resources: {}
      });
      const preview = await client.callTool({name: 'map_render-preview', arguments: {}});
      expect(preview.content).toEqual([
        {
          type: 'text',
          text: JSON.stringify({mimeType: 'image/png', width: 640, height: 480}, null, 2)
        },
        {type: 'image', mimeType: 'image/png', data: 'cG5n'}
      ]);
      const video = await client.callTool({name: 'map_export-video', arguments: {}});
      expect(video.content).toEqual([
        expect.objectContaining({type: 'text'}),
        expect.objectContaining({
          type: 'resource_link',
          uri: artifact.uri,
          name: artifact.name,
          mimeType: artifact.mimeType,
          size: artifact.size
        })
      ]);
      const savedProject = await client.callTool({
        name: 'map_save-project',
        arguments: {includeCredentials: false}
      });
      expect(savedProject.content).toEqual([
        expect.objectContaining({type: 'text'}),
        {type: 'resource_link', ...project}
      ]);
      expect(await client.listResources()).toEqual({
        resources: [
          project,
          {uri: artifact.uri, name: artifact.name, mimeType: artifact.mimeType, size: artifact.size}
        ]
      });
      expect(await client.readResource({uri: artifact.uri})).toEqual({
        contents: [resourceContent]
      });
      expect(await client.readResource({uri: project.uri})).toEqual({
        contents: [projectContent]
      });
      const failed = await client.callTool({name: 'map_export-video', arguments: {}});
      expect(failed).toMatchObject({
        isError: true,
        content: [{type: 'text', text: '✗ map.export-video: Export failed'}]
      });
    } finally {
      await client.close();
      await server.close();
      await bridge.close();
      jest.restoreAllMocks();
    }
  });

  it('subscribes only after initialization and releases the listener when the client closes', async () => {
    const unsubscribe = jest.fn();
    const onToolsChanged = jest.fn(() => unsubscribe);
    const bridge = {onToolsChanged} as unknown as KeplerMcpBridge;
    const server = createKeplerMcpServer(bridge, 'test-build');
    const client = new Client({name: 'test-client', version: '1.0'});
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    await server.connect(serverTransport);
    expect(onToolsChanged).not.toHaveBeenCalled();
    await client.connect(clientTransport);
    expect(onToolsChanged).toHaveBeenCalledTimes(1);
    await client.close();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
    await server.close();
  });
});

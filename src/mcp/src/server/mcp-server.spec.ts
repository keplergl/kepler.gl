/** @jest-environment node */

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {InMemoryTransport} from '@modelcontextprotocol/sdk/inMemory.js';
import {ToolListChangedNotificationSchema} from '@modelcontextprotocol/sdk/types.js';
import WebSocket from 'ws';
import {KeplerMcpBridge} from './bridge-server';
import {createKeplerMcpServer} from './mcp-server';

describe('kepler-mcp protocol', () => {
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

  it('preserves preview images and exposes exported videos through MCP resources', async () => {
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
      expect(await client.listResources()).toEqual({
        resources: [
          {uri: artifact.uri, name: artifact.name, mimeType: artifact.mimeType, size: artifact.size}
        ]
      });
      expect(await client.readResource({uri: artifact.uri})).toEqual({
        contents: [resourceContent]
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

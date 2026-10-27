/**
 * @jest-environment node
 *
 * jsdom makes jest resolve `ws` through its `browser` condition, which is a
 * throwing shim with no WebSocketServer; this suite needs the Node build.
 */
import WebSocket from 'ws';
import {KeplerMcpBridge, toToolName} from './bridge-server';
import type {KeplerMcpBridgeStart} from './bridge-server';

async function waitFor(condition: () => boolean, timeoutMs = 3000): Promise<void> {
  const startedAt = Date.now();
  while (!condition()) {
    if (Date.now() - startedAt > timeoutMs) throw new Error('waitFor timed out');
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}

function connect(port: number, token: string): WebSocket {
  return new WebSocket(`ws://127.0.0.1:${port}/ws?token=${token}`);
}

function nextMessage(socket: WebSocket): Promise<any> {
  return new Promise(resolve => socket.once('message', data => resolve(JSON.parse(String(data)))));
}

describe('kepler-mcp bridge server', () => {
  let bridge: KeplerMcpBridge;
  let started: KeplerMcpBridgeStart;

  beforeEach(async () => {
    bridge = new KeplerMcpBridge({port: 0, callTimeoutMs: 1000});
    started = await bridge.start();
  });

  afterEach(async () => {
    await bridge.close();
  });

  it('advertises the map tools before any page connects', () => {
    const names = bridge.getTools().map(tool => tool.name);
    // MCP tool names fold the dot: map.add-layer → map_add_layer
    expect(names).toContain(toToolName('map.add-layer'));
    expect(names).toContain(toToolName('map.set-basemap'));
    expect(names.length).toBeGreaterThan(8);
  });

  it('builds the page URL with the token', () => {
    expect(started.pageUrl).toBe(`http://localhost:8080?mcp=${started.token}`);
  });

  it('redirects a browser on / to the map page with the token', async () => {
    const response = await fetch(`http://127.0.0.1:${started.port}/`, {redirect: 'manual'});
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe(started.pageUrl);
  });

  it('exposes the full add-layer schema, including flowField', () => {
    const addLayer = bridge.getTools().find(tool => tool.name === toToolName('map.add-layer'));
    expect(JSON.stringify(addLayer?.inputSchema)).toContain('flowField');
  });

  it('rejects a connection with the wrong token', async () => {
    const socket = connect(started.port, 'not-the-token');
    const code = await new Promise<number>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('timed out waiting for close')), 3000);
      socket.on('close', closeCode => {
        clearTimeout(timer);
        resolve(closeCode);
      });
      socket.on('error', error => {
        clearTimeout(timer);
        reject(error);
      });
    });
    expect(code).toBe(1008);
    expect(bridge.connected).toBe(false);
  });

  it('explains a call made before a page connects', async () => {
    await expect(bridge.callTool(toToolName('map.add-layer'), {})).rejects.toThrow(
      /No kepler.gl map page is connected/
    );
  });

  it('forwards a call to the page and resolves with its result', async () => {
    const socket = connect(started.port, started.token);
    await new Promise(resolve => socket.on('open', resolve));

    // The page's own catalog replaces the static one on hello.
    socket.send(
      JSON.stringify({
        type: 'hello',
        commands: [
          {
            id: 'map.add-layer',
            name: 'Add map layer',
            description: 'Add a layer',
            inputSchema: {type: 'object'}
          }
        ]
      })
    );
    await waitFor(() => bridge.getTools().length === 1);
    expect(bridge.getTools()[0]).toMatchObject({
      name: toToolName('map.add-layer'),
      commandId: 'map.add-layer'
    });

    const pending = bridge.callTool(toToolName('map.add-layer'), {
      datasetName: 'shops',
      layerType: 'point'
    });
    const message = await nextMessage(socket);
    expect(message).toMatchObject({type: 'call', tool: 'map.add-layer'});
    expect(message.input).toEqual({datasetName: 'shops', layerType: 'point'});

    socket.send(
      JSON.stringify({
        type: 'result',
        callId: message.callId,
        result: {success: true, commandId: 'map.add-layer', data: {details: 'added'}}
      })
    );
    await expect(pending).resolves.toMatchObject({success: true});
    socket.close();
  });

  it('rejects pending calls when the page disconnects', async () => {
    const socket = connect(started.port, started.token);
    await new Promise(resolve => socket.on('open', resolve));
    await waitFor(() => bridge.connected);

    const pending = bridge.callTool(toToolName('map.set-basemap'), {styleType: 'dark-matter'});
    await nextMessage(socket);
    socket.close();

    await expect(pending).rejects.toThrow(/disconnected/);
  });
});

/**
 * @jest-environment node
 *
 * jsdom makes jest resolve `ws` through its `browser` condition, which is a
 * throwing shim with no WebSocketServer; this suite needs the Node build.
 */

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import WebSocket from 'ws';
import {z} from 'zod';
import {MAP_TOOL_IDS} from '../types';
import {KeplerMcpBridge, toToolName} from './bridge-server';
import type {KeplerMcpBridgeStart} from './bridge-server';

jest.mock('@kepler.gl/mcp/skill/kepler/SKILL.md', () => 'Map skill', {virtual: true});

// Exercise the descriptor builder used by the page's hello message. Requiring
// it keeps the demo's Markdown module declarations out of the package's types.
const {buildCatalog, toDescriptor} = require('../../../../examples/demo-app/src/kepler-mcp-shared');

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
    expect(names).toContain(toToolName('map.get-annotations'));
    expect(names.slice().sort()).toEqual(MAP_TOOL_IDS.map(toToolName).sort());
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

  it('advertises surface layers and camera/fade/import command schemas', () => {
    const tools = bridge.getTools();
    const schema = tools.find(tool => tool.name === toToolName('map.add-layer'))
      ?.inputSchema as any;
    expect(schema.properties.layerType.enum).toEqual(
      expect.arrayContaining([
        'contour',
        'voronoi',
        'zarr',
        'a5',
        'geohash',
        'icon',
        '3D',
        'bitmap',
        'vectorTile',
        'rasterTile',
        'wms',
        'tile3d'
      ])
    );
    for (const [id, field] of [
      ['map.load-zarr', 'datasetName'],
      ['map.load-tileset', 'metadataUrl'],
      ['map.get-layer-options', 'layerId'],
      ['map.set-layer-options', 'options'],
      ['map.camera-bookmarks', 'camera'],
      ['map.camera-tour', 'holdDurationMs'],
      ['map.add-annotation', 'anchorPoint'],
      ['map.set-view-mode', 'globe'],
      ['map.set-zoom-fade', 'controllers']
    ]) {
      const tool = tools.find(item => item.name === toToolName(id));
      expect(tool).toBeDefined();
      expect(tool?.inputSchema.type).toBe('object');
      expect(JSON.stringify(tool?.inputSchema)).toContain(field);
    }
  });

  it('preserves the demo command parameters after the page handshake', async () => {
    const socket = connect(started.port, started.token);
    await new Promise(resolve => socket.on('open', resolve));

    socket.send(JSON.stringify({type: 'hello', commands: buildCatalog({}).map(toDescriptor)}));
    // The skill reader exists only in the demo catalog, so this also ensures
    // the assertions inspect the received descriptors rather than static tools.
    await waitFor(() =>
      bridge.getTools().some(tool => tool.name === toToolName('kepler.get-map-skill'))
    );

    const tools = bridge.getTools();
    const schemaFor = (id: string) => tools.find(tool => tool.name === toToolName(id))?.inputSchema;
    expect(schemaFor('map.add-layer')).toMatchObject({
      type: 'object',
      properties: {
        datasetName: {type: 'string'},
        layerType: {type: 'string', enum: expect.arrayContaining(['point', 'flowField'])}
      },
      required: expect.arrayContaining(['datasetName', 'layerType'])
    });
    expect(schemaFor('map.set-layer-options')).toMatchObject({
      type: 'object',
      properties: {
        layerId: {type: 'string'},
        options: {
          type: 'object',
          additionalProperties: {type: expect.arrayContaining(['number', 'boolean', 'string'])}
        }
      },
      required: expect.arrayContaining(['layerId'])
    });
    expect(schemaFor('map.add-time-filter')).toMatchObject({
      type: 'object',
      properties: {datasetName: {type: 'string'}, dateTimeColumn: {type: 'string'}},
      required: expect.arrayContaining(['datasetName', 'dateTimeColumn'])
    });
    socket.close();
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

describe('demo MCP descriptors', () => {
  it('preserves commands with no input schema', () => {
    expect(toDescriptor({id: 'kepler.get-map-skill', name: 'Read map skill'})).toMatchObject({
      id: 'kepler.get-map-skill',
      inputSchema: {type: 'object'}
    });
  });

  it('uses the producer serializer without requiring host-compatible schema internals', () => {
    const producerSchema = z.object({
      datasetName: z.string(),
      layerType: z.enum(['point', 'line'])
    });
    // A host cannot introspect this schema; only its producer knows how to
    // serialize it. This models the incompatible-Zod-installations boundary.
    const inputSchema = {toJSONSchema: () => producerSchema.toJSONSchema()};

    expect(toDescriptor({id: 'map.add-layer', name: 'Add layer', inputSchema})).toMatchObject({
      inputSchema: {
        properties: {
          datasetName: {type: 'string'},
          layerType: {enum: ['point', 'line']}
        },
        required: ['datasetName', 'layerType']
      }
    });
  });

  it('converts older schemas without a producer serializer', () => {
    const inputSchema = z.object({layerId: z.string()});
    Object.defineProperty(inputSchema, 'toJSONSchema', {value: undefined});

    expect(
      toDescriptor({id: 'map.get-layer-options', name: 'Get options', inputSchema})
    ).toMatchObject({
      inputSchema: {
        type: 'object',
        properties: {layerId: {type: 'string'}},
        required: ['layerId']
      }
    });
  });

  it('reports the command and conversion failure instead of publishing an empty schema', () => {
    expect(() =>
      toDescriptor({
        id: 'map.unsupported',
        name: 'Unsupported schema',
        inputSchema: z.object({value: z.bigint()})
      })
    ).toThrow(/map\.unsupported.*BigInt.*JSON Schema.*Zod/);
  });
});

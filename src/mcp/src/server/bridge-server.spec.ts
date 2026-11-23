/**
 * @jest-environment node
 *
 * jsdom makes jest resolve `ws` through its `browser` condition, which is a
 * throwing shim with no WebSocketServer; this suite needs the Node build.
 */

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import WebSocket from 'ws';
import {mkdtemp, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {PassThrough} from 'node:stream';
import {z} from 'zod';
import {MAP_TOOL_IDS} from '../types';
import {KeplerMcpBridge, formatResult, getMapTools, toToolName} from './bridge-server';
import type {KeplerMcpBridgeStart} from './bridge-server';

jest.mock('@kepler.gl/mcp/skill/kepler/SKILL.md', () => 'Map skill', {virtual: true});

// Exercise the descriptor builder used by the page's hello message. Requiring
// it keeps the demo's Markdown module declarations out of the package's types.
const {buildCatalog, toDescriptor} = require('../../../../examples/demo-app/src/kepler-mcp-shared');
const fsPromises = require('node:fs/promises') as typeof import('node:fs/promises');

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

describe('kepler-mcp result formatting', () => {
  it('preserves dataset IDs, field types and layer bindings alongside the summary', () => {
    const data = {
      details: '1 dataset(s) loaded.',
      datasets: [
        {
          datasetId: 'trips',
          datasetName: 'Trips',
          fields: {longitude: 'real', latitude: 'real', timestamp: 'timestamp'},
          layers: [{id: 'points', type: 'point', geometryColumns: {lat: 'latitude'}}]
        }
      ]
    };
    const result = formatResult({success: true, commandId: 'map.get-dataset-context', data});

    expect(result.isError).toBe(false);
    expect(JSON.parse(result.text)).toEqual(data);
  });

  it('preserves layer options without a details field', () => {
    const data = {
      layerId: 'points',
      settings: {radius: {type: 'number', value: 10, range: [0, 100]}}
    };
    const result = formatResult({success: true, commandId: 'map.get-layer-options', data});

    expect(result.isError).toBe(false);
    expect(JSON.parse(result.text)).toEqual(data);
  });

  it('preserves an empty dataset array alongside its summary', () => {
    const data = {details: '0 dataset(s) loaded.', datasets: []};
    const result = formatResult({success: true, commandId: 'map.get-dataset-context', data});

    expect(result.isError).toBe(false);
    expect(JSON.parse(result.text)).toEqual(data);
  });

  it('keeps prose-only skill replies readable', () => {
    expect(
      formatResult({
        success: true,
        commandId: 'kepler.get-map-skill',
        data: {details: '# Map skill\n\nChoose a layer.'}
      })
    ).toEqual({text: '# Map skill\n\nChoose a layer.', isError: false});
  });

  it('handles a successful reply without data', () => {
    const result = {success: true, commandId: 'map.add-layer'};
    const formatted = formatResult(result);

    expect(formatted.isError).toBe(false);
    expect(JSON.parse(formatted.text)).toEqual(result);
  });

  it.each([
    {success: false, error: 'Dataset not found', reason: 'Dataset not found'},
    {success: false, error: undefined, reason: 'failed'},
    {success: true, error: 'Dataset not found', reason: 'Dataset not found'}
  ])('reports failure for success=$success and error=$error', ({success, error, reason}) => {
    expect(
      formatResult({
        success,
        commandId: 'map.get-dataset-context',
        error,
        data: {details: 'A summary must not mask the failure', datasets: []}
      })
    ).toEqual({text: `✗ map.get-dataset-context: ${reason}`, isError: true});
  });
});

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
    expect(names).toContain(toToolName('map.update-annotation'));
    expect(names).toContain(toToolName('map.remove-annotation'));
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
      ['map.property-transitions', 'startTimeMs'],
      ['map.add-annotation', 'anchorPoint'],
      ['map.update-annotation', 'fontSize'],
      ['map.remove-annotation', 'id'],
      ['map.set-view-mode', 'globe'],
      ['map.set-zoom-fade', 'controllers']
    ]) {
      const tool = tools.find(item => item.name === toToolName(id));
      expect(tool).toBeDefined();
      expect(tool?.inputSchema.type).toBe('object');
      expect(JSON.stringify(tool?.inputSchema)).toContain(field);
    }
  });

  it('advertises styled point callouts and partial annotation edits', () => {
    const tools = bridge.getTools();
    const schemaFor = (id: string) => tools.find(tool => tool.name === toToolName(id))?.inputSchema;
    expect(schemaFor('map.add-annotation')).toMatchObject({
      type: 'object',
      properties: {
        kind: {enum: expect.arrayContaining(['text', 'point', 'ruler'])},
        fontSize: {type: 'number'},
        textColor: {type: 'string'},
        textAlign: {enum: ['left', 'center', 'right', 'justify']},
        armLength: {type: 'number'},
        textSide: {enum: ['left', 'right']},
        textVerticalPosition: {enum: ['above', 'below']}
      },
      required: expect.arrayContaining(['id', 'kind', 'anchorPoint'])
    });
    expect(schemaFor('map.update-annotation')).toMatchObject({
      type: 'object',
      properties: {
        id: {type: 'string'},
        label: {type: 'string'},
        fontSize: {type: 'number'}
      },
      required: ['id']
    });
    expect(schemaFor('map.remove-annotation')).toMatchObject({
      type: 'object',
      properties: {id: {type: 'string'}},
      required: ['id']
    });
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
    expect(schemaFor('map.load-data')).toMatchObject({
      properties: {url: {type: 'string'}, filePath: {type: 'string'}},
      oneOf: [{required: ['url']}, {required: ['filePath']}]
    });
    expect((schemaFor('map.load-data') as any).required).not.toContain('url');
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

  it.each(['before hello', 'older page'])(
    'rejects local files before reading disk or forwarding a call: %s',
    async state => {
      const socket = connect(started.port, started.token);
      await new Promise(resolve => socket.on('open', resolve));
      const messages: unknown[] = [];
      socket.on('message', message => messages.push(message));
      if (state === 'older page') {
        socket.send(
          JSON.stringify({
            type: 'hello',
            commands: [
              {
                id: 'map.load-data',
                name: 'Load data',
                inputSchema: {
                  type: 'object',
                  properties: {url: {type: 'string'}},
                  required: ['url']
                }
              }
            ]
          })
        );
        await waitFor(() => bridge.getTools().length === 1);
        expect((bridge.getTools()[0].inputSchema.properties as any).filePath).toBeUndefined();
      }
      const openFile = jest.spyOn(fsPromises, 'open');
      try {
        await expect(
          bridge.callTool(toToolName('map.load-data'), {filePath: '/selected.csv'})
        ).rejects.toThrow(/Update or reload the map page/);
        expect(openFile).not.toHaveBeenCalled();
        expect(messages).toHaveLength(0);
      } finally {
        openFile.mockRestore();
        socket.close();
      }
    }
  );
});

describe('kepler-mcp local file transfer', () => {
  let bridge: KeplerMcpBridge;
  let started: KeplerMcpBridgeStart;
  let directory: string;
  let filePath: string;
  let socket: WebSocket;

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), 'kepler-mcp-file-'));
    filePath = join(directory, 'selected dataset.csv');
    await writeFile(filePath, 'lat,lng\n40,-73\n');
    bridge = new KeplerMcpBridge({port: 0, callTimeoutMs: 1000});
    started = await bridge.start();
    socket = new WebSocket(`ws://127.0.0.1:${started.port}/ws?token=${started.token}`, {
      origin: 'http://localhost:3000'
    });
    await new Promise(resolve => socket.on('open', resolve));
    await advertiseLocalImport();
  });

  afterEach(async () => {
    await bridge.close();
    await rm(directory, {recursive: true, force: true});
  });

  function load(input: Record<string, unknown> = {filePath}) {
    return bridge.callTool(toToolName('map.load-data'), input);
  }

  async function advertiseLocalImport() {
    const tool = getMapTools().find(candidate => candidate.commandId === 'map.load-data')!;
    socket.send(
      JSON.stringify({
        type: 'hello',
        commands: [
          {
            id: tool.commandId,
            name: tool.name,
            inputSchema: tool.inputSchema
          }
        ]
      })
    );
    await waitFor(() => bridge.getTools().length === 1);
  }

  function reply(callId: string, success = true) {
    socket.send(
      JSON.stringify({
        type: 'result',
        callId,
        result: {
          success,
          commandId: 'map.load-data',
          ...(success
            ? {data: {datasetId: 'imported'}}
            : {error: 'Unable to parse the selected file'})
        }
      })
    );
  }

  it('streams multi-megabyte bytes outside the tool input and revokes the capability after completion', async () => {
    const contents = 'latitude,longitude,name\n' + '40,-73,selected location\n'.repeat(140000);
    expect(Buffer.byteLength(contents)).toBeGreaterThan(2 * 1024 * 1024);
    await writeFile(filePath, contents);
    const pending = load({filePath, datasetName: 'Local locations'});
    const message = await nextMessage(socket);
    expect(message).toMatchObject({
      type: 'call',
      tool: 'map.load-data',
      input: {datasetName: 'Local locations'}
    });
    expect(JSON.stringify(message)).not.toContain(directory);
    expect(JSON.stringify(message).length).toBeLessThan(500);
    const url = new URL(message.input.url);
    const response = await fetch(url, {headers: {Origin: 'http://localhost:3000'}});
    expect(response.status).toBe(200);
    expect(response.headers.get('x-kepler-local-resource')).toBe(url.pathname.split('/')[2]);
    expect(response.headers.get('access-control-allow-origin')).toBe('http://localhost:3000');
    expect(response.headers.get('access-control-expose-headers')).toBe('X-Kepler-Local-Resource');
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(response.headers.get('content-length')).toBe(String(Buffer.byteLength(contents)));
    expect(await response.text()).toBe(contents);

    reply(message.callId);
    await expect(pending).resolves.toMatchObject({success: true, data: {datasetId: 'imported'}});
    expect((await fetch(url)).status).toBe(404);
  });

  it('limits transfer requests to the capability and the connected map origin', async () => {
    const pending = load();
    const message = await nextMessage(socket);
    expect(
      (await fetch(message.input.url, {headers: {Origin: 'http://unrelated.example'}})).status
    ).toBe(403);
    expect((await fetch(`${message.input.url}?path=${encodeURIComponent(filePath)}`)).status).toBe(
      404
    );
    expect(
      (await fetch(message.input.url.replace(/local-data\/[^/]+/, 'local-data/not-a-capability')))
        .status
    ).toBe(404);
    expect((await fetch(message.input.url, {method: 'POST'})).status).toBe(405);
    const preflight = await fetch(message.input.url, {
      method: 'OPTIONS',
      headers: {Origin: 'http://localhost:3000'}
    });
    expect(preflight.status).toBe(204);
    expect(preflight.headers.get('access-control-allow-methods')).toBe('GET');
    reply(message.callId, false);
    await expect(pending).resolves.toMatchObject({
      success: false,
      error: expect.stringContaining('parse')
    });
    expect((await fetch(message.input.url)).status).toBe(404);
  });

  it.each([
    {input: {}, error: /exactly one/},
    {input: {filePath: ''}, error: /absolute path/},
    {input: {filePath: 'relative.csv'}, error: /absolute path/},
    {input: {filePath: null}, error: /absolute path/},
    {input: {filePath: 42}, error: /absolute path/},
    {input: {filePath: '/selected.csv', url: 'https://example.com/file.csv'}, error: /exactly one/}
  ])('rejects invalid local import input before forwarding: $input', async ({input, error}) => {
    const messages: unknown[] = [];
    socket.on('message', message => messages.push(message));
    await expect(load(input)).rejects.toThrow(error);
    expect(messages).toHaveLength(0);
  });

  it('reports missing, empty, and non-file paths without disclosing the full path', async () => {
    const missing = join(directory, 'missing.csv');
    await expect(load({filePath: missing})).rejects.toThrow(/ENOENT.*exists.*readable/);
    await expect(load({filePath: missing})).rejects.not.toThrow(directory);
    await expect(load({filePath: directory})).rejects.toThrow(/regular file/);
    await writeFile(filePath, '');
    await expect(load()).rejects.toThrow(/empty/);
  });

  it('cancels a timed-out import and revokes its capability', async () => {
    const pending = load();
    const rejected = expect(pending).rejects.toThrow(/Timed out.*smaller file/);
    const message = await nextMessage(socket);
    const cancel = await nextMessage(socket);
    expect(cancel).toEqual({type: 'cancel', callId: message.callId});
    await rejected;
    expect((await fetch(message.input.url)).status).toBe(404);
  });

  it('reports disk read errors, cancels the command, and revokes the capability', async () => {
    const actualOpen = fsPromises.open;
    const openFile = jest.spyOn(fsPromises, 'open').mockImplementationOnce(async (...args) => {
      const file = await actualOpen(...args);
      jest.spyOn(file, 'createReadStream').mockImplementation(() => {
        const stream = new PassThrough();
        queueMicrotask(() => stream.destroy(new Error('Disk read failed')));
        return stream as any;
      });
      return file;
    });
    try {
      const pending = load();
      const rejected = expect(pending).rejects.toThrow(/file transfer failed.*readable/);
      const message = await nextMessage(socket);
      const cancellation = nextMessage(socket);
      await expect(fetch(message.input.url).then(response => response.text())).rejects.toThrow();
      await expect(cancellation).resolves.toEqual({type: 'cancel', callId: message.callId});
      await rejected;
      expect((await fetch(message.input.url)).status).toBe(404);
    } finally {
      openFile.mockRestore();
    }
  });

  it('requires a loopback listener for local file imports', async () => {
    await bridge.close();
    bridge = new KeplerMcpBridge({port: 0, host: '0.0.0.0'});
    started = await bridge.start();
    socket = connect(started.port, started.token);
    await new Promise(resolve => socket.on('open', resolve));
    await advertiseLocalImport();
    await expect(load()).rejects.toThrow(/loopback bridge host/);
  });

  it.each(['disconnect', 'replacement', 'shutdown'])(
    'revokes active local resources on %s',
    async event => {
      const pending = load();
      const rejected = expect(pending).rejects.toThrow(/disconnected|replaced|closed/);
      const message = await nextMessage(socket);
      if (event === 'disconnect') socket.close();
      else if (event === 'replacement') {
        const replacement = connect(started.port, started.token);
        await new Promise(resolve => replacement.on('open', resolve));
      } else await bridge.close();
      await rejected;
      if (event === 'shutdown') {
        await expect(fetch(message.input.url)).rejects.toThrow();
      } else expect((await fetch(message.input.url)).status).toBe(404);
    }
  );
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

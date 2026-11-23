/**
 * @jest-environment node
 *
 * jsdom makes jest resolve `ws` through its `browser` condition, which is a
 * throwing shim with no WebSocketServer; this suite needs the Node build.
 */

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import WebSocket from 'ws';
import {mkdtemp, readFile, rm, stat, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {PassThrough} from 'node:stream';
import {z} from 'zod';
import {MAP_TOOL_IDS} from '../types';
import {
  KeplerMcpBridge,
  formatResult,
  formatMcpResult,
  getMapTools,
  toToolName
} from './bridge-server';
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
  it('returns preview PNGs as image content without duplicating bytes in text', () => {
    const metadata = {mimeType: 'image/png', width: 1920, height: 1080, dataTime: 1234};
    expect(
      formatMcpResult({
        success: true,
        commandId: 'map.render-preview',
        data: {...metadata, data: 'cG5n'}
      })
    ).toEqual({
      content: [
        {type: 'text', text: JSON.stringify(metadata, null, 2)},
        {type: 'image', mimeType: 'image/png', data: 'cG5n'}
      ]
    });
  });

  it('returns preview errors as errors without emitting an image', () => {
    expect(
      formatMcpResult({
        success: false,
        commandId: 'map.render-preview',
        error: 'Frame timed out',
        data: {mimeType: 'image/png', data: 'cG5n'}
      })
    ).toEqual({
      content: [{type: 'text', text: '✗ map.render-preview: Frame timed out'}],
      isError: true
    });
  });

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
    expect(names.slice().sort()).toEqual(
      [...MAP_TOOL_IDS, 'map.get-status'].map(toToolName).sort()
    );
  });

  it('reports disconnected status and a working launcher without credentials', async () => {
    const result = await bridge.callTool('map_get-status');
    expect(result).toMatchObject({
      success: true,
      data: {
        state: 'disconnected',
        connected: false,
        toolsNegotiated: false,
        app: null,
        project: {state: 'unknown'},
        capabilities: {tools: ['map_get-status'], localFileImport: false},
        launcherUrl: `http://127.0.0.1:${started.port}/`
      }
    });
    expect(JSON.stringify(result)).not.toContain(started.token);
    const response = await fetch((result.data as any).launcherUrl, {redirect: 'manual'});
    const pageUrl = new URL(response.headers.get('location')!);
    expect(pageUrl.searchParams.get('mcpPort')).toBe(String(started.port));
  });

  it('separates connection from negotiation without claiming project readiness', async () => {
    const socket = connect(started.port, started.token);
    await new Promise(resolve => socket.on('open', resolve));
    expect(bridge.getStatus()).toMatchObject({
      state: 'connected',
      toolsNegotiated: false,
      project: {state: 'unknown'}
    });
    socket.send(
      JSON.stringify({
        type: 'hello',
        app: {name: 'kepler.gl demo', version: '3.3.0'},
        commands: [{id: 'map.get-layer-options', name: 'Inspect layer'}]
      })
    );
    await waitFor(() => bridge.getStatus().toolsNegotiated);
    await expect(bridge.callTool('map_get-status')).resolves.toMatchObject({
      data: {
        state: 'negotiated',
        app: {name: 'kepler.gl demo', version: '3.3.0'},
        project: {state: 'unknown'},
        capabilities: {tools: ['map_get-layer-options', 'map_get-status']}
      }
    });
    socket.close();
  });

  it('supports older pages with no app identity or project status', async () => {
    const socket = connect(started.port, started.token);
    await new Promise(resolve => socket.on('open', resolve));
    socket.send(JSON.stringify({type: 'hello', commands: []}));
    await waitFor(() => bridge.getStatus().toolsNegotiated);
    await expect(bridge.callTool('map_get-status')).resolves.toMatchObject({
      data: {
        state: 'negotiated',
        app: null,
        project: {state: 'unknown'},
        capabilities: {tools: ['map_get-status']}
      }
    });
    socket.close();
  });

  it('does not accept unsupported readiness waits', async () => {
    await expect(bridge.callTool('map_get-status', {waitUntilReady: true})).rejects.toThrow();
    await expect(bridge.callTool('map_get-status', {timeoutMs: 1000})).rejects.toThrow();
  });

  it('resets identity and negotiated capabilities when a new page connects', async () => {
    const socket = connect(started.port, started.token);
    await new Promise(resolve => socket.on('open', resolve));
    socket.send(JSON.stringify({type: 'hello', app: {name: 'old page'}, commands: []}));
    await waitFor(() => bridge.getStatus().toolsNegotiated);
    const replacement = connect(started.port, started.token);
    await new Promise(resolve => replacement.on('open', resolve));
    expect(bridge.getStatus()).toMatchObject({
      state: 'connected',
      app: null,
      toolsNegotiated: false,
      capabilities: {tools: ['map_get-status']}
    });
    replacement.send(JSON.stringify({type: 'hello', commands: []}));
    await waitFor(() => bridge.getStatus().toolsNegotiated);
    replacement.close();
    await waitFor(() => !bridge.connected);
    expect(bridge.getStatus()).toMatchObject({
      state: 'disconnected',
      app: null,
      toolsNegotiated: false,
      capabilities: {tools: ['map_get-status']}
    });
  });

  it('notifies only on catalog changes and rejects tools absent from the negotiated catalog', async () => {
    const changed = jest.fn();
    const unsubscribe = bridge.onToolsChanged(changed);
    const socket = connect(started.port, started.token);
    await new Promise(resolve => socket.on('open', resolve));
    const hello = {type: 'hello', commands: [{id: 'map.get-dataset-context', name: 'Datasets'}]};
    socket.send(JSON.stringify(hello));
    await waitFor(() => changed.mock.calls.length === 1);
    socket.send(JSON.stringify({...hello, app: {name: 'updated identity'}}));
    await waitFor(() => bridge.getStatus().app?.name === 'updated identity');
    expect(changed).toHaveBeenCalledTimes(1);
    await expect(bridge.callTool('map_add-layer')).rejects.toThrow(/Unknown map tool/);
    socket.send(JSON.stringify({...hello, commands: []}));
    await waitFor(() => changed.mock.calls.length === 2);
    socket.close();
    await waitFor(() => changed.mock.calls.length === 3);
    unsubscribe();
  });

  it('builds the page URL with the token', () => {
    expect(started.pageUrl).toBe(
      `http://localhost:8080?mcp=${started.token}&mcpPort=${started.port}`
    );
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
      ['map.render-preview', 'cameraTimeMs'],
      ['map.property-transitions', 'startTimeMs'],
      ['map.add-annotation', 'anchorPoint'],
      ['map.add-annotation', 'viewport'],
      ['map.update-annotation', 'fontSize'],
      ['map.update-annotation', 'readout'],
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

  it('advertises styled geographic annotations, viewport captions and partial edits', () => {
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
        textVerticalPosition: {enum: ['above', 'below']},
        viewport: {
          type: 'object',
          properties: {
            anchor: {enum: expect.arrayContaining(['top-left', 'bottom-right'])},
            margin: {type: 'array', minItems: 2, maxItems: 2}
          },
          required: ['anchor', 'margin']
        }
      },
      // Coordinates are conditional: geographic annotations need them, captions do not.
      required: ['id', 'kind']
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
    await waitFor(() => bridge.getTools().length === 2);
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
        await waitFor(() => bridge.getTools().length === 2);
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

describe('kepler-mcp video artifacts', () => {
  let bridge: KeplerMcpBridge;
  let started: KeplerMcpBridgeStart;
  let socket: WebSocket;
  let contents: Buffer;
  let reads: number[];
  let artifactOverrides: Record<string, unknown>;
  let chunkOverrides: Record<string, unknown>;
  let disconnectOnRead: boolean;

  const status = (jobId = 'video-job') =>
    bridge.callTool(toToolName('map.export-video'), {action: 'status', jobId});

  async function connectPage() {
    const page = connect(started.port, started.token);
    await new Promise(resolve => page.on('open', resolve));
    page.send(
      JSON.stringify({
        type: 'hello',
        commands: [{id: 'map.export-video', name: 'Export video', inputSchema: {type: 'object'}}]
      })
    );
    await waitFor(() => bridge.getStatus().toolsNegotiated);
    page.on('message', raw => {
      const message = JSON.parse(String(raw));
      if (message.type !== 'call') return;
      const {input, callId} = message;
      let data: unknown;
      if (input.action === 'read') {
        reads.push(input.offset);
        if (disconnectOnRead) {
          page.close();
          return;
        }
        const nextOffset = Math.min(contents.length, input.offset + 256 * 1024);
        data = {
          offset: input.offset,
          nextOffset,
          totalBytes: contents.length,
          mimeType: 'video/webm',
          fileName: '../../untrusted.webm',
          base64: contents.subarray(input.offset, nextOffset).toString('base64'),
          ...chunkOverrides
        };
      } else {
        data = {
          jobId: input.jobId,
          status: 'succeeded',
          progress: 1,
          artifact: {
            jobId: input.jobId,
            fileName: '../../untrusted.webm',
            mimeType: 'video/webm',
            size: contents.length,
            url: 'blob:http://localhost/browser-only',
            ...artifactOverrides
          }
        };
      }
      page.send(
        JSON.stringify({
          type: 'result',
          callId,
          result: {success: true, commandId: 'map.export-video', data}
        })
      );
    });
    return page;
  }

  beforeEach(async () => {
    contents = Buffer.from('encoded-video-frame-data'.repeat(30000));
    reads = [];
    artifactOverrides = {};
    chunkOverrides = {};
    disconnectOnRead = false;
    bridge = new KeplerMcpBridge({port: 0, callTimeoutMs: 1000});
    started = await bridge.start();
    socket = await connectPage();
  });

  afterEach(async () => {
    await bridge.close();
  });

  it('retrieves chunks into a private file and readable MCP resource without exposing browser URLs', async () => {
    const result = await status();
    const artifact = (result.data as any).artifact;
    expect(reads).toEqual([0, 256 * 1024, 512 * 1024]);
    expect(artifact).toMatchObject({
      uri: expect.stringMatching(/^kepler:\/\/video\//),
      mimeType: 'video/webm',
      size: contents.length
    });
    expect(artifact.url).toBeUndefined();
    expect(artifact.fileName).not.toContain('untrusted');
    expect((await readFile(artifact.filePath)).equals(contents)).toBe(true);
    expect((await stat(artifact.filePath)).mode & 0o777).toBe(0o600);
    expect(bridge.listVideoResources()).toEqual([artifact]);
    expect(bridge.getVideoResourceLink(result)).toMatchObject({
      type: 'resource_link',
      uri: artifact.uri,
      name: artifact.fileName,
      mimeType: 'video/webm',
      size: contents.length
    });
    expect(await bridge.readVideoResource(artifact.uri)).toEqual({
      uri: artifact.uri,
      mimeType: 'video/webm',
      blob: contents.toString('base64')
    });
    expect((await status()).data).toEqual(result.data);
    expect(reads).toHaveLength(3);

    socket.close();
    await waitFor(() => !bridge.connected);
    expect((await bridge.readVideoResource(artifact.uri)).blob).toBe(contents.toString('base64'));
    await bridge.close();
    await expect(stat(artifact.filePath)).rejects.toMatchObject({code: 'ENOENT'});
    await expect(bridge.readVideoResource(artifact.uri)).rejects.toThrow(/unavailable or expired/);
  });

  it.each([{size: 0}, {size: 256 * 1024 * 1024 + 1}, {mimeType: 'text/html'}])(
    'rejects unsupported artifacts before requesting bytes: %j',
    async overrides => {
      artifactOverrides = overrides;
      await expect(status()).rejects.toThrow(/non-empty WebM.*256 MiB/);
      expect(reads).toHaveLength(0);
      expect(bridge.listVideoResources()).toEqual([]);
    }
  );

  it.each([
    {offset: 1},
    {nextOffset: 1},
    {totalBytes: 1},
    {base64: 'not valid base64'},
    {base64: ''},
    {mimeType: 'text/plain'}
  ])('rejects corrupt chunks and cleans up partial files: %j', async overrides => {
    const makeDirectory = jest.spyOn(fsPromises, 'mkdtemp');
    try {
      chunkOverrides = overrides;
      await expect(status()).rejects.toThrow(/invalid (data|chunk size)/);
      expect(bridge.listVideoResources()).toEqual([]);
      const directory = await makeDirectory.mock.results[0].value;
      await expect(stat(directory)).rejects.toMatchObject({code: 'ENOENT'});
    } finally {
      makeDirectory.mockRestore();
    }
  });

  it('reports disconnection during transfer and removes the partial file', async () => {
    const makeDirectory = jest.spyOn(fsPromises, 'mkdtemp');
    try {
      disconnectOnRead = true;
      await expect(status()).rejects.toThrow(/disconnected/);
      expect(bridge.listVideoResources()).toEqual([]);
      const directory = await makeDirectory.mock.results[0].value;
      await expect(stat(directory)).rejects.toMatchObject({code: 'ENOENT'});
    } finally {
      makeDirectory.mockRestore();
    }
  });

  it('does not reuse an old page artifact when a new page uses the same job ID', async () => {
    const first = (await status()).data as any;
    socket.close();
    await waitFor(() => !bridge.connected);
    contents = Buffer.from('a different video');
    socket = await connectPage();
    const second = (await status()).data as any;
    expect(first.artifact.uri).not.toBe(second.artifact.uri);
    expect(await readFile(second.artifact.filePath)).toEqual(contents);
    expect(bridge.listVideoResources()).toHaveLength(2);
  });

  it('retains only the latest five artifacts and rejects unknown resource URIs', async () => {
    contents = Buffer.from('short video');
    const first = (await status('job-0')).data as any;
    for (let index = 1; index <= 5; index++) await status(`job-${index}`);
    expect(bridge.listVideoResources()).toHaveLength(5);
    await expect(stat(first.artifact.filePath)).rejects.toMatchObject({code: 'ENOENT'});
    await expect(bridge.readVideoResource(first.artifact.uri)).rejects.toThrow(
      /unavailable or expired/
    );
    await expect(bridge.readVideoResource('file:///etc/passwd')).rejects.toThrow(
      /unavailable or expired/
    );
  });
});

describe.each(['map.load-data', 'map.open-project'])('%s local file transfer', commandId => {
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
    return bridge.callTool(toToolName(commandId), input);
  }

  async function advertiseLocalImport() {
    const tool = getMapTools().find(candidate => candidate.commandId === commandId)!;
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
    await waitFor(() => bridge.getTools().length === 2);
  }

  function reply(callId: string, success = true) {
    socket.send(
      JSON.stringify({
        type: 'result',
        callId,
        result: {
          success,
          commandId,
          ...(success
            ? {data: {datasetId: 'imported'}}
            : {error: 'Unable to parse the selected file'})
        }
      })
    );
  }

  it('streams multi-megabyte bytes outside the tool input and revokes the capability after completion', async () => {
    expect(bridge.getStatus().capabilities.localFileImport).toBe(true);
    const contents = `latitude,longitude,name\n${'40,-73,selected location\n'.repeat(140000)}`;
    expect(Buffer.byteLength(contents)).toBeGreaterThan(2 * 1024 * 1024);
    await writeFile(filePath, contents);
    const pending = load({filePath, datasetName: 'Local locations'});
    const message = await nextMessage(socket);
    expect(message).toMatchObject({
      type: 'call',
      tool: commandId,
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
    {
      input: {filePath: '/selected.csv', url: 'https://example.com/file.csv'},
      error: /exactly one/
    }
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
    expect(bridge.getStatus().capabilities.localFileImport).toBe(false);
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

describe('kepler-mcp project artifacts', () => {
  let bridge: KeplerMcpBridge;
  let started: KeplerMcpBridgeStart;
  let socket: WebSocket;
  const project = {
    datasets: [{version: 'v1', data: {id: 'places', rows: [[37, -122, 'Café']]}}],
    config: {version: 'v1', config: {visState: {layers: []}}}
  };
  const text = JSON.stringify(project);

  beforeEach(async () => {
    bridge = new KeplerMcpBridge({port: 0, callTimeoutMs: 1000});
    started = await bridge.start();
    socket = new WebSocket(`ws://127.0.0.1:${started.port}/ws?token=${started.token}`, {
      origin: 'http://localhost:3000'
    });
    await new Promise(resolve => socket.on('open', resolve));
    socket.send(
      JSON.stringify({
        type: 'hello',
        commands: [{id: 'map.save-project', name: 'Save project', inputSchema: {type: 'object'}}]
      })
    );
    await waitFor(() => bridge.getTools().length === 2);
  });

  afterEach(async () => {
    await bridge.close();
  });

  async function save(
    result = {
      success: true,
      commandId: 'map.save-project',
      data: {
        datasetIds: ['places'],
        artifact: {fileName: 'kepler-project.json', mimeType: 'application/json', text}
      }
    }
  ): Promise<any> {
    const pending = bridge.callTool('map_save-project', {includeCredentials: false});
    const message = await nextMessage(socket);
    expect(message.input).toEqual({includeCredentials: false});
    socket.send(JSON.stringify({type: 'result', callId: message.callId, result}));
    return pending;
  }

  it('returns a compact artifact link with the exact saved JSON retrievable over HTTP and MCP resources', async () => {
    const result = await save();
    const artifact = result.data.artifact;
    expect(result).toMatchObject({
      success: true,
      data: {
        datasetIds: ['places'],
        artifact: {
          fileName: 'kepler-project.json',
          mimeType: 'application/json',
          size: Buffer.byteLength(text),
          availability: expect.stringContaining('Download to retain')
        }
      }
    });
    expect(artifact.text).toBeUndefined();
    expect(artifact.uri).toMatch(
      new RegExp(`^http://127.0.0.1:${started.port}/project-artifacts/`)
    );
    expect(bridge.getResources()).toEqual([
      {
        uri: artifact.uri,
        name: artifact.fileName,
        mimeType: artifact.mimeType,
        size: artifact.size,
        description: artifact.availability
      }
    ]);
    expect(bridge.readResource(artifact.uri)).toEqual({
      uri: artifact.uri,
      mimeType: 'application/json',
      text
    });
    const response = await fetch(artifact.uri, {headers: {Origin: 'http://localhost:3000'}});
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/json');
    expect(response.headers.get('content-length')).toBe(String(Buffer.byteLength(text)));
    expect(response.headers.get('content-disposition')).toContain('kepler-project.json');
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(await response.json()).toEqual(project);
  });

  it('retains artifacts through a page disconnect and replacement but clears them on server shutdown', async () => {
    const {
      data: {artifact}
    } = await save();
    socket.close();
    await waitFor(() => !bridge.connected);
    expect(await (await fetch(artifact.uri)).json()).toEqual(project);
    socket = connect(started.port, started.token);
    await new Promise(resolve => socket.on('open', resolve));
    expect(bridge.readResource(artifact.uri).text).toBe(text);
    await bridge.close();
    expect(bridge.getResources()).toEqual([]);
    expect(() => bridge.readResource(artifact.uri)).toThrow(/not found or expired/);
    await expect(fetch(artifact.uri)).rejects.toThrow();
  });

  it('restricts HTTP artifact reads to the capability and original map origin', async () => {
    const {
      data: {artifact}
    } = await save();
    expect(
      (await fetch(artifact.uri, {headers: {Origin: 'http://unrelated.example'}})).status
    ).toBe(403);
    expect((await fetch(`${artifact.uri}?extra=1`)).status).toBe(404);
    expect((await fetch(artifact.uri, {method: 'POST'})).status).toBe(405);
    const preflight = await fetch(artifact.uri, {
      method: 'OPTIONS',
      headers: {Origin: 'http://localhost:3000'}
    });
    expect(preflight.status).toBe(204);
    expect(preflight.headers.get('access-control-allow-methods')).toBe('GET');
    expect(() => bridge.readResource('http://127.0.0.1/project-artifacts/unknown')).toThrow(
      /not found or expired/
    );
  });

  it('evicts the oldest artifact after ten exports and reports its expiration', async () => {
    const first = await save();
    const second = await save();
    for (let index = 0; index < 9; index++) await save();
    expect(bridge.getResources()).toHaveLength(10);
    expect(() => bridge.readResource(first.data.artifact.uri)).toThrow(
      /expired.*Export the project again/
    );
    expect((await fetch(first.data.artifact.uri)).status).toBe(404);
    expect(bridge.readResource(second.data.artifact.uri).text).toBe(text);
  });

  it('does not publish failed or malformed exports', async () => {
    expect(
      await save({success: false, commandId: 'map.save-project', error: 'Cannot serialize'} as any)
    ).toMatchObject({success: false, error: 'Cannot serialize'});
    expect(
      await save({
        success: true,
        commandId: 'map.save-project',
        data: {artifact: {text: 42}}
      } as any)
    ).toMatchObject({
      success: false,
      error: expect.stringContaining('valid JSON project artifact')
    });
    expect(bridge.getResources()).toHaveLength(0);
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

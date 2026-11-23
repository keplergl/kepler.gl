/** @jest-environment node */

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {mkdtemp, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import WebSocket from 'ws';
import {z} from 'zod';
import {applyMiddleware, createStore} from 'redux';
import {addDataToMap, registerEntry, wrapTo} from '@kepler.gl/actions';
import {DatasetType} from '@kepler.gl/constants';
import {processCsvData} from '@kepler.gl/processors';
import {keplerGlReducer} from '@kepler.gl/reducers';
import {taskMiddleware} from '@kepler.gl/tasks';
import {getLoadDataCommand} from '../commands/load-data-command';
import {getAddLayerCommand} from '../commands/layer-creation-command';
import type {KeplerContext, RoomCommandResult, VisState} from '../commands/types';
import {KeplerMcpBridge} from './bridge-server';

describe('local dataset import through the MCP bridge', () => {
  let bridge: KeplerMcpBridge;
  let socket: WebSocket;
  let directory: string;
  let ctx: KeplerContext;
  let calls: Array<{tool: string; input: Record<string, unknown>}>;

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), 'kepler-local-import-'));
    const store = createStore(keplerGlReducer, applyMiddleware(taskMiddleware));
    store.dispatch(registerEntry({id: 'map'}));
    ctx = {
      getVisState: () => ({
        ...(store.getState() as {map: {visState: VisState}}).map.visState,
        loadOptions: {worker: false}
      }),
      dispatch: action => store.dispatch(wrapTo('map', action))
    } as unknown as KeplerContext;
    const existingData = processCsvData('lat,lng\n37,-122');
    if (!existingData) throw new Error('Failed to parse existing dataset fixture.');
    await ctx.dispatch(
      addDataToMap({
        datasets: [{info: {id: 'existing', label: 'Existing'}, data: existingData}],
        options: {autoCreateLayers: false, centerMap: false}
      })
    );
    const existingLayerResult = (await getAddLayerCommand(ctx).execute({} as any, {
      datasetName: 'existing',
      layerType: 'point'
    })) as RoomCommandResult;
    if (!existingLayerResult.success) {
      throw new Error(`Failed to create existing layer: ${existingLayerResult.error}`);
    }

    bridge = new KeplerMcpBridge({port: 0, callTimeoutMs: 10_000});
    const started = await bridge.start();
    socket = new WebSocket(`ws://127.0.0.1:${started.port}/ws?token=${started.token}`);
    calls = [];
    const commands = {
      'map.load-data': getLoadDataCommand(ctx),
      'map.add-layer': getAddLayerCommand(ctx)
    };
    socket.on('message', async raw => {
      const message = JSON.parse(String(raw));
      if (message.type !== 'call') return;
      calls.push({tool: message.tool, input: message.input});
      const result = await commands[message.tool].execute({} as any, message.input);
      socket.send(JSON.stringify({type: 'result', callId: message.callId, result}));
    });
    await new Promise<void>((resolve, reject) => {
      socket.once('open', resolve);
      socket.once('error', reject);
    });
    socket.send(
      JSON.stringify({
        type: 'hello',
        commands: Object.values(commands).map(command => ({
          id: command.id,
          name: command.name,
          inputSchema: command.inputSchema ? z.toJSONSchema(command.inputSchema) : {type: 'object'}
        }))
      })
    );
    const helloStarted = Date.now();
    while (bridge.getTools().length !== 2) {
      if (Date.now() - helloStarted > 3000) throw new Error('Page handshake timed out.');
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  });

  afterEach(async () => {
    await bridge?.close();
    await rm(directory, {recursive: true, force: true});
  });

  const note = 'x'.repeat(2 * 1024 * 1024 + 1);
  const fixtures = [
    {
      name: 'selected points.csv',
      content: `lat,lng,note\n37,-122,${note}\n`,
      layerType: 'point'
    },
    {
      name: 'selected points.geojson',
      content: JSON.stringify({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {type: 'Point', coordinates: [-122, 37]},
            properties: {note}
          }
        ]
      }),
      layerType: 'geojson'
    }
  ];

  it.each(fixtures)(
    'imports a multi-megabyte $name and immediately adds a layer without replacing the map',
    async ({name, content, layerType}) => {
      const filePath = join(directory, name);
      await writeFile(filePath, content);
      expect(Buffer.byteLength(content)).toBeGreaterThan(2 * 1024 * 1024);
      const existingDataset = ctx.getVisState().datasets.existing;
      const existingLayer = ctx.getVisState().layers[0];

      const result = (await bridge.callTool('map_load-data', {
        filePath,
        datasetName: 'Selected data'
      })) as RoomCommandResult<any>;

      expect(result).toMatchObject({success: true, data: {datasetId: expect.any(String)}});
      const imported = ctx.getVisState().datasets[result.data.datasetId];
      expect(imported).toBeDefined();
      expect(imported.label).toBe('Selected data');
      expect(imported.dataContainer.numRows()).toBe(1);
      const noteIndex = imported.fields.findIndex(field => field.name === 'note');
      expect(noteIndex).toBeGreaterThanOrEqual(0);
      expect(imported.dataContainer.valueAt(0, noteIndex)).toBe(note);
      expect(imported.type).not.toBe(DatasetType.EXTERNALLY_HOSTED);
      expect(imported.metadata?.source).toBeUndefined();
      expect(ctx.getVisState().layers).toEqual([existingLayer]);
      expect(JSON.stringify(calls[0]).length).toBeLessThan(1024);
      expect(calls[0].input.filePath).toBeUndefined();

      expect(
        await bridge.callTool('map_add-layer', {
          datasetName: result.data.datasetId,
          layerType
        })
      ).toMatchObject({success: true});
      const layers = ctx.getVisState().layers;
      expect(layers).toHaveLength(2);
      expect(layers).toContain(existingLayer);
      expect(layers.some(layer => layer.config.dataId === result.data.datasetId)).toBe(true);
      expect(ctx.getVisState().datasets.existing).toBe(existingDataset);
    }
  );

  it('keeps separate datasets when the same filename is imported again', async () => {
    const filePath = join(directory, 'data.csv');
    await writeFile(filePath, 'lat,lng\n37,-122');
    const first = (await bridge.callTool('map_load-data', {filePath})) as RoomCommandResult<any>;
    expect(first.success).toBe(true);
    const firstDataset = ctx.getVisState().datasets[first.data.datasetId];
    await writeFile(filePath, 'lat,lng\n38,-123\n39,-124');
    const second = (await bridge.callTool('map_load-data', {filePath})) as RoomCommandResult<any>;

    expect(second.success).toBe(true);
    expect(second.data.datasetId).not.toBe(first.data.datasetId);
    expect(ctx.getVisState().datasets[first.data.datasetId]).toBe(firstDataset);
    expect(firstDataset.dataContainer.numRows()).toBe(1);
    expect(ctx.getVisState().datasets[second.data.datasetId].dataContainer.numRows()).toBe(2);
    expect(ctx.getVisState().layers).toHaveLength(1);
  });

  it('returns a parse error without changing datasets or layers for truncated GeoJSON', async () => {
    const filePath = join(directory, 'broken.geojson');
    await writeFile(filePath, '{"type":"FeatureCollection","features":[{"type":"Feature"');
    const {datasets, layers} = ctx.getVisState();

    const result = await bridge.callTool('map_load-data', {filePath});

    expect(result).toMatchObject({success: false, error: expect.any(String)});
    expect(result.error).not.toBe('Unknown error');
    expect(ctx.getVisState().datasets).toBe(datasets);
    expect(ctx.getVisState().layers).toBe(layers);
  });
});

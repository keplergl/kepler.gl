// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {COLUMN_MODE_TABLE, LayerClasses} from '@kepler.gl/layers';
import KeplerTable from '@kepler.gl/table';
import {DatasetType} from '@kepler.gl/constants';
import {INITIAL_VIS_STATE, visStateReducer} from '@kepler.gl/reducers';
import {processGeojson} from '@kepler.gl/processors';
import {getLayerOptionsCommand, getSetLayerOptionsCommand} from './layer-options-command';
import {getLayerLabelsCommand, getSetLayerLabelsCommand} from './layer-labels-command';
import type {KeplerContext, RoomCommandResult} from './types';

function setup(type = 'point', metadata = {}) {
  const dataset = new KeplerTable({
    info: {id: 'data', type: type === 'zarr' ? DatasetType.ZARR : DatasetType.LOCAL},
    metadata
  } as any);
  const layer = new LayerClasses[type]({id: 'layer', dataId: dataset.id});
  let state = {...INITIAL_VIS_STATE, layers: [layer], datasets: {[dataset.id]: dataset}};
  const dispatch = jest.fn(action => {
    state = visStateReducer(state, action);
  });
  const ctx = {getVisState: () => state, dispatch} as unknown as KeplerContext;
  return {
    dataset,
    layer,
    dispatch,
    state: () => state,
    ctx,
    set: async (input: unknown) =>
      (await getSetLayerOptionsCommand(ctx).execute({} as any, input)) as RoomCommandResult<any>
  };
}

describe('field-bound layer labels', () => {
  async function labelsContext(type = 'point') {
    const context = setup(type);
    await context.dataset.importData({
      data: {
        fields: [
          {name: 'month', type: 'string'},
          {name: 'count', type: 'integer'}
        ],
        rows: [
          ['January', 10],
          ['February', 20]
        ]
      } as any
    });
    return {
      ...context,
      read: async (input: unknown = {layerId: 'layer'}) =>
        (await getLayerLabelsCommand(context.ctx).execute(
          {} as any,
          input
        )) as RoomCommandResult<any>,
      write: async (input: unknown) =>
        (await getSetLayerLabelsCommand(context.ctx).execute(
          {} as any,
          input
        )) as RoomCommandResult<any>
    };
  }

  it('binds actual fields, preserves omitted styles, orders labels and clears them', async () => {
    const {write, read, state, dataset, dispatch} = await labelsContext();
    const previous = state().layers[0].config;
    const labels = [
      {
        field: 'month',
        size: 28,
        color: [30, 80, 120],
        anchor: 'middle',
        alignment: 'top',
        weight: 700,
        outlineWidth: 0.5,
        outlineColor: [0, 0, 0, 255],
        background: true,
        backgroundColor: [20, 20, 20, 200],
        collisionEnabled: true
      },
      {field: 'count', size: 20}
    ];
    expect(await write({layerId: 'layer', labels})).toMatchObject({success: true, data: {labels}});
    expect(state().layers[0].config.textLabel[0].field).toBe(dataset.fields[0]);
    expect(state().layers[0].config).toMatchObject({
      columns: previous.columns,
      visConfig: previous.visConfig,
      color: previous.color
    });
    expect(
      await write({layerId: 'layer', labels: [{field: 'count'}, {field: 'month', size: 30}]})
    ).toMatchObject({
      success: true,
      data: {
        labels: [
          {field: 'count', size: 20},
          {...labels[0], size: 30}
        ]
      }
    });
    dispatch.mockClear();
    expect(await read()).toMatchObject({
      success: true,
      data: {
        supported: true,
        offsetSupported: false,
        availableFields: [
          {name: 'month', type: 'string'},
          {name: 'count', type: 'integer'}
        ]
      }
    });
    expect(dispatch).not.toHaveBeenCalled();
    expect(await write({layerId: 'layer', labels: []})).toMatchObject({
      success: true,
      data: {labels: []}
    });
    expect(state().layers[0].config.textLabel.every(label => label.field === null)).toBe(true);
  });

  it.each(['grid', 'hexagon', 'cluster'])(
    'uses native %s count-label defaults and pixel offsets',
    async type => {
      const {write, read, state} = await labelsContext(type);
      expect(await read()).toMatchObject({
        data: {
          supported: true,
          offsetSupported: true,
          availableFields: [{name: 'pointCount', type: 'integer'}]
        }
      });
      expect(
        await write({layerId: 'layer', labels: [{field: 'pointCount', offset: [12, -8]}]})
      ).toMatchObject({
        success: true,
        data: {labels: [{field: 'pointCount', offset: [12, -8], anchor: 'middle'}]}
      });
      expect(state().layers[0].config.textLabel[0].field?.fieldIdx).toBe(-1);
      expect(await write({layerId: 'layer', labels: [{field: 'month'}]})).toMatchObject({
        success: false
      });
    }
  );

  it.each([
    {labels: [{field: 'month'}, {field: 'missing'}]},
    {labels: [{field: 'Month'}]},
    {labels: [{field: 'month'}, {field: 'month'}]},
    {labels: [{field: 'month', size: 0}]},
    {labels: [{field: 'month', color: [256, 0, 0]}]},
    {labels: [{field: 'month', anchor: 'left'}]},
    {labels: [{field: 'month', offset: [1, 2]}]},
    {labels: [{field: 'month', unknown: true}]},
    {labels: [{field: null}]},
    {layerId: 'missing', labels: []},
    {}
  ])('rejects invalid label input without mutation: %j', async input => {
    const {write, dispatch} = await labelsContext();
    expect(await write({layerId: 'layer', ...input})).toMatchObject({success: false});
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('reports unsupported layers and missing datasets without mutating them', async () => {
    const {write, read, dispatch, state} = await labelsContext('heatmap');
    expect(await read()).toMatchObject({data: {supported: false, availableFields: []}});
    expect(await write({layerId: 'layer', labels: [{field: 'month'}]})).toMatchObject({
      success: false
    });
    delete state().datasets.data;
    expect(await read()).toMatchObject({success: false});
    expect(await write({layerId: 'layer', labels: []})).toMatchObject({success: false});
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('does not advertise field labels for GeoJSON table column mode', async () => {
    const {state, read, write, dispatch} = await labelsContext('geojson');
    expect(await read()).toMatchObject({data: {supported: true}});
    state().layers[0].config.columnMode = COLUMN_MODE_TABLE;
    expect(await read()).toMatchObject({data: {supported: false, availableFields: []}});
    expect(await write({layerId: 'layer', labels: [{field: 'month'}]})).toMatchObject({
      success: false
    });
    expect(dispatch).not.toHaveBeenCalled();
  });
});

describe('layer visual options', () => {
  it.each([
    [
      'point',
      {glowEnabled: true, glowExtent: 3, pulseEnabled: true, pulseMode: 'ripple', pulseSpeed: 2}
    ],
    [
      'heatmap',
      {surfaceEnabled: true, surfaceHeight: 2000, surfaceLighting: false, surfaceContours: true}
    ],
    [
      'flowField',
      {linesPerScreen: 1000, strokeWidth: 2, trailLength: 30, cycleSeconds: 40, smoothing: 2}
    ],
    ['3D', {scenegraph: 'https://example.com/tree.glb', sizeScale: 2}]
  ])(
    'patches %s options through the reducer without changing unrelated settings',
    async (type, options) => {
      const {set, state, layer} = setup(type as string);
      const previous = {...layer.config.visConfig};
      expect(await set({layerId: layer.id, options})).toMatchObject({success: true});
      expect(state().layers[0].config.visConfig).toEqual({...previous, ...(options as object)});
    }
  );

  it('discovers settings and limits without mutating the map', async () => {
    const {ctx, dispatch} = setup();
    const result = (await getLayerOptionsCommand(ctx).execute({} as any, {
      layerId: 'layer'
    })) as RoomCommandResult<any>;
    expect(result.data.settings.glowExtent).toEqual({type: 'number', value: 2, range: [1, 5]});
    expect(result.data.settings.pulseMode.options).toEqual(['pulse', 'ripple']);
    expect(result.data.settings.radiusRange).toEqual({
      type: 'number',
      isRanged: true,
      value: [0, 50],
      range: [0, 500]
    });
    expect(result.data.settings.colorRange).toBeUndefined();
    expect(dispatch).not.toHaveBeenCalled();
  });

  it.each([
    ['point', 'radiusRange', [1, 8]],
    ['geojson', 'radiusRange', [1, 8]],
    ['geojson', 'sizeRange', [0, 200]],
    ['geojson', 'heightRange', [0, 1000]],
    ['grid', 'percentile', [10, 90]],
    ['hexagonId', 'coverageRange', [0.1, 0.9]],
    ['point', 'radiusRange', [8, 1]],
    ['point', 'radiusRange', [2, 2]]
  ])('updates and discovers %s %s: %j', async (type, key, value) => {
    const {set, state, ctx, layer} = setup(type as string);
    const previous = {...layer.config.visConfig};
    expect(await set({layerId: layer.id, options: {[key as string]: value}})).toMatchObject({
      success: true
    });
    expect(state().layers[0].config.visConfig).toEqual({...previous, [key as string]: value});
    const result = (await getLayerOptionsCommand(ctx).execute({} as any, {
      layerId: layer.id
    })) as RoomCommandResult<any>;
    expect(result.data.settings[key as string]).toMatchObject({
      type: 'number',
      isRanged: true,
      value,
      range: layer.visConfigSettings[key as string].range
    });
  });

  it.each(
    [
      [],
      [1],
      [1, 8, 9],
      ['1', 8],
      [1, null],
      [true, 8],
      [NaN, 8],
      [1, Infinity],
      [-1, 8],
      [1, 501],
      [501, 8],
      [1, -1],
      8,
      null,
      {min: 1, max: 8}
    ].map(value => [value])
  )('rejects invalid radiusRange %j without changing any settings', async value => {
    const {set, state, dispatch} = setup('geojson');
    expect(await set({layerId: 'layer', options: {radiusRange: [1, 8]}})).toMatchObject({
      success: true
    });
    const previous = {...state().layers[0].config.visConfig};
    dispatch.mockClear();
    expect(
      await set({layerId: 'layer', options: {opacity: 0.2, radiusRange: value}})
    ).toMatchObject({
      success: false,
      error: expect.stringContaining('radiusRange')
    });
    expect(dispatch).not.toHaveBeenCalled();
    expect(state().layers[0].config.visConfig).toEqual(previous);
  });

  it.each([
    ['point', 'opacity', [0.1, 0.9]],
    ['point', 'glowEnabled', [0, 1]],
    ['point', 'pulseMode', [0, 1]],
    ['point', 'colorRange', [1, 8]],
    ['heatmap', 'radiusRange', [1, 8]],
    ['hexagonId', 'coverageRange', [0, 2]],
    ['grid', 'percentile', [-1, 90]]
  ])('rejects incompatible or out-of-bounds %s %s', async (type, key, value) => {
    const {set, dispatch} = setup(type as string);
    expect(await set({layerId: 'layer', options: {[key as string]: value}})).toMatchObject({
      success: false,
      error: expect.stringContaining(key as string)
    });
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('applies both radius endpoints to GeoJSON points sized by a field', async () => {
    const {dataset, layer, state, set} = setup('geojson');
    const data = processGeojson({
      type: 'FeatureCollection',
      features: [10, 15, 20].map((size, index) => ({
        type: 'Feature',
        geometry: {type: 'Point', coordinates: [index, 0]},
        properties: {size}
      }))
    } as any);
    if (!data) throw new Error('Expected processed GeoJSON data.');
    await dataset.importData({data});
    layer.updateLayerConfig({
      columns: {geojson: {value: '_geojson', fieldIdx: 0}},
      radiusField: dataset.fields.find(field => field.name === 'size'),
      radiusScale: 'linear',
      radiusDomain: [10, 20]
    });
    for (const radiusRange of [
      [1, 8],
      [2, 8],
      [2, 10]
    ]) {
      expect(await set({layerId: layer.id, options: {radiusRange}})).toMatchObject({success: true});
      const updated = state().layers[0];
      const rendered = updated.renderLayer({
        data: updated.formatLayerData({[dataset.id]: dataset}, {}),
        gpuFilter: dataset.gpuFilter,
        idx: 0,
        visible: true,
        layerCallbacks: {},
        interactionConfig: {tooltip: {enabled: false}},
        mapState: {zoom: 12, width: 800, height: 600}
      } as any)[0];
      expect(rendered.props.data.map(rendered.props.getPointRadius)).toEqual([
        radiusRange[0],
        (radiusRange[0] + radiusRange[1]) / 2,
        radiusRange[1]
      ]);
    }
  });

  it.each<Record<string, unknown>>([
    {options: {glowExtent: 6}},
    {options: {glowExtent: NaN}},
    {options: {glowEnabled: 'true'}},
    {options: {pulseMode: 'invalid'}},
    {options: {surfaceEnabled: true}},
    {options: {constructor: 'invalid'}},
    {options: {pulseTimeField: 'missing'}},
    {options: {}},
    {options: {glowEnabled: true, unsupported: 1}},
    {layerId: 'missing', options: {glowEnabled: true}},
    {zarr: {opacity: 0.2}},
    {wmsLayer: 'missing'}
  ])('rejects invalid options atomically: %j', async args => {
    const {set, dispatch} = setup();
    expect((await set({layerId: 'layer', ...args})).success).toBe(false);
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('selects a named WMS service layer from its metadata', async () => {
    const serviceLayer = {name: 'elevation', title: 'Elevation'};
    const {set, state} = setup('wms', {layers: [serviceLayer]});
    expect((await set({layerId: 'layer', wmsLayer: 'elevation'})).success).toBe(true);
    expect(state().layers[0].config.visConfig.wmsLayer).toEqual(serviceLayer);
  });
});

it('updates Zarr dimensions and axes, resets incompatible selections on variable changes, and rejects invalid indexes', async () => {
  const band = {name: 'band', size: 3};
  const variables = [
    {path: 'temperature', nonSpatialDims: [band], dataRange: [250, 310]},
    {path: 'rain', nonSpatialDims: [], dataRange: [0, 100]}
  ];
  const {set, state, dispatch, ctx} = setup('zarr', {
    url: 'https://example.com/data.zarr',
    variables
  });
  expect(
    await set({
      layerId: 'layer',
      zarr: {variable: 'temperature', axis: {kind: 'dimension', dimension: 'band'}, frame: 2}
    })
  ).toMatchObject({success: true});
  expect(state().layers[0].config.visConfig).toMatchObject({
    zarrVariable: 'temperature',
    zarrFrame: 2
  });
  const details = (await getLayerOptionsCommand(ctx).execute({} as any, {
    layerId: 'layer'
  })) as RoomCommandResult<any>;
  expect(details.data.zarr.variables[0]).toEqual({
    path: 'temperature',
    dimensions: [band],
    dataRange: [250, 310]
  });
  expect(await set({layerId: 'layer', zarr: {opacity: 0.5}})).toMatchObject({success: true});
  expect(state().layers[0].config.visConfig).toMatchObject({zarrFrame: 2, opacity: 0.5});
  dispatch.mockClear();
  expect(await set({layerId: 'layer', zarr: {dimensionIndexes: {band: 9}}})).toMatchObject({
    success: false
  });
  expect(dispatch).not.toHaveBeenCalled();
  expect(await set({layerId: 'layer', zarr: {variable: 'rain'}})).toMatchObject({success: true});
  expect(state().layers[0].config.visConfig).toMatchObject({
    zarrVariable: 'rain',
    dimensionIndexes: {},
    zarrFrame: 0,
    rescale: [0, 100],
    opacity: 0.5
  });
});

it('only accepts timestamp fields for event pulses', async () => {
  const {dataset, set, dispatch, state} = setup();
  dataset.fields.push(
    {name: 'date', type: 'date'} as any,
    {name: 'time', type: 'timestamp'} as any
  );
  expect(await set({layerId: 'layer', options: {pulseTimeField: 'date'}})).toMatchObject({
    success: false,
    error: expect.stringContaining('timestamp field')
  });
  expect(dispatch).not.toHaveBeenCalled();
  expect(await set({layerId: 'layer', options: {pulseTimeField: 'time'}})).toMatchObject({
    success: true
  });
  expect(state().layers[0].config.visConfig.pulseTimeField).toBe('time');
});

it('preserves automatic Zarr stretching while updating selections and opacity', async () => {
  const {set, state} = setup('zarr', {
    url: 'https://example.com/data.zarr',
    variables: [{path: 'temperature', nonSpatialDims: [{name: 'band', size: 3}]}]
  });
  expect(state().layers[0].config.visConfig.rescale).toBeNull();
  for (const zarr of [
    {dimensionIndexes: {band: 1}},
    {axis: {kind: 'dimension', dimension: 'band'}, frame: 2},
    {opacity: 0.5}
  ]) {
    expect(await set({layerId: 'layer', zarr})).toMatchObject({success: true});
    expect(state().layers[0].config.visConfig.rescale).toBeNull();
  }
  expect(state().layers[0].config.visConfig).toMatchObject({zarrFrame: 2, opacity: 0.5});
});

describe('feature age styling', () => {
  const style = {
    timeField: 'observed',
    stops: [
      {ageMs: 0, opacity: 1, color: [255, 0, 0]},
      {ageMs: 14 * 86400000, opacity: 0.5},
      {ageMs: 35 * 86400000, opacity: 0.2, color: [0, 0, 255]}
    ]
  };

  it('updates ranges and age bands together and rejects invalid combined updates atomically', async () => {
    const {dataset, set, state, ctx, dispatch} = setup('geojson');
    dataset.fields.push({name: 'observed', type: 'timestamp'} as any);
    const previous = {...state().layers[0].config.visConfig};
    expect(
      await set({layerId: 'layer', options: {radiusRange: [1, 8]}, ageStyle: style})
    ).toMatchObject({success: true});
    expect(state().layers[0].config.visConfig).toEqual({
      ...previous,
      radiusRange: [1, 8],
      ageStyle: style
    });
    expect(await getLayerOptionsCommand(ctx).execute({} as any, {layerId: 'layer'})).toMatchObject({
      success: true,
      data: {settings: {radiusRange: {value: [1, 8], isRanged: true}}, ageStyle: style}
    });

    const updated = {...state().layers[0].config.visConfig};
    dispatch.mockClear();
    for (const input of [
      {options: {radiusRange: [1, 501]}, ageStyle: null},
      {options: {radiusRange: [2, 10]}, ageStyle: {...style, timeField: 'missing'}}
    ]) {
      expect(await set({layerId: 'layer', ...input})).toMatchObject({success: false});
      expect(dispatch).not.toHaveBeenCalled();
      expect(state().layers[0].config.visConfig).toEqual(updated);
    }
  });

  it.each(['point', 'arc', 'line', 'icon', 'hexagonId', 's2', 'a5', 'geohash', 'geojson'])(
    'sets, inspects and clears %s age bands without changing other settings',
    async type => {
      const {dataset, set, state, ctx, layer} = setup(type);
      expect(layer.config.visConfig).not.toHaveProperty('ageStyle');
      dataset.fields.push({name: 'observed', type: 'timestamp'} as any);
      const previous = {...layer.config.visConfig};
      expect(await set({layerId: 'layer', ageStyle: style})).toMatchObject({success: true});
      expect(state().layers[0].config.visConfig).toEqual({...previous, ageStyle: style});
      expect(
        await getLayerOptionsCommand(ctx).execute({} as any, {layerId: 'layer'})
      ).toMatchObject({
        success: true,
        data: {ageStyle: style}
      });
      expect(await set({layerId: 'layer', options: {opacity: 0.4}})).toMatchObject({success: true});
      expect(state().layers[0].config.visConfig.ageStyle).toEqual(style);
      expect(await set({layerId: 'layer', ageStyle: null})).toMatchObject({success: true});
      expect(state().layers[0].config.visConfig).toEqual({...previous, opacity: 0.4});
      expect(
        await getLayerOptionsCommand(ctx).execute({} as any, {layerId: 'layer'})
      ).toMatchObject({data: {ageStyle: null}});
    }
  );

  it.each([
    {},
    {...style, timeField: 'missing'},
    {...style, timeField: 'number'},
    {...style, stops: []},
    {...style, stops: [{ageMs: 1, opacity: 1}]},
    {...style, stops: [{ageMs: -1, opacity: 1}]},
    {...style, stops: [{ageMs: 0}]},
    {...style, stops: [{ageMs: 0, opacity: 2}]},
    {...style, stops: [{ageMs: 0, opacity: NaN}]},
    {...style, stops: [{ageMs: 0, color: [0, 256, 0]}]},
    {...style, stops: [{ageMs: 0, color: [0, 0]}]},
    {...style, stops: [style.stops[0], style.stops[0]]},
    {...style, stops: [style.stops[0], style.stops[2], style.stops[1]]}
  ])('rejects invalid age styles atomically: %j', async ageStyle => {
    const {dataset, set, dispatch} = setup();
    dataset.fields.push(
      {name: 'observed', type: 'timestamp'} as any,
      {name: 'number', type: 'real'} as any
    );
    expect(await set({layerId: 'layer', options: {opacity: 0.4}, ageStyle})).toMatchObject({
      success: false
    });
    expect(dispatch).not.toHaveBeenCalled();
  });

  it.each(['heatmap', 'cluster', 'grid', 'hexagon', 'trip', '3D', 'rasterTile', 'flow'])(
    'rejects age styling on %s',
    async type => {
      const {set, dispatch} = setup(type);
      expect(await set({layerId: 'layer', ageStyle: style})).toMatchObject({success: false});
      expect(dispatch).not.toHaveBeenCalled();
    }
  );
});

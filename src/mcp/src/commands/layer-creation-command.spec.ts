// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {getAddLayerCommand} from './layer-creation-command';
import KeplerTable from '@kepler.gl/table';
import {ALL_FIELD_TYPES, DatasetType} from '@kepler.gl/constants';
import {INITIAL_VIS_STATE, visStateReducer} from '@kepler.gl/reducers';

/**
 * Build a plain JS dataset with two point lat/lng pairs (origin + destination)
 * plus a numeric flow-magnitude column — the shape the flow layer branch of
 * guessDefaultLayer consumes. `findPointFieldPairs` keys off `_lat`/`_lng`
 * suffixes, so origin_lat/origin_lng and dest_lat/dest_lng pair up.
 */
async function makeTwoPairTable() {
  const table = new KeplerTable({color: [255, 0, 0]} as any);
  await table.importData({
    data: {
      rows: [
        // origin_lat, origin_lng, dest_lat, dest_lng, count
        [37.77, -122.42, 37.79, -122.41, 5],
        [37.78, -122.45, 37.76, -122.4, 12],
        [37.74, -122.44, 37.8, -122.39, 3]
      ],
      fields: [
        {name: 'origin_lat', type: ALL_FIELD_TYPES.real},
        {name: 'origin_lng', type: ALL_FIELD_TYPES.real},
        {name: 'dest_lat', type: ALL_FIELD_TYPES.real},
        {name: 'dest_lng', type: ALL_FIELD_TYPES.real},
        {name: 'count', type: ALL_FIELD_TYPES.integer}
      ]
    } as any
  });
  return table;
}

function makeCtx(table: KeplerTable) {
  let dispatched: any = null;
  const ctx = {
    getVisState: () => ({datasets: {[table.id as string]: table}, layers: []}),
    dispatch: (action: any) => {
      dispatched = action;
    },
    getValuesFromDataset: () => [],
    getMapBoundary: () => null,
    getMapboxToken: () => undefined,
    getDatasetContext: () => ''
  };
  return {ctx, getDispatched: () => dispatched};
}

type CommandResult = {success: boolean; error?: string; data?: Record<string, unknown>};

describe('map.add-layer (surface layers)', () => {
  it('creates weighted contours from explicit coordinates instead of the first detected pair', async () => {
    const table = await makeTwoPairTable();
    const {ctx, getDispatched} = makeCtx(table);
    const result = (await getAddLayerCommand(ctx as any).execute({} as any, {
      datasetName: table.label,
      layerType: 'contour',
      latitudeColumn: 'dest_lat',
      longitudeColumn: 'dest_lng',
      contour: {weightColumn: 'count', levels: 9, smoothing: 2}
    })) as CommandResult;
    expect(result.success).toBe(true);
    expect(getDispatched().config).toMatchObject({
      type: 'contour',
      config: {
        columnMode: 'grid',
        columns: {lat: 'dest_lat', lng: 'dest_lng', value: 'count'},
        visConfig: {levels: 9, smoothing: 2}
      }
    });
    expect(result.data?.layerId).toBe(getDispatched().config.id);
    const state = visStateReducer(
      {...INITIAL_VIS_STATE, datasets: {[table.id]: table}},
      getDispatched()
    );
    expect(state.layers).toHaveLength(1);
    expect(state.layers[0].type).toBe('contour');
    expect(state.layers[0].config.columns.value.value).toBe('count');
    expect(state.layers[0].config.visConfig.levels).toBe(9);
  });

  it.each(['contour', 'voronoi'])('creates %s from detected coordinates', async layerType => {
    const table = await makeTwoPairTable();
    const {ctx, getDispatched} = makeCtx(table);
    const result = (await getAddLayerCommand(ctx as any).execute({} as any, {
      datasetName: table.label,
      layerType,
      voronoi: {boundsPadding: 25}
    })) as CommandResult;
    expect(result.success).toBe(true);
    expect(getDispatched().config.config.columns).toMatchObject({
      lat: 'origin_lat',
      lng: 'origin_lng'
    });
    if (layerType === 'contour') expect(getDispatched().config.config.columns.value).toBeNull();
    else expect(getDispatched().config.config.visConfig.boundsPadding).toBe(25);
  });

  it.each(['contour', 'voronoi'])('creates %s from an explicit geometry field', async layerType => {
    const table = new KeplerTable({color: [255, 0, 0]} as any);
    await table.importData({
      data: {
        fields: [{name: '_geojson', type: ALL_FIELD_TYPES.geojson}],
        rows: [
          [{type: 'Feature', geometry: {type: 'Point', coordinates: [-122, 37]}, properties: {}}]
        ]
      } as any
    });
    const {ctx, getDispatched} = makeCtx(table);
    const result = (await getAddLayerCommand(ctx as any).execute({} as any, {
      datasetName: table.label,
      layerType,
      geometryColumn: '_geojson'
    })) as CommandResult;
    expect(result.success).toBe(true);
    expect(getDispatched().config.config).toMatchObject({
      columnMode: 'geojson',
      columns: {geojson: '_geojson'}
    });
  });

  it.each([
    {layerType: 'contour', latitudeColumn: 'origin_lat'},
    {layerType: 'voronoi', latitudeColumn: 'missing', longitudeColumn: 'origin_lng'},
    {layerType: 'contour', contour: {weightColumn: 'missing'}},
    {layerType: 'contour', contour: {levels: 100}},
    {layerType: 'voronoi', geometryColumn: 'count'},
    {layerType: 'contour', colorBy: 'count'},
    {layerType: 'zarr'}
  ])('rejects invalid surface input without mutation: %j', async options => {
    const table = await makeTwoPairTable();
    const {ctx, getDispatched} = makeCtx(table);
    const result = (await getAddLayerCommand(ctx as any).execute({} as any, {
      datasetName: table.label,
      ...options
    })) as CommandResult;
    expect(result.success).toBe(false);
    expect(getDispatched()).toBeNull();
  });

  async function makeZarrTable() {
    const table = new KeplerTable({color: [255, 0, 0], info: {type: DatasetType.ZARR}} as any);
    const band = {name: 'band', size: 3};
    table.metadata = {
      url: 'https://example.com/data.zarr',
      axes: ['band', 'y', 'x'],
      xAxisIndex: 2,
      yAxisIndex: 1,
      nonSpatialDims: [band],
      levels: [],
      variables: [
        {
          path: 'temperature',
          name: 'temperature',
          displayName: 'temperature',
          shape: [3, 2, 2],
          chunks: [1, 2, 2],
          dtype: 'float32',
          nonSpatialDims: [band],
          dataRange: [250, 310]
        }
      ]
    };
    return table;
  }

  it('selects a Zarr variable, dimension axis/frame and raster range', async () => {
    const table = await makeZarrTable();
    const {ctx, getDispatched} = makeCtx(table);
    const result = (await getAddLayerCommand(ctx as any).execute({} as any, {
      datasetName: table.label,
      layerType: 'zarr',
      zarr: {
        variable: 'temperature',
        axis: {kind: 'dimension', dimension: 'band'},
        frame: 2,
        rescale: [260, 300]
      }
    })) as CommandResult;
    expect(result.success).toBe(true);
    expect(getDispatched().config.config.visConfig).toMatchObject({
      zarrVariable: 'temperature',
      zarrAxis: {kind: 'dimension', dimension: 'band'},
      zarrFrame: 2,
      rescale: [260, 300]
    });
  });

  it('preserves automatic rescaling when store metadata has a constant range', async () => {
    const table = await makeZarrTable();
    table.metadata.variables[0].dataRange = [5, 5];
    const {ctx, getDispatched} = makeCtx(table);
    const result = (await getAddLayerCommand(ctx as any).execute({} as any, {
      datasetName: table.label,
      layerType: 'zarr'
    })) as CommandResult;
    expect(result).toMatchObject({success: true});
    expect(getDispatched().config.config.visConfig.rescale).toBeNull();
  });

  it.each([
    {variable: 'missing'},
    {dimensionIndexes: {band: 3}},
    {dimensionIndexes: {missing: 0}},
    {axis: {kind: 'dimension', dimension: 'missing'}},
    {axis: {kind: 'dimension', dimension: 'band'}, frame: 3},
    {frame: 0},
    {rescale: [300, 260]}
  ])('rejects invalid Zarr selection without mutation: %j', async zarr => {
    const table = await makeZarrTable();
    const {ctx, getDispatched} = makeCtx(table);
    const result = (await getAddLayerCommand(ctx as any).execute({} as any, {
      datasetName: table.label,
      layerType: 'zarr',
      zarr
    })) as CommandResult;
    expect(result.success).toBe(false);
    expect(getDispatched()).toBeNull();
  });
});

describe('map.add-layer (point)', () => {
  it('creates an explicitly requested Point even when every row has an icon', async () => {
    const table = new KeplerTable({color: [255, 0, 0]} as any);
    await table.importData({
      data: {
        rows: [[37.77, -122.42, 'place']],
        fields: [
          {name: 'lat', type: ALL_FIELD_TYPES.real},
          {name: 'lng', type: ALL_FIELD_TYPES.real},
          {name: 'icon', type: ALL_FIELD_TYPES.string}
        ]
      } as any
    });
    const {ctx, getDispatched} = makeCtx(table);
    const result = (await getAddLayerCommand(ctx as any).execute({} as any, {
      datasetName: table.label,
      layerType: 'point'
    })) as CommandResult;

    expect(result.success).toBe(true);
    expect(getDispatched()).toMatchObject({
      config: {type: 'point', config: {columns: {lat: 'lat', lng: 'lng'}}}
    });
  });
});

describe('map.add-layer (flow)', () => {
  it('builds a flow layer from the first two point field pairs, with weighted count', async () => {
    const table = await makeTwoPairTable();
    const {ctx, getDispatched} = makeCtx(table);

    const cmd = getAddLayerCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      datasetName: table.label,
      layerType: 'flow',
      layerName: 'Trips flow',
      countColumn: 'count'
    })) as CommandResult;

    expect(result.success).toBe(true);
    const action = getDispatched();
    expect(action).toBeTruthy();
    expect(action.type).toMatch(/ADD_LAYER/);
    expect(action.config.type).toBe('flow');
    expect(action.config.config.label).toBe('Trips flow');
    // buildLayerConfig flattens the column refs to column names. Optional
    // columns the flow layer initializes empty (sourceName/targetName/targetH3)
    // arrive as `null` — the reducer's validateLayersByDatasets runs with
    // allowEmptyColumn, so subset-match on the meaningful ones.
    expect(action.config.config.columns).toMatchObject({
      lat0: 'origin_lat',
      lng0: 'origin_lng',
      lat1: 'dest_lat',
      lng1: 'dest_lng',
      count: 'count'
    });
    // count column must remain attached to the flow layer as the magnitude
    expect(action.config.config.columns.count).toBe('count');
  });

  it('still builds a flow layer without a count column (all weights 1)', async () => {
    const table = await makeTwoPairTable();
    const {ctx, getDispatched} = makeCtx(table);

    const cmd = getAddLayerCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      datasetName: table.label,
      layerType: 'flow'
    })) as CommandResult;

    expect(result.success).toBe(true);
    const action = getDispatched();
    expect(action.config.type).toBe('flow');
    expect(action.config.config.columns).toMatchObject({
      lat0: 'origin_lat',
      lng0: 'origin_lng',
      lat1: 'dest_lat',
      lng1: 'dest_lng'
    });
    // no count column → magnitude stays unset (null), so all flows weigh 1
    expect(action.config.config.columns.count).toBeNull();
  });

  it('rejects an invalid layerType instead of falling back to a default layer', async () => {
    const table = await makeTwoPairTable();
    const {ctx, getDispatched} = makeCtx(table);

    const cmd = getAddLayerCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      datasetName: table.label,
      layerType: 'bogus'
    })) as CommandResult;

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/Invalid layerType/);
    // no layer added
    expect(getDispatched()).toBeNull();
  });
});

/**
 * Build a vector-field dataset: lat/lng sample points plus direction columns.
 * `vector` picks the encoding — u/v components or speed/direction.
 */
async function makeVectorTable(vector: 'uv' | 'speedDir') {
  const table = new KeplerTable({color: [255, 0, 0]} as any);
  const vectorFields =
    vector === 'uv'
      ? [
          {name: 'u', type: ALL_FIELD_TYPES.real},
          {name: 'v', type: ALL_FIELD_TYPES.real}
        ]
      : [
          {name: 'wind_speed', type: ALL_FIELD_TYPES.real},
          {name: 'wind_dir', type: ALL_FIELD_TYPES.real}
        ];
  await table.importData({
    data: {
      rows: [
        [37.77, -122.42, 1.5, 0.4],
        [37.78, -122.45, 2.1, -0.2],
        [37.74, -122.44, 0.9, 1.1]
      ],
      fields: [
        {name: 'lat', type: ALL_FIELD_TYPES.real},
        {name: 'lng', type: ALL_FIELD_TYPES.real},
        ...vectorFields
      ]
    } as any
  });
  return table;
}

describe('map.add-layer (flowField)', () => {
  it('builds a UV flow field from lat/lng + u/v, with auto-detected columns', async () => {
    const table = await makeVectorTable('uv');
    const {ctx, getDispatched} = makeCtx(table);

    const cmd = getAddLayerCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      datasetName: table.label,
      layerType: 'flowField',
      layerName: 'Wind field'
    })) as CommandResult;

    expect(result.success).toBe(true);
    const action = getDispatched();
    expect(action.config.type).toBe('flowField');
    expect(action.config.config.columnMode).toBe('UV');
    expect(action.config.config.columns).toMatchObject({
      lat: 'lat',
      lng: 'lng',
      u: 'u',
      v: 'v'
    });
  });

  it('builds a SPEED_DIR flow field from explicitly named speed/direction columns', async () => {
    const table = await makeVectorTable('speedDir');
    const {ctx, getDispatched} = makeCtx(table);

    const cmd = getAddLayerCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      datasetName: table.label,
      layerType: 'flowField',
      flowField: {
        mode: 'SPEED_DIR',
        speedColumn: 'wind_speed',
        directionColumn: 'wind_dir',
        colorBySpeed: true
      }
    })) as CommandResult;

    expect(result.success).toBe(true);
    const action = getDispatched();
    expect(action.config.type).toBe('flowField');
    expect(action.config.config.columnMode).toBe('SPEED_DIR');
    expect(action.config.config.columns).toMatchObject({
      lat: 'lat',
      lng: 'lng',
      speed: 'wind_speed',
      direction: 'wind_dir'
    });
    expect(action.config.config.visConfig.colorBySpeed).toBe(true);
  });

  it('errors clearly when the dataset has no vector columns', async () => {
    const table = await makeTwoPairTable();
    const {ctx, getDispatched} = makeCtx(table);

    const cmd = getAddLayerCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      datasetName: table.label,
      layerType: 'flowField'
    })) as CommandResult;

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/needs a vector/);
    expect(getDispatched()).toBeNull();
  });
});

describe('map.add-layer (colorMap validation)', () => {
  it('finds a unique category that appears only later in a large dataset (full scan)', async () => {
    // 20k rows; the wanted category 'z' exists ONLY at index 10000 — beyond the
    // old prefix scan (first 10k rows), so a bounded sample would falsely flag
    // it as missing. The full scan (with early-exit) finds it.
    const rows: any[] = [];
    for (let i = 0; i < 20000; i++) {
      rows.push([37.77, -122.42, i === 10000 ? 'z' : 'a']);
    }
    const table = new KeplerTable({color: [255, 0, 0]} as any);
    await table.importData({
      data: {
        rows,
        fields: [
          {name: 'lat', type: ALL_FIELD_TYPES.real},
          {name: 'lng', type: ALL_FIELD_TYPES.real},
          {name: 'category', type: ALL_FIELD_TYPES.string}
        ]
      } as any
    });
    const {ctx, getDispatched} = makeCtx(table);

    const cmd = getAddLayerCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      datasetName: table.label,
      layerType: 'point',
      colorBy: 'category',
      colorType: 'unique',
      colorMap: [{value: 'z', color: '#1f77b4'}]
    })) as CommandResult;

    expect(result.success).toBe(true);
    expect(getDispatched()).toBeTruthy();
  });

  it('still rejects a category that does not exist anywhere in the data', async () => {
    const table = await makeTwoPairTable();
    const {ctx, getDispatched} = makeCtx(table);

    const cmd = getAddLayerCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      datasetName: table.label,
      layerType: 'flow',
      colorBy: 'count',
      colorType: 'unique',
      colorMap: [{value: 'nope', color: '#1f77b4'}]
    })) as CommandResult;

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/not found in field/);
    expect(getDispatched()).toBeNull();
  });
});

describe('map.add-layer (additional layers)', () => {
  it.each(['a5', 'geohash', 'icon', '3D'])(
    'creates %s with explicit field mappings',
    async layerType => {
      const table = new KeplerTable({info: {id: 'extra', label: 'Extra'}} as any);
      await table.importData({
        data: {
          fields: [
            {name: 'y', type: ALL_FIELD_TYPES.real},
            {name: 'x', type: ALL_FIELD_TYPES.real},
            {name: 'cell', type: ALL_FIELD_TYPES.string},
            {name: 'symbol', type: ALL_FIELD_TYPES.string}
          ],
          rows: [[37, -122, layerType === 'a5' ? '8100000000000000' : '9q8yy', 'marker']]
        } as any
      });
      const {ctx, getDispatched} = makeCtx(table);
      const columns = ['a5', 'geohash'].includes(layerType)
        ? {token: 'cell'}
        : {...{lat: 'y', lng: 'x'}, ...(layerType === 'icon' ? {icon: 'symbol'} : {})};
      const result = (await getAddLayerCommand(ctx as any).execute({} as any, {
        datasetName: table.id,
        layerType,
        columns,
        ...(layerType === '3D' ? {options: {scenegraph: 'https://example.com/tree.glb'}} : {})
      })) as CommandResult;
      expect(result).toMatchObject({success: true});
      expect(getDispatched().config).toMatchObject({type: layerType, config: {columns}});
    }
  );

  it.each([
    [
      'bitmap',
      DatasetType.BITMAP,
      {imageUrl: 'https://example.com/image.png', bounds: [-10, -10, 10, 10]}
    ],
    ['vectorTile', DatasetType.VECTOR_TILE, {}],
    ['rasterTile', DatasetType.RASTER_TILE, {}],
    ['wms', DatasetType.WMS_TILE, {layers: [{name: 'roads'}]}],
    ['tile3d', DatasetType.TILE_3D, {}]
  ])('creates %s from the matching remote dataset', async (layerType, type, metadata) => {
    const table = new KeplerTable({info: {id: 'remote', type}, metadata} as any);
    const {ctx, getDispatched} = makeCtx(table);
    expect(
      await getAddLayerCommand(ctx as any).execute({} as any, {datasetName: table.id, layerType})
    ).toMatchObject({success: true});
    expect(getDispatched().config.type).toBe(layerType);
  });

  it.each([
    {layerType: 'bitmap'},
    {layerType: '3D', columns: {lat: 'missing', lng: 'dest_lng'}},
    {layerType: '3D', columns: {lat: 'origin_lat', lng: 'origin_lng', invalid: 'count'}},
    {layerType: 'icon'},
    {layerType: 'a5', columns: {}},
    {layerType: 'point', options: {glowExtent: 500}}
  ])('rejects missing, mismatched or invalid inputs: %j', async args => {
    const table = await makeTwoPairTable();
    const {ctx, getDispatched} = makeCtx(table);
    expect(
      await getAddLayerCommand(ctx as any).execute({} as any, {datasetName: table.id, ...args})
    ).toMatchObject({success: false});
    expect(getDispatched()).toBeNull();
  });
});

it('applies point effects when explicit coordinate names require a new layer instance', async () => {
  const table = new KeplerTable({info: {id: 'coordinates', label: 'Coordinates'}} as any);
  await table.importData({
    data: {
      fields: [
        {name: 'y', type: ALL_FIELD_TYPES.real},
        {name: 'x', type: ALL_FIELD_TYPES.real}
      ],
      rows: [[37, -122]]
    } as any
  });
  const {ctx, getDispatched} = makeCtx(table);
  expect(
    await getAddLayerCommand(ctx as any).execute({} as any, {
      datasetName: table.id,
      layerType: 'point',
      latitudeColumn: 'y',
      longitudeColumn: 'x',
      options: {glowEnabled: true}
    })
  ).toMatchObject({success: true});
  expect(getDispatched().config.config.visConfig.glowEnabled).toBe(true);
});

it.each(['Feature', 'Collection'])(
  'initializes the raster band/preset and STAC search for a %s',
  async type => {
    const metadata = {
      type,
      stac_version: '1.1.0',
      [type === 'Collection' ? 'item_assets' : 'assets']: {
        temperature: {
          href: 'https://example.com/temperature.tif',
          type: 'image/tiff; application=geotiff',
          bands: [{name: 'temperature', data_type: 'float32'}]
        }
      }
    };
    const table = new KeplerTable({
      info: {id: 'raster', type: DatasetType.RASTER_TILE},
      metadata
    } as any);
    await table.importData({data: {fields: [], rows: []}});
    const {ctx, getDispatched} = makeCtx(table);
    expect(
      await getAddLayerCommand(ctx as any).execute({} as any, {
        datasetName: table.id,
        layerType: 'rasterTile'
      })
    ).toMatchObject({success: true});
    expect(getDispatched().config.config.visConfig).toMatchObject({
      singleBandName: 'temperature',
      preset: 'singleBand',
      useSTACSearching: type === 'Collection'
    });
  }
);

it('rejects date-only event pulse fields during layer creation', async () => {
  const table = await makeTwoPairTable();
  table.fields.push({name: 'date', type: ALL_FIELD_TYPES.date} as any);
  const {ctx, getDispatched} = makeCtx(table);
  expect(
    await getAddLayerCommand(ctx as any).execute({} as any, {
      datasetName: table.id,
      layerType: 'point',
      options: {pulseTrigger: 'event', pulseTimeField: 'date'}
    })
  ).toMatchObject({success: false, error: expect.stringContaining('timestamp field')});
  expect(getDispatched()).toBeNull();
});

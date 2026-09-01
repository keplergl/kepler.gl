import {getAddLayerCommand} from './layer-creation-command';
import KeplerTable from '@kepler.gl/table';
import {ALL_FIELD_TYPES} from '@kepler.gl/constants';

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

describe('map.add-layer (colorMap validation)', () => {
  it('finds a unique category that appears only later in a large dataset (even sampling)', async () => {
    // 20k rows; the wanted category 'z' exists ONLY at index 10000 — beyond the
    // old prefix scan (first 10k rows) but inside the even-stride scan
    // (step = 20000/10000 = 2, so even indices 0..19998 are visited).
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

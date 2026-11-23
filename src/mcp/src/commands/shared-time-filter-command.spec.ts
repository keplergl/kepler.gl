// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {setFilter} from '@kepler.gl/actions';
import {
  INITIAL_VIS_STATE,
  INITIAL_MAP_STATE,
  visStateReducer,
  mapStateReducer
} from '@kepler.gl/reducers';
import KeplerTable from '@kepler.gl/table';
import {getTimeFilterCommand} from './shared-time-filter-command';
import {getDataPlaybackCommand} from './data-playback-command';
import type {KeplerContext, RoomCommandResult} from './types';

const START = 1704067200000;
const DAY = 86400000;
const time = (day: number) => START + day * DAY;
const bindings = [
  {datasetId: 'sightings', startField: 'seen', endField: 'until'},
  {datasetId: 'labels', startField: 'from', endField: 'to'}
];

function setup(sightingsRows?: (number | null)[][]) {
  const datasets = Object.fromEntries(
    bindings.map((binding, index) => {
      const table = new KeplerTable({info: {id: binding.datasetId}, color: [1, 2, 3]});
      table.updateSchema({
        fields: [binding.startField, binding.endField, 'alternate'].map(name => ({
          name,
          type: 'timestamp',
          analyzerType: 'TIME',
          format: 'X'
        })),
        rows:
          index === 0
            ? sightingsRows ?? [
                [time(0), time(3), time(1)],
                [time(2), time(5), time(4)]
              ]
            : [
                [time(1), time(4), time(2)],
                [time(4), time(6), time(5)]
              ]
      });
      return [binding.datasetId, table];
    })
  );
  let state = {...INITIAL_VIS_STATE, datasets};
  let mapState = {...INITIAL_MAP_STATE, longitude: 10, latitude: 40, zoom: 8};
  const dispatch = jest.fn(action => {
    state = visStateReducer(state, action);
    mapState = mapStateReducer(mapState, action);
  });
  const ctx = {
    getVisState: () => state,
    getMapState: () => mapState,
    dispatch
  } as unknown as KeplerContext;
  const command = getTimeFilterCommand(ctx);
  return {
    ctx,
    dispatch,
    run: async (input: unknown) =>
      (await command.execute({} as any, input)) as RoomCommandResult<any>
  };
}

describe('map.time-filter', () => {
  it.each([
    [],
    [
      [null, time(3), time(1)],
      [null, time(5), time(4)]
    ],
    [
      [NaN, time(3), time(1)],
      [NaN, time(5), time(4)]
    ]
  ])('rejects missing start timestamps before dispatch: %j', async (...rows) => {
    const {run, dispatch} = setup(rows as (number | null)[][]);
    const result = await run({action: 'create', bindings});
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/no valid timestamps/);
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('allows all-null ends as open intervals without inventing a time domain', async () => {
    const {ctx, run} = setup([
      [time(0), null, time(1)],
      [time(2), null, time(4)]
    ]);
    const result = await run({
      action: 'create',
      filterId: 'open',
      bindings: [bindings[0]],
      animationWindow: 'point',
      value: [time(2), time(2)]
    });
    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({
      domain: [time(0), time(2)],
      bindings: [bindings[0]],
      visibleCounts: {sightings: 2}
    });
    expect(ctx.getVisState().filters[0].endName).toEqual(['until']);
  });

  it.each(['point', 'incremental'])(
    'starts a new %s window at the native domain start',
    async animationWindow => {
      const {run} = setup();
      const result = await run({action: 'create', bindings, animationWindow});
      expect(result.success).toBe(true);
      expect(result.data).toMatchObject({
        value: [time(0), time(0)],
        selectedTime: time(0),
        visibleCounts: {sightings: 1, labels: 0}
      });
    }
  );

  it('starts an interval window on the first native histogram bin', async () => {
    const {run} = setup();
    const result = await run({
      action: 'create',
      bindings,
      animationWindow: 'interval',
      interval: '1-day'
    });
    expect(result.success).toBe(true);
    expect(result.data.value).toEqual([time(0), time(1) - 1]);
    expect(result.data.visibleCounts).toEqual({sightings: 1, labels: 0});
  });

  it('repeatedly seeks overlapping visibility intervals on one clock without moving the camera', async () => {
    const {ctx, run} = setup();
    const camera = ctx.getMapState!();
    await run({action: 'create', filterId: 'migration', bindings, animationWindow: 'point'});
    const playback = getDataPlaybackCommand(ctx);
    const input = {action: 'seek', target: {filterId: 'migration'}, time: time(2)};
    const first = (await playback.execute({} as any, input)) as RoomCommandResult<any>;
    const second = (await playback.execute({} as any, input)) as RoomCommandResult<any>;
    expect(first.success).toBe(true);
    expect(second).toEqual(first);
    expect(first.data.visibleCounts).toEqual({sightings: 2, labels: 1});
    expect(ctx.getVisState().datasets.sightings.filteredIdxCPU).toEqual([0, 1]);
    expect(ctx.getVisState().datasets.labels.filteredIdxCPU).toEqual([0]);
    expect(ctx.getMapState!()).toEqual(camera);
  });

  it('preserves single-dataset settings when rebinding and reports the selected edge of an unlinked filter', async () => {
    const {ctx, run} = setup();
    await run({
      action: 'create',
      filterId: 'migration',
      bindings: [bindings[0]],
      animationWindow: 'free',
      interval: '1-day',
      enabled: false
    });
    ctx.dispatch(
      setFilter(
        0,
        ['speed', 'syncTimelineMode', 'syncedWithLayerTimeline', 'value'],
        [2, 0, false, [time(2), time(3)]]
      )
    );
    const result = await run({action: 'update', filterId: 'migration', bindings: [bindings[1]]});
    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({
      filterId: 'migration',
      bindings: [bindings[1]],
      speed: 2,
      enabled: false,
      interval: '1-day',
      selectedTime: time(3),
      value: [time(2), time(3)]
    });
  });

  it('creates and inspects a shared native interval filter, including GPU-visible counts', async () => {
    const {ctx, run, dispatch} = setup();
    const mapState = ctx.getMapState!();
    const result = await run({
      action: 'create',
      filterId: 'migration',
      bindings,
      animationWindow: 'point',
      value: [time(2), time(2)]
    });
    expect(result.error).toBeUndefined();
    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({
      filterId: 'migration',
      bindings,
      domain: [time(0), time(6)],
      value: [time(2), time(2)],
      selectedTime: time(2),
      animationWindow: 'point',
      isAnimating: false,
      visibleCounts: {sightings: 2, labels: 1}
    });
    expect(ctx.getVisState().filters[0].gpu).toBe(true);
    dispatch.mockClear();
    expect((await run({action: 'get', filterId: 'migration'})).data.filters).toEqual([result.data]);
    expect((await run({action: 'get'})).data.filters).toHaveLength(1);
    expect(dispatch).not.toHaveBeenCalled();
    expect(ctx.getMapState!()).toEqual(mapState);
  });

  it('replaces bindings, removes a surplus dataset and clears end fields without changing the ID or window', async () => {
    const {ctx, run} = setup();
    await run({
      action: 'create',
      filterId: 'migration',
      bindings,
      animationWindow: 'free',
      interval: '1-day',
      value: [time(2), time(3)],
      enabled: false
    });
    const result = await run({
      action: 'update',
      filterId: 'migration',
      bindings: [{datasetId: 'labels', startField: 'alternate'}]
    });
    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({
      filterId: 'migration',
      bindings: [{datasetId: 'labels', startField: 'alternate', endField: null}],
      domain: [time(2), time(5)],
      value: [time(2), time(3)],
      enabled: false,
      animationWindow: 'free',
      interval: '1-day'
    });
    expect(ctx.getVisState().filters).toHaveLength(1);
    expect(
      (await run({action: 'update', filterId: 'migration', enabled: true})).data.visibleCounts
        .labels
    ).toBe(1);
  });

  it('updates each dataset end field and preserves unrelated filters', async () => {
    const {ctx, run} = setup();
    await run({action: 'create', filterId: 'other', bindings: [bindings[0]]});
    await run({action: 'create', filterId: 'migration', bindings});
    const other = ctx.getVisState().filters[0];
    const result = await run({
      action: 'update',
      filterId: 'migration',
      bindings: [
        {...bindings[0], endField: null},
        {...bindings[1], endField: 'alternate'}
      ],
      value: [time(2), time(2)]
    });
    expect(result.success).toBe(true);
    expect(result.data.bindings).toEqual([
      {...bindings[0], endField: null},
      {...bindings[1], endField: 'alternate'}
    ]);
    // The other filter's histogram is recomputed against the new visible rows;
    // its saved configuration must remain unchanged.
    expect(ctx.getVisState().filters[0]).toMatchObject({
      id: other.id,
      dataId: other.dataId,
      name: other.name,
      endName: other.endName,
      domain: other.domain,
      value: other.value,
      enabled: other.enabled,
      animationWindow: other.animationWindow,
      plotType: other.plotType
    });
  });

  it.each([
    {action: 'create'},
    {action: 'create', bindings: []},
    {action: 'create', bindings: [bindings[0], bindings[0]]},
    {action: 'create', bindings: [bindings[0], {...bindings[1], datasetId: 'missing'}]},
    {action: 'create', bindings: [bindings[0], {...bindings[1], endField: 'missing'}]},
    {action: 'create', bindings: [{...bindings[0], endField: 'seen'}]},
    {action: 'create', bindings, value: [time(3), time(2)]},
    {action: 'create', bindings, value: [time(0), time(7)]},
    {action: 'create', bindings, value: [NaN, time(2)]},
    {action: 'update', bindings},
    {action: 'get', filterId: 'missing'}
  ])('rejects invalid input before dispatch: %j', async input => {
    const {run, dispatch} = setup();
    expect((await run(input)).success).toBe(false);
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('rejects incompatible fields and prevents duplicate IDs', async () => {
    const {ctx, run, dispatch} = setup();
    await run({action: 'create', filterId: 'migration', bindings});
    dispatch.mockClear();
    expect((await run({action: 'create', filterId: 'migration', bindings})).success).toBe(false);
    ctx.getVisState().datasets.labels.fields[0].type = 'date';
    expect((await run({action: 'update', filterId: 'migration', bindings})).success).toBe(false);
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('includes other active filters in visible counts', async () => {
    const {ctx, run} = setup();
    await run({action: 'create', filterId: 'migration', bindings, value: [time(2), time(2)]});
    await run({
      action: 'create',
      filterId: 'other',
      bindings: [{datasetId: 'sightings', startField: 'alternate'}]
    });
    ctx.dispatch(setFilter(1, 'value', [time(4), time(4)]));
    expect(
      (await run({action: 'get', filterId: 'migration'})).data.filters[0].visibleCounts
    ).toEqual({sightings: 1, labels: 1});
  });
});

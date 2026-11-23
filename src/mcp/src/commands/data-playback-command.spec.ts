// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import KeplerTable from '@kepler.gl/table';
import {KeplerGlLayers} from '@kepler.gl/layers';
import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import {addFilter, setFilter} from '@kepler.gl/actions';
import {
  INITIAL_MAP_STATE,
  INITIAL_VIS_STATE,
  mapStateReducer,
  visStateReducer
} from '@kepler.gl/reducers';
import {getDataPlaybackCommand} from './data-playback-command';
import {getTimeFilterCommand} from './shared-time-filter-command';
import type {KeplerContext, RoomCommand, RoomCommandResult} from './types';

const START = Date.UTC(2024, 0, 1);
const DAY = 86_400_000;

async function makeContext() {
  const table = new KeplerTable({
    info: {id: 'observations', label: 'Observations'},
    color: [255, 0, 0]
  });
  await table.importData({
    data: {
      fields: [{name: 'date', type: ALL_FIELD_TYPES.timestamp}],
      rows: [['2024-01-01T00:00:00Z'], ['2024-01-02T00:00:00Z'], ['2024-01-03T00:00:00Z']]
    } as any
  });
  let visState = {...INITIAL_VIS_STATE, datasets: {[table.id]: table}};
  let mapState = {...INITIAL_MAP_STATE, longitude: 20, latitude: 45, zoom: 8};
  const dispatch = jest.fn(action => {
    visState = visStateReducer(visState, action);
    mapState = mapStateReducer(mapState, action);
  });
  dispatch(addFilter(table.id));
  dispatch(setFilter(0, 'name', 'date'));
  dispatch(setFilter(0, ['animationWindow', 'value'], ['point', [START, START]]));
  dispatch.mockClear();
  const ctx = {
    getVisState: () => visState,
    getMapState: () => mapState,
    dispatch
  } as unknown as KeplerContext;
  return {
    ctx,
    dispatch,
    table,
    target: {filterId: visState.filters[0].id},
    setState: (next: any) => {
      visState = next;
    }
  };
}

async function execute(command: RoomCommand, input: unknown) {
  return (await command.execute({} as any, input)) as RoomCommandResult<any>;
}

describe('map.data-playback', () => {
  it('seeks a native filter deterministically, reports the selected time and leaves the camera fixed', async () => {
    const {ctx, target} = await makeContext();
    const command = getDataPlaybackCommand(ctx);
    const camera = ctx.getMapState?.();
    const input = {action: 'seek', target, time: START + DAY};
    const first = await execute(command, input);
    const second = await execute(command, input);
    expect(first.success).toBe(true);
    expect(first.data).toMatchObject({
      clock: 'filter',
      selectedTime: START + DAY,
      value: [START + DAY, START + DAY],
      isAnimating: false,
      visibleCounts: {observations: 1}
    });
    expect(second.data).toEqual(first.data);
    const state = ctx.getVisState();
    expect(
      state.datasets.observations.filterTableCPU(state.filters, state.layers).filteredIdxCPU
    ).toEqual([1]);
    expect(ctx.getMapState?.()).toBe(camera);
  });

  it('plays, pauses and resets the selected filter with native speed, loop and hold settings', async () => {
    const {ctx, target} = await makeContext();
    const command = getDataPlaybackCommand(ctx);
    expect(
      (
        await execute(command, {
          action: 'play',
          target,
          speed: 2,
          loop: false,
          endHoldDurationMs: 2500
        })
      ).success
    ).toBe(true);
    expect(ctx.getVisState().filters[0]).toMatchObject({
      isAnimating: true,
      speed: 2,
      animationLoop: false,
      endHoldDurationMs: 2500
    });
    await execute(command, {action: 'pause', target});
    expect(ctx.getVisState().filters[0].isAnimating).toBe(false);
    await execute(command, {action: 'seek', target, time: START + DAY});
    const result = await execute(command, {action: 'reset', target});
    expect(result.data.selectedTime).toBe(START);
    expect(ctx.getVisState().filters[0].isAnimating).toBe(false);
  });

  it('preserves free-window width across repeated seeks and resets', async () => {
    const {ctx, target, dispatch} = await makeContext();
    dispatch(setFilter(0, ['animationWindow', 'value'], ['free', [START, START + DAY / 2]]));
    const command = getDataPlaybackCommand(ctx);
    await execute(command, {action: 'seek', target, time: START + DAY});
    const first = ctx.getVisState().filters[0].value;
    await execute(command, {action: 'seek', target, time: START + DAY});
    expect(ctx.getVisState().filters[0].value).toEqual(first);
    expect(first).toEqual([START + DAY / 2, START + DAY]);
    await execute(command, {action: 'reset', target});
    expect(ctx.getVisState().filters[0].value).toEqual([START - DAY / 2, START]);
  });

  it('controls the shared native trip clock and stops competing filter playback', async () => {
    const {ctx, target, setState} = await makeContext();
    setState({
      ...ctx.getVisState(),
      layers: [new KeplerGlLayers.TripLayer({id: 'trip', dataId: 'observations'})],
      animationConfig: {
        ...INITIAL_VIS_STATE.animationConfig,
        domain: [START, START + DAY * 2],
        currentTime: START
      }
    });
    const command = getDataPlaybackCommand(ctx);
    await execute(command, {action: 'play', target});
    const layerTarget = {layerId: 'trip'};
    expect(
      (
        await execute(command, {
          action: 'play',
          target: layerTarget,
          loop: false,
          endHoldDurationMs: 1000
        })
      ).data
    ).toMatchObject({
      clock: 'layer',
      isAnimating: true,
      animationLoop: false,
      endHoldDurationMs: 1000
    });
    expect(ctx.getVisState().filters[0].isAnimating).toBe(false);
    expect(
      (await execute(command, {action: 'seek', target: layerTarget, time: START + DAY})).data
    ).toMatchObject({selectedTime: START + DAY, isAnimating: false});
    expect((await execute(command, {action: 'reset', target: layerTarget})).data.selectedTime).toBe(
      START
    );
  });

  it('resolves a layer linked to Time Filter Sync to its filter clock', async () => {
    const {ctx, setState} = await makeContext();
    setState({
      ...ctx.getVisState(),
      filters: [
        {...ctx.getVisState().filters[0], syncedWithLayerTimeline: true, syncTimelineMode: 1}
      ],
      layers: [new KeplerGlLayers.TripLayer({id: 'trip', dataId: 'observations'})],
      animationConfig: {
        ...INITIAL_VIS_STATE.animationConfig,
        domain: [START, START + DAY * 2],
        currentTime: START
      }
    });
    const result = await execute(getDataPlaybackCommand(ctx), {
      action: 'seek',
      target: {layerId: 'trip'},
      time: START + DAY
    });
    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({clock: 'filter', selectedTime: START + DAY});
    expect(ctx.getVisState().animationConfig.currentTime).toBe(START + DAY);
  });

  it.each(['filter', 'layer'])(
    'inspects, seeks and resets the merged linked domain through a %s target',
    async targetType => {
      const {ctx, target: filterTarget, dispatch, setState} = await makeContext();
      const camera = ctx.getMapState?.();
      const domain = [START - DAY, START + DAY * 4];
      setState({
        ...ctx.getVisState(),
        filters: [
          {...ctx.getVisState().filters[0], syncedWithLayerTimeline: true, syncTimelineMode: 1}
        ],
        layers: [new KeplerGlLayers.TripLayer({id: 'trip', dataId: 'observations'})],
        animationConfig: {...INITIAL_VIS_STATE.animationConfig, domain, currentTime: START}
      });
      const command = getDataPlaybackCommand(ctx);
      const target = targetType === 'layer' ? {layerId: 'trip'} : filterTarget;
      expect((await execute(command, {action: 'get', target})).data.domain).toEqual(domain);
      expect(
        (await execute(getTimeFilterCommand(ctx), {action: 'get', ...filterTarget})).data.filters[0]
          .domain
      ).toEqual(domain);
      expect(dispatch).not.toHaveBeenCalled();

      const input = {action: 'seek', target, time: START + DAY * 3};
      const first = await execute(command, input);
      expect(first.success).toBe(true);
      expect(first.data).toMatchObject({
        domain,
        selectedTime: input.time,
        value: [input.time, input.time],
        visibleCounts: {observations: 0}
      });
      expect(await execute(command, input)).toEqual(first);
      expect(ctx.getVisState().animationConfig.currentTime).toBe(input.time);

      const reset = await execute(command, {action: 'reset', target});
      expect(reset.success).toBe(true);
      expect(reset.data.selectedTime).toBe(domain[0]);
      expect(ctx.getVisState().animationConfig.currentTime).toBe(domain[0]);
      expect(ctx.getVisState().filters[0].domain).toEqual([START, START + DAY * 2]);
      expect(ctx.getMapState?.()).toBe(camera);

      dispatch.mockClear();
      expect((await execute(command, {action: 'seek', target, time: domain[1] + 1})).success).toBe(
        false
      );
      expect(dispatch).not.toHaveBeenCalled();
    }
  );

  it('uses the merged domain when snapping a linked interval seek', async () => {
    const {ctx, target, setState} = await makeContext();
    const filter = ctx.getVisState().filters[0];
    setState({
      ...ctx.getVisState(),
      filters: [
        {
          ...filter,
          syncedWithLayerTimeline: true,
          syncTimelineMode: 1,
          animationWindow: 'interval',
          plotType: {...filter.plotType, interval: '1-day'}
        }
      ],
      layers: [new KeplerGlLayers.TripLayer({id: 'trip', dataId: 'observations'})],
      animationConfig: {
        ...INITIAL_VIS_STATE.animationConfig,
        domain: [START - DAY, START + DAY * 5],
        currentTime: START
      }
    });
    const result = await execute(getDataPlaybackCommand(ctx), {
      action: 'seek',
      target,
      time: START + DAY * 4
    });
    expect(result.success).toBe(true);
    expect(result.data.value).toEqual([START + DAY * 4, START + DAY * 5 - 1]);
    expect(ctx.getVisState().animationConfig.currentTime).toBe(START + DAY * 5 - 1);
  });

  it.each([
    {},
    {action: 'play', target: {filterId: 'missing'}},
    {action: 'play', target: {layerId: 'missing'}},
    {action: 'play', target: {filterId: 'x', layerId: 'y'}},
    {action: 'play', speed: -1},
    {action: 'play', endHoldDurationMs: -1},
    {action: 'seek'},
    {action: 'seek', time: NaN},
    {action: 'seek', time: START - 1},
    {action: 'pause', loop: false}
  ])('rejects invalid input without mutation: %j', async input => {
    const {ctx, target, dispatch} = await makeContext();
    const result = await execute(getDataPlaybackCommand(ctx), {target, ...input});
    expect(result.success).toBe(false);
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('inspects without dispatching', async () => {
    const {ctx, target, dispatch} = await makeContext();
    const result = await execute(getDataPlaybackCommand(ctx), {action: 'get', target});
    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({
      requestedTarget: target,
      clock: 'filter',
      domain: [START, START + DAY * 2]
    });
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('rejects playback with an empty native domain without changing data clocks', async () => {
    const {ctx, target, dispatch, setState} = await makeContext();
    setState({...ctx.getVisState(), filters: [{...ctx.getVisState().filters[0], domain: null}]});
    expect((await execute(getDataPlaybackCommand(ctx), {action: 'play', target})).success).toBe(
      false
    );
    expect(dispatch).not.toHaveBeenCalled();
  });
});

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {mapStyleReducer, INITIAL_MAP_STYLE} from '@kepler.gl/reducers';
import type {MapStyle} from '@kepler.gl/reducers';
import {receiveMapConfig} from '@kepler.gl/actions';
import {drainTasksForTesting} from '@kepler.gl/tasks';
import type {BaseMapStyle} from '@kepler.gl/types';
import {prepareProjectMapStyles} from './project-map-styles';
import type {KeplerContext} from './types';

const style = (id: string, custom?: BaseMapStyle['custom']): BaseMapStyle => ({
  id,
  label: id,
  icon: '',
  layerGroups: [],
  url: `https://example.com/${id}.json`,
  ...(custom !== undefined ? {custom} : {}),
  style: {version: 8, sources: {}, layers: []}
});

function setup() {
  const hostStyle = style('host-local', 'LOCAL');
  let mapStyle: MapStyle = {
    ...INITIAL_MAP_STYLE,
    styleType: 'host-default',
    initialState: {...INITIAL_MAP_STYLE, mapStyles: {[hostStyle.id]: hostStyle}},
    mapStyles: {
      'host-default': style('host-default'),
      managed: style('managed', 'MANAGED'),
      [hostStyle.id]: hostStyle,
      project: {...style('project', 'LOCAL'), accessToken: 'old-token'},
      legacy: style('legacy', true)
    }
  };
  const dispatch = jest.fn(action => {
    mapStyle = mapStyleReducer(mapStyle, action);
  });
  const ctx = {
    getKeplerState: () => ({mapStyle}),
    dispatch
  } as unknown as KeplerContext;
  return {ctx, dispatch, state: () => mapStyle};
}

afterEach(() => drainTasksForTesting());

it('removes project-local and legacy basemaps while preserving host styles', async () => {
  const {ctx, state} = setup();
  const initial = state();
  await prepareProjectMapStyles(ctx);
  expect(Object.keys(state().mapStyles)).toEqual(['host-default', 'managed', 'host-local']);
  for (const id of ['host-default', 'managed', 'host-local']) {
    expect(state().mapStyles[id]).toBe(initial.mapStyles[id]);
  }
});

it('allows a same-ID saved style to replace the previous URL, token, and cached style', async () => {
  const {ctx, dispatch, state} = setup();
  const imported = {
    ...style('project', 'LOCAL'),
    custom: true,
    label: 'New project style',
    url: 'https://example.com/new-style.json',
    accessToken: 'new-token',
    style: undefined
  };
  await prepareProjectMapStyles(ctx);
  dispatch(
    receiveMapConfig(
      {mapStyle: {styleType: 'project', mapStyles: {project: imported}}},
      {keepExistingConfig: false}
    )
  );
  expect(state().mapStyles.project).toEqual(imported);
  expect(state().isLoading.project).toBe(true);
  expect(state().mapStyles['host-default'].url).toBe('https://example.com/host-default.json');
});

it('does not remove any styles after cancellation', async () => {
  const {ctx, dispatch} = setup();
  const controller = new AbortController();
  controller.abort();
  await expect(prepareProjectMapStyles(ctx, controller.signal)).rejects.toThrow();
  expect(dispatch).not.toHaveBeenCalled();
});

it('leaves older hosts without a complete state accessor unchanged', async () => {
  const {ctx, dispatch} = setup();
  delete ctx.getKeplerState;
  await prepareProjectMapStyles(ctx);
  expect(dispatch).not.toHaveBeenCalled();
});

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {createRoot} from 'react-dom/client';
import {keplerGlReducerCore} from '@kepler.gl/reducers';
import KeplerTable from '@kepler.gl/table';
import {getAddLayerCommand, getAddTimeFilterCommand} from '@kepler.gl/mcp';
import {NO_MAP_ID, EMPTY_MAPBOX_STYLE} from '@kepler.gl/constants';
import {setFilterAnimationWindow, setFilter} from '@kepler.gl/actions';
import {KeplerMcpBridge} from '../../examples/demo-app/src/kepler-mcp-bridge';
import {buildKeplerContext} from '../../examples/demo-app/src/kepler-mcp-shared';

async function initialize() {
  let map = keplerGlReducerCore(undefined, {type: '@@INIT'});
  const table = new KeplerTable({info: {id: 'fixture', label: 'fixture'}, color: [255, 0, 0]});
  await table.importData({
    data: {
      fields: [
        {name: 'lat', type: 'real'},
        {name: 'lng', type: 'real'},
        {name: 'time', type: 'timestamp'}
      ],
      rows: [
        [0, -35, '2024-01-01T12:00:00'],
        [0, 35, '2024-01-02T12:00:00']
      ]
    } as any
  });
  map = {
    ...map,
    mapState: {...map.mapState, width: 960, height: 540, longitude: 0, latitude: 0, zoom: 3},
    mapStyle: {
      ...map.mapStyle,
      styleType: NO_MAP_ID,
      mapStyles: {[NO_MAP_ID]: {id: NO_MAP_ID, label: 'No basemap', style: EMPTY_MAPBOX_STYLE}},
      bottomMapStyle: EMPTY_MAPBOX_STYLE,
      backgroundColor: [0, 0, 0]
    },
    visState: {...map.visState, datasets: {fixture: table}}
  };
  const store = {
    getState: () => ({demo: {keplerGl: {map}}}),
    dispatch: action => {
      map = keplerGlReducerCore(map, action);
    }
  };
  const context = buildKeplerContext(store);
  for (const [command, input] of [
    [getAddLayerCommand(context), {datasetName: 'fixture', layerType: 'point'}],
    [getAddTimeFilterCommand(context), {datasetName: 'fixture', dateTimeColumn: 'time'}]
  ] as const) {
    const result = (await command.execute({} as any, input)) as any;
    if (!result.success) throw new Error(result.error);
  }
  // add-layer fits the data bounds; give both known states a visible margin.
  map = {...map, mapState: {...map.mapState, longitude: 0, latitude: 0, zoom: 2.7}};
  const filter = map.visState.filters[0];
  store.dispatch(setFilterAnimationWindow({id: filter.id, animationWindow: 'interval'}));
  store.dispatch(setFilter(0, 'plotType', {interval: '1-day'}));
  map.visState.layers[0].updateLayerConfig({color: [255, 0, 0]});
  map.visState.layers[0].updateLayerVisConfig({radius: 35, fixedRadius: true, opacity: 1});
  const original = JSON.stringify({
    filters: map.visState.filters,
    config: map.visState.layers[0].config,
    gpu: table.gpuFilter
  });
  (window as any).fixtureUnchanged = () =>
    original ===
    JSON.stringify({
      filters: map.visState.filters,
      config: map.visState.layers[0].config,
      gpu: table.gpuFilter
    });
  createRoot(document.getElementById('root')!).render(<KeplerMcpBridge reduxStore={store} />);
}

void initialize().catch(error => {
  (window as any).fixtureError = error.message;
  console.error(error);
});

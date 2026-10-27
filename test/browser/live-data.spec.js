// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {act, fireEvent, render, screen} from '@testing-library/react';
import {Provider} from 'react-redux';
import {combineReducers, createStore} from 'redux';
import keplerGlReducer from '@kepler.gl/reducers';
import {addFilter, registerEntry, setFilter, wrapTo} from '@kepler.gl/actions';
import {KeplerGlLayers} from '@kepler.gl/layers';
import {KeplerTable} from '@kepler.gl/table';
import {ArrowDataContainer} from '@kepler.gl/utils';
import {RowDataContainer} from '../../src/utils/src/row-data-container';
import {LiveDataSidebar} from '../../examples/live-data/src/app';
import {ARROW_DATASET_ID, createArrowDataset} from '../../examples/live-data/src/arrow-data';

jest.mock('@kepler.gl/components', () => ({__esModule: true, default: () => null}));
jest.mock('maplibre-gl/dist/maplibre-gl.css', () => ({}));

const {PointLayer} = KeplerGlLayers;
afterEach(() => jest.useRealTimers());

function setup() {
  const sample = createArrowDataset();
  const arrow = new KeplerTable({info: sample.info, color: [0, 0, 0]}).updateSchema(sample.data);
  const rows = new KeplerTable({info: {id: 'live-vehicles'}, color: [0, 0, 0]}).updateSchema({
    fields: sample.data.fields,
    rows: arrow.dataContainer.flattenData()
  });
  const layers = [rows, arrow].map(table => {
    const {props} = PointLayer.findDefaultLayerProps(table);
    const layer = new PointLayer({
      ...props[0],
      id: `${table.id}-point`,
      dataId: table.id,
      isVisible: table === rows
    });
    layer.updateLayerVisConfig({radius: 17});
    return layer;
  });
  const reducer = combineReducers({keplerGl: keplerGlReducer});
  const initial = reducer(undefined, registerEntry({id: 'map'}));
  initial.keplerGl.map.visState = {
    ...initial.keplerGl.map.visState,
    datasets: {[rows.id]: rows, [arrow.id]: arrow},
    layers,
    layerData: [{}, {}],
    layerOrder: [0, 1]
  };
  const store = createStore(reducer, initial);
  const view = render(
    <Provider store={store}>
      <LiveDataSidebar />
    </Provider>
  );
  const state = () => store.getState().keplerGl.map.visState;
  const dataset = id => state().datasets[id];
  return {...view, store, state, dataset};
}

test('Arrow controls edit the real container and retain settings across mode switches', () => {
  const {store, state, dataset} = setup();
  const original = dataset(ARROW_DATASET_ID).dataContainer;
  expect(original).toBeInstanceOf(ArrowDataContainer);
  expect(dataset('live-vehicles').dataContainer).toBeInstanceOf(RowDataContainer);
  fireEvent.click(screen.getByRole('button', {name: 'Arrow rows'}));
  act(() => {
    store.dispatch(wrapTo('map', addFilter(ARROW_DATASET_ID)));
    store.dispatch(wrapTo('map', setFilter(0, 'name', 'speed')));
    store.dispatch(wrapTo('map', setFilter(0, 'value', [30, 50])));
  });
  const filterId = state().filters[0].id;
  fireEvent.click(screen.getByRole('button', {name: 'Add 5'}));
  expect(original.numRows()).toBe(8);
  fireEvent.click(screen.getByRole('button', {name: 'Insert tracker'}));
  const position = screen.getByLabelText('Tracker position and speed').textContent;
  fireEvent.click(screen.getByRole('button', {name: 'Move tracker'}));
  expect(original.numRows()).toBe(9);
  expect(screen.getByLabelText('Tracker position and speed').textContent).not.toBe(position);
  fireEvent.click(screen.getByRole('button', {name: 'Remove tracker'}));
  fireEvent.click(screen.getByRole('button', {name: 'Remove last'}));
  expect(original.numRows()).toBe(7);
  expect(dataset(ARROW_DATASET_ID).dataContainer).toBe(original);
  expect(dataset(ARROW_DATASET_ID).dataRevision).toBe(5);
  expect(state().layers[1].id).toBe(`${ARROW_DATASET_ID}-point`);
  expect(state().layers[1].config.visConfig.radius).toBe(17);
  expect(state().filters[0]).toMatchObject({id: filterId, value: [30, 50]});
  fireEvent.click(screen.getByRole('button', {name: 'Host rows'}));
  fireEvent.click(screen.getByRole('button', {name: 'Add 1'}));
  expect(dataset('live-vehicles').dataContainer.numRows()).toBe(4);
  expect(original.numRows()).toBe(7);
  fireEvent.click(screen.getByRole('button', {name: 'Arrow rows'}));
  expect(dataset(ARROW_DATASET_ID).dataContainer).toBe(original);
  expect(state().layers.map(layer => layer.config.isVisible)).toEqual([false, true]);
  expect(state().filters[0]).toMatchObject({id: filterId, value: [30, 50]});
});

test('auto trail stops on mode change and unmount without changing the other dataset', () => {
  jest.useFakeTimers();
  const {dataset, unmount} = setup();
  const original = dataset(ARROW_DATASET_ID).dataContainer;
  fireEvent.click(screen.getByRole('button', {name: 'Arrow rows'}));
  fireEvent.click(screen.getByRole('checkbox', {name: /Auto trail/}));
  act(() => jest.advanceTimersByTime(800));
  expect(original.numRows()).toBe(4);
  fireEvent.click(screen.getByRole('button', {name: 'Host rows'}));
  act(() => jest.advanceTimersByTime(2400));
  expect(original.numRows()).toBe(4);
  expect(dataset('live-vehicles').dataContainer.numRows()).toBe(3);
  fireEvent.click(screen.getByRole('button', {name: 'Arrow rows'}));
  expect(screen.getByRole('checkbox', {name: /Auto trail/})).not.toBeChecked();
  fireEvent.click(screen.getByRole('checkbox', {name: /Auto trail/}));
  unmount();
  act(() => jest.advanceTimersByTime(2400));
  expect(original.numRows()).toBe(4);
  jest.useRealTimers();
});

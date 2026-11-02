// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {createRef, StrictMode} from 'react';
import {act, render} from '@testing-library/react';
import MapContainerFactory from './map-container';
import {layerClickUpdater, wmsFeatureInfoUpdater} from '@kepler.gl/reducers';

jest.mock('styled-components', () => ({
  __esModule: true,
  ...jest.requireActual('styled-components'),
  withTheme: Component => Component
}));

jest.mock('@kepler.gl/utils', () => ({
  ...jest.requireActual('@kepler.gl/utils'),
  patchDeckRendererForPostProcessing: jest.fn()
}));

const Empty = () => null;
const MapContainer = MapContainerFactory(
  Empty as any,
  Empty as any,
  Empty as any,
  Empty as any
) as any;

// The response handler only needs selection state. Keep this test independent
// of a WebGL canvas and network-backed basemaps.
beforeEach(() => {
  jest.spyOn(MapContainer.prototype, '_renderMap').mockReturnValue(null);
});
afterEach(() => jest.restoreAllMocks());

function setup(strictMode = false) {
  const coordinate = [10, 20];
  const layer = {
    id: 'wms',
    config: {isVisible: true, visConfig: {allowHover: true}}
  };
  const props = {
    mapStyle: {styleType: 'dark'},
    visState: {
      layers: [layer],
      layerOrder: ['wms'],
      clicked: {picked: true, coordinate, layer: {props: {idx: 0, id: 'wms-WMSLayer'}}},
      splitMaps: [],
      interactionConfig: {tooltip: {enabled: true}, coordinate: {enabled: false}}
    },
    visStateActions: {wmsFeatureInfo: jest.fn()},
    index: 0
  };
  const ref = createRef<any>();
  const element = (visState = props.visState) => {
    const map = <MapContainer {...props} visState={visState} ref={ref} />;
    return strictMode ? <StrictMode>{map}</StrictMode> : map;
  };
  const view = render(element());
  const response = {featureInfo: [{name: 'VALUE', value: '20'}], coordinate};
  let currentState: any = props.visState;
  const rerender = (visState: any) => {
    currentState = visState;
    view.rerender(element(visState));
  };
  props.visStateActions.wmsFeatureInfo.mockImplementation((origin, featureInfo, coordinate) => {
    rerender(wmsFeatureInfoUpdater(currentState, {layer: origin, featureInfo, coordinate} as any));
  });
  return {props, layer, ref, view, response, rerender, getState: () => currentState};
}

test('publishes a response only for the current selection and originating layer', () => {
  const {props, layer, ref, response} = setup();
  ref.current._onWMSFeatureInfo(layer, response);
  expect(props.visStateActions.wmsFeatureInfo).toHaveBeenCalledWith(
    layer,
    response.featureInfo,
    response.coordinate
  );
});

test.each<[string, (state: any) => any]>([
  ['deselection', state => ({...state, clicked: null})],
  [
    'a later click at the same coordinates',
    state => ({
      ...state,
      clicked: {...state.clicked, coordinate: [...state.clicked.coordinate]}
    })
  ],
  [
    'layer removal with another layer in the same slot',
    state => ({
      ...state,
      layers: [{id: 'replacement', config: {isVisible: true}}]
    })
  ]
])('ignores a pending response after %s', (_name, update) => {
  const {props, layer, ref, response, rerender} = setup();
  rerender(update(props.visState));
  ref.current._onWMSFeatureInfo(layer, response);
  ref.current._onWMSFeatureInfo(layer, {...response, featureInfo: null});
  expect(props.visStateActions.wmsFeatureInfo).not.toHaveBeenCalled();
});

test.each([
  ['successful WMS/raster query', true, [{name: 'VALUE', value: 'new'}]],
  ['empty or failed WMS query', true, null],
  ['empty or failed raster query', false, null]
])('keeps the latest selection after a newer %s', async (_name, publish, featureInfo) => {
  const {props, layer, ref, response, rerender, getState} = setup();
  const handleResponse = ref.current._onWMSFeatureInfo;
  let finishOld!: () => void;
  const oldRequest = new Promise<void>(resolve => {
    finishOld = resolve;
  }).then(() => handleResponse(layer, response));

  // Repeated coordinates are a new click and must not reuse ownership of the old one.
  const coordinate = [...response.coordinate];
  rerender(
    layerClickUpdater(getState(), {
      info: {...props.visState.clicked, coordinate}
    } as any)
  );
  await act(async () => {
    if (publish) handleResponse(layer, {featureInfo, coordinate});
  });
  const latestSelection = getState().clicked;
  if (publish) {
    expect(latestSelection?.object.wmsFeatureInfo ?? null).toEqual(featureInfo);
  } else {
    expect(latestSelection.coordinate).toBe(coordinate);
  }

  await act(async () => {
    finishOld();
    await oldRequest;
    // An older failed WMS query must not clear the newer selection either.
    handleResponse(layer, {...response, featureInfo: null});
  });
  expect(getState().clicked).toBe(latestSelection);
  expect(props.visStateActions.wmsFeatureInfo).toHaveBeenCalledTimes(publish ? 1 : 0);
});

test('rejects a response without a click coordinate', () => {
  const {props, layer, ref, response, rerender} = setup();
  rerender({...props.visState, clicked: null});
  ref.current._onWMSFeatureInfo(layer, {...response, coordinate: undefined});
  expect(props.visStateActions.wmsFeatureInfo).not.toHaveBeenCalled();
});

test('ignores responses after the map panel unmounts', () => {
  const {props, layer, ref, response, view} = setup();
  const handleResponse = ref.current._onWMSFeatureInfo;
  view.unmount();
  handleResponse(layer, response);
  expect(props.visStateActions.wmsFeatureInfo).not.toHaveBeenCalled();
});

test('accepts the current response after StrictMode remounts the map', () => {
  const {props, layer, ref, response} = setup(true);
  ref.current._onWMSFeatureInfo(layer, response);
  expect(props.visStateActions.wmsFeatureInfo).toHaveBeenCalledWith(
    layer,
    response.featureInfo,
    response.coordinate
  );
});

test('keeps selection ownership through reducer updates and layer reordering', () => {
  const {props, layer, ref, response, rerender} = setup();
  const picked = layerClickUpdater(props.visState as any, {info: props.visState.clicked} as any);
  const resolved = wmsFeatureInfoUpdater(picked, {layer, ...response} as any);
  const reordered = {...resolved, layers: [{id: 'other'}, layer]};
  rerender(reordered);
  ref.current._onWMSFeatureInfo(layer, response);
  expect(props.visStateActions.wmsFeatureInfo).toHaveBeenCalledWith(
    layer,
    response.featureInfo,
    response.coordinate
  );
  props.visStateActions.wmsFeatureInfo.mockClear();
  const selectedAgain = layerClickUpdater(
    reordered as any,
    {
      info: {...props.visState.clicked, coordinate: [...response.coordinate]}
    } as any
  );
  rerender(selectedAgain);
  ref.current._onWMSFeatureInfo(layer, response);
  expect(props.visStateActions.wmsFeatureInfo).not.toHaveBeenCalled();
});

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {createRef, StrictMode} from 'react';
import {act, render} from '@testing-library/react';
import {Deck} from '@deck.gl/core';
import {ScatterplotLayer} from '@deck.gl/layers';
import MapContainerFactory from './map-container';
import {
  INITIAL_MAP_STATE,
  INITIAL_MAP_STYLE,
  INITIAL_UI_STATE,
  INITIAL_VIS_STATE,
  layerClickUpdater,
  wmsFeatureInfoUpdater
} from '@kepler.gl/reducers';
import type {CameraTour} from '@kepler.gl/types';

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

describe('camera tour path dragging', () => {
  const camera = {longitude: 10, latitude: 20, zoom: 6, bearing: 30, pitch: 45};
  const tour: CameraTour = {
    stops: [
      {id: 'home', name: 'Home', camera, holdDurationMs: 1000, travelDurationMs: 2000},
      {
        id: 'work',
        name: 'Work',
        camera: {...camera, longitude: 50},
        holdDurationMs: 3000,
        travelDurationMs: 0
      }
    ]
  };

  function setupPath(index = 0) {
    const commit = jest.fn();
    let props: any = {
      index,
      mapState: {...INITIAL_MAP_STATE, width: 500, height: 400},
      mapStyle: INITIAL_MAP_STYLE,
      mapControls: {...INITIAL_UI_STATE.mapControls, cameraTourPath: {show: true}},
      visState: {...INITIAL_VIS_STATE, cameraTour: tour},
      visStateActions: {setCameraTour: commit, onLayerHover: jest.fn()},
      uiStateActions: {setMapControlSettings: jest.fn(), toggleSidePanel: jest.fn()},
      mapStateActions: {updateMap: jest.fn()},
      generateDeckGLLayers: () => []
    };
    const ref = createRef<any>();
    const view = render(<MapContainer {...props} ref={ref} />);
    const update = (patch: any) => {
      props = {...props, ...patch};
      view.rerender(<MapContainer {...props} ref={ref} />);
    };
    commit.mockImplementation(cameraTour => {
      update({visState: {...props.visState, cameraTour}});
    });
    const deckProps = (isInteractive = true) =>
      ref.current._renderDeckOverlay([], {primaryMap: index === 0, isInteractive}).props.children
        .props;
    const layers = (isInteractive = true) =>
      deckProps(isInteractive).layers.filter(layer => layer.id.startsWith('camera-tour-path-'));
    const handles = () => layers()[1].props;
    const event = {rightButton: false, stopPropagation: jest.fn()};
    const picked = {object: {id: 'home'}, coordinate: [10, 20]};
    return {commit, update, deckProps, layers, handles, event, picked, props: () => props};
  }

  test.each([0, 1])(
    'drags a stop in map %s and redraws the path without changing other settings',
    index => {
      const {commit, layers, handles, picked, event} = setupPath(index);
      expect(layers().map(layer => layer.props.pickable)).toEqual([false, true, false]);
      expect(handles().onDragStart(picked, event)).toBe(true);
      expect(event.stopPropagation).toHaveBeenCalledTimes(1);
      expect(commit).not.toHaveBeenCalled();
      act(() => {
        expect(handles().onDrag({...picked, coordinate: [15, 25]}, event)).toBe(true);
      });
      expect(commit).toHaveBeenLastCalledWith({
        stops: [{...tour.stops[0], camera: {...camera, longitude: 15, latitude: 25}}, tour.stops[1]]
      });
      expect(layers()[0].props.data).toEqual([
        {
          path: [
            [15, 25],
            [50, 20]
          ]
        }
      ]);
      expect(layers()[2].props.data[0].position).toEqual([15, 25]);
      act(() => {
        expect(handles().onDragEnd({...picked, coordinate: [16, 26]}, event)).toBe(true);
      });
      expect(commit.mock.lastCall[0].stops[0].camera).toEqual({
        ...camera,
        longitude: 16,
        latitude: 26
      });
      expect(event.stopPropagation).toHaveBeenCalledTimes(3);
      expect(handles().onDrag({...picked, coordinate: [17, 27]}, event)).toBe(false);
      expect(commit).toHaveBeenCalledTimes(2);
      expect(tour.stops[0].camera).toEqual(camera);
    }
  );

  test.each([0, 1])(
    'clicking a stop in map %s opens its editor without changing the tour',
    index => {
      const {handles, event, props, commit} = setupPath(index);
      const actions = props().uiStateActions;
      const picked = {object: {id: 'work'}, index: 0};
      expect(handles().onClick(picked, event)).toBe(true);
      expect(actions.setMapControlSettings).toHaveBeenLastCalledWith('cameraTour', {
        selection: {stopId: 'work'}
      });
      expect(actions.toggleSidePanel).toHaveBeenLastCalledWith('interaction');
      const firstRequest = actions.setMapControlSettings.mock.lastCall[1].selection;
      handles().onClick(picked, event);
      expect(actions.setMapControlSettings.mock.lastCall[1].selection).not.toBe(firstRequest);
      expect(commit).not.toHaveBeenCalled();
    }
  );

  test('ignores missing stops and right-button clicks', () => {
    const {handles, event, picked, props} = setupPath();
    handles().onClick({object: {id: 'removed'}}, event);
    handles().onClick({object: undefined}, event);
    handles().onClick(picked, {...event, rightButton: true});
    expect(props().uiStateActions.setMapControlSettings).not.toHaveBeenCalled();
    expect(props().uiStateActions.toggleSidePanel).not.toHaveBeenCalled();
  });

  test.each([0, 1])('bitmap alignment takes priority over stop selection in map %s', index => {
    const {deckProps, update, props, picked, event, commit} = setupPath(index);
    const align = jest.fn();
    const bitmap = {
      id: 'image',
      type: 'bitmap',
      alignWaitingForMap: true,
      config: {isVisible: true},
      onAlignMapClick: align
    };
    update({visState: {...props().visState, layers: [bitmap]}});
    const clickPoint = () => {
      const rendered = deckProps();
      const deck = {
        layerManager: {},
        widgetManager: {onEvent: jest.fn()},
        props: rendered
      };
      (Deck.prototype as any)._dispatchPickingEvent.call(
        deck,
        {...picked, layer: rendered.layers.find(layer => layer.id === 'camera-tour-path-stops')},
        {...event, type: 'click', srcEvent: {button: 0}}
      );
    };
    clickPoint();
    expect(align).toHaveBeenCalledWith(picked.coordinate);
    expect(props().mapStateActions.updateMap).toHaveBeenCalledWith({}, index);
    expect(props().uiStateActions.setMapControlSettings).not.toHaveBeenCalled();
    expect(props().uiStateActions.toggleSidePanel).not.toHaveBeenCalled();
    expect(commit).not.toHaveBeenCalled();
    update({visState: {...props().visState, layers: [{...bitmap, alignWaitingForMap: false}]}});
    clickPoint();
    expect(align).toHaveBeenCalledTimes(1);
    expect(props().uiStateActions.setMapControlSettings).toHaveBeenCalledWith('cameraTour', {
      selection: {stopId: 'home'}
    });
    expect(props().uiStateActions.toggleSidePanel).toHaveBeenCalledWith('interaction');
  });

  test('point hover clears the previous dataset hover and continues through leave and reentry', () => {
    jest.useFakeTimers();
    try {
      const {deckProps, layers, props} = setupPath();
      const dataLayer = new ScatterplotLayer({id: 'dataset', data: [], pickable: true});
      const pointLayer = layers()[1];
      const dataHover = {layer: dataLayer, picked: true, object: {name: 'old feature'}};
      const dataLeave = {layer: dataLayer, picked: false, object: null};
      const pointHover = {layer: pointLayer, picked: true, object: {id: 'home'}};
      const pointLeave = {layer: pointLayer, picked: false, object: null};
      const deck = {
        cursorState: {},
        widgetManager: {onHover: jest.fn()},
        props: deckProps()
      };
      const hover = (result: unknown[]) => {
        act(() => {
          (Deck.prototype as any)._applyHoverCallbacks.call(
            deck,
            {result, emptyInfo: {picked: false}},
            {}
          );
          jest.runOnlyPendingTimers();
        });
      };
      hover([dataHover]);
      expect(props().visStateActions.onLayerHover).toHaveBeenLastCalledWith(dataHover, 0);
      hover([dataLeave, pointHover]);
      expect(props().visStateActions.onLayerHover).toHaveBeenLastCalledWith(pointHover, 0);
      hover([pointLeave]);
      expect(props().visStateActions.onLayerHover).toHaveBeenLastCalledWith(pointLeave, 0);
      hover([dataHover]);
      expect(props().visStateActions.onLayerHover).toHaveBeenLastCalledWith(dataHover, 0);
    } finally {
      jest.useRealTimers();
    }
  });

  test('uses the stop ID and latest authored settings after reordering during a drag', () => {
    const {commit, update, handles, picked, event, props} = setupPath();
    handles().onDragStart(picked, event);
    const edited = {...tour.stops[0], name: 'Renamed', camera: {...camera, zoom: 8}};
    update({visState: {...props().visState, cameraTour: {stops: [tour.stops[1], edited]}}});
    act(() => {
      handles().onDragEnd({...picked, coordinate: [30, 40]}, event);
    });
    expect(commit).toHaveBeenLastCalledWith({
      stops: [tour.stops[1], {...edited, camera: {...edited.camera, longitude: 30, latitude: 40}}]
    });
  });

  test.each([undefined, [], [NaN, 10], [10, Infinity], [10, 91], [10, -91]])(
    'ignores invalid drag coordinates %j',
    coordinate => {
      const {commit, handles, picked, event} = setupPath();
      handles().onDragStart(picked, event);
      expect(handles().onDrag({...picked, coordinate}, event)).toBe(true);
      expect(handles().onDragEnd({...picked, coordinate}, event)).toBe(true);
      expect(commit).not.toHaveBeenCalled();
    }
  );

  test('does not commit stationary, right-button, or unstarted drags', () => {
    const {commit, handles, picked, event} = setupPath();
    expect(handles().onDrag({...picked, coordinate: [30, 40]}, event)).toBe(false);
    expect(handles().onDragStart(picked, {...event, rightButton: true})).toBe(false);
    expect(handles().onDragEnd({...picked, coordinate: [30, 40]}, event)).toBe(false);
    expect(event.stopPropagation).not.toHaveBeenCalled();
    handles().onDragStart(picked, event);
    handles().onDragEnd(picked, event);
    expect(commit).not.toHaveBeenCalled();
  });

  test.each(['hidden', 'disabled', 'readOnly', 'export', 'removed'])(
    'stops editing when the path is %s during a drag',
    state => {
      const {commit, update, layers, handles, picked, event, props} = setupPath();
      const callbacks = handles();
      callbacks.onDragStart(picked, event);
      const {mapControls, visState} = props();
      update(
        state === 'hidden'
          ? {mapControls: {...mapControls, cameraTourPath: {show: false}}}
          : state === 'disabled'
          ? {mapControls: {...mapControls, cameraTour: {show: false}}}
          : state === 'readOnly'
          ? {readOnly: true}
          : state === 'export'
          ? {isExport: true}
          : {visState: {...visState, cameraTour: null}}
      );
      expect(layers().every(layer => !layer.props.pickable)).toBe(true);
      callbacks.onDrag({...picked, coordinate: [30, 40]}, event);
      callbacks.onDragEnd({...picked, coordinate: [31, 41]}, event);
      callbacks.onClick(picked, event);
      expect(commit).not.toHaveBeenCalled();
      expect(props().uiStateActions.setMapControlSettings).not.toHaveBeenCalled();
      expect(props().uiStateActions.toggleSidePanel).not.toHaveBeenCalled();
    }
  );

  test('keeps noninteractive maps passive and handles stop clicks without selecting data', () => {
    const {layers, handles, picked, event, commit} = setupPath();
    expect(layers(false).every(layer => !layer.props.pickable)).toBe(true);
    expect(layers(false)[1].props.onDragStart).toBeNull();
    expect(handles().onClick(picked, event)).toBe(true);
    expect(commit).not.toHaveBeenCalled();
  });
});

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
    visStateActions: {wmsFeatureInfo: jest.fn(), layerSetIsValid: jest.fn()},
    uiStateActions: {addNotification: jest.fn()},
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

describe('layer-render error notifications', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  test('defers a red notification, throttles duplicates, and disables the originating layer', () => {
    const {props, layer, ref, rerender, getState} = setup();
    const error = new Error('Cannot render geometry');
    ref.current._onLayerError(0, error);
    ref.current._onLayerError(0, error);
    expect(props.uiStateActions.addNotification).not.toHaveBeenCalled();
    expect(props.visStateActions.layerSetIsValid).not.toHaveBeenCalled();
    // Moving the layer before reporting must not change the error's owner.
    rerender({...getState(), layers: [{...layer, id: 'other'}, layer]});
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(props.uiStateActions.addNotification).toHaveBeenCalledTimes(1);
    const notification = props.uiStateActions.addNotification.mock.calls[0][0];
    expect(notification.type).toBe('error');
    expect(notification.message).toContain(error.message);
    expect(notification.message).toContain(layer.id);
    expect(props.visStateActions.layerSetIsValid).toHaveBeenCalledTimes(1);
    expect(props.visStateActions.layerSetIsValid).toHaveBeenCalledWith(layer, false);
  });

  test.each(['removed', 'replaced', 'unmounted'])(
    'ignores a deferred error after the layer is %s',
    change => {
      const {props, layer, ref, view, rerender, getState} = setup();
      ref.current._onLayerError(0, new Error('Cannot render geometry'));
      if (change === 'unmounted') {
        view.unmount();
      } else {
        rerender({...getState(), layers: change === 'removed' ? [] : [{...layer}]});
      }
      act(() => {
        jest.runOnlyPendingTimers();
      });
      expect(props.uiStateActions.addNotification).not.toHaveBeenCalled();
      expect(props.visStateActions.layerSetIsValid).not.toHaveBeenCalled();
    }
  );

  test('existing deck.gl errors still notify and disable the top-level layer', () => {
    const {props, layer, ref} = setup();
    const deckLayer = {id: layer.id, props: {id: layer.id}};
    const error = new Error('GPU error');
    ref.current._onDeckError(error, {id: 'sublayer', parent: deckLayer});
    expect(props.visStateActions.layerSetIsValid).toHaveBeenCalledWith(deckLayer, false);
    expect(props.uiStateActions.addNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'error',
        message: expect.stringContaining(error.message)
      })
    );
  });
});

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

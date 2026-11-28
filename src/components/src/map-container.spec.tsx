// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {createRef, StrictMode, useContext, useState} from 'react';
import {act, fireEvent, render, screen} from '@testing-library/react';
import {ThemeProvider} from 'styled-components';
import {IntlProvider} from 'react-intl';
import {Deck, MapView, WebMercatorViewport} from '@deck.gl/core';
import {ScatterplotLayer} from '@deck.gl/layers';
import {EditableGeoJsonLayer, ViewMode} from '@deck.gl-community/editable-layers';
import {Timeline} from '@luma.gl/engine';
import {EDITOR_MODES} from '@kepler.gl/constants';
import {BitmapOverlayLayer, getEditorLayer, KeplerGlLayers} from '@kepler.gl/layers';
import MapContainerFactory from './map-container';
import {isPointVisibleOnGlobe} from './annotations/annotation-utils';
import {
  INITIAL_MAP_STATE,
  INITIAL_MAP_STYLE,
  INITIAL_UI_STATE,
  INITIAL_VIS_STATE,
  layerClickUpdater,
  mapStateUpdaters,
  visStateUpdaters,
  wmsFeatureInfoUpdater
} from '@kepler.gl/reducers';
import {addAnnotation, updateMap} from '@kepler.gl/actions';
import {MapViewStateContext, MapViewStateContextProvider} from './map-view-state-context';
import type {CameraTour} from '@kepler.gl/types';
import {theme} from '@kepler.gl/styles';
import {messages} from '@kepler.gl/localization';
import {createDataContainer, getApplicationConfig, initApplicationConfig} from '@kepler.gl/utils';

jest.mock('styled-components', () => ({
  __esModule: true,
  ...jest.requireActual('styled-components'),
  withTheme: Component => Component
}));

jest.mock('@kepler.gl/utils', () => ({
  ...jest.requireActual('@kepler.gl/utils'),
  hasMobileWidth: jest.fn(() => false),
  patchDeckRendererForPostProcessing: jest.fn()
}));

jest.mock('./loading-indicator', () => ({
  ...jest.requireActual('./loading-indicator'),
  __esModule: true,
  default: () => null
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

describe('annotation placement during map initialization', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    (MapContainer.prototype._renderMap as jest.Mock).mockRestore();
    jest.spyOn(MapContainer.prototype, '_renderDeckOverlay').mockReturnValue(<div />);
  });
  afterEach(() => jest.useRealTimers());

  test.each([
    [0, 0],
    [1, 1],
    [100, 100],
    [300, 150]
  ])(
    'keeps annotations centered when a delayed camera update has a %s x %s viewport',
    (width, height) => {
      const ref = createRef<any>();
      const onViewStateChange = jest.fn();
      function AddAnnotation({onAdd}) {
        const {getInternalViewState} = useContext(MapViewStateContext);
        return (
          <button
            onClick={() => {
              const {longitude, latitude} = getInternalViewState();
              onAdd(addAnnotation({anchorPoint: [longitude, latitude]}));
            }}
          >
            Add annotation
          </button>
        );
      }
      function App() {
        const [mapState, setMapState] = useState(INITIAL_MAP_STATE);
        const [visState, setVisState] = useState(INITIAL_VIS_STATE);
        return (
          <MapViewStateContextProvider mapState={mapState}>
            <AddAnnotation
              onAdd={action =>
                setVisState(previous => visStateUpdaters.addAnnotationUpdater(previous, action))
              }
            />
            <MapContainer
              ref={ref}
              mapState={mapState}
              mapStyle={INITIAL_MAP_STYLE}
              visState={visState}
              mapControls={INITIAL_UI_STATE.mapControls}
              visStateActions={{}}
              uiStateActions={{}}
              onViewStateChange={onViewStateChange}
              mapStateActions={{
                updateMap: (viewport, index) =>
                  setMapState(previous =>
                    mapStateUpdaters.updateMapUpdater(previous, updateMap(viewport, index))
                  )
              }}
            />
          </MapViewStateContextProvider>
        );
      }
      const {container} = render(
        <ThemeProvider theme={theme}>
          <IntlProvider locale="en" messages={messages.en}>
            <App />
          </IntlProvider>
        </ThemeProvider>
      );
      act(() => ref.current._handleResize({width: 1000, height: 600}));
      act(() => {
        // The renderer can initialize before the container is measured. Its
        // delayed camera update must not overwrite the latest measurement.
        ref.current._onViewportChange({
          viewState: {...INITIAL_MAP_STATE, width, height}
        });
      });
      act(() => jest.advanceTimersByTime(20));
      fireEvent.click(screen.getByRole('button', {name: 'Add annotation'}));

      const shape = container.querySelector('[data-annotation-part="shape"]');
      const position = () => {
        const coordinates = shape?.getAttribute('transform')?.match(/translate\(([^,]+),([^)]+)\)/);
        return [Number(coordinates?.[1]), Number(coordinates?.[2])];
      };
      expect(position()[0]).toBeCloseTo(500);
      expect(position()[1]).toBeCloseTo(300);
      expect(onViewStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({width: 1000, height: 600})
      );

      // Panning must keep the annotation at its original geographic anchor,
      // rather than moving it to the new camera center.
      const panned = {
        ...INITIAL_MAP_STATE,
        width: 1000,
        height: 600,
        longitude: INITIAL_MAP_STATE.longitude + 0.05,
        latitude: INITIAL_MAP_STATE.latitude + 0.05
      };
      act(() => ref.current._onViewportChange({viewState: panned}));
      act(() => jest.advanceTimersByTime(20));
      const expected = new WebMercatorViewport(panned).project([
        INITIAL_MAP_STATE.longitude,
        INITIAL_MAP_STATE.latitude
      ]);
      expect(position()[0]).toBeCloseTo(expected[0]);
      expect(position()[1]).toBeCloseTo(expected[1]);
    }
  );
});

describe('brush radius overlay', () => {
  function setup({
    showBrush,
    enabled = true,
    size = 2.5,
    isExport = false
  }: {
    showBrush?: boolean;
    enabled?: boolean;
    size?: number;
    isExport?: boolean;
  } = {}) {
    const deckProps = new Map<number, any>();
    (MapContainer.prototype._renderMap as jest.Mock).mockImplementation(function (this: any) {
      const overlay = this._renderDeckOverlay([], {primaryMap: true, isInteractive: true});
      const deck = React.Children.toArray(overlay.props.children)[0] as React.ReactElement<any>;
      deckProps.set(this.props.index, deck.props);
      return React.cloneElement(
        overlay,
        {'data-testid': `map-${this.props.index}`},
        <div className="deck-events-root">
          <canvas />
          <div id="view-MapView" />
        </div>
      );
    });
    const ref = createRef<any>();
    const props = {
      index: 0,
      theme,
      isExport,
      mapState: {...INITIAL_MAP_STATE, width: 400, height: 300, latitude: 0, longitude: 0, zoom: 0},
      mapStyle: INITIAL_MAP_STYLE,
      visState: {
        ...INITIAL_VIS_STATE,
        interactionConfig: {
          ...INITIAL_VIS_STATE.interactionConfig,
          brush: {...INITIAL_VIS_STATE.interactionConfig.brush, enabled, config: {size, showBrush}}
        }
      },
      mapControls: INITIAL_UI_STATE.mapControls,
      visStateActions: {onMouseMove: jest.fn()},
      generateDeckGLLayers: () => []
    };
    const rendered = render(<MapContainer {...props} ref={ref} />);
    const canvas = rendered.container.querySelector('canvas')!;
    const circle = (index = 0) =>
      deckProps.get(index)?.layers.find(layer => layer.id === 'brush-radius');
    return {rendered, canvas, circle, ref, props};
  }

  test('follows the pointer and radius and clears when the pointer leaves the map', () => {
    const {rendered, canvas, circle, props, ref} = setup({showBrush: true});
    expect(circle()).toBeUndefined();
    fireEvent.mouseMove(canvas, {clientX: 120, clientY: 100});
    let position = circle().props.data[0];
    const viewport = new WebMercatorViewport(props.mapState);
    expect(viewport.project(position)[0]).toBeCloseTo(120);
    expect(viewport.project(position)[1]).toBeCloseTo(100);
    const initialRadius = circle().props.getRadius;
    expect(initialRadius).toBeGreaterThan(0);
    expect(circle().props.pickable).toBe(false);

    fireEvent.mouseMove(canvas, {clientX: 230, clientY: 140});
    position = circle().props.data[0];
    expect(viewport.project(position)[0]).toBeCloseTo(230);
    expect(viewport.project(position)[1]).toBeCloseTo(140);

    const nextProps = {
      ...props,
      visState: {
        ...props.visState,
        interactionConfig: {
          ...props.visState.interactionConfig,
          brush: {...props.visState.interactionConfig.brush, config: {size: 5, showBrush: true}}
        }
      }
    };
    rendered.rerender(<MapContainer {...nextProps} ref={ref} />);
    expect(circle().props.getRadius).toBe(initialRadius * 2);
    fireEvent.mouseLeave(canvas);
    expect(circle()).toBeUndefined();
    ref.current._onMouseMoveDebounced.cancel();
  });

  test('tracks the Deck view surface above the overlay canvas', () => {
    const {rendered, circle, props, ref} = setup({showBrush: true});
    const surface = rendered.container.querySelector('#view-MapView')!;
    fireEvent.mouseMove(surface, {clientX: 120, clientY: 100});
    const position = circle().props.data[0];
    const viewport = new WebMercatorViewport(props.mapState);
    expect(viewport.project(position)[0]).toBeCloseTo(120);
    expect(viewport.project(position)[1]).toBeCloseTo(100);
    ref.current._onMouseMoveDebounced.cancel();
  });

  test.each([
    {},
    {showBrush: false},
    {showBrush: true, enabled: false},
    {showBrush: true, isExport: true}
  ])('omits the circle for inactive, legacy or exported maps: %j', options => {
    const {canvas, circle, ref} = setup(options);
    fireEvent.mouseMove(canvas, {clientX: 120, clientY: 100});
    expect(circle()).toBeUndefined();
    ref.current._onMouseMoveDebounced.cancel();
  });

  test('keeps the circle local to the hovered split map and hides it over controls', () => {
    const {canvas, circle, ref, props} = setup({showBrush: true});
    const second = render(<MapContainer {...props} index={1} />);
    fireEvent.mouseMove(canvas, {clientX: 120, clientY: 100});
    expect(circle()).toBeDefined();
    expect(circle(1)).toBeUndefined();
    fireEvent.mouseMove(canvas.parentElement!, {clientX: 150, clientY: 100});
    expect(circle()).toBeUndefined();
    second.unmount();
    ref.current._onMouseMoveDebounced.cancel();
  });
});

describe('map coordinate copying', () => {
  const originalConfig = {...getApplicationConfig()};

  afterEach(() => initApplicationConfig(originalConfig));

  function setupCoordinateMenu(
    coordinateEnabled: boolean,
    enableAnnotations: boolean,
    {readOnly = false, isExport = false} = {}
  ) {
    initApplicationConfig({enableAnnotations});
    (MapContainer.prototype._renderMap as jest.Mock).mockReturnValue(<div />);
    const view = render(
      <ThemeProvider theme={theme}>
        <IntlProvider locale="en" messages={messages.en}>
          <MapContainer
            readOnly={readOnly}
            isExport={isExport}
            mapState={{...INITIAL_MAP_STATE, width: 400, height: 300}}
            mapStyle={INITIAL_MAP_STYLE}
            visState={{
              ...INITIAL_VIS_STATE,
              interactionConfig: {
                ...INITIAL_VIS_STATE.interactionConfig,
                coordinate: {
                  ...INITIAL_VIS_STATE.interactionConfig.coordinate,
                  enabled: coordinateEnabled
                }
              }
            }}
            mapStateActions={{updateMap: jest.fn()}}
          />
        </IntlProvider>
      </ThemeProvider>
    );
    const map = view.container.firstElementChild as HTMLElement;
    jest.spyOn(map, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 400,
      height: 300
    } as DOMRect);
    fireEvent.contextMenu(map, {clientX: 200, clientY: 150});
    return view;
  }

  test('offers copying with tooltip coordinates off by default', () => {
    expect(INITIAL_VIS_STATE.interactionConfig.coordinate.enabled).toBe(false);
    setupCoordinateMenu(INITIAL_VIS_STATE.interactionConfig.coordinate.enabled, false);
    expect(screen.getByRole('menuitem', {name: 'Copy coordinates'})).toBeTruthy();
  });

  test.each([
    [true, true],
    [true, false],
    [false, true],
    [false, false]
  ])(
    'offers copying with coordinates %s and annotations %s',
    (coordinateEnabled, enableAnnotations) => {
      setupCoordinateMenu(coordinateEnabled, enableAnnotations);
      expect(screen.getByRole('menuitem', {name: 'Copy coordinates'})).toBeVisible();
      expect(Boolean(screen.queryByRole('menuitem', {name: 'Add Annotation'}))).toBe(
        enableAnnotations
      );
    }
  );

  test('offers copying on read-only maps with tooltip coordinates disabled', () => {
    setupCoordinateMenu(false, true, {readOnly: true});
    expect(screen.getByRole('menuitem', {name: 'Copy coordinates'})).toBeVisible();
    expect(screen.queryByRole('menuitem', {name: 'Add Annotation'})).toBeNull();
  });

  test('keeps context menus out of image exports', () => {
    setupCoordinateMenu(false, false, {isExport: true});
    expect(screen.queryByRole('menu')).toBeNull();
  });
});

describe('planar rotation gestures', () => {
  function setupController(globeEnabled: boolean) {
    const state = {
      ...INITIAL_MAP_STATE,
      width: 400,
      height: 400,
      longitude: 0,
      latitude: 0,
      zoom: 3,
      pitch: 0,
      bearing: 0,
      dragRotate: true,
      globe: {...INITIAL_MAP_STATE.globe!, enabled: globeEnabled}
    };
    const map = new MapContainer({
      index: 0,
      mapState: state,
      mapStyle: INITIAL_MAP_STYLE,
      visState: INITIAL_VIS_STATE,
      mapControls: INITIAL_UI_STATE.mapControls,
      visStateActions: {},
      generateDeckGLLayers: () => []
    });
    const overlay = map._renderDeckOverlay([], {primaryMap: true, isInteractive: true});
    const deck = React.Children.toArray(overlay.props.children)[0] as React.ReactElement<any>;
    const view = deck.props.views;
    let camera = state;
    const controller = new view.ControllerType({
      makeViewport: props => view.makeViewport({width: 400, height: 400, viewState: props}),
      eventManager: {on: jest.fn(), off: jest.fn()},
      timeline: new Timeline(),
      onViewStateChange: ({viewState}) => {
        camera = {...camera, ...viewState};
        controller.setProps({...camera, ...deck.props.controller, x: 0, y: 0});
      }
    });
    controller.setProps({...camera, ...deck.props.controller, x: 0, y: 0});
    const gesture = (type: string, x: number, y: number, extras = {}) =>
      controller.handleEvent({
        type,
        offsetCenter: {x, y},
        srcEvent: {},
        stopPropagation: jest.fn(),
        ...extras
      });
    return {camera: () => camera, gesture, finalize: () => controller.finalize()};
  }

  test.each([{srcEvent: {metaKey: true}}, {rightButton: true}])(
    'only applies planar rotation in 3D for %j',
    alternateDrag => {
      for (const isGlobe of [true, false]) {
        const {camera, gesture, finalize} = setupController(isGlobe);
        try {
          gesture('panstart', 200, 200, alternateDrag);
          gesture('panmove', 230, 225, alternateDrag);
          gesture('panend', 230, 225, alternateDrag);
          if (isGlobe) {
            expect(camera()).toMatchObject({longitude: 0, latitude: 0, bearing: 0, pitch: 0});
          } else {
            expect(camera().bearing).not.toBe(0);
          }
        } finally {
          finalize();
        }
      }
    }
  );

  test('still pans and pinch-zooms the globe', () => {
    const {camera, gesture, finalize} = setupController(true);
    try {
      gesture('panstart', 200, 200);
      gesture('panmove', 215, 210);
      gesture('panend', 215, 210);
      expect(camera().longitude).not.toBe(0);
      const afterPan = camera();
      const touch = {pointerType: 'touch'};
      gesture('multipanstart', 200, 200, touch);
      gesture('multipanmove', 230, 225, {...touch, deltaX: 30, deltaY: 25});
      gesture('multipanend', 230, 225, touch);
      expect(camera()).toEqual(afterPan);
      gesture('pinchstart', 200, 200, {...touch, scale: 1, rotation: 0});
      gesture('pinchmove', 200, 200, {...touch, scale: 1.5, rotation: 30});
      gesture('pinchend', 200, 200, {...touch, scale: 1.5, rotation: 30});
      expect(camera().zoom).toBeGreaterThan(afterPan.zoom);
      expect(camera().bearing).toBe(afterPan.bearing);
    } finally {
      finalize();
    }
  });
});

describe('double-click zoom', () => {
  function getController(
    controller: boolean | {doubleClickZoom?: boolean} | undefined,
    isDrawing = false,
    isInteractive = true
  ) {
    const map = new MapContainer({
      index: 0,
      mapState: {...INITIAL_MAP_STATE, width: 400, height: 300},
      mapStyle: INITIAL_MAP_STYLE,
      visState: {
        ...INITIAL_VIS_STATE,
        editor: {...INITIAL_VIS_STATE.editor, mode: EDITOR_MODES.DRAW_POLYGON}
      },
      mapControls: {...INITIAL_UI_STATE.mapControls, mapDraw: {active: isDrawing}},
      visStateActions: {},
      generateDeckGLLayers: () => [],
      deckGlProps: {controller}
    });

    const overlay = map._renderDeckOverlay([], {primaryMap: true, isInteractive});
    const deck = React.Children.toArray(overlay.props.children)[0] as React.ReactElement<any>;
    return deck.props.controller;
  }

  test('honors an explicit zoom opt-out without disabling the map controller', () => {
    expect(getController({doubleClickZoom: false}).doubleClickZoom).toBe(false);
  });

  test.each([undefined, {}, true, false])(
    'preserves default zoom for a controller setting of %j without a zoom opt-out',
    controller => {
      expect(getController(controller).doubleClickZoom).toBe(true);
    }
  );

  test('keeps zoom disabled while drawing even when the embedder enables it', () => {
    expect(getController({doubleClickZoom: true}, true).doubleClickZoom).toBe(false);
  });

  test('keeps passive maps non-interactive even when the embedder enables zoom', () => {
    expect(getController({doubleClickZoom: true}, false, false)).toBe(false);
  });
});

describe('embedding app clicks', () => {
  function setupClick(isDrawing = false, hostOnClick = jest.fn(), isInteractive = true) {
    const onLayerClick = jest.fn();
    const map = new MapContainer({
      index: 0,
      mapState: {...INITIAL_MAP_STATE, width: 400, height: 300},
      mapStyle: INITIAL_MAP_STYLE,
      visState: {
        ...INITIAL_VIS_STATE,
        editor: {...INITIAL_VIS_STATE.editor, mode: EDITOR_MODES.DRAW_POLYGON}
      },
      mapControls: {...INITIAL_UI_STATE.mapControls, mapDraw: {active: isDrawing}},
      visStateActions: {onLayerClick},
      generateDeckGLLayers: () => [],
      deckGlProps: {onClick: hostOnClick}
    });
    const overlay = map._renderDeckOverlay([], {primaryMap: true, isInteractive});
    const deck = React.Children.toArray(overlay.props.children)[0] as React.ReactElement<any>;
    return {click: deck.props.onClick, onLayerClick, hostOnClick};
  }

  const feature = {
    picked: true,
    object: {type: 'Feature', geometry: {type: 'Point', coordinates: [10, 20]}}
  };

  test('forwards repeated feature clicks after Kepler handles selection', () => {
    const calls: string[] = [];
    const {click, hostOnClick, onLayerClick} = setupClick(
      false,
      jest.fn(() => calls.push('host'))
    );
    onLayerClick.mockImplementation(() => calls.push('selection'));
    const firstEvent = {srcEvent: {}};
    const repeatEvent = {srcEvent: {}};
    click(feature, firstEvent);
    click(feature, repeatEvent);

    expect(calls).toEqual(['selection', 'host', 'selection', 'host']);
    expect(onLayerClick.mock.calls).toEqual([[feature], [feature]]);
    expect(hostOnClick.mock.calls).toEqual([
      [feature, firstEvent],
      [feature, repeatEvent]
    ]);
  });

  test('keeps feature clicks consumed by drawing out of the embedder callback', () => {
    const {click, hostOnClick, onLayerClick} = setupClick(true);
    const event = {srcEvent: {}};
    click(feature, event);

    expect(onLayerClick).toHaveBeenCalledWith(null, event);
    expect(hostOnClick).not.toHaveBeenCalled();
  });

  test('does not forward clicks from a non-interactive overlay', () => {
    const {click, hostOnClick} = setupClick(false, jest.fn(), false);
    click(feature, {srcEvent: {}});
    expect(hostOnClick).not.toHaveBeenCalled();
  });
});

describe('Draw on Map click timing', () => {
  const A = [1, 1];
  const B = [9, 1];
  const C = [9, 9];
  const D = [1, 9];
  let cleanup: () => void;

  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    cleanup?.();
    jest.useRealTimers();
  });

  function setupDrawing(
    editorMode = EDITOR_MODES.DRAW_POLYGON,
    bitmapEditing = false,
    pickWorldPosition?: (xy: [number, number]) => number[] | null
  ) {
    const element = document.createElement('div');
    document.body.appendChild(element);
    // Use deck's real recognizers: calling a mode's handleClick directly would
    // miss delayed/cancelled clicks between pointer-up and the editor.
    const eventManager = (Deck.prototype as any)._createEventManager.call(
      {props: {}, _onEvent: jest.fn(), _onPointerDown: jest.fn(), _onPointerMove: jest.fn()},
      element
    );
    const onViewStateChange = jest.fn();
    const Controller = new MapView().ControllerType;
    const controller = new Controller({
      eventManager,
      timeline: new Timeline(),
      makeViewport: props => new WebMercatorViewport(props),
      onViewStateChange,
      onStateChange: jest.fn()
    });
    const controllerProps = {
      id: 'map',
      x: 0,
      y: 0,
      width: 400,
      height: 400,
      longitude: 0,
      latitude: 0,
      zoom: 2
    };
    controller.setProps({...controllerProps, doubleClickZoom: false});
    onViewStateChange.mockClear();
    const onSetFeatures = jest.fn();
    const layer: any = getEditorLayer({
      editorMenuActive: true,
      editor: {...INITIAL_VIS_STATE.editor, mode: editorMode},
      onSetFeatures,
      pickWorldPosition,
      setSelectedFeature: jest.fn(),
      featureCollection: {type: 'FeatureCollection', features: []},
      selectedFeatureIndexes: [],
      viewport: new WebMercatorViewport(controllerProps) as any
    });
    // Only GPU initialization/picking is stubbed. Event registration, routing,
    // mode edits and the map controller run as they do in the application.
    layer.context = {deck: {eventManager}};
    jest.spyOn(layer, 'getCurrentLayer').mockReturnValue(layer);
    jest.spyOn(layer as EditableGeoJsonLayer, 'setState').mockImplementation(state => {
      layer.state = {...layer.state, ...state};
    });
    jest.spyOn(layer, 'setNeedsUpdate').mockImplementation(() => undefined);
    jest
      .spyOn(layer as EditableGeoJsonLayer, 'getMapCoords')
      .mockImplementation(coords => coords.map(n => n / 10));
    const modeProps = () => layer.getModeProps(layer.props);
    const getPicks = jest
      .spyOn(layer as EditableGeoJsonLayer, 'getPicks')
      .mockImplementation(coords => {
        const [x, y] = coords.map(n => n / 10);
        return layer
          .getActiveMode()
          .getGuides(modeProps())
          .features.filter(
            f =>
              f.properties.guideType === 'editHandle' &&
              Math.hypot(f.geometry.coordinates[0] - x, f.geometry.coordinates[1] - y) < 0.5
          )
          .map(object => ({object, isGuide: true}));
      });
    layer.initializeState();
    layer.state.mode = new layer.props.mode();
    let bitmapEditor: any;
    if (bitmapEditing) {
      const bitmap = new BitmapOverlayLayer({id: 'drawing-bitmap', dataId: 'drawing-bitmap-data'});
      bitmap.updateLayerVisConfig({editBounds: true});
      bitmapEditor = bitmap
        .renderLayer({
          data: {imageUrl: 'image.png', bounds: [20, 20, 30, 30]},
          mapState: {},
          visible: true
        })
        .find(candidate => candidate.id === `${bitmap.id}-edit`);
      bitmapEditor.context = {deck: {eventManager}};
      jest.spyOn(bitmapEditor, 'getCurrentLayer').mockReturnValue(bitmapEditor);
      jest.spyOn(bitmapEditor as EditableGeoJsonLayer, 'setState').mockImplementation(state => {
        bitmapEditor.state = {...bitmapEditor.state, ...state};
      });
      jest.spyOn(bitmapEditor, 'setNeedsUpdate').mockImplementation(() => undefined);
      jest
        .spyOn(bitmapEditor as EditableGeoJsonLayer, 'getMapCoords')
        .mockImplementation(coords => coords.map(n => n / 10));
      jest.spyOn(bitmapEditor, 'getPicks').mockReturnValue([]);
      bitmapEditor.initializeState();
      bitmapEditor.state.mode = bitmapEditor.props.mode;
    }
    let finalized = false;
    const finalize = () => {
      if (!finalized) layer.finalizeState();
      finalized = true;
    };
    cleanup = () => {
      finalize();
      bitmapEditor?.finalizeState();
      controller.finalize();
      eventManager.destroy();
      element.remove();
    };
    const pointer = (type: string, coords: number[], pointerType = 'mouse') => {
      const [clientX, clientY] = coords.map(n => n * 10);
      const event = new MouseEvent(type, {
        bubbles: true,
        clientX,
        clientY,
        button: 0,
        buttons: type === 'pointerdown' ? 1 : 0
      });
      Object.defineProperties(event, {pointerId: {value: 1}, pointerType: {value: pointerType}});
      element.dispatchEvent(event);
    };
    const click = (coords: number[], pointerType = 'mouse') => {
      pointer('pointerdown', coords, pointerType);
      jest.advanceTimersByTime(10);
      pointer('pointerup', coords, pointerType);
    };
    return {
      click,
      pointer,
      layer,
      getPicks,
      onSetFeatures,
      onViewStateChange,
      finalize,
      setDrawing: (drawing: boolean) => {
        controller.setProps({...controllerProps, doubleClickZoom: !drawing});
        layer.state.mode = drawing ? new layer.props.mode() : new ViewMode();
      },
      guides: () => layer.getActiveMode().getGuides(modeProps()).features
    };
  }

  test.each(['mouse', 'touch'])('commits each %s vertex before the cursor moves', pointerType => {
    const {click, pointer, guides, onViewStateChange} = setupDrawing();
    click(A, pointerType);
    click(B, pointerType);
    pointer('mousemove', C);
    expect(
      guides()
        .filter(f => f.properties.guideType === 'editHandle')
        .map(f => f.geometry.coordinates)
    ).toEqual([A, B]);
    expect(guides()[0].geometry.coordinates).toEqual([A, B, C]);
    expect(onViewStateChange).not.toHaveBeenCalled();
  });

  test('preserves the last vertex when closing at the first point within 300 ms', () => {
    const {click, onSetFeatures} = setupDrawing();
    [A, B, C, D, A].forEach(coords => click(coords));
    expect(onSetFeatures).toHaveBeenCalledTimes(1);
    expect(onSetFeatures.mock.calls[0][0][0].geometry.coordinates).toEqual([[A, B, C, D, A]]);
    jest.advanceTimersByTime(350);
    expect(onSetFeatures).toHaveBeenCalledTimes(1);
  });

  test('commits and finishes a polygon while bitmap bounds editing is active', () => {
    const {click, guides, getPicks, onSetFeatures, onViewStateChange} = setupDrawing(
      EDITOR_MODES.DRAW_POLYGON,
      true
    );
    click(A);
    click(B);
    expect(
      guides()
        .filter(f => f.properties.guideType === 'editHandle')
        .map(f => f.geometry.coordinates)
    ).toEqual([A, B]);
    getPicks.mockReturnValue([]);
    click(C);
    click(D);
    jest.advanceTimersByTime(100);
    click(D);
    expect(onSetFeatures).toHaveBeenCalledTimes(1);
    expect(onSetFeatures.mock.calls[0][0][0].geometry.coordinates).toEqual([[A, B, C, D, A]]);
    expect(onViewStateChange).not.toHaveBeenCalled();
  });

  test.each([EDITOR_MODES.DRAW_POLYGON, EDITOR_MODES.DRAW_LINESTRING])(
    'double-click finishes %s with its final vertex before handles have rendered',
    editorMode => {
      const {click, getPicks, onSetFeatures, onViewStateChange} = setupDrawing(editorMode);
      getPicks.mockReturnValue([]);
      [A, B, C, D].forEach(coords => click(coords));
      jest.advanceTimersByTime(100);
      click(D);
      expect(onSetFeatures).toHaveBeenCalledTimes(1);
      expect(onSetFeatures.mock.calls[0][0][0].geometry.coordinates).toEqual(
        editorMode === EDITOR_MODES.DRAW_POLYGON ? [[A, B, C, D, A]] : [A, B, C, D]
      );
      jest.advanceTimersByTime(350);
      expect(onSetFeatures).toHaveBeenCalledTimes(1);
      expect(onViewStateChange).not.toHaveBeenCalled();
    }
  );

  test('commits a point at the picked XYZ and falls back to the original ground point', () => {
    const pickWorldPosition = jest
      .fn()
      .mockReturnValueOnce([2, 3, 48])
      .mockReturnValueOnce([9, 2, 0])
      .mockReturnValueOnce(null)
      .mockReturnValueOnce([0, 0, NaN]);
    const {click, pointer, onSetFeatures} = setupDrawing(
      EDITOR_MODES.DRAW_POINT,
      false,
      pickWorldPosition
    );
    pointer('mousemove', A);
    expect(pickWorldPosition).not.toHaveBeenCalled();
    [A, B, C, D].forEach(coords => click(coords));
    expect(pickWorldPosition).toHaveBeenNthCalledWith(1, [10, 10]);
    expect(onSetFeatures.mock.calls.map(([features]) => features[0].geometry.coordinates)).toEqual([
      [2, 3, 48],
      B,
      C,
      D
    ]);
  });

  test('retains distinct clicked elevations on a completed line without picking during hover or finish', () => {
    const first = [2, 3, 20];
    const last = [7, 8, 75];
    const pickWorldPosition = jest
      .fn()
      .mockReturnValueOnce(first)
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(last);
    const {click, pointer, getPicks, onSetFeatures} = setupDrawing(
      EDITOR_MODES.DRAW_LINESTRING,
      false,
      pickWorldPosition
    );
    getPicks.mockReturnValue([]);
    click(A);
    pointer('mousemove', B);
    click(B);
    click(C);
    jest.advanceTimersByTime(100);
    click(C);
    expect(pickWorldPosition).toHaveBeenCalledTimes(3);
    expect(onSetFeatures).toHaveBeenCalledTimes(1);
    expect(onSetFeatures.mock.calls[0][0][0].geometry.coordinates).toEqual([first, B, last]);
  });

  test('polygon clicks never pick elevation', () => {
    const pickWorldPosition = jest.fn().mockReturnValue([2, 3, 48]);
    const {click, onSetFeatures} = setupDrawing(
      EDITOR_MODES.DRAW_POLYGON,
      false,
      pickWorldPosition
    );
    [A, B, C, A].forEach(coords => click(coords));
    expect(pickWorldPosition).not.toHaveBeenCalled();
    expect(onSetFeatures.mock.calls[0][0][0].geometry.coordinates).toEqual([[A, B, C, A]]);
  });

  test('double-clicking before a polygon has three vertices does not finish or duplicate it', () => {
    const {click, guides, onSetFeatures} = setupDrawing();
    click(A);
    click(A);
    expect(guides().filter(f => f.properties.guideType === 'editHandle')).toHaveLength(1);
    expect(onSetFeatures).not.toHaveBeenCalled();
  });

  test('restores normal double-click zoom after drawing and after removing the editor', () => {
    const {click, setDrawing, finalize, onViewStateChange} = setupDrawing();
    setDrawing(false);
    for (const removeEditor of [false, true]) {
      if (removeEditor) finalize();
      onViewStateChange.mockClear();
      click(A);
      jest.advanceTimersByTime(100);
      click(A);
      jest.advanceTimersByTime(350);
      expect(onViewStateChange).toHaveBeenCalledTimes(1);
      expect(onViewStateChange.mock.calls[0][0].viewState.zoom).toBe(3);
    }
  });

  test('responds immediately when drawing is enabled again on the same map', () => {
    const {click, setDrawing, guides} = setupDrawing();
    setDrawing(false);
    click(A);
    jest.advanceTimersByTime(350);
    setDrawing(true);
    click(B);
    expect(
      guides()
        .filter(f => f.properties.guideType === 'editHandle')
        .map(f => f.geometry.coordinates)
    ).toEqual([B]);
  });
});

test('sketch depth picking queries only visible, pickable surfaces', () => {
  const container = new MapContainer({});
  const pickObject = jest.fn().mockReturnValue({coordinate: [1, 2, 35]});
  const getLayers = jest.fn().mockReturnValue([
    {id: 'flat', props: {visible: true, pickable: true}},
    {id: 'roof', props: {visible: true, pickable: true, extruded: true}},
    {id: 'hidden-roof', props: {visible: false, pickable: true, extruded: true}},
    {id: 'disabled-roof', props: {visible: true, pickable: false, extruded: true}}
  ]);
  container._deck = {layerManager: {getLayers}, pickObject};

  expect(container._pickSketchWorldPosition([10, 20])).toEqual([1, 2, 35]);
  expect(pickObject).toHaveBeenCalledWith({
    x: 10,
    y: 20,
    radius: 0,
    unproject3D: true,
    layerIds: ['roof']
  });
  getLayers.mockReturnValue([{id: 'flat', props: {visible: true, pickable: true}}]);
  expect(container._pickSketchWorldPosition([10, 20])).toBeNull();
  expect(pickObject).toHaveBeenCalledTimes(1);
});

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
      (
        React.Children.toArray(
          ref.current._renderDeckOverlay([], {primaryMap: index === 0, isInteractive}).props
            .children
        )[0] as React.ReactElement<any>
      ).props;
    const layers = (isInteractive = true) =>
      deckProps(isInteractive).layers.filter(layer => layer.id.startsWith('camera-tour-path-'));
    const handles = () => layers()[1].props;
    const event = {rightButton: false, stopPropagation: jest.fn()};
    const picked = {object: {id: 'home'}, coordinate: [10, 20]};
    return {commit, update, deckProps, layers, handles, event, picked, ref, props: () => props};
  }

  test('animation settings open the requested camera stop through the existing selection request', () => {
    const {ref, props} = setupPath();
    act(() => ref.current._editCameraTour('work'));
    expect(props().uiStateActions.setMapControlSettings).toHaveBeenCalledWith('cameraTour', {
      selection: {stopId: 'work'}
    });
    expect(props().uiStateActions.toggleSidePanel).toHaveBeenCalledWith('interaction');
    props().uiStateActions.setMapControlSettings.mockClear();
    act(() => ref.current._editCameraTour());
    expect(props().uiStateActions.setMapControlSettings).not.toHaveBeenCalled();
  });

  test.each([0, 1])(
    'edits selected stop zoom in pane %s without changing other camera fields',
    index => {
      const {commit, handles, event, picked, ref, update, props} = setupPath(index);
      act(() => {
        act(() => {
          handles().onClick(picked, event);
        });
      });
      act(() => {
        ref.current._onCameraTourZoomChange(7.5);
      });
      expect(commit).toHaveBeenLastCalledWith({
        ...tour,
        stops: [{...tour.stops[0], camera: {...camera, zoom: 7.5}}, tour.stops[1]]
      });
      expect(props().mapStateActions.updateMap).not.toHaveBeenCalled();
      commit.mockClear();
      act(() => {
        ref.current._onCameraTourZoomChange(NaN);
      });
      expect(commit).not.toHaveBeenCalled();
      update({readOnly: true});
      act(() => {
        ref.current._onCameraTourZoomChange(8);
      });
      expect(commit).not.toHaveBeenCalled();
    }
  );

  test('renders the zoom editor outside deck gestures and hides it for passive or removed stops', () => {
    const {ref, handles, picked, event, update, props} = setupPath();
    const control = (isInteractive = true) =>
      React.Children.toArray(
        ref.current._renderDeckOverlay([], {primaryMap: true, isInteractive}).props.children
      )[1] as React.ReactElement<any> | undefined;
    expect(control()).toBeUndefined();
    act(() => {
      handles().onClick(picked, event);
    });
    expect(control()?.props.stop.id).toBe('home');
    expect(control(false)).toBeUndefined();
    act(() => {
      control()?.props.onClose();
    });
    expect(control()).toBeUndefined();
    act(() => {
      handles().onClick(picked, event);
    });
    update({visState: {...props().visState, cameraTour: {stops: [tour.stops[1]]}}});
    expect(control()).toBeUndefined();
  });

  test.each([0, 1])(
    'drags a stop in map %s and redraws the path without changing other settings',
    index => {
      const {commit, layers, handles, picked, event} = setupPath(index);
      expect(layers().map(layer => layer.props.pickable)).toEqual([false, true, false]);
      act(() => {
        expect(handles().onDragStart(picked, event)).toBe(true);
      });
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
      act(() => {
        expect(handles().onClick(picked, event)).toBe(true);
      });
      expect(actions.setMapControlSettings).toHaveBeenLastCalledWith('cameraTour', {
        selection: {stopId: 'work'}
      });
      expect(actions.toggleSidePanel).toHaveBeenLastCalledWith('interaction');
      const firstRequest = actions.setMapControlSettings.mock.lastCall[1].selection;
      act(() => {
        handles().onClick(picked, event);
      });
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
    act(clickPoint);
    expect(align).toHaveBeenCalledWith(picked.coordinate);
    expect(props().mapStateActions.updateMap).toHaveBeenCalledWith({}, index);
    expect(props().uiStateActions.setMapControlSettings).not.toHaveBeenCalled();
    expect(props().uiStateActions.toggleSidePanel).not.toHaveBeenCalled();
    expect(commit).not.toHaveBeenCalled();
    update({visState: {...props().visState, layers: [{...bitmap, alignWaitingForMap: false}]}});
    act(clickPoint);
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
    act(() => {
      handles().onDragStart(picked, event);
    });
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
      act(() => {
        handles().onDragStart(picked, event);
      });
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
    act(() => {
      handles().onDragStart(picked, event);
    });
    handles().onDragEnd(picked, event);
    expect(commit).not.toHaveBeenCalled();
  });

  test.each(['hidden', 'disabled', 'readOnly', 'export', 'removed'])(
    'stops editing when the path is %s during a drag',
    state => {
      const {commit, update, layers, handles, picked, event, props} = setupPath();
      const callbacks = handles();
      act(() => {
        callbacks.onDragStart(picked, event);
      });
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
    act(() => {
      expect(handles().onClick(picked, event)).toBe(true);
    });
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
    visStateActions: {
      wmsFeatureInfo: jest.fn(),
      layerSetIsValid: jest.fn(),
      layerVisConfigChange: jest.fn()
    },
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

test('uses the selected annotation projection before the internal view state catches up', () => {
  const {ref} = setup();
  const mapState = {
    ...INITIAL_MAP_STATE,
    longitude: 0,
    latitude: 0,
    zoom: 0,
    width: 800,
    height: 600,
    globe: {...INITIAL_MAP_STATE.globe!, enabled: false}
  };
  const point = [84.2, 0, 1000];
  const globeMapState = {...mapState, globe: {...mapState.globe, enabled: true}};
  const flatProjection = ref.current._getAnnotationViewport(mapState, mapState).project(point);

  // The context starts with full map state and can still carry the previous
  // globe setting when the map first renders after a projection switch.
  const globe = ref.current._getAnnotationViewport(globeMapState, mapState);
  expect(isPointVisibleOnGlobe(point, globe)).toBe(true);
  expect(isPointVisibleOnGlobe([91.2, 0, 1000], globe)).toBe(false);
  expect(ref.current._getAnnotationViewport(globeMapState, globeMapState).project(point)).toEqual(
    globe.project(point)
  );

  const flat = ref.current._getAnnotationViewport(mapState, globeMapState);
  expect(flat.project(point)).toEqual(flatProjection);
  expect(ref.current._getAnnotationViewport(mapState, mapState).project(point)).toEqual(
    flatProjection
  );
});

test('applies async layer defaults to their originating layer after reordering', () => {
  const {props, layer, ref, rerender, getState} = setup();
  rerender({...getState(), layers: [{...layer, id: 'other'}, layer]});
  ref.current._onLayerVisConfigChange(layer, {showBounds: true});
  expect(props.visStateActions.layerVisConfigChange).toHaveBeenCalledWith(layer, {
    showBounds: true
  });
});

test.each(['removed', 'replaced', 'unmounted'])(
  'ignores async defaults after the layer is %s',
  change => {
    const {props, layer, ref, view, rerender, getState} = setup();
    const apply = ref.current._onLayerVisConfigChange;
    if (change === 'unmounted') view.unmount();
    else rerender({...getState(), layers: change === 'removed' ? [] : [{...layer}]});
    apply(layer, {showBounds: true});
    expect(props.visStateActions.layerVisConfigChange).not.toHaveBeenCalled();
  }
);

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

test.each(['point', 'geojson', 'geoarrow'])(
  'elevation picking reads a %s source row without substituting render Z',
  type => {
    const row = [-1000, 'not an altitude'];
    const layer =
      type === 'point'
        ? new KeplerGlLayers.PointLayer({dataId: 'detections'})
        : new KeplerGlLayers.GeojsonLayer({dataId: 'detections'});
    if (type === 'geoarrow') {
      (layer as InstanceType<typeof KeplerGlLayers.GeojsonLayer>).geoArrowMode = true;
    }
    jest.spyOn(layer, 'hasHoveredObject').mockReturnValue({} as any);
    const getHoverData = jest.spyOn(layer, 'getHoverData');
    const table = {
      fields: [
        {name: 'altitude', type: 'real', fieldIdx: 0},
        {name: 'name', type: 'string', fieldIdx: 1}
      ],
      dataContainer: createDataContainer([row])
    };
    const container = new MapContainer({
      visState: {layers: [layer], datasets: {detections: table}, animationConfig: {}}
    });
    const info = {
      coordinate: [-101.830429, 33.518337, 9000],
      index: 0,
      object: type === 'geoarrow' ? null : type === 'point' ? {index: 0} : {properties: {index: 0}}
    };
    const pickObject = jest.fn(() => info);
    container._deck = {pickObject};
    const field = {dataId: 'detections', name: 'altitude'};
    expect(container._pickAnnotationElevation([10, 20], field)).toEqual({
      coordinate: info.coordinate,
      value: -1000
    });
    expect(getHoverData).toHaveBeenCalledWith(
      info.object ?? info.index,
      table.dataContainer,
      table.fields,
      {},
      info
    );
    expect(pickObject).toHaveBeenCalledWith({x: 10, y: 20, radius: 0, unproject3D: true});
    row[0] = 0;
    expect(container._pickAnnotationElevation([10, 20], field).value).toBe(0);
    for (const value of [null, '', NaN, Infinity]) {
      row[0] = value as any;
      expect(container._pickAnnotationElevation([10, 20], field).value).toBeNull();
    }
    expect(
      container._pickAnnotationElevation([10, 20], {...field, name: 'missing'}).value
    ).toBeNull();
    expect(
      container._pickAnnotationElevation([10, 20], {...field, dataId: 'other'}).value
    ).toBeNull();
  }
);

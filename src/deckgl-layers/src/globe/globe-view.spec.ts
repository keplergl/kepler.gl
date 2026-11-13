// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as DeckCore from '@deck.gl/core';
import {GLOBE_MAX_LATITUDE} from '@kepler.gl/constants';
import {KeplerGlobeView} from './globe-view';

const GlobeViewport = (DeckCore as any)._GlobeViewport;
const makeViewport = (props: any) => new GlobeViewport(props);
const base = {
  width: 800,
  height: 600,
  longitude: 0,
  latitude: 0,
  zoom: 0,
  minZoom: -3,
  maxZoom: 18
};

function createState(overrides = {}) {
  const Controller = new KeplerGlobeView().ControllerType;
  const controller = new Controller({makeViewport});
  return new controller.ControllerState({...base, ...overrides, makeViewport});
}

function visualScale(state: any) {
  return makeViewport(state.getViewportProps()).scale;
}

describe('globe navigation', () => {
  afterEach(() => jest.restoreAllMocks());

  test('keeps the globe projection on both sides of the high-zoom boundary', () => {
    const view = new KeplerGlobeView();
    for (const zoom of [0, 12, 13, 18]) {
      const viewport = view.makeViewport({width: 800, height: 600, viewState: {...base, zoom}});
      expect(viewport).toBeInstanceOf(GlobeViewport);
    }
  });

  test('honors configured zoom bounds rather than forcing the sphere to fill the view', () => {
    const state = createState();
    const zoomedOut = state.zoom({pos: [400, 300], scale: 1 / 32});
    const zoomedIn = state.zoom({pos: [400, 300], scale: 2 ** 20});
    expect(zoomedOut.getViewportProps().zoom).toBe(-3);
    expect(zoomedIn.getViewportProps().zoom).toBe(18);
  });

  test('clamps the camera latitude while preserving the projected scale', () => {
    const state = createState({latitude: 80, zoom: 3});
    expect(state.getViewportProps().latitude).toBe(GLOBE_MAX_LATITUDE);
    expect(visualScale(state)).toBeCloseTo(makeViewport({...base, latitude: 80, zoom: 3}).scale);
  });

  test('starts a drag without a camera jump and preserves visual scale during pan', () => {
    const initial = createState({zoom: 3});
    const started = initial.panStart({pos: [420, 310]});
    const still = started.pan({pos: [420, 310]});
    expect(still.getViewportProps().longitude).toBeCloseTo(0);
    expect(still.getViewportProps().latitude).toBeCloseTo(0);
    const moved = started.pan({pos: [450, 335]});
    expect(moved.getViewportProps().longitude).not.toBe(0);
    expect(visualScale(moved)).toBeCloseTo(visualScale(initial));
    expect(moved.panEnd().getState().startPanLngLat).toBeNull();
  });

  test('freezes off-globe dragging and anchors at the point where the cursor enters', () => {
    const initial = createState();
    const outside = initial.panStart({pos: [0, 0]});
    expect(outside.getState().startPanLngLat).toBe(false);
    expect(outside.pan({pos: [10, 10]})).toBe(outside);
    const entered = outside.pan({pos: [400, 300]});
    expect(entered.getViewportProps()).toEqual(initial.getViewportProps());
    expect(entered.getState().startPanLngLat).toEqual(expect.any(Array));
    const moved = entered.pan({pos: [410, 300]});
    expect(moved.getViewportProps().longitude).not.toBe(0);
    expect(moved.pan({pos: [0, 0]})).toBe(moved);
  });

  test('does not pan without an anchor and clears pinch state at gesture end', () => {
    const initial = createState();
    expect(initial.pan({pos: [400, 300]})).toBe(initial);
    const pinch = initial.zoomStart({pos: [410, 300]});
    expect(pinch.getState().startZoomLngLat).toBeTruthy();
    const ended = pinch.zoomEnd();
    expect(ended.getState()).toMatchObject({startZoom: null, startZoomLngLat: null});
  });

  test('off-globe wheel bursts stay centered but a later on-globe burst can anchor', () => {
    const now = jest.spyOn(Date, 'now').mockReturnValue(1000);
    const initial = createState();
    const outside = initial.zoom({pos: [0, 0], scale: 1.1});
    expect(outside.getViewportProps().longitude).toBe(0);
    now.mockReturnValue(1100);
    const suppressed = outside.zoom({pos: [420, 300], scale: 1.1});
    expect(suppressed.getViewportProps().longitude).toBe(0);
    now.mockReturnValue(1400);
    const anchored = suppressed.zoom({pos: [420, 300], scale: 1.1});
    expect(anchored.getViewportProps().longitude).not.toBe(0);
  });

  test('zoom-out follows the short longitude path across the dateline', () => {
    const state = createState({longitude: 179, zoom: 3, startZoom: 3, startZoomLngLat: [-179, 0]});
    const result = state.zoom({pos: [400, 300], scale: 0.5}).getViewportProps();
    expect(result.zoom).toBe(2);
    expect(result.longitude).toBeGreaterThan(179);
    expect(result.longitude).toBeLessThan(180);
  });
});

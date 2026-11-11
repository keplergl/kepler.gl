// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {WebMercatorViewport} from '@deck.gl/core';
// @ts-ignore Experimental export is missing from the repository's deck.gl type augmentation.
import {_GlobeViewport as GlobeViewport} from '@deck.gl/core';
import CameraTourZoomControl from './camera-tour-zoom-control';

const stop = {
  id: 'home',
  name: 'Home',
  holdDurationMs: 1000,
  travelDurationMs: 2000,
  camera: {longitude: 10, latitude: 20, zoom: 6, bearing: 30, pitch: 45}
};
const viewport = new WebMercatorViewport({
  width: 800,
  height: 600,
  longitude: 10,
  latitude: 20,
  zoom: 4
});

function preparePointerControl(slider: HTMLElement) {
  Object.assign(slider, {
    setPointerCapture: jest.fn(),
    hasPointerCapture: jest.fn(() => true),
    releasePointerCapture: jest.fn(),
    getBoundingClientRect: () => ({left: 352, top: 252, width: 96, height: 96})
  });
}

function pointer(slider: HTMLElement, type: string, angle: number, pointerId = 1, button = 0) {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX: Math.round(400 + 36 * Math.cos((angle * Math.PI) / 180)),
    clientY: Math.round(300 + 36 * Math.sin((angle * Math.PI) / 180)),
    button
  });
  Object.defineProperty(event, 'pointerId', {value: pointerId});
  fireEvent(slider, event);
}

test('exposes zoom on an accessible arc and edits with the keyboard without map gestures', () => {
  const onChange = jest.fn();
  const onClose = jest.fn();
  const mapGesture = jest.fn();
  render(
    <div
      onPointerDown={mapGesture}
      onPointerMove={mapGesture}
      onPointerUp={mapGesture}
      onMouseDown={mapGesture}
      onTouchStart={mapGesture}
      onClick={mapGesture}
      onDoubleClick={mapGesture}
      onWheel={mapGesture}
      onKeyDown={mapGesture}
    >
      <CameraTourZoomControl
        stop={stop}
        viewport={viewport}
        globe={false}
        onChange={onChange}
        onClose={onClose}
      />
    </div>
  );
  const slider = screen.getByRole('slider', {name: 'Zoom for Home'});
  expect(slider).toHaveAttribute('aria-valuenow', '6');
  expect(slider).toHaveAttribute('aria-valuetext', 'Zoom 6.0');
  expect(screen.getByText('Zoom 6.0')).toBeVisible();
  expect(slider).toHaveAttribute('tabindex', '0');
  for (const [key, value] of [
    ['ArrowUp', 6.1],
    ['ArrowRight', 6.1],
    ['ArrowDown', 5.9],
    ['ArrowLeft', 5.9],
    ['PageUp', 7],
    ['PageDown', 5],
    ['Home', 0],
    ['End', 24]
  ]) {
    fireEvent.keyDown(slider, {key});
    expect(onChange).toHaveBeenLastCalledWith(value);
  }
  preparePointerControl(slider);
  pointer(slider, 'pointerdown', 270);
  pointer(slider, 'pointermove', 280);
  pointer(slider, 'pointerup', 280);
  fireEvent.mouseDown(slider);
  fireEvent.touchStart(slider);
  fireEvent.click(slider);
  fireEvent.doubleClick(slider);
  fireEvent.wheel(slider);
  fireEvent.keyDown(slider, {key: 'Escape'});
  expect(onClose).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole('button', {name: 'Close zoom control'}));
  expect(onClose).toHaveBeenCalledTimes(2);
  expect(mapGesture).not.toHaveBeenCalled();
});

test('clicks and drags the arc, captures the pointer, and clamps across the gap', () => {
  const onChange = jest.fn();
  render(
    <CameraTourZoomControl
      stop={stop}
      viewport={viewport}
      globe={false}
      onChange={onChange}
      onClose={jest.fn()}
    />
  );
  const slider = screen.getByRole('slider');
  preparePointerControl(slider);
  pointer(slider, 'pointerdown', 270);
  expect(onChange).toHaveBeenLastCalledWith(12);
  expect(slider).toHaveFocus();
  expect(slider.setPointerCapture).toHaveBeenCalledWith(1);
  pointer(slider, 'pointermove', 360);
  expect(onChange).toHaveBeenLastCalledWith(20);
  pointer(slider, 'pointermove', 405);
  expect(onChange).toHaveBeenLastCalledWith(24);
  pointer(slider, 'pointermove', 460);
  expect(onChange).toHaveBeenLastCalledWith(24);
  pointer(slider, 'pointerup', 460);
  expect(slider.releasePointerCapture).toHaveBeenCalledWith(1);
  onChange.mockClear();
  pointer(slider, 'pointermove', 270);
  expect(onChange).not.toHaveBeenCalled();

  pointer(slider, 'pointerdown', 135);
  expect(onChange).toHaveBeenLastCalledWith(0);
  pointer(slider, 'pointermove', 80);
  expect(onChange).toHaveBeenLastCalledWith(0);
});

test('ignores other pointers and stops dragging after cancellation or lost capture', () => {
  const onChange = jest.fn();
  render(
    <CameraTourZoomControl
      stop={stop}
      viewport={viewport}
      globe={false}
      onChange={onChange}
      onClose={jest.fn()}
    />
  );
  const slider = screen.getByRole('slider');
  preparePointerControl(slider);
  pointer(slider, 'pointerdown', 270, 1, 2);
  expect(onChange).not.toHaveBeenCalled();
  for (const endEvent of ['pointercancel', 'lostpointercapture']) {
    pointer(slider, 'pointerdown', 270);
    onChange.mockClear();
    pointer(slider, 'pointerdown', 360, 2);
    pointer(slider, 'pointermove', 360, 2);
    pointer(slider, endEvent, 270);
    pointer(slider, 'pointermove', 360);
    expect(onChange).not.toHaveBeenCalled();
  }
});

test('clamps keyboard adjustments to configured limits and reflects updated zoom', () => {
  const onChange = jest.fn();
  const props = {
    stop,
    viewport,
    globe: false,
    onChange,
    onClose: jest.fn(),
    minZoom: 5.9,
    maxZoom: 6.1
  };
  const {rerender} = render(<CameraTourZoomControl {...props} />);
  const slider = screen.getByRole('slider');
  fireEvent.keyDown(slider, {key: 'PageUp'});
  expect(onChange).toHaveBeenLastCalledWith(6.1);
  fireEvent.keyDown(slider, {key: 'PageDown'});
  expect(onChange).toHaveBeenLastCalledWith(5.9);
  rerender(
    <CameraTourZoomControl {...props} stop={{...stop, camera: {...stop.camera, zoom: 6.1}}} />
  );
  expect(slider).toHaveAttribute('aria-valuenow', '6.1');
  expect(screen.getByText('Zoom 6.1')).toBeVisible();
  fireEvent.keyDown(slider, {key: 'ArrowUp'});
  expect(onChange).toHaveBeenLastCalledWith(6.1);
  rerender(<CameraTourZoomControl {...props} minZoom={6} maxZoom={6} />);
  preparePointerControl(slider);
  pointer(slider, 'pointerdown', 270);
  expect(onChange).toHaveBeenLastCalledWith(6);
});

test('hides far-side globe stops and shows front-side stops', () => {
  const globe = new GlobeViewport({width: 800, height: 600, longitude: 10, latitude: 20, zoom: 0});
  const props = {stop, viewport: globe, globe: true, onChange: jest.fn(), onClose: jest.fn()};
  const {rerender} = render(<CameraTourZoomControl {...props} />);
  expect(screen.getByRole('slider')).toBeInTheDocument();
  rerender(
    <CameraTourZoomControl
      {...props}
      stop={{...stop, camera: {...stop.camera, longitude: -170, latitude: -20}}}
    />
  );
  expect(screen.queryByRole('slider')).not.toBeInTheDocument();
});

test('follows wrapped flat-map coordinates and hides offscreen stops', () => {
  const wrapped = new WebMercatorViewport({
    width: 800,
    height: 600,
    longitude: 370,
    latitude: 20,
    zoom: 4
  });
  const props = {stop, viewport: wrapped, globe: false, onChange: jest.fn(), onClose: jest.fn()};
  const {rerender} = render(<CameraTourZoomControl {...props} />);
  let slider = screen.getByRole('slider');
  preparePointerControl(slider);
  pointer(slider, 'pointerdown', 270);
  expect(props.onChange).toHaveBeenLastCalledWith(12);
  rerender(
    <CameraTourZoomControl {...props} stop={{...stop, camera: {...stop.camera, longitude: 160}}} />
  );
  expect(screen.queryByRole('slider')).not.toBeInTheDocument();
  rerender(<CameraTourZoomControl {...props} />);
  slider = screen.getByRole('slider');
  preparePointerControl(slider);
  pointer(slider, 'pointerdown', 360);
  expect(props.onChange).toHaveBeenLastCalledWith(20);
});

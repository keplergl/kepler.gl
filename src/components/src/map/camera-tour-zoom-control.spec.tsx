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
    getBoundingClientRect: () => ({left: 356, top: 252, width: 32, height: 96})
  });
}

function pointer(slider: HTMLElement, type: string, progress: number, pointerId = 1, button = 0) {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX: 372,
    clientY: 252 + 84 - progress * 72,
    button
  });
  Object.defineProperty(event, 'pointerId', {value: pointerId});
  fireEvent(slider, event);
}

test('places the zoom control left of the point to leave its label clear', () => {
  render(
    <CameraTourZoomControl
      stop={stop}
      viewport={viewport}
      globe={false}
      onChange={jest.fn()}
      onClose={jest.fn()}
    />
  );
  const control = screen.getByRole('group', {name: 'Zoom for Home'});
  const slider = screen.getByRole('slider');
  const [pointX] = viewport.project([stop.camera.longitude, stop.camera.latitude]);
  const controlRight = parseFloat(control.style.left) + Number(slider.getAttribute('width'));
  expect(controlRight).toBeLessThan(pointX);
});

test('exposes zoom on an accessible vertical bar and edits with the keyboard without map gestures', () => {
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
  expect(slider).toHaveAttribute('aria-orientation', 'vertical');
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
  pointer(slider, 'pointerdown', 0.5);
  pointer(slider, 'pointermove', 0.6);
  pointer(slider, 'pointerup', 0.6);
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

test('increases zoom when dragged upward, captures the pointer, and clamps beyond both ends', () => {
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
  pointer(slider, 'pointerdown', 0.5);
  expect(onChange).toHaveBeenLastCalledWith(12);
  expect(slider).toHaveFocus();
  expect(slider.setPointerCapture).toHaveBeenCalledWith(1);
  pointer(slider, 'pointermove', 5 / 6);
  expect(onChange).toHaveBeenLastCalledWith(20);
  pointer(slider, 'pointermove', 1);
  expect(onChange).toHaveBeenLastCalledWith(24);
  pointer(slider, 'pointermove', 1.5);
  expect(onChange).toHaveBeenLastCalledWith(24);
  pointer(slider, 'pointerup', 1.5);
  expect(slider.releasePointerCapture).toHaveBeenCalledWith(1);
  onChange.mockClear();
  pointer(slider, 'pointermove', 0.5);
  expect(onChange).not.toHaveBeenCalled();

  pointer(slider, 'pointerdown', 0);
  expect(onChange).toHaveBeenLastCalledWith(0);
  pointer(slider, 'pointermove', -0.5);
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
  pointer(slider, 'pointerdown', 0.5, 1, 2);
  expect(onChange).not.toHaveBeenCalled();
  for (const endEvent of ['pointercancel', 'lostpointercapture']) {
    pointer(slider, 'pointerdown', 0.5);
    onChange.mockClear();
    pointer(slider, 'pointerdown', 5 / 6, 2);
    pointer(slider, 'pointermove', 5 / 6, 2);
    pointer(slider, endEvent, 270);
    pointer(slider, 'pointermove', 5 / 6);
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
  pointer(slider, 'pointerdown', 0.5);
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
  pointer(slider, 'pointerdown', 0.5);
  expect(props.onChange).toHaveBeenLastCalledWith(12);
  rerender(
    <CameraTourZoomControl {...props} stop={{...stop, camera: {...stop.camera, longitude: 160}}} />
  );
  expect(screen.queryByRole('slider')).not.toBeInTheDocument();
  rerender(<CameraTourZoomControl {...props} />);
  slider = screen.getByRole('slider');
  preparePointerControl(slider);
  pointer(slider, 'pointerdown', 5 / 6);
  expect(props.onChange).toHaveBeenLastCalledWith(20);
});

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

test('edits zoom through buttons and keyboard-accessible range without map gestures', () => {
  const onChange = jest.fn();
  const onClose = jest.fn();
  const mapGesture = jest.fn();
  render(
    <div
      onPointerDown={mapGesture}
      onClick={mapGesture}
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
  fireEvent.click(screen.getByRole('button', {name: 'Increase stop zoom'}));
  expect(onChange).toHaveBeenLastCalledWith(6.5);
  fireEvent.click(screen.getByRole('button', {name: 'Decrease stop zoom'}));
  expect(onChange).toHaveBeenLastCalledWith(5.5);
  const slider = screen.getByRole('slider', {name: 'Zoom for Home'});
  fireEvent.change(slider, {target: {value: '8.2'}});
  expect(onChange).toHaveBeenLastCalledWith(8.2);
  fireEvent.pointerDown(slider);
  fireEvent.wheel(slider);
  fireEvent.keyDown(slider, {key: 'Escape'});
  expect(onClose).toHaveBeenCalledTimes(1);
  expect(mapGesture).not.toHaveBeenCalled();
});

test('clamps increments to configured bounds and disables buttons at limits', () => {
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
  fireEvent.click(screen.getByRole('button', {name: 'Increase stop zoom'}));
  expect(onChange).toHaveBeenLastCalledWith(6.1);
  fireEvent.click(screen.getByRole('button', {name: 'Decrease stop zoom'}));
  expect(onChange).toHaveBeenLastCalledWith(5.9);
  rerender(
    <CameraTourZoomControl {...props} stop={{...stop, camera: {...stop.camera, zoom: 6.1}}} />
  );
  expect(screen.getByRole('button', {name: 'Increase stop zoom'})).toBeDisabled();
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
  expect(screen.getByRole('slider')).toBeInTheDocument();
  rerender(
    <CameraTourZoomControl {...props} stop={{...stop, camera: {...stop.camera, longitude: 160}}} />
  );
  expect(screen.queryByRole('slider')).not.toBeInTheDocument();
});

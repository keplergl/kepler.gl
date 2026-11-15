// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {ThemeProvider} from 'styled-components';
import {theme} from '@kepler.gl/styles';
import Slider from './slider';

function setup(overrides: Partial<React.ComponentProps<typeof Slider>> = {}) {
  const props = {
    value0: 20,
    value1: 60,
    minValue: 0,
    maxValue: 100,
    step: 5,
    onSlider0Change: jest.fn(),
    onSlider1Change: jest.fn(),
    ...overrides
  };
  return {
    props,
    ...render(
      <ThemeProvider theme={theme}>
        <Slider {...props} />
      </ThemeProvider>
    )
  };
}

test('exposes focusable range endpoints and adjusts them with arrows, Home and End', () => {
  const {props} = setup();
  const start = screen.getByRole('slider', {name: 'Range start'});
  const end = screen.getByRole('slider', {name: 'Range end'});
  expect(start).toHaveAttribute('tabindex', '0');
  expect(start).toHaveAttribute('aria-valuenow', '20');
  expect(start).toHaveAttribute('aria-valuemax', '60');
  expect(end).toHaveAttribute('aria-valuemin', '20');
  fireEvent.keyDown(start, {key: 'ArrowRight'});
  expect(props.onSlider0Change).toHaveBeenLastCalledWith(25);
  fireEvent.keyDown(end, {key: 'ArrowLeft'});
  expect(props.onSlider1Change).toHaveBeenLastCalledWith(55);
  fireEvent.keyDown(start, {key: 'Home'});
  expect(props.onSlider0Change).toHaveBeenLastCalledWith(0);
  fireEvent.keyDown(start, {key: 'End'});
  expect(props.onSlider0Change).toHaveBeenLastCalledWith(60);
  fireEvent.keyDown(end, {key: 'Home'});
  expect(props.onSlider1Change).toHaveBeenLastCalledWith(20);
  fireEvent.keyDown(end, {key: 'End'});
  expect(props.onSlider1Change).toHaveBeenLastCalledWith(100);
});

test('uses neighboring marks for irregular intervals and leaves modified shortcuts alone', () => {
  const {props} = setup({isRanged: false, value1: 25, marks: [0, 10, 25, 90, 100]});
  const handle = screen.getByRole('slider', {name: 'Value'});
  expect(screen.getAllByRole('slider')).toHaveLength(1);
  fireEvent.keyDown(handle, {key: 'ArrowRight'});
  expect(props.onSlider1Change).toHaveBeenLastCalledWith(90);
  fireEvent.keyDown(handle, {key: 'ArrowLeft'});
  expect(props.onSlider1Change).toHaveBeenLastCalledWith(10);
  fireEvent.keyDown(handle, {key: 'ArrowRight', ctrlKey: true});
  expect(props.onSlider1Change).toHaveBeenCalledTimes(2);
});

test('cannot cross endpoints and ignores disabled slider keyboard input', () => {
  const {props, rerender} = setup({value0: 60, value1: 60});
  fireEvent.keyDown(screen.getByRole('slider', {name: 'Range start'}), {key: 'ArrowRight'});
  fireEvent.keyDown(screen.getByRole('slider', {name: 'Range end'}), {key: 'ArrowLeft'});
  expect(props.onSlider0Change).not.toHaveBeenCalled();
  expect(props.onSlider1Change).not.toHaveBeenCalled();
  rerender(
    <ThemeProvider theme={theme}>
      <Slider {...props} disabled />
    </ThemeProvider>
  );
  const handle = screen.getByRole('slider', {name: 'Range start'});
  expect(handle).toHaveAttribute('tabindex', '-1');
  expect(handle).toHaveAttribute('aria-disabled', 'true');
  fireEvent.keyDown(handle, {key: 'ArrowLeft'});
  expect(props.onSlider0Change).not.toHaveBeenCalled();
});

test.each([0, -1, NaN, Infinity])('uses a finite keyboard increment when step is %s', step => {
  const {props} = setup({step});
  fireEvent.keyDown(screen.getByRole('slider', {name: 'Range start'}), {key: 'ArrowRight'});
  fireEvent.keyDown(screen.getByRole('slider', {name: 'Range end'}), {key: 'ArrowLeft'});
  expect(props.onSlider0Change).toHaveBeenCalledWith(21);
  expect(props.onSlider1Change).toHaveBeenCalledWith(59);
});

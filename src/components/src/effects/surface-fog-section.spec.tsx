// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {ThemeProvider} from 'styled-components';
import {theme} from '@kepler.gl/styles';
import {Effect} from '@kepler.gl/types';
import SurfaceFogElevationSectionFactory from './surface-fog-section';
import RangeSliderFactory from '../common/range-slider';

// Isolate the slider's pointer mechanics while exercising real fog configuration.
const Slider = (({value1, onChange}: {value1: number; onChange: (value: number[]) => void}) => (
  <input
    aria-label="elevation"
    type="number"
    value={value1}
    onChange={event => onChange([0, Number(event.target.value)])}
  />
)) as ReturnType<typeof RangeSliderFactory>;
const Section = SurfaceFogElevationSectionFactory(Slider);
const descriptions = [
  {name: 'height', min: -200, max: 6000, defaultValue: 10},
  {name: 'heightEnd', min: -100, max: 7000, defaultValue: 1000},
  {name: 'animateHeight'},
  {name: 'linearEasing'}
];
function effect(parameters: Record<string, unknown> = {}, desc = descriptions) {
  return {id: 'fog', parameters, getParameterDescriptions: () => desc} as unknown as Effect;
}
function Wrapper({children}: {children: React.ReactNode}) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
function setup(parameters: Record<string, unknown> = {}, desc = descriptions) {
  const update = jest.fn();
  const view = render(<Section effect={effect(parameters, desc)} updateEffectConfig={update} />, {
    wrapper: Wrapper
  });
  const heading = screen.queryByText('Elevation');
  if (heading) fireEvent.click(heading);
  return {update, ...view};
}

describe('surface fog elevation editing', () => {
  test('does not offer incomplete elevation parameters', () => {
    const {container} = setup(
      {},
      descriptions.filter(d => d.name !== 'heightEnd')
    );
    expect(container.firstChild).toBeNull();
  });
  test('uses descriptor defaults but preserves explicit zero elevations', () => {
    const {rerender} = setup();
    expect(screen.getAllByRole('spinbutton').map(e => (e as HTMLInputElement).value)).toEqual([
      '10',
      '1000'
    ]);
    rerender(<Section effect={effect({height: 0, heightEnd: 0})} updateEffectConfig={jest.fn()} />);
    expect(screen.getAllByRole('spinbutton').map(e => (e as HTMLInputElement).value)).toEqual([
      '0',
      '0'
    ]);
  });
  test('updates the selected elevation without replacing unrelated parameters', () => {
    const {update} = setup({height: 100, heightEnd: 500, animateHeight: true});
    fireEvent.change(screen.getAllByRole('spinbutton')[0], {target: {value: '200'}});
    expect(update).toHaveBeenLastCalledWith(undefined, 'fog', {parameters: {height: 200}});
    fireEvent.change(screen.getAllByRole('spinbutton')[1], {target: {value: '800'}});
    expect(update).toHaveBeenLastCalledWith(undefined, 'fog', {parameters: {heightEnd: 800}});
  });
  test('starts animation with a usable end when both elevations coincide', () => {
    const {update} = setup({height: 100, heightEnd: 100});
    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    expect(update).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledWith(null, 'fog', {
      parameters: {animateHeight: true, heightEnd: 6000}
    });
  });
  test('preserves a distinct end elevation when enabling animation', () => {
    const {update} = setup({height: 100, heightEnd: 500});
    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    expect(update).toHaveBeenCalledWith(null, 'fog', {parameters: {animateHeight: true}});
  });
  test('disabling animation does not rewrite the saved end', () => {
    const {update} = setup({height: 100, heightEnd: 100, animateHeight: true});
    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    expect(update).toHaveBeenCalledWith(null, 'fog', {parameters: {animateHeight: false}});
  });
  test('toggles easing exactly once without toggling height animation', () => {
    const {update} = setup({animateHeight: true, linearEasing: true});
    fireEvent.click(screen.getAllByRole('checkbox')[1]);
    expect(update).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledWith(null, 'fog', {parameters: {linearEasing: false}});
  });
  test('omits easing when the effect does not support it', () => {
    setup(
      {},
      descriptions.filter(d => d.name !== 'linearEasing')
    );
    expect(screen.getAllByRole('checkbox')).toHaveLength(1);
  });
  test('uses current effect identity and callback after replacement', () => {
    const {update, rerender} = setup({height: 100});
    const replacement = jest.fn();
    const next = {...effect({height: 200, heightEnd: 800}), id: 'replacement'};
    rerender(<Section effect={next} updateEffectConfig={replacement} />);
    fireEvent.change(screen.getAllByRole('spinbutton')[0], {target: {value: '300'}});
    expect(update).not.toHaveBeenCalled();
    expect(replacement).toHaveBeenCalledWith(undefined, 'replacement', {parameters: {height: 300}});
  });
});

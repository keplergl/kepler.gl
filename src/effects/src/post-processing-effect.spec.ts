// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import WaterSimulationEffect from './water-simulation-effect';
import PostProcessingEffect, {getDefaultValueForParameter} from './post-processing-effect';

describe('post-processing effect parameters', () => {
  test('resolves defaults in UI, uniform value, raw uniform, then minimum order', () => {
    expect(
      getDefaultValueForParameter('amount', [{name: 'amount', min: -1, max: 1, defaultValue: 0}], {
        amount: {value: 0.5}
      })
    ).toBe(0);
    expect(
      getDefaultValueForParameter('amount', [{name: 'amount', min: -1, max: 1}], {
        amount: {value: 0}
      })
    ).toBe(0);
    expect(
      getDefaultValueForParameter('amount', [{name: 'amount', min: -1, max: 1}], {amount: 0.5})
    ).toBe(0.5);
    expect(getDefaultValueForParameter('amount', [{name: 'amount', min: -1, max: 1}], {})).toBe(-1);
  });

  test('initializes real deck effect uniforms from shader and UI defaults', () => {
    const effect = new PostProcessingEffect({type: 'hueSaturation'});
    expect(effect.parameters).toMatchObject({hue: 0, saturation: 0.25});
    expect(effect.deckEffect.props).toEqual(effect.parameters);
    expect(effect.isValidToSave()).toBe(true);
  });

  test('explicit zero parameters override defaults and input is not mutated', () => {
    const parameters = Object.freeze({saturation: 0});
    const effect = new PostProcessingEffect({type: 'hueSaturation', parameters});
    expect(effect.parameters).toMatchObject({hue: 0, saturation: 0});
    expect(effect.deckEffect.props).toEqual(effect.parameters);
    expect(parameters).toEqual({saturation: 0});
  });

  test('validates initial and updated values before synchronizing uniforms', () => {
    const effect = new PostProcessingEffect({
      type: 'brightnessContrast',
      parameters: {brightness: 4, contrast: -4}
    });
    expect(effect.deckEffect.props).toMatchObject({brightness: 1, contrast: -1});
    effect.setProps({parameters: {brightness: -4}});
    expect(effect.parameters).toMatchObject({brightness: -1, contrast: -1});
    expect(effect.deckEffect.props).toEqual(effect.parameters);
    effect.setProps({parameters: {contrast: 0}});
    expect(effect.deckEffect.props).toMatchObject({brightness: -1, contrast: 0});
  });

  test('flag-only edits preserve uniforms and honor explicit false values', () => {
    const effect = new PostProcessingEffect({type: 'vibrance', parameters: {amount: 0.75}});
    effect.setProps({isEnabled: false, isConfigActive: false, isJsonEditorActive: true});
    expect(effect.isEnabled).toBe(false);
    expect(effect.isConfigActive).toBe(false);
    expect(effect.isJsonEditorActive).toBe(true);
    expect(effect.deckEffect.props).toEqual({amount: 0.75});
    effect.setProps({isJsonEditorActive: false});
    expect(effect.isJsonEditorActive).toBe(false);
    expect(effect.parameters).toEqual({amount: 0.75});
  });

  test('clones preserve configuration but have independent uniforms and deck instances', () => {
    const effect = new PostProcessingEffect({
      id: 'saved-effect',
      type: 'dotScreen',
      isEnabled: false,
      isConfigActive: false,
      isJsonEditorActive: true,
      parameters: {center: [0.2, 0.8], size: 4}
    });
    const clone = effect.clone();
    expect(clone).toBeInstanceOf(PostProcessingEffect);
    expect(clone.id).toBe('saved-effect');
    expect(clone.type).toBe(effect.type);
    expect(clone.isEnabled).toBe(false);
    expect(clone.isConfigActive).toBe(false);
    expect(clone.isJsonEditorActive).toBe(true);
    expect(clone.parameters).toEqual(effect.parameters);
    expect(clone.deckEffect).not.toBe(effect.deckEffect);
    expect(clone.parameters.center).not.toBe(effect.parameters.center);
    clone.setProps({parameters: {center: [0.9, 0.1], size: 8}});
    expect(clone.deckEffect.props).toMatchObject({center: [0.9, 0.1], size: 8});
    expect(effect.deckEffect.props).toMatchObject({center: [0.2, 0.8], size: 4});
  });

  test('unknown effect types do not create a saveable deck effect', () => {
    const effect = new PostProcessingEffect({type: 'unknown-effect'});
    expect(effect.deckEffect).toBeNull();
    expect(effect.isValidToSave()).toBe(false);
    expect(effect.getParameterDescriptions()).toEqual([]);
  });
});

test('water effect stores settings while cloned maps start with independent empty simulations', () => {
  const effect = new WaterSimulationEffect({id: 'water', parameters: {rain: 0, opacity: 0}});
  expect(effect.isValidToSave()).toBe(true);
  expect(effect.parameters).toMatchObject({
    resolution: 256,
    rain: 0,
    smoothing: 1,
    opacity: 0,
    openBoundary: false
  });
  effect.setProps({parameters: {rain: 0.005, resolution: 512}});
  expect(effect.deckEffect.props.rain).toBe(0.005);
  expect(effect.deckEffect.props.resolution).toBe(512);
  const clone = effect.clone();
  expect(clone.parameters).toEqual(effect.parameters);
  expect(clone.deckEffect).not.toBe(effect.deckEffect);
  expect(clone.deckEffect.id).not.toBe(effect.deckEffect.id);
  expect(clone.deckEffect.getSnapshot()).toMatchObject({ready: false, running: false});
  clone.setProps({parameters: {rain: 0.008, smoothing: 0, resolution: 128}});
  expect(clone.deckEffect.props.smoothing).toBe(0);
  expect(effect.deckEffect.props.smoothing).toBe(1);
  expect(effect.deckEffect.props.rain).toBe(0.005);
  expect(clone.deckEffect.props.resolution).toBe(128);
  expect(effect.deckEffect.props.resolution).toBe(512);
});

test('water rainfall defaults to low and supports the high preset when restoring settings', () => {
  expect(new WaterSimulationEffect().deckEffect.props.rain).toBe(0.01);
  const restored = new WaterSimulationEffect({parameters: {rain: 1, resolution: 2048}});
  expect(restored.deckEffect.props).toMatchObject({rain: 0.1, resolution: 1024});
  expect(restored.clone().deckEffect.props.rain).toBe(0.1);
  restored.setProps({parameters: {rain: -1, resolution: 0}});
  expect(restored.deckEffect.props).toMatchObject({rain: 0, resolution: 64});
});

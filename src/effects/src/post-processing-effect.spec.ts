// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

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

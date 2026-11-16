// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import PostProcessingEffect, {getDefaultValueForParameter} from './post-processing-effect';
import {getAnimatableEffectParameters, validateEffectAnimation} from './animation-utils';
import {LIGHT_AND_SHADOW_EFFECT, POSTPROCESSING_EFFECTS} from '@kepler.gl/constants';

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

  test('optional animation preserves static parameters and never reaches shader uniforms', () => {
    const effect = new PostProcessingEffect({type: 'brightnessContrast'});
    expect(effect).not.toHaveProperty('animation');
    const parameters = {...effect.parameters};
    effect.setProps({animation: {brightness: {endValue: 0, easing: 'linear'}}});
    expect(effect.animation).toEqual({brightness: {endValue: 0, easing: 'linear'}});
    expect(effect.parameters).toEqual(parameters);
    expect(effect.deckEffect.props).toEqual(parameters);
    effect.setProps({parameters: {contrast: 0.5}});
    expect(effect.animation).toEqual({brightness: {endValue: 0, easing: 'linear'}});
    effect.setProps({animation: {contrast: {endValue: 1, easing: 'easeInOut'}}});
    expect(effect.animation).toEqual({contrast: {endValue: 1, easing: 'easeInOut'}});
    effect.setProps({animation: {}});
    expect(effect).not.toHaveProperty('animation');
    expect(effect.parameters.contrast).toBe(0.5);
  });

  test('animation endpoints are bounded, independently cloned, and never mutate input', () => {
    const animation = {
      center: {endValue: Object.freeze([-1, 2]), easing: 'linear' as const},
      size: {endValue: 50, easing: 'easeInOut' as const}
    };
    const effect = new PostProcessingEffect({type: 'dotScreen', animation: animation as any});
    expect(effect.animation).toEqual({
      center: {endValue: [0, 1], easing: 'linear'},
      size: {endValue: 20, easing: 'easeInOut'}
    });
    expect(animation.center.endValue).toEqual([-1, 2]);
    const clone = effect.clone();
    expect(clone.animation).toEqual(effect.animation);
    expect(clone.animation).not.toBe(effect.animation);
    expect(clone.animation?.center).not.toBe(effect.animation?.center);
    expect(clone.animation?.center.endValue).not.toBe(effect.animation?.center.endValue);
    (clone.animation!.center.endValue as number[])[0] = 0.75;
    expect(effect.animation?.center.endValue).toEqual([0, 1]);
  });

  test.each([
    undefined,
    null,
    [],
    {},
    {size: null},
    {size: {endValue: null, easing: 'linear'}},
    {size: {endValue: NaN, easing: 'linear'}},
    {size: {endValue: Infinity, easing: 'linear'}},
    {size: {endValue: 2, easing: 'invalid'}},
    {size: {endValue: '2', easing: 'linear'}},
    {center: {endValue: [0.2], easing: 'linear'}},
    {center: {endValue: [0.2, NaN], easing: 'linear'}},
    {center: {endValue: null, easing: 'linear'}},
    {unknown: {endValue: 2, easing: 'linear'}}
  ])('invalid or absent animation stays static: %j', animation => {
    const effect = new PostProcessingEffect({type: 'dotScreen', animation} as any);
    expect(effect).not.toHaveProperty('animation');
    expect(effect.deckEffect.props).toEqual(effect.parameters);
  });

  test('only continuous effect descriptors accept animation endpoints', () => {
    const descriptions = [
      ...POSTPROCESSING_EFFECTS.surfaceFog.parameters,
      ...LIGHT_AND_SHADOW_EFFECT.parameters,
      {name: '_private', min: 0, max: 1}
    ];
    const animation = Object.fromEntries(
      descriptions.map(description => [description.name, {endValue: 0, easing: 'linear'}])
    );
    animation.fogColor.endValue = [0, 100, 300] as any;
    expect(validateEffectAnimation(animation, descriptions)).toEqual({
      density: {endValue: 0, easing: 'linear'},
      height: {endValue: 0, easing: 'linear'},
      thickness: {endValue: 0, easing: 'linear'},
      fogColor: {endValue: [0, 100, 255], easing: 'linear'},
      shadowIntensity: {endValue: 0, easing: 'linear'},
      sunLightIntensity: {endValue: 0, easing: 'linear'},
      ambientLightIntensity: {endValue: 0, easing: 'linear'}
    });
    expect(
      getAnimatableEffectParameters({getParameterDescriptions: () => descriptions}).map(
        description => description.name
      )
    ).toEqual([
      'density',
      'height',
      'thickness',
      'fogColor',
      'shadowIntensity',
      'sunLightIntensity',
      'ambientLightIntensity',
      'shadowColor',
      'sunLightColor',
      'ambientLightColor'
    ]);
  });
});

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {LightingEffect, PostProcessEffect} from '@deck.gl/core';
import test from 'tape';

import {computeDeckEffects, validateEffectParameters} from '@kepler.gl/utils';
import {VisStateActions} from '@kepler.gl/actions';
import {visStateReducer} from '@kepler.gl/reducers';
import {createEffect} from '@kepler.gl/effects';
import {
  POSTPROCESSING_EFFECTS,
  LIGHT_AND_SHADOW_EFFECT,
  DISTANCE_FOG_TYPE,
  DEFAULT_POST_PROCESSING_EFFECT_TYPE
} from '@kepler.gl/constants';

import {InitialState} from 'test/helpers/mock-state';

test('effectUtils -> computeDeckEffects', t => {
  const initialState = InitialState.visState;
  let nextState = visStateReducer(
    initialState,
    VisStateActions.addEffect({id: 'e_1', type: 'sepia', isEnabled: false})
  );
  nextState = visStateReducer(initialState, VisStateActions.addEffect({id: 'e_1', type: 'ink'}));
  nextState = visStateReducer(
    nextState,
    VisStateActions.addEffect({
      id: 'e_shadow',
      type: 'lightAndShadow',
      parameters: {timestamp: 1689383452635}
    })
  );

  let deckEffects = computeDeckEffects({
    visState: nextState,
    mapState: {latitude: 51.033105, longitude: 0.348512}
  });

  t.equal(deckEffects.length, 2, "disabled deck effects aren't not generated");
  t.ok(deckEffects[0] instanceof LightingEffect, 'lighting effect should be generated');
  t.ok(deckEffects[1] instanceof PostProcessEffect, 'post-processing effect should be generated');

  // nighttime
  t.equal(deckEffects[0].outputUniformShadow, true, 'shadows should be applied uniformly');
  t.equal(deckEffects[0].directionalLights[0].intensity, 0, 'directional light should be disabled');

  // daytime
  nextState.effects[1].setProps({parameters: {timestamp: 1689415852635}});
  deckEffects = computeDeckEffects({
    visState: nextState,
    mapState: {latitude: 51.033105, longitude: 0.348512}
  });
  t.equal(deckEffects[0].shadowColor[3], 0.5, 'shadows should be enabled');
  t.equal(deckEffects[0].directionalLights[0].intensity, 1, 'directional light should be enabled');

  t.end();
});

test('effectUtils -> computeDeckEffects in globe mode', t => {
  const initialState = InitialState.visState;
  let nextState = visStateReducer(
    initialState,
    VisStateActions.addEffect({id: 'e_ink', type: 'ink'})
  );
  nextState = visStateReducer(
    nextState,
    VisStateActions.addEffect({
      id: 'e_shadow',
      type: LIGHT_AND_SHADOW_EFFECT.type,
      parameters: {timestamp: 1689415852635} // daytime
    })
  );
  // Only one fog effect can exist at a time (enforced by addEffectUpdater), so
  // add just the distance fog effect.
  nextState = visStateReducer(
    nextState,
    VisStateActions.addEffect({id: 'e_distance_fog', type: DISTANCE_FOG_TYPE})
  );

  // Flat mode first: keeps ink + lighting + distance fog = 3 effects. Assert on
  // flat mode before globe mode because both calls share (and mutate) the same
  // lighting deckEffect instance.
  const flatEffects = computeDeckEffects({
    visState: nextState,
    mapState: {latitude: 51.033105, longitude: 0.348512}
  });
  t.equal(flatEffects.length, 3, 'flat mode keeps ink, lighting and the fog effect');
  t.ok(
    flatEffects.some(e => e.id === 'distance-fog-effect'),
    'flat mode keeps the distance fog effect'
  );

  // Globe mode: drops the fog effect, keeps ink + lighting (shadow disabled).
  const globeEffects = computeDeckEffects({
    visState: nextState,
    mapState: {latitude: 51.033105, longitude: 0.348512, globe: {enabled: true}}
  });
  t.equal(globeEffects.length, 2, 'globe mode drops the fog effect');
  t.notOk(
    globeEffects.some(e => e.id === 'distance-fog-effect'),
    'globe mode drops the distance fog effect'
  );

  const lightingEffects = globeEffects.filter(e => e instanceof LightingEffect);
  t.equal(lightingEffects.length, 1, 'lighting effect should be kept in globe mode');
  t.equal(
    lightingEffects[0].shadow,
    false,
    'shadows should be disabled on the lighting effect in globe mode'
  );

  t.end();
});

test('effectUtils -> createEffect', t => {
  const defaultEffect = createEffect({});
  const postProcessingEffect = createEffect({
    type: POSTPROCESSING_EFFECTS.hueSaturation.type
  });
  const lightEffect = createEffect({type: LIGHT_AND_SHADOW_EFFECT.type});

  t.equal(
    defaultEffect.type,
    DEFAULT_POST_PROCESSING_EFFECT_TYPE,
    'should create default ink effect'
  );
  t.equal(
    postProcessingEffect.type,
    POSTPROCESSING_EFFECTS.hueSaturation.type,
    'should create hueSaturation effect'
  );
  t.equal(lightEffect.type, LIGHT_AND_SHADOW_EFFECT.type, 'should create Light&Shadow effect');

  t.end();
});

test('effectUtils -> validateEffectParameters', t => {
  const testCases = [
    {
      input: {
        parameters: {},
        config: POSTPROCESSING_EFFECTS.magnify.parameters
      },
      expected: {}
    },
    {
      input: {
        parameters: {
          screenXY: [10, 'x'],
          radiusPixels: 1000,
          zoom: 0,
          borderWidthPixels: 'str'
        },
        config: POSTPROCESSING_EFFECTS.magnify.parameters
      },
      expected: {
        screenXY: [1, 0.5],
        radiusPixels: 500,
        zoom: 0.5,
        borderWidthPixels: 3
      }
    },
    {
      input: {
        parameters: {
          blurRadius: null,
          gradientRadius: [20, 10],
          start: [10],
          end: 'str'
        },
        config: POSTPROCESSING_EFFECTS.tiltShift.parameters
      },
      expected: {blurRadius: 0, gradientRadius: 0, start: [0, 0], end: [1, 1]}
    }
  ];

  testCases.forEach((testCase, index) => {
    const result = validateEffectParameters(testCase.input.parameters, testCase.input.config);
    t.deepEqual(result, testCase.expected, `parameters should be property validated ${index}`);
  });

  t.end();
});

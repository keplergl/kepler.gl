import {LightingEffect, PostProcessEffect} from '@deck.gl/core';
import test from 'tape';

import {computeDeckEffects} from '@kepler.gl/utils';
import {VisStateActions} from '@kepler.gl/actions';
import {visStateReducer} from '@kepler.gl/reducers';
import {createDeckEffectFromConfig} from '@kepler.gl/effects';

import {InitialState} from 'test/helpers/mock-state';

test('effectUtils -> computeDeckEffects', t => {
  const initialState = InitialState.visState;
  let nextState = visStateReducer(
    initialState,
    VisStateActions.addEffect({id: 'e_1', config: {type: 'sepia', isEnabled: false}})
  );
  nextState = visStateReducer(
    initialState,
    VisStateActions.addEffect({id: 'e_1', config: {type: 'ink'}})
  );
  nextState = visStateReducer(
    nextState,
    VisStateActions.addEffect({
      id: 'e_shadow',
      config: {type: 'lightAndShadow', params: {timestamp: 1689383452635}}
    })
  );

  let deckEffects = computeDeckEffects({
    visState: nextState,
    mapState: {latitude: 51.033105, longitude: 0.348512}
  });

  t.equal(deckEffects.length, 2, "disabled deck effects aren't not generated");
  t.ok(deckEffects[0] instanceof LightingEffect, 'lighting effect should be generated');
  t.ok(deckEffects[1] instanceof PostProcessEffect, 'post-processing effect should be generated');

  t.equal(deckEffects[0].shadowColor[3], 0, 'shadows should be disabled');

  nextState.effects[1].updateConfig({params: {timestamp: 1689415852635}});
  deckEffects = computeDeckEffects({
    visState: nextState,
    mapState: {latitude: 51.033105, longitude: 0.348512}
  });
  t.equal(deckEffects[0].shadowColor[3], 0.5, 'shadows should be enabled');

  t.end();
});

test('effectUtils -> createDeckEffectFromConfig', t => {
  const ppEffect = createDeckEffectFromConfig({});
  const lasEffect = createDeckEffectFromConfig({config: {type: 'lightAndShadow'}});

  t.equal(ppEffect.config.type, 'ink', 'should create default ink effect');
  t.equal(lasEffect.config.type, 'lightAndShadow', 'should create lightAndShadow effect');

  t.end();
});

// Copyright (c) 2023 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

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

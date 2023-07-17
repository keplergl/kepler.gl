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

import React from 'react';
import test from 'tape';

import {appInjector, EffectConfiguratorFactory} from '@kepler.gl/components';
import {VisStateActions} from '@kepler.gl/actions';
import {visStateReducer} from '@kepler.gl/reducers';

import {mountWithTheme, IntlWrapper} from 'test/helpers/component-utils';
import {StateWEffects, InitialState} from 'test/helpers/mock-state';

const EffectConfigurator = appInjector.get(EffectConfiguratorFactory);

test('Components -> EffectConfigurator -> render -> post processing effect', t => {
  const testCases = [
    {
      // configurator for magnify effect with [x, y] and plain number uniforms
      effect: StateWEffects.visState.effects[2],
      expectedSliders: 5
    },
    {
      // configurator for ink effect with uniforom.value
      effect: StateWEffects.visState.effects[1],
      expectedSliders: 1
    }
  ];

  testCases.forEach(({effect, expectedSliders}) => {
    let wrapper;
    t.doesNotThrow(() => {
      wrapper = mountWithTheme(
        <IntlWrapper>
          <EffectConfigurator
            {...{
              effect,
              updateEffectConfig: () => {}
            }}
          />
        </IntlWrapper>
      );
    }, `EffectConfigurator for ${effect.type} should not fail`);

    t.equal(
      wrapper.find('RangeSlider').length,
      expectedSliders,
      `should render ${expectedSliders} RangeSlider(s)`
    );
  });

  t.end();
});

test('Components -> EffectConfigurator -> render -> light & shadow effect', t => {
  let nextState = visStateReducer(
    InitialState.visState,
    VisStateActions.addEffect({
      config: {type: 'lightAndShadow'}
    })
  );

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <EffectConfigurator
          {...{
            effect: nextState.effects[0],
            updateEffectConfig: () => {}
          }}
        />
      </IntlWrapper>
    );
  }, `EffectConfigurator for ${nextState.effects[0].type} should not fail`);

  t.equal(wrapper.find('RangeSlider').length, 4, `should render 4 RangeSliders`);
  t.equal(wrapper.find('ColorSelector').length, 3, `should render 3 ColorSelectors`);
  t.equal(
    wrapper.find('EffectTimeConfigurator').length,
    1,
    `should render 1 EffectTimeConfigurator`
  );

  t.end();
});

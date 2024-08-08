// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
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

const mockStore = configureStore();
const ititialState = {mapState: {latitude: 0, longitude: 0}};

test('Components -> EffectConfigurator -> render -> light & shadow effect', t => {
  const store = mockStore(ititialState);

  const nextState = visStateReducer(
    InitialState.visState,
    VisStateActions.addEffect({
      type: 'lightAndShadow'
    })
  );

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <Provider store={store}>
          <EffectConfigurator
            {...{
              effect: nextState.effects[0],
              updateEffectConfig: () => {}
            }}
          />
        </Provider>
      </IntlWrapper>
    );
  }, `EffectConfigurator for ${nextState.effects[0].type} should not fail`);

  t.equal(wrapper.find('RangeSlider').length, 4, `should render 4 RangeSliders`);
  t.equal(wrapper.find('CompactColorPicker').length, 3, `should render 3 CompactColorPickers`);
  t.equal(
    wrapper.find('EffectTimeConfigurator').length,
    1,
    `should render 1 EffectTimeConfigurator`
  );

  t.end();
});

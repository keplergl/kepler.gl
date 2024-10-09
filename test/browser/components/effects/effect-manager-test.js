// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import test from 'tape';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';

import {
  EffectManagerFactory,
  EffectListFactory,
  SidePanelTitleFactory,
  EffectTypeSelectorFactory,
  appInjector
} from '@kepler.gl/components';

import {mountWithTheme, IntlWrapper} from 'test/helpers/component-utils';
import {StateWEffects} from 'test/helpers/mock-state';

const EffectManager = appInjector.get(EffectManagerFactory);
const EffectList = appInjector.get(EffectListFactory);
const SidePanelTitle = appInjector.get(SidePanelTitleFactory);
const EffectTypeSelector = appInjector.get(EffectTypeSelectorFactory);

const mockStore = configureStore();
const initialState = {
  demo: {
    keplerGl: {
      map: {
        visState: {
          effects: StateWEffects.visState.effects,
          effectOrder: StateWEffects.visState.effectOrder
        }
      }
    }
  },
  mapState: {latitude: 0, longitude: 0}
};

test('Components -> EffectManager -> render', t => {
  const store = mockStore(initialState);

  // mount
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <Provider store={store}>
          <EffectManager />
        </Provider>
      </IntlWrapper>
    );
  }, 'EffectManager should not fail');

  t.equal(wrapper.find(EffectList).length, 1, 'should render EffectList');
  t.equal(wrapper.find(SidePanelTitle).length, 1, 'should render SidePanelTitle');
  t.equal(wrapper.find(EffectTypeSelector).length, 1, 'should render EffectTypeSelector');
  t.equal(wrapper.find('EffectPanel').length, 4, 'should render 3 EffectPanels');

  t.end();
});

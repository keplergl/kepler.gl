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
  }
};

test('Components -> EffectManager -> render', t => {
  let store = mockStore(initialState);

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

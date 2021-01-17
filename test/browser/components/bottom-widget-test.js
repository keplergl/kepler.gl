// Copyright (c) 2021 Uber Technologies, Inc.
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
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';
import {BottomWidgetFactory, TimeWidgetFactory, AnimationControlFactory} from 'components';
import {appInjector} from 'components/container';
import * as VisStateActions from 'actions/vis-state-actions';

const BottomWidget = appInjector.get(BottomWidgetFactory);
const TimeWidget = appInjector.get(TimeWidgetFactory);
const AnimationControl = appInjector.get(AnimationControlFactory);

// mock state
import {InitialState} from 'test/helpers/mock-state';

// default props from initial state
const defaultProps = {
  datasets: InitialState.visState.datasets,
  filters: InitialState.visState.filters,
  layers: InitialState.visState.layers,
  animationConfig: InitialState.visState.animationConfig,
  uiState: InitialState.uiState,
  containerW: 900,
  sidePanelWidth: 300,
  visStateActions: VisStateActions
};

test('Components -> BottomWidget.mount -> initial state', t => {
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <BottomWidget {...defaultProps} />
      </IntlWrapper>
    );
  }, 'BottomWidget should not fail without props');

  t.equal(wrapper.find(TimeWidget).length, 0, 'should not render');
  t.equal(wrapper.find(AnimationControl).length, 0, 'should not render');

  t.end();
});

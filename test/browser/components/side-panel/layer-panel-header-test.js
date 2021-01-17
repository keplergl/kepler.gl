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

/* eslint-disable max-statements */

import React from 'react';
import test from 'tape';

import {LayerPanelHeaderFactory} from 'components';
import {DragHandle} from 'components/side-panel/layer-panel/layer-panel-header';
import {appInjector} from 'components/container';
import {mountWithTheme, IntlWrapper} from 'test/helpers/component-utils';

// components
const nop = () => {};
const defaultProps = {
  layerId: 'taro',
  isVisible: true,
  isConfigActive: false,
  onToggleVisibility: nop,
  onUpdateLayerLabel: nop,
  onToggleEnableConfig: nop,
  onRemoveLayer: nop
};

test('Components -> LayerPanelHeader.mount -> no prop', t => {
  const LayerPanelHeader = appInjector.get(LayerPanelHeaderFactory);

  // mount
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <LayerPanelHeader {...defaultProps} />
      </IntlWrapper>
    );
  }, 'LayerPanelHeader should not fail without props');

  t.ok(wrapper.find('.layer-panel__header').length, 'should render layer-panel__header');
  t.ok(wrapper.find(DragHandle).length, 'should render drag handle');
  t.ok(wrapper.find('.layer__title__editor').length, 'should render title eidtor');
  t.ok(wrapper.find('.layer__visibility-toggle').length, 'should render visibility toggle');
  t.ok(wrapper.find('.layer__enable-config').length, 'should render enable config toggle');

  t.end();
});

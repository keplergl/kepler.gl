// Copyright (c) 2022 Uber Technologies, Inc.
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

import {StateWMultiH3Layers} from 'test/helpers/mock-state';

import * as VisStateActions from 'actions/vis-state-actions';
import * as UIStateActions from 'actions/ui-state-actions';

import {appInjector} from 'components/container';
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';

import LayerListFactory from 'components/side-panel/layer-panel/layer-list';

const LayerList = appInjector.get(LayerListFactory);

const defaultProps = {
  datasets: StateWMultiH3Layers.visState.datasets,
  layerClasses: StateWMultiH3Layers.visState.layerClasses,
  layerOrder: StateWMultiH3Layers.visState.layerOrder,
  layers: StateWMultiH3Layers.visState.layers,
  uiStateActions: UIStateActions,
  visStateActions: VisStateActions
};

test('Components -> SidePanel -> LayerPanel -> LayerList -> render sortable list', t => {
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <LayerList {...defaultProps} isSortable />
      </IntlWrapper>
    );
  }, 'LayerList should render');

  t.equal(wrapper.find('.sortable-layer-items').length, 6, 'should render 6 sortable items');

  const titles = [];
  const expectedTitles = [
    'H3 Hexagon 1',
    'H3 Hexagon 1',
    'H3 Hexagon 1',
    'H3 Hexagon 2',
    'H3 Hexagon 2',
    'H3 Hexagon 2'
  ];
  wrapper.find('.layer__title__editor').forEach(item => titles.push(item.getDOMNode().value));
  t.deepEqual(titles, expectedTitles, 'should render panels in correct order');

  const layers = wrapper.find('.layer-panel');
  t.equal(layers.length, 6, 'should render 6 layer panels');

  t.end();
});

test('Components -> SidePanel -> LayerPanel -> LayerList -> render non-sortable list', t => {
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <LayerList {...defaultProps} isSortable={false} />
      </IntlWrapper>
    );
  }, 'LayerList should render');

  t.equal(wrapper.find('.sortable-layer-items').length, 0, 'should not render sortable items');

  const titles = [];
  const expectedTitles = [
    'H3 Hexagon 1',
    'H3 Hexagon 1',
    'H3 Hexagon 1',
    'H3 Hexagon 2',
    'H3 Hexagon 2',
    'H3 Hexagon 2'
  ];
  wrapper.find('.layer__title__editor').forEach(item => titles.push(item.getDOMNode().value));
  t.deepEqual(titles, expectedTitles, 'should render panels in correct order');

  const layers = wrapper.find('.layer-panel');
  t.equal(layers.length, 6, 'should render 6 layer panels');

  t.end();
});

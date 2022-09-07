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

import {
  LayerManagerFactory,
  LayerListFactory,
  DatasetLayerGroupFactory,
  DatasetSectionFactory,
  PanelViewListToggleFactory,
  PanelTitleFactory,
  AddLayerButtonFactory
} from 'components';

import {appInjector} from 'components';
import {mountWithTheme, IntlWrapper} from 'test/helpers/component-utils';

import {VisStateActions, UIStateActions} from '@kepler.gl/actions';

import {StateWMultiH3Layers} from 'test/helpers/mock-state';

import {Layers} from 'components';

const LayerManager = appInjector.get(LayerManagerFactory);
const LayerList = appInjector.get(LayerListFactory);
const DatasetLayerGroup = appInjector.get(DatasetLayerGroupFactory);
const DatasetSection = appInjector.get(DatasetSectionFactory);
const PanelViewListToggle = appInjector.get(PanelViewListToggleFactory);
const PanelTitle = appInjector.get(PanelTitleFactory);
const AddLayerButton = appInjector.get(AddLayerButtonFactory);

const nop = () => {};

const defaultProps = {
  datasets: StateWMultiH3Layers.visState.datasets,
  layers: StateWMultiH3Layers.visState.layers,
  layerOrder: StateWMultiH3Layers.visState.layerOrder,
  layerClasses: StateWMultiH3Layers.visState.layerClasses,
  intl: {},
  showAddDataModal: nop,
  updateTableColor: nop,
  showDatasetTable: nop,
  removeDataset: nop,
  panelMetadata: {
    id: 'layer',
    label: 'sidebar.panels.layer',
    iconComponent: Layers,
    onClick: nop,
    component: LayerManager
  },
  layerPanelListView: 'list',
  uiStateActions: UIStateActions,
  visStateActions: VisStateActions,
  layerBlending: 'normal'
};

test('Components -> LayerManager -> render -> list view', t => {
  // mount
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <LayerManager {...defaultProps} />
      </IntlWrapper>
    );
  }, 'LayerManager should not fail');

  t.ok(wrapper.find(DatasetLayerGroup).length === 0, 'should not render DatasetLayerGroup');
  t.ok(wrapper.find(LayerList).length === 1, 'should render LayerList');
  t.ok(wrapper.find(AddLayerButton).length === 1, 'should render AddLayerButton');
  t.ok(wrapper.find(DatasetSection).length === 1, 'should render DatasetSection');
  t.ok(wrapper.find(PanelViewListToggle).length === 1, 'should render PanelViewListToggle');
  t.ok(wrapper.find(PanelTitle).length === 1, 'should render PanelTitle');

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

test('Components -> LayerManager -> render -> order by dataset view', t => {
  // mount
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <LayerManager {...defaultProps} layerPanelListView="sortByDataset" />
      </IntlWrapper>
    );
  }, 'LayerManager should not fail');

  t.ok(wrapper.find(DatasetLayerGroup).length === 1, 'should render DatasetLayerGroup');
  t.ok(wrapper.find(LayerList).length === 1, 'should render LayerList');
  t.ok(wrapper.find(AddLayerButton).length === 1, 'should render AddLayerButton');
  t.ok(wrapper.find(DatasetSection).length === 1, 'should render DatasetSection');
  t.ok(wrapper.find(PanelViewListToggle).length === 1, 'should render PanelViewListToggle');
  t.ok(wrapper.find(PanelTitle).length === 1, 'should render PanelTitle');

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

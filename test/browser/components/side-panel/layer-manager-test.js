// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import test from 'tape';

import {
  LayerManagerFactory,
  LayerListFactory,
  DatasetLayerGroupFactory,
  DatasetSectionFactory,
  PanelViewListToggleFactory,
  PanelTitleFactory,
  AddLayerButtonFactory,
  appInjector,
  Layers
} from '@kepler.gl/components';

import {mountWithTheme, IntlWrapper} from 'test/helpers/component-utils';

import {VisStateActions, UIStateActions, MapStateActions} from '@kepler.gl/actions';

import {StateWMultiH3Layers} from 'test/helpers/mock-state';

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
  mapStateActions: MapStateActions,
  layerBlending: 'normal',
  overlayBlending: 'normal'
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
        <LayerManager {...defaultProps} panelListView="byDataset" />
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

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

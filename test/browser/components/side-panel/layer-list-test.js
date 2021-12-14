import React from 'react';
import test from 'tape';

import {StateWH3Layer} from 'test/helpers/mock-state';

import * as VisStateActions from 'actions/vis-state-actions';
import * as UIStateActions from 'actions/ui-state-actions';

import {appInjector} from 'components/container';
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';

import LayerListFactory from 'components/side-panel/layer-panel/layer-list';

const LayerList = appInjector.get(LayerListFactory);

const defaultProps = {
  datasets: StateWH3Layer.visState.datasets,
  layerClasses: StateWH3Layer.visState.layerClasses,
  layerOrder: StateWH3Layer.visState.layerOrder,
  layers: StateWH3Layer.visState.layers,
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

  t.equal(wrapper.find('.sortable-layer-items').length, 3, 'should render 3 sortable items');

  const layers = wrapper.find('.layer-panel');
  t.equal(layers.length, 3, 'should render 3 layer panels');

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

  const layers = wrapper.find('.layer-panel');
  t.equal(layers.length, 3, 'should render 3 layer panels');

  t.end();
});

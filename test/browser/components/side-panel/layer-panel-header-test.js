// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/* eslint-disable max-statements */

import React from 'react';
import test from 'tape';

import {LayerPanelHeaderFactory, DragHandle, appInjector} from '@kepler.gl/components';
import {mountWithTheme, IntlWrapper} from 'test/helpers/component-utils';

// components
const nop = () => {};
const defaultProps = {
  layerId: 'taro',
  isVisible: true,
  isValid: true,
  isConfigActive: false,
  onToggleVisibility: nop,
  onUpdateLayerLabel: nop,
  onToggleEnableConfig: nop,
  onRemoveLayer: nop,
  onZoomToLayer: nop
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

  // mount
  const layerAfterErrorProps = {...defaultProps, ...{isValid: false}};
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <LayerPanelHeader {...layerAfterErrorProps} />
      </IntlWrapper>
    );
  }, 'LayerPanelHeader should not fail without props');

  t.ok(!wrapper.find('.layer__visibility-toggle').length, "shouldn't render visibility toggle");
  t.ok(wrapper.find('.layer__is-valid-refresh').length, 'should render validity refresh icon');

  t.end();
});

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';

import test from 'tape';
import {appInjector, PlotContainerFactory, plotContainerSelector} from '@kepler.gl/components';
import {mockKeplerProps} from '../../helpers/mock-state';

const PlotContainer = appInjector.get(PlotContainerFactory);
const initialProps = plotContainerSelector(mockKeplerProps);

test('PlotContainer -> mount', t => {
  t.doesNotThrow(() => {
    mountWithTheme(
      <IntlWrapper>
        <PlotContainer {...initialProps} />
      </IntlWrapper>
    );
  }, 'PlotContainer should not fail without props');

  t.end();
});

test('PlotContainer -> mount -> imageSize', t => {
  let wrapper;
  const exportImageSetting = {
    ...initialProps.exportImageSetting,
    imageSize: {
      ...initialProps.exportImageSetting.imageSize,
      imageW: 800,
      imageH: 600
    }
  };

  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <PlotContainer {...initialProps} exportImageSetting={exportImageSetting} />
      </IntlWrapper>
    );
  }, 'PlotContainer should not fail without props');

  let map = wrapper.find('MapContainer').instance();

  t.equal(map.props.mapState.width, 800, 'should send imageW to mapState');
  t.equal(map.props.mapState.height, 600, 'should send imageH to mapState');

  // set center to be true
  exportImageSetting.center = true;

  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <PlotContainer {...initialProps} exportImageSetting={exportImageSetting} />
      </IntlWrapper>
    );
  }, 'PlotContainer should not fail without props');

  map = wrapper.find('MapContainer').instance();

  t.equal(map.props.mapState.latitude, 33.89064297228446, 'should set latitude when center: true');
  t.equal(
    map.props.mapState.longitude,
    -45.57105275929253,
    'should set longitude when center: true'
  );
  t.equal(map.props.mapState.zoom, 1, 'should set zoom when center: true');
  t.end();
});

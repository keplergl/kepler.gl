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
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';

import test from 'tape';
import {appInjector, PlotContainerFactory, MapContainerFactory} from 'components';
import {plotContainerSelector} from 'components/kepler-gl';
import {mockKeplerProps} from '../../helpers/mock-state';

const PlotContainer = appInjector.get(PlotContainerFactory);
const MapContainer = appInjector.get(MapContainerFactory);
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

  let map = wrapper.find(MapContainer).instance();

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

  map = wrapper.find(MapContainer).instance();

  t.equal(map.props.mapState.latitude, 33.89064297228446, 'should set latitude when center: true');
  t.equal(
    map.props.mapState.longitude,
    -45.57105275929253,
    'should set longitude when center: true'
  );
  t.equal(map.props.mapState.zoom, 2, 'should set zoom when center: true');
  t.end();
});

// Copyright (c) 2023 Uber Technologies, Inc.
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
import sinon from 'sinon';
import test from 'tape';

import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';
import {Icons, MapPopoverFactory, appInjector} from '@kepler.gl/components';
import {
  expectedLayerHoverProp as layerHoverProp,
  expectedGeojsonLayerHoverProp as geojsonLayerHoverProp
} from 'test/helpers/mock-state';

const {Pin} = Icons;
const MapPopover = appInjector.get(MapPopoverFactory);

const defaultProps = {
  x: 400,
  y: 300,
  zoom: 13,
  onClose: null,
  coordinate: null,
  layerHoverProp: {},
  isBase: false,
  frozen: false
};

test('Map Popover - render', t => {
  const onClose = sinon.spy();
  defaultProps.onClose = onClose;

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <MapPopover {...defaultProps} />
      </IntlWrapper>
    );
  }, 'Should render');

  t.equal(wrapper.find(MapPopover).length, 1, 'Should display 1 MapPopover');
  t.equal(wrapper.find('.coordingate-hover-info').length, 0, 'Should display 0 coordinates');
  t.equal(wrapper.find('.map-popover__layer-info').length, 0, 'Should display 0 layer info');
  t.equal(wrapper.find(Pin).length, 0, 'Should display 0 pin');
  t.equal(wrapper.find('.primary-label').length, 0, 'Should display 0 primary label');
  t.equal(
    wrapper.find('.select-geometry').length,
    0,
    'Should not display select geometry for point layer'
  );

  wrapper.setProps({
    children: <MapPopover {...defaultProps} isBase={true} frozen={true} />
  });
  t.equal(wrapper.find(Pin).length, 1, 'Should display 1 pin');
  t.equal(wrapper.find('.primary-label').length, 1, 'Should display 1 primary label');
  t.equal(
    wrapper.find('.select-geometry').length,
    0,
    'Should not display select geometry for point layer'
  );

  // click pin
  wrapper
    .find('.popover-pin')
    .at(0)
    .simulate('click');
  t.ok(onClose.called, 'should call onClose when click pin');
  // render coordinate
  wrapper.setProps({
    children: (
      <MapPopover {...defaultProps} coordinate={[127.12345678, -31.12345678]} zoom={12.123} />
    )
  });
  t.equal(wrapper.find('CoordinateInfo').length, 1, 'Should render CoordinateInfo');
  t.equal(
    wrapper
      .find('.row__value')
      .at(0)
      .text(),
    '-31.123457,',
    'should render lat'
  );
  t.equal(
    wrapper
      .find('.row__value')
      .at(1)
      .text(),
    '127.123457,',
    'should render longitude'
  );
  t.equal(
    wrapper
      .find('.row__value')
      .at(2)
      .text(),
    '12.1z',
    'should render zoom'
  );

  t.end();
});

test('Map Popover - render with layerHoverProp', t => {
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <MapPopover {...defaultProps} layerHoverProp={layerHoverProp} />
      </IntlWrapper>
    );
  }, 'Should render map popover with layerHoverProps');
  t.equal(wrapper.find('LayerHoverInfo').length, 1, 'Should render LayerHoverInfo');
  t.equal(wrapper.find('table').length, 1, 'Should render 1 table');
  const table = wrapper.find('table').at(0);
  const rows = table.find('.layer-hover-info__row');
  t.equal(rows.length, 5, 'should render 5 rows');
  const expectedTooltips = [
    ['gps_data.utc_timestamp', '2016-09-17 00:24:24'],
    ['gps_data.types', 'driver_analytics'],
    ['epoch', '1472754400000'],
    ['has_result', ''],
    ['uid', '1']
  ];
  for (let i = 0; i < 5; i++) {
    t.equal(
      rows
        .at(i)
        .find('.row__name')
        .text(),
      expectedTooltips[i][0],
      'row name should be correct'
    );
    t.equal(
      rows
        .at(i)
        .find('.row__value')
        .text(),
      expectedTooltips[i][1],
      'row value should be correct'
    );
  }

  t.end();
});

test('Map Popover - render with geojsonLayerHoverProp', t => {
  const setSelectedFeature = sinon.spy();
  const onSetFeatures = sinon.spy();
  const onClose = sinon.spy();
  defaultProps.setSelectedFeature = setSelectedFeature;
  defaultProps.onSetFeatures = onSetFeatures;
  defaultProps.onClose = onClose;

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <MapPopover
          {...defaultProps}
          isBase={true}
          frozen={true}
          layerHoverProp={geojsonLayerHoverProp}
        />
      </IntlWrapper>
    );
  }, 'Should render map popover with geojsonLayerHoverProp');

  t.equal(wrapper.find(MapPopover).length, 1, 'Should display 1 MapPopover');
  t.equal(wrapper.find(Pin).length, 1, 'Should display 1 pin');
  t.equal(wrapper.find('.primary-label').length, 1, 'Should display 1 primary label');

  // click select geometry
  wrapper
    .find('.select-geometry')
    .at(0)
    .simulate('click');

  t.ok(setSelectedFeature.called, 'should call setSelectedFeature when click select geometry');
  t.ok(onSetFeatures.called, 'should call onSetFeatures when click select geometry');

  t.end();
});

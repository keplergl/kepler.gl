// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/* eslint-disable enzyme-deprecation/no-mount */
import React from 'react';
import test from 'tape';
import {mount} from 'enzyme';
import cloneDeep from 'lodash/cloneDeep';
import sinon from 'sinon';

import {
  MapLegendFactory,
  StyledMapControlLegend,
  VisualChannelMetric,
  LayerDefaultLegend,
  SingleColorLegendFactory,
  LayerColorLegendFactory,
  LegendRowFactory,
  ResetColorLabelFactory,
  appInjector
} from '@kepler.gl/components';
import {
  StateWFilesFiltersLayerColor,
  expectedSavedLayer1 as pointLayer,
  expectedSavedLayer0 as hexagonLayer,
  expectedSavedLayer2 as geojsonLayer
} from 'test/helpers/mock-state';
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';
import {KeplerGlLayers} from '@kepler.gl/layers';
const {PointLayer} = KeplerGlLayers;

const MapLegend = appInjector.get(MapLegendFactory);
const LayerColorLegend = appInjector.get(LayerColorLegendFactory);
const SingleColorLegend = appInjector.get(SingleColorLegendFactory);
const LegendRow = appInjector.get(LegendRowFactory);
const ResetColorLabel = appInjector.get(ResetColorLabelFactory);

test('Components -> MapLegend.render', t => {
  t.doesNotThrow(() => {
    mount(<MapLegend />);
  }, 'Show not fail without data');

  t.end();
});

test('Components -> MapLegend.render -> with layers', t => {
  const initialState = cloneDeep(StateWFilesFiltersLayerColor);
  const onLayerVisConfigChange = sinon.spy();
  const {layers} = initialState.visState;
  let wrapper;

  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <MapLegend layers={layers} onLayerVisConfigChange={onLayerVisConfigChange} />
      </IntlWrapper>
    );
  }, 'Show not fail with layers');

  t.equal(
    wrapper.find(StyledMapControlLegend).length,
    layers.length,
    'should render 3 layer legends'
  );

  const geojsonLegend = wrapper.find(StyledMapControlLegend).at(1);
  const hexagonLegend = wrapper.find(StyledMapControlLegend).at(2);
  const pointLegend = wrapper.find(StyledMapControlLegend).at(0);

  testGeojsonLegend(t, geojsonLegend);
  testHexagonLayerLegend(t, hexagonLegend);
  testPointLayerLegend(t, pointLegend, onLayerVisConfigChange);

  t.end();
});

function testGeojsonLegend(t, geojsonLegend) {
  t.equal(
    geojsonLegend.find('.legend--layer_name').at(0).text(),
    geojsonLayer.config.label,
    'geojson layer legend should render label'
  );
  t.equal(
    geojsonLegend.find(LayerColorLegend).length,
    2,
    'geojson layer legend should render 2 color legend'
  );
  t.equal(
    geojsonLegend.find(LayerDefaultLegend).length,
    0,
    'geojson layer legend should render 1 size legend'
  );
  const fillColorLegend = geojsonLegend.find(LayerColorLegend).at(0);
  const strokeColorLegend = geojsonLegend.find(LayerColorLegend).at(1);

  t.equal(
    fillColorLegend.find(SingleColorLegend).length,
    1,
    'geojson fill color should render SingleColorLegend'
  );
  t.deepEqual(
    fillColorLegend.find(SingleColorLegend).at(0).props().color,
    geojsonLayer.config.color,
    'geojson color legend should be correct color'
  );

  t.equal(
    strokeColorLegend.find(SingleColorLegend).length,
    1,
    'geojson stroke color should render SingleColorLegend'
  );
  t.deepEqual(
    strokeColorLegend.find(SingleColorLegend).at(0).props().color,
    geojsonLayer.config.visConfig.strokeColor,
    'geojson color legend should be correct color'
  );
}

function testPointLayerLegend(t, pointLegend, onLayerVisConfigChange) {
  // layer[0] point layer
  // color by: gps_data.types
  // point layer has 2 color channels, only fill is enabled
  t.equal(
    pointLegend.find('.legend--layer_name').at(0).text(),
    pointLayer.config.label,
    'point layer legend should render point label'
  );

  t.equal(
    pointLegend.find(LayerColorLegend).length,
    1,
    'point layer legend should render 1 point layer color legend'
  );
  t.equal(
    pointLegend.find(LayerDefaultLegend).length,
    0,
    'point layer legend should render 0 point layer size legend'
  );
  const pointColorLegend = pointLegend.find(LayerColorLegend).at(0);

  t.equal(
    pointColorLegend.find(VisualChannelMetric).length,
    1,
    'point layer legend should render metric name'
  );
  t.equal(
    pointColorLegend
      .find(VisualChannelMetric)
      .at(0)
      .find('.legend--layer_color_field')
      .at(0)
      .text(),
    pointLayer.visualChannels.colorField.name,
    'point layer legend should render color by measure: gps_data.types'
  );

  // colors: ['#00939C', '#6BB5B9', '#AAD7D9', '#E6FAFA']
  // colorDomain ["driver_analytics", "driver_analytics_0", "driver_gps"]
  t.equal(pointLegend.find(LegendRow).length, 3, 'Should render 3 legends');
  const expectedLegend = [
    ['#00939C', 'driver_analytics'],
    ['#6BB5B9', 'driver_analytics_0'],
    ['#AAD7D9', 'driver_gps']
  ];
  for (let i = 0; i < 3; i++) {
    const rect = pointLegend.find(LegendRow).at(i).find('.legend-row-color').at(0);
    t.equal(
      rect.props().style.backgroundColor,
      expectedLegend[i][0],
      'should render correct legend color'
    );
    const input = pointLegend.find(LegendRow).at(i).find('input').at(0);
    t.equal(input.props().value, expectedLegend[i][1], 'should render correct legend label');
  }

  // test change input
  const firstLegendInput = pointLegend.find(LegendRow).at(0).find('input');
  const event = {target: {name: 'input-legend-label', value: 'taro'}};
  firstLegendInput.simulate('change', event);

  t.ok(onLayerVisConfigChange.calledOnce, 'should call onLayerVisConfigChange');

  t.ok(onLayerVisConfigChange.args[0][0] instanceof PointLayer, 'first arg should be Layer');
  t.deepEqual(
    Object.keys(onLayerVisConfigChange.args[0][1]),
    ['colorRange'],
    'second arg should be colorRange'
  );
  t.deepEqual(
    onLayerVisConfigChange.args[0][1].colorRange.colorLegends,
    {'#00939C': 'taro'},
    'second arg should contain colorLegends'
  );
}

function testHexagonLayerLegend(t, hexagonLegend) {
  t.equal(
    hexagonLegend.find('.legend--layer_name').at(0).text(),
    hexagonLayer.config.label,
    'hexagon layer legend should render label'
  );
  t.equal(
    hexagonLegend.find(LayerColorLegend).length,
    1,
    'hexagon layer legend should render 1 color legend'
  );
  t.equal(
    hexagonLegend.find(LayerDefaultLegend).length,
    0,
    'hexagon layer legend should render 0 size legend'
  );
  const hexagonColorLegend = hexagonLegend.find(LayerColorLegend).at(0);

  t.equal(
    hexagonColorLegend.find(VisualChannelMetric).length,
    1,
    'hexagon layer legend should render metric name'
  );
  t.equal(
    hexagonColorLegend
      .find(VisualChannelMetric)
      .at(0)
      .find('.legend--layer_color_field')
      .at(0)
      .text(),
    'Point Count',
    'hexagon layer legend should render color by Point Count'
  );
}

test('Components -> MapLegend.render -> with colorLegends', t => {
  const initialState = cloneDeep(StateWFilesFiltersLayerColor);
  const onLayerVisConfigChange = sinon.spy();
  const {layers} = initialState.visState;
  const ptLayer = layers[0];

  ptLayer.config.visConfig.colorRange = {
    ...ptLayer.config.visConfig.colorRange,
    colorLegends: {
      '#00939C': 'taro'
    }
  };
  let wrapper;

  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <MapLegend layers={[ptLayer]} onLayerVisConfigChange={onLayerVisConfigChange} />
      </IntlWrapper>
    );
  }, 'Show not fail with layers');

  t.equal(wrapper.find(StyledMapControlLegend).length, 1, 'should render 1 layer legends');

  const pointLegend = wrapper.find(StyledMapControlLegend).at(0);
  const firstLegend = pointLegend.find(LegendRow).at(0);
  const input = firstLegend.find('input').at(0);

  t.equal(input.props().value, 'taro', 'should render custom legend label');
  t.equal(firstLegend.find(ResetColorLabel).length, 1, 'should render reset');

  // click reset
  firstLegend.find(ResetColorLabel).at(0).simulate('click');
  t.ok(onLayerVisConfigChange.calledOnce, 'should call onLayerVisConfigChange');

  t.ok(onLayerVisConfigChange.args[0][0] instanceof PointLayer, 'first arg should be Layer');
  t.deepEqual(
    Object.keys(onLayerVisConfigChange.args[0][1]),
    ['colorRange'],
    'second arg should be colorRange'
  );
  t.deepEqual(
    onLayerVisConfigChange.args[0][1].colorRange.colorLegends,
    {},
    'second arg should be empty'
  );

  t.end();
});

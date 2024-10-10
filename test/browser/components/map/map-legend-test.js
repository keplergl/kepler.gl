// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/* eslint-disable enzyme-deprecation/no-mount */
import React from 'react';
import test from 'tape';
import {mount} from 'enzyme';
import cloneDeep from 'lodash.clonedeep';

import {
  MapLegendFactory,
  StyledMapControlLegend,
  VisualChannelMetric,
  LayerDefaultLegend,
  SingleColorLegendFactory,
  LayerColorLegendFactory,
  appInjector
} from '@kepler.gl/components';
import {
  StateWFilesFiltersLayerColor,
  expectedSavedLayer1 as pointLayer,
  expectedSavedLayer0 as hexagonLayer,
  expectedSavedLayer2 as geojsonLayer
} from 'test/helpers/mock-state';
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';

const MapLegend = appInjector.get(MapLegendFactory);
const LayerColorLegend = appInjector.get(LayerColorLegendFactory);
const SingleColorLegend = appInjector.get(SingleColorLegendFactory);

test('Components -> MapLegend.render', t => {
  t.doesNotThrow(() => {
    mount(<MapLegend />);
  }, 'Show not fail without data');

  t.end();
});

test('Components -> MapLegend.render -> with layers', t => {
  const initialState = cloneDeep(StateWFilesFiltersLayerColor);
  const {layers} = initialState.visState;
  let wrapper;

  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <MapLegend layers={layers} />
      </IntlWrapper>
    );
  }, 'Show not fail with layers');

  t.equal(
    wrapper.find(StyledMapControlLegend).length,
    layers.length,
    'should render 3 layer legends'
  );

  const pointLegend = wrapper.find(StyledMapControlLegend).at(0);
  const geojsonLegend = wrapper.find(StyledMapControlLegend).at(1);
  const hexagonLegend = wrapper.find(StyledMapControlLegend).at(2);

  testPointLayerLegend(t, pointLegend);
  testGeojsonLegend(t, geojsonLegend);
  testHexagonLayerLegend(t, hexagonLegend);

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

function testPointLayerLegend(t, pointLegend) {
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

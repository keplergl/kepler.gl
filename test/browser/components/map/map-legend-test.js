// Copyright (c) 2020 Uber Technologies, Inc.
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
import {mount} from 'enzyme';
import cloneDeep from 'lodash.clonedeep';

import MapLegend, {
  StyledMapControlLegend,
  LayerColorLegend,
  VisualChannelMetric,
  LayerSizeLegend,
  SingleColorLegend
} from 'components/map/map-legend';
import {
  StateWFilesFiltersLayerColor,
  expectedSavedLayer1 as pointLayer,
  expectedSavedLayer0 as hexagonLayer,
  expectedSavedLayer2 as geojsonLayer
} from 'test/helpers/mock-state';
import {mountWithTheme} from 'test/helpers/component-utils';

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
    wrapper = mountWithTheme(<MapLegend layers={layers} />);
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
    geojsonLegend.find(LayerSizeLegend).length,
    0,
    'geojson layer legend should render 1 size legend'
  );
  const fillColorLegend = geojsonLegend.find(LayerColorLegend).at(0);
  const strokeColorLegend = geojsonLegend.find(LayerColorLegend).at(1);
  t.equal(
    fillColorLegend
      .find('.legend--layer_type')
      .at(0)
      .text(),
    'Color',
    'geojson color legend should have Fill Color'
  );
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
    strokeColorLegend
      .find('.legend--layer_type')
      .at(0)
      .text(),
    'Stroke Color',
    'geojson color legend should have Stroke Color'
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
    pointLegend.find(LayerSizeLegend).length,
    0,
    'point layer legend should render 0 point layer size legend'
  );
  const pointColorLegend = pointLegend.find(LayerColorLegend).at(0);
  t.equal(
    pointColorLegend
      .find('.legend--layer_type')
      .at(0)
      .text(),
    'Color',
    'point layer legend should have title Color'
  );
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
    hexagonLegend.find(LayerSizeLegend).length,
    0,
    'hexagon layer legend should render 0 size legend'
  );
  const hexagonColorLegend = hexagonLegend.find(LayerColorLegend).at(0);
  t.equal(
    hexagonColorLegend
      .find('.legend--layer_type')
      .at(0)
      .text(),
    'Color',
    'hexagon layer legend should have title Color'
  );
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

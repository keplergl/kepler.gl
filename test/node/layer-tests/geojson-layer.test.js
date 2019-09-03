// Copyright (c) 2019 Uber Technologies, Inc.
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

import GeojsonLayer from 'layers/geojson-layer/geojson-layer';
import {processCsvData} from 'processors/data-processor';

import {wktCsv, updatedLayerSimplifiedShape, updatedLayerV2}
from 'test/fixtures/test-csv-data';
import {testCreateCases, testFormatLayerDataCases} from 'test/helpers/layer-utils';

it('#GeojsonLayer -> constructor', () => {
  const TEST_CASES = {
    CREATE: [{
      props: {
        dataId: 'smoothie',
        isVisible: true,
        label: 'test geojson layer'
      },
      test: layer => {
        expect(layer.config.dataId).toBe('smoothie');
        expect(layer.type).toBe('geojson');
        expect(layer.isAggregated).toBe(false);
      }
    }]
  };

  testCreateCases(GeojsonLayer, TEST_CASES.CREATE);
});

it('#GeojsonLayer -> formatLayerData', () => {
  const {rows} = processCsvData(wktCsv);

  const filteredIndex = [0, 2, 4];
  const data = [rows[0], rows[2], rows[4]];

  const TEST_CASES = [{
    props: {
      dataId: '0dj3h',
      label: 'some geometry file',
      columns: {
        geojson: {
          value: 'simplified_shape_v2',
          fieldIdx: 1
        }
      }
    },
    data: [data, rows, filteredIndex, undefined],
    test: result => {
      const {layerData, layer} = result;
      const expectedLayerData = {
        data: [
          updatedLayerV2.dataToFeature[0],
          updatedLayerV2.dataToFeature[2],
          updatedLayerV2.dataToFeature[4]
        ],
        getFeature: () => {},
        getFillColor: () => {},
        getLineColor: () => {},
        getLineWidth: () => {},
        getElevation: () => {},
        getRadius: () => {}
      };
      const expectedLayerMeta = updatedLayerV2.meta;
      const expectedDataToFeature = updatedLayerV2.dataToFeature;

      expect(layerData.data).toEqual(expectedLayerData.data);
      expect(typeof layerData.getFeature).toBe('function');
      expect(typeof layerData.getFillColor).toBe('function');
      expect(typeof layerData.getLineColor).toBe('function');
      expect(typeof layerData.getLineWidth).toBe('function');
      expect(typeof layerData.getElevation).toBe('function');
      expect(typeof layerData.getRadius).toBe('function');

      expect(layer.meta).toEqual(expectedLayerMeta);
      expect(layer.dataToFeature).toEqual(expectedDataToFeature);
    }
  }, {
    props: {
      dataId: '0dj3h',
      label: 'some geometry file',
      columns: {
        geojson: {
          value: 'simplified_shape',
          fieldIdx: 2
        }
      }
    },
    data: [data, rows, filteredIndex, undefined],
    test: result => {
      const {layerData, layer} = result;

      const expectedLayerData = {
        data: [
          updatedLayerSimplifiedShape.dataToFeature[0],
          updatedLayerSimplifiedShape.dataToFeature[2],
          updatedLayerSimplifiedShape.dataToFeature[4]
        ],
        getFeature: () => {},
        getFillColor: () => {},
        getLineColor: () => {},
        getLineWidth: () => {},
        getElevation: () => {},
        getRadius: () => {}
      };
      const expectedLayerMeta = updatedLayerSimplifiedShape.meta;
      const expectedDataToFeature = updatedLayerSimplifiedShape.dataToFeature;

      expect(layerData.data).toEqual(expectedLayerData.data);
      expect(typeof layerData.getFeature).toBe('function');
      expect(typeof layerData.getFillColor).toBe('function');
      expect(typeof layerData.getLineColor).toBe('function');
      expect(typeof layerData.getLineWidth).toBe('function');
      expect(typeof layerData.getElevation).toBe('function');
      expect(typeof layerData.getRadius).toBe('function');

      expect(layer.meta).toEqual(expectedLayerMeta);
      expect(layer.dataToFeature).toEqual(expectedDataToFeature);
    }
  }];

  testFormatLayerDataCases(GeojsonLayer, TEST_CASES);
});

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

import test from 'tape';
import GeojsonLayer from 'layers/geojson-layer/geojson-layer';
import {processCsvData} from 'processors/data-processor';

import {wktCsv, updatedLayerV2} from 'test/fixtures/test-csv-data';
import {
  testCreateCases,
  testFormatLayerDataCases
} from 'test/helpers/layer-utils';

test('#GeojsonLayer -> constructor', t => {
  const TEST_CASES = {
    CREATE: [
      {
        props: {
          dataId: 'smoothie',
          isVisible: true,
          label: 'test geojson layer'
        },
        test: layer => {
          t.ok(
            layer.config.dataId === 'smoothie',
            'geojsonLayer dataId should be correct'
          );
          t.ok(layer.type === 'geojson', 'type should be geojson');
          t.ok(layer.isAggregated === false, 'geojsonLayer is not aggregated');
        }
      }
    ]
  };

  testCreateCases(t, GeojsonLayer, TEST_CASES.CREATE);
  t.end();
});

test('#GeojsonLayer -> formatLayerData', t => {
  const {rows} = processCsvData(wktCsv);

  const filteredIndex = [0, 1, 2, 4];
  const data = [rows[0], rows[1], rows[2], rows[4]];

  const TEST_CASES = [
    {
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
            updatedLayerV2.dataToFeature[1],
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

        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should format correct geojson layerData'
        );
        t.ok(
          typeof layerData.getFeature === 'function',
          'should have getFeature'
        );
        t.ok(
          typeof layerData.getFillColor === 'function',
          'should have getFillColor'
        );
        t.ok(
          typeof layerData.getLineColor === 'function',
          'should have getLineColor'
        );
        t.ok(
          typeof layerData.getLineWidth === 'function',
          'should have getSize'
        );
        t.ok(
          typeof layerData.getElevation === 'function',
          'should have getRadius'
        );
        t.ok(
          typeof layerData.getRadius === 'function',
          'should have getRadius'
        );

        t.deepEqual(
          layer.meta,
          expectedLayerMeta,
          'should format correct geojson layer meta'
        );
        t.deepEqual(
          layer.dataToFeature,
          expectedDataToFeature,
          'should format correct geojson dataToFeature'
        );
      }
    },
    {
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
            updatedLayerV2.dataToFeature[1],
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

        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should format correct geojson layerData'
        );
        t.ok(
          typeof layerData.getFeature === 'function',
          'should have getFeature'
        );
        t.ok(
          typeof layerData.getFillColor === 'function',
          'should have getFillColor'
        );
        t.ok(
          typeof layerData.getLineColor === 'function',
          'should have getLineColor'
        );
        t.ok(
          typeof layerData.getLineWidth === 'function',
          'should have getSize'
        );
        t.ok(
          typeof layerData.getElevation === 'function',
          'should have getRadius'
        );
        t.ok(
          typeof layerData.getRadius === 'function',
          'should have getRadius'
        );

        t.deepEqual(
          layer.meta,
          expectedLayerMeta,
          'should format correct geojson layer meta'
        );
        t.deepEqual(
          layer.dataToFeature,
          expectedDataToFeature,
          'should format correct geojson dataToFeature'
        );
      }
    }
  ];

  testFormatLayerDataCases(t, GeojsonLayer, TEST_CASES);
  t.end();
});

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

import test from 'tape';
import {
  testCreateCases,
  testFormatLayerDataCases,
  testRenderLayerCases
} from 'test/helpers/layer-utils';
import {getGpuFilterProps} from 'utils/gpu-filter-utils';
import {data} from 'test/fixtures/s2-geometry';
import S2GeometryLayer from 'layers/s2-geometry-layer/s2-geometry-layer';
import {processCsvData} from 'processors/data-processor';
import {DEFAULT_ELEVATION} from 'constants/default-settings';

test('#S2Geometry -> constructor', t => {
  const TEST_CASES = [
    {
      props: {
        dataId: 'smoothie',
        isVisible: true,
        label: 'text s2geometry layer'
      },
      test: layer => {
        t.ok(layer.config.dataId === 'smoothie', 'S2GeometryLayer dataId should be correct');
        t.ok(layer.type === 's2', 'type should be s2');
        t.deepEqual(
          Object.keys(layer.visConfigSettings),
          [
            'opacity',
            'colorRange',
            'filled',
            'enable3d',
            'sizeRange',
            'elevationScale',
            'wireframe'
          ],
          'should provide the correct visConfigSettings properties'
        );
      }
    }
  ];

  testCreateCases(t, S2GeometryLayer, TEST_CASES);
  t.end();
});

test('#S2Geometry -> formatLayerData', t => {
  const {rows, fields} = processCsvData(data);

  t.deepEqual(
    fields,
    [
      {
        name: 's2',
        format: '',
        tableFieldIndex: 1,
        type: 'string',
        analyzerType: 'STRING'
      },
      {
        name: 'value',
        format: '',
        tableFieldIndex: 2,
        type: 'real',
        analyzerType: 'FLOAT'
      }
    ],
    'Should compute fields correctly'
  );

  const filteredIndex = [0, 2, 4];

  const dataId = 'puppy';

  const nullRows = [
    [null, 12345],
    [null, 3456]
  ];

  const invalidRows = [
    [0, 12345],
    [1234, 3456],
    ['abcd', 123]
  ];

  const allRows = nullRows.concat(rows).concat(invalidRows);
  const dataset = {
    fields,
    rows,
    id: dataId,
    data: allRows,
    allData: allRows,
    filteredIndexForDomain: filteredIndex,
    filteredIndex,
    gpuFilter: getGpuFilterProps([], dataId, fields)
  };

  const props = {
    name: 's2 layer',
    layer: {
      type: 's2',
      id: 'test_layer_1',
      config: {
        dataId,
        label: 'S2',
        color: [255, 203, 153],
        columns: {
          token: 's2'
        },
        isVisible: true
      }
    },
    datasets: {
      [dataId]: dataset
    }
  };

  const TEST_CASES = [
    {
      ...props,
      data: [data, rows, filteredIndex, undefined],
      assert: result => {
        const {layerData, layer} = result;
        const expectedLayerData = {
          data: [
            {index: 2, token: rows[0][0], data: rows[0]},
            {index: 4, token: rows[2][0], data: rows[2]}
          ],
          getElevation: () => {},
          getFillColor: () => {},
          getFilterValue: () => {},
          getS2Token: () => {}
        };

        t.equal(
          layerData.getElevation(),
          DEFAULT_ELEVATION,
          `Elevation should be set to ${DEFAULT_ELEVATION}`
        );

        // test layer.meta
        t.deepEqual(
          layer.meta,
          {
            bounds: [-122.39575481805574, -50.18582525999928, 143.41537625914856, 37.81968456730113]
          },
          'should format correct S2 layer meta'
        );

        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should format correct s2-geometry layerData'
        );

        t.deepEqual(
          Object.keys(layerData).sort(),
          Object.keys(expectedLayerData).sort(),
          `layerData should have ${expectedLayerData.length} keys`
        );
      }
    },
    {
      ...props,
      updates: [
        {method: 'updateLayerConfig', args: [{colorField: fields[1]}]},
        {method: 'updateLayerConfig', args: [{sizeField: fields[1]}]},
        {
          method: 'updateLayerVisualChannel',
          args: [dataset, 'color']
        }
      ],
      data: [allRows, allRows, filteredIndex, undefined],
      assert: result => {
        const {layerData} = result;
        const expectedLayerData = {
          data: [
            {index: 2, token: rows[0][0], data: rows[0]},
            {index: 4, token: rows[2][0], data: rows[2]}
          ],
          getElevation: () => {},
          getFillColor: () => {},
          getFilterValue: () => {},
          getS2Token: () => {}
        };

        t.ok(typeof layerData.getFillColor === 'function', 'should have getFillColor');

        t.ok(typeof layerData.getElevation === 'function', 'should have getElevation');

        t.ok(typeof layerData.getFilterValue === 'function', 'should have getFilterValue');

        t.ok(typeof layerData.getS2Token === 'function', 'should have getS2Token');

        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should format correct s2-geometry layerData and remove null values'
        );

        t.deepEqual(
          Object.keys(layerData).sort(),
          Object.keys(expectedLayerData).sort(),
          `layerData should have ${expectedLayerData.length} keys`
        );
      }
    }
  ];

  testFormatLayerDataCases(t, S2GeometryLayer, TEST_CASES);

  t.end();
});

test('#S2Geometry -> renderLayer', t => {
  const {rows, fields} = processCsvData(data);
  const filteredIndex = [0, 2, 4];

  const dataId = 'puppy';

  const nullRows = [
    [null, 12345],
    [null, 3456]
  ];
  const invalidRows = [
    [0, 12345],
    [1234, 3456],
    ['abcd', 123]
  ];

  const allRows = nullRows.concat(rows).concat(invalidRows);

  const dataset = {
    fields,
    rows,
    id: dataId,
    data: allRows,
    allData: allRows,
    filteredIndexForDomain: filteredIndex,
    filteredIndex,
    gpuFilter: getGpuFilterProps([], dataId, fields)
  };

  const props = {
    name: 's2 layer',
    layer: {
      type: 's2',
      id: 'test_layer_1',
      config: {
        dataId,
        label: 'S2',
        color: [255, 203, 153],
        columns: {
          token: 's2'
        },
        isVisible: true
      }
    },
    datasets: {
      [dataId]: dataset
    }
  };

  const TEST_CASES = [
    {
      ...props,
      data: [data, rows, filteredIndex, undefined],
      assert: (deckLayers, layer) => {
        t.equal(layer.type, 's2', 'should create 1 s2 layer');
        t.equal(deckLayers.length, 4, 'Should create 4 deck.gl layers');

        const expectedLayerIds = [
          'test_layer_1',
          'test_layer_1-cell',
          'test_layer_1-cell-fill',
          'test_layer_1-cell-stroke'
        ];

        t.deepEqual(
          deckLayers.map(l => l.id),
          expectedLayerIds,
          'should create 1 composite, 1 hexagon-cell layer'
        );

        const {props: layerProps} = deckLayers[0];

        const expectedProps = {
          opacity: layer.config.visConfig.opacity,
          filterRange: [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0]
          ],
          filled: true,
          wrapLongitude: false,
          autoHighlight: false,
          highlightColor: [255, 255, 255, 60],
          extruded: false,
          elevationScale: 5
        };

        Object.keys(expectedProps).forEach(key => {
          t.deepEqual(layerProps[key], expectedProps[key], `should have correct props.${key}`);
        });
      }
    }
  ];

  testRenderLayerCases(t, S2GeometryLayer, TEST_CASES);

  t.end();
});

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';

import {
  testCreateCases,
  testFormatLayerDataCases,
  testRenderLayerCases
} from 'test/helpers/layer-utils';
import {a5DefaultElevation as defaultElevation, KeplerGlLayers} from '@kepler.gl/layers';
import {getGpuFilterProps, KeplerTable} from '@kepler.gl/table';
import {processCsvData} from '@kepler.gl/processors';
import {getA5Center} from '@kepler.gl/layers';

const {A5GeometryLayer} = KeplerGlLayers;

const dataId = 'a5-test-data';
const a5Csv = `a5,value,types
1ae2958000000000,0.5,type_a
1ae2968000000000,1.5,type_b
1adebc8000000000,2.5,type_a
1ae2978000000000,3.5,type_c
1ae2988000000000,4.5,type_b
`;

const {rows, fields} = processCsvData(a5Csv);

function createA5Dataset(filteredIndex) {
  const dataset = new KeplerTable({
    info: {id: dataId, label: 'a5-data'},
    color: [255, 0, 0]
  });
  dataset.importData({
    data: {fields, rows}
  });
  if (filteredIndex) {
    dataset.filteredIndex = filteredIndex;
    dataset.filteredIndexForDomain = filteredIndex;
  }
  dataset.gpuFilter = getGpuFilterProps([], dataId, dataset.fields);
  return dataset;
}

test('#A5Geometry -> constructor', t => {
  const TEST_CASES = [
    {
      props: {
        dataId: 'smoothie',
        isVisible: true,
        label: 'test a5 layer'
      },
      test: layer => {
        t.ok(layer.config.dataId === 'smoothie', 'A5GeometryLayer dataId should be correct');
        t.ok(layer.type === 'a5', 'type should be a5');
        t.deepEqual(
          Object.keys(layer.visConfigSettings),
          [
            'opacity',
            'colorRange',
            'filled',
            'thickness',
            'strokeColor',
            'strokeColorRange',
            'sizeRange',
            'stroked',
            'enable3d',
            'elevationScale',
            'enableElevationZoomFactor',
            'fixedHeight',
            'heightRange',
            'wireframe'
          ],
          'should provide the correct visConfigSettings properties'
        );
      }
    }
  ];

  testCreateCases(t, A5GeometryLayer, TEST_CASES);
  t.end();
});

test('#A5Geometry -> formatLayerData', t => {
  const filteredIndex = [0, 2, 4];
  const dataset = createA5Dataset(filteredIndex);

  const TEST_CASES = [
    {
      name: 'a5 layer',
      layer: {
        type: 'a5',
        id: 'test_layer_1',
        config: {
          dataId,
          label: 'A5',
          color: [2, 3, 4],
          columns: {
            token: 'a5'
          },
          isVisible: true
        }
      },
      datasets: {
        [dataId]: dataset
      },
      assert: result => {
        const {layerData, layer} = result;
        const expectedData = [
          {index: 0, token: '1ae2958000000000'},
          {index: 2, token: '1adebc8000000000'},
          {index: 4, token: '1ae2988000000000'}
        ];

        t.deepEqual(layerData.data, expectedData, 'should format correct a5 layerData');
        t.deepEqual(layerData.getFillColor, [2, 3, 4], 'getFillColor should be a constant');
        t.deepEqual(layerData.getElevation, defaultElevation, 'getElevation should be a constant');

        const expectedBounds = expectedData.reduce(
          (acc, d) => {
            const center = getA5Center(d.token);
            return [
              Math.min(acc[0], center[0]),
              Math.min(acc[1], center[1]),
              Math.max(acc[2], center[0]),
              Math.max(acc[3], center[1])
            ];
          },
          [Infinity, Infinity, -Infinity, -Infinity]
        );

        // Bounds are computed from all rows in updateLayerMeta, not filtered ones
        t.ok(layer.meta.bounds, 'should have bounds in meta');
        t.ok(layer.meta.bounds[0] <= expectedBounds[0], 'west bound');
        t.ok(layer.meta.bounds[1] <= expectedBounds[1], 'south bound');
        t.ok(layer.meta.bounds[2] >= expectedBounds[2], 'east bound');
        t.ok(layer.meta.bounds[3] >= expectedBounds[3], 'north bound');
      }
    }
  ];

  testFormatLayerDataCases(t, A5GeometryLayer, TEST_CASES);
  t.end();
});

test('#A5Geometry -> renderLayer', t => {
  const filteredIndex = [0, 2, 4];
  const dataset = createA5Dataset(filteredIndex);

  const TEST_CASES = [
    {
      name: 'a5 layer',
      layer: {
        type: 'a5',
        id: 'test_layer_1',
        config: {
          dataId,
          label: 'A5',
          color: [2, 3, 4],
          columns: {
            token: 'a5'
          },
          isVisible: true
        }
      },
      datasets: {
        [dataId]: dataset
      },
      assert: (deckLayers, layer) => {
        t.equal(layer.type, 'a5', 'should create 1 a5 layer');
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
          'should create composite A5 cell layers'
        );

        const {props: layerProps} = deckLayers[0];

        const expectedProps = {
          opacity: layer.config.visConfig.opacity,
          filled: true,
          wrapLongitude: false,
          autoHighlight: false,
          highlightColor: [255, 255, 255, 60],
          extruded: false
        };

        Object.keys(expectedProps).forEach(key => {
          t.deepEqual(layerProps[key], expectedProps[key], `should have correct props.${key}`);
        });
      }
    }
  ];

  testRenderLayerCases(t, A5GeometryLayer, TEST_CASES);
  t.end();
});

test('#A5Geometry -> findDefaultLayerProps', t => {
  const dataset = createA5Dataset();
  const {props} = A5GeometryLayer.findDefaultLayerProps(dataset);
  t.equal(props.length, 1, 'should find one A5 layer prop');
  t.equal(props[0].columns.token.value, 'a5', 'should auto-detect a5 column');
  t.end();
});

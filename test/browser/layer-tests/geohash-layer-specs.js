// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';

import {
  testCreateCases,
  testFormatLayerDataCases,
  testRenderLayerCases
} from 'test/helpers/layer-utils';
import {geohashDefaultElevation as defaultElevation, KeplerGlLayers} from '@kepler.gl/layers';
import {getGpuFilterProps, KeplerTable} from '@kepler.gl/table';
import {processCsvData} from '@kepler.gl/processors';
import {getGeohashCenter} from '@kepler.gl/layers';

const {GeohashGeometryLayer} = KeplerGlLayers;

const dataId = 'geohash-test-data';
const geohashCsv = `geohash,value,types
9q8yyk,0.5,type_a
9q8yyw,1.5,type_b
9q8yy4,2.5,type_a
9q8zn8,3.5,type_c
9q8yvc,4.5,type_b
`;

const {rows, fields} = processCsvData(geohashCsv);

function createGeohashDataset(filteredIndex) {
  const dataset = new KeplerTable({
    info: {id: dataId, label: 'geohash-data'},
    color: [255, 0, 0]
  });
  dataset.importData({
    data: {fields, rows}
  });
  if (filteredIndex != null) {
    dataset.filteredIndex = filteredIndex;
    dataset.filteredIndexForDomain = filteredIndex;
  }
  dataset.gpuFilter = getGpuFilterProps([], dataId, dataset.fields);
  return dataset;
}

test('#GeohashGeometry -> constructor', t => {
  const TEST_CASES = [
    {
      props: {
        dataId: 'smoothie',
        isVisible: true,
        label: 'test geohash layer'
      },
      test: layer => {
        t.ok(layer.config.dataId === 'smoothie', 'GeohashGeometryLayer dataId should be correct');
        t.ok(layer.type === 'geohash', 'type should be geohash');
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

  testCreateCases(t, GeohashGeometryLayer, TEST_CASES);
  t.end();
});

test('#GeohashGeometry -> formatLayerData', t => {
  const filteredIndex = [0, 2, 4];
  const dataset = createGeohashDataset(filteredIndex);

  const TEST_CASES = [
    {
      name: 'geohash layer',
      layer: {
        type: 'geohash',
        id: 'test_layer_1',
        config: {
          dataId,
          label: 'GeoHash',
          color: [2, 3, 4],
          columns: {
            token: 'geohash'
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
          {index: 0, token: '9q8yyk'},
          {index: 2, token: '9q8yy4'},
          {index: 4, token: '9q8yvc'}
        ];

        t.deepEqual(layerData.data, expectedData, 'should format correct geohash layerData');
        t.deepEqual(layerData.getFillColor, [2, 3, 4], 'getFillColor should be a constant');
        t.deepEqual(layerData.getElevation, defaultElevation, 'getElevation should be a constant');

        const expectedBounds = expectedData.reduce(
          (acc, d) => {
            const center = getGeohashCenter(d.token);
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

  testFormatLayerDataCases(t, GeohashGeometryLayer, TEST_CASES);
  t.end();
});

test('#GeohashGeometry -> renderLayer', t => {
  const filteredIndex = [0, 2, 4];
  const dataset = createGeohashDataset(filteredIndex);

  const TEST_CASES = [
    {
      name: 'geohash layer',
      layer: {
        type: 'geohash',
        id: 'test_layer_1',
        config: {
          dataId,
          label: 'GeoHash',
          color: [2, 3, 4],
          columns: {
            token: 'geohash'
          },
          isVisible: true
        }
      },
      datasets: {
        [dataId]: dataset
      },
      assert: (deckLayers, layer) => {
        t.equal(layer.type, 'geohash', 'should create 1 geohash layer');
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
          'should create composite GeoHash cell layers'
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

  testRenderLayerCases(t, GeohashGeometryLayer, TEST_CASES);
  t.end();
});

test('#GeohashGeometry -> findDefaultLayerProps', t => {
  const dataset = createGeohashDataset();
  const {props} = GeohashGeometryLayer.findDefaultLayerProps(dataset);
  t.equal(props.length, 1, 'should find one GeoHash layer prop');
  t.equal(props[0].columns.token.value, 'geohash', 'should auto-detect geohash column');
  t.end();
});

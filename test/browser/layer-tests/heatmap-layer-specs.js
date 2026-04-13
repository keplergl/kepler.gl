// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {
  testCreateCases,
  testFormatLayerDataCases,
  preparedDataset,
  dataId,
  pointLayerMeta
} from 'test/helpers/layer-utils';
import {StateWFiles, testCsvDataId} from 'test/helpers/mock-state';
import {gpsPointBounds} from 'test/fixtures/test-csv-data';

import {KeplerGlLayers} from '@kepler.gl/layers';
import {copyTableAndUpdate} from '@kepler.gl/table';

const {HeatmapLayer} = KeplerGlLayers;

const columns = {
  lat: 'lat',
  lng: 'lng'
};

test('#HeatmapLayer -> contructor', t => {
  const TEST_CASES = {
    CREATE: [
      {
        props: {
          dataId: 'taro',
          isVisible: true,
          label: 'test heatmap layer'
        },
        test: layer => {
          t.equal(layer.config.visConfig.radius, 20, 'Heatmap default radius should be 20');
          t.ok(layer.config.dataId === 'taro', 'heatmaplayer dataId should be correct');
          t.ok(layer.type === 'heatmap', 'type should be heatmap');
          t.ok(layer.isAggregated === true, 'heatmaplayer is aggregated');
          t.ok(layer.config.label === 'test heatmap layer', 'label should be correct');
          t.ok(Object.keys(layer.columnPairs).length, 'should have columnPairs');
        }
      }
    ]
  };

  testCreateCases(t, HeatmapLayer, TEST_CASES.CREATE);
  t.end();
});

test('#Heatmaplayer -> formatLayerData -> w/ GpuFilter', t => {
  const filteredIndex = [0, 2, 4];

  const TEST_CASES = [
    {
      name: 'Heatmap gps point.1',
      layer: {
        type: 'heatmap',
        id: 'heatmap-test-1',
        config: {
          dataId,
          label: 'deck.gl heatmap',
          isVisible: true,
          columns,
          weightField: {
            type: 'integer',
            name: 'id'
          }
        }
      },
      datasets: {
        [dataId]: copyTableAndUpdate(preparedDataset, {filteredIndex})
      },
      assert: result => {
        const {layerData, layer} = result;

        t.ok(Array.isArray(layerData.data), 'layerData.data should be an array');
        t.ok(typeof layerData.getPosition === 'function', 'should have getPosition accessor');
        t.ok(typeof layerData.getWeight === 'function', 'should have getWeight accessor');

        // data items should have {index} shape for deck.gl aggregation
        t.ok(
          layerData.data.every(d => typeof d.index === 'number'),
          'data items should have numeric index'
        );

        // test layer.meta
        t.deepEqual(layer.meta, pointLayerMeta, 'should format correct heatmap layer.meta');
      }
    }
  ];

  testFormatLayerDataCases(t, HeatmapLayer, TEST_CASES);
  t.end();
});

test('#Heatmaplayer -> formatLayerData -> w/o GpuFilter', t => {
  const testData = StateWFiles.visState.datasets[testCsvDataId];
  const gpsColumns = {
    lat: 'gps_data.lat',
    lng: 'gps_data.lng'
  };

  const TEST_CASES = [
    {
      name: 'Heatmap gps point.1',
      layer: {
        type: 'heatmap',
        id: 'heatmap-test-1',
        config: {
          dataId: testCsvDataId,
          label: 'deck.gl heatmap',
          isVisible: true,
          columns: gpsColumns,
          visConfig: {
            colorRange: {
              colors: ['#010101', '#020202', '#030303']
            },
            radius: 100,
            opacity: 0.2
          }
        }
      },
      datasets: StateWFiles.visState.datasets,
      assert: result => {
        const {layerData, layer} = result;
        const expectedLayerMeta = {bounds: gpsPointBounds};

        t.ok(Array.isArray(layerData.data), 'layerData.data should be an array');
        t.equal(
          layerData.data.length,
          testData.dataContainer.numRows(),
          'should have same number of data points'
        );

        t.ok(typeof layerData.getPosition === 'function', 'should have getPosition accessor');
        t.equal(typeof layerData.getWeight, 'number', 'getWeight should be 1 when no weight field');
        t.equal(layerData.getWeight, 1, 'getWeight should default to 1');

        // data items should have {index} shape
        t.ok(
          layerData.data.every(d => typeof d.index === 'number'),
          'data items should have numeric index'
        );

        // test layer.meta
        t.deepEqual(layer.meta, expectedLayerMeta, 'should format correct heatmap layer.meta');
      }
    }
  ];

  testFormatLayerDataCases(t, HeatmapLayer, TEST_CASES);
  t.end();
});

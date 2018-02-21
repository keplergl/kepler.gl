import test from 'tape';
import {testCreateCases, testFormatLayerDataCases} from '../test-utils/layer-utils';
import {GeojsonLayer} from 'keplergl-layers';

import {processCsvData} from 'processor/data-processor';
import {wktCsv, updatedLayerSimplifiedShape, updatedLayerV2}
from '../../fixtures/test-csv-data';

test('#GeojsonLayer -> constructor', t => {
  const TEST_CASES = {
    CREATE: [{
      props: {
        dataId: 'smoothie',
        isVisible: true,
        label: 'test geojson layer'
      },
      test: layer => {
        t.ok(layer.config.dataId === 'smoothie', 'geojsonLayer dataId should be correct');
        t.ok(layer.type === 'geojson', 'type should be geojson');
        t.ok(layer.isAggregated === false, 'geojsonLayer is not aggregated');
      }
    }]
  };

  testCreateCases(t, GeojsonLayer, TEST_CASES.CREATE);
  t.end();
});

test('#GeojsonLayer -> formatLayerData', async t => {
  const {rows} = await processCsvData(wktCsv);

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

      t.deepEqual(layerData.data, expectedLayerData.data, 'should format correct geojson layerData');
      t.ok(typeof layerData.getFeature === 'function', 'should have getFeature');
      t.ok(typeof layerData.getFillColor === 'function', 'should have getFillColor');
      t.ok(typeof layerData.getLineColor === 'function', 'should have getLineColor');
      t.ok(typeof layerData.getLineWidth === 'function', 'should have getSize');
      t.ok(typeof layerData.getElevation === 'function', 'should have getRadius');
      t.ok(typeof layerData.getRadius === 'function', 'should have getRadius');

      t.deepEqual(layer.meta, expectedLayerMeta, 'should format correct geojson layerData');
      t.deepEqual(layer.dataToFeature, expectedDataToFeature, 'should format correct geojson layerData');
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

      t.deepEqual(layerData.data, expectedLayerData.data, 'should format correct geojson layerData');
      t.ok(typeof layerData.getFeature === 'function', 'should have getFeature');
      t.ok(typeof layerData.getFillColor === 'function', 'should have getFillColor');
      t.ok(typeof layerData.getLineColor === 'function', 'should have getLineColor');
      t.ok(typeof layerData.getLineWidth === 'function', 'should have getSize');
      t.ok(typeof layerData.getElevation === 'function', 'should have getRadius');
      t.ok(typeof layerData.getRadius === 'function', 'should have getRadius');

      t.deepEqual(layer.meta, expectedLayerMeta, 'should format correct geojson layerData');
      t.deepEqual(layer.dataToFeature, expectedDataToFeature, 'should format correct geojson layerData');
    }
  }];

  testFormatLayerDataCases(t, GeojsonLayer, TEST_CASES);
  t.end();
});

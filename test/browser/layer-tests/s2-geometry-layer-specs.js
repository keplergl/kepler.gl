// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import moment from 'moment';

import {
  testCreateCases,
  testFormatLayerDataCases,
  testRenderLayerCases,
  preparedDataset,
  dataId,
  testRows,
  preparedFilterDomain0
} from 'test/helpers/layer-utils';
import {s2DefaultElevation as defaultElevation, KeplerGlLayers} from '@kepler.gl/layers';
import {copyTableAndUpdate} from '@kepler.gl/table';
import {createDataContainer} from '@kepler.gl/utils';
import {INITIAL_MAP_STATE, INITIAL_VIS_STATE} from '@kepler.gl/reducers';

const {S2GeometryLayer} = KeplerGlLayers;

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

  testCreateCases(t, S2GeometryLayer, TEST_CASES);
  t.end();
});

test('#S2Geometry -> formatLayerData', t => {
  const filteredIndex = [0, 2, 4];

  const TEST_CASES = [
    {
      name: 's2 layer',
      layer: {
        type: 's2',
        id: 'test_layer_1',
        config: {
          dataId,
          label: 'S2',
          color: [2, 3, 4],
          columns: {
            token: 's2x'
          },
          isVisible: true
        }
      },
      datasets: {
        [dataId]: copyTableAndUpdate(preparedDataset, {filteredIndex})
      },
      assert: result => {
        const {layerData, layer} = result;
        const expectedLayerData = {
          data: [
            {index: 0, token: '80858004'},
            {index: 4, token: '8085801c'}
          ],
          getElevation: () => {},
          getFillColor: () => {},
          getFilterValue: () => {},
          getS2Token: () => {},
          getLineColor: () => {},
          getLineWidth: () => {}
        };

        // test layer.meta
        t.deepEqual(
          layer.meta,
          {
            bounds: [-122.38442501650697, 37.79109908631398, -122.3617617587711, 37.81968456730113]
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

        t.deepEqual(layerData.getFillColor, [2, 3, 4], 'getFillColor should be a constant');
        t.deepEqual(layerData.getElevation, defaultElevation, 'getElevation should be a constant');
        t.deepEqual(
          layerData.data.map(layerData.getS2Token),
          ['80858004', '8085801c'],
          'getS2Token should return correct token'
        );
        // getFilterValue
        t.deepEqual(
          layerData.data.map(layerData.getFilterValue),
          [
            [Number.MIN_SAFE_INTEGER, 0, 0, 0],
            [moment.utc(testRows[4][0]).valueOf() - preparedFilterDomain0, 0, 0, 0]
          ],
          'getFilterValue should return [value, 0, 0, 0]'
        );
      }
    },
    {
      name: 's2 layer',
      layer: {
        type: 's2',
        id: 'test_layer_1',
        config: {
          dataId,
          label: 'S2',
          color: [2, 3, 4],
          columns: {
            token: 's2x'
          },
          isVisible: true,
          // color by types(string)
          colorField: {
            type: 'string',
            name: 'types'
          },
          // size by id(integer)
          heightField: {
            type: 'real',
            name: 'trip_distance'
          },
          sizeField: {
            type: 'real',
            name: 'trip_distance'
          },
          visConfig: {
            colorRange: {
              colors: ['#010101', '#020202', '#030303']
            },
            elevationRange: [10, 20],
            sizeRange: [10, 20],
            enable3d: true
          }
        }
      },
      datasets: {
        [dataId]: copyTableAndUpdate(preparedDataset, {filteredIndex})
      },
      assert: result => {
        const {layerData} = result;
        // getFillColor
        // domain: ['driver_analytics', 'driver_analytics_0', 'driver_gps']
        // range ['#010101', '#020202', '#030303']
        t.deepEqual(
          layerData.data.map(layerData.getFillColor),
          [
            [2, 2, 2],
            [1, 1, 1]
          ],
          'getFillColor should be correct'
        );

        // getElevation
        // domain: [1.59, 11]
        // range: [0, 500]
        // value [1.59, 2.37]
        t.deepEqual(
          layerData.data.map(layerData.getElevation),
          [0, 41.445270988310305],
          'getElevation should correct'
        );

        // getLineWidth
        // domain: [1.59, 11]
        // range: [10, 20]
        // value [1.59, 2.37]
        t.deepEqual(
          layerData.data.map(layerData.getLineWidth),
          [10, (2.37 - 1.59) * (10 / 9.41) + 10],
          'getLineWidth should be correct'
        );

        // getFilterValue
        t.deepEqual(
          layerData.data.map(layerData.getFilterValue),
          [
            [Number.MIN_SAFE_INTEGER, 0, 0, 0],
            [moment.utc(testRows[4][0]).valueOf() - preparedFilterDomain0, 0, 0, 0]
          ],
          'getFilterValue should return [value, 0, 0, 0]'
        );
      }
    }
  ];

  testFormatLayerDataCases(t, S2GeometryLayer, TEST_CASES);

  t.end();
});

test('#S2Geometry -> renderLayer', t => {
  const filteredIndex = [0, 2, 4];

  const TEST_CASES = [
    {
      name: 's2 layer',
      layer: {
        type: 's2',
        id: 'test_layer_1',
        config: {
          dataId,
          label: 'S2',
          color: [2, 3, 4],
          columns: {
            token: 's2x'
          },
          isVisible: true
        }
      },
      datasets: {
        [dataId]: {
          ...preparedDataset,
          filteredIndex
        }
      },
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
          filterRange: preparedDataset.gpuFilter.filterRange,
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

test('#S2Geometry -> invalid non-hex tokens never reach polygon generation', t => {
  const valid = ['80858004', "'80858004'", '"8085801c"', '8085801c'];
  const invalid = ['zz', 'unknown', '8085800g', "'zz'", '"unknown"', '', null, undefined, 80858004];
  const field = preparedDataset.fields.find(candidate => candidate.name === 's2x');
  const makeDataset = tokens =>
    copyTableAndUpdate(preparedDataset, {
      dataContainer: createDataContainer(
        tokens.map(token => {
          const row = [...testRows[0]];
          row[field.fieldIdx] = token;
          return row;
        })
      ),
      filteredIndex: tokens.map((_, index) => index)
    });
  const formatAndRender = tokens => {
    const dataset = makeDataset(tokens);
    const layer = new S2GeometryLayer({id: 's2-token-validation', dataId});
    layer.updateLayerConfig({columns: {token: {value: field.name, fieldIdx: field.fieldIdx}}});
    const data = layer.formatLayerData({[dataId]: dataset});
    const [rendered] = layer.renderLayer({
      data,
      gpuFilter: dataset.gpuFilter,
      interactionConfig: INITIAL_VIS_STATE.interactionConfig,
      mapState: INITIAL_MAP_STATE,
      visible: true
    });
    // This invokes deck.gl's actual S2 token-to-polygon conversion, without a WebGL draw.
    const {getPolygon} = rendered.indexToBounds();
    const polygons = rendered.props.data.map((row, index) => Array.from(getPolygon(row, {index})));
    return {layer, data, polygons};
  };

  const baseline = formatAndRender(valid);
  t.equal(baseline.polygons.length, valid.length, 'valid and quoted tokens generate polygons');
  t.deepEqual(
    baseline.polygons[0],
    baseline.polygons[1],
    'single-quoted token preserves its geometry'
  );
  t.deepEqual(
    baseline.polygons[2],
    baseline.polygons[3],
    'double-quoted token preserves its geometry'
  );
  t.ok(
    baseline.polygons.every(polygon => polygon.length >= 10 && polygon.every(Number.isFinite)),
    'valid geometry has finite coordinates'
  );

  const mixed = formatAndRender([...valid, ...invalid]);
  t.deepEqual(
    mixed.data.data.map(row => row.index),
    [0, 1, 2, 3],
    'invalid and missing tokens are filtered out'
  );
  t.deepEqual(mixed.polygons, baseline.polygons, 'invalid tokens produce no extra polygons');
  t.deepEqual(
    mixed.layer.meta.bounds,
    baseline.layer.meta.bounds,
    'invalid tokens cannot distort map bounds'
  );

  const empty = formatAndRender(invalid);
  t.deepEqual(empty.data.data, [], 'an invalid-only dataset has no renderable cells');
  t.deepEqual(empty.polygons, [], 'an invalid-only dataset creates no polygons');
  t.deepEqual(formatAndRender([]).polygons, [], 'an empty dataset creates no polygons');
  t.end();
});

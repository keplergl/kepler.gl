// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import * as arrow from 'apache-arrow';
import {LayerManager, MapView} from '@deck.gl/core';
import {device} from '@deck.gl/test-utils';
import {visStateSchemaV1} from '@kepler.gl/schemas';
import {iconAngleAccessor} from '../../../src/layers/src/icon-layer/icon-layer';
import React from 'react';
import {mount} from 'enzyme';
import Window from 'global/window';
import sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import {getDistanceScales, zoomToScale} from '@math.gl/web-mercator';
import {copyTableAndUpdate} from '@kepler.gl/table';
import {KeplerGlLayers} from '@kepler.gl/layers';
import {
  getApplicationConfig,
  initApplicationConfig,
  createDataContainer,
  DataForm
} from '@kepler.gl/utils';
import {
  DEFAULT_TEXT_LABEL,
  GEOCODER_LAYER_ID,
  PROJECTED_PIXEL_SIZE_MULTIPLIER
} from '@kepler.gl/constants';

sinonStubPromise(sinon);

import {
  testCreateCases,
  testCreateLayerFromConfig,
  testFormatLayerDataCases,
  testRenderLayerCases,
  testRenderDeckLayer,
  preparedDataset,
  dataId,
  testRows,
  pointLayerMeta,
  iconGeometry
} from 'test/helpers/layer-utils';
import {
  INITIAL_MAP_STATE,
  INITIAL_VIS_STATE,
  layerClickUpdater,
  layerHoverUpdater,
  mapClickUpdater,
  renderDeckGlLayer
} from '@kepler.gl/reducers';
import {IntlWrapper} from '../../helpers/component-utils';

const {IconLayer} = KeplerGlLayers;
const columns = {
  lat: 'lat',
  lng: 'lng',
  icon: 'icon'
};

const mockSvgIcons = [
  {
    id: 'alert',
    mesh: {
      positions: [
        [1, -0.5, 0],
        [0.9, -0.52, 0],
        [0.97, -0.5, 0],
        [0.3, -0.4, 0]
      ],
      cells: [
        [0, 1, 3],
        [1, 2, 3]
      ]
    }
  }
];

const fallbackPlaceIcon = {
  id: 'place',
  mesh: {
    positions: [
      [1, 1, 0],
      [2, 1, 0],
      [1, 2, 0]
    ],
    cells: [[0, 1, 2]]
  }
};

const customPlaceIcon = {
  id: 'place',
  mesh: {
    positions: [
      [10, 10, 0],
      [20, 10, 0],
      [10, 20, 0]
    ],
    cells: [[0, 1, 2]]
  }
};

const fallbackPlaceGeometry = [1, -1, 0, 2, -1, 0, 1, -2, 0];
const customPlaceGeometry = [10, -10, 0, 20, -10, 0, 10, -20, 0];

test('#IconLayer -> constructor', t => {
  const TEST_CASES = {
    CREATE: [
      {
        props: {
          dataId: 'smoothie',
          isVisible: true,
          label: 'test icon layer'
        },
        test: layer => {
          t.ok(layer.config.dataId === 'smoothie', 'IconLayer dataId should be correct');
          t.ok(layer.type === 'icon', 'type should be icon');
          t.ok(layer.isAggregated === false, 'IconLayer is not aggregated');
          t.ok(layer.config.label === 'test icon layer', 'label should be correct');
          t.ok(Object.keys(layer.columnPairs).length, 'should have columnPairs');

          // t.ok(spy.calledOnce, 'should call window.fetch once');
        }
      }
    ]
  };

  testCreateCases(t, IconLayer, TEST_CASES.CREATE);
  t.end();
});

test('#IconLayer -> geocoder uses bundled place icon', t => {
  const layer = new IconLayer({id: GEOCODER_LAYER_ID, dataId: ''});

  t.ok(layer.iconGeometry.place?.length, 'should initialize place geometry synchronously');
  t.equal(layer.iconGeometryVersion, 1, 'should render the bundled geometry immediately');

  t.end();
});

test('#IconLayer -> geocoder constructor icons override bundled place icon', t => {
  const layer = new IconLayer({
    id: GEOCODER_LAYER_ID,
    dataId: '',
    svgIcons: [customPlaceIcon]
  });

  t.deepEqual(
    layer.iconGeometry.place,
    customPlaceGeometry,
    'should use constructor geometry for the place icon'
  );

  t.end();
});

test('#IconLayer -> geocoder remote icons override fallback', async t => {
  const previousConfig = getApplicationConfig();
  const previousCustomIconUrl = previousConfig.customIconUrl;
  const previousCustomIcons = previousConfig.customIcons;
  const customIconUrl = 'https://example.com/custom-icons.json';
  const fetchStub = sinon.stub(Window, 'fetch').callsFake(url =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({svgIcons: url === customIconUrl ? [customPlaceIcon] : []})
    })
  );

  try {
    initApplicationConfig({customIconUrl, customIcons: []});
    const layer = new IconLayer({id: GEOCODER_LAYER_ID, dataId: ''});

    await layer.getSvgIcons([fallbackPlaceIcon]);

    t.deepEqual(
      layer.iconGeometry.place,
      customPlaceGeometry,
      'should replace fallback geometry with the remote place icon'
    );
    t.ok(fetchStub.calledWith(customIconUrl), 'should load the configured remote icons');
  } finally {
    fetchStub.restore();
    initApplicationConfig({
      customIconUrl: previousCustomIconUrl,
      customIcons: previousCustomIcons
    });
  }

  t.end();
});

test('#IconLayer -> geocoder keeps fallback when remote icons fail', async t => {
  const previousConfig = getApplicationConfig();
  const previousCustomIconUrl = previousConfig.customIconUrl;
  const previousCustomIcons = previousConfig.customIcons;
  const customIconUrl = 'https://example.com/unavailable-icons.json';
  const fetchStub = sinon
    .stub(Window, 'fetch')
    .callsFake(url =>
      Promise.resolve(
        url === customIconUrl
          ? {ok: false, status: 500}
          : {ok: true, json: () => Promise.resolve({svgIcons: []})}
      )
    );
  const consoleErrorStub = sinon.stub(console, 'error');

  try {
    initApplicationConfig({customIconUrl, customIcons: []});
    const layer = new IconLayer({id: GEOCODER_LAYER_ID, dataId: ''});

    await layer.getSvgIcons([fallbackPlaceIcon]);

    t.deepEqual(
      layer.iconGeometry.place,
      fallbackPlaceGeometry,
      'should preserve fallback geometry after a remote load failure'
    );
  } finally {
    consoleErrorStub.restore();
    fetchStub.restore();
    initApplicationConfig({
      customIconUrl: previousCustomIconUrl,
      customIcons: previousCustomIcons
    });
  }

  t.end();
});

test('#IconLayer -> formatLayerData', t => {
  const filteredIndex = [0, 2, 4];

  const TEST_CASES = [
    {
      name: 'gps point with icon.1',
      layer: {
        config: {
          dataId,
          label: 'gps point icon',
          columns,
          color: [2, 3, 4],
          textLabel: [
            {
              field: {
                name: 'types',
                type: 'string'
              }
            },
            {
              field: {
                name: 'has_result',
                type: 'boolean'
              }
            }
          ]
        },
        type: 'icon',
        id: 'test_layer_1'
      },
      datasets: {
        [dataId]: copyTableAndUpdate(preparedDataset, {filteredIndex})
      },
      assert: result => {
        const {layerData, layer} = result;

        const expectedLayerData = {
          data: [
            {
              index: 0,
              icon: 'accel'
            }
          ],
          textLabels: [
            {
              characterSet: [],
              getText: () => {}
            },
            {
              characterSet: [],
              getText: () => {}
            }
          ],
          getFilterValue: () => {},
          getFillColor: () => {},
          getRadius: () => {},
          getPosition: () => {},
          getAngle: 0
        };
        t.deepEqual(
          Object.keys(layerData).sort(),
          Object.keys(expectedLayerData).sort(),
          'layerData should have 5 keys'
        );
        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should format correct point layerData data'
        );
        // getPosition
        t.deepEqual(
          layerData.getPosition(layerData.data[0]),
          [testRows[0][2], testRows[0][1], 0],
          'getPosition should return correct position'
        );
        // getFillColor
        t.deepEqual(layerData.getFillColor, [2, 3, 4], 'getFillColor should be a constant');
        // getRadius
        t.equal(layerData.getRadius, 1, 'getRadius should be a constant');
        // getFilterValue
        t.deepEqual(
          layerData.data.map(layerData.getFilterValue),
          [[Number.MIN_SAFE_INTEGER, 0, 0, 0]],
          'getFilterValue should return [value, 0, 0, 0]'
        );
        // textLabels
        t.deepEqual(
          layerData.textLabels.length,
          expectedLayerData.textLabels.length,
          'textLabels should have 2 items'
        );
        t.deepEqual(
          layerData.textLabels[0].characterSet,
          ['d', 'r', 'i', 'v', 'e', '_', 'a', 'n', 'l', 'y', 't', 'c', 's', '0'],
          'textLabels should have correct characterSet'
        );
        t.deepEqual(
          layerData.textLabels[0].getText(layerData.data[0]),
          'driver_analytics_0',
          'textLabels getText should have correct text'
        );
        // layerMeta
        t.deepEqual(layer.meta, pointLayerMeta, 'should format correct point layer meta');
      }
    },
    {
      name: 'Icon data. with colorField and sizeField',
      layer: {
        config: {
          dataId,
          label: 'icons',
          columns,
          color: [10, 10, 10],
          // color by types(string)
          colorField: {
            type: 'string',
            name: 'types'
          },
          // size by id(integer)
          sizeField: {
            type: 'real',
            name: 'trip_distance'
          },
          visConfig: {
            colorRange: {
              colors: ['#010101', '#020202', '#030303']
            },
            radiusRange: [10, 20]
          }
        },
        type: 'icon',
        id: 'test_layer_2'
      },
      datasets: {
        [dataId]: copyTableAndUpdate(preparedDataset, {filteredIndex})
      },
      assert: result => {
        const {layerData} = result;

        // getSourceColor
        // domain: ['driver_analytics', 'driver_analytics_0', 'driver_gps']
        // range ['#010101', '#020202', '#030303']
        t.deepEqual(
          layerData.data.map(layerData.getFillColor),
          [[2, 2, 2]],
          'getFillColor should be correct'
        );
        // getRadius
        // domain: [1.59, 11]
        // range: [10, 20]
        // value [1.59, 2.37]
        t.deepEqual(
          layerData.data.map(layerData.getRadius),
          [10],
          'getRadius should be a constant'
        );
        // getFilterValue
        t.deepEqual(
          layerData.data.map(layerData.getFilterValue),
          [[Number.MIN_SAFE_INTEGER, 0, 0, 0]],
          'getFilterValue should return [value, 0, 0, 0]'
        );
      }
    }
  ];

  testFormatLayerDataCases(t, IconLayer, TEST_CASES);
  t.end();
});

test('#IconLayer -> renderLayer', t => {
  const filteredIndex = [0, 2, 4, 5];

  const TEST_CASES = [
    {
      name: 'Test render icon.1 -> no icon Geometry',
      layer: {
        config: {
          dataId,
          label: 'gps point icon',
          columns,
          color: [2, 3, 4]
        },
        type: 'icon',
        id: 'test_layer_1'
      },
      datasets: {
        [dataId]: copyTableAndUpdate(preparedDataset, {filteredIndex})
      },
      assert: (deckLayers, layer) => {
        t.equal(layer.type, 'icon', 'should create 1 icon layer');
        t.equal(
          deckLayers.length,
          3,
          'Should create 3 deck.gl layer when default icon geometry is not provided or missing'
        );
      }
    },
    {
      name: 'Test render icon.2 -> has icon geometry',
      layer: {
        id: 'test_layer_1',
        type: 'icon',
        config: {
          dataId,
          label: 'gps point icon',
          columns,
          color: [1, 2, 3]
        }
      },
      afterLayerInitialized: layer => {
        layer.iconGeometry = iconGeometry;
      },
      datasets: {
        [dataId]: copyTableAndUpdate(preparedDataset, {filteredIndex})
      },
      assert: (deckLayers, layer) => {
        t.equal(layer.type, 'icon', 'should create 1 icon layer');
        t.equal(
          deckLayers.length,
          3,
          'Should create 3 deck.gl layer when icon geometry is provided'
        );
        const expectedLayerIds = [
          'test_layer_1_0',
          'test_layer_1_0-accel',
          'test_layer_1_0-attach'
        ];

        t.deepEqual(
          deckLayers.map(l => l.id),
          expectedLayerIds,
          'should create 1 composite, 2 svg icon layer'
        );

        const {props} = deckLayers[0];

        const expectedProps = {
          opacity: layer.config.visConfig.opacity,
          radiusMaxPixels: 500,
          radiusScale: layer.getRadiusScaleByZoom(INITIAL_MAP_STATE),
          filterRange: preparedDataset.gpuFilter.filterRange,
          brushingEnabled: false
        };
        Object.keys(expectedProps).forEach(key => {
          t.deepEqual(props[key], expectedProps[key], `should have correct props.${key}`);
        });
      }
    },
    {
      name: 'Test render icon.2 -> has icon geometry -> brushing',
      layer: {
        id: 'test_layer_1',
        type: 'icon',
        config: {
          dataId,
          label: 'gps point icon',
          columns,
          color: [1, 2, 3]
        }
      },
      afterLayerInitialized: layer => {
        layer.iconGeometry = iconGeometry;
      },
      datasets: {
        [dataId]: copyTableAndUpdate(preparedDataset, {filteredIndex})
      },
      renderArgs: {
        interactionConfig: {
          brush: {
            enabled: true,
            config: {
              size: 2.5
            }
          }
        }
      },
      assert: (deckLayers, layer) => {
        t.equal(layer.type, 'icon', 'should create 1 icon layer');
        t.equal(
          deckLayers.length,
          3,
          'Should create 3 deck.gl layer when icon geometry is provided'
        );
        const expectedLayerIds = [
          'test_layer_1_0',
          'test_layer_1_0-accel',
          'test_layer_1_0-attach'
        ];

        t.deepEqual(
          deckLayers.map(l => l.id),
          expectedLayerIds,
          'should create 1 composite, 2 svg icon layer'
        );

        const {props} = deckLayers[0];

        const expectedProps = {
          brushingRadius: 2500,
          brushingTarget: 'source',
          brushingEnabled: true
        };
        Object.keys(expectedProps).forEach(key => {
          t.deepEqual(props[key], expectedProps[key], `should have correct props.${key}`);
        });
      }
    },
    {
      name: 'Test render icon.1 -> with text labels',
      layer: {
        config: {
          dataId,
          label: 'gps point icon',
          columns,
          color: [2, 3, 4],
          textLabel: [
            {
              field: {
                name: 'types',
                type: 'string'
              }
              // default anchor: start, alignment: center
            },
            {
              field: {
                name: 'has_result',
                type: 'boolean'
              },
              anchor: 'middle',
              alignment: 'bottom'
            }
          ]
        },
        type: 'icon',
        id: 'test_layer_1'
      },
      afterLayerInitialized: layer => {
        layer.iconGeometry = iconGeometry;
      },
      datasets: {
        [dataId]: copyTableAndUpdate(preparedDataset, {filteredIndex})
      },
      assert: (deckLayers, layer, layerData) => {
        t.equal(deckLayers.length, 7, 'Should create 7 deck.gl layer');
        t.deepEqual(
          deckLayers.map(l => l.id),
          [
            'test_layer_1_0',
            'test_layer_1_0-accel',
            'test_layer_1_0-attach',
            'test_layer_1-label-types',
            'test_layer_1-label-types-characters',
            'test_layer_1-label-has_result',
            'test_layer_1-label-has_result-characters'
          ],
          'Should create 5 deck.gl layers'
        );
        // test test_layer_1-label-types
        const {getPosition, getColor, getSize, getPixelOffset, getFilterValue} =
          deckLayers[4].props;
        const {getPixelOffset: getPixelOffset1} = deckLayers[6].props;

        const distanceScale = getDistanceScales(INITIAL_MAP_STATE);
        const radiusScale = layer.getRadiusScaleByZoom(INITIAL_MAP_STATE);
        const pixelRadius =
          radiusScale * distanceScale.unitsPerMeter[0] * zoomToScale(INITIAL_MAP_STATE.zoom);

        const padding = 20;

        // anchor: start, alignment: center
        const expectedPixelOffset0 = [1 * (pixelRadius + padding), 0 * (pixelRadius + padding + 0)];

        // anchor: 'middle', alignment: 'bottom'
        const expectedPixelOffset1 = [
          0 * (pixelRadius + padding),
          1 * (pixelRadius + padding + DEFAULT_TEXT_LABEL.size)
        ];

        t.deepEqual(
          getPosition(layerData.data[0]),
          [testRows[0][2], testRows[0][1], 0],
          'Should calculate correct getPosition'
        );
        t.deepEqual(getColor, DEFAULT_TEXT_LABEL.color, 'Should calculate correct getColor');
        t.deepEqual(getSize, PROJECTED_PIXEL_SIZE_MULTIPLIER, 'Should calculate correct getSize');
        t.deepEqual(
          getPixelOffset,
          expectedPixelOffset0,
          'Should calculate correct instancePixelOffset'
        );
        t.deepEqual(
          getPixelOffset1,
          expectedPixelOffset1,
          'Should calculate correct instancePixelOffset'
        );
        t.deepEqual(
          getFilterValue(layerData.data[0]),
          [Number.MIN_SAFE_INTEGER, 0, 0, 0],
          'Should calculate correct instancePixelOffset'
        );
      }
    }
  ];

  testRenderLayerCases(t, IconLayer, TEST_CASES);
  t.end();
});

test('#IconLayer -> svg icons as constructor props -> renderIconModal', t => {
  // initialize iconLayer
  const iconLayer = new IconLayer({dataId: '', svgIcons: mockSvgIcons});
  t.deepEqual(iconLayer.iconGeometry, iconLayer.iconGeometry, 'should create correct iconGeometry');

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mount(
      <IntlWrapper>
        <iconLayer.layerInfoModal.template />
      </IntlWrapper>
    );
  }, 'mount layer info modal with icons should not fail');

  t.equal(wrapper.find('.icon-table__item').length, 2, 'should render 1 icon');
  t.equal(
    wrapper.find('.icon-table_item__name').at(0).find('code').text(),
    'alert',
    'should render alert icon'
  );

  t.end();
});

test('#IconLayer -> clicked icons stay highlighted after the pointer leaves', t => {
  const datasets = {[dataId]: preparedDataset};
  const layer = testCreateLayerFromConfig(t, {
    layer: {id: 'selected-icon', type: 'icon', config: {dataId, columns}},
    datasets,
    afterLayerInitialized: iconLayer => {
      iconLayer.iconGeometry = iconGeometry;
    }
  });
  const data = layer.formatLayerData(datasets);
  let state = {...INITIAL_VIS_STATE, datasets};
  const render = () =>
    renderDeckGlLayer(
      {
        ...state,
        layer,
        data,
        layerIndex: 0,
        mapState: INITIAL_MAP_STATE
      },
      {}
    );
  const [rendered] = render();
  const object = data.data[0];
  t.ok(object, 'the fixture has a rendered icon');
  const pick = {picked: true, layer: rendered, object, index: 0};

  state = layerClickUpdater(state, {info: pick});
  state = layerHoverUpdater(state, {info: {picked: false, object: null}});
  let overlay = render().find(deckLayer => deckLayer.id.endsWith('-hover'));
  t.ok(overlay, 'click selection creates an overlay after hover ends');
  if (overlay) {
    t.deepEqual(overlay.props.data, [object], 'overlay contains the clicked icon');
    t.deepEqual(
      overlay.props.getFillColor,
      layer.config.highlightColor,
      'overlay uses the selection color'
    );
    t.equal(overlay.props.pickable, false, 'selection overlay does not intercept picks');
  }

  // Loading custom geometry recreates deck layers while a click still holds the previous pick.
  layer.iconGeometryVersion++;
  const afterGeometry = render();
  t.notEqual(afterGeometry[0].id, rendered.id, 'geometry changes still recreate the icon layer');
  overlay = afterGeometry.find(deckLayer => deckLayer.id.endsWith('-hover'));
  t.ok(overlay, 'selection survives an icon geometry refresh');

  state = mapClickUpdater(state, {});
  t.notOk(
    render().some(deckLayer => deckLayer.id.endsWith('-hover')),
    'map click clears selection'
  );
  state = layerHoverUpdater(state, {info: {...pick, layer: afterGeometry[0]}});
  t.ok(
    render().some(deckLayer => deckLayer.id.endsWith('-hover')),
    'ordinary hovering still highlights'
  );

  t.ok(
    layer.isLayerHovered({...pick, layer: {props: {id: layer.id}}}),
    'unversioned layer picks remain supported'
  );
  for (const id of ['selected-icon-other_0', 'selected-icon_0_0', `${afterGeometry[0].id}-hover`]) {
    t.notOk(
      layer.hasHoveredObject({...pick, layer: {props: {id}}}),
      `${id} does not select this layer`
    );
  }
  t.notOk(layer.hasHoveredObject({...pick, picked: false}), 'unpicked icons do not highlight');
  t.end();
});

test('#IconLayer -> raw angle values and invalid values', t => {
  const layer = new IconLayer({dataId});
  const values = [0, 90, -90, 450, null, undefined, NaN, Infinity, -Infinity, '90', false];
  const rows = createDataContainer(values.map(value => [value]));
  t.equal(
    iconAngleAccessor(layer.config.columns)(rows),
    0,
    'legacy maps have constant zero rotation'
  );
  t.equal(layer.config.columns.angle.optional, true, 'the angle column is optional');
  layer.updateLayerConfig({
    columns: {...layer.config.columns, angle: {value: 'angle', fieldIdx: 0}}
  });
  const accessor = iconAngleAccessor(layer.config.columns)(rows);
  t.deepEqual(
    values.map((_, index) => accessor({index})),
    [0, 90, -90, 90, 0, 0, 0, 0, 0, 0, 0],
    'angles are degrees without domain scaling and invalid values stay unrotated'
  );

  const floats = arrow
    .vectorFromArray([0, 90], new arrow.Float64())
    .concat(arrow.vectorFromArray([-90, null, NaN, Infinity], new arrow.Float64()));
  const arrowRows = createDataContainer([floats], {inputDataFormat: DataForm.COLS_ARRAY});
  const arrowAccessor = iconAngleAccessor(layer.config.columns)(arrowRows);
  t.deepEqual(
    [0, 1, 2, 3, 4, 5].map(index => arrowAccessor({index})),
    [0, 90, -90, 0, 0, 0],
    'Arrow values, including later record batches and nulls, retain row alignment'
  );
  const large = BigInt('9007199254740993');
  const integers = createDataContainer(
    [arrow.vectorFromArray([BigInt(-90), large, null], new arrow.Int64())],
    {inputDataFormat: DataForm.COLS_ARRAY}
  );
  const integerAccessor = iconAngleAccessor(layer.config.columns)(integers);
  t.deepEqual(
    [0, 1, 2].map(index => integerAccessor({index})),
    [-90, Number(large % BigInt(360)), 0],
    'Arrow int64 angles are reduced before lossy conversion to number'
  );
  t.end();
});

test('#IconLayer -> angle persistence and field changes', t => {
  const datasets = {[dataId]: preparedDataset};
  const layer = testCreateLayerFromConfig(t, {
    layer: {
      id: 'angled-icon',
      type: 'icon',
      config: {dataId, columns: {...columns, angle: 'trip_distance'}}
    },
    datasets
  });
  const data = layer.formatLayerData(datasets);
  t.equal(data.getAngle(data.data[0]), testRows[0][9], 'the chosen column is used directly');
  const saved = visStateSchemaV1.save({
    ...INITIAL_VIS_STATE,
    layers: [layer],
    layerOrder: [layer.id]
  });
  const savedLayer = saved.visState.layers[0];
  t.equal(savedLayer.config.columns.angle, 'trip_distance', 'the selected column is saved by name');
  const restored = testCreateLayerFromConfig(t, {layer: savedLayer, datasets});
  t.equal(
    restored.formatLayerData(datasets).getAngle(data.data[0]),
    testRows[0][9],
    'saved angles restore'
  );

  layer.updateLayerConfig({columns: layer.assignColumn('angle', preparedDataset.fields[7])});
  let next = layer.formatLayerData(datasets, data);
  t.equal(next.getAngle(next.data[0]), testRows[0][7], 'switching angle columns takes effect');
  layer.updateLayerConfig({columns: layer.assignColumn('angle', null)});
  next = layer.formatLayerData(datasets, next);
  t.equal(next.getAngle, 0, 'clearing the column restores zero rotation');

  // A data revision must invalidate the per-instance angle buffer even if the field stays selected.
  layer.updateLayerConfig({columns: layer.assignColumn('angle', preparedDataset.fields[9])});
  const updatedRows = testRows.map(row => row.slice());
  updatedRows[0][9] = -45;
  const updatedDataset = copyTableAndUpdate(preparedDataset, {
    dataContainer: createDataContainer(updatedRows),
    dataRevision: preparedDataset.dataRevision + 1
  });
  next = layer.formatLayerData({[dataId]: updatedDataset}, data);
  t.notEqual(next.data, data.data, 'data changes rebuild the instance rows');
  t.equal(next.getAngle(next.data[0]), -45, 'updated data uses the new angle');
  t.end();
});

test('#IconLayer -> GPU angle attributes, centered geometry and highlighted icons', t => {
  const datasets = {[dataId]: preparedDataset};
  const layer = testCreateLayerFromConfig(t, {
    layer: {
      id: 'rotated-icon',
      type: 'icon',
      config: {dataId, columns: {...columns, angle: 'trip_distance'}}
    },
    datasets
  });
  // Deliberately off-center triangle: rotating around the origin would move its center.
  const geometry = [1, 2, 0, 3, 2, 0, 1, 4, 0];
  layer.iconGeometry = Object.fromEntries(
    testRows.filter(row => row[10]).map(row => [row[10], geometry])
  );
  const data = layer.formatLayerData(datasets);
  const viewport = new MapView().makeViewport({
    width: 800,
    height: 600,
    viewState: {...INITIAL_MAP_STATE, bearing: 45, pitch: 30}
  });
  const manager = new LayerManager(device, {viewport});
  const render = objectHovered =>
    layer.renderLayer({
      data,
      idx: 0,
      layerInteraction: {},
      mapState: {...INITIAL_MAP_STATE, bearing: 45, pitch: 30},
      gpuFilter: preparedDataset.gpuFilter,
      interactionConfig: INITIAL_VIS_STATE.interactionConfig,
      visible: true,
      layerCallbacks: {},
      objectHovered
    });
  try {
    for (const billboard of [false, true]) {
      layer.updateLayerVisConfig({billboard, fixedRadius: billboard});
      const [base] = render();
      const pick = {picked: true, layer: base, object: data.data[0], index: 0};
      const deckLayers = render(pick);
      t.equal(
        deckLayers[1].props.getAngle(data.data[0]),
        data.getAngle(data.data[0]),
        'hover/click overlay uses the same angle accessor'
      );
      const initialized = testRenderDeckLayer(t, 'rotated icon', deckLayers, {
        layerManager: manager
      });
      const meshes = initialized.filter(
        deckLayer => deckLayer.constructor.layerName === 'ScatterplotIconLayer'
      );
      t.ok(meshes.length, 'real icon sublayers are initialized');
      for (const mesh of meshes) {
        t.deepEqual(
          Array.from(
            mesh
              .getAttributeManager()
              .getAttributes()
              .instanceAngles.value.slice(0, mesh.props.data.length)
          ),
          Array.from(new Float32Array(mesh.props.data.map(data.getAngle))),
          'each icon group and highlight uploads its row angles to the GPU attribute'
        );
        t.deepEqual(
          mesh.state.model.shaderInputs.getUniformValues().globeMode.iconCenter,
          [2, 3],
          'asymmetric mesh rotation uses its bounding-box center'
        );
        t.equal(mesh.props.billboard, billboard, 'rotation retains the selected projection mode');
      }
      // Reuse the same grouped rows to check deck.gl accessor invalidation, independently of data changes.
      const changed = deckLayers[0].clone({
        getAngle: () => -90,
        updateTriggers: {...deckLayers[0].props.updateTriggers, getAngle: 'replacement'}
      });
      const refreshed = testRenderDeckLayer(t, 'updated icon', [changed], {layerManager: manager});
      for (const mesh of refreshed.filter(
        deckLayer => deckLayer.constructor.layerName === 'ScatterplotIconLayer'
      )) {
        t.equal(
          mesh.getAttributeManager().getAttributes().instanceAngles.value[0],
          -90,
          'angle trigger refreshes unchanged grouped rows'
        );
      }
    }
  } finally {
    manager.finalize();
  }
  t.end();
});

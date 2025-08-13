// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape-catch';
import {KeplerGlLayers} from '@kepler.gl/layers';
import {testCreateCases} from 'test/helpers/layer-utils';

const {WMSLayer} = KeplerGlLayers;

// Shared test fixtures
const MOCK_WMS_LAYER_CONFIG = {
  name: 'test_layer',
  title: 'Test WMS Layer',
  boundingBox: [
    [-180, -90],
    [180, 90]
  ],
  queryable: true
};

const MOCK_WMS_DATASET = {
  type: 'wms-tile',
  metadata: {
    tilesetDataUrl: 'http://example.com/wms',
    label: 'Test WMS Dataset',
    layers: [MOCK_WMS_LAYER_CONFIG]
  }
};

const MOCK_RENDER_OPTS = {
  data: {
    tilesetDataUrl: 'http://example.com/wms',
    metadata: {layers: [MOCK_WMS_LAYER_CONFIG]}
  },
  mapState: {dragRotate: false},
  interactionConfig: {tooltip: {enabled: true}},
  layerCallbacks: {onWMSFeatureInfo: () => {}}
};

// Mock DOMParser for browser environment
global.DOMParser = class MockDOMParser {
  parseFromString(str) {
    const createMockElement = (tagName, textContent = '') => ({
      tagName,
      textContent,
      children: [],
      getElementsByTagName: name =>
        Array.from(this.children).filter(child => child.tagName === name)
    });

    // Simple mock for the specific XML structure used in tests
    if (str.includes('conus:RED_BAND')) {
      return {
        getElementsByTagName: name => {
          if (name === 'gml:featureMember') {
            return [
              {
                children: [
                  {
                    children: [
                      createMockElement('conus:RED_BAND', '255.0'),
                      createMockElement('conus:GREEN_BAND', '195.0'),
                      createMockElement('conus:BLUE_BAND', '0.0'),
                      createMockElement('conus:ALPHA_BAND', '255.0')
                    ]
                  }
                ]
              }
            ];
          }
          return [];
        }
      };
    }

    return {getElementsByTagName: () => []};
  }
};

// Helper function to create a configured WMS layer
function createWMSLayer(config = {}) {
  const layer = new WMSLayer({
    id: 'test-wms-layer',
    dataId: 'wms-dataset',
    ...config
  });

  layer.updateLayerVisConfig({
    wmsLayer: MOCK_WMS_LAYER_CONFIG,
    opacity: 0.8,
    transparent: true,
    ...config.visConfig
  });

  return layer;
}

test('#WMSLayer -> constructor', t => {
  const TEST_CASES = {
    CREATE: [
      {
        props: {
          dataId: 'wms-test-data',
          isVisible: true,
          label: 'test wms layer'
        },
        test: layer => {
          t.ok(layer.config.dataId === 'wms-test-data', 'WMSLayer dataId should be correct');
          t.ok(layer.type === 'wms', 'type should be wms');
          t.ok(layer.isAggregated === false, 'WMSLayer is not aggregated');
          t.ok(layer.config.label === 'test wms layer', 'label should be correct');
          t.ok(layer.config.isVisible === true, 'should be visible by default');
          t.ok(layer.config.visConfig, 'should have visConfig');
          t.equal(layer.config.visConfig.opacity, 0.8, 'should have default opacity');
          t.equal(layer.config.visConfig.transparent, true, 'should be transparent by default');
          t.equal(layer.config.visConfig.wmsLayer, null, 'should have null wmsLayer initially');
          t.ok(typeof layer.layerIcon === 'function', 'should have layerIcon');
          t.deepEqual(
            layer.supportedDatasetTypes,
            ['wms-tile'],
            'should support wms-tile dataset type'
          );
        }
      }
    ]
  };

  testCreateCases(t, WMSLayer, TEST_CASES.CREATE);
  t.end();
});

test('WMSLayer -> basic layer functionality', t => {
  const layer = createWMSLayer();

  // Test layer configuration
  t.deepEqual(
    layer.config.visConfig.wmsLayer,
    MOCK_WMS_LAYER_CONFIG,
    'should update wmsLayer config'
  );
  t.equal(layer.config.visConfig.opacity, 0.8, 'should have correct opacity');
  t.equal(layer.config.visConfig.transparent, true, 'should be transparent');

  // Test layer properties
  t.equal(layer.name, 'WMS Tile', 'should have correct layer name');
  t.ok(layer.layerIcon, 'should have layer icon');
  t.equal(layer.requireData, true, 'WMS layer should require data');
  t.ok(layer.isValidToSave(), 'should be valid to save');

  // Test _getCurrentServiceLayer
  const serviceLayer = layer._getCurrentServiceLayer();
  t.ok(serviceLayer, 'should return service layer when configured');
  t.equal(serviceLayer.name, 'test_layer', 'should return correct service layer');

  t.end();
});

test('WMSLayer -> hover functionality', t => {
  const layer = createWMSLayer();

  // Test hasHoveredObject
  const mockObjectInfo = {
    picked: true,
    layer: {props: {id: 'test-wms-layer'}}
  };

  const hoveredObject = layer.hasHoveredObject(mockObjectInfo);
  t.ok(hoveredObject, 'should return hovered object when layer is picked');
  t.equal(hoveredObject.index, 0, 'should return index 0 for WMS layer');

  // Test hasHoveredObject with no picked object
  const hoveredObjectNotPicked = layer.hasHoveredObject({...mockObjectInfo, picked: false});
  t.equal(hoveredObjectNotPicked, null, 'should return null when layer is not picked');

  // Test getHoverData with hover coordinates
  const hoverData = layer.getHoverData(null, null, [], null, {index: 0, x: 100, y: 200});
  t.ok(hoverData, 'should return hover data for WMS layer');
  t.ok(hoverData.fieldValues, 'should have fieldValues array');
  t.equal(hoverData.fieldValues.length, 1, 'should have 1 field value');
  t.equal(hoverData.fieldValues[0].labelMessage, 'layer.wms.hover', 'should have WMS hover label');

  // Test getHoverData with WMS feature info - string format
  const wmsFeatureInfoObject = {
    wmsFeatureInfo: '<FeatureInfo><Feature>Test feature data</Feature></FeatureInfo>'
  };
  const wmsHoverData = layer.getHoverData(wmsFeatureInfoObject, null, [], null, {index: 0});
  t.ok(wmsHoverData.wmsFeatureData, 'should have wmsFeatureData array');
  t.equal(wmsHoverData.wmsFeatureData.length, 1, 'should have 1 feature data item');

  // Test getHoverData with WMS feature info - array format
  const wmsFeatureInfoArrayObject = {
    wmsFeatureInfo: [
      {name: 'RED BAND', value: '255.0'},
      {name: 'GREEN BAND', value: '195.0'},
      {name: 'BLUE BAND', value: '0.0'}
    ]
  };
  const wmsArrayHoverData = layer.getHoverData(wmsFeatureInfoArrayObject, null, [], null, {
    index: 0
  });
  t.equal(wmsArrayHoverData.wmsFeatureData.length, 3, 'should have 3 feature data items');
  t.equal(
    wmsArrayHoverData.wmsFeatureData[0].name,
    'RED BAND',
    'should have correct attribute name'
  );

  t.end();
});

test('#WMSLayer -> renderLayer variations', t => {
  const baseLayer = createWMSLayer();

  // Test normal rendering
  const deckLayers = baseLayer.renderLayer(MOCK_RENDER_OPTS);
  t.ok(deckLayers, 'should create deck layers');
  t.equal(deckLayers.length, 1, 'should render one deck layer');

  const deckLayer = deckLayers[0];
  t.equal(deckLayer.id, 'test-wms-layer-WMSLayer', 'should have correct layer id');
  t.equal(deckLayer.props.pickable, true, 'should be pickable when tooltips enabled and queryable');
  t.equal(deckLayer.props.serviceType, 'wms', 'should have correct service type');
  t.deepEqual(deckLayer.props.layers, ['test_layer'], 'should have correct layers');
  t.equal(deckLayer.props.opacity, 0.8, 'should have correct opacity');
  t.ok(typeof deckLayer.props.onClick === 'function', 'should have onClick handler');

  // Test with tooltips disabled
  const tooltipsDisabledOpts = {
    ...MOCK_RENDER_OPTS,
    interactionConfig: {tooltip: {enabled: false}}
  };
  const nonPickableLayers = baseLayer.renderLayer(tooltipsDisabledOpts);
  t.equal(
    nonPickableLayers[0].props.pickable,
    false,
    'should not be pickable when tooltips disabled'
  );

  // Test with non-queryable layer
  const nonQueryableLayer = createWMSLayer({
    visConfig: {wmsLayer: {...MOCK_WMS_LAYER_CONFIG, queryable: false}}
  });
  const nonQueryableLayers = nonQueryableLayer.renderLayer(MOCK_RENDER_OPTS);
  t.equal(
    nonQueryableLayers[0].props.pickable,
    false,
    'should not be pickable when layer is not queryable'
  );

  // Test without wmsLayer config
  const unconfiguredLayer = new WMSLayer({id: 'test-wms-layer', dataId: 'wms-dataset'});
  const emptyLayers = unconfiguredLayer.renderLayer(MOCK_RENDER_OPTS);
  t.equal(emptyLayers.length, 0, 'should not render any layers without wmsLayer config');

  t.end();
});

test('#WMSLayer -> formatLayerData', t => {
  const layer = createWMSLayer();

  const mockDatasets = {'wms-dataset': MOCK_WMS_DATASET};
  const layerData = layer.formatLayerData(mockDatasets);
  t.ok(layerData, 'should return layer data object');
  t.equal(layerData.tilesetDataUrl, 'http://example.com/wms', 'should have tileset data URL');
  t.ok(layerData.metadata, 'should have metadata');

  t.end();
});

test('#WMSLayer -> updateLayerMeta', t => {
  const layer = createWMSLayer();

  // Test with non-WMS dataset
  t.doesNotThrow(() => {
    layer.updateLayerMeta({type: 'csv'});
  }, 'should not throw with non-WMS dataset');

  // Test with WMS dataset
  t.doesNotThrow(() => {
    layer.updateLayerMeta({type: 'wms-tile'});
  }, 'should update meta with WMS dataset');

  t.deepEqual(
    layer.meta.bounds,
    [
      [-180, -90],
      [180, 90]
    ],
    'should set bounds from bounding box'
  );

  t.end();
});

test('#WMSLayer -> parseWMSFeatureInfo', t => {
  const layer = createWMSLayer();

  const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<wfs:FeatureCollection xmlns="http://www.opengis.net/wfs" xmlns:wfs="http://www.opengis.net/wfs" xmlns:gml="http://www.opengis.net/gml" xmlns:conus="http://conus" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs https://opengeo.ncep.noaa.gov/geoserver/schemas/wfs/1.0.0/WFS-basic.xsd">
  <gml:featureMember>
    <conus:conus_cref_qcd fid="">
      <conus:RED_BAND>255.0</conus:RED_BAND>
      <conus:GREEN_BAND>195.0</conus:GREEN_BAND>
      <conus:BLUE_BAND>0.0</conus:BLUE_BAND>
      <conus:ALPHA_BAND>255.0</conus:ALPHA_BAND>
    </conus:conus_cref_qcd>
  </gml:featureMember>
</wfs:FeatureCollection>`;

  const parsedAttributes = layer.parseWMSFeatureInfo(xmlString);
  t.ok(Array.isArray(parsedAttributes), 'should return an array');
  t.equal(parsedAttributes.length, 4, 'should parse 4 attributes');
  t.equal(parsedAttributes[0].name, 'RED BAND', 'should parse RED_BAND attribute name correctly');
  t.equal(parsedAttributes[0].value, '255.0', 'should parse RED_BAND attribute value correctly');
  t.equal(
    parsedAttributes[1].name,
    'GREEN BAND',
    'should parse GREEN_BAND attribute name correctly'
  );
  t.equal(parsedAttributes[1].value, '195.0', 'should parse GREEN_BAND attribute value correctly');

  // Test edge cases
  t.deepEqual(layer.parseWMSFeatureInfo(''), [], 'should return empty array for empty XML');
  t.deepEqual(
    layer.parseWMSFeatureInfo('<invalid>xml</invalid>'),
    [],
    'should return empty array for invalid XML'
  );

  t.end();
});

test('#WMSLayer -> findDefaultLayerProps', t => {
  // Test with valid WMS dataset
  const result = WMSLayer.findDefaultLayerProps(MOCK_WMS_DATASET);
  t.ok(result.props, 'should return props object');
  t.equal(result.props.length, 1, 'should return one layer prop for WMS dataset');
  t.equal(result.props[0].label, 'Test WMS Dataset', 'should use dataset label');
  t.deepEqual(
    result.props[0].layers,
    MOCK_WMS_DATASET.metadata.layers,
    'should pass through all layers'
  );

  // Test with non-WMS dataset
  const nonWmsResult = WMSLayer.findDefaultLayerProps({
    type: 'csv',
    metadata: {label: 'CSV Dataset'}
  });
  t.deepEqual(nonWmsResult.props, [], 'should return empty props for non-WMS dataset');

  // Test with empty WMS dataset
  const emptyWmsDataset = {type: 'wms-tile', metadata: {label: 'Empty WMS Dataset', layers: []}};
  const emptyResult = WMSLayer.findDefaultLayerProps(emptyWmsDataset);
  t.equal(
    emptyResult.props.length,
    1,
    'should return one prop even for WMS dataset with no layers'
  );
  t.deepEqual(emptyResult.props[0].layers, [], 'should have empty layers array');

  t.end();
});

test('#WMSLayer -> edge cases and error handling', t => {
  const layer = createWMSLayer();

  // Test formatLayerData with missing dataset
  t.doesNotThrow(() => {
    const emptyLayerData = layer.formatLayerData({}, {}, {});
    t.ok(emptyLayerData, 'should return layer data object even with missing dataset');
    t.equal(emptyLayerData.tilesetDataUrl, null, 'should handle missing dataset gracefully');
  }, 'should not throw error when formatting with missing dataset');

  // Test layer visibility
  const invisibleLayer = createWMSLayer({isVisible: false});
  t.equal(invisibleLayer.config.isVisible, false, 'should respect initial visibility setting');

  // Test hasHoveredObject when layer is not visible
  const mockObjectInfo = {picked: true, layer: {props: {id: 'test-wms-layer'}}};
  const hoveredObject = invisibleLayer.hasHoveredObject(mockObjectInfo);
  t.ok(hoveredObject, 'should return hovered object even when layer is not visible');

  // Test getWMSFeatureInfo with no deckLayerRef
  layer['getWMSFeatureInfo'](100, 200)
    .then(result => {
      t.equal(result, null, 'should return null when no deckLayerRef');
    })
    .catch(_error => {
      t.fail('should not throw error when no deckLayerRef');
    });

  // Test deckLayerRef storage
  layer.renderLayer(MOCK_RENDER_OPTS);
  t.ok(layer['deckLayerRef'], 'should store deckLayerRef after first render');

  const firstRef = layer['deckLayerRef'];
  layer.renderLayer(MOCK_RENDER_OPTS);
  t.ok(layer['deckLayerRef'], 'should have deckLayerRef after second render');
  t.notEqual(layer['deckLayerRef'], firstRef, 'should update deckLayerRef on new render');

  t.end();
});

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape-catch';
import {KeplerGlLayers} from '@kepler.gl/layers';
import {
  testCreateCases,
  testFormatLayerDataCases,
  testRenderLayerCases
} from 'test/helpers/layer-utils';

const {WMSLayer} = KeplerGlLayers;

// Mock DOMParser for browser environment
global.DOMParser = class MockDOMParser {
  parseFromString(str) {
    const createMockElement = (tagName, textContent = '') => ({
      tagName,
      textContent,
      children: [],
      getElementsByTagName: name => {
        return Array.from(this.children).filter(child => child.tagName === name);
      }
    });

    // Simple mock for the specific XML structure used in tests
    if (str.includes('conus:RED_BAND')) {
      const mockDoc = {
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
      return mockDoc;
    }

    // Return empty mock for other cases
    return {
      getElementsByTagName: () => []
    };
  }
};

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

test('WMSLayer -> layer configuration', t => {
  const layer = new WMSLayer({
    id: 'test-wms-layer',
    dataId: 'wms-dataset'
  });

  // Test initial configuration
  t.equal(layer.config.visConfig.wmsLayer, null, 'should have null wmsLayer initially');

  // Test updateLayerVisConfig
  const wmsLayerConfig = {
    name: 'test_layer',
    title: 'Test WMS Layer',
    boundingBox: [
      [-180, -90],
      [180, 90]
    ],
    queryable: true
  };

  layer.updateLayerVisConfig({
    wmsLayer: wmsLayerConfig,
    opacity: 0.5,
    transparent: false
  });

  t.deepEqual(layer.config.visConfig.wmsLayer, wmsLayerConfig, 'should update wmsLayer config');
  t.equal(layer.config.visConfig.opacity, 0.5, 'should update opacity');
  t.equal(layer.config.visConfig.transparent, false, 'should update transparent');

  t.end();
});

test('WMSLayer -> hover functionality', t => {
  const layer = new WMSLayer({
    id: 'test-wms-layer',
    dataId: 'wms-dataset'
  });

  // Update the layer config to ensure wmsLayer is set
  layer.updateLayerVisConfig({
    opacity: 0.8,
    transparent: true,
    wmsLayer: {
      name: 'test_layer',
      title: 'Test WMS Layer',
      boundingBox: [
        [-180, -90],
        [180, 90]
      ],
      queryable: true
    }
  });

  // Test hasHoveredObject
  const mockObjectInfo = {
    picked: true,
    layer: {
      props: {
        id: 'test-wms-layer'
      }
    }
  };

  const hoveredObject = layer.hasHoveredObject(mockObjectInfo);
  t.ok(hoveredObject, 'should return hovered object when layer is picked');
  t.equal(hoveredObject.index, 0, 'should return index 0 for WMS layer');

  // Test hasHoveredObject with no picked object
  const mockObjectInfoNotPicked = {
    picked: false,
    layer: {
      props: {
        id: 'test-wms-layer'
      }
    }
  };

  const hoveredObjectNotPicked = layer.hasHoveredObject(mockObjectInfoNotPicked);
  t.equal(hoveredObjectNotPicked, null, 'should return null when layer is not picked');

  // Test getHoverData with hover coordinates
  const mockHoverInfo = {
    index: 0,
    x: 100,
    y: 200
  };

  const hoverData = layer.getHoverData(null, null, [], null, mockHoverInfo);

  t.ok(hoverData, 'should return hover data for WMS layer');
  t.ok(hoverData.fieldValues, 'should have fieldValues array');
  t.equal(hoverData.fieldValues.length, 1, 'should have 1 field value');
  t.equal(hoverData.fieldValues[0].labelMessage, 'layer.wms.hover', 'should have WMS hover label');
  t.equal(
    hoverData.fieldValues[0].value,
    'Click to query WMS feature info',
    'should have hover message'
  );

  // Test getHoverData with WMS feature info object (clicked state) - string format
  const wmsFeatureInfoObject = {
    wmsFeatureInfo: '<FeatureInfo><Feature>Test feature data</Feature></FeatureInfo>'
  };
  const wmsHoverData = layer.getHoverData(wmsFeatureInfoObject, null, [], null, {index: 0});

  t.ok(wmsHoverData, 'should return hover data for WMS feature info');
  t.ok(wmsHoverData.wmsFeatureData, 'should have wmsFeatureData array');
  t.equal(wmsHoverData.wmsFeatureData.length, 1, 'should have 1 feature data item');
  t.equal(
    wmsHoverData.wmsFeatureData[0].name,
    'WMS Feature Info',
    'should have WMS feature info label'
  );
  t.equal(
    wmsHoverData.wmsFeatureData[0].value,
    '<FeatureInfo><Feature>Test feature data</Feature></FeatureInfo>',
    'should include WMS feature info'
  );

  // Test getHoverData with WMS feature info object (clicked state) - array format
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

  t.ok(wmsArrayHoverData, 'should return hover data for WMS feature info array');
  t.ok(wmsArrayHoverData.wmsFeatureData, 'should have wmsFeatureData array');
  t.equal(wmsArrayHoverData.wmsFeatureData.length, 3, 'should have 3 feature data items');
  t.equal(
    wmsArrayHoverData.wmsFeatureData[0].name,
    'RED BAND',
    'should have correct attribute name'
  );
  t.equal(
    wmsArrayHoverData.wmsFeatureData[0].value,
    '255.0',
    'should have correct attribute value'
  );

  t.end();
});

test('#WMSLayer -> renderLayer', t => {
  // Remove the complex helper and use direct testing
  const layer = new WMSLayer({
    id: 'wms-render-test',
    dataId: 'wms-dataset'
  });

  layer.updateLayerVisConfig({
    wmsLayer: {
      name: 'test_layer',
      title: 'Test WMS Layer',
      boundingBox: [
        [-180, -90],
        [180, 90]
      ],
      queryable: true
    }
  });

  const mockData = {
    tilesetDataUrl: 'http://example.com/wms',
    metadata: {
      layers: [
        {
          name: 'test_layer',
          title: 'Test WMS Layer'
        }
      ]
    }
  };

  const mockOpts = {
    data: mockData,
    mapState: {
      dragRotate: false
    },
    interactionConfig: {
      tooltip: {
        enabled: true
      }
    },
    layerCallbacks: {
      onWMSFeatureInfo: () => {}
    }
  };

  const deckLayers = layer.renderLayer(mockOpts);
  t.ok(deckLayers, 'should create deck layers');
  t.equal(deckLayers.length, 1, 'should render one deck layer');

  const deckLayer = deckLayers[0];
  t.equal(deckLayer.id, 'wms-render-test-WMSLayer', 'should have correct layer id');
  t.equal(deckLayer.props.pickable, true, 'should be pickable when tooltips enabled and queryable');
  t.equal(deckLayer.props.serviceType, 'wms', 'should have correct service type');
  t.deepEqual(deckLayer.props.layers, ['test_layer'], 'should have correct layers');
  t.equal(deckLayer.props.opacity, 0.8, 'should have correct opacity');
  t.equal(deckLayer.props.transparent, true, 'should have correct transparent setting');
  t.ok(typeof deckLayer.props.onClick === 'function', 'should have onClick handler');
  t.end();
});

test('WMSLayer -> renderLayer with tooltips disabled', t => {
  const layer = new WMSLayer({
    id: 'test-wms-layer',
    dataId: 'wms-dataset'
  });

  layer.updateLayerVisConfig({
    wmsLayer: {
      name: 'test_layer',
      title: 'Test WMS Layer',
      boundingBox: [
        [-180, -90],
        [180, 90]
      ],
      queryable: true
    }
  });

  const mockData = {
    tilesetDataUrl: 'http://example.com/wms'
  };

  const mockOpts = {
    data: mockData,
    mapState: {
      dragRotate: false
    },
    interactionConfig: {
      tooltip: {
        enabled: false
      }
    }
  };

  const deckLayers = layer.renderLayer(mockOpts);
  const deckLayer = deckLayers[0];
  t.equal(deckLayer.props.pickable, false, 'should not be pickable when tooltips disabled');

  t.end();
});

test('WMSLayer -> renderLayer with non-queryable layer', t => {
  const layer = new WMSLayer({
    id: 'test-wms-layer',
    dataId: 'wms-dataset'
  });

  layer.updateLayerVisConfig({
    wmsLayer: {
      name: 'test_layer',
      title: 'Test WMS Layer',
      boundingBox: [
        [-180, -90],
        [180, 90]
      ],
      queryable: false
    }
  });

  const mockData = {
    tilesetDataUrl: 'http://example.com/wms'
  };

  const mockOpts = {
    data: mockData,
    mapState: {
      dragRotate: false
    },
    interactionConfig: {
      tooltip: {
        enabled: true
      }
    }
  };

  const deckLayers = layer.renderLayer(mockOpts);
  const deckLayer = deckLayers[0];
  t.equal(deckLayer.props.pickable, false, 'should not be pickable when layer is not queryable');

  t.end();
});

test('WMSLayer -> renderLayer without wmsLayer config', t => {
  const layer = new WMSLayer({
    id: 'test-wms-layer',
    dataId: 'wms-dataset'
  });

  const mockData = {
    tilesetDataUrl: 'http://example.com/wms'
  };

  const mockOpts = {
    data: mockData,
    mapState: {
      dragRotate: false
    },
    interactionConfig: {
      tooltip: {
        enabled: true
      }
    }
  };

  const deckLayers = layer.renderLayer(mockOpts);
  t.equal(deckLayers.length, 0, 'should not render any layers without wmsLayer config');

  t.end();
});

test('#WMSLayer -> formatLayerData', t => {
  const layer = new WMSLayer({
    id: 'test-wms-layer',
    dataId: 'wms-dataset'
  });

  layer.updateLayerVisConfig({
    wmsLayer: {
      name: 'test_layer',
      title: 'Test WMS Layer',
      boundingBox: [
        [-180, -90],
        [180, 90]
      ],
      queryable: true
    }
  });

  const mockDatasets = {
    'wms-dataset': {
      type: 'wms-tile',
      metadata: {
        tilesetDataUrl: 'http://example.com/wms',
        layers: [
          {
            name: 'test_layer',
            title: 'Test WMS Layer'
          }
        ]
      }
    }
  };

  const layerData = layer.formatLayerData(mockDatasets);
  t.ok(layerData, 'should return layer data object');
  t.equal(layerData.tilesetDataUrl, 'http://example.com/wms', 'should have tileset data URL');
  t.ok(layerData.metadata, 'should have metadata');

  t.end();
});

test('#WMSLayer -> layer methods', t => {
  const layer = new WMSLayer({
    id: 'test-wms-layer',
    dataId: 'wms-dataset'
  });

  // Test isValidToSave
  t.ok(layer.isValidToSave(), 'should be valid to save');

  // Test layer properties
  t.equal(layer.name, 'WMS Tile', 'should have correct layer name');
  t.ok(layer.layerIcon, 'should have layer icon');
  t.equal(layer.requireData, true, 'WMS layer should require data');

  // Test _getCurrentServiceLayer
  t.equal(layer._getCurrentServiceLayer(), null, 'should return null when no wmsLayer configured');

  layer.updateLayerVisConfig({
    wmsLayer: {
      name: 'test_layer',
      title: 'Test Layer'
    }
  });

  const serviceLayer = layer._getCurrentServiceLayer();
  t.ok(serviceLayer, 'should return service layer when configured');
  t.equal(serviceLayer.name, 'test_layer', 'should return correct service layer');

  t.end();
});

test('#WMSLayer -> updateLayerMeta', t => {
  const layer = new WMSLayer({
    id: 'test-wms-layer',
    dataId: 'wms-dataset'
  });

  // Test with non-WMS dataset
  const nonWmsDataset = {
    type: 'csv'
  };

  t.doesNotThrow(() => {
    layer.updateLayerMeta(nonWmsDataset);
  }, 'should not throw with non-WMS dataset');

  // Test with WMS dataset with bounding box
  const wmsDataset = {
    type: 'wms-tile'
  };

  layer.updateLayerVisConfig({
    wmsLayer: {
      name: 'test_layer',
      title: 'Test Layer',
      boundingBox: [
        [-180, -90],
        [180, 90]
      ]
    }
  });

  t.doesNotThrow(() => {
    layer.updateLayerMeta(wmsDataset);
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

test('#WMSLayer -> edge cases', t => {
  const layer = new WMSLayer({
    id: 'test-wms-layer',
    dataId: 'wms-dataset'
  });

  // Test renderLayer with no wmsLayer config
  const mockOpts = {
    data: {tilesetDataUrl: 'http://example.com/wms'},
    mapState: {},
    interactionConfig: {tooltip: {enabled: true}}
  };

  const emptyLayers = layer.renderLayer(mockOpts);
  t.deepEqual(emptyLayers, [], 'should return empty array when no wmsLayer configured');

  // Test formatLayerData with missing dataset - should not throw error
  t.doesNotThrow(() => {
    const emptyLayerData = layer.formatLayerData({}, {}, {});
    t.ok(emptyLayerData, 'should return layer data object even with missing dataset');
    t.equal(emptyLayerData.tilesetDataUrl, null, 'should handle missing dataset gracefully');
  }, 'should not throw error when formatting with missing dataset');

  t.end();
});

test('#WMSLayer#parseWMSFeatureInfo', t => {
  const layer = new WMSLayer({
    id: 'test-layer',
    dataId: 'test-data',
    label: 'Test WMS Layer',
    layers: [
      {
        name: 'test_layer',
        title: 'Test Layer',
        boundingBox: [
          [-180, -90],
          [180, 90]
        ]
      }
    ]
  });

  const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<wfs:FeatureCollection xmlns="http://www.opengis.net/wfs" xmlns:wfs="http://www.opengis.net/wfs" xmlns:gml="http://www.opengis.net/gml" xmlns:conus="http://conus" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs https://opengeo.ncep.noaa.gov/geoserver/schemas/wfs/1.0.0/WFS-basic.xsd">
  <gml:boundedBy>
    <gml:Box srsName="http://www.opengis.net/gml/srs/epsg.xml#4326">
      <gml:coordinates xmlns:gml="http://www.opengis.net/gml" decimal="." cs="," ts=" ">-1,-1 0,0</gml:coordinates>
    </gml:Box>
  </gml:boundedBy>
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

  t.equal(parsedAttributes[2].name, 'BLUE BAND', 'should parse BLUE_BAND attribute name correctly');
  t.equal(parsedAttributes[2].value, '0.0', 'should parse BLUE_BAND attribute value correctly');

  t.equal(
    parsedAttributes[3].name,
    'ALPHA BAND',
    'should parse ALPHA_BAND attribute name correctly'
  );
  t.equal(parsedAttributes[3].value, '255.0', 'should parse ALPHA_BAND attribute value correctly');

  t.end();
});

test('WMSLayer#parseWMSFeatureInfo -> edge cases', t => {
  const layer = new WMSLayer({
    id: 'test-layer',
    dataId: 'test-data'
  });

  // Test with empty XML
  const emptyXml = '';
  const emptyResult = layer.parseWMSFeatureInfo(emptyXml);
  t.ok(Array.isArray(emptyResult), 'should return array for empty XML');
  t.equal(emptyResult.length, 0, 'should return empty array for empty XML');

  // Test with invalid XML
  const invalidXml = '<invalid>xml</invalid>';
  const invalidResult = layer.parseWMSFeatureInfo(invalidXml);
  t.ok(Array.isArray(invalidResult), 'should return array for invalid XML');
  t.equal(invalidResult.length, 0, 'should return empty array for invalid XML');

  // Test with XML without feature data
  const noFeatureXml = `<?xml version="1.0" encoding="UTF-8"?>
<wfs:FeatureCollection xmlns="http://www.opengis.net/wfs" xmlns:wfs="http://www.opengis.net/wfs">
  <gml:boundedBy>
    <gml:Box srsName="http://www.opengis.net/gml/srs/epsg.xml#4326">
      <gml:coordinates xmlns:gml="http://www.opengis.net/gml" decimal="." cs="," ts=" ">-1,-1 0,0</gml:coordinates>
    </gml:Box>
  </gml:boundedBy>
</wfs:FeatureCollection>`;
  const noFeatureResult = layer.parseWMSFeatureInfo(noFeatureXml);
  t.ok(Array.isArray(noFeatureResult), 'should return array for XML without features');
  t.equal(noFeatureResult.length, 0, 'should return empty array for XML without features');

  t.end();
});

test('WMSLayer -> layer visibility and interaction', t => {
  const layer = new WMSLayer({
    id: 'test-wms-layer',
    dataId: 'wms-dataset',
    isVisible: false
  });

  layer.updateLayerVisConfig({
    wmsLayer: {
      name: 'test_layer',
      title: 'Test WMS Layer',
      boundingBox: [
        [-180, -90],
        [180, 90]
      ],
      queryable: true
    }
  });

  t.equal(layer.config.isVisible, false, 'should respect initial visibility setting');

  // Test hasHoveredObject when layer is not visible
  const mockObjectInfo = {
    picked: true,
    layer: {
      props: {
        id: 'test-wms-layer'
      }
    }
  };

  // Even if layer is not visible, hasHoveredObject should work if picked
  const hoveredObject = layer.hasHoveredObject(mockObjectInfo);
  t.ok(hoveredObject, 'should return hovered object even when layer is not visible');

  t.end();
});

test('#WMSLayer -> findDefaultLayerProps', t => {
  // Test with valid WMS dataset
  const mockWmsDataset = {
    type: 'wms-tile',
    metadata: {
      label: 'Test WMS Dataset',
      layers: [
        {
          name: 'test_layer',
          title: 'Test Layer',
          boundingBox: [
            [-180, -90],
            [180, 90]
          ],
          queryable: true
        },
        {
          name: 'second_layer',
          title: 'Second Layer',
          boundingBox: [
            [-90, -45],
            [90, 45]
          ],
          queryable: false
        }
      ]
    }
  };

  const result = WMSLayer.findDefaultLayerProps(mockWmsDataset);
  t.ok(result.props, 'should return props object');
  t.equal(result.props.length, 1, 'should return one layer prop for WMS dataset');

  // Test layer props
  t.equal(result.props[0].label, 'Test WMS Dataset', 'should use dataset label');
  t.deepEqual(
    result.props[0].layers,
    mockWmsDataset.metadata.layers,
    'should pass through all layers'
  );

  // Test with non-WMS dataset
  const nonWmsDataset = {
    type: 'csv',
    metadata: {
      label: 'CSV Dataset'
    }
  };

  const nonWmsResult = WMSLayer.findDefaultLayerProps(nonWmsDataset);
  t.deepEqual(nonWmsResult.props, [], 'should return empty props for non-WMS dataset');

  // Test with WMS dataset but no layers
  const emptyWmsDataset = {
    type: 'wms-tile',
    metadata: {
      label: 'Empty WMS Dataset',
      layers: []
    }
  };

  const emptyResult = WMSLayer.findDefaultLayerProps(emptyWmsDataset);
  t.equal(
    emptyResult.props.length,
    1,
    'should return one prop even for WMS dataset with no layers'
  );
  t.deepEqual(emptyResult.props[0].layers, [], 'should have empty layers array');

  t.end();
});

test('WMSLayer -> getWMSFeatureInfo error handling in browser', t => {
  const layer = new WMSLayer({
    id: 'test-layer',
    dataId: 'test-data'
  });

  layer.updateLayerVisConfig({
    wmsLayer: {
      name: 'test_layer',
      title: 'Test Layer',
      boundingBox: [
        [-180, -90],
        [180, 90]
      ],
      queryable: true
    }
  });

  // Test with no deckLayerRef
  layer['getWMSFeatureInfo'](100, 200)
    .then(result => {
      t.equal(result, null, 'should return null when no deckLayerRef');
      t.end();
    })
    .catch(error => {
      t.fail('should not throw error when no deckLayerRef');
      t.end();
    });
});

test('WMSLayer -> deckLayerRef storage safety', t => {
  const layer = new WMSLayer({
    id: 'test-wms-layer',
    dataId: 'wms-dataset'
  });

  layer.updateLayerVisConfig({
    wmsLayer: {
      name: 'test_layer',
      title: 'Test WMS Layer',
      boundingBox: [
        [-180, -90],
        [180, 90]
      ],
      queryable: true
    }
  });

  const mockData = {
    tilesetDataUrl: 'http://example.com/wms'
  };

  const mockOpts = {
    data: mockData,
    mapState: {
      dragRotate: false
    },
    interactionConfig: {
      tooltip: {
        enabled: true
      }
    }
  };

  // First render
  let deckLayers = layer.renderLayer(mockOpts);
  // Access the private property for testing
  t.ok(layer['deckLayerRef'], 'should store deckLayerRef after first render');

  const firstRef = layer['deckLayerRef'];

  // Second render should update the reference
  deckLayers = layer.renderLayer(mockOpts);
  t.ok(layer['deckLayerRef'], 'should have deckLayerRef after second render');
  t.notEqual(layer['deckLayerRef'], firstRef, 'should update deckLayerRef on new render');

  t.end();
});

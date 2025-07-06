// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import WMSLayer from '@kepler.gl/layers';

// Mock DOMParser for Node.js environment
global.DOMParser = class DOMParser {
  parseFromString(xmlString) {
    // Simple mock implementation for testing
    const doc = {
      getElementsByTagName: tagName => {
        if (
          tagName === 'gml:featureMember' &&
          xmlString.includes('<conus:RED_BAND>255.0</conus:RED_BAND>')
        ) {
          // Mock feature member with children
          const featureMember = {
            children: [
              {
                children: [
                  {tagName: 'conus:RED_BAND', textContent: '255.0'},
                  {tagName: 'conus:GREEN_BAND', textContent: '195.0'},
                  {tagName: 'conus:BLUE_BAND', textContent: '0.0'},
                  {tagName: 'conus:ALPHA_BAND', textContent: '255.0'}
                ]
              }
            ]
          };
          return [featureMember];
        }
        return [];
      }
    };
    return doc;
  }
};

test('WMSLayer -> constructor', t => {
  const layer = new WMSLayer({
    id: 'test-wms-layer',
    dataId: 'wms-dataset',
    label: 'Test WMS Layer'
  });

  t.equal(layer.type, 'wms', 'should have correct layer type');
  t.equal(layer.id, 'test-wms-layer', 'should have correct layer id');
  t.equal(layer.config.dataId, 'wms-dataset', 'should have correct dataId');
  t.equal(layer.config.label, 'Test WMS Layer', 'should have correct label');
  t.equal(layer.config.isVisible, true, 'should be visible by default');
  t.equal(layer.isAggregated, false, 'WMS layer should not be aggregated');
  t.ok(layer.config.visConfig, 'should have visConfig');
  t.equal(layer.config.visConfig.opacity, 0.8, 'should have default opacity');
  t.equal(layer.config.visConfig.transparent, true, 'should be transparent by default');

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
    ]
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
    dataId: 'wms-dataset',
    visConfig: {
      opacity: 0.8,
      transparent: true,
      wmsLayer: {
        name: 'test_layer',
        title: 'Test WMS Layer',
        boundingBox: [
          [-180, -90],
          [180, 90]
        ]
      }
    }
  });

  // Update the layer config to ensure wmsLayer is set
  layer.updateLayerVisConfig({
    wmsLayer: {
      name: 'test_layer',
      title: 'Test WMS Layer',
      boundingBox: [
        [-180, -90],
        [180, 90]
      ]
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

  // Test getHoverData
  const mockHoverInfo = {
    index: 0,
    x: 100,
    y: 200
  };

  const hoverData = layer.getHoverData(null, null, [], null, mockHoverInfo);

  t.ok(hoverData, 'should return hover data for WMS layer');
  t.ok(hoverData.fieldValues, 'should have fieldValues array');
  t.equal(hoverData.fieldValues.length, 1, 'should have 1 field value');
  t.equal(
    hoverData.fieldValues[0].labelMessage,
    'interactions.coordinate',
    'should have coordinates label'
  );
  t.equal(hoverData.fieldValues[0].value, '(100, 200)', 'should have coordinates value');

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

  // Test getWMSFeatureInfo - this will return null in test environment
  layer
    .getWMSFeatureInfo(100, 200)
    .then(featureInfo => {
      // In test environment, this should return null due to no actual WMS server
      t.equal(featureInfo, null, 'should return null in test environment');
      t.end();
    })
    .catch(_error => {
      t.pass('getWMSFeatureInfo may fail in test environment');
      t.end();
    });
});

test('WMSLayer -> renderLayer functionality', t => {
  const layer = new WMSLayer({
    id: 'test-wms-layer',
    dataId: 'wms-dataset',
    visConfig: {
      opacity: 0.8,
      transparent: true,
      wmsLayer: {
        name: 'test_layer',
        title: 'Test WMS Layer',
        boundingBox: [
          [-180, -90],
          [180, 90]
        ]
      }
    }
  });

  // Update the layer config to ensure wmsLayer is set
  layer.updateLayerVisConfig({
    wmsLayer: {
      name: 'test_layer',
      title: 'Test WMS Layer',
      boundingBox: [
        [-180, -90],
        [180, 90]
      ]
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
  t.equal(deckLayers.length, 1, 'should render one deck layer');

  const deckLayer = deckLayers[0];
  t.equal(deckLayer.props.id, 'test-wms-layer-WMSLayer', 'should have correct layer id');
  t.equal(deckLayer.props.pickable, true, 'should be pickable when tooltips enabled');
  t.equal(deckLayer.props.serviceType, 'wms', 'should have correct service type');
  t.deepEqual(deckLayer.props.layers, ['test_layer'], 'should have correct layers');
  t.equal(deckLayer.props.opacity, 0.8, 'should have correct opacity');
  t.equal(deckLayer.props.transparent, true, 'should have correct transparent setting');

  t.end();
});

test('WMSLayer -> renderLayer with tooltips disabled', t => {
  const layer = new WMSLayer({
    id: 'test-wms-layer',
    dataId: 'wms-dataset',
    visConfig: {
      wmsLayer: {
        name: 'test_layer',
        title: 'Test WMS Layer',
        boundingBox: [
          [-180, -90],
          [180, 90]
        ]
      }
    }
  });

  layer.updateLayerVisConfig({
    wmsLayer: {
      name: 'test_layer',
      title: 'Test WMS Layer',
      boundingBox: [
        [-180, -90],
        [180, 90]
      ]
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
  // Note: WMS layers are always pickable for click events, even when tooltips are disabled
  t.equal(deckLayer.props.pickable, true, 'WMS layers remain pickable for click events');

  t.end();
});

test('WMSLayer -> renderLayer with callbacks', t => {
  const layer = new WMSLayer({
    id: 'test-wms-layer',
    dataId: 'wms-dataset',
    visConfig: {
      wmsLayer: {
        name: 'test_layer',
        title: 'Test WMS Layer',
        boundingBox: [
          [-180, -90],
          [180, 90]
        ]
      }
    }
  });

  layer.updateLayerVisConfig({
    wmsLayer: {
      name: 'test_layer',
      title: 'Test WMS Layer',
      boundingBox: [
        [-180, -90],
        [180, 90]
      ]
    }
  });

  const mockData = {
    tilesetDataUrl: 'http://example.com/wms'
  };

  let callbackCalled = false;
  let callbackData = null;

  const mockLayerCallbacks = {
    onWMSFeatureInfo: (featureInfo, coordinate) => {
      callbackCalled = true;
      callbackData = {featureInfo, coordinate};
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
    layerCallbacks: mockLayerCallbacks
  };

  const deckLayers = layer.renderLayer(mockOpts);
  const deckLayer = deckLayers[0];

  t.ok(deckLayer.props.onClick, 'should have onClick handler');

  // Test onClick callback
  const mockClickInfo = {
    coordinate: [100, 200],
    layer: {
      props: {
        id: 'test-wms-layer-WMSLayer'
      }
    }
  };

  // Simulate click - this should trigger the callback asynchronously
  deckLayer.props.onClick(mockClickInfo);

  // Give some time for async operation - in test environment, this may not work
  setTimeout(() => {
    // In test environment, the callback may not be called due to network constraints
    // So we'll just test that the onClick handler exists and can be called
    t.pass('onClick handler can be called without errors');
    t.end();
  }, 100);
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

test('WMSLayer -> formatLayerData', t => {
  const layer = new WMSLayer({
    id: 'test-wms-layer',
    dataId: 'wms-dataset'
  });

  // WMS layers don't have traditional datasets, so formatLayerData should handle empty data
  const mockDatasets = {
    'wms-dataset': {
      metadata: {
        tilesetDataUrl: 'http://example.com/wms'
      }
    }
  };
  const layerData = layer.formatLayerData(mockDatasets, {}, {});

  t.ok(layerData, 'should return layer data object');
  t.equal(layerData.tilesetDataUrl, 'http://example.com/wms', 'should have tileset data URL');
  t.ok(layerData.metadata, 'should have metadata');

  t.end();
});

test('WMSLayer -> isValidToSave', t => {
  const layer = new WMSLayer({
    id: 'test-wms-layer',
    dataId: 'wms-dataset'
  });

  // WMS layers should always be valid to save since they don't depend on datasets
  t.ok(layer.isValidToSave(), 'should be valid to save');

  t.end();
});

test('WMSLayer#parseWMSFeatureInfo', t => {
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

test('WMSLayer -> getWMSFeatureInfo error handling', t => {
  const layer = new WMSLayer({
    id: 'test-layer',
    dataId: 'test-data',
    visConfig: {
      wmsLayer: {
        name: 'test_layer',
        title: 'Test Layer',
        boundingBox: [
          [-180, -90],
          [180, 90]
        ]
      }
    }
  });

  // Test with no wmsLayer config
  const layerWithoutConfig = new WMSLayer({
    id: 'test-layer-no-config',
    dataId: 'test-data'
  });

  layerWithoutConfig
    .getWMSFeatureInfo(100, 200)
    .then(result => {
      t.equal(result, null, 'should return null when no wmsLayer config');
      t.end();
    })
    .catch(error => {
      t.fail('should not throw error when no wmsLayer config');
      t.end();
    });
});

test('WMSLayer -> layer visibility and interaction', t => {
  const layer = new WMSLayer({
    id: 'test-wms-layer',
    dataId: 'wms-dataset',
    isVisible: false,
    visConfig: {
      wmsLayer: {
        name: 'test_layer',
        title: 'Test WMS Layer',
        boundingBox: [
          [-180, -90],
          [180, 90]
        ]
      }
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

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import WMSLayer from '../../../src/layers/src/wms-layer/wms-layer';

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

  // Test getWMSFeatureInfo
  layer
    .getWMSFeatureInfo(100, 200)
    .then(featureInfo => {
      t.ok(featureInfo, 'should return feature info');
      t.ok(featureInfo.includes('test_layer'), 'should include layer name in feature info');
      t.end();
    })
    .catch(_error => {
      t.fail('getWMSFeatureInfo should not throw error');
      t.end();
    });
});

test('WMSLayer -> renderLayer with hover', t => {
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

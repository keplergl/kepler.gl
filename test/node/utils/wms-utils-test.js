// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {
  buildWmsGetCapabilitiesUrl,
  buildWmsGetLegendGraphicUrl,
  collectWmsLegendUrlsFromRawJson,
  wmsCapabilitiesToDatasetMetadata
} from '../../../src/table/src/tileset/wms-utils';

test('WMS utils -> buildWmsGetLegendGraphicUrl', t => {
  const url = buildWmsGetLegendGraphicUrl('https://example.com/wms', 'OSM-WMS', {
    version: '1.3.0'
  });
  const parsed = new URL(url);

  t.equal(parsed.origin + parsed.pathname, 'https://example.com/wms');
  t.equal(parsed.searchParams.get('SERVICE'), 'WMS');
  t.equal(parsed.searchParams.get('REQUEST'), 'GetLegendGraphic');
  t.equal(parsed.searchParams.get('LAYER'), 'OSM-WMS');
  t.equal(parsed.searchParams.get('FORMAT'), 'image/png');
  t.equal(parsed.searchParams.get('VERSION'), '1.3.0');
  t.equal(parsed.searchParams.get('TRANSPARENT'), 'TRUE');

  t.end();
});

test('WMS utils -> buildWmsRequestUrl replaces existing WMS params', t => {
  const url = buildWmsGetLegendGraphicUrl(
    'https://example.com/wms?service=WMS&request=GetCapabilities&map=/data/map.map',
    'roads'
  );
  const parsed = new URL(url);

  t.equal(parsed.searchParams.get('REQUEST'), 'GetLegendGraphic');
  t.equal(parsed.searchParams.get('map'), '/data/map.map', 'keeps vendor query params');
  t.equal(parsed.searchParams.get('LAYER'), 'roads');

  t.end();
});

test('WMS utils -> buildWmsGetCapabilitiesUrl', t => {
  const url = buildWmsGetCapabilitiesUrl(
    'https://example.com/wms?service=WMS&request=GetMap&layers=x'
  );
  const parsed = new URL(url);
  t.equal(parsed.searchParams.get('REQUEST'), 'GetCapabilities');
  t.equal(parsed.searchParams.get('SERVICE'), 'WMS');
  t.notOk(parsed.searchParams.get('layers'));
  t.end();
});

test('WMS utils -> collectWmsLegendUrlsFromRawJson unwraps WMS_Capabilities', t => {
  const rawJson = {
    WMS_Capabilities: {
      Capability: {
        Layer: {
          Name: 'OSM-WMS',
          Style: {
            LegendURL: {
              OnlineResource: {
                'xlink:href': 'https://example.com/legend.png'
              }
            }
          }
        }
      }
    }
  };

  t.deepEqual(collectWmsLegendUrlsFromRawJson(rawJson), {
    'OSM-WMS': 'https://example.com/legend.png'
  });

  t.end();
});

test('WMS utils -> collectWmsLegendUrlsFromRawJson', t => {
  const rawJson = {
    Capability: {
      Layer: {
        Title: 'root',
        Layer: [
          {
            Name: 'OSM-WMS',
            Title: 'OpenStreetMap',
            Style: {
              Name: 'default',
              LegendURL: {
                OnlineResource: {
                  'xlink:href':
                    'https://example.com/wms?request=GetLegendGraphic&layer=OSM-WMS&format=image/png'
                }
              }
            }
          }
        ]
      }
    }
  };

  t.deepEqual(collectWmsLegendUrlsFromRawJson(rawJson), {
    'OSM-WMS': 'https://example.com/wms?request=GetLegendGraphic&layer=OSM-WMS&format=image/png'
  });

  t.end();
});

test('WMS utils -> wmsCapabilitiesToDatasetMetadata prefers LegendURL', t => {
  const capabilities = {
    version: '1.3.0',
    name: 'WMS',
    keywords: [],
    requests: {},
    layers: [
      {
        title: 'root',
        keywords: [],
        layers: [
          {
            name: 'OSM-WMS',
            title: 'OpenStreetMap',
            keywords: [],
            geographicBoundingBox: [
              [-180, -90],
              [180, 90]
            ],
            queryable: true
          }
        ]
      }
    ],
    json: {
      Capability: {
        Layer: {
          Layer: {
            Name: 'OSM-WMS',
            Style: {
              LegendURL: {
                OnlineResource: {
                  'xlink:href': 'https://example.com/legend.png'
                }
              }
            }
          }
        }
      }
    }
  };

  const metadata = wmsCapabilitiesToDatasetMetadata(capabilities, 'https://example.com/wms');

  t.equal(metadata.layers.length, 1);
  t.equal(metadata.layers[0].name, 'OSM-WMS');
  t.equal(metadata.layers[0].legendUrl, 'https://example.com/legend.png');
  t.deepEqual(metadata.layers[0].boundingBox, [-180, -90, 180, 90]);

  t.end();
});

test('WMS utils -> wmsCapabilitiesToDatasetMetadata resolves relative LegendURL', t => {
  const capabilities = {
    version: '1.3.0',
    layers: [
      {
        name: 'OSM-WMS',
        title: 'OpenStreetMap'
      }
    ],
    json: {
      Capability: {
        Layer: {
          Name: 'OSM-WMS',
          Style: {
            LegendURL: {
              OnlineResource: {
                'xlink:href': '/legends/osm.png'
              }
            }
          }
        }
      }
    }
  };

  const metadata = wmsCapabilitiesToDatasetMetadata(capabilities, 'https://example.com/wms');
  t.equal(metadata.layers[0].legendUrl, 'https://example.com/legends/osm.png');

  t.end();
});

test('WMS utils -> wmsCapabilitiesToDatasetMetadata constructs GetLegendGraphic', t => {
  const capabilities = {
    version: '1.1.1',
    name: 'WMS',
    keywords: [],
    requests: {},
    layers: [
      {
        name: 'radar',
        title: 'Radar',
        keywords: [],
        queryable: false
      }
    ]
  };

  const metadata = wmsCapabilitiesToDatasetMetadata(capabilities, 'https://example.com/wms');
  const legendUrl = new URL(metadata.layers[0].legendUrl);

  t.equal(legendUrl.searchParams.get('REQUEST'), 'GetLegendGraphic');
  t.equal(legendUrl.searchParams.get('LAYER'), 'radar');
  t.equal(legendUrl.searchParams.get('VERSION'), '1.1.1');

  t.end();
});

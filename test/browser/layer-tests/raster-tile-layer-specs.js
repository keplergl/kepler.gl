// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {KeplerGlLayers} from '@kepler.gl/layers';
import {testCreateCases} from 'test/helpers/layer-utils';

const {RasterTileLayer} = KeplerGlLayers;

// Mock data for raster tests
const MOCK_STAC_METADATA = {
  type: 'Feature',
  stac_version: '1.0.0',
  stac_extensions: ['https://stac-extensions.github.io/eo/v1.0.0/schema.json'],
  assets: {
    red: {
      href: 'https://example.com/red.tif',
      type: 'image/tiff',
      'eo:bands': [{name: 'red', common_name: 'red'}]
    },
    green: {
      href: 'https://example.com/green.tif',
      type: 'image/tiff',
      'eo:bands': [{name: 'green', common_name: 'green'}]
    },
    blue: {
      href: 'https://example.com/blue.tif',
      type: 'image/tiff',
      'eo:bands': [{name: 'blue', common_name: 'blue'}]
    }
  },
  bounds: [-122.5, 37.5, -122.0, 38.0],
  properties: {
    datetime: '2023-01-01T00:00:00Z'
  }
};

const MOCK_PMTILES_METADATA = {
  metadataUrl: 'https://example.com/raster.pmtiles',
  pmtilesType: 'raster',
  minZoom: 0,
  maxZoom: 18,
  bounds: [-122.5, 37.5, -122.0, 38.0]
};

const MOCK_STAC_DATASET = {
  type: 'raster-tile',
  metadata: MOCK_STAC_METADATA,
  label: 'Test STAC Dataset'
};

const MOCK_PMTILES_DATASET = {
  type: 'raster-tile',
  metadata: MOCK_PMTILES_METADATA,
  label: 'Test PMTiles Dataset'
};

test('#RasterTileLayer -> constructor', t => {
  const TEST_CASES = {
    CREATE: [
      {
        props: {
          dataId: 'raster-test-data',
          isVisible: true,
          label: 'test raster layer'
        },
        test: layer => {
          t.equal(
            layer.config.dataId,
            'raster-test-data',
            'RasterTileLayer dataId should be correct'
          );
          t.equal(layer.type, 'rasterTile', 'type should be rasterTile');
          t.equal(layer.isAggregated, false, 'RasterTileLayer is not aggregated');
          t.equal(layer.config.label, 'test raster layer', 'label should be correct');
          t.equal(layer.config.isVisible, true, 'should be visible by default');
          t.ok(layer.config.visConfig, 'should have visConfig');
          t.equal(layer.config.visConfig.opacity, 1, 'should have default opacity');
          t.equal(
            layer.config.visConfig.enableTerrain,
            true,
            'should have terrain enabled by default'
          );
          t.equal(
            layer.config.visConfig.enableTerrainTopView,
            false,
            'should have terrain top view disabled by default'
          );
          t.equal(layer.requireData, true, 'should require data');
          t.deepEqual(
            layer.supportedDatasetTypes,
            ['raster-tile'],
            'should support raster-tile dataset type'
          );
          t.equal(layer.name, 'Raster Tile', 'should have correct layer name');
          t.ok(typeof layer.layerIcon === 'function', 'should have layerIcon function');
          t.ok(layer.isValidToSave(), 'should be valid to save');
        }
      }
    ]
  };

  testCreateCases(t, RasterTileLayer, TEST_CASES.CREATE);
  t.end();
});

test('#RasterTileLayer -> formatLayerData', t => {
  const layer = new RasterTileLayer({
    id: 'test-stac-layer',
    dataId: 'stac-data'
  });

  // Test with STAC dataset
  const mockStacDatasets = {'stac-data': MOCK_STAC_DATASET};
  const stacLayerData = layer.formatLayerData(mockStacDatasets);

  t.ok(stacLayerData, 'should return layer data object for STAC');
  t.equal(stacLayerData.dataset, MOCK_STAC_DATASET, 'should have correct STAC dataset');
  t.equal(stacLayerData.tileSource, null, 'should have null tileSource for STAC');

  // Test with PMTiles dataset
  const pmtilesLayer = new RasterTileLayer({
    id: 'test-pmtiles-layer',
    dataId: 'pmtiles-data'
  });
  const mockPmtilesDatasets = {'pmtiles-data': MOCK_PMTILES_DATASET};
  const pmtilesLayerData = pmtilesLayer.formatLayerData(mockPmtilesDatasets);

  t.ok(pmtilesLayerData, 'should return layer data object for PMTiles');
  t.equal(pmtilesLayerData.dataset, MOCK_PMTILES_DATASET, 'should have correct PMTiles dataset');
  t.ok(pmtilesLayerData.tileSource, 'should create tileSource for PMTiles');

  t.end();
});

test('#RasterTileLayer -> renderLayer', t => {
  const layer = new RasterTileLayer({
    id: 'test-stac-layer',
    dataId: 'stac-data'
  });

  // Test STAC rendering
  const stacRenderOpts = {
    data: {
      dataset: MOCK_STAC_DATASET,
      tileSource: null
    },
    mapState: {
      dragRotate: false,
      bearing: 0,
      pitch: 0
    },
    interactionConfig: {
      tooltip: {enabled: true}
    }
  };

  const stacLayers = layer.renderLayer(stacRenderOpts);
  t.ok(Array.isArray(stacLayers), 'should return array of deck layers for STAC');
  t.ok(stacLayers.length >= 0, 'should return valid array for STAC');

  // Test PMTiles rendering
  const pmtilesLayer = new RasterTileLayer({
    id: 'test-pmtiles-layer',
    dataId: 'pmtiles-data'
  });

  const pmtilesRenderOpts = {
    data: {
      dataset: MOCK_PMTILES_DATASET,
      tileSource: {
        getTileData: () => Promise.resolve(null)
      }
    },
    mapState: {
      dragRotate: false,
      bearing: 0,
      pitch: 0
    },
    interactionConfig: {
      tooltip: {enabled: true}
    }
  };

  const pmtilesLayers = pmtilesLayer.renderLayer(pmtilesRenderOpts);
  t.ok(Array.isArray(pmtilesLayers), 'should return array of deck layers for PMTiles');
  t.equal(pmtilesLayers.length, 1, 'should render one deck layer for PMTiles');

  t.end();
});

test('#RasterTileLayer -> updateLayerConfig', t => {
  const layer = new RasterTileLayer({
    id: 'test-layer',
    dataId: 'stac-data'
  });

  // Test updateLayerVisConfig
  layer.updateLayerVisConfig({
    opacity: 0.5,
    enableTerrain: false,
    enableTerrainTopView: true
  });

  t.equal(layer.config.visConfig.opacity, 0.5, 'should update opacity');
  t.equal(layer.config.visConfig.enableTerrain, false, 'should update terrain setting');
  t.equal(
    layer.config.visConfig.enableTerrainTopView,
    true,
    'should update terrain top view setting'
  );

  // Test updateLayerConfig
  layer.updateLayerConfig({
    isVisible: false,
    label: 'Updated Layer'
  });

  t.equal(layer.config.isVisible, false, 'should update visibility');
  t.equal(layer.config.label, 'Updated Layer', 'should update label');

  t.end();
});

test('#RasterTileLayer -> updateLayerMeta', t => {
  const layer = new RasterTileLayer({
    id: 'test-layer',
    dataId: 'stac-data'
  });

  // Test with non-raster dataset
  t.doesNotThrow(() => {
    layer.updateLayerMeta({type: 'csv'});
  }, 'should not throw with non-raster dataset');

  // Test with STAC dataset
  t.doesNotThrow(() => {
    layer.updateLayerMeta(MOCK_STAC_DATASET);
  }, 'should update meta with STAC dataset');

  // Test with PMTiles dataset
  t.doesNotThrow(() => {
    layer.updateLayerMeta(MOCK_PMTILES_DATASET);
  }, 'should update meta with PMTiles dataset');

  t.end();
});

test('#RasterTileLayer -> findDefaultLayerProps', t => {
  // Test with valid raster dataset
  const result = RasterTileLayer.findDefaultLayerProps(MOCK_STAC_DATASET);
  t.ok(result.props, 'should return props object');
  t.equal(result.props.length, 1, 'should return one layer prop for raster dataset');
  t.equal(result.props[0].label, 'Test STAC Dataset', 'should use dataset label');
  t.equal(result.props[0].dataId, undefined, 'should not have dataId in props');
  t.equal(result.props[0].isVisible, true, 'should be visible by default');

  // Test with non-raster dataset
  const nonRasterResult = RasterTileLayer.findDefaultLayerProps({
    type: 'csv',
    metadata: {label: 'CSV Dataset'}
  });
  t.deepEqual(nonRasterResult.props, [], 'should return empty props for non-raster dataset');

  t.end();
});

test('#RasterTileLayer -> visualChannels', t => {
  const layer = new RasterTileLayer({
    id: 'test-layer',
    dataId: 'stac-data'
  });

  // Test with no categorical color legends
  const channels = layer.visualChannels;
  t.deepEqual(channels, {}, 'should return empty visual channels by default');

  // Test with categorical color legends
  layer.updateLayerVisConfig({
    colorRange: {
      colorLegends: {
        category1: [255, 0, 0],
        category2: [0, 255, 0]
      }
    }
  });

  const categoricalChannels = layer.visualChannels;
  t.ok(categoricalChannels.color, 'should have color channel when categorical legends exist');

  t.end();
});

test('#RasterTileLayer -> pixel value tracking', t => {
  const layer = new RasterTileLayer({
    id: 'test-layer',
    dataId: 'stac-data'
  });

  // Test initial pixel value state
  t.equal(layer.minViewportPixelValue, Infinity, 'should have Infinity as initial min pixel value');
  t.equal(
    layer.maxViewportPixelValue,
    -Infinity,
    'should have -Infinity as initial max pixel value'
  );

  // Test updateMinMaxPixelValue method with mock tiles
  const mockTiles = [
    {data: {minPixelValue: 25, maxPixelValue: 100}},
    {data: {minPixelValue: 50, maxPixelValue: 200}},
    {data: {minPixelValue: 10, maxPixelValue: 150}}
  ];

  layer.updateMinMaxPixelValue(mockTiles);
  t.equal(layer.minViewportPixelValue, 10, 'should set correct min pixel value from tiles');
  t.equal(layer.maxViewportPixelValue, 200, 'should set correct max pixel value from tiles');

  // Test with empty tiles array
  layer.updateMinMaxPixelValue([]);
  t.equal(layer.minViewportPixelValue, Infinity, 'should reset to Infinity for empty tiles');
  t.equal(layer.maxViewportPixelValue, -Infinity, 'should reset to -Infinity for empty tiles');

  // Test with tiles that have null data
  const tilesWithNullData = [{data: null}, {data: {minPixelValue: 30, maxPixelValue: 120}}, null];

  layer.updateMinMaxPixelValue(tilesWithNullData);
  t.equal(layer.minViewportPixelValue, 30, 'should handle tiles with null data');
  t.equal(layer.maxViewportPixelValue, 120, 'should handle tiles with null data');

  t.end();
});

test('#RasterTileLayer -> shouldRenderLayer', t => {
  const layer = new RasterTileLayer({
    id: 'test-layer',
    dataId: 'stac-data',
    isVisible: true
  });

  // Test shouldRenderLayer
  t.ok(layer.shouldRenderLayer(), 'should render layer when visible');

  layer.updateLayerConfig({isVisible: false});
  t.notOk(layer.shouldRenderLayer(), 'should not render layer when not visible');

  t.end();
});

test('#RasterTileLayer -> edge cases', t => {
  const layer = new RasterTileLayer({
    id: 'test-layer',
    dataId: 'stac-data'
  });

  // Test formatLayerData with missing dataset
  t.throws(() => {
    layer.formatLayerData({});
  }, 'should throw error when formatting with missing dataset');

  // Test layer without dataId
  const layerWithoutDataId = new RasterTileLayer({
    id: 'test-layer'
  });
  layerWithoutDataId.config.dataId = undefined;

  t.doesNotThrow(() => {
    const layerData = layerWithoutDataId.formatLayerData({});
    t.deepEqual(layerData, {}, 'should return empty object when no dataId');
  }, 'should not throw error when formatting without dataId');

  // Test render with invalid data
  const invalidOpts = {
    data: {
      dataset: {
        metadata: {
          type: 'Feature'
          // missing stac_version
        }
      }
    },
    mapState: {
      dragRotate: false,
      bearing: 0,
      pitch: 0
    },
    interactionConfig: {
      tooltip: {enabled: true}
    }
  };

  const invalidLayers = layer.renderLayer(invalidOpts);
  t.deepEqual(invalidLayers, [], 'should return empty array for invalid STAC data');

  // Test render with no data
  const noDataOpts = {
    data: null,
    mapState: {
      dragRotate: false,
      bearing: 0,
      pitch: 0
    },
    interactionConfig: {
      tooltip: {enabled: true}
    }
  };

  const noDataLayers = layer.renderLayer(noDataOpts);
  t.deepEqual(noDataLayers, [], 'should return empty array when no data');

  t.end();
});

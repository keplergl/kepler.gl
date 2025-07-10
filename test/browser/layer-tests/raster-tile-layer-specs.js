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

// Shared render options for tests
const createRenderOpts = (dataset, mapState = {dragRotate: false, bearing: 0, pitch: 0}) => ({
  data: {
    dataset,
    tileSource: dataset.metadata.pmtilesType ? {getTileData: () => Promise.resolve(null)} : null
  },
  mapState,
  interactionConfig: {tooltip: {enabled: true}}
});

test('#RasterTileLayer -> constructor and basic properties', t => {
  const TEST_CASES = {
    CREATE: [
      {
        props: {
          dataId: 'raster-test-data',
          isVisible: true,
          label: 'test raster layer'
        },
        test: layer => {
          t.equal(layer.config.dataId, 'raster-test-data', 'dataId should be correct');
          t.equal(layer.type, 'rasterTile', 'type should be rasterTile');
          t.equal(layer.isAggregated, false, 'should not be aggregated');
          t.equal(layer.config.label, 'test raster layer', 'label should be correct');
          t.equal(layer.config.isVisible, true, 'should be visible');
          t.equal(layer.config.visConfig.opacity, 1, 'should have default opacity');
          t.equal(
            layer.config.visConfig.enableTerrain,
            true,
            'should have terrain enabled by default'
          );
          t.equal(
            layer.config.visConfig.enableTerrainTopView,
            false,
            'should have terrain top view disabled'
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

test('#RasterTileLayer -> data formatting and rendering', t => {
  const stacLayer = new RasterTileLayer({id: 'stac-layer', dataId: 'stac-data'});
  const pmtilesLayer = new RasterTileLayer({id: 'pmtiles-layer', dataId: 'pmtiles-data'});

  // Test STAC data formatting
  const stacLayerData = stacLayer.formatLayerData({'stac-data': MOCK_STAC_DATASET});
  t.ok(stacLayerData, 'should return STAC layer data');
  t.equal(stacLayerData.dataset, MOCK_STAC_DATASET, 'should have correct STAC dataset');
  t.equal(stacLayerData.tileSource, null, 'should have null tileSource for STAC');

  // Test PMTiles data formatting
  const pmtilesLayerData = pmtilesLayer.formatLayerData({'pmtiles-data': MOCK_PMTILES_DATASET});
  t.ok(pmtilesLayerData, 'should return PMTiles layer data');
  t.equal(pmtilesLayerData.dataset, MOCK_PMTILES_DATASET, 'should have correct PMTiles dataset');
  t.ok(pmtilesLayerData.tileSource, 'should create tileSource for PMTiles');

  // Test rendering
  const stacLayers = stacLayer.renderLayer(createRenderOpts(MOCK_STAC_DATASET));
  const pmtilesLayers = pmtilesLayer.renderLayer(createRenderOpts(MOCK_PMTILES_DATASET));

  t.ok(Array.isArray(stacLayers), 'should return array for STAC');
  t.ok(Array.isArray(pmtilesLayers), 'should return array for PMTiles');
  t.equal(pmtilesLayers.length, 1, 'should render one deck layer for PMTiles');

  t.end();
});

test('#RasterTileLayer -> configuration and visual settings', t => {
  const layer = new RasterTileLayer({id: 'test-layer', dataId: 'stac-data'});

  // Test layer config updates
  layer.updateLayerConfig({isVisible: false, label: 'Updated Layer'});
  t.equal(layer.config.isVisible, false, 'should update visibility');
  t.equal(layer.config.label, 'Updated Layer', 'should update label');

  // Test visual config updates
  layer.updateLayerVisConfig({
    opacity: 0.7,
    enableTerrain: false,
    enableTerrainTopView: true
  });
  t.equal(layer.config.visConfig.opacity, 0.7, 'should update opacity');
  t.equal(layer.config.visConfig.enableTerrain, false, 'should update terrain');
  t.equal(layer.config.visConfig.enableTerrainTopView, true, 'should update terrain top view');

  // Test shouldRenderLayer
  t.notOk(layer.shouldRenderLayer(), 'should not render when not visible');
  layer.updateLayerConfig({isVisible: true});
  t.ok(layer.shouldRenderLayer(), 'should render when visible');

  t.end();
});

test('#RasterTileLayer -> metadata handling', t => {
  const layer = new RasterTileLayer({id: 'test-layer', dataId: 'stac-data'});

  // Test with non-raster dataset (should not throw)
  t.doesNotThrow(() => {
    layer.updateLayerMeta({type: 'csv'});
  }, 'should handle non-raster dataset');

  // Test with STAC and PMTiles datasets (should not throw)
  t.doesNotThrow(() => {
    layer.updateLayerMeta(MOCK_STAC_DATASET);
    layer.updateLayerMeta(MOCK_PMTILES_DATASET);
  }, 'should handle STAC and PMTiles datasets');

  t.end();
});

test('#RasterTileLayer -> pixel value tracking', t => {
  const layer = new RasterTileLayer({id: 'test-layer', dataId: 'stac-data'});

  // Test initial state
  t.equal(layer.minViewportPixelValue, Infinity, 'should have Infinity as initial min');
  t.equal(layer.maxViewportPixelValue, -Infinity, 'should have -Infinity as initial max');

  // Test with valid tiles
  const mockTiles = [
    {data: {minPixelValue: 25, maxPixelValue: 100}},
    {data: {minPixelValue: 10, maxPixelValue: 150}}
  ];
  layer.updateMinMaxPixelValue(mockTiles);
  t.equal(layer.minViewportPixelValue, 10, 'should set correct min pixel value');
  t.equal(layer.maxViewportPixelValue, 150, 'should set correct max pixel value');

  // Test with empty tiles
  layer.updateMinMaxPixelValue([]);
  t.equal(layer.minViewportPixelValue, Infinity, 'should reset to Infinity for empty tiles');
  t.equal(layer.maxViewportPixelValue, -Infinity, 'should reset to -Infinity for empty tiles');

  // Test with null data
  layer.updateMinMaxPixelValue([
    {data: null},
    {data: {minPixelValue: 30, maxPixelValue: 120}},
    null
  ]);
  t.equal(layer.minViewportPixelValue, 30, 'should handle null data gracefully');
  t.equal(layer.maxViewportPixelValue, 120, 'should handle null data gracefully');

  t.end();
});

test('#RasterTileLayer -> findDefaultLayerProps', t => {
  // Test with raster dataset
  const result = RasterTileLayer.findDefaultLayerProps(MOCK_STAC_DATASET);
  t.ok(result.props, 'should return props object');
  t.equal(result.props.length, 1, 'should return one layer prop');
  t.equal(result.props[0].label, 'Test STAC Dataset', 'should use dataset label');
  t.equal(result.props[0].isVisible, true, 'should be visible by default');

  // Test with non-raster dataset
  const nonRasterResult = RasterTileLayer.findDefaultLayerProps({type: 'csv'});
  t.deepEqual(nonRasterResult.props, [], 'should return empty props for non-raster dataset');

  t.end();
});

test('#RasterTileLayer -> edge cases and error handling', t => {
  const layer = new RasterTileLayer({id: 'test-layer', dataId: 'stac-data'});

  // Test formatLayerData with missing dataset
  t.throws(() => {
    layer.formatLayerData({});
  }, 'should throw error when dataset missing');

  // Test layer without dataId
  const layerWithoutDataId = new RasterTileLayer({id: 'test-layer'});
  layerWithoutDataId.config.dataId = undefined;
  const layerData = layerWithoutDataId.formatLayerData({});
  t.deepEqual(layerData, {}, 'should return empty object when no dataId');

  // Test rendering with invalid/missing data
  const invalidLayers = layer.renderLayer(createRenderOpts({metadata: {type: 'Feature'}}));
  t.deepEqual(invalidLayers, [], 'should return empty array for invalid STAC data');

  const noDataLayers = layer.renderLayer({...createRenderOpts(MOCK_STAC_DATASET), data: null});
  t.deepEqual(noDataLayers, [], 'should return empty array when no data');

  // Test malformed metadata (should not throw)
  t.doesNotThrow(() => {
    layer.updateLayerMeta({type: 'raster-tile', metadata: {type: 'Feature'}});
    layer.updateLayerMeta({type: 'raster-tile', metadata: {pmtilesType: 'raster'}});
  }, 'should handle malformed metadata gracefully');

  t.end();
});

test('#RasterTileLayer -> data type variations', t => {
  const layer = new RasterTileLayer({id: 'test-layer', dataId: 'stac-data'});

  // Test multi-asset STAC
  const multiAssetStac = {
    type: 'raster-tile',
    metadata: {
      ...MOCK_STAC_METADATA,
      assets: {
        ...MOCK_STAC_METADATA.assets,
        nir: {
          href: 'https://example.com/nir.tif',
          type: 'image/tiff',
          'eo:bands': [{name: 'nir', common_name: 'nir'}]
        }
      }
    }
  };
  const multiAssetData = layer.formatLayerData({'stac-data': multiAssetStac});
  t.ok(multiAssetData, 'should handle multi-asset STAC data');

  // Test single asset STAC
  const singleAssetStac = {
    type: 'raster-tile',
    metadata: {
      type: 'Feature',
      stac_version: '1.0.0',
      assets: {
        visual: {href: 'https://example.com/visual.tif', type: 'image/tiff'}
      },
      bounds: [-122.5, 37.5, -122.0, 38.0]
    }
  };
  const singleAssetData = layer.formatLayerData({'stac-data': singleAssetStac});
  t.ok(singleAssetData, 'should handle single-asset STAC data');

  t.end();
});

test('#RasterTileLayer -> layer serialization', t => {
  const layer = new RasterTileLayer({
    id: 'test-layer',
    dataId: 'stac-data',
    label: 'Test Raster Layer'
  });

  // Configure layer
  layer.updateLayerVisConfig({
    opacity: 0.8,
    enableTerrain: false,
    colorRange: {
      colors: ['#FF0000', '#00FF00'],
      colorLegends: {water: [0, 0, 255]}
    }
  });

  // Test layer properties
  const config = layer.config;
  t.ok(layer.id, 'should have id on layer');
  t.ok(config.dataId, 'should have dataId in config');
  t.ok(config.label, 'should have label in config');
  t.equal(config.visConfig.opacity, 0.8, 'should preserve opacity');
  t.equal(config.visConfig.enableTerrain, false, 'should preserve terrain setting');
  t.ok(layer.isValidToSave(), 'should be valid to save');

  t.end();
});

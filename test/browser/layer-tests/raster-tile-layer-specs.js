// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {KeplerGlLayers} from '@kepler.gl/layers';
import {
  getEOBands,
  findAssetWithName,
  getUsableAssets,
  getRasterStatisticsMinMax,
  filterAvailablePresets
} from '@kepler.gl/layers';
import {parseRasterMetadata} from '@kepler.gl/table';
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

// ---- STAC 1.1.0 Core Bands Support Tests ----

const MOCK_STAC_110_METADATA = {
  type: 'Feature',
  stac_version: '1.1.0',
  stac_extensions: ['https://stac-extensions.github.io/projection/v1.1.0/schema.json'],
  id: 'test-cog',
  geometry: {type: 'Point', coordinates: [0, 0]},
  bbox: [-122.5, 37.5, -122.0, 38.0],
  links: [],
  properties: {datetime: '2023-01-01T00:00:00Z'},
  assets: {
    data: {
      href: 'https://example.com/cog.tif',
      type: 'image/tiff; application=geotiff',
      bands: [
        {
          name: 'b1',
          'eo:common_name': 'red',
          data_type: 'uint8',
          statistics: {minimum: 0, maximum: 255, mean: 128}
        },
        {
          name: 'b2',
          'eo:common_name': 'green',
          data_type: 'uint8',
          statistics: {minimum: 0, maximum: 255, mean: 120}
        },
        {
          name: 'b3',
          'eo:common_name': 'blue',
          data_type: 'uint8',
          statistics: {minimum: 0, maximum: 255, mean: 110}
        }
      ]
    }
  }
};

const MOCK_STAC_110_LEGACY_MIX = {
  type: 'Feature',
  stac_version: '1.1.0',
  stac_extensions: [
    'https://stac-extensions.github.io/eo/v1.0.0/schema.json',
    'https://stac-extensions.github.io/raster/v1.0.0/schema.json'
  ],
  id: 'test-mix',
  geometry: {type: 'Point', coordinates: [0, 0]},
  bbox: [-122.5, 37.5, -122.0, 38.0],
  links: [],
  properties: {datetime: '2023-01-01T00:00:00Z'},
  assets: {
    visual: {
      href: 'https://example.com/visual.tif',
      type: 'image/tiff; application=geotiff',
      'eo:bands': [
        {name: 'red', common_name: 'red'},
        {name: 'green', common_name: 'green'},
        {name: 'blue', common_name: 'blue'}
      ],
      'raster:bands': [
        {data_type: 'uint8', statistics: {minimum: 0, maximum: 255}},
        {data_type: 'uint8', statistics: {minimum: 0, maximum: 255}},
        {data_type: 'uint8', statistics: {minimum: 0, maximum: 255}}
      ]
    },
    nir_core: {
      href: 'https://example.com/nir.tif',
      type: 'image/tiff; application=geotiff',
      bands: [
        {
          name: 'nir',
          'eo:common_name': 'nir',
          data_type: 'uint16',
          statistics: {minimum: 0, maximum: 10000}
        }
      ]
    }
  }
};

test('#STAC 1.1.0 -> parseRasterMetadata accepts core bands', t => {
  const result = parseRasterMetadata(MOCK_STAC_110_METADATA, {allowCollections: false});
  t.ok(result, 'should return a result');
  t.notOk(result instanceof Error, 'should not return an error for STAC 1.1.0 with core bands');
  t.equal(result.stac_version, '1.1.0', 'should preserve stac_version');
  t.end();
});

test('#STAC 1.1.0 -> parseRasterMetadata rejects items without bands', t => {
  const noBands = {
    type: 'Feature',
    stac_version: '1.1.0',
    stac_extensions: [],
    id: 'no-bands',
    geometry: {type: 'Point', coordinates: [0, 0]},
    bbox: [-1, -1, 1, 1],
    links: [],
    properties: {datetime: '2023-01-01T00:00:00Z'},
    assets: {
      data: {
        href: 'https://example.com/cog.tif',
        type: 'image/tiff'
      }
    }
  };
  const result = parseRasterMetadata(noBands, {allowCollections: false});
  t.ok(
    result instanceof Error,
    'should return an error for STAC 1.1.0 without core bands or extensions'
  );
  t.end();
});

test('#STAC 1.1.0 -> parseRasterMetadata still accepts legacy 1.0.0', t => {
  const legacy = {
    type: 'Feature',
    stac_version: '1.0.0',
    stac_extensions: [
      'https://stac-extensions.github.io/eo/v1.0.0/schema.json',
      'https://stac-extensions.github.io/raster/v1.0.0/schema.json'
    ],
    id: 'legacy',
    geometry: {type: 'Point', coordinates: [0, 0]},
    bbox: [-1, -1, 1, 1],
    links: [],
    properties: {datetime: '2023-01-01T00:00:00Z'},
    assets: {
      red: {
        href: 'https://example.com/red.tif',
        'eo:bands': [{name: 'red', common_name: 'red'}],
        'raster:bands': [{data_type: 'uint8'}]
      }
    }
  };
  const result = parseRasterMetadata(legacy, {allowCollections: false});
  t.ok(result, 'should return a result');
  t.notOk(result instanceof Error, 'should not return an error for legacy STAC 1.0.0');
  t.end();
});

test('#STAC 1.1.0 -> getUsableAssets with core bands', t => {
  const usable = getUsableAssets(MOCK_STAC_110_METADATA);
  t.ok(usable.data, 'should include asset with core bands containing data_type');
  t.equal(Object.keys(usable).length, 1, 'should return one usable asset');
  t.end();
});

test('#STAC 1.1.0 -> getUsableAssets mixed legacy + core', t => {
  const usable = getUsableAssets(MOCK_STAC_110_LEGACY_MIX);
  t.ok(usable.visual, 'should include legacy asset with raster:bands');
  t.ok(usable.nir_core, 'should include core bands asset');
  t.equal(Object.keys(usable).length, 2, 'should return two usable assets');
  t.end();
});

test('#STAC 1.1.0 -> getEOBands normalizes core bands', t => {
  const bands = getEOBands(MOCK_STAC_110_METADATA);
  t.ok(bands, 'should return bands');
  t.equal(bands.length, 3, 'should return 3 bands');
  t.equal(bands[0].common_name, 'red', 'should map eo:common_name to common_name for red');
  t.equal(bands[1].common_name, 'green', 'should map eo:common_name to common_name for green');
  t.equal(bands[2].common_name, 'blue', 'should map eo:common_name to common_name for blue');
  t.equal(bands[0].name, 'b1', 'should preserve name');
  t.end();
});

test('#STAC 1.1.0 -> getEOBands mixed legacy + core', t => {
  const bands = getEOBands(MOCK_STAC_110_LEGACY_MIX);
  t.ok(bands, 'should return bands');
  t.equal(bands.length, 4, 'should return 4 bands (3 legacy + 1 core)');
  const nir = bands.find(b => b.common_name === 'nir');
  t.ok(nir, 'should include the NIR band from core bands');
  t.end();
});

test('#STAC 1.1.0 -> findAssetWithName with core bands', t => {
  const usable = getUsableAssets(MOCK_STAC_110_METADATA);
  const result = findAssetWithName(usable, 'red', 'common_name');
  t.ok(result, 'should find asset with common_name=red');
  t.equal(result[0], 'data', 'should return asset name "data"');
  t.equal(result[1], 0, 'should return band index 0');

  const greenResult = findAssetWithName(usable, 'green', 'common_name');
  t.ok(greenResult, 'should find asset with common_name=green');
  t.equal(greenResult[1], 1, 'should return band index 1');

  const nameResult = findAssetWithName(usable, 'b1', 'name');
  t.ok(nameResult, 'should find asset by name=b1');
  t.equal(nameResult[0], 'data', 'should return asset name "data"');
  t.equal(nameResult[1], 0, 'should return band index 0');

  const noResult = findAssetWithName(usable, 'nir', 'common_name');
  t.notOk(noResult, 'should return null for missing band');
  t.end();
});

test('#STAC 1.1.0 -> getRasterStatisticsMinMax with core bands', t => {
  const [min, max] = getRasterStatisticsMinMax(MOCK_STAC_110_METADATA, 'singleBand', {
    assetId: 'data'
  });
  t.equal(min, 0, 'should get minimum from core bands statistics');
  t.equal(max, 255, 'should get maximum from core bands statistics');
  t.end();
});

test('#STAC 1.1.0 -> filterAvailablePresets with core bands', t => {
  const presetData = {
    trueColor: {
      id: 'trueColor',
      commonNames: ['red', 'green', 'blue'],
      bandCombination: 'rgb'
    },
    ndvi: {
      id: 'ndvi',
      commonNames: ['red', 'nir'],
      bandCombination: 'normalizedDifference'
    },
    singleBand: {
      id: 'singleBand',
      commonNames: null,
      bandCombination: 'single'
    }
  };

  const available = filterAvailablePresets(MOCK_STAC_110_METADATA, presetData);
  t.ok(available, 'should return available presets');
  t.ok(available.includes('trueColor'), 'should include trueColor preset');
  t.ok(available.includes('singleBand'), 'should include singleBand preset');
  t.notOk(available.includes('ndvi'), 'should not include ndvi (missing nir)');
  t.end();
});

test('#STAC 1.1.0 -> RasterTileLayer with core bands metadata handling', t => {
  const layer = new RasterTileLayer({id: 'test-110', dataId: 'stac-110'});

  const dataset = {
    type: 'raster-tile',
    metadata: MOCK_STAC_110_METADATA,
    label: 'STAC 1.1.0 COG'
  };

  t.doesNotThrow(() => {
    layer.updateLayerMeta(dataset);
  }, 'should handle STAC 1.1.0 metadata without throwing');

  const layerData = layer.formatLayerData({'stac-110': dataset});
  t.ok(layerData, 'should return layer data for STAC 1.1.0');
  t.equal(layerData.dataset, dataset, 'should have correct dataset');

  t.end();
});

// ---- Description fallback tests ----

const MOCK_STAC_DESCRIPTION_FALLBACK = {
  type: 'Feature',
  stac_version: '1.0.0',
  stac_extensions: [
    'https://stac-extensions.github.io/eo/v1.0.0/schema.json',
    'https://stac-extensions.github.io/raster/v1.0.0/schema.json'
  ],
  id: 'description-fallback-test',
  geometry: {type: 'Point', coordinates: [0, 0]},
  bbox: [-1, -1, 1, 1],
  links: [],
  properties: {datetime: '2023-01-01T00:00:00Z'},
  assets: {
    data: {
      href: 'https://example.com/cog.tif',
      type: 'image/tiff; application=geotiff',
      'eo:bands': [
        {name: 'b1', description: 'red'},
        {name: 'b2', description: 'green'},
        {name: 'b3', description: 'blue'}
      ],
      'raster:bands': [
        {data_type: 'uint8', statistics: {minimum: 0, maximum: 255}},
        {data_type: 'uint8', statistics: {minimum: 0, maximum: 255}},
        {data_type: 'uint8', statistics: {minimum: 0, maximum: 255}}
      ]
    }
  }
};

const MOCK_STAC_110_DESCRIPTION_FALLBACK = {
  type: 'Feature',
  stac_version: '1.1.0',
  stac_extensions: [],
  id: 'description-fallback-110',
  geometry: {type: 'Point', coordinates: [0, 0]},
  bbox: [-1, -1, 1, 1],
  links: [],
  properties: {datetime: '2023-01-01T00:00:00Z'},
  assets: {
    data: {
      href: 'https://example.com/cog.tif',
      type: 'image/tiff; application=geotiff',
      bands: [
        {name: 'b1', description: 'red', data_type: 'uint8'},
        {name: 'b2', description: 'green', data_type: 'uint8'},
        {name: 'b3', description: 'blue', data_type: 'uint8'}
      ]
    }
  }
};

test('#Description fallback -> getEOBands infers common_name from description (legacy eo:bands)', t => {
  const bands = getEOBands(MOCK_STAC_DESCRIPTION_FALLBACK);
  t.ok(bands, 'should return bands');
  t.equal(bands.length, 3, 'should return 3 bands');
  t.equal(bands[0].common_name, 'red', 'should infer red from description');
  t.equal(bands[1].common_name, 'green', 'should infer green from description');
  t.equal(bands[2].common_name, 'blue', 'should infer blue from description');
  t.end();
});

test('#Description fallback -> getEOBands infers common_name from description (core bands)', t => {
  const bands = getEOBands(MOCK_STAC_110_DESCRIPTION_FALLBACK);
  t.ok(bands, 'should return bands');
  t.equal(bands.length, 3, 'should return 3 bands');
  t.equal(bands[0].common_name, 'red', 'should infer red from core band description');
  t.equal(bands[1].common_name, 'green', 'should infer green from core band description');
  t.equal(bands[2].common_name, 'blue', 'should infer blue from core band description');
  t.end();
});

test('#Description fallback -> findAssetWithName uses description fallback', t => {
  const usable = getUsableAssets(MOCK_STAC_DESCRIPTION_FALLBACK);
  const result = findAssetWithName(usable, 'red', 'common_name');
  t.ok(result, 'should find asset with common_name=red via description');
  t.equal(result[0], 'data', 'should return correct asset name');
  t.equal(result[1], 0, 'should return correct band index');

  const blueResult = findAssetWithName(usable, 'blue', 'common_name');
  t.ok(blueResult, 'should find asset with common_name=blue via description');
  t.equal(blueResult[1], 2, 'should return band index 2 for blue');
  t.end();
});

test('#Description fallback -> filterAvailablePresets works with description fallback', t => {
  const presetData = {
    trueColor: {
      id: 'trueColor',
      commonNames: ['red', 'green', 'blue'],
      bandCombination: 'rgb'
    },
    singleBand: {
      id: 'singleBand',
      commonNames: null,
      bandCombination: 'single'
    }
  };

  const available = filterAvailablePresets(MOCK_STAC_DESCRIPTION_FALLBACK, presetData);
  t.ok(available, 'should return available presets');
  t.ok(available.includes('trueColor'), 'should include trueColor via description fallback');
  t.ok(available.includes('singleBand'), 'should include singleBand');
  t.end();
});

test('#Description fallback -> ignores non-matching descriptions', t => {
  const stac = {
    type: 'Feature',
    stac_version: '1.0.0',
    stac_extensions: [
      'https://stac-extensions.github.io/eo/v1.0.0/schema.json',
      'https://stac-extensions.github.io/raster/v1.0.0/schema.json'
    ],
    id: 'unknown-desc-test',
    geometry: {type: 'Point', coordinates: [0, 0]},
    bbox: [-1, -1, 1, 1],
    links: [],
    properties: {datetime: '2023-01-01T00:00:00Z'},
    assets: {
      data: {
        href: 'https://example.com/cog.tif',
        'eo:bands': [
          {name: 'b1', description: 'custom band'},
          {name: 'b2', description: 'another band'}
        ],
        'raster:bands': [{data_type: 'uint8'}, {data_type: 'uint8'}]
      }
    }
  };
  const bands = getEOBands(stac);
  t.ok(bands, 'should return bands');
  t.notOk(bands[0].common_name, 'should not infer common_name from non-standard description');
  t.notOk(bands[1].common_name, 'should not infer common_name from non-standard description');
  t.end();
});

// ---- Debug mode tests ----

test('#RasterTileLayer -> showTileBorders default config', t => {
  const layer = new RasterTileLayer({id: 'test-debug', dataId: 'test'});
  t.equal(layer.config.visConfig.showTileBorders, false, 'showTileBorders should default to false');

  layer.updateLayerVisConfig({showTileBorders: true});
  t.equal(
    layer.config.visConfig.showTileBorders,
    true,
    'showTileBorders should be updatable to true'
  );
  t.end();
});

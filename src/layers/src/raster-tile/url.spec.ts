// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {getApplicationConfig} from '@kepler.gl/utils';
import {
  getSingleCOGUrlParams,
  getStacApiUrlParams,
  getTitilerUrl,
  getTitilerPointUrl,
  getTitilerBboxUrl,
  RasterLayerResources
} from './url';
import type {CompleteSTACItem, CompleteSTACCollection} from './types';

jest.mock('@kepler.gl/utils', () => ({getApplicationConfig: jest.fn()}));

const servers = ['https://raster-a.example.test', 'https://raster-b.example.test'];
const assetUrl = 'https://data.example.test/image with spaces.tif?token=a+b&version=2';
const item = {
  id: 'sample',
  assets: {image: {href: assetUrl}},
  rasterTileServerUrls: servers
} as unknown as CompleteSTACItem;

beforeEach(() => {
  (getApplicationConfig as jest.Mock).mockReturnValue({
    rasterServerUseLatestTitiler: true,
    cdnUrl: 'https://cdn.example.test'
  });
});

describe('COG query compatibility', () => {
  test.each([
    [undefined, true, ['3', '1']],
    [undefined, false, ['3,1']],
    [false, true, ['3,1']],
    [true, false, ['3', '1']]
  ])('item preference %s overrides application preference %s', (override, app, expected) => {
    (getApplicationConfig as jest.Mock).mockReturnValue({rasterServerUseLatestTitiler: app});
    const params = getSingleCOGUrlParams({
      stac: {...item, rasterServerUseLatestTitiler: override},
      loadAssetId: 'image',
      loadBandIndexes: [2, 0]
    });
    // Round-trip the serialized query: signed URLs must not lose +, &, or spaces.
    if (!params) throw new Error('Expected COG query parameters');
    const parsed = new URLSearchParams(params.toString());
    expect(parsed.getAll('bidx')).toEqual(expected);
    expect(parsed.get('url')).toBe(assetUrl);
    expect(parsed.get('return_mask')).toBe('false');
  });

  test('does not produce a request for an asset without an href', () => {
    expect(
      getSingleCOGUrlParams({
        stac: {...item, assets: {image: {href: ''}}} as unknown as CompleteSTACItem,
        loadAssetId: 'image',
        loadBandIndexes: [0]
      })
    ).toBeNull();
  });
});

describe('STAC search queries', () => {
  test.each([
    ['sentinel-2-l2a', ['red', 'nir', 'custom'], 'B04,B08,custom'],
    ['custom-collection', ['red', 'custom'], 'red,custom']
  ])('maps known bands but preserves custom asset names for %s', (id, loadAssetIds, assets) => {
    const params = getStacApiUrlParams({
      stac: {id} as CompleteSTACCollection,
      stacSearchProvider: 'earth-search',
      startDate: '2020-02-28',
      endDate: '2020-02-29',
      loadAssetIds,
      mask: true
    });
    expect(params?.get('assets')).toBe(assets);
    expect(params?.get('return_mask')).toBe('true');
    expect(params?.get('url')).toBe('https://earth-search.aws.element84.com/v0/search');
    const query = params?.get('query');
    if (!query) throw new Error('Expected STAC query');
    expect(JSON.parse(query)).toEqual({
      collections: ['sentinel-s2-l2a-cogs'],
      datetime: '2020-02-28T00:00:00Z/2020-02-29T23:59:59Z'
    });
  });
});

describe('raster sample and export endpoints', () => {
  test.each([false, true])('uses the matching tile, point and bbox backend (search=%s)', search => {
    const stem = search ? 'stac/mosaic' : 'cog';
    const base = {stac: item, useSTACSearching: search};
    expect(getTitilerPointUrl({...base, lon: -122.5, lat: 37.25})).toEqual({
      url: `${servers[0]}/${stem}/point/-122.5,37.25`,
      rasterServerUrl: servers[0]
    });
    expect(
      getTitilerBboxUrl({...base, bbox: [-123, -10, -122, 20], width: 640, height: 320})
    ).toEqual({
      url: `${servers[0]}/${stem}/bbox/-123,-10,-122,20/640x320.png`,
      rasterServerUrl: servers[0]
    });
    expect(getTitilerUrl({...base, x: 2, y: 3, z: 4})).toEqual({
      url: `${servers[1]}/${stem}/tiles/WebMercatorQuad/4/2/3.npy`,
      rasterServerUrl: servers[1]
    });
  });

  test('honors the requested crop format and dimensions', () => {
    expect(
      getTitilerBboxUrl({
        stac: item,
        useSTACSearching: false,
        bbox: [10, 20, 30, 40],
        width: 1024,
        height: 512,
        format: 'tif'
      }).url
    ).toBe(`${servers[0]}/cog/bbox/10,20,30,40/1024x512.tif`);
  });

  test.each([undefined, []])('rejects missing tile servers (%s) before producing a URL', urls => {
    const base = {stac: {...item, rasterTileServerUrls: urls}, useSTACSearching: false};
    expect(() => getTitilerUrl({...base, x: 0, y: 0, z: 0})).toThrow('No raster tile servers');
    expect(() => getTitilerPointUrl({...base, lon: 0, lat: 0})).toThrow('No raster tile servers');
    expect(() => getTitilerBboxUrl({...base, bbox: [0, 0, 1, 1], width: 256, height: 256})).toThrow(
      'No raster tile servers'
    );
  });

  test('uses the configured CDN for raster palettes', () => {
    expect(RasterLayerResources.rasterColorMap('viridis')).toBe(
      'https://cdn.example.test/raster/colormaps/viridis.png'
    );
  });
});

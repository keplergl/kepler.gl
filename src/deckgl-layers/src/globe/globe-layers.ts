// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {COORDINATE_SYSTEM, Layer} from '@deck.gl/core';
import {SolidPolygonLayer, BitmapLayer} from '@deck.gl/layers';
import {TileLayer, MVTLayer} from '@deck.gl/geo-layers';

import type {Globe} from '@kepler.gl/constants';
import type {RGBColor} from '@kepler.gl/types';

import {getGlobeAtmosphereLayer, getGlobeAtmosphereSkyLayer} from './atmosphere-layer';
import {getGlobeDepthDiskLayer} from './globe-depth-disk-layer';
import {MVTLabelLayer} from './mvt-label-layer';

type LayerGroup = {slug: string; filter: (layer: any) => boolean};

const devicePixelRatio = Math.min(
  2,
  (typeof window !== 'undefined' && window.devicePixelRatio) || 1
);

const BACKGROUND_PARAMETERS = {
  depthTest: true,
  cull: true,
  depthMask: false
};

const BASEMAP_RASTER_PARAMETERS = {
  depthMask: false
};

const BACKGROUND_DATA = [
  [
    [-180, 90],
    [0, 90],
    [180, 90],
    [180, -90],
    [0, -90],
    [-180, -90]
  ]
];

const BACKGROUND_NORTH_POLE_DATA = [
  [
    [-180, 90],
    [0, 90],
    [180, 90],
    [180, 85],
    [0, 85],
    [-180, 85]
  ]
];

export const DEFAULT_BASEMAP_COLOR = {
  backgroundFillColor: [9, 16, 29] as RGBColor,
  basemapDefaultFillColor: [255, 255, 255] as RGBColor,
  basemapWaterFillColor: [17, 35, 48] as RGBColor,
  basemapDefaultLineColor: [40, 63, 93] as RGBColor,
  basemapAdminLineColor: [40, 63, 93] as RGBColor,
  basemapLabelColor: [114.75, 114.75, 114.75] as RGBColor
};

function getPaintColor(color: any): string | null {
  if (Array.isArray(color) && color[0] === 'interpolate') {
    return color[4];
  }
  return color;
}

function colorStringToRGB(color: string | null): RGBColor | null {
  if (!color) return null;
  if (typeof color !== 'string') return null;

  // Handle hsl() format
  const hslMatch = color.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/);
  if (hslMatch) {
    const h = parseInt(hslMatch[1], 10) / 360;
    const s = parseInt(hslMatch[2], 10) / 100;
    const l = parseInt(hslMatch[3], 10) / 100;
    // HSL to RGB conversion
    let r: number, g: number, b: number;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)] as RGBColor;
  }

  // Handle rgb() format
  const rgbMatch = color.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
  if (rgbMatch) {
    return [
      parseInt(rgbMatch[1], 10),
      parseInt(rgbMatch[2], 10),
      parseInt(rgbMatch[3], 10)
    ] as RGBColor;
  }

  // Handle hex format
  const hexMatch = color.match(/^#([0-9a-f]{6})$/i);
  if (hexMatch) {
    const hex = hexMatch[1];
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16)
    ] as RGBColor;
  }

  return null;
}

function findFirstLayerByGroup(layers: any[], layerGroups: LayerGroup[], groupSlug: string) {
  const layerGroup = layerGroups.find(group => group.slug === groupSlug);
  if (!layerGroup) return null;
  return layers.find(layer => layerGroup.filter(layer));
}

function findBackgroundColor(style: any): RGBColor | null {
  let found = style.layers.find((l: any) => l.id === 'background' || l.id === 'land');
  found = found || style.layers.find((l: any) => l.type === 'background');
  return colorStringToRGB(getPaintColor(found?.paint?.['background-color']));
}

function findWaterColor(style: any, layerGroups: LayerGroup[]): RGBColor | null {
  const found =
    style.layers.find((l: any) => l.id === 'water') ||
    findFirstLayerByGroup(style.layers, layerGroups, 'water');
  return colorStringToRGB(found?.paint?.['fill-color']);
}

function findAdminColor(style: any, layerGroups: LayerGroup[]): RGBColor | null {
  const borderLayers =
    style.layers.find((lyr: any) => lyr.id === 'admin-3-4-boundaries') ||
    findFirstLayerByGroup(style.layers, layerGroups, 'border');
  return colorStringToRGB(borderLayers?.paint?.['line-color']);
}

function findLabelColor(style: any, layerGroups: LayerGroup[]): RGBColor | null {
  let labelLayer = style.layers.find(
    (lyr: any) => lyr.id === 'country-label-lg' && lyr.type === 'symbol'
  );
  labelLayer =
    labelLayer ||
    style.layers.find((lyr: any) => lyr.id === 'country-label' && lyr.type === 'symbol');
  labelLayer = labelLayer || findFirstLayerByGroup(style.layers, layerGroups, 'label');
  return colorStringToRGB(labelLayer?.paint?.['text-color']);
}

export const getBasemapColors = (
  mapStyle: Partial<{style: any; layerGroups: LayerGroup[]}>
): {
  backgroundFillColor: RGBColor;
  basemapWaterFillColor: RGBColor;
  basemapAdminLineColor: RGBColor;
  basemapLabelColor: RGBColor;
} => {
  const {style: styleJson = {layers: []}, layerGroups = []} = mapStyle;

  return {
    backgroundFillColor:
      findBackgroundColor(styleJson) ?? DEFAULT_BASEMAP_COLOR.backgroundFillColor,
    basemapWaterFillColor:
      findWaterColor(styleJson, layerGroups) ?? DEFAULT_BASEMAP_COLOR.basemapWaterFillColor,
    basemapAdminLineColor:
      findAdminColor(styleJson, layerGroups) ?? DEFAULT_BASEMAP_COLOR.basemapAdminLineColor,
    basemapLabelColor:
      findLabelColor(styleJson, layerGroups) ?? DEFAULT_BASEMAP_COLOR.basemapLabelColor
  };
};

// Predefined color schemes for well-known basemap styles
const KNOWN_STYLE_COLORS: Record<
  string,
  {
    backgroundFillColor: RGBColor;
    basemapWaterFillColor: RGBColor;
    basemapAdminLineColor: RGBColor;
    basemapLabelColor: RGBColor;
  }
> = {
  dark: {
    backgroundFillColor: [15, 15, 15],
    basemapWaterFillColor: [10, 20, 35],
    basemapAdminLineColor: [60, 60, 80],
    basemapLabelColor: [150, 150, 150]
  },
  'dark-matter': {
    backgroundFillColor: [18, 18, 18],
    basemapWaterFillColor: [14, 19, 29],
    basemapAdminLineColor: [50, 50, 60],
    basemapLabelColor: [130, 130, 130]
  },
  light: {
    backgroundFillColor: [235, 233, 228],
    basemapWaterFillColor: [170, 211, 223],
    basemapAdminLineColor: [180, 175, 170],
    basemapLabelColor: [80, 80, 80]
  },
  positron: {
    backgroundFillColor: [242, 239, 233],
    basemapWaterFillColor: [174, 209, 220],
    basemapAdminLineColor: [190, 185, 180],
    basemapLabelColor: [90, 90, 90]
  },
  voyager: {
    backgroundFillColor: [234, 229, 220],
    basemapWaterFillColor: [170, 211, 223],
    basemapAdminLineColor: [180, 170, 160],
    basemapLabelColor: [70, 70, 70]
  },
  muted: {
    backgroundFillColor: [225, 225, 218],
    basemapWaterFillColor: [180, 210, 220],
    basemapAdminLineColor: [170, 165, 160],
    basemapLabelColor: [90, 90, 90]
  },
  muted_night: {
    backgroundFillColor: [22, 26, 30],
    basemapWaterFillColor: [15, 25, 40],
    basemapAdminLineColor: [55, 60, 70],
    basemapLabelColor: [140, 140, 140]
  }
};

/**
 * Get basemap colors either from the style JSON or from known style presets.
 * Falls back to default dark colors if style is unknown and no JSON is available.
 */
export const getBasemapColorsForStyle = (
  styleType: string,
  mapStyle?: Partial<{style: any; layerGroups: LayerGroup[]}>
): {
  backgroundFillColor: RGBColor;
  basemapWaterFillColor: RGBColor;
  basemapAdminLineColor: RGBColor;
  basemapLabelColor: RGBColor;
} => {
  // Try to extract from style JSON first
  if (mapStyle?.style?.layers?.length) {
    return getBasemapColors(mapStyle);
  }
  // Fall back to known style presets
  if (KNOWN_STYLE_COLORS[styleType]) {
    return KNOWN_STYLE_COLORS[styleType];
  }
  // Default dark colors
  return {
    backgroundFillColor: DEFAULT_BASEMAP_COLOR.backgroundFillColor,
    basemapWaterFillColor: DEFAULT_BASEMAP_COLOR.basemapWaterFillColor,
    basemapAdminLineColor: DEFAULT_BASEMAP_COLOR.basemapAdminLineColor,
    basemapLabelColor: DEFAULT_BASEMAP_COLOR.basemapLabelColor
  };
};

/**
 * Clear color (background around the globe) for globe mode, in RGBA 0-255 as
 * expected by deck.gl's View `clearColor` prop (deck.gl >= 9 no longer supports
 * the global `parameters.clearColor`; it must be set per-view with `clear: true`).
 */
export function getGlobeClearColor(
  backgroundColor?: [number, number, number] | number[]
): [number, number, number, number] {
  if (backgroundColor) {
    return [backgroundColor[0], backgroundColor[1], backgroundColor[2], 255];
  }
  // Default matches the previous hardcoded clear color [0.015, 0.035, 0.065] in 0-1 space.
  return [4, 9, 17, 255];
}

const INVISIBLE_COLOR: [number, number, number, number] = [0, 0, 0, 0];

const BASEMAP_MVT_PARAMETERS = {
  depthMask: false
};

/**
 * Globe basemap tile provider.
 *
 * - `mapbox` uses Mapbox vector/raster tiles and requires an access token.
 * - `carto` uses CARTO's free OpenMapTiles vector tiles + Esri World Imagery
 *   raster, and needs no token. Used as an automatic fallback when no Mapbox
 *   token is available (e.g. MapLibre / CARTO basemap setups), so the globe
 *   basemap still renders instead of showing a solid-color sphere.
 */
export type GlobeBasemapProvider = 'mapbox' | 'carto';

/**
 * Resolve which globe basemap tile provider to use.
 *
 * The globe should follow the *selected basemap style's* rendering library so
 * it stays consistent with the flat 2D map: a MapLibre/CARTO style uses the
 * free CARTO tiles (even when a Mapbox token is available), and a Mapbox style
 * uses Mapbox tiles. A Mapbox style with no token falls back to CARTO so the
 * globe still renders instead of showing a bare colored sphere.
 *
 * @param baseMapLibrary the selected style's library ('mapbox' | 'maplibre'),
 *   e.g. from `getBaseMapLibrary(currentStyle)`.
 */
export const resolveGlobeBasemapProvider = (
  baseMapLibrary: 'mapbox' | 'maplibre' | undefined,
  mapboxApiAccessToken?: string
): GlobeBasemapProvider => {
  if (baseMapLibrary === 'maplibre') {
    return 'carto';
  }
  if (baseMapLibrary === 'mapbox') {
    return mapboxApiAccessToken ? 'mapbox' : 'carto';
  }
  // Unknown library: prefer Mapbox when a token exists, otherwise CARTO.
  return mapboxApiAccessToken ? 'mapbox' : 'carto';
};

// CARTO free vector tiles (OpenMapTiles schema, no API key required).
const CARTO_VECTOR_TILE_URLS = [
  'https://tiles-a.basemaps.cartocdn.com/vectortiles/carto.streets/v1/{z}/{x}/{y}.mvt',
  'https://tiles-b.basemaps.cartocdn.com/vectortiles/carto.streets/v1/{z}/{x}/{y}.mvt',
  'https://tiles-c.basemaps.cartocdn.com/vectortiles/carto.streets/v1/{z}/{x}/{y}.mvt',
  'https://tiles-d.basemaps.cartocdn.com/vectortiles/carto.streets/v1/{z}/{x}/{y}.mvt'
];

// Free satellite raster fallback (Esri World Imagery, no API key required).
const ESRI_WORLD_IMAGERY_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

/**
 * Maps a raw MVT source-layer name to a normalized semantic layer kind, so the
 * fill/line/label accessors work across both the Mapbox (`mapbox-streets-v8`)
 * and CARTO/OpenMapTiles schemas.
 *
 * | semantic | mapbox        | openmaptiles |
 * | -------- | ------------- | ------------ |
 * | water    | `water`       | `water`      |
 * | admin    | `admin`       | `boundary`   |
 * | label    | `place_label` | `place`      |
 */
type BasemapLayerKind = 'water' | 'admin' | 'label' | 'other';

function getBasemapLayerKind(layerName?: string): BasemapLayerKind {
  switch (layerName) {
    case 'water':
      return 'water';
    case 'admin':
    case 'boundary':
      return 'admin';
    case 'place_label':
    case 'place':
      return 'label';
    default:
      return 'other';
  }
}

export type GlobeAttribution = {label: string; href: string};

const MAPBOX_ATTRIBUTION: GlobeAttribution = {
  label: '© Mapbox',
  href: 'https://www.mapbox.com/about/maps/'
};
const OSM_ATTRIBUTION: GlobeAttribution = {
  label: '© OpenStreetMap',
  href: 'https://www.openstreetmap.org/copyright'
};
const CARTO_ATTRIBUTION: GlobeAttribution = {
  label: '© CARTO',
  href: 'https://carto.com/attributions'
};
const ESRI_ATTRIBUTION: GlobeAttribution = {
  label: 'Powered by Esri',
  href: 'https://www.esri.com/'
};

/**
 * Resolve the tile-source attribution entries for the globe basemap. deck.gl
 * renders the globe basemap tiles itself (not the base Maplibre/Mapbox map), so
 * the base map's attribution machinery never sees them. This lets the UI credit
 * the actual tile provider(s) in globe mode.
 */
export const getGlobeBasemapAttributions = ({
  globe,
  mapboxApiAccessToken,
  mapStyleType,
  basemapProvider
}: {
  globe?: Globe;
  mapboxApiAccessToken?: string;
  mapStyleType?: string;
  basemapProvider?: GlobeBasemapProvider;
}): GlobeAttribution[] => {
  if (!globe?.enabled || !globe.config?.basemap) {
    return [];
  }

  const provider: GlobeBasemapProvider =
    basemapProvider ?? resolveGlobeBasemapProvider(undefined, mapboxApiAccessToken);

  if (provider === 'mapbox') {
    return mapboxApiAccessToken ? [MAPBOX_ATTRIBUTION, OSM_ATTRIBUTION] : [];
  }

  const isSatellite = mapStyleType === 'satellite' || mapStyleType === 'satellite-street';
  // CARTO vector tiles are OpenStreetMap-derived; Esri imagery is credited separately.
  return isSatellite
    ? [ESRI_ATTRIBUTION, CARTO_ATTRIBUTION, OSM_ATTRIBUTION]
    : [CARTO_ATTRIBUTION, OSM_ATTRIBUTION];
};

// eslint-disable-next-line complexity
export const getGlobeBaseLayers = ({
  mapboxApiAccessToken,
  globe,
  mapStyleType,
  basemapProvider
}: {
  mapboxApiAccessToken: string;
  globe: Globe;
  mapStyleType?: string;
  /**
   * Which tile provider to use for the globe basemap. Defaults to `mapbox` when
   * a token is present, otherwise falls back to the token-free `carto` tiles.
   */
  basemapProvider?: GlobeBasemapProvider;
}): Layer[] => {
  const {config} = globe;

  const isSatellite = mapStyleType === 'satellite';
  const isSatelliteStreet = mapStyleType === 'satellite-street';

  // Fall back to the free CARTO tiles whenever no Mapbox token is available so
  // the globe basemap still renders (matches kepler's default token-free
  // MapLibre/CARTO basemaps). Callers should pass an explicit `basemapProvider`
  // (derived from the selected style) so the globe follows the 2D basemap.
  const provider: GlobeBasemapProvider =
    basemapProvider ?? resolveGlobeBasemapProvider(undefined, mapboxApiAccessToken);
  const useCarto = provider === 'carto';
  const hasTileAccess = useCarto || Boolean(mapboxApiAccessToken);

  return [
    config.atmosphere ? getGlobeAtmosphereSkyLayer({config}) : null,

    // Depth-only cross-section disk: writes depth at the globe's silhouette so
    // far-side geometry (arcs/lines) is occluded by the planet.
    getGlobeDepthDiskLayer({fillColor: config.surfaceColor}),

    // Background surface polygon
    (!config.basemap || (!isSatellite && !isSatelliteStreet)) &&
      new SolidPolygonLayer({
        id: 'globe-background',
        data: BACKGROUND_DATA,
        getPolygon: ((d: number[][]) => d) as any,
        filled: true,
        getFillColor: config.surfaceColor as any,
        parameters: BACKGROUND_PARAMETERS
      }),

    // Fill hole at north pole
    config.basemap &&
      new SolidPolygonLayer({
        id: 'globe-background-north-pole',
        data: BACKGROUND_NORTH_POLE_DATA,
        getPolygon: ((d: number[][]) => d) as any,
        filled: true,
        getFillColor: (config.water ? config.waterColor : config.surfaceColor) as any,
        parameters: BACKGROUND_PARAMETERS
      }),

    // Satellite tiles
    config.basemap &&
      (isSatellite || isSatelliteStreet) &&
      hasTileAccess &&
      new TileLayer({
        id: `globe-satellite-tiles-${provider}`,
        data: useCarto
          ? [ESRI_WORLD_IMAGERY_URL]
          : [
              `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.png?access_token=${mapboxApiAccessToken}`
            ],
        minZoom: 0,
        maxZoom: useCarto ? 18 : 19,
        // Esri tiles are 256px; Mapbox @2x tiles are 512px.
        tileSize: useCarto ? 256 : 512 / devicePixelRatio,
        renderSubLayers: (props: any) => {
          const {
            bbox: {west, south, east, north}
          } = props.tile;

          return [
            new BitmapLayer(props, {
              _imageCoordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
              data: undefined,
              image: props.data,
              bounds: [west, south, east, north]
            })
          ];
        },
        parameters: BASEMAP_RASTER_PARAMETERS
      }),

    // Vector basemap (MVT labels/admin/water)
    config.basemap &&
      !isSatellite &&
      hasTileAccess &&
      new MVTLayer({
        // force the layer to update when the style/label/provider config changes
        id: `globe-basemap-mvt-layer-${provider}-${mapStyleType}`,
        data: useCarto
          ? CARTO_VECTOR_TILE_URLS
          : `https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v8/{z}/{x}/{y}.vector.pbf?access_token=${mapboxApiAccessToken}`,
        minZoom: 0,
        maxZoom: 23,
        binary: false,
        parameters: BASEMAP_MVT_PARAMETERS,
        loadOptions: useCarto
          ? {
              // OpenMapTiles schema: `boundary` = admin lines, `place` = labels.
              mvt: {
                layers: isSatelliteStreet
                  ? ['place', 'boundary']
                  : ['place', 'boundary', 'water', 'transportation']
              }
            }
          : {
              mvt: {
                layers: isSatelliteStreet
                  ? ['place_label', 'admin']
                  : ['place_label', 'admin', 'water', 'road']
              }
            },
        // Render admin/water via GeoJsonLayer and place labels via TextLayer.
        config,
        renderSubLayers: (props: any) => new MVTLabelLayer(props),
        getFillColor: (f: any) => {
          switch (getBasemapLayerKind(f.properties.layerName)) {
            case 'water':
              return config.water ? config.waterColor : INVISIBLE_COLOR;
            default:
              return config.surfaceColor;
          }
        },
        getLineColor: (f: any) => {
          switch (getBasemapLayerKind(f.properties.layerName)) {
            case 'admin':
              return config.adminLines ? config.adminLinesColor : INVISIBLE_COLOR;
            default:
              return config.surfaceColor;
          }
        },
        getLineWidth: (f: any) => {
          switch (getBasemapLayerKind(f.properties.layerName)) {
            case 'admin':
              switch (f.properties.admin_level) {
                case 0:
                case 2:
                  return 1;
                default:
                  return 0.75;
              }
            default:
              return 0;
          }
        },
        updateTriggers: {
          getFillColor: [config.waterColor, config.surfaceColor, config.water],
          getLineColor: [config.adminLinesColor, config.surfaceColor, config.adminLines]
        },
        lineWidthUnits: 'pixels',
        lineWidthMinPixels: 0,
        lineWidthMaxPixels: 20,
        getPointRadius: 0,
        pointRadiusMinPixels: 0
      } as any)
  ].filter(Boolean) as Layer[];
};

export const getGlobeTopLayers = ({globe}: {globe: Globe}): Layer[] => {
  const {config} = globe;
  return [config.atmosphere ? getGlobeAtmosphereLayer({config}) : null].filter(Boolean) as Layer[];
};

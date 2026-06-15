// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {COORDINATE_SYSTEM, Layer} from '@deck.gl/core';
import {SolidPolygonLayer, BitmapLayer} from '@deck.gl/layers';
import {TileLayer, MVTLayer} from '@deck.gl/geo-layers';

import type {GlobeConfig, Globe} from '@kepler.gl/constants';
import type {RGBColor} from '@kepler.gl/types';

import {getGlobeAtmosphereLayer, getGlobeAtmosphereSkyLayer} from './atmosphere-layer';
import {getGlobeDepthDiskLayer} from './globe-depth-disk-layer';

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
    return [parseInt(rgbMatch[1], 10), parseInt(rgbMatch[2], 10), parseInt(rgbMatch[3], 10)] as RGBColor;
  }

  // Handle hex format
  const hexMatch = color.match(/^#([0-9a-f]{6})$/i);
  if (hexMatch) {
    const hex = hexMatch[1];
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)] as RGBColor;
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
  let labelLayer = style.layers.find((lyr: any) => lyr.id === 'country-label-lg' && lyr.type === 'symbol');
  labelLayer = labelLayer || style.layers.find((lyr: any) => lyr.id === 'country-label' && lyr.type === 'symbol');
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
    backgroundFillColor: findBackgroundColor(styleJson) ?? DEFAULT_BASEMAP_COLOR.backgroundFillColor,
    basemapWaterFillColor: findWaterColor(styleJson, layerGroups) ?? DEFAULT_BASEMAP_COLOR.basemapWaterFillColor,
    basemapAdminLineColor: findAdminColor(styleJson, layerGroups) ?? DEFAULT_BASEMAP_COLOR.basemapAdminLineColor,
    basemapLabelColor: findLabelColor(styleJson, layerGroups) ?? DEFAULT_BASEMAP_COLOR.basemapLabelColor
  };
};

// Predefined color schemes for well-known basemap styles
const KNOWN_STYLE_COLORS: Record<string, {
  backgroundFillColor: RGBColor;
  basemapWaterFillColor: RGBColor;
  basemapAdminLineColor: RGBColor;
  basemapLabelColor: RGBColor;
}> = {
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

export function getGlobeClearColor(): [number, number, number, number] {
  return [0.015, 0.035, 0.065, 1.0];
}

const INVISIBLE_COLOR: [number, number, number, number] = [0, 0, 0, 0];

const BASEMAP_MVT_PARAMETERS = {
  depthMask: false
};

// eslint-disable-next-line complexity
export const getGlobeBaseLayers = ({
  mapboxApiAccessToken,
  globe,
  mapStyleType
}: {
  mapboxApiAccessToken: string;
  globe: Globe;
  mapStyleType?: string;
}): Layer[] => {
  const {config} = globe;

  const isSatellite = mapStyleType === 'satellite';
  const isSatelliteStreet = mapStyleType === 'satellite-street';

  return [
    config.atmosphere ? getGlobeAtmosphereSkyLayer({config}) : null,

    getGlobeDepthDiskLayer({fillColor: config.surfaceColor}),

    // Background surface polygon
    (!config.basemap || (!isSatellite && !isSatelliteStreet)) &&
      new SolidPolygonLayer({
        id: 'globe-background',
        data: BACKGROUND_DATA,
        getPolygon: (d: number[][]) => d,
        filled: true,
        getFillColor: config.surfaceColor as any,
        parameters: BACKGROUND_PARAMETERS
      }),

    // Fill hole at north pole
    config.basemap &&
      new SolidPolygonLayer({
        id: 'globe-background-north-pole',
        data: BACKGROUND_NORTH_POLE_DATA,
        getPolygon: (d: number[][]) => d,
        filled: true,
        getFillColor: (config.water ? config.waterColor : config.surfaceColor) as any,
        parameters: BACKGROUND_PARAMETERS
      }),

    // Satellite tiles
    config.basemap &&
      (isSatellite || isSatelliteStreet) &&
      new TileLayer({
        id: 'globe-satellite-tiles',
        data: [
          `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.png?access_token=${mapboxApiAccessToken}`
        ],
        minZoom: 0,
        maxZoom: 19,
        tileSize: 512 / devicePixelRatio,
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
      mapboxApiAccessToken &&
      new MVTLayer({
        id: 'globe-basemap-mvt-layer',
        data: `https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v8/{z}/{x}/{y}.vector.pbf?access_token=${mapboxApiAccessToken}`,
        minZoom: 0,
        maxZoom: 23,
        binary: false,
        parameters: BASEMAP_MVT_PARAMETERS,
        loadOptions: {
          mvt: {
            layers: isSatelliteStreet
              ? ['place_label', 'admin']
              : ['place_label', 'admin', 'water', 'road']
          }
        },
        getFillColor: (f: any) => {
          switch (f.properties.layerName) {
            case 'water':
              return config.water ? config.waterColor : INVISIBLE_COLOR;
            default:
              return config.surfaceColor;
          }
        },
        getLineColor: (f: any) => {
          switch (f.properties.layerName) {
            case 'admin':
              return config.adminLines ? config.adminLinesColor : INVISIBLE_COLOR;
            default:
              return config.surfaceColor;
          }
        },
        getLineWidth: (f: any) => {
          switch (f.properties.layerName) {
            case 'admin':
              switch (f.properties.admin_level) {
                case 0:
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

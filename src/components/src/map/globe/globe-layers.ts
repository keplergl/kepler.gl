// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {COORDINATE_SYSTEM, CompositeLayer} from '@deck.gl/core';
import {SolidPolygonLayer, GeoJsonLayer, TextLayer} from '@deck.gl/layers';
import {MVTLayer, TileLayer} from '@deck.gl/geo-layers';
import {BitmapLayer} from '@deck.gl/layers';
import type {Globe, GlobeConfig} from '@kepler.gl/constants';

import {getGlobeAtmosphereLayer, getGlobeAtmosphereSkyLayer} from './atmosphere-layer';
import {getGlobeDepthDiskLayer} from './globe-depth-disk-layer';

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

const devicePixelRatio = Math.min(
  2,
  (typeof window !== 'undefined' && window.devicePixelRatio) || 1
);

const INVISIBLE_COLOR: [number, number, number, number] = [0, 0, 0, 0];

const BASEMAP_PARAMETERS = {
  depthWriteEnabled: false
};

const CARTO_RASTER_TILE_MAP: Record<string, string> = {
  'dark-matter': 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
  positron: 'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
  voyager: 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png'
};

class GlobeMVTSublayer extends CompositeLayer<any> {
  static layerName = 'GlobeMVTSublayer';
  static defaultProps = {
    ...GeoJsonLayer.defaultProps,
    billboard: true,
    labelSizeUnits: 'pixels'
  };

  getLabel(feature: any): string {
    const {properties} = feature;
    switch (properties?.layerName) {
      case 'place_label':
        switch (properties.class) {
          case 'country':
            return properties.name_en || properties.name || '';
          default:
            return '';
        }
      default:
        return '';
    }
  }

  getLabelSize(): number {
    return 10;
  }

  getLabelAnchors(feature: any): number[][] {
    const {type, coordinates} = feature.geometry || {};
    switch (type) {
      case 'Point':
        return [coordinates];
      case 'MultiPoint':
        return coordinates;
      default:
        return [];
    }
  }

  updateState({changeFlags}: any): void {
    const {data} = this.props as any;
    if (changeFlags.dataChanged && data) {
      const features = (data as any).features || data;
      const labelData = features.flatMap((feature: any, index: number) => {
        const labelAnchors = this.getLabelAnchors(feature);
        return labelAnchors.map((p: number[]) =>
          this.getSubLayerRow({position: p}, feature, index)
        );
      });
      this.setState({labelData});
    }
  }

  renderLayers(): any[] {
    const {config} = this.props as any;
    const layers: any[] = [];

    layers.push(
      new GeoJsonLayer(
        this.props as any,
        this.getSubLayerProps({id: 'geojson'}),
        {
          data: (this.props as any).data,
          pickable: false,
          updateTriggers: {
            getFillColor: {water: config.water, waterColor: config.waterColor},
            getLineColor: {adminLines: config.adminLines, adminLinesColor: config.adminLinesColor}
          }
        }
      )
    );

    if (config.labels) {
      layers.push(
        new TextLayer(this.getSubLayerProps({id: 'text'}), {
          data: (this.state as any).labelData,
          parameters: {depthTest: false},
          billboard: true,
          sizeUnits: 'pixels',
          getPosition: (d: any) => d.position,
          getText: (this as any).getSubLayerAccessor(this.getLabel),
          getSize: (this as any).getSubLayerAccessor(this.getLabelSize),
          getColor: () => config.labelsColor,
          pickable: false,
          updateTriggers: {
            getColor: config.labelsColor
          }
        })
      );
    }

    return layers;
  }
}

function getGlobeBasemapMVTLayer({
  mapboxApiAccessToken,
  config,
  styleType,
  isSatellite
}: {
  mapboxApiAccessToken: string;
  config: GlobeConfig;
  styleType: string;
  isSatellite: boolean;
}): any {
  const loadOptions = {
    mvt: {
      layers: isSatellite
        ? ['place_label', 'admin']
        : ['place_label', 'admin', 'water', 'road']
    }
  };

  return new MVTLayer({
    data: `https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v8/{z}/{x}/{y}.vector.pbf?access_token=${mapboxApiAccessToken}`,
    id: `globe-basemap-layer-${styleType}`,
    renderSubLayers: (props: any) => new GlobeMVTSublayer({...props}),
    minZoom: 0,
    maxZoom: 23,
    binary: false,
    pickable: false,
    parameters: BASEMAP_PARAMETERS,
    loadOptions,
    config,
    onTileError: () => {},

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

    lineWidthUnits: 'pixels',
    lineWidthMinPixels: 0,
    lineWidthMaxPixels: 20,
    getPointRadius: 0,
    pointRadiusMinPixels: 0
  } as any);
}

function getCartoRasterFallbackLayer(styleType?: string): any {
  const tileUrl =
    styleType && CARTO_RASTER_TILE_MAP[styleType]
      ? CARTO_RASTER_TILE_MAP[styleType]
      : CARTO_RASTER_TILE_MAP['dark-matter'];

  return new TileLayer({
    id: 'globe-basemap-raster-fallback',
    data: [tileUrl],
    minZoom: 0,
    maxZoom: 19,
    tileSize: 512 / devicePixelRatio,
    pickable: false,
    renderSubLayers: (props: any) => {
      const {
        bbox: {west, south, east, north}
      } = props.tile;
      return [
        new BitmapLayer(props, {
          _imageCoordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
          data: undefined,
          image: props.data,
          bounds: [west, south, east, north],
          pickable: false
        })
      ];
    }
  });
}

export function getGlobeBackgroundLayers({
  globe,
  mapboxApiAccessToken,
  styleType
}: {
  globe: Globe;
  mapboxApiAccessToken: string;
  styleType?: string;
}) {
  const {config} = globe;
  const isSatellite = styleType === 'satellite';
  const isSatelliteStreet = styleType === 'satellite-street';

  const layers: any[] = [];

  // Atmosphere sky layer (rendered first, behind everything)
  if (config.atmosphere) {
    layers.push(getGlobeAtmosphereSkyLayer({config}));
  }

  // Depth disk fills the depth buffer to prevent layer leaking
  layers.push(getGlobeDepthDiskLayer({fillColor: config.surfaceColor}));

  layers.push(
    new SolidPolygonLayer({
      id: 'globe-background',
      data: BACKGROUND_DATA,
      getPolygon: (d: any) => d,
      filled: true,
      pickable: false,
      getFillColor: [...config.surfaceColor, 255] as [number, number, number, number],
      parameters: {
        depthWriteEnabled: false
      }
    })
  );

  layers.push(
    new SolidPolygonLayer({
      id: 'globe-background-north-pole',
      data: BACKGROUND_NORTH_POLE_DATA,
      getPolygon: (d: any) => d,
      filled: true,
      pickable: false,
      getFillColor: config.water
        ? (config.waterColor as [number, number, number, number])
        : ([...config.surfaceColor, 255] as [number, number, number, number]),
      parameters: {
        depthWriteEnabled: false
      }
    })
  );

  if (config.basemap) {
    if ((isSatellite || isSatelliteStreet) && mapboxApiAccessToken) {
      layers.push(
        new TileLayer({
          id: 'globe-basemap-satellite',
          data: [
            `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.png?access_token=${mapboxApiAccessToken}`
          ],
          minZoom: 0,
          maxZoom: 19,
          tileSize: 512 / devicePixelRatio,
          pickable: false,
          onTileError: () => {},
          renderSubLayers: (props: any) => {
            const {
              bbox: {west, south, east, north}
            } = props.tile;
            return [
              new BitmapLayer(props, {
                _imageCoordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
                data: undefined,
                image: props.data,
                bounds: [west, south, east, north],
                pickable: false
              })
            ];
          }
        })
      );
    }

    if (!isSatellite) {
      // CARTO raster tiles as guaranteed fallback
      layers.push(getCartoRasterFallbackLayer(styleType));

      // MVT layer on top for vector features when Mapbox token has v4 API access
      if (mapboxApiAccessToken) {
        layers.push(
          getGlobeBasemapMVTLayer({
            mapboxApiAccessToken,
            config,
            styleType: styleType || 'dark-matter',
            isSatellite: isSatelliteStreet || false
          })
        );
      }
    }
  }

  // Atmosphere overlay (rendered last, on top of everything)
  if (config.atmosphere) {
    layers.push(getGlobeAtmosphereLayer({config}));
  }

  return layers;
}

export function getGlobeClearColor(): [number, number, number, number] {
  return [0.015, 0.035, 0.065, 1.0];
}

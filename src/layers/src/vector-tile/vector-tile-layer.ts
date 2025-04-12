// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {FeatureCollection, Feature} from 'geojson';

import {Layer as DeckLayer} from '@deck.gl/core/typed';
import {_Tile2DHeader as Tile2DHeader} from '@deck.gl/geo-layers/typed';
import {GeoJsonLayer, PathLayer} from '@deck.gl/layers/typed';
import {MVTSource, MVTTileSource} from '@loaders.gl/mvt';
import {PMTilesSource, PMTilesTileSource} from '@loaders.gl/pmtiles';
import GL from '@luma.gl/constants';

import {notNullorUndefined} from '@kepler.gl/common-utils';
import {
  getLoaderOptions,
  DatasetType,
  LAYER_TYPES,
  RemoteTileFormat,
  VectorTileDatasetMetadata,
  SCALE_TYPES,
  CHANNEL_SCALES,
  DEFAULT_COLOR_UI,
  LAYER_VIS_CONFIGS
} from '@kepler.gl/constants';
import {
  getTileUrl,
  KeplerTable as KeplerDataset,
  Datasets as KeplerDatasets,
  GpuFilter,
  VectorTileMetadata
} from '@kepler.gl/table';
import {
  AnimationConfig,
  Field as KeplerField,
  LayerColorConfig,
  LayerHeightConfig,
  Merge,
  MapState,
  BindedLayerCallbacks,
  VisConfigRange,
  VisConfigNumber,
  DomainStops
} from '@kepler.gl/types';
import {DataContainerInterface} from '@kepler.gl/utils';

import {MVTLayer as CustomMVTLayer} from './mvt-layer';
import VectorTileIcon from './vector-tile-icon';
import {
  default as KeplerLayer,
  LayerBaseConfig,
  LayerBaseConfigPartial,
  VisualChannel,
  VisualChannelDomain,
  VisualChannelField
} from '../base-layer';
import {FindDefaultLayerPropsReturnValue} from '../layer-utils';

import AbstractTileLayer, {
  LayerData as CommonLayerData,
  commonTileVisConfigs,
  AbstractTileLayerConfig,
  AbstractTileLayerVisConfigSettings
} from './abstract-tile-layer';
import TileDataset from './common-tile/tile-dataset';
import {
  isDomainStops,
  isDomainQuantiles,
  isIndexedField,
  getPropertyByZoom
} from './common-tile/tile-utils';

export const DEFAULT_HIGHLIGHT_FILL_COLOR = [252, 242, 26, 150];
export const DEFAULT_HIGHLIGHT_STROKE_COLOR = [252, 242, 26, 255];
export const MAX_CACHE_SIZE_MOBILE = 1; // Minimize caching, visible tiles will always be loaded
export const DEFAULT_STROKE_WIDTH = 1;

/**
 * Type for transformRequest returned parameters.
 */
export type RequestParameters = {
  /** The URL to be requested. */
  url: string;
  /** Search parameters to be added onto the URL. */
  searchParams: URLSearchParams;
  /** Options passed to fetch. */
  options: RequestInit;
};

// This type *seems* to be what loaders.gl currently returns for tile content.
// Apparently this might be different depending on the loaders version, and for...
// reasons we use two different versions of loaders right now.
// TODO: The Features[] version should not be needed when we update to a newer
// version of Deck.gl and use only one version of loaders
type TileContent =
  | (FeatureCollection & {shape: 'geojson-table'})
  | (Feature[] & {shape: undefined});

type VectorTile = Tile2DHeader<TileContent>;

type LayerData = CommonLayerData & {
  tilesetDataUrl?: string | null;
  tileSource: MVTTileSource | PMTilesTileSource | null;
};

type VectorTileLayerRenderOptions = Merge<
  {
    idx: number;
    visible: boolean;
    mapState: MapState;
    data: any;
    animationConfig: AnimationConfig;
    gpuFilter: GpuFilter;
    layerCallbacks: BindedLayerCallbacks;
    objectHovered: {
      index: number;
      tile: VectorTile;
      sourceLayer: typeof GeoJsonLayer;
    };
  },
  LayerData
>;

export const vectorTileVisConfigs = {
  ...commonTileVisConfigs,

  stroked: {
    ...LAYER_VIS_CONFIGS.stroked,
    defaultValue: false
  },

  // TODO figure out why strokeColorScale can't be const
  strokeColorScale: 'strokeColorScale' as any,
  strokeColorRange: 'strokeColorRange' as const,

  sizeRange: 'strokeWidthRange' as const,
  strokeWidth: {
    ...LAYER_VIS_CONFIGS.thickness,
    property: 'strokeWidth',
    defaultValue: 0.5,
    allowCustomValue: false
  },

  radiusScale: 'radiusScale' as any,
  radiusRange: {
    ...LAYER_VIS_CONFIGS.radiusRange,
    type: 'number',
    defaultValue: [0, 1],
    isRanged: true,
    range: [0, 1],
    step: 0.01
  } as VisConfigRange
};

export type VectorTileLayerConfig = Merge<
  AbstractTileLayerConfig,
  {
    sizeField?: VisualChannelField;
    sizeScale?: string;
    sizeDomain?: VisualChannelDomain;

    strokeColorField: VisualChannelField;

    radiusField?: VisualChannelField;
    radiusScale?: string;
    radiusDomain?: VisualChannelDomain;
    radiusRange?: any;
  }
>;

export type VectorTileLayerVisConfigSettings = Merge<
  AbstractTileLayerVisConfigSettings,
  {
    sizeRange: VisConfigRange;
    strokeWidth: VisConfigNumber;
  }
>;

export function tileLayerBoundsLayer(id: string, props: {bounds?: number[]}): DeckLayer[] {
  const {bounds} = props;
  if (bounds?.length !== 4) return [];

  const data = [
    {
      path: [
        [bounds[0], bounds[1]],
        [bounds[2], bounds[1]],
        [bounds[2], bounds[3]],
        [bounds[0], bounds[3]],
        [bounds[0], bounds[1]]
      ]
    }
  ];

  const layer = new PathLayer({
    id: `${id}-vector-tile-bounds`,
    data,
    getPath: d => d.path,
    getColor: [128, 128, 128, 255],
    getWidth: 1,
    widthUnits: 'pixels',
    pickable: false
  });

  return [layer];
}

export default class VectorTileLayer extends AbstractTileLayer<VectorTile, Feature[]> {
  declare config: VectorTileLayerConfig;
  declare visConfigSettings: VectorTileLayerVisConfigSettings;

  constructor(props: ConstructorParameters<typeof AbstractTileLayer>[0]) {
    super(props);
    this.registerVisConfig(vectorTileVisConfigs);
    this.tileDataset = this.initTileDataset();
  }

  meta = {};

  static findDefaultLayerProps(dataset: KeplerDataset): FindDefaultLayerPropsReturnValue {
    if (dataset.type !== DatasetType.VECTOR_TILE) {
      return {props: []};
    }
    return super.findDefaultLayerProps(dataset);
  }

  initTileDataset(): TileDataset<VectorTile, Feature[]> {
    return new TileDataset({
      getTileId: (tile: VectorTile): string => tile.id,
      getIterable: (tile: VectorTile): Feature[] => {
        if (tile.content) {
          return tile.content.shape === 'geojson-table' ? tile.content.features : tile.content;
        }
        return [];
      },
      getRowCount: (features: Feature[]): number => features.length,
      getRowValue: this.accessRowValue
    });
  }

  get type(): string {
    return LAYER_TYPES.vectorTile;
  }

  get name(): string {
    return 'Vector Tile';
  }

  get layerIcon(): KeplerLayer['layerIcon'] {
    return VectorTileIcon;
  }

  get supportedDatasetTypes(): DatasetType[] {
    return [DatasetType.VECTOR_TILE];
  }

  get visualChannels(): Record<string, VisualChannel> {
    const visualChannels = super.visualChannels;
    return {
      ...visualChannels,
      strokeColor: {
        property: 'strokeColor',
        field: 'strokeColorField',
        scale: 'strokeColorScale',
        domain: 'strokeColorDomain',
        range: 'strokeColorRange',
        key: 'strokeColor',
        channelScaleType: CHANNEL_SCALES.color,
        accessor: 'getLineColor',
        condition: config => config.visConfig.stroked,
        nullValue: visualChannels.color.nullValue,
        getAttributeValue: config => config.visConfig.strokeColor || config.color
      },
      size: {
        property: 'stroke',
        field: 'sizeField',
        scale: 'sizeScale',
        domain: 'sizeDomain',
        range: 'sizeRange',
        key: 'size',
        channelScaleType: CHANNEL_SCALES.size,
        nullValue: 0,
        accessor: 'getLineWidth',
        condition: config => config.visConfig.stroked,
        getAttributeValue: config => config.visConfig.strokeWidth || DEFAULT_STROKE_WIDTH
      },
      radius: {
        property: 'radius',
        field: 'radiusField',
        scale: 'radiusScale',
        domain: 'radiusDomain',
        range: 'radiusRange',
        key: 'radius',
        channelScaleType: CHANNEL_SCALES.size,
        nullValue: 0,
        getAttributeValue: config => {
          return config.visConfig.radius || config.radius;
        },
        accessor: 'getPointRadius',
        defaultValue: config => config.radius
      }
    };
  }

  getDefaultLayerConfig(
    props: LayerBaseConfigPartial
  ): LayerBaseConfig & Partial<LayerColorConfig & LayerHeightConfig> {
    const defaultLayerConfig = super.getDefaultLayerConfig(props);
    return {
      ...defaultLayerConfig,
      colorScale: SCALE_TYPES.quantize,

      strokeColorField: null,
      strokeColorDomain: [0, 1],
      strokeColorScale: SCALE_TYPES.quantile,
      colorUI: {
        ...defaultLayerConfig.colorUI,
        // @ts-expect-error LayerConfig
        strokeColorRange: DEFAULT_COLOR_UI
      },

      radiusField: null,
      radiusDomain: [0, 1],
      radiusScale: SCALE_TYPES.linear
    };
  }

  getHoverData(
    object: {properties?: Record<string, Record<string, unknown>>},
    dataContainer: DataContainerInterface,
    fields: KeplerField[]
  ): (Record<string, unknown> | null)[] {
    return fields.map(f => object.properties?.[f.name] ?? null);
  }

  calculateLayerDomain(
    dataset: KeplerDataset,
    visualChannel: VisualChannel
  ): DomainStops | number[] {
    const defaultDomain = [0, 1];

    const field = this.config[visualChannel.field];
    const scale = this.config[visualChannel.scale];
    if (!field) {
      // if colorField or sizeField were set back to null
      return defaultDomain;
    }
    if (scale === SCALE_TYPES.quantile && isDomainQuantiles(field?.filterProps?.domainQuantiles)) {
      return field.filterProps.domainQuantiles;
    }
    if (isDomainStops(field?.filterProps?.domainStops)) {
      return field.filterProps.domainStops;
    } else if (Array.isArray(field?.filterProps?.domain)) {
      return field.filterProps.domain;
    }

    return defaultDomain;
  }

  getScaleOptions(channelKey: string): string[] {
    let options = KeplerLayer.prototype.getScaleOptions.call(this, channelKey);

    const channel = this.visualChannels.strokeColor;
    const field = this.config[channel.field];
    if (
      !(
        isDomainQuantiles(field?.filterProps?.domainQuantiles) ||
        this.config.visConfig.dynamicColor ||
        // If we've set the scale to quantile, we need to include it - there's a loading
        // period in which the visConfig isn't set yet, but if we don't return the right
        // scale type we lose it
        this.config.colorScale === SCALE_TYPES.quantile
      )
    ) {
      options = options.filter(scale => scale !== SCALE_TYPES.quantile);
    }

    return options;
  }

  accessRowValue(
    field?: KeplerField,
    indexKey?: number | null
  ): (field: KeplerField, datum: Feature) => number | null {
    // if is indexed field
    if (isIndexedField(field) && indexKey !== null) {
      const fieldName = indexKey && field?.indexBy?.mappedValue[indexKey];
      if (fieldName) {
        return (f, datum) => {
          if (datum.properties) {
            return datum.properties[fieldName];
          }
          // TODO debug this with indexed tiled dataset
          return datum[fieldName];
        };
      }
    }

    // default
    return (f, datum) => {
      if (f && datum.properties) {
        return datum.properties[f.name];
      }
      // support picking & highlighting
      return f ? datum[f.fieldIdx] : null;
    };
  }

  updateLayerMeta(dataset: KeplerDataset, datasets: KeplerDatasets): void {
    if (dataset.type !== DatasetType.VECTOR_TILE) {
      return;
    }

    const datasetMeta = dataset.metadata as VectorTileMetadata & VectorTileDatasetMetadata;
    this.updateMeta({
      datasetId: dataset.id,
      datasets,
      bounds: datasetMeta.bounds
    });
  }

  formatLayerData(
    datasets: KeplerDatasets,
    oldLayerData: unknown,
    animationConfig: AnimationConfig
  ): LayerData {
    const {dataId} = this.config;
    if (!notNullorUndefined(dataId)) {
      return {tileSource: null};
    }
    const dataset = datasets[dataId];

    let tilesetDataUrl: string | undefined;
    let tileSource: LayerData['tileSource'] = null;

    if (dataset?.type === DatasetType.VECTOR_TILE) {
      const datasetMetadata = dataset.metadata as VectorTileMetadata & VectorTileDatasetMetadata;
      const remoteTileFormat = datasetMetadata?.remoteTileFormat;
      if (remoteTileFormat === RemoteTileFormat.MVT) {
        const transformFetch = async (input: RequestInfo | URL, init?: RequestInit | undefined) => {
          const requestData: RequestParameters = {
            url: input as string,
            searchParams: new URLSearchParams(),
            options: init ?? {}
          };

          return fetch(requestData.url, requestData.options);
        };

        tilesetDataUrl = datasetMetadata?.tilesetDataUrl;
        tileSource = tilesetDataUrl
          ? MVTSource.createDataSource(decodeURIComponent(tilesetDataUrl), {
              mvt: {
                metadataUrl: datasetMetadata?.tilesetMetadataUrl ?? null,
                loadOptions: {
                  fetch: transformFetch
                }
              }
            })
          : null;
      } else if (remoteTileFormat === RemoteTileFormat.PMTILES) {
        // TODO: to render image pmtiles need to use TileLayer and BitmapLayer (https://github.com/visgl/loaders.gl/blob/master/examples/website/tiles/components/tile-source-layer.ts)
        tilesetDataUrl = datasetMetadata?.tilesetDataUrl;
        tileSource = tilesetDataUrl ? PMTilesSource.createDataSource(tilesetDataUrl, {}) : null;
      }
    }

    return {
      ...super.formatLayerData(datasets, oldLayerData, animationConfig),
      tilesetDataUrl: typeof tilesetDataUrl === 'string' ? getTileUrl(tilesetDataUrl) : null,
      tileSource
    };
  }

  hasHoveredObject(objectInfo) {
    if (super.hasHoveredObject(objectInfo)) {
      const features = objectInfo?.tile?.content?.features;
      return features[objectInfo.index];
    }
    return null;
  }

  renderSubLayers(props: Record<string, any>): DeckLayer | DeckLayer[] {
    let {data} = props;

    data = data?.shape === 'geojson-table' ? data.features : data;
    if (!data?.length) {
      return [];
    }

    const tile: Tile2DHeader = props.tile;
    const zoom = tile.index.z;

    return new GeoJsonLayer({
      ...props,
      data,
      getFillColor: props.getFillColorByZoom ? props.getFillColor(zoom) : props.getFillColor,
      getElevation: props.getElevationByZoom ? props.getElevation(zoom) : props.getElevation,
      // radius for points
      pointRadiusScale: props.pointRadiusScale, // props.getPointRadiusScaleByZoom(zoom),
      pointRadiusUnits: props.pointRadiusUnits,
      getPointRadius: props.getPointRadius,
      // For some reason tile Layer reset autoHighlight to false
      pickable: true,
      autoHighlight: true,
      stroked: props.stroked,
      // wrapLongitude: true causes missing side polygon when extrude is enabled
      wrapLongitude: false
    });
  }

  // generate a deck layer
  renderLayer(opts: VectorTileLayerRenderOptions): DeckLayer[] {
    const {mapState, data, animationConfig, gpuFilter, objectHovered, layerCallbacks} = opts;
    const {animation, visConfig} = this.config;

    this.setLayerDomain = layerCallbacks.onSetLayerDomain;

    const defaultLayerProps = this.getDefaultDeckLayerProps(opts);
    const eleZoomFactor = this.getElevationZoomFactor(mapState);

    const transitions = this.config.visConfig.transition
      ? {
          getFillColor: {
            duration: animationConfig.duration
          },
          getElevation: {
            duration: animationConfig.duration
          }
        }
      : undefined;

    const colorField = this.config.colorField as KeplerField;
    const heightField = this.config.heightField as KeplerField;
    const strokeColorField = this.config.strokeColorField as KeplerField;
    const sizeField = this.config.sizeField as KeplerField;
    const radiusField = this.config.radiusField as KeplerField;

    if (data.tileSource) {
      const hoveredObject = this.hasHoveredObject(objectHovered);

      const layers = [
        new CustomMVTLayer({
          ...defaultLayerProps,
          ...data,
          onViewportLoad: this.onViewportLoad,
          data: data.tilesetDataUrl,
          getTileData: data.tileSource?.getTileData,
          tileSource: data.tileSource,
          getFilterValue: this.getGpuFilterValueAccessor(opts),
          filterRange: gpuFilter.filterRange,
          lineWidthUnits: 'pixels',

          binary: false,
          elevationScale: visConfig.elevationScale * eleZoomFactor,
          extruded: visConfig.enable3d,
          stroked: visConfig.stroked,

          // TODO: this is hard coded, design a UI to allow user assigned unique property id
          // uniqueIdProperty: 'ufid',
          renderSubLayers: this.renderSubLayers,
          // when radiusUnits is meter
          getPointRadiusScaleByZoom: getPropertyByZoom(visConfig.radiusByZoom, visConfig.radius),
          pointRadiusUnits: visConfig.radiusUnits ? 'pixels' : 'meters',
          pointRadiusScale: radiusField ? visConfig.radius : 1,

          pointRadiusMinPixels: 1,
          autoHighlight: true,
          highlightColor: DEFAULT_HIGHLIGHT_FILL_COLOR,
          pickable: true,
          transitions,
          updateTriggers: {
            getFilterValue: {
              ...gpuFilter.filterValueUpdateTriggers,
              currentTime: animation.enabled ? animationConfig.currentTime : null
            },
            getFillColor: {
              color: this.config.color,
              colorField: this.config.colorField,
              colorScale: this.config.colorScale,
              colorDomain: this.config.colorDomain,
              colorRange: visConfig.colorRange,
              currentTime: isIndexedField(colorField) ? animationConfig.currentTime : null
            },
            getElevation: {
              heightField: this.config.heightField,
              heightScaleType: this.config.heightScale,
              heightRange: visConfig.heightRange,
              currentTime: isIndexedField(heightField) ? animationConfig.currentTime : null
            },
            getLineColor: {
              strokeColor: visConfig.strokeColor,
              strokeColorField: this.config.strokeColorField,
              // @ts-expect-error prop not in LayerConfig
              strokeColorScale: this.config.strokeColorScale,
              // @ts-expect-error prop not in LayerConfig
              strokeColorDomain: this.config.strokeColorDomain,
              // FIXME: Strip out empty arrays from individual color map steps, and replace with `null`, otherwise the layer may show the incorrect color.
              // So far it seems that it uses the previous color chosen in the palette rather than the currently chosen color for the specific custom ordinal value when there are "sparse" color maps.
              // In other words, a color map with "holes" of colors with unassigned field values, which may have been assigned in the past.
              // For example "abc" was green, stored as `["abc"]`. Then "abc" was reassigned to the red color map step, stored as `["abc"]`. Now the green color map step's stored value is `[]`, and the layer will incorrectly still render "abc" in green.
              // Quick patch example:
              // strokeColorRange: visConfig?.strokeColorRange?.colorMap?.map(cm =>
              //   cm[0]?.length === 0 ? [null, cm[1]] : cm
              // ),
              // Note: for regular scales the colorMap in the above patch is undefined and breaks strokeColorRange update trigger.
              strokeColorRange: visConfig.strokeColorRange,
              currentTime: isIndexedField(strokeColorField) ? animationConfig.currentTime : null
            },
            getLineWidth: {
              sizeRange: visConfig.sizeRange,
              strokeWidth: visConfig.strokeWidth,
              sizeField: this.config.sizeField,
              sizeScale: this.config.sizeScale,
              sizeDomain: this.config.sizeDomain,
              currentTime: isIndexedField(sizeField) ? animationConfig.currentTime : null
            },
            getPointRadius: {
              radius: visConfig.radius,
              radiusField: this.config.radiusField,
              radiusScale: this.config.radiusScale,
              radiusDomain: this.config.radiusDomain,
              radiusRange: this.config.radiusRange,
              currentTime: isIndexedField(radiusField) ? animationConfig.currentTime : null
            }
          },
          _subLayerProps: {
            'polygons-stroke': {opacity: visConfig.strokeOpacity},
            'polygons-fill': {
              parameters: {
                cullFace: GL.BACK
              }
            }
          },
          loadOptions: {
            mvt: getLoaderOptions().mvt
          }
        }),
        // hover layer
        ...(hoveredObject
          ? [
              new GeoJsonLayer({
                // @ts-expect-error props not typed?
                ...objectHovered.sourceLayer?.props,
                ...(this.getDefaultHoverLayerProps() as any),
                visible: true,
                wrapLongitude: false,
                data: [hoveredObject],
                getLineColor: DEFAULT_HIGHLIGHT_STROKE_COLOR,
                getFillColor: DEFAULT_HIGHLIGHT_FILL_COLOR,
                getLineWidth: visConfig.strokeWidth + 1,
                lineWidthUnits: 'pixels',
                stroked: true,
                filled: true
              })
            ]
          : [])
        // ...tileLayerBoundsLayer(defaultLayerProps.id, data),
      ];

      return layers;
    }
    return [];
  }
}

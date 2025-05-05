// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import throttle from 'lodash/throttle';

import {notNullorUndefined} from '@kepler.gl/common-utils';
import {SCALE_TYPES, ALL_FIELD_TYPES, LAYER_VIS_CONFIGS} from '@kepler.gl/constants';
import {
  isTileDataset,
  KeplerTable as KeplerDataset,
  Datasets as KeplerDatasets,
  GpuFilter
} from '@kepler.gl/table';
import {
  AnimationConfig,
  Field,
  BindedLayerCallbacks,
  VisConfigBoolean,
  VisConfigRange,
  VisConfigColorRange,
  VisConfigNumber,
  VisConfigColorSelect,
  LayerColorConfig,
  LayerHeightConfig,
  Filter,
  Field as KeplerField,
  MapState,
  Merge,
  ZoomStopsConfig
} from '@kepler.gl/types';
import {findDefaultColorField, DataContainerInterface} from '@kepler.gl/utils';

import {
  default as KeplerLayer,
  LayerBaseConfig,
  LayerBaseConfigPartial,
  VisualChannel,
  VisualChannelDomain,
  VisualChannelField
} from '../base-layer';
import TileDataset from './common-tile/tile-dataset';
import {isIndexedField, isDomainQuantiles} from './common-tile/tile-utils';
import {FindDefaultLayerPropsReturnValue} from '../layer-utils';

const DEFAULT_ELEVATION = 500;
export const DEFAULT_RADIUS = 1;

export type AbstractTileLayerVisConfigSettings = {
  strokeColor: VisConfigColorSelect;
  strokeOpacity: VisConfigNumber;
  radius: VisConfigNumber;
  radiusUnits: VisConfigBoolean;
  enable3d: VisConfigBoolean;
  stroked: VisConfigBoolean;
  transition: VisConfigBoolean;
  heightRange: VisConfigRange;
  elevationScale: VisConfigNumber;
  opacity: VisConfigNumber;
  colorRange: VisConfigColorRange;
  // TODO: figure out type for radiusByZoom vis config
  radiusByZoom: any;
  dynamicColor: VisConfigBoolean;
};

export type LayerData = {
  minZoom?: number;
  maxZoom?: number;
  bounds?: number[];
  getPointRadius?: () => number;
};

export type LayerOpts = {
  idx: number;
  mapState: MapState;
  data: LayerData;
  gpuFilter: GpuFilter;
  animationConfig: AnimationConfig;
  tilesetDataUrl?: string | null;
  layerCallbacks: BindedLayerCallbacks;
};

export const commonTileVisConfigs = {
  strokeColor: 'strokeColor' as const,
  strokeOpacity: {
    ...LAYER_VIS_CONFIGS.opacity,
    property: 'strokeOpacity'
  },
  radius: {
    ...LAYER_VIS_CONFIGS.radius,
    range: [0.1, 100],
    step: 0.1,
    defaultValue: DEFAULT_RADIUS,
    allowCustomValue: false
  } as VisConfigNumber,
  radiusUnits: {
    type: 'boolean',
    defaultValue: true,
    label: 'Radius in pixels',
    group: '',
    property: 'radiusUnits',
    description: 'Radius in pixels or in meters'
  } as VisConfigBoolean,
  enable3d: 'enable3d' as const,
  stroked: {
    ...LAYER_VIS_CONFIGS.stroked,
    defaultValue: false
  },
  transition: {
    type: 'boolean',
    defaultValue: false,
    label: 'Transition',
    group: '',
    property: 'transition',
    description:
      'Smoother transition during animation (enable transition will decrease performance)'
  } as VisConfigBoolean,
  heightRange: 'elevationRange' as const,
  elevationScale: {...LAYER_VIS_CONFIGS.elevationScale, allowCustomValue: false},
  opacity: 'opacity' as const,
  colorRange: 'colorRange' as const,
  // TODO: figure out type for radiusByZoom vis config
  radiusByZoom: {
    ...LAYER_VIS_CONFIGS.radius,
    defaultValue: {
      enabled: false,
      stops: null
    } as ZoomStopsConfig
  } as any,
  dynamicColor: {
    type: 'boolean',
    defaultValue: false,
    label: 'Dynamic Color',
    group: '',
    property: 'dynamicColor',
    description: 'Use a dynamic color scale based on data visible in the viewport'
  } as VisConfigBoolean
};

export type AbstractTileLayerConfig = Merge<
  LayerBaseConfig,
  {colorField?: VisualChannelField; colorScale?: string; colorDomain?: VisualChannelDomain}
>;

/**
 * Abstract tile layer, including common functionality for viewport-based datasets,
 * dynamic scales, and tile-based animation
 */
export default abstract class AbstractTileLayer<
  // Type of the tile itself
  T,
  // Type of the iterable data object
  I extends Iterable<any> = T extends Iterable<any> ? T : never
> extends KeplerLayer {
  declare config: AbstractTileLayerConfig;
  declare visConfigSettings: AbstractTileLayerVisConfigSettings;

  constructor(props: ConstructorParameters<typeof KeplerLayer>[0]) {
    super(props);
    this.registerVisConfig(commonTileVisConfigs);
    this.tileDataset = this.initTileDataset();
  }

  protected tileDataset: TileDataset<T, I>;
  protected setLayerDomain: BindedLayerCallbacks['onSetLayerDomain'] = undefined;

  protected abstract initTileDataset(): TileDataset<T, I>;

  static findDefaultLayerProps(dataset: KeplerDataset): FindDefaultLayerPropsReturnValue {
    if (!isTileDataset(dataset)) {
      return {props: []};
    }

    const newLayerProp = {
      dataId: dataset.id,
      label: dataset.label,
      isVisible: true
    };

    return {props: [newLayerProp]};
  }

  get requireData(): boolean {
    return true;
  }

  get requiredLayerColumns(): string[] {
    return [];
  }

  get visualChannels(): Record<string, VisualChannel> {
    return {
      color: {
        ...super.visualChannels.color,
        accessor: 'getFillColor',
        defaultValue: config => config.color
      },
      height: {
        property: 'height',
        field: 'heightField',
        scale: 'heightScale',
        domain: 'heightDomain',
        range: 'heightRange',
        key: 'height',
        channelScaleType: 'size',
        accessor: 'getElevation',
        condition: config => config.visConfig.enable3d,
        nullValue: 0,
        defaultValue: DEFAULT_ELEVATION
      }
    };
  }

  /**
   * Callback to invoke when the viewport changes
   */
  onViewportLoad = (tiles: T[]): void => {
    this.tileDataset.updateTiles(tiles);
    // Update dynamic color domain if required
    if (this.config.visConfig.dynamicColor) {
      this.setDynamicColorDomain();
    }
  };

  abstract accessRowValue(
    field?: KeplerField,
    indexKey?: number | null
  ): (field: KeplerField, datum: T extends Iterable<infer V> ? V : never) => string | number | null;

  accessVSFieldValue(inputField?: Field, indexKey?: number | null): any {
    return this.accessRowValue(inputField, indexKey);
  }

  getScaleOptions(channelKey: string): string[] {
    if (channelKey === 'color') {
      const channel = this.visualChannels.color;
      const field = this.config[channel.field];

      if (
        isDomainQuantiles(field?.filterProps?.domainQuantiles) ||
        this.config.visConfig.dynamicColor ||
        // If we've set the scale to quantile, we need to include it - there's a loading
        // period in which the visConfig isn't set yet, but if we don't return the right
        // scale type we lose it
        this.config.colorScale === SCALE_TYPES.quantile
      ) {
        return [SCALE_TYPES.quantize, SCALE_TYPES.quantile, SCALE_TYPES.custom];
      }
      return [SCALE_TYPES.quantize, SCALE_TYPES.custom];
    }

    return [SCALE_TYPES.linear];
  }

  setDynamicColorDomain = throttle((): void => {
    const {config, tileDataset, setLayerDomain} = this;
    const field = config.colorField;
    const {colorDomain, colorScale} = config;
    if (!tileDataset || !setLayerDomain || !field) return;

    if (colorScale === SCALE_TYPES.quantize) {
      const [min, max] = tileDataset.getExtent(field);
      if (!Array.isArray(colorDomain) || min !== colorDomain[0] || max !== colorDomain[1]) {
        setLayerDomain({domain: [min, max]});
      }
    } else if (colorScale === SCALE_TYPES.quantile) {
      const domain = tileDataset.getQuantileSample(field);
      setLayerDomain({domain});
    } else if (colorScale === SCALE_TYPES.ordinal) {
      const domain = tileDataset.getUniqueValues(field);
      setLayerDomain({domain});
    }
  }, 500);

  resetColorDomain(): void {
    const {datasetId, datasets} = this.meta;
    this.updateLayerVisualChannel(datasets?.[datasetId || ''], 'color');
    this.setLayerDomain?.({domain: this.config.colorDomain});
  }

  updateLayerConfig(
    newConfig: Partial<LayerBaseConfig> & Partial<LayerColorConfig>
  ): AbstractTileLayer<T, I> {
    // When the dynamic color setting changes, we need to recalculate the layer domain
    const old = this.config.visConfig.dynamicColor ?? false;
    const next = newConfig.visConfig?.dynamicColor ?? old;
    const scaleTypeChanged =
      newConfig.colorScale && this.config.colorScale !== newConfig.colorScale;

    super.updateLayerConfig(newConfig);
    const {colorField} = this.config;

    if (colorField) {
      // When we switch from dynamic to non-dynamic or vice versa, we need to update
      // the color domain. This is downstream from a dispatch call, so we use
      // setTimeout to avoid "reducers may not dispatch actions" errors
      if (next && (!old || scaleTypeChanged)) {
        setTimeout(() => this.setDynamicColorDomain(), 0);
      } else if (old && !next) {
        setTimeout(() => this.resetColorDomain(), 0);
      }
    }

    return this;
  }

  get animationDomain(): [number, number] | null | undefined {
    return this.config.animation.domain;
  }

  setInitialLayerConfig(dataset: KeplerDataset): AbstractTileLayer<T, I> {
    const defaultColorField = findDefaultColorField(dataset);

    if (defaultColorField) {
      this.updateLayerConfig({
        colorField: defaultColorField
      });
      this.updateLayerVisualChannel(dataset, 'color');
    }

    return this;
  }

  getDefaultLayerConfig(
    props: LayerBaseConfigPartial
  ): LayerBaseConfig & Partial<LayerColorConfig & LayerHeightConfig> {
    return {
      ...super.getDefaultLayerConfig(props),
      colorScale: SCALE_TYPES.quantize,

      // add height visual channel
      heightField: null,
      heightDomain: [0, 1],
      heightScale: 'linear'
    };
  }

  // We can render without columns, so we redefine this method
  shouldRenderLayer(): boolean {
    return Boolean(this.type && this.config.isVisible);
  }

  updateAnimationDomainByField(channel: string): void {
    const field = this.config[this.visualChannels[channel].field];

    if (isIndexedField(field) && field.indexBy.type === ALL_FIELD_TYPES.timestamp) {
      const {timeDomain} = field.indexBy;

      this.updateLayerConfig({
        animation: {
          ...timeDomain,
          enabled: true,
          startTime: timeDomain.domain[0]
        }
      });
    }
  }

  updateAnimationDomain(domain: [number, number] | null | undefined): void {
    this.updateLayerConfig({
      animation: {
        ...this.config.animation,
        domain
      }
    });
  }

  updateLayerDomain(datasets: KeplerDatasets, newFilter?: Filter): AbstractTileLayer<T, I> {
    super.updateLayerDomain(datasets, newFilter);
    if (newFilter) {
      // invalidate cachedVisibleDataset when e.g. changing filters
      this.tileDataset.invalidateCache();
    }
    Object.keys(this.visualChannels).forEach(channel => {
      this.updateAnimationDomainByField(channel);
    });
    return this;
  }

  updateLayerVisualChannel(dataset: KeplerDataset, channel: string): void {
    super.updateLayerVisualChannel(dataset, channel);

    // create animation if field is indexed by time
    this.updateAnimationDomainByField(channel);
  }

  formatLayerData(
    datasets: KeplerDatasets,
    oldLayerData: unknown,
    animationConfig: AnimationConfig
  ): LayerData {
    const {dataId} = this.config;
    if (!notNullorUndefined(dataId)) {
      return {};
    }
    const dataset = datasets[dataId];

    const dataUpdateTriggers = this.getDataUpdateTriggers(dataset);
    const triggerChanged = this.getChangedTriggers(dataUpdateTriggers);

    if (triggerChanged && triggerChanged.getMeta) {
      this.updateLayerMeta(dataset, datasets);
    }

    const indexKey = this.config.animation.enabled ? animationConfig.currentTime : null;
    const accessors = this.getAttributeAccessors({
      dataAccessor: () => d => d,
      dataContainer: dataset.dataContainer,
      indexKey
    });

    const metadata = dataset?.metadata as LayerData | undefined;
    const metadataToData = metadata
      ? {
          minZoom: metadata.minZoom,
          maxZoom: metadata.maxZoom,
          bounds: metadata.bounds
        }
      : {};

    return {
      ...metadataToData,
      ...accessors
    };
  }

  getGpuFilterValueAccessor({gpuFilter, animationConfig}: LayerOpts): any {
    const indexKey = this.config.animation.enabled ? animationConfig.currentTime : null;
    const valueAccessor = (dataContainer: DataContainerInterface, d) => field =>
      this.accessVSFieldValue(field, indexKey)(field, d);
    return gpuFilter.filterValueAccessor(null as any)(undefined, valueAccessor);
  }
}

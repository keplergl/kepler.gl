// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import pick from 'lodash.pick';
import {VERSIONS} from './versions';
import {LAYER_VIS_CONFIGS, FILTER_VIEW_TYPES} from '@kepler.gl/constants';
import {isFilterValidToSave, notNullorUndefined, findById} from '@kepler.gl/utils';
import Schema from './schema';
import cloneDeep from 'lodash.clonedeep';
import {
  AddDataToMapOptions,
  AnimationConfig,
  Editor,
  FileLoading,
  FileLoadingProgress,
  Filter,
  InteractionConfig,
  MapInfo,
  ParsedFilter,
  ParsedLayer,
  ParsedVisState,
  SavedFilter,
  MinSavedFilter,
  SavedInteractionConfig,
  SavedLayer,
  MinSavedLayer,
  SavedVisState,
  SplitMap,
  ValueOf,
  Effect
} from '@kepler.gl/types';
import {Datasets} from '@kepler.gl/table';
import {Layer, LayerClassesType} from '@kepler.gl/layers';
import {Loader} from '@loaders.gl/loader-utils';
import KeplerGLSchema from './schema-manager';

/**
 * V0 Schema
 */

export const dimensionPropsV0 = ['name', 'type'];

export type modifiedType = {
  strokeColor?: any;
  strokeColorRange?: any;
  filled?: boolean;
  stroked?: boolean;
};

export interface VisState {
  mapInfo: MapInfo;
  layers: Layer[];
  layerData: any[];
  layerToBeMerged: any[];
  layerOrder: string[];
  effects: Effect[];
  effectOrder: string[];
  filters: Filter[];
  filterToBeMerged: any[];
  datasets: Datasets;
  editingDataset: string | undefined;
  interactionConfig: InteractionConfig;
  interactionToBeMerged: any;
  layerBlending: string;
  overlayBlending?: string;
  hoverInfo: any;
  clicked: any;
  mousePos: any;
  maxDefaultTooltips: number;
  layerClasses: LayerClassesType;
  animationConfig: AnimationConfig;
  editor: Editor;
  splitMaps: SplitMap[];
  splitMapsToBeMerged: SplitMap[];
  fileLoading: FileLoading | false;
  fileLoadingProgress: FileLoadingProgress;
  loaders: Loader[];
  loadOptions: object;
  initialState?: Partial<VisState>;
  mergers: VisStateMergers<any>;
  schema: typeof KeplerGLSchema;
  preserveLayerOrder?: string[];
  preserveFilterOrder?: string[];
  preserveDatasetOrder?: string[];
  isMergingDatasets: {
    [datasetId: string]: boolean;
  };
}

export type PostMergerPayload = {
  newDataIds: string[];
  options?: AddDataToMapOptions;
  layerMergers?: Merger<any>[];
};
export type MergerActionPayload<S extends object> = {
  mergers: Merger<S>[];
  postMergerPayload: PostMergerPayload;
};
export type MergerMergeFunc<S extends object> = (
  state: S,
  config: any,
  fromConfig: boolean,
  mergerActionPayload?: MergerActionPayload<S>
) => S;
export type ReplaceParentDatasetIdsFunc<T> = (
  item: T,
  dataId: string,
  dataIdToReplace: string
) => T | null;
export type Merger<S extends object> = {
  merge: MergerMergeFunc<S>;
  prop: string | string[];
  toMergeProp?: string | string[];
  preserveOrder?: string;
  waitToFinish?: boolean;
  waitForLayerData?: boolean;
  replaceParentDatasetIds?: ReplaceParentDatasetIdsFunc<ValueOf<S>>;
  saveUnmerged?: (state: S, unmerged: any) => S;
  getChildDatasetIds?: any;
};
export type VisStateMergers<S extends object> = Merger<S>[];

// in v0 geojson there is only sizeField

// in v1 geojson
// stroke base on -> sizeField
// height based on -> heightField
// radius based on -> radiusField
// here we make our wiredst guess on which channel sizeField belongs to
function geojsonSizeFieldV0ToV1(config) {
  const defaultRaiuds = 10;
  const defaultRadiusRange = [0, 50];

  // if extruded, sizeField is most likely used for height
  if (config.visConfig.extruded) {
    return 'heightField';
  }

  // if show stroke enabled, sizeField is most likely used for stroke
  if (config.visConfig.stroked) {
    return 'sizeField';
  }

  // if radius changed, or radius Range Changed, sizeField is most likely used for radius
  // this is the most unreliable guess, that's why we put it in the end
  if (
    config.visConfig.radius !== defaultRaiuds ||
    config.visConfig.radiusRange.some((d, i) => d !== defaultRadiusRange[i])
  ) {
    return 'radiusField';
  }

  return 'sizeField';
}

// convert v0 to v1 layer config
class DimensionFieldSchemaV0 extends Schema {
  version = VERSIONS.v0;
  save(field) {
    // should not be called anymore
    return {
      [this.key]: field !== null ? this.savePropertiesOrApplySchema(field)[this.key] : null
    };
  }

  load(field, parents, accumulated) {
    const [config] = parents.slice(-1);
    let fieldName = this.key;
    if (config.type === 'geojson' && this.key === 'sizeField' && field) {
      fieldName = geojsonSizeFieldV0ToV1(config);
    }
    // fold into visualChannels to be load by VisualChannelSchemaV1
    return {
      visualChannels: {
        ...(accumulated.visualChannels || {}),
        [fieldName]: field
      }
    };
  }
}

class DimensionScaleSchemaV0 extends Schema {
  version = VERSIONS.v0;
  save(scale) {
    return {[this.key]: scale};
  }
  load(scale, parents, accumulated) {
    const [config] = parents.slice(-1);
    // fold into visualChannels to be load by VisualChannelSchemaV1
    if (this.key === 'sizeScale' && config.type === 'geojson') {
      // sizeScale now split into radiusScale, heightScale
      // no user customization, just use default
      return {};
    }

    return {
      visualChannels: {
        ...(accumulated.visualChannels || {}),
        [this.key]: scale
      }
    };
  }
}

// used to convert v0 to v1 layer config
class LayerConfigSchemaV0 extends Schema {
  version = VERSIONS.v0;
  load(saved, parents, accumulated) {
    // fold v0 layer property into config.key
    return {
      config: {
        ...(accumulated.config || {}),
        [this.key]: saved
      }
    };
  }
}

// used to convert v0 to v1 layer columns
// only return column value for each column
class LayerColumnsSchemaV0 extends Schema {
  version = VERSIONS.v0;
  load(saved, parents, accumulated) {
    // fold v0 layer property into config.key, flatten columns
    return {
      config: {
        ...(accumulated.config || {}),
        columns: Object.keys(saved).reduce(
          (accu, key) => ({
            ...accu,
            [key]: saved[key].value
          }),
          {}
        )
      }
    };
  }
}

// used to convert v0 to v1 layer config.visConfig
class LayerConfigToVisConfigSchemaV0 extends Schema {
  version = VERSIONS.v0;
  load(saved, parents, accumulated) {
    // fold v0 layer property into config.visConfig
    const accumulatedConfig = accumulated.config || {};
    return {
      config: {
        ...accumulatedConfig,
        visConfig: {
          ...(accumulatedConfig.visConfig || {}),
          [this.key]: saved
        }
      }
    };
  }
}

class LayerVisConfigSchemaV0 extends Schema {
  version = VERSIONS.v0;
  key = 'visConfig';

  load(visConfig, parents, accumulator) {
    const [config] = parents.slice(-1);
    const rename = {
      geojson: {
        extruded: 'enable3d',
        elevationRange: 'heightRange'
      }
    };

    if (config.type in rename) {
      const propToRename = rename[config.type];
      return {
        config: {
          ...(accumulator.config || {}),
          visConfig: Object.keys(visConfig).reduce(
            (accu, key) => ({
              ...accu,
              ...(propToRename[key]
                ? {[propToRename[key]]: visConfig[key]}
                : {[key]: visConfig[key]})
            }),
            {}
          )
        }
      };
    }

    return {
      config: {
        ...(accumulator.config || {}),
        visConfig
      }
    };
  }
}

class LayerConfigSchemaDeleteV0 extends Schema {
  version = VERSIONS.v0;
  load() {
    return {};
  }
}

/**
 * V0 -> V1 Changes
 * - layer is now a class
 * - config saved in a config object
 * - id, type, isAggregated is outside layer.config
 * - visualChannels is outside config, it defines available visual channel and
 *   property names for field, scale, domain and range of each visual chanel.
 * - enable3d, colorAggregation and sizeAggregation are moved into visConfig
 * - GeojsonLayer - added height, radius specific properties
 */

export const layerPropsV0 = {
  id: null,
  type: null,

  // move into layer.config
  dataId: new LayerConfigSchemaV0({key: 'dataId'}),
  label: new LayerConfigSchemaV0({key: 'label'}),
  color: new LayerConfigSchemaV0({key: 'color'}),
  isVisible: new LayerConfigSchemaV0({key: 'isVisible'}),
  hidden: new LayerConfigSchemaV0({key: 'hidden'}),

  // convert visConfig
  visConfig: new LayerVisConfigSchemaV0({key: 'visConfig'}),

  // move into layer.config
  // flatten
  columns: new LayerColumnsSchemaV0(),

  // save into visualChannels
  colorField: new DimensionFieldSchemaV0({
    properties: dimensionPropsV0,
    key: 'colorField'
  }),
  colorScale: new DimensionScaleSchemaV0({
    key: 'colorScale'
  }),
  sizeField: new DimensionFieldSchemaV0({
    properties: dimensionPropsV0,
    key: 'sizeField'
  }),
  sizeScale: new DimensionScaleSchemaV0({
    key: 'sizeScale'
  }),

  // move into config.visConfig
  enable3d: new LayerConfigToVisConfigSchemaV0({key: 'enable3d'}),
  colorAggregation: new LayerConfigToVisConfigSchemaV0({
    key: 'colorAggregation'
  }),
  sizeAggregation: new LayerConfigToVisConfigSchemaV0({key: 'sizeAggregation'}),

  // delete
  isAggregated: new LayerConfigSchemaDeleteV0()
};

/**
 * V1 Schema
 */
class ColumnSchemaV1 extends Schema {
  save(columns) {
    // starting from v1, only save column value
    // fieldIdx will be calculated during merge
    return {
      [this.key]: Object.keys(columns).reduce(
        (accu, ckey) => ({
          ...accu,
          // if value is null, don't save it
          ...(columns[ckey]?.value ? {[ckey]: columns[ckey].value} : {})
        }),
        {}
      )
    };
  }

  load(columns) {
    return {columns};
  }
}

class TextLabelSchemaV1 extends Schema {
  save(textLabel) {
    return {
      [this.key]: textLabel.map(tl => ({
        ...tl,
        field: tl.field ? pick(tl.field, ['name', 'type']) : null
      }))
    };
  }

  load(textLabel) {
    return {textLabel: Array.isArray(textLabel) ? textLabel : [textLabel]};
  }
}

const visualChannelModificationV1 = {
  geojson: (vc, parents) => {
    const [layer] = parents.slice(-1);
    const isOld = !Object.prototype.hasOwnProperty.call(vc, 'strokeColorField');
    // make our best guess if this geojson layer contains point
    const isPoint =
      vc.radiusField || layer.config.visConfig.radius !== LAYER_VIS_CONFIGS.radius?.defaultValue;

    if (isOld && !isPoint && layer.config.visConfig.stroked) {
      // if stroked is true, copy color config to stroke color config
      return {
        strokeColorField: vc.colorField,
        strokeColorScale: vc.colorScale
      };
    }
    return {};
  }
};
/**
 * V1: save [field]: {name, type}, [scale]: '' for each channel
 */
class VisualChannelSchemaV1 extends Schema {
  save(visualChannels, parents) {
    // only save field and scale of each channel
    const [layer] = parents.slice(-1);
    return {
      [this.key]: Object.keys(visualChannels).reduce(
        //  save channel to null if didn't select any field
        (accu, key) => ({
          ...accu,
          [visualChannels[key].field]: layer.config[visualChannels[key].field]
            ? pick(layer.config[visualChannels[key].field], ['name', 'type'])
            : null,
          [visualChannels[key].scale]: layer.config[visualChannels[key].scale]
        }),
        {}
      )
    };
  }
  load(vc, parents, accumulator) {
    // fold channels into config
    const [layer] = parents.slice(-1);
    const modified = visualChannelModificationV1[layer.type]
      ? visualChannelModificationV1[layer.type](vc, parents, accumulator)
      : {};

    return {
      ...accumulator,
      config: {
        ...(accumulator.config || {}),
        ...vc,
        ...modified
      }
    };
  }
}
const visConfigModificationV1 = {
  point: (visConfig, parents) => {
    const modified: modifiedType = {};
    const [layer] = parents.slice(-2, -1);
    const isOld =
      !Object.prototype.hasOwnProperty.call(visConfig, 'filled') &&
      !visConfig.strokeColor &&
      !visConfig.strokeColorRange;
    if (isOld) {
      // color color & color range to stroke color
      modified.strokeColor = layer.config.color;
      modified.strokeColorRange = cloneDeep(visConfig.colorRange);
      if (visConfig.outline) {
        // point layer now supports both outline and fill
        // for older schema where filled has not been added to point layer
        // set it to false
        modified.filled = false;
      }
    }

    return modified;
  },
  geojson: (visConfig, parents) => {
    // is points?
    const modified: modifiedType = {};
    const [layer] = parents.slice(-2, -1);
    const isOld =
      layer.visualChannels &&
      !Object.prototype.hasOwnProperty.call(layer.visualChannels, 'strokeColorField') &&
      !visConfig.strokeColor &&
      !visConfig.strokeColorRange;
    // make our best guess if this geojson layer contains point
    const isPoint =
      (layer.visualChannels && layer.visualChannels.radiusField) ||
      (visConfig && visConfig.radius !== LAYER_VIS_CONFIGS.radius?.defaultValue);

    if (isOld) {
      // color color & color range to stroke color
      modified.strokeColor = layer.config.color;
      modified.strokeColorRange = cloneDeep(visConfig.colorRange);
      if (isPoint) {
        // if is point, set stroke to false
        modified.filled = true;
        modified.stroked = false;
      }
    }

    return modified;
  }
};

class VisConfigSchemaV1 extends Schema {
  key = 'visConfig';

  load(visConfig, parents, accumulated) {
    const [layer] = parents.slice(-2, -1);
    const modified = visConfigModificationV1[layer.type]
      ? visConfigModificationV1[layer.type](visConfig, parents, accumulated)
      : {};
    const loadedVisConfig = {...visConfig, ...modified};
    return {
      visConfig: loadedVisConfig
    };
  }
}

export const layerPropsV1 = {
  id: null,
  type: null,
  config: new Schema({
    version: VERSIONS.v1,
    key: 'config',
    properties: {
      dataId: null,
      columnMode: null,
      label: null,
      color: null,
      highlightColor: null,
      columns: new ColumnSchemaV1({
        version: VERSIONS.v1,
        key: 'columns'
      }),
      isVisible: null,
      visConfig: new VisConfigSchemaV1({
        version: VERSIONS.v1
      }),
      hidden: null,
      textLabel: new TextLabelSchemaV1({
        version: VERSIONS.v1,
        key: 'textLabel'
      })
    }
  }),
  visualChannels: new VisualChannelSchemaV1({
    version: VERSIONS.v1,
    key: 'visualChannels'
  })
};

export class LayerSchemaV0 extends Schema {
  key = 'layers';

  save(layers: Layer[], parents: [VisState]): {layers: SavedLayer[]} {
    const [visState] = parents.slice(-1);

    return {
      [this.key as 'layers']: visState.layerOrder.reduce((saved, layerId) => {
        // save layers according to their rendering order
        const layer = findById(layerId)(layers);
        if (layer?.isValidToSave()) {
          saved.push(this.savePropertiesOrApplySchema(layer).layers);
        }
        return saved;
      }, [] as SavedLayer[])
    };
  }

  load(layers: SavedLayer[] | MinSavedLayer[] | undefined): {
    layers: ParsedLayer[] | undefined;
  } {
    return {
      [this.key as 'layers']: layers
        ? layers.map(layer => this.loadPropertiesOrApplySchema(layer, layers).layers)
        : []
    };
  }
}

export class FilterSchemaV0 extends Schema {
  key = 'filters';
  save(filters: Filter[]): {filters: SavedFilter[]} {
    return {
      filters: filters
        .filter(isFilterValidToSave)
        .map(filter => this.savePropertiesOrApplySchema(filter).filters)
    };
  }
  load(filters: SavedFilter[] | MinSavedFilter[] | undefined): {
    filters: ParsedFilter[] | undefined;
  } {
    return {
      filters: filters
        ?.map(filter => this.loadPropertiesOrApplySchema(filter).filters)
        // backward compatible convert enlarged to view
        .map(filter => {
          const {enlarged, view, ...filterProps} = filter;

          const newFilter = {
            ...filterProps,
            // if view exist use it otherwise check for enlarged
            view: view ? view : enlarged ? FILTER_VIEW_TYPES.enlarged : FILTER_VIEW_TYPES.side
          };

          return newFilter;
        })
    };
  }
}

const interactionPropsV0 = ['tooltip', 'brush'];

class InteractionSchemaV0 extends Schema {
  key = 'interactionConfig';

  save(interactionConfig) {
    return Array.isArray(this.properties)
      ? {
          [this.key]: this.properties.reduce(
            (accu, key) => ({
              ...accu,
              ...(interactionConfig[key].enabled ? {[key]: interactionConfig[key].config} : {})
            }),
            {}
          )
        }
      : {};
  }

  load(interactionConfig) {
    // convert v0 -> v1
    // return enabled: false if disabled,
    return Array.isArray(this.properties)
      ? {
          [this.key]: this.properties.reduce(
            (accu, key) => ({
              ...accu,
              ...{
                [key]: {
                  ...(interactionConfig[key] || {}),
                  enabled: Boolean(interactionConfig[key])
                }
              }
            }),
            {}
          )
        }
      : {};
  }
}

const interactionPropsV1 = [...interactionPropsV0, 'geocoder', 'coordinate'];

export class InteractionSchemaV1 extends Schema {
  key = 'interactionConfig';

  save(interactionConfig: InteractionConfig):
    | {
        interactionConfig: SavedInteractionConfig;
      }
    | Record<string, any> {
    // save config even if disabled,
    return Array.isArray(this.properties)
      ? {
          [this.key]: this.properties.reduce(
            (accu, key) => ({
              ...accu,
              [key]: {
                ...interactionConfig[key].config,
                enabled: interactionConfig[key].enabled
              }
            }),
            {}
          )
        }
      : {};
  }
  load(interactionConfig: SavedInteractionConfig): {
    interactionConfig: Partial<SavedInteractionConfig>;
  } {
    const modifiedConfig = interactionConfig;
    Object.keys(interactionConfig).forEach(configType => {
      if (configType === 'tooltip') {
        const fieldsToShow = modifiedConfig[configType].fieldsToShow;
        if (!notNullorUndefined(fieldsToShow)) {
          return {[this.key]: modifiedConfig};
        }
        Object.keys(fieldsToShow).forEach(key => {
          // @ts-expect-error name: fieldData should be string
          fieldsToShow[key] = fieldsToShow[key].map(fieldData => {
            if (!fieldData.name) {
              return {
                name: fieldData,
                format: null
              };
            }
            return fieldData;
          });
        });
      }
      return;
    });
    return {[this.key as 'interactionConfig']: modifiedConfig};
  }
}

export const filterPropsV0 = {
  dataId: null,
  id: null,
  name: null,
  type: null,
  value: null,
  // deprecated
  enlarged: null
};

export class DimensionFieldSchema extends Schema {
  save(field) {
    return {
      [this.key]: field ? this.savePropertiesOrApplySchema(field)[this.key] : null
    };
  }

  load(field) {
    return {[this.key]: field};
  }
}

export class SplitMapsSchema extends Schema {
  convertLayerSettings(accu, [key, value]) {
    if (typeof value === 'boolean') {
      return {
        ...accu,
        [key]: value
      };
    } else if (value && typeof value === 'object' && value.isAvailable) {
      return {
        ...accu,
        [key]: Boolean(value.isVisible)
      };
    }
    return accu;
  }

  load(splitMaps) {
    // previous splitMaps Schema {layers: {layerId: {isVisible, isAvailable}}}

    if (!Array.isArray(splitMaps) || !splitMaps.length) {
      return {splitMaps: []};
    }

    return {
      splitMaps: splitMaps.map(settings => ({
        ...settings,
        layers: Object.entries(settings.layers || {}).reduce(this.convertLayerSettings, {})
      }))
    };
  }
}
export class PlotTypeSchema extends Schema {
  key = 'plotType';
  load(plotType) {
    if (typeof plotType === 'string') {
      return {
        plotType: {
          type: plotType
        }
      };
    }
    return {plotType};
  }
}

export const effectPropsV1 = {
  id: null,
  type: null,
  isEnabled: null,
  parameters: null
};
export class EffectsSchema extends Schema {
  key = 'effects';

  save(effects, parents) {
    const [visState] = parents.slice(-1);

    return {
      [this.key]: visState.effectOrder.reduce((saved, effectId) => {
        // save effects according to their rendering order
        /**
         * @type {Effect | undefined}
         */
        const effect = findById(effectId)(effects as Effect[]);
        if (effect?.isValidToSave()) {
          saved.push(this.savePropertiesOrApplySchema(effect).effects);
        }
        return saved;
      }, [])
    };
  }

  load(effects) {
    return {
      [this.key]: effects.map(effect => {
        // handle older configs
        const outEffect = effect.config
          ? {
              id: effect.id,
              ...effect.config,
              parameters: {...(effect.config.params || {})}
            }
          : effect;
        return this.loadPropertiesOrApplySchema(outEffect, effects).effects;
      })
    };
  }
}

export const filterPropsV1 = {
  ...filterPropsV0,
  plotType: new PlotTypeSchema({
    version: VERSIONS.v1
  }),
  animationWindow: null,
  yAxis: new DimensionFieldSchema({
    version: VERSIONS.v1,
    key: 'yAxis',
    properties: {
      name: null,
      type: null
    }
  }),
  // this replaced enlarged
  view: null,

  // polygon filter properties
  layerId: null,
  speed: null,

  // layer timeline
  syncedWithLayerTimeline: null,
  syncTimelineMode: null,

  enabled: null,

  invertTrendColor: null
};

export const propertiesV0 = {
  filters: new FilterSchemaV0({
    version: VERSIONS.v0,
    properties: filterPropsV0
  }),
  layers: new LayerSchemaV0({
    version: VERSIONS.v0,
    properties: layerPropsV0
  }),
  interactionConfig: new InteractionSchemaV0({
    version: VERSIONS.v0,
    properties: interactionPropsV0
  }),
  layerBlending: null,
  overlayBlending: null
};

export const propertiesV1 = {
  filters: new FilterSchemaV0({
    version: VERSIONS.v1,
    properties: filterPropsV1
  }),
  layers: new LayerSchemaV0({
    version: VERSIONS.v1,
    properties: layerPropsV1
  }),
  effects: new EffectsSchema({
    version: VERSIONS.v1,
    properties: effectPropsV1
  }),
  interactionConfig: new InteractionSchemaV1({
    version: VERSIONS.v1,
    properties: interactionPropsV1
  }),
  layerBlending: null,
  overlayBlending: null,
  splitMaps: new SplitMapsSchema({
    key: 'splitMaps',
    version: VERSIONS.v1
  }),
  animationConfig: new Schema({
    version: VERSIONS.v1,
    properties: {
      currentTime: null,
      speed: null
    },
    key: 'animationConfig'
  }),
  editor: new Schema({
    version: VERSIONS.v1,
    properties: {
      features: null,
      visible: null
    },
    key: 'editor'
  })
};

export class VisStateSchemaV1 extends Schema {
  save(node: VisState, parents: any[] = [], accumulator?: any): {visState: SavedVisState} {
    // @ts-expect-error
    return this.savePropertiesOrApplySchema(node, parents, accumulator);
  }

  load(node?: SavedVisState): {
    visState: ParsedVisState | undefined;
  } {
    // @ts-expect-error
    return this.loadPropertiesOrApplySchema(node);
  }
}

export const visStateSchemaV0 = new Schema({
  version: VERSIONS.v0,
  properties: propertiesV0,
  key: 'visState'
});

export const visStateSchemaV1 = new VisStateSchemaV1({
  version: VERSIONS.v1,
  properties: propertiesV1,
  key: 'visState'
});

export const visStateSchema: {
  v0: typeof visStateSchemaV0;
  v1: typeof visStateSchemaV1;
} = {
  // @ts-expect-error
  [VERSIONS.v0]: {
    save: toSave => visStateSchemaV0.save(toSave),
    load: toLoad => visStateSchemaV1.load(visStateSchemaV0.load(toLoad)?.visState)
  },
  [VERSIONS.v1]: visStateSchemaV1
};

// test load v0
export default visStateSchema;

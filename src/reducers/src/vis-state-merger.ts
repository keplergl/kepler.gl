// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import uniq from 'lodash/uniq';
import pick from 'lodash/pick';
import flattenDeep from 'lodash/flattenDeep';
import deepmerge from 'deepmerge';
import {
  arrayInsert,
  getInitialMapLayersForSplitMap,
  applyFiltersToDatasets,
  validateFiltersUpdateDatasets,
  findById,
  aggregate
} from '@kepler.gl/utils';

import {Layer} from '@kepler.gl/layers';
import {createEffect} from '@kepler.gl/effects';
import {notNullorUndefined} from '@kepler.gl/common-utils';
import {AGGREGATION_TYPES, LAYER_BLENDINGS, OVERLAY_BLENDINGS} from '@kepler.gl/constants';
import {CURRENT_VERSION, VisState, VisStateMergers, KeplerGLSchemaClass} from '@kepler.gl/schemas';

import {
  ParsedLayer,
  ParsedVisState,
  SavedInteractionConfig,
  TooltipInfo,
  SavedEditor,
  ParsedConfig,
  Filter,
  Effect as EffectType,
  ParsedEffect,
  LayerColumns,
  LayerColumn,
  ParsedFilter,
  NestedPartial,
  SavedAnimationConfig
} from '@kepler.gl/types';
import {KeplerTable, Datasets, assignGpuChannels, resetFilterGpuMode} from '@kepler.gl/table';

import {getLayerOrderFromLayers} from './layer-utils';

/**
 * Merge loaded filters with current state, if no fields or data are loaded
 * save it for later
 *
 */
export function mergeFilters<S extends VisState>(
  state: S,
  filtersToMerge: NonNullable<ParsedConfig['visState']>['filters'],
  fromConfig?: boolean
): S {
  const preserveFilterOrder = fromConfig
    ? filtersToMerge?.map(l => l.id)
    : state.preserveFilterOrder;

  if (!Array.isArray(filtersToMerge) || !filtersToMerge.length) {
    return state;
  }

  const {validated, failed, updatedDatasets} = validateFiltersUpdateDatasets(state, filtersToMerge);
  let updatedFilters = insertItemBasedOnPreservedOrder(
    state.filters,
    validated,
    preserveFilterOrder
  );

  // merge filter with existing
  updatedFilters = resetFilterGpuMode(updatedFilters);
  updatedFilters = assignGpuChannels(updatedFilters);
  // filter data
  const datasetsToFilter = uniq(flattenDeep(validated.map(f => f.dataId)));

  const filtered = applyFiltersToDatasets(
    datasetsToFilter,
    updatedDatasets,
    updatedFilters,
    state.layers
  );

  return {
    ...state,
    filters: updatedFilters,
    datasets: filtered,
    preserveFilterOrder,
    filterToBeMerged: [...state.filterToBeMerged, ...failed]
  };
}

// replace dataId in saved Filter
export function replaceFilterDatasetIds(
  savedFilter: Filter[],
  dataId: string,
  dataIdToUse: string
) {
  const replaced: Filter[] = [];
  savedFilter.forEach(filter => {
    if (filter.dataId.includes(dataId)) {
      const newDataId = filter.dataId.map(d => (d === dataId ? dataIdToUse : d));
      let plotType;
      // TODO: more generic approach to save plotType.colorsByDataId
      if (filter.plotType?.colorsByDataId?.[dataId]) {
        // replace colorByDataId in filter.plotType
        const {[dataId]: color, ...rest} = filter.plotType?.colorsByDataId || {};
        plotType = {
          ...filter.plotType,
          colorsByDataId: {
            ...rest,
            [dataIdToUse]: color
          }
        };
      }
      replaced.push({
        ...filter,
        dataId: newDataId,
        ...(plotType ? {plotType} : {})
      });
    }
  });
  return replaced.length ? replaced : null;
}

export function isSavedLayerConfigV1(layerConfig: any): boolean {
  // exported layer configuration contains visualChannels property
  return layerConfig?.visualChannels;
}

export function parseLayerConfig(
  schema: KeplerGLSchemaClass,
  layerConfig: any
): ParsedLayer | undefined {
  // assume the layer config is current version
  const savedConfig = {
    version: CURRENT_VERSION,
    config: {
      visState: {layers: [layerConfig], layerOrder: [layerConfig.id]}
    }
  };

  return schema.parseSavedConfig(savedConfig)?.visState?.layers?.[0];
}

function insertItemBasedOnPreservedOrder(
  currentItems: Filter[],
  items: Filter[],
  preservedOrder: any[] = [],
  defaultStart?: boolean
) {
  let newItems = [...currentItems];

  for (const item of items) {
    const expectedIdx = preservedOrder.indexOf(item.id);
    // insertAt the end by default
    let insertAt = defaultStart ? 0 : newItems.length;
    if (expectedIdx > 0) {
      // look for layer to insert after
      let i = expectedIdx + 1;
      let preceedIdx = -1;
      while (i-- > 0 && preceedIdx < 0) {
        // keep looking for preceed layer that is already loaded
        const preceedItemId = preservedOrder[i - 1];
        preceedIdx = newItems.findIndex(d => d.id === preceedItemId);
      }
      if (preceedIdx > -1) {
        // if found
        insertAt = preceedIdx + 1;
      }
    }
    newItems = arrayInsert(newItems, insertAt, item);
  }
  return newItems;
}

export function createLayerFromConfig(state: VisState, layerConfig: any): Layer | null {
  // check if the layer config is parsed
  const parsedLayerConfig = isSavedLayerConfigV1(layerConfig)
    ? parseLayerConfig(state.schema, layerConfig)
    : layerConfig;

  if (!parsedLayerConfig) {
    return null;
  }
  // first validate config against dataset
  const {validated, failed} = validateLayersByDatasets(
    state.datasets,
    state.layerClasses,
    [parsedLayerConfig],
    {allowEmptyColumn: true}
  );

  if (failed?.length || !validated.length) {
    // failed
    return null;
  }

  const newLayer = validated[0];
  newLayer.updateLayerDomain(state.datasets);
  return newLayer;
}

/**
 * Get loaded filter from state
 */
export function serializeFilter(
  newFilter: Filter,
  schema: KeplerGLSchemaClass
): ParsedFilter | undefined {
  const serializedVisState = serializeVisState({filters: [newFilter]}, schema);
  return serializedVisState?.filters?.[0];
}

/**
 * Get loaded layer from state
 */
export function serializeLayer(
  newLayer: Layer,
  schema: KeplerGLSchemaClass
): ParsedLayer | undefined {
  const serializedVisState = serializeVisState(
    {layers: [newLayer], layerOrder: [newLayer.id]},
    schema
  );
  return serializedVisState?.layers?.[0];
}

/**
 * Get loaded effect from state
 */
export function serializeEffect(
  newEffect: EffectType,
  schema: KeplerGLSchemaClass
): ParsedEffect | undefined {
  const serializedVisState = serializeVisState(
    {effects: [newEffect], effectOrder: [newEffect.id]},
    schema
  );
  return serializedVisState?.effects?.[0];
}

/**
 * Get vis state config
 */
export function serializeVisState(
  visState: Partial<VisState>,
  schema: KeplerGLSchemaClass
): ParsedVisState | undefined {
  const savedState = schema.getConfigToSave({
    visState
  });
  return savedState ? schema.parseSavedConfig(savedState)?.visState : undefined;
}
/**
 * Merge layers from de-serialized state, if no fields or data are loaded
 * save it for later
 *
 */
export function mergeLayers<S extends VisState>(
  state: S,
  layersToMerge: NonNullable<ParsedConfig['visState']>['layers'] = [],
  fromConfig?: boolean
): S {
  const preserveLayerOrder = fromConfig
    ? getLayerOrderFromLayers(layersToMerge)
    : state.preserveLayerOrder;
  if (!Array.isArray(layersToMerge) || !layersToMerge.length) {
    return state;
  }
  // don't merge layer if dataset is being merged
  const unmerged: ParsedLayer[] = [];
  const toMerge: ParsedLayer[] = [];
  layersToMerge.forEach((l: ParsedLayer) => {
    if (l?.config?.dataId && state.isMergingDatasets[l.config.dataId]) {
      unmerged.push(l);
    } else {
      toMerge.push(l);
    }
  });

  const {validated: mergedLayer, failed} = validateLayersByDatasets(
    state.datasets,
    state.layerClasses,
    toMerge
  );
  unmerged.push(...failed);
  // put new layers in front of current layers
  const {newLayerOrder, newLayers} = insertLayerAtRightOrder(
    state.layers,
    mergedLayer,
    state.layerOrder,
    preserveLayerOrder
  );

  return {
    ...state,
    layers: newLayers,
    layerOrder: newLayerOrder,
    preserveLayerOrder,
    layerToBeMerged: [...state.layerToBeMerged, ...unmerged]
  };
}

export function insertLayerAtRightOrder(
  currentLayers,
  layersToInsert,
  currentOrder,
  preservedOrder: string[] = []
) {
  if (!layersToInsert?.length) {
    return {newLayers: currentLayers, newLayerOrder: currentOrder};
  }
  // perservedOrder ['a', 'b', 'c'];
  // layerOrder ['a', 'b', 'c']
  const currentLayerQueue = currentOrder
    .map(id => findById(id)(currentLayers))
    .filter(layer => Boolean(layer));
  const newLayers = currentLayers.concat(layersToInsert);
  const newLayerOrderQueue = insertItemBasedOnPreservedOrder(
    currentLayerQueue,
    layersToInsert,
    preservedOrder,
    true
  );

  // reconstruct layerOrder after insert
  const newLayerOrder = getLayerOrderFromLayers(newLayerOrderQueue);

  return {
    newLayerOrder,
    newLayers
  };
}

/**
 * Merge interactions with saved config
 *
 */
export function mergeInteractions<S extends VisState>(
  state: S,
  interactionToBeMerged: Partial<SavedInteractionConfig> | undefined
): S {
  const merged: NestedPartial<SavedInteractionConfig> = {};
  const unmerged: Partial<SavedInteractionConfig> = {};

  if (interactionToBeMerged) {
    (Object.keys(interactionToBeMerged) as Array<keyof SavedInteractionConfig>).forEach(key => {
      if (!state.interactionConfig[key]) {
        return;
      }

      const currentConfig =
        key === 'tooltip' || key === 'brush' ? state.interactionConfig[key].config : null;

      const {enabled, ...configSaved} = interactionToBeMerged[key] || {};

      let configToMerge = configSaved;

      if (key === 'tooltip') {
        const {mergedTooltip, unmergedTooltip} = mergeInteractionTooltipConfig(
          state,
          configSaved as SavedInteractionConfig['tooltip']
        );

        // merge new dataset tooltips with original dataset tooltips
        configToMerge = {
          fieldsToShow: {
            ...(currentConfig as TooltipInfo['config']).fieldsToShow,
            ...mergedTooltip
          }
        };

        if (Object.keys(unmergedTooltip).length) {
          // @ts-expect-error
          unmerged.tooltip = {fieldsToShow: unmergedTooltip, enabled: Boolean(enabled)};
        }
      }

      merged[key] = {
        ...state.interactionConfig[key],
        enabled: Boolean(enabled),
        ...(currentConfig
          ? {
              config: pick(
                {
                  ...currentConfig,
                  ...configToMerge
                },
                Object.keys(currentConfig)
              )
            }
          : {})
      };
    });
  }

  const nextState = {
    ...state,
    interactionConfig: {
      ...state.interactionConfig,
      ...merged
    },
    interactionToBeMerged: savedUnmergedInteraction(state, unmerged)
  };
  return nextState;
}

function combineInteractionConfigs(configs: SavedInteractionConfig[]): SavedInteractionConfig {
  const combined = {...configs[0]};
  // handle each property key of an `InteractionConfig`, e.g. tooltip, geocoder, brush, coordinate
  // by combining values for each among all passed in configs

  for (const key in combined) {
    const toBeCombinedProps = configs.map(c => c[key]);

    // all of these have an enabled boolean
    combined[key] = {
      // are any of the configs' enabled values true?
      enabled: toBeCombinedProps.some(p => p?.enabled)
    };

    if (key === 'tooltip') {
      // are any of the configs' compareMode values true?
      combined[key].compareMode = toBeCombinedProps.some(p => p?.compareMode);

      // return the compare type mode, it will be either absolute or relative
      combined[key].compareType = getValueWithHighestOccurrence(
        toBeCombinedProps.map(p => p.compareType)
      );

      // combine fieldsToShow among all dataset ids
      combined[key].fieldsToShow = toBeCombinedProps
        .map(p => p.fieldsToShow)
        .reduce((acc, nextFieldsToShow) => {
          for (const nextDataIdKey in nextFieldsToShow) {
            const nextTooltipFields = nextFieldsToShow[nextDataIdKey];
            if (!acc[nextDataIdKey]) {
              // if the dataset id is not present in the accumulator
              // then add it with its tooltip fields
              acc[nextDataIdKey] = nextTooltipFields;
            } else {
              // otherwise the dataset id is already present in the accumulator
              // so only add the next tooltip fields for this dataset's array if they are not already present,
              // using the tooltipField.name property for uniqueness
              nextTooltipFields.forEach(nextTF => {
                if (!acc[nextDataIdKey].find(({name}) => nextTF.name === name)) {
                  acc[nextDataIdKey].push(nextTF);
                }
              });
            }
          }
          return acc;
        }, {});
    }

    if (key === 'brush') {
      // keep the biggest brush size
      combined[key].size =
        aggregate(toBeCombinedProps, AGGREGATION_TYPES.maximum, p => p.size) ?? null;
    }
  }

  return combined;
}

function savedUnmergedInteraction<S extends VisState>(
  state: S,
  unmerged: Partial<SavedInteractionConfig>
) {
  if (!unmerged?.tooltip?.fieldsToShow) {
    return state.interactionToBeMerged;
  }
  return {
    tooltip: {
      ...state.interactionToBeMerged.tooltip,
      ...(typeof unmerged?.tooltip?.enabled === 'boolean'
        ? {enabled: unmerged.tooltip.enabled}
        : {}),
      fieldsToShow: {
        ...state.interactionToBeMerged?.tooltip?.fieldsToShow,
        ...unmerged?.tooltip?.fieldsToShow
      }
    }
  };
}

function replaceInteractionDatasetIds(interactionConfig, dataId: string, dataIdToReplace: string) {
  if (interactionConfig?.tooltip?.fieldsToShow[dataId]) {
    return {
      ...interactionConfig,
      tooltip: {
        ...interactionConfig.tooltip,
        fieldsToShow: {
          [dataIdToReplace]: interactionConfig?.tooltip?.fieldsToShow[dataId]
        }
      }
    };
  }
  return null;
}

/**
 * Merge splitMaps config with current visStete.
 * 1. if current map is split, but splitMap DOESNOT contain maps
 *    : don't merge anything
 * 2. if current map is NOT split, but splitMaps contain maps
 *    : add to splitMaps, and add current layers to splitMaps
 */
export function mergeSplitMaps<S extends VisState>(
  state: S,
  splitMaps: NonNullable<ParsedConfig['visState']>['splitMaps'] = []
): S {
  const merged = [...state.splitMaps];
  const unmerged = [];
  splitMaps.forEach((sm, i) => {
    const entries = Object.entries(sm.layers);
    if (entries.length > 0) {
      entries.forEach(([id, value]) => {
        // check if layer exists
        const pushTo = state.layers.find(l => l.id === id) ? merged : unmerged;

        // create map panel if current map is not split
        pushTo[i] = pushTo[i] || {
          // keep id
          ...sm,
          layers: pushTo === merged ? getInitialMapLayersForSplitMap(state.layers) : []
        };
        pushTo[i].layers = {
          ...pushTo[i].layers,
          [id]: value
        };
      });
    } else {
      // We are merging if there are no layers in both split map
      merged.push(sm);
    }
  });

  return {
    ...state,
    splitMaps: merged,
    splitMapsToBeMerged: [...state.splitMapsToBeMerged, ...unmerged]
  };
}

/**
 * Merge effects with saved config
 */
export function mergeEffects<S extends VisState>(
  state: S,
  effects: NonNullable<ParsedConfig['visState']>['effects'],
  fromConfig?: boolean
): S {
  const newEffects = [
    ...state.effects,
    ...(effects || [])
      .map(effect => {
        return fromConfig
          ? createEffect(
              deepmerge.all([
                effect,
                {
                  // collapse all panels when loading effects
                  isConfigActive: false
                }
              ])
            )
          : (effect as EffectType);
      })
      .filter(effect => {
        return Boolean(effect && effect.isValidToSave());
      })
  ];
  return {
    ...state,
    effects: newEffects,
    effectOrder: newEffects.map(effect => effect.id)
  };
}

/**
 * Merge interactionConfig.tooltip with saved config,
 * validate fieldsToShow
 *
 * @param state
 * @param tooltipConfig
 * @return - {mergedTooltip: {}, unmergedTooltip: {}}
 */
export function mergeInteractionTooltipConfig(
  state: VisState,
  tooltipConfig: Pick<TooltipInfo['config'], 'fieldsToShow'> | null = null
) {
  const unmergedTooltip: TooltipInfo['config']['fieldsToShow'] = {};
  const mergedTooltip: TooltipInfo['config']['fieldsToShow'] = {};

  if (
    !tooltipConfig ||
    !tooltipConfig.fieldsToShow ||
    !Object.keys(tooltipConfig.fieldsToShow).length
  ) {
    return {mergedTooltip, unmergedTooltip};
  }

  for (const dataId in tooltipConfig.fieldsToShow) {
    if (!state.datasets[dataId] || state.isMergingDatasets[dataId]) {
      // is not yet loaded
      unmergedTooltip[dataId] = tooltipConfig.fieldsToShow[dataId];
    } else {
      // if dataset is loaded
      const allFields = state.datasets[dataId].fields.map(d => d.name);
      const foundFieldsToShow = tooltipConfig.fieldsToShow[dataId].filter(field =>
        allFields.includes(field.name)
      );

      mergedTooltip[dataId] = foundFieldsToShow;
    }
  }

  return {mergedTooltip, unmergedTooltip};
}
/**
 * Merge layerBlending with saved
 *
 */
export function mergeLayerBlending<S extends VisState>(
  state: S,
  layerBlending: NonNullable<ParsedConfig['visState']>['layerBlending']
): S {
  if (layerBlending && LAYER_BLENDINGS[layerBlending]) {
    return {
      ...state,
      layerBlending
    };
  }

  return state;
}

/**
 * Combines multiple layer blending configs into a single string
 * by returning the one with the highest occurrence
 */
function combineLayerBlendingConfigs(configs: string[]): string | null {
  // return the mode of the layer blending type
  return getValueWithHighestOccurrence(configs);
}

/**
 * Merge overlayBlending with saved
 */
export function mergeOverlayBlending<S extends VisState>(
  state: S,
  overlayBlending: NonNullable<ParsedConfig['visState']>['overlayBlending']
): S {
  if (overlayBlending && OVERLAY_BLENDINGS[overlayBlending]) {
    return {
      ...state,
      overlayBlending
    };
  }

  return state;
}

/**
 * Combines multiple overlay blending configs into a single string
 * by returning the one with the highest occurrence
 **/
function combineOverlayBlendingConfigs(configs: string[]): string | null {
  // return the mode of the overlay blending type
  return getValueWithHighestOccurrence(configs);
}

/**
 * Merge animation config
 */
export function mergeAnimationConfig<S extends VisState>(
  state: S,
  animation: NonNullable<ParsedConfig['visState']>['animationConfig']
): S {
  if (animation && animation.currentTime) {
    return {
      ...state,
      animationConfig: {
        ...state.animationConfig,
        ...animation,
        domain: null
      }
    };
  }

  return state;
}

function combineAnimationConfigs(configs: SavedAnimationConfig[]): SavedAnimationConfig {
  // get the smallest values of currentTime and speed among all configs
  return {
    currentTime: aggregate(configs, AGGREGATION_TYPES.minimum, c => c.currentTime) ?? null,
    speed: aggregate(configs, AGGREGATION_TYPES.minimum, c => c.speed) ?? null
  };
}

/**
 * Validate saved layer columns with new data,
 * update fieldIdx based on new fields
 *
 * @param fields
 * @param savedCols
 * @param emptyCols
 * @param options
 * @return - validated columns or null
 */

export function validateSavedLayerColumns(
  fields: KeplerTable['fields'],
  savedCols: {
    [key: string]: string;
  } = {},
  emptyCols: LayerColumns,
  options: {throwOnError?: boolean} = {}
) {
  // Prepare columns for the validator
  const columns: typeof emptyCols = {};
  for (const key of Object.keys(emptyCols)) {
    columns[key] = {...emptyCols[key]};

    const saved = savedCols[key];
    if (saved) {
      const fieldIdx = fields.findIndex(({name}) => name === saved);

      if (fieldIdx > -1) {
        // update found columns
        columns[key].fieldIdx = fieldIdx;
        columns[key].value = saved;
      }
    }
  }

  // find actual column fieldIdx, in case it has changed
  const allColFound = Object.keys(columns).every(key =>
    validateColumn(columns[key], columns, fields)
  );

  const rv = allColFound ? columns : null;
  if (options.throwOnError) {
    const requiredColumns = Object.keys(emptyCols).filter(k => !emptyCols[k].optional);
    const missingColumns = requiredColumns.filter(k => !columns?.[k].value);
    if (missingColumns.length) {
      throw new Error(`Layer has missing or invalid columns: ${missingColumns.join(', ')}`);
    }
    const configColumns = Object.keys(savedCols);
    const invalidColumns = configColumns.filter(k => !columns?.[k]?.value);
    if (invalidColumns.length) {
      throw new Error(`Layer has invalid columns: ${invalidColumns.join(', ')}`);
    }
  }

  return rv;
}

/**
 * Validate layer column
 */
export function validateColumn(
  column: LayerColumn & {validator?: typeof validateColumn},
  columns: LayerColumns,
  allFields: KeplerTable['fields']
): boolean {
  if (column.optional || column.value) {
    return true;
  }
  if (column.validator) {
    return column.validator(column, columns, allFields);
  }
  return false;
}

/**
 * Validate saved text label config with new data
 * refer to vis-state-schema.js TextLabelSchemaV1
 *
 * @param {Array<Object>} fields
 * @param {Object} savedTextLabel
 * @param {Object} options
 * @return {Object} - validated textlabel
 */
export function validateSavedTextLabel(
  fields,
  [layerTextLabel],
  savedTextLabel,
  options: {throwOnError?: boolean} = {}
) {
  const savedTextLabels = Array.isArray(savedTextLabel) ? savedTextLabel : [savedTextLabel];

  // validate field
  return savedTextLabels.map(textLabel => {
    const field = textLabel.field
      ? fields.find(fd =>
          Object.keys(textLabel.field).every(key => textLabel.field[key] === fd[key])
        )
      : null;

    if (field === undefined && options.throwOnError) {
      throw new Error(`Layer has invalid text label field: ${JSON.stringify(textLabel.field)}`);
    }

    return Object.keys(layerTextLabel).reduce(
      (accu, key) => ({
        ...accu,
        [key]: key === 'field' ? field : textLabel[key] || layerTextLabel[key]
      }),
      {}
    );
  });
}

/**
 * Validate saved visual channels config with new data,
 * refer to vis-state-schema.js VisualChannelSchemaV1
 */
export function validateSavedVisualChannels(
  fields: KeplerTable['fields'],
  newLayer: Layer,
  savedLayer: ParsedLayer,
  options: {throwOnError?: boolean} = {}
): null | Layer {
  Object.values(newLayer.visualChannels).forEach(({field, scale, key}) => {
    let foundField;
    if (savedLayer.config) {
      if (savedLayer.config[field]) {
        foundField = fields.find(
          fd => savedLayer.config && fd.name === savedLayer.config[field].name
        );
      }

      const foundChannel = {
        ...(foundField ? {[field]: foundField} : {}),
        ...(savedLayer.config[scale] ? {[scale]: savedLayer.config[scale]} : {})
      };
      if (Object.keys(foundChannel).length) {
        newLayer.updateLayerConfig(foundChannel);
      }

      newLayer.validateVisualChannel(key);
      if (options.throwOnError) {
        const fieldName = savedLayer.config?.[field]?.name;
        if (fieldName && fieldName !== newLayer.config[field]?.name) {
          throw new Error(`Layer has invalid visual channel field: ${field}`);
        }
      }
    }
  });
  return newLayer;
}

type ValidateLayerOption = {
  allowEmptyColumn?: boolean;
  throwOnError?: boolean;
};

export function validateLayersByDatasets(
  datasets: Datasets,
  layerClasses: VisState['layerClasses'],
  layers: NonNullable<ParsedConfig['visState']>['layers'] = [],
  options?: ValidateLayerOption
) {
  const validated: Layer[] = [];
  const failed: NonNullable<ParsedConfig['visState']>['layers'] = [];

  layers.forEach(layer => {
    let validateLayer: Layer | null = null;

    if (layer?.config?.dataId) {
      if (datasets[layer.config.dataId]) {
        // datasets are already loaded
        validateLayer = validateLayerWithData(
          datasets[layer.config.dataId],
          layer,
          layerClasses,
          options
        );
      }
    }

    if (validateLayer) {
      validated.push(validateLayer);
    } else {
      // datasets not yet loaded
      failed.push(layer);
    }
  });

  return {validated, failed};
}

/**
 * Get required columns for validation based on column mode
 */
function _getColumnConfigForValidation(newLayer) {
  // find column fieldIdx
  let columnConfig = newLayer.getLayerColumns();
  // if columnMode is defined, find column mode config
  const colModeConfig = newLayer.config.columnMode
    ? (newLayer.supportedColumnModes || []).find(
        colMode => colMode.key === newLayer.config.columnMode
      )
    : null;

  if (colModeConfig) {
    // only validate columns in column mode
    columnConfig = [
      ...(colModeConfig.requiredColumns || []),
      ...(colModeConfig.optionalColumns || [])
    ].reduce(
      (accu, key) => ({
        ...accu,
        [key]: columnConfig[key]
      }),
      {}
    );
  }

  return columnConfig;
}

/**
 * Validate saved layer config with new data,
 * update fieldIdx based on new fields
 */
// eslint-disable-next-line complexity
export function validateLayerWithData(
  dataset: KeplerTable,
  savedLayer: ParsedLayer,
  layerClasses: VisState['layerClasses'],
  options: ValidateLayerOption = {}
): Layer | null {
  const {fields, id: dataId} = dataset;
  const {type} = savedLayer;
  const {throwOnError} = options;
  // layer doesnt have a valid type
  if (!type || !Object.prototype.hasOwnProperty.call(layerClasses, type) || !savedLayer.config) {
    if (throwOnError) {
      throw new Error(`Layer has invalid type "${type}" or config is missing`);
    }
    return null;
  }

  let newLayer = new layerClasses[type]({
    id: savedLayer.id,
    dataId,
    label: savedLayer.config.label,
    color: savedLayer.config.color,
    isVisible: savedLayer.config.isVisible,
    hidden: savedLayer.config.hidden,
    columnMode: savedLayer.config.columnMode,
    highlightColor: savedLayer.config.highlightColor
  });

  const columnConfig = _getColumnConfigForValidation(newLayer);

  if (Object.keys(columnConfig)) {
    const columns = validateSavedLayerColumns(
      fields,
      savedLayer.config.columns,
      columnConfig,
      options
    );
    if (columns) {
      newLayer.updateLayerConfig({
        columns: {
          ...newLayer.config.columns,
          ...columns
        }
      });
    } else if (!options.allowEmptyColumn) {
      return null;
    }
  }

  const textLabel =
    savedLayer.config.textLabel && newLayer.config.textLabel
      ? validateSavedTextLabel(
          fields,
          newLayer.config.textLabel,
          savedLayer.config.textLabel,
          options
        )
      : newLayer.config.textLabel;

  // copy visConfig over to emptyLayer to make sure it has all the props
  const copiedVisConfig = newLayer.copyLayerConfig(
    newLayer.config.visConfig,
    savedLayer.config.visConfig || {},
    {
      shallowCopy: ['colorRange', 'strokeColorRange']
    }
  );

  // call layer methods to validate visConfig when switching dataset
  const visConfig = newLayer.validateVisConfig
    ? newLayer.validateVisConfig(dataset, copiedVisConfig)
    : copiedVisConfig;

  newLayer.updateLayerConfig({
    visConfig,
    textLabel
  });

  // visual channel field is saved to be {name, type}
  // find visual channel field by matching both name and type
  // refer to vis-state-schema.js VisualChannelSchemaV1
  newLayer = validateSavedVisualChannels(fields, newLayer, savedLayer, options);

  if (throwOnError) {
    if (!newLayer.isValidToSave()) {
      throw new Error(`Layer is not valid to save: ${newLayer.id}`);
    }
  }

  return newLayer;
}

export function mergeEditor<S extends VisState>(state: S, savedEditor: SavedEditor) {
  if (!savedEditor) {
    return state;
  }
  return {
    ...state,
    editor: {
      ...state.editor,
      features: [...state.editor.features, ...(savedEditor.features || [])],
      // if savedEditor.visible is undefined keep state.editor.visible
      visible: savedEditor.visible ?? state.editor.visible
    }
  };
}

function combineEditorConfigs(configs: SavedEditor[]): SavedEditor {
  return configs.reduce(
    (acc, nextConfig) => {
      return {
        ...acc,
        features: [...acc.features, ...(nextConfig.features || [])]
      };
    },
    {
      // start with:
      // - empty array for features accumulation
      // - and are any of the configs' visible values true?
      features: [],
      visible: configs.some(c => c?.visible)
    }
  );
}

/**
 * Validate saved layer config with new data,
 * update fieldIdx based on new fields
 */
export function mergeDatasetsByOrder(state: VisState, newDataEntries: Datasets): Datasets {
  const merged = {
    ...state.datasets,
    ...newDataEntries
  };

  if (Array.isArray(state.preserveDatasetOrder)) {
    // preserveDatasetOrder  might not include the  new datasets
    const newDatasetIds = Object.keys(merged).filter(
      id => !state.preserveDatasetOrder?.includes(id)
    );
    return [...state.preserveDatasetOrder, ...newDatasetIds].reduce(
      (accu, dataId) => ({
        ...accu,
        ...(merged[dataId] ? {[dataId]: merged[dataId]} : {})
      }),
      {}
    );
  }

  return merged;
}

/**
 * Simliar purpose to aggregation utils `getMode` function,
 * but returns the mode in the same value type without coercing to a string.
 * It ignores `undefined` or `null` values, but returns `null` if no mode could be calculated.
 */
function getValueWithHighestOccurrence<T>(arr: T[]): T | null {
  const tallys = new Map();
  arr.forEach(value => {
    if (notNullorUndefined(value)) {
      if (!tallys.has(value)) {
        tallys.set(value, 1);
      } else {
        tallys.set(value, tallys.get(value) + 1);
      }
    }
  });
  // return the value with the highest total occurrence count
  if (tallys.size === 0) {
    return null;
  }
  return [...tallys.entries()]?.reduce((acc, next) => (next[1] > acc[1] ? next : acc))[0];
}

export const VIS_STATE_MERGERS: VisStateMergers<any> = [
  {
    merge: mergeLayers,
    prop: 'layers',
    toMergeProp: 'layerToBeMerged',
    preserveOrder: 'preserveLayerOrder'
  },
  {
    merge: mergeFilters,
    prop: 'filters',
    toMergeProp: 'filterToBeMerged',
    preserveOrder: 'preserveFilterOrder',
    replaceParentDatasetIds: replaceFilterDatasetIds
  },
  {
    merge: mergeEffects,
    prop: 'effects'
  },
  {
    merge: mergeInteractions,
    prop: 'interactionConfig',
    toMergeProp: 'interactionToBeMerged',
    replaceParentDatasetIds: replaceInteractionDatasetIds,
    saveUnmerged: savedUnmergedInteraction,
    combineConfigs: combineInteractionConfigs
  },
  {merge: mergeLayerBlending, prop: 'layerBlending', combineConfigs: combineLayerBlendingConfigs},
  {
    merge: mergeOverlayBlending,
    prop: 'overlayBlending',
    combineConfigs: combineOverlayBlendingConfigs
  },
  {merge: mergeSplitMaps, prop: 'splitMaps', toMergeProp: 'splitMapsToBeMerged'},
  {merge: mergeAnimationConfig, prop: 'animationConfig', combineConfigs: combineAnimationConfigs},
  {merge: mergeEditor, prop: 'editor', combineConfigs: combineEditorConfigs}
];

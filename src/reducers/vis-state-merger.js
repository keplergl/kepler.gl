// Copyright (c) 2021 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import uniq from 'lodash.uniq';
import pick from 'lodash.pick';
import flattenDeep from 'lodash.flattendeep';
import {isObject, arrayInsert} from 'utils/utils';
import {applyFiltersToDatasets, validateFiltersUpdateDatasets} from 'utils/filter-utils';

import {getInitialMapLayersForSplitMap} from 'utils/split-map-utils';
import {resetFilterGpuMode, assignGpuChannels} from 'utils/gpu-filter-utils';
import {LAYER_BLENDINGS} from 'constants/default-settings';
import {CURRENT_VERSION, visStateSchema} from 'schemas';

/**
 * Merge loaded filters with current state, if no fields or data are loaded
 * save it for later
 *
 * @type {typeof import('./vis-state-merger').mergeFilters}
 */
export function mergeFilters(state, filtersToMerge) {
  if (!Array.isArray(filtersToMerge) || !filtersToMerge.length) {
    return state;
  }

  const {validated, failed, updatedDatasets} = validateFiltersUpdateDatasets(state, filtersToMerge);

  // merge filter with existing
  let updatedFilters = [...(state.filters || []), ...validated];
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
    filterToBeMerged: [...state.filterToBeMerged, ...failed]
  };
}

export function createLayerFromConfig(state, layerConfig) {
  // first validate config against dataset
  const {validated, failed} = validateLayersByDatasets(state.datasets, state.layerClasses, [
    layerConfig
  ]);

  if (failed.length || !validated.length) {
    // failed
    return null;
  }

  const newLayer = validated[0];
  newLayer.updateLayerDomain(state.datasets);
  return newLayer;
}

export function serializeLayer(newLayer) {
  const savedVisState = visStateSchema[CURRENT_VERSION].save({
    layers: [newLayer],
    layerOrder: [0]
  }).visState;
  const loadedLayer = visStateSchema[CURRENT_VERSION].load(savedVisState).visState.layers[0];
  return loadedLayer;
}

/**
 * Merge layers from de-serialized state, if no fields or data are loaded
 * save it for later
 *
 * @type {typeof import('./vis-state-merger').mergeLayers}
 */
export function mergeLayers(state, layersToMerge, fromConfig) {
  const preserveLayerOrder = fromConfig ? layersToMerge.map(l => l.id) : state.preserveLayerOrder;

  if (!Array.isArray(layersToMerge) || !layersToMerge.length) {
    return state;
  }

  const {validated: mergedLayer, failed: unmerged} = validateLayersByDatasets(
    state.datasets,
    state.layerClasses,
    layersToMerge
  );

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
  preservedOrder = []
) {
  // perservedOrder ['a', 'b', 'c'];
  // layerOrder [1, 0, 3]
  // layerOrderMap ['a', 'c']
  let layerOrderQueue = currentOrder.map(i => currentLayers[i].id);
  let newLayers = currentLayers;

  for (const newLayer of layersToInsert) {
    // find where to insert it
    const expectedIdx = preservedOrder.indexOf(newLayer.id);
    // if cant find place to insert, insert at the font
    let insertAt = 0;

    if (expectedIdx > 0) {
      // look for layer to insert after
      let i = expectedIdx + 1;
      let preceedIdx = null;
      while (i-- > 0 && preceedIdx === null) {
        const preceedLayer = preservedOrder[expectedIdx - 1];
        preceedIdx = layerOrderQueue.indexOf(preceedLayer);
      }

      if (preceedIdx > -1) {
        insertAt = preceedIdx + 1;
      }
    }

    layerOrderQueue = arrayInsert(layerOrderQueue, insertAt, newLayer.id);
    newLayers = newLayers.concat(newLayer);
  }

  // reconstruct layerOrder after insert
  const newLayerOrder = layerOrderQueue.map(id => newLayers.findIndex(l => l.id === id));

  return {
    newLayerOrder,
    newLayers
  };
}

/**
 * Merge interactions with saved config
 *
 * @type {typeof import('./vis-state-merger').mergeInteractions}
 */
export function mergeInteractions(state, interactionToBeMerged) {
  const merged = {};
  const unmerged = {};

  if (interactionToBeMerged) {
    Object.keys(interactionToBeMerged).forEach(key => {
      if (!state.interactionConfig[key]) {
        return;
      }

      const currentConfig = state.interactionConfig[key].config;

      const {enabled, ...configSaved} = interactionToBeMerged[key] || {};
      let configToMerge = configSaved;

      if (key === 'tooltip') {
        const {mergedTooltip, unmergedTooltip} = mergeInteractionTooltipConfig(state, configSaved);

        // merge new dataset tooltips with original dataset tooltips
        configToMerge = {
          fieldsToShow: {
            ...currentConfig.fieldsToShow,
            ...mergedTooltip
          }
        };

        if (Object.keys(unmergedTooltip).length) {
          unmerged.tooltip = {fieldsToShow: unmergedTooltip, enabled};
        }
      }

      merged[key] = {
        ...state.interactionConfig[key],
        enabled,
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

  return {
    ...state,
    interactionConfig: {
      ...state.interactionConfig,
      ...merged
    },
    interactionToBeMerged: unmerged
  };
}

/**
 * Merge splitMaps config with current visStete.
 * 1. if current map is split, but splitMap DOESNOT contain maps
 *    : don't merge anything
 * 2. if current map is NOT split, but splitMaps contain maps
 *    : add to splitMaps, and add current layers to splitMaps
 * @type {typeof import('./vis-state-merger').mergeInteractions}
 */
export function mergeSplitMaps(state, splitMaps = []) {
  const merged = [...state.splitMaps];
  const unmerged = [];
  splitMaps.forEach((sm, i) => {
    Object.entries(sm.layers).forEach(([id, value]) => {
      // check if layer exists
      const pushTo = state.layers.find(l => l.id === id) ? merged : unmerged;

      // create map panel if current map is not split
      pushTo[i] = pushTo[i] || {
        layers: pushTo === merged ? getInitialMapLayersForSplitMap(state.layers) : []
      };
      pushTo[i].layers = {
        ...pushTo[i].layers,
        [id]: value
      };
    });
  });

  return {
    ...state,
    splitMaps: merged,
    splitMapsToBeMerged: [...state.splitMapsToBeMerged, ...unmerged]
  };
}

/**
 * Merge interactionConfig.tooltip with saved config,
 * validate fieldsToShow
 *
 * @param {object} state
 * @param {object} tooltipConfig
 * @return {object} - {mergedTooltip: {}, unmergedTooltip: {}}
 */
export function mergeInteractionTooltipConfig(state, tooltipConfig = {}) {
  const unmergedTooltip = {};
  const mergedTooltip = {};

  if (!tooltipConfig.fieldsToShow || !Object.keys(tooltipConfig.fieldsToShow).length) {
    return {mergedTooltip, unmergedTooltip};
  }

  for (const dataId in tooltipConfig.fieldsToShow) {
    if (!state.datasets[dataId]) {
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
 * @type {typeof import('./vis-state-merger').mergeLayerBlending}
 */
export function mergeLayerBlending(state, layerBlending) {
  if (layerBlending && LAYER_BLENDINGS[layerBlending]) {
    return {
      ...state,
      layerBlending
    };
  }

  return state;
}

/**
 * Merge animation config
 * @type {typeof import('./vis-state-merger').mergeAnimationConfig}
 */
export function mergeAnimationConfig(state, animation) {
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

/**
 * Validate saved layer columns with new data,
 * update fieldIdx based on new fields
 *
 * @param {Array<Object>} fields
 * @param {Object} savedCols
 * @param {Object} emptyCols
 * @return {null | Object} - validated columns or null
 */

export function validateSavedLayerColumns(fields, savedCols = {}, emptyCols) {
  // Prepare columns for the validator
  const columns = {};
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

  if (allColFound) {
    return columns;
  }

  return null;
}

export function validateColumn(column, columns, allFields) {
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
 * @return {Object} - validated textlabel
 */
export function validateSavedTextLabel(fields, [layerTextLabel], savedTextLabel) {
  const savedTextLabels = Array.isArray(savedTextLabel) ? savedTextLabel : [savedTextLabel];

  // validate field
  return savedTextLabels.map(textLabel => {
    const field = textLabel.field
      ? fields.find(fd =>
          Object.keys(textLabel.field).every(key => textLabel.field[key] === fd[key])
        )
      : null;

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
 * @type {typeof import('./vis-state-merger').validateSavedVisualChannels}
 */
export function validateSavedVisualChannels(fields, newLayer, savedLayer) {
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
    }
  });
  return newLayer;
}

export function validateLayersByDatasets(datasets, layerClasses, layers) {
  const validated = [];
  const failed = [];

  layers.forEach(layer => {
    let validateLayer;
    if (!layer || !layer.config) {
      validateLayer = null;
    } else if (datasets[layer.config.dataId]) {
      // datasets are already loaded
      validateLayer = validateLayerWithData(datasets[layer.config.dataId], layer, layerClasses);
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
 * Validate saved layer config with new data,
 * update fieldIdx based on new fields
 * @type {typeof import('./vis-state-merger').validateLayerWithData}
 */
export function validateLayerWithData(
  {fields, id: dataId},
  savedLayer,
  layerClasses,
  options = {}
) {
  const {type} = savedLayer;
  // layer doesnt have a valid type
  if (!type || !layerClasses.hasOwnProperty(type) || !savedLayer.config) {
    return null;
  }

  let newLayer = new layerClasses[type]({
    id: savedLayer.id,
    dataId,
    label: savedLayer.config.label,
    color: savedLayer.config.color,
    isVisible: savedLayer.config.isVisible,
    hidden: savedLayer.config.hidden,
    highlightColor: savedLayer.config.highlightColor
  });

  // find column fieldIdx
  const columnConfig = newLayer.getLayerColumns();
  if (Object.keys(columnConfig).length) {
    const columns = validateSavedLayerColumns(fields, savedLayer.config.columns, columnConfig);
    if (columns) {
      newLayer.updateLayerConfig({columns});
    } else if (!options.allowEmptyColumn) {
      return null;
    }
  }

  // visual channel field is saved to be {name, type}
  // find visual channel field by matching both name and type
  // refer to vis-state-schema.js VisualChannelSchemaV1
  newLayer = validateSavedVisualChannels(fields, newLayer, savedLayer);

  const textLabel =
    savedLayer.config.textLabel && newLayer.config.textLabel
      ? validateSavedTextLabel(fields, newLayer.config.textLabel, savedLayer.config.textLabel)
      : newLayer.config.textLabel;

  // copy visConfig over to emptyLayer to make sure it has all the props
  const visConfig = newLayer.copyLayerConfig(
    newLayer.config.visConfig,
    savedLayer.config.visConfig || {},
    {shallowCopy: ['colorRange', 'strokeColorRange']}
  );

  newLayer.updateLayerConfig({
    visConfig,
    textLabel
  });

  return newLayer;
}

export function isValidMerger(merger) {
  return isObject(merger) && typeof merger.merge === 'function' && typeof merger.prop === 'string';
}

export const VIS_STATE_MERGERS = [
  {merge: mergeLayers, prop: 'layers', toMergeProp: 'layerToBeMerged'},
  {merge: mergeFilters, prop: 'filters', toMergeProp: 'filterToBeMerged'},
  {merge: mergeInteractions, prop: 'interactionConfig', toMergeProp: 'interactionToBeMerged'},
  {merge: mergeLayerBlending, prop: 'layerBlending'},
  {merge: mergeSplitMaps, prop: 'splitMaps', toMergeProp: 'splitMapsToBeMerged'},
  {merge: mergeAnimationConfig, prop: 'animationConfig'}
];

// Copyright (c) 2018 Uber Technologies, Inc.
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

import {
  getDefaultFilter,
  getFilterProps,
  getFilterPlot,
  filterData,
  adjustValueToFilterDomain
} from 'utils/filter-utils';

import {LAYER_BLENDINGS} from 'constants/default-settings';

/**
 * Merge loaded filters with current state, if no fields or data are loaded
 * save it for later
 *
 * @param {Object} state
 * @param {Object[]} filtersToMerge
 * @return {Object} updatedState
 */
export function mergeFilters(state, filtersToMerge) {
  const merged = [];
  const unmerged = [];
  const {datasets} = state;

  if (!Array.isArray(filtersToMerge) || !filtersToMerge.length) {
    return state;
  }

  // merge filters
  filtersToMerge.forEach(filter => {
    // match filter.dataId with current datesets id
    // uploaded data need to have the same dataId with the filter
    if (datasets[filter.dataId]) {
      // datasets is already loaded
      const validateFilter = validateFilterWithData(
        datasets[filter.dataId],
        filter
      );

      if (validateFilter) {
        merged.push(validateFilter);
      }
    } else {
      // datasets not yet loaded
      unmerged.push(filter);
    }
  });

  // filter data
  const updatedFilters = [...(state.filters || []), ...merged];
  const datasetToFilter = uniq(merged.map(d => d.dataId));

  const updatedDataset = datasetToFilter.reduce(
    (accu, dataId) => ({
      ...accu,
      [dataId]: {
        ...datasets[dataId],
        ...filterData(datasets[dataId].allData, dataId, updatedFilters)
      }
    }),
    datasets
  );

  return {
    ...state,
    filters: updatedFilters,
    datasets: updatedDataset,
    filterToBeMerged: unmerged
  };
}

/**
 * Merge layers from de-serialized state, if no fields or data are loaded
 * save it for later
 *
 * @param {object} state
 * @param {Object[]} layersToMerge
 * @return {Object} state
 */
export function mergeLayers(state, layersToMerge) {
  const mergedLayer = [];
  const unmerged = [];

  const {datasets} = state;

  if (!Array.isArray(layersToMerge) || !layersToMerge.length) {
    return state;
  }

  layersToMerge.forEach(layer => {
    if (datasets[layer.config.dataId]) {
      // datasets are already loaded
      const validateLayer = validateLayerWithData(
        datasets[layer.config.dataId],
        layer,
        state.layerClasses
      );

      if (validateLayer) {
        mergedLayer.push(validateLayer);
      }
    } else {
      // datasets not yet loaded
      unmerged.push(layer);
    }
  });

  const layers = [...state.layers, ...mergedLayer];
  const newLayerOrder = mergedLayer.map((_, i) => state.layers.length + i);

  // put new layers in front of current layers
  const layerOrder = [...newLayerOrder, ...state.layerOrder];

  return {
    ...state,
    layers,
    layerOrder,
    layerToBeMerged: unmerged
  };
}

/**
 * Merge interactions with saved config
 *
 * @param {object} state
 * @param {Object} interactionToBeMerged
 * @return {Object} mergedState
 */
export function mergeInteractions(state, interactionToBeMerged) {
  const merged = {};
  const unmerged = {};

  if (interactionToBeMerged) {
    Object.keys(interactionToBeMerged).forEach(key => {
      if (!state.interactionConfig[key]) {
        return;
      }

      const {enabled, ...configSaved} = interactionToBeMerged[key] || {};
      let configToMerge = configSaved;

      if (key === 'tooltip') {
        const {mergedTooltip, unmergedTooltip} = mergeInteractionTooltipConfig(
          state,
          configSaved
        );

        // merge new dataset tooltips with original dataset tooltips
        configToMerge = {
          fieldsToShow: {
            ...state.interactionConfig[key].config.fieldsToShow,
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
        config: pick(
          {
            ...state.interactionConfig[key].config,
            ...configToMerge
          },
          Object.keys(state.interactionConfig[key].config)
        )
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
 * Merge interactionConfig.tooltip with saved config,
 * validate fieldsToShow
 *
 * @param {string} state
 * @param {Object} tooltipConfig
 * @return {Object} - {mergedTooltip: {}, unmergedTooltip: {}}
 */
export function mergeInteractionTooltipConfig(state, tooltipConfig = {}) {
  const unmergedTooltip = {};
  const mergedTooltip = {};

  if (
    !tooltipConfig.fieldsToShow ||
    !Object.keys(tooltipConfig.fieldsToShow).length
  ) {
    return {mergedTooltip, unmergedTooltip};
  }

  for (const dataId in tooltipConfig.fieldsToShow) {
    if (!state.datasets[dataId]) {
      // is not yet loaded
      unmergedTooltip[dataId] = tooltipConfig.fieldsToShow[dataId];
    } else {
      // if dataset is loaded
      const allFields = state.datasets[dataId].fields.map(d => d.name);
      const foundFieldsToShow = tooltipConfig.fieldsToShow[dataId].filter(
        name => allFields.includes(name)
      );

      mergedTooltip[dataId] = foundFieldsToShow;
    }
  }

  return {mergedTooltip, unmergedTooltip};
}
/**
 * Merge layerBlending with saved
 *
 * @param {object} state
 * @param {string} layerBlending
 * @return {object} merged state
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
 * Validate saved layer columns with new data,
 * update fieldIdx based on new fields
 *
 * @param {Object[]} fields
 * @param {Object} savedCols
 * @param {Object} emptyCols
 * @return {null | Object} - validated columns or null
 */

export function validateSavedLayerColumns(fields, savedCols, emptyCols) {
  const colFound = {};
  // find actual column fieldIdx, in case it has changed
  const allColFound = Object.keys(emptyCols).every(key => {
    const saved = savedCols[key];
    colFound[key] = {...emptyCols[key]};

    const fieldIdx = fields.findIndex(({name}) => name === saved);

    if (fieldIdx > -1) {
      // update found columns
      colFound[key].fieldIdx = fieldIdx;
      colFound[key].value = saved;
      return true;
    }

    // if col is optional, allow null value
    return emptyCols[key].optional || false;
  });

  return allColFound && colFound;
}

/**
 * Validate saved text label config with new data
 * refer to vis-state-schema.js TextLabelSchemaV1
 *
 * @param {Object[]} fields
 * @param {Object} savedTextLabel
 * @return {Object} - validated textlabel
 */
export function validateSavedTextLabel(fields, layerTextLabel, savedTextLabel) {

  // validate field
  const field = savedTextLabel.field ? fields.find(fd =>
    Object.keys(savedTextLabel.field).every(
      key => savedTextLabel.field[key] === fd[key]
    )
  ) : null;

  return Object.keys(layerTextLabel).reduce((accu, key) => ({
    ...accu,
    [key]: key === 'field' ? field : (savedTextLabel[key] || layerTextLabel[key])
  }), {});
}

/**
 * Validate saved visual channels config with new data,
 * refer to vis-state-schema.js VisualChannelSchemaV1
 *
 * @param {Object[]} fields
 * @param {Object} visualChannels
 * @param {Object} savedLayer
 * @return {Object} - validated visual channel in config or {}
 */
export function validateSavedVisualChannels(
  fields,
  visualChannels,
  savedLayer
) {
  return Object.values(visualChannels).reduce((found, {field, scale}) => {
    let foundField;
    if (savedLayer.config[field]) {
      foundField = fields.find(fd =>
        Object.keys(savedLayer.config[field]).every(
          key => savedLayer.config[field][key] === fd[key]
        )
      );
    }

    return {
      ...found,
      ...(foundField ? {[field]: foundField} : {}),
      ...(savedLayer.config[scale] ? {[scale]: savedLayer.config[scale]} : {})
    };
  }, {});
}

/**
 * Validate saved layer config with new data,
 * update fieldIdx based on new fields
 *
 * @param {Object[]} fields
 * @param {String} dataId
 * @param {Object} savedLayer
 * @param {Object} layerClasses
 * @return {null | Object} - validated layer or null
 */
export function validateLayerWithData({fields, id: dataId}, savedLayer, layerClasses) {
  const {type} = savedLayer;
  // layer doesnt have a valid type
  if (
    !layerClasses.hasOwnProperty(type) ||
    !savedLayer.config ||
    !savedLayer.config.columns
  ) {
    return null;
  }

  const newLayer = new layerClasses[type]({
    id: savedLayer.id,
    dataId,
    label: savedLayer.config.label,
    color: savedLayer.config.color,
    isVisible: savedLayer.config.isVisible
  });

  // find column fieldIdx
  const columns = validateSavedLayerColumns(
    fields,
    savedLayer.config.columns,
    newLayer.getLayerColumns()
  );

  if (!columns) {
    return null;
  }

  // visual channel field is saved to be {name, type}
  // find visual channel field by matching both name and type
  // refer to vis-state-schema.js VisualChannelSchemaV1
  const foundVisualChannelConfigs = validateSavedVisualChannels(
    fields,
    newLayer.visualChannels,
    savedLayer
  );

  const textLabel = savedLayer.config.textLabel && newLayer.config.textLabel ? validateSavedTextLabel(
    fields,
    newLayer.config.textLabel,
    savedLayer.config.textLabel
  ) : newLayer.config.textLabel;

  // copy visConfig over to emptyLayer to make sure it has all the props
  const visConfig = newLayer.copyLayerConfig(
    newLayer.config.visConfig,
    savedLayer.config.visConfig || {},
    {notToDeepMerge: 'colorRange'}
  );

  newLayer.updateLayerConfig({
    columns,
    visConfig,
    textLabel,
    ...foundVisualChannelConfigs
  });

  return newLayer;
}

/**
 * Validate saved filter config with new data,
 * calculate domain and fieldIdx based new fields and data
 *
 * @param {Object[]} dataset.fields
 * @param {Object[]} dataset.allData
 * @param {Object} filter - filter to be validate
 * @return {Object | null} - validated filter
 */
export function validateFilterWithData({fields, allData}, filter) {
  // match filter.name to field.name
  const fieldIdx = fields.findIndex(({name}) => name === filter.name);

  if (fieldIdx < 0) {
    // if can't find field with same name, discharge filter
    return null;
  }

  const field = fields[fieldIdx];
  const value = filter.value;

  // return filter type, default value, fieldType and fieldDomain from field
  const filterPropsFromField = getFilterProps(allData, field);

  let matchedFilter = {
    ...getDefaultFilter(filter.dataId),
    ...filter,
    ...filterPropsFromField,
    freeze: true,
    fieldIdx
  };

  const {yAxis} = matchedFilter;
  if (yAxis) {
    const matcheAxis = fields.find(
      ({name, type}) => name === yAxis.name && type === yAxis.type
    );

    matchedFilter = matcheAxis
      ? {
          ...matchedFilter,
          yAxis: matcheAxis,
          ...getFilterPlot({...matchedFilter, yAxis: matcheAxis}, allData)
        }
      : matchedFilter;
  }

  matchedFilter.value = adjustValueToFilterDomain(value, matchedFilter);

  if (matchedFilter.value === null) {
    // cannt adjust saved value to filter
    return null;
  }

  return matchedFilter;
}

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// vis-state-reducer
import {PickInfo} from '@deck.gl/core/lib/deck';
import {default as ActionTypes} from './action-types';
import {FileCacheItem} from '@kepler.gl/processors';
import {Layer, LayerBaseConfig} from '@kepler.gl/layers';
import {
  AddDataToMapPayload,
  ValueOf,
  Merge,
  RGBColor,
  NestedPartial,
  LayerVisConfig,
  ColorUI,
  Feature,
  FeatureSelectionContext,
  InteractionConfig,
  Filter,
  ParsedConfig,
  ParsedLayer,
  EffectPropsPartial,
  SyncTimelineMode
} from '@kepler.gl/types';
// TODO - import LoaderObject type from @loaders.gl/core when supported
// TODO - import LoadOptions type from @loaders.gl/core when supported

export type ApplyLayerConfigUpdaterAction = {
  oldLayerId: string;
  newLayerConfig: ParsedLayer;
  layerIndex?: number;
};

/**
 * Update layer base config: dataId, label, column, isVisible
 * @param oldLayerId - layer id to be updated
 * @param newLayerConfig - new layer config
 * @param layerIndex - (Optional) Index of the layer to be updated (can be useful in some cases, because
 *                     the layer id might change during update, e.g. when the type of the layer changes)
 * @returns action
 * @public
 */
export function applyLayerConfig(
  oldLayerId: string,
  newLayerConfig: ParsedLayer,
  layerIndex?: number
): Merge<ApplyLayerConfigUpdaterAction, {type: typeof ActionTypes.APPLY_LAYER_CONFIG}> {
  return {
    type: ActionTypes.APPLY_LAYER_CONFIG,
    oldLayerId,
    newLayerConfig,
    layerIndex
  };
}

export type LayerConfigChangeUpdaterAction = {
  oldLayer: Layer;
  newConfig: Partial<LayerBaseConfig>;
};
/**
 * Update layer base config: dataId, label, column, isVisible
 * @param oldLayer - layer to be updated
 * @param newConfig - new config to be merged with old config
 * @returns action
 * @public
 */
export function layerConfigChange(
  oldLayer: Layer,
  newConfig: Partial<LayerBaseConfig>
): Merge<LayerConfigChangeUpdaterAction, {type: typeof ActionTypes.LAYER_CONFIG_CHANGE}> {
  return {
    type: ActionTypes.LAYER_CONFIG_CHANGE,
    oldLayer,
    newConfig
  };
}
export type LayerTextLabelChangeUpdaterAction = {
  oldLayer: Layer;
  idx: number | 'all';
  prop: string;
  value: any;
};

/**
 * Update layer text label
 * @param oldLayer - layer to be updated
 * @param idx -`idx` of text label to be updated
 * @param prop - `prop` of text label, e,g, `anchor`, `alignment`, `color`, `size`, `field`, `outlineWidth`, `outlineColor`
 * @param value - new value
 * @returns action
 * @public
 */
export function layerTextLabelChange(
  oldLayer: Layer,
  idx: number | 'all',
  prop: string,
  value: any
): Merge<LayerTextLabelChangeUpdaterAction, {type: typeof ActionTypes.LAYER_TEXT_LABEL_CHANGE}> {
  return {
    type: ActionTypes.LAYER_TEXT_LABEL_CHANGE,
    oldLayer,
    idx,
    prop,
    value
  };
}

export type LayerSetIsValidUpdaterAction = {
  oldLayer: Layer;
  isValid: boolean;
};

/**
 * Changes value of isValid flag for a layer.
 * The action also updates visibility of the layer based on isValid.
 * @param oldLayer - layer to be updated
 * @param isValid - new value for isValid flag
 * @returns action
 * @public
 */
export function layerSetIsValid(
  oldLayer: Layer,
  isValid: boolean
): Merge<LayerSetIsValidUpdaterAction, {type: typeof ActionTypes.LAYER_SET_IS_VALID}> {
  return {
    type: ActionTypes.LAYER_SET_IS_VALID,
    oldLayer,
    isValid
  };
}

export type LayerTypeChangeUpdaterAction = {
  oldLayer: Layer;
  newType: string;
};
/**
 * Update layer type. Previews layer config will be copied if applicable.
 * @param oldLayer - layer to be updated
 * @param newType - new type
 * @returns action
 * @public
 */
export function layerTypeChange(
  oldLayer: Layer,
  newType: string
): Merge<LayerTypeChangeUpdaterAction, {type: typeof ActionTypes.LAYER_TYPE_CHANGE}> {
  return {
    type: ActionTypes.LAYER_TYPE_CHANGE,
    oldLayer,
    newType
  };
}
export type LayerVisualChannelConfigChangeUpdaterAction = {
  oldLayer: Layer;
  newConfig: Partial<LayerBaseConfig>;
  channel: string;
  newVisConfig?: Partial<LayerVisConfig>;
};
/**
 * Update layer visual channel
 * @memberof visStateActions
 * @param oldLayer - layer to be updated
 * @param newConfig - new visual channel config
 * @param channel - channel to be updated
 * @returns action
 * @public
 */
export function layerVisualChannelConfigChange(
  oldLayer: Layer,
  newConfig: Partial<LayerBaseConfig>,
  channel: string,
  newVisConfig?: Partial<LayerVisConfig>
): Merge<
  LayerVisualChannelConfigChangeUpdaterAction,
  {type: typeof ActionTypes.LAYER_VISUAL_CHANNEL_CHANGE}
> {
  return {
    type: ActionTypes.LAYER_VISUAL_CHANNEL_CHANGE,
    oldLayer,
    newConfig,
    channel,
    newVisConfig
  };
}
export type LayerVisConfigChangeUpdaterAction = {
  oldLayer: Layer;
  newVisConfig: Partial<LayerVisConfig>;
};
/**
 * Update layer `visConfig`
 * @memberof visStateActions
 * @param oldLayer - layer to be updated
 * @param newVisConfig - new visConfig as a key value map: e.g. `{opacity: 0.8}`
 * @returns action
 * @public
 */
export function layerVisConfigChange(
  oldLayer: Layer,
  newVisConfig: Partial<LayerVisConfig>
): Merge<LayerVisConfigChangeUpdaterAction, {type: typeof ActionTypes.LAYER_VIS_CONFIG_CHANGE}> {
  return {
    type: ActionTypes.LAYER_VIS_CONFIG_CHANGE,
    oldLayer,
    newVisConfig
  };
}
export type LayerColorUIChangeUpdaterAction = {
  oldLayer: Layer;
  prop: string;
  newConfig: NestedPartial<ColorUI>;
};

/**
 * Set the color palette ui for layer color
 * @memberof visStateActions
 * @param oldLayer - layer to be updated
 * @param prop - which color prop
 * @param newConfig - to be merged
 * @returns action
 * @public
 */
export function layerColorUIChange(
  oldLayer: Layer,
  prop: string,
  newConfig: NestedPartial<ColorUI>
): Merge<LayerColorUIChangeUpdaterAction, {type: typeof ActionTypes.LAYER_COLOR_UI_CHANGE}> {
  return {
    type: ActionTypes.LAYER_COLOR_UI_CHANGE,
    oldLayer,
    prop,
    newConfig
  };
}

export type UpdateLayerBlendingUpdaterAction = {
  mode: 'additive' | 'normal' | 'subtractive';
};
/**
 * Update layer blending mode
 * @memberof visStateActions
 * @param mode one of `additive`, `normal` and `subtractive`
 * @returns action
 * @public
 */
export function updateLayerBlending(
  mode: 'additive' | 'normal' | 'subtractive'
): Merge<UpdateLayerBlendingUpdaterAction, {type: typeof ActionTypes.UPDATE_LAYER_BLENDING}> {
  return {
    type: ActionTypes.UPDATE_LAYER_BLENDING,
    mode
  };
}

export type UpdateOverlayBlendingUpdaterAction = {
  mode: 'screen' | 'normal' | 'darken';
};

/**
 * Update overlay blending mode
 * @memberof visStateActions
 * @param mode one of `screen`, `normal` and `darken`
 * @returns action
 * @public
 */
export function updateOverlayBlending(
  mode: 'screen' | 'normal' | 'darken'
): Merge<UpdateOverlayBlendingUpdaterAction, {type: typeof ActionTypes.UPDATE_OVERLAY_BLENDING}> {
  return {
    type: ActionTypes.UPDATE_OVERLAY_BLENDING,
    mode
  };
}

export type InteractionConfigChangeUpdaterAction = {
  config: ValueOf<InteractionConfig>;
};
/**
 * Update `interactionConfig`
 * @memberof visStateActions
 * @param config - new config as key value map: `{tooltip: {enabled: true}}`
 * @returns action
 * @public
 */
export function interactionConfigChange(
  config: ValueOf<InteractionConfig>
): Merge<
  InteractionConfigChangeUpdaterAction,
  {type: typeof ActionTypes.INTERACTION_CONFIG_CHANGE}
> {
  return {
    type: ActionTypes.INTERACTION_CONFIG_CHANGE,
    config
  };
}

export type SetFilterUpdaterAction = {
  idx: number;
  prop: string | string[];
  value: any;
  valueIndex?: number;
};
/**
 * Update filter property
 * @memberof visStateActions
 * @param idx -`idx` of filter to be updated
 * @param prop - `prop` of filter, e,g, `dataId`, `name`, `value`
 *                or an array e.g. ['idx', 'name']. in that case the value
 *                should also be an array of the corresponding values (by index)
 * @param value - new value
 * @param valueIndex - dataId index
 * @returns action
 * @public
 */
export function setFilter(
  idx: number,
  prop: string | string[],
  value: any,
  valueIndex?: number
): Merge<SetFilterUpdaterAction, {type: typeof ActionTypes.SET_FILTER}> {
  return {
    type: ActionTypes.SET_FILTER,
    idx,
    prop,
    value,
    valueIndex
  };
}

export type SetFilterAnimationTimeUpdaterAction = {
  idx: number;
  prop: string;
  value: any;
  valueIndex?: number;
};
/**
 * Same as Update filter
 * @memberof visStateActions
 * @param idx -`idx` of filter to be updated
 * @param prop - `prop` of filter, e,g, `dataId`, `name`, `value`
 * @param value - new value
 * @param valueIndex - dataId index
 * @returns action
 * @public
 */
export function setFilterAnimationTime(
  idx: number,
  prop: string,
  value: any,
  valueIndex?: number
): Merge<
  SetFilterAnimationTimeUpdaterAction,
  {type: typeof ActionTypes.SET_FILTER_ANIMATION_TIME}
> {
  return {
    type: ActionTypes.SET_FILTER_ANIMATION_TIME,
    idx,
    prop,
    value,
    valueIndex
  };
}

export type SetFilterAnimationWindowUpdaterAction = {
  id: string;
  animationWindow: string;
};
/**
 * Same as Update filter
 * @memberof visStateActions
 * @public
 */
export function setFilterAnimationWindow({
  id,
  animationWindow
}: SetFilterAnimationWindowUpdaterAction): Merge<
  SetFilterAnimationWindowUpdaterAction,
  {type: typeof ActionTypes.SET_FILTER_ANIMATION_WINDOW}
> {
  return {
    type: ActionTypes.SET_FILTER_ANIMATION_WINDOW,
    id,
    animationWindow
  };
}

export type AddFilterUpdaterAction = {
  dataId?: string | string[] | null;
  id?: string;
};
/**
 * Add a new filter
 * @memberof visStateActions
 * @param dataId - dataset `id` this new filter is associated with
 * @param id - `id` for the new filter
 * @returns action
 * @public
 */
export function addFilter(
  dataId: string | null,
  id?: string
): Merge<AddFilterUpdaterAction, {type: typeof ActionTypes.ADD_FILTER}> {
  return {
    type: ActionTypes.ADD_FILTER,
    dataId,
    id
  };
}

export type CreateOrUpdateFilterUpdaterAction = {
  id?: string;
  dataId?: string | string[];
  field?: string | string[];
  value?: any;
};

/**
 * Create or updates a filter
 * @memberof visStateActions
 * @param dataId - dataset `id` this new filter is associated with
 * @returns action
 * @public
 */
export function createOrUpdateFilter(
  id?: string,
  dataId?: string | string[],
  field?: string | string[],
  value?: any
): Merge<CreateOrUpdateFilterUpdaterAction, {type: typeof ActionTypes.CREATE_OR_UPDATE_FILTER}> {
  return {
    type: ActionTypes.CREATE_OR_UPDATE_FILTER,
    id,
    dataId,
    field,
    value
  };
}

export type AddLayerUpdaterAction = {
  config?: object;
  datasetId?: string;
};
/**
 * Add a new layer
 * @memberof visStateActions
 * @param config - new layer config
 * @param datasetId - dataset id used for creating an empty layer
 * @returns action
 * @public
 */
export function addLayer(
  config?: object,
  datasetId?: string
): Merge<AddLayerUpdaterAction, {type: typeof ActionTypes.ADD_LAYER}> {
  return {
    type: ActionTypes.ADD_LAYER,
    config,
    datasetId
  };
}

export type ReorderLayerUpdaterAction = {
  order: string[];
};
/**
 * Reorder layer, order is an array of layer indexes, index 0 will be the one at the bottom
 * @memberof visStateActions
 * @param order an array of layer indexes
 * @returns action
 * @public
 * @example
 *
 * bring `layers[1]` below `layers[0]`, the sequence layers will be rendered is `layers[1].id`, `layers[0].id`, `layers[2].id`, `layers[3].id`.
 * `layers[1]` will be at the bottom, `layers[13]` will be at the top.
 * this.props.dispatch(reorderLayer([`layers[1].id`, `layers[0].id`, `layers[2].id`, `layers[3].id`]));
 */
export function reorderLayer(
  order: string[]
): Merge<ReorderLayerUpdaterAction, {type: typeof ActionTypes.REORDER_LAYER}> {
  return {
    type: ActionTypes.REORDER_LAYER,
    order
  };
}

export type RemoveFilterUpdaterAction = {
  idx: number;
};
/**
 * Remove a filter from `visState.filters`, once a filter is removed, data will be re-filtered and layer will be updated
 * @memberof visStateActions
 * @param idx idx of filter to be removed
 * @returns action
 * @public
 */
export function removeFilter(
  idx: number
): Merge<RemoveFilterUpdaterAction, {type: typeof ActionTypes.REMOVE_FILTER}> {
  return {
    type: ActionTypes.REMOVE_FILTER,
    idx
  };
}

export type RemoveLayerUpdaterAction = {
  id: string;
};
/**
 * Remove a layer
 * @memberof visStateActions
 * @param id idx of layer to be removed
 * @returns action
 * @public
 */
export function removeLayer(
  id: string
): Merge<RemoveLayerUpdaterAction, {type: typeof ActionTypes.REMOVE_LAYER}> {
  return {
    type: ActionTypes.REMOVE_LAYER,
    id
  };
}

export type DuplicateLayerUpdaterAction = {
  id: string;
};
/**
 * Duplicate a layer
 * @memberof visStateActions
 * @param id id of layer to be duplicated
 * @returns action
 * @public
 */
export function duplicateLayer(
  id: string
): Merge<DuplicateLayerUpdaterAction, {type: typeof ActionTypes.DUPLICATE_LAYER}> {
  return {
    type: ActionTypes.DUPLICATE_LAYER,
    id
  };
}

export type AddEffectUpdaterAction = {
  config: EffectPropsPartial;
};

/**
 * Add a new effect
 * @memberof visStateActions
 * @param config - new effect config
 * @returns action
 * @public
 */
export function addEffect(
  config: EffectPropsPartial
): Merge<AddEffectUpdaterAction, {type: typeof ActionTypes.ADD_EFFECT}> {
  return {
    type: ActionTypes.ADD_EFFECT,
    config
  };
}

export type ReorderEffectUpdaterAction = {
  order: string[];
};

/**
 * Reorder effects
 * @memberof visStateActions
 * @param order an array of effect ids
 * @returns action
 * @public
 */
export function reorderEffect(
  order: string[]
): Merge<ReorderEffectUpdaterAction, {type: typeof ActionTypes.REORDER_EFFECT}> {
  return {
    type: ActionTypes.REORDER_EFFECT,
    order
  };
}

export type RemoveEffectUpdaterAction = {
  id: string;
};

/**
 * Remove an effect
 * @memberof visStateActions
 * @param id idx of the effect to be removed
 * @returns action
 * @public
 */
export function removeEffect(
  id: string
): Merge<RemoveEffectUpdaterAction, {type: typeof ActionTypes.REMOVE_EFFECT}> {
  return {
    type: ActionTypes.REMOVE_EFFECT,
    id
  };
}

export type UpdateEffectUpdaterAction = {
  id: string;
  props: EffectPropsPartial;
};

/**
 * Update an effect
 * @memberof visStateActions
 * @param props idx of the effect to be updated with specified props
 * @returns action
 * @public
 */
export function updateEffect(
  id: string,
  props: EffectPropsPartial
): Merge<UpdateEffectUpdaterAction, {type: typeof ActionTypes.UPDATE_EFFECT}> {
  return {
    type: ActionTypes.UPDATE_EFFECT,
    id,
    props
  };
}

export type RemoveDatasetUpdaterAction = {
  dataId: string;
};
/**
 * Remove a dataset and all layers, filters, tooltip configs that based on it
 * @memberof visStateActions
 * @param dataId dataset id
 * @returns action
 * @public
 */
export function removeDataset(
  dataId: string
): Merge<RemoveDatasetUpdaterAction, {type: typeof ActionTypes.REMOVE_DATASET}> {
  return {
    type: ActionTypes.REMOVE_DATASET,
    dataId
  };
}

export type ShowDatasetTableUpdaterAction = {
  dataId: string;
};
/**
 * Display dataset table in a modal
 * @memberof visStateActions
 * @param dataId dataset id to show in table
 * @returns action
 * @public
 */
export function showDatasetTable(
  dataId: string
): Merge<ShowDatasetTableUpdaterAction, {type: typeof ActionTypes.SHOW_DATASET_TABLE}> {
  return {
    type: ActionTypes.SHOW_DATASET_TABLE,
    dataId
  };
}

export type UpdateDatasetColorUpdater = {
  dataId: string;
  newColor: RGBColor;
};
/**
 * Update dataset color to custom by means of color picker
 * @memberof visStateActions
 * @param dataId dataset `id` this custom color is associated with
 * @param newColor custom color in RGBformat
 * @returns action
 * @public
 */
export function updateTableColor(
  dataId: string,
  newColor: RGBColor
): Merge<UpdateDatasetColorUpdater, {type: typeof ActionTypes.UPDATE_TABLE_COLOR}> {
  return {
    type: ActionTypes.UPDATE_TABLE_COLOR,
    dataId,
    newColor
  };
}

export type SortTableColumnUpdaterAction = {
  dataId: string;
  column: string;
  mode?: string;
};
/**
 * Sort dataset column, for table display
 * @memberof visStateActions
 * @param dataId
 * @param column
 * @param mode
 * @returns action
 * @public
 */
export function sortTableColumn(
  dataId: string,
  column: string,
  mode?: string
): Merge<SortTableColumnUpdaterAction, {type: typeof ActionTypes.SORT_TABLE_COLUMN}> {
  return {
    type: ActionTypes.SORT_TABLE_COLUMN,
    dataId,
    column,
    mode
  };
}

export type PinTableColumnUpdaterAction = {
  dataId: string;
  column: string;
};
/**
 * Pin dataset column, for table display
 * @param dataId
 * @param column
 * @returns action
 * @public
 */
export function pinTableColumn(
  dataId: string,
  column: string
): Merge<PinTableColumnUpdaterAction, {type: typeof ActionTypes.PIN_TABLE_COLUMN}> {
  return {
    type: ActionTypes.PIN_TABLE_COLUMN,
    dataId,
    column
  };
}

export type CopyTableColumnUpdaterAction = {
  dataId: string;
  column: string;
};
/**
 * Copy column, for table display
 * @param dataId
 * @param column
 * @returns action
 * @public
 */
export function copyTableColumn(
  dataId: string,
  column: string
): Merge<CopyTableColumnUpdaterAction, {type: typeof ActionTypes.COPY_TABLE_COLUMN}> {
  return {
    type: ActionTypes.COPY_TABLE_COLUMN,
    dataId,
    column
  };
}

export type SetColumnDisplayFormatUpdaterAction = {
  dataId: string;
  formats: {
    [key: string]: string;
  };
};

/**
 * Set column display format
 * @param dataId
 * @param formats
 * @returns action
 * @public
 */
export function setColumnDisplayFormat(
  dataId: string,
  formats: {
    [key: string]: string;
  }
): Merge<
  SetColumnDisplayFormatUpdaterAction,
  {type: typeof ActionTypes.SET_COLUMN_DISPLAY_FORMAT}
> {
  return {
    type: ActionTypes.SET_COLUMN_DISPLAY_FORMAT,
    dataId,
    formats
  };
}

export type AddDataToMapUpdaterOptions = {
  centrMap?: boolean;
  readOnly?: boolean;
  keepExistingConfig?: boolean;
};

export type UpdateVisDataUpdaterAction = {
  datasets: AddDataToMapPayload['datasets'];
  options: AddDataToMapPayload['options'];
  config?: ParsedConfig;
};
// * @param dataset.info -info of a dataset
// * @param dataset.info.id - id of this dataset. If config is defined, `id` should matches the `dataId` in config.
// * @param dataset.info.label - A display name of this dataset
// * @param dataset.data - ***required** The data object, in a tabular format with 2 properties `fields` and `rows`
// * @param dataset.data.fields - ***required** Array of fields,
// * @param dataset.data.fields.name - ***required** Name of the field,
// * @param dataset.data.rows - ***required** Array of rows, in a tabular format with `fields` and `rows`
/**
 * Add new dataset to `visState`, with option to load a map config along with the datasets
 * @memberof visStateActions
 * @param datasets - ***required** datasets can be a dataset or an array of datasets
 * Each dataset object needs to have `info` and `data` property.
 * @param {object} options
 * @param options.centerMap `default: true` if `centerMap` is set to `true` kepler.gl will
 * place the map view within the data points boundaries
 * @param options.readOnly `default: false` if `readOnly` is set to `true`
 * the left setting panel will be hidden
 * @param config this object will contain the full kepler.gl instance configuration {mapState, mapStyle, visState}
 * @returns action
 * @public
 */
export function updateVisData(
  datasets: AddDataToMapPayload['datasets'],
  options: AddDataToMapPayload['options'],
  config?: ParsedConfig
): Merge<UpdateVisDataUpdaterAction, {type: typeof ActionTypes.UPDATE_VIS_DATA}> {
  return {
    type: ActionTypes.UPDATE_VIS_DATA,
    datasets,
    options,
    config
  };
}

export type RenameDatasetUpdaterAction = {
  dataId: string;
  label: string;
};
/**
 * Rename an existing dataset in `visState`
 * @memberof visStateActions
 * @param dataId - ***required** Id of the dataset to update
 * @param label - ***required** New name for the dataset
 * @returns action
 * @public
 */
export function renameDataset(
  dataId: string,
  label: string
): Merge<RenameDatasetUpdaterAction, {type: typeof ActionTypes.RENAME_DATASET}> {
  return {
    type: ActionTypes.RENAME_DATASET,
    dataId,
    label
  };
}

export type UpdateDatasetPropsUpdaterAction = {
  dataId: string;
  props: {
    label?: string;
    color?: RGBColor;
    metadata?: Record<string, unknown>;
  };
};
/**
 * Update an existing dataset props in `visState`
 * @param dataId - ***required** Id of the dataset to update
 * @param props - ***required** New props to update
 * @returns action
 */
export function updateDatasetProps(
  dataId: string,
  props: {
    label?: string;
    color?: RGBColor;
    metadata?: Record<string, unknown>;
  }
): Merge<UpdateDatasetPropsUpdaterAction, {type: typeof ActionTypes.UPDATE_DATASET_PROPS}> {
  return {
    type: ActionTypes.UPDATE_DATASET_PROPS,
    dataId,
    props
  };
}

export type ToggleFilterAnimationUpdaterAction = {
  idx: number;
};
/**
 * Start and end filter animation
 * @memberof visStateActions
 * @param {Number} idx of filter
 * @returns action
 * @public
 */
export function toggleFilterAnimation(
  idx: number
): Merge<ToggleFilterAnimationUpdaterAction, {type: typeof ActionTypes.TOGGLE_FILTER_ANIMATION}> {
  return {
    type: ActionTypes.TOGGLE_FILTER_ANIMATION,
    idx
  };
}

export type UpdateFilterAnimationSpeedUpdaterAction = {
  idx: number;
  speed: number;
};
/**
 * Change filter animation speed
 * @memberof visStateActions
 * @param idx -  `idx` of filter
 * @param speed - `speed` to change it to. `speed` is a multiplier
 * @returns action
 * @public
 */
export function updateFilterAnimationSpeed(
  idx: number,
  speed: number
): Merge<
  UpdateFilterAnimationSpeedUpdaterAction,
  {type: typeof ActionTypes.UPDATE_FILTER_ANIMATION_SPEED}
> {
  return {
    type: ActionTypes.UPDATE_FILTER_ANIMATION_SPEED,
    idx,
    speed
  };
}

export type SetLayerAnimationTimeUpdaterAction = {
  value: number | null;
};
/**
 * Reset animation
 * @memberof visStateActions
 * @param value -  Current value of the slider
 * @returns action
 * @public
 */
export function setLayerAnimationTime(
  value: number
): Merge<SetLayerAnimationTimeUpdaterAction, {type: typeof ActionTypes.SET_LAYER_ANIMATION_TIME}> {
  return {
    type: ActionTypes.SET_LAYER_ANIMATION_TIME,
    value
  };
}

export type UpdateLayerAnimationSpeedUpdaterAction = {
  speed: number;
};
/**
 * update trip layer animation speed
 * @memberof visStateActions
 * @param speed - `speed` to change it to. `speed` is a multiplier
 * @returns action
 * @public
 */
export function updateLayerAnimationSpeed(
  speed: number
): Merge<
  UpdateLayerAnimationSpeedUpdaterAction,
  {type: typeof ActionTypes.UPDATE_LAYER_ANIMATION_SPEED}
> {
  return {
    type: ActionTypes.UPDATE_LAYER_ANIMATION_SPEED,
    speed
  };
}
export type ToggleLayerAnimationUpdaterAction = void;
/**
 * start end end layer animation
 * @memberof visStateActions
 * @returns action
 * @public
 */
export function toggleLayerAnimation(): Merge<
  ToggleLayerAnimationUpdaterAction,
  {type: typeof ActionTypes.TOGGLE_LAYER_ANIMATION}
> {
  return {
    type: ActionTypes.TOGGLE_LAYER_ANIMATION
  };
}

export type ToggleLayerAnimationControlUpdaterAction = void;
/**
 * hide and show layer animation control
 * @memberof visStateActions
 * @returns action
 * @public
 */
export function toggleLayerAnimationControl(): Merge<
  ToggleLayerAnimationControlUpdaterAction,
  {type: typeof ActionTypes.TOGGLE_LAYER_ANIMATION_CONTROL}
> {
  return {
    type: ActionTypes.TOGGLE_LAYER_ANIMATION_CONTROL
  };
}

export type SetFilterViewUpdaterAction = {
  idx: number;
  view: Filter['view'];
};
/**
 * Show larger time filter at bottom for time playback (apply to time filter only)
 * @memberof visStateActions
 * @param idx - index of filter to enlarge
 * @param view - type of filter view
 * @returns action
 * @public
 */
export function setFilterView(
  idx: number,
  view: Filter['view']
): Merge<SetFilterViewUpdaterAction, {type: typeof ActionTypes.SET_FILTER_VIEW}> {
  return {
    type: ActionTypes.SET_FILTER_VIEW,
    idx,
    view
  };
}

export type ToggleFilterFeatureUpdaterAction = {
  idx: number;
};
/**
 * Show/hide filter feature on map
 * @memberof visStateActions
 * @param idx - index of filter feature to show/hide
 * @return action
 */
export function toggleFilterFeature(
  idx: number
): Merge<ToggleFilterFeatureUpdaterAction, {type: typeof ActionTypes.TOGGLE_FILTER_FEATURE}> {
  return {
    type: ActionTypes.TOGGLE_FILTER_FEATURE,
    idx
  };
}

export type OnLayerHoverUpdaterAction = {
  info: PickInfo<any> | null;
  mapIndex?: number;
};
/**
 * Trigger layer hover event with hovered object
 * @memberof visStateActions
 * @param info - Object hovered, returned by deck.gl.
 * @param mapIndex - Optional property for limiting the display of the `<MapPopover>` to the `<MapContainer>` the user is interacting with.
 * @returns action
 * @public
 */
export function onLayerHover(
  info: PickInfo<any> | null,
  mapIndex?: number
): Merge<OnLayerHoverUpdaterAction, {type: typeof ActionTypes.LAYER_HOVER}> {
  return {
    type: ActionTypes.LAYER_HOVER,
    info,
    mapIndex
  };
}

export type OnLayerClickUpdaterAction = {
  info: PickInfo<any> | null;
};
/**
 * Trigger layer click event with clicked object
 * @memberof visStateActions
 * @param info - Object clicked, returned by deck.gl
 * @returns action
 * @public
 */
export function onLayerClick(
  info: PickInfo<any> | null
): Merge<OnLayerClickUpdaterAction, {type: typeof ActionTypes.LAYER_CLICK}> {
  return {
    type: ActionTypes.LAYER_CLICK,
    info
  };
}

export type OnMapClickUpdaterAction = void;
/**
 * Trigger map click event, unselect clicked object
 * @memberof visStateActions
 * @returns action
 * @public
 */
export function onMapClick(): Merge<OnMapClickUpdaterAction, {type: typeof ActionTypes.MAP_CLICK}> {
  return {
    type: ActionTypes.MAP_CLICK
  };
}

export type OnMouseMoveUpdaterAction = {
  evt;
};
/**
 * Trigger map mouse moveevent, payload would be
 * React-map-gl MapLayerMouseEvent
 * https://visgl.github.io/react-map-gl/docs/api-reference/types#maplayermouseevent
 *
 * @memberof visStateActions
 * @param evt - MapLayerMouseEvent
 * @returns action
 * @public
 */
export function onMouseMove(
  evt
): Merge<OnMouseMoveUpdaterAction, {type: typeof ActionTypes.MOUSE_MOVE}> {
  return {
    type: ActionTypes.MOUSE_MOVE,
    evt
  };
}

export type ToggleLayerForMapUpdaterAction = {
  mapIndex: number;
  layerId: string;
};
/**
 * Toggle visibility of a layer in a split map
 * @memberof visStateActions
 * @param mapIndex - index of the split map
 * @param layerId - id of the layer
 * @returns action
 * @public
 */
export function toggleLayerForMap(
  mapIndex: number,
  layerId: string
): Merge<ToggleLayerForMapUpdaterAction, {type: typeof ActionTypes.TOGGLE_LAYER_FOR_MAP}> {
  return {
    type: ActionTypes.TOGGLE_LAYER_FOR_MAP,
    mapIndex,
    layerId
  };
}

type FilterPlotNewProp = {
  yAxis?: null | Record<string, any>;
  plotType?: {type: string};
};
export type SetFilterPlotUpdaterAction = {
  idx: number;
  newProp: FilterPlotNewProp;
  valueIndex?: number;
};
/**
 * Set the property of a filter plot
 * @memberof visStateActions
 * @param idx
 * @param newProp key value mapping of new prop `{yAxis: 'histogram'}`
 * @param valueIndex dataId index
 * @returns action
 * @public
 */
export function setFilterPlot(
  idx: number,
  newProp: FilterPlotNewProp,
  valueIndex?: number
): Merge<SetFilterPlotUpdaterAction, {type: typeof ActionTypes.SET_FILTER_PLOT}> {
  return {
    type: ActionTypes.SET_FILTER_PLOT,
    idx,
    newProp,
    valueIndex
  };
}

export type SetMapInfoUpdaterAction = {
  info: any;
};
/**
 * Set the property of a filter plot
 * @memberof visStateActions
 * @param info
 * @returns action
 * @public
 */
export function setMapInfo(
  info: any
): Merge<SetMapInfoUpdaterAction, {type: typeof ActionTypes.SET_MAP_INFO}> {
  return {
    type: ActionTypes.SET_MAP_INFO,
    info
  };
}

export type LoadFilesUpdaterAction = {
  files: File[];
  onFinish?(result: any): any;
};
/**
 * Trigger file loading dispatch `addDataToMap` if succeed, or `loadFilesErr` if failed
 * @memberof visStateActions
 * @param files array of fileblob
 * @returns action
 * @public
 */
export function loadFiles(
  files: File[],
  onFinish?: (result: any) => any
): Merge<LoadFilesUpdaterAction, {type: typeof ActionTypes.LOAD_FILES}> {
  return {
    type: ActionTypes.LOAD_FILES,
    files,
    onFinish
  };
}

/**
 * Called with next file to load
 * @memberof visStateActions
 * @returns action
 * @public
 */
export function loadNextFile(): {type: typeof ActionTypes.LOAD_NEXT_FILE} {
  return {
    type: ActionTypes.LOAD_NEXT_FILE
  };
}

export type loadFilesSuccessUpdaterAction = {
  result: FileCacheItem[];
};
/**
 * called when all files are processed and loaded
 * @memberof visStateActions
 * @param result
 * @returns action
 */
export function loadFilesSuccess(
  result: FileCacheItem[]
): Merge<loadFilesSuccessUpdaterAction, {type: typeof ActionTypes.LOAD_FILES_SUCCESS}> {
  return {
    type: ActionTypes.LOAD_FILES_SUCCESS,
    result
  };
}

export type LoadFileStepSuccessAction = {
  fileName: string;
  fileCache: FileCacheItem[];
};
/**
 * called when successfully loaded one file, ready to move on to the next one
 * @memberof visStateActions
 * @param result
 * @returns action
 */
export function loadFileStepSuccess({
  fileName,
  fileCache
}: {
  fileName: string;
  fileCache: FileCacheItem[];
}): Merge<LoadFileStepSuccessAction, {type: typeof ActionTypes.LOAD_FILE_STEP_SUCCESS}> {
  return {
    type: ActionTypes.LOAD_FILE_STEP_SUCCESS,
    fileName,
    fileCache
  };
}

export type LoadFilesErrUpdaterAction = {
  fileName: string;
  error: any;
};
/**
 * Trigger loading file error
 * @memberof visStateActions
 * @param  error
 * @returns action
 * @public
 */

export function loadFilesErr(
  fileName: string,
  error: any
): Merge<LoadFilesErrUpdaterAction, {type: typeof ActionTypes.LOAD_FILES_ERR}> {
  return {
    type: ActionTypes.LOAD_FILES_ERR,
    fileName,
    error
  };
}

export type SetFeaturesUpdaterAction = {
  features: Feature[];
};
/**
 * Store features to state
 * @memberof visStateActions
 * @param features
 * @returns action
 */
export function setFeatures(
  features: Feature[]
): Merge<SetFeaturesUpdaterAction, {type: typeof ActionTypes.SET_FEATURES}> {
  return {
    type: ActionTypes.SET_FEATURES,
    features
  };
}

export type SetPolygonFilterLayerUpdaterAction = {
  layer: Layer;
  feature: Feature;
};
/**
 * It will apply the provide feature as filter to the given layer.
 * If the given feature is already applied as filter to the layer, it will remove the layer from the filter
 * @memberof visStateActions
 * @param layer
 * @param feature
 * @returns action
 */
export function setPolygonFilterLayer(
  layer: Layer,
  feature: Feature
): Merge<SetPolygonFilterLayerUpdaterAction, {type: typeof ActionTypes.SET_POLYGON_FILTER_LAYER}> {
  return {
    type: ActionTypes.SET_POLYGON_FILTER_LAYER,
    layer,
    feature
  };
}

export type SetSelectedFeatureUpdaterAction = {
  feature: Feature | null;
  selectionContext?: FeatureSelectionContext;
};

/**
 * Set the current feature to be edited/deleted,
 * and the context of how the feature was selected.
 * @memberof visStateActions
 * @param feature
 * @param selectionContext
 * @returns action
 */
export function setSelectedFeature(
  feature: Feature | null,
  selectionContext?: FeatureSelectionContext
): Merge<SetSelectedFeatureUpdaterAction, {type: typeof ActionTypes.SET_SELECTED_FEATURE}> {
  return {
    type: ActionTypes.SET_SELECTED_FEATURE,
    feature,
    selectionContext
  };
}

export type DeleteFeatureUpdaterAction = {
  feature: Feature;
};
/**
 * Delete the given feature
 * @memberof visStateActions
 * @param feature
 * @returns action
 */
export function deleteFeature(
  feature: Feature
): Merge<DeleteFeatureUpdaterAction, {type: typeof ActionTypes.DELETE_FEATURE}> {
  return {
    type: ActionTypes.DELETE_FEATURE,
    feature
  };
}

export type SetEditorModeUpdaterAction = {
  mode: string;
};
/** Set the map mode
 * @memberof visStateActions
 * @param mode one of EDITOR_MODES
 * @returns action
 * @public
 * @example
 * import {setMapMode} from 'kepler.gl/actions';
 * import {EDITOR_MODES} from 'kepler.gl/constants';
 *
 * this.props.dispatch(setMapMode(EDITOR_MODES.DRAW_POLYGON));
 */
export function setEditorMode(
  mode: string
): Merge<SetEditorModeUpdaterAction, {type: typeof ActionTypes.SET_EDITOR_MODE}> {
  return {
    type: ActionTypes.SET_EDITOR_MODE,
    mode
  };
}

export type ApplyCPUFilterUpdaterAction = {
  dataId: string | string[];
};
/**
 * Trigger CPU filter of selected dataset
 * @memberof visStateActions
 * @param dataId - single dataId or an array of dataIds
 * @returns action
 * @public
 */
export function applyCPUFilter(
  dataId: string | string[]
): Merge<ApplyCPUFilterUpdaterAction, {type: typeof ActionTypes.APPLY_CPU_FILTER}> {
  return {
    type: ActionTypes.APPLY_CPU_FILTER,
    dataId
  };
}

export type ToggleEditorVisibilityUpdaterAction = void;
/**
 * Toggle editor layer visibility
 * @memberof visStateActions
 * @return action
 */
export function toggleEditorVisibility(): Merge<
  ToggleEditorVisibilityUpdaterAction,
  {type: typeof ActionTypes.TOGGLE_EDITOR_VISIBILITY}
> {
  return {
    type: ActionTypes.TOGGLE_EDITOR_VISIBILITY
  };
}

type FileContent = {
  fileName: string;
  header: string[];
  data: any;
};
export type NextFileBatchUpdaterAction = {
  payload: {
    /* eslint-disable no-undef */
    gen: AsyncGenerator<FileContent>;
    fileName: string;
    progress?: any;
    accumulated?: any;
    onFinish: (result: any) => any;
  };
};
/**
 * Process the next file batch
 * @memberof visStateActions
 * @param payload - batch payload
 * @return action
 */
export function nextFileBatch(
  payload: NextFileBatchUpdaterAction['payload']
): Merge<NextFileBatchUpdaterAction, {type: typeof ActionTypes.NEXT_FILE_BATCH}> {
  return {
    type: ActionTypes.NEXT_FILE_BATCH,
    payload
  };
}

export type ProcessFileContentUpdaterAction = {
  payload: {
    content: FileContent;
    fileCache: FileCacheItem[];
  };
};
/**
 * Process the file content
 * @memberof visStateActions
 * @param payload - the file content
 * @return action
 */
export function processFileContent(
  payload: ProcessFileContentUpdaterAction['payload']
): Merge<ProcessFileContentUpdaterAction, {type: typeof ActionTypes.PROCESS_FILE_CONTENT}> {
  return {
    type: ActionTypes.PROCESS_FILE_CONTENT,
    payload
  };
}

export type SetLayerAnimationTimeConfigAction = {
  config: {
    timezone?: string;
    timeFormat?: string;
  };
};
/**
 * Set layer animation time format and timezone
 * @memberof visStateActions
 * @param config - {timeFormat: string, timezone: string}
 * @return action
 */
export function setLayerAnimationTimeConfig(
  config: SetLayerAnimationTimeConfigAction['config']
): Merge<
  SetLayerAnimationTimeConfigAction,
  {type: typeof ActionTypes.SET_LAYER_ANIMATION_TIME_CONFIG}
> {
  return {
    type: ActionTypes.SET_LAYER_ANIMATION_TIME_CONFIG,
    config
  };
}

export type SetFilterAnimationTimeConfigAction = {
  idx: number;
  config: {
    timezone?: string;
    timeFormat?: string;
  };
};
/**
 * Set Filter animation time format and timezone
 * @memberof visStateActions
 * @param idx
 * @param config
 * @return action
 */
export function setFilterAnimationTimeConfig(
  idx: SetFilterAnimationTimeConfigAction['idx'],
  config: SetFilterAnimationTimeConfigAction['config']
): Merge<
  SetFilterAnimationTimeConfigAction,
  {type: typeof ActionTypes.SET_FILTER_ANIMATION_TIME_CONFIG}
> {
  return {
    type: ActionTypes.SET_FILTER_ANIMATION_TIME_CONFIG,
    idx,
    config
  };
}

export type LayerFilteredItemsChangeAction = {
  event: {
    id: string;
    count: number;
  };
  layer: Layer;
};

/**
 * deck.gl layer gpu filter callback
 * @memberof visStateActions
 * @param layer
 * @param event
 * @return action
 */
export function layerFilteredItemsChange(
  layer: LayerFilteredItemsChangeAction['layer'],
  event: LayerFilteredItemsChangeAction['event']
): Merge<LayerFilteredItemsChangeAction, {type: typeof ActionTypes.LAYER_FILTERED_ITEMS_CHANGE}> {
  return {
    type: ActionTypes.LAYER_FILTERED_ITEMS_CHANGE,
    layer,
    event
  };
}

export type SyncTimeFilterWithLayerTimelineAction = {
  idx: number;
  enable: boolean;
};

export function syncTimeFilterWithLayerTimeline(
  idx: SyncTimeFilterWithLayerTimelineAction['idx'],
  enable: SyncTimeFilterWithLayerTimelineAction['enable']
): Merge<
  SyncTimeFilterWithLayerTimelineAction,
  {type: typeof ActionTypes.SYNC_TIME_FILTER_WITH_LAYER_TIMELINE}
> {
  return {
    type: ActionTypes.SYNC_TIME_FILTER_WITH_LAYER_TIMELINE,
    idx,
    enable
  };
}

export type setTimeFilterSyncTimelineModeAction = {
  id: string;
  mode: SyncTimelineMode;
};

export function setTimeFilterSyncTimelineMode({
  id,
  mode
}: setTimeFilterSyncTimelineModeAction): Merge<
  setTimeFilterSyncTimelineModeAction,
  {type: typeof ActionTypes.SYNC_TIME_FILTER_TIMELINE_MODE}
> {
  return {
    type: ActionTypes.SYNC_TIME_FILTER_TIMELINE_MODE,
    id,
    mode
  };
}

/**
 * This declaration is needed to group actions in docs
 */
/**
 * Actions handled mostly by `visState` reducer.
 * They manage how data is processed, filtered and displayed on the map by operates on layers,
 * filters and interaction settings.
 *
 * @public
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-ignore
const visStateActions = null;
/* eslint-enable @typescript-eslint/no-unused-vars */

// Copyright (c) 2020 Uber Technologies, Inc.
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

import Task, {withTask} from 'react-palm/tasks';
import cloneDeep from 'lodash.clonedeep';

// Utils
import {
  getDefaultLayerGroupVisibility,
  isValidStyleUrl,
  getStyleDownloadUrl,
  mergeLayerGroupVisibility,
  editTopMapStyle,
  editBottomMapStyle,
  getStyleImageIcon
} from 'utils/map-style-utils/mapbox-gl-style-editor';
import {
  DEFAULT_MAP_STYLES,
  DEFAULT_LAYER_GROUPS,
  DEFAULT_MAPBOX_API_URL
} from 'constants/default-settings';
import {generateHashId} from 'utils/utils';
import {LOAD_MAP_STYLE_TASK} from 'tasks/tasks';
import {loadMapStyles, loadMapStyleErr} from 'actions/map-style-actions';
import {rgb} from 'd3-color';
import {hexToRgb} from 'utils/color-utils';

const DEFAULT_BLDG_COLOR = '#D1CEC7';

const getDefaultState = () => {
  const visibleLayerGroups = {};
  const styleType = 'dark';
  const topLayerGroups = {};

  return {
    styleType,
    visibleLayerGroups,
    topLayerGroups,
    mapStyles: DEFAULT_MAP_STYLES.reduce(
      (accu, curr) => ({
        ...accu,
        [curr.id]: curr
      }),
      {}
    ),
    // save mapbox access token
    mapboxApiAccessToken: null,
    mapboxApiUrl: DEFAULT_MAPBOX_API_URL,
    mapStylesReplaceDefault: false,
    inputStyle: getInitialInputStyle(),
    threeDBuildingColor: hexToRgb(DEFAULT_BLDG_COLOR),
    custom3DBuildingColor: false
  };
};

/**
 * Updaters for `mapStyle`. Can be used in your root reducer to directly modify kepler.gl's state.
 * Read more about [Using updaters](../advanced-usage/using-updaters.md)
 * @public
 * @example
 *
 * import keplerGlReducer, {mapStyleUpdaters} from 'kepler.gl/reducers';
 * // Root Reducer
 * const reducers = combineReducers({
 *  keplerGl: keplerGlReducer,
 *  app: appReducer
 * });
 *
 * const composedReducer = (state, action) => {
 *  switch (action.type) {
 *    // click button to hide label from background map
 *    case 'CLICK_BUTTON':
 *      return {
 *        ...state,
 *        keplerGl: {
 *          ...state.keplerGl,
 *          foo: {
 *             ...state.keplerGl.foo,
 *             mapStyle: mapStyleUpdaters.mapConfigChangeUpdater(
 *               mapStyle,
 *               {payload: {visibleLayerGroups: {label: false, road: true, background: true}}}
 *             )
 *          }
 *        }
 *      };
 *  }
 *  return reducers(state, action);
 * };
 *
 * export default composedReducer;
 */
/* eslint-disable no-unused-vars */
const mapStyleUpdaters = null;
/* eslint-enable no-unused-vars */
/**
 * Default initial `mapStyle`
 * @memberof mapStyleUpdaters
 * @constant
 * @property {string} styleType - Default: `'dark'`
 * @property {Object} visibleLayerGroups - Default: `{}`
 * @property {Object} topLayerGroups - Default: `{}`
 * @property {Object} mapStyles - mapping from style key to style object
 * @property {string} mapboxApiAccessToken - Default: `null`
 * @Property {string} mapboxApiUrl - Default null
 * @Property {Boolean} mapStylesReplaceDefault - Default: `false`
 * @property {Object} inputStyle - Default: `{}`
 * @property {Array} threeDBuildingColor - Default: `[r, g, b]`
 * @public
 */
export const INITIAL_MAP_STYLE = getDefaultState();

/**
 * Create two map styles from preset map style, one for top map one for bottom
 *
 * @param {string} styleType - current map style
 * @param {Object} visibleLayerGroups - visible layers of bottom map
 * @param {Object} topLayerGroups - visible layers of top map
 * @param {Object} mapStyles - a dictionary of all map styles
 * @returns {Object} bottomMapStyle | topMapStyle | isRaster
 */
export function getMapStyles({
  styleType,
  visibleLayerGroups,
  topLayerGroups,
  mapStyles
}) {
  const mapStyle = mapStyles[styleType];

  // style might not be loaded yet
  if (!mapStyle || !mapStyle.style) {
    return {};
  }

  const editable = Object.keys(visibleLayerGroups).length;

  const bottomMapStyle = !editable
    ? mapStyle.style
    : editBottomMapStyle({
        id: styleType,
        mapStyle,
        visibleLayerGroups
      });

  const hasTopLayer = editable && Object.values(topLayerGroups).some(v => v);

  // mute top layer if not visible in bottom layer
  const topLayers =
    hasTopLayer &&
    Object.keys(topLayerGroups).reduce(
      (accu, key) => ({
        ...accu,
        [key]: topLayerGroups[key] && visibleLayerGroups[key]
      }),
      {}
    );

  const topMapStyle = hasTopLayer
    ? editTopMapStyle({
        id: styleType,
        mapStyle,
        visibleLayerGroups: topLayers
      })
    : null;

  return {bottomMapStyle, topMapStyle, editable};
}

function findLayerFillColor(layer) {
  return layer && layer.paint && layer.paint['background-color'];
}

function get3DBuildingColor(style) {
  // set building color to be the same as the background color.
  if (!style.style) {
    return hexToRgb(DEFAULT_BLDG_COLOR);
  }

  const backgroundLayer = (style.style.layers || []).find(
    ({id}) => id === 'background'
  );

  const buildingLayer = (style.style.layers || []).find(({id}) =>
    id.match(/building/)
  );

  const buildingColor =
    findLayerFillColor(buildingLayer) ||
    findLayerFillColor(backgroundLayer) ||
    DEFAULT_BLDG_COLOR;

  // brighten or darken building based on style
  const operation = style.id.match(/(?=(dark|night))/) ? 'brighter' : 'darker';

  const alpha = 0.2;
  const rgbObj = rgb(buildingColor)[operation]([alpha]);
  return [rgbObj.r, rgbObj.g, rgbObj.b];
}

function getLayerGroupsFromStyle(style) {
  return Array.isArray(style.layers)
    ? DEFAULT_LAYER_GROUPS.filter(lg => style.layers.filter(lg.filter).length)
    : [];
}

// Updaters
/**
 * Propagate `mapStyle` reducer with `mapboxApiAccessToken` and `mapStylesReplaceDefault`.
 * if mapStylesReplaceDefault is true mapStyles is emptied; loadMapStylesUpdater() will
 * populate mapStyles.
 *
 * @memberof mapStyleUpdaters
 * @param {Object} state
 * @param {Object} action
 * @param {Object} action.payload
 * @param {string} action.payload.mapboxApiAccessToken
 * @returns {Object} nextState
 * @public
 */
export const initMapStyleUpdater = (state, action) => ({
  ...state,
  // save mapbox access token to map style state
  mapboxApiAccessToken: (action.payload || {}).mapboxApiAccessToken,
  mapboxApiUrl: (action.payload || {}).mapboxApiUrl || state.mapboxApiUrl,
  mapStyles:
    action.payload && !action.payload.mapStylesReplaceDefault
      ? state.mapStyles
      : {},
  mapStylesReplaceDefault: action.payload.mapStylesReplaceDefault || false
});
// });

/**
 * Update `visibleLayerGroups`to change layer group visibility
 * @memberof mapStyleUpdaters
 * @param {Object} state `mapStyle`
 * @param {Object} action
 * @param {Object} action.payload new config `{visibleLayerGroups: {label: false, road: true, background: true}}`
 * @returns {Object} nextState
 * @public
 */
export const mapConfigChangeUpdater = (state, action) => ({
  ...state,
  ...action.payload,
  ...getMapStyles({
    ...state,
    ...action.payload
  })
});

/**
 * Change to another map style. The selected style should already been loaded into `mapStyle.mapStyles`
 * @memberof mapStyleUpdaters
 * @param {Object} state `mapStyle`
 * @param {Object} action
 * @param {string} action.payload
 * @returns {Object} nextState
 * @public
 */
export const mapStyleChangeUpdater = (state, {payload: styleType}) => {
  if (!state.mapStyles[styleType]) {
    // we might not have received the style yet
    return state;
  }
  const defaultLGVisibility = getDefaultLayerGroupVisibility(
    state.mapStyles[styleType]
  );

  const visibleLayerGroups = mergeLayerGroupVisibility(
    defaultLGVisibility,
    state.visibleLayerGroups
  );

  const threeDBuildingColor = state.custom3DBuildingColor ? state.threeDBuildingColor :
    get3DBuildingColor(state.mapStyles[styleType]);

  return {
    ...state,
    styleType,
    visibleLayerGroups,
    threeDBuildingColor,
    ...getMapStyles({
      ...state,
      visibleLayerGroups,
      styleType
    })
  };
};

/**
 * Callback when load map style success
 * @memberof mapStyleUpdaters
 * @param {Object} state `mapStyle`
 * @param {Object} action
 * @param {Object} action.payload a `{[id]: style}` mapping
 * @return {Object} nextState
 * @public
 */
export const loadMapStylesUpdater = (state, action) => {
  const newStyles = action.payload || {};
  const addLayerGroups = Object.keys(newStyles).reduce(
    (accu, id) => ({
      ...accu,
      [id]: {
        ...newStyles[id],
        layerGroups:
          newStyles[id].layerGroups ||
          getLayerGroupsFromStyle(newStyles[id].style)
      }
    }),
    {}
  );

  // add new styles to state
  const newState = {
    ...state,
    mapStyles: {
      ...state.mapStyles,
      ...addLayerGroups
    }
  };

  return newStyles[state.styleType]
    ? mapStyleChangeUpdater(newState, {payload: state.styleType})
    : newState;
};

/**
 * Callback when load map style error
 * @memberof mapStyleUpdaters
 * @param {Object} state `mapStyle`
 * @param {Object} action
 * @param {*} action.payload error
 * @returns {Object} nextState
 * @public
 */
// do nothing for now, if didn't load, skip it
export const loadMapStyleErrUpdater = state => state;

export const requestMapStylesUpdater = (state, {payload: mapStyles}) => {
  const loadMapStyleTasks = getLoadMapStyleTasks(
    mapStyles,
    state.mapboxApiAccessToken,
    state.mapboxApiUrl
  );
  return withTask(state, loadMapStyleTasks);
};

/**
 * Load map style object when pass in saved map config
 * @memberof mapStyleUpdaters
 * @param {Object} state `mapStyle`
 * @param {Object} action
 * @param {Object} action.payload saved map config `{mapStyle, visState, mapState}`
 * @returns {Object} nextState or `react-pam` tasks to load map style object
 */
export const receiveMapConfigUpdater = (state, {payload: {config = {}}}) => {
  const {mapStyle} = config;

  if (!mapStyle) {
    return state;
  }

  // if saved custom mapStyles load the style object
  const loadMapStyleTasks = mapStyle.mapStyles
    ? getLoadMapStyleTasks(
        mapStyle.mapStyles,
        state.mapboxApiAccessToken,
        state.mapboxApiUrl
      )
    : null;

  // merge default mapStyles
  const merged = mapStyle.mapStyles
    ? {
        ...mapStyle,
        mapStyles: {
          ...mapStyle.mapStyles,
          ...state.mapStyles
        }
      }
    : mapStyle;

  // set custom3DBuildingColor: true if mapStyle contains threeDBuildingColor
  merged.custom3DBuildingColor = Boolean(mapStyle.threeDBuildingColor) || merged.custom3DBuildingColor;
  const newState = mapConfigChangeUpdater(state, {payload: merged});

  return loadMapStyleTasks ? withTask(newState, loadMapStyleTasks) : newState;
};

function getLoadMapStyleTasks(mapStyles, mapboxApiAccessToken, mapboxApiUrl) {
  return [
    Task.all(
      Object.values(mapStyles)
        .map(({id, url, accessToken}) => ({
          id,
          url: isValidStyleUrl(url)
            ? getStyleDownloadUrl(
                url,
                accessToken || mapboxApiAccessToken,
                mapboxApiUrl
              )
            : url
        }))
        .map(LOAD_MAP_STYLE_TASK)
    ).bimap(
      // success
      results =>
        loadMapStyles(
          results.reduce(
            (accu, {id, style}) => ({
              ...accu,
              [id]: {
                ...mapStyles[id],
                style
              }
            }),
            {}
          )
        ),
      // error
      loadMapStyleErr
    )
  ];
}
/**
 * Reset map style config to initial state
 * @memberof mapStyleUpdaters
 * @param {Object} state `mapStyle`
 * @returns {Object} nextState
 * @public
 */
export const resetMapConfigMapStyleUpdater = state => {
  const emptyConfig = {
    ...INITIAL_MAP_STYLE,
    mapboxApiAccessToken: state.mapboxApiAccessToken,
    mapboxApiUrl: state.mapboxApiUrl,
    mapStylesReplaceDefault: state.mapStylesReplaceDefault,
    ...state.initialState,
    mapStyles: state.mapStyles,
    initialState: state.initialState
  };

  return mapStyleChangeUpdater(emptyConfig, {payload: emptyConfig.styleType});
};

/**
 * Callback when a custom map style object is received
 * @memberof mapStyleUpdaters
 * @param {Object} state `mapStyle`
 * @param {Object} action
 * @param {Object} action.payload
 * @param {string} action.payload.icon
 * @param {Object} action.payload.style
 * @param {*} action.payload.error
 * @returns {Object} nextState
 * @public
 */
export const loadCustomMapStyleUpdater = (
  state,
  {payload: {icon, style, error}}
) => ({
  ...state,
  inputStyle: {
    ...state.inputStyle,
    // style json and icon will load asynchronously
    ...(style
      ? {
          id: style.id || generateHashId(),
          // make a copy of the style object
          style: cloneDeep(style),
          label: style.name,
          // gathering layer group info from style json
          layerGroups: getLayerGroupsFromStyle(style)
        }
      : {}),
    ...(icon ? {icon} : {}),
    ...(error !== undefined ? {error} : {})
  }
});

/**
 * Input a custom map style object
 * @memberof mapStyleUpdaters
 * @param {Object} state `mapStyle`
 * @param {Object} action action object
 * @param {Object} action.payload inputStyle
 * @param {string} action.payload.url style url e.g. `'mapbox://styles/heshan/xxxxxyyyyzzz'`
 * @param {string} action.payload.id style url e.g. `'custom_style_1'`
 * @param {Object} action.payload.style actual mapbox style json
 * @param {string} action.payload.name style name
 * @param {Object} action.payload.layerGroups layer groups that can be used to set map layer visibility
 * @param {Object} action.payload.icon icon image data url
 * @returns {Object} nextState
 * @public
 */
export const inputMapStyleUpdater = (state, {payload: {inputStyle, mapState}}) => {
  const updated = {
    ...state.inputStyle,
    ...inputStyle
  };

  const isValid = isValidStyleUrl(updated.url);
  const icon = isValid ? getStyleImageIcon({
    mapState,
    styleUrl: updated.url,
    mapboxApiAccessToken: updated.accessToken || state.mapboxApiAccessToken,
    mapboxApiUrl: state.mapboxApiUrl || DEFAULT_MAPBOX_API_URL
  }) : state.inputStyle.icon;

  return {
    ...state,
    inputStyle: {
      ...updated,
      isValid,
      icon
    }
  }
};

/**
 * Add map style from user input to reducer and set it to current style
 * This action is called when user click confirm after putting in a valid style url in the custom map style dialog.
 * It should not be called from outside kepler.gl without a valid `inputStyle` in the `mapStyle` reducer.
 * @memberof mapStyleUpdaters
 * @param {Object} state `mapStyle`
 * @returns {Object} nextState
 */
export const addCustomMapStyleUpdater = state => {
  const styleId = state.inputStyle.id;
  const newState = {
    ...state,
    mapStyles: {
      ...state.mapStyles,
      [styleId]: state.inputStyle
    },
    // set to default
    inputStyle: getInitialInputStyle()
  };
  // set new style
  return mapStyleChangeUpdater(newState, {payload: styleId});
};

/**
 * Updates 3d building color
 * @memberof mapStyleUpdaters
 * @param state
 * @param color
 * @return {Object} nextState
 */
export const set3dBuildingColorUpdater = (state, {payload: color}) => ({
  ...state,
  threeDBuildingColor: color,
  custom3DBuildingColor: true
});

/**
 * Return the initial input style
 * @return Object
 */
export function getInitialInputStyle() {
  return {
    accessToken: null,
    error: false,
    isValid: false,
    label: null,
    style: null,
    url: null,
    icon: null,
    custom: true
  };
}

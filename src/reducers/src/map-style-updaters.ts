// Copyright (c) 2023 Uber Technologies, Inc.
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
import Console from 'global/console';

// Utils
import {
  getDefaultLayerGroupVisibility,
  isValidStyleUrl,
  getStyleDownloadUrl,
  mergeLayerGroupVisibility,
  editTopMapStyle,
  editBottomMapStyle,
  getStyleImageIcon,
  generateHashId,
  isPlainObject,
  hexToRgb,
  colorMaybeToRGB
} from '@kepler.gl/utils';
import {
  DEFAULT_MAP_STYLES,
  DEFAULT_LAYER_GROUPS,
  DEFAULT_MAPBOX_API_URL,
  NO_MAP_ID,
  DEFAULT_BLDG_COLOR,
  DEFAULT_BACKGROUND_COLOR,
  BASE_MAP_BACKGROUND_LAYER_IDS
} from '@kepler.gl/constants';
import {ACTION_TASK, LOAD_MAP_STYLE_TASK} from '@kepler.gl/tasks';
import {rgb} from 'd3-color';

import {RGBColor, LayerGroup, MapStyles, InputStyle, VisibleLayerGroups} from '@kepler.gl/types';
import {
  ActionTypes,
  ReceiveMapConfigPayload,
  KeplerGlInitPayload,
  MapStyleActions,
  loadMapStyles,
  loadMapStyleErr
} from '@kepler.gl/actions';

export type MapboxStyleUrl = string;

export type MapStyle = {
  styleType: string;
  visibleLayerGroups: VisibleLayerGroups;
  topLayerGroups: VisibleLayerGroups;
  mapStyles: MapStyles;
  // save mapbox access token
  mapboxApiAccessToken: string | null;
  mapboxApiUrl: string;
  mapStylesReplaceDefault: boolean;
  inputStyle: InputStyle;
  threeDBuildingColor: RGBColor;
  backgroundColor: RGBColor;
  custom3DBuildingColor: boolean;
  bottomMapStyle: any;
  topMapStyle: any;
  initialState?: MapStyle;
  isLoading: {
    [key: string]: boolean;
  };
};

const getDefaultState = (): MapStyle => {
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
    custom3DBuildingColor: false,
    backgroundColor: hexToRgb(DEFAULT_BACKGROUND_COLOR),
    isLoading: {},
    bottomMapStyle: undefined,
    topMapStyle: undefined
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
// @ts-ignore
const mapStyleUpdaters = null;
/* eslint-enable no-unused-vars */
/**
 * Default initial `mapStyle`
 * @memberof mapStyleUpdaters
 * @constant
 * @property styleType - Default: `'dark'`
 * @property visibleLayerGroups - Default: `{}`
 * @property topLayerGroups - Default: `{}`
 * @property mapStyles - mapping from style key to style object
 * @property mapboxApiAccessToken - Default: `null`
 * @Property mapboxApiUrl - Default null
 * @Property mapStylesReplaceDefault - Default: `false`
 * @property inputStyle - Default: `{}`
 * @property threeDBuildingColor - Default: `[r, g, b]`
 * @property backgroundColor - Default: `[r, g, b]`
 * @public
 */
export const INITIAL_MAP_STYLE: MapStyle = getDefaultState();

interface GetMapStylesParam {
  styleType: string;
  visibleLayerGroups: {[id: string]: LayerGroup | boolean};
  topLayerGroups: {[id: string]: LayerGroup | boolean};
  mapStyles: {[id: string]: any};
}

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
}: GetMapStylesParam) {
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

  const hasTopLayer = editable > 0 && Object.values(topLayerGroups).some(v => v);

  // mute top layer if not visible in bottom layer
  const topLayers =
    hasTopLayer &&
    Object.keys(topLayerGroups).reduce(
      (accu, key) => ({
        ...accu,
        [key]: topLayerGroups[key] && visibleLayerGroups[key]
      }),
      {} as {[id: string]: LayerGroup | boolean}
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

function get3DBuildingColor(style): RGBColor {
  // set building color to be the same as the background color.
  if (!style.style) {
    return hexToRgb(DEFAULT_BLDG_COLOR);
  }

  const backgroundLayer = (style.style.layers || []).find(({id}) => id === 'background');

  const buildingLayer = (style.style.layers || []).find(({id}) => id.match(/building/));

  const buildingColor =
    findLayerFillColor(buildingLayer) || findLayerFillColor(backgroundLayer) || DEFAULT_BLDG_COLOR;

  // brighten or darken building based on style
  const operation = style.id.match(/(?=(dark|night))/) ? 'brighter' : 'darker';

  const alpha = 0.2;
  const rgbObj = rgb(buildingColor)[operation]([alpha]);
  return [rgbObj.r, rgbObj.g, rgbObj.b];
}

function getBackgroundColorFromStyleBaseLayer(style, backupBackgroundColor) {
  if (!style.style) {
    return colorMaybeToRGB(backupBackgroundColor);
  }

  const baseLayer = (style.style.layers || []).find(({id}) =>
    BASE_MAP_BACKGROUND_LAYER_IDS.includes(id)
  );

  const backgroundColorOfBaseLayer = findLayerFillColor(baseLayer);

  // need to be careful because some basemap layer.paint['background-color'] values may be an interpolate array expression instead of a color string
  // and that results in colorMaybeToRGB(backgroundColorOfBaseLayer) returning null
  // https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#paint-background-background-color
  // https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/#interpolate
  const newBackgroundColor =
    typeof backgroundColorOfBaseLayer === 'string'
      ? backgroundColorOfBaseLayer
      : backupBackgroundColor;

  const newBackgroundColorAsRGBArray = colorMaybeToRGB(newBackgroundColor)
    // if newBackgroundColor was in string HSL format it can introduce RGB numbers with decimals,
    // which may render the background-color CSS of the <StyledMap> container incorrectly when using our own color utils `rgbToHex()`
    // so we attempt to round to nearest integer here
    ?.map(channelNumber => Math.round(channelNumber));

  return newBackgroundColorAsRGBArray;
}

// determine new backgroundColor from either previous state basemap style, previous state backgroundColor, or the DEFAULT_BACKGROUND_COLOR
function getBackgroundColor(previousState, styleType) {
  const previousStateMapStyle = previousState.mapStyles[previousState.styleType];
  const backupBackgroundColor = previousState.backgroundColor || DEFAULT_BACKGROUND_COLOR;
  const backgroundColor =
    styleType === NO_MAP_ID
      ? // if the style has switched to the "no basemap" style,
        // attempt to detect backgroundColor of the previous basemap if it was a mapbox basemap
        // and set it as the "no basemap" backgroundColor
        getBackgroundColorFromStyleBaseLayer(previousStateMapStyle, backupBackgroundColor)
      : // otherwise leave it alone and rely on the previous state's preexisting backgroundColor
        // or DEFAULT_BACKGROUND_COLOR as a last resort
        backupBackgroundColor;

  return backgroundColor;
}

function getLayerGroupsFromStyle(style) {
  return Array.isArray(style?.layers)
    ? DEFAULT_LAYER_GROUPS.filter(lg => style.layers.filter(lg.filter).length)
    : [];
}

// Updaters

/**
 * @memberof mapStyleUpdaters
 * @public
 */
export const requestMapStylesUpdater = (
  state: MapStyle,
  {payload: {mapStyles, onSuccess}}: MapStyleActions.RequestMapStylesUpdaterAction
): MapStyle => {
  const toLoad = Object.keys(mapStyles).reduce(
    (accu, id) => ({
      ...accu,
      ...(!state.isLoading[id] ? {[id]: mapStyles[id]} : {})
    }),
    {}
  );
  const loadMapStyleTasks = getLoadMapStyleTasks(
    toLoad,
    state.mapboxApiAccessToken,
    state.mapboxApiUrl,
    onSuccess
  );

  const isLoading = Object.keys(toLoad).reduce(
    (accu, key) => ({
      ...accu,
      [key]: true
    }),
    {}
  );
  const nextState = {
    ...state,
    isLoading
  };
  return withTask(nextState, loadMapStyleTasks);
};

/**
 * Propagate `mapStyle` reducer with `mapboxApiAccessToken` and `mapStylesReplaceDefault`.
 * if mapStylesReplaceDefault is true mapStyles is emptied; loadMapStylesUpdater() will
 * populate mapStyles.
 *
 * @memberof mapStyleUpdaters
 * @public
 */
export const initMapStyleUpdater = (
  state: MapStyle,
  {
    payload = {}
  }: {
    type?: typeof ActionTypes.INIT;
    payload: KeplerGlInitPayload;
  }
): MapStyle => ({
  ...state,
  // save mapbox access token to map style state
  mapboxApiAccessToken: payload.mapboxApiAccessToken || state.mapboxApiAccessToken,
  mapboxApiUrl: payload.mapboxApiUrl || state.mapboxApiUrl,
  mapStyles: !payload.mapStylesReplaceDefault ? state.mapStyles : {},
  mapStylesReplaceDefault: payload.mapStylesReplaceDefault || false
});
// });

/**
 * Update `visibleLayerGroups`to change layer group visibility
 * @memberof mapStyleUpdaters
 * @public
 */
export const mapConfigChangeUpdater = (
  state: MapStyle,
  action: MapStyleActions.MapConfigChangeUpdaterAction
): MapStyle => {
  return {
    ...state,
    ...action.payload,
    ...getMapStyles({
      ...state,
      ...action.payload
    })
  };
};

const hasStyleObject = style => isPlainObject(style?.style);

/**
 * Change to another map style. The selected style should already been loaded into `mapStyle.mapStyles`
 * @memberof mapStyleUpdaters
 * @public
 */
export const mapStyleChangeUpdater = (
  state: MapStyle,
  {payload: {styleType, onSuccess}}: MapStyleActions.MapStyleChangeUpdaterAction
): MapStyle => {
  if (!state.mapStyles[styleType]) {
    // we might not have received the style yet
    return state;
  }

  if (!hasStyleObject(state.mapStyles[styleType])) {
    // style hasn't loaded yet
    return requestMapStylesUpdater(
      {
        ...state,
        styleType
      },
      {
        payload: {
          mapStyles: {
            [styleType]: state.mapStyles[styleType]
          },
          onSuccess
        }
      }
    );
  }

  const defaultLGVisibility = getDefaultLayerGroupVisibility(state.mapStyles[styleType]);

  const visibleLayerGroups = mergeLayerGroupVisibility(
    defaultLGVisibility,
    state.visibleLayerGroups
  );

  const threeDBuildingColor: RGBColor = state.custom3DBuildingColor
    ? state.threeDBuildingColor
    : get3DBuildingColor(state.mapStyles[styleType]);

  // determine new backgroundColor from either previous state basemap style, previous state backgroundColor, or the DEFAULT_BACKGROUND_COLOR
  const backgroundColor = getBackgroundColor(state, styleType);

  return {
    ...state,
    styleType,
    visibleLayerGroups,
    threeDBuildingColor,
    backgroundColor,
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
 * @public
 */
export const loadMapStylesUpdater = (
  state: MapStyle,
  action: MapStyleActions.LoadMapStylesUpdaterAction
): MapStyle => {
  const {newStyles, onSuccess} = action.payload || {};

  const addLayerGroups = Object.keys(newStyles).reduce(
    (accu, id) => ({
      ...accu,
      [id]: {
        ...newStyles[id],
        layerGroups: newStyles[id].layerGroups || getLayerGroupsFromStyle(newStyles[id].style)
      }
    }),
    {}
  );
  // reset isLoading
  const isLoading = Object.keys(state.isLoading).reduce(
    (accu, key) => ({
      ...accu,
      ...(state.isLoading[key] && hasStyleObject(newStyles[key])
        ? {[key]: false}
        : {[key]: state.isLoading[key]})
    }),
    {}
  );
  // add new styles to state
  const newState = {
    ...state,
    isLoading,
    mapStyles: {
      ...state.mapStyles,
      ...addLayerGroups
    }
  };

  const tasks = createActionTask(onSuccess, {styleType: state.styleType});

  const nextState = newStyles[state.styleType]
    ? mapStyleChangeUpdater(newState, {payload: {styleType: state.styleType}})
    : newState;

  return tasks ? withTask(nextState, tasks) : nextState;
};

function createActionTask(action, payload) {
  if (typeof action === 'function') {
    return ACTION_TASK().map(_ => action(payload));
  }

  return null;
}

/**
 * Callback when load map style error
 * @memberof mapStyleUpdaters
 * @public
 */
// do nothing for now, if didn't load, skip it
export const loadMapStyleErrUpdater = (
  state: MapStyle,
  {payload: {ids, error}}: MapStyleActions.LoadMapStyleErrUpdaterAction
): MapStyle => {
  Console.error(error);
  // reset isLoading
  const isLoading = Object.keys(state.isLoading).reduce(
    (accu, key) => ({
      ...accu,
      ...(state.isLoading[key] && (ids || []).includes(key)
        ? {[key]: false}
        : {[key]: state.isLoading[key]})
    }),
    {}
  );

  return {
    ...state,
    isLoading
  };
};

/**
 * Load map style object when pass in saved map config
 * @memberof mapStyleUpdaters
 * @param state `mapStyle`
 * @param action
 * @param action.payload saved map config `{mapStyle, visState, mapState}`
 * @returns nextState or `react-pam` tasks to load map style object
 */
export const receiveMapConfigUpdater = (
  state: MapStyle,
  {
    payload: {config}
  }: {
    type?: typeof ActionTypes.RECEIVE_MAP_CONFIG;
    payload: ReceiveMapConfigPayload;
  }
): MapStyle => {
  const {mapStyle} = config || {};

  if (!mapStyle) {
    return state;
  }

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
  // @ts-expect-error
  merged.custom3DBuildingColor =
    // @ts-expect-error
    Boolean(mapStyle.threeDBuildingColor) || merged.custom3DBuildingColor;
  const newState = mapConfigChangeUpdater(state, {payload: merged});

  return mapStyleChangeUpdater(newState, {payload: {styleType: newState.styleType}});
};

function getLoadMapStyleTasks(mapStyles, mapboxApiAccessToken, mapboxApiUrl, onSuccess) {
  return [
    Task.all(
      Object.values(mapStyles)
        // @ts-expect-error
        .map(({id, url, accessToken}) => ({
          id,
          url: isValidStyleUrl(url)
            ? getStyleDownloadUrl(url, accessToken || mapboxApiAccessToken, mapboxApiUrl)
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
          ),
          onSuccess
        ),
      // error
      err => loadMapStyleErr(Object.keys(mapStyles), err)
    )
  ];
}
/**
 * Reset map style config to initial state
 * @memberof mapStyleUpdaters
 * @param state `mapStyle`
 * @returns nextState
 * @public
 */
export const resetMapConfigMapStyleUpdater = (state: MapStyle): MapStyle => {
  const emptyConfig = {
    ...INITIAL_MAP_STYLE,
    mapboxApiAccessToken: state.mapboxApiAccessToken,
    mapboxApiUrl: state.mapboxApiUrl,
    mapStylesReplaceDefault: state.mapStylesReplaceDefault,
    ...state.initialState,
    mapStyles: state.mapStyles,
    initialState: state.initialState
  };

  return mapStyleChangeUpdater(emptyConfig, {payload: {styleType: emptyConfig.styleType}});
};

/**
 * Callback when a custom map style object is received
 * @memberof mapStyleUpdaters
 * @public
 */
export const loadCustomMapStyleUpdater = (
  state: MapStyle,
  {payload: {icon, style, error}}: MapStyleActions.LoadCustomMapStyleUpdaterAction
): MapStyle => ({
  ...state,
  // @ts-expect-error
  inputStyle: {
    ...state.inputStyle,
    // style json and icon will load asynchronously
    ...(style
      ? {
          // @ts-expect-error
          id: style.id || generateHashId(),
          // make a copy of the style object
          style: cloneDeep(style),
          // @ts-expect-error
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
 * @public
 */
export const inputMapStyleUpdater = (
  state: MapStyle,
  {payload: {inputStyle, mapState}}: MapStyleActions.InputMapStyleUpdaterAction
): MapStyle => {
  const updated = {
    ...state.inputStyle,
    ...inputStyle
  };

  const isValid = isValidStyleUrl(updated.url);
  const icon = isValid
    ? getStyleImageIcon({
        mapState,
        styleUrl: updated.url || '',
        mapboxApiAccessToken: updated.accessToken || state.mapboxApiAccessToken || '',
        mapboxApiUrl: state.mapboxApiUrl || DEFAULT_MAPBOX_API_URL
      })
    : state.inputStyle.icon;

  return {
    ...state,
    inputStyle: {
      ...updated,
      isValid,
      icon
    }
  };
};

/**
 * Add map style from user input to reducer and set it to current style
 * This action is called when user click confirm after putting in a valid style url in the custom map style dialog.
 * It should not be called from outside kepler.gl without a valid `inputStyle` in the `mapStyle` reducer.
 * @memberof mapStyleUpdaters
 */
export const addCustomMapStyleUpdater = (state: MapStyle): MapStyle => {
  // @ts-expect-error
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
  return mapStyleChangeUpdater(newState, {payload: {styleType: styleId}});
};

/**
 * Updates 3d building color
 * @memberof mapStyleUpdaters
 */
export const set3dBuildingColorUpdater = (
  state: MapStyle,
  {payload: color}: MapStyleActions.Set3dBuildingColorUpdaterAction
): MapStyle => ({
  ...state,
  threeDBuildingColor: color,
  custom3DBuildingColor: true
});

/**
 * Updates background color
 * @memberof mapStyleUpdaters
 */
export const setBackgroundColorUpdater = (
  state: MapStyle,
  {payload: color}: MapStyleActions.SetBackgroundColorUpdaterAction
): MapStyle => ({
  ...state,
  backgroundColor: color
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

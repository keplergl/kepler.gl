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

import Immutable from 'immutable';
import Task, {withTask} from 'react-palm/tasks';

// Utils
import {
  getDefaultLayerGroupVisibility,
  isValidStyleUrl,
  getStyleDownloadUrl,
  mergeLayerGroupVisibility,
  editTopMapStyle,
  editBottomMapStyle
} from 'utils/map-style-utils/mapbox-gl-style-editor';
import {DEFAULT_MAP_STYLES, DEFAULT_LAYER_GROUPS} from 'constants/default-settings';
import {generateHashId} from 'utils/utils';
import {LOAD_MAP_STYLE_TASK} from 'tasks/tasks';
import {loadMapStyles, loadMapStyleErr} from 'actions/map-style-actions';

const getDefaultState = () => {
  const visibleLayerGroups = {};
  const styleType = 'dark';
  const topLayerGroups = {};

  return {
    styleType,
    visibleLayerGroups,
    topLayerGroups,
    mapStyles: DEFAULT_MAP_STYLES.reduce((accu, curr) => ({
      ...accu,
      [curr.id]: curr
    }), {}),
    // save mapbox access token
    mapboxApiAccessToken: null,
    inputStyle: getInitialInputStyle(),
    threeDBuildingColor: get3DBuildingColor(styleType)
  };
};

export const INITIAL_MAP_STYLE = getDefaultState();

/**
 * Create two map styles from preset map style, one for top map one for bottom
 *
 * @param {string} styleType - current map style
 * @param {object} visibleLayerGroups - visible layers of bottom map
 * @param {object} topLayerGroups - visible layers of top map
 * @param {object} mapStyles - a dictionary of all map styles
 * @returns {object} bottomMapStyle | topMapStyle | isRaster
 */
function getMapStyles({
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
    ? Immutable.fromJS(mapStyle.style)
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
  const threeDBuildingColor = get3DBuildingColor(styleType);
  return {bottomMapStyle, topMapStyle, editable, threeDBuildingColor};
}

function get3DBuildingColor(style) {
  switch (style) {
    case 'dark':
      return [21, 28, 42];
    case 'muted':
      return [233, 233, 233];
    case 'muted_night':
      return [22, 25, 29];
    case 'light':
    default: 
      return [160, 160, 180];
  }
}

function getLayerGroupsFromStyle(style) {
  return DEFAULT_LAYER_GROUPS.filter(lg => style.layers.filter(lg.filter).length);
}

// Updaters
export const initMapStyleUpdater = (state, action) => ({
  ...state,
  // save mapbox access token to map style state
  mapboxApiAccessToken: (action.payload || {}).mapboxApiAccessToken
});

export const mapConfigChangeUpdater = (state, action) => ({
  ...state,
  ...action.payload,
  ...getMapStyles({
    ...state,
    ...action.payload
  })
});

export const mapStyleChangeUpdater = (state, {payload: styleType}) => {
  if (!state.mapStyles[styleType]) {
    // we might not have received the style yet
    return state;
  }
  const defaultLGVisibility = getDefaultLayerGroupVisibility(
    state.mapStyles[styleType]
  );

  const visibleLayerGroups = mergeLayerGroupVisibility(defaultLGVisibility, state.visibleLayerGroups);

  return {
    ...state,
    styleType,
    visibleLayerGroups,
    ...getMapStyles({
      ...state,
      visibleLayerGroups,
      styleType
    })
  };
};

export const loadMapStylesUpdater = (state, action) => {
  const newStyles = action.payload;

  // add new styles to state
  const newState = {
    ...state,
    mapStyles: {
      ...state.mapStyles,
      ...newStyles
    }
  };

  return newStyles[state.styleType]
    ? mapStyleChangeUpdater(newState, {payload: state.styleType})
    : newState;
};

// do nothing for now, if didn't load, skip it
export const loadMapStyleErrUpdater = (state, action) => state;
export const receiveMapConfigUpdater = (state, {payload: {mapStyle}}) => {
  if (!mapStyle) {
    return state;
  }

  // if saved custom mapStyles load the style object
  const loadMapStyleTasks = mapStyle.mapStyles ? [
    Task.all(
      Object.values(mapStyle.mapStyles)
      .map(({id, url, accessToken}) => ({
        id, url: getStyleDownloadUrl(url, accessToken || state.mapboxApiAccessToken)
      }))
      .map(LOAD_MAP_STYLE_TASK))
      .bimap(
        // success
        results => (
          loadMapStyles(
            results.reduce((accu, {id, style}) => ({
              ...accu,
              [id]: {
                ...mapStyle.mapStyles[id],
                layerGroups: getLayerGroupsFromStyle(style),
                style
              }
            }), {})
          )
        ),
        // error
        error => loadMapStyleErr(error)
      )
  ] : null;

  const newState = mapConfigChangeUpdater(state, {payload: mapStyle});

  return loadMapStyleTasks ? withTask(
    newState,
    loadMapStyleTasks
  ) : newState;
};

export const resetMapConfigMapStyleUpdater = (state) => {
  const emptyConfig = {
    ...INITIAL_MAP_STYLE,
    mapboxApiAccessToken: state.mapboxApiAccessToken,
    ...state.initialState,
    mapStyles: state.mapStyles,
    initialState: state.initialState
  };

  return mapStyleChangeUpdater(emptyConfig, {payload: emptyConfig.styleType});
};

export const loadCustomMapStyleUpdater = (state, {payload: {icon, style, error}}) => ({
  ...state,
  inputStyle: {
    ...state.inputStyle,
    // style json and icon will load asynchronously
    ...(style ? {
      id: style.id || generateHashId(),
      // make a copy of the style object
      style: JSON.parse(JSON.stringify(style)),
      label: style.name,
      // gathering layer group info from style json
      layerGroups: getLayerGroupsFromStyle(style)
    } : {}),
    ...(icon ? {icon} : {}),
    ...(error !== undefined ? {error} : {})
  }
});

export const inputMapStyleUpdater = (state, {payload: inputStyle}) => ({
  ...state,
  inputStyle: {
    ...inputStyle,
    isValid: isValidStyleUrl(inputStyle.url)
  }
});

export const addCustomMapStyleUpdater = (state, action) => {
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

export function getInitialInputStyle() {
  return {
    accessToken: null,
    error: false,
    isValid: false,
    label: null,
    style: null,
    url: null,
    custom: true
  };
}

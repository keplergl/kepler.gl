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

// Utils
import {
  getDefaultLayerGroupVisibility,
  isValidStyleUrl,
  editTopMapStyle,
  editBottomMapStyle
} from 'utils/map-style-utils/mapbox-gl-style-editor';
import {DEFAULT_LAYER_GROUPS} from 'constants/default-settings';
import {generateHashId} from 'utils/utils';

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

  return {bottomMapStyle, topMapStyle, editable};
}

// Updaters
export const mapConfigChangeUpdater = (state, action) => ({
  ...state,
  ...action.payload,
  ...getMapStyles({
    ...state,
    ...action.payload
  })
});

export const mapStyleChangeUpdater = (state, {payload: styleType}) => {
  const visibleLayerGroups = getDefaultLayerGroupVisibility(
    state.mapStyles[styleType]
  );

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
export const receiveMapConfigUpdater = (state, action) =>
  action.payload.mapStyle
    ? mapConfigChangeUpdater(state, {payload: action.payload.mapStyle})
    : state;

export const loadCustomMapStyleUpdater = (state, {payload: {icon, style, error}}) => ({
  ...state,
  inputStyle: {
    ...state.inputStyle,
    // style json and icon will load asynchronously
    ...(style ? {
      id: style.id || generateHashId(),
      style,
      label: style.name,
      // gathering layer group info from style json
      layerGroups: DEFAULT_LAYER_GROUPS.filter(lg => style.layers.filter(lg.filter).length)
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
    inputStyle: {
      url: null,
      isValid: false,
      label: null,
      style: null
    }
  };
  // set new style
  return mapStyleChangeUpdater(newState, {payload: styleId});
};

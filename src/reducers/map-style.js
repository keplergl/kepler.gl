import {handleActions} from 'redux-actions';
import {withTask} from 'react-palm'
import Immutable from 'immutable';
import {rgb} from 'd3-color';

// Actions
import ActionTypes from 'constants/action-types';

// Utils
import {
  getDefaultLayerGroupVisibility,
  editTopMapStyle,
  editBottomMapStyle
} from 'utils/map-style-utils/mapbox-gl-style-editor';
import {hexToRgb} from "utils/color-utils";

// Constants
import {
  INITIAL_STYLE_TYPE,
  MAP_STYLES
} from 'constants/default-settings';

const {
  MAP_CONFIG_CHANGE,
  MAP_STYLE_CHANGE,
  LOAD_MAP_STYLES,
  LOAD_MAP_STYLE_ERR,
  RECEIVE_MAP_CONFIG,
  MAP_BUILDING_CHANGE
} = ActionTypes;

const DEFAULT_BLDG_COLOR = '#D1CEC7';

// bedrock browserInit flattens our immutable object into a plain object
// we have to recreate the state after the app is loaded
const getDefaultState = () => {
  const visibleLayerGroups = {};
  const styleType = INITIAL_STYLE_TYPE;
  const topLayerGroups = {};

  return {
    styleType,
    visibleLayerGroups,
    topLayerGroups,
    mapStyles: {},
    buildingLayer: {
      isVisible: false,
      color: hexToRgb(DEFAULT_BLDG_COLOR),
      opacity: 0.7
    }
  };
};

/**
 * Create two map styles from preset map style, one for top map one for bottom
 *
 * @param {string} styleType - current map style
 * @param {object} visibleLayerGroups - visible layers of bottom map
 * @param {object} topLayerGroups - visible layers of top map
 * @param {object} mapStyles - a dictionary of all map styles
 * @returns {object} bottomMapStyle | topMapStyle | isRaster
 */
function getMapStyles({styleType, visibleLayerGroups, topLayerGroups, mapStyles}) {
  const mapStyle = mapStyles[styleType] && mapStyles[styleType];
  if (!mapStyle.style) {
    return {};
  }

  const editable = Object.keys(visibleLayerGroups).length;

  const bottomMapStyle = !editable ? Immutable.fromJS(mapStyle.style) :
    editBottomMapStyle({
      id: styleType,
      mapStyle,
      visibleLayerGroups
    });

  const hasTopLayer = editable && Object.values(topLayerGroups).some(v => v);

  // mute top layer if not visible in bottom layer
  const topLayers = hasTopLayer && Object.keys(topLayerGroups).reduce((accu, key) => ({
    ...accu,
    [key]: topLayerGroups[key] && visibleLayerGroups[key]
  }), {});

  const topMapStyle = hasTopLayer ? editTopMapStyle({
    id: styleType,
    mapStyle,
    visibleLayerGroups: topLayers
  }) : null;

  return {bottomMapStyle, topMapStyle, editable};
}

function getBuildingColor(style) {
  const bldgFillLayer = (style.style.layers || []).find(({id}) => id === 'building-fill');

  const buildingColor = bldgFillLayer ? bldgFillLayer.paint['fill-color'] : DEFAULT_BLDG_COLOR;

  // brighten or darken building based on style
  const operation = style.id.match(/(?=(dark|night))/) ? 'brighter':  'darker';
  const adjusted = rgb(buildingColor)[operation](0.2);

  return [
    adjusted.r,
    adjusted.g,
    adjusted.b
  ];
}

const onMapConfigChange = (state, action) => ({
  ...state,
  ...action.payload,
  ...getMapStyles({
    ...state,
    ...action.payload
  })
});

const onMapStyleChange = (state, {payload: styleType}) => {
  const visibleLayerGroups = getDefaultLayerGroupVisibility(state.mapStyles[styleType]);

  return {
    ...state,
    styleType,
    visibleLayerGroups,
    ...getMapStyles({
      ...state,
      visibleLayerGroups,
      styleType
    }),
    buildingLayer: {
      ...state.buildingLayer,
      color: state.mapStyles[styleType].buildingColor
    }
  }
};

const onBuildingLayerChange = (state, {payload}) => ({
  ...state,
  buildingLayer: {
    ...state.buildingLayer,
    ...payload
  }
});

const onReceiveMapStyles = (state, action) => {
  const newStyles = action.payload;
  Object.keys(newStyles).forEach(key => {
    const style = newStyles[key];

    // get building color
    newStyles[key] = {
      ...style,
      buildingColor: getBuildingColor(style)
    };
  });

  // add new styles to state
  const newState = {
    ...state,
    mapStyles: {
      ...state.mapStyles,
      ...newStyles
    }
  };

  return newStyles[state.styleType] ? onMapStyleChange(newState, {payload: state.styleType})
    : newState;
};

// do nothing for now, if didn't load, skip it
const onLoadMapStyleErr = (state, action) => state;
const onReceiveMapStyleConfig = (state, action) => action.payload.mapStyle ?
  onMapConfigChange(state, {payload: action.payload.mapStyle}) : state;

export const INITIAL_MAP_STYLE = getDefaultState();

const mapStyleReducer = handleActions({
  [MAP_CONFIG_CHANGE]: onMapConfigChange,
  [MAP_STYLE_CHANGE]: onMapStyleChange,
  [MAP_BUILDING_CHANGE]: onBuildingLayerChange,
  [LOAD_MAP_STYLES]: onReceiveMapStyles,
  [LOAD_MAP_STYLE_ERR]: onLoadMapStyleErr,
  [RECEIVE_MAP_CONFIG]: onReceiveMapStyleConfig
}, INITIAL_MAP_STYLE);

export default mapStyleReducer;

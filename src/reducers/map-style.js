import {handleActions} from 'redux-actions';
import {withTask} from 'react-palm'
import Immutable from 'immutable';
import {rgb} from 'd3-color';
import {wrapTo} from "../actions/action-wrapper";
// Tasks
import {LOAD_MAP_STYLE_TASK} from '../tasks/tasks';

// Actions
import {loadMapStyleErr, loadMapStyles} from '../actions/map-style-actions';
import ActionTypes from '../constants/action-types';

// Utils
import {
  getDefaultLayerGroupVisibility,
  editTopMapStyle,
  editBottomMapStyle
} from '../utils/map-style-utils/mapbox-gl-style-editor';
import {hexToRgb} from "../utils/color-utils";

// Constants
import {LayerGroups} from '../constants/mapbox-gl-styles';
import {
  INITIAL_STYLE_TYPE,
  MAP_STYLES
} from '../constants/default-settings';

const {
  INIT,
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
  const visibleLayerGroups = getDefaultLayerGroupVisibility();
  const styleType = INITIAL_STYLE_TYPE;
  const topLayerGroups = {};

  return {
    styleType,
    visibleLayerGroups,
    topLayerGroups,
    isRaster: false,
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
  const mapStyle = mapStyles[styleType] && mapStyles[styleType].style;
  if (!mapStyle) {
    return {};
  }

  const isRaster = mapStyles[styleType].type === 'raster';

  const bottomMapStyle = isRaster ? Immutable.fromJS(mapStyle) :
    editBottomMapStyle({
      id: styleType,
      mapStyle,
      visibleLayerGroups
    });

  const hasTopLayer = !isRaster && Object.values(topLayerGroups).some(v => v);

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

  return {bottomMapStyle, topMapStyle, isRaster};
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

function getEditableLayers(style) {
  const layers = style.style.layers || [];
  return LayerGroups.reduce((accu, lg) => ({
    ...accu,
    [lg.slug]: layers.filter(lg.filter).length > 0
  }), {});
}

// State Updater Functions
const startLoadMapStyles = (state, {payload: id}) =>
  withTask(
    state,
    Object.keys(MAP_STYLES).map(k =>
      LOAD_MAP_STYLE_TASK(MAP_STYLES[k]).bimap(
        style => wrapTo(id, loadMapStyles({[k]: {...MAP_STYLES[k], style}})),
        error => wrapTo(id, loadMapStyleErr(error))
      )
    )
  );

const onMapConfigChange = (state, action) => ({
  ...state,
  ...action.payload,
  ...getMapStyles({
    ...state,
    ...action.payload
  })
});

const onMapStyleChange = (state, {payload: styleType}) => ({
  ...state,
  styleType,
  ...getMapStyles({
    ...state,
    styleType
  }),
  buildingLayer: {
    ...state.buildingLayer,
    color: state.mapStyles[styleType].buildingColor
  }
});

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
    // find building color
    // get editable layers
    newStyles[key] = {
      ...style,
      editableLayers: getEditableLayers(style),
      buildingColor: getBuildingColor(style)
    };
  });

  const mapStyles = {
    ...state.mapStyles,
    ...newStyles
  };

  const newState = {
    ...state,
    mapStyles,
    buildingLayer: {
      ...state.buildingLayer,
      color: mapStyles[state.styleType].buildingColor
    }
  };

  return {
    ...newState,
    ...getMapStyles(newState)
  };
};

// do nothing for now, if didn't load, skip it
const onLoadMapStyleErr = (state, action) => state;
const onReceiveMapStyleConfig = (state, action) => action.payload.mapStyle ?
  onMapConfigChange(state, {payload: action.payload.mapStyle}) : state;

export const INITIAL_MAP_STYLE = getDefaultState();

const mapStyleReducer = handleActions({
  [INIT]: startLoadMapStyles,
  [MAP_CONFIG_CHANGE]: onMapConfigChange,
  [MAP_STYLE_CHANGE]: onMapStyleChange,
  [MAP_BUILDING_CHANGE]: onBuildingLayerChange,
  [LOAD_MAP_STYLES]: onReceiveMapStyles,
  [LOAD_MAP_STYLE_ERR]: onLoadMapStyleErr,
  [RECEIVE_MAP_CONFIG]: onReceiveMapStyleConfig
}, INITIAL_MAP_STYLE);

export default mapStyleReducer;

import Immutable from 'immutable';
import {rgb} from 'd3-color';

// Utils
import {
  getDefaultLayerGroupVisibility,
  editTopMapStyle,
  editBottomMapStyle
} from 'utils/map-style-utils/mapbox-gl-style-editor';
import {DEFAULT_BLDG_COLOR} from 'constants/default-settings';

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

function getBuildingColor(style) {
  const bldgFillLayer = (style.style.layers || []).find(
    ({id}) => id === 'building-fill'
  );

  const buildingColor = bldgFillLayer
    ? bldgFillLayer.paint['fill-color']
    : DEFAULT_BLDG_COLOR;

  // brighten or darken building based on style
  const operation = style.id.match(/(?=(dark|night))/) ? 'brighter' : 'darker';
  const adjusted = rgb(buildingColor)[operation](0.2);
  return [
    Math.round(adjusted.r),
    Math.round(adjusted.g),
    Math.round(adjusted.b)
  ];
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
    }),
    buildingLayer: {
      ...state.buildingLayer,
      color: state.mapStyles[styleType].buildingColor
    }
  };
};

export const mapBuildingChangeUpdater = (state, {payload}) => ({
  ...state,
  buildingLayer: {
    ...state.buildingLayer,
    ...payload
  }
});

export const loadMapStylesUpdater = (state, action) => {
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

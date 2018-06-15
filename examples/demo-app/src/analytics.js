import { ActionTypes } from "kepler.gl/actions";

import { LOCATION_CHANGE } from "react-router-redux";

const {
  ADD_DATA,
  LAYER_CONFIG_CHANGE,
  LAYER_HOVER,
  MAP_STYLE_CHANGE,
  UPDATE_MAP,
  TOGGLE_MODAL,
  TOGGLE_SIDE_PANEL
} = ActionTypes;

const getPayload = ({ payload }) => payload;

const trackingInformation = {
  [ADD_DATA]: ({ payload: { files } }) =>
    files.map(({ name, size, type }) => ({ name, size, type })),
  [LAYER_HOVER]: ({
    payload: {
      info: { lngLat }
    }
  }) => lngLat,
  [LAYER_CONFIG_CHANGE]: ({
    payload: {
      oldLayer: { type },
      newConfig
    }
  }) => ({
    type,
    newConfig
  }),
  [MAP_STYLE_CHANGE]: getPayload,
  [TOGGLE_MODAL]: getPayload,
  [TOGGLE_SIDE_PANEL]: getPayload,
  [UPDATE_MAP]: getPayload,
  [LOCATION_CHANGE]: x => x
};

const analyticsMiddleware = store => next => action => {
  // eslint-disable-next-line no-undef
  ga(
    "demo_app",
    action.type,
    trackingInformation[action.type]
      ? JSON.stringify(trackingInformation[action.type](action.payload, store))
      : undefined
  );
  return next(action);
};

export default analyticsMiddleware;

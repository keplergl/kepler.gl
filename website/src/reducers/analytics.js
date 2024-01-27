// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// This file sends actions on the demo app to Google analytics

import {ActionTypes} from '@kepler.gl/actions';
import {LOCATION_CHANGE} from 'react-router-redux';
import window from 'global/window';
import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import get from 'lodash.get';

const getPayload = action => (action ? action.payload : null);

// Hack, because we don't have a way to access next state
const getFilterType = (store, idx, value) => {
  const {visState} = store.getState().demo.keplerGl.map;
  const filter = visState.filters[idx];
  const {dataId} = filter;
  if (!dataId) {
    return {};
  }
  const {fields} = visState.datasets[dataId];
  const field = fields.find(f => f.name === value);

  // Hack
  switch (field.type) {
    case ALL_FIELD_TYPES.real:
    case ALL_FIELD_TYPES.integer:
      return 'range';

    case ALL_FIELD_TYPES.boolean:
      return 'select';

    case ALL_FIELD_TYPES.string:
    case ALL_FIELD_TYPES.date:
      return 'multiSelect';

    case ALL_FIELD_TYPES.timestamp:
      return 'timeRange';

    default:
      return null;
  }
};

const trackingInformation = {
  [ActionTypes.LOAD_FILES]: payload => payload.files.map(({size, type}) => ({size, type})),
  [ActionTypes.LAYER_TYPE_CHANGE]: ({newType}) => ({
    newType
  }),
  [ActionTypes.MAP_STYLE_CHANGE]: getPayload,
  [ActionTypes.TOGGLE_MODAL]: getPayload,
  [ActionTypes.ADD_LAYER]: (payload, store) => ({
    total: store.getState().demo.keplerGl.map.visState.layers.length + 1
  }),
  [ActionTypes.ADD_FILTER]: (payload, store) => ({
    total: store.getState().demo.keplerGl.map.visState.filters.length + 1
  }),
  [ActionTypes.SET_FILTER]: ({prop, idx, value}, store) => {
    if (prop !== 'name') {
      return {};
    }
    return {
      filterType: getFilterType(store, idx, value)
    };
  },
  [ActionTypes.INTERACTION_CONFIG_CHANGE]: ({config: {id, enabled}}) => ({
    [id]: enabled
  }),
  [LOCATION_CHANGE]: x => x,

  // demo app actions
  ['PUSHING_FILE']: payload => {
    const size = get(payload, ['metadata', 'metadata', 'size']);
    return {
      isLoading: payload.isLoading,
      status: payload.metadata.status,
      filename: payload.metadata.filename,
      size,
      error: payload.error
    };
  }
};

const EXCLUDED_ACTIONS = [ActionTypes.LAYER_HOVER, ActionTypes.UPDATE_MAP];

const analyticsMiddleware = store => next => action => {
  if (window.gtag && !EXCLUDED_ACTIONS.includes(action.type)) {
    const payload = action.payload || action;

    // eslint-disable-next-line no-undef
    window.gtag('event', 'action', {
      event_category: action.type,
      event_label: trackingInformation[action.type]
        ? JSON.stringify(trackingInformation[action.type](payload, store))
        : null
    });
  }

  return next(action);
};

export default analyticsMiddleware;

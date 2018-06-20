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

// This file sends actions on the demo app to Google analytics

import {ActionTypes} from 'kepler.gl/actions';
import {LOCATION_CHANGE} from 'react-router-redux';

const getPayload = ({payload}) => payload;

const trackingInformation = {
  [ActionTypes.LOAD_FILES]: ({files}) =>
    files.map(({size, type}) => ({size, type})),
  [ActionTypes.LAYER_TYPE_CHANGE]: ({payload: {newType}}) => ({
    newType
  }),
  [ActionTypes.MAP_STYLE_CHANGE]: getPayload,
  [ActionTypes.TOGGLE_MODAL]: getPayload,
  [ActionTypes.ADD_LAYER]: (payload, store) => ({
    total: store.getState().demo.keplerGl.map.visState.layers.length
  }),
  [ActionTypes.ADD_FILTER]: (payload, store) => ({
    total: store.getState().demo.keplerGl.map.visState.filters.length
  }),
  [ActionTypes.SET_FILTER]: ({prop, idx}, store) => {
    if (prop !== 'name') {
      return {};
    }
    return {
      filterType: store.getState().demo.keplerGl.map.visState.filters[
        idx
      ].type
    };
  },
  [ActionTypes.INTERACTION_CONFIG_CHANGE]: ({config: {id, enabled}}) => ({
    [id]: enabled
  }),
  [LOCATION_CHANGE]: x => x
};

const EXCLUDED_ACTIONS = [ActionTypes.LAYER_HOVER, ActionTypes.UPDATE_MAP];

const analyticsMiddleware = store => next => action => {
  // eslint-disable-next-line no-undef
  if (window && window.ga && !EXCLUDED_ACTIONS.includes(action.type)) {
    // eslint-disable-next-line no-undef
    window.ga(
      'demo_app',
      action.type,
      trackingInformation[action.type]
        ? JSON.stringify(
            trackingInformation[action.type](action.payload, store)
          )
        : undefined
    );
  }
  return next(action);
};

export default analyticsMiddleware;

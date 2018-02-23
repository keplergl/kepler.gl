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

export const FORWARD = '@redux-forward/FORWARD';
export const ADDRESS_PREFIX = '@@KG_';

import curry from 'curry';

/*
 * wrap an action into a forward action
 *  A forward action looks like this:
 *
 *  {
 *    type: "@@kepler.gl/LAYER_CONFIG_CHANGE",
 *    payload: {
 *      type: '@@kepler.gl/LAYER_CONFIG_CHANGE',
 *      payload: {},
 *      meta: {
 *        // other meta,
 *        _id_: id
 *      }
 *    },
 *    meta: {
 *      forward: '@redux-forward/FORWARD',
 *      id: '@@KG_id'
 *    }
 *  };
 */

export const getActionForwardAddress = id =>
  `${ADDRESS_PREFIX}${id.toUpperCase()}`;

export const wrapTo = curry((id, action) => ({
  // keep original action.type
  type: action.type,

  // actual action
  payload: {
    ...action,
    meta: {
      ...action.meta,
      _id_: id
    }
  },

  // add forward signature to meta
  meta: {
    ...(action.meta || {}),
    _forward_: FORWARD,
    _addr_: getActionForwardAddress(id)
  }
}));

export const isForwardAction = action => {
  return action && action.meta && action.meta._forward_ === FORWARD;
};

export const unwrap = action =>
  isForwardAction(action) ? unwrap(action.payload) : action;

// given a id to forward to, returns the action for that id
export const actionFor = (id, action) =>
  isForwardAction(action)
    ? action.meta._addr_ === getActionForwardAddress(id) ? action.payload : {}
    : action;

// returns a new dispatch that wraps and forwards the actions with the given id
export const forwardTo = (id, dispatch) => action =>
  dispatch(wrapTo(id, action));

export const updateProperty = (state, id, value) =>
  state[id] === value
    ? state
    : {
        ...state,
        [id]: value
      };

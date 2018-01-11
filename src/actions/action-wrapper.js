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
 *      meta: {}
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
  payload: action,

  // add forward signature to meta
  meta: {
    ...(action.meta || {}),
    _forward_: FORWARD,
    _id_: getActionForwardAddress(id)
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
    ? action.meta._id_ === getActionForwardAddress(id) ? action.payload : {}
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

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export const FORWARD = '@redux-forward/FORWARD';
export const ADDRESS_PREFIX = '@@KG_';
import {Dispatch} from 'redux';
import {ActionTypes} from './action-types';

import curry from 'lodash/curry';

interface IKeplerGlAction {
  type: (typeof ActionTypes)[keyof typeof ActionTypes];
  // TODO: Construct a type depending on the payload
  payload?: any;
  meta?: {
    _forward_?: string;
    _addr_?: string;
    _id_?: string;
    [key: string]: any;
  };
}

export const getActionForwardAddress = (id: string) => `${ADDRESS_PREFIX}${id.toUpperCase()}`;

/**
 * Wrap an action into a forward action that only modify the state of a specific
 * kepler.gl instance. kepler.gl reducer will look for signatures in the action to
 * determine whether it needs to be forwarded to a specific instance reducer.
 *
 * wrapTo can be curried. You can create a curried action wrapper by only supply the `id` argument
 *
 * A forward action looks like this
 * ```js
 *  {
 *    type: "@@kepler.gl/LAYER_CONFIG_CHANGE",
 *    payload: {
 *      type: '@@kepler.gl/LAYER_CONFIG_CHANGE',
 *      payload: {},
 *      meta: {
 *       // id of instance
 *        _id_: id
 *       // other meta
 *      }
 *    },
 *    meta: {
 *      _forward_: '@redux-forward/FORWARD',
 *      _addr_: '@@KG_id'
 *    }
 *  };
 * ```
 *
 * @memberof forwardActions
 * @param {string} id - The id to forward to
 * @param {Object} action - the action object {type: string, payload: *}
 * @returns {{type: string, payload: {type: string, payload: *, meta: {_id_: string}, meta: {_forward_: string, _addr_: string}}}}
 * @public
 * @example
 *
 * import {wrapTo, togglePerspective} from '@kepler.gl/actions';
 *
 * // This action will only dispatch to the KeplerGl instance with `id: map_1`
 * this.props.dispatch(wrapTo('map_1', togglePerspective()));
 *
 * // You can also create a curried action for each instance
 * const wrapToMap1 = wrapTo('map_1');
 * this.props.dispatch(wrapToMap1(togglePerspective()));
 */
export const wrapTo = curry((id: string, action: IKeplerGlAction) => ({
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

/**
 * Whether an action is a forward action
 * @memberof forwardActions
 * @param {Object} action - the action object
 * @returns {boolean} boolean - whether the action is a forward action
 * @public
 */
export const isForwardAction = (action: IKeplerGlAction) => {
  return Boolean(action && action.meta && action.meta._forward_ === FORWARD);
};

/**
 * Unwrap an action
 * @memberof forwardActions
 * @param {Object} action - the action object
 * @returns {Object} - unwrapped action
 * @public
 */
export const unwrap = (action: IKeplerGlAction) =>
  isForwardAction(action) ? unwrap(action.payload) : action;

/**
 * Given an id, returns the action for that id.
 * If the action is not a forward action, return the action
 * @memberof forwardActions
 * @param {String} id
 * @param {Object} action
 * @private
 */
export const _actionFor = (id: string, action: IKeplerGlAction) =>
  isForwardAction(action)
    ? action.meta?._addr_ === getActionForwardAddress(id)
      ? action.payload
      : {}
    : action;

/**
 * Returns an action dispatcher that wraps and forwards the actions to a specific instance
 * @memberof forwardActions
 * @param {string} id - instance id
 * @param {Function} dispatch - action dispatcher
 * @public
 * @example
 *
 * // action and forward dispatcher
 * import {toggleSplitMap, forwardTo} from '@kepler.gl/actions';
 * import {connect} from 'react-redux';
 *
 * const MapContainer = props => (
 *  <div>
 *   <button onClick={() => props.keplerGlDispatch(toggleSplitMap())}/>
 *  </div>
 * )
 *
 * const mapDispatchToProps = (dispatch, props) => ({
 *  dispatch,
 *  keplerGlDispatch: forwardTo(‘foo’, dispatch)
 * });
 *
 * export default connect(
 *  state => state,
 *  mapDispatchToProps
 * )(MapContainer);
 */
export const forwardTo =
  (id: string, dispatch: Dispatch<IKeplerGlAction>) => (action: IKeplerGlAction) =>
    dispatch(wrapTo(id, action));

/**
 * Update the state of a kepler.gl instance
 * @memberof forwardActions
 * @param {Object} state
 * @param {string} id
 * @param {Object} nextState
 * @private
 */
export const _updateProperty = (state, id: string, nextState) =>
  state[id] === nextState
    ? state
    : {
        ...state,
        [id]: nextState
      };

/**
 * This declaration is needed to group actions in docs
 */
/**
 * A set of helpers to forward dispatch actions to a specific instance reducer
 * @public
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-ignore
const forwardActions = null;
/* eslint-enable @typescript-eslint/no-unused-vars */

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as VisStateActions from './vis-state-actions';
import * as MapStateActions from './map-state-actions';
import * as UIStateActions from './ui-state-actions';
import * as MapStyleActions from './map-style-actions';
import * as ProviderActions from './provider-actions';

// Actions
export * from './actions';

// kepler.gl actions accessible outside component
export * from './action-wrapper';
export * from './vis-state-actions';
export * from './ui-state-actions';
export * from './map-state-actions';
export * from './map-style-actions';
export * from './identity-actions';
export * from './provider-actions';

export {VisStateActions, MapStateActions, UIStateActions, MapStyleActions, ProviderActions};

// Dispatch
export {
  _actionFor,
  forwardTo,
  getActionForwardAddress,
  isForwardAction,
  unwrap,
  wrapTo
} from './action-wrapper';

export {default as ActionTypes, ACTION_PREFIX} from './action-types';
export {ActionTypes as ProviderActionTypes} from './provider-actions';

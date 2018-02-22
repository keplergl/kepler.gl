import ActionTypes from '../constants/action-types';
import {createAction} from 'redux-actions';

// create actions
const {RECEIVE_MAP_CONFIG, RESET_MAP_CONFIG, INIT} = ActionTypes;

// kepler.gl actions accessible outside component
export * from './vis-state-actions';
export * from './ui-state-actions';
export * from './map-state-actions';
export * from './map-style-actions';

export * from './identity-actions';

export const [receiveMapConfig, resetMapConfig, keplerGlInit] = [
  RECEIVE_MAP_CONFIG,
  RESET_MAP_CONFIG,
  INIT
].map(a => createAction(a));

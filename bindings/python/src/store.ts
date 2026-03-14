import {createStore as createReduxStore, combineReducers, applyMiddleware, compose} from 'redux';
import {keplerGlReducer, enhanceReduxMiddleware} from '@kepler.gl/reducers';

export const KEPLER_ID = 'jupyter_kepler';

const customizedKeplerGlReducer = keplerGlReducer.initialState({
  uiState: {
    currentModal: null,
    activeSidePanel: null
  }
});

const reducers = combineReducers({
  keplerGl: customizedKeplerGlReducer
});

export function createStore() {
  const middlewares = enhanceReduxMiddleware([]);
  const enhancers = [applyMiddleware(...middlewares)];

  // @ts-expect-error Redux types are not compatible with TypeScript
  return createReduxStore(reducers, {}, compose(...enhancers));
}

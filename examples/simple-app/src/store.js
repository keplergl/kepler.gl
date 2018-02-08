import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import {keplerGlReducer, visStateUpdaters} from 'kepler.gl';
import appReducer from './app-reducer';
import {taskMiddleware} from 'react-palm';
import window from 'global/window';

const reducers = combineReducers({
  keplerGl: keplerGlReducer,

  app: appReducer
});

const composedReducer = (state, action) => {
  switch (action.type) {
    // this is how you can directly update kepler.gl
    // state using state updaters in your root reducer
    // by listen on none kepler.gl actions
    case 'LOAD_DATA_SUCCESS':
      return {
        ...state,
        keplerGl: {
          ...state.keplerGl,
          // 'map' is the id of the keplerGl instance
          map: visStateUpdaters.updateVisDataUpdater(state.keplerGl.map, {datasets: action.payload})
        },
        loaded: true
      };
    default:
      break;
  }
  return reducers(state, action);
};

const middlewares = [taskMiddleware];
const enhancers = [applyMiddleware(...middlewares)];

const initialState = {};

// add redux devtools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  composedReducer,
  initialState,
  composeEnhancers(...enhancers)
);

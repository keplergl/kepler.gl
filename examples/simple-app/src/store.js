import {createStore, combineReducers, applyMiddleware, compose} from 'redux'
import {keplerGlReducer} from 'kepler.gl';
import appReducer from './app-reducer';
import {taskMiddleware} from 'react-palm'

const reducers = combineReducers({
  keplerGl: keplerGlReducer,

  app: appReducer
});

const middlewares = [taskMiddleware];
const enhancers = [
  applyMiddleware(...middlewares)
];

const initialState = {};

// add redux devtools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  reducers,
  initialState,
  composeEnhancers(...enhancers)
);
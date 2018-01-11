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

export default createStore(
  reducers,
  initialState,
  compose(...enhancers)
  // add redux devtools
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
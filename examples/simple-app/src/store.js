import {createStore, combineReducers} from 'redux'
import {keplerGlReducer} from 'kepler.gl';
import appReducer from './app-reducer';

const reducers = combineReducers({
  page: pageReducer,

  app: appReducer
});

export default createStore(
  reducers,

  // add redux devtools
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
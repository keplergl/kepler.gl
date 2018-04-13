import {createStore, combineReducers} from 'redux';
import appReducer from './app';
import {routerReducer} from 'react-router-redux'

export default createStore(
  combineReducers({
    app: appReducer,
    routing: routerReducer
  })
);

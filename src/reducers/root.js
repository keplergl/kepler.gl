import {handleActions} from 'redux-actions';

import {actionFor, updateProperty} from '../actions/action-wrapper';
import coreReducer from './core';

import {
  REGISTER_ENTRY,
  DELETE_ENTRY
} from '../actions/identity-actions';

import {keplerGlInit} from '../actions/actions';
/*
 * voyager reducer wrapper,
 * wraps multiple voyager state in one voyager
 */

// INITIAL_STATE
const initialCoreState = {};

const handleRegisterEntry = (state, {payload: id}) => ({
  // register a new entry to voyager reducer
  ...state,
  [id]: {
    ...coreReducer(undefined, keplerGlInit(id))
  }
});

const handleDeleteEntry = (state, {payload: id}) => {
  return Object.keys(state).reduce((accu, curr) => ({
    ...accu,
    ...(curr === id ? {} : {[curr]: state[curr]})
  }), {});
};

const keplerGlReducer = (state = initialCoreState, action) => {
  // update child states
  Object.keys(state).forEach(id => {
    const updateItemState = coreReducer(state[id], actionFor(id, action));
    state = updateProperty(state, id, updateItemState);
  });

  // perform additional state reducing (e.g. switch action.type etc...)
  return handleActions({
    [REGISTER_ENTRY]: handleRegisterEntry,
    [DELETE_ENTRY]: handleDeleteEntry
  }, initialCoreState)(state, action);
};

function decorate(target) {

  // plugin to core reducer
  target.plugin = function plugin(customReducer) {

    // use 'function' keyword to enable 'this'
    return decorate((state = {}, action = {}) => {
        let nextState = this(state, action);
        Object.keys(nextState).forEach(id => {
          // update child states
          nextState = updateProperty(
            nextState,
            id,
            customReducer(nextState[id], actionFor(id, action))
          );
        });

        return nextState;
      }
    )
  };

  return target;
}

export default decorate(keplerGlReducer);

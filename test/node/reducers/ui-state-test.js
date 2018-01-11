import test from 'tape';

import {
  toggleSidePanel,
  toggleModal
} from '../../../src/actions/ui-state-actions';
import reducer, {INITIAL_UI_STATE}  from '../../../src/reducers/ui-state';

test('#uiStateReducer', t => {

  t.deepEqual(reducer(undefined, {}), INITIAL_UI_STATE,
    'should return the initial state');

  t.end();
});

test('#uiStateReducer -> TOGGLE_SIDE_PANEL', t => {

  const newReducer = reducer(INITIAL_UI_STATE, toggleSidePanel('foo'));

  const expectedState = {
    ...INITIAL_UI_STATE,
    activeSidePanel: 'foo',
    isNavCollapsed: true
  };

  t.deepEqual(newReducer, expectedState, 'should update side panel');

  const nextState = reducer(expectedState, toggleSidePanel('copyConfig'));

  const expectedNextState = {
    ...expectedState,
    currentModal: 'copyConfig'
  };

  t.deepEqual(nextState, expectedNextState, 'should open copy config');

  const nextState2 = reducer(expectedState, toggleModal(null));

  const expectedNextState2 = {
    ...expectedState,
    currentModal: null
  };

  t.deepEqual(nextState2, expectedNextState2, 'should close modal');

  const nextState3 = reducer(expectedState, toggleSidePanel(null));

  const expectedNextState3 = {
    ...expectedState,
    activeSidePanel: null
  };

  t.deepEqual(nextState3, expectedNextState3, 'should close panel');

  t.end();
});

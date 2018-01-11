import {createAction} from 'redux-actions';
import ActionTypes from '../constants/action-types';

const {
  TOGGLE_SIDE_PANEL,
  TOGGLE_MODAL,
  OPEN_DELETE_MODAL
} = ActionTypes;

// second argument of createAction is expected to be payloadCreator or undefined
const [
  toggleSidePanel,
  toggleModal,
  openDeleteModal
] = [
  TOGGLE_SIDE_PANEL,
  TOGGLE_MODAL,
  OPEN_DELETE_MODAL
].map(a => createAction(a));

export {
  toggleSidePanel,
  toggleModal,
  openDeleteModal
};

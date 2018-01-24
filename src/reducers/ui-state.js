import {handleActions} from 'redux-actions';
import ActionTypes from 'constants/action-types';
import {
  openDeleteModalUpdater,
  toggleModalUpdater,
  toggleSidePanelUpdater
} from './ui-state-updaters';

export const INITIAL_UI_STATE = {
  isSideBarOpen: true,
  activeSidePanel: 'layer',
  isNavCollapsed: false,
  currentModal: 'addData',
  datasetKeyToRemove: null
};

/* Reducer */
const uiStateReducer = handleActions(
  {
    [ActionTypes.TOGGLE_SIDE_PANEL]: toggleSidePanelUpdater,
    [ActionTypes.TOGGLE_MODAL]: toggleModalUpdater,
    [ActionTypes.OPEN_DELETE_MODAL]: openDeleteModalUpdater
  },
  INITIAL_UI_STATE
);

export default uiStateReducer;

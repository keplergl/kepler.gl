import {handleActions} from 'redux-actions';
import ActionTypes from '../constants/action-types';
import {LAYER_CONFIG_ID, DELETE_DATA_ID} from '../constants/default-settings';

const {
  QUERY_BEGIN,
  TOGGLE_SIDE_PANEL,
  TOGGLE_MODAL,
  OPEN_DELETE_MODAL,
  UPDATE_SAVING_STATUS
} = ActionTypes;

export const INITIAL_UI_STATE = {
  activeSidePanel: null,
  isNavCollapsed: false,
  currentModal: 'addData',
  datasetKeyToRemove: null
};

/* Transition Functions */
const onToggleSidePanel = (state, {payload: id}) => {
  if (id === state.activeSidePanel) {
    return state;
  }

  if (id === LAYER_CONFIG_ID) {
    return {
      ...state,
      isNavCollapsed: true,
      currentModal: id
    }
  }

  return {
    ...state,
    isNavCollapsed: true,
    activeSidePanel: id
  };
};

const onToggleModal = (state, {payload: id}) => ({
  ...state,
  currentModal: id
});

const onOpenDeleteModal = (state, {payload: datasetKeyToRemove}) => ({
  ...state,
  currentModal: DELETE_DATA_ID,
  datasetKeyToRemove
});

const closeAddDataModel = (state) => ({
  ...state,
  currentModal: false // we always set to false since we show the dialog at the beginning
});

/* Reducer */
const uiStateReducer = handleActions({
  [TOGGLE_SIDE_PANEL]: onToggleSidePanel,
  [TOGGLE_MODAL]: onToggleModal,
  [OPEN_DELETE_MODAL]: onOpenDeleteModal,
  [QUERY_BEGIN]: closeAddDataModel,
  [UPDATE_SAVING_STATUS]: closeAddDataModel
}, INITIAL_UI_STATE);

export default uiStateReducer;

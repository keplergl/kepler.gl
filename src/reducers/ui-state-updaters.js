import {LAYER_CONFIG_ID, DELETE_DATA_ID} from 'constants/default-settings';

/* Updaters */
export const toggleSidePanelUpdater = (state, {payload: id}) => {
  if (id === state.activeSidePanel) {
    return state;
  }

  if (id === LAYER_CONFIG_ID) {
    return {
      ...state,
      isNavCollapsed: true,
      currentModal: id
    };
  }

  return {
    ...state,
    isNavCollapsed: true,
    activeSidePanel: id
  };
};

export const toggleModalUpdater = (state, {payload: id}) => ({
  ...state,
  currentModal: id
});

export const openDeleteModalUpdater = (
  state,
  {payload: datasetKeyToRemove}
) => ({
  ...state,
  currentModal: DELETE_DATA_ID,
  datasetKeyToRemove
});

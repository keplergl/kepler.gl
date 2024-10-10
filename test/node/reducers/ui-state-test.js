// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';

import {
  toggleSidePanel,
  toggleModal,
  toggleSidePanelCloseButton,
  openDeleteModal,
  setExportImageSetting,
  toggleMapControl,
  setMapControlVisibility,
  setExportSelectedDataset,
  setExportDataType,
  setExportFiltered,
  startExportingImage,
  addNotification,
  removeNotification,
  loadFiles,
  loadFilesErr,
  keplerGlInit
} from '@kepler.gl/actions';
import {
  uiStateReducer as reducer,
  uiStateReducerFactory,
  INITIAL_UI_STATE
} from '@kepler.gl/reducers';
import {
  EXPORT_DATA_TYPE,
  RESOLUTIONS,
  DEFAULT_NOTIFICATION_TOPICS,
  DEFAULT_NOTIFICATION_TYPES
} from '@kepler.gl/constants';

test('#uiStateReducer', t => {
  t.deepEqual(
    reducer(undefined, {}),
    {...INITIAL_UI_STATE, initialState: {}},
    'should return the initial state'
  );
  t.end();
});

test('#uiStateReducer -> INIT', t => {
  const uiStateReducer = uiStateReducerFactory();

  const newState = reducer(
    uiStateReducer(undefined, {}),
    keplerGlInit({
      initialUiState: {readOnly: true}
    })
  );
  t.deepEqual(
    newState,
    {...INITIAL_UI_STATE, readOnly: true, initialState: {}},
    'should apply initialUiState'
  );
  t.end();
});

test('#uiStateReducerFactory', t => {
  const uiStateReducer = uiStateReducerFactory({readOnly: true});

  t.deepEqual(
    uiStateReducer(undefined, {}),
    {...INITIAL_UI_STATE, readOnly: true, initialState: {readOnly: true}},
    'should return the initial state'
  );
  t.end();
});

test('#uiStateReducer -> TOGGLE_SIDE_PANEL', t => {
  const newReducer = reducer(INITIAL_UI_STATE, toggleSidePanel('foo'));

  const expectedState = {
    ...INITIAL_UI_STATE,
    activeSidePanel: 'foo'
  };

  t.deepEqual(newReducer, expectedState, 'should update side panel');

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

test('#uiStateReducer -> TOGGLE_SIDE_PANEL_CLOSE_BUTTON', t => {
  const newReducer = reducer(INITIAL_UI_STATE, toggleSidePanelCloseButton(false));

  const expectedState = {
    ...INITIAL_UI_STATE,
    isSidePanelCloseButtonVisible: false
  };

  t.deepEqual(newReducer, expectedState, 'should hide side panel close button');

  const nextState2 = reducer(expectedState, toggleSidePanelCloseButton(true));

  const expectedNextState2 = {
    ...expectedState,
    isSidePanelCloseButtonVisible: true
  };

  t.deepEqual(nextState2, expectedNextState2, 'should show side panel close button');

  t.end();
});

test('#uiStateReducer -> OPEN_DELETE_MODAL', t => {
  const newReducer = reducer(INITIAL_UI_STATE, openDeleteModal('chai'));

  const expectedState = {
    ...INITIAL_UI_STATE,
    currentModal: 'deleteData',
    datasetKeyToRemove: 'chai'
  };

  t.deepEqual(newReducer, expectedState, 'should open delete data modal and save key to remove');

  t.end();
});

test('#uiStateReducer -> SET_EXPORT_IMAGE_SETTING', t => {
  const newReducer = reducer(
    INITIAL_UI_STATE,
    setExportImageSetting({resolution: RESOLUTIONS.TWO_X})
  );

  const expectedState = {
    ...INITIAL_UI_STATE,
    exportImage: {
      ...INITIAL_UI_STATE.exportImage,
      resolution: RESOLUTIONS.TWO_X
    }
  };

  t.deepEqual(newReducer, expectedState, 'should set the resolution to TWO_X');

  t.end();
});

test('#uiStateReducer -> START_EXPORTING_IMAGE', t => {
  const newReducer = reducer(INITIAL_UI_STATE, startExportingImage());

  const expectedState = {
    ...INITIAL_UI_STATE,
    exportImage: {
      ...INITIAL_UI_STATE.exportImage,
      exporting: true
    }
  };

  t.deepEqual(newReducer, expectedState, 'should set exporting to true and modal to export image');

  t.end();
});

test('#uiStateReducer -> TOGGLE_MAP_CONTROL', t => {
  const newReducer = reducer(INITIAL_UI_STATE, toggleMapControl('mapLegend'));

  const expectedState = {
    ...INITIAL_UI_STATE,
    mapControls: {
      ...INITIAL_UI_STATE.mapControls,
      mapLegend: {
        ...INITIAL_UI_STATE.mapControls.mapLegend,
        active: !INITIAL_UI_STATE.mapControls.mapLegend.active,
        activeMapIndex: 0,
        disableEdit: false,
        disableClose: false
      }
    }
  };

  t.deepEqual(newReducer, expectedState, 'should set map legend to be seen');

  t.end();
});

test('#uiStateReducer -> SET_MAP_CONTROL_VISIBILITY', t => {
  const newReducer = reducer(INITIAL_UI_STATE, setMapControlVisibility('mapLegend', false));

  const expectedMapControl = {
    ...INITIAL_UI_STATE.mapControls,
    mapLegend: {
      ...INITIAL_UI_STATE.mapControls.mapLegend,
      show: false
    }
  };

  t.deepEqual(newReducer.mapControls, expectedMapControl, 'should set map legend show to be false');

  const newReducer1 = reducer(newReducer, setMapControlVisibility('mapLegend', true));

  const expectedMapControl1 = {
    ...INITIAL_UI_STATE.mapControls,
    mapLegend: {
      ...INITIAL_UI_STATE.mapControls.mapLegend,
      show: true
    }
  };

  t.deepEqual(newReducer1.mapControls, expectedMapControl1, 'should set map legend show to true');

  const newReducer2 = reducer(newReducer1, setMapControlVisibility('something', true));
  t.equal(newReducer1, newReducer2, 'should note update state');
  t.end();
});

test('#uiStateReducer -> SET_EXPORT_SELECTED_DATASET', t => {
  const newReducer = reducer(INITIAL_UI_STATE, setExportSelectedDataset('a'));

  const expectedState = {
    ...INITIAL_UI_STATE,
    exportData: {
      ...INITIAL_UI_STATE.exportData,
      selectedDataset: 'a'
    }
  };

  t.deepEqual(newReducer, expectedState, 'should set the selectedDataset to a');

  t.end();
});

test('#uiStateReducer -> SET_EXPORT_DATA_TYPE', t => {
  const newReducer = reducer(INITIAL_UI_STATE, setExportDataType(EXPORT_DATA_TYPE.JSON));

  const expectedState = {
    ...INITIAL_UI_STATE,
    exportData: {
      ...INITIAL_UI_STATE.exportData,
      dataType: EXPORT_DATA_TYPE.JSON
    }
  };

  t.deepEqual(newReducer, expectedState, 'should set the dataType to json');

  t.end();
});

test('#uiStateReducer -> SET_EXPORT_FILTERED', t => {
  const newReducer = reducer(INITIAL_UI_STATE, setExportFiltered(false));

  const expectedState = {
    ...INITIAL_UI_STATE,
    exportData: {
      ...INITIAL_UI_STATE.exportData,
      filtered: false
    }
  };

  t.deepEqual(newReducer, expectedState, 'should set the filtered to false');

  t.end();
});

test('#uiStateReducer -> ADD_NOTIFICATION', t => {
  const sharedNotificationId = 'test-notification-id';

  const notification1 = {
    type: DEFAULT_NOTIFICATION_TYPES.error,
    message: 'TEST',
    topic: DEFAULT_NOTIFICATION_TOPICS.global,
    id: 'test-1',
    count: 1
  };
  const state0 = reducer(INITIAL_UI_STATE, addNotification(notification1));
  t.equal(state0.notifications.length, 1, 'AddNotification should add one new notification');
  t.deepEqual(
    state0.notifications[0],
    notification1,
    'AddNotification should have propagated data correctly'
  );

  const notification2 = {
    type: DEFAULT_NOTIFICATION_TYPES.info,
    message: 'TEST',
    topic: DEFAULT_NOTIFICATION_TOPICS.file,
    id: sharedNotificationId,
    count: 1
  };
  const state1 = reducer(state0, addNotification(notification2));
  t.equal(state1.notifications.length, 2, 'AddNotification should add second notification');
  t.deepEqual(
    state1.notifications[1],
    notification2,
    'AddNotification should have propagated data correctly '
  );

  const updatedNotification = {
    type: DEFAULT_NOTIFICATION_TYPES.error,
    message: 'TEST-updated-message',
    topic: DEFAULT_NOTIFICATION_TOPICS.global,
    id: sharedNotificationId,
    count: 2
  };
  const state2 = reducer(state1, addNotification(updatedNotification));
  t.equal(
    state2.notifications.length,
    2,
    "addNotification shouldn't add new notification with same id"
  );
  t.deepEqual(
    state2.notifications[1],
    updatedNotification,
    'AddNotification should have propagated data correctly '
  );

  t.end();
});

test('#uiStateReducer -> REMOVE_NOTIFICATION', t => {
  const newState = reducer(
    INITIAL_UI_STATE,
    addNotification({
      type: DEFAULT_NOTIFICATION_TYPES.error,
      message: 'TEST',
      topic: DEFAULT_NOTIFICATION_TOPICS.global,
      id: 'test-1'
    })
  );

  t.equal(newState.notifications.length, 1, 'AddNotification should add one new notification');
  t.deepEqual(
    newState.notifications[0],
    {
      type: DEFAULT_NOTIFICATION_TYPES.error,
      message: 'TEST',
      topic: DEFAULT_NOTIFICATION_TOPICS.global,
      id: 'test-1',
      count: 1
    },
    'AddNotification should have propagated data correctly '
  );

  const nextState = reducer(newState, removeNotification('test-1'));

  t.equal(nextState.notifications.length, 0, 'RemoveNotification removed one notification');

  t.end();
});

test('#uiStateReducer -> LOAD_FILES_ERR', t => {
  const newState = reducer(INITIAL_UI_STATE, loadFiles());
  t.equal(newState.loadFiles.fileLoading, true, 'should set fileLoading to true');

  const newState1 = reducer(newState, loadFilesErr('file.csv', new Error('this is an error')));
  const expectedId = newState1.notifications.length ? newState1.notifications[0].id : 'error';
  t.equal(
    newState1.loadFiles.fileLoading,
    false,
    'should set fileLoading to false when loadFilesErr'
  );
  t.deepEqual(
    newState1.notifications,
    [
      {
        type: 'error',
        topic: 'global',
        message: 'this is an error',
        id: expectedId,
        count: 1
      }
    ],
    'should add an error notification'
  );

  t.end();
});

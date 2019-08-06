// Copyright (c) 2019 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import test from 'tape';

import {
  toggleSidePanel,
  toggleModal,
  openDeleteModal,
  setResolution,
  setRatio,
  toggleLegend,
  toggleMapControl,
  setExportSelectedDataset,
  setExportDataType,
  setExportFiltered,
  addNotification
} from 'actions/ui-state-actions';
import reducer, {uiStateReducerFactory}  from 'reducers/ui-state';
import {INITIAL_UI_STATE} from 'reducers/ui-state-updaters';
import {RATIOS, RESOLUTIONS, EXPORT_DATA_TYPE} from 'constants/default-settings';
import {DEFAULT_NOTIFICATION_TOPICS, DEFAULT_NOTIFICATION_TYPES} from 'constants/default-settings';
import {removeNotification} from 'actions/ui-state-actions';

test('#uiStateReducer', t => {

  t.deepEqual(
    reducer(undefined, {}),
    {...INITIAL_UI_STATE, initialState: {}},
    'should return the initial state'
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

test.only('#uiStateReducer -> TOGGLE_SIDE_PANEL', t => {

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

test('#uiStateReducer -> SET_RATIO', t => {

  const newReducer = reducer(INITIAL_UI_STATE, setRatio({ratio: RATIOS.SIXTEEN_BY_NINE}));

  const expectedState = {
    ...INITIAL_UI_STATE,
    exportImage: {
      ...INITIAL_UI_STATE.exportImage,
      ratio: RATIOS.SIXTEEN_BY_NINE
    }
  };

  t.deepEqual(newReducer, expectedState, 'should set the ratio to SIXTEEN_BY_NINE');

  t.end();
});

test('#uiStateReducer -> SET_RESOLUTION', t => {

  const newReducer = reducer(INITIAL_UI_STATE, setResolution({resolution: RESOLUTIONS.TWO_X}));

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

test('#uiStateReducer -> TOGGLE_LEGEND', t => {

  const newReducer = reducer(INITIAL_UI_STATE, toggleLegend());

  const expectedState = {
    ...INITIAL_UI_STATE,
    exportImage: {
      ...INITIAL_UI_STATE.exportImage,
      legend: true
    }
  };

  t.deepEqual(newReducer, expectedState, 'should set the legend to true');

  t.end();
});

test('#uiStateReducer -> TOGGLE_MAP_CONTROL', t => {

	const newReducer = reducer(INITIAL_UI_STATE, toggleMapControl('mapLegend'));

	const expectedState = {
		...INITIAL_UI_STATE,
		mapControls: {
			...INITIAL_UI_STATE.mapControls,
			mapLegend: {
				show: INITIAL_UI_STATE.mapControls.mapLegend.show,
				active: !INITIAL_UI_STATE.mapControls.mapLegend.active
			},
		}
	};

	t.deepEqual(newReducer, expectedState, 'should set map legend to be seen');

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
  const newState = reducer(INITIAL_UI_STATE, addNotification({
    type: DEFAULT_NOTIFICATION_TYPES.error,
    message: 'TEST',
    topic: DEFAULT_NOTIFICATION_TOPICS.global,
    id: 'test-1'
  }));

  t.equal(newState.notifications.length, 1, 'AddNotification should add one new notification');
  t.deepEqual(newState.notifications[0], {
    type: DEFAULT_NOTIFICATION_TYPES.error,
    message: 'TEST',
    topic: DEFAULT_NOTIFICATION_TOPICS.global,
    id: 'test-1'
  }, 'AddNotification should have propagated data correctly ');

  t.end();
});

test('#uiStateReducer -> REMOVE_NOTIFICATION', t => {
  const newState = reducer(INITIAL_UI_STATE, addNotification({
    type: DEFAULT_NOTIFICATION_TYPES.error,
    message: 'TEST',
    topic: DEFAULT_NOTIFICATION_TOPICS.global,
    id: 'test-1'
  }));

  t.equal(newState.notifications.length, 1, 'AddNotification should add one new notification');
  t.deepEqual(newState.notifications[0], {
    type: DEFAULT_NOTIFICATION_TYPES.error,
    message: 'TEST',
    topic: DEFAULT_NOTIFICATION_TOPICS.global,
    id: 'test-1'
  }, 'AddNotification should have propagated data correctly ');

  const nextState = reducer(newState, removeNotification('test-1'));

  t.equal(nextState.notifications.length, 0, 'RemoveNotification removed one notification');

  t.end();
});

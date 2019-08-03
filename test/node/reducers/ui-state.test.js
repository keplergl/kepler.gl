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

it('#uiStateReducer', () => {
  expect(reducer(undefined, {})).toEqual({...INITIAL_UI_STATE, initialState: {}});
});

it('#uiStateReducerFactory', () => {
  const uiStateReducer = uiStateReducerFactory({readOnly: true});

  expect(uiStateReducer(undefined, {}))
    .toEqual({...INITIAL_UI_STATE, readOnly: true, initialState: {readOnly: true}});
});

it('#uiStateReducer -> TOGGLE_SIDE_PANEL', () => {

  const newReducer = reducer(INITIAL_UI_STATE, toggleSidePanel('foo'));

  const expectedState = {
    ...INITIAL_UI_STATE,
    activeSidePanel: 'foo'
  };

  expect(newReducer).toEqual(expectedState);

  const nextState2 = reducer(expectedState, toggleModal(null));

  const expectedNextState2 = {
    ...expectedState,
    currentModal: null
  };

  expect(nextState2).toEqual(expectedNextState2);

  const nextState3 = reducer(expectedState, toggleSidePanel(null));

  const expectedNextState3 = {
    ...expectedState,
    activeSidePanel: null
  };

  expect(nextState3).toEqual(expectedNextState3);
});

it('#uiStateReducer -> OPEN_DELETE_MODAL', () => {

  const newReducer = reducer(INITIAL_UI_STATE, openDeleteModal('chai'));

  const expectedState = {
    ...INITIAL_UI_STATE,
    currentModal: 'deleteData',
    datasetKeyToRemove: 'chai'
  };

  expect(newReducer).toEqual(expectedState);
});

it('#uiStateReducer -> SET_RATIO', () => {

  const newReducer = reducer(INITIAL_UI_STATE, setRatio({ratio: RATIOS.SIXTEEN_BY_NINE}));

  const expectedState = {
    ...INITIAL_UI_STATE,
    exportImage: {
      ...INITIAL_UI_STATE.exportImage,
      ratio: RATIOS.SIXTEEN_BY_NINE
    }
  };

  expect(newReducer).toEqual(expectedState);
});

it('#uiStateReducer -> SET_RESOLUTION', () => {

  const newReducer = reducer(INITIAL_UI_STATE, setResolution({resolution: RESOLUTIONS.TWO_X}));

  const expectedState = {
    ...INITIAL_UI_STATE,
    exportImage: {
      ...INITIAL_UI_STATE.exportImage,
      resolution: RESOLUTIONS.TWO_X
    }
  };

  expect(newReducer).toEqual(expectedState);
});

it('#uiStateReducer -> TOGGLE_LEGEND', () => {

  const newReducer = reducer(INITIAL_UI_STATE, toggleLegend());

  const expectedState = {
    ...INITIAL_UI_STATE,
    exportImage: {
      ...INITIAL_UI_STATE.exportImage,
      legend: true
    }
  };

  expect(newReducer).toEqual(expectedState);
});

it('#uiStateReducer -> TOGGLE_MAP_CONTROL', () => {

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

	expect(newReducer).toEqual(expectedState);
});

it('#uiStateReducer -> SET_EXPORT_SELECTED_DATASET', () => {

  const newReducer = reducer(INITIAL_UI_STATE, setExportSelectedDataset('a'));

  const expectedState = {
    ...INITIAL_UI_STATE,
    exportData: {
      ...INITIAL_UI_STATE.exportData,
      selectedDataset: 'a'
    }
  };

  expect(newReducer).toEqual(expectedState);
});

it('#uiStateReducer -> SET_EXPORT_DATA_TYPE', () => {

  const newReducer = reducer(INITIAL_UI_STATE, setExportDataType(EXPORT_DATA_TYPE.JSON));

  const expectedState = {
    ...INITIAL_UI_STATE,
    exportData: {
      ...INITIAL_UI_STATE.exportData,
      dataType: EXPORT_DATA_TYPE.JSON
    }
  };

  expect(newReducer).toEqual(expectedState);
});

it('#uiStateReducer -> SET_EXPORT_FILTERED', () => {

  const newReducer = reducer(INITIAL_UI_STATE, setExportFiltered(false));

  const expectedState = {
    ...INITIAL_UI_STATE,
    exportData: {
      ...INITIAL_UI_STATE.exportData,
      filtered: false
    }
  };

  expect(newReducer).toEqual(expectedState);
});

it('#uiStateReducer -> ADD_NOTIFICATION', () => {
  const newState = reducer(INITIAL_UI_STATE, addNotification({
    type: DEFAULT_NOTIFICATION_TYPES.error,
    message: 'TEST',
    topic: DEFAULT_NOTIFICATION_TOPICS.global,
    id: 'test-1'
  }));

  expect(newState.notifications.length).toBe(1);
  expect(newState.notifications[0]).toEqual({
    type: DEFAULT_NOTIFICATION_TYPES.error,
    message: 'TEST',
    topic: DEFAULT_NOTIFICATION_TOPICS.global,
    id: 'test-1'
  });
});

it('#uiStateReducer -> REMOVE_NOTIFICATION', () => {
  const newState = reducer(INITIAL_UI_STATE, addNotification({
    type: DEFAULT_NOTIFICATION_TYPES.error,
    message: 'TEST',
    topic: DEFAULT_NOTIFICATION_TOPICS.global,
    id: 'test-1'
  }));

  expect(newState.notifications.length).toBe(1);
  expect(newState.notifications[0]).toEqual({
    type: DEFAULT_NOTIFICATION_TYPES.error,
    message: 'TEST',
    topic: DEFAULT_NOTIFICATION_TOPICS.global,
    id: 'test-1'
  });

  const nextState = reducer(newState, removeNotification('test-1'));

  expect(nextState.notifications.length).toBe(0);
});

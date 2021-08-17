// Copyright (c) 2021 Uber Technologies, Inc.
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

import React from 'react';
import test from 'tape';
import {mount} from 'enzyme';
import {drainTasksForTesting, succeedTaskWithValues} from 'react-palm/tasks';
import configureStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import {render} from 'react-dom';
import {act} from 'react-dom/test-utils';
import sinon from 'sinon';

import coreReducer from 'reducers/core';
import {keplerGlInit} from 'actions/actions';
import {
  appInjector,
  KeplerGlFactory,
  SidePanelFactory,
  MapContainerFactory,
  BottomWidgetFactory,
  ModalContainerFactory,
  PlotContainerFactory,
  GeocoderPanelFactory
} from 'components';
import NotificationPanelFactory from 'components/notification-panel';
import {TASKS as RequestMapStyleTasks} from 'components/effectful/request-map-style';
import {ActionTypes} from 'actions';
import {DEFAULT_MAP_STYLES, EXPORT_IMAGE_ID} from 'constants';

const KeplerGl = appInjector.get(KeplerGlFactory);
const SidePanel = appInjector.get(SidePanelFactory);
const MapContainer = appInjector.get(MapContainerFactory);
const BottomWidget = appInjector.get(BottomWidgetFactory);
const ModalContainer = appInjector.get(ModalContainerFactory);
const PlotContainer = appInjector.get(PlotContainerFactory);
const GeocoderPanel = appInjector.get(GeocoderPanelFactory);
const NotificationPanel = appInjector.get(NotificationPanelFactory);

const initialCoreState = coreReducer(
  undefined,
  keplerGlInit({mapboxApiAccessToken: 'smoothie-the-cat'})
);

const initialState = {
  keplerGl: {
    map: initialCoreState
  }
};

const mockStore = configureStore();

test('Components -> KeplerGl -> Mount', t => {
  // mount with empty store
  const store = mockStore(initialState);
  let wrapper;

  t.doesNotThrow(() => {
    wrapper = mount(
      <Provider store={store}>
        <KeplerGl
          id="map"
          mapboxApiAccessToken="smoothie-the-cat"
          selector={state => state.keplerGl.map}
          dispatch={store.dispatch}
        />
      </Provider>
    );
  }, 'Should not throw error when mount KeplerGl');

  t.equal(wrapper.find(KeplerGl).length, 1, 'should render KeplerGl');
  t.equal(wrapper.find(SidePanel).length, 1, 'should render SidePanel');
  t.equal(wrapper.find(MapContainer).length, 1, 'should render MapContainer');
  t.equal(wrapper.find(BottomWidget).length, 1, 'should render BottomWidget');
  t.equal(wrapper.find(ModalContainer).length, 1, 'should render ModalContainer');
  t.equal(wrapper.find(PlotContainer).length, 0, 'should not render PlotContainer');
  t.equal(wrapper.find(NotificationPanel).length, 1, 'should render NotificationPanel');
  t.equal(wrapper.find(GeocoderPanel).length, 0, 'should not render GeocoderPanel');

  t.end();
});

test('Components -> KeplerGl -> Mount -> readOnly', t => {
  // mount with readOnly true
  const initialStateReadonly = {
    keplerGl: {
      map: {
        ...initialCoreState,
        uiState: {
          ...initialCoreState.uiState,
          readOnly: true
        }
      }
    }
  };

  const store = mockStore(initialStateReadonly);
  let wrapper;

  t.doesNotThrow(() => {
    wrapper = mount(
      <Provider store={store}>
        <KeplerGl
          id="map"
          mapboxApiAccessToken="smoothie-the-cat"
          selector={state => state.keplerGl.map}
          dispatch={store.dispatch}
        />
      </Provider>
    );
  }, 'Should not throw error when mount KeplerGl');

  t.equal(wrapper.find(KeplerGl).length, 1, 'should render KeplerGl');
  t.equal(wrapper.find(SidePanel).length, 0, 'should not render SidePanel');
  t.equal(wrapper.find(MapContainer).length, 1, 'should render MapContainer');
  t.equal(wrapper.find(BottomWidget).length, 1, 'should render BottomWidget');
  t.equal(wrapper.find(ModalContainer).length, 1, 'should render ModalContainer');
  t.equal(wrapper.find(PlotContainer).length, 0, 'should not render PlotContainer');
  t.equal(wrapper.find(NotificationPanel).length, 1, 'should render NotificationPanel');
  t.equal(wrapper.find(GeocoderPanel).length, 0, 'should not render GeocoderPanel');

  t.end();
});

test('Components -> KeplerGl -> Mount -> Plot', t => {
  // mount with readOnly true
  const initialStatePlots = {
    keplerGl: {
      map: {
        ...initialCoreState,
        uiState: {
          ...initialCoreState.uiState,
          currentModal: EXPORT_IMAGE_ID,
          exportImage: {
            ...initialCoreState.uiState.exportImage,
            exporting: true
          }
        }
      }
    }
  };
  const store = mockStore(initialStatePlots);
  let wrapper;

  t.doesNotThrow(() => {
    wrapper = mount(
      <Provider store={store}>
        <KeplerGl
          id="map"
          mapboxApiAccessToken="smoothie-the-cat"
          selector={state => state.keplerGl.map}
          dispatch={store.dispatch}
        />
      </Provider>
    );
  }, 'Should not throw error when mount KeplerGl');

  t.equal(wrapper.find(KeplerGl).length, 1, 'should render KeplerGl');
  t.equal(wrapper.find(SidePanel).length, 1, 'should render SidePanel');
  t.equal(wrapper.find(MapContainer).length, 2, 'should render 2 MapContainer');
  t.equal(wrapper.find(BottomWidget).length, 1, 'should render BottomWidget');
  t.equal(wrapper.find(ModalContainer).length, 1, 'should render ModalContainer');
  t.equal(wrapper.find(PlotContainer).length, 1, 'should render PlotContainer');
  t.equal(wrapper.find(NotificationPanel).length, 1, 'should render NotificationPanel');
  t.equal(wrapper.find(GeocoderPanel).length, 0, 'should not render GeocoderPanel');

  t.end();
});

test('Components -> KeplerGl -> Mount -> Split Maps', t => {
  // mount with readOnly true
  const initialStateSplitMap = {
    keplerGl: {
      map: {
        ...initialCoreState,
        visState: {
          ...initialCoreState.visState,
          splitMaps: [{layers: {}}, {layers: {}}]
        }
      }
    }
  };

  const store = mockStore(initialStateSplitMap);
  let wrapper;

  t.doesNotThrow(() => {
    wrapper = mount(
      <Provider store={store}>
        <KeplerGl
          id="map"
          mapboxApiAccessToken="smoothie-the-cat"
          selector={state => state.keplerGl.map}
          dispatch={store.dispatch}
        />
      </Provider>
    );
  }, 'Should not throw error when mount KeplerGl');

  t.equal(wrapper.find(KeplerGl).length, 1, 'should render KeplerGl');
  t.equal(wrapper.find(SidePanel).length, 1, 'should render SidePanel');
  t.equal(wrapper.find(MapContainer).length, 2, 'should render 2 MapContainer');
  t.equal(wrapper.find(BottomWidget).length, 1, 'should render BottomWidget');
  t.equal(wrapper.find(ModalContainer).length, 1, 'should render ModalContainer');
  t.equal(wrapper.find(PlotContainer).length, 0, 'should render PlotContainer');
  t.equal(wrapper.find(NotificationPanel).length, 1, 'should render NotificationPanel');
  t.equal(wrapper.find(GeocoderPanel).length, 0, 'should not render GeocoderPanel');

  t.end();
});

test('Components -> KeplerGl -> Mount -> Load default map style task', async t => {
  // setup
  const container = document.createElement('div');
  document.body.appendChild(container);
  const requestMapStylesStub = sinon.stub(RequestMapStyleTasks, 'requestMapStyles').callThrough();
  const loadMapStylesStub = sinon.stub(RequestMapStyleTasks, 'loadMapStyleTask');

  [
    {id: 'dark', style: {layers: [], name: 'dark'}},
    {id: 'light', style: {layers: [], name: 'light'}},
    {id: 'muted', style: {hello: 'world'}},
    {id: 'muted_night', style: {world: 'hello'}},
    {id: 'satellite', style: {satellite: 'yes'}}
  ].forEach((ret, i) => loadMapStylesStub.onCall(i).resolves(ret));

  const stateSelector = state => state.keplerGl.map;

  // mount with empty store
  const store = mockStore(initialState);

  // t.doesNotThrow(async () => {
  await act(async () =>
    render(
      <Provider store={store}>
        <KeplerGl
          id="map"
          mapboxApiAccessToken="smoothie-the-cat"
          selector={stateSelector}
          dispatch={store.dispatch}
        />
      </Provider>,
      container
    )
  );
  // }, 'Should not throw error when mount KeplerGl');

  const actions = store.getActions();
  const expectedActions = [
    {type: ActionTypes.UPDATE_MAP, payload: {width: 800, height: 800}},
    {type: ActionTypes.LOAD_MAP_STYLES, payload: {}}
  ];
  t.deepEqual(
    requestMapStylesStub.firstCall.args[0],
    DEFAULT_MAP_STYLES.reduce((accu, curr) => ({...accu, [curr.id]: curr}), {}),
    'Should call request map styles'
  );
  t.deepEqual(
    actions.slice(0, 2),
    expectedActions,
    'Should mount kepler.gl and dispatch 2 actions to load map styles'
  );

  const resultState1 = coreReducer(initialCoreState, actions[1]);

  const expectedTask = {
    payload: [
      {
        id: 'dark',
        url:
          'https://api.mapbox.com/styles/v1/uberdata/cjoqbbf6l9k302sl96tyvka09?pluginName=Keplergl&access_token=smoothie-the-cat'
      },
      {
        id: 'light',
        url:
          'https://api.mapbox.com/styles/v1/uberdata/cjoqb9j339k1f2sl9t5ic5bn4?pluginName=Keplergl&access_token=smoothie-the-cat'
      },
      {
        id: 'muted',
        url:
          'https://api.mapbox.com/styles/v1/uberdata/cjfyl03kp1tul2smf5v2tbdd4?pluginName=Keplergl&access_token=smoothie-the-cat'
      },
      {
        id: 'muted_night',
        url:
          'https://api.mapbox.com/styles/v1/uberdata/cjfxhlikmaj1b2soyzevnywgs?pluginName=Keplergl&access_token=smoothie-the-cat'
      },
      {
        id: 'satellite',
        url:
          'https://api.mapbox.com/styles/v1/mapbox/satellite-v9?pluginName=Keplergl&access_token=smoothie-the-cat'
      }
    ]
  };

  t.deepEqual(
    loadMapStylesStub.getCalls().map(call => call.args[0]),
    expectedTask.payload,
    'should create task to load map styles'
  );
  t.deepEqual(resultState1, initialCoreState, 'state should be the same');

  const resultState2 = coreReducer(resultState1, store.getActions()[2]);

  const expectedStateMapStyles = {
    dark: {
      ...DEFAULT_MAP_STYLES[0],
      style: {layers: [], name: 'dark'}
    },
    light: {
      ...DEFAULT_MAP_STYLES[1],
      style: {layers: [], name: 'light'}
    },
    muted: {
      ...DEFAULT_MAP_STYLES[2],
      style: {hello: 'world'}
    },
    muted_night: {
      ...DEFAULT_MAP_STYLES[3],
      style: {world: 'hello'}
    },
    satellite: {
      ...DEFAULT_MAP_STYLES[4],
      style: {satellite: 'yes'},
      layerGroups: []
    }
  };

  t.deepEqual(
    resultState2.mapStyle.mapStyles,
    expectedStateMapStyles,
    'should update state with loaded map styles'
  );

  // teardown
  document.body.removeChild(container);
  requestMapStylesStub.restore();
  loadMapStylesStub.restore();

  t.end();
});

test('Components -> KeplerGl -> Mount -> Load custom map style task', async t => {
  // setup
  const container = document.createElement('div');
  document.body.appendChild(container);
  const requestMapStylesStub = sinon.spy(RequestMapStyleTasks, 'requestMapStyles');
  // Intentionally use a promise that never resolves, since we don't care about the task
  // TODO: This isn't great since there are calls still waiting for this promise after
  // this test is torn down.
  let tearDownReject;
  const neverResolvedPromise = new Promise((_, reject) => {
    tearDownReject = reject;
  });
  const loadMapStylesStub = sinon
    .stub(RequestMapStyleTasks, 'loadMapStyleTask')
    .returns(neverResolvedPromise);

  // mount with empty store
  const store = mockStore(initialState);
  // mount without id or a kepler.gl state

  const customStyle1 = {
    id: 'smoothie',
    url: 'mapbox://styles/smoothie/thecat'
  };
  const customStyle2 = {
    id: 'milkshake',
    style: {
      id: 'mm',
      layers: []
    }
  };
  const customStyle3 = {
    id: 'chai',
    style: {
      id: 'chai',
      layers: []
    },
    layerGroups: [
      {
        slug: 'label'
      }
    ]
  };
  // t.doesNotThrow(() => {
  await act(async () =>
    render(
      // mount(
      <Provider store={store}>
        <KeplerGl
          id="map"
          mapboxApiAccessToken="smoothie-the-cat"
          selector={state => state.keplerGl.map}
          dispatch={store.dispatch}
          mapStyles={[customStyle1, customStyle2, customStyle3]}
        />
      </Provider>,
      container
    )
  );
  // );
  // }, 'Should not throw error when mount KeplerGl');

  const actions = store.getActions();
  const expectedActions = [
    {type: ActionTypes.UPDATE_MAP, payload: {width: 800, height: 800}},
    {
      type: ActionTypes.LOAD_MAP_STYLES,
      payload: {
        milkshake: customStyle2,
        chai: customStyle3
      }
    }
  ];
  t.deepEqual(
    requestMapStylesStub.firstCall.args[0],
    DEFAULT_MAP_STYLES.reduce(
      (accu, curr) => ({...accu, [curr.id]: curr, smoothie: customStyle1}),
      {}
    ),
    'Should call request map styles'
  );
  t.deepEqual(
    actions,
    expectedActions,
    'Should mount kepler.gl and dispatch 1 action to load map styles'
  );

  const resultState1 = coreReducer(initialCoreState, actions[1]);

  const expectedMapStyleState1 = {
    ...initialCoreState.mapStyle,
    mapStyles: {
      ...initialCoreState.mapStyle.mapStyles,
      milkshake: {
        id: 'milkshake',
        style: {
          id: 'mm',
          layers: []
        },
        layerGroups: {}
      },
      chai: customStyle3
    }
  };

  t.deepEqual(
    resultState1.mapStyle,
    expectedMapStyleState1,
    'Should load map style into reducer and create layer groups'
  );

  const expectedTask = {
    payload: [
      {
        id: 'smoothie',
        url:
          'https://api.mapbox.com/styles/v1/smoothie/thecat?pluginName=Keplergl&access_token=smoothie-the-cat'
      },
      {
        id: 'dark',
        url:
          'https://api.mapbox.com/styles/v1/uberdata/cjoqbbf6l9k302sl96tyvka09?pluginName=Keplergl&access_token=smoothie-the-cat'
      },
      {
        id: 'light',
        url:
          'https://api.mapbox.com/styles/v1/uberdata/cjoqb9j339k1f2sl9t5ic5bn4?pluginName=Keplergl&access_token=smoothie-the-cat'
      },
      {
        id: 'muted',
        url:
          'https://api.mapbox.com/styles/v1/uberdata/cjfyl03kp1tul2smf5v2tbdd4?pluginName=Keplergl&access_token=smoothie-the-cat'
      },
      {
        id: 'muted_night',
        url:
          'https://api.mapbox.com/styles/v1/uberdata/cjfxhlikmaj1b2soyzevnywgs?pluginName=Keplergl&access_token=smoothie-the-cat'
      },
      {
        id: 'satellite',
        url:
          'https://api.mapbox.com/styles/v1/mapbox/satellite-v9?pluginName=Keplergl&access_token=smoothie-the-cat'
      }
    ]
  };

  t.deepEqual(
    loadMapStylesStub.getCalls().map(call => call.args[0]),
    expectedTask.payload,
    'should create task to load map styles'
  );

  // teardown
  document.body.removeChild(container);
  requestMapStylesStub.restore();
  loadMapStylesStub.restore();
  tearDownReject();
});

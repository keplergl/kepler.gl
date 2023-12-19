// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/* eslint-disable enzyme-deprecation/no-mount */
import React from 'react';
import test from 'tape';
import {mount} from 'enzyme';
import sinon from 'sinon';
import {drainTasksForTesting, succeedTaskWithValues} from 'react-palm/tasks';
import configureStore from 'redux-mock-store';
import {Provider} from 'react-redux';

import {keplerGlReducerCore as coreReducer} from '@kepler.gl/reducers';
import {keplerGlInit, ActionTypes} from '@kepler.gl/actions';
import {
  appInjector,
  KeplerGlFactory,
  SidePanelFactory,
  MapContainerFactory,
  BottomWidgetFactory,
  ModalContainerFactory,
  PlotContainerFactory,
  GeocoderPanelFactory,
  NotificationPanelFactory
} from '@kepler.gl/components';
import {DEFAULT_MAP_STYLES, EXPORT_IMAGE_ID, GEOCODER_DATASET_NAME} from '@kepler.gl/constants';
// mock state
import {StateWithGeocoderDataset} from 'test/helpers/mock-state';

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
  drainTasksForTesting();
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
  drainTasksForTesting();
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
  drainTasksForTesting();
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
  drainTasksForTesting();
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

test('Components -> KeplerGl -> Mount -> Load default map style task', t => {
  // mount with empty store
  drainTasksForTesting();
  const store = mockStore(initialState);

  t.doesNotThrow(() => {
    mount(
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

  const actions = store.getActions();
  const expectedActions = [
    {
      type: ActionTypes.LOAD_MAP_STYLES,
      payload: {
        newStyles: DEFAULT_MAP_STYLES.reduce((accu, curr) => ({...accu, [curr.id]: curr}), {}),
        onSuccess: undefined
      }
    }
  ];
  t.deepEqual(
    actions,
    expectedActions,
    'Should mount kepler.gl and dispatch 1 action to load map styles'
  );

  // const tmpState0 = coreReducer(initialCoreState, actions[0]);
  const tmpState = coreReducer(initialCoreState, actions[0]);
  const [actionTask1, ...more] = drainTasksForTesting();
  t.equal(more.length, 0, 'should dispatch 1 tasks');

  const expectedTask = {
    payload: [
      {id: 'dark-matter', url: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'}
    ]
  };

  t.deepEqual(actionTask1.payload, expectedTask.payload, 'should create task to load map styles');
  t.deepEqual(tmpState.mapStyle.isLoading, {'dark-matter': true}, 'should set mapStyle isLoading');

  const resultState1 = coreReducer(
    tmpState,
    succeedTaskWithValues(actionTask1, [{id: 'dark-matter', style: {layers: [], name: 'dark'}}])
  );

  const expectedStateMapStyles = {
    ...tmpState.mapStyle.mapStyles,
    'dark-matter': {
      ...DEFAULT_MAP_STYLES[1],
      style: {layers: [], name: 'dark'}
    }
  };

  t.deepEqual(
    resultState1.mapStyle.mapStyles,
    expectedStateMapStyles,
    'should update state with loaded map styles'
  );

  t.deepEqual(
    resultState1.mapStyle.isLoading,
    {
      'dark-matter': false
    },
    'should update state isLoading'
  );

  t.end();
});

test('Components -> KeplerGl -> Mount -> Load custom map style task', t => {
  drainTasksForTesting();
  // mount with empty store
  // set initialState to custom styleType
  const initialCoreState1 = {
    ...initialCoreState,
    mapStyle: {
      ...initialCoreState.mapStyle,
      styleType: 'chai'
    }
  };
  const initialState1 = {
    keplerGl: {
      map: initialCoreState1
    }
  };

  const store = mockStore(initialState1);

  //
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
        slug: 'label',
        defaultVisibility: true
      }
    ]
  };
  t.doesNotThrow(() => {
    mount(
      <Provider store={store}>
        <KeplerGl
          id="map"
          mapboxApiAccessToken="smoothie-the-cat"
          selector={state => state.keplerGl.map}
          dispatch={store.dispatch}
          mapStyles={[customStyle1, customStyle2, customStyle3]}
        />
      </Provider>
    );
  }, 'Should not throw error when mount KeplerGl');

  const actions = store.getActions();
  const expectedActions = [
    {
      type: ActionTypes.LOAD_MAP_STYLES,
      payload: {
        newStyles: {
          ...initialCoreState1.mapStyle.mapStyles,
          milkshake: customStyle2,
          chai: customStyle3,
          smoothie: customStyle1
        },
        onSuccess: undefined
      }
    }
  ];
  t.deepEqual(
    actions,
    expectedActions,
    'Should mount kepler.gl and dispatch 1 actions to load map styles'
  );

  const resultState1 = coreReducer(initialCoreState1, actions[0]);

  const expectedMapStyleState1 = {
    ...initialCoreState1.mapStyle,
    mapStyles: {
      ...initialCoreState1.mapStyle.mapStyles,
      milkshake: {
        id: 'milkshake',
        style: {
          id: 'mm',
          layers: []
        },
        layerGroups: []
      },
      chai: customStyle3,
      smoothie: {
        id: 'smoothie',
        url: 'mapbox://styles/smoothie/thecat',
        layerGroups: []
      }
    },
    visibleLayerGroups: {
      label: true
    },
    threeDBuildingColor: [194.6103322548211, 191.81688250953655, 185.2988331038727],
    bottomMapStyle: {id: 'chai', layers: []},
    topMapStyle: null,
    editable: 1
  };

  t.deepEqual(
    resultState1.mapStyle,
    expectedMapStyleState1,
    'Should load map style into reducer and create layer groups'
  );

  Object.keys(resultState1.mapStyle).forEach(key => {
    t.deepEqual(
      resultState1.mapStyle[key],
      expectedMapStyleState1[key],
      `mapStyle[${key}] should be correct`
    );
  });

  // Do not remove this. Necessary for testing flow
  // eslint-disable-next-line no-unused-vars
  const actionTask1 = drainTasksForTesting();

  t.equal(actionTask1.length, 0, 'should not dispatch action to load styles');

  t.end();
});

// Test data has only the 'geocoder_dataset' dataset
// This function will return its name if it finds the dataset
// in other case it will return null
function findGeocoderDatasetName(wrapper) {
  const datasetTitleContainer = wrapper.find('.dataset-name');
  let result;
  try {
    result = datasetTitleContainer.text();
  } catch (e) {
    result = null;
  }
  return result;
}

test('Components -> KeplerGl -> SidePanel -> Geocoder dataset display', t => {
  drainTasksForTesting();

  const toggleSidePanel = sinon.spy();

  // Create custom SidePanel that will accept toggleSidePanel as a spy
  function CustomSidePanelFactory(...deps) {
    const OriginalSidePanel = SidePanelFactory(...deps);
    const CustomSidePanel = props => {
      const customUIStateActions = {
        ...props.uiStateActions,
        toggleSidePanel
      };
      return <OriginalSidePanel {...props} uiStateActions={customUIStateActions} />;
    };
    return CustomSidePanel;
  }
  CustomSidePanelFactory.deps = SidePanelFactory.deps;

  const CustomKeplerGl = appInjector
    .provide(SidePanelFactory, CustomSidePanelFactory)
    .get(KeplerGlFactory);

  // Create initial state based on mocked state with geocoder dataset and use that for mocking the store
  const store = mockStore({
    keplerGl: {
      map: StateWithGeocoderDataset
    }
  });

  let wrapper;

  t.doesNotThrow(() => {
    wrapper = mount(
      <Provider store={store}>
        <CustomKeplerGl
          id="map"
          mapboxApiAccessToken="smoothie-the-cat"
          selector={state => state.keplerGl.map}
          dispatch={store.dispatch}
        />
      </Provider>
    );
  }, 'Should not throw error when mount KeplerGl');

  // Check if we have 4 sidepanel tabs
  t.equal(wrapper.find('.side-panel__tab').length, 4, 'should render 4 panel tabs');

  // click layer tab
  const layerTab = wrapper.find('.side-panel__tab').at(0);
  layerTab.simulate('click');
  t.ok(toggleSidePanel.calledWith('layer'), 'should call toggleSidePanel with layer');
  t.notEqual(
    findGeocoderDatasetName(wrapper),
    GEOCODER_DATASET_NAME,
    `should not be equal to ${GEOCODER_DATASET_NAME}`
  );

  // click filters tab
  const filterTab = wrapper.find('.side-panel__tab').at(1);
  filterTab.simulate('click');
  t.ok(toggleSidePanel.calledWith('filter'), 'should call toggleSidePanel with filter');
  t.notEqual(
    findGeocoderDatasetName(wrapper),
    GEOCODER_DATASET_NAME,
    `should not be equal to ${GEOCODER_DATASET_NAME}`
  );

  // click interaction tab
  const interactionTab = wrapper.find('.side-panel__tab').at(2);
  interactionTab.simulate('click');
  t.ok(toggleSidePanel.calledWith('interaction'), 'should call toggleSidePanel with interaction');
  t.notEqual(
    findGeocoderDatasetName(wrapper),
    GEOCODER_DATASET_NAME,
    `should not be equal to ${GEOCODER_DATASET_NAME}`
  );

  t.end();
});

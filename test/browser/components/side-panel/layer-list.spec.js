// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import cloneDeep from 'es-toolkit/compat/cloneDeep';
import {bindActionCreators, createStore} from 'redux';
import {Provider} from 'react-redux';

import {fireEvent, screen} from '@testing-library/react';
import {dataTestIds} from '@kepler.gl/constants';
import {appInjector, LayerListFactory} from '@kepler.gl/components';
import {
  VisStateActions,
  UIStateActions,
  MapStateActions,
  addDataToMap,
  forwardTo,
  keplerGlInit
} from '@kepler.gl/actions';
import {processCsvData} from '@kepler.gl/processors';
import {
  getLayerGroupFromLayerOrder,
  keplerGlReducer as rootReducer,
  keplerGlReducerCore as keplerGlReducer
} from '@kepler.gl/reducers';

import {renderWithTheme} from '../../../helpers/component-jest-utils';
import testLayerData from '../../../fixtures/test-layer-data';
import {dataId as csvDataId} from '../../../fixtures/test-csv-data';
import {applyActions} from '../../../helpers/mock-state-utils';

// TODO: need to be deleted and imported from raw-states
const InitialState = keplerGlReducer(undefined, keplerGlInit({}));

function mockStateWithMultipleH3Layers() {
  const initialState = cloneDeep(InitialState);
  const prepareState = applyActions(keplerGlReducer, initialState, [
    {
      action: addDataToMap,
      payload: [
        {
          datasets: {
            info: {id: csvDataId},
            data: processCsvData(testLayerData)
          },
          config: {
            version: 'v1',
            config: {
              visState: {
                layers: [
                  {
                    id: 'h3-layer-1',
                    type: 'hexagonId',
                    config: {
                      dataId: csvDataId,
                      label: 'H3 Hexagon 1',
                      color: [255, 153, 31],
                      columns: {hex_id: 'hex_id'},
                      isVisible: true
                    }
                  },
                  {
                    id: 'h3-layer-2',
                    type: 'hexagonId',
                    config: {
                      dataId: csvDataId,
                      label: 'H3 Hexagon 2',
                      color: [255, 153, 31],
                      columns: {hex_id: 'hex_id'},
                      isVisible: true
                    }
                  }
                ]
              }
            }
          }
        }
      ]
    }
  ]);
  return prepareState;
}

const LayerList = appInjector.get(LayerListFactory);

const StateWMultiH3Layers = mockStateWithMultipleH3Layers();

function createInstanceState(instanceId) {
  const state = mockStateWithMultipleH3Layers();
  const [sharedGroupLayer, instanceGroupLayer] = state.visState.layers;

  sharedGroupLayer.config.isVisible = true;
  instanceGroupLayer.config.isVisible = true;
  state.visState.layerOrder = [
    {
      id: 'shared-group',
      label: `${instanceId} shared group`,
      isVisible: true,
      isIncludedInLegend: true,
      layerOrder: [sharedGroupLayer.id]
    },
    {
      id: `${instanceId}-only-group`,
      label: `${instanceId} only group`,
      isVisible: true,
      isIncludedInLegend: true,
      layerOrder: [instanceGroupLayer.id]
    }
  ];

  return state;
}

const defaultProps = {
  datasets: StateWMultiH3Layers.visState.datasets,
  layerClasses: StateWMultiH3Layers.visState.layerClasses,
  layerOrder: StateWMultiH3Layers.visState.layerOrder,
  layers: StateWMultiH3Layers.visState.layers,
  uiStateActions: UIStateActions,
  visStateActions: VisStateActions,
  mapStateActions: MapStateActions
};

const firstMapId = 'first-map';
const secondMapId = 'second-map';

function renderLayerListForInstances({emptySharedGroup = false} = {}) {
  const firstMap = createInstanceState(firstMapId);
  if (emptySharedGroup) {
    firstMap.visState.layerOrder[0].layerOrder = [];
    firstMap.visState.layerOrder.push(firstMap.visState.layers[0].id);
  }
  const store = createStore(rootReducer, {
    [firstMapId]: firstMap,
    [secondMapId]: createInstanceState(secondMapId)
  });
  const firstMapVisState = store.getState()[firstMapId].visState;
  const secondMapVisState = store.getState()[secondMapId].visState;
  const firstMapActions = bindActionCreators(
    VisStateActions,
    forwardTo(firstMapId, store.dispatch)
  );

  const {container} = renderWithTheme(
    <Provider store={store}>
      <LayerList
        {...defaultProps}
        datasets={firstMapVisState.datasets}
        layerClasses={firstMapVisState.layerClasses}
        layerOrder={firstMapVisState.layerOrder}
        layers={firstMapVisState.layers}
        visStateActions={firstMapActions}
        isSortable={false}
      />
    </Provider>
  );

  return {container, store, firstMapVisState, secondMapVisState};
}

// jest.mock('@kepler.gl/actions');

describe('Components -> SidePanel -> LayerPanel -> LayerList', () => {
  it('render sortable list', () => {
    renderWithTheme(<LayerList {...defaultProps} isSortable />);

    expect(screen.getAllByTestId(dataTestIds.sortableLayerItem)).toHaveLength(
      defaultProps.layers.length
    );
    screen
      .getAllByTestId(dataTestIds.layerTitleEditor)
      .forEach((item, index) => expect(item.value).toBe(defaultProps.layers[index].config.label));
    expect(screen.getAllByTestId(dataTestIds.layerPanel)).toHaveLength(defaultProps.layers.length);
  });

  it('render non-sortable list', () => {
    renderWithTheme(<LayerList {...defaultProps} isSortable={false} />);

    // no sortable items
    expect(screen.queryByTestId(dataTestIds.sortableLayerItem)).not.toBeInTheDocument();

    // only static ones
    expect(screen.getAllByTestId(dataTestIds.staticLayerItem)).toHaveLength(
      defaultProps.layers.length
    );
    screen
      .getAllByTestId(dataTestIds.layerTitleEditor)
      .forEach((item, index) => expect(item.value).toBe(defaultProps.layers[index].config.label));
    expect(screen.getAllByTestId(dataTestIds.layerPanel)).toHaveLength(defaultProps.layers.length);
  });

  it('pass null entries as layers', () => {
    const layers = defaultProps.layers;
    layers[0] = null;
    const removeLayer = jest.fn();
    renderWithTheme(
      <LayerList
        {...defaultProps}
        isSortable={false}
        layers={layers}
        visStateActions={{
          ...defaultProps.visStateActions,
          removeLayer
        }}
      />
    );

    expect(screen.getAllByTestId(dataTestIds.layerPanel)).toHaveLength(
      defaultProps.layers.length - 1
    );
    fireEvent.click(screen.getByTestId('layer-options-toggle'));
    const removeLayerButton = document.querySelector('.layer__remove-layer');
    expect(removeLayerButton).not.toBeNull();
    fireEvent.click(removeLayerButton);

    expect(removeLayer).toHaveBeenCalled();
  });

  it('keeps grouped-layer visibility isolated between map instances', () => {
    const {container, store} = renderLayerListForInstances();

    fireEvent.click(container.querySelectorAll('.layer-group__visibility-toggle svg')[0]);

    const firstMapState = store.getState()[firstMapId].visState;
    const secondMapState = store.getState()[secondMapId].visState;
    const firstMapSharedGroup = getLayerGroupFromLayerOrder(
      firstMapState.layerOrder,
      'shared-group'
    );
    const secondMapSharedGroup = getLayerGroupFromLayerOrder(
      secondMapState.layerOrder,
      'shared-group'
    );
    const firstMapOnlyGroup = getLayerGroupFromLayerOrder(
      firstMapState.layerOrder,
      `${firstMapId}-only-group`
    );
    const secondMapOnlyGroup = getLayerGroupFromLayerOrder(
      secondMapState.layerOrder,
      `${secondMapId}-only-group`
    );

    expect(firstMapSharedGroup.isVisible).toBe(false);
    expect(firstMapState.layers[0].config.isVisible).toBe(false);
    expect(firstMapOnlyGroup.isVisible).toBe(true);
    expect(firstMapState.layers[1].config.isVisible).toBe(true);
    expect(secondMapSharedGroup.isVisible).toBe(true);
    expect(secondMapState.layers[0].config.isVisible).toBe(true);
    expect(secondMapOnlyGroup.isVisible).toBe(true);
    expect(secondMapState.layers[1].config.isVisible).toBe(true);
  });

  it('keeps group renaming isolated between map instances', () => {
    const {store, firstMapVisState, secondMapVisState} = renderLayerListForInstances();

    fireEvent.change(screen.getByDisplayValue(`${firstMapId} shared group`), {
      target: {value: 'Renamed group'}
    });

    const firstMapState = store.getState()[firstMapId].visState;
    const secondMapState = store.getState()[secondMapId].visState;

    expect(getLayerGroupFromLayerOrder(firstMapState.layerOrder, 'shared-group').label).toBe(
      'Renamed group'
    );
    expect(firstMapState.layerOrder[1]).toEqual(firstMapVisState.layerOrder[1]);
    expect(firstMapState.layers).toEqual(firstMapVisState.layers);
    expect(getLayerGroupFromLayerOrder(secondMapState.layerOrder, 'shared-group').label).toBe(
      `${secondMapId} shared group`
    );
    expect(secondMapState).toEqual(secondMapVisState);
  });

  it('keeps confirmed group and child-layer deletion isolated between map instances', () => {
    const {container, store, firstMapVisState, secondMapVisState} = renderLayerListForInstances();

    fireEvent.click(container.querySelector('.layer-group__delete svg'));

    expect(screen.getByText('Remove group with layers?')).toBeInTheDocument();
    expect(store.getState()[firstMapId].visState).toEqual(firstMapVisState);
    expect(store.getState()[secondMapId].visState).toEqual(secondMapVisState);

    fireEvent.click(screen.getByRole('button', {name: 'Remove'}));

    const firstMapState = store.getState()[firstMapId].visState;

    expect(firstMapState.layerOrder).toEqual([firstMapVisState.layerOrder[1]]);
    expect(firstMapState.layers.map(layer => layer.id)).toEqual([firstMapVisState.layers[1].id]);
    expect(store.getState()[secondMapId].visState).toEqual(secondMapVisState);
    expect(screen.queryByText('Remove group with layers?')).not.toBeInTheDocument();
  });

  it('keeps immediate empty-group deletion isolated between map instances', () => {
    const {container, store, firstMapVisState, secondMapVisState} = renderLayerListForInstances({
      emptySharedGroup: true
    });

    fireEvent.click(container.querySelector('.layer-group__delete svg'));

    const firstMapState = store.getState()[firstMapId].visState;

    expect(screen.queryByText('Remove group with layers?')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', {name: 'Remove'})).not.toBeInTheDocument();
    expect(firstMapState.layerOrder).toEqual(firstMapVisState.layerOrder.slice(1));
    expect(firstMapState.layers).toEqual(firstMapVisState.layers);
    expect(store.getState()[secondMapId].visState).toEqual(secondMapVisState);
  });
});

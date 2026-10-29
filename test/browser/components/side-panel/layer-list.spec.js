// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import cloneDeep from 'es-toolkit/compat/cloneDeep';
import {bindActionCreators, createStore} from 'redux';
import {Provider} from 'react-redux';
import {ThemeProvider} from 'styled-components';

import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {dataTestIds, DatasetType} from '@kepler.gl/constants';
import {Layer, LayerClasses} from '@kepler.gl/layers';
import {KeplerTable} from '@kepler.gl/table';
import {theme} from '@kepler.gl/styles';
import {messages} from '@kepler.gl/localization';
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
  addLayerUpdater,
  keplerGlReducer as rootReducer,
  keplerGlReducerCore as keplerGlReducer
} from '@kepler.gl/reducers';

import {IntlWrapper, renderWithTheme} from '../../../helpers/component-jest-utils';
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

describe('LayerList dataset-aware layer type picker', () => {
  const specializedTypes = [
    [DatasetType.VECTOR_TILE, 'vectorTile'],
    [DatasetType.RASTER_TILE, 'rasterTile'],
    [DatasetType.WMS_TILE, 'wms'],
    [DatasetType.ZARR, 'zarr'],
    [DatasetType.BITMAP, 'bitmap'],
    [DatasetType.TILE_3D, 'tile3d']
  ];
  const layerName = type => {
    const name = new LayerClasses[type]({dataId: ''}).name;
    return messages.en[`layer.type.${name.toLowerCase()}`] || name;
  };
  const regularNames = Object.keys(LayerClasses)
    .filter(type => !specializedTypes.some(([, layerType]) => layerType === type))
    .map(layerName);

  function createDataset(type, id = type || 'regular') {
    return new KeplerTable({info: {id, type, label: id}, color: [10, 20, 30]}).updateSchema({
      fields: [],
      rows: []
    });
  }

  function pickerOptions() {
    return Array.from(document.querySelectorAll('.layer-type-selector__item')).map(
      item => item.textContent
    );
  }

  function renderPicker(datasets, options = {}) {
    // Exercise the same untyped layer created by the Add Layer action.
    const layer =
      options.layer ||
      addLayerUpdater({...InitialState.visState, datasets}, {}).layers.slice(-1)[0];
    const layerTypeChange = jest.fn();
    const props = {
      ...defaultProps,
      datasets,
      layerClasses: LayerClasses,
      layers: [layer],
      layerOrder: [layer.id],
      isSortable: false,
      visStateActions: {...VisStateActions, layerTypeChange},
      ...options
    };
    const store = createStore(state => state, InitialState);
    const result = render(<LayerList {...props} />, {
      wrapper: ({children}) => (
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <IntlWrapper>{children}</IntlWrapper>
          </ThemeProvider>
        </Provider>
      )
    });
    const selector = result.container.querySelector('.layer-config__type .item-selector');
    fireEvent.keyDown(selector, {key: 'Enter'});
    return {
      ...result,
      layer,
      layerTypeChange,
      selector,
      setDatasets: nextDatasets => result.rerender(<LayerList {...props} datasets={nextDatasets} />)
    };
  }

  it.each(specializedTypes)('offers only %s for Add Layer', (datasetType, layerType) => {
    const dataset = createDataset(datasetType);
    const {layer} = renderPicker({[dataset.id]: dataset});

    expect(layer.type).toBeNull();
    expect(pickerOptions()).toEqual([layerName(layerType)]);
  });

  it.each(specializedTypes)(
    'offers only %s when editing its existing layer',
    (datasetType, layerType) => {
      const dataset = createDataset(datasetType);
      const layer = new LayerClasses[layerType]({dataId: dataset.id, isConfigActive: true});
      const config = cloneDeep(layer.config);
      renderPicker({[dataset.id]: dataset}, {layer});

      expect(pickerOptions()).toEqual([layerName(layerType)]);
      expect(layer.config).toEqual(config);
    }
  );

  it.each([undefined, '', DatasetType.LOCAL, DatasetType.EXTERNALLY_HOSTED, 'custom-source'])(
    'offers all regular types for a %s dataset even without columns or rows',
    type => {
      const dataset = createDataset(type);
      renderPicker({[dataset.id]: dataset});

      expect(pickerOptions()).toEqual(regularNames);
    }
  );

  it.each(['regular', 'specialized'])('uses all datasets with %s selected', selected => {
    const regular = createDataset(DatasetType.LOCAL, 'regular');
    const specialized = specializedTypes.map(([type]) => createDataset(type));
    const datasets = Object.fromEntries([regular, ...specialized].map(ds => [ds.id, ds]));
    const layer = new Layer({
      dataId: selected === 'regular' ? regular.id : specialized[0].id,
      isConfigActive: true
    });
    renderPicker(datasets, {layer});

    expect(pickerOptions()).toEqual(Object.keys(LayerClasses).map(layerName));
  });

  it('offers regular and matching specialized choices for mixed custom datasets', () => {
    const custom = createDataset('custom-source');
    const vector = createDataset(DatasetType.VECTOR_TILE);
    renderPicker({[custom.id]: custom, [vector.id]: vector});

    expect(pickerOptions()).toEqual([...regularNames, layerName('vectorTile')]);
  });

  it('updates the open menu as datasets arrive and are removed', () => {
    const regular = createDataset(DatasetType.LOCAL);
    const vector = createDataset(DatasetType.VECTOR_TILE);
    const bitmap = createDataset(DatasetType.BITMAP);
    const {setDatasets} = renderPicker({});

    expect(pickerOptions()).toEqual(Object.keys(LayerClasses).map(layerName));
    setDatasets({[vector.id]: vector});
    expect(pickerOptions()).toEqual([layerName('vectorTile')]);
    setDatasets({[vector.id]: vector, [bitmap.id]: bitmap});
    expect(pickerOptions()).toEqual([layerName('vectorTile'), layerName('bitmap')]);
    setDatasets({[regular.id]: regular, [vector.id]: vector});
    expect(pickerOptions()).toEqual([...regularNames, layerName('vectorTile')]);
    setDatasets({[regular.id]: regular});
    expect(pickerOptions()).toEqual(regularNames);
    setDatasets({});
    expect(pickerOptions()).toEqual(Object.keys(LayerClasses).map(layerName));
  });

  it('displays an existing incompatible type without offering it in the menu', () => {
    const dataset = createDataset(DatasetType.VECTOR_TILE);
    const layer = new LayerClasses.point({dataId: dataset.id, isConfigActive: true});
    const config = cloneDeep(layer.config);
    const {selector, layerTypeChange} = renderPicker({[dataset.id]: dataset}, {layer});

    expect(selector).toHaveTextContent(layerName('point'));
    expect(pickerOptions()).toEqual([layerName('vectorTile')]);
    expect(layer.config).toEqual(config);
    expect(layerTypeChange).not.toHaveBeenCalled();
  });

  it('preserves a manual bitmap layer while offering regular choices', () => {
    const regular = createDataset(DatasetType.LOCAL);
    const layer = new LayerClasses.bitmap({dataId: '', isConfigActive: true});
    layer.updateLayerVisConfig({opacity: 0.4, boundsWest: -5, boundsEast: 5});
    const config = cloneDeep(layer.config);
    const {selector} = renderPicker({[regular.id]: regular}, {layer});

    expect(selector).toHaveTextContent(layerName('bitmap'));
    expect(pickerOptions()).toEqual(regularNames);
    expect(layer.config).toEqual(config);
  });

  it('preserves custom registrations and overrides without restoring excluded classes', () => {
    class CustomLayer extends LayerClasses.point {
      get name() {
        return 'Custom layer';
      }

      get supportedDatasetTypes() {
        return [DatasetType.BITMAP];
      }
    }
    const vector = createDataset(DatasetType.VECTOR_TILE);
    const {vectorTile: _vectorTile, ...classes} = LayerClasses;
    renderPicker(
      {[vector.id]: vector},
      {layerClasses: {...classes, custom: CustomLayer, point: CustomLayer}}
    );

    expect(pickerOptions()).toEqual(['Custom layer', 'Custom layer']);
  });

  it('dispatches the chosen type from the filtered menu', async () => {
    const vector = createDataset(DatasetType.VECTOR_TILE);
    const {layer, layerTypeChange} = renderPicker({[vector.id]: vector});
    fireEvent.click(document.querySelector('.layer-type-selector__item'));

    await waitFor(() =>
      expect(layerTypeChange).toHaveBeenCalledWith(layer, 'vectorTile', {fitBounds: true})
    );
  });
});

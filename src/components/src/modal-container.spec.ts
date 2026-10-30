// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, screen} from '@testing-library/react';
import {PMTilesSource} from '@loaders.gl/pmtiles';

import {
  ADD_DATA_ID,
  ALL_FIELD_TYPES,
  DatasetType,
  EXPORT_DATA_ID,
  EXPORT_MAP_ID,
  FIELD_COLORS,
  FIELD_TYPE_DISPLAY
} from '@kepler.gl/constants';
import {KeplerTable, parseVectorMetadata} from '@kepler.gl/table';
import {KeplerGlLayers} from '@kepler.gl/layers';
import {
  INITIAL_MAP_STATE,
  INITIAL_VIS_STATE,
  mergeFilters,
  setFilterUpdater
} from '@kepler.gl/reducers';
import KeplerGlSchema, {datasetSchema, visStateSchemaV1} from '@kepler.gl/schemas';
import {getDefaultFilter} from '@kepler.gl/utils';
import {createNewDataEntryMock} from 'test/helpers/table-utils';
import {renderWithTheme} from 'test/helpers/component-jest-utils';

// Break DatasetTag's package-index cycle when testing filter factories directly.
jest.mock('./side-panel/common/dataset-tag', () => () => () => null);

import ModalContainerFactory, {exportDataFromModal, ExportMapModalStyle} from './modal-container';
import ModalDialogFactory from './modals/modal-dialog';
import NewFilterPanelFactory, {
  getSupportedFilterFields
} from './filters/filter-panels/new-filter-panel';
import FieldSelectorFactory, {FieldListItemFactoryFactory} from './common/field-selector';
import FieldTokenFactory from './common/field-token';

describe('tileset filter eligibility', () => {
  const originalObserver = window.IntersectionObserver;
  beforeAll(() => {
    window.IntersectionObserver = jest.fn(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn()
    })) as unknown as typeof IntersectionObserver;
  });
  afterAll(() => {
    window.IntersectionObserver = originalObserver;
  });
  const url = 'https://example.com/features.pmtiles';
  const metadata = {
    tilejson: {
      layers: [
        {
          id: 'features',
          fields: [
            {name: 'category', type: 'utf8', values: ['歯科診療所', '病院', '診療所']},
            {name: 'beds', type: 'int', min: 0, max: 20},
            {name: 'ratio', type: 'float32', min: 0, max: 1},
            {name: 'active', type: 'boolean', values: [true, false]}
          ]
        }
      ]
    }
  };
  const features = [
    {category: '病院', beds: 10, ratio: 0.5, active: true},
    {category: '診療所', beds: 20, ratio: 1, active: true},
    {category: '病院', beds: 0, ratio: 0, active: false}
  ].map((properties, index) => ({
    type: 'Feature',
    geometry: {type: 'Point', coordinates: [index, 0]},
    properties
  }));
  const FieldSelector = FieldSelectorFactory(
    FieldListItemFactoryFactory(FieldTokenFactory(FIELD_TYPE_DISPLAY, FIELD_COLORS))
  );
  const NewFilterPanel = NewFilterPanelFactory(
    (({children}) => children) as any,
    (() => null) as any,
    FieldSelector
  );

  function importTileset(type = DatasetType.VECTOR_TILE) {
    const updateVisData = jest.fn();
    const dependencies = ModalContainerFactory.deps.map(() => () => null) as unknown as Parameters<
      typeof ModalContainerFactory
    >;
    dependencies[3] = (({onTilesetAdded}) =>
      React.createElement(
        'button',
        {
          onClick: () =>
            onTilesetAdded(
              {
                name: 'Features',
                type,
                metadata: {
                  remoteTileFormat: 'pmtiles',
                  tilesetDataUrl: url,
                  tilesetMetadataUrl: url
                }
              },
              parseVectorMetadata(metadata as any)
            )
        },
        'Add tileset'
      )) as any;
    dependencies[9] = (({children}) => children) as any;
    const ModalContainer = ModalContainerFactory(...dependencies);
    const view = renderWithTheme(
      React.createElement(ModalContainer, {
        rootNode: document.body,
        uiState: {currentModal: ADD_DATA_ID},
        visState: {...INITIAL_VIS_STATE, datasets: {}, layers: []},
        visStateActions: {updateVisData, clearStagedLoadedFiles: jest.fn()},
        uiStateActions: {toggleModal: jest.fn()}
      } as any)
    );
    fireEvent.click(screen.getByRole('button', {name: 'Add tileset'}));
    view.unmount();
    const payload = updateVisData.mock.calls[0][0];
    payload.info.id = 'tile-filters';
    return payload;
  }

  function filteredFeatures(state) {
    const layer = state.layers[0];
    const [tileLayer] = layer.renderLayer({
      data: state.layerData[0],
      gpuFilter: state.datasets['tile-filters'].gpuFilter,
      mapState: INITIAL_MAP_STATE,
      animationConfig: {},
      layerCallbacks: {},
      visible: true
    });
    const sublayer = layer.renderSubLayers({
      ...tileLayer.props,
      data: features,
      tile: {index: {z: 2}}
    });
    expect(sublayer.props.data).toBe(features);
    return features.flatMap((feature, index) =>
      sublayer.props.getFilterCategory(feature) === 1 &&
      sublayer.props.getFilterValue(feature).every((value, channel) => {
        const [min, max] = sublayer.props.filterRange[channel];
        return value >= min && value <= max;
      })
        ? [index]
        : []
    );
  }

  test('imports, selects and renders string filters, including after save/reload', async () => {
    const source = jest.spyOn(PMTilesSource, 'createDataSource').mockReturnValue({
      metadata: Promise.resolve(metadata),
      getTileData: async () => features
    } as any);
    try {
      const payload = importTileset();
      const datasets = await createNewDataEntryMock(payload);
      const layer = new KeplerGlLayers.VectorTileLayer({id: 'tiles', dataId: 'tile-filters'});
      let state = {
        ...INITIAL_VIS_STATE,
        schema: KeplerGlSchema,
        datasets,
        layers: [layer],
        layerData: [layer.formatLayerData(datasets, undefined, INITIAL_VIS_STATE.animationConfig)],
        filters: [getDefaultFilter({dataId: ['tile-filters']})]
      };
      const setFilter = (idx, prop, value) => {
        state = setFilterUpdater(state, {idx, prop, value}) as typeof state;
      };
      const view = renderWithTheme(
        React.createElement(NewFilterPanel, {
          datasets,
          allAvailableFields: datasets['tile-filters'].fields,
          filter: state.filters[0],
          idx: 0,
          setFilter,
          setFilterPlot: jest.fn(),
          removeFilter: jest.fn()
        })
      );
      fireEvent.keyDown(screen.getByRole('button'), {key: 'Enter'});
      fireEvent.click(screen.getByText('category'));
      view.unmount();
      expect(state.filters[0].type).toBe('multiSelect');
      expect(state.filters[0].value).toEqual([]);
      expect(state.filters[0].domain).toEqual(['歯科診療所', '病院', '診療所']);
      expect(filteredFeatures(state)).toEqual([0, 1, 2]);
      setFilter(0, 'value', ['病院']);
      expect(filteredFeatures(state)).toEqual([0, 2]);
      setFilter(0, 'value', []);
      expect(filteredFeatures(state)).toEqual([0, 1, 2]);
      expect(state.filters[0].domain).toEqual(['歯科診療所', '病院', '診療所']);
      setFilter(0, 'value', ['病院']);
      expect(filteredFeatures(state)).toEqual([0, 2]);

      const savedDataset = datasetSchema.v1.save(state.datasets['tile-filters']);
      const savedVisState = visStateSchemaV1.save(state).visState;
      const parsedVisState = visStateSchemaV1.load(
        JSON.parse(JSON.stringify(savedVisState))
      ).visState;
      if (!parsedVisState) {
        throw new Error('Failed to load saved vector-tile state');
      }
      const restored = await createNewDataEntryMock(
        datasetSchema.v1.load(JSON.parse(JSON.stringify(savedDataset)))
      );
      const restoredTable = restored['tile-filters'];
      expect(
        getSupportedFilterFields(restoredTable.supportedFilterTypes, restoredTable.fields).map(
          field => field.name
        )
      ).toContain('category');
      state = mergeFilters(
        {...state, datasets: restored, filters: []},
        parsedVisState.filters,
        true
      );
      state = {
        ...state,
        layerData: [
          state.layers[0].formatLayerData(state.datasets, undefined, state.animationConfig)
        ]
      };
      expect(state.filters[0].value).toEqual(['病院']);
      expect(state.filters[0].domain).toEqual(['歯科診療所', '病院', '診療所']);
      expect(filteredFeatures(state)).toEqual([0, 2]);

      // Rebinding through the same reducer preserves the existing numeric/boolean behavior.
      for (const [name, value, expected] of [
        ['beds', [1, 20], [0, 1]],
        ['ratio', [0.25, 0.75], [0]],
        ['active', [1, 1], [0, 1]],
        ['active', [0, 0], [2]]
      ]) {
        setFilter(0, 'name', name);
        setFilter(0, 'value', value);
        expect(state.filters[0].type).toBe('range');
        expect(filteredFeatures(state)).toEqual(expected);
      }
    } finally {
      source.mockRestore();
    }
  });

  test('only expands vector tiles, without enabling unsupported field types', () => {
    const fields = Object.values(ALL_FIELD_TYPES).map(type => ({name: type, type})) as any;
    const vector = importTileset();
    expect(getSupportedFilterFields(vector.supportedFilterTypes, fields).map(f => f.type)).toEqual([
      'boolean',
      'integer',
      'real',
      'string'
    ]);
    const raster = importTileset(DatasetType.RASTER_TILE);
    expect(getSupportedFilterFields(raster.supportedFilterTypes, fields).map(f => f.type)).toEqual([
      'boolean',
      'integer',
      'real'
    ]);
    const local = new KeplerTable({info: {id: 'local'}, color: [0, 0, 0]});
    expect(getSupportedFilterFields(local.supportedFilterTypes, fields)).toBe(fields);
  });
});

function deferred() {
  let resolve!: () => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<void>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return {promise, resolve, reject};
}

describe('exportDataFromModal', () => {
  test('closes the export modal after a successful export', async () => {
    const closeModal = jest.fn();
    await exportDataFromModal({
      exportData: () => Promise.resolve(),
      getCurrentModal: () => EXPORT_DATA_ID,
      closeModal,
      addNotification: jest.fn()
    });
    expect(closeModal).toHaveBeenCalledTimes(1);
  });

  test('does not close a newer modal after export completes', async () => {
    const exportTask = deferred();
    const closeModal = jest.fn();
    let currentModal = EXPORT_DATA_ID;
    const completion = exportDataFromModal({
      exportData: () => exportTask.promise,
      getCurrentModal: () => currentModal,
      closeModal,
      addNotification: jest.fn()
    });

    currentModal = EXPORT_MAP_ID;
    exportTask.resolve();
    await completion;

    expect(closeModal).not.toHaveBeenCalled();
  });

  test('shows an error notification and leaves the modal open when export fails', async () => {
    const exportTask = deferred();
    const closeModal = jest.fn();
    const addNotification = jest.fn();
    const completion = exportDataFromModal({
      exportData: () => exportTask.promise,
      getCurrentModal: () => EXPORT_DATA_ID,
      closeModal,
      addNotification
    });

    exportTask.reject(new Error('Unsupported geometry'));
    await completion;

    expect(closeModal).not.toHaveBeenCalled();
    expect(addNotification).toHaveBeenCalledWith({
      id: 'EXPORT_DATA_ERROR_ID',
      type: 'error',
      topic: 'global',
      message: 'Failed to export data: Unsupported geometry'
    });
  });
});

describe('ExportMapModalStyle', () => {
  test('fits the dialog to its label and input columns', () => {
    const ModalDialog = ModalDialogFactory();
    const {unmount} = renderWithTheme(
      React.createElement(
        ModalDialog,
        {
          isOpen: true,
          footer: false,
          close: false,
          onConfirm: jest.fn(),
          onCancel: jest.fn(),
          cssStyle: ExportMapModalStyle,
          theme: {}
        },
        React.createElement('div', null, 'Export map')
      )
    );
    const wrapper = document.querySelector('.modal--wrapper') as HTMLElement;

    expect(wrapper).not.toBeNull();
    expect(getComputedStyle(wrapper).maxWidth).toBe('728px');

    unmount();
  });
});

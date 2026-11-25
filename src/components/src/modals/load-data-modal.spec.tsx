// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, waitFor} from '@testing-library/react';
import {applyMiddleware, createStore} from 'redux';
import {IntlProvider} from 'react-intl';
import {Provider} from 'react-redux';

import {replaceLoadDataModal} from '../../../../examples/demo-app/src/factories/load-data-modal';

import {appInjector, LoadDataModalFactory, ModalContainerFactory} from '..';
import {clearStagedLoadedFiles, toggleModal, updateVisData} from '@kepler.gl/actions';
import {ADD_DATA_ID} from '@kepler.gl/constants';
import {keplerGlReducerCore} from '@kepler.gl/reducers';
import {taskMiddleware} from '@kepler.gl/tasks';
import type {Datasets} from '@kepler.gl/table';
import {getApplicationConfig, initApplicationConfig} from '@kepler.gl/utils';
import {messages} from '@kepler.gl/localization';
import {renderWithTheme} from 'test/helpers/component-jest-utils';

const LoadDataModal = appInjector.get(LoadDataModalFactory);
const first = '8928308280fffff';
const second = '8928308280bffff';

function renderModal(props?: Partial<React.ComponentProps<typeof LoadDataModal>>) {
  return renderWithTheme(
    <IntlProvider locale="en" messages={messages.en}>
      <LoadDataModal
        onFileUpload={jest.fn()}
        onLoadCloudMap={jest.fn()}
        onTilesetAdded={jest.fn()}
        fileLoading={false}
        fileFormatNames={[]}
        fileExtensions={[]}
        fileLoadingProgress={{}}
        isCloudMapLoading={false}
        loadFiles={{fileLoading: false}}
        {...props}
      />
    </IntlProvider>
  );
}

const [, DemoLoadDataModalFactory] = replaceLoadDataModal();
const DemoLoadDataModal = DemoLoadDataModalFactory(
  ...DemoLoadDataModalFactory.deps.map(factory => appInjector.get(factory))
);
const demoStore = createStore(() => ({demo: {app: {}, keplerGl: {map: {uiState: {}}}}}));

const modalVariants = [
  ['default', LoadDataModal],
  ['demo', DemoLoadDataModal]
] as const;

function renderAddDataDialog(LoadData: typeof LoadDataModal) {
  const store = createStore(keplerGlReducerCore, applyMiddleware(taskMiddleware));
  store.dispatch(toggleModal(ADD_DATA_ID));
  const addData = jest.fn((...args: Parameters<typeof updateVisData>) =>
    store.dispatch(updateVisData(...args))
  );
  const dependencies = ModalContainerFactory.deps.map(() => () => null) as unknown as Parameters<
    typeof ModalContainerFactory
  >;
  dependencies[3] = LoadData;
  // App chrome is not needed to exercise which import method/handler the dialog provides.
  dependencies[9] = (({children}: React.PropsWithChildren) =>
    children) as unknown as (typeof dependencies)[9];
  const ModalContainer = ModalContainerFactory(...dependencies);
  const state = store.getState();
  const view = renderWithTheme(
    <IntlProvider locale="en" messages={messages.en}>
      <Provider store={demoStore}>
        {React.createElement(ModalContainer, {
          ...state,
          rootNode: document.body,
          visStateActions: {
            updateVisData: addData,
            clearStagedLoadedFiles: () => store.dispatch(clearStagedLoadedFiles())
          },
          uiStateActions: {toggleModal: id => store.dispatch(toggleModal(id))}
        } as React.ComponentProps<typeof ModalContainer>)}
      </Provider>
    </IntlProvider>
  );
  return {store, addData, ...view};
}

test.each(modalVariants)('%s Add Data validates the default Paste tab', async (_, LoadData) => {
  const {store, addData, getByRole, getByText, queryByRole} = renderAddDataDialog(LoadData);
  const tilesetTab = getByText('Tileset').closest('.load-data-modal__tab__item');
  const pasteTab = getByText('Paste').closest('.load-data-modal__tab__item');
  expect(tilesetTab?.nextElementSibling).toBe(pasteTab);
  fireEvent.click(getByText('Paste'));

  const input = getByRole('textbox', {name: 'Paste data'});
  const add = getByRole('button', {name: 'Add Data'});
  expect(add).toBeDisabled();

  // One malformed ID and one hex-shaped value that is not an H3 cell.
  fireEvent.change(input, {target: {value: `${first}, not-a-cell, fffffffffffffff`}});
  expect(getByRole('status')).toHaveTextContent('2 invalid H3 cell IDs');
  expect(getByRole('status')).toHaveTextContent('not-a-cell, fffffffffffffff');
  expect(add).toBeDisabled();
  fireEvent.submit(input.closest('form')!);
  expect(addData).not.toHaveBeenCalled();

  fireEvent.change(input, {target: {value: ' '.repeat(250_001)}});
  expect(getByRole('status')).toHaveTextContent('250,000');
  expect(add).toBeDisabled();

  fireEvent.change(input, {target: {value: `${first.toUpperCase()}, ${second}\r\n${first}`}});
  expect(queryByRole('status')).not.toBeInTheDocument();
  fireEvent.click(add);
  expect(addData).toHaveBeenCalledTimes(1);
  expect(store.getState().uiState.currentModal).toBeNull();
  await waitFor(() =>
    expect(store.getState().visState.layers).toEqual([
      expect.objectContaining({
        type: 'hexagonId',
        config: expect.objectContaining({
          columns: {hex_id: expect.objectContaining({value: 'hex_id', fieldIdx: 0})}
        })
      })
    ])
  );
  expect(store.getState().visState.layerData[0].data).toEqual([
    expect.objectContaining({id: first}),
    expect.objectContaining({id: second})
  ]);
});

test.each(modalVariants)(
  '%s Add Data imports CSV and GeoJSON using their existing processors',
  async (_, LoadData) => {
    const cases = [
      {
        input: 'longitude,latitude,name\n-122.42,37.77,"A, B"\n',
        rejected: 'longitude,,name\n-122.42,37.77,x',
        error: 'Enter CSV with column headers',
        label: 'Pasted CSV',
        layer: 'point',
        field: 'name',
        value: 'A, B'
      },
      {
        input: JSON.stringify({
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {type: 'Point', coordinates: [-122.42, 37.77]},
              properties: {name: 'Test place'}
            }
          ]
        }),
        rejected: '{"type":"FeatureCollection","features":[]}',
        error: 'Enter valid GeoJSON',
        label: 'Pasted GeoJSON',
        layer: 'geojson',
        field: 'name',
        value: 'Test place'
      }
    ];
    for (const item of cases) {
      const result = renderAddDataDialog(LoadData);
      fireEvent.click(result.getByText('Paste'));
      expect(
        result.getByText(/Supported formats: GeoJSON, CSV with headers, and H3/)
      ).toBeInTheDocument();
      const input = result.getByRole('textbox', {name: 'Paste data'});
      const add = result.getByRole('button', {name: 'Add Data'});
      fireEvent.change(input, {target: {value: item.rejected}});
      fireEvent.click(add);
      expect(result.getByRole('status')).toHaveTextContent(item.error);
      expect(result.addData).not.toHaveBeenCalled();
      fireEvent.change(input, {target: {value: item.input}});
      fireEvent.click(add);
      await waitFor(() => {
        const state = result.store.getState();
        const [dataset] = Object.values(state.visState.datasets as Datasets);
        expect(dataset.label).toBe(item.label);
        expect(
          dataset.dataContainer.valueAt(
            0,
            dataset.fields.findIndex(field => field.name === item.field)
          )
        ).toBe(item.value);
        expect(state.visState.layers.some(layer => layer.type === item.layer)).toBe(true);
      });
      result.unmount();
    }
  }
);

test.each(modalVariants)(
  '%s Add Data can explicitly hide or enable Paste without affecting file imports',
  (_, LoadData) => {
    const {enablePasteData} = getApplicationConfig();
    try {
      initApplicationConfig({enablePasteData: false});
      const disabled = renderAddDataDialog(LoadData);
      expect(disabled.queryByText('Paste')).not.toBeInTheDocument();
      expect(disabled.queryByRole('textbox', {name: 'Paste data'})).not.toBeInTheDocument();
      expect(disabled.getByText('Load Files')).toBeInTheDocument();
      expect(disabled.container.querySelector('.file-uploader')).toBeInTheDocument();
      expect(disabled.addData).not.toHaveBeenCalled();
      disabled.unmount();

      initApplicationConfig({enablePasteData: true});
      const enabled = renderAddDataDialog(LoadData);
      fireEvent.click(enabled.getByText('Paste'));
      expect(enabled.getByRole('textbox', {name: 'Paste data'})).toBeInTheDocument();
    } finally {
      initApplicationConfig({enablePasteData});
    }
  }
);

test('Paste is not offered when replacing another dataset or when no paste handler is provided', () => {
  const replacement = renderModal({replaceDatasetId: 'existing', onAddPastedData: jest.fn()});
  expect(replacement.queryByText('Paste')).not.toBeInTheDocument();
  replacement.unmount();

  expect(renderModal().queryByText('Paste')).not.toBeInTheDocument();
});

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

test.each([
  ['default', LoadDataModal],
  ['demo', DemoLoadDataModal]
])('%s Add Data validates the Paste list before adding an H3 layer', async (_, LoadData) => {
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
  const {getByRole, getByText, queryByRole} = renderWithTheme(
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
  fireEvent.click(getByText('Paste'));

  const input = getByRole('textbox', {name: 'H3 cell IDs'});
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

test('Paste H3 is not offered when replacing another dataset or when the H3 layer is unavailable', () => {
  const replacement = renderModal({replaceDatasetId: 'existing', onAddH3: jest.fn()});
  expect(replacement.queryByText('Paste')).not.toBeInTheDocument();
  replacement.unmount();

  expect(renderModal().queryByText('Paste')).not.toBeInTheDocument();
});

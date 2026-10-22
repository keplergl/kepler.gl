// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';

import {EXPORT_DATA_ID, EXPORT_MAP_ID} from '@kepler.gl/constants';
import {renderWithTheme} from 'test/helpers/component-jest-utils';

import {exportDataFromModal, ExportMapModalStyle} from './modal-container';
import ModalDialogFactory from './modals/modal-dialog';

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

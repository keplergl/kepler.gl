// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, render} from '@testing-library/react';
import {IntlProvider} from 'react-intl';
import {ThemeProvider} from 'styled-components';
import {DatasetType} from '@kepler.gl/constants';
import {messages} from '@kepler.gl/localization';
import {theme} from '@kepler.gl/styles';
import {createDataContainer} from '@kepler.gl/utils';
import DatasetInfoFactory, {DatasetInfoProps} from './dataset-info';

const DatasetInfo = DatasetInfoFactory();
const dataset: DatasetInfoProps['dataset'] = {
  id: 'remote',
  type: DatasetType.EXTERNALLY_HOSTED,
  dataContainer: createDataContainer([])
};

function setup(overrides: Partial<DatasetInfoProps> = {}) {
  const updateDatasetProps = jest.fn();
  const refreshDataset = jest.fn();
  const onClick = jest.fn();
  const props = {
    dataset,
    showRefreshSettings: true,
    updateDatasetProps,
    refreshDataset,
    ...overrides
  };
  const view = render(<DatasetInfo {...props} />, {
    wrapper: ({children}) => (
      <ThemeProvider theme={theme}>
        <IntlProvider locale="en" messages={messages.en}>
          <div onClick={onClick}>{children}</div>
        </IntlProvider>
      </ThemeProvider>
    )
  });
  return {
    ...view,
    updateDatasetProps,
    refreshDataset,
    onClick,
    rerenderInfo: (next: Partial<DatasetInfoProps>) =>
      view.rerender(<DatasetInfo {...props} {...next} />)
  };
}

describe('DatasetInfo remote refresh controls', () => {
  test('commits a preset and allows turning automatic refresh off', () => {
    const view = setup();
    const select = view.getByRole('combobox');
    fireEvent.change(select, {target: {value: '60000'}});
    expect(view.updateDatasetProps).toHaveBeenLastCalledWith('remote', {
      metadata: {refreshIntervalMs: 60000}
    });
    view.rerenderInfo({dataset: {...dataset, metadata: {refreshIntervalMs: 60000}}});
    expect(select).toHaveValue('60000');
    fireEvent.change(select, {target: {value: '0'}});
    expect(view.updateDatasetProps).toHaveBeenLastCalledWith('remote', {
      metadata: {refreshIntervalMs: 0}
    });
    expect(view.updateDatasetProps).toHaveBeenCalledTimes(2);
  });

  test('starts custom refresh from Off and commits fractional seconds on blur', () => {
    const view = setup();
    fireEvent.change(view.getByRole('combobox'), {target: {value: 'custom'}});
    expect(view.updateDatasetProps).toHaveBeenCalledWith('remote', {
      metadata: {refreshIntervalMs: 30000}
    });
    const input = view.getByRole('spinbutton');
    expect(input).toHaveValue(30);
    fireEvent.change(input, {target: {value: '1.25'}});
    expect(view.updateDatasetProps).toHaveBeenCalledTimes(1);
    fireEvent.blur(input);
    expect(view.updateDatasetProps).toHaveBeenLastCalledWith('remote', {
      metadata: {refreshIntervalMs: 1250}
    });
  });

  test('switching a preset to custom keeps its interval until edited; Enter commits', () => {
    const view = setup({dataset: {...dataset, metadata: {refreshIntervalMs: 10000}}});
    fireEvent.change(view.getByRole('combobox'), {target: {value: 'custom'}});
    const input = view.getByRole('spinbutton');
    expect(input).toHaveValue(10);
    fireEvent.blur(input);
    expect(view.updateDatasetProps).not.toHaveBeenCalled();
    fireEvent.change(input, {target: {value: '0.05'}});
    fireEvent.keyDown(input, {key: 'Enter'});
    expect(view.updateDatasetProps).toHaveBeenCalledWith('remote', {
      metadata: {refreshIntervalMs: 100}
    });
    expect(input).toHaveValue(0.1);
  });

  test.each(['', '0', '-2'])(
    'rejects invalid custom seconds %j and restores the saved interval',
    value => {
      const view = setup({dataset: {...dataset, metadata: {refreshIntervalMs: 2500}}});
      const input = view.getByRole('spinbutton');
      fireEvent.change(input, {target: {value}});
      fireEvent.blur(input);
      expect(input).toHaveValue(2.5);
      expect(view.updateDatasetProps).not.toHaveBeenCalled();
    }
  );

  test('synchronizes external interval changes and discards unsaved text on dataset switch', () => {
    const view = setup({dataset: {...dataset, metadata: {refreshIntervalMs: 2500}}});
    fireEvent.change(view.getByRole('spinbutton'), {target: {value: '8'}});
    view.rerenderInfo({dataset: {...dataset, id: 'other', metadata: {refreshIntervalMs: 2500}}});
    expect(view.getByRole('spinbutton')).toHaveValue(2.5);
    fireEvent.change(view.getByRole('spinbutton'), {target: {value: '4'}});
    fireEvent.blur(view.getByRole('spinbutton'));
    expect(view.updateDatasetProps).toHaveBeenCalledWith('other', {
      metadata: {refreshIntervalMs: 4000}
    });
    view.rerenderInfo({dataset: {...dataset, id: 'other', metadata: {refreshIntervalMs: 15000}}});
    expect(view.getByRole('combobox')).toHaveValue('15000');
    expect(view.queryByRole('spinbutton')).toBeNull();
  });

  test('refreshes the current dataset without selecting its parent and blocks refresh while loading', () => {
    const view = setup();
    fireEvent.click(view.getByRole('button'));
    expect(view.refreshDataset).toHaveBeenCalledWith('remote');
    expect(view.onClick).not.toHaveBeenCalled();
    view.rerenderInfo({
      dataset: {...dataset, metadata: {refreshStatus: 'loading', refreshProgress: 42}}
    });
    expect(view.getByRole('button')).toBeDisabled();
    expect(view.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '42');
    fireEvent.click(view.getByRole('button'));
    expect(view.refreshDataset).toHaveBeenCalledTimes(1);
    view.rerenderInfo({dataset: {...dataset, id: 'other', metadata: {refreshStatus: 'error'}}});
    expect(view.queryByRole('progressbar')).toBeNull();
    fireEvent.click(view.getByRole('button'));
    expect(view.refreshDataset).toHaveBeenLastCalledWith('other');
  });

  test.each([
    {showRefreshSettings: false},
    {dataset: {...dataset, type: DatasetType.VECTOR_TILE}},
    {refreshDataset: undefined, updateDatasetProps: undefined}
  ])('hides unavailable refresh controls: %j', overrides => {
    const view = setup(overrides);
    expect(view.queryByRole('button')).toBeNull();
    expect(view.queryByRole('combobox')).toBeNull();
  });

  test('allows manual-only and interval-only integrations', () => {
    const view = setup({updateDatasetProps: undefined});
    expect(view.getByRole('button')).toBeEnabled();
    expect(view.queryByRole('combobox')).toBeNull();
    view.rerenderInfo({refreshDataset: undefined, updateDatasetProps: view.updateDatasetProps});
    expect(view.queryByRole('button')).toBeNull();
    expect(view.getByRole('combobox')).toBeEnabled();
  });
});

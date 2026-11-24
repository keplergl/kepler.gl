// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState} from 'react';
import {fireEvent, screen} from '@testing-library/react';

import {IntlWrapper, renderWithTheme} from 'test/helpers/component-jest-utils';
import DatasetTagFactory from './dataset-tag';
import DatasetTitleFactory from './dataset-title';

const DatasetTitle = DatasetTitleFactory(DatasetTagFactory());

test('renames a dataset from its menu without changing its ID or opening the table', () => {
  const renameDataset = jest.fn();
  const showDatasetTable = jest.fn();

  function Dataset({allowRename = true}: {allowRename?: boolean}) {
    const [label, setLabel] = useState('Original cities');
    return (
      <DatasetTitle
        dataset={{id: 'cities', color: [0, 0, 0], label}}
        showDeleteDataset={false}
        showDatasetTable={showDatasetTable}
        updateTableColor={jest.fn()}
        renameDataset={
          allowRename
            ? (id, name) => {
                renameDataset(id, name);
                setLabel(name);
              }
            : undefined
        }
      />
    );
  }

  function View({allowRename}: {allowRename?: boolean}) {
    return (
      <IntlWrapper>
        <Dataset allowRename={allowRename} />
      </IntlWrapper>
    );
  }

  const {rerender} = renderWithTheme(<View />);
  const toggle = () => screen.getByRole('button', {name: 'More settings'});
  const edit = () => {
    toggle().focus();
    fireEvent.click(toggle());
    fireEvent.click(screen.getByRole('button', {name: 'Rename'}));
    const input = screen.getByRole('textbox', {name: 'Rename dataset'});
    expect(input).toHaveFocus();
    return input;
  };

  const cancel = edit();
  expect(cancel).toHaveValue('Original cities');
  fireEvent.change(cancel, {target: {value: 'Discard this'}});
  fireEvent.keyDown(cancel, {key: 'Escape'});
  expect(toggle()).toHaveFocus();
  expect(renameDataset).not.toHaveBeenCalled();

  const blank = edit();
  fireEvent.change(blank, {target: {value: '   '}});
  fireEvent.blur(blank);
  expect(renameDataset).not.toHaveBeenCalled();

  const save = edit();
  fireEvent.change(save, {target: {value: '  Cities  '}});
  fireEvent.keyDown(save, {key: 'Enter'});
  expect(renameDataset).toHaveBeenCalledTimes(1);
  expect(renameDataset).toHaveBeenCalledWith('cities', 'Cities');
  expect(screen.getByText('Cities')).toBeInTheDocument();
  expect(showDatasetTable).not.toHaveBeenCalled();

  rerender(<View allowRename={false} />);
  expect(screen.queryByRole('button', {name: 'More settings'})).not.toBeInTheDocument();
});

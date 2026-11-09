// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent} from '@testing-library/react';
import {IntlWrapper, renderWithTheme} from 'test/helpers/component-jest-utils';
import DatasetTitleFactory, {DatasetTitleProps} from './dataset-title';
import DatasetTagFactory from './dataset-tag';

const DatasetTitle = DatasetTitleFactory(DatasetTagFactory());

test('table-only CRS warning explains the map restriction and keeps table inspection available', () => {
  const message =
    'Geocentric coordinates cannot be converted. Inspect the table or reimport WGS84 coordinates to display on the map.';
  const props: DatasetTitleProps = {
    dataset: {
      id: 'geocentric',
      label: 'Survey',
      color: [1, 2, 3],
      metadata: {geojsonCrsWarning: message}
    },
    showDeleteDataset: false,
    updateTableColor: jest.fn(),
    showDatasetTable: jest.fn()
  };
  const {getByRole, getByText, unmount} = renderWithTheme(
    <IntlWrapper>
      <DatasetTitle {...props} />
    </IntlWrapper>
  );
  const warning = getByRole('img', {name: message});
  expect(warning.getAttribute('title')).toBe(message);
  warning.focus();
  expect(document.activeElement).toBe(warning);
  fireEvent.click(getByText('Survey'));
  expect(props.showDatasetTable).toHaveBeenCalledWith('geocentric');
  unmount();
  const normal = renderWithTheme(
    <IntlWrapper>
      <DatasetTitle {...props} dataset={{...props.dataset, metadata: {}}} />
    </IntlWrapper>
  );
  expect(normal.queryByRole('img', {name: message})).toBeNull();
});

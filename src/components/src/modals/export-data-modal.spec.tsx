// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent} from '@testing-library/react';

import {EXPORT_DATA_TYPE, EXPORT_DATA_TYPE_OPTIONS} from '@kepler.gl/constants';
import {Datasets} from '@kepler.gl/table';
import {renderWithTheme} from 'test/helpers/component-jest-utils';

import ExportDataModalFactory from './export-data-modal';

const ExportDataModal = ExportDataModalFactory();

const datasets = {
  trips: {
    label: 'Trips',
    dataContainer: {numRows: () => 2},
    filteredIdxCPU: [0]
  }
};

describe('ExportDataModal', () => {
  test('data type is a dropdown that defaults to csv', () => {
    const onChangeExportDataType = jest.fn();
    const {container} = renderWithTheme(
      <ExportDataModal
        datasets={datasets as unknown as Datasets}
        selectedDataset="trips"
        dataType={EXPORT_DATA_TYPE.CSV}
        filtered={false}
        applyCPUFilter={jest.fn()}
        onChangeExportSelectedDataset={jest.fn()}
        onChangeExportDataType={onChangeExportDataType}
        onChangeExportFiltered={jest.fn()}
      />
    );

    const dataType = container.querySelector('select.data-type-select') as HTMLSelectElement;
    expect(dataType).not.toBeNull();
    expect(dataType.value).toBe(EXPORT_DATA_TYPE.CSV);
    expect(Array.from(dataType.options).map(option => option.text)).toEqual(
      EXPORT_DATA_TYPE_OPTIONS.map(option => option.label)
    );
    expect(dataType.parentElement?.children).toHaveLength(1);

    fireEvent.change(dataType, {target: {value: EXPORT_DATA_TYPE.GEOJSON}});
    expect(onChangeExportDataType).toHaveBeenCalledWith(EXPORT_DATA_TYPE.GEOJSON);
  });
});

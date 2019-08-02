// Copyright (c) 2019 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React from 'react';
import test from 'tape';
import {mount} from 'enzyme';
import {mountWithTheme} from 'test/helpers/component-utils';

import DataTableModalFactory, {DatasetTabs, DatasetModalTab} from
  'components/modals/data-table-modal';
import DataGridFactory, {FieldHeaderFactory, CellFactory} from 'components/common/datagrid';

const FieldHeader = FieldHeaderFactory();
const Cell = CellFactory();
const DataGrid = DataGridFactory(FieldHeader, Cell);
const DataTableModal = DataTableModalFactory(DataGrid);
import {testFields, testAllData} from 'test/fixtures/test-csv-data';

// This makes sure react-virtualized renders the full grid
const WIDTH = 1400;
const HEIGHT = 800;
const rows = 10;

/* eslint-disable max-statements */
test('Components -> DataTableModal.render', t => {
  t.doesNotThrow(() => {
    mountWithTheme(
      <DataTableModal
        width={WIDTH}
        height={HEIGHT}
      />
    );
  }, 'Show not fail without data');

  const wrapper = mountWithTheme(
    <DataTableModal
      width={WIDTH}
      height={HEIGHT}
      datasets={{
        smoothie: {
          id: 'smoothie',
          allData: testAllData,
          fields: testFields,
          color: [113, 113, 113],
          data: testAllData.slice(0, rows)
        }
      }}
      dataId="smoothie"
    />
  );

  t.equal(wrapper.find(DataTableModal).length, 1, 'should render DataTableModal data');
  t.equal(wrapper.find(DatasetTabs).length, 1, 'should render DatasetTabs');
  t.equal(wrapper.find(DatasetModalTab).length, 1, 'should render 1 dataset-modal-catalog');
  t.equal(wrapper.find('.header-cell').length, testFields.length, `should render ${testFields.length} headers`);
  t.equal(wrapper.find('.cell').length, testFields.length * rows, `should render ${testFields.length * rows} cells`);
  t.equal(wrapper.find('.cell.boolean').length, 10, 'should render 10 cells');

  const expectedRows = {
    0: [
      '2016-09-17 00:09:55',
      '29.9900937',
      '31.2590542',
      'driver_analytics',
      '1472688000000',
      'false',
      '1',
      '2016-09-23T00:00:00.000Z',
      '2016-10-01 09:41:39+00:00',
      '2016-10-01 09:41:39+00:00',
      '2016-09-23'
    ],
    2: [
      '2016-09-17 00:11:56',
      '29.9907261',
      '31.2312742',
      'driver_analytics',
      '1472688000000',
      'false',
      '3',
      '2016-09-23T00:00:00.000Z',
      '',
      '',
      '2016-09-23'
    ]
  };

  Object.entries(expectedRows).forEach(keyAndRow => {
    const [index, expectedRow] = keyAndRow;

    const cells = wrapper.find(`.row-${index}`);
    t.equal(cells.length, 11, 'should render 11 cells');

    for (let c = 0; c < cells.length; c++) {
      const cellText = cells.at(c).find('span').text();
      t.equal(cellText, expectedRow[c], `should render cell ${expectedRow[c]} correctly`);
    }
  });

  t.end();
});
/* eslint-enable max-statements */

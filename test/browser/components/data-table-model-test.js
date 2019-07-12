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

import DataTableModalFactory, {DatasetTabs, DatasetModalTab} from
  'components/modals/data-table-modal';
import ReactDataGrid from 'react-data-grid/dist/react-data-grid.min';

const DataTableModal = DataTableModalFactory();
import {testFields, testAllData} from 'test/fixtures/test-csv-data';

/* eslint-disable max-statements */
test('Components -> DataTableModal.render', t => {

  t.doesNotThrow(() => {
    mount(
      <DataTableModal
        width={400}
        height={400}
      />
    );
  }, 'Show not fail without data');

  const wrapper = mount(
    <DataTableModal
      width={800}
      height={400}
      datasets={{
        smoothie: {
          id: 'smoothie',
          allData: testAllData,
          fields: testFields,
          color: [113, 113, 113],
          data: testAllData.slice(0, 10)
        }
      }}
      dataId="smoothie"
    />
  );

  t.equal(wrapper.find(DataTableModal).length, 1, 'should render DataTableModal data');
  t.equal(wrapper.find(ReactDataGrid).length, 1, 'should render ReactDataGrid data');
  t.equal(wrapper.find(DatasetTabs).length, 1, 'should render DatasetTabs');
  t.equal(wrapper.find(DatasetModalTab).length, 1, 'should render 1 dataset-modal-catalog');
  t.equal(wrapper.find('.react-grid-Row').length, 10, 'should render 10 rows');

  const expectedRow0 = [
    '2016-09-17 00:09:55',
    '29.9900937',
    '31.2590542',
    'driver_analytics_0',
    '1472688000000',
    'false',
    '1',
    '2016-09-23T00:00:00.000Z',
    '2016-10-01 09:41:39+00:00',
    '2016-10-01 09:41:39+00:00',
    '2016-09-23'
  ];

  const expectedRow2 = [
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
  ];
  const row0 = wrapper.find('.react-grid-Row').at(0);
  const row2 = wrapper.find('.react-grid-Row').at(2);

  const cells = row0.find('.react-grid-Cell');
  t.equal(cells.length, 11, 'should render 11 cells');

  for (let c = 0; c < cells.length; c++) {
    const cell = row0.find('.react-grid-Cell').at(c).find('span');
    const cellText = cell.length > 1 ? cell.at(1).text() : cell.text();

    t.equal(cellText, expectedRow0[c], `should render cell ${expectedRow0[c]} correctly`);
  }

  const cells2 = row2.find('.react-grid-Cell');
  t.equal(cells2.length, 11, 'should render 11 cells');

  for (let c = 0; c < cells2.length; c++) {
    const cell = row2.find('.react-grid-Cell').at(c).find('span');
    const cellText = cell.length > 1 ? cell.at(1).text() : cell.text();

    t.equal(cellText, expectedRow2[c], `should render cell ${expectedRow2[c]} correctly`);
  }

  t.end();
});
/* eslint-enable max-statements */

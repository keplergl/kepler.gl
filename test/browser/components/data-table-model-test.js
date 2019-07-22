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

import Autosizer from 'react-virtualized-auto-sizer';

import DataTableModalFactory, {DatasetTabs, DatasetModalTab} from
  'components/modals/data-table-modal';

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
  t.equal(wrapper.find(Autosizer).length, 1, 'should render Autosizer');
  t.equal(wrapper.find(DatasetTabs).length, 1, 'should render DatasetTabs');
  t.equal(wrapper.find(DatasetModalTab).length, 1, 'should render 1 dataset-modal-catalog');

  t.end();
});
/* eslint-enable max-statements */

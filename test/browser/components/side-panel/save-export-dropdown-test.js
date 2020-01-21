// Copyright (c) 2020 Uber Technologies, Inc.
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
import {shallow} from 'enzyme';
import sinon from 'sinon';
import {
  ExportImageFactory,
  ExportDataFactory,
  ExportMapFactory,
  SaveMapFactory,
  SaveExportDropdownFactory
} from 'components/side-panel/panel-header';

test('SaveExportDropdown', t => {

  const ExportImage = ExportImageFactory();
  const ExportData = ExportDataFactory();
  const ExportMap = ExportMapFactory();
  const SaveMap = SaveMapFactory();

  const SaveExportDropdown = SaveExportDropdownFactory(
    ExportImage,
    ExportData,
    ExportMap,
    SaveMap
  );

  const onExportImage = sinon.spy();
  const onExportData = sinon.spy();
  const onExportConfig = sinon.spy();
  const onExportMap = sinon.spy();
  const onSaveMap = sinon.spy();
  const onClose = sinon.spy();

  const $ = shallow(
    <SaveExportDropdown
      onExportImage={onExportImage}
      onExportData={onExportData}
      onExportConfig={onExportConfig}
      onExportMap={onExportMap}
      onSaveMap={onSaveMap}
      show={true}
      onClose={onClose}
    />
  );

  t.equal(
    $.find('ExportImage').length,
    1,
    'We should display 1 ExportImage'
  );

  t.equal(
    $.find('ExportData').length,
    1,
    'We should display 1 ExportData'
  );

  t.equal(
    $.find('ExportMap').length,
    1,
    'We should display 1 ExportMap'
  );

  t.equal(
    $.find('SaveMap').length,
    1,
    'We should display 1 SaveMap'
  );

  $.find('ExportImage').simulate('click');
  t.equal(
    onExportImage.called,
    true,
    'Should have called export image callback'
  );

  $.find('ExportData').simulate('click');
  t.equal(
    onExportData.called,
    true,
    'Should have called export data callback'
  );

  $.find('ExportMap').simulate('click');
  t.equal(
    onExportMap.called,
    true,
    'Should have called export map callback'
  );

  $.find('SaveMap').simulate('click');
  t.equal(
    onSaveMap.called,
    true,
    'Should have called save map callback'
  );

  t.end();
});


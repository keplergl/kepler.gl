// Copyright (c) 2021 Uber Technologies, Inc.
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
import sinon from 'sinon';
import {
  SaveExportDropdownFactory,
  PanelHeaderDropdownFactory
} from 'components/side-panel/panel-header';
import ToolbarItem from 'components/common/toolbar-item';
import {IntlWrapper} from 'test/helpers/component-utils';

test('SaveExportDropdown', t => {
  const PanelHeaderDropdown = PanelHeaderDropdownFactory();
  const SaveExportDropdown = SaveExportDropdownFactory(PanelHeaderDropdown);

  const onExportImage = sinon.spy();
  const onExportData = sinon.spy();
  const onExportConfig = sinon.spy();
  const onExportMap = sinon.spy();
  const onSaveMap = sinon.spy();
  const onClose = sinon.spy();

  const wrapper = mount(
    <IntlWrapper>
      <SaveExportDropdown
        onExportImage={onExportImage}
        onExportData={onExportData}
        onExportConfig={onExportConfig}
        onExportMap={onExportMap}
        onSaveMap={onSaveMap}
        show={true}
        onClose={onClose}
      />
    </IntlWrapper>
  );
  t.equal(wrapper.find(PanelHeaderDropdown).length, 1, 'We should display 1 PanelHeaderDropdown');
  t.equal(wrapper.find(ToolbarItem).length, 4, 'We should display 4 ToolbarItems');

  wrapper
    .find('.toolbar-item')
    .at(0)
    .simulate('click');
  t.equal(onExportImage.called, true, 'Should have called export image callback');

  wrapper
    .find('.toolbar-item')
    .at(1)
    .simulate('click');
  t.equal(onExportData.called, true, 'Should have called export data callback');

  wrapper
    .find('.toolbar-item')
    .at(2)
    .simulate('click');
  t.equal(onExportMap.called, true, 'Should have called export map callback');

  wrapper
    .find('.toolbar-item')
    .at(3)
    .simulate('click');
  t.equal(onSaveMap.called, true, 'Should have called save map callback');

  t.end();
});

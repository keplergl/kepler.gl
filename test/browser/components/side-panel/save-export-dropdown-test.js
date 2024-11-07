// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/* eslint-disable enzyme-deprecation/no-mount,enzyme-deprecation/no-shallow */
import React from 'react';
import test from 'tape';
import {mount} from 'enzyme';
import sinon from 'sinon';
import {
  SaveExportDropdownFactory,
  PanelHeaderDropdownFactory,
  ToolbarItem
} from '@kepler.gl/components';
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

  wrapper.find('.toolbar-item').at(0).simulate('click');
  t.equal(onExportImage.called, true, 'Should have called export image callback');

  wrapper.find('.toolbar-item').at(1).simulate('click');
  t.equal(onExportData.called, true, 'Should have called export data callback');

  wrapper.find('.toolbar-item').at(2).simulate('click');
  t.equal(onExportMap.called, true, 'Should have called export map callback');

  wrapper.find('.toolbar-item').at(3).simulate('click');
  t.equal(onSaveMap.called, true, 'Should have called save map callback');

  t.end();
});

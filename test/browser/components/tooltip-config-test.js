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
import sinon from 'sinon';
import test from 'tape';
import uniq from 'lodash.uniq';

import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';
import TooltipConfigFactory from 'components/side-panel/interaction-panel/tooltip-config';
import DatasetTagFactory from 'components/side-panel/common/dataset-tag';
import FieldSelectorFactory from 'components/common/field-selector';
import ChickletedInput from 'components/common/item-selector/chickleted-input';
import {ChickletButton} from 'components/common/item-selector/chickleted-input';
import DropdownList from 'components/common/item-selector/dropdown-list';
import Typeahead from 'components/common/item-selector/typeahead';

import {Hash, Delete} from 'components/common/icons';
import {StateWFiles} from 'test/helpers/mock-state';
import {appInjector} from 'components/container';

const TooltipConfig = appInjector.get(TooltipConfigFactory);
const DatasetTag = appInjector.get(DatasetTagFactory);

// const tooltipConfig = {
//   fieldsToShow: {
//     '190vdll3di': [
//       {name: 'gps_data.utc_timestamp', format: null},
//       {name: 'gps_data.types', format: null},
//       {name: 'epoch', format: null},
//       {name: 'has_result', format: null},
//       {name: 'id', format: null}
//     ],
//     ieukmgne: [
//       {name: 'OBJECTID', format: null},
//       {name: 'ZIP_CODE', format: null},
//       {name: 'ID', format: null},
//       {name: 'TRIPS', format: null},
//       {name: 'RATE', format: null}
//     ]
//   },
//   compareMode: false,
//   compareType: 'absolute'
// };

test('TooltipConfig - render', t => {
  const datasets = StateWFiles.visState.datasets;
  const tooltipConfig = StateWFiles.visState.interactionConfig.tooltip.config;

  const FieldSelector = appInjector.get(FieldSelectorFactory);
  const onChange = sinon.spy();
  let wrapper;

  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <TooltipConfig onChange={onChange} config={tooltipConfig} datasets={datasets} />
      </IntlWrapper>
    );
  }, 'Should render');

  t.equal(wrapper.find(TooltipConfig).length, 1, 'Should render 1 TooltipConfig');
  t.equal(wrapper.find(DatasetTag).length, 2, 'Should render 2 DatasetTag');
  t.equal(wrapper.find(FieldSelector).length, 2, 'Should render 2 FieldSelector');
  t.equal(wrapper.find(ChickletedInput).length, 2, 'Should render 2 ChickletedInput');

  // tooltip chicklets
  const tooltipButtons = wrapper
    .find(ChickletedInput)
    .at(0)
    .find(ChickletButton);

  t.equal(tooltipButtons.length, 5, 'should render 6 tooltip buttons');
  t.equal(
    tooltipButtons
      .at(0)
      .find('span')
      .at(0)
      .text(),
    'gps_data.utc_timestamp'
  );

  t.end();
});

test('TooltipConfig - render -> onSelect', t => {
  const datasets = StateWFiles.visState.datasets;
  const tooltipConfig = StateWFiles.visState.interactionConfig.tooltip.config;

  const onChange = sinon.spy();
  let wrapper;

  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <TooltipConfig onChange={onChange} config={tooltipConfig} datasets={datasets} />
      </IntlWrapper>
    );
  }, 'Should render');

  t.equal(wrapper.find(ChickletedInput).length, 2, 'Should render 2 ChickletedInput');

  // click chicklet input to open dropdown
  wrapper
    .find(ChickletedInput)
    .at(0)
    .simulate('click');

  const dropdownSelect = wrapper.find(Typeahead);
  t.equal(dropdownSelect.length, 1, 'should render 1 Typeahead');

  const listItems = dropdownSelect.find('.field-selector_list-item');

  t.deepEqual(
    dropdownSelect.find('.list__item__anchor').map(item => item.text()),
    ['gps_data.lat', 'gps_data.lng', 'time', 'begintrip_ts_utc', 'begintrip_ts_local', 'date'],
    'should filter out selected tooltip items'
  );

  // click 1 item to add
  listItems.at(0).simulate('click');

  const expectedArgs0 = {
    ...tooltipConfig,
    fieldsToShow: {
      ...tooltipConfig.fieldsToShow,
      '190vdll3di': [
        ...tooltipConfig.fieldsToShow['190vdll3di'],
        {name: 'gps_data.lat', format: null}
      ]
    }
  };

  t.deepEqual(onChange.args[0], [expectedArgs0], 'should call onchange with new tooltip appended');

  // delete 1 item
  const tooltipButtons = wrapper
    .find(ChickletedInput)
    .at(0)
    .find(ChickletButton);

  tooltipButtons
    .at(0)
    .find(Delete)
    .simulate('click');
  const expectedArgs1 = {
    ...tooltipConfig,
    fieldsToShow: {
      ...tooltipConfig.fieldsToShow,
      '190vdll3di': tooltipConfig.fieldsToShow['190vdll3di'].slice(
        1,
        tooltipConfig.fieldsToShow['190vdll3di'].length
      )
    }
  };
  t.deepEqual(onChange.args[1], [expectedArgs1], 'should call onchange with 1 item removed');

  // clear All
  t.equal(wrapper.find('.button.clear-all').length, 2, 'should render 2 clea all buttons');

  // click to clear all
  wrapper
    .find('.button.clear-all')
    .at(0)
    .simulate('click');
  const expectedArgs2 = {
    ...tooltipConfig,
    fieldsToShow: {
      ...tooltipConfig.fieldsToShow,
      '190vdll3di': []
    }
  };
  t.deepEqual(onChange.args[2], [expectedArgs2], 'should call onchange to clear all tooltips');

  t.end();
});

test('TooltipConfig - render -> tooltip format', t => {
  const datasets = StateWFiles.visState.datasets;
  const tooltipConfig = StateWFiles.visState.interactionConfig.tooltip.config;

  const onChange = sinon.spy();
  let wrapper;

  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <TooltipConfig onChange={onChange} config={tooltipConfig} datasets={datasets} />
      </IntlWrapper>
    );
  }, 'Should render');

  const tooltipButtons = wrapper
    .find(ChickletedInput)
    .at(0)
    .find(ChickletButton);

  // click on hash
  tooltipButtons
    .at(0)
    .find(Hash)
    .simulate('click');

  const formatDropdown = wrapper.find(DropdownList);
  t.equal(formatDropdown.length, 1, 'should render 1 format dropdown');

  const options = formatDropdown.at(0).props().options;

  t.deepEqual(
    uniq(options.map(op => op.type)),
    ['none', 'date', 'date_time'],
    'should render date type formats'
  );

  const option1 = options[1].format;

  // click option1
  formatDropdown
    .find('.list__item')
    .at(1)
    .simulate('click');
  const expectedArgs0 = {
    ...tooltipConfig,
    fieldsToShow: {
      ...tooltipConfig.fieldsToShow,
      '190vdll3di': [
        {name: 'gps_data.utc_timestamp', format: option1},
        ...tooltipConfig.fieldsToShow['190vdll3di'].slice(
          1,
          tooltipConfig.fieldsToShow['190vdll3di'].length
        )
      ]
    }
  };
  t.deepEqual(onChange.args[0], [expectedArgs0], 'should call onchange to set format');
  t.end();
});

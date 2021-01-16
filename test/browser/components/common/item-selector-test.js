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
import sinon from 'sinon';
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';
import {ItemSelector} from 'components';
import Typeahead from 'components/common/item-selector/typeahead';
import DropdownList, {ListItem} from 'components/common/item-selector/dropdown-list';

test('Components -> ItemSelector.render', t => {
  let wrapper;
  const onChange = sinon.spy();
  const props = {
    selectedItems: 'normal',
    options: ['additive', 'normal', 'subtractive'],
    multiSelect: false,
    searchable: false,
    onChange
  };

  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <ItemSelector {...props} />
      </IntlWrapper>
    );
  }, 'Show not fail without props');

  t.equal(wrapper.find('.item-selector__dropdown').length, 1, 'should render DropdownSelect');
  t.equal(wrapper.find(Typeahead).length, 0, 'should not render Typeahead');
  t.equal(
    wrapper
      .find('.item-selector__dropdown')
      .at(0)
      .find('.list__item__anchor')
      .text(),
    'normal',
    'should render selected value'
  );

  // click dropdown select
  wrapper
    .find('.item-selector__dropdown')
    .at(0)
    .simulate('click');

  t.equal(wrapper.find(Typeahead).length, 1, 'should render Typeahead');
  t.equal(wrapper.find(DropdownList).length, 1, 'should render 1 Typeahead');
  t.equal(
    wrapper
      .find(DropdownList)
      .at(0)
      .find(ListItem).length,
    3,
    'should render 3 ListItem'
  );

  t.equal(
    wrapper
      .find(DropdownList)
      .at(0)
      .find('.list__item__anchor')
      .at(0)
      .text(),
    'additive',
    'should render additive'
  );

  wrapper
    .find(DropdownList)
    .at(0)
    .find('.list__item')
    .at(0)
    .simulate('click');

  t.deepEqual(onChange.args[0], ['additive'], 'should call additive');
  t.end();
});

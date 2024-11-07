// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import test from 'tape';
import sinon from 'sinon';
import {act} from 'react-dom/test-utils';
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';
import {ItemSelector, Typeahead, DropdownList, ListItem} from '@kepler.gl/components';

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
    wrapper.find('.item-selector__dropdown').at(0).find('.list__item__anchor').text(),
    'normal',
    'should render selected value'
  );

  // click dropdown select
  wrapper.find('.item-selector__dropdown').at(0).simulate('click');

  t.equal(wrapper.find(Typeahead).length, 1, 'should render Typeahead');
  t.equal(wrapper.find(DropdownList).length, 1, 'should render 1 Typeahead');
  t.equal(wrapper.find(DropdownList).at(0).find(ListItem).length, 3, 'should render 3 ListItem');

  t.equal(
    wrapper.find(DropdownList).at(0).find('.list__item__anchor').at(0).text(),
    'additive',
    'should render additive'
  );

  wrapper.find(DropdownList).at(0).find('.list__item').at(0).simulate('click');

  t.deepEqual(onChange.args[0], ['additive'], 'should call additive');
  t.end();
});

test('Components -> ItemSelector.render over 100 options', t => {
  let wrapper;
  const onChange = sinon.spy();
  const randomOptions = Array.from({length: 120}, () => Math.random().toString(16).substr(2, 8));

  const props = {
    selectedItems: '',
    options: randomOptions,
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
    wrapper.find('.item-selector__dropdown').at(0).find('.list__item__anchor').text(),
    '',
    'should render no select value'
  );

  // click dropdown select
  wrapper.find('.item-selector__dropdown').at(0).simulate('click');

  t.equal(wrapper.find(Typeahead).length, 1, 'should render Typeahead');
  t.equal(wrapper.find(DropdownList).length, 1, 'should render 1 Typeahead');
  t.equal(
    wrapper.find(DropdownList).at(0).find(ListItem).length,
    100,
    'should render first 100 ListItem'
  );

  // mockup scroll by triggering handleObserver() of IntersectionObserver
  const mockedEntries = [
    {
      isIntersecting: true,
      boundingClientRect: {
        x: 77,
        y: 77,
        width: 231,
        height: 0,
        top: 777,
        right: 308,
        bottom: 777,
        left: 77
      }
    }
  ];
  const dropdown = wrapper.find(DropdownList).instance();
  dropdown.prevY = 100;
  act(() => {
    dropdown.handleObserver(mockedEntries);
  });

  wrapper.update();

  t.equal(
    wrapper.find(DropdownList).at(0).find(ListItem).length,
    120,
    'should render all 120 ListItem'
  );

  // mockup scroll again
  dropdown.prevY = 110;
  act(() => {
    dropdown.handleObserver(mockedEntries);
  });

  wrapper.update();
  t.equal(
    wrapper.find(DropdownList).at(0).find(ListItem).length,
    120,
    'should still render all 120 ListItem'
  );

  t.end();
});

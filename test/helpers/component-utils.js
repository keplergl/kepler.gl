// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import sinon from 'sinon';
import {mount} from 'enzyme';
import {theme} from '@kepler.gl/styles';
import {ThemeProvider} from 'styled-components';
import {IntlProvider} from 'react-intl';
import {messages} from '@kepler.gl/localization';
import {Typeahead} from '@kepler.gl/components';

export function mountWithTheme(node, _options) {
  return mount(
    <ThemeProvider theme={theme}>
      {node}
    </ThemeProvider>
  );
}

export const IntlWrapper = ({children, locale = 'en'}) => (
  <IntlProvider locale={locale} messages={messages[locale]}>
    {children}
  </IntlProvider>
);

export function mockHTMLElementClientSize(prop, value) {
  return sinon.stub(HTMLElement.prototype, prop).get(() => value);
}

export function clickItemSelector(itemSelector) {
  itemSelector.find('.item-selector__dropdown').at(0).simulate('click');
}

export function clickItemSelectList(itemSelector, itemIndex) {
  itemSelector.find(Typeahead).at(0).find('.list__item').at(itemIndex).simulate('click');
}

export function getItemSelectorListText(itemSelector, itemIndex) {
  return itemSelector
    .find(Typeahead)
    .at(0)
    .find('.list__item')
    .at(itemIndex)
    .find('.list__item__anchor')
    .text();
}

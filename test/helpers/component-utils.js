// Copyright (c) 2022 Uber Technologies, Inc.
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
import {mount} from 'enzyme';
import {theme} from '@kepler.gl/styles';
import {ThemeProvider} from 'styled-components';
import {IntlProvider} from 'react-intl';
import {messages} from '@kepler.gl/localization';
import {Typeahead} from '@kepler.gl/components';

export function mountWithTheme(node, options) {
  return mount(node, {
    wrappingComponent: ThemeProvider,
    wrappingComponentProps: {theme},
    ...options
  });
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
  itemSelector
    .find('.item-selector__dropdown')
    .at(0)
    .simulate('click');
}

export function clickItemSelectList(itemSelector, itemIndex) {
  itemSelector
    .find(Typeahead)
    .at(0)
    .find('.list__item')
    .at(itemIndex)
    .simulate('click');
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

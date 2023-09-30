// Copyright (c) 2023 Uber Technologies, Inc.
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
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import {ThemeProvider} from 'styled-components';
import {IntlProvider} from 'react-intl';
import {messages} from 'localization';

import {render} from '@testing-library/react';
import {theme} from '@kepler.gl/styles';
import {keplerGlReducerCore as coreReducer} from '@kepler.gl/reducers';
import {keplerGlInit} from '@kepler.gl/actions';

const mockStore = configureStore();
const initialCoreState = coreReducer(undefined, keplerGlInit({}));

export function renderWithTheme(component, options) {
  return render(
    <ThemeProvider theme={theme}>
      <IntlProvider locale="en" messages={messages}>
        {component}
      </IntlProvider>
    </ThemeProvider>,
    options
  );
}

export function renderWithStore(component, options) {
  // assume instance reducer is already mounted
  const store = mockStore({
    keplerGl: {
      foo: initialCoreState
    }
  });

  return render(<Provider store={store}>{component}</Provider>, options);
}

export function IntlWrapper({children, locale = 'en'}) {
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      {children}
    </IntlProvider>
  );
}

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Test utilities using @testing-library/react for React 19.
// Replaces the old enzyme-based component-utils.js.

import React from 'react';
import {render, fireEvent, screen, within, act} from '@testing-library/react';
import sinon from 'sinon';
import {theme} from '@kepler.gl/styles';
import {ThemeProvider} from 'styled-components';
import {IntlProvider} from 'react-intl';
import {messages} from '@kepler.gl/localization';

export function renderWithTheme(node, options) {
  return render(node, {
    wrapper: ({children}) => <ThemeProvider theme={theme}>{children}</ThemeProvider>,
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

export {render, fireEvent, screen, within, act};

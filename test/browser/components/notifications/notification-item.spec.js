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

import {screen} from '@testing-library/react';
import {dataTestIds} from '@kepler.gl/constants';
import {NotificationItemFactory, appInjector} from '@kepler.gl/components';
import {createNotification} from '@kepler.gl/utils';

import {renderWithTheme} from '../../../helpers/component-jest-utils';

const NotificationItem = appInjector.get(NotificationItemFactory);

describe('Notification tests', () => {

  window.URL.createObjectURL = jest.fn();

  it('display SUCCESS notification', () => {
    const successNotification = createNotification({message: 'success', type: 'success'});
    // render the component
    renderWithTheme(<NotificationItem notification={successNotification} />);
    const heading = screen.getByTestId(dataTestIds.successIcon);
    expect(heading).toBeInTheDocument();
  });

  it('display ERROR notification', () => {
    const errorNotification = createNotification({message: 'error', type: 'error'});
    // render the component
    renderWithTheme(<NotificationItem notification={errorNotification} />);
    const heading = screen.getByTestId(dataTestIds.errorIcon);
    expect(heading).toBeInTheDocument();
  });


  afterEach(() => {
    window.URL.createObjectURL.mockReset();
  });
});

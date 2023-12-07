// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';

import {screen} from '@testing-library/react';
import {dataTestIds} from '@kepler.gl/constants';
import {NotificationItemFactory, appInjector} from '@kepler.gl/components';
import {createNotification} from '@kepler.gl/utils';

import {renderWithTheme} from '../../../helpers/component-jest-utils';

const NotificationItem = appInjector.get(NotificationItemFactory);

describe('Notification tests', () => {
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
});

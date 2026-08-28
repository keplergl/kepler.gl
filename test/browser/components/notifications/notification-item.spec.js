// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';

import {fireEvent, screen} from '@testing-library/react';
import {dataTestIds} from '@kepler.gl/constants';
import {NotificationItemFactory, appInjector} from '@kepler.gl/components';
import {createNotification} from '@kepler.gl/utils';
import copy from 'copy-to-clipboard';

import {renderWithTheme} from '../../../helpers/component-jest-utils';

jest.mock('copy-to-clipboard', () => jest.fn());

const NotificationItem = appInjector.get(NotificationItemFactory);

describe('Notification tests', () => {
  beforeEach(() => {
    copy.mockClear();
  });

  it('display SUCCESS notification', () => {
    const successNotification = createNotification({message: 'success', type: 'success'});
    // render the component
    renderWithTheme(<NotificationItem notification={successNotification} />);
    const heading = screen.getByTestId(dataTestIds.successIcon);
    expect(heading).toBeInTheDocument();
  });

  it('display ERROR notification', () => {
    const errorNotification = createNotification({message: 'error', type: 'error'});
    renderWithTheme(<NotificationItem notification={errorNotification} />);
    const heading = screen.getByTestId(dataTestIds.errorIcon);
    expect(heading).toBeInTheDocument();
  });

  it('copies error message without collapsing the notification', () => {
    const errorNotification = createNotification({
      message: 'Failed to load tiles',
      type: 'error'
    });
    const {container} = renderWithTheme(
      <NotificationItem notification={errorNotification} removeNotification={() => {}} />
    );

    const notification = container.querySelector('.notification-item');
    fireEvent.click(notification);
    expect(notification).toHaveClass('notification-item--expanded');

    fireEvent.click(screen.getByTestId(dataTestIds.copyNotificationIcon));

    expect(copy).toHaveBeenCalledWith('Failed to load tiles');
    expect(notification).toHaveClass('notification-item--expanded');
    expect(screen.getByTitle('Copied')).toBeInTheDocument();
  });
});

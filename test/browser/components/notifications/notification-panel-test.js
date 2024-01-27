// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/* eslint-disable enzyme-deprecation/no-mount,enzyme-deprecation/no-shallow */
import React from 'react';
import test from 'tape';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import {NotificationItemFactory, NotificationPanelFactory} from '@kepler.gl/components';
import {createNotification} from '@kepler.gl/utils';
import {theme} from '@kepler.gl/styles';

const NotificationItem = NotificationItemFactory();
const NotificationPanel = NotificationPanelFactory(NotificationItem);

const notifications = [
  createNotification({message: '1', type: 'success'}),
  createNotification({message: '2', type: 'error'}),
  createNotification({message: '3', topic: 'file'}),
  createNotification({message: '4', type: 'info'})
];

test('Notification Panel - Show notifications', t => {
  const removeNotification = sinon.spy();
  const $ = shallow(
    <NotificationPanel
      notifications={notifications}
      removeNotification={removeNotification}
      theme={theme}
    />
  );

  // Check notifications
  t.equal($.find('NotificationItem').length, 3, 'Should display only 3 Notifications');

  t.end();
});

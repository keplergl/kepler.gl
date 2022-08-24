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
import test from 'tape';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import NotificationItemFactory from 'components/notification-panel/notification-item';
import NotificationPanelFactory from 'components/notification-panel';
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

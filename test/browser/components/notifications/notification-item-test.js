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
import {shallow} from 'enzyme';
import NotificationItemFactory from 'components/notification-panel/notification-item';
import {createNotification} from '@kepler.gl/utils';
import {theme} from '@kepler.gl/styles';

const NotificationItem = NotificationItemFactory();

test('Notification item -> display SUCCESS notification', t => {
  const notification = createNotification({message: 'success', type: 'success'});
  const $ = shallow(<NotificationItem theme={theme} notification={notification} />);

  // validate the icon
  t.equal($.find('Checkmark').length, 1, 'Should display info icon');
  // validate notification is not expanded
  t.equal($.state('isExpanded'), false, 'Notification should be not expanded');
  // click on notification
  $.find('.notification-item').simulate('click');
  // validate notification is expanded
  t.equal($.state('isExpanded'), true, 'Notification should be expanded');
  t.end();
});

test('Notification item -> display ERROR notification', t => {
  const notification = createNotification({message: 'error', type: 'error'});
  const $ = shallow(<NotificationItem notification={notification} theme={theme} />);

  // validate the icon
  t.equal($.find('Warning').length, 1, 'Should display warning icon');
  // validate notification is not expanded
  t.equal($.state('isExpanded'), false, 'Notification should be not expanded');
  // click on notification
  $.find('.notification-item').simulate('click');
  // validate notification is expanded
  t.equal($.state('isExpanded'), true, 'Notification should be expanded');
  t.end();
});

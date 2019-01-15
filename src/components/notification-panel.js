// Copyright (c) 2019 Uber Technologies, Inc.
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

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import NotificationItemFactory from './notification-panel/notification-item';

const NotificationPanelContent = styled.div`
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 4px;
  overflow-y: scroll;
  overflow-x: hidden;
  position: absolute;
  top: 1em;
  right: 1em;
  z-index: 10000;
  box-sizing: border-box;
`;

NotificationPanelFactory.deps = [
  NotificationItemFactory
];

export default function NotificationPanelFactory (
  NotificationItem
) {
  return class NotificationPanel extends Component {
    static propTypes = {
      uiStateActions: PropTypes.shape({
        removeNotification: PropTypes.func.isRequired
      }).isRequired,
      uiState: PropTypes.object.isRequired
    };

    render() {
      const {notifications = []} = this.props.uiState;
      const {removeNotification} = this.props.uiStateActions;

      return (
        <NotificationPanelContent className="notification-panel">
          {notifications.map(n => (
            <NotificationItem
              key={n.id}
              notification={n}
              removeNotification={removeNotification}
            />
          ))}
        </NotificationPanelContent>
      );
    }
  }
}


// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import styled from 'styled-components';

import NotificationItemFactory from './notification-panel/notification-item';
import {DEFAULT_NOTIFICATION_TOPICS} from '@kepler.gl/constants';
import {Notifications} from '@kepler.gl/types';
import {removeNotification} from '@kepler.gl/actions';

const NotificationPanelContent = styled.div`
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 4px;
  overflow-y: auto;
  overflow-x: hidden;
  position: absolute;
  top: 1em;
  right: 1em;
  z-index: 10000;
  box-sizing: border-box;
`;

NotificationPanelFactory.deps = [NotificationItemFactory];

interface NotificationPanelProps {
  removeNotification?: typeof removeNotification;
  notifications: Notifications[];
}

export default function NotificationPanelFactory(
  NotificationItem: ReturnType<typeof NotificationItemFactory>
): React.ComponentClass<NotificationPanelProps> {
  class NotificationPanelUnmemoized extends Component<NotificationPanelProps> {
    static displayName = 'NotificationPanel';

    render() {
      const globalNotifications = this.props.notifications.filter(
        n => n.topic === DEFAULT_NOTIFICATION_TOPICS.global
      );
      return (
        <NotificationPanelContent
          className="notification-panel"
          style={{display: globalNotifications.length ? 'block' : 'none'}}
        >
          {globalNotifications.map(n => (
            <NotificationItem
              key={n.id}
              notification={n}
              removeNotification={this.props.removeNotification}
            />
          ))}
        </NotificationPanelContent>
      );
    }
  }

  const NotificationPanel = React.memo(
    NotificationPanelUnmemoized
  ) as unknown as typeof NotificationPanelUnmemoized;
  return NotificationPanel;
}

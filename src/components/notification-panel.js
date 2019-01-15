import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import NotificationItemFactory from './notification-panel/notification-item';

const NotificationPanelContent = styled.div`
  background: transparent;
  flex-grow: 1;
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


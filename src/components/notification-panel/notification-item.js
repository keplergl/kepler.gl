import React, {Component} from 'react';
import styled from 'styled-components';

const NotificationItemContent = styled.div`
  background-color: ${props => props.theme.notificationColors[props.notification.type]};
  color: #fff;
`;

export default function NotificationItemFactory()
{
  return class NotificationItem extends Component {
    render() {
      const {notification, removeNotification} = this.props;
      return (
        <NotificationItemContent {...this.props}>
          <div>
            id: {notification.id}
            <button onClick={() => removeNotification(notification.id)}>X</button>
          </div>
        </NotificationItemContent>
      );
    }
  }
}

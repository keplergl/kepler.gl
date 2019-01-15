import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Delete from '../common/icons/delete';
import Info from '../common/icons/info';
import Warning from '../common/icons/warning';
import Checkmark from '../common/icons/checkmark';

const NotificationItemContent = styled.div`
  background-color: ${props => props.theme.notificationColors[props.notification.type] || '#000'};
  color: #fff;
  display: flex;
  flex-direction: row;
  width: ${props => props.theme.notificationPanelWidth}px;
  min-height: 60px;
  font-size: 10px;
  margin-bottom: 1rem;
  padding: 1em;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
  -webkit-box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.75);
  -moz-box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.75);
  box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.75);
`;

const DeleteIcon = styled(Delete)`
  cursor: pointer;
`;

const NotificationMessage = styled.div`
  flex-grow: 2;
  width: ${props => props.theme.notificationPanelItemWidth}px;
  margin: 0 1em;
`;

const icons = {
  info: <Info />,
  warning: <Warning />,
  error: <Warning />,
  success: <Checkmark />
};

export default function NotificationItemFactory()
{
  return class NotificationItem extends Component {
    static propTypes = {
      notification: PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired
      }).isRequired
    };

    render() {
      const {notification, removeNotification} = this.props;
      return (
        <NotificationItemContent {...this.props}>
          <div>
            {icons[notification.type]}
          </div>
          <NotificationMessage theme={this.props.theme}>
            <span>{notification.message}</span>
          </NotificationMessage>
          <div>
            <DeleteIcon height="10px" onClick={() => removeNotification(notification.id)} />
          </div>
        </NotificationItemContent>
      );
    }
  }
}

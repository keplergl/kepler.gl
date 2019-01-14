import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const NotificationPanelContent = styled.div`
  ${props => props.theme.sidePanelScrollBar};
  background: red;
  flex-grow: 1;
  padding: 16px;
  overflow-y: scroll;
  overflow-x: hidden;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10000
`;

NotificationPanelFactory.deps = [
  // NotificationItem
];

export default function NotificationPanelFactory (
  // NotificationItem
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
            <div key={n.id}>
              id: {n.id}
              <button onClick={() => removeNotification(n.id)}>X</button>
            </div>
          ))}
        </NotificationPanelContent>
      );
    }
  }
}


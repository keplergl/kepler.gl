// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import styled from 'styled-components';
import {Delete, Info, Warning, Checkmark} from '../common/icons';
import ReactMarkdown from 'react-markdown';
import {dataTestIds} from '@kepler.gl/constants';
import {ActionHandler, removeNotification as removeNotificationActions} from '@kepler.gl/actions';

interface NotificationItemContentBlockProps {
  isExpanded?: boolean;
}

const NotificationItemContentBlock = styled.div.attrs({
  className: 'notification-item--content-block'
})<NotificationItemContentBlockProps>`
  display: block;
  position: relative;
  width: ${props => props.theme.notificationPanelItemWidth * (1 + Number(props.isExpanded))}px;
  margin-left: auto;
`;

interface NotificationItemContentProps {
  type: string;
  isExpanded?: boolean;
}

const NotificationItemContent = styled.div<NotificationItemContentProps>`
  background-color: ${props => props.theme.notificationColors[props.type] || '#000'};
  color: #fff;
  display: flex;
  flex-direction: row;
  width: ${props => props.theme.notificationPanelItemWidth * (1 + Number(props.isExpanded))}px;
  height: ${props => props.theme.notificationPanelItemHeight * (1 + Number(props.isExpanded))}px;
  font-size: 11px;
  margin-bottom: 1rem;
  padding: 1em;
  border-radius: 4px;
  box-shadow: ${props => props.theme.boxShadow};
  cursor: pointer;
`;

const DeleteIcon = styled(Delete)`
  cursor: pointer;
  width: 13px;
  height: 13px;
`;

interface NotificationCounterProps {
  type: string;
}

const NotificationCounter = styled.div.attrs({
  className: 'notification-item--counter'
})<NotificationCounterProps>`
  position: absolute;
  font-size: 11px;
  font-weight: bold;
  text-align: center;
  left: -4px;
  bottom: -4px;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  background-color: #ffffff;
  border: 1px solid ${props => props.theme.notificationColors[props.type] || '#000'};
  color: ${props => props.theme.notificationColors[props.type] || '#000'};
  box-shadow: ${props => props.theme.boxShadow};
`;

interface NotificationMessageProps {
  isExpanded?: boolean;
}

const NotificationMessage = styled.div.attrs({
  className: 'notification-item--message'
})<NotificationMessageProps>`
  flex-grow: 2;
  width: ${props => props.theme.notificationPanelItemWidth}px;
  margin: 0 1em;
  overflow: ${props => (props.isExpanded ? 'auto' : 'hidden')};
  padding-right: ${props => (props.isExpanded ? '1em' : 0)};

  p {
    margin-top: 0;
    a {
      color: #fff;
      text-decoration: underline;
    }
  }
`;

const NotificationIcon = styled.div`
  svg {
    vertical-align: text-top;
  }
`;

const icons = {
  info: <Info data-testid={dataTestIds.infoIcon} />,
  warning: <Warning data-testid={dataTestIds.warningIcon} />,
  error: <Warning data-testid={dataTestIds.errorIcon} />,
  success: <Checkmark data-testid={dataTestIds.successIcon} />
};

const LinkRenderer = props => {
  return (
    <a href={props.href} target="_blank" rel="noopener noreferrer">
      {props.children}
    </a>
  );
};

interface NotificationItemProps {
  notification: {
    id: string;
    type: string;
    message: string;
    count?: number;
  };
  isExpanded?: boolean;
  removeNotification?: ActionHandler<typeof removeNotificationActions>;
  theme?: any;
}

export default function NotificationItemFactory() {
  return class NotificationItem extends Component<NotificationItemProps> {
    state = {
      isExpanded: false
    };

    componentDidMount() {
      if (this.props.isExpanded) {
        this.setState({isExpanded: true});
      }
    }

    render() {
      const {notification, removeNotification} = this.props;
      const {isExpanded} = this.state;

      return (
        <NotificationItemContentBlock isExpanded={isExpanded} theme={this.props.theme}>
          {(notification.count || 0) > 1 ? (
            <NotificationCounter type={notification.type} theme={this.props.theme}>
              {notification.count}
            </NotificationCounter>
          ) : null}
          <NotificationItemContent
            className="notification-item"
            type={notification.type}
            isExpanded={isExpanded}
            onClick={() => this.setState({isExpanded: !isExpanded})}
          >
            <NotificationIcon className="notification-item--icon">
              {icons[notification.type]}
            </NotificationIcon>
            <NotificationMessage isExpanded={isExpanded} theme={this.props.theme}>
              <ReactMarkdown components={{a: LinkRenderer}}>{notification.message}</ReactMarkdown>
            </NotificationMessage>
            {typeof removeNotification === 'function' ? (
              <div className="notification-item--action">
                <DeleteIcon height="10px" onClick={() => removeNotification(notification.id)} />
              </div>
            ) : null}
          </NotificationItemContent>
        </NotificationItemContentBlock>
      );
    }
  };
}

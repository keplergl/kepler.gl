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

import React, {Component} from 'react';
import styled from 'styled-components';
import {Delete, Info, Warning, Checkmark} from '../common/icons';
import ReactMarkdown from 'react-markdown';
import {
  ActionHandler,
  removeNotification as removeNotificationActions
} from '@kepler.gl/actions';

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
  info: <Info />,
  warning: <Warning />,
  error: <Warning />,
  success: <Checkmark />
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
            <ReactMarkdown source={notification.message} renderers={{link: LinkRenderer}} />
          </NotificationMessage>
          {typeof removeNotification === 'function' ? (
            <div className="notification-item--action">
              <DeleteIcon height="10px" onClick={() => removeNotification(notification.id)} />
            </div>
          ) : null}
        </NotificationItemContent>
      );
    }
  };
}

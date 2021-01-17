// Copyright (c) 2021 Uber Technologies, Inc.
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
import {Delete, Info, Warning, Checkmark} from 'components/common/icons';
import ReactMarkdown from 'react-markdown';

const NotificationItemContent = styled.div`
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

const NotificationMessage = styled.div.attrs({
  className: 'notification-item--message'
})`
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

export default function NotificationItemFactory() {
  return class NotificationItem extends Component {
    static propTypes = {
      notification: PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired
      }).isRequired,
      isExpanded: PropTypes.bool
    };

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

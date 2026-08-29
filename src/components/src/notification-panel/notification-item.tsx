// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState, useEffect, useCallback} from 'react';
import styled from 'styled-components';
import copy from 'copy-to-clipboard';
import {Delete, Info, Warning, Checkmark, Copy} from '../common/icons';
import Markdown from 'markdown-to-jsx';
import {dataTestIds} from '@kepler.gl/constants';
import {ActionHandler, removeNotification as removeNotificationActions} from '@kepler.gl/actions';

import LinkRenderer from '../common/link-renderer';
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

  &:hover .notification-item--copy {
    opacity: 1;
    pointer-events: auto;
  }
`;

const NotificationActions = styled.div.attrs({
  className: 'notification-item--action'
})`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  flex-shrink: 0;
  position: relative;
`;

const ActionIconButton = styled.div.attrs({
  className: 'notification-item--copy'
})<{$copied?: boolean}>`
  display: flex;
  cursor: pointer;
  line-height: 0;
  position: absolute;
  right: calc(100% + 6px);
  top: 0;
  z-index: 1;
  opacity: ${props => (props.$copied ? 1 : 0)};
  pointer-events: ${props => (props.$copied ? 'auto' : 'none')};
`;

const DeleteIcon = styled(Delete)`
  cursor: pointer;
  width: 13px;
  height: 13px;
`;

const CopyIcon = styled(Copy)`
  cursor: pointer;
  width: 13px;
  height: 13px;
`;

const CopiedIcon = styled(Checkmark)`
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
  return function NotificationItem({
    notification,
    removeNotification,
    isExpanded: initialIsExpanded,
    theme
  }: NotificationItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
      if (initialIsExpanded) {
        setIsExpanded(true);
      }
    }, [initialIsExpanded]);

    useEffect(() => {
      if (!copied) {
        return;
      }
      const timeoutId = window.setTimeout(() => setCopied(false), 1500);
      return () => window.clearTimeout(timeoutId);
    }, [copied]);

    const onCopy = useCallback(
      (event: React.MouseEvent) => {
        event.stopPropagation();
        if (notification.message) {
          copy(notification.message);
          setCopied(true);
        }
      },
      [notification.message]
    );

    return (
      <NotificationItemContentBlock isExpanded={isExpanded} theme={theme}>
        {(notification.count || 0) > 1 ? (
          <NotificationCounter type={notification.type} theme={theme}>
            {notification.count}
          </NotificationCounter>
        ) : null}
        <NotificationItemContent
          className={`notification-item${isExpanded ? ' notification-item--expanded' : ''}`}
          type={notification.type}
          isExpanded={isExpanded}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <NotificationIcon className="notification-item--icon">
            {icons[notification.type]}
          </NotificationIcon>
          <NotificationMessage isExpanded={isExpanded} theme={theme}>
            <Markdown
              options={{
                overrides: {
                  a: {
                    component: LinkRenderer
                  }
                }
              }}
            >
              {notification.message}
            </Markdown>
          </NotificationMessage>
          <NotificationActions onClick={event => event.stopPropagation()}>
            <ActionIconButton
              $copied={copied}
              data-testid={dataTestIds.copyNotificationIcon}
              title={copied ? 'Copied' : 'Copy to clipboard'}
              onClick={onCopy}
            >
              {copied ? <CopiedIcon height="10px" /> : <CopyIcon height="10px" />}
            </ActionIconButton>
            {typeof removeNotification === 'function' ? (
              <DeleteIcon height="10px" onClick={() => removeNotification(notification.id)} />
            ) : null}
          </NotificationActions>
        </NotificationItemContent>
      </NotificationItemContentBlock>
    );
  };
}

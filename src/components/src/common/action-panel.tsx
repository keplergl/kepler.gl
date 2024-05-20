// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import classnames from 'classnames';
import React, {useCallback, PropsWithChildren, ElementType, CSSProperties, ReactNode} from 'react';
import styled from 'styled-components';
import {ArrowRight} from './icons';
import Checkbox from './switch';
import TippyTooltip from './tippy-tooltip';

export type ActionPanelProps = PropsWithChildren<{
  color?: string;
  className?: string;
  direction?: string;
}>;

export type ActionPanelItemProps = PropsWithChildren<{
  color?: string;
  className?: string;
  Icon?: ElementType;
  label: string;
  onClick?: () => void;
  isSelection?: boolean;
  isActive?: boolean;
  isDisabled?: boolean;
  tooltipText?: string | null;
  style?: CSSProperties;
}>;

export interface DirectionProp {
  direction: string;
}

const StyledItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 12px;
  line-height: 14px;
  padding: 8px 16px 8px 8px;
  min-height: ${props => props.theme.actionPanelHeight}px;
  text-transform: capitalize;
  background-color: ${props => props.theme.dropdownListBgd};
  max-width: 200px;
  position: relative;

  ${props => (props.color ? `border-left: 3px solid rgb(${props.color});` : '')} :hover {
    color: ${props => props.theme.textColorHl};
    .nested-group {
      display: block;
    }
  }

  .label {
    margin-left: 8px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .label-icon {
    margin-left: 4px;
    margin-bottom: -2px;
  }
  .icon {
    width: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .nested-group {
    max-width: 200px;
    overflow: hidden;
    display: none;
    color: ${props => props.theme.textColor};
    position: absolute;
    left: 100%;
    top: 0px;
    padding-left: 4px;

    label {
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
`;

const StyledCheckedbox = styled(Checkbox)`
  label {
    margin-bottom: 0;
    color: ${props => props.theme.textColor};
    padding-left: 20px;
    line-height: 12px;

    &:before {
      width: 12px;
      height: 12px;
      background-color: ${props => props.theme.dropdownListBgd};
    }
    &:hover {
      color: ${props => props.theme.textColorHl};
    }
  }
`;

const renderChildren = (child: ReactNode, index: number) =>
  child &&
  React.isValidElement<any>(child) &&
  React.cloneElement(child, {
    onClick: () => {
      if (child.props.onClick) {
        child.props.onClick(index);
      }
    },
    className: classnames('action-panel-item', child.props.className)
  });

/** @type {typeof import('./action-panel').ActionPanelItem} */
export const ActionPanelItem = React.memo(
  ({
    children,
    color,
    className,
    Icon,
    label,
    onClick,
    isSelection,
    isActive,
    isDisabled,
    tooltipText,
    style
  }: ActionPanelItemProps) => {
    const onClickCallback = useCallback(
      event => {
        if (isDisabled) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        onClick?.();
      },
      [onClick, isDisabled]
    );

    const content = (
      <StyledItem
        className={className}
        onClick={onClickCallback}
        color={color}
        style={{
          ...(isDisabled ? {cursor: 'not-allowed', opacity: 0.5} : {cursor: 'pointer'}),
          ...style
        }}
      >
        {Icon ? (
          <div className="icon">
            <Icon height="16px" />
          </div>
        ) : null}
        {isSelection ? (
          <StyledCheckedbox
            type="checkbox"
            checked={Boolean(isActive)}
            disabled={Boolean(isDisabled)}
            id={`switch-${label}`}
            secondary
            label={label}
          />
        ) : (
          <span className="label">{label}</span>
        )}
        {children ? (
          <div>
            <div className="label-icon">
              <ArrowRight height="16px" />
            </div>
            {!isDisabled ? (
              <div className="nested-group">{React.Children.map(children, renderChildren)}</div>
            ) : null}
          </div>
        ) : null}
      </StyledItem>
    );
    return tooltipText ? (
      <TippyTooltip render={() => <div>{tooltipText}</div>}>{content}</TippyTooltip>
    ) : (
      content
    );
  }
);

ActionPanelItem.displayName = 'ActionPanelItem';

const StyledActionPanel = styled.div<DirectionProp>`
  display: flex;
  flex-direction: ${props => props.direction};
  box-shadow: ${props => props.theme.dropdownListShadow};
  transition: ${props => props.theme.transitionSlow};
  color: ${props => props.theme.textColor};

  .action-panel-item {
    ${props =>
      props.direction === 'column'
        ? `border-bottom: 1px solid ${props.theme.panelHeaderIcon}`
        : `border-right: 1px solid ${props.theme.panelHeaderIcon}`} &:last-of-type {
      border-bottom: 0;
    }
  }
`;

// React compound element https://medium.com/@Dane_s/react-js-compound-components-a6e54b5c9992
/** @type {typeof import('./action-panel').ActionPanel} */
const ActionPanel = ({children, className, direction = 'column'}: ActionPanelProps) => (
  <StyledActionPanel className={className} direction={direction}>
    {React.Children.map(children, renderChildren)}
  </StyledActionPanel>
);

ActionPanel.displayName = 'ActionPanel';

export default ActionPanel;

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import {FormattedMessage} from '@kepler.gl/localization';
import {ComponentType, MouseEvent} from 'react';
import TippyTooltip from './tippy-tooltip';

interface StyledDivProps {
  $active?: boolean;
  $disabled?: boolean;
}

const StyledDiv = styled.div.attrs(props => ({
  className: classnames('toolbar-item', props.className)
}))<StyledDivProps>`
  color: ${props =>
    props.$active ? props.theme.toolbarItemIconHover : props.theme.panelHeaderIcon};
  padding: 12px 20px;
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 110px;
  justify-content: space-between;
  border: 1px solid ${props => (props.$active ? props.theme.toolbarItemBorderHover : 'transparent')};
  border-radius: ${props => props.theme.toolbarItemBorderRaddius};
  background-color: ${props =>
    props.$active ? props.theme.toolbarItemBgdHover : props.theme.dropdownListBgd};
  opacity: ${props => (props.$disabled ? 0.4 : 1)};
  // Keep hover so tooltips still work when the action is disabled.
  pointer-events: auto;

  .toolbar-item__svg-container {
    margin-bottom: 4px;
  }
  .toolbar-item__title {
    white-space: nowrap;
    color: ${props => props.theme.textColorHl};
  }

  &:hover {
    background-color: ${props => props.theme.toolbarItemBgdHover};
    border-color: ${props => props.theme.toolbarItemBorderHover};
    svg {
      color: ${props => props.theme.toolbarItemIconHover};
    }
    cursor: ${props => (props.$disabled ? 'default' : 'pointer')};
  }
`;

export type ToolbarItemProps = {
  id?: string;
  key?: string;
  label: string;
  tooltip?: string;
  className?: string;
  active?: boolean;
  disabled?: boolean;
  onClose?: () => void;
  onClick: ((event: MouseEvent<HTMLDivElement>) => void) | null;
  icon?: ComponentType<any>;
};

const ToolbarItem = React.memo((props: ToolbarItemProps) => {
  const item = (
    <StyledDiv
      id={props.id}
      className={props.className}
      $active={props.active}
      $disabled={props.disabled}
      onClick={e => {
        e.stopPropagation();
        e.preventDefault();
        if (props.disabled) {
          return;
        }
        if (typeof props.onClose === 'function') {
          props.onClose();
        }
        props.onClick?.(e);
      }}
    >
      {props.icon && (
        <div className="toolbar-item__svg-container">
          <props.icon />
        </div>
      )}
      <div className="toolbar-item__title">
        <FormattedMessage id={props.label} />
      </div>
    </StyledDiv>
  );

  const tooltip = props.tooltip;
  if (!tooltip) {
    return item;
  }

  return (
    <TippyTooltip
      placement="left"
      render={() => (
        <div>
          <FormattedMessage id={tooltip} />
        </div>
      )}
    >
      {item}
    </TippyTooltip>
  );
});

ToolbarItem.displayName = 'ToolbarItem';

export default ToolbarItem;

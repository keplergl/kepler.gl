// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import {FormattedMessage} from '@kepler.gl/localization';
import {ComponentType, MouseEvent} from 'react';

interface StyledDivProps {
  active?: boolean;
}

const StyledDiv = styled.div.attrs(props => ({
  className: classnames('toolbar-item', props.className)
}))<StyledDivProps>`
  color: ${props =>
    props.active ? props.theme.toolbarItemIconHover : props.theme.panelHeaderIcon};
  padding: 12px 20px;
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 110px;
  justify-content: space-between;
  border: 1px solid ${props => (props.active ? props.theme.toolbarItemBorderHover : 'transparent')};
  border-radius: ${props => props.theme.toolbarItemBorderRaddius};
  background-color: ${props =>
    props.active ? props.theme.toolbarItemBgdHover : props.theme.dropdownListBgd};

  .toolbar-item__svg-container {
    margin-bottom: 4px;
  }
  .toolbar-item__title {
    white-space: nowrap;
    color: ${props => props.theme.textColorHl};
  }

  :hover {
    background-color: ${props => props.theme.toolbarItemBgdHover};
    border-color: ${props => props.theme.toolbarItemBorderHover};
    svg {
      color: ${props => props.theme.toolbarItemIconHover};
    }
    cursor: pointer;
  }
`;

export type ToolbarItemProps = {
  id?: string;
  key?: string;
  label: string;
  className?: string;
  active?: boolean;
  onClose?: () => void;
  onClick: ((event: MouseEvent<HTMLDivElement>) => void) | null;
  icon?: ComponentType<any>;
};

const ToolbarItem = React.memo((props: ToolbarItemProps) => (
  <StyledDiv
    id={props.id}
    className={props.className}
    active={props.active}
    onClick={e => {
      e.stopPropagation();
      e.preventDefault();
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
));

ToolbarItem.displayName = 'ToolbarItem';

export default ToolbarItem;

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {ComponentType, MouseEventHandler} from 'react';
import {TooltipProps} from 'react-tooltip';
import classnames from 'classnames';
import styled from 'styled-components';
import {FormattedMessage} from '@kepler.gl/localization';
import {Tooltip} from '../common/styled-components';
import {BaseProps} from '../common/icons';

export type PanelHeaderActionIcon = ComponentType<Partial<BaseProps>>;

export interface PanelHeaderActionProps {
  id?: string;
  tooltip?: string;
  hoverColor?: string;
  className?: string;
  active?: boolean;
  flush?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler;
  tooltipType?: TooltipProps['type'];
  IconComponent: PanelHeaderActionIcon;
  testId?: string;
}

type HeaderActionWrapperProps = {
  flush?: boolean;
  active?: boolean;
  hoverColor?: string | null;
  testId?: string;
};

const HeaderActionWrapper = styled.div.attrs((props: HeaderActionWrapperProps) => ({
  dataTestId: props.testId
}))<HeaderActionWrapperProps>`
  margin-left: ${props => (props.flush ? 0 : 8)}px;
  display: flex;
  align-items: center;
  color: ${props =>
    props.active ? props.theme.panelHeaderIconActive : props.theme.panelHeaderIcon};

  cursor: pointer;

  :hover {
    color: ${props =>
      props.hoverColor ? props.theme[props.hoverColor] : props.theme.panelHeaderIconHover};
  }

  &.disabled {
    cursor: none;
    pointer-events: none;
    opacity: 0.3;
  }
`;

PanelHeaderActionFactory.deps = [];
// Need to use react class to access props.component
export default function PanelHeaderActionFactory(): React.FC<PanelHeaderActionProps> {
  const PanelHeaderActionUnmemoized: React.FC<PanelHeaderActionProps> = ({
    onClick,
    tooltip,
    id,
    active = false,
    flush,
    hoverColor,
    tooltipType,
    disabled,
    className,
    IconComponent,
    testId
  }) => {
    return (
      <HeaderActionWrapper
        className={classnames('panel--header__action', {
          disabled,
          ...(className ? {[className]: true} : {})
        })}
        active={active}
        hoverColor={hoverColor}
        flush={flush}
      >
        {IconComponent ? (
          <IconComponent
            className="panel--header__action__component"
            data-testid={testId}
            data-tip
            data-for={`${tooltip}_${id}`}
            height="16px"
            onClick={onClick}
          />
        ) : null}
        {tooltip ? (
          <Tooltip id={`${tooltip}_${id}`} effect="solid" delayShow={500} type={tooltipType}>
            <span>
              <FormattedMessage id={tooltip} />
            </span>
          </Tooltip>
        ) : null}
      </HeaderActionWrapper>
    );
  };

  const PanelHeaderAction = React.memo(PanelHeaderActionUnmemoized);
  PanelHeaderAction.displayName = 'PanelHeaderAction';
  return PanelHeaderAction;
}

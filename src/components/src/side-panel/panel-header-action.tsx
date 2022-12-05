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

import React, {ComponentType, MouseEventHandler} from 'react';
import {TooltipProps} from 'react-tooltip';
import classnames from 'classnames';
import styled from 'styled-components';
import {FormattedMessage} from '@kepler.gl/localization';
import {Tooltip} from '../common/styled-components';
import {BaseProps} from '../common/icons';

interface PanelHeaderActionProps {
  id?: string;
  tooltip?: string;
  hoverColor?: string;
  className?: string;
  active?: boolean;
  flush?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler;
  tooltipType?: TooltipProps['type'];
  IconComponent: ComponentType<Partial<BaseProps>>;
}

type HeaderActionWrapperProps = {
  flush?: boolean;
  active?: boolean;
  hoverColor?: string | null;
};

const HeaderActionWrapper = styled.div<HeaderActionWrapperProps>`
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
    IconComponent
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
          <IconComponent data-tip data-for={`${tooltip}_${id}`} height="16px" onClick={onClick} />
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

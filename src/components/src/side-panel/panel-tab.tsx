// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {Tooltip} from '../common/styled-components';
import {FormattedMessage} from '@kepler.gl/localization';
import {BaseProps} from '../common/icons';

type StyledPanelTabProps = {
  active?: boolean;
};

export type PanelItem = {
  id: string;
  label: string;
  iconComponent: React.ComponentType<Partial<BaseProps>>;
};

export type PanelTabProps = {
  isActive: boolean;
  panel: PanelItem;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
};

export const StyledPanelTab = styled.div.attrs({
  className: 'side-panel__tab'
})<StyledPanelTabProps>`
  align-items: flex-end;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: ${props =>
    props.active ? props.theme.panelToggleBorderColor : 'transparent'};
  color: ${props => (props.active ? props.theme.subtextColorActive : props.theme.panelTabColor)};
  display: flex;
  justify-content: center;
  margin-right: ${props => props.theme.panelToggleMarginRight}px;
  padding-bottom: ${props => props.theme.panelToggleBottomPadding}px;
  width: ${props => props.theme.panelTabWidth};

  :hover {
    cursor: pointer;
    color: ${props => props.theme.textColorHl};
  }
`;

export function PanelTabFactory() {
  const PanelTab: React.FC<PanelTabProps> = ({isActive, onClick, panel}) => (
    <StyledPanelTab data-tip data-for={`${panel.id}-nav`} active={isActive} onClick={onClick}>
      <panel.iconComponent height="20px" />
      <Tooltip id={`${panel.id}-nav`} effect="solid" delayShow={500} place="bottom">
        <span>
          <FormattedMessage id={panel.label || panel.id} />
        </span>
      </Tooltip>
    </StyledPanelTab>
  );

  return PanelTab;
}

export default PanelTabFactory;

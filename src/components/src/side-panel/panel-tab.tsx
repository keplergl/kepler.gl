// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {Tooltip} from '../common/styled-components';
import {useIntl} from 'react-intl';
import {FormattedMessage} from '@kepler.gl/localization';
import {BaseProps} from '../common/icons';

type StyledPanelTabProps = {
  $active?: boolean;
};

export type PanelItem = {
  id: string;
  label: string;
  iconComponent: React.ComponentType<Partial<BaseProps>>;
};

export type PanelTabProps = {
  isActive: boolean;
  panel: PanelItem;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const StyledPanelTab = styled.button.attrs({
  className: 'side-panel__tab',
  type: 'button'
})<StyledPanelTabProps>`
  align-items: flex-end;
  background: transparent;
  border: 0;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: ${props =>
    props.$active ? props.theme.panelToggleBorderColor : 'transparent'};
  color: ${props => (props.$active ? props.theme.subtextColorActive : props.theme.panelTabColor)};
  display: flex;
  justify-content: center;
  margin-right: ${props => props.theme.panelToggleMarginRight}px;
  padding: 0 0 ${props => props.theme.panelToggleBottomPadding}px;
  width: ${props => props.theme.panelTabWidth};

  &:hover {
    cursor: pointer;
    color: ${props => props.theme.textColorHl};
  }

  &:focus-visible {
    outline: 2px solid ${props => props.theme.activeColor};
    outline-offset: -2px;
  }
`;

export function PanelTabFactory() {
  const PanelTab: React.FC<PanelTabProps> = ({isActive, onClick, panel}) => {
    const intl = useIntl();
    const labelId = panel.label || panel.id;

    return (
      <StyledPanelTab
        data-tip
        data-for={`${panel.id}-nav`}
        aria-label={intl.formatMessage({id: labelId, defaultMessage: labelId})}
        aria-pressed={isActive}
        $active={isActive}
        onClick={onClick}
      >
        <panel.iconComponent height="20px" aria-hidden="true" />
        <Tooltip id={`${panel.id}-nav`} effect="solid" delayShow={500} place="bottom">
          <span>
            <FormattedMessage id={labelId} />
          </span>
        </Tooltip>
      </StyledPanelTab>
    );
  };

  return PanelTab;
}

export default PanelTabFactory;

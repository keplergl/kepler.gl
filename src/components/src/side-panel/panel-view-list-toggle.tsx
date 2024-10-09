// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
import styled from 'styled-components';
import OrderByList from '../common/icons/order-by-list';
import OrderByDataset from '../common/icons/order-by-dataset';
import {Tooltip} from '../common/styled-components';
import {FormattedMessage} from '@kepler.gl/localization';
import {PanelListView} from '@kepler.gl/types';
import {PANEL_VIEW_TOGGLES} from '@kepler.gl/constants';

type ToggleOptionProps = {
  isActive: boolean;
  onClick: () => void;
  option: (typeof TOGGLE_OPTIONS)[0];
};

type PanelViewListToggleProps = {
  mode: PanelListView;
  togglePanelListView: (view: string) => void;
};

const PanelViewListToggleContainer = styled.div.attrs({
  className: 'panel-view-list-toggle'
})``;

const PanelViewListToggleWrapper = styled.div.attrs({
  className: 'panel-view-list-toggle-inner'
})`
  display: flex;
  justify-content: flex-end;
  align-content: center;
  gap: 10px;
`;

export const StyledToggleOption = styled.div.attrs({
  className: 'layer-panel-toggle-option'
})<{active: boolean}>`
  color: ${props => (props.active ? props.theme.subtextColorActive : props.theme.panelTabColor)};
  :hover {
    cursor: pointer;
    color: ${props => props.theme.subtextColorActive};
  }
`;

function ToggleOptionFactory() {
  const ToggleOption: React.FC<ToggleOptionProps> = ({isActive, onClick, option}) => (
    <StyledToggleOption
      data-tip
      data-for={`${option.id}-toggle-option`}
      active={isActive}
      onClick={onClick}
    >
      <option.iconComponent height="20px" />
      <Tooltip id={`${option.id}-toggle-option`} effect="solid" delayShow={500} place="bottom">
        <span>
          <FormattedMessage id={option.label} />
        </span>
      </Tooltip>
    </StyledToggleOption>
  );

  return ToggleOption;
}

const TOGGLE_OPTIONS = [
  {
    id: PANEL_VIEW_TOGGLES.list,
    iconComponent: OrderByList,
    label: 'sidebar.panelViewToggle.list'
  },
  {
    id: PANEL_VIEW_TOGGLES.byDataset,
    iconComponent: OrderByDataset,
    label: 'sidebar.panelViewToggle.byDataset'
  }
];

PanelViewListToggleFactory.deps = [ToggleOptionFactory];

function PanelViewListToggleFactory(ToggleOption: ReturnType<typeof ToggleOptionFactory>) {
  const PanelViewListToggle: React.FC<PanelViewListToggleProps> = ({mode, togglePanelListView}) => {
    const toggleListView = listView => togglePanelListView(listView);

    const options = useMemo(
      () => TOGGLE_OPTIONS.map(opt => ({...opt, isActive: mode === opt.id})),
      [mode]
    );

    return (
      <PanelViewListToggleContainer>
        <PanelViewListToggleWrapper>
          {options.map(opt => (
            <ToggleOption
              key={opt.id}
              onClick={() => toggleListView(opt.id)}
              option={opt}
              isActive={opt.isActive}
            />
          ))}
        </PanelViewListToggleWrapper>
      </PanelViewListToggleContainer>
    );
  };

  return PanelViewListToggle;
}

export default PanelViewListToggleFactory;

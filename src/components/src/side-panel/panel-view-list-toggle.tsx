// Copyright (c) 2023 Uber Technologies, Inc.
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
  option: typeof TOGGLE_OPTIONS[0];
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

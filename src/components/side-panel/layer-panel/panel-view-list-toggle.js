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

import React, {useMemo} from 'react';
import styled from 'styled-components';
import OrderByList from 'components/common/icons/order-by-list';
import OrderByDataset from 'components/common/icons/order-by-dataset';
import {Tooltip} from 'components/common/styled-components';
import {FormattedMessage} from 'localization';

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
})`
  color: ${props =>
    props.active
      ? props.theme.layerPanelToggleOptionColorActive
      : props.theme.layerPanelToggleOptionColor};
  :hover {
    cursor: pointer;
    color: ${props => props.theme.layerPanelToggleOptionColorActive};
  }
`;

function ToggleOptionFactory() {
  const ToggleOption = ({isActive, onClick, option}) => (
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
    id: 'list',
    iconComponent: OrderByList,
    value: 'list',
    label: 'List'
  },
  {
    id: 'sort-by-dataset',
    iconComponent: OrderByDataset,
    value: 'sortByDataset',
    label: 'Sort by dataset'
  }
];

PanelViewListToggleFactory.deps = [ToggleOptionFactory];

function PanelViewListToggleFactory(ToggleOption) {
  const PanelViewListToggle = props => {
    const {layerPanelListViewMode, toggleLayerPanelListView} = props;

    const toggleListView = listView => toggleLayerPanelListView(listView);
    const options = useMemo(
      () => TOGGLE_OPTIONS.map(opt => ({...opt, isActive: layerPanelListViewMode === opt.value})),
      [layerPanelListViewMode]
    );

    return (
      <PanelViewListToggleContainer>
        <PanelViewListToggleWrapper>
          {options.map(opt => (
            <ToggleOption
              key={opt.id}
              onClick={() => toggleListView(opt.value)}
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

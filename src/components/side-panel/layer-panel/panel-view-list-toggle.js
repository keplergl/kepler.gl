import React, {useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import OrderByList from 'components/common/icons/order-by-list';
import OrderByDataset from 'components/common/icons/order-by-dataset';
import {Tooltip} from 'components/common/styled-components';
import {FormattedMessage} from 'localization';
import {toggleLayerPanelListView} from 'actions/ui-state-actions';

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
  const PanelViewListToggle = () => {
    const layerPanelListViewMode = useSelector(
      state => state.demo.keplerGl.map.uiState.layerPanelListView
    );
    const dispatch = useDispatch();

    const toggleListView = listView => dispatch(toggleLayerPanelListView(listView));
    const options = useMemo(
      () =>
        TOGGLE_OPTIONS.map(opt => {
          return layerPanelListViewMode === opt.value
            ? {...opt, isActive: true}
            : {...opt, isActive: false};
        }),
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

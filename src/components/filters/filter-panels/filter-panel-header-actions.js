import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import PanelHeaderAction from 'components/side-panel/panel-header-action';
import {Trash} from 'components/common/icons';

const StyledPanelActions = styled.div`
  padding-top: 8px;
  display: flex;
`;

function FilterPanelHeaderActionsFactory() {
  const FilterPanelHeaderActions = ({actions = [], filter, removeFilter}) => (
    <StyledPanelActions>
      {actions.map(panelAction => (
        <PanelHeaderAction
          id={panelAction.id}
          key={panelAction.id}
          onClick={panelAction.onClick}
          tooltip={panelAction.tooltip}
          IconComponent={panelAction.iconComponent}
          active={panelAction.active}
        />
      ))}
      <PanelHeaderAction
        id={filter.id}
        tooltip="delete"
        tooltipType="error"
        onClick={removeFilter}
        hoverColor={'errorColor'}
        IconComponent={Trash}
      />
    </StyledPanelActions>
  );

  FilterPanelHeaderActions.propTypes = {
    actions: PropTypes.arrayOf(PropTypes.object),
    filter: PropTypes.object.isRequired,
    removeFilter: PropTypes.func.isRequired
  };

  FilterPanelHeaderActions.displayName = 'FilterPanelHeaderActions';

  return FilterPanelHeaderActions;
}

export default FilterPanelHeaderActionsFactory;

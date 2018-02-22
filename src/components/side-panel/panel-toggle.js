import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {Tooltip} from 'components/common/styled-components';

const propTypes = {
  panels: PropTypes.array,
  activePanel: PropTypes.string,
  togglePanel: PropTypes.func
};

const PanelHeaderBottom = styled.div.attrs({
  className: 'side-side-panel__header__bottom'
})`
  background-color: ${props => props.theme.sidePanelHeaderBg};
  padding: 0 16px;
  display: flex;
  min-height: 30px;
`;

const PanelTab = styled.div.attrs({
  className: 'side-panel__tab'
})`
  align-items: flex-end;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: ${props =>
  props.active ? props.theme.subtextColorActive : 'transparent'};
  color: ${props =>
  props.active ? props.theme.subtextColorActive : props.theme.subtextColor};
  display: flex;
  justify-content: center;
  margin-right: 12px;
  padding-bottom: 6px;
  width: 30px;
  
  :hover {
    cursor: pointer;
    color: ${props => props.theme.textColorHl};
  }
`;

const PanelToggle = ({panels, activePanel, togglePanel}) => (
  <PanelHeaderBottom>
    {panels.map(panel => (
      <PanelTab
        key={panel.id}
        data-tip
        data-for={`${panel.id}-nav`}
        active={activePanel === panel.id}
        onClick={() => togglePanel(panel.id)}
      >
        <panel.iconComponent height="20px" />
        <Tooltip
          id={`${panel.id}-nav`}
          effect="solid"
          delayShow={500}
          place="bottom"
        >
          <span>{panel.label || panel.id}</span>
        </Tooltip>
      </PanelTab>
    ))}
  </PanelHeaderBottom>
);

PanelToggle.propTypes = propTypes;

export default PanelToggle;

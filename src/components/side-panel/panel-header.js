import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {Tooltip} from 'components/common/styled-components';
import KeplerGlLogo from 'components/common/logo';
import {Email, Docs, Save} from 'components/common/icons';

const StyledPanelHeader = styled.div.attrs({
  className: 'side-side-panel__header'
})`
  background-color: ${props => props.theme.sidePanelHeaderBg};
  padding: 12px 16px 0 16px;
`;

const StyledPanelHeaderTop = styled.div.attrs({
  className: 'side-panel__header__top'
})`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  width: 100%;
`;

const StyledPanelTopActions = styled.div.attrs({
  className: 'side-panel__header__actions'
})`
  display: flex;
`;

const StyledPanelAction = styled.div.attrs({
  className: 'side-panel__header__actions'
})`
  align-items: center;
  border-radius: 2px;
  color: ${props =>
    props.active ? props.theme.textColorHl : props.theme.subtextColor};
  display: flex;
  height: 26px;
  justify-content: center;
  margin-left: 4px;
  width: 26px;

  :hover {
    cursor: pointer;
    background-color: ${props => props.theme.secondaryBtnActBgd};
    color: ${props => props.theme.textColorHl};
  }
`;

const defaultActionItems = [
  {
    id: 'email',
    iconComponent: Email,
    tooltip: 'Email us',
    onClick: () => {}
  },
  {
    id: 'docs',
    iconComponent: Docs,
    tooltip: 'Documentation',
    onClick: () => {}
  },
  {
    id: 'save',
    iconComponent: Save,
    tooltip: 'Save / Export',
    onClick: () => {}
  }
];

const defaultProps = {
  logoComponent: KeplerGlLogo,
  actionItems: defaultActionItems
};

const propTypes = {
  logoComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  actionItems: PropTypes.array
};

const PanelAction = ({item}) => (
  <StyledPanelAction
    data-tip
    data-for={`${item.id}-action`}
  >
    <item.iconComponent height="20px" />
    <Tooltip
      id={`${item.id}-action`}
      place="bottom"
      delayShow={500}
      effect="solid"
    >
      <span>{item.tooltip}</span>
    </Tooltip>
  </StyledPanelAction>
);

const PanelHeader = (props) => (
  <StyledPanelHeader>
    <StyledPanelHeaderTop>
      <props.logoComponent/>
      <StyledPanelTopActions>
        {props.actionItems.map(item => (
          <PanelAction key={item.id} item={item}/>
        ))}
      </StyledPanelTopActions>
    </StyledPanelHeaderTop>
  </StyledPanelHeader>
);

PanelHeader.defaultProps = defaultProps;
PanelHeader.propTypes = propTypes;

export default PanelHeader;
export const PanelHeaderFactory = () => PanelHeader;

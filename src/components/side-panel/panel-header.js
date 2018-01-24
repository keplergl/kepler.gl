import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {Tooltip} from 'components/common/styled-components';
import KeplerGlLogo from 'components/common/logo';
import {Email, Docs, Save} from 'components/common/icons';
import {PANELS} from 'constants/default-settings';

const PanelHeaderWrapper = styled.div.attrs({
  className: 'side-side-panel__header'
})`
  background-color: ${props => props.theme.sidePanelHeaderBg};
  padding: 12px 16px 0 16px;
`;

const PanelHeaderTop = styled.div.attrs({
  className: 'side-panel__header__top'
})`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  width: 100%;
`;

const PanelHeaderBottom = styled.div.attrs({
  className: 'side-side-panel__header__bottom'
})`
  display: flex;
`;

const PanelTopActions = styled.div.attrs({
  className: 'side-panel__header__actions'
})`
  display: flex;
`;

const PanelAction = styled.div.attrs({
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

const PanelTab = styled.div.attrs({
  className: 'side-panel__tab'
})`
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: ${props =>
    props.active ? props.theme.subtextColorActive : 'transparent'};
  color: ${props =>
    props.active ? props.theme.subtextColorActive : props.theme.subtextColor};
  display: flex;
  height: 30px;
  justify-content: center;
  margin-right: 12px;
  width: 30px;

  :hover {
    cursor: pointer;
    color: ${props => props.theme.textColorHl};
  }
`;

const defaultActionItems = [
  {
    id: 'email',
    iconComponent: Email,
    tooltip: 'Email us with questions',
    onClick: () => {}
  },
  {
    id: 'docs',
    iconComponent: Docs,
    tooltip: 'Link to Documentation',
    onClick: () => {}
  },
  {
    id: 'save',
    iconComponent: Save,
    tooltip: 'Save Current Map',
    onClick: () => {}
  }
];

const defaultProps = {
  logoComponent: KeplerGlLogo,
  actionItems: defaultActionItems,
  panels: PANELS,
  currentPanel: 'layer'
};

const propTypes = {
  logoComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  actionItems: PropTypes.array,
  panels: PropTypes.array,
  currentPanel: PropTypes.string,
  togglePanel: PropTypes.func
};

class PanelHeader extends Component {
  render() {
    const {actionItems, panels, togglePanel, currentPanel} = this.props;

    return (
      <PanelHeaderWrapper>
        <PanelHeaderTop>
          <this.props.logoComponent />
          <PanelTopActions>
            {actionItems.map(item => (
              <PanelAction
                key={item.id}
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
              </PanelAction>
            ))}
          </PanelTopActions>
        </PanelHeaderTop>
        <PanelHeaderBottom>
          {panels.map(panel => (
            <PanelTab
              key={panel.id}
              data-tip
              data-for={`${panel.id}-nav`}
              active={currentPanel === panel.id}
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
      </PanelHeaderWrapper>
    );
  }
}

PanelHeader.defaultProps = defaultProps;
PanelHeader.propTypes = propTypes;

export default PanelHeader;

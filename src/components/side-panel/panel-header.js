// Copyright (c) 2018 Uber Technologies, Inc.
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

import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {Tooltip} from 'components/common/styled-components';
import KeplerGlLogo from 'components/common/logo';
import {Save, Layers, Share} from 'components/common/icons';
import PanelDropdown from 'components/side-panel/panel-dropdown';

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
  
  a {
    height: 20px;
  }
  
  :hover {
    cursor: pointer;
    background-color: ${props => props.theme.secondaryBtnActBgd};
    color: ${props => props.theme.textColorHl};
    
    a {
      color: ${props => props.theme.textColorHl};
    }
  }
`;

const StyledPanelDropdown = styled.div`
  background-color: ${props => props.theme.dropdownListBgd};
  box-shadow: ${props => props.theme.dropdownListShadow};
  font-size: 11px;
  padding: 16px 0;
  position: absolute;
  transition: ${props => props.theme.transitionSlow};
  display: flex;
  margin-top: ${props => props.show ? '6px' : '20px'};
  opacity: ${props => props.show ? 1 : 0};
  transform: translateX(calc(-50% + 20px));
  pointer-events:  ${props => props.show ? 'all' : 'none'};
  
  .save-export-dropdown__inner {
    box-shadow: none;
    background-color: transparent;
    display: flex;
  }

  .save-export-dropdown__item {
    align-items: center;
    border-right: 1px solid ${props => props.theme.panelHeaderIcon};
    color: ${props => props.theme.textColor};
    display: flex;
    flex-direction: column;
    padding: 0 22px;

    :hover {
      cursor: pointer;
      color: ${props => props.theme.textColorHl};
    }

    &:last-child {
      border-right: 0;
    }
  }

  .save-export-dropdown__title {
    white-space: nowrap;
    margin-top: 4px;
  }
`;

const propTypes = {
  logoComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  actionItems: PropTypes.array
};

export const PanelAction = ({item, onClick}) => (
  <StyledPanelAction className="side-panel__panel-header__action"
    data-tip data-for={`${item.id}-action`} onClick={onClick}>
    <a target={item.blank ? '_blank' : ''} href={item.href}>
      <item.iconComponent height="20px" />
    </a>
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

export const SaveExportDropdown = ({
  onDownloadData,
  onSaveMap,
  show,
  onClose
}) => {
  return (
    <StyledPanelDropdown show={show} className="save-export-dropdown">
      <PanelDropdown onClose={onClose} className="save-export-dropdown__inner">
        <div className="save-export-dropdown__item" onClick={(e) => {
          e.stopPropagation();
          onClose();
          onDownloadData();
        }}>
          <Layers height="16px" />
          <div className="save-export-dropdown__title">Export Data</div>
        </div>

        {onSaveMap ? (
          <div className="save-export-dropdown__item" onClick={(e) => {
            e.stopPropagation();
            onClose();
            onSaveMap();
          }}>
            <Share height="16px" />
            <div className="save-export-dropdown__title">Save Map Url</div>
          </div>
        ) : null}
      </PanelDropdown>
    </StyledPanelDropdown>
  );
};

const defaultActionItems = [
  {
    id: 'save',
    iconComponent: Save,
    tooltip: 'Save / Export',
    onClick: () => {},
    dropdownComponent: SaveExportDropdown
  }
];

const defaultProps = {
  logoComponent: KeplerGlLogo,
  actionItems: defaultActionItems
};

function PanelHeaderFactory() {
  class PanelHeader extends Component {
    state = {
      dropdown: null
    };

    showDropdown = id => {
      this.setState({dropdown: id});
    };

    hideDropdown = () => {
      this.setState({dropdown: null});
    };

    render() {
      const {
        appName,
        version,
        actionItems,
        onSaveMap,
        onDownloadData
      } = this.props;
      return (
        <StyledPanelHeader className="side-panel__panel-header">
          <StyledPanelHeaderTop className="side-panel__panel-header__top">
            <this.props.logoComponent appName={appName} version={version}/>
            <StyledPanelTopActions>
              {actionItems.map(item => (
                <div className="side-panel__panel-header__right"
                  key={item.id} style={{position: 'relative'}}>
                  <PanelAction
                    item={item}
                    onClick={() => {
                      if (item.dropdownComponent) {
                        this.showDropdown(item.id);
                      }

                      item.onClick();
                    }}
                  />
                  {item.dropdownComponent ? (
                    <item.dropdownComponent
                      onClose={this.hideDropdown}
                      show={this.state.dropdown === item.id}
                      onSaveMap={onSaveMap}
                      onDownloadData={onDownloadData}
                    />
                  ) : null}
                </div>
              ))}
            </StyledPanelTopActions>
          </StyledPanelHeaderTop>
        </StyledPanelHeader>
      );
    }
  }

  PanelHeader.defaultProps = defaultProps;
  PanelHeader.propTypes = propTypes;

  return PanelHeader;
}

export default PanelHeaderFactory;

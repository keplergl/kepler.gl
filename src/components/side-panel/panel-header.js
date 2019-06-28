// Copyright (c) 2019 Uber Technologies, Inc.
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
import {Save, Files, Share, Picture, Map} from 'components/common/icons';
import ClickOutsideCloseDropdown from 'components/side-panel/panel-dropdown';
import Toolbar from 'components/common/toolbar';
import ToolbarItem from 'components/common/toolbar-item';

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
  justify-content: space-between;
  margin-left: 4px;
  width: 70px;
  padding: 5px;
  font-weight: bold;
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

// By assigning this style we can position the toolbar in the right place on the screen
const StyledToolbar = styled(Toolbar)`
  position: absolute;
  left: 64px;
`;

export const PanelAction = ({item, onClick}) => (
  <StyledPanelAction className="side-panel__panel-header__action"
    data-tip data-for={`${item.id}-action`} onClick={onClick}>
    {item.label ? <p>{item.label}</p> : null}
    <a target={item.blank ? '_blank' : ''} href={item.href}>
      <item.iconComponent height="20px" />
    </a>
    {item.tooltip ? (<Tooltip
      id={`${item.id}-action`}
      place="bottom"
      delayShow={500}
      effect="solid"
    >
      <span>{item.tooltip}</span>
    </Tooltip>) : null }
  </StyledPanelAction>
);

export const ExportImageFactory = () => {
  const ExportImage = (props) => (
    <ToolbarItem {...props}/>
  );
  ExportImage.defaultProps = {
    label: 'Export Image',
    icon: <Picture />
  };

  return ExportImage;
};

export const ExportDataFactory = () => {
  const ExportData = (props) => (
    <ToolbarItem {...props}/>
  );
  ExportData.defaultProps = {
    label: 'Export Data',
    icon: <Files />
  };

  return ExportData;
};

export const ExportMapFactory = () => {
  const ExportMap = (props) => (
    <ToolbarItem {...props}/>
  );
  ExportMap.defaultProps = {
    label: 'Export Map',
    icon: <Map />
  };

  return ExportMap;
};

export const SaveMapFactory = () => {
  const SaveMap = (props) => (
    <ToolbarItem {...props}/>
  );
  SaveMap.defaultProps = {
    label: 'Save Map',
    icon: <Share />
  };

  return SaveMap;
};

export const SaveExportDropdownFactory = (
  ExportImage,
  ExportData,
  ExportMap,
  SaveMap) => {

  const SaveExportDropdown = ({
    onExportImage,
    onExportData,
    onExportConfig,
    onExportMap,
    onSaveMap,
    show,
    onClose
  }) => {
    return (
      <StyledToolbar show={show} onClose={onClose} className="save-export-dropdown">
        <ClickOutsideCloseDropdown className="save-export-dropdown__inner"
                                   show={show}
                                   onClose={onClose}>
        <ExportImage
          onClick={() => {
            onExportImage();
            onClose();
          }}
        />
        <ExportData
          onClick={() => {
            onExportData();
            onClose();
          }}
        />
        <ExportMap
          onClick={() => {
            onExportMap();
            onClose();
          }}
        />
        {onSaveMap ? (
          <SaveMap
            onClick={() => {
              onSaveMap();
              onClose();
            }}
          />
        ) : null}
        </ClickOutsideCloseDropdown>
      </StyledToolbar>

    );
  };

  return SaveExportDropdown;
};

SaveExportDropdownFactory.deps = [
  ExportImageFactory,
  ExportDataFactory,
  ExportMapFactory,
  SaveMapFactory
];

PanelHeaderFactory.deps = [
  SaveExportDropdownFactory
];

function PanelHeaderFactory(
  SaveExportDropdown
) {
  return class PanelHeader extends Component {
    static propTypes = {
      appName: PropTypes.string,
      version: PropTypes.string,
      uiState: PropTypes.object,
      uiStateActions: PropTypes.object,
      logoComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
      actionItems: PropTypes.arrayOf(PropTypes.any)
    };

    static defaultProps = {
      logoComponent: KeplerGlLogo,
      actionItems: [{
        id: 'save',
        iconComponent: Save,
        onClick: () => {},
        label: 'Share',
        dropdownComponent: SaveExportDropdown
      }]
    };

    render() {
      const {
        appName,
        version,
        actionItems,
        onSaveMap,
        onExportImage,
        onExportData,
        onExportConfig,
        onExportMap,
        visibleDropdown,
        showExportDropdown,
        hideExportDropdown
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
                        showExportDropdown(item.id);
                      }
                      item.onClick();
                    }}
                  />
                  {item.dropdownComponent ? (
                    <item.dropdownComponent
                      onClose={hideExportDropdown}
                      show={visibleDropdown === item.id}
                      onSaveMap={onSaveMap}
                      onExportData={onExportData}
                      onExportImage={onExportImage}
                      onExportConfig={onExportConfig}
                      onExportMap={onExportMap}
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
}

export default PanelHeaderFactory;

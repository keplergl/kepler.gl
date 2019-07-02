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
import {Button} from 'components/common/styled-components';
// import KeplerGlLogo from 'components/common/logo';
// import {CodeAlt, Save, Files, Share, Picture} from 'components/common/icons';
// import ClickOutsideCloseDropdown from 'components/side-panel/panel-dropdown';

const StyledPanelHeading = styled.div.attrs({
  className: 'side-side-panel__heading'
})`
  background-color: #18273e;
  padding: 10px;
`;

const StyledHeadingTitle = styled.button.attrs({
    className: 'side-side-panel__heading-title'
})`
background-color: #2C3C54;
  font-weight: 400;
  font-family: ff-clan-web-pro, 'Helvetica Neue', Helvetica, sans-serif;
  display: flex;
  flex-direction:row;
  color: ${props => props.theme.labelColor};
  border-width: 0;
  cursor: pointer;
  outline: 0;
  text-align: left;
  margin-bottom: 5px;
  //background-color: #29323c;
  padding: 10px 10px;
  //border-radius: 10px;
  width: 95%;
  //box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  overflow: hidden;
  :hover {
    //color: #000000;
    //background-color: #ffffff;
    border: 1px solid #3ba7ef;
  }
`;

export const StyledCityTitle = styled.div`
  font-size: 1.5em;
  font-weight: 400;
`;

export const StyledRegionTitle = styled.div`
  font-size: 1.0em;
  font-weight: 200;
  color: ${props => props.theme.labelColor};
`;

export const StyledTitleContainer = styled.div`
  display:flex;
  flex-direction:column;
`;

const ArrowSvg = () => (
  <svg
    className="side-panel-logo__logo"
    width="30px"
    height="30px"
    viewBox="0 0 22 15"
  >
    <g transform="translate(11, -3) rotate(45.000000)">
      <rect fill="#1FBAD6" x="2" y="5" width="10" height="10" />
      <rect fill="#2C3C54" x="5" y="2" width="10" height="10" />
    </g>
  </svg>
);

// const StyledPanelHeaderTop = styled.div.attrs({
//   className: 'side-panel__header__top'
// })`
//   display: flex;
//   justify-content: space-between;
//   margin-bottom: 16px;
//   width: 100%;
// `;

// const StyledPanelTopActions = styled.div.attrs({
//   className: 'side-panel__header__actions'
// })`
//   display: flex;
// `;

// const StyledPanelAction = styled.div.attrs({
//   className: 'side-panel__header__actions'
// })`
//   align-items: center;
//   border-radius: 2px;
//   color: ${props =>
//     props.active ? props.theme.textColorHl : props.theme.subtextColor};
//   display: flex;
//   height: 26px;
//   justify-content: space-between;
//   margin-left: 4px;
//   width: 70px;
//   padding: 5px;
//   font-weight: bold;
//   a {
//     height: 20px;
//   }

//   :hover {
//     cursor: pointer;
//     background-color: ${props => props.theme.secondaryBtnActBgd};
//     color: ${props => props.theme.textColorHl};

//     a {
//       color: ${props => props.theme.textColorHl};
//     }
//   }
// `;

// const StyledPanelDropdown = styled.div`
//   background-color: ${props => props.theme.dropdownListBgd};
//   box-shadow: ${props => props.theme.dropdownListShadow};
//   font-size: 11px;
//   padding: 16px 0;
//   position: absolute;
//   transition: ${props => props.theme.transitionSlow};
//   display: flex;
//   margin-top: ${props => props.show ? '6px' : '20px'};
//   opacity: ${props => props.show ? 1 : 0};
//   transform: translateX(calc(-50% + 20px));
//   pointer-events:  ${props => props.show ? 'all' : 'none'};
//   z-index: 1000;

//   .save-export-dropdown__inner {
//     box-shadow: none;
//     background-color: transparent;
//     display: flex;
//   }

//   .save-export-dropdown__item {
//     align-items: center;
//     border-right: 1px solid ${props => props.theme.panelHeaderIcon};
//     color: ${props => props.theme.textColor};
//     display: flex;
//     flex-direction: column;
//     padding: 0 22px;

//     :hover {
//       cursor: pointer;
//       color: ${props => props.theme.textColorHl};
//     }

//     &:last-child {
//       border-right: 0;
//     }
//   }

//   .save-export-dropdown__title {
//     white-space: nowrap;
//     margin-top: 4px;
//   }
// `;

// export const PanelAction = ({item, onClick}) => (
//   <StyledPanelAction className="side-panel__panel-header__action"
//     data-tip data-for={`${item.id}-action`} onClick={onClick}>
//     {item.label ? <p>{item.label}</p> : null}
//     <a target={item.blank ? '_blank' : ''} href={item.href}>
//       <item.iconComponent height="20px" />
//     </a>
//     {item.tooltip ? (<Tooltip
//       id={`${item.id}-action`}
//       place="bottom"
//       delayShow={500}
//       effect="solid"
//     >
//       <span>{item.tooltip}</span>
//     </Tooltip>) : null }
//   </StyledPanelAction>
// );

// const PanelItem = ({onClose, onClickHandler, label, icon}) => (
//   <div className="save-export-dropdown__item" onClick={(e) => {
//     e.stopPropagation();
//     onClose();
//     onClickHandler();
//   }}>
//     {icon}
//     <div className="save-export-dropdown__title">{label}</div>
//   </div>
// );

// export const SaveExportDropdown = ({
//   onExportImage,
//   onExportData,
//   onExportConfig,
//   onSaveMap,
//   show,
//   onClose
// }) => {
//   return (
//     <StyledPanelDropdown show={show} className="save-export-dropdown">
//       <ClickOutsideCloseDropdown className="save-export-dropdown__inner"
//         show={show}
//         onClose={onClose}>
//         <PanelItem
//           label="Export Image"
//           onClickHandler={onExportImage}
//           onClose={onClose}
//           icon={(<Picture height="16px" />)}
//         />

//         <PanelItem
//           label="Export Data"
//           onClickHandler={onExportData}
//           onClose={onClose}
//           icon={(<Files height="16px" />)}
//         />

//         <PanelItem
//           label="Export Config"
//           onClickHandler={onExportConfig}
//           onClose={onClose}
//           icon={(<CodeAlt height="16px" />)}
//         />

//         {onSaveMap ? (
//           <PanelItem
//             label="Save Map Url"
//             onClickHandler={onSaveMap}
//             onClose={onClose}
//             icon={(<Share height="16px" />)}
//           />
//         ) : null}
//       </ClickOutsideCloseDropdown>
//     </StyledPanelDropdown>
//   );
// };

// const defaultActionItems = [
//   {
//     id: 'save',
//     iconComponent: Save,
//     onClick: () => {},
//     label: 'Share',
//     dropdownComponent: SaveExportDropdown
//   }
// ];

function PanelHeadingFactory() {
  return class PanelHeading extends Component {
    // static propTypes = {
    //   appName: PropTypes.string,
    //   version: PropTypes.string,
    //   uiState: PropTypes.object,
    //   uiStateActions: PropTypes.object,
    //   logoComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    //   actionItems: PropTypes.arrayOf(PropTypes.any)
    // };

    // static defaultProps = {
    //   logoComponent: KeplerGlLogo,
    //   actionItems: defaultActionItems
    // };

    render() {
      const {
        cityName,
        regionName,
        onChangeCity
        // appName,
        // version,
        // actionItems,
        // onSaveMap,
        // onExportImage,
        // onExportData,
        // onExportConfig,
        // visibleDropdown,
        // showExportDropdown,
        // hideExportDropdown
      } = this.props;

      return (
        <StyledPanelHeading className="side-panel__panel-heading">
            <StyledHeadingTitle onClick={onChangeCity} className="side-panel__heading__title">
            <ArrowSvg/>
              <StyledTitleContainer>
                <StyledCityTitle>{cityName}</StyledCityTitle>
                <StyledRegionTitle>{regionName}</StyledRegionTitle>
              </StyledTitleContainer>
            </StyledHeadingTitle>
            {/* <Button onClick={this._onChangeCity} width="105px" secondary>
              Change City
            </Button> */}
        </StyledPanelHeading>
      );
    }
  }
}

export default PanelHeadingFactory;

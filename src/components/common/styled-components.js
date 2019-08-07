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

import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import {media} from 'styles/media-breakpoints';

export const SelectText = styled.span`
  color: ${props => props.theme.labelColor};
  font-size: ${props => props.theme.selectFontSize};
  font-weight: 400;

  i {
    font-size: 13px;
    margin-right: 6px;
  }
`;

export const SelectTextBold = styled(SelectText)`
  color: ${props => props.theme.textColor};
  font-weight: 500;
`;

export const IconRoundSmall = styled.div`
  display: flex;
  width: 18px;
  height: 18px;
  border-radius: 9px;
  background-color: ${props =>
    props.theme.secondaryBtnBgdHover}; // updated after checking sketch file
  color: ${props => props.theme.secondaryBtnColor};
  align-items: center;
  justify-content: center;

  :hover {
    cursor: pointer;
    background-color: ${props => props.theme.secondaryBtnBgdHover};
  }
`;

export const CenterFlexbox = styled.div`
  display: flex;
  align-items: center;
`;

export const SpaceBetweenFlexbox = styled.div`
  display: flex;
  align-items: space-between;
  margin-left: -16px;
`;
export const SBFlexboxItem = styled.div`
  flex-grow: 1;
  margin-left: 16px;
`;

export const PanelLabel = styled.label.attrs({
  className: 'side-panel-panel__label'
})`
  color: ${props => props.theme.labelColor};
  display: inline-block;
  font-size: 11px;
  font-weight: 400;
  margin-bottom: 4px;
  text-transform: capitalize;
`;

export const PanelLabelWrapper = styled.div.attrs({
  className: 'side-panel-panel__label-wrapper'
})`
  display: flex;
  align-items: self-start;
`;

export const PanelLabelBold = styled(PanelLabel)`
  font-weight: 500;
`;

export const PanelHeaderTitle = styled.span.attrs({
  className: 'side-panel-panel__header__title'
})`
  color: ${props => props.theme.textColor};
  font-size: 13px;
  letter-spacing: 0.43px;
  text-transform: capitalize;
`;

export const PanelHeaderContent = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme.textColor};
  padding-left: 12px;

  .icon {
    color: ${props => props.theme.labelColor};
    display: flex;
    align-items: center;
    margin-right: 12px;
  }
`;

export const PanelContent = styled.div.attrs({
  className: 'side-panel-panel__content'
})`
  background-color: ${props => props.theme.panelBackground};
  padding: 12px;
`;

export const SidePanelSection = styled.div.attrs({
  className: 'side-panel-section'
})`
  margin-bottom: 12px;
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  pointer-events: ${props => (props.disabled ? 'none' : 'all')};
`;

export const SidePanelDivider = styled.div.attrs({
  className: 'side-panel-divider'
})`
  border-bottom: 1px solid ${props => props.theme.panelBorderColor};
  height: 12px;
  margin-bottom: 12px;
`;

export const Tooltip = styled(ReactTooltip)`
  &.__react_component_tooltip {
    font-size: 9.5px;
    font-weight: 500;
    padding: 7px 18px;

    &.type-dark {
      background-color: ${props => props.theme.tooltipBg};
      color: ${props => props.theme.tooltipColor};
      &.place-bottom {
        :after {
          border-bottom-color: ${props => props.theme.tooltipBg};
        }
      }

      &.place-top {
        :after {
          border-top-color: ${props => props.theme.tooltipBg};
        }
      }

      &.place-right {
        :after {
          border-right-color: ${props => props.theme.tooltipBg};
        }
      }

      &.place-left {
        :after {
          border-left-color: ${props => props.theme.tooltipBg};
        }
      }
    }
  }
`;

export const Button = styled.div.attrs({
  className: 'button'
})`
  align-items: center;
  background-color: ${props =>
    props.negative
      ? props.theme.negativeBtnBgd
      : props.secondary
      ? props.theme.secondaryBtnBgd
      : props.link
      ? props.theme.linkBtnBgd
      : props.theme.primaryBtnBgd};
  border-radius: ${props => props.theme.primaryBtnRadius};
  color: ${props =>
    props.negative
      ? props.theme.negativeBtnColor
      : props.secondary
      ? props.theme.secondaryBtnColor
      : props.link
      ? props.theme.linkBtnColor
      : props.theme.primaryBtnColor};
  cursor: pointer;
  display: inline-flex;
  font-size: ${props => (props.large ? '14px' : props.small ? '10px' : '11px')};
  font-weight: 500;
  justify-content: center;
  letter-spacing: 0.3px;
  line-height: 14px;
  outline: 0;
  padding: ${props =>
    props.large ? '14px 32px' : props.small ? '6px 9px' : '9px 12px'};
  text-align: center;
  transition: ${props => props.theme.transition};
  vertical-align: middle;
  width: ${props => props.width || 'auto'};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  pointer-events: ${props => (props.disabled ? 'none' : 'all')};

  :hover,
  :focus,
  :active,
  &.active {
    background-color: ${props =>
      props.negative
        ? props.theme.negativeBtnBgdHover
        : props.secondary
        ? props.theme.secondaryBtnBgdHover
        : props.link
        ? props.theme.linkBtnActBgdHover
        : props.theme.primaryBtnBgdHover};
    color: ${props =>
      props.negative
        ? props.theme.negativeBtnActColor
        : props.secondary
        ? props.theme.secondaryBtnActColor
        : props.link
        ? props.theme.linkBtnActColor
        : props.theme.primaryBtnActColor};
  }

  svg {
    margin-right: 8px;
  }
`;

export const Input = styled.input`
  ${props =>
    props.secondary ? props.theme.secondaryInput : props.theme.input};
`;

export const InputLight = styled.input`
  ${props => props.theme.inputLT}
`;

export const InlineInput = styled(Input)`
  ${props => props.theme.inlineInput};
`;

export const StyledPanelHeader = styled.div`
  background-color: ${props =>
    props.active
      ? props.theme.panelBackgroundHover
      : props.theme.panelBackground};
  border-left: 3px solid
    rgb(
      ${props =>
        props.labelRCGColorValues
          ? props.labelRCGColorValues.join(',')
          : 'transparent'}
    );
  padding: 0 10px 0 0;
  height: ${props => props.theme.panelHeaderHeight}px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: ${props => props.theme.transition};
`;

export const StyledPanelDropdown = styled.div`
  ${props => props.theme.panelDropdownScrollBar}
  background-color: ${props => props.theme.panelBackground};
  overflow-y: auto;
  box-shadow: ${props => props.theme.panelBoxShadow};
  border-radius: ${props => props.theme.panelBorderRadius};
  margin-top: 2px;
  max-height: 500px;
  position: relative;
  z-index: 999;
`;

export const ButtonGroup = styled.div`
  display: flex;
  .button {
    border-radius: 0;
    margin-left: 2px;
  }
  .button:first-child {
    border-bottom-left-radius: ${props => props.theme.primaryBtnRadius};
    border-top-left-radius: ${props => props.theme.primaryBtnRadius};
    margin-left: 0;
  }
  .button:last-child {
    border-bottom-right-radius: ${props => props.theme.primaryBtnRadius};
    border-top-right-radius: ${props => props.theme.primaryBtnRadius};
  }
`;

export const DatasetSquare = styled.div`
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: rgb(${props => props.color.join(',')});
  margin-right: 12px;
`;

export const SelectionButton = styled.div`
  border-radius: 2px;
  border: 1px solid
    ${props =>
      props.selected
        ? props.theme.primaryBtnBgd
        : props.theme.selectBorderColorLT};
  color: ${props =>
    props.selected
      ? props.theme.primaryBtnBgd
      : props.theme.selectBorderColorLT};
  cursor: pointer;
  font-weight: 500;
  margin-right: 6px;
  padding: 6px 10px;

  :hover {
    color: ${props => props.available && props.theme.primaryBtnBgd};
    border: 1px solid ${props => props.available && props.theme.primaryBtnBgd};
  }
`;

export const Table = styled.table`
  width: 100%;
  border-spacing: 0;

  thead {
    tr th {
      background: ${props => props.theme.panelBackgroundLT};
      color: ${props => props.theme.titleColorLT};
      padding: 18px 12px;
      text-align: start;
    }
  }

  tbody {
    tr td {
      border-bottom: ${props => props.theme.panelBorderLT};
      padding: 12px;
    }
  }
`;

export const StyledModalContent = styled.div`
  background: ${props => props.theme.panelBackgroundLT};
  color: ${props => props.theme.textColorLT};
  display: flex;
  flex-direction: row;
  font-size: 10px;
  padding: 24px ${props => props.theme.modalLateralPadding};
  margin: 0 -${props => props.theme.modalLateralPadding};
  justify-content: space-between;
  ${media.portable`
    flex-direction: column;
    padding: 16px ${props => props.theme.modalPortableLateralPadding};
    margin: 0 -${props => props.theme.modalPortableLateralPadding};
  `};
`;

/**
 * Newer versions of mapbox.gl display an error message banner on top of the map by default
 * which will cause the map to display points in the wrong locations
 * This workaround will hide the error banner.
 */
export const StyledMapContainer = styled.div`
  .mapboxgl-map .mapboxgl-missing-css {
    display: none;
  }
`;

export const StyledExportSection = styled.div`
  display: flex;
  flex-direction: row;
  margin: 35px 0;
  width: 100%;

  .description {
    width: 185px;

    .title {
      font-weight: 500;
      color: ${props => props.theme.textColorLT};
      font-size: 12px;
    }
    .subtitle {
      color: ${props => props.theme.textColor};
      font-size: 11px;
    }
  }

  .selection {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    padding-left: 50px;

    select {
      background-color: white;
      border-radius: 1px;
      display: inline-block;
      font: inherit;
      line-height: 1.5em;
      padding: 0.5em 3.5em 0.5em 1em;
      margin: 0;
      box-sizing: border-box;
      appearance: none;
      width: 250px;
      height: 36px;

      background-image: linear-gradient(45deg, transparent 50%, gray 50%),
        linear-gradient(135deg, gray 50%, transparent 50%),
        linear-gradient(to right, #ccc, #ccc);
      background-position: calc(100% - 20px) calc(1em + 2px),
        calc(100% - 15px) calc(1em + 2px), calc(100% - 2.5em) 4.5em;
      background-size: 5px 5px, 5px 5px, 1px 1.5em;
      background-repeat: no-repeat;
    }

    select:focus {
      background-image: linear-gradient(45deg, green 50%, transparent 50%),
        linear-gradient(135deg, transparent 50%, green 50%),
        linear-gradient(to right, #ccc, #ccc);
      background-position: calc(100% - 15px) 1em, calc(100% - 20px) 1em,
        calc(100% - 2.5em) 4.5em;
      background-size: 5px 5px, 5px 5px, 1px 1.5em;
      background-repeat: no-repeat;
      border-color: green;
      outline: 0;
    }
  }
`;

export const StyledFilteredOption = styled.div`
  align-items: center;
  border-radius: 2px;
  border: 1px solid
    ${props =>
      props.selected
        ? props.theme.primaryBtnBgd
        : props.theme.selectBorderColorLT};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 60px;
  justify-content: center;
  margin: 4px;
  padding: 8px 12px;
  width: 140px;

  :hover {
    border: 1px solid ${props => props.theme.primaryBtnBgd};
  }

  .filtered-title {
    color: ${props => props.theme.textColorLT};
    font-size: 12px;
    font-weight: 500;
  }
  .filtered-subtitle {
    color: ${props => props.theme.textColor};
    font-size: 11px;
  }
`;

export const StyledType = styled.div`
  border-radius: 2px;
  border: 1px solid
    ${props =>
      props.selected
        ? props.theme.primaryBtnBgd
        : props.theme.selectBorderColorLT};
  color: ${props =>
    props.selected
      ? props.theme.primaryBtnBgd
      : props.theme.selectBorderColorLT};
  cursor: pointer;
  font-weight: 500;
  height: 100px;
  margin: 4px;
  padding: 6px 10px;
  width: 100px;

  :hover {
    color: ${props => props.available && props.theme.primaryBtnBgd};
    border: 1px solid ${props => props.available && props.theme.primaryBtnBgd};
  }
`;

export const WidgetContainer = styled.div`
  position: absolute;
  padding-top: ${props => props.theme.sidePanel.margin.top}px;
  padding-right: ${props => props.theme.sidePanel.margin.right}px;
  padding-bottom: ${props => props.theme.sidePanel.margin.bottom}px;
  padding-left: ${props => props.theme.sidePanel.margin.left}px;
  bottom: 0;
  right: 0;
  z-index: 1;
  width: ${props => props.width}px;
`;

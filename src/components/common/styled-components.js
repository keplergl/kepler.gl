// Copyright (c) 2020 Uber Technologies, Inc.
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
import classnames from 'classnames';

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
  background-color: ${props => props.theme.secondaryBtnBgdHover};
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

export const CenterVerticalFlexbox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SpaceBetweenFlexbox = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: -16px;
`;

export const SBFlexboxItem = styled.div`
  flex-grow: 1;
  margin-left: 16px;
`;

export const SBFlexboxNoMargin = styled.div`
  display: flex;
  justify-content: space-between;
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
  background-color: ${props => props.theme.panelContentBackground};
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
  border-bottom: ${props => props.theme.sidepanelDividerBorder} solid
    ${props => props.theme.panelBorderColor};
  margin-bottom: ${props => props.theme.sidepanelDividerMargin}px;
  height: ${props => props.theme.sidepanelDividerHeight}px;
`;

export const Tooltip = styled(ReactTooltip)`
  &.__react_component_tooltip {
    font-size: ${props => props.theme.tooltipFontSize};
    font-weight: 400;
    padding: 7px 18px;
    box-shadow: ${props => props.theme.tooltipBoxShadow};

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

export const Button = styled.div.attrs(props => ({
  className: classnames('button', props.className)
}))`
  align-items: center;
  background-color: ${props =>
    props.negative
      ? props.theme.negativeBtnBgd
      : props.secondary
      ? props.theme.secondaryBtnBgd
      : props.link
      ? props.theme.linkBtnBgd
      : props.floating
      ? props.theme.floatingBtnBgd
      : props.theme.primaryBtnBgd};
  border-radius: ${props => props.theme.primaryBtnRadius};
  color: ${props =>
    props.negative
      ? props.theme.negativeBtnColor
      : props.secondary
      ? props.theme.secondaryBtnColor
      : props.link
      ? props.theme.linkBtnColor
      : props.floating
      ? props.theme.floatingBtnColor
      : props.theme.primaryBtnColor};
  cursor: pointer;
  display: inline-flex;
  font-size: ${props =>
    props.large
      ? props.theme.primaryBtnFontSizeLarge
      : props.small
      ? props.theme.primaryBtnFontSizeSmall
      : props.theme.primaryBtnFontSizeDefault};
  font-weight: 500;
  font-family: ${props => props.theme.btnFontFamily};
  justify-content: center;
  letter-spacing: 0.3px;
  line-height: 14px;
  outline: 0;
  padding: ${props => (props.large ? '14px 32px' : props.small ? '6px 9px' : '9px 12px')};
  text-align: center;
  transition: ${props => props.theme.transition};
  vertical-align: middle;
  width: ${props => props.width || 'auto'};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  pointer-events: ${props => (props.disabled ? 'none' : 'all')};
  border: ${props =>
    props.secondary
      ? props.theme.secondaryBtnBorder
      : props.floating
      ? props.theme.floatingBtnBorder
      : props.link
      ? props.theme.linkBtnBorder
      : props.theme.primaryBtnBorder};
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
        : props.floating
        ? props.theme.floatingBtnBgdHover
        : props.theme.primaryBtnBgdHover};
    color: ${props =>
      props.negative
        ? props.theme.negativeBtnActColor
        : props.secondary
        ? props.theme.secondaryBtnActColor
        : props.link
        ? props.theme.linkBtnActColor
        : props.floating
        ? props.theme.floatingBtnActColor
        : props.theme.primaryBtnActColor};
  }

  svg {
    margin-right: ${props => (props.large ? '10px' : props.small ? '6px' : '8px')};
  }
`;

export const Input = styled.input`
  ${props => (props.secondary ? props.theme.secondaryInput : props.theme.input)};
`;

export const InputLight = styled.input`
  ${props => props.theme.inputLT}
`;

export const TextArea = styled.textarea`
  ${props => (props.secondary ? props.theme.secondaryInput : props.theme.input)};
`;
export const TextAreaLight = styled.textarea`
  ${props => props.theme.inputLT}
  height: auto;
  white-space: pre-wrap;
`;

export const InlineInput = styled(Input)`
  ${props => props.theme.inlineInput};
`;

export const StyledPanelHeader = styled.div`
  background-color: ${props =>
    props.active ? props.theme.panelBackgroundHover : props.theme.panelBackground};
  border-left: 3px solid
    rgb(
      ${props => (props.labelRCGColorValues ? props.labelRCGColorValues.join(',') : 'transparent')}
    );
  padding: 0 10px 0 0;
  height: ${props => props.theme.panelHeaderHeight}px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: ${props => props.theme.panelHeaderBorderRadius};
  transition: ${props => props.theme.transition};
`;

export const StyledPanelDropdown = styled.div`
  ${props => props.theme.panelDropdownScrollBar}
  background-color: ${props =>
    props.type === 'light' ? props.theme.modalDropdownBackground : props.theme.panelBackground};
  overflow-y: auto;
  box-shadow: ${props => props.theme.panelBoxShadow};
  border-radius: ${props => props.theme.panelBorderRadius};
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
  position: relative;
  border-radius: 2px;
  border: 1px solid
    ${props =>
      props.selected
        ? props.theme.selectionBtnBorderActColor
        : props.theme.selectionBtnBorderColor};
  color: ${props =>
    props.selected ? props.theme.selectionBtnActColor : props.theme.selectionBtnColor};
  background-color: ${props =>
    props.selected ? props.theme.selectionBtnActBgd : props.theme.selectionBtnBgd};

  cursor: pointer;
  font-weight: 500;
  margin-right: 6px;
  padding: 6px 16px;

  :hover {
    color: ${props => props.theme.selectionBtnActColor};
    border: 1px solid ${props => props.theme.selectionBtnBorderActColor};
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

export const StyledModalVerticalPanel = styled.div.attrs({
  className: 'modal-vertical-panel'
})`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  font-size: 12px;

  .modal-section:first-child {
    margin-top: 24px;
    ${media.palm`
      margin-top: 0;
    `};
  }

  input {
    margin-right: 8px;
  }
`;

export const StyledModalSection = styled.div.attrs({
  className: 'modal-section'
})`
  margin-bottom: 32px;

  .modal-section-title {
    font-weight: 500;
  }
  .modal-section-subtitle {
    color: ${props => props.theme.subtextColorLT};
  }

  input {
    margin-top: 8px;
  }

  ${media.portable`
    margin-bottom: 24px;
  `};
  ${media.palm`
    margin-bottom: 16px;
  `};
`;

export const StyledModalInputFootnote = styled.div.attrs({
  className: 'modal-input__footnote'
})`
  display: flex;
  justify-content: flex-end;
  color: ${props => (props.error ? props.theme.errorColor : props.theme.subtextColorLT)};
  font-size: 10px;
`;
/**
 * Newer versions of mapbox.gl display an error message banner on top of the map by default
 * which will cause the map to display points in the wrong locations
 * This workaround will hide the error banner.
 */
export const StyledMapContainer = styled.div`
  .mapboxgl-map {
    .mapboxgl-missing-css {
      display: none;
    }
    .mapboxgl-ctrl-attrib {
      display: none;
    }
  }
`;

export const StyledAttrbution = styled.div.attrs({
  className: 'mapbox-attribution-container'
})`
  bottom: 0;
  right: 0;
  position: absolute;
  display: block;
  margin: 0 10px 2px;
  z-index: 0;

  .attrition-logo {
    display: flex;
    font-size: 10px;
    justify-content: flex-end;
    align-items: center;
    color: ${props => props.theme.labelColor};

    a.mapboxgl-ctrl-logo {
      width: 72px;
      margin-left: 6px;
    }
  }
  a {
    font-size: 10px;
  }
`;

export const StyledExportSection = styled.div`
  display: flex;
  flex-direction: row;
  margin: 35px 0;
  width: 100%;
  color: ${props => props.theme.textColorLT};
  font-size: 12px;
  opacity: ${props => (props.disabled ? 0.3 : 1)};
  pointer-events: ${props => (props.disabled ? 'none' : 'all')};

  .description {
    width: 185px;
    .title {
      font-weight: 500;
    }
    .subtitle {
      color: ${props => props.theme.subtextColorLT};
      font-size: 11px;
    }
  }
  .warning {
    color: ${props => props.theme.errorColor};
    font-weight: 500;
  }
  .description.full {
    width: 100%;
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
        linear-gradient(135deg, gray 50%, transparent 50%), linear-gradient(to right, #ccc, #ccc);
      background-position: calc(100% - 20px) calc(1em + 2px), calc(100% - 15px) calc(1em + 2px),
        calc(100% - 2.5em) 4.5em;
      background-size: 5px 5px, 5px 5px, 1px 1.5em;
      background-repeat: no-repeat;
    }

    select:focus {
      background-image: linear-gradient(45deg, green 50%, transparent 50%),
        linear-gradient(135deg, transparent 50%, green 50%), linear-gradient(to right, #ccc, #ccc);
      background-position: calc(100% - 15px) 1em, calc(100% - 20px) 1em, calc(100% - 2.5em) 4.5em;
      background-size: 5px 5px, 5px 5px, 1px 1.5em;
      background-repeat: no-repeat;
      border-color: green;
      outline: 0;
    }
  }
`;

export const StyledFilteredOption = styled(SelectionButton)`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 4px;
  padding: 8px 12px;
  width: 140px;

  .filter-option-title {
    color: ${props => props.theme.textColorLT};
    font-size: 12px;
    font-weight: 500;
  }
  .filter-option-subtitle {
    color: ${props => props.theme.subtextColorLT};
    font-size: 11px;
  }
`;

export const StyledType = styled(SelectionButton)`
  height: 100px;
  margin: 4px;
  padding: 6px 10px;
  width: 100px;
`;

export const WidgetContainer = styled.div`
  z-index: 1;
`;

export const BottomWidgetInner = styled.div`
  background-color: ${props => props.theme.bottomWidgetBgd};
  padding: ${props => `${props.theme.bottomInnerPdVert}px ${props.theme.bottomInnerPdSide}px`};
  position: relative;
  margin-top: ${props => props.theme.bottomPanelGap}px;
`;

export const MapControlButton = styled(Button).attrs({
  className: 'map-control-button'
})`
  box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.16);
  height: 32px;
  width: 32px;
  padding: 0;
  border-radius: 0;
  background-color: ${props =>
    props.active ? props.theme.floatingBtnBgdHover : props.theme.floatingBtnBgd};
  color: ${props =>
    props.active ? props.theme.floatingBtnActColor : props.theme.floatingBtnColor};
  border: ${props =>
    props.active ? props.theme.floatingBtnBorderHover : props.theme.floatingBtnBorder};

  :hover,
  :focus,
  :active,
  &.active {
    background-color: ${props => props.theme.floatingBtnBgdHover};
    color: ${props => props.theme.floatingBtnActColor};
    border: ${props => props.theme.floatingBtnBorderHover};
  }
  svg {
    margin-right: 0;
  }
`;

export const StyledFilterContent = styled.div`
  background-color: ${props => props.theme.panelContentBackground};
  padding: 12px;
`;

export const TruncatedTitleText = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const CheckMark = styled.span.attrs({
  className: 'checkbox-inner'
})`
  background-color: ${props => props.theme.selectionBtnBorderActColor};
  position: absolute;
  top: 0;
  right: 0;
  display: block;
  width: 10px;
  height: 10px;
  border-top-left-radius: 2px;

  :after {
    position: absolute;
    display: table;
    border: 1px solid #fff;
    border-top: 0;
    border-left: 0;
    transform: rotate(45deg) scale(1) translate(-50%, -50%);
    opacity: 1;
    content: ' ';
    top: 40%;
    left: 30%;
    width: 3.2px;
    height: 6.22px;
  }
`;

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {media} from '@kepler.gl/styles';
import {RGBColor} from '@kepler.gl/types';
import classnames from 'classnames';
import DatePicker from 'react-date-picker';
import TimePicker from 'react-time-picker';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';

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

export const EndHorizontalFlexbox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: end;
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

export const PanelHeaderTitle = styled.span.attrs(props => ({
  className: classnames('side-panel-panel__header__title', props.className)
}))`
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

export const PanelContent = styled.div.attrs(props => ({
  className: classnames('side-panel-panel__content', props.className)
}))`
  background-color: ${props => props.theme.panelContentBackground};
  padding: 12px;
`;

interface SidePanelSectionProps {
  disabled?: boolean;
}

export const SidePanelSection = styled.div.attrs(props => ({
  className: classnames('side-panel-section', props.className)
}))<SidePanelSectionProps>`
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

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  ref?: React.ForwardedRef<HTMLElement>;
  children?: React.ReactNode;
  negative?: boolean;
  secondary?: boolean;
  link?: boolean;
  floating?: boolean;
  cta?: boolean;
  large?: boolean;
  small?: boolean;
  disabled?: boolean;
  width?: string;
  inactive?: boolean;
};

// this needs to be an actual button to be able to set disabled attribute correctly
export const Button = styled.button.attrs(props => ({
  className: classnames('button', props.className)
}))<ButtonProps>`
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
      : props.cta
      ? props.theme.ctaBtnBgd
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
      : props.cta
      ? props.theme.ctaBtnColor
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
    props.negative
      ? props.theme.negativeBtnBorder
      : props.secondary
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
        : props.cta
        ? props.theme.ctaBtnBgdHover
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
        : props.cta
        ? props.theme.ctaBtnActColor
        : props.theme.primaryBtnActColor};
  }

  svg {
    margin-right: ${props => (props.large ? '10px' : props.small ? '6px' : '8px')};
  }
`;

interface InputProps {
  secondary?: boolean;
}

export const Input = styled.input<InputProps>`
  ${props => (props.secondary ? props.theme.secondaryInput : props.theme.input)};
`;

export const InputLight = styled.input`
  ${props => props.theme.inputLT};
`;

export const TextArea = styled.textarea<InputProps>`
  ${props => (props.secondary ? props.theme.secondaryInput : props.theme.input)};
`;
export const TextAreaLight = styled.textarea`
  ${props => props.theme.inputLT} height: auto;
  white-space: pre-wrap;
`;

export const InlineInput = styled(Input)`
  ${props => props.theme.inlineInput};
`;

export interface StyledPanelHeaderProps {
  active?: boolean;
  labelRCGColorValues?: RGBColor | null;
  warning?: boolean;
  isValid?: boolean;
}

export const StyledPanelHeader = styled.div<StyledPanelHeaderProps>`
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

interface StyledPanelDropdownProps {
  type?: string;
}

export const StyledPanelDropdown = styled.div<StyledPanelDropdownProps>`
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

interface DatasetSquareProps {
  backgroundColor: RGBColor;
}

export const DatasetSquare = styled.div<DatasetSquareProps>`
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: rgb(${props => props.backgroundColor.join(',')});
  margin-right: 12px;
`;

interface SelectionButtonProps {
  selected?: boolean;
}

export const SelectionButton = styled.div<SelectionButtonProps>`
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

export const StyledTable = styled.table`
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

export const StyledModalSection = styled.div.attrs(({className}) => ({
  className: classnames('modal-section', className)
}))`
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

interface StyledModalInputFootnoteProps {
  error?: boolean;
}

export const StyledModalInputFootnote = styled.div.attrs({
  className: 'modal-input__footnote'
})<StyledModalInputFootnoteProps>`
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
  width: 100%;
  height: 100%;
  .maplibregl-map {
    .maplibregl-missing-css {
      display: none;
    }
    .maplibregl-ctrl-attrib {
      display: none;
    }
  }
`;

export const StyledAttrbution = styled.div.attrs({
  className: 'maplibre-attribution-container'
})`
  bottom: 0;
  right: 0;
  position: absolute;
  display: block;
  margin: 0 10px 6px;
  z-index: 1;
  .attrition-link {
    display: flex;
    align-items: center;
    margin-left: 10px;

    a,
    .pipe-separator {
      margin-right: 2px;
      color: ${props => props.theme.labelColor};
    }

    .pipe-separator {
      text-decoration: none;
    }
  }

  .attrition-logo {
    display: flex;
    font-size: 10px;
    justify-content: flex-end;
    align-items: center;
    color: ${props => props.theme.labelColor};

    a.maplibregl-ctrl-logo {
      width: 72px;
      margin-left: 4px;
      background-size: contain;
    }
  }
  a,
  .pipe-separator {
    font-size: 10px;
  }

  ${media.palm`
    .attrition-logo a {
      width: 60px;
    }

    .attrition-link {
      line-height: 1em;
    }
  `};
`;

export interface StyledExportSectionProps {
  disabled?: boolean;
}

export const StyledExportSection = styled.div<StyledExportSectionProps>`
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
      font-family: ${props => props.theme.fontFamilyMedium ?? props.theme.fontFamily};
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

  ${media.portable`
    border-top: 1px solid ${props => props.theme.panelBorderColor};
    border-left: 1px solid ${props => props.theme.panelBorderColor};
    padding: 12px 12px;
    margin-top: 0;
  `}
`;

interface MapControlButtonProps {
  active?: boolean;
}

export const MapControlButton = styled(Button).attrs(props => ({
  className: classnames('map-control-button', props.className)
}))<MapControlButtonProps>`
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

export const StyledTimePicker = styled(TimePicker)`
  .react-time-picker {
    display: inline-flex;
    position: relative;
    font-family: ${props => props.theme.fontFamily};
    font-size: ${props => props.theme.inputFontSize};
    background-color: ${props => props.theme.inputBgd};
    color: ${props => props.theme.effectPanelTextMain};
  }
  .react-time-picker,
  .react-time-picker *,
  .react-time-picker *:before,
  .react-time-picker *:after {
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .react-time-picker__wrapper {
    display: flex;
    flex-grow: 1;
    flex-shrink: 0;
    background-color: ${props => props.theme.inputBgd};
    border-radius: 4px;
    width: 110px;
    white-space: nowrap;
  }
  .react-time-picker__wrapper:hover {
    background-color: ${props => props.theme.inputBgdHover};
  }
  .react-time-picker__inputGroup {
    min-width: calc((4px * 3) + 0.54em * 6 + 0.217em * 2);
    flex-grow: 1;
    padding: 4px 2px;
    box-sizing: content-box;
    display: flex;
    justify-content: end;
    align-items: center;
    height: 24px;
  }
  .react-time-picker__inputGroup__divider {
    padding: 1px 0;
    white-space: pre;
  }
  .react-time-picker__inputGroup__divider,
  .react-time-picker__inputGroup__leadingZero {
    display: inline-block;
    color: ${props => props.theme.effectPanelTextMain};
    font-family: ${props => props.theme.fontFamily};
    font-size: ${props => props.theme.inputFontSize};
    font-weight: 400;
  }
  .react-time-picker__inputGroup__input {
    min-width: 0.54em;
    height: 100%;
    position: relative;
    padding: 0 1px;
    border: 0;
    background: transparent;
    color: ${props => props.theme.effectPanelTextMain};
    font-family: ${props => props.theme.fontFamily};
    font-size: ${props => props.theme.inputFontSize};
    box-sizing: content-box;
    -webkit-appearance: textfield;
    -moz-appearance: textfield;
    appearance: textfield;
  }
  .react-time-picker__inputGroup__input:focus {
    outline: none;
  }
  .react-time-picker__inputGroup__input::-webkit-outer-spin-button,
  .react-time-picker__inputGroup__input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
  }
  .react-time-picker__inputGroup__input--hasLeadingZero {
    margin-left: -0.54em;
    padding-left: calc(1px + 0.54em);
  }
  .react-time-picker__inputGroup__amPm {
    max-width: 37px;
    font: inherit;
    font-weight: 400;
    -webkit-appearance: menulist;
    -moz-appearance: menulist;
    appearance: menulist;
    font-size: ${props => props.theme.inputFontSize};
  }
  .react-time-picker__button {
    border: 0;
    background-color: ${props => props.theme.inputBgd};
    padding: 4px 6px;
  }
  .react-time-picker__button:enabled {
    cursor: pointer;
  }
  .react-time-picker__button svg {
    display: inherit;
  }
  .react-time-picker__clock--closed,
  .react-time-picker__clear-button {
    display: none;
  }
`;

export const StyledDatePicker = styled(DatePicker)`
  .react-date-picker {
    display: inline-flex;
    position: relative;
    font-family: ${props => props.theme.fontFamily};
    font-size: ${props => props.theme.inputFontSize};
  }
  .react-date-picker,
  .react-date-picker *,
  .react-date-picker *:before,
  .react-date-picker *:after {
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .react-date-picker__wrapper {
    display: flex;
    flex-grow: 1;
    flex-shrink: 0;
    width: 108px;
    white-space: nowrap;
    border-radius: 4px;
  }
  .react-date-picker__inputGroup {
    min-width: calc((4px * 3) + 0.54em * 8 + 0.217em * 2);
    flex-grow: 1;
    padding: 4px 9px;
    box-sizing: content-box;
    background-color: ${props => props.theme.inputBgd};
    display: flex;
    justify-content: end;
    align-items: center;
    height: 22px;
    border: 1px solid ${props => props.theme.inputBgd};
    border-radius: 4px;
  }

  .react-date-picker__inputGroup:hover {
    background-color: ${props => props.theme.inputBgdHover};
  }
  .react-date-picker__inputGroup__divider {
    padding: 1px 0;
    white-space: pre;
    color: ${props => props.theme.effectPanelTextMain};
  }
  .react-date-picker__inputGroup__divider,
  .react-date-picker__inputGroup__leadingZero {
    display: inline-block;
  }
  .react-date-picker__inputGroup__input {
    min-width: 0.54em;
    height: 100%;
    position: relative;
    padding: 0 1px;
    border: 0;
    background: none;
    color: ${props => props.theme.effectPanelTextMain};
    font: inherit;
    font-size: ${props => props.theme.inputFontSize};
    box-sizing: content-box;
    -webkit-appearance: textfield;
    -moz-appearance: textfield;
    appearance: textfield;
  }
  .react-date-picker__inputGroup__input:focus {
    outline: none;
  }
  .react-date-picker__inputGroup__input::-webkit-outer-spin-button,
  .react-date-picker__inputGroup__input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
  }
  .react-date-picker__inputGroup__input:invalid {
    background: ${props => props.theme.inputBgd};
  }
  .react-date-picker__inputGroup__input--hasLeadingZero {
    margin-left: -0.54em;
    padding-left: calc(1px + 0.54em);
  }
  .react-date-picker__calendar {
    width: 257px;
    max-width: 100vw;
    z-index: 11;
    color: ${props => props.theme.effectPanelTextSecondary1};
    inset: auto !important;
  }
  .react-date-picker__calendar--closed {
    display: none;
  }
  .react-date-picker__calendar .react-calendar {
    border-width: thin;
  }
  .react-date-picker__button {
    display: none;
  }
  .react-calendar {
    width: 256px;
    max-width: 100%;
    color: ${props => props.theme.effectPanelTextSecondary1};
    background: ${props => props.theme.inputBgdHover};
    border-radius: 0px 4px 4px 4px;
    font-family: ${props => props.theme.fontFamily};
    line-height: 1.125em;
    padding: 16px;
  }
  .react-calendar,
  .react-calendar *,
  .react-calendar *:before,
  .react-calendar *:after {
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .react-calendar button {
    margin: 0;
    border: 0;
    outline: none;
  }
  .react-calendar buttom:enabled {
    color: ${props => props.theme.effectPanelTextMain};
  }
  .react-calendar button:enabled:hover {
    cursor: pointer;
  }
  .react-calendar__navigation {
    display: flex;
    height: 25px;
    margin-bottom: 1em;
  }
  .react-calendar__navigation button {
    min-width: 25px;
    background: none;
  }
  .react-calendar__navigation button:enabled:hover,
  .react-calendar__navigation button:enabled:focus {
    background-color: ${props => props.theme.inputBgdActive};
  }
  .react-calendar__month-view__weekdays {
    text-align: center;
    text-transform: uppercase;
    font-weight: bold;
  }
  .react-calendar__month-view__weekdays__weekday {
    color: ${props => props.theme.effectPanelTextSecondary2};
    padding: 0.5em;
    font-size: ${props => props.theme.inputFontSize};
    abbr {
      text-decoration: none;
    }
  }
  .react-calendar__month-view__weekNumbers .react-calendar__tile {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }
  .react-calendar__month-view__days__day--weekend {
    color: ${props => props.theme.effectPanelTextSecondary1};
  }
  .react-calendar__month-view__days__day--neighboringMonth {
    color: ${props => props.theme.effectPanelTextSecondary3};
    opacity: 0.4;
  }
  .react-calendar__navigation__label__labelText,
  .react-calendar__navigation__arrow {
    color: ${props => props.theme.effectPanelTextMain};
  }
  .react-calendar__year-view .react-calendar__tile,
  .react-calendar__decade-view .react-calendar__tile,
  .react-calendar__century-view .react-calendar__tile {
    padding: 2em 0.5em;
  }
  .react-calendar__tile {
    color: ${props => props.theme.effectPanelTextSecondary1};
    max-width: 100%;
    padding: 6px 4px;
    background: none;
    text-align: center;
    font-size: ${props => props.theme.inputFontSize};
    height: 30px;
  }
  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background-color: ${props => props.theme.primaryBtnBgd};
    color: ${props => props.theme.primaryBtnActColor};
  }
  .react-calendar__tile--now:enabled:hover,
  .react-calendar__tile--now:enabled:focus {
    background: ${props => props.theme.primaryBtnBgd};
    color: ${props => props.theme.effectPanelTextMain};
  }
  .react-calendar__tile--hasActive {
    background: ${props => props.theme.primaryBtnActBgd};
  }
  .react-calendar__tile--hasActive:enabled:hover,
  .react-calendar__tile--hasActive:enabled:focus {
    background: ${props => props.theme.primaryBtnActBgd};
    color: ${props => props.theme.effectPanelTextMain};
  }
  .react-calendar__tile--active {
    background: ${props => props.theme.primaryBtnActBgd};
    color: ${props => props.theme.effectPanelTextMain};
    border-radius: 4px;
  }
  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus {
    background: ${props => props.theme.primaryBtnActBgd};
  }
  .calendar__navigation__label__labelText {
    сolor: ${props => props.theme.effectPanelTextMain};
  }
`;

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

import {css} from 'styled-components';
import {DIMENSIONS} from 'constants/default-settings';

export const transition = 'all .4s ease';
export const transitionFast = 'all .2s ease';
export const transitionSlow = 'all .8s ease';

export const boxShadow = '0 1px 2px 0 rgba(0,0,0,0.10)';
export const boxSizing = 'border-box';
export const borderRadius = '1px';
export const borderColor = '#3A414C';
export const borderColorLight = '#F1F1F1';

// TEXT
export const fontFamily = `ff-clan-web-pro, 'Helvetica Neue', Helvetica, sans-serif`;
export const fontWeight = 400;
export const fontSize = '0.875em';
export const lineHeight = 1.71429;
export const labelColor = '#6A7485';
export const labelHoverColor = '#C6C6C6';
export const labelColorLT = '#6A7485';

export const textColor = '#A0A7B4';
export const textColorLT = '#3A414C';
export const titleColorLT = '#29323C';

export const subtextColor = '#6A7485';
export const subtextColorLT = '#A0A7B4';
export const subtextColorActive = '#FFFFFF';

export const titleTextColor = '#FFFFFF';
export const textColorHl = '#F0F0F0';
export const textColorHlLT = '#F1F1F1';
export const activeColor = '#1FBAD6';
export const activeColorHover = '#108188';
export const errorColor = '#F9042C';

// Button
export const primaryBtnBgd = '#0F9668';
export const primaryBtnActBgd = '#13B17B';
export const primaryBtnColor = '#FFFFFF';
export const primaryBtnActColor = '#FFFFFF';
export const primaryBtnBgdHover = '#13B17B';
export const primaryBtnRadius = '2px';

export const secondaryBtnBgd = '#6A7485';
export const secondaryBtnActBgd = '#A0A7B4';
export const secondaryBtnColor = '#FFFFFF';
export const secondaryBtnActColor = '#FFFFFF';
export const secondaryBtnBgdHover = '#A0A7B4';

export const linkBtnBgd = 'transparent';
export const linkBtnActBgd = linkBtnBgd;
export const linkBtnColor = '#A0A7B4';
export const linkBtnActColor = textColorHlLT;
export const linkBtnActBgdHover = linkBtnBgd;

export const negativeBtnBgd = errorColor;
export const negativeBtnActBgd = '#FF193E';
export const negativeBtnBgdHover = '#FF193E';
export const negativeBtnColor = '#FFFFFF';
export const negativeBtnActColor = '#FFFFFF';

// Input
export const inputBoxHeight = '34px';
export const inputBoxHeightSmall = '24px';
export const inputBoxHeightTiny = '18px';
export const inputPadding = '4px 10px';
export const inputPaddingSmall = '4px 6px';
export const inputPaddingTiny = '2px 4px';
export const inputFontSize = '11px';
export const inputFontSizeSmall = '10px';
export const inputFontWeight = 500;
export const inputBgd = '#29323C';
export const inputBgdHover = '#3A414C';
export const inputBgdActive = '#3A414C';
export const inputBorderColor = '#29323C';
export const inputBorderHoverColor = '#3A414C';
export const inputBorderActiveColor = '#D3D8E0';
export const inputColor = '#A0A7B4';
export const inputBorderRadius = '1px';
export const inputPlaceholderColor = '#6A7485';
export const inputPlaceholderFontWeight = 400;

export const secondaryInputBgd = '#242730';
export const secondaryInputBgdHover = '#3A414C';
export const secondaryInputBgdActive = '#3A414C';
export const secondaryInputColor = '#A0A7B4';
export const secondaryInputBorderColor = '#242730';
export const secondaryInputBorderActiveColor = '#D3D8E0';

// Select
export const selectColor = inputColor;
export const selectColorLT = titleColorLT;

export const selectActiveBorderColor = '#D3D8E0';
export const selectFontSize = '11px';
export const selectFontWeight = '400';
export const selectFontWeightBold = '500';

export const selectColorPlaceHolder = '#6A7485';
export const selectBackground = inputBgd;
export const selectBackgroundHover = inputBgdHover;
export const selectBackgroundLT = '#FFFFFF';
export const selectBackgroundHoverLT = '#F8F8F9';
export const selectBorderColor = '#D3D8E0';
export const selectBorderColorLT = '#D3D8E0';
export const selectBorderRadius = '1px';
export const selectBorder = 0;

export const dropdownListHighlightBg = '#6A7485';
export const dropdownListShadow = '0 6px 12px 0 rgba(0,0,0,0.16)';
export const dropdownListBgd = '#3A414C';
export const dropdownListBorderTop = '#242730';
export const dropdownWrapperZ = 100;
// Switch
export const switchWidth = 24;
export const switchHeight = 12;
export const switchLabelMargin = 12;

export const switchTrackBgd = '#29323C';
export const switchTrackBgdActive = activeColor;
export const switchTrackBorderRadius = '1px';
export const switchBtnBgd = '#6A7485';
export const switchBtnBgdActive = '#D3D8E0';
export const switchBtnBoxShadow = '0 2px 4px 0 rgba(0,0,0,0.40)';
export const switchBtnBorderRadius = '0';
export const switchBtnWidth = '12px';
export const switchBtnHeight = '12px';

export const secondarySwitchTrackBgd = '#242730';
export const secondarySwitchBtnBgd = '#3A414C';

// Checkbox
export const checkboxWidth = 16;
export const checkboxHeight = 16;
export const checkboxMargin = 12;
export const checkboxBorderColor = selectBorderColor;
export const checkboxBorderRadius = '2px';
export const checkboxBorderColorLT = selectBorderColorLT;
export const checkboxBoxBgd = 'white';
export const checkboxBoxBgdChecked = primaryBtnBgd;

// Side Panel
export const sidePanelHeaderBg = '#29323C';
export const sidePanelInnerPadding = 16;
export const sidePanelBg = '#242730';
export const sidePanelScrollBarWidth = 10;
export const sidePanelScrollBarHeight = 10;
export const sideBarCloseBtnBgd = secondaryBtnBgd;
export const sideBarCloseBtnColor = '#29323C';
export const sideBarCloseBtnBgdHover = secondaryBtnActBgd;

export const panelBackground = '#29323C';
export const panelBackgroundHover = '#3A4552';
export const panelActiveBg = '#3A4552';
export const panelActiveBgLT = '#6A7485';
export const panelHeaderIcon = '#6A7485';
export const panelHeaderIconActive = '#A0A7B4';
export const panelHeaderHeight = 48;
export const panelBoxShadow = '0 6px 12px 0 rgba(0,0,0,0.16)';
export const panelBorderRadius = '2px';
export const panelBackgroundLT = '#f8f8f9';

export const panelBorderColor = '#3A414C';
export const panelBorder = `1px solid ${borderColor}`;
export const panelBorderLT = `1px solid ${borderColorLight}`;

export const mapPanelBackgroundColor = '#242730';
export const mapPanelHeaderBackgroundColor = '#29323C';
export const tooltipBg = '#F8F8F9';
export const tooltipColor = '#333334';

// Bottom Panel
export const bottomInnerPdSide = 32;
export const bottomInnerPdVert = 6;
export const bottomPanelGap = 20;

// Modal
export const modalTitleColor = '#3A414C';
export const modalTitleFontSize = '24px';
export const modalTitleFontSizeSmaller = '18px';
export const modalFooterBgd = '#F8F8F9';
export const modalImagePlaceHolder = '#DDDFE3';
export const modalPadding = '10px 0';
export const modalLateralPadding = '72px';
export const modalPortableLateralPadding = '36px';

export const modalOverLayZ = 1001;
export const modalOverlayBgd = 'rgba(0, 0, 0, 0.5)';
export const modalContentZ = 10002;
export const modalFooterZ = 10001;
export const modalTitleZ = 10003;
export const modalButtonZ = 10005;

// Modal Dialog (Dark)
export const modalDialogBgd = '#3A414C';
export const modalDialogColor = textColorHl;

// Slider
export const sliderBarColor = '#6A7485';
export const sliderBarBgd = '#3A414C';
export const sliderBarHoverColor = '#D3D8E0';
export const sliderBarRadius = '1px';
export const sliderBarHeight = 4;
export const sliderHandleHeight = 12;
export const sliderHandleWidth = 12;
export const sliderHandleColor = '#D3D8E0';
export const sliderHandleHoverColor = '#FFFFFF';
export const sliderHandleShadow = '0 2px 4px 0 rgba(0,0,0,0.40)';
export const sliderInputHeight = 24;
export const sliderInputWidth = 56;
export const sliderMarginTopIsRange = 0;
export const sliderMarginTop = 12;

// Plot
export const rangeBrushBgd = '#3A414C';
export const histogramFillInRange = activeColor;
export const histogramFillOutRange = sliderBarColor;

// Notification
export const notificationColors = {
  info: '#276ef1',
  error: '#f25138',
  success: '#47b275',
  warning: '#ffc043'
};

export const notificationPanelWidth = 240;
export const notificationPanelItemWidth = notificationPanelWidth - 60;
export const notificationPanelItemHeight = 60;

// Datagrid
const columnWidth = 200;
const cellHeaderHeight = 72;
const cellHeight = 24;
const cellPaddingSide = 18;
const extendCellHeight = 2 * cellHeight;
const extendColumnWidth = 2 * columnWidth;
const gridDefaultWidth = 800;
const gridDefaultHeight = 600;
const gridPaddingSide = 24;

// Floating Time display
const timeDisplayBorderRadius = 32;
const timeDisplayHeight = 64;
const timeDisplayMinWidth = 176;
const timeDisplayOpacity = 0.8;
const timeDisplayPadding = '0 24px';

// Export map modal
const exportIntraSectionMargin = '8';

export const textTruncate = {
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  wordWrap: 'normal'
};

// This breakpoints are used for responsive design
export const breakPoints = {
  palm: 588,
  desk: 768
};

// theme is passed to kepler.gl when it's mounted,
// it is used by styled-components to pass along to
// all child components

const input = css`
  align-items: center;
  background-color: ${props => props.theme.inputBgd};
  border: 1px solid
    ${props =>
      props.active
        ? props.theme.inputBorderActiveColor
        : props.error
        ? props.theme.errorColor
        : props.theme.inputBgd};
  border-radius: 2px;
  caret-color: ${props => props.theme.inputBorderActiveColor};
  color: ${props => props.theme.inputColor};
  display: flex;
  font-size: ${props =>
    ['small', 'tiny'].includes(props.size)
      ? props.theme.inputFontSizeSmall
      : props.theme.inputFontSize};
  font-weight: ${props => props.theme.inputFontWeight};
  height: ${props =>
    props.size === 'small'
      ? props.theme.inputBoxHeightSmall
      : props.size === 'tiny'
      ? props.theme.inputBoxHeightTiny
      : props.theme.inputBoxHeight};
  justify-content: space-between;
  outline: none;
  overflow: hidden;
  padding: ${props =>
    props.size === 'small'
      ? props.theme.inputPaddingSmall
      : props.size === 'tiny'
      ? props.theme.inputPaddingTiny
      : props.theme.inputPadding};
  text-overflow: ellipsis;
  transition: ${props => props.theme.transition};
  white-space: nowrap;
  width: 100%;
  word-wrap: normal;
  pointer-events: ${props => (props.disabled ? 'none' : 'all')};
  opacity: ${props => (props.disabled ? 0.5 : 1)};

  :hover {
    cursor: ${props => (props.type === 'number' ? 'text' : 'pointer')};
    background-color: ${props =>
      props.active ? props.theme.inputBgdActive : props.theme.inputBgdHover};
    border-color: ${props =>
      props.active
        ? props.theme.inputBorderActiveColor
        : props.theme.inputBorderHoverColor};
  }

  :active,
  :focus,
  &.focus,
  &.active {
    background-color: ${props => props.theme.inputBgdActive};
    border-color: ${props => props.theme.inputBorderActiveColor};
  }

  ::placeholder {
    color: ${props => props.theme.inputPlaceholderColor};
    font-weight: ${props => props.theme.inputPlaceholderFontWeight};
  }

  /* Disable Arrows on Number Inputs */
  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const inputLT = css`
  ${input}

  background-color: ${props => props.theme.selectBackgroundLT};
  border: 1px solid
  ${props =>
    props.active
      ? props.theme.selectActiveBorderColor
      : props.error
      ? props.theme.errorColor
      : props.theme.selectBorderColorLT};
  color: ${props => props.theme.selectColorLT};
  caret-color: ${props => props.theme.selectColorLT};

  ::-webkit-input-placeholder {
    color: ${props => props.theme.subtextColorLT};
    font-weight: 400;
  }

  :active,
  :focus,
  &.focus,
  &.active {
    background-color: ${props => props.theme.selectBackgroundLT};
    border-color: ${props => props.theme.textColorLT};
  }

  :hover {
    background-color: ${props => props.theme.selectBackgroundLT};
    cursor: ${props =>
      ['number', 'text'].includes(props.type) ? 'text' : 'pointer'};
    border-color: ${props =>
      props.active ? props.theme.textColorLT : props.theme.subtextColor};
  }
`;

const secondaryInput = css`
  ${props => props.theme.input}
  color: ${props => props.theme.secondaryInputColor};
  background-color: ${props => props.theme.secondaryInputBgd};
  border: 1px solid
    ${props =>
      props.error ? props.theme.errorColor : props.theme.secondaryInputBorderColor};

  :hover {
    cursor: pointer;
    background-color: ${props => props.theme.secondaryInputBgdHover};
    border-color: ${props => props.theme.secondaryInputBgdHover};
  }

  :active,
  &.active {
    background-color: ${props => props.theme.secondaryInputBgdActive};
    border-color: ${props => props.theme.secondaryInputBorderActiveColor};
  }
`;

const chickletedInputContainer = css`
  cursor: pointer;
  flex-wrap: wrap;
  height: auto;
  justify-content: start;
  margin-bottom: 2px;
  padding: 0px 7px 0px 4px;
  white-space: normal;

  .chickleted-input__placeholder {
    line-height: 24px;
    margin: 4px;
  }
`;

const chickletedInput = css`
  ${props => props.theme.input}
  ${props => props.theme.chickletedInputContainer}
`;

const secondaryChickletedInput = css`
  ${props => props.theme.secondaryInput}
  ${props => props.theme.chickletedInputContainer}
`;

const inlineInput = css`
  ${props => props.theme.input} color: ${props => props.theme.textColor};
  font-size: 13px;
  letter-spacing: 0.43px;
  line-height: 18px;
  height: 24px;
  font-weight: 400;
  padding-left: 4px;
  margin-left: -4px;
  background-color: transparent;
  border: 1px solid transparent;

  :hover {
    height: 24px;
    cursor: text;
    background-color: transparent;
    border: 1px solid ${props => props.theme.labelColor};
  }

  :active,
  .active,
  :focus {
    background-color: transparent;
    border: 1px solid ${props => props.theme.inputBorderActiveColor};
  }
`;

const switchTrack = css`
  background: ${props =>
    props.checked ? props.theme.switchTrackBgdActive : props.theme.switchTrackBgd};
  position: absolute;
  top: 0;
  left: ${props => -props.theme.switchLabelMargin}px;
  content: '';
  display: block;
  width: ${props => props.theme.switchWidth}px;
  height: ${props => props.theme.switchHeight}px;
  border-radius: ${props => props.theme.switchTrackBorderRadius};
`;

const switchButton = css`
  transition: ${props => props.theme.transition};
  position: absolute;
  top: 0;
  left: ${props =>
    (props.checked ? props.theme.switchWidth / 2 : -1) -
    props.theme.switchLabelMargin}px;
  content: '';
  display: block;
  height: ${props => props.theme.switchBtnHeight};
  width: ${props => props.theme.switchBtnWidth};
  background: ${props =>
    props.checked ? props.theme.switchBtnBgdActive : props.theme.switchBtnBgd};
  box-shadow: ${props => props.theme.switchBtnBoxShadow};
  border-radius: ${props => props.theme.switchBtnBorderRadius};
`;

const inputSwitch = css`
  user-select: none;
  cursor: pointer;
  line-height: 0;
  font-weight: 500;
  font-size: 12px;
  color: ${props => props.theme.labelColor};
  position: relative;
  display: inline-block;
  padding-top: ${props => props.theme.switchHeight / 2}px;
  padding-right: 0;
  padding-bottom: 0;
  padding-left: ${props => props.theme.switchWidth}px;

  :before {
    ${props => props.theme.switchTrack};
  }

  :after {
    ${props => props.theme.switchButton};
  }
`;

// This is a light version checkbox
const checkboxBox = css`
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: ${props => props.theme.checkboxWidth}px;
  height: ${props => props.theme.checkboxHeight}px;
  background: ${props =>
    props.checked ? props.theme.checkboxBoxBgdChecked : props.theme.checkboxBoxBgd};
  border: 1px solid
    ${props =>
      props.checked
        ? props.theme.checkboxBoxBgdChecked
        : props.theme.checkboxBorderColor};
  border-radius: 2px;
  content: '';
`;

const checkboxCheck = css`
  width: 10px;
  height: 5px;
  border-bottom: 2px solid white;
  border-left: 2px solid white;
  top: 4px;
  left: 3px;
  transform: rotate(-45deg);
  display: block;
  position: absolute;
  opacity: ${props => (props.checked ? 1 : 0)};
  content: '';
`;

const inputCheckbox = css`
  display: inline-block;
  position: relative;
  padding-left: 32px;
  margin-bottom: 24px;
  line-height: 20px;
  vertical-align: middle;
  cursor: pointer;
  font-size: 12px;
  color: ${props => props.theme.labelColor};
  margin-left: -${props => props.theme.switchLabelMargin}px;

  :before {
    ${props => props.theme.checkboxBox};
  }

  :after {
    ${props => props.theme.checkboxCheck};
  }
`;

const secondarySwitch = css`
  ${props => props.theme.inputSwitch}
  :before {
    ${props => props.theme.switchTrack} background: ${props =>
  props.checked
    ? props.theme.switchTrackBgdActive
    : props.theme.secondarySwitchTrackBgd};
  }

  :after {
    ${props => props.theme.switchButton}
    background: ${props =>
      props.checked
        ? props.theme.switchBtnBgdActive
        : props.theme.secondarySwitchBtnBgd};
  }
`;

const dropdownScrollBar = css`
  ::-webkit-scrollbar {
    height: 10px;
    width: 10px;
  }

  ::-webkit-scrollbar-corner {
    background: ${props => props.theme.dropdownListBgd};
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.dropdownListBgd};
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: ${props => props.theme.labelColor};
    border: 3px solid ${props => props.theme.dropdownListBgd};
  };

  :vertical:hover {
    background: ${props => props.theme.textColorHl};
    cursor: pointer;
  }
}`;

const dropdownListAnchor = css`
  color: ${props => props.theme.selectColor};
  padding-left: 3px;
`;

const dropdownListItem = css`
  font-size: 11px;
  padding: 3px 9px;
  font-weight: 500;

  &.hover,
  &:hover {
    cursor: pointer;
    background-color: ${props => props.theme.dropdownListHighlightBg};

    .list__item__anchor {
      color: ${props => props.theme.textColorHl};
    }
  }
`;

const dropdownListHeader = css`
  font-size: 11px;
  padding: 5px 9px;
  color: ${props => props.theme.labelColor};
`;

const dropdownListSection = css`
  padding: 0 0 4px 0;
  margin-bottom: 4px;
  border-bottom: 1px solid ${props => props.theme.labelColor};
`;

const dropdownList = css`
  overflow-y: auto;
  max-height: 280px;
  box-shadow: ${props => props.theme.dropdownListShadow};
  border-radius: 2px;

  .list__section {
    ${props => props.theme.dropdownListSection};
  }
  .list__header {
    ${props => props.theme.dropdownListHeader};
  }

  .list__item {
    ${props => props.theme.dropdownListItem};
  }

  .list__item__anchor {
    ${props => props.theme.dropdownListAnchor};
  }

  ${props => props.theme.dropdownScrollBar};
`;

const sidePanelScrollBar = css`
  ::-webkit-scrollbar {
    height: ${props => props.theme.sidePanelScrollBarHeight}px;
    width: ${props => props.theme.sidePanelScrollBarWidth}px;
  }

  ::-webkit-scrollbar-corner {
    background: ${props => props.theme.sidePanelBg};
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.sidePanelBg};
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: ${props => props.theme.panelBackgroundHover};
    border: 3px solid ${props => props.theme.sidePanelBg};

    :hover {
      background: ${props => props.theme.labelColor};
      cursor: pointer;
    }
  };
}`;

const panelDropdownScrollBar = css`
  ::-webkit-scrollbar {
    height: 10px;
    width: 10px;
  }

  ::-webkit-scrollbar-corner {
    background: ${props => props.theme.panelBackground};
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.panelBackground};
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: ${props => props.theme.panelBackgroundHover};
    border: 3px solid ${props => props.theme.panelBackground};
    :hover {
      background: ${props => props.theme.labelColor};
      cursor: pointer;
    }
  }
`;

const scrollBar = css`
  ::-webkit-scrollbar {
    height: 10px;
    width: 10px;
  }

  ::-webkit-scrollbar-corner {
    background: ${props => props.theme.panelBackground};
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.panelBackground};
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: ${props => props.theme.labelColor};
    border: 3px solid ${props => props.theme.panelBackground}

    :vertical:hover {
      background: ${props => props.theme.textColorHl};
      cursor: pointer;
    }

    :horizontal:hover {
      background: ${props => props.theme.textColorHl};
      cursor: pointer;
    }
  }
}`;

export const modalScrollBar = css`
  ::-webkit-scrollbar {
    width: 14px;
    height: 16px;
  }

  ::-webkit-scrollbar-track {
    background: white;
  }
  ::-webkit-scrollbar-track:horizontal {
    background: ${props => props.theme.textColorHl};
  }
  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.labelColorLT};
    border: 4px solid white;
  }

  ::-webkit-scrollbar-corner {
    background: ${props => props.theme.textColorHl};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #969da9;
  }

  ::-webkit-scrollbar-thumb:vertical {
    border-radius: 7px;
  }

  ::-webkit-scrollbar-thumb:horizontal {
    border-radius: 9px;
    border: 4px solid ${props => props.theme.textColorHl};
  }
`;

export const theme = {
  ...DIMENSIONS,
  // templates
  input,
  inputLT,
  inlineInput,
  chickletedInput,
  chickletedInputContainer,
  secondaryChickletedInput,

  secondaryInput,
  dropdownScrollBar,
  dropdownList,
  dropdownListItem,
  dropdownListAnchor,
  dropdownListHeader,
  dropdownListSection,
  dropdownListShadow,
  dropdownWrapperZ,
  modalScrollBar,
  scrollBar,
  sidePanelScrollBar,
  inputSwitch,
  secondarySwitch,
  switchTrack,
  switchButton,
  inputCheckbox,
  checkboxBox,
  checkboxCheck,

  // Transitions
  transition,
  transitionFast,
  transitionSlow,

  // styles
  activeColor,
  activeColorHover,
  borderRadius,
  boxShadow,
  errorColor,
  dropdownListHighlightBg,
  dropdownListBgd,
  dropdownListBorderTop,

  labelColor,
  labelColorLT,
  labelHoverColor,
  mapPanelBackgroundColor,
  mapPanelHeaderBackgroundColor,

  // Select
  selectActiveBorderColor,
  selectBackground,
  selectBackgroundLT,
  selectBackgroundHover,
  selectBackgroundHoverLT,
  selectBorder,
  selectBorderColor,
  selectBorderRadius,
  selectBorderColorLT,
  selectColor,
  selectColorPlaceHolder,
  selectFontSize,
  selectFontWeight,
  selectColorLT,
  selectFontWeightBold,

  // Input
  inputBgd,
  inputBgdHover,
  inputBgdActive,
  inputBoxHeight,
  inputBoxHeightSmall,
  inputBoxHeightTiny,
  inputBorderColor,
  inputBorderActiveColor,
  inputBorderHoverColor,
  inputBorderRadius,
  inputColor,
  inputPadding,
  inputPaddingSmall,
  inputPaddingTiny,
  inputFontSize,
  inputFontSizeSmall,
  inputFontWeight,
  inputPlaceholderColor,
  inputPlaceholderFontWeight,

  secondaryInputBgd,
  secondaryInputBgdHover,
  secondaryInputBgdActive,
  secondaryInputColor,
  secondaryInputBorderColor,
  secondaryInputBorderActiveColor,

  // Switch
  switchWidth,
  switchHeight,
  switchTrackBgd,
  switchTrackBgdActive,
  switchTrackBorderRadius,
  switchBtnBgd,
  switchBtnBgdActive,
  switchBtnBoxShadow,
  switchBtnBorderRadius,
  switchBtnWidth,
  switchBtnHeight,
  switchLabelMargin,

  secondarySwitchTrackBgd,
  secondarySwitchBtnBgd,

  // Checkbox
  checkboxWidth,
  checkboxHeight,
  checkboxMargin,
  checkboxBorderColor,
  checkboxBorderRadius,
  checkboxBorderColorLT,
  checkboxBoxBgd,
  checkboxBoxBgdChecked,

  // Button
  primaryBtnBgd,
  primaryBtnActBgd,
  primaryBtnColor,
  primaryBtnActColor,
  primaryBtnBgdHover,
  primaryBtnRadius,
  secondaryBtnBgd,
  secondaryBtnActBgd,
  secondaryBtnBgdHover,
  secondaryBtnColor,
  secondaryBtnActColor,

  negativeBtnBgd,
  negativeBtnActBgd,
  negativeBtnBgdHover,
  negativeBtnColor,
  negativeBtnActColor,

  linkBtnBgd,
  linkBtnActBgd,
  linkBtnColor,
  linkBtnActColor,
  linkBtnActBgdHover,

  // Modal
  modalTitleColor,
  modalTitleFontSize,
  modalTitleFontSizeSmaller,
  modalFooterBgd,
  modalImagePlaceHolder,
  modalPadding,

  modalDialogBgd,
  modalDialogColor,

  modalLateralPadding,
  modalPortableLateralPadding,
  modalOverLayZ,
  modalOverlayBgd,
  modalContentZ,
  modalFooterZ,
  modalTitleZ,
  modalButtonZ,

  // Side Panel
  sidePanelBg,
  sidePanelInnerPadding,
  sideBarCloseBtnBgd,
  sideBarCloseBtnColor,
  sideBarCloseBtnBgdHover,
  sidePanelHeaderBg,
  sidePanelScrollBarWidth,
  sidePanelScrollBarHeight,

  // Side Panel Panel
  panelActiveBg,
  panelBackground,
  panelBackgroundHover,
  panelBackgroundLT,
  panelBoxShadow,
  panelBorderRadius,
  panelBorder,
  panelBorderColor,
  panelBorderLT,
  panelHeaderIcon,
  panelHeaderIconActive,
  panelHeaderHeight,
  panelDropdownScrollBar,

  // Text
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  textColor,
  textColorLT,
  textColorHl,
  titleTextColor,
  subtextColor,
  subtextColorLT,
  subtextColorActive,
  textTruncate,
  titleColorLT,
  tooltipBg,
  tooltipColor,

  // Bottom Panel
  bottomInnerPdSide,
  bottomInnerPdVert,
  bottomPanelGap,

  // Slider
  sliderBarColor,
  sliderBarBgd,
  sliderBarHoverColor,
  sliderBarRadius,
  sliderBarHeight,
  sliderHandleHeight,
  sliderHandleWidth,
  sliderHandleColor,
  sliderHandleHoverColor,
  sliderHandleShadow,
  sliderInputHeight,
  sliderInputWidth,
  sliderMarginTopIsRange,
  sliderMarginTop,

  // Plot
  rangeBrushBgd,
  histogramFillInRange,
  histogramFillOutRange,

  // Notifications
  notificationColors,
  notificationPanelWidth,
  notificationPanelItemWidth,
  notificationPanelItemHeight,

  // datagrid
  columnWidth,
  extendColumnWidth,
  cellHeaderHeight,
  cellHeight,
  cellPaddingSide,
  extendCellHeight,
  gridDefaultWidth,
  gridDefaultHeight,
  gridPaddingSide,

  // time display
  timeDisplayBorderRadius,
  timeDisplayHeight,
  timeDisplayMinWidth,
  timeDisplayOpacity,
  timeDisplayPadding,

  // export map
  exportIntraSectionMargin,

  // Breakpoints
  breakPoints
};

export const themeLT = {
  ...theme,

  // template
  input: inputLT,
  textColor: textColorLT,
  sidePanelBg: '#ffffff',
  titleTextColor: '#000000',
  sidePanelHeaderBg: '#f7f7F7',
  subtextColorActive: '#2473bd',
  tooltipBg: '#1869b5',
  tooltipColor: '#ffffff',
  dropdownListBgd: '#ffffff',
  textColorHl: '#2473bd',
  inputBgd: '#f7f7f7',
  inputBgdHover: '#ffffff',
  inputBgdActive: '#ffffff',
  dropdownListHighlightBg: '#f0f0f0',
  panelBackground: '#f7f7F7',
  panelBackgroundHover: '#f7f7F7',
  panelBorderColor: '#D3D8E0',
  secondaryInputBgd: '#f7f7F7',
  secondaryInputBgdActive: '#f7f7F7',
  secondaryInputBgdHover: '#ffffff',
  panelActiveBg: '#f7f7F7',
  mapPanelBackgroundColor: '#ffffff',
  mapPanelHeaderBackgroundColor: '#f7f7F7',
  sliderBarBgd: '#D3D8E0',
  secondarySwitchBtnBgd: '#D3D8E0',
  switchTrackBgd: '#D3D8E0'
};

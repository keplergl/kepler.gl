'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.theme = exports.modalScrollBar = exports.textTruncate = exports.rangeBrushBgd = exports.sliderHandleShadow = exports.sliderHandleHoverColor = exports.sliderHandleColor = exports.sliderHandleWidth = exports.sliderHandleHeight = exports.sliderBarHeight = exports.sliderBarRadius = exports.sliderBarHoverColor = exports.sliderBarBgd = exports.sliderBarColor = exports.modalFooterBgd = exports.modalTitleFontSize = exports.modalTitleColor = exports.tooltipColor = exports.tooltipBg = exports.mapPanelHeaderBackgroundColor = exports.mapPanelBackgroundColor = exports.panelBorderLT = exports.panelBorder = exports.panelBorderColor = exports.panelBackgroundLT = exports.panelBorderRadius = exports.panelBoxShadow = exports.panelHeaderHeight = exports.panelHeaderIconActive = exports.panelHeaderIcon = exports.panelActiveBg = exports.panelBackgroundHover = exports.panelBackground = exports.sideBarCloseBtnBgdHover = undefined;
exports.sideBarCloseBtnColor = exports.sideBarCloseBtnBgd = exports.sidePanelBg = exports.sidePanelHeaderBg = exports.dropdownListBorderTop = exports.dropdownListBgd = exports.dropdownListShadow = exports.dropdownListHighlightBg = exports.selectBorder = exports.selectBorderRadius = exports.selectBorderColor = exports.selectBackgroundHoverLT = exports.selectBackgroundLT = exports.selectBackgroundHover = exports.selectBackground = exports.selectColorPlaceHolder = exports.selectFontWeightBold = exports.selectFontWeight = exports.selectFontSize = exports.selectActiveBorderColor = exports.selectColorLT = exports.selectColor = exports.secondarySwitchBtnBgd = exports.secondarySwitchTrackBgd = exports.switchBtnHeight = exports.switchBtnWidth = exports.switchBtnBorderRadius = exports.switchBtnBoxShadow = exports.switchBtnBgdActive = exports.switchBtnBgd = exports.switchTrackBorderRadius = exports.switchTrackBgdActive = exports.switchTrackBgd = exports.switchLabelMargin = exports.switchHeight = exports.switchWidth = exports.secondaryInputBorderActiveColor = exports.secondaryInputBorderColor = exports.secondaryInputColor = exports.secondaryInputBgdActive = exports.secondaryInputBgdHover = exports.secondaryInputBgd = exports.secondaryInputHeight = exports.inputPlaceholderFontWeight = exports.inputPlaceholderColor = exports.inputBorderRadius = exports.inputColor = exports.inputBorderActiveColor = exports.inputBorderHoverColor = exports.inputBorderColor = exports.inputBgdActive = exports.inputBgdHover = exports.inputBgd = exports.inputFontWeight = exports.inputFontSize = exports.inputPadding = exports.inputBoxHeight = exports.negativeBtnActColor = exports.negativeBtnColor = exports.negativeBtnBgdHover = exports.negativeBtnActBgd = exports.negativeBtnBgd = exports.linkBtnActBgdHover = exports.linkBtnActColor = exports.linkBtnColor = exports.linkBtnActBgd = exports.linkBtnBgd = exports.secondaryBtnBgdHover = exports.secondaryBtnActColor = exports.secondaryBtnColor = exports.secondaryBtnActBgd = exports.secondaryBtnBgd = exports.primaryBtnRadius = exports.primaryBtnBgdHover = exports.primaryBtnActColor = exports.primaryBtnColor = exports.primaryBtnActBgd = exports.primaryBtnBgd = exports.errorColor = exports.activeColorHover = exports.activeColor = exports.textColorHl = exports.titleTextColor = exports.subtextColorActive = exports.subtextColorLT = exports.subtextColor = exports.titleColorLT = exports.textColorLT = exports.textColor = exports.labelColorLT = exports.labelHoverColor = exports.labelColor = exports.borderColorLight = exports.borderColor = exports.borderRadius = exports.boxSizing = exports.boxShadow = exports.transitionSlow = exports.transitionFast = exports.transition = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  align-items: center;\n  background-color: ', ';\n  border: 1px solid\n    ', ';\n  caret-color: ', ';\n  color: ', ';\n  display: flex;\n  font-size: ', ';\n  font-weight: ', ';\n  height: ', ';\n  justify-content: space-between;\n  outline: none;\n  overflow: hidden;\n  padding: ', ';\n  text-overflow: ellipsis;\n  transition: ', ';\n  white-space: nowrap;\n  width: 100%;\n  word-wrap: normal;\n  pointer-events: ', ';\n  opacity: ', ';\n\n  :hover {\n    cursor: ', ';\n    background-color: ', ';\n    border-color: ', ';\n  }\n\n  :active,\n  :focus,\n  &.focus,\n  &.active {\n    background-color: ', ';\n    border-color: ', ';\n  }\n\n  ::placeholder {\n    color: ', ';\n    font-weight: ', ';\n  }\n\n  /* Disable Arrows on Number Inputs */\n  ::-webkit-inner-spin-button,\n  ::-webkit-outer-spin-button {\n    -webkit-appearance: none;\n    margin: 0;\n  }\n'], ['\n  align-items: center;\n  background-color: ', ';\n  border: 1px solid\n    ', ';\n  caret-color: ', ';\n  color: ', ';\n  display: flex;\n  font-size: ', ';\n  font-weight: ', ';\n  height: ', ';\n  justify-content: space-between;\n  outline: none;\n  overflow: hidden;\n  padding: ', ';\n  text-overflow: ellipsis;\n  transition: ', ';\n  white-space: nowrap;\n  width: 100%;\n  word-wrap: normal;\n  pointer-events: ', ';\n  opacity: ', ';\n\n  :hover {\n    cursor: ', ';\n    background-color: ', ';\n    border-color: ', ';\n  }\n\n  :active,\n  :focus,\n  &.focus,\n  &.active {\n    background-color: ', ';\n    border-color: ', ';\n  }\n\n  ::placeholder {\n    color: ', ';\n    font-weight: ', ';\n  }\n\n  /* Disable Arrows on Number Inputs */\n  ::-webkit-inner-spin-button,\n  ::-webkit-outer-spin-button {\n    -webkit-appearance: none;\n    margin: 0;\n  }\n']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n  ', ' \n  color: ', ';\n  background-color: ', ';\n  height: ', ';\n  border: 1px solid\n    ', ';\n\n  :hover {\n    cursor: pointer;\n    background-color: ', ';\n    border-color: ', ';\n  }\n\n  :active,\n  &.active {\n    background-color: ', ';\n    border-color: ', ';\n  }\n'], ['\n  ', ' \n  color: ', ';\n  background-color: ', ';\n  height: ', ';\n  border: 1px solid\n    ', ';\n\n  :hover {\n    cursor: pointer;\n    background-color: ', ';\n    border-color: ', ';\n  }\n\n  :active,\n  &.active {\n    background-color: ', ';\n    border-color: ', ';\n  }\n']),
    _templateObject3 = (0, _taggedTemplateLiteral3.default)(['\n  ', ' \n  cursor: pointer;\n  flex-wrap: wrap;\n  height: auto;\n  justify-content: start;\n  margin-bottom: 2px;\n  padding: 4px 7px 4px 4px;\n  white-space: normal;\n'], ['\n  ', ' \n  cursor: pointer;\n  flex-wrap: wrap;\n  height: auto;\n  justify-content: start;\n  margin-bottom: 2px;\n  padding: 4px 7px 4px 4px;\n  white-space: normal;\n']),
    _templateObject4 = (0, _taggedTemplateLiteral3.default)(['\n  ', ' color: ', ';\n  font-size: 13px;\n  letter-spacing: 0.43px;\n  line-height: 18px;\n  height: 24px;\n  font-weight: 400;\n  padding-left: 4px;\n  margin-left: -4px;\n  background-color: transparent;\n  border: 1px solid transparent;\n\n  :hover {\n    height: 24px;\n    cursor: text;\n    background-color: transparent;\n    border: 1px solid ', ';\n  }\n\n  :active,\n  .active,\n  :focus {\n    background-color: transparent;\n    border: 1px solid ', ';\n  }\n'], ['\n  ', ' color: ', ';\n  font-size: 13px;\n  letter-spacing: 0.43px;\n  line-height: 18px;\n  height: 24px;\n  font-weight: 400;\n  padding-left: 4px;\n  margin-left: -4px;\n  background-color: transparent;\n  border: 1px solid transparent;\n\n  :hover {\n    height: 24px;\n    cursor: text;\n    background-color: transparent;\n    border: 1px solid ', ';\n  }\n\n  :active,\n  .active,\n  :focus {\n    background-color: transparent;\n    border: 1px solid ', ';\n  }\n']),
    _templateObject5 = (0, _taggedTemplateLiteral3.default)(['\n  background: ', ';\n  position: absolute;\n  top: 0;\n  left: ', 'px;\n  content: \'\';\n  display: block;\n  width: ', 'px;\n  height: ', 'px;\n  border-radius: ', ';\n'], ['\n  background: ', ';\n  position: absolute;\n  top: 0;\n  left: ', 'px;\n  content: \'\';\n  display: block;\n  width: ', 'px;\n  height: ', 'px;\n  border-radius: ', ';\n']),
    _templateObject6 = (0, _taggedTemplateLiteral3.default)(['\n  transition: ', ';\n  position: absolute;\n  top: 0;\n  left: ', 'px;\n  content: \'\';\n  display: block;\n  height: ', ';\n  width: ', ';\n  background: ', ';\n  box-shadow: ', ';\n'], ['\n  transition: ', ';\n  position: absolute;\n  top: 0;\n  left: ', 'px;\n  content: \'\';\n  display: block;\n  height: ', ';\n  width: ', ';\n  background: ', ';\n  box-shadow: ', ';\n']),
    _templateObject7 = (0, _taggedTemplateLiteral3.default)(['\n  user-select: none;\n  cursor: pointer;\n  line-height: 0;\n  font-weight: 500;\n  font-size: 12px;\n  color: ', ';\n  position: relative;\n  display: inline-block;\n  padding-top: ', 'px;\n  padding-right: 0;\n  padding-bottom: 0;\n  padding-left: ', 'px;\n\n  :before {\n    ', ';\n  }\n\n  :after {\n    ', ';\n  }\n'], ['\n  user-select: none;\n  cursor: pointer;\n  line-height: 0;\n  font-weight: 500;\n  font-size: 12px;\n  color: ', ';\n  position: relative;\n  display: inline-block;\n  padding-top: ', 'px;\n  padding-right: 0;\n  padding-bottom: 0;\n  padding-left: ', 'px;\n\n  :before {\n    ', ';\n  }\n\n  :after {\n    ', ';\n  }\n']),
    _templateObject8 = (0, _taggedTemplateLiteral3.default)(['\n  ', ' \n  :before {\n    ', ' background: ', ';\n  }\n\n  :after {\n    ', ' \n    background: ', ';\n  }\n'], ['\n  ', ' \n  :before {\n    ', ' background: ', ';\n  }\n\n  :after {\n    ', ' \n    background: ', ';\n  }\n']),
    _templateObject9 = (0, _taggedTemplateLiteral3.default)(['\n  ::-webkit-scrollbar {\n    height: 10px;\n    width: 10px;\n  }\n  \n  ::-webkit-scrollbar-corner {\n    background: ', ';\n  }\n  \n  ::-webkit-scrollbar-track {\n    background: ', ';\n  }\n  \n  ::-webkit-scrollbar-thumb {\n    border-radius: 10px;\n    background: ', ';\n    border: 3px solid ', ';\n  };\n  \n  :vertical:hover {\n    background: ', ';\n  }\n}'], ['\n  ::-webkit-scrollbar {\n    height: 10px;\n    width: 10px;\n  }\n  \n  ::-webkit-scrollbar-corner {\n    background: ', ';\n  }\n  \n  ::-webkit-scrollbar-track {\n    background: ', ';\n  }\n  \n  ::-webkit-scrollbar-thumb {\n    border-radius: 10px;\n    background: ', ';\n    border: 3px solid ', ';\n  };\n  \n  :vertical:hover {\n    background: ', ';\n  }\n}']),
    _templateObject10 = (0, _taggedTemplateLiteral3.default)(['\n  color: ', ';\n  padding-left: 3px;\n'], ['\n  color: ', ';\n  padding-left: 3px;\n']),
    _templateObject11 = (0, _taggedTemplateLiteral3.default)(['\n  font-size: 11px;\n  padding: 3px 9px;\n  font-weight: 500;\n\n  &.hover,\n  &:hover {\n    cursor: pointer;\n    background-color: ', ';\n\n    .list__item__anchor {\n      color: ', ';\n    }\n  }\n'], ['\n  font-size: 11px;\n  padding: 3px 9px;\n  font-weight: 500;\n\n  &.hover,\n  &:hover {\n    cursor: pointer;\n    background-color: ', ';\n\n    .list__item__anchor {\n      color: ', ';\n    }\n  }\n']),
    _templateObject12 = (0, _taggedTemplateLiteral3.default)(['\n  font-size: 11px;\n  padding: 5px 9px;\n  color: ', ';\n'], ['\n  font-size: 11px;\n  padding: 5px 9px;\n  color: ', ';\n']),
    _templateObject13 = (0, _taggedTemplateLiteral3.default)(['\n  padding: 0 0 4px 0;\n  margin-bottom: 4px;\n  border-bottom: 1px solid ', ';\n'], ['\n  padding: 0 0 4px 0;\n  margin-bottom: 4px;\n  border-bottom: 1px solid ', ';\n']),
    _templateObject14 = (0, _taggedTemplateLiteral3.default)(['\n  overflow-y: overlay;\n  max-height: 280px;\n  box-shadow: ', ';\n  border-radius: 2px;\n\n  .list__section {\n    ', ';\n  }\n  .list__header {\n    ', ';\n  }\n\n  .list__item {\n    ', ';\n  }\n\n  .list__item__anchor {\n    ', ';\n  }\n\n  ', ';\n'], ['\n  overflow-y: overlay;\n  max-height: 280px;\n  box-shadow: ', ';\n  border-radius: 2px;\n\n  .list__section {\n    ', ';\n  }\n  .list__header {\n    ', ';\n  }\n\n  .list__item {\n    ', ';\n  }\n\n  .list__item__anchor {\n    ', ';\n  }\n\n  ', ';\n']),
    _templateObject15 = (0, _taggedTemplateLiteral3.default)(['\n  ::-webkit-scrollbar {\n    height: 10px;\n    width: 10px;\n  }\n\n  \n  ::-webkit-scrollbar-corner {\n    background: ', ';\n  }\n  \n  ::-webkit-scrollbar-track {\n    background: ', ';\n  }\n  \n  ::-webkit-scrollbar-thumb {\n    border-radius: 10px;\n    background: ', ';\n    border: 3px solid ', '\n\n    \':vertical:hover\': {\n      background: ', ';\n    }\n    \n     \':horizontal:hover\': {\n      background: ', ';\n    }\n  }\n}'], ['\n  ::-webkit-scrollbar {\n    height: 10px;\n    width: 10px;\n  }\n\n  \n  ::-webkit-scrollbar-corner {\n    background: ', ';\n  }\n  \n  ::-webkit-scrollbar-track {\n    background: ', ';\n  }\n  \n  ::-webkit-scrollbar-thumb {\n    border-radius: 10px;\n    background: ', ';\n    border: 3px solid ', '\n\n    \':vertical:hover\': {\n      background: ', ';\n    }\n    \n     \':horizontal:hover\': {\n      background: ', ';\n    }\n  }\n}']),
    _templateObject16 = (0, _taggedTemplateLiteral3.default)(['\n  ::-webkit-scrollbar {\n    width: 14px;\n    height: 16px;\n  }\n\n  ::-webkit-scrollbar-track {\n    background: white;\n  }\n  ::-webkit-scrollbar-track:horizontal {\n    background: ', ';\n  }\n  ::-webkit-scrollbar-thumb {\n    background: ', ';\n    border: 4px solid white;\n  }\n\n  ::-webkit-scrollbar-corner {\n    background: ', ';\n  }\n\n  ::-webkit-scrollbar-thumb:hover {\n    background: #969da9;\n  }\n\n  ::-webkit-scrollbar-thumb:vertical {\n    border-radius: 7px;\n  }\n\n  ::-webkit-scrollbar-thumb:horizontal {\n    border-radius: 9px;\n    border: 4px solid ', ';\n  }\n'], ['\n  ::-webkit-scrollbar {\n    width: 14px;\n    height: 16px;\n  }\n\n  ::-webkit-scrollbar-track {\n    background: white;\n  }\n  ::-webkit-scrollbar-track:horizontal {\n    background: ', ';\n  }\n  ::-webkit-scrollbar-thumb {\n    background: ', ';\n    border: 4px solid white;\n  }\n\n  ::-webkit-scrollbar-corner {\n    background: ', ';\n  }\n\n  ::-webkit-scrollbar-thumb:hover {\n    background: #969da9;\n  }\n\n  ::-webkit-scrollbar-thumb:vertical {\n    border-radius: 7px;\n  }\n\n  ::-webkit-scrollbar-thumb:horizontal {\n    border-radius: 9px;\n    border: 4px solid ', ';\n  }\n']);

var _styledComponents = require('styled-components');

var _defaultSettings = require('../constants/default-settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var transition = exports.transition = 'all .4s ease';
var transitionFast = exports.transitionFast = 'all .2s ease';
var transitionSlow = exports.transitionSlow = 'all .8s ease';

var boxShadow = exports.boxShadow = '0 1px 2px 0 rgba(0,0,0,0.10)';
var boxSizing = exports.boxSizing = 'border-box';
var borderRadius = exports.borderRadius = '1px';
var borderColor = exports.borderColor = '#3A414C';
var borderColorLight = exports.borderColorLight = '#F1F1F1';

// TEXT
var labelColor = exports.labelColor = '#6A7485';
var labelHoverColor = exports.labelHoverColor = '#C6C6C6';
var labelColorLT = exports.labelColorLT = '#6A7485';

var textColor = exports.textColor = '#A0A7B4';
var textColorLT = exports.textColorLT = '#3A414C';
var titleColorLT = exports.titleColorLT = '#29323C';

var subtextColor = exports.subtextColor = '#6A7485';
var subtextColorLT = exports.subtextColorLT = '#A0A7B4';
var subtextColorActive = exports.subtextColorActive = '#FFFFFF';

var titleTextColor = exports.titleTextColor = '#FFFFFF';
var textColorHl = exports.textColorHl = '#D3D8E0';
var activeColor = exports.activeColor = '#1FBAD6';
var activeColorHover = exports.activeColorHover = '#108188';
var errorColor = exports.errorColor = '#F9042C';

// Button
var primaryBtnBgd = exports.primaryBtnBgd = '#0F9668';
var primaryBtnActBgd = exports.primaryBtnActBgd = '#13B17B';
var primaryBtnColor = exports.primaryBtnColor = '#FFFFFF';
var primaryBtnActColor = exports.primaryBtnActColor = '#FFFFFF';
var primaryBtnBgdHover = exports.primaryBtnBgdHover = '#13B17B';
var primaryBtnRadius = exports.primaryBtnRadius = '2px';

var secondaryBtnBgd = exports.secondaryBtnBgd = '#6A7485';
var secondaryBtnActBgd = exports.secondaryBtnActBgd = '#A0A7B4';
var secondaryBtnColor = exports.secondaryBtnColor = '#FFFFFF';
var secondaryBtnActColor = exports.secondaryBtnActColor = '#FFFFFF';
var secondaryBtnBgdHover = exports.secondaryBtnBgdHover = '#A0A7B4';

var linkBtnBgd = exports.linkBtnBgd = 'transparent';
var linkBtnActBgd = exports.linkBtnActBgd = linkBtnBgd;
var linkBtnColor = exports.linkBtnColor = '#A0A7B4';
var linkBtnActColor = exports.linkBtnActColor = '#3A414C';
var linkBtnActBgdHover = exports.linkBtnActBgdHover = linkBtnBgd;

var negativeBtnBgd = exports.negativeBtnBgd = errorColor;
var negativeBtnActBgd = exports.negativeBtnActBgd = '#FF193E';
var negativeBtnBgdHover = exports.negativeBtnBgdHover = '#FF193E';
var negativeBtnColor = exports.negativeBtnColor = '#FFFFFF';
var negativeBtnActColor = exports.negativeBtnActColor = '#FFFFFF';

// Input
var inputBoxHeight = exports.inputBoxHeight = '34px';
var inputPadding = exports.inputPadding = '4px 10px';
var inputFontSize = exports.inputFontSize = '11px';
var inputFontWeight = exports.inputFontWeight = 500;
var inputBgd = exports.inputBgd = '#29323C';
var inputBgdHover = exports.inputBgdHover = '#3A414C';
var inputBgdActive = exports.inputBgdActive = '#3A414C';
var inputBorderColor = exports.inputBorderColor = '#29323C';
var inputBorderHoverColor = exports.inputBorderHoverColor = '#3A414C';
var inputBorderActiveColor = exports.inputBorderActiveColor = '#D3D8E0';
var inputColor = exports.inputColor = '#A0A7B4';
var inputBorderRadius = exports.inputBorderRadius = '1px';
var inputPlaceholderColor = exports.inputPlaceholderColor = '#6A7485';
var inputPlaceholderFontWeight = exports.inputPlaceholderFontWeight = 400;

var secondaryInputHeight = exports.secondaryInputHeight = '28px';
var secondaryInputBgd = exports.secondaryInputBgd = '#242730';
var secondaryInputBgdHover = exports.secondaryInputBgdHover = '#3A414C';
var secondaryInputBgdActive = exports.secondaryInputBgdActive = '#3A414C';
var secondaryInputColor = exports.secondaryInputColor = '#A0A7B4';
var secondaryInputBorderColor = exports.secondaryInputBorderColor = '#242730';
var secondaryInputBorderActiveColor = exports.secondaryInputBorderActiveColor = '#D3D8E0';

var switchWidth = exports.switchWidth = 24;
var switchHeight = exports.switchHeight = 12;
var switchLabelMargin = exports.switchLabelMargin = 12;

var switchTrackBgd = exports.switchTrackBgd = '#29323C';
var switchTrackBgdActive = exports.switchTrackBgdActive = activeColor;
var switchTrackBorderRadius = exports.switchTrackBorderRadius = '1px';
var switchBtnBgd = exports.switchBtnBgd = '#6A7485';
var switchBtnBgdActive = exports.switchBtnBgdActive = '#D3D8E0';
var switchBtnBoxShadow = exports.switchBtnBoxShadow = '0 2px 4px 0 rgba(0,0,0,0.40)';
var switchBtnBorderRadius = exports.switchBtnBorderRadius = '1px';
var switchBtnWidth = exports.switchBtnWidth = '12px';
var switchBtnHeight = exports.switchBtnHeight = '12px';

var secondarySwitchTrackBgd = exports.secondarySwitchTrackBgd = '#242730';
var secondarySwitchBtnBgd = exports.secondarySwitchBtnBgd = '#3A414C';

// Select
var selectColor = exports.selectColor = inputColor;
var selectColorLT = exports.selectColorLT = titleColorLT;

var selectActiveBorderColor = exports.selectActiveBorderColor = '#D3D8E0';
var selectFontSize = exports.selectFontSize = '11px';
var selectFontWeight = exports.selectFontWeight = '400';
var selectFontWeightBold = exports.selectFontWeightBold = '500';

var selectColorPlaceHolder = exports.selectColorPlaceHolder = '#6A7485';
var selectBackground = exports.selectBackground = inputBgd;
var selectBackgroundHover = exports.selectBackgroundHover = inputBgdHover;
var selectBackgroundLT = exports.selectBackgroundLT = '#FFFFFF';
var selectBackgroundHoverLT = exports.selectBackgroundHoverLT = '#F8F8F9';
var selectBorderColor = exports.selectBorderColor = '#D3D8E0';
var selectBorderRadius = exports.selectBorderRadius = '1px';
var selectBorder = exports.selectBorder = 0;

var dropdownListHighlightBg = exports.dropdownListHighlightBg = '#6A7485';
var dropdownListShadow = exports.dropdownListShadow = '0 6px 12px 0 rgba(0,0,0,0.16)';
var dropdownListBgd = exports.dropdownListBgd = '#3A414C';
var dropdownListBorderTop = exports.dropdownListBorderTop = '#242730';

// Side Panel
var sidePanelHeaderBg = exports.sidePanelHeaderBg = '#29323C';
var sidePanelBg = exports.sidePanelBg = '#242730';
var sideBarCloseBtnBgd = exports.sideBarCloseBtnBgd = secondaryBtnBgd;
var sideBarCloseBtnColor = exports.sideBarCloseBtnColor = '#29323C';
var sideBarCloseBtnBgdHover = exports.sideBarCloseBtnBgdHover = secondaryBtnActBgd;

var panelBackground = exports.panelBackground = '#29323C';
var panelBackgroundHover = exports.panelBackgroundHover = '#3A4552';
var panelActiveBg = exports.panelActiveBg = '#3A4552';
var panelHeaderIcon = exports.panelHeaderIcon = '#6A7485';
var panelHeaderIconActive = exports.panelHeaderIconActive = '#A0A7B4';
var panelHeaderHeight = exports.panelHeaderHeight = 48;
var panelBoxShadow = exports.panelBoxShadow = '0 6px 12px 0 rgba(0,0,0,0.16)';
var panelBorderRadius = exports.panelBorderRadius = '2px';
var panelBackgroundLT = exports.panelBackgroundLT = '#f8f8f9';

var panelBorderColor = exports.panelBorderColor = '#3A414C';
var panelBorder = exports.panelBorder = '1px solid ' + borderColor;
var panelBorderLT = exports.panelBorderLT = '1px solid ' + borderColorLight;

var mapPanelBackgroundColor = exports.mapPanelBackgroundColor = '#242730';
var mapPanelHeaderBackgroundColor = exports.mapPanelHeaderBackgroundColor = '#29323C';
var tooltipBg = exports.tooltipBg = '#F8F8F9';
var tooltipColor = exports.tooltipColor = '#333334';

// Modal
var modalTitleColor = exports.modalTitleColor = '#3A414C';
var modalTitleFontSize = exports.modalTitleFontSize = '32px';
var modalFooterBgd = exports.modalFooterBgd = '#F8F8F9';

var sliderBarColor = exports.sliderBarColor = '#6A7485';
var sliderBarBgd = exports.sliderBarBgd = '#3A414C';
var sliderBarHoverColor = exports.sliderBarHoverColor = '#D3D8E0';
var sliderBarRadius = exports.sliderBarRadius = '1px';
var sliderBarHeight = exports.sliderBarHeight = '4px';
var sliderHandleHeight = exports.sliderHandleHeight = '12px';
var sliderHandleWidth = exports.sliderHandleWidth = '12px';
var sliderHandleColor = exports.sliderHandleColor = '#D3D8E0';
var sliderHandleHoverColor = exports.sliderHandleHoverColor = '#FFFFFF';
var sliderHandleShadow = exports.sliderHandleShadow = '0 2px 4px 0 rgba(0,0,0,0.40)';

// Plot
var rangeBrushBgd = exports.rangeBrushBgd = '#3A414C';

var textTruncate = exports.textTruncate = {
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  wordWrap: 'normal'
};

// theme is passed to kepler.gl when it's mounted,
// it is used by styled-components to pass along to
// all child components

var input = (0, _styledComponents.css)(_templateObject, function (props) {
  return props.theme.inputBgd;
}, function (props) {
  return props.active ? props.theme.inputBorderActiveColor : props.error ? props.theme.errorColor : props.theme.inputBgd;
}, function (props) {
  return props.theme.inputBorderActiveColor;
}, function (props) {
  return props.theme.inputColor;
}, function (props) {
  return props.theme.inputFontSize;
}, function (props) {
  return props.theme.inputFontWeight;
}, function (props) {
  return props.theme.inputBoxHeight;
}, function (props) {
  return props.theme.inputPadding;
}, function (props) {
  return props.theme.transition;
}, function (props) {
  return props.disabled ? 'none' : 'all';
}, function (props) {
  return props.disabled ? 0.5 : 1;
}, function (props) {
  return props.type === 'number' ? 'text' : 'pointer';
}, function (props) {
  return props.active ? props.theme.inputBgdActive : props.theme.inputBgdHover;
}, function (props) {
  return props.active ? props.theme.inputBorderActiveColor : props.theme.inputBorderHoverColor;
}, function (props) {
  return props.theme.inputBgdActive;
}, function (props) {
  return props.theme.inputBorderActiveColor;
}, function (props) {
  return props.theme.inputPlaceholderColor;
}, function (props) {
  return props.theme.inputPlaceholderFontWeight;
});

var secondaryInput = (0, _styledComponents.css)(_templateObject2, function (props) {
  return props.theme.input;
}, function (props) {
  return props.theme.secondaryInputColor;
}, function (props) {
  return props.theme.secondaryInputBgd;
}, function (props) {
  return props.theme.secondaryInputHeight;
}, function (props) {
  return props.error ? props.theme.errorColor : props.theme.secondaryInputBorderColor;
}, function (props) {
  return props.theme.secondaryInputBgdHover;
}, function (props) {
  return props.theme.secondaryInputBgdHover;
}, function (props) {
  return props.theme.secondaryInputBgdActive;
}, function (props) {
  return props.theme.secondaryInputBorderActiveColor;
});

var chickletedInput = (0, _styledComponents.css)(_templateObject3, function (props) {
  return props.theme.secondaryInput;
});

var inlineInput = (0, _styledComponents.css)(_templateObject4, function (props) {
  return props.theme.input;
}, function (props) {
  return props.theme.textColor;
}, function (props) {
  return props.theme.labelColor;
}, function (props) {
  return props.theme.inputBorderActiveColor;
});

var switchTrack = (0, _styledComponents.css)(_templateObject5, function (props) {
  return props.checked ? props.theme.switchTrackBgdActive : props.theme.switchTrackBgd;
}, function (props) {
  return -props.theme.switchLabelMargin;
}, function (props) {
  return props.theme.switchWidth;
}, function (props) {
  return props.theme.switchHeight;
}, function (props) {
  return props.theme.switchTrackBorderRadius;
});

var switchButton = (0, _styledComponents.css)(_templateObject6, function (props) {
  return props.theme.transition;
}, function (props) {
  return (props.checked ? props.theme.switchWidth / 2 : -1) - props.theme.switchLabelMargin;
}, function (props) {
  return props.theme.switchBtnHeight;
}, function (props) {
  return props.theme.switchBtnWidth;
}, function (props) {
  return props.checked ? props.theme.switchBtnBgdActive : props.theme.switchBtnBgd;
}, function (props) {
  return props.theme.switchBtnBoxShadow;
});

var inputSwitch = (0, _styledComponents.css)(_templateObject7, function (props) {
  return props.theme.labelColor;
}, function (props) {
  return props.theme.switchHeight / 2;
}, function (props) {
  return props.theme.switchWidth;
}, function (props) {
  return props.theme.switchTrack;
}, function (props) {
  return props.theme.switchButton;
});

var secondarySwitch = (0, _styledComponents.css)(_templateObject8, function (props) {
  return props.theme.inputSwitch;
}, function (props) {
  return props.theme.switchTrack;
}, function (props) {
  return props.checked ? props.theme.switchTrackBgdActive : props.theme.secondarySwitchTrackBgd;
}, function (props) {
  return props.theme.switchButton;
}, function (props) {
  return props.checked ? props.theme.switchBtnBgdActive : props.theme.secondarySwitchBtnBgd;
});

var dropdownScrollBar = (0, _styledComponents.css)(_templateObject9, function (props) {
  return props.theme.dropdownListBgd;
}, function (props) {
  return props.theme.dropdownListBgd;
}, function (props) {
  return props.theme.labelColor;
}, function (props) {
  return props.theme.dropdownListBgd;
}, function (props) {
  return props.theme.textColorHl;
});

var dropdownListAnchor = (0, _styledComponents.css)(_templateObject10, function (props) {
  return props.theme.selectColor;
});

var dropdownListItem = (0, _styledComponents.css)(_templateObject11, function (props) {
  return props.theme.dropdownListHighlightBg;
}, function (props) {
  return props.theme.textColorHl;
});

var dropdownListHeader = (0, _styledComponents.css)(_templateObject12, function (props) {
  return props.theme.labelColor;
});

var dropdownListSection = (0, _styledComponents.css)(_templateObject13, function (props) {
  return props.theme.labelColor;
});

var dropdownList = (0, _styledComponents.css)(_templateObject14, function (props) {
  return props.theme.dropdownListShadow;
}, function (props) {
  return props.theme.dropdownListSection;
}, function (props) {
  return props.theme.dropdownListHeader;
}, function (props) {
  return props.theme.dropdownListItem;
}, function (props) {
  return props.theme.dropdownListAnchor;
}, function (props) {
  return props.theme.dropdownScrollBar;
});

var sidePanelScrollBar = (0, _styledComponents.css)(_templateObject9, function (props) {
  return props.theme.sidePanelBg;
}, function (props) {
  return props.theme.sidePanelBg;
}, function (props) {
  return props.theme.labelColor;
}, function (props) {
  return props.theme.sidePanelBg;
}, function (props) {
  return props.theme.textColorHl;
});

var scrollBar = (0, _styledComponents.css)(_templateObject15, function (props) {
  return props.theme.panelBackground;
}, function (props) {
  return props.theme.panelBackground;
}, function (props) {
  return props.theme.labelColor;
}, function (props) {
  return props.theme.panelBackground;
}, function (props) {
  return props.theme.textColorHl;
}, function (props) {
  return props.theme.textColorHl;
});

var modalScrollBar = exports.modalScrollBar = (0, _styledComponents.css)(_templateObject16, function (props) {
  return props.theme.textColorHl;
}, function (props) {
  return props.theme.labelColorLT;
}, function (props) {
  return props.theme.textColorHl;
}, function (props) {
  return props.theme.textColorHl;
});

var theme = exports.theme = (0, _extends3.default)({}, _defaultSettings.DIMENSIONS, {
  // templates
  input: input,
  inlineInput: inlineInput,
  chickletedInput: chickletedInput,
  secondaryInput: secondaryInput,
  dropdownScrollBar: dropdownScrollBar,
  dropdownList: dropdownList,
  dropdownListItem: dropdownListItem,
  dropdownListAnchor: dropdownListAnchor,
  dropdownListHeader: dropdownListHeader,
  dropdownListSection: dropdownListSection,
  dropdownListShadow: dropdownListShadow,
  modalScrollBar: modalScrollBar,
  scrollBar: scrollBar,
  sidePanelScrollBar: sidePanelScrollBar,
  inputSwitch: inputSwitch,
  secondarySwitch: secondarySwitch,
  switchTrack: switchTrack,
  switchButton: switchButton,

  // Transitions
  transition: transition,
  transitionFast: transitionFast,
  transitionSlow: transitionSlow,

  // styles
  activeColor: activeColor,
  activeColorHover: activeColorHover,
  borderRadius: borderRadius,
  boxShadow: boxShadow,
  errorColor: errorColor,
  dropdownListHighlightBg: dropdownListHighlightBg,
  dropdownListBgd: dropdownListBgd,
  dropdownListBorderTop: dropdownListBorderTop,

  labelColor: labelColor,
  labelColorLT: labelColorLT,
  labelHoverColor: labelHoverColor,
  mapPanelBackgroundColor: mapPanelBackgroundColor,
  mapPanelHeaderBackgroundColor: mapPanelHeaderBackgroundColor,

  // Select
  selectActiveBorderColor: selectActiveBorderColor,
  selectBackground: selectBackground,
  selectBackgroundLT: selectBackgroundLT,
  selectBackgroundHover: selectBackgroundHover,
  selectBackgroundHoverLT: selectBackgroundHoverLT,
  selectBorder: selectBorder,
  selectBorderColor: selectBorderColor,
  selectBorderRadius: selectBorderRadius,
  selectColor: selectColor,
  selectColorPlaceHolder: selectColorPlaceHolder,
  selectFontSize: selectFontSize,
  selectFontWeight: selectFontWeight,
  selectColorLT: selectColorLT,

  // Input
  inputBgd: inputBgd,
  inputBgdHover: inputBgdHover,
  inputBgdActive: inputBgdActive,
  inputBoxHeight: inputBoxHeight,
  inputBorderColor: inputBorderColor,
  inputBorderActiveColor: inputBorderActiveColor,
  inputBorderHoverColor: inputBorderHoverColor,
  inputBorderRadius: inputBorderRadius,
  inputColor: inputColor,
  inputPadding: inputPadding,
  inputFontSize: inputFontSize,
  inputFontWeight: inputFontWeight,
  inputPlaceholderColor: inputPlaceholderColor,
  inputPlaceholderFontWeight: inputPlaceholderFontWeight,

  secondaryInputBgd: secondaryInputBgd,
  secondaryInputBgdHover: secondaryInputBgdHover,
  secondaryInputBgdActive: secondaryInputBgdActive,
  secondaryInputHeight: secondaryInputHeight,
  secondaryInputColor: secondaryInputColor,
  secondaryInputBorderColor: secondaryInputBorderColor,
  secondaryInputBorderActiveColor: secondaryInputBorderActiveColor,

  switchWidth: switchWidth,
  switchHeight: switchHeight,
  switchTrackBgd: switchTrackBgd,
  switchTrackBgdActive: switchTrackBgdActive,
  switchTrackBorderRadius: switchTrackBorderRadius,
  switchBtnBgd: switchBtnBgd,
  switchBtnBgdActive: switchBtnBgdActive,
  switchBtnBoxShadow: switchBtnBoxShadow,
  switchBtnBorderRadius: switchBtnBorderRadius,
  switchBtnWidth: switchBtnWidth,
  switchBtnHeight: switchBtnHeight,
  switchLabelMargin: switchLabelMargin,

  secondarySwitchTrackBgd: secondarySwitchTrackBgd,
  secondarySwitchBtnBgd: secondarySwitchBtnBgd,

  // Button
  primaryBtnBgd: primaryBtnBgd,
  primaryBtnActBgd: primaryBtnActBgd,
  primaryBtnColor: primaryBtnColor,
  primaryBtnActColor: primaryBtnActColor,
  primaryBtnBgdHover: primaryBtnBgdHover,
  primaryBtnRadius: primaryBtnRadius,
  secondaryBtnBgd: secondaryBtnBgd,
  secondaryBtnActBgd: secondaryBtnActBgd,
  secondaryBtnBgdHover: secondaryBtnBgdHover,
  secondaryBtnColor: secondaryBtnColor,
  secondaryBtnActColor: secondaryBtnActColor,

  negativeBtnBgd: negativeBtnBgd,
  negativeBtnActBgd: negativeBtnActBgd,
  negativeBtnBgdHover: negativeBtnBgdHover,
  negativeBtnColor: negativeBtnColor,
  negativeBtnActColor: negativeBtnActColor,

  linkBtnBgd: linkBtnBgd,
  linkBtnActBgd: linkBtnActBgd,
  linkBtnColor: linkBtnColor,
  linkBtnActColor: linkBtnActColor,
  linkBtnActBgdHover: linkBtnActBgdHover,

  // Modal
  modalTitleColor: modalTitleColor,
  modalTitleFontSize: modalTitleFontSize,
  modalFooterBgd: modalFooterBgd,

  // Side Panel
  sidePanelBg: sidePanelBg,

  sideBarCloseBtnBgd: sideBarCloseBtnBgd,
  sideBarCloseBtnColor: sideBarCloseBtnColor,
  sideBarCloseBtnBgdHover: sideBarCloseBtnBgdHover,
  sidePanelHeaderBg: sidePanelHeaderBg,

  // Side Panel Panel
  panelActiveBg: panelActiveBg,
  panelBackground: panelBackground,
  panelBackgroundHover: panelBackgroundHover,
  panelBackgroundLT: panelBackgroundLT,
  panelBoxShadow: panelBoxShadow,
  panelBorderRadius: panelBorderRadius,
  panelBorder: panelBorder,
  panelBorderColor: panelBorderColor,
  panelBorderLT: panelBorderLT,
  panelHeaderIcon: panelHeaderIcon,
  panelHeaderIconActive: panelHeaderIconActive,
  panelHeaderHeight: panelHeaderHeight,

  // Text
  textColor: textColor,
  textColorLT: textColorLT,
  textColorHl: textColorHl,
  titleTextColor: titleTextColor,
  subtextColor: subtextColor,
  subtextColorLT: subtextColorLT,
  subtextColorActive: subtextColorActive,
  textTruncate: textTruncate,
  titleColorLT: titleColorLT,
  tooltipBg: tooltipBg,
  tooltipColor: tooltipColor,

  // Slider
  sliderBarColor: sliderBarColor,
  sliderBarBgd: sliderBarBgd,
  sliderBarHoverColor: sliderBarHoverColor,
  sliderBarRadius: sliderBarRadius,
  sliderBarHeight: sliderBarHeight,
  sliderHandleHeight: sliderHandleHeight,
  sliderHandleWidth: sliderHandleWidth,
  sliderHandleColor: sliderHandleColor,
  sliderHandleHoverColor: sliderHandleHoverColor,
  sliderHandleShadow: sliderHandleShadow,

  // Plot
  rangeBrushBgd: rangeBrushBgd
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHlsZXMvYmFzZS5qcyJdLCJuYW1lcyI6WyJ0cmFuc2l0aW9uIiwidHJhbnNpdGlvbkZhc3QiLCJ0cmFuc2l0aW9uU2xvdyIsImJveFNoYWRvdyIsImJveFNpemluZyIsImJvcmRlclJhZGl1cyIsImJvcmRlckNvbG9yIiwiYm9yZGVyQ29sb3JMaWdodCIsImxhYmVsQ29sb3IiLCJsYWJlbEhvdmVyQ29sb3IiLCJsYWJlbENvbG9yTFQiLCJ0ZXh0Q29sb3IiLCJ0ZXh0Q29sb3JMVCIsInRpdGxlQ29sb3JMVCIsInN1YnRleHRDb2xvciIsInN1YnRleHRDb2xvckxUIiwic3VidGV4dENvbG9yQWN0aXZlIiwidGl0bGVUZXh0Q29sb3IiLCJ0ZXh0Q29sb3JIbCIsImFjdGl2ZUNvbG9yIiwiYWN0aXZlQ29sb3JIb3ZlciIsImVycm9yQ29sb3IiLCJwcmltYXJ5QnRuQmdkIiwicHJpbWFyeUJ0bkFjdEJnZCIsInByaW1hcnlCdG5Db2xvciIsInByaW1hcnlCdG5BY3RDb2xvciIsInByaW1hcnlCdG5CZ2RIb3ZlciIsInByaW1hcnlCdG5SYWRpdXMiLCJzZWNvbmRhcnlCdG5CZ2QiLCJzZWNvbmRhcnlCdG5BY3RCZ2QiLCJzZWNvbmRhcnlCdG5Db2xvciIsInNlY29uZGFyeUJ0bkFjdENvbG9yIiwic2Vjb25kYXJ5QnRuQmdkSG92ZXIiLCJsaW5rQnRuQmdkIiwibGlua0J0bkFjdEJnZCIsImxpbmtCdG5Db2xvciIsImxpbmtCdG5BY3RDb2xvciIsImxpbmtCdG5BY3RCZ2RIb3ZlciIsIm5lZ2F0aXZlQnRuQmdkIiwibmVnYXRpdmVCdG5BY3RCZ2QiLCJuZWdhdGl2ZUJ0bkJnZEhvdmVyIiwibmVnYXRpdmVCdG5Db2xvciIsIm5lZ2F0aXZlQnRuQWN0Q29sb3IiLCJpbnB1dEJveEhlaWdodCIsImlucHV0UGFkZGluZyIsImlucHV0Rm9udFNpemUiLCJpbnB1dEZvbnRXZWlnaHQiLCJpbnB1dEJnZCIsImlucHV0QmdkSG92ZXIiLCJpbnB1dEJnZEFjdGl2ZSIsImlucHV0Qm9yZGVyQ29sb3IiLCJpbnB1dEJvcmRlckhvdmVyQ29sb3IiLCJpbnB1dEJvcmRlckFjdGl2ZUNvbG9yIiwiaW5wdXRDb2xvciIsImlucHV0Qm9yZGVyUmFkaXVzIiwiaW5wdXRQbGFjZWhvbGRlckNvbG9yIiwiaW5wdXRQbGFjZWhvbGRlckZvbnRXZWlnaHQiLCJzZWNvbmRhcnlJbnB1dEhlaWdodCIsInNlY29uZGFyeUlucHV0QmdkIiwic2Vjb25kYXJ5SW5wdXRCZ2RIb3ZlciIsInNlY29uZGFyeUlucHV0QmdkQWN0aXZlIiwic2Vjb25kYXJ5SW5wdXRDb2xvciIsInNlY29uZGFyeUlucHV0Qm9yZGVyQ29sb3IiLCJzZWNvbmRhcnlJbnB1dEJvcmRlckFjdGl2ZUNvbG9yIiwic3dpdGNoV2lkdGgiLCJzd2l0Y2hIZWlnaHQiLCJzd2l0Y2hMYWJlbE1hcmdpbiIsInN3aXRjaFRyYWNrQmdkIiwic3dpdGNoVHJhY2tCZ2RBY3RpdmUiLCJzd2l0Y2hUcmFja0JvcmRlclJhZGl1cyIsInN3aXRjaEJ0bkJnZCIsInN3aXRjaEJ0bkJnZEFjdGl2ZSIsInN3aXRjaEJ0bkJveFNoYWRvdyIsInN3aXRjaEJ0bkJvcmRlclJhZGl1cyIsInN3aXRjaEJ0bldpZHRoIiwic3dpdGNoQnRuSGVpZ2h0Iiwic2Vjb25kYXJ5U3dpdGNoVHJhY2tCZ2QiLCJzZWNvbmRhcnlTd2l0Y2hCdG5CZ2QiLCJzZWxlY3RDb2xvciIsInNlbGVjdENvbG9yTFQiLCJzZWxlY3RBY3RpdmVCb3JkZXJDb2xvciIsInNlbGVjdEZvbnRTaXplIiwic2VsZWN0Rm9udFdlaWdodCIsInNlbGVjdEZvbnRXZWlnaHRCb2xkIiwic2VsZWN0Q29sb3JQbGFjZUhvbGRlciIsInNlbGVjdEJhY2tncm91bmQiLCJzZWxlY3RCYWNrZ3JvdW5kSG92ZXIiLCJzZWxlY3RCYWNrZ3JvdW5kTFQiLCJzZWxlY3RCYWNrZ3JvdW5kSG92ZXJMVCIsInNlbGVjdEJvcmRlckNvbG9yIiwic2VsZWN0Qm9yZGVyUmFkaXVzIiwic2VsZWN0Qm9yZGVyIiwiZHJvcGRvd25MaXN0SGlnaGxpZ2h0QmciLCJkcm9wZG93bkxpc3RTaGFkb3ciLCJkcm9wZG93bkxpc3RCZ2QiLCJkcm9wZG93bkxpc3RCb3JkZXJUb3AiLCJzaWRlUGFuZWxIZWFkZXJCZyIsInNpZGVQYW5lbEJnIiwic2lkZUJhckNsb3NlQnRuQmdkIiwic2lkZUJhckNsb3NlQnRuQ29sb3IiLCJzaWRlQmFyQ2xvc2VCdG5CZ2RIb3ZlciIsInBhbmVsQmFja2dyb3VuZCIsInBhbmVsQmFja2dyb3VuZEhvdmVyIiwicGFuZWxBY3RpdmVCZyIsInBhbmVsSGVhZGVySWNvbiIsInBhbmVsSGVhZGVySWNvbkFjdGl2ZSIsInBhbmVsSGVhZGVySGVpZ2h0IiwicGFuZWxCb3hTaGFkb3ciLCJwYW5lbEJvcmRlclJhZGl1cyIsInBhbmVsQmFja2dyb3VuZExUIiwicGFuZWxCb3JkZXJDb2xvciIsInBhbmVsQm9yZGVyIiwicGFuZWxCb3JkZXJMVCIsIm1hcFBhbmVsQmFja2dyb3VuZENvbG9yIiwibWFwUGFuZWxIZWFkZXJCYWNrZ3JvdW5kQ29sb3IiLCJ0b29sdGlwQmciLCJ0b29sdGlwQ29sb3IiLCJtb2RhbFRpdGxlQ29sb3IiLCJtb2RhbFRpdGxlRm9udFNpemUiLCJtb2RhbEZvb3RlckJnZCIsInNsaWRlckJhckNvbG9yIiwic2xpZGVyQmFyQmdkIiwic2xpZGVyQmFySG92ZXJDb2xvciIsInNsaWRlckJhclJhZGl1cyIsInNsaWRlckJhckhlaWdodCIsInNsaWRlckhhbmRsZUhlaWdodCIsInNsaWRlckhhbmRsZVdpZHRoIiwic2xpZGVySGFuZGxlQ29sb3IiLCJzbGlkZXJIYW5kbGVIb3ZlckNvbG9yIiwic2xpZGVySGFuZGxlU2hhZG93IiwicmFuZ2VCcnVzaEJnZCIsInRleHRUcnVuY2F0ZSIsIm1heFdpZHRoIiwib3ZlcmZsb3ciLCJ0ZXh0T3ZlcmZsb3ciLCJ3aGl0ZVNwYWNlIiwid29yZFdyYXAiLCJpbnB1dCIsInByb3BzIiwidGhlbWUiLCJhY3RpdmUiLCJlcnJvciIsImRpc2FibGVkIiwidHlwZSIsInNlY29uZGFyeUlucHV0IiwiY2hpY2tsZXRlZElucHV0IiwiaW5saW5lSW5wdXQiLCJzd2l0Y2hUcmFjayIsImNoZWNrZWQiLCJzd2l0Y2hCdXR0b24iLCJpbnB1dFN3aXRjaCIsInNlY29uZGFyeVN3aXRjaCIsImRyb3Bkb3duU2Nyb2xsQmFyIiwiZHJvcGRvd25MaXN0QW5jaG9yIiwiZHJvcGRvd25MaXN0SXRlbSIsImRyb3Bkb3duTGlzdEhlYWRlciIsImRyb3Bkb3duTGlzdFNlY3Rpb24iLCJkcm9wZG93bkxpc3QiLCJzaWRlUGFuZWxTY3JvbGxCYXIiLCJzY3JvbGxCYXIiLCJtb2RhbFNjcm9sbEJhciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFFTyxJQUFNQSxrQ0FBYSxjQUFuQjtBQUNBLElBQU1DLDBDQUFpQixjQUF2QjtBQUNBLElBQU1DLDBDQUFpQixjQUF2Qjs7QUFFQSxJQUFNQyxnQ0FBWSw4QkFBbEI7QUFDQSxJQUFNQyxnQ0FBWSxZQUFsQjtBQUNBLElBQU1DLHNDQUFlLEtBQXJCO0FBQ0EsSUFBTUMsb0NBQWMsU0FBcEI7QUFDQSxJQUFNQyw4Q0FBbUIsU0FBekI7O0FBRVA7QUFDTyxJQUFNQyxrQ0FBYSxTQUFuQjtBQUNBLElBQU1DLDRDQUFrQixTQUF4QjtBQUNBLElBQU1DLHNDQUFlLFNBQXJCOztBQUVBLElBQU1DLGdDQUFZLFNBQWxCO0FBQ0EsSUFBTUMsb0NBQWMsU0FBcEI7QUFDQSxJQUFNQyxzQ0FBZSxTQUFyQjs7QUFFQSxJQUFNQyxzQ0FBZSxTQUFyQjtBQUNBLElBQU1DLDBDQUFpQixTQUF2QjtBQUNBLElBQU1DLGtEQUFxQixTQUEzQjs7QUFFQSxJQUFNQywwQ0FBaUIsU0FBdkI7QUFDQSxJQUFNQyxvQ0FBYyxTQUFwQjtBQUNBLElBQU1DLG9DQUFjLFNBQXBCO0FBQ0EsSUFBTUMsOENBQW1CLFNBQXpCO0FBQ0EsSUFBTUMsa0NBQWEsU0FBbkI7O0FBRVA7QUFDTyxJ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VztBQXlKWE0sMEJBekpXO0FBMEpYRCxnQ0ExSlc7QUEySlhILDRCQTNKVztBQTRKWEMsZ0NBNUpXO0FBNkpYQyx3Q0E3Slc7QUE4SlhtSCw0QkE5Slc7QUErSlh0SCw0QkEvSlc7QUFnS1hzRyxzQkFoS1c7QUFpS1hDLDRCQWpLVzs7QUFtS1g7QUFDQUksZ0NBcEtXO0FBcUtYQyw0QkFyS1c7QUFzS1hDLDBDQXRLVztBQXVLWEMsa0NBdktXO0FBd0tYQyxrQ0F4S1c7QUF5S1hDLHdDQXpLVztBQTBLWEMsc0NBMUtXO0FBMktYQyxzQ0EzS1c7QUE0S1hDLGdEQTVLVztBQTZLWEMsd0NBN0tXOztBQStLWDtBQUNBQztBQWhMVyxFQUFOIiwiZmlsZSI6ImJhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2Nzc30gZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtESU1FTlNJT05TfSBmcm9tICcuLi9jb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbmV4cG9ydCBjb25zdCB0cmFuc2l0aW9uID0gJ2FsbCAuNHMgZWFzZSc7XG5leHBvcnQgY29uc3QgdHJhbnNpdGlvbkZhc3QgPSAnYWxsIC4ycyBlYXNlJztcbmV4cG9ydCBjb25zdCB0cmFuc2l0aW9uU2xvdyA9ICdhbGwgLjhzIGVhc2UnO1xuXG5leHBvcnQgY29uc3QgYm94U2hhZG93ID0gJzAgMXB4IDJweCAwIHJnYmEoMCwwLDAsMC4xMCknO1xuZXhwb3J0IGNvbnN0IGJveFNpemluZyA9ICdib3JkZXItYm94JztcbmV4cG9ydCBjb25zdCBib3JkZXJSYWRpdXMgPSAnMXB4JztcbmV4cG9ydCBjb25zdCBib3JkZXJDb2xvciA9ICcjM0E0MTRDJztcbmV4cG9ydCBjb25zdCBib3JkZXJDb2xvckxpZ2h0ID0gJyNGMUYxRjEnO1xuXG4vLyBURVhUXG5leHBvcnQgY29uc3QgbGFiZWxDb2xvciA9ICcjNkE3NDg1JztcbmV4cG9ydCBjb25zdCBsYWJlbEhvdmVyQ29sb3IgPSAnI0M2QzZDNic7XG5leHBvcnQgY29uc3QgbGFiZWxDb2xvckxUID0gJyM2QTc0ODUnO1xuXG5leHBvcnQgY29uc3QgdGV4dENvbG9yID0gJyNBMEE3QjQnO1xuZXhwb3J0IGNvbnN0IHRleHRDb2xvckxUID0gJyMzQTQxNEMnO1xuZXhwb3J0IGNvbnN0IHRpdGxlQ29sb3JMVCA9ICcjMjkzMjNDJztcblxuZXhwb3J0IGNvbnN0IHN1YnRleHRDb2xvciA9ICcjNkE3NDg1JztcbmV4cG9ydCBjb25zdCBzdWJ0ZXh0Q29sb3JMVCA9ICcjQTBBN0I0JztcbmV4cG9ydCBjb25zdCBzdWJ0ZXh0Q29sb3JBY3RpdmUgPSAnI0ZGRkZGRic7XG5cbmV4cG9ydCBjb25zdCB0aXRsZVRleHRDb2xvciA9ICcjRkZGRkZGJztcbmV4cG9ydCBjb25zdCB0ZXh0Q29sb3JIbCA9ICcjRDNEOEUwJztcbmV4cG9ydCBjb25zdCBhY3RpdmVDb2xvciA9ICcjMUZCQUQ2JztcbmV4cG9ydCBjb25zdCBhY3RpdmVDb2xvckhvdmVyID0gJyMxMDgxODgnO1xuZXhwb3J0IGNvbnN0IGVycm9yQ29sb3IgPSAnI0Y5MDQyQyc7XG5cbi8vIEJ1dHRvblxuZXhwb3J0IGNvbnN0IHByaW1hcnlCdG5CZ2QgPSAnIzBGOTY2OCc7XG5leHBvcnQgY29uc3QgcHJpbWFyeUJ0bkFjdEJnZCA9ICcjMTNCMTdCJztcbmV4cG9ydCBjb25zdCBwcmltYXJ5QnRuQ29sb3IgPSAnI0ZGRkZGRic7XG5leHBvcnQgY29uc3QgcHJpbWFyeUJ0bkFjdENvbG9yID0gJyNGRkZGRkYnO1xuZXhwb3J0IGNvbnN0IHByaW1hcnlCdG5CZ2RIb3ZlciA9ICcjMTNCMTdCJztcbmV4cG9ydCBjb25zdCBwcmltYXJ5QnRuUmFkaXVzID0gJzJweCc7XG5cbmV4cG9ydCBjb25zdCBzZWNvbmRhcnlCdG5CZ2QgPSAnIzZBNzQ4NSc7XG5leHBvcnQgY29uc3Qgc2Vjb25kYXJ5QnRuQWN0QmdkID0gJyNBMEE3QjQnO1xuZXhwb3J0IGNvbnN0IHNlY29uZGFyeUJ0bkNvbG9yID0gJyNGRkZGRkYnO1xuZXhwb3J0IGNvbnN0IHNlY29uZGFyeUJ0bkFjdENvbG9yID0gJyNGRkZGRkYnO1xuZXhwb3J0IGNvbnN0IHNlY29uZGFyeUJ0bkJnZEhvdmVyID0gJyNBMEE3QjQnO1xuXG5leHBvcnQgY29uc3QgbGlua0J0bkJnZCA9ICd0cmFuc3BhcmVudCc7XG5leHBvcnQgY29uc3QgbGlua0J0bkFjdEJnZCA9IGxpbmtCdG5CZ2Q7XG5leHBvcnQgY29uc3QgbGlua0J0bkNvbG9yID0gJyNBMEE3QjQnO1xuZXhwb3J0IGNvbnN0IGxpbmtCdG5BY3RDb2xvciA9ICcjM0E0MTRDJztcbmV4cG9ydCBjb25zdCBsaW5rQnRuQWN0QmdkSG92ZXIgPSBsaW5rQnRuQmdkO1xuXG5leHBvcnQgY29uc3QgbmVnYXRpdmVCdG5CZ2QgPSBlcnJvckNvbG9yO1xuZXhwb3J0IGNvbnN0IG5lZ2F0aXZlQnRuQWN0QmdkID0gJyNGRjE5M0UnO1xuZXhwb3J0IGNvbnN0IG5lZ2F0aXZlQnRuQmdkSG92ZXIgPSAnI0ZGMTkzRSc7XG5leHBvcnQgY29uc3QgbmVnYXRpdmVCdG5Db2xvciA9ICcjRkZGRkZGJztcbmV4cG9ydCBjb25zdCBuZWdhdGl2ZUJ0bkFjdENvbG9yID0gJyNGRkZGRkYnO1xuXG4vLyBJbnB1dFxuZXhwb3J0IGNvbnN0IGlucHV0Qm94SGVpZ2h0ID0gJzM0cHgnO1xuZXhwb3J0IGNvbnN0IGlucHV0UGFkZGluZyA9ICc0cHggMTBweCc7XG5leHBvcnQgY29uc3QgaW5wdXRGb250U2l6ZSA9ICcxMXB4JztcbmV4cG9ydCBjb25zdCBpbnB1dEZvbnRXZWlnaHQgPSA1MDA7XG5leHBvcnQgY29uc3QgaW5wdXRCZ2QgPSAnIzI5MzIzQyc7XG5leHBvcnQgY29uc3QgaW5wdXRCZ2RIb3ZlciA9ICcjM0E0MTRDJztcbmV4cG9ydCBjb25zdCBpbnB1dEJnZEFjdGl2ZSA9ICcjM0E0MTRDJztcbmV4cG9ydCBjb25zdCBpbnB1dEJvcmRlckNvbG9yID0gJyMyOTMyM0MnO1xuZXhwb3J0IGNvbnN0IGlucHV0Qm9yZGVySG92ZXJDb2xvciA9ICcjM0E0MTRDJztcbmV4cG9ydCBjb25zdCBpbnB1dEJvcmRlckFjdGl2ZUNvbG9yID0gJyNEM0Q4RTAnO1xuZXhwb3J0IGNvbnN0IGlucHV0Q29sb3IgPSAnI0EwQTdCNCc7XG5leHBvcnQgY29uc3QgaW5wdXRCb3JkZXJSYWRpdXMgPSAnMXB4JztcbmV4cG9ydCBjb25zdCBpbnB1dFBsYWNlaG9sZGVyQ29sb3IgPSAnIzZBNzQ4NSc7XG5leHBvcnQgY29uc3QgaW5wdXRQbGFjZWhvbGRlckZvbnRXZWlnaHQgPSA0MDA7XG5cbmV4cG9ydCBjb25zdCBzZWNvbmRhcnlJbnB1dEhlaWdodCA9ICcyOHB4JztcbmV4cG9ydCBjb25zdCBzZWNvbmRhcnlJbnB1dEJnZCA9ICcjMjQyNzMwJztcbmV4cG9ydCBjb25zdCBzZWNvbmRhcnlJbnB1dEJnZEhvdmVyID0gJyMzQTQxNEMnO1xuZXhwb3J0IGNvbnN0IHNlY29uZGFyeUlucHV0QmdkQWN0aXZlID0gJyMzQTQxNEMnO1xuZXhwb3J0IGNvbnN0IHNlY29uZGFyeUlucHV0Q29sb3IgPSAnI0EwQTdCNCc7XG5leHBvcnQgY29uc3Qgc2Vjb25kYXJ5SW5wdXRCb3JkZXJDb2xvciA9ICcjMjQyNzMwJztcbmV4cG9ydCBjb25zdCBzZWNvbmRhcnlJbnB1dEJvcmRlckFjdGl2ZUNvbG9yID0gJyNEM0Q4RTAnO1xuXG5leHBvcnQgY29uc3Qgc3dpdGNoV2lkdGggPSAyNDtcbmV4cG9ydCBjb25zdCBzd2l0Y2hIZWlnaHQgPSAxMjtcbmV4cG9ydCBjb25zdCBzd2l0Y2hMYWJlbE1hcmdpbiA9IDEyO1xuXG5leHBvcnQgY29uc3Qgc3dpdGNoVHJhY2tCZ2QgPSAnIzI5MzIzQyc7XG5leHBvcnQgY29uc3Qgc3dpdGNoVHJhY2tCZ2RBY3RpdmUgPSBhY3RpdmVDb2xvcjtcbmV4cG9ydCBjb25zdCBzd2l0Y2hUcmFja0JvcmRlclJhZGl1cyA9ICcxcHgnO1xuZXhwb3J0IGNvbnN0IHN3aXRjaEJ0bkJnZCA9ICcjNkE3NDg1JztcbmV4cG9ydCBjb25zdCBzd2l0Y2hCdG5CZ2RBY3RpdmUgPSAnI0QzRDhFMCc7XG5leHBvcnQgY29uc3Qgc3dpdGNoQnRuQm94U2hhZG93ID0gJzAgMnB4IDRweCAwIHJnYmEoMCwwLDAsMC40MCknO1xuZXhwb3J0IGNvbnN0IHN3aXRjaEJ0bkJvcmRlclJhZGl1cyA9ICcxcHgnO1xuZXhwb3J0IGNvbnN0IHN3aXRjaEJ0bldpZHRoID0gJzEycHgnO1xuZXhwb3J0IGNvbnN0IHN3aXRjaEJ0bkhlaWdodCA9ICcxMnB4JztcblxuZXhwb3J0IGNvbnN0IHNlY29uZGFyeVN3aXRjaFRyYWNrQmdkID0gJyMyNDI3MzAnO1xuZXhwb3J0IGNvbnN0IHNlY29uZGFyeVN3aXRjaEJ0bkJnZCA9ICcjM0E0MTRDJztcblxuLy8gU2VsZWN0XG5leHBvcnQgY29uc3Qgc2VsZWN0Q29sb3IgPSBpbnB1dENvbG9yO1xuZXhwb3J0IGNvbnN0IHNlbGVjdENvbG9yTFQgPSB0aXRsZUNvbG9yTFQ7XG5cbmV4cG9ydCBjb25zdCBzZWxlY3RBY3RpdmVCb3JkZXJDb2xvciA9ICcjRDNEOEUwJztcbmV4cG9ydCBjb25zdCBzZWxlY3RGb250U2l6ZSA9ICcxMXB4JztcbmV4cG9ydCBjb25zdCBzZWxlY3RGb250V2VpZ2h0ID0gJzQwMCc7XG5leHBvcnQgY29uc3Qgc2VsZWN0Rm9udFdlaWdodEJvbGQgPSAnNTAwJztcblxuZXhwb3J0IGNvbnN0IHNlbGVjdENvbG9yUGxhY2VIb2xkZXIgPSAnIzZBNzQ4NSc7XG5leHBvcnQgY29uc3Qgc2VsZWN0QmFja2dyb3VuZCA9IGlucHV0QmdkO1xuZXhwb3J0IGNvbnN0IHNlbGVjdEJhY2tncm91bmRIb3ZlciA9IGlucHV0QmdkSG92ZXI7XG5leHBvcnQgY29uc3Qgc2VsZWN0QmFja2dyb3VuZExUID0gJyNGRkZGRkYnO1xuZXhwb3J0IGNvbnN0IHNlbGVjdEJhY2tncm91bmRIb3ZlckxUID0gJyNGOEY4RjknO1xuZXhwb3J0IGNvbnN0IHNlbGVjdEJvcmRlckNvbG9yID0gJyNEM0Q4RTAnO1xuZXhwb3J0IGNvbnN0IHNlbGVjdEJvcmRlclJhZGl1cyA9ICcxcHgnO1xuZXhwb3J0IGNvbnN0IHNlbGVjdEJvcmRlciA9IDA7XG5cbmV4cG9ydCBjb25zdCBkcm9wZG93bkxpc3RIaWdobGlnaHRCZyA9ICcjNkE3NDg1JztcbmV4cG9ydCBjb25zdCBkcm9wZG93bkxpc3RTaGFkb3cgPSAnMCA2cHggMTJweCAwIHJnYmEoMCwwLDAsMC4xNiknO1xuZXhwb3J0IGNvbnN0IGRyb3Bkb3duTGlzdEJnZCA9ICcjM0E0MTRDJztcbmV4cG9ydCBjb25zdCBkcm9wZG93bkxpc3RCb3JkZXJUb3AgPSAnIzI0MjczMCc7XG5cbi8vIFNpZGUgUGFuZWxcbmV4cG9ydCBjb25zdCBzaWRlUGFuZWxIZWFkZXJCZyA9ICcjMjkzMjNDJztcbmV4cG9ydCBjb25zdCBzaWRlUGFuZWxCZyA9ICcjMjQyNzMwJztcbmV4cG9ydCBjb25zdCBzaWRlQmFyQ2xvc2VCdG5CZ2QgPSBzZWNvbmRhcnlCdG5CZ2Q7XG5leHBvcnQgY29uc3Qgc2lkZUJhckNsb3NlQnRuQ29sb3IgPSAnIzI5MzIzQyc7XG5leHBvcnQgY29uc3Qgc2lkZUJhckNsb3NlQnRuQmdkSG92ZXIgPSBzZWNvbmRhcnlCdG5BY3RCZ2Q7XG5cbmV4cG9ydCBjb25zdCBwYW5lbEJhY2tncm91bmQgPSAnIzI5MzIzQyc7XG5leHBvcnQgY29uc3QgcGFuZWxCYWNrZ3JvdW5kSG92ZXIgPSAnIzNBNDU1Mic7XG5leHBvcnQgY29uc3QgcGFuZWxBY3RpdmVCZyA9ICcjM0E0NTUyJztcbmV4cG9ydCBjb25zdCBwYW5lbEhlYWRlckljb24gPSAnIzZBNzQ4NSc7XG5leHBvcnQgY29uc3QgcGFuZWxIZWFkZXJJY29uQWN0aXZlID0gJyNBMEE3QjQnO1xuZXhwb3J0IGNvbnN0IHBhbmVsSGVhZGVySGVpZ2h0ID0gNDg7XG5leHBvcnQgY29uc3QgcGFuZWxCb3hTaGFkb3cgPSAnMCA2cHggMTJweCAwIHJnYmEoMCwwLDAsMC4xNiknO1xuZXhwb3J0IGNvbnN0IHBhbmVsQm9yZGVyUmFkaXVzID0gJzJweCc7XG5leHBvcnQgY29uc3QgcGFuZWxCYWNrZ3JvdW5kTFQgPSAnI2Y4ZjhmOSc7XG5cbmV4cG9ydCBjb25zdCBwYW5lbEJvcmRlckNvbG9yID0gJyMzQTQxNEMnO1xuZXhwb3J0IGNvbnN0IHBhbmVsQm9yZGVyID0gYDFweCBzb2xpZCAke2JvcmRlckNvbG9yfWA7XG5leHBvcnQgY29uc3QgcGFuZWxCb3JkZXJMVCA9IGAxcHggc29saWQgJHtib3JkZXJDb2xvckxpZ2h0fWA7XG5cbmV4cG9ydCBjb25zdCBtYXBQYW5lbEJhY2tncm91bmRDb2xvciA9ICcjMjQyNzMwJztcbmV4cG9ydCBjb25zdCBtYXBQYW5lbEhlYWRlckJhY2tncm91bmRDb2xvciA9ICcjMjkzMjNDJztcbmV4cG9ydCBjb25zdCB0b29sdGlwQmcgPSAnI0Y4RjhGOSc7XG5leHBvcnQgY29uc3QgdG9vbHRpcENvbG9yID0gJyMzMzMzMzQnO1xuXG4vLyBNb2RhbFxuZXhwb3J0IGNvbnN0IG1vZGFsVGl0bGVDb2xvciA9ICcjM0E0MTRDJztcbmV4cG9ydCBjb25zdCBtb2RhbFRpdGxlRm9udFNpemUgPSAnMzJweCc7XG5leHBvcnQgY29uc3QgbW9kYWxGb290ZXJCZ2QgPSAnI0Y4RjhGOSc7XG5cbmV4cG9ydCBjb25zdCBzbGlkZXJCYXJDb2xvciA9ICcjNkE3NDg1JztcbmV4cG9ydCBjb25zdCBzbGlkZXJCYXJCZ2QgPSAnIzNBNDE0Qyc7XG5leHBvcnQgY29uc3Qgc2xpZGVyQmFySG92ZXJDb2xvciA9ICcjRDNEOEUwJztcbmV4cG9ydCBjb25zdCBzbGlkZXJCYXJSYWRpdXMgPSAnMXB4JztcbmV4cG9ydCBjb25zdCBzbGlkZXJCYXJIZWlnaHQgPSAnNHB4JztcbmV4cG9ydCBjb25zdCBzbGlkZXJIYW5kbGVIZWlnaHQgPSAnMTJweCc7XG5leHBvcnQgY29uc3Qgc2xpZGVySGFuZGxlV2lkdGggPSAnMTJweCc7XG5leHBvcnQgY29uc3Qgc2xpZGVySGFuZGxlQ29sb3IgPSAnI0QzRDhFMCc7XG5leHBvcnQgY29uc3Qgc2xpZGVySGFuZGxlSG92ZXJDb2xvciA9ICcjRkZGRkZGJztcbmV4cG9ydCBjb25zdCBzbGlkZXJIYW5kbGVTaGFkb3cgPSAnMCAycHggNHB4IDAgcmdiYSgwLDAsMCwwLjQwKSc7XG5cbi8vIFBsb3RcbmV4cG9ydCBjb25zdCByYW5nZUJydXNoQmdkID0gJyMzQTQxNEMnO1xuXG5leHBvcnQgY29uc3QgdGV4dFRydW5jYXRlID0ge1xuICBtYXhXaWR0aDogJzEwMCUnLFxuICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gIHRleHRPdmVyZmxvdzogJ2VsbGlwc2lzJyxcbiAgd2hpdGVTcGFjZTogJ25vd3JhcCcsXG4gIHdvcmRXcmFwOiAnbm9ybWFsJ1xufTtcblxuLy8gdGhlbWUgaXMgcGFzc2VkIHRvIGtlcGxlci5nbCB3aGVuIGl0J3MgbW91bnRlZCxcbi8vIGl0IGlzIHVzZWQgYnkgc3R5bGVkLWNvbXBvbmVudHMgdG8gcGFzcyBhbG9uZyB0b1xuLy8gYWxsIGNoaWxkIGNvbXBvbmVudHNcblxuY29uc3QgaW5wdXQgPSBjc3NgXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaW5wdXRCZ2R9O1xuICBib3JkZXI6IDFweCBzb2xpZFxuICAgICR7cHJvcHMgPT5cbiAgICAgIHByb3BzLmFjdGl2ZVxuICAgICAgICA/IHByb3BzLnRoZW1lLmlucHV0Qm9yZGVyQWN0aXZlQ29sb3JcbiAgICAgICAgOiBwcm9wcy5lcnJvciA/IHByb3BzLnRoZW1lLmVycm9yQ29sb3IgOiBwcm9wcy50aGVtZS5pbnB1dEJnZH07XG4gIGNhcmV0LWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmlucHV0Qm9yZGVyQWN0aXZlQ29sb3J9O1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5pbnB1dENvbG9yfTtcbiAgZGlzcGxheTogZmxleDtcbiAgZm9udC1zaXplOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmlucHV0Rm9udFNpemV9O1xuICBmb250LXdlaWdodDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5pbnB1dEZvbnRXZWlnaHR9O1xuICBoZWlnaHQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaW5wdXRCb3hIZWlnaHR9O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIG91dGxpbmU6IG5vbmU7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHBhZGRpbmc6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaW5wdXRQYWRkaW5nfTtcbiAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG4gIHRyYW5zaXRpb246ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudHJhbnNpdGlvbn07XG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gIHdpZHRoOiAxMDAlO1xuICB3b3JkLXdyYXA6IG5vcm1hbDtcbiAgcG9pbnRlci1ldmVudHM6ICR7cHJvcHMgPT4gKHByb3BzLmRpc2FibGVkID8gJ25vbmUnIDogJ2FsbCcpfTtcbiAgb3BhY2l0eTogJHtwcm9wcyA9PiAocHJvcHMuZGlzYWJsZWQgPyAwLjUgOiAxKX07XG5cbiAgOmhvdmVyIHtcbiAgICBjdXJzb3I6ICR7cHJvcHMgPT4gcHJvcHMudHlwZSA9PT0gJ251bWJlcicgPyAndGV4dCcgOiAncG9pbnRlcid9O1xuICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT5cbiAgICAgIHByb3BzLmFjdGl2ZSA/IHByb3BzLnRoZW1lLmlucHV0QmdkQWN0aXZlIDogcHJvcHMudGhlbWUuaW5wdXRCZ2RIb3Zlcn07XG4gICAgYm9yZGVyLWNvbG9yOiAke3Byb3BzID0+XG4gICAgICBwcm9wcy5hY3RpdmVcbiAgICAgICAgPyBwcm9wcy50aGVtZS5pbnB1dEJvcmRlckFjdGl2ZUNvbG9yXG4gICAgICAgIDogcHJvcHMudGhlbWUuaW5wdXRCb3JkZXJIb3ZlckNvbG9yfTtcbiAgfVxuXG4gIDphY3RpdmUsXG4gIDpmb2N1cyxcbiAgJi5mb2N1cyxcbiAgJi5hY3RpdmUge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaW5wdXRCZ2RBY3RpdmV9O1xuICAgIGJvcmRlci1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5pbnB1dEJvcmRlckFjdGl2ZUNvbG9yfTtcbiAgfVxuXG4gIDo6cGxhY2Vob2xkZXIge1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmlucHV0UGxhY2Vob2xkZXJDb2xvcn07XG4gICAgZm9udC13ZWlnaHQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaW5wdXRQbGFjZWhvbGRlckZvbnRXZWlnaHR9O1xuICB9XG5cbiAgLyogRGlzYWJsZSBBcnJvd3Mgb24gTnVtYmVyIElucHV0cyAqL1xuICA6Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24sXG4gIDo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbiB7XG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xuICAgIG1hcmdpbjogMDtcbiAgfVxuYDtcblxuY29uc3Qgc2Vjb25kYXJ5SW5wdXQgPSBjc3NgXG4gICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaW5wdXR9IFxuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWNvbmRhcnlJbnB1dENvbG9yfTtcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWNvbmRhcnlJbnB1dEJnZH07XG4gIGhlaWdodDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWNvbmRhcnlJbnB1dEhlaWdodH07XG4gIGJvcmRlcjogMXB4IHNvbGlkXG4gICAgJHtwcm9wcyA9PiBwcm9wcy5lcnJvclxuICAgICAgICAgID8gcHJvcHMudGhlbWUuZXJyb3JDb2xvclxuICAgICAgICAgIDogcHJvcHMudGhlbWUuc2Vjb25kYXJ5SW5wdXRCb3JkZXJDb2xvcn07XG5cbiAgOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWNvbmRhcnlJbnB1dEJnZEhvdmVyfTtcbiAgICBib3JkZXItY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2Vjb25kYXJ5SW5wdXRCZ2RIb3Zlcn07XG4gIH1cblxuICA6YWN0aXZlLFxuICAmLmFjdGl2ZSB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWNvbmRhcnlJbnB1dEJnZEFjdGl2ZX07XG4gICAgYm9yZGVyLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlY29uZGFyeUlucHV0Qm9yZGVyQWN0aXZlQ29sb3J9O1xuICB9XG5gO1xuXG5jb25zdCBjaGlja2xldGVkSW5wdXQgPSBjc3NgXG4gICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2Vjb25kYXJ5SW5wdXR9IFxuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGZsZXgtd3JhcDogd3JhcDtcbiAgaGVpZ2h0OiBhdXRvO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHN0YXJ0O1xuICBtYXJnaW4tYm90dG9tOiAycHg7XG4gIHBhZGRpbmc6IDRweCA3cHggNHB4IDRweDtcbiAgd2hpdGUtc3BhY2U6IG5vcm1hbDtcbmA7XG5cbmNvbnN0IGlubGluZUlucHV0ID0gY3NzYFxuICAke3Byb3BzID0+IHByb3BzLnRoZW1lLmlucHV0fSBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuICBmb250LXNpemU6IDEzcHg7XG4gIGxldHRlci1zcGFjaW5nOiAwLjQzcHg7XG4gIGxpbmUtaGVpZ2h0OiAxOHB4O1xuICBoZWlnaHQ6IDI0cHg7XG4gIGZvbnQtd2VpZ2h0OiA0MDA7XG4gIHBhZGRpbmctbGVmdDogNHB4O1xuICBtYXJnaW4tbGVmdDogLTRweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHRyYW5zcGFyZW50O1xuXG4gIDpob3ZlciB7XG4gICAgaGVpZ2h0OiAyNHB4O1xuICAgIGN1cnNvcjogdGV4dDtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICBib3JkZXI6IDFweCBzb2xpZCAke3Byb3BzID0+IHByb3BzLnRoZW1lLmxhYmVsQ29sb3J9O1xuICB9XG5cbiAgOmFjdGl2ZSxcbiAgLmFjdGl2ZSxcbiAgOmZvY3VzIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICBib3JkZXI6IDFweCBzb2xpZCAke3Byb3BzID0+IHByb3BzLnRoZW1lLmlucHV0Qm9yZGVyQWN0aXZlQ29sb3J9O1xuICB9XG5gO1xuXG5jb25zdCBzd2l0Y2hUcmFjayA9IGNzc2BcbiAgYmFja2dyb3VuZDogJHtwcm9wcyA9PlxuICAgIHByb3BzLmNoZWNrZWRcbiAgICAgID8gcHJvcHMudGhlbWUuc3dpdGNoVHJhY2tCZ2RBY3RpdmVcbiAgICAgIDogcHJvcHMudGhlbWUuc3dpdGNoVHJhY2tCZ2R9O1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogJHtwcm9wcyA9PiAtcHJvcHMudGhlbWUuc3dpdGNoTGFiZWxNYXJnaW59cHg7XG4gIGNvbnRlbnQ6ICcnO1xuICBkaXNwbGF5OiBibG9jaztcbiAgd2lkdGg6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc3dpdGNoV2lkdGh9cHg7XG4gIGhlaWdodDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zd2l0Y2hIZWlnaHR9cHg7XG4gIGJvcmRlci1yYWRpdXM6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc3dpdGNoVHJhY2tCb3JkZXJSYWRpdXN9O1xuYDtcblxuY29uc3Qgc3dpdGNoQnV0dG9uID0gY3NzYFxuICB0cmFuc2l0aW9uOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRyYW5zaXRpb259O1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogJHtwcm9wcyA9PiAocHJvcHMuY2hlY2tlZCA/IHByb3BzLnRoZW1lLnN3aXRjaFdpZHRoIC8gMiA6IC0xKSAtIHByb3BzLnRoZW1lLnN3aXRjaExhYmVsTWFyZ2lufXB4O1xuICBjb250ZW50OiAnJztcbiAgZGlzcGxheTogYmxvY2s7XG4gIGhlaWdodDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zd2l0Y2hCdG5IZWlnaHR9O1xuICB3aWR0aDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zd2l0Y2hCdG5XaWR0aH07XG4gIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMuY2hlY2tlZCA/IFxuICBwcm9wcy50aGVtZS5zd2l0Y2hCdG5CZ2RBY3RpdmUgOiBwcm9wcy50aGVtZS5zd2l0Y2hCdG5CZ2R9O1xuICBib3gtc2hhZG93OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnN3aXRjaEJ0bkJveFNoYWRvd307XG5gO1xuXG5jb25zdCBpbnB1dFN3aXRjaCA9IGNzc2BcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgbGluZS1oZWlnaHQ6IDA7XG4gIGZvbnQtd2VpZ2h0OiA1MDA7XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGFiZWxDb2xvcn07XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICBwYWRkaW5nLXRvcDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zd2l0Y2hIZWlnaHQgLyAyfXB4O1xuICBwYWRkaW5nLXJpZ2h0OiAwO1xuICBwYWRkaW5nLWJvdHRvbTogMDtcbiAgcGFkZGluZy1sZWZ0OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnN3aXRjaFdpZHRofXB4O1xuXG4gIDpiZWZvcmUge1xuICAgICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc3dpdGNoVHJhY2t9O1xuICB9XG5cbiAgOmFmdGVyIHtcbiAgICAke3Byb3BzID0+IHByb3BzLnRoZW1lLnN3aXRjaEJ1dHRvbn07XG4gIH1cbmA7XG5cbmNvbnN0IHNlY29uZGFyeVN3aXRjaCA9IGNzc2BcbiAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5pbnB1dFN3aXRjaH0gXG4gIDpiZWZvcmUge1xuICAgICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc3dpdGNoVHJhY2t9IGJhY2tncm91bmQ6ICR7cHJvcHMgPT5cbiAgICAgICAgcHJvcHMuY2hlY2tlZFxuICAgICAgICAgID8gcHJvcHMudGhlbWUuc3dpdGNoVHJhY2tCZ2RBY3RpdmVcbiAgICAgICAgICA6IHByb3BzLnRoZW1lLnNlY29uZGFyeVN3aXRjaFRyYWNrQmdkfTtcbiAgfVxuXG4gIDphZnRlciB7XG4gICAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zd2l0Y2hCdXR0b259IFxuICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMuY2hlY2tlZFxuICAgICAgICAgID8gcHJvcHMudGhlbWUuc3dpdGNoQnRuQmdkQWN0aXZlXG4gICAgICAgICAgOiBwcm9wcy50aGVtZS5zZWNvbmRhcnlTd2l0Y2hCdG5CZ2R9O1xuICB9XG5gO1xuXG5jb25zdCBkcm9wZG93blNjcm9sbEJhciA9IGNzc2BcbiAgOjotd2Via2l0LXNjcm9sbGJhciB7XG4gICAgaGVpZ2h0OiAxMHB4O1xuICAgIHdpZHRoOiAxMHB4O1xuICB9XG4gIFxuICA6Oi13ZWJraXQtc2Nyb2xsYmFyLWNvcm5lciB7XG4gICAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5kcm9wZG93bkxpc3RCZ2R9O1xuICB9XG4gIFxuICA6Oi13ZWJraXQtc2Nyb2xsYmFyLXRyYWNrIHtcbiAgICBiYWNrZ3JvdW5kOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRyb3Bkb3duTGlzdEJnZH07XG4gIH1cbiAgXG4gIDo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIge1xuICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XG4gICAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5sYWJlbENvbG9yfTtcbiAgICBib3JkZXI6IDNweCBzb2xpZCAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRyb3Bkb3duTGlzdEJnZH07XG4gIH07XG4gIFxuICA6dmVydGljYWw6aG92ZXIge1xuICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9ySGx9O1xuICB9XG59YDtcblxuY29uc3QgZHJvcGRvd25MaXN0QW5jaG9yID0gY3NzYFxuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWxlY3RDb2xvcn07XG4gIHBhZGRpbmctbGVmdDogM3B4O1xuYDtcblxuY29uc3QgZHJvcGRvd25MaXN0SXRlbSA9IGNzc2BcbiAgZm9udC1zaXplOiAxMXB4O1xuICBwYWRkaW5nOiAzcHggOXB4O1xuICBmb250LXdlaWdodDogNTAwO1xuXG4gICYuaG92ZXIsXG4gICY6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRyb3Bkb3duTGlzdEhpZ2hsaWdodEJnfTtcblxuICAgIC5saXN0X19pdGVtX19hbmNob3Ige1xuICAgICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9ySGx9O1xuICAgIH1cbiAgfVxuYDtcblxuY29uc3QgZHJvcGRvd25MaXN0SGVhZGVyID0gY3NzYFxuICBmb250LXNpemU6IDExcHg7XG4gIHBhZGRpbmc6IDVweCA5cHg7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmxhYmVsQ29sb3J9O1xuYDtcblxuY29uc3QgZHJvcGRvd25MaXN0U2VjdGlvbiA9IGNzc2BcbiAgcGFkZGluZzogMCAwIDRweCAwO1xuICBtYXJnaW4tYm90dG9tOiA0cHg7XG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAke3Byb3BzID0+IHByb3BzLnRoZW1lLmxhYmVsQ29sb3J9O1xuYDtcblxuY29uc3QgZHJvcGRvd25MaXN0ID0gY3NzYFxuICBvdmVyZmxvdy15OiBvdmVybGF5O1xuICBtYXgtaGVpZ2h0OiAyODBweDtcbiAgYm94LXNoYWRvdzogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5kcm9wZG93bkxpc3RTaGFkb3d9O1xuICBib3JkZXItcmFkaXVzOiAycHg7XG5cbiAgLmxpc3RfX3NlY3Rpb24ge1xuICAgICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZHJvcGRvd25MaXN0U2VjdGlvbn07XG4gIH1cbiAgLmxpc3RfX2hlYWRlciB7XG4gICAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5kcm9wZG93bkxpc3RIZWFkZXJ9O1xuICB9XG5cbiAgLmxpc3RfX2l0ZW0ge1xuICAgICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZHJvcGRvd25MaXN0SXRlbX07XG4gIH1cblxuICAubGlzdF9faXRlbV9fYW5jaG9yIHtcbiAgICAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRyb3Bkb3duTGlzdEFuY2hvcn07XG4gIH1cblxuICAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRyb3Bkb3duU2Nyb2xsQmFyfTtcbmA7XG5cbmNvbnN0IHNpZGVQYW5lbFNjcm9sbEJhciA9IGNzc2BcbiAgOjotd2Via2l0LXNjcm9sbGJhciB7XG4gICAgaGVpZ2h0OiAxMHB4O1xuICAgIHdpZHRoOiAxMHB4O1xuICB9XG4gIFxuICA6Oi13ZWJraXQtc2Nyb2xsYmFyLWNvcm5lciB7XG4gICAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zaWRlUGFuZWxCZ307XG4gIH1cbiAgXG4gIDo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2sge1xuICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2lkZVBhbmVsQmd9O1xuICB9XG4gIFxuICA6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcbiAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGFiZWxDb2xvcn07XG4gICAgYm9yZGVyOiAzcHggc29saWQgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zaWRlUGFuZWxCZ307XG4gIH07XG4gIFxuICA6dmVydGljYWw6aG92ZXIge1xuICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9ySGx9O1xuICB9XG59YDtcblxuY29uc3Qgc2Nyb2xsQmFyID0gY3NzYFxuICA6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcbiAgICBoZWlnaHQ6IDEwcHg7XG4gICAgd2lkdGg6IDEwcHg7XG4gIH1cblxuICBcbiAgOjotd2Via2l0LXNjcm9sbGJhci1jb3JuZXIge1xuICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucGFuZWxCYWNrZ3JvdW5kfTtcbiAgfVxuICBcbiAgOjotd2Via2l0LXNjcm9sbGJhci10cmFjayB7XG4gICAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJhY2tncm91bmR9O1xuICB9XG4gIFxuICA6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcbiAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGFiZWxDb2xvcn07XG4gICAgYm9yZGVyOiAzcHggc29saWQgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJhY2tncm91bmR9XG5cbiAgICAnOnZlcnRpY2FsOmhvdmVyJzoge1xuICAgICAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbH07XG4gICAgfVxuICAgIFxuICAgICAnOmhvcml6b250YWw6aG92ZXInOiB7XG4gICAgICBiYWNrZ3JvdW5kOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckhsfTtcbiAgICB9XG4gIH1cbn1gO1xuXG5leHBvcnQgY29uc3QgbW9kYWxTY3JvbGxCYXIgPSBjc3NgXG4gIDo6LXdlYmtpdC1zY3JvbGxiYXIge1xuICAgIHdpZHRoOiAxNHB4O1xuICAgIGhlaWdodDogMTZweDtcbiAgfVxuXG4gIDo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2sge1xuICAgIGJhY2tncm91bmQ6IHdoaXRlO1xuICB9XG4gIDo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2s6aG9yaXpvbnRhbCB7XG4gICAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbH07XG4gIH1cbiAgOjotd2Via2l0LXNjcm9sbGJhci10aHVtYiB7XG4gICAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5sYWJlbENvbG9yTFR9O1xuICAgIGJvcmRlcjogNHB4IHNvbGlkIHdoaXRlO1xuICB9XG5cbiAgOjotd2Via2l0LXNjcm9sbGJhci1jb3JuZXIge1xuICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9ySGx9O1xuICB9XG5cbiAgOjotd2Via2l0LXNjcm9sbGJhci10aHVtYjpob3ZlciB7XG4gICAgYmFja2dyb3VuZDogIzk2OWRhOTtcbiAgfVxuXG4gIDo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWI6dmVydGljYWwge1xuICAgIGJvcmRlci1yYWRpdXM6IDdweDtcbiAgfVxuXG4gIDo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWI6aG9yaXpvbnRhbCB7XG4gICAgYm9yZGVyLXJhZGl1czogOXB4O1xuICAgIGJvcmRlcjogNHB4IHNvbGlkICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9ySGx9O1xuICB9XG5gO1xuXG5leHBvcnQgY29uc3QgdGhlbWUgPSB7XG4gIC4uLkRJTUVOU0lPTlMsXG4gIC8vIHRlbXBsYXRlc1xuICBpbnB1dCxcbiAgaW5saW5lSW5wdXQsXG4gIGNoaWNrbGV0ZWRJbnB1dCxcbiAgc2Vjb25kYXJ5SW5wdXQsXG4gIGRyb3Bkb3duU2Nyb2xsQmFyLFxuICBkcm9wZG93bkxpc3QsXG4gIGRyb3Bkb3duTGlzdEl0ZW0sXG4gIGRyb3Bkb3duTGlzdEFuY2hvcixcbiAgZHJvcGRvd25MaXN0SGVhZGVyLFxuICBkcm9wZG93bkxpc3RTZWN0aW9uLFxuICBkcm9wZG93bkxpc3RTaGFkb3csXG4gIG1vZGFsU2Nyb2xsQmFyLFxuICBzY3JvbGxCYXIsXG4gIHNpZGVQYW5lbFNjcm9sbEJhcixcbiAgaW5wdXRTd2l0Y2gsXG4gIHNlY29uZGFyeVN3aXRjaCxcbiAgc3dpdGNoVHJhY2ssXG4gIHN3aXRjaEJ1dHRvbixcblxuICAvLyBUcmFuc2l0aW9uc1xuICB0cmFuc2l0aW9uLFxuICB0cmFuc2l0aW9uRmFzdCxcbiAgdHJhbnNpdGlvblNsb3csXG5cbiAgLy8gc3R5bGVzXG4gIGFjdGl2ZUNvbG9yLFxuICBhY3RpdmVDb2xvckhvdmVyLFxuICBib3JkZXJSYWRpdXMsXG4gIGJveFNoYWRvdyxcbiAgZXJyb3JDb2xvcixcbiAgZHJvcGRvd25MaXN0SGlnaGxpZ2h0QmcsXG4gIGRyb3Bkb3duTGlzdEJnZCxcbiAgZHJvcGRvd25MaXN0Qm9yZGVyVG9wLFxuXG4gIGxhYmVsQ29sb3IsXG4gIGxhYmVsQ29sb3JMVCxcbiAgbGFiZWxIb3ZlckNvbG9yLFxuICBtYXBQYW5lbEJhY2tncm91bmRDb2xvcixcbiAgbWFwUGFuZWxIZWFkZXJCYWNrZ3JvdW5kQ29sb3IsXG5cbiAgLy8gU2VsZWN0XG4gIHNlbGVjdEFjdGl2ZUJvcmRlckNvbG9yLFxuICBzZWxlY3RCYWNrZ3JvdW5kLFxuICBzZWxlY3RCYWNrZ3JvdW5kTFQsXG4gIHNlbGVjdEJhY2tncm91bmRIb3ZlcixcbiAgc2VsZWN0QmFja2dyb3VuZEhvdmVyTFQsXG4gIHNlbGVjdEJvcmRlcixcbiAgc2VsZWN0Qm9yZGVyQ29sb3IsXG4gIHNlbGVjdEJvcmRlclJhZGl1cyxcbiAgc2VsZWN0Q29sb3IsXG4gIHNlbGVjdENvbG9yUGxhY2VIb2xkZXIsXG4gIHNlbGVjdEZvbnRTaXplLFxuICBzZWxlY3RGb250V2VpZ2h0LFxuICBzZWxlY3RDb2xvckxULFxuXG4gIC8vIElucHV0XG4gIGlucHV0QmdkLFxuICBpbnB1dEJnZEhvdmVyLFxuICBpbnB1dEJnZEFjdGl2ZSxcbiAgaW5wdXRCb3hIZWlnaHQsXG4gIGlucHV0Qm9yZGVyQ29sb3IsXG4gIGlucHV0Qm9yZGVyQWN0aXZlQ29sb3IsXG4gIGlucHV0Qm9yZGVySG92ZXJDb2xvcixcbiAgaW5wdXRCb3JkZXJSYWRpdXMsXG4gIGlucHV0Q29sb3IsXG4gIGlucHV0UGFkZGluZyxcbiAgaW5wdXRGb250U2l6ZSxcbiAgaW5wdXRGb250V2VpZ2h0LFxuICBpbnB1dFBsYWNlaG9sZGVyQ29sb3IsXG4gIGlucHV0UGxhY2Vob2xkZXJGb250V2VpZ2h0LFxuXG4gIHNlY29uZGFyeUlucHV0QmdkLFxuICBzZWNvbmRhcnlJbnB1dEJnZEhvdmVyLFxuICBzZWNvbmRhcnlJbnB1dEJnZEFjdGl2ZSxcbiAgc2Vjb25kYXJ5SW5wdXRIZWlnaHQsXG4gIHNlY29uZGFyeUlucHV0Q29sb3IsXG4gIHNlY29uZGFyeUlucHV0Qm9yZGVyQ29sb3IsXG4gIHNlY29uZGFyeUlucHV0Qm9yZGVyQWN0aXZlQ29sb3IsXG5cbiAgc3dpdGNoV2lkdGgsXG4gIHN3aXRjaEhlaWdodCxcbiAgc3dpdGNoVHJhY2tCZ2QsXG4gIHN3aXRjaFRyYWNrQmdkQWN0aXZlLFxuICBzd2l0Y2hUcmFja0JvcmRlclJhZGl1cyxcbiAgc3dpdGNoQnRuQmdkLFxuICBzd2l0Y2hCdG5CZ2RBY3RpdmUsXG4gIHN3aXRjaEJ0bkJveFNoYWRvdyxcbiAgc3dpdGNoQnRuQm9yZGVyUmFkaXVzLFxuICBzd2l0Y2hCdG5XaWR0aCxcbiAgc3dpdGNoQnRuSGVpZ2h0LFxuICBzd2l0Y2hMYWJlbE1hcmdpbixcblxuICBzZWNvbmRhcnlTd2l0Y2hUcmFja0JnZCxcbiAgc2Vjb25kYXJ5U3dpdGNoQnRuQmdkLFxuXG4gIC8vIEJ1dHRvblxuICBwcmltYXJ5QnRuQmdkLFxuICBwcmltYXJ5QnRuQWN0QmdkLFxuICBwcmltYXJ5QnRuQ29sb3IsXG4gIHByaW1hcnlCdG5BY3RDb2xvcixcbiAgcHJpbWFyeUJ0bkJnZEhvdmVyLFxuICBwcmltYXJ5QnRuUmFkaXVzLFxuICBzZWNvbmRhcnlCdG5CZ2QsXG4gIHNlY29uZGFyeUJ0bkFjdEJnZCxcbiAgc2Vjb25kYXJ5QnRuQmdkSG92ZXIsXG4gIHNlY29uZGFyeUJ0bkNvbG9yLFxuICBzZWNvbmRhcnlCdG5BY3RDb2xvcixcblxuICBuZWdhdGl2ZUJ0bkJnZCxcbiAgbmVnYXRpdmVCdG5BY3RCZ2QsXG4gIG5lZ2F0aXZlQnRuQmdkSG92ZXIsXG4gIG5lZ2F0aXZlQnRuQ29sb3IsXG4gIG5lZ2F0aXZlQnRuQWN0Q29sb3IsXG5cbiAgbGlua0J0bkJnZCxcbiAgbGlua0J0bkFjdEJnZCxcbiAgbGlua0J0bkNvbG9yLFxuICBsaW5rQnRuQWN0Q29sb3IsXG4gIGxpbmtCdG5BY3RCZ2RIb3ZlcixcblxuICAvLyBNb2RhbFxuICBtb2RhbFRpdGxlQ29sb3IsXG4gIG1vZGFsVGl0bGVGb250U2l6ZSxcbiAgbW9kYWxGb290ZXJCZ2QsXG5cbiAgLy8gU2lkZSBQYW5lbFxuICBzaWRlUGFuZWxCZyxcblxuICBzaWRlQmFyQ2xvc2VCdG5CZ2QsXG4gIHNpZGVCYXJDbG9zZUJ0bkNvbG9yLFxuICBzaWRlQmFyQ2xvc2VCdG5CZ2RIb3ZlcixcbiAgc2lkZVBhbmVsSGVhZGVyQmcsXG5cbiAgLy8gU2lkZSBQYW5lbCBQYW5lbFxuICBwYW5lbEFjdGl2ZUJnLFxuICBwYW5lbEJhY2tncm91bmQsXG4gIHBhbmVsQmFja2dyb3VuZEhvdmVyLFxuICBwYW5lbEJhY2tncm91bmRMVCxcbiAgcGFuZWxCb3hTaGFkb3csXG4gIHBhbmVsQm9yZGVyUmFkaXVzLFxuICBwYW5lbEJvcmRlcixcbiAgcGFuZWxCb3JkZXJDb2xvcixcbiAgcGFuZWxCb3JkZXJMVCxcbiAgcGFuZWxIZWFkZXJJY29uLFxuICBwYW5lbEhlYWRlckljb25BY3RpdmUsXG4gIHBhbmVsSGVhZGVySGVpZ2h0LFxuXG4gIC8vIFRleHRcbiAgdGV4dENvbG9yLFxuICB0ZXh0Q29sb3JMVCxcbiAgdGV4dENvbG9ySGwsXG4gIHRpdGxlVGV4dENvbG9yLFxuICBzdWJ0ZXh0Q29sb3IsXG4gIHN1YnRleHRDb2xvckxULFxuICBzdWJ0ZXh0Q29sb3JBY3RpdmUsXG4gIHRleHRUcnVuY2F0ZSxcbiAgdGl0bGVDb2xvckxULFxuICB0b29sdGlwQmcsXG4gIHRvb2x0aXBDb2xvcixcblxuICAvLyBTbGlkZXJcbiAgc2xpZGVyQmFyQ29sb3IsXG4gIHNsaWRlckJhckJnZCxcbiAgc2xpZGVyQmFySG92ZXJDb2xvcixcbiAgc2xpZGVyQmFyUmFkaXVzLFxuICBzbGlkZXJCYXJIZWlnaHQsXG4gIHNsaWRlckhhbmRsZUhlaWdodCxcbiAgc2xpZGVySGFuZGxlV2lkdGgsXG4gIHNsaWRlckhhbmRsZUNvbG9yLFxuICBzbGlkZXJIYW5kbGVIb3ZlckNvbG9yLFxuICBzbGlkZXJIYW5kbGVTaGFkb3csXG5cbiAgLy8gUGxvdFxuICByYW5nZUJydXNoQmdkXG59O1xuIl19
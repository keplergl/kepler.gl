"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dropdownListBgdLT = exports.dropdownListBgd = exports.dropdownListShadow = exports.dropdownListHighlightBgLT = exports.dropdownListHighlightBg = exports.selectBorder = exports.selectBorderRadius = exports.selectBorderColorLT = exports.selectBorderColor = exports.selectBackgroundHoverLT = exports.selectBackgroundLT = exports.selectBackgroundHover = exports.selectBackground = exports.selectColorPlaceHolder = exports.selectFontWeightBold = exports.selectFontWeight = exports.selectFontSize = exports.selectActiveBorderColor = exports.selectColorLT = exports.selectColor = exports.secondaryInputBorderActiveColor = exports.secondaryInputBorderColor = exports.secondaryInputColor = exports.secondaryInputBgdActive = exports.secondaryInputBgdHover = exports.secondaryInputBgd = exports.inputPlaceholderFontWeight = exports.inputPlaceholderColor = exports.inputBorderRadius = exports.inputColor = exports.inputBorderActiveColor = exports.inputBorderHoverColor = exports.inputBorderColor = exports.inputBgdActive = exports.inputBgdHover = exports.inputBgd = exports.inputFontWeight = exports.inputFontSizeSmall = exports.inputFontSize = exports.inputPaddingTiny = exports.inputPaddingSmall = exports.inputPadding = exports.inputBoxHeightTiny = exports.inputBoxHeightSmall = exports.inputBoxHeight = exports.floatingBtnActColor = exports.floatingBtnColor = exports.floatingBtnBgdHover = exports.floatingBtnActBgd = exports.floatingBtnBgd = exports.negativeBtnActColor = exports.negativeBtnColor = exports.negativeBtnBgdHover = exports.negativeBtnActBgd = exports.negativeBtnBgd = exports.linkBtnActBgdHover = exports.linkBtnActColor = exports.linkBtnColor = exports.linkBtnActBgd = exports.linkBtnBgd = exports.secondaryBtnBgdHover = exports.secondaryBtnActColor = exports.secondaryBtnColor = exports.secondaryBtnActBgd = exports.secondaryBtnBgd = exports.primaryBtnRadius = exports.primaryBtnBgdHover = exports.primaryBtnActColor = exports.primaryBtnColor = exports.primaryBtnActBgd = exports.primaryBtnBgd = exports.logoColor = exports.errorColor = exports.activeColorHover = exports.activeColorLT = exports.activeColor = exports.textColorHlLT = exports.textColorHl = exports.titleTextColor = exports.subtextColorActive = exports.subtextColorLT = exports.subtextColor = exports.titleColorLT = exports.textColorLT = exports.textColor = exports.labelColorLT = exports.labelHoverColor = exports.labelColor = exports.lineHeight = exports.fontSize = exports.fontWeight = exports.fontFamily = exports.borderColorLT = exports.borderColor = exports.borderRadius = exports.boxSizing = exports.boxShadow = exports.transitionSlow = exports.transitionFast = exports.transition = void 0;
exports.modalScrollBar = exports.breakPoints = exports.textTruncate = exports.actionPanelHeight = exports.actionPanelWidth = exports.notificationPanelItemHeight = exports.notificationPanelItemWidth = exports.notificationPanelWidth = exports.notificationColors = exports.histogramFillOutRange = exports.histogramFillInRange = exports.rangeBrushBgd = exports.sliderMarginTop = exports.sliderMarginTopIsRange = exports.sliderInputWidth = exports.sliderInputHeight = exports.sliderHandleShadow = exports.sliderHandleHoverColor = exports.sliderHandleColor = exports.sliderHandleWidth = exports.sliderHandleHeight = exports.sliderBarHeight = exports.sliderBarRadius = exports.sliderBarHoverColor = exports.sliderBarBgd = exports.sliderBarColor = exports.modalDialogColor = exports.modalDialogBgd = exports.modalDropdownBackground = exports.modalButtonZ = exports.modalTitleZ = exports.modalFooterZ = exports.modalContentZ = exports.modalOverlayBgd = exports.modalOverLayZ = exports.modalPortableLateralPadding = exports.modalLateralPadding = exports.modalPadding = exports.modalImagePlaceHolder = exports.modalFooterBgd = exports.modalTitleFontSizeSmaller = exports.modalTitleFontSize = exports.modalTitleColor = exports.bottomWidgetPaddingLeft = exports.bottomWidgetPaddingBottom = exports.bottomWidgetPaddingRight = exports.bottomWidgetPaddingTop = exports.bottomPanelGap = exports.bottomInnerPdVert = exports.bottomInnerPdSide = exports.tooltipColor = exports.tooltipBg = exports.mapPanelHeaderBackgroundColor = exports.mapPanelBackgroundColor = exports.panelBorderLT = exports.panelBorder = exports.panelBorderColor = exports.panelBackgroundLT = exports.panelBorderRadius = exports.panelBoxShadow = exports.panelHeaderHeight = exports.panelHeaderIconActive = exports.panelHeaderIcon = exports.panelActiveBgLT = exports.panelActiveBg = exports.panelBackgroundHover = exports.panelBackground = exports.sideBarCloseBtnBgdHover = exports.sideBarCloseBtnColor = exports.sideBarCloseBtnBgd = exports.sidePanelScrollBarHeight = exports.sidePanelScrollBarWidth = exports.sidePanelBg = exports.sidePanelInnerPadding = exports.sidePanelHeaderBg = exports.checkboxBoxBgdChecked = exports.checkboxBoxBgd = exports.checkboxBorderColorLT = exports.checkboxBorderRadius = exports.checkboxBorderColor = exports.checkboxMargin = exports.checkboxHeight = exports.checkboxWidth = exports.secondarySwitchBtnBgd = exports.secondarySwitchTrackBgd = exports.switchBtnHeight = exports.switchBtnWidth = exports.switchBtnBorderRadius = exports.switchBtnBoxShadow = exports.switchBtnBgdActive = exports.switchBtnBgd = exports.switchTrackBorderRadius = exports.switchTrackBgdActive = exports.switchTrackBgd = exports.switchLabelMargin = exports.switchHeight = exports.switchWidth = exports.dropdownWrapperZ = exports.dropdownListBorderTopLT = exports.dropdownListBorderTop = void 0;
exports.themeBS = exports.themeLT = exports.theme = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _styledComponents = require("styled-components");

var _defaultSettings = require("../constants/default-settings");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _templateObject27() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  ::-webkit-scrollbar {\n    width: 14px;\n    height: 16px;\n  }\n\n  ::-webkit-scrollbar-track {\n    background: white;\n  }\n  ::-webkit-scrollbar-track:horizontal {\n    background: ", ";\n  }\n  ::-webkit-scrollbar-thumb {\n    background: ", ";\n    border: 4px solid white;\n  }\n\n  ::-webkit-scrollbar-corner {\n    background: ", ";\n  }\n\n  ::-webkit-scrollbar-thumb:hover {\n    background: #969da9;\n  }\n\n  ::-webkit-scrollbar-thumb:vertical {\n    border-radius: 7px;\n  }\n\n  ::-webkit-scrollbar-thumb:horizontal {\n    border-radius: 9px;\n    border: 4px solid ", ";\n  }\n"]);

  _templateObject27 = function _templateObject27() {
    return data;
  };

  return data;
}

function _templateObject26() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  ::-webkit-scrollbar {\n    height: 10px;\n    width: 10px;\n  }\n\n  ::-webkit-scrollbar-corner {\n    background: ", ";\n  }\n\n  ::-webkit-scrollbar-track {\n    background: ", ";\n  }\n\n  ::-webkit-scrollbar-thumb {\n    border-radius: 10px;\n    background: ", ";\n    border: 3px solid ", "\n\n    :vertical:hover {\n      background: ", ";\n      cursor: pointer;\n    }\n\n    :horizontal:hover {\n      background: ", ";\n      cursor: pointer;\n    }\n  }\n}"]);

  _templateObject26 = function _templateObject26() {
    return data;
  };

  return data;
}

function _templateObject25() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  ::-webkit-scrollbar {\n    height: 10px;\n    width: 10px;\n  }\n\n  ::-webkit-scrollbar-corner {\n    background: ", ";\n  }\n\n  ::-webkit-scrollbar-track {\n    background: ", ";\n  }\n\n  ::-webkit-scrollbar-thumb {\n    border-radius: 10px;\n    background: ", ";\n    border: 3px solid ", ";\n    :hover {\n      background: ", ";\n      cursor: pointer;\n    }\n  }\n"]);

  _templateObject25 = function _templateObject25() {
    return data;
  };

  return data;
}

function _templateObject24() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  ::-webkit-scrollbar {\n    height: ", "px;\n    width: ", "px;\n  }\n\n  ::-webkit-scrollbar-corner {\n    background: ", ";\n  }\n\n  ::-webkit-scrollbar-track {\n    background: ", ";\n  }\n\n  ::-webkit-scrollbar-thumb {\n    border-radius: 10px;\n    background: ", ";\n    border: 3px solid ", ";\n\n    :hover {\n      background: ", ";\n      cursor: pointer;\n    }\n  };\n}"]);

  _templateObject24 = function _templateObject24() {
    return data;
  };

  return data;
}

function _templateObject23() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  ", "\n  .list__item {\n    ", ";\n  }\n"]);

  _templateObject23 = function _templateObject23() {
    return data;
  };

  return data;
}

function _templateObject22() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  overflow-y: auto;\n  max-height: 280px;\n  box-shadow: ", ";\n  border-radius: 2px;\n\n  .list__section {\n    ", ";\n  }\n  .list__header {\n    ", ";\n  }\n\n  .list__item {\n    ", ";\n  }\n\n  .list__item__anchor {\n    ", ";\n  }\n\n  ", ";\n"]);

  _templateObject22 = function _templateObject22() {
    return data;
  };

  return data;
}

function _templateObject21() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  padding: 0 0 4px 0;\n  margin-bottom: 4px;\n  border-bottom: 1px solid ", ";\n"]);

  _templateObject21 = function _templateObject21() {
    return data;
  };

  return data;
}

function _templateObject20() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  font-size: 11px;\n  padding: 5px 9px;\n  color: ", ";\n"]);

  _templateObject20 = function _templateObject20() {
    return data;
  };

  return data;
}

function _templateObject19() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  ", "\n  color: ", ";\n\n  &.hover,\n  &:hover {\n    cursor: pointer;\n    color: ", ";\n    background-color: ", ";\n\n    .list__item__anchor {\n      color: ", ";\n    }\n  }\n"]);

  _templateObject19 = function _templateObject19() {
    return data;
  };

  return data;
}

function _templateObject18() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  ", "\n  &.hover,\n  &:hover {\n    cursor: pointer;\n    background-color: ", ";\n\n    .list__item__anchor {\n      color: ", ";\n    }\n  }\n"]);

  _templateObject18 = function _templateObject18() {
    return data;
  };

  return data;
}

function _templateObject17() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  font-size: 11px;\n  padding: 3px 9px;\n  font-weight: 500;\n  white-space: nowrap;\n"]);

  _templateObject17 = function _templateObject17() {
    return data;
  };

  return data;
}

function _templateObject16() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n  padding-left: 3px;\n"]);

  _templateObject16 = function _templateObject16() {
    return data;
  };

  return data;
}

function _templateObject15() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  ::-webkit-scrollbar {\n    height: 10px;\n    width: 10px;\n  }\n\n  ::-webkit-scrollbar-corner {\n    background: ", ";\n  }\n\n  ::-webkit-scrollbar-track {\n    background: ", ";\n  }\n\n  ::-webkit-scrollbar-thumb {\n    border-radius: 10px;\n    background: ", ";\n    border: 3px solid ", ";\n  };\n\n  :vertical:hover {\n    background: ", ";\n    cursor: pointer;\n  }\n}"]);

  _templateObject15 = function _templateObject15() {
    return data;
  };

  return data;
}

function _templateObject14() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  ", "\n  :before {\n    ", " background: ", ";\n  }\n\n  :after {\n    ", "\n    background: ", ";\n  }\n"]);

  _templateObject14 = function _templateObject14() {
    return data;
  };

  return data;
}

function _templateObject13() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: inline-block;\n  position: relative;\n  padding-left: 32px;\n  margin-bottom: 24px;\n  line-height: 20px;\n  vertical-align: middle;\n  cursor: pointer;\n  font-size: 12px;\n  color: ", ";\n  margin-left: -", "px;\n\n  :before {\n    ", ";\n  }\n\n  :after {\n    ", ";\n  }\n"]);

  _templateObject13 = function _templateObject13() {
    return data;
  };

  return data;
}

function _templateObject12() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  width: 10px;\n  height: 5px;\n  border-bottom: 2px solid white;\n  border-left: 2px solid white;\n  top: 4px;\n  left: 3px;\n  transform: rotate(-45deg);\n  display: block;\n  position: absolute;\n  opacity: ", ";\n  content: '';\n"]);

  _templateObject12 = function _templateObject12() {
    return data;
  };

  return data;
}

function _templateObject11() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: ", "px;\n  height: ", "px;\n  background: ", ";\n  border: 1px solid\n    ", ";\n  border-radius: 2px;\n  content: '';\n"]);

  _templateObject11 = function _templateObject11() {
    return data;
  };

  return data;
}

function _templateObject10() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  user-select: none;\n  cursor: pointer;\n  line-height: 16px;\n  font-weight: 500;\n  font-size: 12px;\n  color: ", ";\n  position: relative;\n  display: inline-block;\n  padding-top: 0;\n  padding-right: 0;\n  padding-bottom: 0;\n  padding-left: ", "px;\n\n  :before {\n    ", ";\n  }\n\n  :after {\n    ", ";\n  }\n"]);

  _templateObject10 = function _templateObject10() {
    return data;
  };

  return data;
}

function _templateObject9() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  transition: ", ";\n  position: absolute;\n  top: 0;\n  left: ", "px;\n  content: '';\n  display: block;\n  height: ", ";\n  width: ", ";\n  background: ", ";\n  box-shadow: ", ";\n  border-radius: ", ";\n"]);

  _templateObject9 = function _templateObject9() {
    return data;
  };

  return data;
}

function _templateObject8() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  background: ", ";\n  position: absolute;\n  top: 0;\n  left: ", "px;\n  content: '';\n  display: block;\n  width: ", "px;\n  height: ", "px;\n  border-radius: ", ";\n"]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  ", " color: ", ";\n  font-size: 13px;\n  letter-spacing: 0.43px;\n  line-height: 18px;\n  height: 24px;\n  font-weight: 400;\n  padding-left: 4px;\n  margin-left: -4px;\n  background-color: transparent;\n  border: 1px solid transparent;\n\n  :hover {\n    height: 24px;\n    cursor: text;\n    background-color: transparent;\n    border: 1px solid ", ";\n  }\n\n  :active,\n  .active,\n  :focus {\n    background-color: transparent;\n    border: 1px solid ", ";\n  }\n"]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  ", "\n  ", "\n"]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  ", "\n  ", "\n"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  cursor: pointer;\n  flex-wrap: wrap;\n  height: auto;\n  justify-content: start;\n  margin-bottom: 2px;\n  padding: 0px 7px 0px 4px;\n  white-space: normal;\n\n  .chickleted-input__placeholder {\n    line-height: 24px;\n    margin: 4px;\n  }\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  ", "\n  color: ", ";\n  background-color: ", ";\n  border: 1px solid\n    ", ";\n\n  :hover {\n    cursor: pointer;\n    background-color: ", ";\n    border-color: ", ";\n  }\n\n  :active,\n  &.active {\n    background-color: ", ";\n    border-color: ", ";\n  }\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  ", "\n\n  background-color: ", ";\n  border: 1px solid\n  ", ";\n  color: ", ";\n  caret-color: ", ";\n\n  ::-webkit-input-placeholder {\n    color: ", ";\n    font-weight: 400;\n  }\n\n  :active,\n  :focus,\n  &.focus,\n  &.active {\n    background-color: ", ";\n    border-color: ", ";\n  }\n\n  :hover {\n    background-color: ", ";\n    cursor: ", ";\n    border-color: ", ";\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  align-items: center;\n  background-color: ", ";\n  border: 1px solid\n    ", ";\n  border-radius: 2px;\n  caret-color: ", ";\n  color: ", ";\n  display: flex;\n  font-size: ", ";\n  font-weight: ", ";\n  height: ", ";\n  justify-content: space-between;\n  outline: none;\n  overflow: hidden;\n  padding: ", ";\n  text-overflow: ellipsis;\n  transition: ", ";\n  white-space: nowrap;\n  width: 100%;\n  word-wrap: normal;\n  pointer-events: ", ";\n  opacity: ", ";\n\n  :hover {\n    cursor: ", ";\n    background-color: ", ";\n    border-color: ", ";\n  }\n\n  :active,\n  :focus,\n  &.focus,\n  &.active {\n    background-color: ", ";\n    border-color: ", ";\n  }\n\n  ::placeholder {\n    color: ", ";\n    font-weight: ", ";\n  }\n\n  /* Disable Arrows on Number Inputs */\n  ::-webkit-inner-spin-button,\n  ::-webkit-outer-spin-button {\n    -webkit-appearance: none;\n    margin: 0;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var transition = 'all .4s ease';
exports.transition = transition;
var transitionFast = 'all .2s ease';
exports.transitionFast = transitionFast;
var transitionSlow = 'all .8s ease';
exports.transitionSlow = transitionSlow;
var boxShadow = '0 1px 2px 0 rgba(0,0,0,0.10)';
exports.boxShadow = boxShadow;
var boxSizing = 'border-box';
exports.boxSizing = boxSizing;
var borderRadius = '1px';
exports.borderRadius = borderRadius;
var borderColor = '#3A414C';
exports.borderColor = borderColor;
var borderColorLT = '#F1F1F1'; // TEXT

exports.borderColorLT = borderColorLT;
var fontFamily = "ff-clan-web-pro, 'Helvetica Neue', Helvetica, sans-serif";
exports.fontFamily = fontFamily;
var fontWeight = 400;
exports.fontWeight = fontWeight;
var fontSize = '0.875em';
exports.fontSize = fontSize;
var lineHeight = 1.71429;
exports.lineHeight = lineHeight;
var labelColor = '#6A7485';
exports.labelColor = labelColor;
var labelHoverColor = '#C6C6C6';
exports.labelHoverColor = labelHoverColor;
var labelColorLT = '#6A7485';
exports.labelColorLT = labelColorLT;
var textColor = '#A0A7B4';
exports.textColor = textColor;
var textColorLT = '#3A414C';
exports.textColorLT = textColorLT;
var titleColorLT = '#29323C';
exports.titleColorLT = titleColorLT;
var subtextColor = '#6A7485';
exports.subtextColor = subtextColor;
var subtextColorLT = '#A0A7B4';
exports.subtextColorLT = subtextColorLT;
var subtextColorActive = '#FFFFFF';
exports.subtextColorActive = subtextColorActive;
var titleTextColor = '#FFFFFF';
exports.titleTextColor = titleTextColor;
var textColorHl = '#F0F0F0';
exports.textColorHl = textColorHl;
var textColorHlLT = '#000000';
exports.textColorHlLT = textColorHlLT;
var activeColor = '#1FBAD6';
exports.activeColor = activeColor;
var activeColorLT = '#2473BD';
exports.activeColorLT = activeColorLT;
var activeColorHover = '#108188';
exports.activeColorHover = activeColorHover;
var errorColor = '#F9042C';
exports.errorColor = errorColor;
var logoColor = activeColor; // Button

exports.logoColor = logoColor;
var primaryBtnBgd = '#0F9668';
exports.primaryBtnBgd = primaryBtnBgd;
var primaryBtnActBgd = '#13B17B';
exports.primaryBtnActBgd = primaryBtnActBgd;
var primaryBtnColor = '#FFFFFF';
exports.primaryBtnColor = primaryBtnColor;
var primaryBtnActColor = '#FFFFFF';
exports.primaryBtnActColor = primaryBtnActColor;
var primaryBtnBgdHover = '#13B17B';
exports.primaryBtnBgdHover = primaryBtnBgdHover;
var primaryBtnRadius = '2px';
exports.primaryBtnRadius = primaryBtnRadius;
var secondaryBtnBgd = '#6A7485';
exports.secondaryBtnBgd = secondaryBtnBgd;
var secondaryBtnActBgd = '#A0A7B4';
exports.secondaryBtnActBgd = secondaryBtnActBgd;
var secondaryBtnColor = '#FFFFFF';
exports.secondaryBtnColor = secondaryBtnColor;
var secondaryBtnActColor = '#FFFFFF';
exports.secondaryBtnActColor = secondaryBtnActColor;
var secondaryBtnBgdHover = '#A0A7B4';
exports.secondaryBtnBgdHover = secondaryBtnBgdHover;
var linkBtnBgd = 'transparent';
exports.linkBtnBgd = linkBtnBgd;
var linkBtnActBgd = linkBtnBgd;
exports.linkBtnActBgd = linkBtnActBgd;
var linkBtnColor = '#A0A7B4';
exports.linkBtnColor = linkBtnColor;
var linkBtnActColor = '#F1F1F1';
exports.linkBtnActColor = linkBtnActColor;
var linkBtnActBgdHover = linkBtnBgd;
exports.linkBtnActBgdHover = linkBtnActBgdHover;
var negativeBtnBgd = errorColor;
exports.negativeBtnBgd = negativeBtnBgd;
var negativeBtnActBgd = '#FF193E';
exports.negativeBtnActBgd = negativeBtnActBgd;
var negativeBtnBgdHover = '#FF193E';
exports.negativeBtnBgdHover = negativeBtnBgdHover;
var negativeBtnColor = '#FFFFFF';
exports.negativeBtnColor = negativeBtnColor;
var negativeBtnActColor = '#FFFFFF';
exports.negativeBtnActColor = negativeBtnActColor;
var floatingBtnBgd = '#29323C';
exports.floatingBtnBgd = floatingBtnBgd;
var floatingBtnActBgd = '#3A4552';
exports.floatingBtnActBgd = floatingBtnActBgd;
var floatingBtnBgdHover = '#3A4552';
exports.floatingBtnBgdHover = floatingBtnBgdHover;
var floatingBtnColor = subtextColor;
exports.floatingBtnColor = floatingBtnColor;
var floatingBtnActColor = subtextColorActive; // Input

exports.floatingBtnActColor = floatingBtnActColor;
var inputBoxHeight = '34px';
exports.inputBoxHeight = inputBoxHeight;
var inputBoxHeightSmall = '24px';
exports.inputBoxHeightSmall = inputBoxHeightSmall;
var inputBoxHeightTiny = '18px';
exports.inputBoxHeightTiny = inputBoxHeightTiny;
var inputPadding = '4px 10px';
exports.inputPadding = inputPadding;
var inputPaddingSmall = '4px 6px';
exports.inputPaddingSmall = inputPaddingSmall;
var inputPaddingTiny = '2px 4px';
exports.inputPaddingTiny = inputPaddingTiny;
var inputFontSize = '11px';
exports.inputFontSize = inputFontSize;
var inputFontSizeSmall = '10px';
exports.inputFontSizeSmall = inputFontSizeSmall;
var inputFontWeight = 500;
exports.inputFontWeight = inputFontWeight;
var inputBgd = '#29323C';
exports.inputBgd = inputBgd;
var inputBgdHover = '#3A414C';
exports.inputBgdHover = inputBgdHover;
var inputBgdActive = '#3A414C';
exports.inputBgdActive = inputBgdActive;
var inputBorderColor = '#29323C';
exports.inputBorderColor = inputBorderColor;
var inputBorderHoverColor = '#3A414C';
exports.inputBorderHoverColor = inputBorderHoverColor;
var inputBorderActiveColor = '#D3D8E0';
exports.inputBorderActiveColor = inputBorderActiveColor;
var inputColor = '#A0A7B4';
exports.inputColor = inputColor;
var inputBorderRadius = '1px';
exports.inputBorderRadius = inputBorderRadius;
var inputPlaceholderColor = '#6A7485';
exports.inputPlaceholderColor = inputPlaceholderColor;
var inputPlaceholderFontWeight = 400;
exports.inputPlaceholderFontWeight = inputPlaceholderFontWeight;
var secondaryInputBgd = '#242730';
exports.secondaryInputBgd = secondaryInputBgd;
var secondaryInputBgdHover = '#3A414C';
exports.secondaryInputBgdHover = secondaryInputBgdHover;
var secondaryInputBgdActive = '#3A414C';
exports.secondaryInputBgdActive = secondaryInputBgdActive;
var secondaryInputColor = '#A0A7B4';
exports.secondaryInputColor = secondaryInputColor;
var secondaryInputBorderColor = '#242730';
exports.secondaryInputBorderColor = secondaryInputBorderColor;
var secondaryInputBorderActiveColor = '#D3D8E0'; // Select

exports.secondaryInputBorderActiveColor = secondaryInputBorderActiveColor;
var selectColor = inputColor;
exports.selectColor = selectColor;
var selectColorLT = titleColorLT;
exports.selectColorLT = selectColorLT;
var selectActiveBorderColor = '#D3D8E0';
exports.selectActiveBorderColor = selectActiveBorderColor;
var selectFontSize = '11px';
exports.selectFontSize = selectFontSize;
var selectFontWeight = '400';
exports.selectFontWeight = selectFontWeight;
var selectFontWeightBold = '500';
exports.selectFontWeightBold = selectFontWeightBold;
var selectColorPlaceHolder = '#6A7485';
exports.selectColorPlaceHolder = selectColorPlaceHolder;
var selectBackground = inputBgd;
exports.selectBackground = selectBackground;
var selectBackgroundHover = inputBgdHover;
exports.selectBackgroundHover = selectBackgroundHover;
var selectBackgroundLT = '#FFFFFF';
exports.selectBackgroundLT = selectBackgroundLT;
var selectBackgroundHoverLT = '#F8F8F9';
exports.selectBackgroundHoverLT = selectBackgroundHoverLT;
var selectBorderColor = '#D3D8E0';
exports.selectBorderColor = selectBorderColor;
var selectBorderColorLT = '#D3D8E0';
exports.selectBorderColorLT = selectBorderColorLT;
var selectBorderRadius = '1px';
exports.selectBorderRadius = selectBorderRadius;
var selectBorder = 0;
exports.selectBorder = selectBorder;
var dropdownListHighlightBg = '#6A7485';
exports.dropdownListHighlightBg = dropdownListHighlightBg;
var dropdownListHighlightBgLT = '#F8F8F9';
exports.dropdownListHighlightBgLT = dropdownListHighlightBgLT;
var dropdownListShadow = '0 6px 12px 0 rgba(0,0,0,0.16)';
exports.dropdownListShadow = dropdownListShadow;
var dropdownListBgd = '#3A414C';
exports.dropdownListBgd = dropdownListBgd;
var dropdownListBgdLT = '#FFFFFF';
exports.dropdownListBgdLT = dropdownListBgdLT;
var dropdownListBorderTop = '#242730';
exports.dropdownListBorderTop = dropdownListBorderTop;
var dropdownListBorderTopLT = '#D3D8E0';
exports.dropdownListBorderTopLT = dropdownListBorderTopLT;
var dropdownWrapperZ = 100; // Switch

exports.dropdownWrapperZ = dropdownWrapperZ;
var switchWidth = 24;
exports.switchWidth = switchWidth;
var switchHeight = 12;
exports.switchHeight = switchHeight;
var switchLabelMargin = 12;
exports.switchLabelMargin = switchLabelMargin;
var switchTrackBgd = '#29323C';
exports.switchTrackBgd = switchTrackBgd;
var switchTrackBgdActive = activeColor;
exports.switchTrackBgdActive = switchTrackBgdActive;
var switchTrackBorderRadius = '1px';
exports.switchTrackBorderRadius = switchTrackBorderRadius;
var switchBtnBgd = '#6A7485';
exports.switchBtnBgd = switchBtnBgd;
var switchBtnBgdActive = '#D3D8E0';
exports.switchBtnBgdActive = switchBtnBgdActive;
var switchBtnBoxShadow = '0 2px 4px 0 rgba(0,0,0,0.40)';
exports.switchBtnBoxShadow = switchBtnBoxShadow;
var switchBtnBorderRadius = '0';
exports.switchBtnBorderRadius = switchBtnBorderRadius;
var switchBtnWidth = '12px';
exports.switchBtnWidth = switchBtnWidth;
var switchBtnHeight = '12px';
exports.switchBtnHeight = switchBtnHeight;
var secondarySwitchTrackBgd = '#242730';
exports.secondarySwitchTrackBgd = secondarySwitchTrackBgd;
var secondarySwitchBtnBgd = '#3A414C'; // Checkbox

exports.secondarySwitchBtnBgd = secondarySwitchBtnBgd;
var checkboxWidth = 16;
exports.checkboxWidth = checkboxWidth;
var checkboxHeight = 16;
exports.checkboxHeight = checkboxHeight;
var checkboxMargin = 12;
exports.checkboxMargin = checkboxMargin;
var checkboxBorderColor = selectBorderColor;
exports.checkboxBorderColor = checkboxBorderColor;
var checkboxBorderRadius = '2px';
exports.checkboxBorderRadius = checkboxBorderRadius;
var checkboxBorderColorLT = selectBorderColorLT;
exports.checkboxBorderColorLT = checkboxBorderColorLT;
var checkboxBoxBgd = 'white';
exports.checkboxBoxBgd = checkboxBoxBgd;
var checkboxBoxBgdChecked = primaryBtnBgd; // Side Panel

exports.checkboxBoxBgdChecked = checkboxBoxBgdChecked;
var sidePanelHeaderBg = '#29323C';
exports.sidePanelHeaderBg = sidePanelHeaderBg;
var sidePanelInnerPadding = 16;
exports.sidePanelInnerPadding = sidePanelInnerPadding;
var sidePanelBg = '#242730';
exports.sidePanelBg = sidePanelBg;
var sidePanelScrollBarWidth = 10;
exports.sidePanelScrollBarWidth = sidePanelScrollBarWidth;
var sidePanelScrollBarHeight = 10;
exports.sidePanelScrollBarHeight = sidePanelScrollBarHeight;
var sideBarCloseBtnBgd = secondaryBtnBgd;
exports.sideBarCloseBtnBgd = sideBarCloseBtnBgd;
var sideBarCloseBtnColor = '#29323C';
exports.sideBarCloseBtnColor = sideBarCloseBtnColor;
var sideBarCloseBtnBgdHover = secondaryBtnActBgd;
exports.sideBarCloseBtnBgdHover = sideBarCloseBtnBgdHover;
var panelBackground = '#29323C';
exports.panelBackground = panelBackground;
var panelBackgroundHover = '#3A4552';
exports.panelBackgroundHover = panelBackgroundHover;
var panelActiveBg = '#3A4552';
exports.panelActiveBg = panelActiveBg;
var panelActiveBgLT = '#6A7485';
exports.panelActiveBgLT = panelActiveBgLT;
var panelHeaderIcon = '#6A7485';
exports.panelHeaderIcon = panelHeaderIcon;
var panelHeaderIconActive = '#A0A7B4';
exports.panelHeaderIconActive = panelHeaderIconActive;
var panelHeaderHeight = 48;
exports.panelHeaderHeight = panelHeaderHeight;
var panelBoxShadow = '0 6px 12px 0 rgba(0,0,0,0.16)';
exports.panelBoxShadow = panelBoxShadow;
var panelBorderRadius = '2px';
exports.panelBorderRadius = panelBorderRadius;
var panelBackgroundLT = '#F8F8F9';
exports.panelBackgroundLT = panelBackgroundLT;
var panelBorderColor = '#3A414C';
exports.panelBorderColor = panelBorderColor;
var panelBorder = "1px solid ".concat(borderColor);
exports.panelBorder = panelBorder;
var panelBorderLT = "1px solid ".concat(borderColorLT);
exports.panelBorderLT = panelBorderLT;
var mapPanelBackgroundColor = '#242730';
exports.mapPanelBackgroundColor = mapPanelBackgroundColor;
var mapPanelHeaderBackgroundColor = '#29323C';
exports.mapPanelHeaderBackgroundColor = mapPanelHeaderBackgroundColor;
var tooltipBg = '#F8F8F9';
exports.tooltipBg = tooltipBg;
var tooltipColor = '#333334'; // Bottom Panel

exports.tooltipColor = tooltipColor;
var bottomInnerPdSide = 32;
exports.bottomInnerPdSide = bottomInnerPdSide;
var bottomInnerPdVert = 6;
exports.bottomInnerPdVert = bottomInnerPdVert;
var bottomPanelGap = 20;
exports.bottomPanelGap = bottomPanelGap;
var bottomWidgetPaddingTop = 20;
exports.bottomWidgetPaddingTop = bottomWidgetPaddingTop;
var bottomWidgetPaddingRight = 20;
exports.bottomWidgetPaddingRight = bottomWidgetPaddingRight;
var bottomWidgetPaddingBottom = 30;
exports.bottomWidgetPaddingBottom = bottomWidgetPaddingBottom;
var bottomWidgetPaddingLeft = 20; // Modal

exports.bottomWidgetPaddingLeft = bottomWidgetPaddingLeft;
var modalTitleColor = '#3A414C';
exports.modalTitleColor = modalTitleColor;
var modalTitleFontSize = '24px';
exports.modalTitleFontSize = modalTitleFontSize;
var modalTitleFontSizeSmaller = '18px';
exports.modalTitleFontSizeSmaller = modalTitleFontSizeSmaller;
var modalFooterBgd = '#F8F8F9';
exports.modalFooterBgd = modalFooterBgd;
var modalImagePlaceHolder = '#DDDFE3';
exports.modalImagePlaceHolder = modalImagePlaceHolder;
var modalPadding = '10px 0';
exports.modalPadding = modalPadding;
var modalLateralPadding = '72px';
exports.modalLateralPadding = modalLateralPadding;
var modalPortableLateralPadding = '36px';
exports.modalPortableLateralPadding = modalPortableLateralPadding;
var modalOverLayZ = 1001;
exports.modalOverLayZ = modalOverLayZ;
var modalOverlayBgd = 'rgba(0, 0, 0, 0.5)';
exports.modalOverlayBgd = modalOverlayBgd;
var modalContentZ = 10002;
exports.modalContentZ = modalContentZ;
var modalFooterZ = 10001;
exports.modalFooterZ = modalFooterZ;
var modalTitleZ = 10003;
exports.modalTitleZ = modalTitleZ;
var modalButtonZ = 10005;
exports.modalButtonZ = modalButtonZ;
var modalDropdownBackground = '#FFFFFF'; // Modal Dialog (Dark)

exports.modalDropdownBackground = modalDropdownBackground;
var modalDialogBgd = '#3A414C';
exports.modalDialogBgd = modalDialogBgd;
var modalDialogColor = textColorHl; // Slider

exports.modalDialogColor = modalDialogColor;
var sliderBarColor = '#6A7485';
exports.sliderBarColor = sliderBarColor;
var sliderBarBgd = '#3A414C';
exports.sliderBarBgd = sliderBarBgd;
var sliderBarHoverColor = '#D3D8E0';
exports.sliderBarHoverColor = sliderBarHoverColor;
var sliderBarRadius = '1px';
exports.sliderBarRadius = sliderBarRadius;
var sliderBarHeight = 4;
exports.sliderBarHeight = sliderBarHeight;
var sliderHandleHeight = 12;
exports.sliderHandleHeight = sliderHandleHeight;
var sliderHandleWidth = 12;
exports.sliderHandleWidth = sliderHandleWidth;
var sliderHandleColor = '#D3D8E0';
exports.sliderHandleColor = sliderHandleColor;
var sliderHandleHoverColor = '#FFFFFF';
exports.sliderHandleHoverColor = sliderHandleHoverColor;
var sliderHandleShadow = '0 2px 4px 0 rgba(0,0,0,0.40)';
exports.sliderHandleShadow = sliderHandleShadow;
var sliderInputHeight = 24;
exports.sliderInputHeight = sliderInputHeight;
var sliderInputWidth = 56;
exports.sliderInputWidth = sliderInputWidth;
var sliderMarginTopIsRange = 0;
exports.sliderMarginTopIsRange = sliderMarginTopIsRange;
var sliderMarginTop = 12; // Plot

exports.sliderMarginTop = sliderMarginTop;
var rangeBrushBgd = '#3A414C';
exports.rangeBrushBgd = rangeBrushBgd;
var histogramFillInRange = activeColor;
exports.histogramFillInRange = histogramFillInRange;
var histogramFillOutRange = sliderBarColor; // Notification

exports.histogramFillOutRange = histogramFillOutRange;
var notificationColors = {
  info: '#276ef1',
  error: '#f25138',
  success: '#47b275',
  warning: '#ffc043'
};
exports.notificationColors = notificationColors;
var notificationPanelWidth = 240;
exports.notificationPanelWidth = notificationPanelWidth;
var notificationPanelItemWidth = notificationPanelWidth - 60;
exports.notificationPanelItemWidth = notificationPanelItemWidth;
var notificationPanelItemHeight = 60; // Data Table

exports.notificationPanelItemHeight = notificationPanelItemHeight;
var headerRowHeight = 70;
var rowHeight = 32;
var headerPaddingTop = 6;
var headerPaddingBottom = 8;
var cellPaddingSide = 10;
var edgeCellPaddingSide = 10;
var cellFontSize = 10;
var gridPaddingSide = 24;
var headerCellBackground = '#FFFFFF';
var headerCellBorderColor = '#E0E0E0';
var headerCellIconColor = '#666666';
var cellBorderColor = '#E0E0E0';
var evenRowBackground = '#FFFFFF';
var oddRowBackground = '#F7F7F7';
var optionButtonColor = '#6A7485';
var pinnedGridBorderColor = '#E0E0E0'; // Floating Time display

var timeDisplayBorderRadius = 32;
var timeDisplayHeight = 64;
var timeDisplayMinWidth = 176;
var timeDisplayOpacity = 0.8;
var timeDisplayPadding = '0 24px'; // Export map modal

var exportIntraSectionMargin = '8'; // Action Panel

var actionPanelWidth = 110;
exports.actionPanelWidth = actionPanelWidth;
var actionPanelHeight = 32;
exports.actionPanelHeight = actionPanelHeight;
var textTruncate = {
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  wordWrap: 'normal'
}; // This breakpoints are used for responsive design

exports.textTruncate = textTruncate;
var breakPoints = {
  palm: 588,
  desk: 768
}; // theme is passed to kepler.gl when it's mounted,
// it is used by styled-components to pass along to
// all child components

exports.breakPoints = breakPoints;
var input = (0, _styledComponents.css)(_templateObject(), function (props) {
  return props.theme.inputBgd;
}, function (props) {
  return props.active ? props.theme.inputBorderActiveColor : props.error ? props.theme.errorColor : props.theme.inputBgd;
}, function (props) {
  return props.theme.inputBorderActiveColor;
}, function (props) {
  return props.theme.inputColor;
}, function (props) {
  return ['small', 'tiny'].includes(props.size) ? props.theme.inputFontSizeSmall : props.theme.inputFontSize;
}, function (props) {
  return props.theme.inputFontWeight;
}, function (props) {
  return props.size === 'small' ? props.theme.inputBoxHeightSmall : props.size === 'tiny' ? props.theme.inputBoxHeightTiny : props.theme.inputBoxHeight;
}, function (props) {
  return props.size === 'small' ? props.theme.inputPaddingSmall : props.size === 'tiny' ? props.theme.inputPaddingTiny : props.theme.inputPadding;
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
var inputLT = (0, _styledComponents.css)(_templateObject2(), input, function (props) {
  return props.theme.selectBackgroundLT;
}, function (props) {
  return props.active ? props.theme.selectActiveBorderColor : props.error ? props.theme.errorColor : props.theme.selectBorderColorLT;
}, function (props) {
  return props.theme.selectColorLT;
}, function (props) {
  return props.theme.selectColorLT;
}, function (props) {
  return props.theme.subtextColorLT;
}, function (props) {
  return props.theme.selectBackgroundLT;
}, function (props) {
  return props.theme.textColorLT;
}, function (props) {
  return props.theme.selectBackgroundLT;
}, function (props) {
  return ['number', 'text'].includes(props.type) ? 'text' : 'pointer';
}, function (props) {
  return props.active ? props.theme.textColorLT : props.theme.subtextColor;
});
var secondaryInput = (0, _styledComponents.css)(_templateObject3(), function (props) {
  return props.theme.input;
}, function (props) {
  return props.theme.secondaryInputColor;
}, function (props) {
  return props.theme.secondaryInputBgd;
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
var chickletedInputContainer = (0, _styledComponents.css)(_templateObject4());
var chickletedInput = (0, _styledComponents.css)(_templateObject5(), function (props) {
  return props.theme.input;
}, function (props) {
  return props.theme.chickletedInputContainer;
});
var secondaryChickletedInput = (0, _styledComponents.css)(_templateObject6(), function (props) {
  return props.theme.secondaryInput;
}, function (props) {
  return props.theme.chickletedInputContainer;
});
var inlineInput = (0, _styledComponents.css)(_templateObject7(), function (props) {
  return props.theme.input;
}, function (props) {
  return props.theme.textColor;
}, function (props) {
  return props.theme.labelColor;
}, function (props) {
  return props.theme.inputBorderActiveColor;
});
var switchTrack = (0, _styledComponents.css)(_templateObject8(), function (props) {
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
var switchButton = (0, _styledComponents.css)(_templateObject9(), function (props) {
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
}, function (props) {
  return props.theme.switchBtnBorderRadius;
});
var inputSwitch = (0, _styledComponents.css)(_templateObject10(), function (props) {
  return props.theme.labelColor;
}, function (props) {
  return props.theme.switchWidth;
}, function (props) {
  return props.theme.switchTrack;
}, function (props) {
  return props.theme.switchButton;
}); // This is a light version checkbox

var checkboxBox = (0, _styledComponents.css)(_templateObject11(), function (props) {
  return props.theme.checkboxWidth;
}, function (props) {
  return props.theme.checkboxHeight;
}, function (props) {
  return props.checked ? props.theme.checkboxBoxBgdChecked : props.theme.checkboxBoxBgd;
}, function (props) {
  return props.checked ? props.theme.checkboxBoxBgdChecked : props.theme.checkboxBorderColor;
});
var checkboxCheck = (0, _styledComponents.css)(_templateObject12(), function (props) {
  return props.checked ? 1 : 0;
});
var inputCheckbox = (0, _styledComponents.css)(_templateObject13(), function (props) {
  return props.theme.labelColor;
}, function (props) {
  return props.theme.switchLabelMargin;
}, function (props) {
  return props.theme.checkboxBox;
}, function (props) {
  return props.theme.checkboxCheck;
});
var secondarySwitch = (0, _styledComponents.css)(_templateObject14(), function (props) {
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
var dropdownScrollBar = (0, _styledComponents.css)(_templateObject15(), function (props) {
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
var dropdownListAnchor = (0, _styledComponents.css)(_templateObject16(), function (props) {
  return props.theme.selectColor;
});
var dropdownListSize = (0, _styledComponents.css)(_templateObject17());
var dropdownListItem = (0, _styledComponents.css)(_templateObject18(), dropdownListSize, function (props) {
  return props.theme.dropdownListHighlightBg;
}, function (props) {
  return props.theme.textColorHl;
});
var dropdownListItemLT = (0, _styledComponents.css)(_templateObject19(), dropdownListSize, function (props) {
  return props.theme.textColorLT;
}, function (props) {
  return props.theme.textColorHlLT;
}, function (props) {
  return props.theme.dropdownListHighlightBgLT;
}, function (props) {
  return props.theme.textColorHlLT;
});
var dropdownListHeader = (0, _styledComponents.css)(_templateObject20(), function (props) {
  return props.theme.labelColor;
});
var dropdownListSection = (0, _styledComponents.css)(_templateObject21(), function (props) {
  return props.theme.labelColor;
});
var dropdownList = (0, _styledComponents.css)(_templateObject22(), function (props) {
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
var dropdownListLT = (0, _styledComponents.css)(_templateObject23(), dropdownList, function (props) {
  return props.theme.dropdownListItemLT;
});
var sidePanelScrollBar = (0, _styledComponents.css)(_templateObject24(), function (props) {
  return props.theme.sidePanelScrollBarHeight;
}, function (props) {
  return props.theme.sidePanelScrollBarWidth;
}, function (props) {
  return props.theme.sidePanelBg;
}, function (props) {
  return props.theme.sidePanelBg;
}, function (props) {
  return props.theme.panelBackgroundHover;
}, function (props) {
  return props.theme.sidePanelBg;
}, function (props) {
  return props.theme.labelColor;
});
var panelDropdownScrollBar = (0, _styledComponents.css)(_templateObject25(), function (props) {
  return props.theme.panelBackground;
}, function (props) {
  return props.theme.panelBackground;
}, function (props) {
  return props.theme.panelBackgroundHover;
}, function (props) {
  return props.theme.panelBackground;
}, function (props) {
  return props.theme.labelColor;
});
var scrollBar = (0, _styledComponents.css)(_templateObject26(), function (props) {
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
var modalScrollBar = (0, _styledComponents.css)(_templateObject27(), function (props) {
  return props.theme.textColorHl;
}, function (props) {
  return props.theme.labelColorLT;
}, function (props) {
  return props.theme.textColorHl;
}, function (props) {
  return props.theme.textColorHl;
});
exports.modalScrollBar = modalScrollBar;

var theme = _objectSpread({}, _defaultSettings.DIMENSIONS, {
  // templates
  input: input,
  inputLT: inputLT,
  inlineInput: inlineInput,
  chickletedInput: chickletedInput,
  chickletedInputContainer: chickletedInputContainer,
  secondaryChickletedInput: secondaryChickletedInput,
  borderColor: borderColor,
  borderColorLT: borderColorLT,
  secondaryInput: secondaryInput,
  dropdownScrollBar: dropdownScrollBar,
  dropdownList: dropdownList,
  dropdownListLT: dropdownListLT,
  dropdownListItem: dropdownListItem,
  dropdownListItemLT: dropdownListItemLT,
  dropdownListAnchor: dropdownListAnchor,
  dropdownListHeader: dropdownListHeader,
  dropdownListSection: dropdownListSection,
  dropdownListShadow: dropdownListShadow,
  dropdownWrapperZ: dropdownWrapperZ,
  modalScrollBar: modalScrollBar,
  scrollBar: scrollBar,
  sidePanelScrollBar: sidePanelScrollBar,
  inputSwitch: inputSwitch,
  secondarySwitch: secondarySwitch,
  switchTrack: switchTrack,
  switchButton: switchButton,
  inputCheckbox: inputCheckbox,
  checkboxBox: checkboxBox,
  checkboxCheck: checkboxCheck,
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
  dropdownListHighlightBgLT: dropdownListHighlightBgLT,
  dropdownListBgd: dropdownListBgd,
  dropdownListBgdLT: dropdownListBgdLT,
  dropdownListBorderTop: dropdownListBorderTop,
  dropdownListBorderTopLT: dropdownListBorderTopLT,
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
  selectBorderColorLT: selectBorderColorLT,
  selectColor: selectColor,
  selectColorPlaceHolder: selectColorPlaceHolder,
  selectFontSize: selectFontSize,
  selectFontWeight: selectFontWeight,
  selectColorLT: selectColorLT,
  selectFontWeightBold: selectFontWeightBold,
  // Input
  inputBgd: inputBgd,
  inputBgdHover: inputBgdHover,
  inputBgdActive: inputBgdActive,
  inputBoxHeight: inputBoxHeight,
  inputBoxHeightSmall: inputBoxHeightSmall,
  inputBoxHeightTiny: inputBoxHeightTiny,
  inputBorderColor: inputBorderColor,
  inputBorderActiveColor: inputBorderActiveColor,
  inputBorderHoverColor: inputBorderHoverColor,
  inputBorderRadius: inputBorderRadius,
  inputColor: inputColor,
  inputPadding: inputPadding,
  inputPaddingSmall: inputPaddingSmall,
  inputPaddingTiny: inputPaddingTiny,
  inputFontSize: inputFontSize,
  inputFontSizeSmall: inputFontSizeSmall,
  inputFontWeight: inputFontWeight,
  inputPlaceholderColor: inputPlaceholderColor,
  inputPlaceholderFontWeight: inputPlaceholderFontWeight,
  secondaryInputBgd: secondaryInputBgd,
  secondaryInputBgdHover: secondaryInputBgdHover,
  secondaryInputBgdActive: secondaryInputBgdActive,
  secondaryInputColor: secondaryInputColor,
  secondaryInputBorderColor: secondaryInputBorderColor,
  secondaryInputBorderActiveColor: secondaryInputBorderActiveColor,
  // Switch
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
  // Checkbox
  checkboxWidth: checkboxWidth,
  checkboxHeight: checkboxHeight,
  checkboxMargin: checkboxMargin,
  checkboxBorderColor: checkboxBorderColor,
  checkboxBorderRadius: checkboxBorderRadius,
  checkboxBorderColorLT: checkboxBorderColorLT,
  checkboxBoxBgd: checkboxBoxBgd,
  checkboxBoxBgdChecked: checkboxBoxBgdChecked,
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
  floatingBtnBgd: floatingBtnBgd,
  floatingBtnActBgd: floatingBtnActBgd,
  floatingBtnBgdHover: floatingBtnBgdHover,
  floatingBtnColor: floatingBtnColor,
  floatingBtnActColor: floatingBtnActColor,
  // Modal
  modalTitleColor: modalTitleColor,
  modalTitleFontSize: modalTitleFontSize,
  modalTitleFontSizeSmaller: modalTitleFontSizeSmaller,
  modalFooterBgd: modalFooterBgd,
  modalImagePlaceHolder: modalImagePlaceHolder,
  modalPadding: modalPadding,
  modalDialogBgd: modalDialogBgd,
  modalDialogColor: modalDialogColor,
  modalLateralPadding: modalLateralPadding,
  modalPortableLateralPadding: modalPortableLateralPadding,
  modalOverLayZ: modalOverLayZ,
  modalOverlayBgd: modalOverlayBgd,
  modalContentZ: modalContentZ,
  modalFooterZ: modalFooterZ,
  modalTitleZ: modalTitleZ,
  modalButtonZ: modalButtonZ,
  modalDropdownBackground: modalDropdownBackground,
  // Side Panel
  sidePanelBg: sidePanelBg,
  sidePanelInnerPadding: sidePanelInnerPadding,
  sideBarCloseBtnBgd: sideBarCloseBtnBgd,
  sideBarCloseBtnColor: sideBarCloseBtnColor,
  sideBarCloseBtnBgdHover: sideBarCloseBtnBgdHover,
  sidePanelHeaderBg: sidePanelHeaderBg,
  sidePanelScrollBarWidth: sidePanelScrollBarWidth,
  sidePanelScrollBarHeight: sidePanelScrollBarHeight,
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
  panelDropdownScrollBar: panelDropdownScrollBar,
  // Text
  fontFamily: fontFamily,
  fontWeight: fontWeight,
  fontSize: fontSize,
  lineHeight: lineHeight,
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
  logoColor: logoColor,
  // Bottom Panel
  bottomInnerPdSide: bottomInnerPdSide,
  bottomInnerPdVert: bottomInnerPdVert,
  bottomPanelGap: bottomPanelGap,
  bottomWidgetPaddingTop: bottomWidgetPaddingTop,
  bottomWidgetPaddingRight: bottomWidgetPaddingRight,
  bottomWidgetPaddingBottom: bottomWidgetPaddingBottom,
  bottomWidgetPaddingLeft: bottomWidgetPaddingLeft,
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
  sliderInputHeight: sliderInputHeight,
  sliderInputWidth: sliderInputWidth,
  sliderMarginTopIsRange: sliderMarginTopIsRange,
  sliderMarginTop: sliderMarginTop,
  // Plot
  rangeBrushBgd: rangeBrushBgd,
  histogramFillInRange: histogramFillInRange,
  histogramFillOutRange: histogramFillOutRange,
  // Notifications
  notificationColors: notificationColors,
  notificationPanelWidth: notificationPanelWidth,
  notificationPanelItemWidth: notificationPanelItemWidth,
  notificationPanelItemHeight: notificationPanelItemHeight,
  // Data Table
  headerRowHeight: headerRowHeight,
  rowHeight: rowHeight,
  headerPaddingTop: headerPaddingTop,
  headerPaddingBottom: headerPaddingBottom,
  cellPaddingSide: cellPaddingSide,
  edgeCellPaddingSide: edgeCellPaddingSide,
  cellFontSize: cellFontSize,
  gridPaddingSide: gridPaddingSide,
  optionButtonColor: optionButtonColor,
  headerCellBackground: headerCellBackground,
  headerCellBorderColor: headerCellBorderColor,
  headerCellIconColor: headerCellIconColor,
  cellBorderColor: cellBorderColor,
  evenRowBackground: evenRowBackground,
  oddRowBackground: oddRowBackground,
  pinnedGridBorderColor: pinnedGridBorderColor,
  // time display
  timeDisplayBorderRadius: timeDisplayBorderRadius,
  timeDisplayHeight: timeDisplayHeight,
  timeDisplayMinWidth: timeDisplayMinWidth,
  timeDisplayOpacity: timeDisplayOpacity,
  timeDisplayPadding: timeDisplayPadding,
  // export map
  exportIntraSectionMargin: exportIntraSectionMargin,
  // Action Panel
  actionPanelWidth: actionPanelWidth,
  actionPanelHeight: actionPanelHeight,
  // Breakpoints
  breakPoints: breakPoints
});

exports.theme = theme;

var themeLT = _objectSpread({}, theme, {
  // template
  activeColor: activeColorLT,
  input: inputLT,
  textColor: textColorLT,
  sidePanelBg: '#FFFFFF',
  selectColor: selectColorLT,
  titleTextColor: '#000000',
  sidePanelHeaderBg: '#F7F7F7',
  subtextColorActive: activeColorLT,
  tooltipBg: '#1869B5',
  tooltipColor: '#FFFFFF',
  dropdownListBgd: '#FFFFFF',
  textColorHl: activeColorLT,
  inputBgd: '#F7F7F7',
  inputBgdHover: '#FFFFFF',
  inputBgdActive: '#FFFFFF',
  dropdownListHighlightBg: '#F0F0F0',
  panelBackground: '#F7F7F7',
  panelBackgroundHover: '#F7F7F7',
  panelBorderColor: '#D3D8E0',
  sideBarCloseBtnBgd: '#F7F7F7',
  sideBarCloseBtnColor: textColorLT,
  sideBarCloseBtnBgdHover: '#F7F7F7',
  secondaryInputBgd: '#F7F7F7',
  secondaryInputBgdActive: '#F7F7F7',
  secondaryInputBgdHover: '#FFFFFF',
  secondaryInputBorderActiveColor: '#000000',
  secondaryInputBorderColor: 'none',
  secondaryInputColor: '#545454',
  panelActiveBg: '#F7F7F7',
  mapPanelBackgroundColor: '#FFFFFF',
  mapPanelHeaderBackgroundColor: '#F7F7F7',
  sliderBarColor: '#A0A7B4',
  sliderBarBgd: '#D3D8E0',
  sliderHandleColor: '#F7F7F7',
  sliderHandleHoverColor: '#F7F7F7',
  subtextColor: subtextColorLT,
  switchBtnBgd: '#F7F7F7',
  secondarySwitchBtnBgd: '#F7F7F7',
  secondarySwitchTrackBgd: '#D3D8E0',
  switchBtnBgdActive: '#F7F7F7',
  switchTrackBgd: '#D3D8E0',
  switchTrackBgdActive: activeColorLT,
  // button switch background and hover color
  primaryBtnBgd: primaryBtnActBgd,
  primaryBtnActBgd: primaryBtnBgd,
  primaryBtnBgdHover: primaryBtnBgd,
  secondaryBtnBgd: secondaryBtnActBgd,
  secondaryBtnActBgd: secondaryBtnBgd,
  secondaryBtnBgdHover: secondaryBtnBgd,
  floatingBtnBgd: '#F7F7F7',
  floatingBtnActBgd: '#F7F7F7',
  floatingBtnBgdHover: '#F7F7F7',
  floatingBtnColor: subtextColor,
  floatingBtnActColor: activeColorLT,
  linkBtnActColor: textColorLT,
  rangeBrushBgd: '#D3D8E0',
  histogramFillInRange: activeColorLT,
  histogramFillOutRange: '#A0A7B4'
});

exports.themeLT = themeLT;

var themeBS = _objectSpread({}, theme, {
  activeColor: '#E2E2E2',
  dropdownListBgd: '#FFFFFF',
  dropdownListBorderTop: 'none',
  dropdownListHighlightBg: '#F6F6F6',
  inputBgd: '#E2E2E2',
  inputBgdActive: '#E2E2E2',
  inputBgdHover: 'inherit',
  inputBorderActiveColor: '#000000',
  inputColor: '#000000',
  panelActiveBg: '#E2E2E2',
  panelBackground: '#FFFFFF',
  panelBackgroundHover: '#EEEEEE',
  panelBorderColor: '#E2E2E2',
  primaryBtnBgd: '#E2E2E2',
  primaryBtnBgdHover: '#333333',
  primaryBtnColor: '#000000',
  secondaryBtnActBgd: '#EEEEEE',
  secondaryBtnActColor: '#000000',
  secondaryBtnBgd: '#E2E2E2',
  secondaryBtnBgdHover: '#CBCBCB',
  sideBarCloseBtnBgd: '#E2E2E2',
  sideBarCloseBtnColor: '#000000',
  sideBarCloseBtnBgdHover: '#FFFFFF',
  floatingBtnBgd: '#FFFFFF',
  floatingBtnActBgd: '#EEEEEE',
  floatingBtnBgdHover: '#EEEEEE',
  floatingBtnColor: '#757575',
  floatingBtnActColor: '#000000',
  secondaryBtnColor: '#000000',
  secondaryInputBgd: '#F6F6F6',
  secondaryInputBgdActive: '#F6F6F6',
  secondaryInputBgdHover: '#F6F6F6',
  secondaryInputBorderActiveColor: '#000000',
  secondaryInputBorderColor: 'none',
  secondaryInputColor: '#545454',
  sidePanelBg: '#F6F6F6',
  sidePanelHeaderBg: '#FFFFFF',
  subtextColor: '#AFAFAF',
  subtextColorActive: '#000000',
  textColor: '#000000',
  textColorHl: '#545454',
  mapPanelBackgroundColor: '#F6F6F6',
  mapPanelHeaderBackgroundColor: '#FFFFFF',
  titleTextColor: '#000000',
  switchBtnBgdActive: '#000000',
  switchBtnBgd: '#FFFFFF',
  switchTrackBgdActive: '#E2E2E2',
  secondarySwitchTrackBgd: '#E2E2E2',
  switchTrackBgd: '#E2E2E2',
  secondarySwitchBtnBgd: '#FFFFFF',
  histogramFillInRange: '#000000',
  histogramFillOutRange: '#E2E2E2',
  rangeBrushBgd: '#E2E2E2',
  sliderBarBgd: '#E2E2E2',
  sliderHandleColor: '#FFFFFF',
  sliderBarColor: '#000000'
});

exports.themeBS = themeBS;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHlsZXMvYmFzZS5qcyJdLCJuYW1lcyI6WyJ0cmFuc2l0aW9uIiwidHJhbnNpdGlvbkZhc3QiLCJ0cmFuc2l0aW9uU2xvdyIsImJveFNoYWRvdyIsImJveFNpemluZyIsImJvcmRlclJhZGl1cyIsImJvcmRlckNvbG9yIiwiYm9yZGVyQ29sb3JMVCIsImZvbnRGYW1pbHkiLCJmb250V2VpZ2h0IiwiZm9udFNpemUiLCJsaW5lSGVpZ2h0IiwibGFiZWxDb2xvciIsImxhYmVsSG92ZXJDb2xvciIsImxhYmVsQ29sb3JMVCIsInRleHRDb2xvciIsInRleHRDb2xvckxUIiwidGl0bGVDb2xvckxUIiwic3VidGV4dENvbG9yIiwic3VidGV4dENvbG9yTFQiLCJzdWJ0ZXh0Q29sb3JBY3RpdmUiLCJ0aXRsZVRleHRDb2xvciIsInRleHRDb2xvckhsIiwidGV4dENvbG9ySGxMVCIsImFjdGl2ZUNvbG9yIiwiYWN0aXZlQ29sb3JMVCIsImFjdGl2ZUNvbG9ySG92ZXIiLCJlcnJvckNvbG9yIiwibG9nb0NvbG9yIiwicHJpbWFyeUJ0bkJnZCIsInByaW1hcnlCdG5BY3RCZ2QiLCJwcmltYXJ5QnRuQ29sb3IiLCJwcmltYXJ5QnRuQWN0Q29sb3IiLCJwcmltYXJ5QnRuQmdkSG92ZXIiLCJwcmltYXJ5QnRuUmFkaXVzIiwic2Vjb25kYXJ5QnRuQmdkIiwic2Vjb25kYXJ5QnRuQWN0QmdkIiwic2Vjb25kYXJ5QnRuQ29sb3IiLCJzZWNvbmRhcnlCdG5BY3RDb2xvciIsInNlY29uZGFyeUJ0bkJnZEhvdmVyIiwibGlua0J0bkJnZCIsImxpbmtCdG5BY3RCZ2QiLCJsaW5rQnRuQ29sb3IiLCJsaW5rQnRuQWN0Q29sb3IiLCJsaW5rQnRuQWN0QmdkSG92ZXIiLCJuZWdhdGl2ZUJ0bkJnZCIsIm5lZ2F0aXZlQnRuQWN0QmdkIiwibmVnYXRpdmVCdG5CZ2RIb3ZlciIsIm5lZ2F0aXZlQnRuQ29sb3IiLCJuZWdhdGl2ZUJ0bkFjdENvbG9yIiwiZmxvYXRpbmdCdG5CZ2QiLCJmbG9hdGluZ0J0bkFjdEJnZCIsImZsb2F0aW5nQnRuQmdkSG92ZXIiLCJmbG9hdGluZ0J0bkNvbG9yIiwiZmxvYXRpbmdCdG5BY3RDb2xvciIsImlucHV0Qm94SGVpZ2h0IiwiaW5wdXRCb3hIZWlnaHRTbWFsbCIsImlucHV0Qm94SGVpZ2h0VGlueSIsImlucHV0UGFkZGluZyIsImlucHV0UGFkZGluZ1NtYWxsIiwiaW5wdXRQYWRkaW5nVGlueSIsImlucHV0Rm9udFNpemUiLCJpbnB1dEZvbnRTaXplU21hbGwiLCJpbnB1dEZvbnRXZWlnaHQiLCJpbnB1dEJnZCIsImlucHV0QmdkSG92ZXIiLCJpbnB1dEJnZEFjdGl2ZSIsImlucHV0Qm9yZGVyQ29sb3IiLCJpbnB1dEJvcmRlckhvdmVyQ29sb3IiLCJpbnB1dEJvcmRlckFjdGl2ZUNvbG9yIiwiaW5wdXRDb2xvciIsImlucHV0Qm9yZGVyUmFkaXVzIiwiaW5wdXRQbGFjZWhvbGRlckNvbG9yIiwiaW5wdXRQbGFjZWhvbGRlckZvbnRXZWlnaHQiLCJzZWNvbmRhcnlJbnB1dEJnZCIsInNlY29uZGFyeUlucHV0QmdkSG92ZXIiLCJzZWNvbmRhcnlJbnB1dEJnZEFjdGl2ZSIsInNlY29uZGFyeUlucHV0Q29sb3IiLCJzZWNvbmRhcnlJbnB1dEJvcmRlckNvbG9yIiwic2Vjb25kYXJ5SW5wdXRCb3JkZXJBY3RpdmVDb2xvciIsInNlbGVjdENvbG9yIiwic2VsZWN0Q29sb3JMVCIsInNlbGVjdEFjdGl2ZUJvcmRlckNvbG9yIiwic2VsZWN0Rm9udFNpemUiLCJzZWxlY3RGb250V2VpZ2h0Iiwic2VsZWN0Rm9udFdlaWdodEJvbGQiLCJzZWxlY3RDb2xvclBsYWNlSG9sZGVyIiwic2VsZWN0QmFja2dyb3VuZCIsInNlbGVjdEJhY2tncm91bmRIb3ZlciIsInNlbGVjdEJhY2tncm91bmRMVCIsInNlbGVjdEJhY2tncm91bmRIb3ZlckxUIiwic2VsZWN0Qm9yZGVyQ29sb3IiLCJzZWxlY3RCb3JkZXJDb2xvckxUIiwic2VsZWN0Qm9yZGVyUmFkaXVzIiwic2VsZWN0Qm9yZGVyIiwiZHJvcGRvd25MaXN0SGlnaGxpZ2h0QmciLCJkcm9wZG93bkxpc3RIaWdobGlnaHRCZ0xUIiwiZHJvcGRvd25MaXN0U2hhZG93IiwiZHJvcGRvd25MaXN0QmdkIiwiZHJvcGRvd25MaXN0QmdkTFQiLCJkcm9wZG93bkxpc3RCb3JkZXJUb3AiLCJkcm9wZG93bkxpc3RCb3JkZXJUb3BMVCIsImRyb3Bkb3duV3JhcHBlcloiLCJzd2l0Y2hXaWR0aCIsInN3aXRjaEhlaWdodCIsInN3aXRjaExhYmVsTWFyZ2luIiwic3dpdGNoVHJhY2tCZ2QiLCJzd2l0Y2hUcmFja0JnZEFjdGl2ZSIsInN3aXRjaFRyYWNrQm9yZGVyUmFkaXVzIiwic3dpdGNoQnRuQmdkIiwic3dpdGNoQnRuQmdkQWN0aXZlIiwic3dpdGNoQnRuQm94U2hhZG93Iiwic3dpdGNoQnRuQm9yZGVyUmFkaXVzIiwic3dpdGNoQnRuV2lkdGgiLCJzd2l0Y2hCdG5IZWlnaHQiLCJzZWNvbmRhcnlTd2l0Y2hUcmFja0JnZCIsInNlY29uZGFyeVN3aXRjaEJ0bkJnZCIsImNoZWNrYm94V2lkdGgiLCJjaGVja2JveEhlaWdodCIsImNoZWNrYm94TWFyZ2luIiwiY2hlY2tib3hCb3JkZXJDb2xvciIsImNoZWNrYm94Qm9yZGVyUmFkaXVzIiwiY2hlY2tib3hCb3JkZXJDb2xvckxUIiwiY2hlY2tib3hCb3hCZ2QiLCJjaGVja2JveEJveEJnZENoZWNrZWQiLCJzaWRlUGFuZWxIZWFkZXJCZyIsInNpZGVQYW5lbElubmVyUGFkZGluZyIsInNpZGVQYW5lbEJnIiwic2lkZVBhbmVsU2Nyb2xsQmFyV2lkdGgiLCJzaWRlUGFuZWxTY3JvbGxCYXJIZWlnaHQiLCJzaWRlQmFyQ2xvc2VCdG5CZ2QiLCJzaWRlQmFyQ2xvc2VCdG5Db2xvciIsInNpZGVCYXJDbG9zZUJ0bkJnZEhvdmVyIiwicGFuZWxCYWNrZ3JvdW5kIiwicGFuZWxCYWNrZ3JvdW5kSG92ZXIiLCJwYW5lbEFjdGl2ZUJnIiwicGFuZWxBY3RpdmVCZ0xUIiwicGFuZWxIZWFkZXJJY29uIiwicGFuZWxIZWFkZXJJY29uQWN0aXZlIiwicGFuZWxIZWFkZXJIZWlnaHQiLCJwYW5lbEJveFNoYWRvdyIsInBhbmVsQm9yZGVyUmFkaXVzIiwicGFuZWxCYWNrZ3JvdW5kTFQiLCJwYW5lbEJvcmRlckNvbG9yIiwicGFuZWxCb3JkZXIiLCJwYW5lbEJvcmRlckxUIiwibWFwUGFuZWxCYWNrZ3JvdW5kQ29sb3IiLCJtYXBQYW5lbEhlYWRlckJhY2tncm91bmRDb2xvciIsInRvb2x0aXBCZyIsInRvb2x0aXBDb2xvciIsImJvdHRvbUlubmVyUGRTaWRlIiwiYm90dG9tSW5uZXJQZFZlcnQiLCJib3R0b21QYW5lbEdhcCIsImJvdHRvbVdpZGdldFBhZGRpbmdUb3AiLCJib3R0b21XaWRnZXRQYWRkaW5nUmlnaHQiLCJib3R0b21XaWRnZXRQYWRkaW5nQm90dG9tIiwiYm90dG9tV2lkZ2V0UGFkZGluZ0xlZnQiLCJtb2RhbFRpdGxlQ29sb3IiLCJtb2RhbFRpdGxlRm9udFNpemUiLCJtb2RhbFRpdGxlRm9udFNpemVTbWFsbGVyIiwibW9kYWxGb290ZXJCZ2QiLCJtb2RhbEltYWdlUGxhY2VIb2xkZXIiLCJtb2RhbFBhZGRpbmciLCJtb2RhbExhdGVyYWxQYWRkaW5nIiwibW9kYWxQb3J0YWJsZUxhdGVyYWxQYWRkaW5nIiwibW9kYWxPdmVyTGF5WiIsIm1vZGFsT3ZlcmxheUJnZCIsIm1vZGFsQ29udGVudFoiLCJtb2RhbEZvb3RlcloiLCJtb2RhbFRpdGxlWiIsIm1vZGFsQnV0dG9uWiIsIm1vZGFsRHJvcGRvd25CYWNrZ3JvdW5kIiwibW9kYWxEaWFsb2dCZ2QiLCJtb2RhbERpYWxvZ0NvbG9yIiwic2xpZGVyQmFyQ29sb3IiLCJzbGlkZXJCYXJCZ2QiLCJzbGlkZXJCYXJIb3ZlckNvbG9yIiwic2xpZGVyQmFyUmFkaXVzIiwic2xpZGVyQmFySGVpZ2h0Iiwic2xpZGVySGFuZGxlSGVpZ2h0Iiwic2xpZGVySGFuZGxlV2lkdGgiLCJzbGlkZXJIYW5kbGVDb2xvciIsInNsaWRlckhhbmRsZUhvdmVyQ29sb3IiLCJzbGlkZXJIYW5kbGVTaGFkb3ciLCJzbGlkZXJJbnB1dEhlaWdodCIsInNsaWRlcklucHV0V2lkdGgiLCJzbGlkZXJNYXJnaW5Ub3BJc1JhbmdlIiwic2xpZGVyTWFyZ2luVG9wIiwicmFuZ2VCcnVzaEJnZCIsImhpc3RvZ3JhbUZpbGxJblJhbmdlIiwiaGlzdG9ncmFtRmlsbE91dFJhbmdlIiwibm90aWZpY2F0aW9uQ29sb3JzIiwiaW5mbyIsImVycm9yIiwic3VjY2VzcyIsIndhcm5pbmciLCJub3RpZmljYXRpb25QYW5lbFdpZHRoIiwibm90aWZpY2F0aW9uUGFuZWxJdGVtV2lkdGgiLCJub3RpZmljYXRpb25QYW5lbEl0ZW1IZWlnaHQiLCJoZWFkZXJSb3dIZWlnaHQiLCJyb3dIZWlnaHQiLCJoZWFkZXJQYWRkaW5nVG9wIiwiaGVhZGVyUGFkZGluZ0JvdHRvbSIsImNlbGxQYWRkaW5nU2lkZSIsImVkZ2VDZWxsUGFkZGluZ1NpZGUiLCJjZWxsRm9udFNpemUiLCJncmlkUGFkZGluZ1NpZGUiLCJoZWFkZXJDZWxsQmFja2dyb3VuZCIsImhlYWRlckNlbGxCb3JkZXJDb2xvciIsImhlYWRlckNlbGxJY29uQ29sb3IiLCJjZWxsQm9yZGVyQ29sb3IiLCJldmVuUm93QmFja2dyb3VuZCIsIm9kZFJvd0JhY2tncm91bmQiLCJvcHRpb25CdXR0b25Db2xvciIsInBpbm5lZEdyaWRCb3JkZXJDb2xvciIsInRpbWVEaXNwbGF5Qm9yZGVyUmFkaXVzIiwidGltZURpc3BsYXlIZWlnaHQiLCJ0aW1lRGlzcGxheU1pbldpZHRoIiwidGltZURpc3BsYXlPcGFjaXR5IiwidGltZURpc3BsYXlQYWRkaW5nIiwiZXhwb3J0SW50cmFTZWN0aW9uTWFyZ2luIiwiYWN0aW9uUGFuZWxXaWR0aCIsImFjdGlvblBhbmVsSGVpZ2h0IiwidGV4dFRydW5jYXRlIiwibWF4V2lkdGgiLCJvdmVyZmxvdyIsInRleHRPdmVyZmxvdyIsIndoaXRlU3BhY2UiLCJ3b3JkV3JhcCIsImJyZWFrUG9pbnRzIiwicGFsbSIsImRlc2siLCJpbnB1dCIsImNzcyIsInByb3BzIiwidGhlbWUiLCJhY3RpdmUiLCJpbmNsdWRlcyIsInNpemUiLCJkaXNhYmxlZCIsInR5cGUiLCJpbnB1dExUIiwic2Vjb25kYXJ5SW5wdXQiLCJjaGlja2xldGVkSW5wdXRDb250YWluZXIiLCJjaGlja2xldGVkSW5wdXQiLCJzZWNvbmRhcnlDaGlja2xldGVkSW5wdXQiLCJpbmxpbmVJbnB1dCIsInN3aXRjaFRyYWNrIiwiY2hlY2tlZCIsInN3aXRjaEJ1dHRvbiIsImlucHV0U3dpdGNoIiwiY2hlY2tib3hCb3giLCJjaGVja2JveENoZWNrIiwiaW5wdXRDaGVja2JveCIsInNlY29uZGFyeVN3aXRjaCIsImRyb3Bkb3duU2Nyb2xsQmFyIiwiZHJvcGRvd25MaXN0QW5jaG9yIiwiZHJvcGRvd25MaXN0U2l6ZSIsImRyb3Bkb3duTGlzdEl0ZW0iLCJkcm9wZG93bkxpc3RJdGVtTFQiLCJkcm9wZG93bkxpc3RIZWFkZXIiLCJkcm9wZG93bkxpc3RTZWN0aW9uIiwiZHJvcGRvd25MaXN0IiwiZHJvcGRvd25MaXN0TFQiLCJzaWRlUGFuZWxTY3JvbGxCYXIiLCJwYW5lbERyb3Bkb3duU2Nyb2xsQmFyIiwic2Nyb2xsQmFyIiwibW9kYWxTY3JvbGxCYXIiLCJESU1FTlNJT05TIiwidGhlbWVMVCIsInRoZW1lQlMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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QixFQUFFLFNBckNmO0FBc0NsQkQsRUFBQUEseUJBQXlCLEVBQUUsTUF0Q1Q7QUF1Q2xCRCxFQUFBQSxtQkFBbUIsRUFBRSxTQXZDSDtBQXdDbEJrRCxFQUFBQSxXQUFXLEVBQUUsU0F4Q0s7QUF5Q2xCRixFQUFBQSxpQkFBaUIsRUFBRSxTQXpDRDtBQTBDbEIzRyxFQUFBQSxZQUFZLEVBQUUsU0ExQ0k7QUEyQ2xCRSxFQUFBQSxrQkFBa0IsRUFBRSxTQTNDRjtBQTRDbEJMLEVBQUFBLFNBQVMsRUFBRSxTQTVDTztBQTZDbEJPLEVBQUFBLFdBQVcsRUFBRSxTQTdDSztBQThDbEI0SCxFQUFBQSx1QkFBdUIsRUFBRSxTQTlDUDtBQStDbEJDLEVBQUFBLDZCQUE2QixFQUFFLFNBL0NiO0FBZ0RsQjlILEVBQUFBLGNBQWMsRUFBRSxTQWhERTtBQWlEbEJ5RixFQUFBQSxrQkFBa0IsRUFBRSxTQWpERjtBQWtEbEJELEVBQUFBLFlBQVksRUFBRSxTQWxESTtBQW1EbEJGLEVBQUFBLG9CQUFvQixFQUFFLFNBbkRKO0FBb0RsQlEsRUFBQUEsdUJBQXVCLEVBQUUsU0FwRFA7QUFxRGxCVCxFQUFBQSxjQUFjLEVBQUUsU0FyREU7QUFzRGxCVSxFQUFBQSxxQkFBcUIsRUFBRSxTQXRETDtBQXVEbEJ5RSxFQUFBQSxvQkFBb0IsRUFBRSxTQXZESjtBQXdEbEJDLEVBQUFBLHFCQUFxQixFQUFFLFNBeERMO0FBeURsQkYsRUFBQUEsYUFBYSxFQUFFLFNBekRHO0FBMERsQmIsRUFBQUEsWUFBWSxFQUFFLFNBMURJO0FBMkRsQk0sRUFBQUEsaUJBQWlCLEVBQUUsU0EzREQ7QUE0RGxCUCxFQUFBQSxjQUFjLEVBQUU7QUE1REUsRUFBYiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCB7Y3NzfSBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge0RJTUVOU0lPTlN9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuZXhwb3J0IGNvbnN0IHRyYW5zaXRpb24gPSAnYWxsIC40cyBlYXNlJztcbmV4cG9ydCBjb25zdCB0cmFuc2l0aW9uRmFzdCA9ICdhbGwgLjJzIGVhc2UnO1xuZXhwb3J0IGNvbnN0IHRyYW5zaXRpb25TbG93ID0gJ2FsbCAuOHMgZWFzZSc7XG5cbmV4cG9ydCBjb25zdCBib3hTaGFkb3cgPSAnMCAxcHggMnB4IDAgcmdiYSgwLDAsMCwwLjEwKSc7XG5leHBvcnQgY29uc3QgYm94U2l6aW5nID0gJ2JvcmRlci1ib3gnO1xuZXhwb3J0IGNvbnN0IGJvcmRlclJhZGl1cyA9ICcxcHgnO1xuZXhwb3J0IGNvbnN0IGJvcmRlckNvbG9yID0gJyMzQTQxNEMnO1xuZXhwb3J0IGNvbnN0IGJvcmRlckNvbG9yTFQgPSAnI0YxRjFGMSc7XG5cbi8vIFRFWFRcbmV4cG9ydCBjb25zdCBmb250RmFtaWx5ID0gYGZmLWNsYW4td2ViLXBybywgJ0hlbHZldGljYSBOZXVlJywgSGVsdmV0aWNhLCBzYW5zLXNlcmlmYDtcbmV4cG9ydCBjb25zdCBmb250V2VpZ2h0ID0gNDAwO1xuZXhwb3J0IGNvbnN0IGZvbnRTaXplID0gJzAuODc1ZW0nO1xuZXhwb3J0IGNvbnN0IGxpbmVIZWlnaHQgPSAxLjcxNDI5O1xuZXhwb3J0IGNvbnN0IGxhYmVsQ29sb3IgPSAnIzZBNzQ4NSc7XG5leHBvcnQgY29uc3QgbGFiZWxIb3ZlckNvbG9yID0gJyNDNkM2QzYnO1xuZXhwb3J0IGNvbnN0IGxhYmVsQ29sb3JMVCA9ICcjNkE3NDg1JztcblxuZXhwb3J0IGNvbnN0IHRleHRDb2xvciA9ICcjQTBBN0I0JztcbmV4cG9ydCBjb25zdCB0ZXh0Q29sb3JMVCA9ICcjM0E0MTRDJztcbmV4cG9ydCBjb25zdCB0aXRsZUNvbG9yTFQgPSAnIzI5MzIzQyc7XG5cbmV4cG9ydCBjb25zdCBzdWJ0ZXh0Q29sb3IgPSAnIzZBNzQ4NSc7XG5leHBvcnQgY29uc3Qgc3VidGV4dENvbG9yTFQgPSAnI0EwQTdCNCc7XG5leHBvcnQgY29uc3Qgc3VidGV4dENvbG9yQWN0aXZlID0gJyNGRkZGRkYnO1xuXG5leHBvcnQgY29uc3QgdGl0bGVUZXh0Q29sb3IgPSAnI0ZGRkZGRic7XG5leHBvcnQgY29uc3QgdGV4dENvbG9ySGwgPSAnI0YwRjBGMCc7XG5leHBvcnQgY29uc3QgdGV4dENvbG9ySGxMVCA9ICcjMDAwMDAwJztcbmV4cG9ydCBjb25zdCBhY3RpdmVDb2xvciA9ICcjMUZCQUQ2JztcbmV4cG9ydCBjb25zdCBhY3RpdmVDb2xvckxUID0gJyMyNDczQkQnO1xuZXhwb3J0IGNvbnN0IGFjdGl2ZUNvbG9ySG92ZXIgPSAnIzEwODE4OCc7XG5leHBvcnQgY29uc3QgZXJyb3JDb2xvciA9ICcjRjkwNDJDJztcbmV4cG9ydCBjb25zdCBsb2dvQ29sb3IgPSBhY3RpdmVDb2xvcjtcblxuLy8gQnV0dG9uXG5leHBvcnQgY29uc3QgcHJpbWFyeUJ0bkJnZCA9ICcjMEY5NjY4JztcbmV4cG9ydCBjb25zdCBwcmltYXJ5QnRuQWN0QmdkID0gJyMxM0IxN0InO1xuZXhwb3J0IGNvbnN0IHByaW1hcnlCdG5Db2xvciA9ICcjRkZGRkZGJztcbmV4cG9ydCBjb25zdCBwcmltYXJ5QnRuQWN0Q29sb3IgPSAnI0ZGRkZGRic7XG5leHBvcnQgY29uc3QgcHJpbWFyeUJ0bkJnZEhvdmVyID0gJyMxM0IxN0InO1xuZXhwb3J0IGNvbnN0IHByaW1hcnlCdG5SYWRpdXMgPSAnMnB4JztcblxuZXhwb3J0IGNvbnN0IHNlY29uZGFyeUJ0bkJnZCA9ICcjNkE3NDg1JztcbmV4cG9ydCBjb25zdCBzZWNvbmRhcnlCdG5BY3RCZ2QgPSAnI0EwQTdCNCc7XG5leHBvcnQgY29uc3Qgc2Vjb25kYXJ5QnRuQ29sb3IgPSAnI0ZGRkZGRic7XG5leHBvcnQgY29uc3Qgc2Vjb25kYXJ5QnRuQWN0Q29sb3IgPSAnI0ZGRkZGRic7XG5leHBvcnQgY29uc3Qgc2Vjb25kYXJ5QnRuQmdkSG92ZXIgPSAnI0EwQTdCNCc7XG5cbmV4cG9ydCBjb25zdCBsaW5rQnRuQmdkID0gJ3RyYW5zcGFyZW50JztcbmV4cG9ydCBjb25zdCBsaW5rQnRuQWN0QmdkID0gbGlua0J0bkJnZDtcbmV4cG9ydCBjb25zdCBsaW5rQnRuQ29sb3IgPSAnI0EwQTdCNCc7XG5leHBvcnQgY29uc3QgbGlua0J0bkFjdENvbG9yID0gJyNGMUYxRjEnO1xuZXhwb3J0IGNvbnN0IGxpbmtCdG5BY3RCZ2RIb3ZlciA9IGxpbmtCdG5CZ2Q7XG5cbmV4cG9ydCBjb25zdCBuZWdhdGl2ZUJ0bkJnZCA9IGVycm9yQ29sb3I7XG5leHBvcnQgY29uc3QgbmVnYXRpdmVCdG5BY3RCZ2QgPSAnI0ZGMTkzRSc7XG5leHBvcnQgY29uc3QgbmVnYXRpdmVCdG5CZ2RIb3ZlciA9ICcjRkYxOTNFJztcbmV4cG9ydCBjb25zdCBuZWdhdGl2ZUJ0bkNvbG9yID0gJyNGRkZGRkYnO1xuZXhwb3J0IGNvbnN0IG5lZ2F0aXZlQnRuQWN0Q29sb3IgPSAnI0ZGRkZGRic7XG5cbmV4cG9ydCBjb25zdCBmbG9hdGluZ0J0bkJnZCA9ICcjMjkzMjNDJztcbmV4cG9ydCBjb25zdCBmbG9hdGluZ0J0bkFjdEJnZCA9ICcjM0E0NTUyJztcbmV4cG9ydCBjb25zdCBmbG9hdGluZ0J0bkJnZEhvdmVyID0gJyMzQTQ1NTInO1xuZXhwb3J0IGNvbnN0IGZsb2F0aW5nQnRuQ29sb3IgPSBzdWJ0ZXh0Q29sb3I7XG5leHBvcnQgY29uc3QgZmxvYXRpbmdCdG5BY3RDb2xvciA9IHN1YnRleHRDb2xvckFjdGl2ZTtcblxuLy8gSW5wdXRcbmV4cG9ydCBjb25zdCBpbnB1dEJveEhlaWdodCA9ICczNHB4JztcbmV4cG9ydCBjb25zdCBpbnB1dEJveEhlaWdodFNtYWxsID0gJzI0cHgnO1xuZXhwb3J0IGNvbnN0IGlucHV0Qm94SGVpZ2h0VGlueSA9ICcxOHB4JztcbmV4cG9ydCBjb25zdCBpbnB1dFBhZGRpbmcgPSAnNHB4IDEwcHgnO1xuZXhwb3J0IGNvbnN0IGlucHV0UGFkZGluZ1NtYWxsID0gJzRweCA2cHgnO1xuZXhwb3J0IGNvbnN0IGlucHV0UGFkZGluZ1RpbnkgPSAnMnB4IDRweCc7XG5leHBvcnQgY29uc3QgaW5wdXRGb250U2l6ZSA9ICcxMXB4JztcbmV4cG9ydCBjb25zdCBpbnB1dEZvbnRTaXplU21hbGwgPSAnMTBweCc7XG5leHBvcnQgY29uc3QgaW5wdXRGb250V2VpZ2h0ID0gNTAwO1xuZXhwb3J0IGNvbnN0IGlucHV0QmdkID0gJyMyOTMyM0MnO1xuZXhwb3J0IGNvbnN0IGlucHV0QmdkSG92ZXIgPSAnIzNBNDE0Qyc7XG5leHBvcnQgY29uc3QgaW5wdXRCZ2RBY3RpdmUgPSAnIzNBNDE0Qyc7XG5leHBvcnQgY29uc3QgaW5wdXRCb3JkZXJDb2xvciA9ICcjMjkzMjNDJztcbmV4cG9ydCBjb25zdCBpbnB1dEJvcmRlckhvdmVyQ29sb3IgPSAnIzNBNDE0Qyc7XG5leHBvcnQgY29uc3QgaW5wdXRCb3JkZXJBY3RpdmVDb2xvciA9ICcjRDNEOEUwJztcbmV4cG9ydCBjb25zdCBpbnB1dENvbG9yID0gJyNBMEE3QjQnO1xuZXhwb3J0IGNvbnN0IGlucHV0Qm9yZGVyUmFkaXVzID0gJzFweCc7XG5leHBvcnQgY29uc3QgaW5wdXRQbGFjZWhvbGRlckNvbG9yID0gJyM2QTc0ODUnO1xuZXhwb3J0IGNvbnN0IGlucHV0UGxhY2Vob2xkZXJGb250V2VpZ2h0ID0gNDAwO1xuXG5leHBvcnQgY29uc3Qgc2Vjb25kYXJ5SW5wdXRCZ2QgPSAnIzI0MjczMCc7XG5leHBvcnQgY29uc3Qgc2Vjb25kYXJ5SW5wdXRCZ2RIb3ZlciA9ICcjM0E0MTRDJztcbmV4cG9ydCBjb25zdCBzZWNvbmRhcnlJbnB1dEJnZEFjdGl2ZSA9ICcjM0E0MTRDJztcbmV4cG9ydCBjb25zdCBzZWNvbmRhcnlJbnB1dENvbG9yID0gJyNBMEE3QjQnO1xuZXhwb3J0IGNvbnN0IHNlY29uZGFyeUlucHV0Qm9yZGVyQ29sb3IgPSAnIzI0MjczMCc7XG5leHBvcnQgY29uc3Qgc2Vjb25kYXJ5SW5wdXRCb3JkZXJBY3RpdmVDb2xvciA9ICcjRDNEOEUwJztcblxuLy8gU2VsZWN0XG5leHBvcnQgY29uc3Qgc2VsZWN0Q29sb3IgPSBpbnB1dENvbG9yO1xuZXhwb3J0IGNvbnN0IHNlbGVjdENvbG9yTFQgPSB0aXRsZUNvbG9yTFQ7XG5cbmV4cG9ydCBjb25zdCBzZWxlY3RBY3RpdmVCb3JkZXJDb2xvciA9ICcjRDNEOEUwJztcbmV4cG9ydCBjb25zdCBzZWxlY3RGb250U2l6ZSA9ICcxMXB4JztcbmV4cG9ydCBjb25zdCBzZWxlY3RGb250V2VpZ2h0ID0gJzQwMCc7XG5leHBvcnQgY29uc3Qgc2VsZWN0Rm9udFdlaWdodEJvbGQgPSAnNTAwJztcblxuZXhwb3J0IGNvbnN0IHNlbGVjdENvbG9yUGxhY2VIb2xkZXIgPSAnIzZBNzQ4NSc7XG5leHBvcnQgY29uc3Qgc2VsZWN0QmFja2dyb3VuZCA9IGlucHV0QmdkO1xuZXhwb3J0IGNvbnN0IHNlbGVjdEJhY2tncm91bmRIb3ZlciA9IGlucHV0QmdkSG92ZXI7XG5leHBvcnQgY29uc3Qgc2VsZWN0QmFja2dyb3VuZExUID0gJyNGRkZGRkYnO1xuZXhwb3J0IGNvbnN0IHNlbGVjdEJhY2tncm91bmRIb3ZlckxUID0gJyNGOEY4RjknO1xuZXhwb3J0IGNvbnN0IHNlbGVjdEJvcmRlckNvbG9yID0gJyNEM0Q4RTAnO1xuZXhwb3J0IGNvbnN0IHNlbGVjdEJvcmRlckNvbG9yTFQgPSAnI0QzRDhFMCc7XG5leHBvcnQgY29uc3Qgc2VsZWN0Qm9yZGVyUmFkaXVzID0gJzFweCc7XG5leHBvcnQgY29uc3Qgc2VsZWN0Qm9yZGVyID0gMDtcblxuZXhwb3J0IGNvbnN0IGRyb3Bkb3duTGlzdEhpZ2hsaWdodEJnID0gJyM2QTc0ODUnO1xuZXhwb3J0IGNvbnN0IGRyb3Bkb3duTGlzdEhpZ2hsaWdodEJnTFQgPSAnI0Y4RjhGOSc7XG5leHBvcnQgY29uc3QgZHJvcGRvd25MaXN0U2hhZG93ID0gJzAgNnB4IDEycHggMCByZ2JhKDAsMCwwLDAuMTYpJztcbmV4cG9ydCBjb25zdCBkcm9wZG93bkxpc3RCZ2QgPSAnIzNBNDE0Qyc7XG5leHBvcnQgY29uc3QgZHJvcGRvd25MaXN0QmdkTFQgPSAnI0ZGRkZGRic7XG5leHBvcnQgY29uc3QgZHJvcGRvd25MaXN0Qm9yZGVyVG9wID0gJyMyNDI3MzAnO1xuZXhwb3J0IGNvbnN0IGRyb3Bkb3duTGlzdEJvcmRlclRvcExUID0gJyNEM0Q4RTAnO1xuZXhwb3J0IGNvbnN0IGRyb3Bkb3duV3JhcHBlclogPSAxMDA7XG4vLyBTd2l0Y2hcbmV4cG9ydCBjb25zdCBzd2l0Y2hXaWR0aCA9IDI0O1xuZXhwb3J0IGNvbnN0IHN3aXRjaEhlaWdodCA9IDEyO1xuZXhwb3J0IGNvbnN0IHN3aXRjaExhYmVsTWFyZ2luID0gMTI7XG5cbmV4cG9ydCBjb25zdCBzd2l0Y2hUcmFja0JnZCA9ICcjMjkzMjNDJztcbmV4cG9ydCBjb25zdCBzd2l0Y2hUcmFja0JnZEFjdGl2ZSA9IGFjdGl2ZUNvbG9yO1xuZXhwb3J0IGNvbnN0IHN3aXRjaFRyYWNrQm9yZGVyUmFkaXVzID0gJzFweCc7XG5leHBvcnQgY29uc3Qgc3dpdGNoQnRuQmdkID0gJyM2QTc0ODUnO1xuZXhwb3J0IGNvbnN0IHN3aXRjaEJ0bkJnZEFjdGl2ZSA9ICcjRDNEOEUwJztcbmV4cG9ydCBjb25zdCBzd2l0Y2hCdG5Cb3hTaGFkb3cgPSAnMCAycHggNHB4IDAgcmdiYSgwLDAsMCwwLjQwKSc7XG5leHBvcnQgY29uc3Qgc3dpdGNoQnRuQm9yZGVyUmFkaXVzID0gJzAnO1xuZXhwb3J0IGNvbnN0IHN3aXRjaEJ0bldpZHRoID0gJzEycHgnO1xuZXhwb3J0IGNvbnN0IHN3aXRjaEJ0bkhlaWdodCA9ICcxMnB4JztcblxuZXhwb3J0IGNvbnN0IHNlY29uZGFyeVN3aXRjaFRyYWNrQmdkID0gJyMyNDI3MzAnO1xuZXhwb3J0IGNvbnN0IHNlY29uZGFyeVN3aXRjaEJ0bkJnZCA9ICcjM0E0MTRDJztcblxuLy8gQ2hlY2tib3hcbmV4cG9ydCBjb25zdCBjaGVja2JveFdpZHRoID0gMTY7XG5leHBvcnQgY29uc3QgY2hlY2tib3hIZWlnaHQgPSAxNjtcbmV4cG9ydCBjb25zdCBjaGVja2JveE1hcmdpbiA9IDEyO1xuZXhwb3J0IGNvbnN0IGNoZWNrYm94Qm9yZGVyQ29sb3IgPSBzZWxlY3RCb3JkZXJDb2xvcjtcbmV4cG9ydCBjb25zdCBjaGVja2JveEJvcmRlclJhZGl1cyA9ICcycHgnO1xuZXhwb3J0IGNvbnN0IGNoZWNrYm94Qm9yZGVyQ29sb3JMVCA9IHNlbGVjdEJvcmRlckNvbG9yTFQ7XG5leHBvcnQgY29uc3QgY2hlY2tib3hCb3hCZ2QgPSAnd2hpdGUnO1xuZXhwb3J0IGNvbnN0IGNoZWNrYm94Qm94QmdkQ2hlY2tlZCA9IHByaW1hcnlCdG5CZ2Q7XG5cbi8vIFNpZGUgUGFuZWxcbmV4cG9ydCBjb25zdCBzaWRlUGFuZWxIZWFkZXJCZyA9ICcjMjkzMjNDJztcbmV4cG9ydCBjb25zdCBzaWRlUGFuZWxJbm5lclBhZGRpbmcgPSAxNjtcbmV4cG9ydCBjb25zdCBzaWRlUGFuZWxCZyA9ICcjMjQyNzMwJztcbmV4cG9ydCBjb25zdCBzaWRlUGFuZWxTY3JvbGxCYXJXaWR0aCA9IDEwO1xuZXhwb3J0IGNvbnN0IHNpZGVQYW5lbFNjcm9sbEJhckhlaWdodCA9IDEwO1xuZXhwb3J0IGNvbnN0IHNpZGVCYXJDbG9zZUJ0bkJnZCA9IHNlY29uZGFyeUJ0bkJnZDtcbmV4cG9ydCBjb25zdCBzaWRlQmFyQ2xvc2VCdG5Db2xvciA9ICcjMjkzMjNDJztcbmV4cG9ydCBjb25zdCBzaWRlQmFyQ2xvc2VCdG5CZ2RIb3ZlciA9IHNlY29uZGFyeUJ0bkFjdEJnZDtcblxuZXhwb3J0IGNvbnN0IHBhbmVsQmFja2dyb3VuZCA9ICcjMjkzMjNDJztcbmV4cG9ydCBjb25zdCBwYW5lbEJhY2tncm91bmRIb3ZlciA9ICcjM0E0NTUyJztcbmV4cG9ydCBjb25zdCBwYW5lbEFjdGl2ZUJnID0gJyMzQTQ1NTInO1xuZXhwb3J0IGNvbnN0IHBhbmVsQWN0aXZlQmdMVCA9ICcjNkE3NDg1JztcbmV4cG9ydCBjb25zdCBwYW5lbEhlYWRlckljb24gPSAnIzZBNzQ4NSc7XG5leHBvcnQgY29uc3QgcGFuZWxIZWFkZXJJY29uQWN0aXZlID0gJyNBMEE3QjQnO1xuZXhwb3J0IGNvbnN0IHBhbmVsSGVhZGVySGVpZ2h0ID0gNDg7XG5leHBvcnQgY29uc3QgcGFuZWxCb3hTaGFkb3cgPSAnMCA2cHggMTJweCAwIHJnYmEoMCwwLDAsMC4xNiknO1xuZXhwb3J0IGNvbnN0IHBhbmVsQm9yZGVyUmFkaXVzID0gJzJweCc7XG5leHBvcnQgY29uc3QgcGFuZWxCYWNrZ3JvdW5kTFQgPSAnI0Y4RjhGOSc7XG5cbmV4cG9ydCBjb25zdCBwYW5lbEJvcmRlckNvbG9yID0gJyMzQTQxNEMnO1xuZXhwb3J0IGNvbnN0IHBhbmVsQm9yZGVyID0gYDFweCBzb2xpZCAke2JvcmRlckNvbG9yfWA7XG5leHBvcnQgY29uc3QgcGFuZWxCb3JkZXJMVCA9IGAxcHggc29saWQgJHtib3JkZXJDb2xvckxUfWA7XG5cbmV4cG9ydCBjb25zdCBtYXBQYW5lbEJhY2tncm91bmRDb2xvciA9ICcjMjQyNzMwJztcbmV4cG9ydCBjb25zdCBtYXBQYW5lbEhlYWRlckJhY2tncm91bmRDb2xvciA9ICcjMjkzMjNDJztcbmV4cG9ydCBjb25zdCB0b29sdGlwQmcgPSAnI0Y4RjhGOSc7XG5leHBvcnQgY29uc3QgdG9vbHRpcENvbG9yID0gJyMzMzMzMzQnO1xuXG4vLyBCb3R0b20gUGFuZWxcbmV4cG9ydCBjb25zdCBib3R0b21Jbm5lclBkU2lkZSA9IDMyO1xuZXhwb3J0IGNvbnN0IGJvdHRvbUlubmVyUGRWZXJ0ID0gNjtcbmV4cG9ydCBjb25zdCBib3R0b21QYW5lbEdhcCA9IDIwO1xuZXhwb3J0IGNvbnN0IGJvdHRvbVdpZGdldFBhZGRpbmdUb3AgPSAyMDtcbmV4cG9ydCBjb25zdCBib3R0b21XaWRnZXRQYWRkaW5nUmlnaHQgPSAyMDtcbmV4cG9ydCBjb25zdCBib3R0b21XaWRnZXRQYWRkaW5nQm90dG9tID0gMzA7XG5leHBvcnQgY29uc3QgYm90dG9tV2lkZ2V0UGFkZGluZ0xlZnQgPSAyMDtcblxuLy8gTW9kYWxcbmV4cG9ydCBjb25zdCBtb2RhbFRpdGxlQ29sb3IgPSAnIzNBNDE0Qyc7XG5leHBvcnQgY29uc3QgbW9kYWxUaXRsZUZvbnRTaXplID0gJzI0cHgnO1xuZXhwb3J0IGNvbnN0IG1vZGFsVGl0bGVGb250U2l6ZVNtYWxsZXIgPSAnMThweCc7XG5leHBvcnQgY29uc3QgbW9kYWxGb290ZXJCZ2QgPSAnI0Y4RjhGOSc7XG5leHBvcnQgY29uc3QgbW9kYWxJbWFnZVBsYWNlSG9sZGVyID0gJyNERERGRTMnO1xuZXhwb3J0IGNvbnN0IG1vZGFsUGFkZGluZyA9ICcxMHB4IDAnO1xuZXhwb3J0IGNvbnN0IG1vZGFsTGF0ZXJhbFBhZGRpbmcgPSAnNzJweCc7XG5leHBvcnQgY29uc3QgbW9kYWxQb3J0YWJsZUxhdGVyYWxQYWRkaW5nID0gJzM2cHgnO1xuXG5leHBvcnQgY29uc3QgbW9kYWxPdmVyTGF5WiA9IDEwMDE7XG5leHBvcnQgY29uc3QgbW9kYWxPdmVybGF5QmdkID0gJ3JnYmEoMCwgMCwgMCwgMC41KSc7XG5leHBvcnQgY29uc3QgbW9kYWxDb250ZW50WiA9IDEwMDAyO1xuZXhwb3J0IGNvbnN0IG1vZGFsRm9vdGVyWiA9IDEwMDAxO1xuZXhwb3J0IGNvbnN0IG1vZGFsVGl0bGVaID0gMTAwMDM7XG5leHBvcnQgY29uc3QgbW9kYWxCdXR0b25aID0gMTAwMDU7XG5leHBvcnQgY29uc3QgbW9kYWxEcm9wZG93bkJhY2tncm91bmQgPSAnI0ZGRkZGRic7XG5cbi8vIE1vZGFsIERpYWxvZyAoRGFyaylcbmV4cG9ydCBjb25zdCBtb2RhbERpYWxvZ0JnZCA9ICcjM0E0MTRDJztcbmV4cG9ydCBjb25zdCBtb2RhbERpYWxvZ0NvbG9yID0gdGV4dENvbG9ySGw7XG5cbi8vIFNsaWRlclxuZXhwb3J0IGNvbnN0IHNsaWRlckJhckNvbG9yID0gJyM2QTc0ODUnO1xuZXhwb3J0IGNvbnN0IHNsaWRlckJhckJnZCA9ICcjM0E0MTRDJztcbmV4cG9ydCBjb25zdCBzbGlkZXJCYXJIb3ZlckNvbG9yID0gJyNEM0Q4RTAnO1xuZXhwb3J0IGNvbnN0IHNsaWRlckJhclJhZGl1cyA9ICcxcHgnO1xuZXhwb3J0IGNvbnN0IHNsaWRlckJhckhlaWdodCA9IDQ7XG5leHBvcnQgY29uc3Qgc2xpZGVySGFuZGxlSGVpZ2h0ID0gMTI7XG5leHBvcnQgY29uc3Qgc2xpZGVySGFuZGxlV2lkdGggPSAxMjtcbmV4cG9ydCBjb25zdCBzbGlkZXJIYW5kbGVDb2xvciA9ICcjRDNEOEUwJztcbmV4cG9ydCBjb25zdCBzbGlkZXJIYW5kbGVIb3ZlckNvbG9yID0gJyNGRkZGRkYnO1xuZXhwb3J0IGNvbnN0IHNsaWRlckhhbmRsZVNoYWRvdyA9ICcwIDJweCA0cHggMCByZ2JhKDAsMCwwLDAuNDApJztcbmV4cG9ydCBjb25zdCBzbGlkZXJJbnB1dEhlaWdodCA9IDI0O1xuZXhwb3J0IGNvbnN0IHNsaWRlcklucHV0V2lkdGggPSA1NjtcbmV4cG9ydCBjb25zdCBzbGlkZXJNYXJnaW5Ub3BJc1JhbmdlID0gMDtcbmV4cG9ydCBjb25zdCBzbGlkZXJNYXJnaW5Ub3AgPSAxMjtcblxuLy8gUGxvdFxuZXhwb3J0IGNvbnN0IHJhbmdlQnJ1c2hCZ2QgPSAnIzNBNDE0Qyc7XG5leHBvcnQgY29uc3QgaGlzdG9ncmFtRmlsbEluUmFuZ2UgPSBhY3RpdmVDb2xvcjtcbmV4cG9ydCBjb25zdCBoaXN0b2dyYW1GaWxsT3V0UmFuZ2UgPSBzbGlkZXJCYXJDb2xvcjtcblxuLy8gTm90aWZpY2F0aW9uXG5leHBvcnQgY29uc3Qgbm90aWZpY2F0aW9uQ29sb3JzID0ge1xuICBpbmZvOiAnIzI3NmVmMScsXG4gIGVycm9yOiAnI2YyNTEzOCcsXG4gIHN1Y2Nlc3M6ICcjNDdiMjc1JyxcbiAgd2FybmluZzogJyNmZmMwNDMnXG59O1xuXG5leHBvcnQgY29uc3Qgbm90aWZpY2F0aW9uUGFuZWxXaWR0aCA9IDI0MDtcbmV4cG9ydCBjb25zdCBub3RpZmljYXRpb25QYW5lbEl0ZW1XaWR0aCA9IG5vdGlmaWNhdGlvblBhbmVsV2lkdGggLSA2MDtcbmV4cG9ydCBjb25zdCBub3RpZmljYXRpb25QYW5lbEl0ZW1IZWlnaHQgPSA2MDtcblxuLy8gRGF0YSBUYWJsZVxuY29uc3QgaGVhZGVyUm93SGVpZ2h0ID0gNzA7XG5jb25zdCByb3dIZWlnaHQgPSAzMjtcbmNvbnN0IGhlYWRlclBhZGRpbmdUb3AgPSA2O1xuY29uc3QgaGVhZGVyUGFkZGluZ0JvdHRvbSA9IDg7XG5jb25zdCBjZWxsUGFkZGluZ1NpZGUgPSAxMDtcbmNvbnN0IGVkZ2VDZWxsUGFkZGluZ1NpZGUgPSAxMDtcbmNvbnN0IGNlbGxGb250U2l6ZSA9IDEwO1xuY29uc3QgZ3JpZFBhZGRpbmdTaWRlID0gMjQ7XG5jb25zdCBoZWFkZXJDZWxsQmFja2dyb3VuZCA9ICcjRkZGRkZGJztcbmNvbnN0IGhlYWRlckNlbGxCb3JkZXJDb2xvciA9ICcjRTBFMEUwJztcbmNvbnN0IGhlYWRlckNlbGxJY29uQ29sb3IgPSAnIzY2NjY2Nic7XG5jb25zdCBjZWxsQm9yZGVyQ29sb3IgPSAnI0UwRTBFMCc7XG5jb25zdCBldmVuUm93QmFja2dyb3VuZCA9ICcjRkZGRkZGJztcbmNvbnN0IG9kZFJvd0JhY2tncm91bmQgPSAnI0Y3RjdGNyc7XG5jb25zdCBvcHRpb25CdXR0b25Db2xvciA9ICcjNkE3NDg1JztcbmNvbnN0IHBpbm5lZEdyaWRCb3JkZXJDb2xvciA9ICcjRTBFMEUwJztcblxuLy8gRmxvYXRpbmcgVGltZSBkaXNwbGF5XG5jb25zdCB0aW1lRGlzcGxheUJvcmRlclJhZGl1cyA9IDMyO1xuY29uc3QgdGltZURpc3BsYXlIZWlnaHQgPSA2NDtcbmNvbnN0IHRpbWVEaXNwbGF5TWluV2lkdGggPSAxNzY7XG5jb25zdCB0aW1lRGlzcGxheU9wYWNpdHkgPSAwLjg7XG5jb25zdCB0aW1lRGlzcGxheVBhZGRpbmcgPSAnMCAyNHB4JztcblxuLy8gRXhwb3J0IG1hcCBtb2RhbFxuY29uc3QgZXhwb3J0SW50cmFTZWN0aW9uTWFyZ2luID0gJzgnO1xuXG4vLyBBY3Rpb24gUGFuZWxcbmV4cG9ydCBjb25zdCBhY3Rpb25QYW5lbFdpZHRoID0gMTEwO1xuZXhwb3J0IGNvbnN0IGFjdGlvblBhbmVsSGVpZ2h0ID0gMzI7XG5cbmV4cG9ydCBjb25zdCB0ZXh0VHJ1bmNhdGUgPSB7XG4gIG1heFdpZHRoOiAnMTAwJScsXG4gIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgdGV4dE92ZXJmbG93OiAnZWxsaXBzaXMnLFxuICB3aGl0ZVNwYWNlOiAnbm93cmFwJyxcbiAgd29yZFdyYXA6ICdub3JtYWwnXG59O1xuXG4vLyBUaGlzIGJyZWFrcG9pbnRzIGFyZSB1c2VkIGZvciByZXNwb25zaXZlIGRlc2lnblxuZXhwb3J0IGNvbnN0IGJyZWFrUG9pbnRzID0ge1xuICBwYWxtOiA1ODgsXG4gIGRlc2s6IDc2OFxufTtcblxuLy8gdGhlbWUgaXMgcGFzc2VkIHRvIGtlcGxlci5nbCB3aGVuIGl0J3MgbW91bnRlZCxcbi8vIGl0IGlzIHVzZWQgYnkgc3R5bGVkLWNvbXBvbmVudHMgdG8gcGFzcyBhbG9uZyB0b1xuLy8gYWxsIGNoaWxkIGNvbXBvbmVudHNcblxuY29uc3QgaW5wdXQgPSBjc3NgXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaW5wdXRCZ2R9O1xuICBib3JkZXI6IDFweCBzb2xpZFxuICAgICR7cHJvcHMgPT5cbiAgICAgIHByb3BzLmFjdGl2ZVxuICAgICAgICA/IHByb3BzLnRoZW1lLmlucHV0Qm9yZGVyQWN0aXZlQ29sb3JcbiAgICAgICAgOiBwcm9wcy5lcnJvclxuICAgICAgICA/IHByb3BzLnRoZW1lLmVycm9yQ29sb3JcbiAgICAgICAgOiBwcm9wcy50aGVtZS5pbnB1dEJnZH07XG4gIGJvcmRlci1yYWRpdXM6IDJweDtcbiAgY2FyZXQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaW5wdXRCb3JkZXJBY3RpdmVDb2xvcn07XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmlucHV0Q29sb3J9O1xuICBkaXNwbGF5OiBmbGV4O1xuICBmb250LXNpemU6ICR7cHJvcHMgPT5cbiAgICBbJ3NtYWxsJywgJ3RpbnknXS5pbmNsdWRlcyhwcm9wcy5zaXplKVxuICAgICAgPyBwcm9wcy50aGVtZS5pbnB1dEZvbnRTaXplU21hbGxcbiAgICAgIDogcHJvcHMudGhlbWUuaW5wdXRGb250U2l6ZX07XG4gIGZvbnQtd2VpZ2h0OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmlucHV0Rm9udFdlaWdodH07XG4gIGhlaWdodDogJHtwcm9wcyA9PlxuICAgIHByb3BzLnNpemUgPT09ICdzbWFsbCdcbiAgICAgID8gcHJvcHMudGhlbWUuaW5wdXRCb3hIZWlnaHRTbWFsbFxuICAgICAgOiBwcm9wcy5zaXplID09PSAndGlueSdcbiAgICAgID8gcHJvcHMudGhlbWUuaW5wdXRCb3hIZWlnaHRUaW55XG4gICAgICA6IHByb3BzLnRoZW1lLmlucHV0Qm94SGVpZ2h0fTtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBvdXRsaW5lOiBub25lO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBwYWRkaW5nOiAke3Byb3BzID0+XG4gICAgcHJvcHMuc2l6ZSA9PT0gJ3NtYWxsJ1xuICAgICAgPyBwcm9wcy50aGVtZS5pbnB1dFBhZGRpbmdTbWFsbFxuICAgICAgOiBwcm9wcy5zaXplID09PSAndGlueSdcbiAgICAgID8gcHJvcHMudGhlbWUuaW5wdXRQYWRkaW5nVGlueVxuICAgICAgOiBwcm9wcy50aGVtZS5pbnB1dFBhZGRpbmd9O1xuICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbiAgdHJhbnNpdGlvbjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50cmFuc2l0aW9ufTtcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgd2lkdGg6IDEwMCU7XG4gIHdvcmQtd3JhcDogbm9ybWFsO1xuICBwb2ludGVyLWV2ZW50czogJHtwcm9wcyA9PiAocHJvcHMuZGlzYWJsZWQgPyAnbm9uZScgOiAnYWxsJyl9O1xuICBvcGFjaXR5OiAke3Byb3BzID0+IChwcm9wcy5kaXNhYmxlZCA/IDAuNSA6IDEpfTtcblxuICA6aG92ZXIge1xuICAgIGN1cnNvcjogJHtwcm9wcyA9PiAocHJvcHMudHlwZSA9PT0gJ251bWJlcicgPyAndGV4dCcgOiAncG9pbnRlcicpfTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+XG4gICAgICBwcm9wcy5hY3RpdmUgPyBwcm9wcy50aGVtZS5pbnB1dEJnZEFjdGl2ZSA6IHByb3BzLnRoZW1lLmlucHV0QmdkSG92ZXJ9O1xuICAgIGJvcmRlci1jb2xvcjogJHtwcm9wcyA9PlxuICAgICAgcHJvcHMuYWN0aXZlID8gcHJvcHMudGhlbWUuaW5wdXRCb3JkZXJBY3RpdmVDb2xvciA6IHByb3BzLnRoZW1lLmlucHV0Qm9yZGVySG92ZXJDb2xvcn07XG4gIH1cblxuICA6YWN0aXZlLFxuICA6Zm9jdXMsXG4gICYuZm9jdXMsXG4gICYuYWN0aXZlIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmlucHV0QmdkQWN0aXZlfTtcbiAgICBib3JkZXItY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaW5wdXRCb3JkZXJBY3RpdmVDb2xvcn07XG4gIH1cblxuICA6OnBsYWNlaG9sZGVyIHtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5pbnB1dFBsYWNlaG9sZGVyQ29sb3J9O1xuICAgIGZvbnQtd2VpZ2h0OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmlucHV0UGxhY2Vob2xkZXJGb250V2VpZ2h0fTtcbiAgfVxuXG4gIC8qIERpc2FibGUgQXJyb3dzIG9uIE51bWJlciBJbnB1dHMgKi9cbiAgOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxuICA6Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b24ge1xuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcbiAgICBtYXJnaW46IDA7XG4gIH1cbmA7XG5cbmNvbnN0IGlucHV0TFQgPSBjc3NgXG4gICR7aW5wdXR9XG5cbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWxlY3RCYWNrZ3JvdW5kTFR9O1xuICBib3JkZXI6IDFweCBzb2xpZFxuICAke3Byb3BzID0+XG4gICAgcHJvcHMuYWN0aXZlXG4gICAgICA/IHByb3BzLnRoZW1lLnNlbGVjdEFjdGl2ZUJvcmRlckNvbG9yXG4gICAgICA6IHByb3BzLmVycm9yXG4gICAgICA/IHByb3BzLnRoZW1lLmVycm9yQ29sb3JcbiAgICAgIDogcHJvcHMudGhlbWUuc2VsZWN0Qm9yZGVyQ29sb3JMVH07XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlbGVjdENvbG9yTFR9O1xuICBjYXJldC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWxlY3RDb2xvckxUfTtcblxuICA6Oi13ZWJraXQtaW5wdXQtcGxhY2Vob2xkZXIge1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnN1YnRleHRDb2xvckxUfTtcbiAgICBmb250LXdlaWdodDogNDAwO1xuICB9XG5cbiAgOmFjdGl2ZSxcbiAgOmZvY3VzLFxuICAmLmZvY3VzLFxuICAmLmFjdGl2ZSB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWxlY3RCYWNrZ3JvdW5kTFR9O1xuICAgIGJvcmRlci1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JMVH07XG4gIH1cblxuICA6aG92ZXIge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2VsZWN0QmFja2dyb3VuZExUfTtcbiAgICBjdXJzb3I6ICR7cHJvcHMgPT4gKFsnbnVtYmVyJywgJ3RleHQnXS5pbmNsdWRlcyhwcm9wcy50eXBlKSA/ICd0ZXh0JyA6ICdwb2ludGVyJyl9O1xuICAgIGJvcmRlci1jb2xvcjogJHtwcm9wcyA9PiAocHJvcHMuYWN0aXZlID8gcHJvcHMudGhlbWUudGV4dENvbG9yTFQgOiBwcm9wcy50aGVtZS5zdWJ0ZXh0Q29sb3IpfTtcbiAgfVxuYDtcblxuY29uc3Qgc2Vjb25kYXJ5SW5wdXQgPSBjc3NgXG4gICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaW5wdXR9XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlY29uZGFyeUlucHV0Q29sb3J9O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlY29uZGFyeUlucHV0QmdkfTtcbiAgYm9yZGVyOiAxcHggc29saWRcbiAgICAke3Byb3BzID0+IChwcm9wcy5lcnJvciA/IHByb3BzLnRoZW1lLmVycm9yQ29sb3IgOiBwcm9wcy50aGVtZS5zZWNvbmRhcnlJbnB1dEJvcmRlckNvbG9yKX07XG5cbiAgOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWNvbmRhcnlJbnB1dEJnZEhvdmVyfTtcbiAgICBib3JkZXItY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2Vjb25kYXJ5SW5wdXRCZ2RIb3Zlcn07XG4gIH1cblxuICA6YWN0aXZlLFxuICAmLmFjdGl2ZSB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWNvbmRhcnlJbnB1dEJnZEFjdGl2ZX07XG4gICAgYm9yZGVyLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlY29uZGFyeUlucHV0Qm9yZGVyQWN0aXZlQ29sb3J9O1xuICB9XG5gO1xuXG5jb25zdCBjaGlja2xldGVkSW5wdXRDb250YWluZXIgPSBjc3NgXG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgZmxleC13cmFwOiB3cmFwO1xuICBoZWlnaHQ6IGF1dG87XG4gIGp1c3RpZnktY29udGVudDogc3RhcnQ7XG4gIG1hcmdpbi1ib3R0b206IDJweDtcbiAgcGFkZGluZzogMHB4IDdweCAwcHggNHB4O1xuICB3aGl0ZS1zcGFjZTogbm9ybWFsO1xuXG4gIC5jaGlja2xldGVkLWlucHV0X19wbGFjZWhvbGRlciB7XG4gICAgbGluZS1oZWlnaHQ6IDI0cHg7XG4gICAgbWFyZ2luOiA0cHg7XG4gIH1cbmA7XG5cbmNvbnN0IGNoaWNrbGV0ZWRJbnB1dCA9IGNzc2BcbiAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5pbnB1dH1cbiAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5jaGlja2xldGVkSW5wdXRDb250YWluZXJ9XG5gO1xuXG5jb25zdCBzZWNvbmRhcnlDaGlja2xldGVkSW5wdXQgPSBjc3NgXG4gICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2Vjb25kYXJ5SW5wdXR9XG4gICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuY2hpY2tsZXRlZElucHV0Q29udGFpbmVyfVxuYDtcblxuY29uc3QgaW5saW5lSW5wdXQgPSBjc3NgXG4gICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaW5wdXR9IGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvcn07XG4gIGZvbnQtc2l6ZTogMTNweDtcbiAgbGV0dGVyLXNwYWNpbmc6IDAuNDNweDtcbiAgbGluZS1oZWlnaHQ6IDE4cHg7XG4gIGhlaWdodDogMjRweDtcbiAgZm9udC13ZWlnaHQ6IDQwMDtcbiAgcGFkZGluZy1sZWZ0OiA0cHg7XG4gIG1hcmdpbi1sZWZ0OiAtNHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgYm9yZGVyOiAxcHggc29saWQgdHJhbnNwYXJlbnQ7XG5cbiAgOmhvdmVyIHtcbiAgICBoZWlnaHQ6IDI0cHg7XG4gICAgY3Vyc29yOiB0ZXh0O1xuICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgIGJvcmRlcjogMXB4IHNvbGlkICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGFiZWxDb2xvcn07XG4gIH1cblxuICA6YWN0aXZlLFxuICAuYWN0aXZlLFxuICA6Zm9jdXMge1xuICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgIGJvcmRlcjogMXB4IHNvbGlkICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaW5wdXRCb3JkZXJBY3RpdmVDb2xvcn07XG4gIH1cbmA7XG5cbmNvbnN0IHN3aXRjaFRyYWNrID0gY3NzYFxuICBiYWNrZ3JvdW5kOiAke3Byb3BzID0+XG4gICAgcHJvcHMuY2hlY2tlZCA/IHByb3BzLnRoZW1lLnN3aXRjaFRyYWNrQmdkQWN0aXZlIDogcHJvcHMudGhlbWUuc3dpdGNoVHJhY2tCZ2R9O1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogJHtwcm9wcyA9PiAtcHJvcHMudGhlbWUuc3dpdGNoTGFiZWxNYXJnaW59cHg7XG4gIGNvbnRlbnQ6ICcnO1xuICBkaXNwbGF5OiBibG9jaztcbiAgd2lkdGg6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc3dpdGNoV2lkdGh9cHg7XG4gIGhlaWdodDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zd2l0Y2hIZWlnaHR9cHg7XG4gIGJvcmRlci1yYWRpdXM6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc3dpdGNoVHJhY2tCb3JkZXJSYWRpdXN9O1xuYDtcblxuY29uc3Qgc3dpdGNoQnV0dG9uID0gY3NzYFxuICB0cmFuc2l0aW9uOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRyYW5zaXRpb259O1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogJHtwcm9wcyA9PlxuICAgIChwcm9wcy5jaGVja2VkID8gcHJvcHMudGhlbWUuc3dpdGNoV2lkdGggLyAyIDogLTEpIC0gcHJvcHMudGhlbWUuc3dpdGNoTGFiZWxNYXJnaW59cHg7XG4gIGNvbnRlbnQ6ICcnO1xuICBkaXNwbGF5OiBibG9jaztcbiAgaGVpZ2h0OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnN3aXRjaEJ0bkhlaWdodH07XG4gIHdpZHRoOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnN3aXRjaEJ0bldpZHRofTtcbiAgYmFja2dyb3VuZDogJHtwcm9wcyA9PlxuICAgIHByb3BzLmNoZWNrZWQgPyBwcm9wcy50aGVtZS5zd2l0Y2hCdG5CZ2RBY3RpdmUgOiBwcm9wcy50aGVtZS5zd2l0Y2hCdG5CZ2R9O1xuICBib3gtc2hhZG93OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnN3aXRjaEJ0bkJveFNoYWRvd307XG4gIGJvcmRlci1yYWRpdXM6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc3dpdGNoQnRuQm9yZGVyUmFkaXVzfTtcbmA7XG5cbmNvbnN0IGlucHV0U3dpdGNoID0gY3NzYFxuICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBsaW5lLWhlaWdodDogMTZweDtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgZm9udC1zaXplOiAxMnB4O1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5sYWJlbENvbG9yfTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIHBhZGRpbmctdG9wOiAwO1xuICBwYWRkaW5nLXJpZ2h0OiAwO1xuICBwYWRkaW5nLWJvdHRvbTogMDtcbiAgcGFkZGluZy1sZWZ0OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnN3aXRjaFdpZHRofXB4O1xuXG4gIDpiZWZvcmUge1xuICAgICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc3dpdGNoVHJhY2t9O1xuICB9XG5cbiAgOmFmdGVyIHtcbiAgICAke3Byb3BzID0+IHByb3BzLnRoZW1lLnN3aXRjaEJ1dHRvbn07XG4gIH1cbmA7XG5cbi8vIFRoaXMgaXMgYSBsaWdodCB2ZXJzaW9uIGNoZWNrYm94XG5jb25zdCBjaGVja2JveEJveCA9IGNzc2BcbiAgZGlzcGxheTogYmxvY2s7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICBsZWZ0OiAwO1xuICB3aWR0aDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5jaGVja2JveFdpZHRofXB4O1xuICBoZWlnaHQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuY2hlY2tib3hIZWlnaHR9cHg7XG4gIGJhY2tncm91bmQ6ICR7cHJvcHMgPT5cbiAgICBwcm9wcy5jaGVja2VkID8gcHJvcHMudGhlbWUuY2hlY2tib3hCb3hCZ2RDaGVja2VkIDogcHJvcHMudGhlbWUuY2hlY2tib3hCb3hCZ2R9O1xuICBib3JkZXI6IDFweCBzb2xpZFxuICAgICR7cHJvcHMgPT5cbiAgICAgIHByb3BzLmNoZWNrZWQgPyBwcm9wcy50aGVtZS5jaGVja2JveEJveEJnZENoZWNrZWQgOiBwcm9wcy50aGVtZS5jaGVja2JveEJvcmRlckNvbG9yfTtcbiAgYm9yZGVyLXJhZGl1czogMnB4O1xuICBjb250ZW50OiAnJztcbmA7XG5cbmNvbnN0IGNoZWNrYm94Q2hlY2sgPSBjc3NgXG4gIHdpZHRoOiAxMHB4O1xuICBoZWlnaHQ6IDVweDtcbiAgYm9yZGVyLWJvdHRvbTogMnB4IHNvbGlkIHdoaXRlO1xuICBib3JkZXItbGVmdDogMnB4IHNvbGlkIHdoaXRlO1xuICB0b3A6IDRweDtcbiAgbGVmdDogM3B4O1xuICB0cmFuc2Zvcm06IHJvdGF0ZSgtNDVkZWcpO1xuICBkaXNwbGF5OiBibG9jaztcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBvcGFjaXR5OiAke3Byb3BzID0+IChwcm9wcy5jaGVja2VkID8gMSA6IDApfTtcbiAgY29udGVudDogJyc7XG5gO1xuXG5jb25zdCBpbnB1dENoZWNrYm94ID0gY3NzYFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgcGFkZGluZy1sZWZ0OiAzMnB4O1xuICBtYXJnaW4tYm90dG9tOiAyNHB4O1xuICBsaW5lLWhlaWdodDogMjBweDtcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBmb250LXNpemU6IDEycHg7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmxhYmVsQ29sb3J9O1xuICBtYXJnaW4tbGVmdDogLSR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc3dpdGNoTGFiZWxNYXJnaW59cHg7XG5cbiAgOmJlZm9yZSB7XG4gICAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5jaGVja2JveEJveH07XG4gIH1cblxuICA6YWZ0ZXIge1xuICAgICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuY2hlY2tib3hDaGVja307XG4gIH1cbmA7XG5cbmNvbnN0IHNlY29uZGFyeVN3aXRjaCA9IGNzc2BcbiAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5pbnB1dFN3aXRjaH1cbiAgOmJlZm9yZSB7XG4gICAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zd2l0Y2hUcmFja30gYmFja2dyb3VuZDogJHtwcm9wcyA9PlxuICBwcm9wcy5jaGVja2VkID8gcHJvcHMudGhlbWUuc3dpdGNoVHJhY2tCZ2RBY3RpdmUgOiBwcm9wcy50aGVtZS5zZWNvbmRhcnlTd2l0Y2hUcmFja0JnZH07XG4gIH1cblxuICA6YWZ0ZXIge1xuICAgICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc3dpdGNoQnV0dG9ufVxuICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT5cbiAgICAgIHByb3BzLmNoZWNrZWQgPyBwcm9wcy50aGVtZS5zd2l0Y2hCdG5CZ2RBY3RpdmUgOiBwcm9wcy50aGVtZS5zZWNvbmRhcnlTd2l0Y2hCdG5CZ2R9O1xuICB9XG5gO1xuXG5jb25zdCBkcm9wZG93blNjcm9sbEJhciA9IGNzc2BcbiAgOjotd2Via2l0LXNjcm9sbGJhciB7XG4gICAgaGVpZ2h0OiAxMHB4O1xuICAgIHdpZHRoOiAxMHB4O1xuICB9XG5cbiAgOjotd2Via2l0LXNjcm9sbGJhci1jb3JuZXIge1xuICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZHJvcGRvd25MaXN0QmdkfTtcbiAgfVxuXG4gIDo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2sge1xuICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZHJvcGRvd25MaXN0QmdkfTtcbiAgfVxuXG4gIDo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIge1xuICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XG4gICAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5sYWJlbENvbG9yfTtcbiAgICBib3JkZXI6IDNweCBzb2xpZCAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRyb3Bkb3duTGlzdEJnZH07XG4gIH07XG5cbiAgOnZlcnRpY2FsOmhvdmVyIHtcbiAgICBiYWNrZ3JvdW5kOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckhsfTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gIH1cbn1gO1xuXG5jb25zdCBkcm9wZG93bkxpc3RBbmNob3IgPSBjc3NgXG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlbGVjdENvbG9yfTtcbiAgcGFkZGluZy1sZWZ0OiAzcHg7XG5gO1xuXG5jb25zdCBkcm9wZG93bkxpc3RTaXplID0gY3NzYFxuICBmb250LXNpemU6IDExcHg7XG4gIHBhZGRpbmc6IDNweCA5cHg7XG4gIGZvbnQtd2VpZ2h0OiA1MDA7XG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XG5gO1xuXG5jb25zdCBkcm9wZG93bkxpc3RJdGVtID0gY3NzYFxuICAke2Ryb3Bkb3duTGlzdFNpemV9XG4gICYuaG92ZXIsXG4gICY6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRyb3Bkb3duTGlzdEhpZ2hsaWdodEJnfTtcblxuICAgIC5saXN0X19pdGVtX19hbmNob3Ige1xuICAgICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9ySGx9O1xuICAgIH1cbiAgfVxuYDtcblxuY29uc3QgZHJvcGRvd25MaXN0SXRlbUxUID0gY3NzYFxuICAke2Ryb3Bkb3duTGlzdFNpemV9XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckxUfTtcblxuICAmLmhvdmVyLFxuICAmOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9ySGxMVH07XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5kcm9wZG93bkxpc3RIaWdobGlnaHRCZ0xUfTtcblxuICAgIC5saXN0X19pdGVtX19hbmNob3Ige1xuICAgICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9ySGxMVH07XG4gICAgfVxuICB9XG5gO1xuXG5jb25zdCBkcm9wZG93bkxpc3RIZWFkZXIgPSBjc3NgXG4gIGZvbnQtc2l6ZTogMTFweDtcbiAgcGFkZGluZzogNXB4IDlweDtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGFiZWxDb2xvcn07XG5gO1xuXG5jb25zdCBkcm9wZG93bkxpc3RTZWN0aW9uID0gY3NzYFxuICBwYWRkaW5nOiAwIDAgNHB4IDA7XG4gIG1hcmdpbi1ib3R0b206IDRweDtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGFiZWxDb2xvcn07XG5gO1xuXG5jb25zdCBkcm9wZG93bkxpc3QgPSBjc3NgXG4gIG92ZXJmbG93LXk6IGF1dG87XG4gIG1heC1oZWlnaHQ6IDI4MHB4O1xuICBib3gtc2hhZG93OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRyb3Bkb3duTGlzdFNoYWRvd307XG4gIGJvcmRlci1yYWRpdXM6IDJweDtcblxuICAubGlzdF9fc2VjdGlvbiB7XG4gICAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5kcm9wZG93bkxpc3RTZWN0aW9ufTtcbiAgfVxuICAubGlzdF9faGVhZGVyIHtcbiAgICAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRyb3Bkb3duTGlzdEhlYWRlcn07XG4gIH1cblxuICAubGlzdF9faXRlbSB7XG4gICAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5kcm9wZG93bkxpc3RJdGVtfTtcbiAgfVxuXG4gIC5saXN0X19pdGVtX19hbmNob3Ige1xuICAgICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZHJvcGRvd25MaXN0QW5jaG9yfTtcbiAgfVxuXG4gICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZHJvcGRvd25TY3JvbGxCYXJ9O1xuYDtcblxuY29uc3QgZHJvcGRvd25MaXN0TFQgPSBjc3NgXG4gICR7ZHJvcGRvd25MaXN0fVxuICAubGlzdF9faXRlbSB7XG4gICAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5kcm9wZG93bkxpc3RJdGVtTFR9O1xuICB9XG5gO1xuY29uc3Qgc2lkZVBhbmVsU2Nyb2xsQmFyID0gY3NzYFxuICA6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcbiAgICBoZWlnaHQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2lkZVBhbmVsU2Nyb2xsQmFySGVpZ2h0fXB4O1xuICAgIHdpZHRoOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNpZGVQYW5lbFNjcm9sbEJhcldpZHRofXB4O1xuICB9XG5cbiAgOjotd2Via2l0LXNjcm9sbGJhci1jb3JuZXIge1xuICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2lkZVBhbmVsQmd9O1xuICB9XG5cbiAgOjotd2Via2l0LXNjcm9sbGJhci10cmFjayB7XG4gICAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zaWRlUGFuZWxCZ307XG4gIH1cblxuICA6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcbiAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucGFuZWxCYWNrZ3JvdW5kSG92ZXJ9O1xuICAgIGJvcmRlcjogM3B4IHNvbGlkICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2lkZVBhbmVsQmd9O1xuXG4gICAgOmhvdmVyIHtcbiAgICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGFiZWxDb2xvcn07XG4gICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgfVxuICB9O1xufWA7XG5cbmNvbnN0IHBhbmVsRHJvcGRvd25TY3JvbGxCYXIgPSBjc3NgXG4gIDo6LXdlYmtpdC1zY3JvbGxiYXIge1xuICAgIGhlaWdodDogMTBweDtcbiAgICB3aWR0aDogMTBweDtcbiAgfVxuXG4gIDo6LXdlYmtpdC1zY3JvbGxiYXItY29ybmVyIHtcbiAgICBiYWNrZ3JvdW5kOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsQmFja2dyb3VuZH07XG4gIH1cblxuICA6Oi13ZWJraXQtc2Nyb2xsYmFyLXRyYWNrIHtcbiAgICBiYWNrZ3JvdW5kOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsQmFja2dyb3VuZH07XG4gIH1cblxuICA6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcbiAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucGFuZWxCYWNrZ3JvdW5kSG92ZXJ9O1xuICAgIGJvcmRlcjogM3B4IHNvbGlkICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucGFuZWxCYWNrZ3JvdW5kfTtcbiAgICA6aG92ZXIge1xuICAgICAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5sYWJlbENvbG9yfTtcbiAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICB9XG4gIH1cbmA7XG5cbmNvbnN0IHNjcm9sbEJhciA9IGNzc2BcbiAgOjotd2Via2l0LXNjcm9sbGJhciB7XG4gICAgaGVpZ2h0OiAxMHB4O1xuICAgIHdpZHRoOiAxMHB4O1xuICB9XG5cbiAgOjotd2Via2l0LXNjcm9sbGJhci1jb3JuZXIge1xuICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucGFuZWxCYWNrZ3JvdW5kfTtcbiAgfVxuXG4gIDo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2sge1xuICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucGFuZWxCYWNrZ3JvdW5kfTtcbiAgfVxuXG4gIDo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIge1xuICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XG4gICAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5sYWJlbENvbG9yfTtcbiAgICBib3JkZXI6IDNweCBzb2xpZCAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsQmFja2dyb3VuZH1cblxuICAgIDp2ZXJ0aWNhbDpob3ZlciB7XG4gICAgICBiYWNrZ3JvdW5kOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckhsfTtcbiAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICB9XG5cbiAgICA6aG9yaXpvbnRhbDpob3ZlciB7XG4gICAgICBiYWNrZ3JvdW5kOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckhsfTtcbiAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICB9XG4gIH1cbn1gO1xuXG5leHBvcnQgY29uc3QgbW9kYWxTY3JvbGxCYXIgPSBjc3NgXG4gIDo6LXdlYmtpdC1zY3JvbGxiYXIge1xuICAgIHdpZHRoOiAxNHB4O1xuICAgIGhlaWdodDogMTZweDtcbiAgfVxuXG4gIDo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2sge1xuICAgIGJhY2tncm91bmQ6IHdoaXRlO1xuICB9XG4gIDo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2s6aG9yaXpvbnRhbCB7XG4gICAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbH07XG4gIH1cbiAgOjotd2Via2l0LXNjcm9sbGJhci10aHVtYiB7XG4gICAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5sYWJlbENvbG9yTFR9O1xuICAgIGJvcmRlcjogNHB4IHNvbGlkIHdoaXRlO1xuICB9XG5cbiAgOjotd2Via2l0LXNjcm9sbGJhci1jb3JuZXIge1xuICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9ySGx9O1xuICB9XG5cbiAgOjotd2Via2l0LXNjcm9sbGJhci10aHVtYjpob3ZlciB7XG4gICAgYmFja2dyb3VuZDogIzk2OWRhOTtcbiAgfVxuXG4gIDo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWI6dmVydGljYWwge1xuICAgIGJvcmRlci1yYWRpdXM6IDdweDtcbiAgfVxuXG4gIDo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWI6aG9yaXpvbnRhbCB7XG4gICAgYm9yZGVyLXJhZGl1czogOXB4O1xuICAgIGJvcmRlcjogNHB4IHNvbGlkICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9ySGx9O1xuICB9XG5gO1xuXG5leHBvcnQgY29uc3QgdGhlbWUgPSB7XG4gIC4uLkRJTUVOU0lPTlMsXG4gIC8vIHRlbXBsYXRlc1xuICBpbnB1dCxcbiAgaW5wdXRMVCxcbiAgaW5saW5lSW5wdXQsXG4gIGNoaWNrbGV0ZWRJbnB1dCxcbiAgY2hpY2tsZXRlZElucHV0Q29udGFpbmVyLFxuICBzZWNvbmRhcnlDaGlja2xldGVkSW5wdXQsXG5cbiAgYm9yZGVyQ29sb3IsXG4gIGJvcmRlckNvbG9yTFQsXG5cbiAgc2Vjb25kYXJ5SW5wdXQsXG4gIGRyb3Bkb3duU2Nyb2xsQmFyLFxuICBkcm9wZG93bkxpc3QsXG4gIGRyb3Bkb3duTGlzdExULFxuICBkcm9wZG93bkxpc3RJdGVtLFxuICBkcm9wZG93bkxpc3RJdGVtTFQsXG4gIGRyb3Bkb3duTGlzdEFuY2hvcixcbiAgZHJvcGRvd25MaXN0SGVhZGVyLFxuICBkcm9wZG93bkxpc3RTZWN0aW9uLFxuICBkcm9wZG93bkxpc3RTaGFkb3csXG4gIGRyb3Bkb3duV3JhcHBlclosXG4gIG1vZGFsU2Nyb2xsQmFyLFxuICBzY3JvbGxCYXIsXG4gIHNpZGVQYW5lbFNjcm9sbEJhcixcbiAgaW5wdXRTd2l0Y2gsXG4gIHNlY29uZGFyeVN3aXRjaCxcbiAgc3dpdGNoVHJhY2ssXG4gIHN3aXRjaEJ1dHRvbixcbiAgaW5wdXRDaGVja2JveCxcbiAgY2hlY2tib3hCb3gsXG4gIGNoZWNrYm94Q2hlY2ssXG5cbiAgLy8gVHJhbnNpdGlvbnNcbiAgdHJhbnNpdGlvbixcbiAgdHJhbnNpdGlvbkZhc3QsXG4gIHRyYW5zaXRpb25TbG93LFxuXG4gIC8vIHN0eWxlc1xuICBhY3RpdmVDb2xvcixcbiAgYWN0aXZlQ29sb3JIb3ZlcixcbiAgYm9yZGVyUmFkaXVzLFxuICBib3hTaGFkb3csXG4gIGVycm9yQ29sb3IsXG4gIGRyb3Bkb3duTGlzdEhpZ2hsaWdodEJnLFxuICBkcm9wZG93bkxpc3RIaWdobGlnaHRCZ0xULFxuICBkcm9wZG93bkxpc3RCZ2QsXG4gIGRyb3Bkb3duTGlzdEJnZExULFxuICBkcm9wZG93bkxpc3RCb3JkZXJUb3AsXG4gIGRyb3Bkb3duTGlzdEJvcmRlclRvcExULFxuXG4gIGxhYmVsQ29sb3IsXG4gIGxhYmVsQ29sb3JMVCxcbiAgbGFiZWxIb3ZlckNvbG9yLFxuICBtYXBQYW5lbEJhY2tncm91bmRDb2xvcixcbiAgbWFwUGFuZWxIZWFkZXJCYWNrZ3JvdW5kQ29sb3IsXG5cbiAgLy8gU2VsZWN0XG4gIHNlbGVjdEFjdGl2ZUJvcmRlckNvbG9yLFxuICBzZWxlY3RCYWNrZ3JvdW5kLFxuICBzZWxlY3RCYWNrZ3JvdW5kTFQsXG4gIHNlbGVjdEJhY2tncm91bmRIb3ZlcixcbiAgc2VsZWN0QmFja2dyb3VuZEhvdmVyTFQsXG4gIHNlbGVjdEJvcmRlcixcbiAgc2VsZWN0Qm9yZGVyQ29sb3IsXG4gIHNlbGVjdEJvcmRlclJhZGl1cyxcbiAgc2VsZWN0Qm9yZGVyQ29sb3JMVCxcbiAgc2VsZWN0Q29sb3IsXG4gIHNlbGVjdENvbG9yUGxhY2VIb2xkZXIsXG4gIHNlbGVjdEZvbnRTaXplLFxuICBzZWxlY3RGb250V2VpZ2h0LFxuICBzZWxlY3RDb2xvckxULFxuICBzZWxlY3RGb250V2VpZ2h0Qm9sZCxcblxuICAvLyBJbnB1dFxuICBpbnB1dEJnZCxcbiAgaW5wdXRCZ2RIb3ZlcixcbiAgaW5wdXRCZ2RBY3RpdmUsXG4gIGlucHV0Qm94SGVpZ2h0LFxuICBpbnB1dEJveEhlaWdodFNtYWxsLFxuICBpbnB1dEJveEhlaWdodFRpbnksXG4gIGlucHV0Qm9yZGVyQ29sb3IsXG4gIGlucHV0Qm9yZGVyQWN0aXZlQ29sb3IsXG4gIGlucHV0Qm9yZGVySG92ZXJDb2xvcixcbiAgaW5wdXRCb3JkZXJSYWRpdXMsXG4gIGlucHV0Q29sb3IsXG4gIGlucHV0UGFkZGluZyxcbiAgaW5wdXRQYWRkaW5nU21hbGwsXG4gIGlucHV0UGFkZGluZ1RpbnksXG4gIGlucHV0Rm9udFNpemUsXG4gIGlucHV0Rm9udFNpemVTbWFsbCxcbiAgaW5wdXRGb250V2VpZ2h0LFxuICBpbnB1dFBsYWNlaG9sZGVyQ29sb3IsXG4gIGlucHV0UGxhY2Vob2xkZXJGb250V2VpZ2h0LFxuXG4gIHNlY29uZGFyeUlucHV0QmdkLFxuICBzZWNvbmRhcnlJbnB1dEJnZEhvdmVyLFxuICBzZWNvbmRhcnlJbnB1dEJnZEFjdGl2ZSxcbiAgc2Vjb25kYXJ5SW5wdXRDb2xvcixcbiAgc2Vjb25kYXJ5SW5wdXRCb3JkZXJDb2xvcixcbiAgc2Vjb25kYXJ5SW5wdXRCb3JkZXJBY3RpdmVDb2xvcixcblxuICAvLyBTd2l0Y2hcbiAgc3dpdGNoV2lkdGgsXG4gIHN3aXRjaEhlaWdodCxcbiAgc3dpdGNoVHJhY2tCZ2QsXG4gIHN3aXRjaFRyYWNrQmdkQWN0aXZlLFxuICBzd2l0Y2hUcmFja0JvcmRlclJhZGl1cyxcbiAgc3dpdGNoQnRuQmdkLFxuICBzd2l0Y2hCdG5CZ2RBY3RpdmUsXG4gIHN3aXRjaEJ0bkJveFNoYWRvdyxcbiAgc3dpdGNoQnRuQm9yZGVyUmFkaXVzLFxuICBzd2l0Y2hCdG5XaWR0aCxcbiAgc3dpdGNoQnRuSGVpZ2h0LFxuICBzd2l0Y2hMYWJlbE1hcmdpbixcblxuICBzZWNvbmRhcnlTd2l0Y2hUcmFja0JnZCxcbiAgc2Vjb25kYXJ5U3dpdGNoQnRuQmdkLFxuXG4gIC8vIENoZWNrYm94XG4gIGNoZWNrYm94V2lkdGgsXG4gIGNoZWNrYm94SGVpZ2h0LFxuICBjaGVja2JveE1hcmdpbixcbiAgY2hlY2tib3hCb3JkZXJDb2xvcixcbiAgY2hlY2tib3hCb3JkZXJSYWRpdXMsXG4gIGNoZWNrYm94Qm9yZGVyQ29sb3JMVCxcbiAgY2hlY2tib3hCb3hCZ2QsXG4gIGNoZWNrYm94Qm94QmdkQ2hlY2tlZCxcblxuICAvLyBCdXR0b25cbiAgcHJpbWFyeUJ0bkJnZCxcbiAgcHJpbWFyeUJ0bkFjdEJnZCxcbiAgcHJpbWFyeUJ0bkNvbG9yLFxuICBwcmltYXJ5QnRuQWN0Q29sb3IsXG4gIHByaW1hcnlCdG5CZ2RIb3ZlcixcbiAgcHJpbWFyeUJ0blJhZGl1cyxcbiAgc2Vjb25kYXJ5QnRuQmdkLFxuICBzZWNvbmRhcnlCdG5BY3RCZ2QsXG4gIHNlY29uZGFyeUJ0bkJnZEhvdmVyLFxuICBzZWNvbmRhcnlCdG5Db2xvcixcbiAgc2Vjb25kYXJ5QnRuQWN0Q29sb3IsXG5cbiAgbmVnYXRpdmVCdG5CZ2QsXG4gIG5lZ2F0aXZlQnRuQWN0QmdkLFxuICBuZWdhdGl2ZUJ0bkJnZEhvdmVyLFxuICBuZWdhdGl2ZUJ0bkNvbG9yLFxuICBuZWdhdGl2ZUJ0bkFjdENvbG9yLFxuXG4gIGxpbmtCdG5CZ2QsXG4gIGxpbmtCdG5BY3RCZ2QsXG4gIGxpbmtCdG5Db2xvcixcbiAgbGlua0J0bkFjdENvbG9yLFxuICBsaW5rQnRuQWN0QmdkSG92ZXIsXG5cbiAgZmxvYXRpbmdCdG5CZ2QsXG4gIGZsb2F0aW5nQnRuQWN0QmdkLFxuICBmbG9hdGluZ0J0bkJnZEhvdmVyLFxuICBmbG9hdGluZ0J0bkNvbG9yLFxuICBmbG9hdGluZ0J0bkFjdENvbG9yLFxuXG4gIC8vIE1vZGFsXG4gIG1vZGFsVGl0bGVDb2xvcixcbiAgbW9kYWxUaXRsZUZvbnRTaXplLFxuICBtb2RhbFRpdGxlRm9udFNpemVTbWFsbGVyLFxuICBtb2RhbEZvb3RlckJnZCxcbiAgbW9kYWxJbWFnZVBsYWNlSG9sZGVyLFxuICBtb2RhbFBhZGRpbmcsXG5cbiAgbW9kYWxEaWFsb2dCZ2QsXG4gIG1vZGFsRGlhbG9nQ29sb3IsXG5cbiAgbW9kYWxMYXRlcmFsUGFkZGluZyxcbiAgbW9kYWxQb3J0YWJsZUxhdGVyYWxQYWRkaW5nLFxuICBtb2RhbE92ZXJMYXlaLFxuICBtb2RhbE92ZXJsYXlCZ2QsXG4gIG1vZGFsQ29udGVudFosXG4gIG1vZGFsRm9vdGVyWixcbiAgbW9kYWxUaXRsZVosXG4gIG1vZGFsQnV0dG9uWixcbiAgbW9kYWxEcm9wZG93bkJhY2tncm91bmQsXG5cbiAgLy8gU2lkZSBQYW5lbFxuICBzaWRlUGFuZWxCZyxcbiAgc2lkZVBhbmVsSW5uZXJQYWRkaW5nLFxuICBzaWRlQmFyQ2xvc2VCdG5CZ2QsXG4gIHNpZGVCYXJDbG9zZUJ0bkNvbG9yLFxuICBzaWRlQmFyQ2xvc2VCdG5CZ2RIb3ZlcixcbiAgc2lkZVBhbmVsSGVhZGVyQmcsXG4gIHNpZGVQYW5lbFNjcm9sbEJhcldpZHRoLFxuICBzaWRlUGFuZWxTY3JvbGxCYXJIZWlnaHQsXG5cbiAgLy8gU2lkZSBQYW5lbCBQYW5lbFxuICBwYW5lbEFjdGl2ZUJnLFxuICBwYW5lbEJhY2tncm91bmQsXG4gIHBhbmVsQmFja2dyb3VuZEhvdmVyLFxuICBwYW5lbEJhY2tncm91bmRMVCxcbiAgcGFuZWxCb3hTaGFkb3csXG4gIHBhbmVsQm9yZGVyUmFkaXVzLFxuICBwYW5lbEJvcmRlcixcbiAgcGFuZWxCb3JkZXJDb2xvcixcbiAgcGFuZWxCb3JkZXJMVCxcbiAgcGFuZWxIZWFkZXJJY29uLFxuICBwYW5lbEhlYWRlckljb25BY3RpdmUsXG4gIHBhbmVsSGVhZGVySGVpZ2h0LFxuICBwYW5lbERyb3Bkb3duU2Nyb2xsQmFyLFxuXG4gIC8vIFRleHRcbiAgZm9udEZhbWlseSxcbiAgZm9udFdlaWdodCxcbiAgZm9udFNpemUsXG4gIGxpbmVIZWlnaHQsXG4gIHRleHRDb2xvcixcbiAgdGV4dENvbG9yTFQsXG4gIHRleHRDb2xvckhsLFxuICB0aXRsZVRleHRDb2xvcixcbiAgc3VidGV4dENvbG9yLFxuICBzdWJ0ZXh0Q29sb3JMVCxcbiAgc3VidGV4dENvbG9yQWN0aXZlLFxuICB0ZXh0VHJ1bmNhdGUsXG4gIHRpdGxlQ29sb3JMVCxcbiAgdG9vbHRpcEJnLFxuICB0b29sdGlwQ29sb3IsXG4gIGxvZ29Db2xvcixcblxuICAvLyBCb3R0b20gUGFuZWxcbiAgYm90dG9tSW5uZXJQZFNpZGUsXG4gIGJvdHRvbUlubmVyUGRWZXJ0LFxuICBib3R0b21QYW5lbEdhcCxcbiAgYm90dG9tV2lkZ2V0UGFkZGluZ1RvcCxcbiAgYm90dG9tV2lkZ2V0UGFkZGluZ1JpZ2h0LFxuICBib3R0b21XaWRnZXRQYWRkaW5nQm90dG9tLFxuICBib3R0b21XaWRnZXRQYWRkaW5nTGVmdCxcblxuICAvLyBTbGlkZXJcbiAgc2xpZGVyQmFyQ29sb3IsXG4gIHNsaWRlckJhckJnZCxcbiAgc2xpZGVyQmFySG92ZXJDb2xvcixcbiAgc2xpZGVyQmFyUmFkaXVzLFxuICBzbGlkZXJCYXJIZWlnaHQsXG4gIHNsaWRlckhhbmRsZUhlaWdodCxcbiAgc2xpZGVySGFuZGxlV2lkdGgsXG4gIHNsaWRlckhhbmRsZUNvbG9yLFxuICBzbGlkZXJIYW5kbGVIb3ZlckNvbG9yLFxuICBzbGlkZXJIYW5kbGVTaGFkb3csXG4gIHNsaWRlcklucHV0SGVpZ2h0LFxuICBzbGlkZXJJbnB1dFdpZHRoLFxuICBzbGlkZXJNYXJnaW5Ub3BJc1JhbmdlLFxuICBzbGlkZXJNYXJnaW5Ub3AsXG5cbiAgLy8gUGxvdFxuICByYW5nZUJydXNoQmdkLFxuICBoaXN0b2dyYW1GaWxsSW5SYW5nZSxcbiAgaGlzdG9ncmFtRmlsbE91dFJhbmdlLFxuXG4gIC8vIE5vdGlmaWNhdGlvbnNcbiAgbm90aWZpY2F0aW9uQ29sb3JzLFxuICBub3RpZmljYXRpb25QYW5lbFdpZHRoLFxuICBub3RpZmljYXRpb25QYW5lbEl0ZW1XaWR0aCxcbiAgbm90aWZpY2F0aW9uUGFuZWxJdGVtSGVpZ2h0LFxuXG4gIC8vIERhdGEgVGFibGVcbiAgaGVhZGVyUm93SGVpZ2h0LFxuICByb3dIZWlnaHQsXG4gIGhlYWRlclBhZGRpbmdUb3AsXG4gIGhlYWRlclBhZGRpbmdCb3R0b20sXG4gIGNlbGxQYWRkaW5nU2lkZSxcbiAgZWRnZUNlbGxQYWRkaW5nU2lkZSxcbiAgY2VsbEZvbnRTaXplLFxuICBncmlkUGFkZGluZ1NpZGUsXG4gIG9wdGlvbkJ1dHRvbkNvbG9yLFxuICBoZWFkZXJDZWxsQmFja2dyb3VuZCxcbiAgaGVhZGVyQ2VsbEJvcmRlckNvbG9yLFxuICBoZWFkZXJDZWxsSWNvbkNvbG9yLFxuICBjZWxsQm9yZGVyQ29sb3IsXG4gIGV2ZW5Sb3dCYWNrZ3JvdW5kLFxuICBvZGRSb3dCYWNrZ3JvdW5kLFxuICBwaW5uZWRHcmlkQm9yZGVyQ29sb3IsXG4gIC8vIHRpbWUgZGlzcGxheVxuICB0aW1lRGlzcGxheUJvcmRlclJhZGl1cyxcbiAgdGltZURpc3BsYXlIZWlnaHQsXG4gIHRpbWVEaXNwbGF5TWluV2lkdGgsXG4gIHRpbWVEaXNwbGF5T3BhY2l0eSxcbiAgdGltZURpc3BsYXlQYWRkaW5nLFxuXG4gIC8vIGV4cG9ydCBtYXBcbiAgZXhwb3J0SW50cmFTZWN0aW9uTWFyZ2luLFxuXG4gIC8vIEFjdGlvbiBQYW5lbFxuICBhY3Rpb25QYW5lbFdpZHRoLFxuICBhY3Rpb25QYW5lbEhlaWdodCxcblxuICAvLyBCcmVha3BvaW50c1xuICBicmVha1BvaW50c1xufTtcblxuZXhwb3J0IGNvbnN0IHRoZW1lTFQgPSB7XG4gIC4uLnRoZW1lLFxuICAvLyB0ZW1wbGF0ZVxuICBhY3RpdmVDb2xvcjogYWN0aXZlQ29sb3JMVCxcbiAgaW5wdXQ6IGlucHV0TFQsXG4gIHRleHRDb2xvcjogdGV4dENvbG9yTFQsXG4gIHNpZGVQYW5lbEJnOiAnI0ZGRkZGRicsXG4gIHNlbGVjdENvbG9yOiBzZWxlY3RDb2xvckxULFxuICB0aXRsZVRleHRDb2xvcjogJyMwMDAwMDAnLFxuICBzaWRlUGFuZWxIZWFkZXJCZzogJyNGN0Y3RjcnLFxuICBzdWJ0ZXh0Q29sb3JBY3RpdmU6IGFjdGl2ZUNvbG9yTFQsXG4gIHRvb2x0aXBCZzogJyMxODY5QjUnLFxuICB0b29sdGlwQ29sb3I6ICcjRkZGRkZGJyxcbiAgZHJvcGRvd25MaXN0QmdkOiAnI0ZGRkZGRicsXG4gIHRleHRDb2xvckhsOiBhY3RpdmVDb2xvckxULFxuXG4gIGlucHV0QmdkOiAnI0Y3RjdGNycsXG4gIGlucHV0QmdkSG92ZXI6ICcjRkZGRkZGJyxcbiAgaW5wdXRCZ2RBY3RpdmU6ICcjRkZGRkZGJyxcblxuICBkcm9wZG93bkxpc3RIaWdobGlnaHRCZzogJyNGMEYwRjAnLFxuXG4gIHBhbmVsQmFja2dyb3VuZDogJyNGN0Y3RjcnLFxuICBwYW5lbEJhY2tncm91bmRIb3ZlcjogJyNGN0Y3RjcnLFxuICBwYW5lbEJvcmRlckNvbG9yOiAnI0QzRDhFMCcsXG5cbiAgc2lkZUJhckNsb3NlQnRuQmdkOiAnI0Y3RjdGNycsXG4gIHNpZGVCYXJDbG9zZUJ0bkNvbG9yOiB0ZXh0Q29sb3JMVCxcbiAgc2lkZUJhckNsb3NlQnRuQmdkSG92ZXI6ICcjRjdGN0Y3JyxcblxuICBzZWNvbmRhcnlJbnB1dEJnZDogJyNGN0Y3RjcnLFxuICBzZWNvbmRhcnlJbnB1dEJnZEFjdGl2ZTogJyNGN0Y3RjcnLFxuICBzZWNvbmRhcnlJbnB1dEJnZEhvdmVyOiAnI0ZGRkZGRicsXG4gIHNlY29uZGFyeUlucHV0Qm9yZGVyQWN0aXZlQ29sb3I6ICcjMDAwMDAwJyxcbiAgc2Vjb25kYXJ5SW5wdXRCb3JkZXJDb2xvcjogJ25vbmUnLFxuICBzZWNvbmRhcnlJbnB1dENvbG9yOiAnIzU0NTQ1NCcsXG5cbiAgcGFuZWxBY3RpdmVCZzogJyNGN0Y3RjcnLFxuICBtYXBQYW5lbEJhY2tncm91bmRDb2xvcjogJyNGRkZGRkYnLFxuICBtYXBQYW5lbEhlYWRlckJhY2tncm91bmRDb2xvcjogJyNGN0Y3RjcnLFxuXG4gIHNsaWRlckJhckNvbG9yOiAnI0EwQTdCNCcsXG4gIHNsaWRlckJhckJnZDogJyNEM0Q4RTAnLFxuICBzbGlkZXJIYW5kbGVDb2xvcjogJyNGN0Y3RjcnLFxuICBzbGlkZXJIYW5kbGVIb3ZlckNvbG9yOiAnI0Y3RjdGNycsXG5cbiAgc3VidGV4dENvbG9yOiBzdWJ0ZXh0Q29sb3JMVCxcbiAgc3dpdGNoQnRuQmdkOiAnI0Y3RjdGNycsXG4gIHNlY29uZGFyeVN3aXRjaEJ0bkJnZDogJyNGN0Y3RjcnLFxuICBzZWNvbmRhcnlTd2l0Y2hUcmFja0JnZDogJyNEM0Q4RTAnLFxuICBzd2l0Y2hCdG5CZ2RBY3RpdmU6ICcjRjdGN0Y3JyxcbiAgc3dpdGNoVHJhY2tCZ2Q6ICcjRDNEOEUwJyxcbiAgc3dpdGNoVHJhY2tCZ2RBY3RpdmU6IGFjdGl2ZUNvbG9yTFQsXG5cbiAgLy8gYnV0dG9uIHN3aXRjaCBiYWNrZ3JvdW5kIGFuZCBob3ZlciBjb2xvclxuICBwcmltYXJ5QnRuQmdkOiBwcmltYXJ5QnRuQWN0QmdkLFxuICBwcmltYXJ5QnRuQWN0QmdkOiBwcmltYXJ5QnRuQmdkLFxuICBwcmltYXJ5QnRuQmdkSG92ZXI6IHByaW1hcnlCdG5CZ2QsXG5cbiAgc2Vjb25kYXJ5QnRuQmdkOiBzZWNvbmRhcnlCdG5BY3RCZ2QsXG4gIHNlY29uZGFyeUJ0bkFjdEJnZDogc2Vjb25kYXJ5QnRuQmdkLFxuICBzZWNvbmRhcnlCdG5CZ2RIb3Zlcjogc2Vjb25kYXJ5QnRuQmdkLFxuXG4gIGZsb2F0aW5nQnRuQmdkOiAnI0Y3RjdGNycsXG4gIGZsb2F0aW5nQnRuQWN0QmdkOiAnI0Y3RjdGNycsXG4gIGZsb2F0aW5nQnRuQmdkSG92ZXI6ICcjRjdGN0Y3JyxcbiAgZmxvYXRpbmdCdG5Db2xvcjogc3VidGV4dENvbG9yLFxuICBmbG9hdGluZ0J0bkFjdENvbG9yOiBhY3RpdmVDb2xvckxULFxuXG4gIGxpbmtCdG5BY3RDb2xvcjogdGV4dENvbG9yTFQsXG5cbiAgcmFuZ2VCcnVzaEJnZDogJyNEM0Q4RTAnLFxuICBoaXN0b2dyYW1GaWxsSW5SYW5nZTogYWN0aXZlQ29sb3JMVCxcbiAgaGlzdG9ncmFtRmlsbE91dFJhbmdlOiAnI0EwQTdCNCdcbn07XG5cbmV4cG9ydCBjb25zdCB0aGVtZUJTID0ge1xuICAuLi50aGVtZSxcbiAgYWN0aXZlQ29sb3I6ICcjRTJFMkUyJyxcbiAgZHJvcGRvd25MaXN0QmdkOiAnI0ZGRkZGRicsXG4gIGRyb3Bkb3duTGlzdEJvcmRlclRvcDogJ25vbmUnLFxuICBkcm9wZG93bkxpc3RIaWdobGlnaHRCZzogJyNGNkY2RjYnLFxuICBpbnB1dEJnZDogJyNFMkUyRTInLFxuICBpbnB1dEJnZEFjdGl2ZTogJyNFMkUyRTInLFxuICBpbnB1dEJnZEhvdmVyOiAnaW5oZXJpdCcsXG4gIGlucHV0Qm9yZGVyQWN0aXZlQ29sb3I6ICcjMDAwMDAwJyxcbiAgaW5wdXRDb2xvcjogJyMwMDAwMDAnLFxuICBwYW5lbEFjdGl2ZUJnOiAnI0UyRTJFMicsXG4gIHBhbmVsQmFja2dyb3VuZDogJyNGRkZGRkYnLFxuICBwYW5lbEJhY2tncm91bmRIb3ZlcjogJyNFRUVFRUUnLFxuICBwYW5lbEJvcmRlckNvbG9yOiAnI0UyRTJFMicsXG4gIHByaW1hcnlCdG5CZ2Q6ICcjRTJFMkUyJyxcbiAgcHJpbWFyeUJ0bkJnZEhvdmVyOiAnIzMzMzMzMycsXG4gIHByaW1hcnlCdG5Db2xvcjogJyMwMDAwMDAnLFxuICBzZWNvbmRhcnlCdG5BY3RCZ2Q6ICcjRUVFRUVFJyxcbiAgc2Vjb25kYXJ5QnRuQWN0Q29sb3I6ICcjMDAwMDAwJyxcbiAgc2Vjb25kYXJ5QnRuQmdkOiAnI0UyRTJFMicsXG4gIHNlY29uZGFyeUJ0bkJnZEhvdmVyOiAnI0NCQ0JDQicsXG5cbiAgc2lkZUJhckNsb3NlQnRuQmdkOiAnI0UyRTJFMicsXG4gIHNpZGVCYXJDbG9zZUJ0bkNvbG9yOiAnIzAwMDAwMCcsXG4gIHNpZGVCYXJDbG9zZUJ0bkJnZEhvdmVyOiAnI0ZGRkZGRicsXG5cbiAgZmxvYXRpbmdCdG5CZ2Q6ICcjRkZGRkZGJyxcbiAgZmxvYXRpbmdCdG5BY3RCZ2Q6ICcjRUVFRUVFJyxcbiAgZmxvYXRpbmdCdG5CZ2RIb3ZlcjogJyNFRUVFRUUnLFxuICBmbG9hdGluZ0J0bkNvbG9yOiAnIzc1NzU3NScsXG4gIGZsb2F0aW5nQnRuQWN0Q29sb3I6ICcjMDAwMDAwJyxcblxuICBzZWNvbmRhcnlCdG5Db2xvcjogJyMwMDAwMDAnLFxuICBzZWNvbmRhcnlJbnB1dEJnZDogJyNGNkY2RjYnLFxuICBzZWNvbmRhcnlJbnB1dEJnZEFjdGl2ZTogJyNGNkY2RjYnLFxuICBzZWNvbmRhcnlJbnB1dEJnZEhvdmVyOiAnI0Y2RjZGNicsXG4gIHNlY29uZGFyeUlucHV0Qm9yZGVyQWN0aXZlQ29sb3I6ICcjMDAwMDAwJyxcbiAgc2Vjb25kYXJ5SW5wdXRCb3JkZXJDb2xvcjogJ25vbmUnLFxuICBzZWNvbmRhcnlJbnB1dENvbG9yOiAnIzU0NTQ1NCcsXG4gIHNpZGVQYW5lbEJnOiAnI0Y2RjZGNicsXG4gIHNpZGVQYW5lbEhlYWRlckJnOiAnI0ZGRkZGRicsXG4gIHN1YnRleHRDb2xvcjogJyNBRkFGQUYnLFxuICBzdWJ0ZXh0Q29sb3JBY3RpdmU6ICcjMDAwMDAwJyxcbiAgdGV4dENvbG9yOiAnIzAwMDAwMCcsXG4gIHRleHRDb2xvckhsOiAnIzU0NTQ1NCcsXG4gIG1hcFBhbmVsQmFja2dyb3VuZENvbG9yOiAnI0Y2RjZGNicsXG4gIG1hcFBhbmVsSGVhZGVyQmFja2dyb3VuZENvbG9yOiAnI0ZGRkZGRicsXG4gIHRpdGxlVGV4dENvbG9yOiAnIzAwMDAwMCcsXG4gIHN3aXRjaEJ0bkJnZEFjdGl2ZTogJyMwMDAwMDAnLFxuICBzd2l0Y2hCdG5CZ2Q6ICcjRkZGRkZGJyxcbiAgc3dpdGNoVHJhY2tCZ2RBY3RpdmU6ICcjRTJFMkUyJyxcbiAgc2Vjb25kYXJ5U3dpdGNoVHJhY2tCZ2Q6ICcjRTJFMkUyJyxcbiAgc3dpdGNoVHJhY2tCZ2Q6ICcjRTJFMkUyJyxcbiAgc2Vjb25kYXJ5U3dpdGNoQnRuQmdkOiAnI0ZGRkZGRicsXG4gIGhpc3RvZ3JhbUZpbGxJblJhbmdlOiAnIzAwMDAwMCcsXG4gIGhpc3RvZ3JhbUZpbGxPdXRSYW5nZTogJyNFMkUyRTInLFxuICByYW5nZUJydXNoQmdkOiAnI0UyRTJFMicsXG4gIHNsaWRlckJhckJnZDogJyNFMkUyRTInLFxuICBzbGlkZXJIYW5kbGVDb2xvcjogJyNGRkZGRkYnLFxuICBzbGlkZXJCYXJDb2xvcjogJyMwMDAwMDAnXG59O1xuIl19
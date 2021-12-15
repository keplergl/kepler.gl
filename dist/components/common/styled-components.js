"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CheckMark = exports.TruncatedTitleText = exports.StyledFilterContent = exports.MapControlButton = exports.BottomWidgetInner = exports.WidgetContainer = exports.StyledType = exports.StyledFilteredOption = exports.StyledExportSection = exports.StyledAttrbution = exports.StyledMapContainer = exports.StyledModalInputFootnote = exports.StyledModalSection = exports.StyledModalVerticalPanel = exports.StyledModalContent = exports.Table = exports.SelectionButton = exports.DatasetSquare = exports.ButtonGroup = exports.StyledPanelDropdown = exports.StyledPanelHeader = exports.InlineInput = exports.TextAreaLight = exports.TextArea = exports.InputLight = exports.Input = exports.Button = exports.Tooltip = exports.SidePanelDivider = exports.SidePanelSection = exports.PanelContent = exports.PanelHeaderContent = exports.PanelHeaderTitle = exports.PanelLabelBold = exports.PanelLabelWrapper = exports.PanelLabel = exports.SBFlexboxNoMargin = exports.SBFlexboxItem = exports.SpaceBetweenFlexbox = exports.CenterVerticalFlexbox = exports.CenterFlexbox = exports.IconRoundSmall = exports.SelectTextBold = exports.SelectText = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _reactTooltip = _interopRequireDefault(require("react-tooltip"));

var _mediaBreakpoints = require("../../styles/media-breakpoints");

var _classnames = _interopRequireDefault(require("classnames"));

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10, _templateObject11, _templateObject12, _templateObject13, _templateObject14, _templateObject15, _templateObject16, _templateObject17, _templateObject18, _templateObject19, _templateObject20, _templateObject21, _templateObject22, _templateObject23, _templateObject24, _templateObject25, _templateObject26, _templateObject27, _templateObject28, _templateObject29, _templateObject30, _templateObject31, _templateObject32, _templateObject33, _templateObject34, _templateObject35, _templateObject36, _templateObject37, _templateObject38, _templateObject39, _templateObject40, _templateObject41, _templateObject42, _templateObject43, _templateObject44, _templateObject45, _templateObject46, _templateObject47, _templateObject48;

var SelectText = _styledComponents["default"].span(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n  font-size: ", ";\n  font-weight: 400;\n\n  i {\n    font-size: 13px;\n    margin-right: 6px;\n  }\n"])), function (props) {
  return props.theme.labelColor;
}, function (props) {
  return props.theme.selectFontSize;
});

exports.SelectText = SelectText;
var SelectTextBold = (0, _styledComponents["default"])(SelectText)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n  font-weight: 500;\n"])), function (props) {
  return props.theme.textColor;
});
exports.SelectTextBold = SelectTextBold;

var IconRoundSmall = _styledComponents["default"].div(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  width: 18px;\n  height: 18px;\n  border-radius: 9px;\n  background-color: ", ";\n  color: ", ";\n  align-items: center;\n  justify-content: center;\n\n  :hover {\n    cursor: pointer;\n    background-color: ", ";\n  }\n"])), function (props) {
  return props.theme.secondaryBtnBgdHover;
}, function (props) {
  return props.theme.secondaryBtnColor;
}, function (props) {
  return props.theme.secondaryBtnBgdHover;
});

exports.IconRoundSmall = IconRoundSmall;

var CenterFlexbox = _styledComponents["default"].div(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  align-items: center;\n"])));

exports.CenterFlexbox = CenterFlexbox;

var CenterVerticalFlexbox = _styledComponents["default"].div(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n"])));

exports.CenterVerticalFlexbox = CenterVerticalFlexbox;

var SpaceBetweenFlexbox = _styledComponents["default"].div(_templateObject6 || (_templateObject6 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  justify-content: space-between;\n  margin-left: -16px;\n"])));

exports.SpaceBetweenFlexbox = SpaceBetweenFlexbox;

var SBFlexboxItem = _styledComponents["default"].div(_templateObject7 || (_templateObject7 = (0, _taggedTemplateLiteral2["default"])(["\n  flex-grow: 1;\n  margin-left: 16px;\n"])));

exports.SBFlexboxItem = SBFlexboxItem;

var SBFlexboxNoMargin = _styledComponents["default"].div(_templateObject8 || (_templateObject8 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  justify-content: space-between;\n"])));

exports.SBFlexboxNoMargin = SBFlexboxNoMargin;

var PanelLabel = _styledComponents["default"].label.attrs({
  className: 'side-panel-panel__label'
})(_templateObject9 || (_templateObject9 = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n  display: inline-block;\n  font-size: 11px;\n  font-weight: 400;\n  margin-bottom: 4px;\n  text-transform: capitalize;\n"])), function (props) {
  return props.theme.labelColor;
});

exports.PanelLabel = PanelLabel;

var PanelLabelWrapper = _styledComponents["default"].div.attrs({
  className: 'side-panel-panel__label-wrapper'
})(_templateObject10 || (_templateObject10 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  align-items: self-start;\n"])));

exports.PanelLabelWrapper = PanelLabelWrapper;
var PanelLabelBold = (0, _styledComponents["default"])(PanelLabel)(_templateObject11 || (_templateObject11 = (0, _taggedTemplateLiteral2["default"])(["\n  font-weight: 500;\n"])));
exports.PanelLabelBold = PanelLabelBold;

var PanelHeaderTitle = _styledComponents["default"].span.attrs({
  className: 'side-panel-panel__header__title'
})(_templateObject12 || (_templateObject12 = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n  font-size: 13px;\n  letter-spacing: 0.43px;\n  text-transform: capitalize;\n"])), function (props) {
  return props.theme.textColor;
});

exports.PanelHeaderTitle = PanelHeaderTitle;

var PanelHeaderContent = _styledComponents["default"].div(_templateObject13 || (_templateObject13 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  align-items: center;\n  color: ", ";\n  padding-left: 12px;\n\n  .icon {\n    color: ", ";\n    display: flex;\n    align-items: center;\n    margin-right: 12px;\n  }\n"])), function (props) {
  return props.theme.textColor;
}, function (props) {
  return props.theme.labelColor;
});

exports.PanelHeaderContent = PanelHeaderContent;

var PanelContent = _styledComponents["default"].div.attrs({
  className: 'side-panel-panel__content'
})(_templateObject14 || (_templateObject14 = (0, _taggedTemplateLiteral2["default"])(["\n  background-color: ", ";\n  padding: 12px;\n"])), function (props) {
  return props.theme.panelContentBackground;
});

exports.PanelContent = PanelContent;

var SidePanelSection = _styledComponents["default"].div.attrs({
  className: 'side-panel-section'
})(_templateObject15 || (_templateObject15 = (0, _taggedTemplateLiteral2["default"])(["\n  margin-bottom: 12px;\n\n  opacity: ", ";\n  pointer-events: ", ";\n"])), function (props) {
  return props.disabled ? 0.4 : 1;
}, function (props) {
  return props.disabled ? 'none' : 'all';
});

exports.SidePanelSection = SidePanelSection;

var SidePanelDivider = _styledComponents["default"].div.attrs({
  className: 'side-panel-divider'
})(_templateObject16 || (_templateObject16 = (0, _taggedTemplateLiteral2["default"])(["\n  border-bottom: ", " solid\n    ", ";\n  margin-bottom: ", "px;\n  height: ", "px;\n"])), function (props) {
  return props.theme.sidepanelDividerBorder;
}, function (props) {
  return props.theme.panelBorderColor;
}, function (props) {
  return props.theme.sidepanelDividerMargin;
}, function (props) {
  return props.theme.sidepanelDividerHeight;
});

exports.SidePanelDivider = SidePanelDivider;
var Tooltip = (0, _styledComponents["default"])(_reactTooltip["default"])(_templateObject17 || (_templateObject17 = (0, _taggedTemplateLiteral2["default"])(["\n  &.__react_component_tooltip {\n    font-size: ", ";\n    font-weight: 400;\n    padding: 7px 18px;\n    box-shadow: ", ";\n\n    &.type-dark {\n      background-color: ", ";\n      color: ", ";\n      &.place-bottom {\n        :after {\n          border-bottom-color: ", ";\n        }\n      }\n\n      &.place-top {\n        :after {\n          border-top-color: ", ";\n        }\n      }\n\n      &.place-right {\n        :after {\n          border-right-color: ", ";\n        }\n      }\n\n      &.place-left {\n        :after {\n          border-left-color: ", ";\n        }\n      }\n    }\n  }\n"])), function (props) {
  return props.theme.tooltipFontSize;
}, function (props) {
  return props.theme.tooltipBoxShadow;
}, function (props) {
  return props.theme.tooltipBg;
}, function (props) {
  return props.theme.tooltipColor;
}, function (props) {
  return props.theme.tooltipBg;
}, function (props) {
  return props.theme.tooltipBg;
}, function (props) {
  return props.theme.tooltipBg;
}, function (props) {
  return props.theme.tooltipBg;
});
exports.Tooltip = Tooltip;

var Button = _styledComponents["default"].div.attrs(function (props) {
  return {
    className: (0, _classnames["default"])('button', props.className)
  };
})(_templateObject18 || (_templateObject18 = (0, _taggedTemplateLiteral2["default"])(["\n  align-items: center;\n  background-color: ", ";\n  border-radius: ", ";\n  color: ", ";\n  cursor: pointer;\n  display: inline-flex;\n  font-size: ", ";\n  font-weight: 500;\n  font-family: ", ";\n  justify-content: center;\n  letter-spacing: 0.3px;\n  line-height: 14px;\n  outline: 0;\n  padding: ", ";\n  text-align: center;\n  transition: ", ";\n  vertical-align: middle;\n  width: ", ";\n  opacity: ", ";\n  pointer-events: ", ";\n  border: ", ";\n  :hover,\n  :focus,\n  :active,\n  &.active {\n    background-color: ", ";\n    color: ", ";\n  }\n\n  svg {\n    margin-right: ", ";\n  }\n"])), function (props) {
  return props.negative ? props.theme.negativeBtnBgd : props.secondary ? props.theme.secondaryBtnBgd : props.link ? props.theme.linkBtnBgd : props.floating ? props.theme.floatingBtnBgd : props.cta ? props.theme.ctaBtnBgd : props.theme.primaryBtnBgd;
}, function (props) {
  return props.theme.primaryBtnRadius;
}, function (props) {
  return props.negative ? props.theme.negativeBtnColor : props.secondary ? props.theme.secondaryBtnColor : props.link ? props.theme.linkBtnColor : props.floating ? props.theme.floatingBtnColor : props.cta ? props.theme.ctaBtnColor : props.theme.primaryBtnColor;
}, function (props) {
  return props.large ? props.theme.primaryBtnFontSizeLarge : props.small ? props.theme.primaryBtnFontSizeSmall : props.theme.primaryBtnFontSizeDefault;
}, function (props) {
  return props.theme.btnFontFamily;
}, function (props) {
  return props.large ? '14px 32px' : props.small ? '6px 9px' : '9px 12px';
}, function (props) {
  return props.theme.transition;
}, function (props) {
  return props.width || 'auto';
}, function (props) {
  return props.disabled ? 0.4 : 1;
}, function (props) {
  return props.disabled ? 'none' : 'all';
}, function (props) {
  return props.negative ? props.theme.negativeBtnBorder : props.secondary ? props.theme.secondaryBtnBorder : props.floating ? props.theme.floatingBtnBorder : props.link ? props.theme.linkBtnBorder : props.theme.primaryBtnBorder;
}, function (props) {
  return props.negative ? props.theme.negativeBtnBgdHover : props.secondary ? props.theme.secondaryBtnBgdHover : props.link ? props.theme.linkBtnActBgdHover : props.floating ? props.theme.floatingBtnBgdHover : props.cta ? props.theme.ctaBtnBgdHover : props.theme.primaryBtnBgdHover;
}, function (props) {
  return props.negative ? props.theme.negativeBtnActColor : props.secondary ? props.theme.secondaryBtnActColor : props.link ? props.theme.linkBtnActColor : props.floating ? props.theme.floatingBtnActColor : props.cta ? props.theme.ctaBtnActColor : props.theme.primaryBtnActColor;
}, function (props) {
  return props.large ? '10px' : props.small ? '6px' : '8px';
});

exports.Button = Button;

var Input = _styledComponents["default"].input(_templateObject19 || (_templateObject19 = (0, _taggedTemplateLiteral2["default"])(["\n  ", ";\n"])), function (props) {
  return props.secondary ? props.theme.secondaryInput : props.theme.input;
});

exports.Input = Input;

var InputLight = _styledComponents["default"].input(_templateObject20 || (_templateObject20 = (0, _taggedTemplateLiteral2["default"])(["\n  ", ";\n"])), function (props) {
  return props.theme.inputLT;
});

exports.InputLight = InputLight;

var TextArea = _styledComponents["default"].textarea(_templateObject21 || (_templateObject21 = (0, _taggedTemplateLiteral2["default"])(["\n  ", ";\n"])), function (props) {
  return props.secondary ? props.theme.secondaryInput : props.theme.input;
});

exports.TextArea = TextArea;

var TextAreaLight = _styledComponents["default"].textarea(_templateObject22 || (_templateObject22 = (0, _taggedTemplateLiteral2["default"])(["\n  ", " height: auto;\n  white-space: pre-wrap;\n"])), function (props) {
  return props.theme.inputLT;
});

exports.TextAreaLight = TextAreaLight;
var InlineInput = (0, _styledComponents["default"])(Input)(_templateObject23 || (_templateObject23 = (0, _taggedTemplateLiteral2["default"])(["\n  ", ";\n"])), function (props) {
  return props.theme.inlineInput;
});
exports.InlineInput = InlineInput;

var StyledPanelHeader = _styledComponents["default"].div(_templateObject24 || (_templateObject24 = (0, _taggedTemplateLiteral2["default"])(["\n  background-color: ", ";\n  border-left: 3px solid\n    rgb(\n      ", "\n    );\n  padding: 0 10px 0 0;\n  height: ", "px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  border-radius: ", ";\n  transition: ", ";\n"])), function (props) {
  return props.active ? props.theme.panelBackgroundHover : props.theme.panelBackground;
}, function (props) {
  return props.labelRCGColorValues ? props.labelRCGColorValues.join(',') : 'transparent';
}, function (props) {
  return props.theme.panelHeaderHeight;
}, function (props) {
  return props.theme.panelHeaderBorderRadius;
}, function (props) {
  return props.theme.transition;
});

exports.StyledPanelHeader = StyledPanelHeader;

var StyledPanelDropdown = _styledComponents["default"].div(_templateObject25 || (_templateObject25 = (0, _taggedTemplateLiteral2["default"])(["\n  ", "\n  background-color: ", ";\n  overflow-y: auto;\n  box-shadow: ", ";\n  border-radius: ", ";\n  max-height: 500px;\n  position: relative;\n  z-index: 999;\n"])), function (props) {
  return props.theme.panelDropdownScrollBar;
}, function (props) {
  return props.type === 'light' ? props.theme.modalDropdownBackground : props.theme.panelBackground;
}, function (props) {
  return props.theme.panelBoxShadow;
}, function (props) {
  return props.theme.panelBorderRadius;
});

exports.StyledPanelDropdown = StyledPanelDropdown;

var ButtonGroup = _styledComponents["default"].div(_templateObject26 || (_templateObject26 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  .button {\n    border-radius: 0;\n    margin-left: 2px;\n  }\n  .button:first-child {\n    border-bottom-left-radius: ", ";\n    border-top-left-radius: ", ";\n    margin-left: 0;\n  }\n  .button:last-child {\n    border-bottom-right-radius: ", ";\n    border-top-right-radius: ", ";\n  }\n"])), function (props) {
  return props.theme.primaryBtnRadius;
}, function (props) {
  return props.theme.primaryBtnRadius;
}, function (props) {
  return props.theme.primaryBtnRadius;
}, function (props) {
  return props.theme.primaryBtnRadius;
});

exports.ButtonGroup = ButtonGroup;

var DatasetSquare = _styledComponents["default"].div(_templateObject27 || (_templateObject27 = (0, _taggedTemplateLiteral2["default"])(["\n  display: inline-block;\n  width: 8px;\n  height: 8px;\n  background-color: rgb(", ");\n  margin-right: 12px;\n"])), function (props) {
  return props.color.join(',');
});

exports.DatasetSquare = DatasetSquare;

var SelectionButton = _styledComponents["default"].div(_templateObject28 || (_templateObject28 = (0, _taggedTemplateLiteral2["default"])(["\n  position: relative;\n  border-radius: 2px;\n  border: 1px solid\n    ", ";\n  color: ", ";\n  background-color: ", ";\n\n  cursor: pointer;\n  font-weight: 500;\n  margin-right: 6px;\n  padding: 6px 16px;\n\n  :hover {\n    color: ", ";\n    border: 1px solid ", ";\n  }\n"])), function (props) {
  return props.selected ? props.theme.selectionBtnBorderActColor : props.theme.selectionBtnBorderColor;
}, function (props) {
  return props.selected ? props.theme.selectionBtnActColor : props.theme.selectionBtnColor;
}, function (props) {
  return props.selected ? props.theme.selectionBtnActBgd : props.theme.selectionBtnBgd;
}, function (props) {
  return props.theme.selectionBtnActColor;
}, function (props) {
  return props.theme.selectionBtnBorderActColor;
});

exports.SelectionButton = SelectionButton;

var Table = _styledComponents["default"].table(_templateObject29 || (_templateObject29 = (0, _taggedTemplateLiteral2["default"])(["\n  width: 100%;\n  border-spacing: 0;\n\n  thead {\n    tr th {\n      background: ", ";\n      color: ", ";\n      padding: 18px 12px;\n      text-align: start;\n    }\n  }\n\n  tbody {\n    tr td {\n      border-bottom: ", ";\n      padding: 12px;\n    }\n  }\n"])), function (props) {
  return props.theme.panelBackgroundLT;
}, function (props) {
  return props.theme.titleColorLT;
}, function (props) {
  return props.theme.panelBorderLT;
});

exports.Table = Table;

var StyledModalContent = _styledComponents["default"].div(_templateObject30 || (_templateObject30 = (0, _taggedTemplateLiteral2["default"])(["\n  background: ", ";\n  color: ", ";\n  display: flex;\n  flex-direction: row;\n  font-size: 10px;\n  padding: 24px ", ";\n  margin: 0 -", ";\n  justify-content: space-between;\n  ", ";\n"])), function (props) {
  return props.theme.panelBackgroundLT;
}, function (props) {
  return props.theme.textColorLT;
}, function (props) {
  return props.theme.modalLateralPadding;
}, function (props) {
  return props.theme.modalLateralPadding;
}, _mediaBreakpoints.media.portable(_templateObject31 || (_templateObject31 = (0, _taggedTemplateLiteral2["default"])(["\n    flex-direction: column;\n    padding: 16px ", ";\n    margin: 0 -", ";\n  "])), function (props) {
  return props.theme.modalPortableLateralPadding;
}, function (props) {
  return props.theme.modalPortableLateralPadding;
}));

exports.StyledModalContent = StyledModalContent;

var StyledModalVerticalPanel = _styledComponents["default"].div.attrs({
  className: 'modal-vertical-panel'
})(_templateObject32 || (_templateObject32 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  flex-direction: column;\n  justify-content: space-around;\n  font-size: 12px;\n\n  .modal-section:first-child {\n    margin-top: 24px;\n    ", ";\n  }\n\n  input {\n    margin-right: 8px;\n  }\n"])), _mediaBreakpoints.media.palm(_templateObject33 || (_templateObject33 = (0, _taggedTemplateLiteral2["default"])(["\n      margin-top: 0;\n    "]))));

exports.StyledModalVerticalPanel = StyledModalVerticalPanel;

var StyledModalSection = _styledComponents["default"].div.attrs({
  className: 'modal-section'
})(_templateObject34 || (_templateObject34 = (0, _taggedTemplateLiteral2["default"])(["\n  margin-bottom: 32px;\n\n  .modal-section-title {\n    font-weight: 500;\n  }\n  .modal-section-subtitle {\n    color: ", ";\n  }\n\n  input {\n    margin-top: 8px;\n  }\n\n  ", ";\n  ", ";\n"])), function (props) {
  return props.theme.subtextColorLT;
}, _mediaBreakpoints.media.portable(_templateObject35 || (_templateObject35 = (0, _taggedTemplateLiteral2["default"])(["\n    margin-bottom: 24px;\n  "]))), _mediaBreakpoints.media.palm(_templateObject36 || (_templateObject36 = (0, _taggedTemplateLiteral2["default"])(["\n    margin-bottom: 16px;\n  "]))));

exports.StyledModalSection = StyledModalSection;

var StyledModalInputFootnote = _styledComponents["default"].div.attrs({
  className: 'modal-input__footnote'
})(_templateObject37 || (_templateObject37 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  justify-content: flex-end;\n  color: ", ";\n  font-size: 10px;\n"])), function (props) {
  return props.error ? props.theme.errorColor : props.theme.subtextColorLT;
});
/**
 * Newer versions of mapbox.gl display an error message banner on top of the map by default
 * which will cause the map to display points in the wrong locations
 * This workaround will hide the error banner.
 */


exports.StyledModalInputFootnote = StyledModalInputFootnote;

var StyledMapContainer = _styledComponents["default"].div(_templateObject38 || (_templateObject38 = (0, _taggedTemplateLiteral2["default"])(["\n  .mapboxgl-map {\n    .mapboxgl-missing-css {\n      display: none;\n    }\n    .mapboxgl-ctrl-attrib {\n      display: none;\n    }\n  }\n"])));

exports.StyledMapContainer = StyledMapContainer;

var StyledAttrbution = _styledComponents["default"].div.attrs({
  className: 'mapbox-attribution-container'
})(_templateObject39 || (_templateObject39 = (0, _taggedTemplateLiteral2["default"])(["\n  bottom: 0;\n  right: 0;\n  position: absolute;\n  display: block;\n  margin: 0 10px 2px;\n  z-index: 0;\n\n  .attrition-logo {\n    display: flex;\n    font-size: 10px;\n    justify-content: flex-end;\n    align-items: center;\n    color: ", ";\n    margin-bottom: -4px;\n\n    a.mapboxgl-ctrl-logo {\n      width: 72px;\n      margin-left: 6px;\n    }\n  }\n  a {\n    font-size: 10px;\n  }\n"])), function (props) {
  return props.theme.labelColor;
});

exports.StyledAttrbution = StyledAttrbution;

var StyledExportSection = _styledComponents["default"].div(_templateObject40 || (_templateObject40 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  flex-direction: row;\n  margin: 35px 0;\n  width: 100%;\n  color: ", ";\n  font-size: 12px;\n  opacity: ", ";\n  pointer-events: ", ";\n\n  .description {\n    width: 185px;\n    .title {\n      font-weight: 500;\n    }\n    .subtitle {\n      color: ", ";\n      font-size: 11px;\n    }\n  }\n  .warning {\n    color: ", ";\n    font-weight: 500;\n  }\n  .description.full {\n    width: 100%;\n  }\n  .selection {\n    display: flex;\n    flex-wrap: wrap;\n    flex: 1;\n    padding-left: 50px;\n\n    select {\n      background-color: white;\n      border-radius: 1px;\n      display: inline-block;\n      font: inherit;\n      line-height: 1.5em;\n      padding: 0.5em 3.5em 0.5em 1em;\n      margin: 0;\n      box-sizing: border-box;\n      appearance: none;\n      width: 250px;\n      height: 36px;\n\n      background-image: linear-gradient(45deg, transparent 50%, gray 50%),\n        linear-gradient(135deg, gray 50%, transparent 50%), linear-gradient(to right, #ccc, #ccc);\n      background-position: calc(100% - 20px) calc(1em + 2px), calc(100% - 15px) calc(1em + 2px),\n        calc(100% - 2.5em) 4.5em;\n      background-size: 5px 5px, 5px 5px, 1px 1.5em;\n      background-repeat: no-repeat;\n    }\n\n    select:focus {\n      background-image: linear-gradient(45deg, green 50%, transparent 50%),\n        linear-gradient(135deg, transparent 50%, green 50%), linear-gradient(to right, #ccc, #ccc);\n      background-position: calc(100% - 15px) 1em, calc(100% - 20px) 1em, calc(100% - 2.5em) 4.5em;\n      background-size: 5px 5px, 5px 5px, 1px 1.5em;\n      background-repeat: no-repeat;\n      border-color: green;\n      outline: 0;\n    }\n  }\n"])), function (props) {
  return props.theme.textColorLT;
}, function (props) {
  return props.disabled ? 0.3 : 1;
}, function (props) {
  return props.disabled ? 'none' : 'all';
}, function (props) {
  return props.theme.subtextColorLT;
}, function (props) {
  return props.theme.errorColor;
});

exports.StyledExportSection = StyledExportSection;
var StyledFilteredOption = (0, _styledComponents["default"])(SelectionButton)(_templateObject41 || (_templateObject41 = (0, _taggedTemplateLiteral2["default"])(["\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  margin: 4px;\n  padding: 8px 12px;\n  width: 140px;\n\n  .filter-option-title {\n    color: ", ";\n    font-size: 12px;\n    font-weight: 500;\n  }\n  .filter-option-subtitle {\n    color: ", ";\n    font-size: 11px;\n  }\n"])), function (props) {
  return props.theme.textColorLT;
}, function (props) {
  return props.theme.subtextColorLT;
});
exports.StyledFilteredOption = StyledFilteredOption;
var StyledType = (0, _styledComponents["default"])(SelectionButton)(_templateObject42 || (_templateObject42 = (0, _taggedTemplateLiteral2["default"])(["\n  height: 100px;\n  margin: 4px;\n  padding: 6px 10px;\n  width: 100px;\n"])));
exports.StyledType = StyledType;

var WidgetContainer = _styledComponents["default"].div(_templateObject43 || (_templateObject43 = (0, _taggedTemplateLiteral2["default"])(["\n  z-index: 1;\n"])));

exports.WidgetContainer = WidgetContainer;

var BottomWidgetInner = _styledComponents["default"].div(_templateObject44 || (_templateObject44 = (0, _taggedTemplateLiteral2["default"])(["\n  background-color: ", ";\n  padding: ", ";\n  position: relative;\n  margin-top: ", "px;\n"])), function (props) {
  return props.theme.bottomWidgetBgd;
}, function (props) {
  return "".concat(props.theme.bottomInnerPdVert, "px ").concat(props.theme.bottomInnerPdSide, "px");
}, function (props) {
  return props.theme.bottomPanelGap;
});

exports.BottomWidgetInner = BottomWidgetInner;
var MapControlButton = (0, _styledComponents["default"])(Button).attrs({
  className: 'map-control-button'
})(_templateObject45 || (_templateObject45 = (0, _taggedTemplateLiteral2["default"])(["\n  box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.16);\n  height: 32px;\n  width: 32px;\n  padding: 0;\n  border-radius: 0;\n  background-color: ", ";\n  color: ", ";\n  border: ", ";\n\n  :hover,\n  :focus,\n  :active,\n  &.active {\n    background-color: ", ";\n    color: ", ";\n    border: ", ";\n  }\n  svg {\n    margin-right: 0;\n  }\n"])), function (props) {
  return props.active ? props.theme.floatingBtnBgdHover : props.theme.floatingBtnBgd;
}, function (props) {
  return props.active ? props.theme.floatingBtnActColor : props.theme.floatingBtnColor;
}, function (props) {
  return props.active ? props.theme.floatingBtnBorderHover : props.theme.floatingBtnBorder;
}, function (props) {
  return props.theme.floatingBtnBgdHover;
}, function (props) {
  return props.theme.floatingBtnActColor;
}, function (props) {
  return props.theme.floatingBtnBorderHover;
});
exports.MapControlButton = MapControlButton;

var StyledFilterContent = _styledComponents["default"].div(_templateObject46 || (_templateObject46 = (0, _taggedTemplateLiteral2["default"])(["\n  background-color: ", ";\n  padding: 12px;\n"])), function (props) {
  return props.theme.panelContentBackground;
});

exports.StyledFilterContent = StyledFilterContent;

var TruncatedTitleText = _styledComponents["default"].div(_templateObject47 || (_templateObject47 = (0, _taggedTemplateLiteral2["default"])(["\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  overflow: hidden;\n"])));

exports.TruncatedTitleText = TruncatedTitleText;

var CheckMark = _styledComponents["default"].span.attrs({
  className: 'checkbox-inner'
})(_templateObject48 || (_templateObject48 = (0, _taggedTemplateLiteral2["default"])(["\n  background-color: ", ";\n  position: absolute;\n  top: 0;\n  right: 0;\n  display: block;\n  width: 10px;\n  height: 10px;\n  border-top-left-radius: 2px;\n\n  :after {\n    position: absolute;\n    display: table;\n    border: 1px solid #fff;\n    border-top: 0;\n    border-left: 0;\n    transform: rotate(45deg) scale(1) translate(-50%, -50%);\n    opacity: 1;\n    content: ' ';\n    top: 40%;\n    left: 30%;\n    width: 3.2px;\n    height: 6.22px;\n  }\n"])), function (props) {
  return props.theme.selectionBtnBorderActColor;
});

exports.CheckMark = CheckMark;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cy5qcyJdLCJuYW1lcyI6WyJTZWxlY3RUZXh0Iiwic3R5bGVkIiwic3BhbiIsInByb3BzIiwidGhlbWUiLCJsYWJlbENvbG9yIiwic2VsZWN0Rm9udFNpemUiLCJTZWxlY3RUZXh0Qm9sZCIsInRleHRDb2xvciIsIkljb25Sb3VuZFNtYWxsIiwiZGl2Iiwic2Vjb25kYXJ5QnRuQmdkSG92ZXIiLCJzZWNvbmRhcnlCdG5Db2xvciIsIkNlbnRlckZsZXhib3giLCJDZW50ZXJWZXJ0aWNhbEZsZXhib3giLCJTcGFjZUJldHdlZW5GbGV4Ym94IiwiU0JGbGV4Ym94SXRlbSIsIlNCRmxleGJveE5vTWFyZ2luIiwiUGFuZWxMYWJlbCIsImxhYmVsIiwiYXR0cnMiLCJjbGFzc05hbWUiLCJQYW5lbExhYmVsV3JhcHBlciIsIlBhbmVsTGFiZWxCb2xkIiwiUGFuZWxIZWFkZXJUaXRsZSIsIlBhbmVsSGVhZGVyQ29udGVudCIsIlBhbmVsQ29udGVudCIsInBhbmVsQ29udGVudEJhY2tncm91bmQiLCJTaWRlUGFuZWxTZWN0aW9uIiwiZGlzYWJsZWQiLCJTaWRlUGFuZWxEaXZpZGVyIiwic2lkZXBhbmVsRGl2aWRlckJvcmRlciIsInBhbmVsQm9yZGVyQ29sb3IiLCJzaWRlcGFuZWxEaXZpZGVyTWFyZ2luIiwic2lkZXBhbmVsRGl2aWRlckhlaWdodCIsIlRvb2x0aXAiLCJSZWFjdFRvb2x0aXAiLCJ0b29sdGlwRm9udFNpemUiLCJ0b29sdGlwQm94U2hhZG93IiwidG9vbHRpcEJnIiwidG9vbHRpcENvbG9yIiwiQnV0dG9uIiwibmVnYXRpdmUiLCJuZWdhdGl2ZUJ0bkJnZCIsInNlY29uZGFyeSIsInNlY29uZGFyeUJ0bkJnZCIsImxpbmsiLCJsaW5rQnRuQmdkIiwiZmxvYXRpbmciLCJmbG9hdGluZ0J0bkJnZCIsImN0YSIsImN0YUJ0bkJnZCIsInByaW1hcnlCdG5CZ2QiLCJwcmltYXJ5QnRuUmFkaXVzIiwibmVnYXRpdmVCdG5Db2xvciIsImxpbmtCdG5Db2xvciIsImZsb2F0aW5nQnRuQ29sb3IiLCJjdGFCdG5Db2xvciIsInByaW1hcnlCdG5Db2xvciIsImxhcmdlIiwicHJpbWFyeUJ0bkZvbnRTaXplTGFyZ2UiLCJzbWFsbCIsInByaW1hcnlCdG5Gb250U2l6ZVNtYWxsIiwicHJpbWFyeUJ0bkZvbnRTaXplRGVmYXVsdCIsImJ0bkZvbnRGYW1pbHkiLCJ0cmFuc2l0aW9uIiwid2lkdGgiLCJuZWdhdGl2ZUJ0bkJvcmRlciIsInNlY29uZGFyeUJ0bkJvcmRlciIsImZsb2F0aW5nQnRuQm9yZGVyIiwibGlua0J0bkJvcmRlciIsInByaW1hcnlCdG5Cb3JkZXIiLCJuZWdhdGl2ZUJ0bkJnZEhvdmVyIiwibGlua0J0bkFjdEJnZEhvdmVyIiwiZmxvYXRpbmdCdG5CZ2RIb3ZlciIsImN0YUJ0bkJnZEhvdmVyIiwicHJpbWFyeUJ0bkJnZEhvdmVyIiwibmVnYXRpdmVCdG5BY3RDb2xvciIsInNlY29uZGFyeUJ0bkFjdENvbG9yIiwibGlua0J0bkFjdENvbG9yIiwiZmxvYXRpbmdCdG5BY3RDb2xvciIsImN0YUJ0bkFjdENvbG9yIiwicHJpbWFyeUJ0bkFjdENvbG9yIiwiSW5wdXQiLCJpbnB1dCIsInNlY29uZGFyeUlucHV0IiwiSW5wdXRMaWdodCIsImlucHV0TFQiLCJUZXh0QXJlYSIsInRleHRhcmVhIiwiVGV4dEFyZWFMaWdodCIsIklubGluZUlucHV0IiwiaW5saW5lSW5wdXQiLCJTdHlsZWRQYW5lbEhlYWRlciIsImFjdGl2ZSIsInBhbmVsQmFja2dyb3VuZEhvdmVyIiwicGFuZWxCYWNrZ3JvdW5kIiwibGFiZWxSQ0dDb2xvclZhbHVlcyIsImpvaW4iLCJwYW5lbEhlYWRlckhlaWdodCIsInBhbmVsSGVhZGVyQm9yZGVyUmFkaXVzIiwiU3R5bGVkUGFuZWxEcm9wZG93biIsInBhbmVsRHJvcGRvd25TY3JvbGxCYXIiLCJ0eXBlIiwibW9kYWxEcm9wZG93bkJhY2tncm91bmQiLCJwYW5lbEJveFNoYWRvdyIsInBhbmVsQm9yZGVyUmFkaXVzIiwiQnV0dG9uR3JvdXAiLCJEYXRhc2V0U3F1YXJlIiwiY29sb3IiLCJTZWxlY3Rpb25CdXR0b24iLCJzZWxlY3RlZCIsInNlbGVjdGlvbkJ0bkJvcmRlckFjdENvbG9yIiwic2VsZWN0aW9uQnRuQm9yZGVyQ29sb3IiLCJzZWxlY3Rpb25CdG5BY3RDb2xvciIsInNlbGVjdGlvbkJ0bkNvbG9yIiwic2VsZWN0aW9uQnRuQWN0QmdkIiwic2VsZWN0aW9uQnRuQmdkIiwiVGFibGUiLCJ0YWJsZSIsInBhbmVsQmFja2dyb3VuZExUIiwidGl0bGVDb2xvckxUIiwicGFuZWxCb3JkZXJMVCIsIlN0eWxlZE1vZGFsQ29udGVudCIsInRleHRDb2xvckxUIiwibW9kYWxMYXRlcmFsUGFkZGluZyIsIm1lZGlhIiwicG9ydGFibGUiLCJtb2RhbFBvcnRhYmxlTGF0ZXJhbFBhZGRpbmciLCJTdHlsZWRNb2RhbFZlcnRpY2FsUGFuZWwiLCJwYWxtIiwiU3R5bGVkTW9kYWxTZWN0aW9uIiwic3VidGV4dENvbG9yTFQiLCJTdHlsZWRNb2RhbElucHV0Rm9vdG5vdGUiLCJlcnJvciIsImVycm9yQ29sb3IiLCJTdHlsZWRNYXBDb250YWluZXIiLCJTdHlsZWRBdHRyYnV0aW9uIiwiU3R5bGVkRXhwb3J0U2VjdGlvbiIsIlN0eWxlZEZpbHRlcmVkT3B0aW9uIiwiU3R5bGVkVHlwZSIsIldpZGdldENvbnRhaW5lciIsIkJvdHRvbVdpZGdldElubmVyIiwiYm90dG9tV2lkZ2V0QmdkIiwiYm90dG9tSW5uZXJQZFZlcnQiLCJib3R0b21Jbm5lclBkU2lkZSIsImJvdHRvbVBhbmVsR2FwIiwiTWFwQ29udHJvbEJ1dHRvbiIsImZsb2F0aW5nQnRuQm9yZGVySG92ZXIiLCJTdHlsZWRGaWx0ZXJDb250ZW50IiwiVHJ1bmNhdGVkVGl0bGVUZXh0IiwiQ2hlY2tNYXJrIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUVP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LEtBQVosQ0FBa0I7QUFDekNDLEVBQUFBLFNBQVMsRUFBRTtBQUQ4QixDQUFsQixDQUFILDJpQkFHQSxVQUFBbEIsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZNEcsMEJBQWhCO0FBQUEsQ0FITCxDQUFmIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgUmVhY3RUb29sdGlwIGZyb20gJ3JlYWN0LXRvb2x0aXAnO1xuaW1wb3J0IHttZWRpYX0gZnJvbSAnc3R5bGVzL21lZGlhLWJyZWFrcG9pbnRzJztcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuXG5leHBvcnQgY29uc3QgU2VsZWN0VGV4dCA9IHN0eWxlZC5zcGFuYFxuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5sYWJlbENvbG9yfTtcbiAgZm9udC1zaXplOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlbGVjdEZvbnRTaXplfTtcbiAgZm9udC13ZWlnaHQ6IDQwMDtcblxuICBpIHtcbiAgICBmb250LXNpemU6IDEzcHg7XG4gICAgbWFyZ2luLXJpZ2h0OiA2cHg7XG4gIH1cbmA7XG5cbmV4cG9ydCBjb25zdCBTZWxlY3RUZXh0Qm9sZCA9IHN0eWxlZChTZWxlY3RUZXh0KWBcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yfTtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbmA7XG5cbmV4cG9ydCBjb25zdCBJY29uUm91bmRTbWFsbCA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIHdpZHRoOiAxOHB4O1xuICBoZWlnaHQ6IDE4cHg7XG4gIGJvcmRlci1yYWRpdXM6IDlweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWNvbmRhcnlCdG5CZ2RIb3Zlcn07XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlY29uZGFyeUJ0bkNvbG9yfTtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cbiAgOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWNvbmRhcnlCdG5CZ2RIb3Zlcn07XG4gIH1cbmA7XG5cbmV4cG9ydCBjb25zdCBDZW50ZXJGbGV4Ym94ID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbmA7XG5cbmV4cG9ydCBjb25zdCBDZW50ZXJWZXJ0aWNhbEZsZXhib3ggPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuYDtcblxuZXhwb3J0IGNvbnN0IFNwYWNlQmV0d2VlbkZsZXhib3ggPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIG1hcmdpbi1sZWZ0OiAtMTZweDtcbmA7XG5cbmV4cG9ydCBjb25zdCBTQkZsZXhib3hJdGVtID0gc3R5bGVkLmRpdmBcbiAgZmxleC1ncm93OiAxO1xuICBtYXJnaW4tbGVmdDogMTZweDtcbmA7XG5cbmV4cG9ydCBjb25zdCBTQkZsZXhib3hOb01hcmdpbiA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbmA7XG5cbmV4cG9ydCBjb25zdCBQYW5lbExhYmVsID0gc3R5bGVkLmxhYmVsLmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnc2lkZS1wYW5lbC1wYW5lbF9fbGFiZWwnXG59KWBcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGFiZWxDb2xvcn07XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgZm9udC1zaXplOiAxMXB4O1xuICBmb250LXdlaWdodDogNDAwO1xuICBtYXJnaW4tYm90dG9tOiA0cHg7XG4gIHRleHQtdHJhbnNmb3JtOiBjYXBpdGFsaXplO1xuYDtcblxuZXhwb3J0IGNvbnN0IFBhbmVsTGFiZWxXcmFwcGVyID0gc3R5bGVkLmRpdi5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ3NpZGUtcGFuZWwtcGFuZWxfX2xhYmVsLXdyYXBwZXInXG59KWBcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IHNlbGYtc3RhcnQ7XG5gO1xuXG5leHBvcnQgY29uc3QgUGFuZWxMYWJlbEJvbGQgPSBzdHlsZWQoUGFuZWxMYWJlbClgXG4gIGZvbnQtd2VpZ2h0OiA1MDA7XG5gO1xuXG5leHBvcnQgY29uc3QgUGFuZWxIZWFkZXJUaXRsZSA9IHN0eWxlZC5zcGFuLmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnc2lkZS1wYW5lbC1wYW5lbF9faGVhZGVyX190aXRsZSdcbn0pYFxuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuICBmb250LXNpemU6IDEzcHg7XG4gIGxldHRlci1zcGFjaW5nOiAwLjQzcHg7XG4gIHRleHQtdHJhbnNmb3JtOiBjYXBpdGFsaXplO1xuYDtcblxuZXhwb3J0IGNvbnN0IFBhbmVsSGVhZGVyQ29udGVudCA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvcn07XG4gIHBhZGRpbmctbGVmdDogMTJweDtcblxuICAuaWNvbiB7XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGFiZWxDb2xvcn07XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIG1hcmdpbi1yaWdodDogMTJweDtcbiAgfVxuYDtcblxuZXhwb3J0IGNvbnN0IFBhbmVsQ29udGVudCA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdzaWRlLXBhbmVsLXBhbmVsX19jb250ZW50J1xufSlgXG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucGFuZWxDb250ZW50QmFja2dyb3VuZH07XG4gIHBhZGRpbmc6IDEycHg7XG5gO1xuXG5leHBvcnQgY29uc3QgU2lkZVBhbmVsU2VjdGlvbiA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdzaWRlLXBhbmVsLXNlY3Rpb24nXG59KWBcbiAgbWFyZ2luLWJvdHRvbTogMTJweDtcblxuICBvcGFjaXR5OiAke3Byb3BzID0+IChwcm9wcy5kaXNhYmxlZCA/IDAuNCA6IDEpfTtcbiAgcG9pbnRlci1ldmVudHM6ICR7cHJvcHMgPT4gKHByb3BzLmRpc2FibGVkID8gJ25vbmUnIDogJ2FsbCcpfTtcbmA7XG5cbmV4cG9ydCBjb25zdCBTaWRlUGFuZWxEaXZpZGVyID0gc3R5bGVkLmRpdi5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ3NpZGUtcGFuZWwtZGl2aWRlcidcbn0pYFxuICBib3JkZXItYm90dG9tOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNpZGVwYW5lbERpdmlkZXJCb3JkZXJ9IHNvbGlkXG4gICAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJvcmRlckNvbG9yfTtcbiAgbWFyZ2luLWJvdHRvbTogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zaWRlcGFuZWxEaXZpZGVyTWFyZ2lufXB4O1xuICBoZWlnaHQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2lkZXBhbmVsRGl2aWRlckhlaWdodH1weDtcbmA7XG5cbmV4cG9ydCBjb25zdCBUb29sdGlwID0gc3R5bGVkKFJlYWN0VG9vbHRpcClgXG4gICYuX19yZWFjdF9jb21wb25lbnRfdG9vbHRpcCB7XG4gICAgZm9udC1zaXplOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRvb2x0aXBGb250U2l6ZX07XG4gICAgZm9udC13ZWlnaHQ6IDQwMDtcbiAgICBwYWRkaW5nOiA3cHggMThweDtcbiAgICBib3gtc2hhZG93OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRvb2x0aXBCb3hTaGFkb3d9O1xuXG4gICAgJi50eXBlLWRhcmsge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50b29sdGlwQmd9O1xuICAgICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudG9vbHRpcENvbG9yfTtcbiAgICAgICYucGxhY2UtYm90dG9tIHtcbiAgICAgICAgOmFmdGVyIHtcbiAgICAgICAgICBib3JkZXItYm90dG9tLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRvb2x0aXBCZ307XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgJi5wbGFjZS10b3Age1xuICAgICAgICA6YWZ0ZXIge1xuICAgICAgICAgIGJvcmRlci10b3AtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudG9vbHRpcEJnfTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAmLnBsYWNlLXJpZ2h0IHtcbiAgICAgICAgOmFmdGVyIHtcbiAgICAgICAgICBib3JkZXItcmlnaHQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudG9vbHRpcEJnfTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAmLnBsYWNlLWxlZnQge1xuICAgICAgICA6YWZ0ZXIge1xuICAgICAgICAgIGJvcmRlci1sZWZ0LWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRvb2x0aXBCZ307XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbmA7XG5cbmV4cG9ydCBjb25zdCBCdXR0b24gPSBzdHlsZWQuZGl2LmF0dHJzKHByb3BzID0+ICh7XG4gIGNsYXNzTmFtZTogY2xhc3NuYW1lcygnYnV0dG9uJywgcHJvcHMuY2xhc3NOYW1lKVxufSkpYFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+XG4gICAgcHJvcHMubmVnYXRpdmVcbiAgICAgID8gcHJvcHMudGhlbWUubmVnYXRpdmVCdG5CZ2RcbiAgICAgIDogcHJvcHMuc2Vjb25kYXJ5XG4gICAgICA/IHByb3BzLnRoZW1lLnNlY29uZGFyeUJ0bkJnZFxuICAgICAgOiBwcm9wcy5saW5rXG4gICAgICA/IHByb3BzLnRoZW1lLmxpbmtCdG5CZ2RcbiAgICAgIDogcHJvcHMuZmxvYXRpbmdcbiAgICAgID8gcHJvcHMudGhlbWUuZmxvYXRpbmdCdG5CZ2RcbiAgICAgIDogcHJvcHMuY3RhXG4gICAgICA/IHByb3BzLnRoZW1lLmN0YUJ0bkJnZFxuICAgICAgOiBwcm9wcy50aGVtZS5wcmltYXJ5QnRuQmdkfTtcbiAgYm9yZGVyLXJhZGl1czogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wcmltYXJ5QnRuUmFkaXVzfTtcbiAgY29sb3I6ICR7cHJvcHMgPT5cbiAgICBwcm9wcy5uZWdhdGl2ZVxuICAgICAgPyBwcm9wcy50aGVtZS5uZWdhdGl2ZUJ0bkNvbG9yXG4gICAgICA6IHByb3BzLnNlY29uZGFyeVxuICAgICAgPyBwcm9wcy50aGVtZS5zZWNvbmRhcnlCdG5Db2xvclxuICAgICAgOiBwcm9wcy5saW5rXG4gICAgICA/IHByb3BzLnRoZW1lLmxpbmtCdG5Db2xvclxuICAgICAgOiBwcm9wcy5mbG9hdGluZ1xuICAgICAgPyBwcm9wcy50aGVtZS5mbG9hdGluZ0J0bkNvbG9yXG4gICAgICA6IHByb3BzLmN0YVxuICAgICAgPyBwcm9wcy50aGVtZS5jdGFCdG5Db2xvclxuICAgICAgOiBwcm9wcy50aGVtZS5wcmltYXJ5QnRuQ29sb3J9O1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICBmb250LXNpemU6ICR7cHJvcHMgPT5cbiAgICBwcm9wcy5sYXJnZVxuICAgICAgPyBwcm9wcy50aGVtZS5wcmltYXJ5QnRuRm9udFNpemVMYXJnZVxuICAgICAgOiBwcm9wcy5zbWFsbFxuICAgICAgPyBwcm9wcy50aGVtZS5wcmltYXJ5QnRuRm9udFNpemVTbWFsbFxuICAgICAgOiBwcm9wcy50aGVtZS5wcmltYXJ5QnRuRm9udFNpemVEZWZhdWx0fTtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgZm9udC1mYW1pbHk6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuYnRuRm9udEZhbWlseX07XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBsZXR0ZXItc3BhY2luZzogMC4zcHg7XG4gIGxpbmUtaGVpZ2h0OiAxNHB4O1xuICBvdXRsaW5lOiAwO1xuICBwYWRkaW5nOiAke3Byb3BzID0+IChwcm9wcy5sYXJnZSA/ICcxNHB4IDMycHgnIDogcHJvcHMuc21hbGwgPyAnNnB4IDlweCcgOiAnOXB4IDEycHgnKX07XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgdHJhbnNpdGlvbjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50cmFuc2l0aW9ufTtcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgd2lkdGg6ICR7cHJvcHMgPT4gcHJvcHMud2lkdGggfHwgJ2F1dG8nfTtcbiAgb3BhY2l0eTogJHtwcm9wcyA9PiAocHJvcHMuZGlzYWJsZWQgPyAwLjQgOiAxKX07XG4gIHBvaW50ZXItZXZlbnRzOiAke3Byb3BzID0+IChwcm9wcy5kaXNhYmxlZCA/ICdub25lJyA6ICdhbGwnKX07XG4gIGJvcmRlcjogJHtwcm9wcyA9PlxuICAgIHByb3BzLm5lZ2F0aXZlXG4gICAgICA/IHByb3BzLnRoZW1lLm5lZ2F0aXZlQnRuQm9yZGVyXG4gICAgICA6IHByb3BzLnNlY29uZGFyeVxuICAgICAgPyBwcm9wcy50aGVtZS5zZWNvbmRhcnlCdG5Cb3JkZXJcbiAgICAgIDogcHJvcHMuZmxvYXRpbmdcbiAgICAgID8gcHJvcHMudGhlbWUuZmxvYXRpbmdCdG5Cb3JkZXJcbiAgICAgIDogcHJvcHMubGlua1xuICAgICAgPyBwcm9wcy50aGVtZS5saW5rQnRuQm9yZGVyXG4gICAgICA6IHByb3BzLnRoZW1lLnByaW1hcnlCdG5Cb3JkZXJ9O1xuICA6aG92ZXIsXG4gIDpmb2N1cyxcbiAgOmFjdGl2ZSxcbiAgJi5hY3RpdmUge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT5cbiAgICAgIHByb3BzLm5lZ2F0aXZlXG4gICAgICAgID8gcHJvcHMudGhlbWUubmVnYXRpdmVCdG5CZ2RIb3ZlclxuICAgICAgICA6IHByb3BzLnNlY29uZGFyeVxuICAgICAgICA/IHByb3BzLnRoZW1lLnNlY29uZGFyeUJ0bkJnZEhvdmVyXG4gICAgICAgIDogcHJvcHMubGlua1xuICAgICAgICA/IHByb3BzLnRoZW1lLmxpbmtCdG5BY3RCZ2RIb3ZlclxuICAgICAgICA6IHByb3BzLmZsb2F0aW5nXG4gICAgICAgID8gcHJvcHMudGhlbWUuZmxvYXRpbmdCdG5CZ2RIb3ZlclxuICAgICAgICA6IHByb3BzLmN0YVxuICAgICAgICA/IHByb3BzLnRoZW1lLmN0YUJ0bkJnZEhvdmVyXG4gICAgICAgIDogcHJvcHMudGhlbWUucHJpbWFyeUJ0bkJnZEhvdmVyfTtcbiAgICBjb2xvcjogJHtwcm9wcyA9PlxuICAgICAgcHJvcHMubmVnYXRpdmVcbiAgICAgICAgPyBwcm9wcy50aGVtZS5uZWdhdGl2ZUJ0bkFjdENvbG9yXG4gICAgICAgIDogcHJvcHMuc2Vjb25kYXJ5XG4gICAgICAgID8gcHJvcHMudGhlbWUuc2Vjb25kYXJ5QnRuQWN0Q29sb3JcbiAgICAgICAgOiBwcm9wcy5saW5rXG4gICAgICAgID8gcHJvcHMudGhlbWUubGlua0J0bkFjdENvbG9yXG4gICAgICAgIDogcHJvcHMuZmxvYXRpbmdcbiAgICAgICAgPyBwcm9wcy50aGVtZS5mbG9hdGluZ0J0bkFjdENvbG9yXG4gICAgICAgIDogcHJvcHMuY3RhXG4gICAgICAgID8gcHJvcHMudGhlbWUuY3RhQnRuQWN0Q29sb3JcbiAgICAgICAgOiBwcm9wcy50aGVtZS5wcmltYXJ5QnRuQWN0Q29sb3J9O1xuICB9XG5cbiAgc3ZnIHtcbiAgICBtYXJnaW4tcmlnaHQ6ICR7cHJvcHMgPT4gKHByb3BzLmxhcmdlID8gJzEwcHgnIDogcHJvcHMuc21hbGwgPyAnNnB4JyA6ICc4cHgnKX07XG4gIH1cbmA7XG5cbmV4cG9ydCBjb25zdCBJbnB1dCA9IHN0eWxlZC5pbnB1dGBcbiAgJHtwcm9wcyA9PiAocHJvcHMuc2Vjb25kYXJ5ID8gcHJvcHMudGhlbWUuc2Vjb25kYXJ5SW5wdXQgOiBwcm9wcy50aGVtZS5pbnB1dCl9O1xuYDtcblxuZXhwb3J0IGNvbnN0IElucHV0TGlnaHQgPSBzdHlsZWQuaW5wdXRgXG4gICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaW5wdXRMVH07XG5gO1xuXG5leHBvcnQgY29uc3QgVGV4dEFyZWEgPSBzdHlsZWQudGV4dGFyZWFgXG4gICR7cHJvcHMgPT4gKHByb3BzLnNlY29uZGFyeSA/IHByb3BzLnRoZW1lLnNlY29uZGFyeUlucHV0IDogcHJvcHMudGhlbWUuaW5wdXQpfTtcbmA7XG5leHBvcnQgY29uc3QgVGV4dEFyZWFMaWdodCA9IHN0eWxlZC50ZXh0YXJlYWBcbiAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5pbnB1dExUfSBoZWlnaHQ6IGF1dG87XG4gIHdoaXRlLXNwYWNlOiBwcmUtd3JhcDtcbmA7XG5cbmV4cG9ydCBjb25zdCBJbmxpbmVJbnB1dCA9IHN0eWxlZChJbnB1dClgXG4gICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaW5saW5lSW5wdXR9O1xuYDtcblxuZXhwb3J0IGNvbnN0IFN0eWxlZFBhbmVsSGVhZGVyID0gc3R5bGVkLmRpdmBcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PlxuICAgIHByb3BzLmFjdGl2ZSA/IHByb3BzLnRoZW1lLnBhbmVsQmFja2dyb3VuZEhvdmVyIDogcHJvcHMudGhlbWUucGFuZWxCYWNrZ3JvdW5kfTtcbiAgYm9yZGVyLWxlZnQ6IDNweCBzb2xpZFxuICAgIHJnYihcbiAgICAgICR7cHJvcHMgPT4gKHByb3BzLmxhYmVsUkNHQ29sb3JWYWx1ZXMgPyBwcm9wcy5sYWJlbFJDR0NvbG9yVmFsdWVzLmpvaW4oJywnKSA6ICd0cmFuc3BhcmVudCcpfVxuICAgICk7XG4gIHBhZGRpbmc6IDAgMTBweCAwIDA7XG4gIGhlaWdodDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEhlYWRlckhlaWdodH1weDtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBib3JkZXItcmFkaXVzOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsSGVhZGVyQm9yZGVyUmFkaXVzfTtcbiAgdHJhbnNpdGlvbjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50cmFuc2l0aW9ufTtcbmA7XG5cbmV4cG9ydCBjb25zdCBTdHlsZWRQYW5lbERyb3Bkb3duID0gc3R5bGVkLmRpdmBcbiAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbERyb3Bkb3duU2Nyb2xsQmFyfVxuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+XG4gICAgcHJvcHMudHlwZSA9PT0gJ2xpZ2h0JyA/IHByb3BzLnRoZW1lLm1vZGFsRHJvcGRvd25CYWNrZ3JvdW5kIDogcHJvcHMudGhlbWUucGFuZWxCYWNrZ3JvdW5kfTtcbiAgb3ZlcmZsb3cteTogYXV0bztcbiAgYm94LXNoYWRvdzogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJveFNoYWRvd307XG4gIGJvcmRlci1yYWRpdXM6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucGFuZWxCb3JkZXJSYWRpdXN9O1xuICBtYXgtaGVpZ2h0OiA1MDBweDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB6LWluZGV4OiA5OTk7XG5gO1xuXG5leHBvcnQgY29uc3QgQnV0dG9uR3JvdXAgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICAuYnV0dG9uIHtcbiAgICBib3JkZXItcmFkaXVzOiAwO1xuICAgIG1hcmdpbi1sZWZ0OiAycHg7XG4gIH1cbiAgLmJ1dHRvbjpmaXJzdC1jaGlsZCB7XG4gICAgYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wcmltYXJ5QnRuUmFkaXVzfTtcbiAgICBib3JkZXItdG9wLWxlZnQtcmFkaXVzOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnByaW1hcnlCdG5SYWRpdXN9O1xuICAgIG1hcmdpbi1sZWZ0OiAwO1xuICB9XG4gIC5idXR0b246bGFzdC1jaGlsZCB7XG4gICAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucHJpbWFyeUJ0blJhZGl1c307XG4gICAgYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucHJpbWFyeUJ0blJhZGl1c307XG4gIH1cbmA7XG5cbmV4cG9ydCBjb25zdCBEYXRhc2V0U3F1YXJlID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICB3aWR0aDogOHB4O1xuICBoZWlnaHQ6IDhweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKCR7cHJvcHMgPT4gcHJvcHMuY29sb3Iuam9pbignLCcpfSk7XG4gIG1hcmdpbi1yaWdodDogMTJweDtcbmA7XG5cbmV4cG9ydCBjb25zdCBTZWxlY3Rpb25CdXR0b24gPSBzdHlsZWQuZGl2YFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGJvcmRlci1yYWRpdXM6IDJweDtcbiAgYm9yZGVyOiAxcHggc29saWRcbiAgICAke3Byb3BzID0+XG4gICAgICBwcm9wcy5zZWxlY3RlZFxuICAgICAgICA/IHByb3BzLnRoZW1lLnNlbGVjdGlvbkJ0bkJvcmRlckFjdENvbG9yXG4gICAgICAgIDogcHJvcHMudGhlbWUuc2VsZWN0aW9uQnRuQm9yZGVyQ29sb3J9O1xuICBjb2xvcjogJHtwcm9wcyA9PlxuICAgIHByb3BzLnNlbGVjdGVkID8gcHJvcHMudGhlbWUuc2VsZWN0aW9uQnRuQWN0Q29sb3IgOiBwcm9wcy50aGVtZS5zZWxlY3Rpb25CdG5Db2xvcn07XG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT5cbiAgICBwcm9wcy5zZWxlY3RlZCA/IHByb3BzLnRoZW1lLnNlbGVjdGlvbkJ0bkFjdEJnZCA6IHByb3BzLnRoZW1lLnNlbGVjdGlvbkJ0bkJnZH07XG5cbiAgY3Vyc29yOiBwb2ludGVyO1xuICBmb250LXdlaWdodDogNTAwO1xuICBtYXJnaW4tcmlnaHQ6IDZweDtcbiAgcGFkZGluZzogNnB4IDE2cHg7XG5cbiAgOmhvdmVyIHtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWxlY3Rpb25CdG5BY3RDb2xvcn07XG4gICAgYm9yZGVyOiAxcHggc29saWQgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWxlY3Rpb25CdG5Cb3JkZXJBY3RDb2xvcn07XG4gIH1cbmA7XG5cbmV4cG9ydCBjb25zdCBUYWJsZSA9IHN0eWxlZC50YWJsZWBcbiAgd2lkdGg6IDEwMCU7XG4gIGJvcmRlci1zcGFjaW5nOiAwO1xuXG4gIHRoZWFkIHtcbiAgICB0ciB0aCB7XG4gICAgICBiYWNrZ3JvdW5kOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsQmFja2dyb3VuZExUfTtcbiAgICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRpdGxlQ29sb3JMVH07XG4gICAgICBwYWRkaW5nOiAxOHB4IDEycHg7XG4gICAgICB0ZXh0LWFsaWduOiBzdGFydDtcbiAgICB9XG4gIH1cblxuICB0Ym9keSB7XG4gICAgdHIgdGQge1xuICAgICAgYm9yZGVyLWJvdHRvbTogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJvcmRlckxUfTtcbiAgICAgIHBhZGRpbmc6IDEycHg7XG4gICAgfVxuICB9XG5gO1xuXG5leHBvcnQgY29uc3QgU3R5bGVkTW9kYWxDb250ZW50ID0gc3R5bGVkLmRpdmBcbiAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJhY2tncm91bmRMVH07XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckxUfTtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgZm9udC1zaXplOiAxMHB4O1xuICBwYWRkaW5nOiAyNHB4ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubW9kYWxMYXRlcmFsUGFkZGluZ307XG4gIG1hcmdpbjogMCAtJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5tb2RhbExhdGVyYWxQYWRkaW5nfTtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAke21lZGlhLnBvcnRhYmxlYFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgcGFkZGluZzogMTZweCAke3Byb3BzID0+IHByb3BzLnRoZW1lLm1vZGFsUG9ydGFibGVMYXRlcmFsUGFkZGluZ307XG4gICAgbWFyZ2luOiAwIC0ke3Byb3BzID0+IHByb3BzLnRoZW1lLm1vZGFsUG9ydGFibGVMYXRlcmFsUGFkZGluZ307XG4gIGB9O1xuYDtcblxuZXhwb3J0IGNvbnN0IFN0eWxlZE1vZGFsVmVydGljYWxQYW5lbCA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdtb2RhbC12ZXJ0aWNhbC1wYW5lbCdcbn0pYFxuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcbiAgZm9udC1zaXplOiAxMnB4O1xuXG4gIC5tb2RhbC1zZWN0aW9uOmZpcnN0LWNoaWxkIHtcbiAgICBtYXJnaW4tdG9wOiAyNHB4O1xuICAgICR7bWVkaWEucGFsbWBcbiAgICAgIG1hcmdpbi10b3A6IDA7XG4gICAgYH07XG4gIH1cblxuICBpbnB1dCB7XG4gICAgbWFyZ2luLXJpZ2h0OiA4cHg7XG4gIH1cbmA7XG5cbmV4cG9ydCBjb25zdCBTdHlsZWRNb2RhbFNlY3Rpb24gPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnbW9kYWwtc2VjdGlvbidcbn0pYFxuICBtYXJnaW4tYm90dG9tOiAzMnB4O1xuXG4gIC5tb2RhbC1zZWN0aW9uLXRpdGxlIHtcbiAgICBmb250LXdlaWdodDogNTAwO1xuICB9XG4gIC5tb2RhbC1zZWN0aW9uLXN1YnRpdGxlIHtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zdWJ0ZXh0Q29sb3JMVH07XG4gIH1cblxuICBpbnB1dCB7XG4gICAgbWFyZ2luLXRvcDogOHB4O1xuICB9XG5cbiAgJHttZWRpYS5wb3J0YWJsZWBcbiAgICBtYXJnaW4tYm90dG9tOiAyNHB4O1xuICBgfTtcbiAgJHttZWRpYS5wYWxtYFxuICAgIG1hcmdpbi1ib3R0b206IDE2cHg7XG4gIGB9O1xuYDtcblxuZXhwb3J0IGNvbnN0IFN0eWxlZE1vZGFsSW5wdXRGb290bm90ZSA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdtb2RhbC1pbnB1dF9fZm9vdG5vdGUnXG59KWBcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgY29sb3I6ICR7cHJvcHMgPT4gKHByb3BzLmVycm9yID8gcHJvcHMudGhlbWUuZXJyb3JDb2xvciA6IHByb3BzLnRoZW1lLnN1YnRleHRDb2xvckxUKX07XG4gIGZvbnQtc2l6ZTogMTBweDtcbmA7XG4vKipcbiAqIE5ld2VyIHZlcnNpb25zIG9mIG1hcGJveC5nbCBkaXNwbGF5IGFuIGVycm9yIG1lc3NhZ2UgYmFubmVyIG9uIHRvcCBvZiB0aGUgbWFwIGJ5IGRlZmF1bHRcbiAqIHdoaWNoIHdpbGwgY2F1c2UgdGhlIG1hcCB0byBkaXNwbGF5IHBvaW50cyBpbiB0aGUgd3JvbmcgbG9jYXRpb25zXG4gKiBUaGlzIHdvcmthcm91bmQgd2lsbCBoaWRlIHRoZSBlcnJvciBiYW5uZXIuXG4gKi9cbmV4cG9ydCBjb25zdCBTdHlsZWRNYXBDb250YWluZXIgPSBzdHlsZWQuZGl2YFxuICAubWFwYm94Z2wtbWFwIHtcbiAgICAubWFwYm94Z2wtbWlzc2luZy1jc3Mge1xuICAgICAgZGlzcGxheTogbm9uZTtcbiAgICB9XG4gICAgLm1hcGJveGdsLWN0cmwtYXR0cmliIHtcbiAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgfVxuICB9XG5gO1xuXG5leHBvcnQgY29uc3QgU3R5bGVkQXR0cmJ1dGlvbiA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdtYXBib3gtYXR0cmlidXRpb24tY29udGFpbmVyJ1xufSlgXG4gIGJvdHRvbTogMDtcbiAgcmlnaHQ6IDA7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgZGlzcGxheTogYmxvY2s7XG4gIG1hcmdpbjogMCAxMHB4IDJweDtcbiAgei1pbmRleDogMDtcblxuICAuYXR0cml0aW9uLWxvZ28ge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZm9udC1zaXplOiAxMHB4O1xuICAgIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5sYWJlbENvbG9yfTtcbiAgICBtYXJnaW4tYm90dG9tOiAtNHB4O1xuXG4gICAgYS5tYXBib3hnbC1jdHJsLWxvZ28ge1xuICAgICAgd2lkdGg6IDcycHg7XG4gICAgICBtYXJnaW4tbGVmdDogNnB4O1xuICAgIH1cbiAgfVxuICBhIHtcbiAgICBmb250LXNpemU6IDEwcHg7XG4gIH1cbmA7XG5cbmV4cG9ydCBjb25zdCBTdHlsZWRFeHBvcnRTZWN0aW9uID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgbWFyZ2luOiAzNXB4IDA7XG4gIHdpZHRoOiAxMDAlO1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JMVH07XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgb3BhY2l0eTogJHtwcm9wcyA9PiAocHJvcHMuZGlzYWJsZWQgPyAwLjMgOiAxKX07XG4gIHBvaW50ZXItZXZlbnRzOiAke3Byb3BzID0+IChwcm9wcy5kaXNhYmxlZCA/ICdub25lJyA6ICdhbGwnKX07XG5cbiAgLmRlc2NyaXB0aW9uIHtcbiAgICB3aWR0aDogMTg1cHg7XG4gICAgLnRpdGxlIHtcbiAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgfVxuICAgIC5zdWJ0aXRsZSB7XG4gICAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zdWJ0ZXh0Q29sb3JMVH07XG4gICAgICBmb250LXNpemU6IDExcHg7XG4gICAgfVxuICB9XG4gIC53YXJuaW5nIHtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5lcnJvckNvbG9yfTtcbiAgICBmb250LXdlaWdodDogNTAwO1xuICB9XG4gIC5kZXNjcmlwdGlvbi5mdWxsIHtcbiAgICB3aWR0aDogMTAwJTtcbiAgfVxuICAuc2VsZWN0aW9uIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtd3JhcDogd3JhcDtcbiAgICBmbGV4OiAxO1xuICAgIHBhZGRpbmctbGVmdDogNTBweDtcblxuICAgIHNlbGVjdCB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDFweDtcbiAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgIGZvbnQ6IGluaGVyaXQ7XG4gICAgICBsaW5lLWhlaWdodDogMS41ZW07XG4gICAgICBwYWRkaW5nOiAwLjVlbSAzLjVlbSAwLjVlbSAxZW07XG4gICAgICBtYXJnaW46IDA7XG4gICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgYXBwZWFyYW5jZTogbm9uZTtcbiAgICAgIHdpZHRoOiAyNTBweDtcbiAgICAgIGhlaWdodDogMzZweDtcblxuICAgICAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KDQ1ZGVnLCB0cmFuc3BhcmVudCA1MCUsIGdyYXkgNTAlKSxcbiAgICAgICAgbGluZWFyLWdyYWRpZW50KDEzNWRlZywgZ3JheSA1MCUsIHRyYW5zcGFyZW50IDUwJSksIGxpbmVhci1ncmFkaWVudCh0byByaWdodCwgI2NjYywgI2NjYyk7XG4gICAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjYWxjKDEwMCUgLSAyMHB4KSBjYWxjKDFlbSArIDJweCksIGNhbGMoMTAwJSAtIDE1cHgpIGNhbGMoMWVtICsgMnB4KSxcbiAgICAgICAgY2FsYygxMDAlIC0gMi41ZW0pIDQuNWVtO1xuICAgICAgYmFja2dyb3VuZC1zaXplOiA1cHggNXB4LCA1cHggNXB4LCAxcHggMS41ZW07XG4gICAgICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xuICAgIH1cblxuICAgIHNlbGVjdDpmb2N1cyB7XG4gICAgICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoNDVkZWcsIGdyZWVuIDUwJSwgdHJhbnNwYXJlbnQgNTAlKSxcbiAgICAgICAgbGluZWFyLWdyYWRpZW50KDEzNWRlZywgdHJhbnNwYXJlbnQgNTAlLCBncmVlbiA1MCUpLCBsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsICNjY2MsICNjY2MpO1xuICAgICAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2FsYygxMDAlIC0gMTVweCkgMWVtLCBjYWxjKDEwMCUgLSAyMHB4KSAxZW0sIGNhbGMoMTAwJSAtIDIuNWVtKSA0LjVlbTtcbiAgICAgIGJhY2tncm91bmQtc2l6ZTogNXB4IDVweCwgNXB4IDVweCwgMXB4IDEuNWVtO1xuICAgICAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcbiAgICAgIGJvcmRlci1jb2xvcjogZ3JlZW47XG4gICAgICBvdXRsaW5lOiAwO1xuICAgIH1cbiAgfVxuYDtcblxuZXhwb3J0IGNvbnN0IFN0eWxlZEZpbHRlcmVkT3B0aW9uID0gc3R5bGVkKFNlbGVjdGlvbkJ1dHRvbilgXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBtYXJnaW46IDRweDtcbiAgcGFkZGluZzogOHB4IDEycHg7XG4gIHdpZHRoOiAxNDBweDtcblxuICAuZmlsdGVyLW9wdGlvbi10aXRsZSB7XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yTFR9O1xuICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICBmb250LXdlaWdodDogNTAwO1xuICB9XG4gIC5maWx0ZXItb3B0aW9uLXN1YnRpdGxlIHtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zdWJ0ZXh0Q29sb3JMVH07XG4gICAgZm9udC1zaXplOiAxMXB4O1xuICB9XG5gO1xuXG5leHBvcnQgY29uc3QgU3R5bGVkVHlwZSA9IHN0eWxlZChTZWxlY3Rpb25CdXR0b24pYFxuICBoZWlnaHQ6IDEwMHB4O1xuICBtYXJnaW46IDRweDtcbiAgcGFkZGluZzogNnB4IDEwcHg7XG4gIHdpZHRoOiAxMDBweDtcbmA7XG5cbmV4cG9ydCBjb25zdCBXaWRnZXRDb250YWluZXIgPSBzdHlsZWQuZGl2YFxuICB6LWluZGV4OiAxO1xuYDtcblxuZXhwb3J0IGNvbnN0IEJvdHRvbVdpZGdldElubmVyID0gc3R5bGVkLmRpdmBcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5ib3R0b21XaWRnZXRCZ2R9O1xuICBwYWRkaW5nOiAke3Byb3BzID0+IGAke3Byb3BzLnRoZW1lLmJvdHRvbUlubmVyUGRWZXJ0fXB4ICR7cHJvcHMudGhlbWUuYm90dG9tSW5uZXJQZFNpZGV9cHhgfTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBtYXJnaW4tdG9wOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmJvdHRvbVBhbmVsR2FwfXB4O1xuYDtcblxuZXhwb3J0IGNvbnN0IE1hcENvbnRyb2xCdXR0b24gPSBzdHlsZWQoQnV0dG9uKS5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ21hcC1jb250cm9sLWJ1dHRvbidcbn0pYFxuICBib3gtc2hhZG93OiAwIDZweCAxMnB4IDAgcmdiYSgwLCAwLCAwLCAwLjE2KTtcbiAgaGVpZ2h0OiAzMnB4O1xuICB3aWR0aDogMzJweDtcbiAgcGFkZGluZzogMDtcbiAgYm9yZGVyLXJhZGl1czogMDtcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PlxuICAgIHByb3BzLmFjdGl2ZSA/IHByb3BzLnRoZW1lLmZsb2F0aW5nQnRuQmdkSG92ZXIgOiBwcm9wcy50aGVtZS5mbG9hdGluZ0J0bkJnZH07XG4gIGNvbG9yOiAke3Byb3BzID0+XG4gICAgcHJvcHMuYWN0aXZlID8gcHJvcHMudGhlbWUuZmxvYXRpbmdCdG5BY3RDb2xvciA6IHByb3BzLnRoZW1lLmZsb2F0aW5nQnRuQ29sb3J9O1xuICBib3JkZXI6ICR7cHJvcHMgPT5cbiAgICBwcm9wcy5hY3RpdmUgPyBwcm9wcy50aGVtZS5mbG9hdGluZ0J0bkJvcmRlckhvdmVyIDogcHJvcHMudGhlbWUuZmxvYXRpbmdCdG5Cb3JkZXJ9O1xuXG4gIDpob3ZlcixcbiAgOmZvY3VzLFxuICA6YWN0aXZlLFxuICAmLmFjdGl2ZSB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5mbG9hdGluZ0J0bkJnZEhvdmVyfTtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5mbG9hdGluZ0J0bkFjdENvbG9yfTtcbiAgICBib3JkZXI6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZmxvYXRpbmdCdG5Cb3JkZXJIb3Zlcn07XG4gIH1cbiAgc3ZnIHtcbiAgICBtYXJnaW4tcmlnaHQ6IDA7XG4gIH1cbmA7XG5cbmV4cG9ydCBjb25zdCBTdHlsZWRGaWx0ZXJDb250ZW50ID0gc3R5bGVkLmRpdmBcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbENvbnRlbnRCYWNrZ3JvdW5kfTtcbiAgcGFkZGluZzogMTJweDtcbmA7XG5cbmV4cG9ydCBjb25zdCBUcnVuY2F0ZWRUaXRsZVRleHQgPSBzdHlsZWQuZGl2YFxuICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbmA7XG5cbmV4cG9ydCBjb25zdCBDaGVja01hcmsgPSBzdHlsZWQuc3Bhbi5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ2NoZWNrYm94LWlubmVyJ1xufSlgXG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2VsZWN0aW9uQnRuQm9yZGVyQWN0Q29sb3J9O1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgcmlnaHQ6IDA7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICB3aWR0aDogMTBweDtcbiAgaGVpZ2h0OiAxMHB4O1xuICBib3JkZXItdG9wLWxlZnQtcmFkaXVzOiAycHg7XG5cbiAgOmFmdGVyIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgZGlzcGxheTogdGFibGU7XG4gICAgYm9yZGVyOiAxcHggc29saWQgI2ZmZjtcbiAgICBib3JkZXItdG9wOiAwO1xuICAgIGJvcmRlci1sZWZ0OiAwO1xuICAgIHRyYW5zZm9ybTogcm90YXRlKDQ1ZGVnKSBzY2FsZSgxKSB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XG4gICAgb3BhY2l0eTogMTtcbiAgICBjb250ZW50OiAnICc7XG4gICAgdG9wOiA0MCU7XG4gICAgbGVmdDogMzAlO1xuICAgIHdpZHRoOiAzLjJweDtcbiAgICBoZWlnaHQ6IDYuMjJweDtcbiAgfVxuYDtcbiJdfQ==
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StyledFilterContent = exports.MapControlButton = exports.BottomWidgetInner = exports.WidgetContainer = exports.StyledType = exports.StyledFilteredOption = exports.StyledExportSection = exports.StyledAttrbution = exports.StyledMapContainer = exports.StyledModalInputFootnote = exports.StyledModalSection = exports.StyledModalVerticalPanel = exports.StyledModalContent = exports.Table = exports.SelectionButton = exports.DatasetSquare = exports.ButtonGroup = exports.StyledPanelDropdown = exports.StyledPanelHeader = exports.InlineInput = exports.TextAreaLight = exports.TextArea = exports.InputLight = exports.Input = exports.Button = exports.Tooltip = exports.SidePanelDivider = exports.SidePanelSection = exports.PanelContent = exports.PanelHeaderContent = exports.PanelHeaderTitle = exports.PanelLabelBold = exports.PanelLabelWrapper = exports.PanelLabel = exports.SBFlexboxNoMargin = exports.SBFlexboxItem = exports.SpaceBetweenFlexbox = exports.CenterVerticalFlexbox = exports.CenterFlexbox = exports.IconRoundSmall = exports.SelectTextBold = exports.SelectText = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _reactTooltip = _interopRequireDefault(require("react-tooltip"));

var _mediaBreakpoints = require("../../styles/media-breakpoints");

var _classnames = _interopRequireDefault(require("classnames"));

function _templateObject46() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  background-color: ", ";\n  padding: 12px;\n"]);

  _templateObject46 = function _templateObject46() {
    return data;
  };

  return data;
}

function _templateObject45() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.16);\n  height: 32px;\n  width: 32px;\n  padding: 0;\n  border-radius: 0;\n  background-color: ", ";\n  color: ", ";\n\n  :hover,\n  :focus,\n  :active,\n  &.active {\n    background-color: ", ";\n    color: ", ";\n  }\n  svg {\n    margin-right: 0;\n  }\n"]);

  _templateObject45 = function _templateObject45() {
    return data;
  };

  return data;
}

function _templateObject44() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  background-color: ", ";\n  padding: ", ";\n  position: relative;\n  margin-top: ", "px;\n"]);

  _templateObject44 = function _templateObject44() {
    return data;
  };

  return data;
}

function _templateObject43() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  z-index: 1;\n"]);

  _templateObject43 = function _templateObject43() {
    return data;
  };

  return data;
}

function _templateObject42() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  border-radius: 2px;\n  border: 1px solid\n    ", ";\n  color: ", ";\n  cursor: pointer;\n  font-weight: 500;\n  height: 100px;\n  margin: 4px;\n  padding: 6px 10px;\n  width: 100px;\n\n  :hover {\n    color: ", ";\n    border: 1px solid ", ";\n  }\n"]);

  _templateObject42 = function _templateObject42() {
    return data;
  };

  return data;
}

function _templateObject41() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  align-items: center;\n  border-radius: 2px;\n  border: 1px solid\n    ", ";\n  cursor: pointer;\n  display: flex;\n  flex-direction: column;\n  height: 60px;\n  justify-content: center;\n  margin: 4px;\n  padding: 8px 12px;\n  width: 140px;\n\n  :hover {\n    border: 1px solid ", ";\n  }\n\n  .filter-option-title {\n    color: ", ";\n    font-size: 12px;\n    font-weight: 500;\n  }\n  .filter-option-subtitle {\n    color: ", ";\n    font-size: 11px;\n  }\n"]);

  _templateObject41 = function _templateObject41() {
    return data;
  };

  return data;
}

function _templateObject40() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  flex-direction: row;\n  margin: 35px 0;\n  width: 100%;\n  color: ", ";\n  font-size: 12px;\n  opacity: ", ";\n  pointer-events: ", ";\n\n  .description {\n    width: 185px;\n    .title {\n      font-weight: 500;\n    }\n    .subtitle {\n      color: ", ";\n      font-size: 11px;\n    }\n  }\n  .warning {\n    color: ", ";\n    font-weight: 500;\n  }\n  .description.full {\n    width: 100%;\n  }\n  .selection {\n    display: flex;\n    flex-wrap: wrap;\n    flex: 1;\n    padding-left: 50px;\n\n    select {\n      background-color: white;\n      border-radius: 1px;\n      display: inline-block;\n      font: inherit;\n      line-height: 1.5em;\n      padding: 0.5em 3.5em 0.5em 1em;\n      margin: 0;\n      box-sizing: border-box;\n      appearance: none;\n      width: 250px;\n      height: 36px;\n\n      background-image: linear-gradient(45deg, transparent 50%, gray 50%),\n        linear-gradient(135deg, gray 50%, transparent 50%), linear-gradient(to right, #ccc, #ccc);\n      background-position: calc(100% - 20px) calc(1em + 2px), calc(100% - 15px) calc(1em + 2px),\n        calc(100% - 2.5em) 4.5em;\n      background-size: 5px 5px, 5px 5px, 1px 1.5em;\n      background-repeat: no-repeat;\n    }\n\n    select:focus {\n      background-image: linear-gradient(45deg, green 50%, transparent 50%),\n        linear-gradient(135deg, transparent 50%, green 50%), linear-gradient(to right, #ccc, #ccc);\n      background-position: calc(100% - 15px) 1em, calc(100% - 20px) 1em, calc(100% - 2.5em) 4.5em;\n      background-size: 5px 5px, 5px 5px, 1px 1.5em;\n      background-repeat: no-repeat;\n      border-color: green;\n      outline: 0;\n    }\n  }\n"]);

  _templateObject40 = function _templateObject40() {
    return data;
  };

  return data;
}

function _templateObject39() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  bottom: 0;\n  right: 0;\n  position: absolute;\n  display: block;\n  margin: 0 10px 2px;\n  z-index: 999;\n  a {\n    color: black;\n    font-size: 10px;\n  }\n"]);

  _templateObject39 = function _templateObject39() {
    return data;
  };

  return data;
}

function _templateObject38() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  .mapboxgl-map {\n    .mapboxgl-missing-css {\n      display: none;\n    }\n    .mapboxgl-ctrl-attrib {\n      display: none;\n    }\n  }\n"]);

  _templateObject38 = function _templateObject38() {
    return data;
  };

  return data;
}

function _templateObject37() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  justify-content: flex-end;\n  color: ", ";\n  font-size: 10px;\n"]);

  _templateObject37 = function _templateObject37() {
    return data;
  };

  return data;
}

function _templateObject36() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n    margin-bottom: 16px;\n  "]);

  _templateObject36 = function _templateObject36() {
    return data;
  };

  return data;
}

function _templateObject35() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n    margin-bottom: 24px;\n  "]);

  _templateObject35 = function _templateObject35() {
    return data;
  };

  return data;
}

function _templateObject34() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  margin-bottom: 32px;\n\n  .modal-section-title {\n    font-weight: 500;\n  }\n  .modal-section-subtitle {\n    color: ", ";\n  }\n\n  input {\n    margin-top: 8px;\n  }\n\n  ", ";\n  ", ";\n"]);

  _templateObject34 = function _templateObject34() {
    return data;
  };

  return data;
}

function _templateObject33() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n      margin-top: 0;\n    "]);

  _templateObject33 = function _templateObject33() {
    return data;
  };

  return data;
}

function _templateObject32() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  flex-direction: column;\n  justify-content: space-around;\n  font-size: 12px;\n\n  .modal-section:first-child {\n    margin-top: 24px;\n    ", ";\n  }\n\n  input {\n    margin-right: 8px;\n  }\n"]);

  _templateObject32 = function _templateObject32() {
    return data;
  };

  return data;
}

function _templateObject31() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n    flex-direction: column;\n    padding: 16px ", ";\n    margin: 0 -", ";\n  "]);

  _templateObject31 = function _templateObject31() {
    return data;
  };

  return data;
}

function _templateObject30() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  background: ", ";\n  color: ", ";\n  display: flex;\n  flex-direction: row;\n  font-size: 10px;\n  padding: 24px ", ";\n  margin: 0 -", ";\n  justify-content: space-between;\n  ", ";\n"]);

  _templateObject30 = function _templateObject30() {
    return data;
  };

  return data;
}

function _templateObject29() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  width: 100%;\n  border-spacing: 0;\n\n  thead {\n    tr th {\n      background: ", ";\n      color: ", ";\n      padding: 18px 12px;\n      text-align: start;\n    }\n  }\n\n  tbody {\n    tr td {\n      border-bottom: ", ";\n      padding: 12px;\n    }\n  }\n"]);

  _templateObject29 = function _templateObject29() {
    return data;
  };

  return data;
}

function _templateObject28() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  border-radius: 2px;\n  border: 1px solid\n    ", ";\n  color: ", ";\n  cursor: pointer;\n  font-weight: 500;\n  margin-right: 6px;\n  padding: 6px 10px;\n\n  :hover {\n    color: ", ";\n    border: 1px solid ", ";\n  }\n"]);

  _templateObject28 = function _templateObject28() {
    return data;
  };

  return data;
}

function _templateObject27() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: inline-block;\n  width: 8px;\n  height: 8px;\n  background-color: rgb(", ");\n  margin-right: 12px;\n"]);

  _templateObject27 = function _templateObject27() {
    return data;
  };

  return data;
}

function _templateObject26() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  .button {\n    border-radius: 0;\n    margin-left: 2px;\n  }\n  .button:first-child {\n    border-bottom-left-radius: ", ";\n    border-top-left-radius: ", ";\n    margin-left: 0;\n  }\n  .button:last-child {\n    border-bottom-right-radius: ", ";\n    border-top-right-radius: ", ";\n  }\n"]);

  _templateObject26 = function _templateObject26() {
    return data;
  };

  return data;
}

function _templateObject25() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  ", "\n  background-color: ", ";\n  overflow-y: auto;\n  box-shadow: ", ";\n  border-radius: ", ";\n  margin-top: 2px;\n  max-height: 500px;\n  position: relative;\n  z-index: 999;\n"]);

  _templateObject25 = function _templateObject25() {
    return data;
  };

  return data;
}

function _templateObject24() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  background-color: ", ";\n  border-left: 3px solid\n    rgb(\n      ", "\n    );\n  padding: 0 10px 0 0;\n  height: ", "px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  transition: ", ";\n"]);

  _templateObject24 = function _templateObject24() {
    return data;
  };

  return data;
}

function _templateObject23() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  ", ";\n"]);

  _templateObject23 = function _templateObject23() {
    return data;
  };

  return data;
}

function _templateObject22() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  ", "\n  height: auto;\n  white-space: pre-wrap;\n"]);

  _templateObject22 = function _templateObject22() {
    return data;
  };

  return data;
}

function _templateObject21() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  ", ";\n"]);

  _templateObject21 = function _templateObject21() {
    return data;
  };

  return data;
}

function _templateObject20() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  ", "\n"]);

  _templateObject20 = function _templateObject20() {
    return data;
  };

  return data;
}

function _templateObject19() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  ", ";\n"]);

  _templateObject19 = function _templateObject19() {
    return data;
  };

  return data;
}

function _templateObject18() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  align-items: center;\n  background-color: ", ";\n  border-radius: ", ";\n  color: ", ";\n  cursor: pointer;\n  display: inline-flex;\n  font-size: ", ";\n  font-weight: 500;\n  justify-content: center;\n  letter-spacing: 0.3px;\n  line-height: 14px;\n  outline: 0;\n  padding: ", ";\n  text-align: center;\n  transition: ", ";\n  vertical-align: middle;\n  width: ", ";\n  opacity: ", ";\n  pointer-events: ", ";\n\n  :hover,\n  :focus,\n  :active,\n  &.active {\n    background-color: ", ";\n    color: ", ";\n  }\n\n  svg {\n    margin-right: ", ";\n  }\n"]);

  _templateObject18 = function _templateObject18() {
    return data;
  };

  return data;
}

function _templateObject17() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  &.__react_component_tooltip {\n    font-size: 9.5px;\n    font-weight: 500;\n    padding: 7px 18px;\n\n    &.type-dark {\n      background-color: ", ";\n      color: ", ";\n      &.place-bottom {\n        :after {\n          border-bottom-color: ", ";\n        }\n      }\n\n      &.place-top {\n        :after {\n          border-top-color: ", ";\n        }\n      }\n\n      &.place-right {\n        :after {\n          border-right-color: ", ";\n        }\n      }\n\n      &.place-left {\n        :after {\n          border-left-color: ", ";\n        }\n      }\n    }\n  }\n"]);

  _templateObject17 = function _templateObject17() {
    return data;
  };

  return data;
}

function _templateObject16() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  border-bottom: 1px solid ", ";\n  height: 12px;\n  margin-bottom: 12px;\n"]);

  _templateObject16 = function _templateObject16() {
    return data;
  };

  return data;
}

function _templateObject15() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  margin-bottom: 12px;\n  opacity: ", ";\n  pointer-events: ", ";\n"]);

  _templateObject15 = function _templateObject15() {
    return data;
  };

  return data;
}

function _templateObject14() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  background-color: ", ";\n  padding: 12px;\n"]);

  _templateObject14 = function _templateObject14() {
    return data;
  };

  return data;
}

function _templateObject13() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  align-items: center;\n  color: ", ";\n  padding-left: 12px;\n\n  .icon {\n    color: ", ";\n    display: flex;\n    align-items: center;\n    margin-right: 12px;\n  }\n"]);

  _templateObject13 = function _templateObject13() {
    return data;
  };

  return data;
}

function _templateObject12() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n  font-size: 13px;\n  letter-spacing: 0.43px;\n  text-transform: capitalize;\n"]);

  _templateObject12 = function _templateObject12() {
    return data;
  };

  return data;
}

function _templateObject11() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  font-weight: 500;\n"]);

  _templateObject11 = function _templateObject11() {
    return data;
  };

  return data;
}

function _templateObject10() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  align-items: self-start;\n"]);

  _templateObject10 = function _templateObject10() {
    return data;
  };

  return data;
}

function _templateObject9() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n  display: inline-block;\n  font-size: 11px;\n  font-weight: 400;\n  margin-bottom: 4px;\n  text-transform: capitalize;\n"]);

  _templateObject9 = function _templateObject9() {
    return data;
  };

  return data;
}

function _templateObject8() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  justify-content: space-between;\n"]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  flex-grow: 1;\n  margin-left: 16px;\n"]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  justify-content: space-between;\n  margin-left: -16px;\n"]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  align-items: center;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  width: 18px;\n  height: 18px;\n  border-radius: 9px;\n  background-color: ", "; // updated after checking sketch file\n  color: ", ";\n  align-items: center;\n  justify-content: center;\n\n  :hover {\n    cursor: pointer;\n    background-color: ", ";\n  }\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n  font-weight: 500;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n  font-size: ", ";\n  font-weight: 400;\n\n  i {\n    font-size: 13px;\n    margin-right: 6px;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var SelectText = _styledComponents["default"].span(_templateObject(), function (props) {
  return props.theme.labelColor;
}, function (props) {
  return props.theme.selectFontSize;
});

exports.SelectText = SelectText;
var SelectTextBold = (0, _styledComponents["default"])(SelectText)(_templateObject2(), function (props) {
  return props.theme.textColor;
});
exports.SelectTextBold = SelectTextBold;

var IconRoundSmall = _styledComponents["default"].div(_templateObject3(), function (props) {
  return props.theme.secondaryBtnBgdHover;
}, function (props) {
  return props.theme.secondaryBtnColor;
}, function (props) {
  return props.theme.secondaryBtnBgdHover;
});

exports.IconRoundSmall = IconRoundSmall;

var CenterFlexbox = _styledComponents["default"].div(_templateObject4());

exports.CenterFlexbox = CenterFlexbox;

var CenterVerticalFlexbox = _styledComponents["default"].div(_templateObject5());

exports.CenterVerticalFlexbox = CenterVerticalFlexbox;

var SpaceBetweenFlexbox = _styledComponents["default"].div(_templateObject6());

exports.SpaceBetweenFlexbox = SpaceBetweenFlexbox;

var SBFlexboxItem = _styledComponents["default"].div(_templateObject7());

exports.SBFlexboxItem = SBFlexboxItem;

var SBFlexboxNoMargin = _styledComponents["default"].div(_templateObject8());

exports.SBFlexboxNoMargin = SBFlexboxNoMargin;

var PanelLabel = _styledComponents["default"].label.attrs({
  className: 'side-panel-panel__label'
})(_templateObject9(), function (props) {
  return props.theme.labelColor;
});

exports.PanelLabel = PanelLabel;

var PanelLabelWrapper = _styledComponents["default"].div.attrs({
  className: 'side-panel-panel__label-wrapper'
})(_templateObject10());

exports.PanelLabelWrapper = PanelLabelWrapper;
var PanelLabelBold = (0, _styledComponents["default"])(PanelLabel)(_templateObject11());
exports.PanelLabelBold = PanelLabelBold;

var PanelHeaderTitle = _styledComponents["default"].span.attrs({
  className: 'side-panel-panel__header__title'
})(_templateObject12(), function (props) {
  return props.theme.textColor;
});

exports.PanelHeaderTitle = PanelHeaderTitle;

var PanelHeaderContent = _styledComponents["default"].div(_templateObject13(), function (props) {
  return props.theme.textColor;
}, function (props) {
  return props.theme.labelColor;
});

exports.PanelHeaderContent = PanelHeaderContent;

var PanelContent = _styledComponents["default"].div.attrs({
  className: 'side-panel-panel__content'
})(_templateObject14(), function (props) {
  return props.theme.panelBackground;
});

exports.PanelContent = PanelContent;

var SidePanelSection = _styledComponents["default"].div.attrs({
  className: 'side-panel-section'
})(_templateObject15(), function (props) {
  return props.disabled ? 0.4 : 1;
}, function (props) {
  return props.disabled ? 'none' : 'all';
});

exports.SidePanelSection = SidePanelSection;

var SidePanelDivider = _styledComponents["default"].div.attrs({
  className: 'side-panel-divider'
})(_templateObject16(), function (props) {
  return props.theme.panelBorderColor;
});

exports.SidePanelDivider = SidePanelDivider;
var Tooltip = (0, _styledComponents["default"])(_reactTooltip["default"])(_templateObject17(), function (props) {
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
})(_templateObject18(), function (props) {
  return props.negative ? props.theme.negativeBtnBgd : props.secondary ? props.theme.secondaryBtnBgd : props.link ? props.theme.linkBtnBgd : props.floating ? props.theme.floatingBtnBgd : props.theme.primaryBtnBgd;
}, function (props) {
  return props.theme.primaryBtnRadius;
}, function (props) {
  return props.negative ? props.theme.negativeBtnColor : props.secondary ? props.theme.secondaryBtnColor : props.link ? props.theme.linkBtnColor : props.floating ? props.theme.floatingBtnColor : props.theme.primaryBtnColor;
}, function (props) {
  return props.large ? '14px' : props.small ? '10px' : '11px';
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
  return props.negative ? props.theme.negativeBtnBgdHover : props.secondary ? props.theme.secondaryBtnBgdHover : props.link ? props.theme.linkBtnActBgdHover : props.floating ? props.theme.floatingBtnBgdHover : props.theme.primaryBtnBgdHover;
}, function (props) {
  return props.negative ? props.theme.negativeBtnActColor : props.secondary ? props.theme.secondaryBtnActColor : props.link ? props.theme.linkBtnActColor : props.floating ? props.theme.floatingBtnActColor : props.theme.primaryBtnActColor;
}, function (props) {
  return props.large ? '10px' : props.small ? '6px' : '8px';
});

exports.Button = Button;

var Input = _styledComponents["default"].input(_templateObject19(), function (props) {
  return props.secondary ? props.theme.secondaryInput : props.theme.input;
});

exports.Input = Input;

var InputLight = _styledComponents["default"].input(_templateObject20(), function (props) {
  return props.theme.inputLT;
});

exports.InputLight = InputLight;

var TextArea = _styledComponents["default"].textarea(_templateObject21(), function (props) {
  return props.secondary ? props.theme.secondaryInput : props.theme.input;
});

exports.TextArea = TextArea;

var TextAreaLight = _styledComponents["default"].textarea(_templateObject22(), function (props) {
  return props.theme.inputLT;
});

exports.TextAreaLight = TextAreaLight;
var InlineInput = (0, _styledComponents["default"])(Input)(_templateObject23(), function (props) {
  return props.theme.inlineInput;
});
exports.InlineInput = InlineInput;

var StyledPanelHeader = _styledComponents["default"].div(_templateObject24(), function (props) {
  return props.active ? props.theme.panelBackgroundHover : props.theme.panelBackground;
}, function (props) {
  return props.labelRCGColorValues ? props.labelRCGColorValues.join(',') : 'transparent';
}, function (props) {
  return props.theme.panelHeaderHeight;
}, function (props) {
  return props.theme.transition;
});

exports.StyledPanelHeader = StyledPanelHeader;

var StyledPanelDropdown = _styledComponents["default"].div(_templateObject25(), function (props) {
  return props.theme.panelDropdownScrollBar;
}, function (props) {
  return props.type === 'light' ? props.theme.modalDropdownBackground : props.theme.panelBackground;
}, function (props) {
  return props.theme.panelBoxShadow;
}, function (props) {
  return props.theme.panelBorderRadius;
});

exports.StyledPanelDropdown = StyledPanelDropdown;

var ButtonGroup = _styledComponents["default"].div(_templateObject26(), function (props) {
  return props.theme.primaryBtnRadius;
}, function (props) {
  return props.theme.primaryBtnRadius;
}, function (props) {
  return props.theme.primaryBtnRadius;
}, function (props) {
  return props.theme.primaryBtnRadius;
});

exports.ButtonGroup = ButtonGroup;

var DatasetSquare = _styledComponents["default"].div(_templateObject27(), function (props) {
  return props.color.join(',');
});

exports.DatasetSquare = DatasetSquare;

var SelectionButton = _styledComponents["default"].div(_templateObject28(), function (props) {
  return props.selected ? props.theme.primaryBtnBgd : props.theme.selectBorderColorLT;
}, function (props) {
  return props.selected ? props.theme.primaryBtnBgd : props.theme.selectBorderColorLT;
}, function (props) {
  return props.available && props.theme.primaryBtnBgd;
}, function (props) {
  return props.available && props.theme.primaryBtnBgd;
});

exports.SelectionButton = SelectionButton;

var Table = _styledComponents["default"].table(_templateObject29(), function (props) {
  return props.theme.panelBackgroundLT;
}, function (props) {
  return props.theme.titleColorLT;
}, function (props) {
  return props.theme.panelBorderLT;
});

exports.Table = Table;

var StyledModalContent = _styledComponents["default"].div(_templateObject30(), function (props) {
  return props.theme.panelBackgroundLT;
}, function (props) {
  return props.theme.textColorLT;
}, function (props) {
  return props.theme.modalLateralPadding;
}, function (props) {
  return props.theme.modalLateralPadding;
}, _mediaBreakpoints.media.portable(_templateObject31(), function (props) {
  return props.theme.modalPortableLateralPadding;
}, function (props) {
  return props.theme.modalPortableLateralPadding;
}));

exports.StyledModalContent = StyledModalContent;

var StyledModalVerticalPanel = _styledComponents["default"].div.attrs({
  className: 'modal-vertical-panel'
})(_templateObject32(), _mediaBreakpoints.media.palm(_templateObject33()));

exports.StyledModalVerticalPanel = StyledModalVerticalPanel;

var StyledModalSection = _styledComponents["default"].div.attrs({
  className: 'modal-section'
})(_templateObject34(), function (props) {
  return props.theme.subtextColorLT;
}, _mediaBreakpoints.media.portable(_templateObject35()), _mediaBreakpoints.media.palm(_templateObject36()));

exports.StyledModalSection = StyledModalSection;

var StyledModalInputFootnote = _styledComponents["default"].div.attrs({
  className: 'modal-input__footnote'
})(_templateObject37(), function (props) {
  return props.error ? props.theme.errorColor : props.theme.subtextColorLT;
});
/**
 * Newer versions of mapbox.gl display an error message banner on top of the map by default
 * which will cause the map to display points in the wrong locations
 * This workaround will hide the error banner.
 */


exports.StyledModalInputFootnote = StyledModalInputFootnote;

var StyledMapContainer = _styledComponents["default"].div(_templateObject38());

exports.StyledMapContainer = StyledMapContainer;

var StyledAttrbution = _styledComponents["default"].div.attrs({
  className: 'mapbox-attribution-container'
})(_templateObject39());

exports.StyledAttrbution = StyledAttrbution;

var StyledExportSection = _styledComponents["default"].div(_templateObject40(), function (props) {
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

var StyledFilteredOption = _styledComponents["default"].div(_templateObject41(), function (props) {
  return props.selected ? props.theme.primaryBtnBgd : props.theme.selectBorderColorLT;
}, function (props) {
  return props.theme.primaryBtnBgd;
}, function (props) {
  return props.theme.textColorLT;
}, function (props) {
  return props.theme.textColor;
});

exports.StyledFilteredOption = StyledFilteredOption;

var StyledType = _styledComponents["default"].div(_templateObject42(), function (props) {
  return props.selected ? props.theme.primaryBtnBgdHover : props.theme.selectBorderColorLT;
}, function (props) {
  return props.selected ? props.theme.primaryBtnBgdHover : props.theme.selectBorderColorLT;
}, function (props) {
  return props.available && props.theme.primaryBtnBgd;
}, function (props) {
  return props.available && props.theme.primaryBtnBgd;
});

exports.StyledType = StyledType;

var WidgetContainer = _styledComponents["default"].div(_templateObject43());

exports.WidgetContainer = WidgetContainer;

var BottomWidgetInner = _styledComponents["default"].div(_templateObject44(), function (props) {
  return props.theme.panelBackground;
}, function (props) {
  return "".concat(props.theme.bottomInnerPdVert, "px ").concat(props.theme.bottomInnerPdSide, "px");
}, function (props) {
  return props.theme.bottomPanelGap;
});

exports.BottomWidgetInner = BottomWidgetInner;
var MapControlButton = (0, _styledComponents["default"])(Button).attrs({
  className: 'map-control-button'
})(_templateObject45(), function (props) {
  return props.active ? props.theme.floatingBtnBgdHover : props.theme.floatingBtnBgd;
}, function (props) {
  return props.active ? props.theme.floatingBtnActColor : props.theme.floatingBtnColor;
}, function (props) {
  return props.theme.floatingBtnBgdHover;
}, function (props) {
  return props.theme.floatingBtnActColor;
});
exports.MapControlButton = MapControlButton;

var StyledFilterContent = _styledComponents["default"].div(_templateObject46(), function (props) {
  return props.theme.panelBackground;
});

exports.StyledFilterContent = StyledFilterContent;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cy5qcyJdLCJuYW1lcyI6WyJTZWxlY3RUZXh0Iiwic3R5bGVkIiwic3BhbiIsInByb3BzIiwidGhlbWUiLCJsYWJlbENvbG9yIiwic2VsZWN0Rm9udFNpemUiLCJTZWxlY3RUZXh0Qm9sZCIsInRleHRDb2xvciIsIkljb25Sb3VuZFNtYWxsIiwiZGl2Iiwic2Vjb25kYXJ5QnRuQmdkSG92ZXIiLCJzZWNvbmRhcnlCdG5Db2xvciIsIkNlbnRlckZsZXhib3giLCJDZW50ZXJWZXJ0aWNhbEZsZXhib3giLCJTcGFjZUJldHdlZW5GbGV4Ym94IiwiU0JGbGV4Ym94SXRlbSIsIlNCRmxleGJveE5vTWFyZ2luIiwiUGFuZWxMYWJlbCIsImxhYmVsIiwiYXR0cnMiLCJjbGFzc05hbWUiLCJQYW5lbExhYmVsV3JhcHBlciIsIlBhbmVsTGFiZWxCb2xkIiwiUGFuZWxIZWFkZXJUaXRsZSIsIlBhbmVsSGVhZGVyQ29udGVudCIsIlBhbmVsQ29udGVudCIsInBhbmVsQmFja2dyb3VuZCIsIlNpZGVQYW5lbFNlY3Rpb24iLCJkaXNhYmxlZCIsIlNpZGVQYW5lbERpdmlkZXIiLCJwYW5lbEJvcmRlckNvbG9yIiwiVG9vbHRpcCIsIlJlYWN0VG9vbHRpcCIsInRvb2x0aXBCZyIsInRvb2x0aXBDb2xvciIsIkJ1dHRvbiIsIm5lZ2F0aXZlIiwibmVnYXRpdmVCdG5CZ2QiLCJzZWNvbmRhcnkiLCJzZWNvbmRhcnlCdG5CZ2QiLCJsaW5rIiwibGlua0J0bkJnZCIsImZsb2F0aW5nIiwiZmxvYXRpbmdCdG5CZ2QiLCJwcmltYXJ5QnRuQmdkIiwicHJpbWFyeUJ0blJhZGl1cyIsIm5lZ2F0aXZlQnRuQ29sb3IiLCJsaW5rQnRuQ29sb3IiLCJmbG9hdGluZ0J0bkNvbG9yIiwicHJpbWFyeUJ0bkNvbG9yIiwibGFyZ2UiLCJzbWFsbCIsInRyYW5zaXRpb24iLCJ3aWR0aCIsIm5lZ2F0aXZlQnRuQmdkSG92ZXIiLCJsaW5rQnRuQWN0QmdkSG92ZXIiLCJmbG9hdGluZ0J0bkJnZEhvdmVyIiwicHJpbWFyeUJ0bkJnZEhvdmVyIiwibmVnYXRpdmVCdG5BY3RDb2xvciIsInNlY29uZGFyeUJ0bkFjdENvbG9yIiwibGlua0J0bkFjdENvbG9yIiwiZmxvYXRpbmdCdG5BY3RDb2xvciIsInByaW1hcnlCdG5BY3RDb2xvciIsIklucHV0IiwiaW5wdXQiLCJzZWNvbmRhcnlJbnB1dCIsIklucHV0TGlnaHQiLCJpbnB1dExUIiwiVGV4dEFyZWEiLCJ0ZXh0YXJlYSIsIlRleHRBcmVhTGlnaHQiLCJJbmxpbmVJbnB1dCIsImlubGluZUlucHV0IiwiU3R5bGVkUGFuZWxIZWFkZXIiLCJhY3RpdmUiLCJwYW5lbEJhY2tncm91bmRIb3ZlciIsImxhYmVsUkNHQ29sb3JWYWx1ZXMiLCJqb2luIiwicGFuZWxIZWFkZXJIZWlnaHQiLCJTdHlsZWRQYW5lbERyb3Bkb3duIiwicGFuZWxEcm9wZG93blNjcm9sbEJhciIsInR5cGUiLCJtb2RhbERyb3Bkb3duQmFja2dyb3VuZCIsInBhbmVsQm94U2hhZG93IiwicGFuZWxCb3JkZXJSYWRpdXMiLCJCdXR0b25Hcm91cCIsIkRhdGFzZXRTcXVhcmUiLCJjb2xvciIsIlNlbGVjdGlvbkJ1dHRvbiIsInNlbGVjdGVkIiwic2VsZWN0Qm9yZGVyQ29sb3JMVCIsImF2YWlsYWJsZSIsIlRhYmxlIiwidGFibGUiLCJwYW5lbEJhY2tncm91bmRMVCIsInRpdGxlQ29sb3JMVCIsInBhbmVsQm9yZGVyTFQiLCJTdHlsZWRNb2RhbENvbnRlbnQiLCJ0ZXh0Q29sb3JMVCIsIm1vZGFsTGF0ZXJhbFBhZGRpbmciLCJtZWRpYSIsInBvcnRhYmxlIiwibW9kYWxQb3J0YWJsZUxhdGVyYWxQYWRkaW5nIiwiU3R5bGVkTW9kYWxWZXJ0aWNhbFBhbmVsIiwicGFsbSIsIlN0eWxlZE1vZGFsU2VjdGlvbiIsInN1YnRleHRDb2xvckxUIiwiU3R5bGVkTW9kYWxJbnB1dEZvb3Rub3RlIiwiZXJyb3IiLCJlcnJvckNvbG9yIiwiU3R5bGVkTWFwQ29udGFpbmVyIiwiU3R5bGVkQXR0cmJ1dGlvbiIsIlN0eWxlZEV4cG9ydFNlY3Rpb24iLCJTdHlsZWRGaWx0ZXJlZE9wdGlvbiIsIlN0eWxlZFR5cGUiLCJXaWRnZXRDb250YWluZXIiLCJCb3R0b21XaWRnZXRJbm5lciIsImJvdHRvbUlubmVyUGRWZXJ0IiwiYm90dG9tSW5uZXJQZFNpZGUiLCJib3R0b21QYW5lbEdhcCIsIk1hcENvbnRyb2xCdXR0b24iLCJTdHlsZWRGaWx0ZXJDb250ZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRU8sSUFBTUEsVUFBVSxHQUFHQyw2QkFBT0MsSUFBVixvQkFDWixVQUFBQyxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlDLFVBQWhCO0FBQUEsQ0FETyxFQUVSLFVBQUFGLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FB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SyxDQUFDQyxLQUFOLENBQVltSCxpQkFBdEQ7QUFBQSxDQUZZLEVBSWQsVUFBQXBILEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWW9ILGNBQWhCO0FBQUEsQ0FKUyxDQUF2Qjs7O0FBT0EsSUFBTUMsZ0JBQWdCLEdBQUcsa0NBQU9yRixNQUFQLEVBQWVoQixLQUFmLENBQXFCO0FBQ25EQyxFQUFBQSxTQUFTLEVBQUU7QUFEd0MsQ0FBckIsQ0FBSCxzQkFRUCxVQUFBbEIsS0FBSztBQUFBLFNBQ3ZCQSxLQUFLLENBQUN3RSxNQUFOLEdBQWV4RSxLQUFLLENBQUNDLEtBQU4sQ0FBWXFELG1CQUEzQixHQUFpRHRELEtBQUssQ0FBQ0MsS0FBTixDQUFZd0MsY0FEdEM7QUFBQSxDQVJFLEVBVWxCLFVBQUF6QyxLQUFLO0FBQUEsU0FDWkEsS0FBSyxDQUFDd0UsTUFBTixHQUFleEUsS0FBSyxDQUFDQyxLQUFOLENBQVkwRCxtQkFBM0IsR0FBaUQzRCxLQUFLLENBQUNDLEtBQU4sQ0FBWTZDLGdCQURqRDtBQUFBLENBVmEsRUFpQkwsVUFBQTlDLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWXFELG1CQUFoQjtBQUFBLENBakJBLEVBa0JoQixVQUFBdEQsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZMEQsbUJBQWhCO0FBQUEsQ0FsQlcsQ0FBdEI7OztBQXlCQSxJQUFNNEQsbUJBQW1CLEdBQUd6SCw2QkFBT1MsR0FBVixzQkFDVixVQUFBUCxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVl1QixlQUFoQjtBQUFBLENBREssQ0FBekIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBSZWFjdFRvb2x0aXAgZnJvbSAncmVhY3QtdG9vbHRpcCc7XG5pbXBvcnQge21lZGlhfSBmcm9tICdzdHlsZXMvbWVkaWEtYnJlYWtwb2ludHMnO1xuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5cbmV4cG9ydCBjb25zdCBTZWxlY3RUZXh0ID0gc3R5bGVkLnNwYW5gXG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmxhYmVsQ29sb3J9O1xuICBmb250LXNpemU6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2VsZWN0Rm9udFNpemV9O1xuICBmb250LXdlaWdodDogNDAwO1xuXG4gIGkge1xuICAgIGZvbnQtc2l6ZTogMTNweDtcbiAgICBtYXJnaW4tcmlnaHQ6IDZweDtcbiAgfVxuYDtcblxuZXhwb3J0IGNvbnN0IFNlbGVjdFRleHRCb2xkID0gc3R5bGVkKFNlbGVjdFRleHQpYFxuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuICBmb250LXdlaWdodDogNTAwO1xuYDtcblxuZXhwb3J0IGNvbnN0IEljb25Sb3VuZFNtYWxsID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgd2lkdGg6IDE4cHg7XG4gIGhlaWdodDogMThweDtcbiAgYm9yZGVyLXJhZGl1czogOXB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+XG4gICAgcHJvcHMudGhlbWUuc2Vjb25kYXJ5QnRuQmdkSG92ZXJ9OyAvLyB1cGRhdGVkIGFmdGVyIGNoZWNraW5nIHNrZXRjaCBmaWxlXG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlY29uZGFyeUJ0bkNvbG9yfTtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cbiAgOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWNvbmRhcnlCdG5CZ2RIb3Zlcn07XG4gIH1cbmA7XG5cbmV4cG9ydCBjb25zdCBDZW50ZXJGbGV4Ym94ID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbmA7XG5cbmV4cG9ydCBjb25zdCBDZW50ZXJWZXJ0aWNhbEZsZXhib3ggPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuYDtcblxuZXhwb3J0IGNvbnN0IFNwYWNlQmV0d2VlbkZsZXhib3ggPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIG1hcmdpbi1sZWZ0OiAtMTZweDtcbmA7XG5cbmV4cG9ydCBjb25zdCBTQkZsZXhib3hJdGVtID0gc3R5bGVkLmRpdmBcbiAgZmxleC1ncm93OiAxO1xuICBtYXJnaW4tbGVmdDogMTZweDtcbmA7XG5cbmV4cG9ydCBjb25zdCBTQkZsZXhib3hOb01hcmdpbiA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbmA7XG5cbmV4cG9ydCBjb25zdCBQYW5lbExhYmVsID0gc3R5bGVkLmxhYmVsLmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnc2lkZS1wYW5lbC1wYW5lbF9fbGFiZWwnXG59KWBcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGFiZWxDb2xvcn07XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgZm9udC1zaXplOiAxMXB4O1xuICBmb250LXdlaWdodDogNDAwO1xuICBtYXJnaW4tYm90dG9tOiA0cHg7XG4gIHRleHQtdHJhbnNmb3JtOiBjYXBpdGFsaXplO1xuYDtcblxuZXhwb3J0IGNvbnN0IFBhbmVsTGFiZWxXcmFwcGVyID0gc3R5bGVkLmRpdi5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ3NpZGUtcGFuZWwtcGFuZWxfX2xhYmVsLXdyYXBwZXInXG59KWBcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IHNlbGYtc3RhcnQ7XG5gO1xuXG5leHBvcnQgY29uc3QgUGFuZWxMYWJlbEJvbGQgPSBzdHlsZWQoUGFuZWxMYWJlbClgXG4gIGZvbnQtd2VpZ2h0OiA1MDA7XG5gO1xuXG5leHBvcnQgY29uc3QgUGFuZWxIZWFkZXJUaXRsZSA9IHN0eWxlZC5zcGFuLmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnc2lkZS1wYW5lbC1wYW5lbF9faGVhZGVyX190aXRsZSdcbn0pYFxuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuICBmb250LXNpemU6IDEzcHg7XG4gIGxldHRlci1zcGFjaW5nOiAwLjQzcHg7XG4gIHRleHQtdHJhbnNmb3JtOiBjYXBpdGFsaXplO1xuYDtcblxuZXhwb3J0IGNvbnN0IFBhbmVsSGVhZGVyQ29udGVudCA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvcn07XG4gIHBhZGRpbmctbGVmdDogMTJweDtcblxuICAuaWNvbiB7XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGFiZWxDb2xvcn07XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIG1hcmdpbi1yaWdodDogMTJweDtcbiAgfVxuYDtcblxuZXhwb3J0IGNvbnN0IFBhbmVsQ29udGVudCA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdzaWRlLXBhbmVsLXBhbmVsX19jb250ZW50J1xufSlgXG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucGFuZWxCYWNrZ3JvdW5kfTtcbiAgcGFkZGluZzogMTJweDtcbmA7XG5cbmV4cG9ydCBjb25zdCBTaWRlUGFuZWxTZWN0aW9uID0gc3R5bGVkLmRpdi5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ3NpZGUtcGFuZWwtc2VjdGlvbidcbn0pYFxuICBtYXJnaW4tYm90dG9tOiAxMnB4O1xuICBvcGFjaXR5OiAke3Byb3BzID0+IChwcm9wcy5kaXNhYmxlZCA/IDAuNCA6IDEpfTtcbiAgcG9pbnRlci1ldmVudHM6ICR7cHJvcHMgPT4gKHByb3BzLmRpc2FibGVkID8gJ25vbmUnIDogJ2FsbCcpfTtcbmA7XG5cbmV4cG9ydCBjb25zdCBTaWRlUGFuZWxEaXZpZGVyID0gc3R5bGVkLmRpdi5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ3NpZGUtcGFuZWwtZGl2aWRlcidcbn0pYFxuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJvcmRlckNvbG9yfTtcbiAgaGVpZ2h0OiAxMnB4O1xuICBtYXJnaW4tYm90dG9tOiAxMnB4O1xuYDtcblxuZXhwb3J0IGNvbnN0IFRvb2x0aXAgPSBzdHlsZWQoUmVhY3RUb29sdGlwKWBcbiAgJi5fX3JlYWN0X2NvbXBvbmVudF90b29sdGlwIHtcbiAgICBmb250LXNpemU6IDkuNXB4O1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgcGFkZGluZzogN3B4IDE4cHg7XG5cbiAgICAmLnR5cGUtZGFyayB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRvb2x0aXBCZ307XG4gICAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50b29sdGlwQ29sb3J9O1xuICAgICAgJi5wbGFjZS1ib3R0b20ge1xuICAgICAgICA6YWZ0ZXIge1xuICAgICAgICAgIGJvcmRlci1ib3R0b20tY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudG9vbHRpcEJnfTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAmLnBsYWNlLXRvcCB7XG4gICAgICAgIDphZnRlciB7XG4gICAgICAgICAgYm9yZGVyLXRvcC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50b29sdGlwQmd9O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgICYucGxhY2UtcmlnaHQge1xuICAgICAgICA6YWZ0ZXIge1xuICAgICAgICAgIGJvcmRlci1yaWdodC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50b29sdGlwQmd9O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgICYucGxhY2UtbGVmdCB7XG4gICAgICAgIDphZnRlciB7XG4gICAgICAgICAgYm9yZGVyLWxlZnQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudG9vbHRpcEJnfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuYDtcblxuZXhwb3J0IGNvbnN0IEJ1dHRvbiA9IHN0eWxlZC5kaXYuYXR0cnMocHJvcHMgPT4gKHtcbiAgY2xhc3NOYW1lOiBjbGFzc25hbWVzKCdidXR0b24nLCBwcm9wcy5jbGFzc05hbWUpXG59KSlgXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT5cbiAgICBwcm9wcy5uZWdhdGl2ZVxuICAgICAgPyBwcm9wcy50aGVtZS5uZWdhdGl2ZUJ0bkJnZFxuICAgICAgOiBwcm9wcy5zZWNvbmRhcnlcbiAgICAgID8gcHJvcHMudGhlbWUuc2Vjb25kYXJ5QnRuQmdkXG4gICAgICA6IHByb3BzLmxpbmtcbiAgICAgID8gcHJvcHMudGhlbWUubGlua0J0bkJnZFxuICAgICAgOiBwcm9wcy5mbG9hdGluZ1xuICAgICAgPyBwcm9wcy50aGVtZS5mbG9hdGluZ0J0bkJnZFxuICAgICAgOiBwcm9wcy50aGVtZS5wcmltYXJ5QnRuQmdkfTtcbiAgYm9yZGVyLXJhZGl1czogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wcmltYXJ5QnRuUmFkaXVzfTtcbiAgY29sb3I6ICR7cHJvcHMgPT5cbiAgICBwcm9wcy5uZWdhdGl2ZVxuICAgICAgPyBwcm9wcy50aGVtZS5uZWdhdGl2ZUJ0bkNvbG9yXG4gICAgICA6IHByb3BzLnNlY29uZGFyeVxuICAgICAgPyBwcm9wcy50aGVtZS5zZWNvbmRhcnlCdG5Db2xvclxuICAgICAgOiBwcm9wcy5saW5rXG4gICAgICA/IHByb3BzLnRoZW1lLmxpbmtCdG5Db2xvclxuICAgICAgOiBwcm9wcy5mbG9hdGluZ1xuICAgICAgPyBwcm9wcy50aGVtZS5mbG9hdGluZ0J0bkNvbG9yXG4gICAgICA6IHByb3BzLnRoZW1lLnByaW1hcnlCdG5Db2xvcn07XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gIGZvbnQtc2l6ZTogJHtwcm9wcyA9PiAocHJvcHMubGFyZ2UgPyAnMTRweCcgOiBwcm9wcy5zbWFsbCA/ICcxMHB4JyA6ICcxMXB4Jyl9O1xuICBmb250LXdlaWdodDogNTAwO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgbGV0dGVyLXNwYWNpbmc6IDAuM3B4O1xuICBsaW5lLWhlaWdodDogMTRweDtcbiAgb3V0bGluZTogMDtcbiAgcGFkZGluZzogJHtwcm9wcyA9PiAocHJvcHMubGFyZ2UgPyAnMTRweCAzMnB4JyA6IHByb3BzLnNtYWxsID8gJzZweCA5cHgnIDogJzlweCAxMnB4Jyl9O1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHRyYW5zaXRpb246ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudHJhbnNpdGlvbn07XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gIHdpZHRoOiAke3Byb3BzID0+IHByb3BzLndpZHRoIHx8ICdhdXRvJ307XG4gIG9wYWNpdHk6ICR7cHJvcHMgPT4gKHByb3BzLmRpc2FibGVkID8gMC40IDogMSl9O1xuICBwb2ludGVyLWV2ZW50czogJHtwcm9wcyA9PiAocHJvcHMuZGlzYWJsZWQgPyAnbm9uZScgOiAnYWxsJyl9O1xuXG4gIDpob3ZlcixcbiAgOmZvY3VzLFxuICA6YWN0aXZlLFxuICAmLmFjdGl2ZSB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PlxuICAgICAgcHJvcHMubmVnYXRpdmVcbiAgICAgICAgPyBwcm9wcy50aGVtZS5uZWdhdGl2ZUJ0bkJnZEhvdmVyXG4gICAgICAgIDogcHJvcHMuc2Vjb25kYXJ5XG4gICAgICAgID8gcHJvcHMudGhlbWUuc2Vjb25kYXJ5QnRuQmdkSG92ZXJcbiAgICAgICAgOiBwcm9wcy5saW5rXG4gICAgICAgID8gcHJvcHMudGhlbWUubGlua0J0bkFjdEJnZEhvdmVyXG4gICAgICAgIDogcHJvcHMuZmxvYXRpbmdcbiAgICAgICAgPyBwcm9wcy50aGVtZS5mbG9hdGluZ0J0bkJnZEhvdmVyXG4gICAgICAgIDogcHJvcHMudGhlbWUucHJpbWFyeUJ0bkJnZEhvdmVyfTtcbiAgICBjb2xvcjogJHtwcm9wcyA9PlxuICAgICAgcHJvcHMubmVnYXRpdmVcbiAgICAgICAgPyBwcm9wcy50aGVtZS5uZWdhdGl2ZUJ0bkFjdENvbG9yXG4gICAgICAgIDogcHJvcHMuc2Vjb25kYXJ5XG4gICAgICAgID8gcHJvcHMudGhlbWUuc2Vjb25kYXJ5QnRuQWN0Q29sb3JcbiAgICAgICAgOiBwcm9wcy5saW5rXG4gICAgICAgID8gcHJvcHMudGhlbWUubGlua0J0bkFjdENvbG9yXG4gICAgICAgIDogcHJvcHMuZmxvYXRpbmdcbiAgICAgICAgPyBwcm9wcy50aGVtZS5mbG9hdGluZ0J0bkFjdENvbG9yXG4gICAgICAgIDogcHJvcHMudGhlbWUucHJpbWFyeUJ0bkFjdENvbG9yfTtcbiAgfVxuXG4gIHN2ZyB7XG4gICAgbWFyZ2luLXJpZ2h0OiAke3Byb3BzID0+IChwcm9wcy5sYXJnZSA/ICcxMHB4JyA6IHByb3BzLnNtYWxsID8gJzZweCcgOiAnOHB4Jyl9O1xuICB9XG5gO1xuXG5leHBvcnQgY29uc3QgSW5wdXQgPSBzdHlsZWQuaW5wdXRgXG4gICR7cHJvcHMgPT4gKHByb3BzLnNlY29uZGFyeSA/IHByb3BzLnRoZW1lLnNlY29uZGFyeUlucHV0IDogcHJvcHMudGhlbWUuaW5wdXQpfTtcbmA7XG5cbmV4cG9ydCBjb25zdCBJbnB1dExpZ2h0ID0gc3R5bGVkLmlucHV0YFxuICAke3Byb3BzID0+IHByb3BzLnRoZW1lLmlucHV0TFR9XG5gO1xuXG5leHBvcnQgY29uc3QgVGV4dEFyZWEgPSBzdHlsZWQudGV4dGFyZWFgXG4gICR7cHJvcHMgPT4gKHByb3BzLnNlY29uZGFyeSA/IHByb3BzLnRoZW1lLnNlY29uZGFyeUlucHV0IDogcHJvcHMudGhlbWUuaW5wdXQpfTtcbmA7XG5leHBvcnQgY29uc3QgVGV4dEFyZWFMaWdodCA9IHN0eWxlZC50ZXh0YXJlYWBcbiAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5pbnB1dExUfVxuICBoZWlnaHQ6IGF1dG87XG4gIHdoaXRlLXNwYWNlOiBwcmUtd3JhcDtcbmA7XG5cbmV4cG9ydCBjb25zdCBJbmxpbmVJbnB1dCA9IHN0eWxlZChJbnB1dClgXG4gICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaW5saW5lSW5wdXR9O1xuYDtcblxuZXhwb3J0IGNvbnN0IFN0eWxlZFBhbmVsSGVhZGVyID0gc3R5bGVkLmRpdmBcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PlxuICAgIHByb3BzLmFjdGl2ZSA/IHByb3BzLnRoZW1lLnBhbmVsQmFja2dyb3VuZEhvdmVyIDogcHJvcHMudGhlbWUucGFuZWxCYWNrZ3JvdW5kfTtcbiAgYm9yZGVyLWxlZnQ6IDNweCBzb2xpZFxuICAgIHJnYihcbiAgICAgICR7cHJvcHMgPT4gKHByb3BzLmxhYmVsUkNHQ29sb3JWYWx1ZXMgPyBwcm9wcy5sYWJlbFJDR0NvbG9yVmFsdWVzLmpvaW4oJywnKSA6ICd0cmFuc3BhcmVudCcpfVxuICAgICk7XG4gIHBhZGRpbmc6IDAgMTBweCAwIDA7XG4gIGhlaWdodDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEhlYWRlckhlaWdodH1weDtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICB0cmFuc2l0aW9uOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRyYW5zaXRpb259O1xuYDtcblxuZXhwb3J0IGNvbnN0IFN0eWxlZFBhbmVsRHJvcGRvd24gPSBzdHlsZWQuZGl2YFxuICAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsRHJvcGRvd25TY3JvbGxCYXJ9XG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT5cbiAgICBwcm9wcy50eXBlID09PSAnbGlnaHQnID8gcHJvcHMudGhlbWUubW9kYWxEcm9wZG93bkJhY2tncm91bmQgOiBwcm9wcy50aGVtZS5wYW5lbEJhY2tncm91bmR9O1xuICBvdmVyZmxvdy15OiBhdXRvO1xuICBib3gtc2hhZG93OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsQm94U2hhZG93fTtcbiAgYm9yZGVyLXJhZGl1czogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJvcmRlclJhZGl1c307XG4gIG1hcmdpbi10b3A6IDJweDtcbiAgbWF4LWhlaWdodDogNTAwcHg7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgei1pbmRleDogOTk5O1xuYDtcblxuZXhwb3J0IGNvbnN0IEJ1dHRvbkdyb3VwID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgLmJ1dHRvbiB7XG4gICAgYm9yZGVyLXJhZGl1czogMDtcbiAgICBtYXJnaW4tbGVmdDogMnB4O1xuICB9XG4gIC5idXR0b246Zmlyc3QtY2hpbGQge1xuICAgIGJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucHJpbWFyeUJ0blJhZGl1c307XG4gICAgYm9yZGVyLXRvcC1sZWZ0LXJhZGl1czogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wcmltYXJ5QnRuUmFkaXVzfTtcbiAgICBtYXJnaW4tbGVmdDogMDtcbiAgfVxuICAuYnV0dG9uOmxhc3QtY2hpbGQge1xuICAgIGJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnByaW1hcnlCdG5SYWRpdXN9O1xuICAgIGJvcmRlci10b3AtcmlnaHQtcmFkaXVzOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnByaW1hcnlCdG5SYWRpdXN9O1xuICB9XG5gO1xuXG5leHBvcnQgY29uc3QgRGF0YXNldFNxdWFyZSA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgd2lkdGg6IDhweDtcbiAgaGVpZ2h0OiA4cHg7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigke3Byb3BzID0+IHByb3BzLmNvbG9yLmpvaW4oJywnKX0pO1xuICBtYXJnaW4tcmlnaHQ6IDEycHg7XG5gO1xuXG5leHBvcnQgY29uc3QgU2VsZWN0aW9uQnV0dG9uID0gc3R5bGVkLmRpdmBcbiAgYm9yZGVyLXJhZGl1czogMnB4O1xuICBib3JkZXI6IDFweCBzb2xpZFxuICAgICR7cHJvcHMgPT4gKHByb3BzLnNlbGVjdGVkID8gcHJvcHMudGhlbWUucHJpbWFyeUJ0bkJnZCA6IHByb3BzLnRoZW1lLnNlbGVjdEJvcmRlckNvbG9yTFQpfTtcbiAgY29sb3I6ICR7cHJvcHMgPT4gKHByb3BzLnNlbGVjdGVkID8gcHJvcHMudGhlbWUucHJpbWFyeUJ0bkJnZCA6IHByb3BzLnRoZW1lLnNlbGVjdEJvcmRlckNvbG9yTFQpfTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBmb250LXdlaWdodDogNTAwO1xuICBtYXJnaW4tcmlnaHQ6IDZweDtcbiAgcGFkZGluZzogNnB4IDEwcHg7XG5cbiAgOmhvdmVyIHtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy5hdmFpbGFibGUgJiYgcHJvcHMudGhlbWUucHJpbWFyeUJ0bkJnZH07XG4gICAgYm9yZGVyOiAxcHggc29saWQgJHtwcm9wcyA9PiBwcm9wcy5hdmFpbGFibGUgJiYgcHJvcHMudGhlbWUucHJpbWFyeUJ0bkJnZH07XG4gIH1cbmA7XG5cbmV4cG9ydCBjb25zdCBUYWJsZSA9IHN0eWxlZC50YWJsZWBcbiAgd2lkdGg6IDEwMCU7XG4gIGJvcmRlci1zcGFjaW5nOiAwO1xuXG4gIHRoZWFkIHtcbiAgICB0ciB0aCB7XG4gICAgICBiYWNrZ3JvdW5kOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsQmFja2dyb3VuZExUfTtcbiAgICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRpdGxlQ29sb3JMVH07XG4gICAgICBwYWRkaW5nOiAxOHB4IDEycHg7XG4gICAgICB0ZXh0LWFsaWduOiBzdGFydDtcbiAgICB9XG4gIH1cblxuICB0Ym9keSB7XG4gICAgdHIgdGQge1xuICAgICAgYm9yZGVyLWJvdHRvbTogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJvcmRlckxUfTtcbiAgICAgIHBhZGRpbmc6IDEycHg7XG4gICAgfVxuICB9XG5gO1xuXG5leHBvcnQgY29uc3QgU3R5bGVkTW9kYWxDb250ZW50ID0gc3R5bGVkLmRpdmBcbiAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJhY2tncm91bmRMVH07XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckxUfTtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgZm9udC1zaXplOiAxMHB4O1xuICBwYWRkaW5nOiAyNHB4ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubW9kYWxMYXRlcmFsUGFkZGluZ307XG4gIG1hcmdpbjogMCAtJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5tb2RhbExhdGVyYWxQYWRkaW5nfTtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAke21lZGlhLnBvcnRhYmxlYFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgcGFkZGluZzogMTZweCAke3Byb3BzID0+IHByb3BzLnRoZW1lLm1vZGFsUG9ydGFibGVMYXRlcmFsUGFkZGluZ307XG4gICAgbWFyZ2luOiAwIC0ke3Byb3BzID0+IHByb3BzLnRoZW1lLm1vZGFsUG9ydGFibGVMYXRlcmFsUGFkZGluZ307XG4gIGB9O1xuYDtcblxuZXhwb3J0IGNvbnN0IFN0eWxlZE1vZGFsVmVydGljYWxQYW5lbCA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdtb2RhbC12ZXJ0aWNhbC1wYW5lbCdcbn0pYFxuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcbiAgZm9udC1zaXplOiAxMnB4O1xuXG4gIC5tb2RhbC1zZWN0aW9uOmZpcnN0LWNoaWxkIHtcbiAgICBtYXJnaW4tdG9wOiAyNHB4O1xuICAgICR7bWVkaWEucGFsbWBcbiAgICAgIG1hcmdpbi10b3A6IDA7XG4gICAgYH07XG4gIH1cblxuICBpbnB1dCB7XG4gICAgbWFyZ2luLXJpZ2h0OiA4cHg7XG4gIH1cbmA7XG5cbmV4cG9ydCBjb25zdCBTdHlsZWRNb2RhbFNlY3Rpb24gPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnbW9kYWwtc2VjdGlvbidcbn0pYFxuICBtYXJnaW4tYm90dG9tOiAzMnB4O1xuXG4gIC5tb2RhbC1zZWN0aW9uLXRpdGxlIHtcbiAgICBmb250LXdlaWdodDogNTAwO1xuICB9XG4gIC5tb2RhbC1zZWN0aW9uLXN1YnRpdGxlIHtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zdWJ0ZXh0Q29sb3JMVH07XG4gIH1cblxuICBpbnB1dCB7XG4gICAgbWFyZ2luLXRvcDogOHB4O1xuICB9XG5cbiAgJHttZWRpYS5wb3J0YWJsZWBcbiAgICBtYXJnaW4tYm90dG9tOiAyNHB4O1xuICBgfTtcbiAgJHttZWRpYS5wYWxtYFxuICAgIG1hcmdpbi1ib3R0b206IDE2cHg7XG4gIGB9O1xuYDtcblxuZXhwb3J0IGNvbnN0IFN0eWxlZE1vZGFsSW5wdXRGb290bm90ZSA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdtb2RhbC1pbnB1dF9fZm9vdG5vdGUnXG59KWBcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgY29sb3I6ICR7cHJvcHMgPT4gKHByb3BzLmVycm9yID8gcHJvcHMudGhlbWUuZXJyb3JDb2xvciA6IHByb3BzLnRoZW1lLnN1YnRleHRDb2xvckxUKX07XG4gIGZvbnQtc2l6ZTogMTBweDtcbmA7XG4vKipcbiAqIE5ld2VyIHZlcnNpb25zIG9mIG1hcGJveC5nbCBkaXNwbGF5IGFuIGVycm9yIG1lc3NhZ2UgYmFubmVyIG9uIHRvcCBvZiB0aGUgbWFwIGJ5IGRlZmF1bHRcbiAqIHdoaWNoIHdpbGwgY2F1c2UgdGhlIG1hcCB0byBkaXNwbGF5IHBvaW50cyBpbiB0aGUgd3JvbmcgbG9jYXRpb25zXG4gKiBUaGlzIHdvcmthcm91bmQgd2lsbCBoaWRlIHRoZSBlcnJvciBiYW5uZXIuXG4gKi9cbmV4cG9ydCBjb25zdCBTdHlsZWRNYXBDb250YWluZXIgPSBzdHlsZWQuZGl2YFxuICAubWFwYm94Z2wtbWFwIHtcbiAgICAubWFwYm94Z2wtbWlzc2luZy1jc3Mge1xuICAgICAgZGlzcGxheTogbm9uZTtcbiAgICB9XG4gICAgLm1hcGJveGdsLWN0cmwtYXR0cmliIHtcbiAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgfVxuICB9XG5gO1xuXG5leHBvcnQgY29uc3QgU3R5bGVkQXR0cmJ1dGlvbiA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdtYXBib3gtYXR0cmlidXRpb24tY29udGFpbmVyJ1xufSlgXG4gIGJvdHRvbTogMDtcbiAgcmlnaHQ6IDA7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgZGlzcGxheTogYmxvY2s7XG4gIG1hcmdpbjogMCAxMHB4IDJweDtcbiAgei1pbmRleDogOTk5O1xuICBhIHtcbiAgICBjb2xvcjogYmxhY2s7XG4gICAgZm9udC1zaXplOiAxMHB4O1xuICB9XG5gO1xuXG5leHBvcnQgY29uc3QgU3R5bGVkRXhwb3J0U2VjdGlvbiA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIG1hcmdpbjogMzVweCAwO1xuICB3aWR0aDogMTAwJTtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yTFR9O1xuICBmb250LXNpemU6IDEycHg7XG4gIG9wYWNpdHk6ICR7cHJvcHMgPT4gKHByb3BzLmRpc2FibGVkID8gMC4zIDogMSl9O1xuICBwb2ludGVyLWV2ZW50czogJHtwcm9wcyA9PiAocHJvcHMuZGlzYWJsZWQgPyAnbm9uZScgOiAnYWxsJyl9O1xuXG4gIC5kZXNjcmlwdGlvbiB7XG4gICAgd2lkdGg6IDE4NXB4O1xuICAgIC50aXRsZSB7XG4gICAgICBmb250LXdlaWdodDogNTAwO1xuICAgIH1cbiAgICAuc3VidGl0bGUge1xuICAgICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc3VidGV4dENvbG9yTFR9O1xuICAgICAgZm9udC1zaXplOiAxMXB4O1xuICAgIH1cbiAgfVxuICAud2FybmluZyB7XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZXJyb3JDb2xvcn07XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgfVxuICAuZGVzY3JpcHRpb24uZnVsbCB7XG4gICAgd2lkdGg6IDEwMCU7XG4gIH1cbiAgLnNlbGVjdGlvbiB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LXdyYXA6IHdyYXA7XG4gICAgZmxleDogMTtcbiAgICBwYWRkaW5nLWxlZnQ6IDUwcHg7XG5cbiAgICBzZWxlY3Qge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XG4gICAgICBib3JkZXItcmFkaXVzOiAxcHg7XG4gICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICBmb250OiBpbmhlcml0O1xuICAgICAgbGluZS1oZWlnaHQ6IDEuNWVtO1xuICAgICAgcGFkZGluZzogMC41ZW0gMy41ZW0gMC41ZW0gMWVtO1xuICAgICAgbWFyZ2luOiAwO1xuICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgIGFwcGVhcmFuY2U6IG5vbmU7XG4gICAgICB3aWR0aDogMjUwcHg7XG4gICAgICBoZWlnaHQ6IDM2cHg7XG5cbiAgICAgIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCg0NWRlZywgdHJhbnNwYXJlbnQgNTAlLCBncmF5IDUwJSksXG4gICAgICAgIGxpbmVhci1ncmFkaWVudCgxMzVkZWcsIGdyYXkgNTAlLCB0cmFuc3BhcmVudCA1MCUpLCBsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsICNjY2MsICNjY2MpO1xuICAgICAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2FsYygxMDAlIC0gMjBweCkgY2FsYygxZW0gKyAycHgpLCBjYWxjKDEwMCUgLSAxNXB4KSBjYWxjKDFlbSArIDJweCksXG4gICAgICAgIGNhbGMoMTAwJSAtIDIuNWVtKSA0LjVlbTtcbiAgICAgIGJhY2tncm91bmQtc2l6ZTogNXB4IDVweCwgNXB4IDVweCwgMXB4IDEuNWVtO1xuICAgICAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcbiAgICB9XG5cbiAgICBzZWxlY3Q6Zm9jdXMge1xuICAgICAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KDQ1ZGVnLCBncmVlbiA1MCUsIHRyYW5zcGFyZW50IDUwJSksXG4gICAgICAgIGxpbmVhci1ncmFkaWVudCgxMzVkZWcsIHRyYW5zcGFyZW50IDUwJSwgZ3JlZW4gNTAlKSwgbGluZWFyLWdyYWRpZW50KHRvIHJpZ2h0LCAjY2NjLCAjY2NjKTtcbiAgICAgIGJhY2tncm91bmQtcG9zaXRpb246IGNhbGMoMTAwJSAtIDE1cHgpIDFlbSwgY2FsYygxMDAlIC0gMjBweCkgMWVtLCBjYWxjKDEwMCUgLSAyLjVlbSkgNC41ZW07XG4gICAgICBiYWNrZ3JvdW5kLXNpemU6IDVweCA1cHgsIDVweCA1cHgsIDFweCAxLjVlbTtcbiAgICAgIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XG4gICAgICBib3JkZXItY29sb3I6IGdyZWVuO1xuICAgICAgb3V0bGluZTogMDtcbiAgICB9XG4gIH1cbmA7XG5cbmV4cG9ydCBjb25zdCBTdHlsZWRGaWx0ZXJlZE9wdGlvbiA9IHN0eWxlZC5kaXZgXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGJvcmRlci1yYWRpdXM6IDJweDtcbiAgYm9yZGVyOiAxcHggc29saWRcbiAgICAke3Byb3BzID0+IChwcm9wcy5zZWxlY3RlZCA/IHByb3BzLnRoZW1lLnByaW1hcnlCdG5CZ2QgOiBwcm9wcy50aGVtZS5zZWxlY3RCb3JkZXJDb2xvckxUKX07XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgaGVpZ2h0OiA2MHB4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgbWFyZ2luOiA0cHg7XG4gIHBhZGRpbmc6IDhweCAxMnB4O1xuICB3aWR0aDogMTQwcHg7XG5cbiAgOmhvdmVyIHtcbiAgICBib3JkZXI6IDFweCBzb2xpZCAke3Byb3BzID0+IHByb3BzLnRoZW1lLnByaW1hcnlCdG5CZ2R9O1xuICB9XG5cbiAgLmZpbHRlci1vcHRpb24tdGl0bGUge1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckxUfTtcbiAgICBmb250LXNpemU6IDEycHg7XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgfVxuICAuZmlsdGVyLW9wdGlvbi1zdWJ0aXRsZSB7XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yfTtcbiAgICBmb250LXNpemU6IDExcHg7XG4gIH1cbmA7XG5cbmV4cG9ydCBjb25zdCBTdHlsZWRUeXBlID0gc3R5bGVkLmRpdmBcbiAgYm9yZGVyLXJhZGl1czogMnB4O1xuICBib3JkZXI6IDFweCBzb2xpZFxuICAgICR7cHJvcHMgPT4gKHByb3BzLnNlbGVjdGVkID8gcHJvcHMudGhlbWUucHJpbWFyeUJ0bkJnZEhvdmVyIDogcHJvcHMudGhlbWUuc2VsZWN0Qm9yZGVyQ29sb3JMVCl9O1xuICBjb2xvcjogJHtwcm9wcyA9PlxuICAgIHByb3BzLnNlbGVjdGVkID8gcHJvcHMudGhlbWUucHJpbWFyeUJ0bkJnZEhvdmVyIDogcHJvcHMudGhlbWUuc2VsZWN0Qm9yZGVyQ29sb3JMVH07XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgaGVpZ2h0OiAxMDBweDtcbiAgbWFyZ2luOiA0cHg7XG4gIHBhZGRpbmc6IDZweCAxMHB4O1xuICB3aWR0aDogMTAwcHg7XG5cbiAgOmhvdmVyIHtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy5hdmFpbGFibGUgJiYgcHJvcHMudGhlbWUucHJpbWFyeUJ0bkJnZH07XG4gICAgYm9yZGVyOiAxcHggc29saWQgJHtwcm9wcyA9PiBwcm9wcy5hdmFpbGFibGUgJiYgcHJvcHMudGhlbWUucHJpbWFyeUJ0bkJnZH07XG4gIH1cbmA7XG5cbmV4cG9ydCBjb25zdCBXaWRnZXRDb250YWluZXIgPSBzdHlsZWQuZGl2YFxuICB6LWluZGV4OiAxO1xuYDtcblxuZXhwb3J0IGNvbnN0IEJvdHRvbVdpZGdldElubmVyID0gc3R5bGVkLmRpdmBcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJhY2tncm91bmR9O1xuICBwYWRkaW5nOiAke3Byb3BzID0+IGAke3Byb3BzLnRoZW1lLmJvdHRvbUlubmVyUGRWZXJ0fXB4ICR7cHJvcHMudGhlbWUuYm90dG9tSW5uZXJQZFNpZGV9cHhgfTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBtYXJnaW4tdG9wOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmJvdHRvbVBhbmVsR2FwfXB4O1xuYDtcblxuZXhwb3J0IGNvbnN0IE1hcENvbnRyb2xCdXR0b24gPSBzdHlsZWQoQnV0dG9uKS5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ21hcC1jb250cm9sLWJ1dHRvbidcbn0pYFxuICBib3gtc2hhZG93OiAwIDZweCAxMnB4IDAgcmdiYSgwLCAwLCAwLCAwLjE2KTtcbiAgaGVpZ2h0OiAzMnB4O1xuICB3aWR0aDogMzJweDtcbiAgcGFkZGluZzogMDtcbiAgYm9yZGVyLXJhZGl1czogMDtcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PlxuICAgIHByb3BzLmFjdGl2ZSA/IHByb3BzLnRoZW1lLmZsb2F0aW5nQnRuQmdkSG92ZXIgOiBwcm9wcy50aGVtZS5mbG9hdGluZ0J0bkJnZH07XG4gIGNvbG9yOiAke3Byb3BzID0+XG4gICAgcHJvcHMuYWN0aXZlID8gcHJvcHMudGhlbWUuZmxvYXRpbmdCdG5BY3RDb2xvciA6IHByb3BzLnRoZW1lLmZsb2F0aW5nQnRuQ29sb3J9O1xuXG4gIDpob3ZlcixcbiAgOmZvY3VzLFxuICA6YWN0aXZlLFxuICAmLmFjdGl2ZSB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5mbG9hdGluZ0J0bkJnZEhvdmVyfTtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5mbG9hdGluZ0J0bkFjdENvbG9yfTtcbiAgfVxuICBzdmcge1xuICAgIG1hcmdpbi1yaWdodDogMDtcbiAgfVxuYDtcblxuZXhwb3J0IGNvbnN0IFN0eWxlZEZpbHRlckNvbnRlbnQgPSBzdHlsZWQuZGl2YFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsQmFja2dyb3VuZH07XG4gIHBhZGRpbmc6IDEycHg7XG5gO1xuIl19
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = MapPopoverFactory;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _layerHoverInfo = _interopRequireDefault(require("./layer-hover-info"));

var _coordinateInfo = _interopRequireDefault(require("./coordinate-info"));

var _icons = require("../common/icons");

var _reactIntl = require("react-intl");

var _localization = require("../../localization");

var _headless = _interopRequireDefault(require("@tippyjs/react/headless"));

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

var MAX_WIDTH = 500;
var MAX_HEIGHT = 600;

var StyledMapPopover = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  flex-direction: column;\n  max-width: ", "px;\n  max-height: ", "px;\n  padding: 14px;\n  & > * + * {\n    margin-top: 6px;\n  }\n  ", ";\n  font-family: ", ";\n  font-size: 11px;\n  font-weight: 500;\n  background-color: ", ";\n  color: ", ";\n  z-index: 1000;\n  overflow-x: auto;\n  box-shadow: ", ";\n\n  :hover {\n    background-color: ", ";\n  }\n\n  .primary-label {\n    color: ", ";\n    font-size: 10px;\n  }\n\n  .map-popover__layer-info,\n  .coordingate-hover-info {\n    & > * + * {\n      margin-top: 7px;\n    }\n  }\n\n  table {\n    width: auto;\n    display: grid;\n    border-collapse: collapse;\n    row-gap: 5px;\n    column-gap: 5px;\n  }\n\n  .coordingate-hover-info > table {\n    grid-template-columns: auto auto auto;\n  }\n  .map-popover__layer-info > table {\n    grid-template-columns: auto auto;\n  }\n\n  tbody,\n  tr {\n    display: contents;\n  }\n\n  td {\n    border-color: transparent;\n    color: ", ";\n  }\n\n  td.row__value {\n    text-align: right;\n    font-weight: 500;\n    color: ", ";\n  }\n"])), MAX_WIDTH, MAX_HEIGHT, function (props) {
  return props.theme.scrollBar;
}, function (props) {
  return props.theme.fontFamily;
}, function (props) {
  return props.theme.panelBackground;
}, function (props) {
  return props.theme.textColor;
}, function (props) {
  return props.theme.panelBoxShadow;
}, function (props) {
  return "".concat(props.theme.panelBackground, "dd");
}, function (props) {
  return props.theme.notificationColors.success;
}, function (props) {
  return props.theme.textColor;
}, function (props) {
  return props.theme.textColorHl;
});

var PinnedButtons = _styledComponents["default"].div(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  align-self: center;\n  align-items: center;\n  justify-items: center;\n  & > * + * {\n    margin-left: 10px;\n  }\n"])));

var PopoverContent = _styledComponents["default"].div(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  flex-direction: column;\n  & > * + * {\n    margin-top: 12px;\n  }\n"])));

var StyledIcon = _styledComponents["default"].div(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n\n  &.popover-pin {\n    transform: rotate(30deg);\n  }\n\n  :hover {\n    cursor: pointer;\n    color: ", ";\n  }\n"])), function (props) {
  return props.theme.activeColor;
}, function (props) {
  return props.theme.linkBtnColor;
});

MapPopoverFactory.deps = [_layerHoverInfo["default"], _coordinateInfo["default"]];

function createVirtualReference(container, x, y) {
  var size = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var bounds = container && container.getBoundingClientRect ? container.getBoundingClientRect() : {};
  var left = (bounds.left || 0) + x - size / 2;
  var top = (bounds.top || 0) + y - size / 2;
  return {
    left: left,
    top: top,
    right: left + size,
    bottom: top + size,
    width: size,
    height: size
  };
}

function getOffsetForPlacement(_ref) {
  var placement = _ref.placement,
      reference = _ref.reference,
      popper = _ref.popper;
  var gap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 20;

  switch (placement) {
    case 'top-start':
    case 'bottom-start':
      return [gap, gap];

    case 'top-end':
    case 'bottom-end':
      return [-gap, gap];

    default:
      return [0, 0];
  }
}

function getPopperOptions(container) {
  return {
    modifiers: [{
      name: 'preventOverflow',
      options: {
        boundary: container
      }
    }]
  };
}

function MapPopoverFactory(LayerHoverInfo, CoordinateInfo) {
  /** @type {typeof import('./map-popover').MapPopover} */
  var MapPopover = function MapPopover(_ref2) {
    var x = _ref2.x,
        y = _ref2.y,
        mapW = _ref2.mapW,
        mapH = _ref2.mapH,
        frozen = _ref2.frozen,
        coordinate = _ref2.coordinate,
        layerHoverProp = _ref2.layerHoverProp,
        isBase = _ref2.isBase,
        zoom = _ref2.zoom,
        container = _ref2.container,
        onClose = _ref2.onClose;

    var _useState = (0, _react.useState)('start'),
        _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
        horizontalPlacement = _useState2[0],
        setHorizontalPlacement = _useState2[1];

    var moveLeft = function moveLeft() {
      return setHorizontalPlacement('end');
    };

    var moveRight = function moveRight() {
      return setHorizontalPlacement('start');
    };

    return /*#__PURE__*/_react["default"].createElement(_headless["default"], {
      popperOptions: getPopperOptions(container),
      zIndex: 999
      /* should be below Modal which has zIndex=1000 */
      ,
      visible: true,
      interactive: true,
      getReferenceClientRect: function getReferenceClientRect() {
        return createVirtualReference(container, x, y);
      } // @ts-ignore
      ,
      placement: "bottom-".concat(horizontalPlacement) // @ts-ignore
      ,
      offset: getOffsetForPlacement,
      appendTo: document.body,
      render: function render(attrs) {
        return /*#__PURE__*/_react["default"].createElement(StyledMapPopover, (0, _extends2["default"])({}, attrs, {
          className: "map-popover"
        }), frozen ? /*#__PURE__*/_react["default"].createElement(PinnedButtons, null, horizontalPlacement === 'start' && /*#__PURE__*/_react["default"].createElement(StyledIcon, {
          className: "popover-arrow-left",
          onClick: moveLeft
        }, /*#__PURE__*/_react["default"].createElement(_icons.ArrowLeft, null)), /*#__PURE__*/_react["default"].createElement(StyledIcon, {
          className: "popover-pin",
          onClick: onClose
        }, /*#__PURE__*/_react["default"].createElement(_icons.Pin, {
          height: "16px"
        })), horizontalPlacement === 'end' && /*#__PURE__*/_react["default"].createElement(StyledIcon, {
          className: "popover-arrow-right",
          onClick: moveRight
        }, /*#__PURE__*/_react["default"].createElement(_icons.ArrowRight, null)), isBase && /*#__PURE__*/_react["default"].createElement("div", {
          className: "primary-label"
        }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
          id: "mapPopover.primary"
        }))) : null, /*#__PURE__*/_react["default"].createElement(PopoverContent, null, Array.isArray(coordinate) && /*#__PURE__*/_react["default"].createElement(CoordinateInfo, {
          coordinate: coordinate,
          zoom: zoom
        }), layerHoverProp && /*#__PURE__*/_react["default"].createElement(LayerHoverInfo, layerHoverProp)));
      }
    });
  };

  return (0, _reactIntl.injectIntl)(MapPopover);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21hcC9tYXAtcG9wb3Zlci5qcyJdLCJuYW1lcyI6WyJNQVhfV0lEVEgiLCJNQVhfSEVJR0hUIiwiU3R5bGVkTWFwUG9wb3ZlciIsInN0eWxlZCIsImRpdiIsInByb3BzIiwidGhlbWUiLCJzY3JvbGxCYXIiLCJmb250RmFtaWx5IiwicGFuZWxCYWNrZ3JvdW5kIiwidGV4dENvbG9yIiwicGFuZWxCb3hTaGFkb3ciLCJub3RpZmljYXRpb25Db2xvcnMiLCJzdWNjZXNzIiwidGV4dENvbG9ySGwiLCJQaW5uZWRCdXR0b25zIiwiUG9wb3ZlckNvbnRlbnQiLCJTdHlsZWRJY29uIiwiYWN0aXZlQ29sb3IiLCJsaW5rQnRuQ29sb3IiLCJNYXBQb3BvdmVyRmFjdG9yeSIsImRlcHMiLCJMYXllckhvdmVySW5mb0ZhY3RvcnkiLCJDb29yZGluYXRlSW5mb0ZhY3RvcnkiLCJjcmVhdGVWaXJ0dWFsUmVmZXJlbmNlIiwiY29udGFpbmVyIiwieCIsInkiLCJzaXplIiwiYm91bmRzIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwibGVmdCIsInRvcCIsInJpZ2h0IiwiYm90dG9tIiwid2lkdGgiLCJoZWlnaHQiLCJnZXRPZmZzZXRGb3JQbGFjZW1lbnQiLCJwbGFjZW1lbnQiLCJyZWZlcmVuY2UiLCJwb3BwZXIiLCJnYXAiLCJnZXRQb3BwZXJPcHRpb25zIiwibW9kaWZpZXJzIiwibmFtZSIsIm9wdGlvbnMiLCJib3VuZGFyeSIsIkxheWVySG92ZXJJbmZvIiwiQ29vcmRpbmF0ZUluZm8iLCJNYXBQb3BvdmVyIiwibWFwVyIsIm1hcEgiLCJmcm96ZW4iLCJjb29yZGluYXRlIiwibGF5ZXJIb3ZlclByb3AiLCJpc0Jhc2UiLCJ6b29tIiwib25DbG9zZSIsImhvcml6b250YWxQbGFjZW1lbnQiLCJzZXRIb3Jpem9udGFsUGxhY2VtZW50IiwibW92ZUxlZnQiLCJtb3ZlUmlnaHQiLCJkb2N1bWVudCIsImJvZHkiLCJhdHRycyIsIkFy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QURGLENBTkYsRUFTR0MsbUJBQW1CLEtBQUssS0FBeEIsaUJBQ0MsZ0NBQUMsVUFBRDtBQUFZLFVBQUEsU0FBUyxFQUFDLHFCQUF0QjtBQUE0QyxVQUFBLE9BQU8sRUFBRUc7QUFBckQsd0JBQ0UsZ0NBQUMsaUJBQUQsT0FERixDQVZKLEVBY0dOLE1BQU0saUJBQ0w7QUFBSyxVQUFBLFNBQVMsRUFBQztBQUFmLHdCQUNFLGdDQUFDLDhCQUFEO0FBQWtCLFVBQUEsRUFBRSxFQUFDO0FBQXJCLFVBREYsQ0FmSixDQURLLEdBcUJILElBdEJOLGVBdUJFLGdDQUFDLGNBQUQsUUFDR1UsS0FBSyxDQUFDQyxPQUFOLENBQWNiLFVBQWQsa0JBQTZCLGdDQUFDLGNBQUQ7QUFBZ0IsVUFBQSxVQUFVLEVBQUVBLFVBQTVCO0FBQXdDLFVBQUEsSUFBSSxFQUFFRztBQUE5QyxVQURoQyxFQUVHRixjQUFjLGlCQUFJLGdDQUFDLGNBQUQsRUFBb0JBLGNBQXBCLENBRnJCLENBdkJGLENBRFc7QUFBQTtBQVhmLE1BREY7QUE0Q0QsR0E1REQ7O0FBNkRBLFNBQU8sMkJBQVdMLFVBQVgsQ0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7dXNlU3RhdGV9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IExheWVySG92ZXJJbmZvRmFjdG9yeSBmcm9tICcuL2xheWVyLWhvdmVyLWluZm8nO1xuaW1wb3J0IENvb3JkaW5hdGVJbmZvRmFjdG9yeSBmcm9tICcuL2Nvb3JkaW5hdGUtaW5mbyc7XG5pbXBvcnQge0Fycm93TGVmdCwgQXJyb3dSaWdodCwgUGlufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5pbXBvcnQge2luamVjdEludGx9IGZyb20gJ3JlYWN0LWludGwnO1xuaW1wb3J0IHtGb3JtYXR0ZWRNZXNzYWdlfSBmcm9tICdsb2NhbGl6YXRpb24nO1xuaW1wb3J0IFRpcHB5IGZyb20gJ0B0aXBweWpzL3JlYWN0L2hlYWRsZXNzJztcblxuY29uc3QgTUFYX1dJRFRIID0gNTAwO1xuY29uc3QgTUFYX0hFSUdIVCA9IDYwMDtcblxuY29uc3QgU3R5bGVkTWFwUG9wb3ZlciA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIG1heC13aWR0aDogJHtNQVhfV0lEVEh9cHg7XG4gIG1heC1oZWlnaHQ6ICR7TUFYX0hFSUdIVH1weDtcbiAgcGFkZGluZzogMTRweDtcbiAgJiA+ICogKyAqIHtcbiAgICBtYXJnaW4tdG9wOiA2cHg7XG4gIH1cbiAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zY3JvbGxCYXJ9O1xuICBmb250LWZhbWlseTogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5mb250RmFtaWx5fTtcbiAgZm9udC1zaXplOiAxMXB4O1xuICBmb250LXdlaWdodDogNTAwO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsQmFja2dyb3VuZH07XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvcn07XG4gIHotaW5kZXg6IDEwMDA7XG4gIG92ZXJmbG93LXg6IGF1dG87XG4gIGJveC1zaGFkb3c6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucGFuZWxCb3hTaGFkb3d9O1xuXG4gIDpob3ZlciB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBgJHtwcm9wcy50aGVtZS5wYW5lbEJhY2tncm91bmR9ZGRgfTtcbiAgfVxuXG4gIC5wcmltYXJ5LWxhYmVsIHtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5ub3RpZmljYXRpb25Db2xvcnMuc3VjY2Vzc307XG4gICAgZm9udC1zaXplOiAxMHB4O1xuICB9XG5cbiAgLm1hcC1wb3BvdmVyX19sYXllci1pbmZvLFxuICAuY29vcmRpbmdhdGUtaG92ZXItaW5mbyB7XG4gICAgJiA+ICogKyAqIHtcbiAgICAgIG1hcmdpbi10b3A6IDdweDtcbiAgICB9XG4gIH1cblxuICB0YWJsZSB7XG4gICAgd2lkdGg6IGF1dG87XG4gICAgZGlzcGxheTogZ3JpZDtcbiAgICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xuICAgIHJvdy1nYXA6IDVweDtcbiAgICBjb2x1bW4tZ2FwOiA1cHg7XG4gIH1cblxuICAuY29vcmRpbmdhdGUtaG92ZXItaW5mbyA+IHRhYmxlIHtcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IGF1dG8gYXV0byBhdXRvO1xuICB9XG4gIC5tYXAtcG9wb3Zlcl9fbGF5ZXItaW5mbyA+IHRhYmxlIHtcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IGF1dG8gYXV0bztcbiAgfVxuXG4gIHRib2R5LFxuICB0ciB7XG4gICAgZGlzcGxheTogY29udGVudHM7XG4gIH1cblxuICB0ZCB7XG4gICAgYm9yZGVyLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuICB9XG5cbiAgdGQucm93X192YWx1ZSB7XG4gICAgdGV4dC1hbGlnbjogcmlnaHQ7XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbH07XG4gIH1cbmA7XG5cbmNvbnN0IFBpbm5lZEJ1dHRvbnMgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1zZWxmOiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcbiAgJiA+ICogKyAqIHtcbiAgICBtYXJnaW4tbGVmdDogMTBweDtcbiAgfVxuYDtcblxuY29uc3QgUG9wb3ZlckNvbnRlbnQgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAmID4gKiArICoge1xuICAgIG1hcmdpbi10b3A6IDEycHg7XG4gIH1cbmA7XG5cbmNvbnN0IFN0eWxlZEljb24gPSBzdHlsZWQuZGl2YFxuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5hY3RpdmVDb2xvcn07XG5cbiAgJi5wb3BvdmVyLXBpbiB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGUoMzBkZWcpO1xuICB9XG5cbiAgOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGlua0J0bkNvbG9yfTtcbiAgfVxuYDtcblxuTWFwUG9wb3ZlckZhY3RvcnkuZGVwcyA9IFtMYXllckhvdmVySW5mb0ZhY3RvcnksIENvb3JkaW5hdGVJbmZvRmFjdG9yeV07XG5cbmZ1bmN0aW9uIGNyZWF0ZVZpcnR1YWxSZWZlcmVuY2UoY29udGFpbmVyLCB4LCB5LCBzaXplID0gMCkge1xuICBjb25zdCBib3VuZHMgPVxuICAgIGNvbnRhaW5lciAmJiBjb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0ID8gY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpIDoge307XG4gIGNvbnN0IGxlZnQgPSAoYm91bmRzLmxlZnQgfHwgMCkgKyB4IC0gc2l6ZSAvIDI7XG4gIGNvbnN0IHRvcCA9IChib3VuZHMudG9wIHx8IDApICsgeSAtIHNpemUgLyAyO1xuICByZXR1cm4ge1xuICAgIGxlZnQsXG4gICAgdG9wLFxuICAgIHJpZ2h0OiBsZWZ0ICsgc2l6ZSxcbiAgICBib3R0b206IHRvcCArIHNpemUsXG4gICAgd2lkdGg6IHNpemUsXG4gICAgaGVpZ2h0OiBzaXplXG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldE9mZnNldEZvclBsYWNlbWVudCh7cGxhY2VtZW50LCByZWZlcmVuY2UsIHBvcHBlcn0sIGdhcCA9IDIwKSB7XG4gIHN3aXRjaCAocGxhY2VtZW50KSB7XG4gICAgY2FzZSAndG9wLXN0YXJ0JzpcbiAgICBjYXNlICdib3R0b20tc3RhcnQnOlxuICAgICAgcmV0dXJuIFtnYXAsIGdhcF07XG4gICAgY2FzZSAndG9wLWVuZCc6XG4gICAgY2FzZSAnYm90dG9tLWVuZCc6XG4gICAgICByZXR1cm4gWy1nYXAsIGdhcF07XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBbMCwgMF07XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0UG9wcGVyT3B0aW9ucyhjb250YWluZXIpIHtcbiAgcmV0dXJuIHtcbiAgICBtb2RpZmllcnM6IFtcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ3ByZXZlbnRPdmVyZmxvdycsXG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICBib3VuZGFyeTogY29udGFpbmVyXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE1hcFBvcG92ZXJGYWN0b3J5KExheWVySG92ZXJJbmZvLCBDb29yZGluYXRlSW5mbykge1xuICAvKiogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vbWFwLXBvcG92ZXInKS5NYXBQb3BvdmVyfSAqL1xuICBjb25zdCBNYXBQb3BvdmVyID0gKHtcbiAgICB4LFxuICAgIHksXG4gICAgbWFwVyxcbiAgICBtYXBILFxuICAgIGZyb3plbixcbiAgICBjb29yZGluYXRlLFxuICAgIGxheWVySG92ZXJQcm9wLFxuICAgIGlzQmFzZSxcbiAgICB6b29tLFxuICAgIGNvbnRhaW5lcixcbiAgICBvbkNsb3NlXG4gIH0pID0+IHtcbiAgICBjb25zdCBbaG9yaXpvbnRhbFBsYWNlbWVudCwgc2V0SG9yaXpvbnRhbFBsYWNlbWVudF0gPSB1c2VTdGF0ZSgnc3RhcnQnKTtcbiAgICBjb25zdCBtb3ZlTGVmdCA9ICgpID0+IHNldEhvcml6b250YWxQbGFjZW1lbnQoJ2VuZCcpO1xuICAgIGNvbnN0IG1vdmVSaWdodCA9ICgpID0+IHNldEhvcml6b250YWxQbGFjZW1lbnQoJ3N0YXJ0Jyk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxUaXBweVxuICAgICAgICBwb3BwZXJPcHRpb25zPXtnZXRQb3BwZXJPcHRpb25zKGNvbnRhaW5lcil9XG4gICAgICAgIHpJbmRleD17OTk5fSAvKiBzaG91bGQgYmUgYmVsb3cgTW9kYWwgd2hpY2ggaGFzIHpJbmRleD0xMDAwICovXG4gICAgICAgIHZpc2libGU9e3RydWV9XG4gICAgICAgIGludGVyYWN0aXZlPXt0cnVlfVxuICAgICAgICBnZXRSZWZlcmVuY2VDbGllbnRSZWN0PXsoKSA9PiBjcmVhdGVWaXJ0dWFsUmVmZXJlbmNlKGNvbnRhaW5lciwgeCwgeSl9XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgcGxhY2VtZW50PXtgYm90dG9tLSR7aG9yaXpvbnRhbFBsYWNlbWVudH1gfVxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIG9mZnNldD17Z2V0T2Zmc2V0Rm9yUGxhY2VtZW50fVxuICAgICAgICBhcHBlbmRUbz17ZG9jdW1lbnQuYm9keX1cbiAgICAgICAgcmVuZGVyPXthdHRycyA9PiAoXG4gICAgICAgICAgPFN0eWxlZE1hcFBvcG92ZXIgey4uLmF0dHJzfSBjbGFzc05hbWU9XCJtYXAtcG9wb3ZlclwiPlxuICAgICAgICAgICAge2Zyb3plbiA/IChcbiAgICAgICAgICAgICAgPFBpbm5lZEJ1dHRvbnM+XG4gICAgICAgICAgICAgICAge2hvcml6b250YWxQbGFjZW1lbnQgPT09ICdzdGFydCcgJiYgKFxuICAgICAgICAgICAgICAgICAgPFN0eWxlZEljb24gY2xhc3NOYW1lPVwicG9wb3Zlci1hcnJvdy1sZWZ0XCIgb25DbGljaz17bW92ZUxlZnR9PlxuICAgICAgICAgICAgICAgICAgICA8QXJyb3dMZWZ0IC8+XG4gICAgICAgICAgICAgICAgICA8L1N0eWxlZEljb24+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICA8U3R5bGVkSWNvbiBjbGFzc05hbWU9XCJwb3BvdmVyLXBpblwiIG9uQ2xpY2s9e29uQ2xvc2V9PlxuICAgICAgICAgICAgICAgICAgPFBpbiBoZWlnaHQ9XCIxNnB4XCIgLz5cbiAgICAgICAgICAgICAgICA8L1N0eWxlZEljb24+XG4gICAgICAgICAgICAgICAge2hvcml6b250YWxQbGFjZW1lbnQgPT09ICdlbmQnICYmIChcbiAgICAgICAgICAgICAgICAgIDxTdHlsZWRJY29uIGNsYXNzTmFtZT1cInBvcG92ZXItYXJyb3ctcmlnaHRcIiBvbkNsaWNrPXttb3ZlUmlnaHR9PlxuICAgICAgICAgICAgICAgICAgICA8QXJyb3dSaWdodCAvPlxuICAgICAgICAgICAgICAgICAgPC9TdHlsZWRJY29uPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAge2lzQmFzZSAmJiAoXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInByaW1hcnktbGFiZWxcIj5cbiAgICAgICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9XCJtYXBQb3BvdmVyLnByaW1hcnlcIiAvPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPC9QaW5uZWRCdXR0b25zPlxuICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgICA8UG9wb3ZlckNvbnRlbnQ+XG4gICAgICAgICAgICAgIHtBcnJheS5pc0FycmF5KGNvb3JkaW5hdGUpICYmIDxDb29yZGluYXRlSW5mbyBjb29yZGluYXRlPXtjb29yZGluYXRlfSB6b29tPXt6b29tfSAvPn1cbiAgICAgICAgICAgICAge2xheWVySG92ZXJQcm9wICYmIDxMYXllckhvdmVySW5mbyB7Li4ubGF5ZXJIb3ZlclByb3B9IC8+fVxuICAgICAgICAgICAgPC9Qb3BvdmVyQ29udGVudD5cbiAgICAgICAgICA8L1N0eWxlZE1hcFBvcG92ZXI+XG4gICAgICAgICl9XG4gICAgICAvPlxuICAgICk7XG4gIH07XG4gIHJldHVybiBpbmplY3RJbnRsKE1hcFBvcG92ZXIpO1xufVxuIl19
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _panelHeaderAction = _interopRequireDefault(require("../panel-header-action"));

var _icons = require("../../common/icons");

var _styledComponents2 = require("../../common/styled-components");

var _reactIntl = require("react-intl");

var _utils = require("../../../utils/utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  margin-bottom: 10px;\n  display: flex;\n  justify-content: space-between;\n\n  &:last-child {\n    margin-bottom: 0;\n  }\n\n  .layer-group__visibility-toggle {\n    margin-right: 12px;\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  padding-bottom: 12px;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var StyledInteractionPanel = _styledComponents["default"].div(_templateObject());

var StyledLayerGroupItem = _styledComponents["default"].div(_templateObject2());

var LayerLabel = (0, _styledComponents["default"])(_styledComponents2.PanelLabelBold)(_templateObject3(), function (props) {
  return props.active ? props.theme.textColor : props.theme.labelColor;
});

function LayerGroupSelectorFactory() {
  var LayerGroupSelector = function LayerGroupSelector(_ref) {
    var layers = _ref.layers,
        editableLayers = _ref.editableLayers,
        onChange = _ref.onChange,
        topLayers = _ref.topLayers;
    return _react["default"].createElement(StyledInteractionPanel, {
      className: "map-style__layer-group__selector"
    }, _react["default"].createElement("div", {
      className: "layer-group__header"
    }, _react["default"].createElement(_styledComponents2.PanelLabel, null, _react["default"].createElement(_reactIntl.FormattedMessage, {
      id: 'mapLayers.title'
    }))), _react["default"].createElement(_styledComponents2.PanelContent, {
      className: "map-style__layer-group"
    }, editableLayers.map(function (slug) {
      return _react["default"].createElement(StyledLayerGroupItem, {
        className: "layer-group__select",
        key: slug
      }, _react["default"].createElement(_styledComponents2.PanelLabelWrapper, null, _react["default"].createElement(_panelHeaderAction["default"], {
        className: "layer-group__visibility-toggle",
        id: "".concat(slug, "-toggle"),
        tooltip: layers[slug] ? 'tooltip.hide' : 'tooltip.show',
        onClick: function onClick() {
          return onChange({
            visibleLayerGroups: _objectSpread({}, layers, (0, _defineProperty2["default"])({}, slug, !layers[slug]))
          });
        },
        IconComponent: layers[slug] ? _icons.EyeSeen : _icons.EyeUnseen,
        active: layers[slug],
        flush: true
      }), _react["default"].createElement(LayerLabel, {
        active: layers[slug]
      }, _react["default"].createElement(_reactIntl.FormattedMessage, {
        id: "mapLayers.".concat((0, _utils.camelize)(slug))
      }))), _react["default"].createElement(_styledComponents2.CenterFlexbox, {
        className: "layer-group__bring-top"
      }, _react["default"].createElement(_panelHeaderAction["default"], {
        id: "".concat(slug, "-top"),
        tooltip: "tooltip.moveToTop",
        disabled: !layers[slug],
        IconComponent: _icons.Upload,
        active: topLayers[slug],
        onClick: function onClick() {
          return onChange({
            topLayerGroups: _objectSpread({}, topLayers, (0, _defineProperty2["default"])({}, slug, !topLayers[slug]))
          });
        }
      })));
    })));
  };

  return LayerGroupSelector;
}

var _default = LayerGroupSelectorFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbWFwLXN0eWxlLXBhbmVsL21hcC1sYXllci1zZWxlY3Rvci5qcyJdLCJuYW1lcyI6WyJTdHlsZWRJbnRlcmFjdGlvblBhbmVsIiwic3R5bGVkIiwiZGl2IiwiU3R5bGVkTGF5ZXJHcm91cEl0ZW0iLCJMYXllckxhYmVsIiwiUGFuZWxMYWJlbEJvbGQiLCJwcm9wcyIsImFjdGl2ZSIsInRoZW1lIiwidGV4dENvbG9yIiwibGFiZWxDb2xvciIsIkxheWVyR3JvdXBTZWxlY3RvckZhY3RvcnkiLCJMYXllckdyb3VwU2VsZWN0b3IiLCJsYXllcnMiLCJlZGl0YWJsZUxheWVycyIsIm9uQ2hhbmdlIiwidG9wTGF5ZXJzIiwibWFwIiwic2x1ZyIsInZpc2libGVMYXllckdyb3VwcyIsIkV5ZVNlZW4iLCJFeWVVbnNlZW4iLCJVcGxvYWQiLCJ0b3BMYXllckdyb3VwcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFPQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsc0JBQXNCLEdBQUdDLDZCQUFPQyxHQUFWLG1CQUE1Qjs7QUFJQSxJQUFNQyxvQkFBb0IsR0FBR0YsNkJBQU9DLEdBQVYsb0JBQTFCOztBQWNBLElBQU1FLFVBQVUsR0FBRyxrQ0FBT0MsaUNBQVAsQ0FBSCxxQkFDTCxVQUFBQyxLQUFLO0FBQUEsU0FBS0EsS0FBSyxDQUFDQyxNQUFOLEdBQWVELEtBQUssQ0FBQ0UsS0FBTixDQUFZQyxTQUEzQixHQUF1Q0gsS0FBSyxDQUFDRSxLQUFOLENBQVlFLFVBQXhEO0FBQUEsQ0FEQSxDQUFoQjs7QUFJQSxTQUFTQyx5QkFBVCxHQUFxQztBQUNuQyxNQUFNQyxrQkFBa0IsR0FBRyxTQUFyQkEsa0JBQXFCO0FBQUEsUUFBRUMsTUFBRixRQUFFQSxNQUFGO0FBQUEsUUFBVUMsY0FBVixRQUFVQSxjQUFWO0FBQUEsUUFBMEJDLFFBQTFCLFFBQTBCQSxRQUExQjtBQUFBLFFBQW9DQyxTQUFwQyxRQUFvQ0EsU0FBcEM7QUFBQSxXQUN6QixnQ0FBQyxzQkFBRDtBQUF3QixNQUFBLFNBQVMsRUFBQztBQUFsQyxPQUNFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixPQUNFLGdDQUFDLDZCQUFELFFBQ0UsZ0NBQUMsMkJBQUQ7QUFBa0IsTUFBQSxFQUFFLEVBQUU7QUFBdEIsTUFERixDQURGLENBREYsRUFNRSxnQ0FBQywrQkFBRDtBQUFjLE1BQUEsU0FBUyxFQUFDO0FBQXhCLE9BQ0dGLGNBQWMsQ0FBQ0csR0FBZixDQUFtQixVQUFBQyxJQUFJO0FBQUEsYUFDdEIsZ0NBQUMsb0JBQUQ7QUFBc0IsUUFBQSxTQUFTLEVBQUMscUJBQWhDO0FBQXNELFFBQUEsR0FBRyxFQUFFQTtBQUEzRCxTQUNFLGdDQUFDLG9DQUFELFFBQ0UsZ0NBQUMsNkJBQUQ7QUFDRSxRQUFBLFNBQVMsRUFBQyxnQ0FEWjtBQUVFLFFBQUEsRUFBRSxZQUFLQSxJQUFMLFlBRko7QUFHRSxRQUFBLE9BQU8sRUFBRUwsTUFBTSxDQUFDSyxJQUFELENBQU4sR0FBZSxjQUFmLEdBQWdDLGNBSDNDO0FBSUUsUUFBQSxPQUFPLEVBQUU7QUFBQSxpQkFDUEgsUUFBUSxDQUFDO0FBQ1BJLFlBQUFBLGtCQUFrQixvQkFDYk4sTUFEYSx1Q0FFZkssSUFGZSxFQUVSLENBQUNMLE1BQU0sQ0FBQ0ssSUFBRCxDQUZDO0FBRFgsV0FBRCxDQUREO0FBQUEsU0FKWDtBQVlFLFFBQUEsYUFBYSxFQUFFTCxNQUFNLENBQUNLLElBQUQsQ0FBTixHQUFlRSxjQUFmLEdBQXlCQyxnQkFaMUM7QUFhRSxRQUFBLE1BQU0sRUFBRVIsTUFBTSxDQUFDSyxJQUFELENBYmhCO0FBY0UsUUFBQSxLQUFLO0FBZFAsUUFERixFQWlCRSxnQ0FBQyxVQUFEO0FBQVksUUFBQSxNQUFNLEVBQUVMLE1BQU0sQ0FBQ0ssSUFBRDtBQUExQixTQUNFLGdDQUFDLDJCQUFEO0FBQWtCLFFBQUEsRUFBRSxzQkFBZSxxQkFBU0EsSUFBVCxDQUFmO0FBQXBCLFFBREYsQ0FqQkYsQ0FERixFQXNCRSxnQ0FBQyxnQ0FBRDtBQUFlLFFBQUEsU0FBUyxFQUFDO0FBQXpCLFNBQ0UsZ0NBQUMsNkJBQUQ7QUFDRSxRQUFBLEVBQUUsWUFBS0EsSUFBTCxTQURKO0FBRUUsUUFBQSxPQUFPLEVBQUMsbUJBRlY7QUFHRSxRQUFBLFFBQVEsRUFBRSxDQUFDTCxNQUFNLENBQUNLLElBQUQsQ0FIbkI7QUFJRSxRQUFBLGFBQWEsRUFBRUksYUFKakI7QUFLRSxRQUFBLE1BQU0sRUFBRU4sU0FBUyxDQUFDRSxJQUFELENBTG5CO0FBTUUsUUFBQSxPQUFPLEVBQUU7QUFBQSxpQkFDUEgsUUFBUSxDQUFDO0FBQ1BRLFlBQUFBLGNBQWMsb0JBQ1RQLFNBRFMsdUNBRVhFLElBRlcsRUFFSixDQUFDRixTQUFTLENBQUNFLElBQUQsQ0FGTjtBQURQLFdBQUQsQ0FERDtBQUFBO0FBTlgsUUFERixDQXRCRixDQURzQjtBQUFBLEtBQXZCLENBREgsQ0FORixDQUR5QjtBQUFBLEdBQTNCOztBQXNEQSxTQUFPTixrQkFBUDtBQUNEOztlQUVjRCx5QiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBQYW5lbEhlYWRlckFjdGlvbiBmcm9tICdjb21wb25lbnRzL3NpZGUtcGFuZWwvcGFuZWwtaGVhZGVyLWFjdGlvbic7XG5pbXBvcnQge0V5ZVNlZW4sIEV5ZVVuc2VlbiwgVXBsb2FkfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5cbmltcG9ydCB7XG4gIFBhbmVsTGFiZWwsXG4gIFBhbmVsQ29udGVudCxcbiAgUGFuZWxMYWJlbEJvbGQsXG4gIFBhbmVsTGFiZWxXcmFwcGVyLFxuICBDZW50ZXJGbGV4Ym94XG59IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7Rm9ybWF0dGVkTWVzc2FnZX0gZnJvbSAncmVhY3QtaW50bCc7XG5pbXBvcnQge2NhbWVsaXplfSBmcm9tICd1dGlscy91dGlscyc7XG5cbmNvbnN0IFN0eWxlZEludGVyYWN0aW9uUGFuZWwgPSBzdHlsZWQuZGl2YFxuICBwYWRkaW5nLWJvdHRvbTogMTJweDtcbmA7XG5cbmNvbnN0IFN0eWxlZExheWVyR3JvdXBJdGVtID0gc3R5bGVkLmRpdmBcbiAgbWFyZ2luLWJvdHRvbTogMTBweDtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuXG4gICY6bGFzdC1jaGlsZCB7XG4gICAgbWFyZ2luLWJvdHRvbTogMDtcbiAgfVxuXG4gIC5sYXllci1ncm91cF9fdmlzaWJpbGl0eS10b2dnbGUge1xuICAgIG1hcmdpbi1yaWdodDogMTJweDtcbiAgfVxuYDtcblxuY29uc3QgTGF5ZXJMYWJlbCA9IHN0eWxlZChQYW5lbExhYmVsQm9sZClgXG4gIGNvbG9yOiAke3Byb3BzID0+IChwcm9wcy5hY3RpdmUgPyBwcm9wcy50aGVtZS50ZXh0Q29sb3IgOiBwcm9wcy50aGVtZS5sYWJlbENvbG9yKX07XG5gO1xuXG5mdW5jdGlvbiBMYXllckdyb3VwU2VsZWN0b3JGYWN0b3J5KCkge1xuICBjb25zdCBMYXllckdyb3VwU2VsZWN0b3IgPSAoe2xheWVycywgZWRpdGFibGVMYXllcnMsIG9uQ2hhbmdlLCB0b3BMYXllcnN9KSA9PiAoXG4gICAgPFN0eWxlZEludGVyYWN0aW9uUGFuZWwgY2xhc3NOYW1lPVwibWFwLXN0eWxlX19sYXllci1ncm91cF9fc2VsZWN0b3JcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGF5ZXItZ3JvdXBfX2hlYWRlclwiPlxuICAgICAgICA8UGFuZWxMYWJlbD5cbiAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21hcExheWVycy50aXRsZSd9IC8+XG4gICAgICAgIDwvUGFuZWxMYWJlbD5cbiAgICAgIDwvZGl2PlxuICAgICAgPFBhbmVsQ29udGVudCBjbGFzc05hbWU9XCJtYXAtc3R5bGVfX2xheWVyLWdyb3VwXCI+XG4gICAgICAgIHtlZGl0YWJsZUxheWVycy5tYXAoc2x1ZyA9PiAoXG4gICAgICAgICAgPFN0eWxlZExheWVyR3JvdXBJdGVtIGNsYXNzTmFtZT1cImxheWVyLWdyb3VwX19zZWxlY3RcIiBrZXk9e3NsdWd9PlxuICAgICAgICAgICAgPFBhbmVsTGFiZWxXcmFwcGVyPlxuICAgICAgICAgICAgICA8UGFuZWxIZWFkZXJBY3Rpb25cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJsYXllci1ncm91cF9fdmlzaWJpbGl0eS10b2dnbGVcIlxuICAgICAgICAgICAgICAgIGlkPXtgJHtzbHVnfS10b2dnbGVgfVxuICAgICAgICAgICAgICAgIHRvb2x0aXA9e2xheWVyc1tzbHVnXSA/ICd0b29sdGlwLmhpZGUnIDogJ3Rvb2x0aXAuc2hvdyd9XG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT5cbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlKHtcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJsZUxheWVyR3JvdXBzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgLi4ubGF5ZXJzLFxuICAgICAgICAgICAgICAgICAgICAgIFtzbHVnXTogIWxheWVyc1tzbHVnXVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBJY29uQ29tcG9uZW50PXtsYXllcnNbc2x1Z10gPyBFeWVTZWVuIDogRXllVW5zZWVufVxuICAgICAgICAgICAgICAgIGFjdGl2ZT17bGF5ZXJzW3NsdWddfVxuICAgICAgICAgICAgICAgIGZsdXNoXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDxMYXllckxhYmVsIGFjdGl2ZT17bGF5ZXJzW3NsdWddfT5cbiAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17YG1hcExheWVycy4ke2NhbWVsaXplKHNsdWcpfWB9IC8+XG4gICAgICAgICAgICAgIDwvTGF5ZXJMYWJlbD5cbiAgICAgICAgICAgIDwvUGFuZWxMYWJlbFdyYXBwZXI+XG4gICAgICAgICAgICA8Q2VudGVyRmxleGJveCBjbGFzc05hbWU9XCJsYXllci1ncm91cF9fYnJpbmctdG9wXCI+XG4gICAgICAgICAgICAgIDxQYW5lbEhlYWRlckFjdGlvblxuICAgICAgICAgICAgICAgIGlkPXtgJHtzbHVnfS10b3BgfVxuICAgICAgICAgICAgICAgIHRvb2x0aXA9XCJ0b29sdGlwLm1vdmVUb1RvcFwiXG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ9eyFsYXllcnNbc2x1Z119XG4gICAgICAgICAgICAgICAgSWNvbkNvbXBvbmVudD17VXBsb2FkfVxuICAgICAgICAgICAgICAgIGFjdGl2ZT17dG9wTGF5ZXJzW3NsdWddfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+XG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZSh7XG4gICAgICAgICAgICAgICAgICAgIHRvcExheWVyR3JvdXBzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgLi4udG9wTGF5ZXJzLFxuICAgICAgICAgICAgICAgICAgICAgIFtzbHVnXTogIXRvcExheWVyc1tzbHVnXVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvQ2VudGVyRmxleGJveD5cbiAgICAgICAgICA8L1N0eWxlZExheWVyR3JvdXBJdGVtPlxuICAgICAgICApKX1cbiAgICAgIDwvUGFuZWxDb250ZW50PlxuICAgIDwvU3R5bGVkSW50ZXJhY3Rpb25QYW5lbD5cbiAgKTtcblxuICByZXR1cm4gTGF5ZXJHcm91cFNlbGVjdG9yO1xufVxuXG5leHBvcnQgZGVmYXVsdCBMYXllckdyb3VwU2VsZWN0b3JGYWN0b3J5O1xuIl19
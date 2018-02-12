'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  display: flex;\n  justify-content: space-between;\n  \n  .vis-config-switch__title {\n    display: flex;\n  }\n'], ['\n  display: flex;\n  justify-content: space-between;\n  \n  .vis-config-switch__title {\n    display: flex;\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _infoHelper = require('../../common/info-helper');

var _infoHelper2 = _interopRequireDefault(_infoHelper);

var _switch = require('../../common/switch');

var _switch2 = _interopRequireDefault(_switch);

var _styledComponents3 = require('../../common/styled-components');

var _utils = require('../../../utils/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  layer: _propTypes2.default.object.isRequired,
  property: _propTypes2.default.string.isRequired,
  onChange: _propTypes2.default.func.isRequired,
  label: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.bool, _propTypes2.default.func]),
  description: _propTypes2.default.string,
  disabled: _propTypes2.default.bool
};

var StyledVisConfigSwitch = _styledComponents2.default.div(_templateObject);

var VisConfigSwitch = function VisConfigSwitch(_ref) {
  var _ref$layer = _ref.layer,
      id = _ref$layer.id,
      config = _ref$layer.config,
      property = _ref.property,
      _onChange2 = _ref.onChange,
      label = _ref.label,
      description = _ref.description,
      disabled = _ref.disabled;
  return _react2.default.createElement(
    _styledComponents3.SidePanelSection,
    { disabled: Boolean(disabled) },
    _react2.default.createElement(
      StyledVisConfigSwitch,
      { className: 'vis-config-switch' },
      _react2.default.createElement(
        'div',
        { className: 'vis-config-switch__title' },
        label ? _react2.default.createElement(
          _styledComponents3.PanelLabel,
          null,
          label || (0, _utils.capitalizeFirstLetter)(property)
        ) : null,
        description ? _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(_infoHelper2.default, { description: description, id: id + '-' + property })
        ) : null
      ),
      _react2.default.createElement(
        'div',
        { className: 'vis-config-switch__switch' },
        _react2.default.createElement(_switch2.default, {
          checked: config.visConfig[property],
          id: id + '-' + property,
          onChange: function onChange() {
            return _onChange2((0, _defineProperty3.default)({}, property, !config.visConfig[property]));
          }
        })
      )
    )
  );
};

VisConfigSwitch.propTypes = propTypes;

exports.default = VisConfigSwitch;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvdmlzLWNvbmZpZy1zd2l0Y2guanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwibGF5ZXIiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwicHJvcGVydHkiLCJzdHJpbmciLCJvbkNoYW5nZSIsImZ1bmMiLCJsYWJlbCIsIm9uZU9mVHlwZSIsImJvb2wiLCJkZXNjcmlwdGlvbiIsImRpc2FibGVkIiwiU3R5bGVkVmlzQ29uZmlnU3dpdGNoIiwiZGl2IiwiVmlzQ29uZmlnU3dpdGNoIiwiaWQiLCJjb25maWciLCJCb29sZWFuIiwidmlzQ29uZmlnIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBRUEsSUFBTUEsWUFBWTtBQUNoQkMsU0FBTyxvQkFBVUMsTUFBVixDQUFpQkMsVUFEUjtBQUVoQkMsWUFBVSxvQkFBVUMsTUFBVixDQUFpQkYsVUFGWDtBQUdoQkcsWUFBVSxvQkFBVUMsSUFBVixDQUFlSixVQUhUO0FBSWhCSyxTQUFPLG9CQUFVQyxTQUFWLENBQW9CLENBQ3pCLG9CQUFVSixNQURlLEVBRXpCLG9CQUFVSyxJQUZlLEVBR3pCLG9CQUFVSCxJQUhlLENBQXBCLENBSlM7QUFTaEJJLGVBQWEsb0JBQVVOLE1BVFA7QUFVaEJPLFlBQVUsb0JBQVVGO0FBVkosQ0FBbEI7O0FBYUEsSUFBTUcsd0JBQXdCLDJCQUFPQyxHQUEvQixpQkFBTjs7QUFTQSxJQUFNQyxrQkFBa0IsU0FBbEJBLGVBQWtCO0FBQUEsd0JBQ3RCZCxLQURzQjtBQUFBLE1BQ2RlLEVBRGMsY0FDZEEsRUFEYztBQUFBLE1BQ1ZDLE1BRFUsY0FDVkEsTUFEVTtBQUFBLE1BRXRCYixRQUZzQixRQUV0QkEsUUFGc0I7QUFBQSxNQUd0QkUsVUFIc0IsUUFHdEJBLFFBSHNCO0FBQUEsTUFJdEJFLEtBSnNCLFFBSXRCQSxLQUpzQjtBQUFBLE1BS3RCRyxXQUxzQixRQUt0QkEsV0FMc0I7QUFBQSxNQU10QkMsUUFOc0IsUUFNdEJBLFFBTnNCO0FBQUEsU0FRdEI7QUFBQTtBQUFBLE1BQWtCLFVBQVVNLFFBQVFOLFFBQVIsQ0FBNUI7QUFDRTtBQUFDLDJCQUFEO0FBQUEsUUFBdUIsV0FBVSxtQkFBakM7QUFDRTtBQUFBO0FBQUEsVUFBSyxXQUFVLDBCQUFmO0FBQ0dKLGdCQUFRO0FBQUE7QUFBQTtBQUFhQSxtQkFBUyxrQ0FBc0JKLFFBQXRCO0FBQXRCLFNBQVIsR0FBOEUsSUFEakY7QUFFR08sc0JBQ0M7QUFBQTtBQUFBO0FBQ0UsZ0VBQVksYUFBYUEsV0FBekIsRUFBc0MsSUFBT0ssRUFBUCxTQUFhWixRQUFuRDtBQURGLFNBREQsR0FJRztBQU5OLE9BREY7QUFTRTtBQUFBO0FBQUEsVUFBSyxXQUFVLDJCQUFmO0FBQ0U7QUFDRSxtQkFBU2EsT0FBT0UsU0FBUCxDQUFpQmYsUUFBakIsQ0FEWDtBQUVFLGNBQU9ZLEVBQVAsU0FBYVosUUFGZjtBQUdFLG9CQUFVO0FBQUEsbUJBQU1FLDZDQUFXRixRQUFYLEVBQXNCLENBQUNhLE9BQU9FLFNBQVAsQ0FBaUJmLFFBQWpCLENBQXZCLEVBQU47QUFBQTtBQUhaO0FBREY7QUFURjtBQURGLEdBUnNCO0FBQUEsQ0FBeEI7O0FBNkJBVyxnQkFBZ0JmLFNBQWhCLEdBQTRCQSxTQUE1Qjs7a0JBRWVlLGUiLCJmaWxlIjoidmlzLWNvbmZpZy1zd2l0Y2guanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IEluZm9IZWxwZXIgZnJvbSAnY29tcG9uZW50cy9jb21tb24vaW5mby1oZWxwZXInO1xuaW1wb3J0IFN3aXRjaCBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zd2l0Y2gnO1xuaW1wb3J0IHtTaWRlUGFuZWxTZWN0aW9uLCBQYW5lbExhYmVsfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge2NhcGl0YWxpemVGaXJzdExldHRlcn0gZnJvbSAndXRpbHMvdXRpbHMnO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIGxheWVyOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIHByb3BlcnR5OiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBsYWJlbDogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgUHJvcFR5cGVzLnN0cmluZyxcbiAgICBQcm9wVHlwZXMuYm9vbCxcbiAgICBQcm9wVHlwZXMuZnVuY1xuICBdKSxcbiAgZGVzY3JpcHRpb246IFByb3BUeXBlcy5zdHJpbmcsXG4gIGRpc2FibGVkOiBQcm9wVHlwZXMuYm9vbFxufTtcblxuY29uc3QgU3R5bGVkVmlzQ29uZmlnU3dpdGNoID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBcbiAgLnZpcy1jb25maWctc3dpdGNoX190aXRsZSB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgfVxuYDtcblxuY29uc3QgVmlzQ29uZmlnU3dpdGNoID0gKHtcbiAgbGF5ZXI6IHtpZCwgY29uZmlnfSxcbiAgcHJvcGVydHksXG4gIG9uQ2hhbmdlLFxuICBsYWJlbCxcbiAgZGVzY3JpcHRpb24sXG4gIGRpc2FibGVkXG59KSA9PiAoXG4gIDxTaWRlUGFuZWxTZWN0aW9uIGRpc2FibGVkPXtCb29sZWFuKGRpc2FibGVkKX0+XG4gICAgPFN0eWxlZFZpc0NvbmZpZ1N3aXRjaCBjbGFzc05hbWU9XCJ2aXMtY29uZmlnLXN3aXRjaFwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ2aXMtY29uZmlnLXN3aXRjaF9fdGl0bGVcIj5cbiAgICAgICAge2xhYmVsID8gPFBhbmVsTGFiZWw+e2xhYmVsIHx8IGNhcGl0YWxpemVGaXJzdExldHRlcihwcm9wZXJ0eSl9PC9QYW5lbExhYmVsPiA6IG51bGx9XG4gICAgICAgIHtkZXNjcmlwdGlvbiA/IChcbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPEluZm9IZWxwZXIgZGVzY3JpcHRpb249e2Rlc2NyaXB0aW9ufSBpZD17YCR7aWR9LSR7cHJvcGVydHl9YH0gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidmlzLWNvbmZpZy1zd2l0Y2hfX3N3aXRjaFwiPlxuICAgICAgICA8U3dpdGNoXG4gICAgICAgICAgY2hlY2tlZD17Y29uZmlnLnZpc0NvbmZpZ1twcm9wZXJ0eV19XG4gICAgICAgICAgaWQ9e2Ake2lkfS0ke3Byb3BlcnR5fWB9XG4gICAgICAgICAgb25DaGFuZ2U9eygpID0+IG9uQ2hhbmdlKHtbcHJvcGVydHldOiAhY29uZmlnLnZpc0NvbmZpZ1twcm9wZXJ0eV19KX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvU3R5bGVkVmlzQ29uZmlnU3dpdGNoPlxuICA8L1NpZGVQYW5lbFNlY3Rpb24+XG4pO1xuXG5WaXNDb25maWdTd2l0Y2gucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuXG5leHBvcnQgZGVmYXVsdCBWaXNDb25maWdTd2l0Y2g7XG4iXX0=
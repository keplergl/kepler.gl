'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: flex;\n  justify-content: space-between;\n  \n  .vis-config-switch__title {\n    display: flex;\n  }\n'], ['\n  display: flex;\n  justify-content: space-between;\n  \n  .vis-config-switch__title {\n    display: flex;\n  }\n']);

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
          label || capitalizeFirstLetter(property)
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
            var _onChange;

            return _onChange2((_onChange = {}, _onChange[property] = !config.visConfig[property], _onChange));
          }
        })
      )
    )
  );
};

VisConfigSwitch.propTypes = propTypes;

exports.default = VisConfigSwitch;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvdmlzLWNvbmZpZy1zd2l0Y2guanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwibGF5ZXIiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwicHJvcGVydHkiLCJzdHJpbmciLCJvbkNoYW5nZSIsImZ1bmMiLCJsYWJlbCIsIm9uZU9mVHlwZSIsImJvb2wiLCJkZXNjcmlwdGlvbiIsImRpc2FibGVkIiwiU3R5bGVkVmlzQ29uZmlnU3dpdGNoIiwiZGl2IiwiVmlzQ29uZmlnU3dpdGNoIiwiaWQiLCJjb25maWciLCJCb29sZWFuIiwiY2FwaXRhbGl6ZUZpcnN0TGV0dGVyIiwidmlzQ29uZmlnIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxZQUFZO0FBQ2hCQyxTQUFPLG9CQUFVQyxNQUFWLENBQWlCQyxVQURSO0FBRWhCQyxZQUFVLG9CQUFVQyxNQUFWLENBQWlCRixVQUZYO0FBR2hCRyxZQUFVLG9CQUFVQyxJQUFWLENBQWVKLFVBSFQ7QUFJaEJLLFNBQU8sb0JBQVVDLFNBQVYsQ0FBb0IsQ0FDekIsb0JBQVVKLE1BRGUsRUFFekIsb0JBQVVLLElBRmUsRUFHekIsb0JBQVVILElBSGUsQ0FBcEIsQ0FKUztBQVNoQkksZUFBYSxvQkFBVU4sTUFUUDtBQVVoQk8sWUFBVSxvQkFBVUY7QUFWSixDQUFsQjs7QUFhQSxJQUFNRyx3QkFBd0IsMkJBQU9DLEdBQS9CLGlCQUFOOztBQVNBLElBQU1DLGtCQUFrQixTQUFsQkEsZUFBa0I7QUFBQSx3QkFDdEJkLEtBRHNCO0FBQUEsTUFDZGUsRUFEYyxjQUNkQSxFQURjO0FBQUEsTUFDVkMsTUFEVSxjQUNWQSxNQURVO0FBQUEsTUFFdEJiLFFBRnNCLFFBRXRCQSxRQUZzQjtBQUFBLE1BR3RCRSxVQUhzQixRQUd0QkEsUUFIc0I7QUFBQSxNQUl0QkUsS0FKc0IsUUFJdEJBLEtBSnNCO0FBQUEsTUFLdEJHLFdBTHNCLFFBS3RCQSxXQUxzQjtBQUFBLE1BTXRCQyxRQU5zQixRQU10QkEsUUFOc0I7QUFBQSxTQVF0QjtBQUFBO0FBQUEsTUFBa0IsVUFBVU0sUUFBUU4sUUFBUixDQUE1QjtBQUNFO0FBQUMsMkJBQUQ7QUFBQSxRQUF1QixXQUFVLG1CQUFqQztBQUNFO0FBQUE7QUFBQSxVQUFLLFdBQVUsMEJBQWY7QUFDR0osZ0JBQVE7QUFBQTtBQUFBO0FBQWFBLG1CQUFTVyxzQkFBc0JmLFFBQXRCO0FBQXRCLFNBQVIsR0FBOEUsSUFEakY7QUFFR08sc0JBQ0M7QUFBQTtBQUFBO0FBQ0UsZ0VBQVksYUFBYUEsV0FBekIsRUFBc0MsSUFBT0ssRUFBUCxTQUFhWixRQUFuRDtBQURGLFNBREQsR0FJRztBQU5OLE9BREY7QUFTRTtBQUFBO0FBQUEsVUFBSyxXQUFVLDJCQUFmO0FBQ0U7QUFDRSxtQkFBU2EsT0FBT0csU0FBUCxDQUFpQmhCLFFBQWpCLENBRFg7QUFFRSxjQUFPWSxFQUFQLFNBQWFaLFFBRmY7QUFHRSxvQkFBVTtBQUFBOztBQUFBLG1CQUFNRSxzQ0FBV0YsUUFBWCxJQUFzQixDQUFDYSxPQUFPRyxTQUFQLENBQWlCaEIsUUFBakIsQ0FBdkIsYUFBTjtBQUFBO0FBSFo7QUFERjtBQVRGO0FBREYsR0FSc0I7QUFBQSxDQUF4Qjs7QUE2QkFXLGdCQUFnQmYsU0FBaEIsR0FBNEJBLFNBQTVCOztrQkFFZWUsZSIsImZpbGUiOiJ2aXMtY29uZmlnLXN3aXRjaC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgSW5mb0hlbHBlciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pbmZvLWhlbHBlcic7XG5pbXBvcnQgU3dpdGNoIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N3aXRjaCc7XG5pbXBvcnQge1NpZGVQYW5lbFNlY3Rpb24sIFBhbmVsTGFiZWx9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICBsYXllcjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBwcm9wZXJ0eTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgbGFiZWw6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgIFByb3BUeXBlcy5zdHJpbmcsXG4gICAgUHJvcFR5cGVzLmJvb2wsXG4gICAgUHJvcFR5cGVzLmZ1bmMsXG4gIF0pLFxuICBkZXNjcmlwdGlvbjogUHJvcFR5cGVzLnN0cmluZyxcbiAgZGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sXG59O1xuXG5jb25zdCBTdHlsZWRWaXNDb25maWdTd2l0Y2ggPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIFxuICAudmlzLWNvbmZpZy1zd2l0Y2hfX3RpdGxlIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICB9XG5gO1xuXG5jb25zdCBWaXNDb25maWdTd2l0Y2ggPSAoe1xuICBsYXllcjoge2lkLCBjb25maWd9LFxuICBwcm9wZXJ0eSxcbiAgb25DaGFuZ2UsXG4gIGxhYmVsLFxuICBkZXNjcmlwdGlvbixcbiAgZGlzYWJsZWRcbn0pID0+IChcbiAgPFNpZGVQYW5lbFNlY3Rpb24gZGlzYWJsZWQ9e0Jvb2xlYW4oZGlzYWJsZWQpfT5cbiAgICA8U3R5bGVkVmlzQ29uZmlnU3dpdGNoIGNsYXNzTmFtZT1cInZpcy1jb25maWctc3dpdGNoXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInZpcy1jb25maWctc3dpdGNoX190aXRsZVwiPlxuICAgICAgICB7bGFiZWwgPyA8UGFuZWxMYWJlbD57bGFiZWwgfHwgY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKHByb3BlcnR5KX08L1BhbmVsTGFiZWw+IDogbnVsbH1cbiAgICAgICAge2Rlc2NyaXB0aW9uID8gKFxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8SW5mb0hlbHBlciBkZXNjcmlwdGlvbj17ZGVzY3JpcHRpb259IGlkPXtgJHtpZH0tJHtwcm9wZXJ0eX1gfSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApIDogbnVsbH1cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ2aXMtY29uZmlnLXN3aXRjaF9fc3dpdGNoXCI+XG4gICAgICAgIDxTd2l0Y2hcbiAgICAgICAgICBjaGVja2VkPXtjb25maWcudmlzQ29uZmlnW3Byb3BlcnR5XX1cbiAgICAgICAgICBpZD17YCR7aWR9LSR7cHJvcGVydHl9YH1cbiAgICAgICAgICBvbkNoYW5nZT17KCkgPT4gb25DaGFuZ2Uoe1twcm9wZXJ0eV06ICFjb25maWcudmlzQ29uZmlnW3Byb3BlcnR5XX0pfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgPC9TdHlsZWRWaXNDb25maWdTd2l0Y2g+XG4gIDwvU2lkZVBhbmVsU2VjdGlvbj5cbik7XG5cblZpc0NvbmZpZ1N3aXRjaC5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG5cbmV4cG9ydCBkZWZhdWx0IFZpc0NvbmZpZ1N3aXRjaDtcbiJdfQ==
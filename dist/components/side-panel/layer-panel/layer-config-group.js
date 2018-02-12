'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StyledConfigGroupHeader = exports.StyledLayerConfigGroup = exports.StyledLayerConfigGroupLabel = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  border-left: 2px solid ', ';\n  color: ', ';\n  font-size: 12px;\n  font-weight: 500;\n  line-height: 12px;\n  margin-left: -12px;\n  padding-left: 10px;\n  text-transform: capitalize;\n  letter-spacing: 0.2px;\n'], ['\n  border-left: 2px solid ', ';\n  color: ', ';\n  font-size: 12px;\n  font-weight: 500;\n  line-height: 12px;\n  margin-left: -12px;\n  padding-left: 10px;\n  text-transform: capitalize;\n  letter-spacing: 0.2px;\n']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n  padding-left: 18px;\n  margin-bottom: 18px;\n'], ['\n  padding-left: 18px;\n  margin-bottom: 18px;\n']),
    _templateObject3 = (0, _taggedTemplateLiteral3.default)(['\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 12px;\n'], ['\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 12px;\n']),
    _templateObject4 = (0, _taggedTemplateLiteral3.default)(['\n  &.disabled {\n    opacity: 0.3;\n    pointer-events: none;\n    * {\n      pointer-events: none;\n    }\n  }\n'], ['\n  &.disabled {\n    opacity: 0.3;\n    pointer-events: none;\n    * {\n      pointer-events: none;\n    }\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _switch = require('../../common/switch');

var _switch2 = _interopRequireDefault(_switch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StyledLayerConfigGroupLabel = exports.StyledLayerConfigGroupLabel = _styledComponents2.default.div(_templateObject, function (props) {
  return props.theme.labelColor;
}, function (props) {
  return props.theme.textColor;
});

var StyledLayerConfigGroup = exports.StyledLayerConfigGroup = _styledComponents2.default.div(_templateObject2);

var StyledConfigGroupHeader = exports.StyledConfigGroupHeader = _styledComponents2.default.div(_templateObject3);

var ConfigGroupContent = _styledComponents2.default.div(_templateObject4);

var LayerConfigGroup = function LayerConfigGroup(_ref) {
  var group = _ref.group,
      label = _ref.label,
      children = _ref.children,
      property = _ref.property,
      layer = _ref.layer,
      _onChange2 = _ref.onChange;
  return _react2.default.createElement(
    StyledLayerConfigGroup,
    { className: 'layer-config-group' },
    _react2.default.createElement(
      StyledConfigGroupHeader,
      { className: 'layer-config-group__header' },
      _react2.default.createElement(
        StyledLayerConfigGroupLabel,
        { className: 'layer-config-group__label' },
        label
      ),
      property ? _react2.default.createElement(_switch2.default, {
        checked: layer.config.visConfig[property],
        id: layer.id + '-' + property,
        onChange: function onChange() {
          return _onChange2((0, _defineProperty3.default)({}, property, !layer.config.visConfig[property]));
        }
      }) : null
    ),
    _react2.default.createElement(
      ConfigGroupContent,
      {
        className: (0, _classnames2.default)('layer-config-group__content', {
          disabled: property && !layer.config.visConfig[property]
        })
      },
      children
    )
  );
};

exports.default = LayerConfigGroup;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvbGF5ZXItY29uZmlnLWdyb3VwLmpzIl0sIm5hbWVzIjpbIlN0eWxlZExheWVyQ29uZmlnR3JvdXBMYWJlbCIsImRpdiIsInByb3BzIiwidGhlbWUiLCJsYWJlbENvbG9yIiwidGV4dENvbG9yIiwiU3R5bGVkTGF5ZXJDb25maWdHcm91cCIsIlN0eWxlZENvbmZpZ0dyb3VwSGVhZGVyIiwiQ29uZmlnR3JvdXBDb250ZW50IiwiTGF5ZXJDb25maWdHcm91cCIsImdyb3VwIiwibGFiZWwiLCJjaGlsZHJlbiIsInByb3BlcnR5IiwibGF5ZXIiLCJvbkNoYW5nZSIsImNvbmZpZyIsInZpc0NvbmZpZyIsImlkIiwiZGlzYWJsZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVPLElBQU1BLG9FQUE4QiwyQkFBT0MsR0FBckMsa0JBQ2M7QUFBQSxTQUFTQyxNQUFNQyxLQUFOLENBQVlDLFVBQXJCO0FBQUEsQ0FEZCxFQUVGO0FBQUEsU0FBU0YsTUFBTUMsS0FBTixDQUFZRSxTQUFyQjtBQUFBLENBRkUsQ0FBTjs7QUFZQSxJQUFNQywwREFBeUIsMkJBQU9MLEdBQWhDLGtCQUFOOztBQUtBLElBQU1NLDREQUEwQiwyQkFBT04sR0FBakMsa0JBQU47O0FBT1AsSUFBTU8scUJBQXFCLDJCQUFPUCxHQUE1QixrQkFBTjs7QUFVQSxJQUFNUSxtQkFBbUIsU0FBbkJBLGdCQUFtQjtBQUFBLE1BQ3ZCQyxLQUR1QixRQUN2QkEsS0FEdUI7QUFBQSxNQUV2QkMsS0FGdUIsUUFFdkJBLEtBRnVCO0FBQUEsTUFHdkJDLFFBSHVCLFFBR3ZCQSxRQUh1QjtBQUFBLE1BSXZCQyxRQUp1QixRQUl2QkEsUUFKdUI7QUFBQSxNQUt2QkMsS0FMdUIsUUFLdkJBLEtBTHVCO0FBQUEsTUFNdkJDLFVBTnVCLFFBTXZCQSxRQU51QjtBQUFBLFNBUXZCO0FBQUMsMEJBQUQ7QUFBQSxNQUF3QixXQUFVLG9CQUFsQztBQUNFO0FBQUMsNkJBQUQ7QUFBQSxRQUF5QixXQUFVLDRCQUFuQztBQUNFO0FBQUMsbUNBQUQ7QUFBQSxVQUE2QixXQUFVLDJCQUF2QztBQUNHSjtBQURILE9BREY7QUFJR0UsaUJBQ0M7QUFDRSxpQkFBU0MsTUFBTUUsTUFBTixDQUFhQyxTQUFiLENBQXVCSixRQUF2QixDQURYO0FBRUUsWUFBT0MsTUFBTUksRUFBYixTQUFtQkwsUUFGckI7QUFHRSxrQkFBVTtBQUFBLGlCQUNSRSw2Q0FBV0YsUUFBWCxFQUFzQixDQUFDQyxNQUFNRSxNQUFOLENBQWFDLFNBQWIsQ0FBdUJKLFFBQXZCLENBQXZCLEVBRFE7QUFBQTtBQUhaLFFBREQsR0FRRztBQVpOLEtBREY7QUFlRTtBQUFDLHdCQUFEO0FBQUE7QUFDRSxtQkFBVywwQkFBVyw2QkFBWCxFQUEwQztBQUNuRE0sb0JBQVVOLFlBQVksQ0FBQ0MsTUFBTUUsTUFBTixDQUFhQyxTQUFiLENBQXVCSixRQUF2QjtBQUQ0QixTQUExQztBQURiO0FBS0dEO0FBTEg7QUFmRixHQVJ1QjtBQUFBLENBQXpCOztrQkFpQ2VILGdCIiwiZmlsZSI6ImxheWVyLWNvbmZpZy1ncm91cC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IFN3aXRjaCBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zd2l0Y2gnO1xuXG5leHBvcnQgY29uc3QgU3R5bGVkTGF5ZXJDb25maWdHcm91cExhYmVsID0gc3R5bGVkLmRpdmBcbiAgYm9yZGVyLWxlZnQ6IDJweCBzb2xpZCAke3Byb3BzID0+IHByb3BzLnRoZW1lLmxhYmVsQ29sb3J9O1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuICBmb250LXNpemU6IDEycHg7XG4gIGZvbnQtd2VpZ2h0OiA1MDA7XG4gIGxpbmUtaGVpZ2h0OiAxMnB4O1xuICBtYXJnaW4tbGVmdDogLTEycHg7XG4gIHBhZGRpbmctbGVmdDogMTBweDtcbiAgdGV4dC10cmFuc2Zvcm06IGNhcGl0YWxpemU7XG4gIGxldHRlci1zcGFjaW5nOiAwLjJweDtcbmA7XG5cbmV4cG9ydCBjb25zdCBTdHlsZWRMYXllckNvbmZpZ0dyb3VwID0gc3R5bGVkLmRpdmBcbiAgcGFkZGluZy1sZWZ0OiAxOHB4O1xuICBtYXJnaW4tYm90dG9tOiAxOHB4O1xuYDtcblxuZXhwb3J0IGNvbnN0IFN0eWxlZENvbmZpZ0dyb3VwSGVhZGVyID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBtYXJnaW4tYm90dG9tOiAxMnB4O1xuYDtcblxuY29uc3QgQ29uZmlnR3JvdXBDb250ZW50ID0gc3R5bGVkLmRpdmBcbiAgJi5kaXNhYmxlZCB7XG4gICAgb3BhY2l0eTogMC4zO1xuICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICAgICoge1xuICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gICAgfVxuICB9XG5gO1xuXG5jb25zdCBMYXllckNvbmZpZ0dyb3VwID0gKHtcbiAgZ3JvdXAsXG4gIGxhYmVsLFxuICBjaGlsZHJlbixcbiAgcHJvcGVydHksXG4gIGxheWVyLFxuICBvbkNoYW5nZVxufSkgPT4gKFxuICA8U3R5bGVkTGF5ZXJDb25maWdHcm91cCBjbGFzc05hbWU9XCJsYXllci1jb25maWctZ3JvdXBcIj5cbiAgICA8U3R5bGVkQ29uZmlnR3JvdXBIZWFkZXIgY2xhc3NOYW1lPVwibGF5ZXItY29uZmlnLWdyb3VwX19oZWFkZXJcIj5cbiAgICAgIDxTdHlsZWRMYXllckNvbmZpZ0dyb3VwTGFiZWwgY2xhc3NOYW1lPVwibGF5ZXItY29uZmlnLWdyb3VwX19sYWJlbFwiPlxuICAgICAgICB7bGFiZWx9XG4gICAgICA8L1N0eWxlZExheWVyQ29uZmlnR3JvdXBMYWJlbD5cbiAgICAgIHtwcm9wZXJ0eSA/IChcbiAgICAgICAgPFN3aXRjaFxuICAgICAgICAgIGNoZWNrZWQ9e2xheWVyLmNvbmZpZy52aXNDb25maWdbcHJvcGVydHldfVxuICAgICAgICAgIGlkPXtgJHtsYXllci5pZH0tJHtwcm9wZXJ0eX1gfVxuICAgICAgICAgIG9uQ2hhbmdlPXsoKSA9PlxuICAgICAgICAgICAgb25DaGFuZ2Uoe1twcm9wZXJ0eV06ICFsYXllci5jb25maWcudmlzQ29uZmlnW3Byb3BlcnR5XX0pXG4gICAgICAgICAgfVxuICAgICAgICAvPlxuICAgICAgKSA6IG51bGx9XG4gICAgPC9TdHlsZWRDb25maWdHcm91cEhlYWRlcj5cbiAgICA8Q29uZmlnR3JvdXBDb250ZW50XG4gICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ2xheWVyLWNvbmZpZy1ncm91cF9fY29udGVudCcsIHtcbiAgICAgICAgZGlzYWJsZWQ6IHByb3BlcnR5ICYmICFsYXllci5jb25maWcudmlzQ29uZmlnW3Byb3BlcnR5XVxuICAgICAgfSl9XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvQ29uZmlnR3JvdXBDb250ZW50PlxuICA8L1N0eWxlZExheWVyQ29uZmlnR3JvdXA+XG4pO1xuXG5leHBvcnQgZGVmYXVsdCBMYXllckNvbmZpZ0dyb3VwO1xuIl19
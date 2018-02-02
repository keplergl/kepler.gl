'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  position: fixed;\n  padding: 20px;\n  bottom: 0;\n  right: 0;\n  z-index: 1;\n  width: ', 'px;\n\n  .bottom-widget--inner {\n    background-color: ', ';\n    padding: 10px ', 'px;\n    position: relative;\n  }\n'], ['\n  position: fixed;\n  padding: 20px;\n  bottom: 0;\n  right: 0;\n  z-index: 1;\n  width: ', 'px;\n\n  .bottom-widget--inner {\n    background-color: ', ';\n    padding: 10px ', 'px;\n    position: relative;\n  }\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  position: absolute;\n  display: flex;\n  justify-content: space-between;\n  width: 100%;\n  padding-right: ', 'px;\n  color: ', ';\n  \n  .bottom-widget__y-axis {\n    flex-grow: 1;\n    margin-left: 20px;\n  }\n  \n  .bottom-widget__field-select {\n    width: 160px;\n    display: inline-block;\n    margin-left: 12px;\n  }\n'], ['\n  position: absolute;\n  display: flex;\n  justify-content: space-between;\n  width: 100%;\n  padding-right: ', 'px;\n  color: ', ';\n  \n  .bottom-widget__y-axis {\n    flex-grow: 1;\n    margin-left: 20px;\n  }\n  \n  .bottom-widget__field-select {\n    width: 160px;\n    display: inline-block;\n    margin-left: 12px;\n  }\n']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  padding-right: 76px;\n'], ['\n  padding-right: 76px;\n']),
    _templateObject4 = (0, _taggedTemplateLiteralLoose3.default)(['\n  border-bottom: 1px solid\n    ', ';\n  color: ', ';\n  display: inline-block;\n  font-size: 12px;\n  height: 24px;\n  margin-right: 4px;\n  text-align: center;\n  width: 24px;\n  line-height: 24px;\n  \n  :hover {\n    cursor: pointer;\n  }\n'], ['\n  border-bottom: 1px solid\n    ', ';\n  color: ', ';\n  display: inline-block;\n  font-size: 12px;\n  height: 24px;\n  margin-right: 4px;\n  text-align: center;\n  width: 24px;\n  line-height: 24px;\n  \n  :hover {\n    cursor: pointer;\n  }\n']),
    _templateObject5 = (0, _taggedTemplateLiteralLoose3.default)(['\n  flex-grow: 0;\n  display: flex;\n  align-items: center;\n  color: ', ';\n\n  .bottom-widget__icon {\n    margin-right: 6px;\n  }\n'], ['\n  flex-grow: 0;\n  display: flex;\n  align-items: center;\n  color: ', ';\n\n  .bottom-widget__icon {\n    margin-right: 6px;\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _reselect = require('reselect');

var _fieldSelector = require('../common/field-selector');

var _fieldSelector2 = _interopRequireDefault(_fieldSelector);

var _styledComponents3 = require('../common/styled-components');

var _timeRangeFilter = require('./time-range-filter');

var _timeRangeFilter2 = _interopRequireDefault(_timeRangeFilter);

var _icons = require('../common/icons');

var _filterUtils = require('../../utils/filter-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var innerPdSide = 32;

var WidgetContainer = _styledComponents2.default.div(_templateObject, function (props) {
  return props.width;
}, function (props) {
  return props.theme.sidePanelBg;
}, innerPdSide);

var TopSectionWrapper = _styledComponents2.default.div(_templateObject2, innerPdSide * 2, function (props) {
  return props.theme.labelColor;
});

/* eslint-disable no-unused-vars */
var Tabs = _styledComponents2.default.div(_templateObject3);

var Tab = _styledComponents2.default.div(_templateObject4, function (props) {
  return props.active ? props.theme.textColorHl : 'transparent';
}, function (props) {
  return props.active ? props.theme.textColorHl : props.theme.labelColor;
});
/* eslint-enable no-unused-vars */

var StyledTitle = _styledComponents2.default.div(_templateObject5, function (props) {
  return props.theme.textColor;
});

var AnimationSpeedToggle = function AnimationSpeedToggle(_ref) {
  var updateAnimationSpeed = _ref.updateAnimationSpeed,
      speed = _ref.speed;
  return _react2.default.createElement(
    Tabs,
    null,
    _filterUtils.TIME_ANIMATION_SPEED.map(function (_ref2) {
      var label = _ref2.label,
          value = _ref2.value;
      return _react2.default.createElement(
        Tab,
        { key: value, active: value === speed,
          onClick: function onClick() {
            return updateAnimationSpeed(value);
          } },
        label
      );
    })
  );
};

var TimeWidget = function (_Component) {
  (0, _inherits3.default)(TimeWidget, _Component);

  function TimeWidget() {
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, TimeWidget);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.fieldSelector = function (props) {
      return props.fields;
    }, _this.yAxisFieldsSelector = (0, _reselect.createSelector)(_this.fieldSelector, function (fields) {
      return fields.filter(function (f) {
        return f.type === 'integer' || f.type === 'real';
      });
    }), _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  TimeWidget.prototype.render = function render() {
    var _props = this.props,
        enlargedIdx = _props.enlargedIdx,
        enlargeFilter = _props.enlargeFilter,
        filter = _props.filter,
        isAnyFilterAnimating = _props.isAnyFilterAnimating,
        _setFilter = _props.setFilter,
        setFilterPlot = _props.setFilterPlot,
        _toggleAnimation = _props.toggleAnimation,
        _updateAnimationSpeed = _props.updateAnimationSpeed,
        width = _props.width;


    return _react2.default.createElement(
      WidgetContainer,
      { width: width },
      _react2.default.createElement(
        'div',
        { className: 'bottom-widget--inner' },
        _react2.default.createElement(
          TopSectionWrapper,
          null,
          _react2.default.createElement(
            StyledTitle,
            null,
            _react2.default.createElement(
              'div',
              { className: 'bottom-widget__icon' },
              _react2.default.createElement(_icons.Clock, { height: '15px' })
            ),
            _react2.default.createElement(
              _styledComponents3.SelectTextBold,
              null,
              filter.name
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'bottom-widget__y-axis' },
            _react2.default.createElement(
              _styledComponents3.SelectTextBold,
              null,
              'Y Axis'
            ),
            _react2.default.createElement(
              'div',
              { className: 'bottom-widget__field-select' },
              _react2.default.createElement(_fieldSelector2.default, {
                fields: this.yAxisFieldsSelector(this.props),
                placement: 'top',
                id: 'selected-time-widget-field',
                value: filter.yAxis ? filter.yAxis.name : null,
                onSelect: function onSelect(value) {
                  return setFilterPlot(enlargedIdx, { yAxis: value });
                },
                inputTheme: 'secondary',
                erasable: true
              })
            )
          ),
          _react2.default.createElement(AnimationSpeedToggle, {
            updateAnimationSpeed: function updateAnimationSpeed(speed) {
              return _updateAnimationSpeed(enlargedIdx, speed);
            },
            speed: filter.speed }),
          _react2.default.createElement(
            _styledComponents3.IconRoundSmall,
            null,
            _react2.default.createElement(_icons.Close, { height: '12px', onClick: function onClick() {
                return enlargeFilter(enlargedIdx);
              } })
          )
        ),
        _react2.default.createElement(_timeRangeFilter2.default, {
          filter: filter,
          setFilter: function setFilter(value) {
            return _setFilter(enlargedIdx, 'value', value);
          },
          isAnyFilterAnimating: isAnyFilterAnimating,
          updateAnimationSpeed: function updateAnimationSpeed(speed) {
            return _updateAnimationSpeed(enlargedIdx, speed);
          },
          toggleAnimation: function toggleAnimation() {
            return _toggleAnimation(enlargedIdx);
          }
        })
      )
    );
  };

  return TimeWidget;
}(_react.Component);

exports.default = TimeWidget;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2ZpbHRlcnMvdGltZS13aWRnZXQuanMiXSwibmFtZXMiOlsiaW5uZXJQZFNpZGUiLCJXaWRnZXRDb250YWluZXIiLCJkaXYiLCJwcm9wcyIsIndpZHRoIiwidGhlbWUiLCJzaWRlUGFuZWxCZyIsIlRvcFNlY3Rpb25XcmFwcGVyIiwibGFiZWxDb2xvciIsIlRhYnMiLCJUYWIiLCJhY3RpdmUiLCJ0ZXh0Q29sb3JIbCIsIlN0eWxlZFRpdGxlIiwidGV4dENvbG9yIiwiQW5pbWF0aW9uU3BlZWRUb2dnbGUiLCJ1cGRhdGVBbmltYXRpb25TcGVlZCIsInNwZWVkIiwibWFwIiwibGFiZWwiLCJ2YWx1ZSIsIlRpbWVXaWRnZXQiLCJmaWVsZFNlbGVjdG9yIiwiZmllbGRzIiwieUF4aXNGaWVsZHNTZWxlY3RvciIsImZpbHRlciIsImYiLCJ0eXBlIiwicmVuZGVyIiwiZW5sYXJnZWRJZHgiLCJlbmxhcmdlRmlsdGVyIiwiaXNBbnlGaWx0ZXJBbmltYXRpbmciLCJzZXRGaWx0ZXIiLCJzZXRGaWx0ZXJQbG90IiwidG9nZ2xlQW5pbWF0aW9uIiwibmFtZSIsInlBeGlzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOztBQUVBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBLElBQU1BLGNBQWMsRUFBcEI7O0FBRUEsSUFBTUMsa0JBQWtCLDJCQUFPQyxHQUF6QixrQkFNSztBQUFBLFNBQVNDLE1BQU1DLEtBQWY7QUFBQSxDQU5MLEVBU2tCO0FBQUEsU0FBU0QsTUFBTUUsS0FBTixDQUFZQyxXQUFyQjtBQUFBLENBVGxCLEVBVWNOLFdBVmQsQ0FBTjs7QUFlQSxJQUFNTyxvQkFBb0IsMkJBQU9MLEdBQTNCLG1CQUthRixjQUFjLENBTDNCLEVBTUs7QUFBQSxTQUFTRyxNQUFNRSxLQUFOLENBQVlHLFVBQXJCO0FBQUEsQ0FOTCxDQUFOOztBQW9C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O0FBRkYsV0FQRjtBQXFCRSx3Q0FBQyxvQkFBRDtBQUNFLGtDQUFzQiw4QkFBQ0gsS0FBRDtBQUFBLHFCQUFXRCxzQkFBcUJhLFdBQXJCLEVBQWtDWixLQUFsQyxDQUFYO0FBQUEsYUFEeEI7QUFFRSxtQkFBT1EsT0FBT1IsS0FGaEIsR0FyQkY7QUF3QkU7QUFBQTtBQUFBO0FBQ0UsMERBQU8sUUFBTyxNQUFkLEVBQXFCLFNBQVM7QUFBQSx1QkFBTWEsY0FBY0QsV0FBZCxDQUFOO0FBQUEsZUFBOUI7QUFERjtBQXhCRixTQURGO0FBNkJFO0FBQ0Usa0JBQVFKLE1BRFY7QUFFRSxxQkFBVztBQUFBLG1CQUFTTyxXQUFVSCxXQUFWLEVBQXVCLE9BQXZCLEVBQWdDVCxLQUFoQyxDQUFUO0FBQUEsV0FGYjtBQUdFLGdDQUFzQlcsb0JBSHhCO0FBSUUsZ0NBQXNCLDhCQUFDZCxLQUFEO0FBQUEsbUJBQVdELHNCQUFxQmEsV0FBckIsRUFBa0NaLEtBQWxDLENBQVg7QUFBQSxXQUp4QjtBQUtFLDJCQUFpQjtBQUFBLG1CQUFNaUIsaUJBQWdCTCxXQUFoQixDQUFOO0FBQUE7QUFMbkI7QUE3QkY7QUFERixLQURGO0FBeUNELEc7Ozs7O2tCQUdZUixVIiwiZmlsZSI6InRpbWUtd2lkZ2V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7Y3JlYXRlU2VsZWN0b3J9IGZyb20gJ3Jlc2VsZWN0JztcblxuaW1wb3J0IEZpZWxkU2VsZWN0b3IgZnJvbSAnY29tcG9uZW50cy9jb21tb24vZmllbGQtc2VsZWN0b3InO1xuaW1wb3J0IHtTZWxlY3RUZXh0Qm9sZCwgSWNvblJvdW5kU21hbGx9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBUaW1lUmFuZ2VGaWx0ZXIgZnJvbSAnY29tcG9uZW50cy9maWx0ZXJzL3RpbWUtcmFuZ2UtZmlsdGVyJztcbmltcG9ydCB7Q2xvc2UsIENsb2NrfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5pbXBvcnQge1RJTUVfQU5JTUFUSU9OX1NQRUVEfSBmcm9tICd1dGlscy9maWx0ZXItdXRpbHMnO1xuY29uc3QgaW5uZXJQZFNpZGUgPSAzMjtcblxuY29uc3QgV2lkZ2V0Q29udGFpbmVyID0gc3R5bGVkLmRpdmBcbiAgcG9zaXRpb246IGZpeGVkO1xuICBwYWRkaW5nOiAyMHB4O1xuICBib3R0b206IDA7XG4gIHJpZ2h0OiAwO1xuICB6LWluZGV4OiAxO1xuICB3aWR0aDogJHtwcm9wcyA9PiBwcm9wcy53aWR0aH1weDtcblxuICAuYm90dG9tLXdpZGdldC0taW5uZXIge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2lkZVBhbmVsQmd9O1xuICAgIHBhZGRpbmc6IDEwcHggJHtpbm5lclBkU2lkZX1weDtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIH1cbmA7XG5cbmNvbnN0IFRvcFNlY3Rpb25XcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIHdpZHRoOiAxMDAlO1xuICBwYWRkaW5nLXJpZ2h0OiAke2lubmVyUGRTaWRlICogMn1weDtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGFiZWxDb2xvcn07XG4gIFxuICAuYm90dG9tLXdpZGdldF9feS1heGlzIHtcbiAgICBmbGV4LWdyb3c6IDE7XG4gICAgbWFyZ2luLWxlZnQ6IDIwcHg7XG4gIH1cbiAgXG4gIC5ib3R0b20td2lkZ2V0X19maWVsZC1zZWxlY3Qge1xuICAgIHdpZHRoOiAxNjBweDtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgbWFyZ2luLWxlZnQ6IDEycHg7XG4gIH1cbmA7XG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG5jb25zdCBUYWJzID0gc3R5bGVkLmRpdmBcbiAgcGFkZGluZy1yaWdodDogNzZweDtcbmA7XG5cbmNvbnN0IFRhYiA9IHN0eWxlZC5kaXZgXG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZFxuICAgICR7cHJvcHMgPT4gKHByb3BzLmFjdGl2ZSA/IHByb3BzLnRoZW1lLnRleHRDb2xvckhsIDogJ3RyYW5zcGFyZW50Jyl9O1xuICBjb2xvcjogJHtwcm9wcyA9PlxuICBwcm9wcy5hY3RpdmUgPyBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbCA6IHByb3BzLnRoZW1lLmxhYmVsQ29sb3J9O1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgaGVpZ2h0OiAyNHB4O1xuICBtYXJnaW4tcmlnaHQ6IDRweDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICB3aWR0aDogMjRweDtcbiAgbGluZS1oZWlnaHQ6IDI0cHg7XG4gIFxuICA6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgfVxuYDtcbi8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cblxuY29uc3QgU3R5bGVkVGl0bGUgPSBzdHlsZWQuZGl2YFxuICBmbGV4LWdyb3c6IDA7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvcn07XG5cbiAgLmJvdHRvbS13aWRnZXRfX2ljb24ge1xuICAgIG1hcmdpbi1yaWdodDogNnB4O1xuICB9XG5gO1xuXG5jb25zdCBBbmltYXRpb25TcGVlZFRvZ2dsZSA9ICh7dXBkYXRlQW5pbWF0aW9uU3BlZWQsIHNwZWVkfSkgPT4gKFxuICA8VGFicz5cbiAgICB7VElNRV9BTklNQVRJT05fU1BFRUQubWFwKCh7bGFiZWwsIHZhbHVlfSkgPT4gKFxuICAgICAgPFRhYiBrZXk9e3ZhbHVlfSBhY3RpdmU9e3ZhbHVlID09PSBzcGVlZH1cbiAgICAgICAgb25DbGljaz17KCkgPT4gdXBkYXRlQW5pbWF0aW9uU3BlZWQodmFsdWUpfT57bGFiZWx9PC9UYWI+XG4gICAgKSl9XG4gIDwvVGFicz5cbik7XG5cbmNsYXNzIFRpbWVXaWRnZXQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBmaWVsZFNlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMuZmllbGRzO1xuICB5QXhpc0ZpZWxkc1NlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IodGhpcy5maWVsZFNlbGVjdG9yLCBmaWVsZHMgPT5cbiAgICBmaWVsZHMuZmlsdGVyKGYgPT4gZi50eXBlID09PSAnaW50ZWdlcicgfHwgZi50eXBlID09PSAncmVhbCcpXG4gICk7XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGVubGFyZ2VkSWR4LFxuICAgICAgZW5sYXJnZUZpbHRlcixcbiAgICAgIGZpbHRlcixcbiAgICAgIGlzQW55RmlsdGVyQW5pbWF0aW5nLFxuICAgICAgc2V0RmlsdGVyLFxuICAgICAgc2V0RmlsdGVyUGxvdCxcbiAgICAgIHRvZ2dsZUFuaW1hdGlvbixcbiAgICAgIHVwZGF0ZUFuaW1hdGlvblNwZWVkLFxuICAgICAgd2lkdGhcbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIHJldHVybiAoXG4gICAgICA8V2lkZ2V0Q29udGFpbmVyIHdpZHRoPXt3aWR0aH0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm90dG9tLXdpZGdldC0taW5uZXJcIj5cbiAgICAgICAgICA8VG9wU2VjdGlvbldyYXBwZXI+XG4gICAgICAgICAgICA8U3R5bGVkVGl0bGU+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm90dG9tLXdpZGdldF9faWNvblwiPlxuICAgICAgICAgICAgICAgIDxDbG9jayBoZWlnaHQ9XCIxNXB4XCIvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPFNlbGVjdFRleHRCb2xkPntmaWx0ZXIubmFtZX08L1NlbGVjdFRleHRCb2xkPlxuICAgICAgICAgICAgPC9TdHlsZWRUaXRsZT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm90dG9tLXdpZGdldF9feS1heGlzXCI+XG4gICAgICAgICAgICAgIDxTZWxlY3RUZXh0Qm9sZD5ZIEF4aXM8L1NlbGVjdFRleHRCb2xkPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvdHRvbS13aWRnZXRfX2ZpZWxkLXNlbGVjdFwiPlxuICAgICAgICAgICAgICAgIDxGaWVsZFNlbGVjdG9yXG4gICAgICAgICAgICAgICAgICBmaWVsZHM9e3RoaXMueUF4aXNGaWVsZHNTZWxlY3Rvcih0aGlzLnByb3BzKX1cbiAgICAgICAgICAgICAgICAgIHBsYWNlbWVudD1cInRvcFwiXG4gICAgICAgICAgICAgICAgICBpZD1cInNlbGVjdGVkLXRpbWUtd2lkZ2V0LWZpZWxkXCJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtmaWx0ZXIueUF4aXMgPyBmaWx0ZXIueUF4aXMubmFtZSA6IG51bGx9XG4gICAgICAgICAgICAgICAgICBvblNlbGVjdD17dmFsdWUgPT4gc2V0RmlsdGVyUGxvdChlbmxhcmdlZElkeCwge3lBeGlzOiB2YWx1ZX0pfVxuICAgICAgICAgICAgICAgICAgaW5wdXRUaGVtZT1cInNlY29uZGFyeVwiXG4gICAgICAgICAgICAgICAgICBlcmFzYWJsZVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8QW5pbWF0aW9uU3BlZWRUb2dnbGVcbiAgICAgICAgICAgICAgdXBkYXRlQW5pbWF0aW9uU3BlZWQ9eyhzcGVlZCkgPT4gdXBkYXRlQW5pbWF0aW9uU3BlZWQoZW5sYXJnZWRJZHgsIHNwZWVkKX1cbiAgICAgICAgICAgICAgc3BlZWQ9e2ZpbHRlci5zcGVlZH0vPlxuICAgICAgICAgICAgPEljb25Sb3VuZFNtYWxsPlxuICAgICAgICAgICAgICA8Q2xvc2UgaGVpZ2h0PVwiMTJweFwiIG9uQ2xpY2s9eygpID0+IGVubGFyZ2VGaWx0ZXIoZW5sYXJnZWRJZHgpfSAvPlxuICAgICAgICAgICAgPC9JY29uUm91bmRTbWFsbD5cbiAgICAgICAgICA8L1RvcFNlY3Rpb25XcmFwcGVyPlxuICAgICAgICAgIDxUaW1lUmFuZ2VGaWx0ZXJcbiAgICAgICAgICAgIGZpbHRlcj17ZmlsdGVyfVxuICAgICAgICAgICAgc2V0RmlsdGVyPXt2YWx1ZSA9PiBzZXRGaWx0ZXIoZW5sYXJnZWRJZHgsICd2YWx1ZScsIHZhbHVlKX1cbiAgICAgICAgICAgIGlzQW55RmlsdGVyQW5pbWF0aW5nPXtpc0FueUZpbHRlckFuaW1hdGluZ31cbiAgICAgICAgICAgIHVwZGF0ZUFuaW1hdGlvblNwZWVkPXsoc3BlZWQpID0+IHVwZGF0ZUFuaW1hdGlvblNwZWVkKGVubGFyZ2VkSWR4LCBzcGVlZCl9XG4gICAgICAgICAgICB0b2dnbGVBbmltYXRpb249eygpID0+IHRvZ2dsZUFuaW1hdGlvbihlbmxhcmdlZElkeCl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L1dpZGdldENvbnRhaW5lcj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRpbWVXaWRnZXQ7XG4iXX0=
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  position: fixed;\n  padding: 20px;\n  bottom: 0;\n  right: 0;\n  z-index: 1;\n  width: ', 'px;\n\n  .bottom-widget--inner {\n    background-color: ', ';\n    padding: 10px ', 'px;\n    position: relative;\n  }\n'], ['\n  position: fixed;\n  padding: 20px;\n  bottom: 0;\n  right: 0;\n  z-index: 1;\n  width: ', 'px;\n\n  .bottom-widget--inner {\n    background-color: ', ';\n    padding: 10px ', 'px;\n    position: relative;\n  }\n']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n  position: absolute;\n  display: flex;\n  justify-content: space-between;\n  width: 100%;\n  padding-right: ', 'px;\n  color: ', ';\n  \n  .bottom-widget__y-axis {\n    flex-grow: 1;\n    margin-left: 20px;\n  }\n  \n  .bottom-widget__field-select {\n    width: 160px;\n    display: inline-block;\n    margin-left: 12px;\n  }\n'], ['\n  position: absolute;\n  display: flex;\n  justify-content: space-between;\n  width: 100%;\n  padding-right: ', 'px;\n  color: ', ';\n  \n  .bottom-widget__y-axis {\n    flex-grow: 1;\n    margin-left: 20px;\n  }\n  \n  .bottom-widget__field-select {\n    width: 160px;\n    display: inline-block;\n    margin-left: 12px;\n  }\n']),
    _templateObject3 = (0, _taggedTemplateLiteral3.default)(['\n  padding-right: 76px;\n'], ['\n  padding-right: 76px;\n']),
    _templateObject4 = (0, _taggedTemplateLiteral3.default)(['\n  border-bottom: 1px solid\n    ', ';\n  color: ', ';\n  display: inline-block;\n  font-size: 12px;\n  height: 24px;\n  margin-right: 4px;\n  text-align: center;\n  width: 24px;\n  line-height: 24px;\n  \n  :hover {\n    cursor: pointer;\n  }\n'], ['\n  border-bottom: 1px solid\n    ', ';\n  color: ', ';\n  display: inline-block;\n  font-size: 12px;\n  height: 24px;\n  margin-right: 4px;\n  text-align: center;\n  width: 24px;\n  line-height: 24px;\n  \n  :hover {\n    cursor: pointer;\n  }\n']),
    _templateObject5 = (0, _taggedTemplateLiteral3.default)(['\n  flex-grow: 0;\n  color: ', ';\n\n  .bottom-widget__icon {\n    margin-right: 6px;\n  }\n'], ['\n  flex-grow: 0;\n  color: ', ';\n\n  .bottom-widget__icon {\n    margin-right: 6px;\n  }\n']);

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

var StyledTitle = _styledComponents3.CenterFlexbox.extend(_templateObject5, function (props) {
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
    var _ref3;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, TimeWidget);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref3 = TimeWidget.__proto__ || Object.getPrototypeOf(TimeWidget)).call.apply(_ref3, [this].concat(args))), _this), _this.fieldSelector = function (props) {
      return props.fields;
    }, _this.yAxisFieldsSelector = (0, _reselect.createSelector)(_this.fieldSelector, function (fields) {
      return fields.filter(function (f) {
        return f.type === 'integer' || f.type === 'real';
      });
    }), _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(TimeWidget, [{
    key: 'render',
    value: function render() {
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
              { className: 'bottom-widget__field' },
              _react2.default.createElement(
                _styledComponents3.CenterFlexbox,
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
              StyledTitle,
              { className: 'bottom-widget__y-axis' },
              _react2.default.createElement(
                _styledComponents3.CenterFlexbox,
                { className: 'bottom-widget__icon' },
                _react2.default.createElement(_icons.LineChart, { height: '15px' })
              ),
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
    }
  }]);
  return TimeWidget;
}(_react.Component);

exports.default = TimeWidget;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2ZpbHRlcnMvdGltZS13aWRnZXQuanMiXSwibmFtZXMiOlsiaW5uZXJQZFNpZGUiLCJXaWRnZXRDb250YWluZXIiLCJkaXYiLCJwcm9wcyIsIndpZHRoIiwidGhlbWUiLCJzaWRlUGFuZWxCZyIsIlRvcFNlY3Rpb25XcmFwcGVyIiwibGFiZWxDb2xvciIsIlRhYnMiLCJUYWIiLCJhY3RpdmUiLCJ0ZXh0Q29sb3JIbCIsIlN0eWxlZFRpdGxlIiwiZXh0ZW5kIiwidGV4dENvbG9yIiwiQW5pbWF0aW9uU3BlZWRUb2dnbGUiLCJ1cGRhdGVBbmltYXRpb25TcGVlZCIsInNwZWVkIiwibWFwIiwibGFiZWwiLCJ2YWx1ZSIsIlRpbWVXaWRnZXQiLCJmaWVsZFNlbGVjdG9yIiwiZmllbGRzIiwieUF4aXNGaWVsZHNTZWxlY3RvciIsImZpbHRlciIsImYiLCJ0eXBlIiwiZW5sYXJnZWRJZHgiLCJlbmxhcmdlRmlsdGVyIiwiaXNBbnlGaWx0ZXJBbmltYXRpbmciLCJzZXRGaWx0ZXIiLCJzZXRGaWx0ZXJQbG90IiwidG9nZ2xlQW5pbWF0aW9uIiwibmFtZSIsInlBeGlzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFFQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQSxJQUFNQSxjQUFjLEVBQXBCOztBQUVBLElBQU1DLGtCQUFrQiwyQkFBT0MsR0FBekIsa0JBTUs7QUFBQSxTQUFTQyxNQUFNQyxLQUFmO0FBQUEsQ0FOTCxFQVNrQjtBQUFBLFNBQVNELE1BQU1FLEtBQU4sQ0FBWUMsV0FBckI7QUFBQSxDQVRsQixFQVVjTixXQVZkLENBQU47O0FBZUEsSUFBTU8sb0JBQW9CLDJCQUFPTCxHQUEzQixtQkFLYUYsY0FBYyxDQUwzQixFQU1LO0FBQUEsU0FBU0csTUFBTUUsS0FBTixDQUFZRyxVQUFyQjtBQUFBLENBTkwsQ0FBTjs7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U0YsY0FBY0osV0FBZCxFQUEyQixFQUFDTyxPQUFPZixLQUFSLEVBQTNCLENBQVQ7QUFBQSxtQkFMWjtBQU1FLDhCQUFXLFdBTmI7QUFPRTtBQVBGO0FBREY7QUFMRixhQVBGO0FBd0JFLDBDQUFDLG9CQUFEO0FBQ0Usb0NBQXNCLDhCQUFDSCxLQUFEO0FBQUEsdUJBQVdELHNCQUFxQlksV0FBckIsRUFBa0NYLEtBQWxDLENBQVg7QUFBQSxlQUR4QjtBQUVFLHFCQUFPUSxPQUFPUixLQUZoQixHQXhCRjtBQTJCRTtBQUFBO0FBQUE7QUFDRSw0REFBTyxRQUFPLE1BQWQsRUFBcUIsU0FBUztBQUFBLHlCQUFNWSxjQUFjRCxXQUFkLENBQU47QUFBQSxpQkFBOUI7QUFERjtBQTNCRixXQURGO0FBZ0NFO0FBQ0Usb0JBQVFILE1BRFY7QUFFRSx1QkFBVztBQUFBLHFCQUFTTSxXQUFVSCxXQUFWLEVBQXVCLE9BQXZCLEVBQWdDUixLQUFoQyxDQUFUO0FBQUEsYUFGYjtBQUdFLGtDQUFzQlUsb0JBSHhCO0FBSUUsa0NBQXNCLDhCQUFDYixLQUFEO0FBQUEscUJBQVdELHNCQUFxQlksV0FBckIsRUFBa0NYLEtBQWxDLENBQVg7QUFBQSxhQUp4QjtBQUtFLDZCQUFpQjtBQUFBLHFCQUFNZ0IsaUJBQWdCTCxXQUFoQixDQUFOO0FBQUE7QUFMbkI7QUFoQ0Y7QUFERixPQURGO0FBNENEOzs7OztrQkFHWVAsVSIsImZpbGUiOiJ0aW1lLXdpZGdldC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5cbmltcG9ydCBGaWVsZFNlbGVjdG9yIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ZpZWxkLXNlbGVjdG9yJztcbmltcG9ydCB7U2VsZWN0VGV4dEJvbGQsIEljb25Sb3VuZFNtYWxsLCBDZW50ZXJGbGV4Ym94fSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgVGltZVJhbmdlRmlsdGVyIGZyb20gJ2NvbXBvbmVudHMvZmlsdGVycy90aW1lLXJhbmdlLWZpbHRlcic7XG5pbXBvcnQge0Nsb3NlLCBDbG9jaywgTGluZUNoYXJ0fSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5pbXBvcnQge1RJTUVfQU5JTUFUSU9OX1NQRUVEfSBmcm9tICd1dGlscy9maWx0ZXItdXRpbHMnO1xuY29uc3QgaW5uZXJQZFNpZGUgPSAzMjtcblxuY29uc3QgV2lkZ2V0Q29udGFpbmVyID0gc3R5bGVkLmRpdmBcbiAgcG9zaXRpb246IGZpeGVkO1xuICBwYWRkaW5nOiAyMHB4O1xuICBib3R0b206IDA7XG4gIHJpZ2h0OiAwO1xuICB6LWluZGV4OiAxO1xuICB3aWR0aDogJHtwcm9wcyA9PiBwcm9wcy53aWR0aH1weDtcblxuICAuYm90dG9tLXdpZGdldC0taW5uZXIge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2lkZVBhbmVsQmd9O1xuICAgIHBhZGRpbmc6IDEwcHggJHtpbm5lclBkU2lkZX1weDtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIH1cbmA7XG5cbmNvbnN0IFRvcFNlY3Rpb25XcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIHdpZHRoOiAxMDAlO1xuICBwYWRkaW5nLXJpZ2h0OiAke2lubmVyUGRTaWRlICogMn1weDtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGFiZWxDb2xvcn07XG4gIFxuICAuYm90dG9tLXdpZGdldF9feS1heGlzIHtcbiAgICBmbGV4LWdyb3c6IDE7XG4gICAgbWFyZ2luLWxlZnQ6IDIwcHg7XG4gIH1cbiAgXG4gIC5ib3R0b20td2lkZ2V0X19maWVsZC1zZWxlY3Qge1xuICAgIHdpZHRoOiAxNjBweDtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgbWFyZ2luLWxlZnQ6IDEycHg7XG4gIH1cbmA7XG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG5jb25zdCBUYWJzID0gc3R5bGVkLmRpdmBcbiAgcGFkZGluZy1yaWdodDogNzZweDtcbmA7XG5cbmNvbnN0IFRhYiA9IHN0eWxlZC5kaXZgXG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZFxuICAgICR7cHJvcHMgPT4gKHByb3BzLmFjdGl2ZSA/IHByb3BzLnRoZW1lLnRleHRDb2xvckhsIDogJ3RyYW5zcGFyZW50Jyl9O1xuICBjb2xvcjogJHtwcm9wcyA9PlxuICBwcm9wcy5hY3RpdmUgPyBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbCA6IHByb3BzLnRoZW1lLmxhYmVsQ29sb3J9O1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgaGVpZ2h0OiAyNHB4O1xuICBtYXJnaW4tcmlnaHQ6IDRweDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICB3aWR0aDogMjRweDtcbiAgbGluZS1oZWlnaHQ6IDI0cHg7XG4gIFxuICA6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgfVxuYDtcbi8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cblxuY29uc3QgU3R5bGVkVGl0bGUgPSBDZW50ZXJGbGV4Ym94LmV4dGVuZGBcbiAgZmxleC1ncm93OiAwO1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuXG4gIC5ib3R0b20td2lkZ2V0X19pY29uIHtcbiAgICBtYXJnaW4tcmlnaHQ6IDZweDtcbiAgfVxuYDtcblxuY29uc3QgQW5pbWF0aW9uU3BlZWRUb2dnbGUgPSAoe3VwZGF0ZUFuaW1hdGlvblNwZWVkLCBzcGVlZH0pID0+IChcbiAgPFRhYnM+XG4gICAge1RJTUVfQU5JTUFUSU9OX1NQRUVELm1hcCgoe2xhYmVsLCB2YWx1ZX0pID0+IChcbiAgICAgIDxUYWIga2V5PXt2YWx1ZX0gYWN0aXZlPXt2YWx1ZSA9PT0gc3BlZWR9XG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHVwZGF0ZUFuaW1hdGlvblNwZWVkKHZhbHVlKX0+e2xhYmVsfTwvVGFiPlxuICAgICkpfVxuICA8L1RhYnM+XG4pO1xuXG5jbGFzcyBUaW1lV2lkZ2V0IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgZmllbGRTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLmZpZWxkcztcbiAgeUF4aXNGaWVsZHNTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKHRoaXMuZmllbGRTZWxlY3RvciwgZmllbGRzID0+XG4gICAgZmllbGRzLmZpbHRlcihmID0+IGYudHlwZSA9PT0gJ2ludGVnZXInIHx8IGYudHlwZSA9PT0gJ3JlYWwnKVxuICApO1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7XG4gICAgICBlbmxhcmdlZElkeCxcbiAgICAgIGVubGFyZ2VGaWx0ZXIsXG4gICAgICBmaWx0ZXIsXG4gICAgICBpc0FueUZpbHRlckFuaW1hdGluZyxcbiAgICAgIHNldEZpbHRlcixcbiAgICAgIHNldEZpbHRlclBsb3QsXG4gICAgICB0b2dnbGVBbmltYXRpb24sXG4gICAgICB1cGRhdGVBbmltYXRpb25TcGVlZCxcbiAgICAgIHdpZHRoXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFdpZGdldENvbnRhaW5lciB3aWR0aD17d2lkdGh9PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvdHRvbS13aWRnZXQtLWlubmVyXCI+XG4gICAgICAgICAgPFRvcFNlY3Rpb25XcmFwcGVyPlxuICAgICAgICAgICAgPFN0eWxlZFRpdGxlIGNsYXNzTmFtZT1cImJvdHRvbS13aWRnZXRfX2ZpZWxkXCI+XG4gICAgICAgICAgICAgIDxDZW50ZXJGbGV4Ym94IGNsYXNzTmFtZT1cImJvdHRvbS13aWRnZXRfX2ljb25cIj5cbiAgICAgICAgICAgICAgICA8Q2xvY2sgaGVpZ2h0PVwiMTVweFwiLz5cbiAgICAgICAgICAgICAgPC9DZW50ZXJGbGV4Ym94PlxuICAgICAgICAgICAgICA8U2VsZWN0VGV4dEJvbGQ+e2ZpbHRlci5uYW1lfTwvU2VsZWN0VGV4dEJvbGQ+XG4gICAgICAgICAgICA8L1N0eWxlZFRpdGxlPlxuICAgICAgICAgICAgPFN0eWxlZFRpdGxlIGNsYXNzTmFtZT1cImJvdHRvbS13aWRnZXRfX3ktYXhpc1wiPlxuICAgICAgICAgICAgICA8Q2VudGVyRmxleGJveCBjbGFzc05hbWU9XCJib3R0b20td2lkZ2V0X19pY29uXCI+XG4gICAgICAgICAgICAgICAgPExpbmVDaGFydCBoZWlnaHQ9XCIxNXB4XCIvPlxuICAgICAgICAgICAgICA8L0NlbnRlckZsZXhib3g+XG4gICAgICAgICAgICAgIDxTZWxlY3RUZXh0Qm9sZD5ZIEF4aXM8L1NlbGVjdFRleHRCb2xkPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvdHRvbS13aWRnZXRfX2ZpZWxkLXNlbGVjdFwiPlxuICAgICAgICAgICAgICAgIDxGaWVsZFNlbGVjdG9yXG4gICAgICAgICAgICAgICAgICBmaWVsZHM9e3RoaXMueUF4aXNGaWVsZHNTZWxlY3Rvcih0aGlzLnByb3BzKX1cbiAgICAgICAgICAgICAgICAgIHBsYWNlbWVudD1cInRvcFwiXG4gICAgICAgICAgICAgICAgICBpZD1cInNlbGVjdGVkLXRpbWUtd2lkZ2V0LWZpZWxkXCJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtmaWx0ZXIueUF4aXMgPyBmaWx0ZXIueUF4aXMubmFtZSA6IG51bGx9XG4gICAgICAgICAgICAgICAgICBvblNlbGVjdD17dmFsdWUgPT4gc2V0RmlsdGVyUGxvdChlbmxhcmdlZElkeCwge3lBeGlzOiB2YWx1ZX0pfVxuICAgICAgICAgICAgICAgICAgaW5wdXRUaGVtZT1cInNlY29uZGFyeVwiXG4gICAgICAgICAgICAgICAgICBlcmFzYWJsZVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9TdHlsZWRUaXRsZT5cbiAgICAgICAgICAgIDxBbmltYXRpb25TcGVlZFRvZ2dsZVxuICAgICAgICAgICAgICB1cGRhdGVBbmltYXRpb25TcGVlZD17KHNwZWVkKSA9PiB1cGRhdGVBbmltYXRpb25TcGVlZChlbmxhcmdlZElkeCwgc3BlZWQpfVxuICAgICAgICAgICAgICBzcGVlZD17ZmlsdGVyLnNwZWVkfS8+XG4gICAgICAgICAgICA8SWNvblJvdW5kU21hbGw+XG4gICAgICAgICAgICAgIDxDbG9zZSBoZWlnaHQ9XCIxMnB4XCIgb25DbGljaz17KCkgPT4gZW5sYXJnZUZpbHRlcihlbmxhcmdlZElkeCl9IC8+XG4gICAgICAgICAgICA8L0ljb25Sb3VuZFNtYWxsPlxuICAgICAgICAgIDwvVG9wU2VjdGlvbldyYXBwZXI+XG4gICAgICAgICAgPFRpbWVSYW5nZUZpbHRlclxuICAgICAgICAgICAgZmlsdGVyPXtmaWx0ZXJ9XG4gICAgICAgICAgICBzZXRGaWx0ZXI9e3ZhbHVlID0+IHNldEZpbHRlcihlbmxhcmdlZElkeCwgJ3ZhbHVlJywgdmFsdWUpfVxuICAgICAgICAgICAgaXNBbnlGaWx0ZXJBbmltYXRpbmc9e2lzQW55RmlsdGVyQW5pbWF0aW5nfVxuICAgICAgICAgICAgdXBkYXRlQW5pbWF0aW9uU3BlZWQ9eyhzcGVlZCkgPT4gdXBkYXRlQW5pbWF0aW9uU3BlZWQoZW5sYXJnZWRJZHgsIHNwZWVkKX1cbiAgICAgICAgICAgIHRvZ2dsZUFuaW1hdGlvbj17KCkgPT4gdG9nZ2xlQW5pbWF0aW9uKGVubGFyZ2VkSWR4KX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvV2lkZ2V0Q29udGFpbmVyPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGltZVdpZGdldDtcbiJdfQ==
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
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  position: absolute;\n  display: flex;\n  justify-content: space-between;\n  width: 100%;\n  padding-right: ', 'px;\n'], ['\n  position: absolute;\n  display: flex;\n  justify-content: space-between;\n  width: 100%;\n  padding-right: ', 'px;\n']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  padding-right: 76px;\n'], ['\n  padding-right: 76px;\n']),
    _templateObject4 = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: inline-block;\n  width: 24px;\n  height: 24px;\n  border-bottom: 1px solid\n    ', ';\n  margin-right: 4px;\n\n  svg {\n    path {\n      fill: ', ';\n    }\n  }\n\n  :hover {\n    cursor: pointer;\n  }\n'], ['\n  display: inline-block;\n  width: 24px;\n  height: 24px;\n  border-bottom: 1px solid\n    ', ';\n  margin-right: 4px;\n\n  svg {\n    path {\n      fill: ', ';\n    }\n  }\n\n  :hover {\n    cursor: pointer;\n  }\n']),
    _templateObject5 = (0, _taggedTemplateLiteralLoose3.default)(['\n  flex-grow: 0;\n  display: flex;\n  align-items: center;\n  color: ', ';\n\n  .icon {\n    margin-right: 6px;\n  }\n'], ['\n  flex-grow: 0;\n  display: flex;\n  align-items: center;\n  color: ', ';\n\n  .icon {\n    margin-right: 6px;\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _reselect = require('reselect');

var _fieldSelector = require('../common/field-selector');

var _fieldSelector2 = _interopRequireDefault(_fieldSelector);

var _styledComponents3 = require('../common/styled-components');

var _timeRangeFilter = require('../filters/time-range-filter');

var _timeRangeFilter2 = _interopRequireDefault(_timeRangeFilter);

var _icons = require('../common/icons');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var innerPdSide = 32;

var WidgetContainer = _styledComponents2.default.div(_templateObject, function (props) {
  return props.width;
}, function (props) {
  return props.theme.sidePanelBg;
}, innerPdSide);

var TopSectionWrapper = _styledComponents2.default.div(_templateObject2, innerPdSide * 2);

/* eslint-disable no-unused-vars */
var Tabs = _styledComponents2.default.div(_templateObject3);

var Tab = _styledComponents2.default.div(_templateObject4, function (props) {
  return props.active ? props.theme.textColorHl : 'transparent';
}, function (props) {
  return props.active ? props.theme.textColorHl : props.theme.textColor;
});
/* eslint-enable no-unused-vars */

var StyledTitle = _styledComponents2.default.div(_templateObject5, function (props) {
  return props.theme.textColor;
});

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
              { className: 'icon' },
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
            { style: { flexGrow: 1, marginLeft: '20px' } },
            _react2.default.createElement(
              _styledComponents3.SelectTextBold,
              null,
              'Y Axis'
            ),
            _react2.default.createElement(
              'div',
              {
                style: {
                  width: '160px',
                  display: 'inline-block',
                  marginLeft: '20px'
                }
              },
              _react2.default.createElement(_fieldSelector2.default, {
                fields: this.yAxisFieldsSelector(this.props),
                placement: 'top',
                id: 'selected-time-widget-field',
                value: filter.yAxis ? filter.yAxis.name : null,
                onSelect: function onSelect(value) {
                  return setFilterPlot(enlargedIdx, { yAxis: value });
                },
                erasable: true
              })
            )
          ),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2ZpbHRlcnMvdGltZS13aWRnZXQuanMiXSwibmFtZXMiOlsiaW5uZXJQZFNpZGUiLCJXaWRnZXRDb250YWluZXIiLCJkaXYiLCJwcm9wcyIsIndpZHRoIiwidGhlbWUiLCJzaWRlUGFuZWxCZyIsIlRvcFNlY3Rpb25XcmFwcGVyIiwiVGFicyIsIlRhYiIsImFjdGl2ZSIsInRleHRDb2xvckhsIiwidGV4dENvbG9yIiwiU3R5bGVkVGl0bGUiLCJUaW1lV2lkZ2V0IiwiZmllbGRTZWxlY3RvciIsImZpZWxkcyIsInlBeGlzRmllbGRzU2VsZWN0b3IiLCJmaWx0ZXIiLCJmIiwidHlwZSIsInJlbmRlciIsImVubGFyZ2VkSWR4IiwiZW5sYXJnZUZpbHRlciIsImlzQW55RmlsdGVyQW5pbWF0aW5nIiwic2V0RmlsdGVyIiwic2V0RmlsdGVyUGxvdCIsInRvZ2dsZUFuaW1hdGlvbiIsIm5hbWUiLCJmbGV4R3JvdyIsIm1hcmdpbkxlZnQiLCJkaXNwbGF5IiwieUF4aXMiLCJ2YWx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFFQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxjQUFjLEVBQXBCOztBQUVBLElBQU1DLGtCQUFrQiwyQkFBT0MsR0FBekIsa0JBTUs7QUFBQSxTQUFTQyxNQUFNQyxLQUFmO0FBQUEsQ0FOTCxFQVNrQjtBQUFBLFNBQVNELE1BQU1FLEtBQU4sQ0FBWUMsV0FBckI7QUFBQSxDQVRsQixFQVVjTixXQVZkLENBQU47O0FBZUEsSUFBTU8sb0JBQW9CLDJCQUFPTCxHQUEzQixtQkFLYUYsY0FBYyxDQUwzQixDQUFOOztBQVFBO0FBQ0EsSUFBTVEsT0FBTywyQkFBT04sR0FBZCxrQkFBTjs7QUFJQSxJQUFNTyxNQUFNLDJCQUFPUCxHQUFiLG1CQUtBO0FBQUEsU0FBVUMsTUFBTU8sTUFBTixHQUFlUCxNQUFNRSxLQUFOLENBQVlNLFdBQTNCLEdBQXlDLGFBQW5EO0FBQUEsQ0FMQSxFQVVRO0FBQUEsU0FDTlIsTUFBTU8sTUFBTixHQUFlUCxNQUFNRSxLQUFOLENBQVlNLFdBQTNCLEdBQXlDUixNQUFNRSxLQUFOLENBQVlPLFNBRC9DO0FBQUEsQ0FWUixDQUFOO0FBbUJBOztBQUVBLElBQU1DLGNBQWMsMkJBQU9YLEdBQXJCLG1CQUlLO0FBQUEsU0FBU0MsTUFBTUUsS0FBTixDQUFZTyxTQUFyQjtBQUFBLENBSkwsQ0FBTjs7SUFXTUUsVTs7Ozs7Ozs7Ozs7OzBKQUNKQyxhLEdBQWdCO0FBQUEsYUFBU1osTUFBTWEsTUFBZjtBQUFBLEssUUFDaEJDLG1CLEdBQXNCLDhCQUFlLE1BQUtGLGFBQXBCLEVBQW1DO0FBQUEsYUFDdkRDLE9BQU9FLE1BQVAsQ0FBYztBQUFBLGVBQUtDLEVBQUVDLElBQUYsS0FBVyxTQUFYLElBQXdCRCxFQUFFQyxJQUFGLEtBQVcsTUFBeEM7QUFBQSxPQUFkLENBRHVEO0FBQUEsS0FBbkMsQzs7O3VCQUl0QkMsTSxxQkFBUztBQUFBLGlCQVVILEtBQUtsQixLQVZGO0FBQUEsUUFFTG1CLFdBRkssVUFFTEEsV0FGSztBQUFBLFFBR0xDLGFBSEssVUFHTEEsYUFISztBQUFBLFFBSUxMLE1BSkssVUFJTEEsTUFKSztBQUFBLFFBS0xNLG9CQUxLLFVBS0xBLG9CQUxLO0FBQUEsUUFNTEMsVUFOSyxVQU1MQSxTQU5LO0FBQUEsUUFPTEMsYUFQSyxVQU9MQSxhQVBLO0FBQUEsUUFRTEMsZ0JBUkssVUFRTEEsZUFSSztBQUFBLFFBU0x2QixLQVRLLFVBU0xBLEtBVEs7OztBQVlQLFdBQ0U7QUFBQyxxQkFBRDtBQUFBLFFBQWlCLE9BQU9BLEtBQXhCO0FBQ0U7QUFBQTtBQUFBLFVBQUssV0FBVSxzQkFBZjtBQUNFO0FBQUMsMkJBQUQ7QUFBQTtBQUNFO0FBQUMsdUJBQUQ7QUFBQTtBQUNFO0FBQUE7QUFBQSxnQkFBSyxXQUFVLE1BQWY7QUFDRSw0REFBTyxRQUFPLE1BQWQ7QUFERixhQURGO0FBSUU7QUFBQTtBQUFBO0FBQWlCYyxxQkFBT1U7QUFBeEI7QUFKRixXQURGO0FBT0U7QUFBQTtBQUFBLGNBQUssT0FBTyxFQUFDQyxVQUFVLENBQVgsRUFBY0MsWUFBWSxNQUExQixFQUFaO0FBQ0U7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQURGO0FBRUU7QUFBQTtBQUFBO0FBQ0UsdUJBQU87QUFDTDFCLHlCQUFPLE9BREY7QUFFTDJCLDJCQUFTLGNBRko7QUFHTEQsOEJBQVk7QUFIUDtBQURUO0FBT0U7QUFDRSx3QkFBUSxLQUFLYixtQkFBTCxDQUF5QixLQUFLZCxLQUE5QixDQURWO0FBRUUsMkJBQVUsS0FGWjtBQUdFLG9CQUFHLDRCQUhMO0FBSUUsdUJBQU9lLE9BQU9jLEtBQVAsR0FBZWQsT0FBT2MsS0FBUCxDQUFhSixJQUE1QixHQUFtQyxJQUo1QztBQUtFLDBCQUFVO0FBQUEseUJBQVNGLGNBQWNKLFdBQWQsRUFBMkIsRUFBQ1UsT0FBT0MsS0FBUixFQUEzQixDQUFUO0FBQUEsaUJBTFo7QUFNRTtBQU5GO0FBUEY7QUFGRixXQVBGO0FBMEJFO0FBQUE7QUFBQTtBQUNFLDBEQUFPLFFBQU8sTUFBZCxFQUFxQixTQUFTO0FBQUEsdUJBQU1WLGNBQWNELFdBQWQsQ0FBTjtBQUFBLGVBQTlCO0FBREY7QUExQkYsU0FERjtBQStCRTtBQUNFLGtCQUFRSixNQURWO0FBRUUscUJBQVc7QUFBQSxtQkFBU08sV0FBVUgsV0FBVixFQUF1QixPQUF2QixFQUFnQ1csS0FBaEMsQ0FBVDtBQUFBLFdBRmI7QUFHRSxnQ0FBc0JULG9CQUh4QjtBQUlFLDJCQUFpQjtBQUFBLG1CQUFNRyxpQkFBZ0JMLFdBQWhCLENBQU47QUFBQTtBQUpuQjtBQS9CRjtBQURGLEtBREY7QUEwQ0QsRzs7Ozs7a0JBR1lSLFUiLCJmaWxlIjoidGltZS13aWRnZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtjcmVhdGVTZWxlY3Rvcn0gZnJvbSAncmVzZWxlY3QnO1xuXG5pbXBvcnQgRmllbGRTZWxlY3RvciBmcm9tICcuLi9jb21tb24vZmllbGQtc2VsZWN0b3InO1xuaW1wb3J0IHtTZWxlY3RUZXh0Qm9sZCwgSWNvblJvdW5kU21hbGx9IGZyb20gJy4uL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgVGltZVJhbmdlRmlsdGVyIGZyb20gJy4uL2ZpbHRlcnMvdGltZS1yYW5nZS1maWx0ZXInO1xuaW1wb3J0IHtDbG9zZSwgQ2xvY2t9IGZyb20gJy4uL2NvbW1vbi9pY29ucyc7XG5cbmNvbnN0IGlubmVyUGRTaWRlID0gMzI7XG5cbmNvbnN0IFdpZGdldENvbnRhaW5lciA9IHN0eWxlZC5kaXZgXG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgcGFkZGluZzogMjBweDtcbiAgYm90dG9tOiAwO1xuICByaWdodDogMDtcbiAgei1pbmRleDogMTtcbiAgd2lkdGg6ICR7cHJvcHMgPT4gcHJvcHMud2lkdGh9cHg7XG5cbiAgLmJvdHRvbS13aWRnZXQtLWlubmVyIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNpZGVQYW5lbEJnfTtcbiAgICBwYWRkaW5nOiAxMHB4ICR7aW5uZXJQZFNpZGV9cHg7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB9XG5gO1xuXG5jb25zdCBUb3BTZWN0aW9uV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICB3aWR0aDogMTAwJTtcbiAgcGFkZGluZy1yaWdodDogJHtpbm5lclBkU2lkZSAqIDJ9cHg7XG5gO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuY29uc3QgVGFicyA9IHN0eWxlZC5kaXZgXG4gIHBhZGRpbmctcmlnaHQ6IDc2cHg7XG5gO1xuXG5jb25zdCBUYWIgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIHdpZHRoOiAyNHB4O1xuICBoZWlnaHQ6IDI0cHg7XG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZFxuICAgICR7cHJvcHMgPT4gKHByb3BzLmFjdGl2ZSA/IHByb3BzLnRoZW1lLnRleHRDb2xvckhsIDogJ3RyYW5zcGFyZW50Jyl9O1xuICBtYXJnaW4tcmlnaHQ6IDRweDtcblxuICBzdmcge1xuICAgIHBhdGgge1xuICAgICAgZmlsbDogJHtwcm9wcyA9PlxuICAgICAgICBwcm9wcy5hY3RpdmUgPyBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbCA6IHByb3BzLnRoZW1lLnRleHRDb2xvcn07XG4gICAgfVxuICB9XG5cbiAgOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gIH1cbmA7XG4vKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXG5cbmNvbnN0IFN0eWxlZFRpdGxlID0gc3R5bGVkLmRpdmBcbiAgZmxleC1ncm93OiAwO1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuXG4gIC5pY29uIHtcbiAgICBtYXJnaW4tcmlnaHQ6IDZweDtcbiAgfVxuYDtcblxuY2xhc3MgVGltZVdpZGdldCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGZpZWxkU2VsZWN0b3IgPSBwcm9wcyA9PiBwcm9wcy5maWVsZHM7XG4gIHlBeGlzRmllbGRzU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3Rvcih0aGlzLmZpZWxkU2VsZWN0b3IsIGZpZWxkcyA9PlxuICAgIGZpZWxkcy5maWx0ZXIoZiA9PiBmLnR5cGUgPT09ICdpbnRlZ2VyJyB8fCBmLnR5cGUgPT09ICdyZWFsJylcbiAgKTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgZW5sYXJnZWRJZHgsXG4gICAgICBlbmxhcmdlRmlsdGVyLFxuICAgICAgZmlsdGVyLFxuICAgICAgaXNBbnlGaWx0ZXJBbmltYXRpbmcsXG4gICAgICBzZXRGaWx0ZXIsXG4gICAgICBzZXRGaWx0ZXJQbG90LFxuICAgICAgdG9nZ2xlQW5pbWF0aW9uLFxuICAgICAgd2lkdGhcbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIHJldHVybiAoXG4gICAgICA8V2lkZ2V0Q29udGFpbmVyIHdpZHRoPXt3aWR0aH0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm90dG9tLXdpZGdldC0taW5uZXJcIj5cbiAgICAgICAgICA8VG9wU2VjdGlvbldyYXBwZXI+XG4gICAgICAgICAgICA8U3R5bGVkVGl0bGU+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaWNvblwiPlxuICAgICAgICAgICAgICAgIDxDbG9jayBoZWlnaHQ9XCIxNXB4XCIgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxTZWxlY3RUZXh0Qm9sZD57ZmlsdGVyLm5hbWV9PC9TZWxlY3RUZXh0Qm9sZD5cbiAgICAgICAgICAgIDwvU3R5bGVkVGl0bGU+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZmxleEdyb3c6IDEsIG1hcmdpbkxlZnQ6ICcyMHB4J319PlxuICAgICAgICAgICAgICA8U2VsZWN0VGV4dEJvbGQ+WSBBeGlzPC9TZWxlY3RUZXh0Qm9sZD5cbiAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICB3aWR0aDogJzE2MHB4JyxcbiAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgICAgICAgICAgICAgICAgbWFyZ2luTGVmdDogJzIwcHgnXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxGaWVsZFNlbGVjdG9yXG4gICAgICAgICAgICAgICAgICBmaWVsZHM9e3RoaXMueUF4aXNGaWVsZHNTZWxlY3Rvcih0aGlzLnByb3BzKX1cbiAgICAgICAgICAgICAgICAgIHBsYWNlbWVudD1cInRvcFwiXG4gICAgICAgICAgICAgICAgICBpZD1cInNlbGVjdGVkLXRpbWUtd2lkZ2V0LWZpZWxkXCJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtmaWx0ZXIueUF4aXMgPyBmaWx0ZXIueUF4aXMubmFtZSA6IG51bGx9XG4gICAgICAgICAgICAgICAgICBvblNlbGVjdD17dmFsdWUgPT4gc2V0RmlsdGVyUGxvdChlbmxhcmdlZElkeCwge3lBeGlzOiB2YWx1ZX0pfVxuICAgICAgICAgICAgICAgICAgZXJhc2FibGVcbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPEljb25Sb3VuZFNtYWxsPlxuICAgICAgICAgICAgICA8Q2xvc2UgaGVpZ2h0PVwiMTJweFwiIG9uQ2xpY2s9eygpID0+IGVubGFyZ2VGaWx0ZXIoZW5sYXJnZWRJZHgpfSAvPlxuICAgICAgICAgICAgPC9JY29uUm91bmRTbWFsbD5cbiAgICAgICAgICA8L1RvcFNlY3Rpb25XcmFwcGVyPlxuICAgICAgICAgIDxUaW1lUmFuZ2VGaWx0ZXJcbiAgICAgICAgICAgIGZpbHRlcj17ZmlsdGVyfVxuICAgICAgICAgICAgc2V0RmlsdGVyPXt2YWx1ZSA9PiBzZXRGaWx0ZXIoZW5sYXJnZWRJZHgsICd2YWx1ZScsIHZhbHVlKX1cbiAgICAgICAgICAgIGlzQW55RmlsdGVyQW5pbWF0aW5nPXtpc0FueUZpbHRlckFuaW1hdGluZ31cbiAgICAgICAgICAgIHRvZ2dsZUFuaW1hdGlvbj17KCkgPT4gdG9nZ2xlQW5pbWF0aW9uKGVubGFyZ2VkSWR4KX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvV2lkZ2V0Q29udGFpbmVyPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGltZVdpZGdldDtcbiJdfQ==
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

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n\tposition: fixed;\n\tpadding: 20px;\n\tbottom: 0;\n  right: 0;\n  z-index: 1;\n  width: ', 'px;\n  \n  .bottom-widget--inner {\n    background-color: ', ';\n    padding: 10px ', 'px;\n    position: relative;\n  }\n'], ['\n\tposition: fixed;\n\tpadding: 20px;\n\tbottom: 0;\n  right: 0;\n  z-index: 1;\n  width: ', 'px;\n  \n  .bottom-widget--inner {\n    background-color: ', ';\n    padding: 10px ', 'px;\n    position: relative;\n  }\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  position: absolute;\n  display: flex;\n  justify-content: space-between;\n  width: 100%;\n  padding-right: ', 'px;\n'], ['\n  position: absolute;\n  display: flex;\n  justify-content: space-between;\n  width: 100%;\n  padding-right: ', 'px;\n']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  padding-right: 76px;\n'], ['\n  padding-right: 76px;\n']),
    _templateObject4 = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: inline-block;\n  width: 24px;\n  height: 24px;\n  border-bottom: 1px solid ', ';\n  margin-right: 4px;\n\n  svg {\n    path {\n      fill: ', ';\n    }\n  }\n\n  :hover {\n    cursor: pointer;\n  }\n'], ['\n  display: inline-block;\n  width: 24px;\n  height: 24px;\n  border-bottom: 1px solid ', ';\n  margin-right: 4px;\n\n  svg {\n    path {\n      fill: ', ';\n    }\n  }\n\n  :hover {\n    cursor: pointer;\n  }\n']),
    _templateObject5 = (0, _taggedTemplateLiteralLoose3.default)(['\n    flex-grow: 0;\n    display: flex;\n    align-items: center;\n    color: ', ';\n    \n    .icon {\n      margin-right: 6px;\n    }\n'], ['\n    flex-grow: 0;\n    display: flex;\n    align-items: center;\n    color: ', ';\n    \n    .icon {\n      margin-right: 6px;\n    }\n']);

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
              { style: { width: '160px', display: 'inline-block', marginLeft: '20px' } },
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2ZpbHRlcnMvdGltZS13aWRnZXQuanMiXSwibmFtZXMiOlsiaW5uZXJQZFNpZGUiLCJXaWRnZXRDb250YWluZXIiLCJkaXYiLCJwcm9wcyIsIndpZHRoIiwidGhlbWUiLCJzaWRlUGFuZWxCZyIsIlRvcFNlY3Rpb25XcmFwcGVyIiwiVGFicyIsIlRhYiIsImFjdGl2ZSIsInRleHRDb2xvckhsIiwidGV4dENvbG9yIiwiU3R5bGVkVGl0bGUiLCJUaW1lV2lkZ2V0IiwiZmllbGRTZWxlY3RvciIsImZpZWxkcyIsInlBeGlzRmllbGRzU2VsZWN0b3IiLCJmaWx0ZXIiLCJmIiwidHlwZSIsInJlbmRlciIsImVubGFyZ2VkSWR4IiwiZW5sYXJnZUZpbHRlciIsImlzQW55RmlsdGVyQW5pbWF0aW5nIiwic2V0RmlsdGVyIiwic2V0RmlsdGVyUGxvdCIsInRvZ2dsZUFuaW1hdGlvbiIsIm5hbWUiLCJmbGV4R3JvdyIsIm1hcmdpbkxlZnQiLCJkaXNwbGF5IiwieUF4aXMiLCJ2YWx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFFQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxjQUFjLEVBQXBCOztBQUVBLElBQU1DLGtCQUFrQiwyQkFBT0MsR0FBekIsa0JBTUs7QUFBQSxTQUFTQyxNQUFNQyxLQUFmO0FBQUEsQ0FOTCxFQVNrQjtBQUFBLFNBQVNELE1BQU1FLEtBQU4sQ0FBWUMsV0FBckI7QUFBQSxDQVRsQixFQVVjTixXQVZkLENBQU47O0FBZUEsSUFBTU8sb0JBQW9CLDJCQUFPTCxHQUEzQixtQkFLYUYsY0FBYyxDQUwzQixDQUFOOztBQVFBO0FBQ0EsSUFBTVEsT0FBTywyQkFBT04sR0FBZCxrQkFBTjs7QUFJQSxJQUFNTyxNQUFNLDJCQUFPUCxHQUFiLG1CQUl1QjtBQUFBLFNBQVNDLE1BQU1PLE1BQU4sR0FBZVAsTUFBTUUsS0FBTixDQUFZTSxXQUEzQixHQUF5QyxhQUFsRDtBQUFBLENBSnZCLEVBU1E7QUFBQSxTQUFTUixNQUFNTyxNQUFOLEdBQWVQLE1BQU1FLEtBQU4sQ0FBWU0sV0FBM0IsR0FBeUNSLE1BQU1FLEtBQU4sQ0FBWU8sU0FBOUQ7QUFBQSxDQVRSLENBQU47QUFpQkE7O0FBRUEsSUFBTUMsY0FBYywyQkFBT1gsR0FBckIsbUJBSU87QUFBQSxTQUFTQyxNQUFNRSxLQUFOLENBQVlPLFNBQXJCO0FBQUEsQ0FKUCxDQUFOOztJQVdNRSxVOzs7Ozs7Ozs7Ozs7MEpBQ0pDLGEsR0FBZ0I7QUFBQSxhQUFTWixNQUFNYSxNQUFmO0FBQUEsSyxRQUNoQkMsbUIsR0FBc0IsOEJBQ3BCLE1BQUtGLGFBRGUsRUFFcEI7QUFBQSxhQUFVQyxPQUFPRSxNQUFQLENBQWM7QUFBQSxlQUFLQyxFQUFFQyxJQUFGLEtBQVcsU0FBWCxJQUF3QkQsRUFBRUMsSUFBRixLQUFXLE1BQXhDO0FBQUEsT0FBZCxDQUFWO0FBQUEsS0FGb0IsQzs7O3VCQUt0QkMsTSxxQkFBUztBQUFBLGlCQVVILEtBQUtsQixLQVZGO0FBQUEsUUFFTG1CLFdBRkssVUFFTEEsV0FGSztBQUFBLFFBR0xDLGFBSEssVUFHTEEsYUFISztBQUFBLFFBSUxMLE1BSkssVUFJTEEsTUFKSztBQUFBLFFBS0xNLG9CQUxLLFVBS0xBLG9CQUxLO0FBQUEsUUFNTEMsVUFOSyxVQU1MQSxTQU5LO0FBQUEsUUFPTEMsYUFQSyxVQU9MQSxhQVBLO0FBQUEsUUFRTEMsZ0JBUkssVUFRTEEsZUFSSztBQUFBLFFBU0x2QixLQVRLLFVBU0xBLEtBVEs7OztBQVlQLFdBQ0U7QUFBQyxxQkFBRDtBQUFBLFFBQWlCLE9BQU9BLEtBQXhCO0FBQ0U7QUFBQTtBQUFBLFVBQUssV0FBVSxzQkFBZjtBQUNFO0FBQUMsMkJBQUQ7QUFBQTtBQUNFO0FBQUMsdUJBQUQ7QUFBQTtBQUNFO0FBQUE7QUFBQSxnQkFBSyxXQUFVLE1BQWY7QUFBc0IsNERBQU8sUUFBTyxNQUFkO0FBQXRCLGFBREY7QUFFRTtBQUFBO0FBQUE7QUFBaUJjLHFCQUFPVTtBQUF4QjtBQUZGLFdBREY7QUFLRTtBQUFBO0FBQUEsY0FBSyxPQUFPLEVBQUNDLFVBQVUsQ0FBWCxFQUFjQyxZQUFZLE1BQTFCLEVBQVo7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBREY7QUFFRTtBQUFBO0FBQUEsZ0JBQUssT0FBTyxFQUFDMUIsT0FBTyxPQUFSLEVBQWlCMkIsU0FBUyxjQUExQixFQUEwQ0QsWUFBWSxNQUF0RCxFQUFaO0FBQ0U7QUFDRSx3QkFBUSxLQUFLYixtQkFBTCxDQUF5QixLQUFLZCxLQUE5QixDQURWO0FBRUUsMkJBQVUsS0FGWjtBQUdFLG9CQUFHLDRCQUhMO0FBSUUsdUJBQU9lLE9BQU9jLEtBQVAsR0FBZWQsT0FBT2MsS0FBUCxDQUFhSixJQUE1QixHQUFtQyxJQUo1QztBQUtFLDBCQUFVLGtCQUFDSyxLQUFEO0FBQUEseUJBQVdQLGNBQWNKLFdBQWQsRUFBMkIsRUFBQ1UsT0FBT0MsS0FBUixFQUEzQixDQUFYO0FBQUEsaUJBTFo7QUFNRTtBQU5GO0FBREY7QUFGRixXQUxGO0FBa0JFO0FBQUE7QUFBQTtBQUNFLDBEQUFPLFFBQU8sTUFBZCxFQUFxQixTQUFTO0FBQUEsdUJBQU1WLGNBQWNELFdBQWQsQ0FBTjtBQUFBLGVBQTlCO0FBREY7QUFsQkYsU0FERjtBQXVCRTtBQUNFLGtCQUFRSixNQURWO0FBRUUscUJBQVc7QUFBQSxtQkFBU08sV0FBVUgsV0FBVixFQUF1QixPQUF2QixFQUFnQ1csS0FBaEMsQ0FBVDtBQUFBLFdBRmI7QUFHRSxnQ0FBc0JULG9CQUh4QjtBQUlFLDJCQUFpQjtBQUFBLG1CQUFNRyxpQkFBZ0JMLFdBQWhCLENBQU47QUFBQTtBQUpuQjtBQXZCRjtBQURGLEtBREY7QUFrQ0QsRzs7Ozs7a0JBR1lSLFUiLCJmaWxlIjoidGltZS13aWRnZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtjcmVhdGVTZWxlY3Rvcn0gZnJvbSAncmVzZWxlY3QnO1xuXG5pbXBvcnQgRmllbGRTZWxlY3RvciBmcm9tICcuLi9jb21tb24vZmllbGQtc2VsZWN0b3InO1xuaW1wb3J0IHtTZWxlY3RUZXh0Qm9sZCwgSWNvblJvdW5kU21hbGx9IGZyb20gJy4uL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgVGltZVJhbmdlRmlsdGVyIGZyb20gJy4uL2ZpbHRlcnMvdGltZS1yYW5nZS1maWx0ZXInO1xuaW1wb3J0IHtDbG9zZSwgQ2xvY2t9IGZyb20gJy4uL2NvbW1vbi9pY29ucyc7XG5cbmNvbnN0IGlubmVyUGRTaWRlID0gMzI7XG5cbmNvbnN0IFdpZGdldENvbnRhaW5lciA9IHN0eWxlZC5kaXZgXG5cdHBvc2l0aW9uOiBmaXhlZDtcblx0cGFkZGluZzogMjBweDtcblx0Ym90dG9tOiAwO1xuICByaWdodDogMDtcbiAgei1pbmRleDogMTtcbiAgd2lkdGg6ICR7cHJvcHMgPT4gcHJvcHMud2lkdGh9cHg7XG4gIFxuICAuYm90dG9tLXdpZGdldC0taW5uZXIge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2lkZVBhbmVsQmd9O1xuICAgIHBhZGRpbmc6IDEwcHggJHtpbm5lclBkU2lkZX1weDtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIH1cbmA7XG5cbmNvbnN0IFRvcFNlY3Rpb25XcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIHdpZHRoOiAxMDAlO1xuICBwYWRkaW5nLXJpZ2h0OiAke2lubmVyUGRTaWRlICogMn1weDtcbmA7XG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG5jb25zdCBUYWJzID0gc3R5bGVkLmRpdmBcbiAgcGFkZGluZy1yaWdodDogNzZweDtcbmA7XG5cbmNvbnN0IFRhYiA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgd2lkdGg6IDI0cHg7XG4gIGhlaWdodDogMjRweDtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICR7cHJvcHMgPT4gcHJvcHMuYWN0aXZlID8gcHJvcHMudGhlbWUudGV4dENvbG9ySGwgOiAndHJhbnNwYXJlbnQnfTtcbiAgbWFyZ2luLXJpZ2h0OiA0cHg7XG5cbiAgc3ZnIHtcbiAgICBwYXRoIHtcbiAgICAgIGZpbGw6ICR7cHJvcHMgPT4gcHJvcHMuYWN0aXZlID8gcHJvcHMudGhlbWUudGV4dENvbG9ySGwgOiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuICAgIH1cbiAgfVxuXG4gIDpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICB9XG5gO1xuLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycyAqL1xuXG5jb25zdCBTdHlsZWRUaXRsZSA9IHN0eWxlZC5kaXZgXG4gICAgZmxleC1ncm93OiAwO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuICAgIFxuICAgIC5pY29uIHtcbiAgICAgIG1hcmdpbi1yaWdodDogNnB4O1xuICAgIH1cbmA7XG5cbmNsYXNzIFRpbWVXaWRnZXQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBmaWVsZFNlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMuZmllbGRzO1xuICB5QXhpc0ZpZWxkc1NlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgdGhpcy5maWVsZFNlbGVjdG9yLFxuICAgIGZpZWxkcyA9PiBmaWVsZHMuZmlsdGVyKGYgPT4gZi50eXBlID09PSAnaW50ZWdlcicgfHwgZi50eXBlID09PSAncmVhbCcpXG4gICk7XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGVubGFyZ2VkSWR4LFxuICAgICAgZW5sYXJnZUZpbHRlcixcbiAgICAgIGZpbHRlcixcbiAgICAgIGlzQW55RmlsdGVyQW5pbWF0aW5nLFxuICAgICAgc2V0RmlsdGVyLFxuICAgICAgc2V0RmlsdGVyUGxvdCxcbiAgICAgIHRvZ2dsZUFuaW1hdGlvbixcbiAgICAgIHdpZHRoXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFdpZGdldENvbnRhaW5lciB3aWR0aD17d2lkdGh9PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvdHRvbS13aWRnZXQtLWlubmVyXCI+XG4gICAgICAgICAgPFRvcFNlY3Rpb25XcmFwcGVyPlxuICAgICAgICAgICAgPFN0eWxlZFRpdGxlPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImljb25cIj48Q2xvY2sgaGVpZ2h0PVwiMTVweFwiLz48L2Rpdj5cbiAgICAgICAgICAgICAgPFNlbGVjdFRleHRCb2xkPntmaWx0ZXIubmFtZX08L1NlbGVjdFRleHRCb2xkPlxuICAgICAgICAgICAgPC9TdHlsZWRUaXRsZT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tmbGV4R3JvdzogMSwgbWFyZ2luTGVmdDogJzIwcHgnfX0+XG4gICAgICAgICAgICAgIDxTZWxlY3RUZXh0Qm9sZD5ZIEF4aXM8L1NlbGVjdFRleHRCb2xkPlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7d2lkdGg6ICcxNjBweCcsIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCBtYXJnaW5MZWZ0OiAnMjBweCd9fT5cbiAgICAgICAgICAgICAgICA8RmllbGRTZWxlY3RvclxuICAgICAgICAgICAgICAgICAgZmllbGRzPXt0aGlzLnlBeGlzRmllbGRzU2VsZWN0b3IodGhpcy5wcm9wcyl9XG4gICAgICAgICAgICAgICAgICBwbGFjZW1lbnQ9XCJ0b3BcIlxuICAgICAgICAgICAgICAgICAgaWQ9XCJzZWxlY3RlZC10aW1lLXdpZGdldC1maWVsZFwiXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17ZmlsdGVyLnlBeGlzID8gZmlsdGVyLnlBeGlzLm5hbWUgOiBudWxsfVxuICAgICAgICAgICAgICAgICAgb25TZWxlY3Q9eyh2YWx1ZSkgPT4gc2V0RmlsdGVyUGxvdChlbmxhcmdlZElkeCwge3lBeGlzOiB2YWx1ZX0pfVxuICAgICAgICAgICAgICAgICAgZXJhc2FibGVcbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPEljb25Sb3VuZFNtYWxsPlxuICAgICAgICAgICAgICA8Q2xvc2UgaGVpZ2h0PVwiMTJweFwiIG9uQ2xpY2s9eygpID0+IGVubGFyZ2VGaWx0ZXIoZW5sYXJnZWRJZHgpfS8+XG4gICAgICAgICAgICA8L0ljb25Sb3VuZFNtYWxsPlxuICAgICAgICAgIDwvVG9wU2VjdGlvbldyYXBwZXI+XG4gICAgICAgICAgPFRpbWVSYW5nZUZpbHRlclxuICAgICAgICAgICAgZmlsdGVyPXtmaWx0ZXJ9XG4gICAgICAgICAgICBzZXRGaWx0ZXI9e3ZhbHVlID0+IHNldEZpbHRlcihlbmxhcmdlZElkeCwgJ3ZhbHVlJywgdmFsdWUpfVxuICAgICAgICAgICAgaXNBbnlGaWx0ZXJBbmltYXRpbmc9e2lzQW55RmlsdGVyQW5pbWF0aW5nfVxuICAgICAgICAgICAgdG9nZ2xlQW5pbWF0aW9uPXsoKSA9PiB0b2dnbGVBbmltYXRpb24oZW5sYXJnZWRJZHgpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9XaWRnZXRDb250YWluZXI+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUaW1lV2lkZ2V0O1xuIl19
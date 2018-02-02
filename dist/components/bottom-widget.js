'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _timeWidget = require('./filters/time-widget');

var _timeWidget2 = _interopRequireDefault(_timeWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MaxWidth = 1080;

var BottomWidget = function (_Component) {
  (0, _inherits3.default)(BottomWidget, _Component);

  function BottomWidget() {
    (0, _classCallCheck3.default)(this, BottomWidget);
    return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
  }

  BottomWidget.prototype.render = function render() {
    var _props = this.props,
        datasets = _props.datasets,
        filters = _props.filters,
        visStateActions = _props.visStateActions,
        containerW = _props.containerW,
        uiState = _props.uiState,
        sidePanelWidth = _props.sidePanelWidth;
    var activeSidePanel = uiState.activeSidePanel;

    var isOpen = Boolean(activeSidePanel);

    var enlargedFilterIdx = filters.findIndex(function (f) {
      return f.enlarged;
    });
    var isAnyFilterAnimating = filters.some(function (f) {
      return f.isAnimating;
    });
    var enlargedFilterWidth = isOpen ? containerW - sidePanelWidth : containerW;

    if (enlargedFilterIdx < 0) {
      return null;
    }

    return _react2.default.createElement(_timeWidget2.default, {
      fields: datasets[filters[enlargedFilterIdx].dataId].fields,
      setFilterPlot: visStateActions.setFilterPlot,
      setFilter: visStateActions.setFilter,
      toggleAnimation: visStateActions.toggleAnimation,
      updateAnimationSpeed: visStateActions.updateAnimationSpeed,
      enlargeFilter: visStateActions.enlargeFilter,
      width: Math.min(MaxWidth, enlargedFilterWidth),
      isAnyFilterAnimating: isAnyFilterAnimating,
      enlargedIdx: enlargedFilterIdx,
      filter: filters[enlargedFilterIdx]
    });
  };

  return BottomWidget;
}(_react.Component);

exports.default = BottomWidget;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL2JvdHRvbS13aWRnZXQuanMiXSwibmFtZXMiOlsiTWF4V2lkdGgiLCJCb3R0b21XaWRnZXQiLCJyZW5kZXIiLCJwcm9wcyIsImRhdGFzZXRzIiwiZmlsdGVycyIsInZpc1N0YXRlQWN0aW9ucyIsImNvbnRhaW5lclciLCJ1aVN0YXRlIiwic2lkZVBhbmVsV2lkdGgiLCJhY3RpdmVTaWRlUGFuZWwiLCJpc09wZW4iLCJCb29sZWFuIiwiZW5sYXJnZWRGaWx0ZXJJZHgiLCJmaW5kSW5kZXgiLCJmIiwiZW5sYXJnZWQiLCJpc0FueUZpbHRlckFuaW1hdGluZyIsInNvbWUiLCJpc0FuaW1hdGluZyIsImVubGFyZ2VkRmlsdGVyV2lkdGgiLCJkYXRhSWQiLCJmaWVsZHMiLCJzZXRGaWx0ZXJQbG90Iiwic2V0RmlsdGVyIiwidG9nZ2xlQW5pbWF0aW9uIiwidXBkYXRlQW5pbWF0aW9uU3BlZWQiLCJlbmxhcmdlRmlsdGVyIiwiTWF0aCIsIm1pbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLFdBQVcsSUFBakI7O0lBRXFCQyxZOzs7Ozs7Ozt5QkFDbkJDLE0scUJBQVM7QUFBQSxpQkFRSCxLQUFLQyxLQVJGO0FBQUEsUUFFTEMsUUFGSyxVQUVMQSxRQUZLO0FBQUEsUUFHTEMsT0FISyxVQUdMQSxPQUhLO0FBQUEsUUFJTEMsZUFKSyxVQUlMQSxlQUpLO0FBQUEsUUFLTEMsVUFMSyxVQUtMQSxVQUxLO0FBQUEsUUFNTEMsT0FOSyxVQU1MQSxPQU5LO0FBQUEsUUFPTEMsY0FQSyxVQU9MQSxjQVBLO0FBQUEsUUFTQUMsZUFUQSxHQVNtQkYsT0FUbkIsQ0FTQUUsZUFUQTs7QUFVUCxRQUFNQyxTQUFTQyxRQUFRRixlQUFSLENBQWY7O0FBRUEsUUFBTUcsb0JBQW9CUixRQUFRUyxTQUFSLENBQWtCO0FBQUEsYUFBS0MsRUFBRUMsUUFBUDtBQUFBLEtBQWxCLENBQTFCO0FBQ0EsUUFBTUMsdUJBQXVCWixRQUFRYSxJQUFSLENBQWE7QUFBQSxhQUFLSCxFQUFFSSxXQUFQO0FBQUEsS0FBYixDQUE3QjtBQUNBLFFBQU1DLHNCQUFzQlQsU0FBU0osYUFBYUUsY0FBdEIsR0FBdUNGLFVBQW5FOztBQUVBLFFBQUlNLG9CQUFvQixDQUF4QixFQUEyQjtBQUN6QixhQUFPLElBQVA7QUFDRDs7QUFFRCxXQUNFO0FBQ0UsY0FBUVQsU0FBU0MsUUFBUVEsaUJBQVIsRUFBMkJRLE1BQXBDLEVBQTRDQyxNQUR0RDtBQUVFLHFCQUFlaEIsZ0JBQWdCaUIsYUFGakM7QUFHRSxpQkFBV2pCLGdCQUFnQmtCLFNBSDdCO0FBSUUsdUJBQWlCbEIsZ0JBQWdCbUIsZUFKbkM7QUFLRSw0QkFBc0JuQixnQkFBZ0JvQixvQkFMeEM7QUFNRSxxQkFBZXBCLGdCQUFnQnFCLGFBTmpDO0FBT0UsYUFBT0MsS0FBS0MsR0FBTCxDQUFTN0IsUUFBVCxFQUFtQm9CLG1CQUFuQixDQVBUO0FBUUUsNEJBQXNCSCxvQkFSeEI7QUFTRSxtQkFBYUosaUJBVGY7QUFVRSxjQUFRUixRQUFRUSxpQkFBUjtBQVZWLE1BREY7QUFjRCxHOzs7OztrQkFuQ2tCWixZIiwiZmlsZSI6ImJvdHRvbS13aWRnZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBUaW1lV2lkZ2V0IGZyb20gJy4vZmlsdGVycy90aW1lLXdpZGdldCc7XG5cbmNvbnN0IE1heFdpZHRoID0gMTA4MDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm90dG9tV2lkZ2V0IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGRhdGFzZXRzLFxuICAgICAgZmlsdGVycyxcbiAgICAgIHZpc1N0YXRlQWN0aW9ucyxcbiAgICAgIGNvbnRhaW5lclcsXG4gICAgICB1aVN0YXRlLFxuICAgICAgc2lkZVBhbmVsV2lkdGhcbiAgICB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7YWN0aXZlU2lkZVBhbmVsfSA9IHVpU3RhdGU7XG4gICAgY29uc3QgaXNPcGVuID0gQm9vbGVhbihhY3RpdmVTaWRlUGFuZWwpO1xuXG4gICAgY29uc3QgZW5sYXJnZWRGaWx0ZXJJZHggPSBmaWx0ZXJzLmZpbmRJbmRleChmID0+IGYuZW5sYXJnZWQpO1xuICAgIGNvbnN0IGlzQW55RmlsdGVyQW5pbWF0aW5nID0gZmlsdGVycy5zb21lKGYgPT4gZi5pc0FuaW1hdGluZyk7XG4gICAgY29uc3QgZW5sYXJnZWRGaWx0ZXJXaWR0aCA9IGlzT3BlbiA/IGNvbnRhaW5lclcgLSBzaWRlUGFuZWxXaWR0aCA6IGNvbnRhaW5lclc7XG5cbiAgICBpZiAoZW5sYXJnZWRGaWx0ZXJJZHggPCAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFRpbWVXaWRnZXRcbiAgICAgICAgZmllbGRzPXtkYXRhc2V0c1tmaWx0ZXJzW2VubGFyZ2VkRmlsdGVySWR4XS5kYXRhSWRdLmZpZWxkc31cbiAgICAgICAgc2V0RmlsdGVyUGxvdD17dmlzU3RhdGVBY3Rpb25zLnNldEZpbHRlclBsb3R9XG4gICAgICAgIHNldEZpbHRlcj17dmlzU3RhdGVBY3Rpb25zLnNldEZpbHRlcn1cbiAgICAgICAgdG9nZ2xlQW5pbWF0aW9uPXt2aXNTdGF0ZUFjdGlvbnMudG9nZ2xlQW5pbWF0aW9ufVxuICAgICAgICB1cGRhdGVBbmltYXRpb25TcGVlZD17dmlzU3RhdGVBY3Rpb25zLnVwZGF0ZUFuaW1hdGlvblNwZWVkfVxuICAgICAgICBlbmxhcmdlRmlsdGVyPXt2aXNTdGF0ZUFjdGlvbnMuZW5sYXJnZUZpbHRlcn1cbiAgICAgICAgd2lkdGg9e01hdGgubWluKE1heFdpZHRoLCBlbmxhcmdlZEZpbHRlcldpZHRoKX1cbiAgICAgICAgaXNBbnlGaWx0ZXJBbmltYXRpbmc9e2lzQW55RmlsdGVyQW5pbWF0aW5nfVxuICAgICAgICBlbmxhcmdlZElkeD17ZW5sYXJnZWRGaWx0ZXJJZHh9XG4gICAgICAgIGZpbHRlcj17ZmlsdGVyc1tlbmxhcmdlZEZpbHRlcklkeF19XG4gICAgICAvPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==
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
        sidePanelWidth = _props.sidePanelWidth,
        sideNavWidth = _props.sideNavWidth;
    var activeSidePanel = uiState.activeSidePanel;

    var isOpen = Boolean(activeSidePanel);

    var enlargedFilterIdx = filters.findIndex(function (f) {
      return f.enlarged;
    });
    var isAnyFilterAnimating = filters.some(function (f) {
      return f.isAnimating;
    });
    var enlargedFilterWidth = isOpen ? containerW - sidePanelWidth - sideNavWidth : containerW - sideNavWidth;

    if (enlargedFilterIdx < 0) {
      return null;
    }

    return _react2.default.createElement(_timeWidget2.default, {
      fields: datasets[filters[enlargedFilterIdx].dataId].fields,
      setFilterPlot: visStateActions.setFilterPlot,
      setFilter: visStateActions.setFilter,
      toggleAnimation: visStateActions.toggleAnimation,
      enlargeFilter: visStateActions.enlargeFilter,
      width: enlargedFilterWidth,
      isAnyFilterAnimating: isAnyFilterAnimating,
      enlargedIdx: enlargedFilterIdx,
      filter: filters[enlargedFilterIdx]
    });
  };

  return BottomWidget;
}(_react.Component);

exports.default = BottomWidget;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL2JvdHRvbS13aWRnZXQuanMiXSwibmFtZXMiOlsiQm90dG9tV2lkZ2V0IiwicmVuZGVyIiwicHJvcHMiLCJkYXRhc2V0cyIsImZpbHRlcnMiLCJ2aXNTdGF0ZUFjdGlvbnMiLCJjb250YWluZXJXIiwidWlTdGF0ZSIsInNpZGVQYW5lbFdpZHRoIiwic2lkZU5hdldpZHRoIiwiYWN0aXZlU2lkZVBhbmVsIiwiaXNPcGVuIiwiQm9vbGVhbiIsImVubGFyZ2VkRmlsdGVySWR4IiwiZmluZEluZGV4IiwiZiIsImVubGFyZ2VkIiwiaXNBbnlGaWx0ZXJBbmltYXRpbmciLCJzb21lIiwiaXNBbmltYXRpbmciLCJlbmxhcmdlZEZpbHRlcldpZHRoIiwiZGF0YUlkIiwiZmllbGRzIiwic2V0RmlsdGVyUGxvdCIsInNldEZpbHRlciIsInRvZ2dsZUFuaW1hdGlvbiIsImVubGFyZ2VGaWx0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7SUFFcUJBLFk7Ozs7Ozs7O3lCQUNuQkMsTSxxQkFBUztBQUFBLGlCQVNILEtBQUtDLEtBVEY7QUFBQSxRQUVMQyxRQUZLLFVBRUxBLFFBRks7QUFBQSxRQUdMQyxPQUhLLFVBR0xBLE9BSEs7QUFBQSxRQUlMQyxlQUpLLFVBSUxBLGVBSks7QUFBQSxRQUtMQyxVQUxLLFVBS0xBLFVBTEs7QUFBQSxRQU1MQyxPQU5LLFVBTUxBLE9BTks7QUFBQSxRQU9MQyxjQVBLLFVBT0xBLGNBUEs7QUFBQSxRQVFMQyxZQVJLLFVBUUxBLFlBUks7QUFBQSxRQVVBQyxlQVZBLEdBVW1CSCxPQVZuQixDQVVBRyxlQVZBOztBQVdQLFFBQU1DLFNBQVNDLFFBQVFGLGVBQVIsQ0FBZjs7QUFFQSxRQUFNRyxvQkFBb0JULFFBQVFVLFNBQVIsQ0FBa0I7QUFBQSxhQUFLQyxFQUFFQyxRQUFQO0FBQUEsS0FBbEIsQ0FBMUI7QUFDQSxRQUFNQyx1QkFBdUJiLFFBQVFjLElBQVIsQ0FBYTtBQUFBLGFBQUtILEVBQUVJLFdBQVA7QUFBQSxLQUFiLENBQTdCO0FBQ0EsUUFBTUMsc0JBQXNCVCxTQUN4QkwsYUFBYUUsY0FBYixHQUE4QkMsWUFETixHQUV4QkgsYUFBYUcsWUFGakI7O0FBSUEsUUFBSUksb0JBQW9CLENBQXhCLEVBQTJCO0FBQ3pCLGFBQU8sSUFBUDtBQUNEOztBQUVELFdBQ0U7QUFDRSxjQUFRVixTQUFTQyxRQUFRUyxpQkFBUixFQUEyQlEsTUFBcEMsRUFBNENDLE1BRHREO0FBRUUscUJBQWVqQixnQkFBZ0JrQixhQUZqQztBQUdFLGlCQUFXbEIsZ0JBQWdCbUIsU0FIN0I7QUFJRSx1QkFBaUJuQixnQkFBZ0JvQixlQUpuQztBQUtFLHFCQUFlcEIsZ0JBQWdCcUIsYUFMakM7QUFNRSxhQUFPTixtQkFOVDtBQU9FLDRCQUFzQkgsb0JBUHhCO0FBUUUsbUJBQWFKLGlCQVJmO0FBU0UsY0FBUVQsUUFBUVMsaUJBQVI7QUFUVixNQURGO0FBYUQsRzs7Ozs7a0JBckNrQmIsWSIsImZpbGUiOiJib3R0b20td2lkZ2V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgVGltZVdpZGdldCBmcm9tICcuL2ZpbHRlcnMvdGltZS13aWRnZXQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb3R0b21XaWRnZXQgZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgZGF0YXNldHMsXG4gICAgICBmaWx0ZXJzLFxuICAgICAgdmlzU3RhdGVBY3Rpb25zLFxuICAgICAgY29udGFpbmVyVyxcbiAgICAgIHVpU3RhdGUsXG4gICAgICBzaWRlUGFuZWxXaWR0aCxcbiAgICAgIHNpZGVOYXZXaWR0aFxuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHthY3RpdmVTaWRlUGFuZWx9ID0gdWlTdGF0ZTtcbiAgICBjb25zdCBpc09wZW4gPSBCb29sZWFuKGFjdGl2ZVNpZGVQYW5lbCk7XG5cbiAgICBjb25zdCBlbmxhcmdlZEZpbHRlcklkeCA9IGZpbHRlcnMuZmluZEluZGV4KGYgPT4gZi5lbmxhcmdlZCk7XG4gICAgY29uc3QgaXNBbnlGaWx0ZXJBbmltYXRpbmcgPSBmaWx0ZXJzLnNvbWUoZiA9PiBmLmlzQW5pbWF0aW5nKTtcbiAgICBjb25zdCBlbmxhcmdlZEZpbHRlcldpZHRoID0gaXNPcGVuXG4gICAgICA/IGNvbnRhaW5lclcgLSBzaWRlUGFuZWxXaWR0aCAtIHNpZGVOYXZXaWR0aFxuICAgICAgOiBjb250YWluZXJXIC0gc2lkZU5hdldpZHRoO1xuXG4gICAgaWYgKGVubGFyZ2VkRmlsdGVySWR4IDwgMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxUaW1lV2lkZ2V0XG4gICAgICAgIGZpZWxkcz17ZGF0YXNldHNbZmlsdGVyc1tlbmxhcmdlZEZpbHRlcklkeF0uZGF0YUlkXS5maWVsZHN9XG4gICAgICAgIHNldEZpbHRlclBsb3Q9e3Zpc1N0YXRlQWN0aW9ucy5zZXRGaWx0ZXJQbG90fVxuICAgICAgICBzZXRGaWx0ZXI9e3Zpc1N0YXRlQWN0aW9ucy5zZXRGaWx0ZXJ9XG4gICAgICAgIHRvZ2dsZUFuaW1hdGlvbj17dmlzU3RhdGVBY3Rpb25zLnRvZ2dsZUFuaW1hdGlvbn1cbiAgICAgICAgZW5sYXJnZUZpbHRlcj17dmlzU3RhdGVBY3Rpb25zLmVubGFyZ2VGaWx0ZXJ9XG4gICAgICAgIHdpZHRoPXtlbmxhcmdlZEZpbHRlcldpZHRofVxuICAgICAgICBpc0FueUZpbHRlckFuaW1hdGluZz17aXNBbnlGaWx0ZXJBbmltYXRpbmd9XG4gICAgICAgIGVubGFyZ2VkSWR4PXtlbmxhcmdlZEZpbHRlcklkeH1cbiAgICAgICAgZmlsdGVyPXtmaWx0ZXJzW2VubGFyZ2VkRmlsdGVySWR4XX1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxufVxuIl19
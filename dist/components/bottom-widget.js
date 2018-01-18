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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL2JvdHRvbS13aWRnZXQuanMiXSwibmFtZXMiOlsiQm90dG9tV2lkZ2V0IiwicmVuZGVyIiwicHJvcHMiLCJkYXRhc2V0cyIsImZpbHRlcnMiLCJ2aXNTdGF0ZUFjdGlvbnMiLCJjb250YWluZXJXIiwidWlTdGF0ZSIsInNpZGVQYW5lbFdpZHRoIiwic2lkZU5hdldpZHRoIiwiYWN0aXZlU2lkZVBhbmVsIiwiaXNPcGVuIiwiQm9vbGVhbiIsImVubGFyZ2VkRmlsdGVySWR4IiwiZmluZEluZGV4IiwiZiIsImVubGFyZ2VkIiwiaXNBbnlGaWx0ZXJBbmltYXRpbmciLCJzb21lIiwiaXNBbmltYXRpbmciLCJlbmxhcmdlZEZpbHRlcldpZHRoIiwiZGF0YUlkIiwiZmllbGRzIiwic2V0RmlsdGVyUGxvdCIsInNldEZpbHRlciIsInRvZ2dsZUFuaW1hdGlvbiIsImVubGFyZ2VGaWx0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7SUFFcUJBLFk7Ozs7Ozs7O3lCQUNuQkMsTSxxQkFBUztBQUFBLGlCQUN5RixLQUFLQyxLQUQ5RjtBQUFBLFFBQ0FDLFFBREEsVUFDQUEsUUFEQTtBQUFBLFFBQ1VDLE9BRFYsVUFDVUEsT0FEVjtBQUFBLFFBQ21CQyxlQURuQixVQUNtQkEsZUFEbkI7QUFBQSxRQUNvQ0MsVUFEcEMsVUFDb0NBLFVBRHBDO0FBQUEsUUFDZ0RDLE9BRGhELFVBQ2dEQSxPQURoRDtBQUFBLFFBQ3lEQyxjQUR6RCxVQUN5REEsY0FEekQ7QUFBQSxRQUN5RUMsWUFEekUsVUFDeUVBLFlBRHpFO0FBQUEsUUFFQUMsZUFGQSxHQUVtQkgsT0FGbkIsQ0FFQUcsZUFGQTs7QUFHUCxRQUFNQyxTQUFTQyxRQUFRRixlQUFSLENBQWY7O0FBRUEsUUFBTUcsb0JBQW9CVCxRQUFRVSxTQUFSLENBQWtCO0FBQUEsYUFBS0MsRUFBRUMsUUFBUDtBQUFBLEtBQWxCLENBQTFCO0FBQ0EsUUFBTUMsdUJBQXVCYixRQUFRYyxJQUFSLENBQWE7QUFBQSxhQUFLSCxFQUFFSSxXQUFQO0FBQUEsS0FBYixDQUE3QjtBQUNBLFFBQU1DLHNCQUFzQlQsU0FBU0wsYUFBYUUsY0FBYixHQUE4QkMsWUFBdkMsR0FDMUJILGFBQWFHLFlBRGY7O0FBR0EsUUFBSUksb0JBQW9CLENBQXhCLEVBQTJCO0FBQ3pCLGFBQU8sSUFBUDtBQUNEOztBQUVELFdBQ0U7QUFDRSxjQUFRVixTQUFTQyxRQUFRUyxpQkFBUixFQUEyQlEsTUFBcEMsRUFBNENDLE1BRHREO0FBRUUscUJBQWVqQixnQkFBZ0JrQixhQUZqQztBQUdFLGlCQUFXbEIsZ0JBQWdCbUIsU0FIN0I7QUFJRSx1QkFBaUJuQixnQkFBZ0JvQixlQUpuQztBQUtFLHFCQUFlcEIsZ0JBQWdCcUIsYUFMakM7QUFNRSxhQUFPTixtQkFOVDtBQU9FLDRCQUFzQkgsb0JBUHhCO0FBUUUsbUJBQWFKLGlCQVJmO0FBU0UsY0FBUVQsUUFBUVMsaUJBQVI7QUFUVixNQURGO0FBYUQsRzs7Ozs7a0JBNUJrQmIsWSIsImZpbGUiOiJib3R0b20td2lkZ2V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgVGltZVdpZGdldCBmcm9tICcuL2ZpbHRlcnMvdGltZS13aWRnZXQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb3R0b21XaWRnZXQgZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge2RhdGFzZXRzLCBmaWx0ZXJzLCB2aXNTdGF0ZUFjdGlvbnMsIGNvbnRhaW5lclcsIHVpU3RhdGUsIHNpZGVQYW5lbFdpZHRoLCBzaWRlTmF2V2lkdGh9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7YWN0aXZlU2lkZVBhbmVsfSA9IHVpU3RhdGU7XG4gICAgY29uc3QgaXNPcGVuID0gQm9vbGVhbihhY3RpdmVTaWRlUGFuZWwpO1xuXG4gICAgY29uc3QgZW5sYXJnZWRGaWx0ZXJJZHggPSBmaWx0ZXJzLmZpbmRJbmRleChmID0+IGYuZW5sYXJnZWQpO1xuICAgIGNvbnN0IGlzQW55RmlsdGVyQW5pbWF0aW5nID0gZmlsdGVycy5zb21lKGYgPT4gZi5pc0FuaW1hdGluZyk7XG4gICAgY29uc3QgZW5sYXJnZWRGaWx0ZXJXaWR0aCA9IGlzT3BlbiA/IGNvbnRhaW5lclcgLSBzaWRlUGFuZWxXaWR0aCAtIHNpZGVOYXZXaWR0aCA6XG4gICAgICBjb250YWluZXJXIC0gc2lkZU5hdldpZHRoO1xuXG4gICAgaWYgKGVubGFyZ2VkRmlsdGVySWR4IDwgMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxUaW1lV2lkZ2V0XG4gICAgICAgIGZpZWxkcz17ZGF0YXNldHNbZmlsdGVyc1tlbmxhcmdlZEZpbHRlcklkeF0uZGF0YUlkXS5maWVsZHN9XG4gICAgICAgIHNldEZpbHRlclBsb3Q9e3Zpc1N0YXRlQWN0aW9ucy5zZXRGaWx0ZXJQbG90fVxuICAgICAgICBzZXRGaWx0ZXI9e3Zpc1N0YXRlQWN0aW9ucy5zZXRGaWx0ZXJ9XG4gICAgICAgIHRvZ2dsZUFuaW1hdGlvbj17dmlzU3RhdGVBY3Rpb25zLnRvZ2dsZUFuaW1hdGlvbn1cbiAgICAgICAgZW5sYXJnZUZpbHRlcj17dmlzU3RhdGVBY3Rpb25zLmVubGFyZ2VGaWx0ZXJ9XG4gICAgICAgIHdpZHRoPXtlbmxhcmdlZEZpbHRlcldpZHRofVxuICAgICAgICBpc0FueUZpbHRlckFuaW1hdGluZz17aXNBbnlGaWx0ZXJBbmltYXRpbmd9XG4gICAgICAgIGVubGFyZ2VkSWR4PXtlbmxhcmdlZEZpbHRlcklkeH1cbiAgICAgICAgZmlsdGVyPXtmaWx0ZXJzW2VubGFyZ2VkRmlsdGVySWR4XX1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxufVxuIl19
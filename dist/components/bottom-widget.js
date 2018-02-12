'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

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
    return (0, _possibleConstructorReturn3.default)(this, (BottomWidget.__proto__ || Object.getPrototypeOf(BottomWidget)).apply(this, arguments));
  }

  (0, _createClass3.default)(BottomWidget, [{
    key: 'render',
    value: function render() {
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
    }
  }]);
  return BottomWidget;
}(_react.Component);

exports.default = BottomWidget;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL2JvdHRvbS13aWRnZXQuanMiXSwibmFtZXMiOlsiTWF4V2lkdGgiLCJCb3R0b21XaWRnZXQiLCJwcm9wcyIsImRhdGFzZXRzIiwiZmlsdGVycyIsInZpc1N0YXRlQWN0aW9ucyIsImNvbnRhaW5lclciLCJ1aVN0YXRlIiwic2lkZVBhbmVsV2lkdGgiLCJhY3RpdmVTaWRlUGFuZWwiLCJpc09wZW4iLCJCb29sZWFuIiwiZW5sYXJnZWRGaWx0ZXJJZHgiLCJmaW5kSW5kZXgiLCJmIiwiZW5sYXJnZWQiLCJpc0FueUZpbHRlckFuaW1hdGluZyIsInNvbWUiLCJpc0FuaW1hdGluZyIsImVubGFyZ2VkRmlsdGVyV2lkdGgiLCJkYXRhSWQiLCJmaWVsZHMiLCJzZXRGaWx0ZXJQbG90Iiwic2V0RmlsdGVyIiwidG9nZ2xlQW5pbWF0aW9uIiwidXBkYXRlQW5pbWF0aW9uU3BlZWQiLCJlbmxhcmdlRmlsdGVyIiwiTWF0aCIsIm1pbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxXQUFXLElBQWpCOztJQUVxQkMsWTs7Ozs7Ozs7Ozs2QkFDVjtBQUFBLG1CQVFILEtBQUtDLEtBUkY7QUFBQSxVQUVMQyxRQUZLLFVBRUxBLFFBRks7QUFBQSxVQUdMQyxPQUhLLFVBR0xBLE9BSEs7QUFBQSxVQUlMQyxlQUpLLFVBSUxBLGVBSks7QUFBQSxVQUtMQyxVQUxLLFVBS0xBLFVBTEs7QUFBQSxVQU1MQyxPQU5LLFVBTUxBLE9BTks7QUFBQSxVQU9MQyxjQVBLLFVBT0xBLGNBUEs7QUFBQSxVQVNBQyxlQVRBLEdBU21CRixPQVRuQixDQVNBRSxlQVRBOztBQVVQLFVBQU1DLFNBQVNDLFFBQVFGLGVBQVIsQ0FBZjs7QUFFQSxVQUFNRyxvQkFBb0JSLFFBQVFTLFNBQVIsQ0FBa0I7QUFBQSxlQUFLQyxFQUFFQyxRQUFQO0FBQUEsT0FBbEIsQ0FBMUI7QUFDQSxVQUFNQyx1QkFBdUJaLFFBQVFhLElBQVIsQ0FBYTtBQUFBLGVBQUtILEVBQUVJLFdBQVA7QUFBQSxPQUFiLENBQTdCO0FBQ0EsVUFBTUMsc0JBQXNCVCxTQUFTSixhQUFhRSxjQUF0QixHQUF1Q0YsVUFBbkU7O0FBRUEsVUFBSU0sb0JBQW9CLENBQXhCLEVBQTJCO0FBQ3pCLGVBQU8sSUFBUDtBQUNEOztBQUVELGFBQ0U7QUFDRSxnQkFBUVQsU0FBU0MsUUFBUVEsaUJBQVIsRUFBMkJRLE1BQXBDLEVBQTRDQyxNQUR0RDtBQUVFLHVCQUFlaEIsZ0JBQWdCaUIsYUFGakM7QUFHRSxtQkFBV2pCLGdCQUFnQmtCLFNBSDdCO0FBSUUseUJBQWlCbEIsZ0JBQWdCbUIsZUFKbkM7QUFLRSw4QkFBc0JuQixnQkFBZ0JvQixvQkFMeEM7QUFNRSx1QkFBZXBCLGdCQUFnQnFCLGFBTmpDO0FBT0UsZUFBT0MsS0FBS0MsR0FBTCxDQUFTNUIsUUFBVCxFQUFtQm1CLG1CQUFuQixDQVBUO0FBUUUsOEJBQXNCSCxvQkFSeEI7QUFTRSxxQkFBYUosaUJBVGY7QUFVRSxnQkFBUVIsUUFBUVEsaUJBQVI7QUFWVixRQURGO0FBY0Q7Ozs7O2tCQW5Da0JYLFkiLCJmaWxlIjoiYm90dG9tLXdpZGdldC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFRpbWVXaWRnZXQgZnJvbSAnLi9maWx0ZXJzL3RpbWUtd2lkZ2V0JztcblxuY29uc3QgTWF4V2lkdGggPSAxMDgwO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb3R0b21XaWRnZXQgZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgZGF0YXNldHMsXG4gICAgICBmaWx0ZXJzLFxuICAgICAgdmlzU3RhdGVBY3Rpb25zLFxuICAgICAgY29udGFpbmVyVyxcbiAgICAgIHVpU3RhdGUsXG4gICAgICBzaWRlUGFuZWxXaWR0aFxuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHthY3RpdmVTaWRlUGFuZWx9ID0gdWlTdGF0ZTtcbiAgICBjb25zdCBpc09wZW4gPSBCb29sZWFuKGFjdGl2ZVNpZGVQYW5lbCk7XG5cbiAgICBjb25zdCBlbmxhcmdlZEZpbHRlcklkeCA9IGZpbHRlcnMuZmluZEluZGV4KGYgPT4gZi5lbmxhcmdlZCk7XG4gICAgY29uc3QgaXNBbnlGaWx0ZXJBbmltYXRpbmcgPSBmaWx0ZXJzLnNvbWUoZiA9PiBmLmlzQW5pbWF0aW5nKTtcbiAgICBjb25zdCBlbmxhcmdlZEZpbHRlcldpZHRoID0gaXNPcGVuID8gY29udGFpbmVyVyAtIHNpZGVQYW5lbFdpZHRoIDogY29udGFpbmVyVztcblxuICAgIGlmIChlbmxhcmdlZEZpbHRlcklkeCA8IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8VGltZVdpZGdldFxuICAgICAgICBmaWVsZHM9e2RhdGFzZXRzW2ZpbHRlcnNbZW5sYXJnZWRGaWx0ZXJJZHhdLmRhdGFJZF0uZmllbGRzfVxuICAgICAgICBzZXRGaWx0ZXJQbG90PXt2aXNTdGF0ZUFjdGlvbnMuc2V0RmlsdGVyUGxvdH1cbiAgICAgICAgc2V0RmlsdGVyPXt2aXNTdGF0ZUFjdGlvbnMuc2V0RmlsdGVyfVxuICAgICAgICB0b2dnbGVBbmltYXRpb249e3Zpc1N0YXRlQWN0aW9ucy50b2dnbGVBbmltYXRpb259XG4gICAgICAgIHVwZGF0ZUFuaW1hdGlvblNwZWVkPXt2aXNTdGF0ZUFjdGlvbnMudXBkYXRlQW5pbWF0aW9uU3BlZWR9XG4gICAgICAgIGVubGFyZ2VGaWx0ZXI9e3Zpc1N0YXRlQWN0aW9ucy5lbmxhcmdlRmlsdGVyfVxuICAgICAgICB3aWR0aD17TWF0aC5taW4oTWF4V2lkdGgsIGVubGFyZ2VkRmlsdGVyV2lkdGgpfVxuICAgICAgICBpc0FueUZpbHRlckFuaW1hdGluZz17aXNBbnlGaWx0ZXJBbmltYXRpbmd9XG4gICAgICAgIGVubGFyZ2VkSWR4PXtlbmxhcmdlZEZpbHRlcklkeH1cbiAgICAgICAgZmlsdGVyPXtmaWx0ZXJzW2VubGFyZ2VkRmlsdGVySWR4XX1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxufVxuIl19
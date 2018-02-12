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

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _class, _temp, _initialiseProps;

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  margin-top: ', ';\n  align-items: flex-end;\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n'], ['\n  margin-top: ', ';\n  align-items: flex-end;\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n  display: flex;\n  height: ', ';\n  align-items: center;\n  font-size: 11px;\n  justify-content: ', ';\n  color: ', ';\n  \n  .horizontal-bar {\n    padding: 0 12px;\n  }\n  \n  .time-value {\n    display: flex;\n    flex-direction: ', ';\n    align-items: flex-start;\n  }\n  \n  .time-value:last-child {\n    align-items: flex-end;\n  }\n'], ['\n  display: flex;\n  height: ', ';\n  align-items: center;\n  font-size: 11px;\n  justify-content: ', ';\n  color: ', ';\n  \n  .horizontal-bar {\n    padding: 0 12px;\n  }\n  \n  .time-value {\n    display: flex;\n    flex-direction: ', ';\n    align-items: flex-start;\n  }\n  \n  .time-value:last-child {\n    align-items: flex-end;\n  }\n']),
    _templateObject3 = (0, _taggedTemplateLiteral3.default)(['\n  margin-bottom: 12px;\n  margin-right: 42px;\n  \n  &.disabled {\n    opacity: 0.4;\n    pointer-events: none;\n  }\n'], ['\n  margin-bottom: 12px;\n  margin-right: 42px;\n  \n  &.disabled {\n    opacity: 0.4;\n    pointer-events: none;\n  }\n']),
    _templateObject4 = (0, _taggedTemplateLiteral3.default)(['\n  svg {\n    margin: 0 6px;\n  }\n'], ['\n  svg {\n    margin: 0 6px;\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _window = require('global/window');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _lodash = require('lodash.throttle');

var _lodash2 = _interopRequireDefault(_lodash);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _reselect = require('reselect');

var _icons = require('./icons');

var _styledComponents3 = require('./styled-components');

var _filterUtils = require('../../utils/filter-utils');

var _rangeSlider = require('./range-slider');

var _rangeSlider2 = _interopRequireDefault(_rangeSlider);

var _timeSliderMarker = require('./time-slider-marker');

var _timeSliderMarker2 = _interopRequireDefault(_timeSliderMarker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  onChange: _propTypes2.default.func.isRequired,
  domain: _propTypes2.default.array.isRequired,
  value: _propTypes2.default.array.isRequired,
  step: _propTypes2.default.number.isRequired,
  plotType: _propTypes2.default.string,
  histogram: _propTypes2.default.array,
  lineChart: _propTypes2.default.object,
  toggleAnimation: _propTypes2.default.func.isRequired,
  isAnimatable: _propTypes2.default.bool,
  isEnlarged: _propTypes2.default.bool,
  speed: _propTypes2.default.number
};

var defaultTimeFormat = function defaultTimeFormat(val) {
  return _moment2.default.utc(val).format('MM/DD/YY hh:mma');
};

var StyledSliderContainer = _styledComponents2.default.div(_templateObject, function (props) {
  return props.isEnlarged ? '12px' : '0px';
});

var TimeRangeSlider = (_temp = _class = function (_Component) {
  (0, _inherits3.default)(TimeRangeSlider, _Component);

  function TimeRangeSlider(props) {
    (0, _classCallCheck3.default)(this, TimeRangeSlider);

    var _this = (0, _possibleConstructorReturn3.default)(this, (TimeRangeSlider.__proto__ || Object.getPrototypeOf(TimeRangeSlider)).call(this, props));

    _initialiseProps.call(_this);

    _this.state = {
      isAnimating: false,
      width: 288
    };
    _this._animation = null;
    _this._sliderThrottle = (0, _lodash2.default)(_this.props.onChange, 20);
    return _this;
  }

  (0, _createClass3.default)(TimeRangeSlider, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (!this._animation && this.state.isAnimating) {
        this._animation = (0, _window.requestAnimationFrame)(this._nextFrame);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          domain = _props.domain,
          value = _props.value,
          isEnlarged = _props.isEnlarged;
      var isAnimating = this.state.isAnimating;


      return _react2.default.createElement(
        'div',
        { className: 'time-range-slider' },
        _react2.default.createElement(TimeTitle, {
          timeFormat: this.titleFormatter(this.props),
          value: value,
          isEnlarged: isEnlarged
        }),
        _react2.default.createElement(
          StyledSliderContainer,
          {
            className: 'time-range-slider__container',
            isEnlarged: isEnlarged },
          isEnlarged ? _react2.default.createElement(AnimationControls, {
            isAnimatable: this.props.isAnimatable,
            isEnlarged: isEnlarged,
            isAnimating: isAnimating,
            pauseAnimation: this._pauseAnimation,
            resetAnimation: this._resetAnimation,
            startAnimation: this._startAnimation
          }) : null,
          _react2.default.createElement(_rangeSlider2.default, {
            range: domain,
            value0: value[0],
            value1: value[1],
            histogram: this.props.histogram,
            lineChart: this.props.lineChart,
            plotType: this.props.plotType,
            isEnlarged: isEnlarged,
            showInput: false,
            step: this.props.step,
            onChange: this._sliderUpdate,
            xAxis: _timeSliderMarker2.default
          })
        )
      );
    }
  }]);
  return TimeRangeSlider;
}(_react.Component), _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.domainSelector = function (props) {
    return props.domain;
  };

  this.titleFormatter = (0, _reselect.createSelector)(this.domainSelector, function (domain) {
    return (0, _filterUtils.getTimeWidgetTitleFormatter)(domain);
  });

  this._sliderUpdate = function (args) {
    _this2._sliderThrottle.cancel();
    _this2._sliderThrottle(args);
  };

  this._resetAnimation = function () {
    var _props2 = _this2.props,
        domain = _props2.domain,
        value = _props2.value;

    var value0 = domain[0];
    var value1 = value0 + value[1] - value[0];
    _this2.props.onChange([value0, value1]);
  };

  this._startAnimation = function () {
    _this2._pauseAnimation();
    _this2.props.toggleAnimation();
    _this2.setState({ isAnimating: true });
  };

  this._pauseAnimation = function () {
    if (_this2._animation) {
      (0, _window.cancelAnimationFrame)(_this2._animation);
      _this2.props.toggleAnimation();
      _this2._animation = null;
    }
    _this2.setState({ isAnimating: false });
  };

  this._nextFrame = function () {
    _this2._animation = null;

    var _props3 = _this2.props,
        domain = _props3.domain,
        value = _props3.value;

    var speed = (domain[1] - domain[0]) / _filterUtils.BASE_SPEED * _this2.props.speed;

    // loop when reaches the end
    var value0 = value[1] + speed > domain[1] ? domain[0] : value[0] + speed;
    var value1 = value0 + value[1] - value[0];
    _this2.props.onChange([value0, value1]);
  };
}, _temp);
exports.default = TimeRangeSlider;


var TimeValueWrapper = _styledComponents2.default.div(_templateObject2, function (props) {
  return props.theme.secondaryInputHeight;
}, function (props) {
  return props.isEnlarged ? 'center' : 'space-between';
}, function (props) {
  return props.theme.labelColor;
}, function (props) {
  return props.isEnlarged ? 'row' : 'column';
});

var TimeTitle = function TimeTitle(_ref) {
  var value = _ref.value,
      isEnlarged = _ref.isEnlarged,
      _ref$timeFormat = _ref.timeFormat,
      timeFormat = _ref$timeFormat === undefined ? defaultTimeFormat : _ref$timeFormat;
  return _react2.default.createElement(
    TimeValueWrapper,
    { isEnlarged: isEnlarged },
    _react2.default.createElement(TimeValue, { key: 0, value: _moment2.default.utc(value[0]).format(timeFormat), split: !isEnlarged }),
    isEnlarged ? _react2.default.createElement(
      'div',
      { className: 'horizontal-bar' },
      _react2.default.createElement(_icons.Minus, { height: '12px' })
    ) : null,
    _react2.default.createElement(TimeValue, { key: 1, value: _moment2.default.utc(value[0]).format(timeFormat), split: !isEnlarged })
  );
};

var TimeValue = function TimeValue(_ref2) {
  var value = _ref2.value,
      split = _ref2.split;
  return (
    // render two lines if not enlarged
    _react2.default.createElement(
      'div',
      { className: 'time-value' },
      split ? value.split(' ').map(function (v, i) {
        return _react2.default.createElement(
          'div',
          { key: i },
          i === 0 ? _react2.default.createElement(
            _styledComponents3.SelectText,
            null,
            v
          ) : _react2.default.createElement(
            _styledComponents3.SelectTextBold,
            null,
            v
          )
        );
      }) : _react2.default.createElement(
        _styledComponents3.SelectTextBold,
        null,
        value
      )
    )
  );
};

var StyledAnimationControls = _styledComponents2.default.div(_templateObject3);

var IconButton = _styledComponents3.Button.extend(_templateObject4);

var AnimationControls = function AnimationControls(_ref3) {
  var isAnimatable = _ref3.isAnimatable,
      isAnimating = _ref3.isAnimating,
      pauseAnimation = _ref3.pauseAnimation,
      resetAnimation = _ref3.resetAnimation,
      startAnimation = _ref3.startAnimation;
  return _react2.default.createElement(
    StyledAnimationControls,
    {
      className: (0, _classnames2.default)('time-range-slider__control', { disabled: !isAnimatable })
    },
    _react2.default.createElement(
      _styledComponents3.ButtonGroup,
      null,
      _react2.default.createElement(
        IconButton,
        { className: 'playback-control-button',
          onClick: resetAnimation, secondary: true },
        _react2.default.createElement(_icons.Reset, { height: '12px' })
      ),
      _react2.default.createElement(
        IconButton,
        { className: (0, _classnames2.default)('playback-control-button', { active: isAnimating }),
          onClick: isAnimating ? pauseAnimation : startAnimation, secondary: true },
        isAnimating ? _react2.default.createElement(_icons.Pause, { height: '12px' }) : _react2.default.createElement(_icons.Play, { height: '12px' })
      )
    )
  );
};

TimeRangeSlider.propTypes = propTypes;
TimeRangeSlider.displayName = 'TimeRangeSlider';
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi90aW1lLXJhbmdlLXNsaWRlci5qcyJdLCJuYW1lcyI6WyJwcm9wVHlwZXMiLCJvbkNoYW5nZSIsImZ1bmMiLCJpc1JlcXVpcmVkIiwiZG9tYWluIiwiYXJyYXkiLCJ2YWx1ZSIsInN0ZXAiLCJudW1iZXIiLCJwbG90VHlwZSIsInN0cmluZyIsImhpc3RvZ3JhbSIsImxpbmVDaGFydCIsIm9iamVjdCIsInRvZ2dsZUFuaW1hdGlvbiIsImlzQW5pbWF0YWJsZSIsImJvb2wiLCJpc0VubGFyZ2VkIiwic3BlZWQiLCJkZWZhdWx0VGltZUZvcm1hdCIsInV0YyIsInZhbCIsImZvcm1hdCIsIlN0eWxlZFNsaWRlckNvbnRhaW5lciIsImRpdiIsInByb3BzIiwiVGltZVJhbmdlU2xpZGVyIiwic3RhdGUiLCJpc0FuaW1hdGluZyIsIndpZHRoIiwiX2FuaW1hdGlvbiIsIl9zbGlkZXJUaHJvdHRsZSIsIl9uZXh0RnJhbWUiLCJ0aXRsZUZvcm1hdHRlciIsIl9wYXVzZUFuaW1hdGlvbiIsIl9yZXNldEFuaW1hdGlvbiIsIl9zdGFydEFuaW1hdGlvbiIsIl9zbGlkZXJVcGRhdGUiLCJkb21haW5TZWxlY3RvciIsImNhbmNlbCIsImFyZ3MiLCJ2YWx1ZTAiLCJ2YWx1ZTEiLCJzZXRTdGF0ZSIsIlRpbWVWYWx1ZVdyYXBwZXIiLCJ0aGVtZSIsInNlY29uZGFyeUlucHV0SGVpZ2h0IiwibGFiZWxDb2xvciIsIlRpbWVUaXRsZSIsInRpbWVGb3JtYXQiLCJUaW1lVmFsdWUiLCJzcGxpdCIsIm1hcCIsInYiLCJpIiwiU3R5bGVkQW5pbWF0aW9uQ29udHJvbHMiLCJJY29uQnV0dG9uIiwiZXh0ZW5kIiwiQW5pbWF0aW9uQ29udHJvbHMiLCJwYXVzZUFuaW1hdGlvbiIsInJlc2V0QW5pbWF0aW9uIiwic3RhcnRBbmltYXRpb24iLCJkaXNhYmxlZCIsImFjdGl2ZSIsImRpc3BsYXlOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7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d0IsU0FDeEJBLFlBRHdCO0FBQUEsTUFFeEJhLFdBRndCLFNBRXhCQSxXQUZ3QjtBQUFBLE1BR3hCK0IsY0FId0IsU0FHeEJBLGNBSHdCO0FBQUEsTUFJeEJDLGNBSndCLFNBSXhCQSxjQUp3QjtBQUFBLE1BS3hCQyxjQUx3QixTQUt4QkEsY0FMd0I7QUFBQSxTQU94QjtBQUFDLDJCQUFEO0FBQUE7QUFDRSxpQkFBVywwQkFBVyw0QkFBWCxFQUF5QyxFQUFDQyxVQUFVLENBQUMvQyxZQUFaLEVBQXpDO0FBRGI7QUFHRTtBQUFBO0FBQUE7QUFDRTtBQUFDLGtCQUFEO0FBQUEsVUFBWSxXQUFVLHlCQUF0QjtBQUNFLG1CQUFTNkMsY0FEWCxFQUMyQixlQUQzQjtBQUVFLHNEQUFPLFFBQU8sTUFBZDtBQUZGLE9BREY7QUFLRTtBQUFDLGtCQUFEO0FBQUEsVUFBWSxXQUFXLDBCQUFXLHlCQUFYLEVBQXNDLEVBQUNHLFFBQVFuQyxXQUFULEVBQXRDLENBQXZCO0FBQ0UsbUJBQVNBLGNBQWMrQixjQUFkLEdBQStCRSxjQUQxQyxFQUMwRCxlQUQxRDtBQUVHakMsc0JBQWMsOENBQU8sUUFBTyxNQUFkLEdBQWQsR0FBdUMsNkNBQU0sUUFBTyxNQUFiO0FBRjFDO0FBTEY7QUFIRixHQVB3QjtBQUFBLENBQTFCOztBQXVCQUYsZ0JBQWdCMUIsU0FBaEIsR0FBNEJBLFNBQTVCO0FBQ0EwQixnQkFBZ0JzQyxXQUFoQixHQUE4QixpQkFBOUIiLCJmaWxlIjoidGltZS1yYW5nZS1zbGlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQge3JlcXVlc3RBbmltYXRpb25GcmFtZSwgY2FuY2VsQW5pbWF0aW9uRnJhbWV9IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgdGhyb3R0bGUgZnJvbSAnbG9kYXNoLnRocm90dGxlJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtjcmVhdGVTZWxlY3Rvcn0gZnJvbSAncmVzZWxlY3QnO1xuaW1wb3J0IHtQbGF5LCBSZXNldCwgUGF1c2UsIE1pbnVzfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5pbXBvcnQge1NlbGVjdFRleHRCb2xkLCBTZWxlY3RUZXh0LCBCdXR0b24sIEJ1dHRvbkdyb3VwfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge2dldFRpbWVXaWRnZXRUaXRsZUZvcm1hdHRlciwgQkFTRV9TUEVFRH0gZnJvbSAndXRpbHMvZmlsdGVyLXV0aWxzJztcbmltcG9ydCBSYW5nZVNsaWRlciBmcm9tICcuL3JhbmdlLXNsaWRlcic7XG5pbXBvcnQgVGltZVNsaWRlck1hcmtlciBmcm9tICcuL3RpbWUtc2xpZGVyLW1hcmtlcic7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGRvbWFpbjogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gIHZhbHVlOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgc3RlcDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBwbG90VHlwZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgaGlzdG9ncmFtOiBQcm9wVHlwZXMuYXJyYXksXG4gIGxpbmVDaGFydDogUHJvcFR5cGVzLm9iamVjdCxcbiAgdG9nZ2xlQW5pbWF0aW9uOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBpc0FuaW1hdGFibGU6IFByb3BUeXBlcy5ib29sLFxuICBpc0VubGFyZ2VkOiBQcm9wVHlwZXMuYm9vbCxcbiAgc3BlZWQ6IFByb3BUeXBlcy5udW1iZXJcbn07XG5cbmNvbnN0IGRlZmF1bHRUaW1lRm9ybWF0ID0gdmFsID0+IG1vbWVudC51dGModmFsKS5mb3JtYXQoJ01NL0REL1lZIGhoOm1tYScpO1xuXG5jb25zdCBTdHlsZWRTbGlkZXJDb250YWluZXIgPSBzdHlsZWQuZGl2YFxuICBtYXJnaW4tdG9wOiAke3Byb3BzID0+IHByb3BzLmlzRW5sYXJnZWQgPyAnMTJweCcgOiAnMHB4J307XG4gIGFsaWduLWl0ZW1zOiBmbGV4LWVuZDtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuYDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZVJhbmdlU2xpZGVyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGlzQW5pbWF0aW5nOiBmYWxzZSxcbiAgICAgIHdpZHRoOiAyODhcbiAgICB9O1xuICAgIHRoaXMuX2FuaW1hdGlvbiA9IG51bGw7XG4gICAgdGhpcy5fc2xpZGVyVGhyb3R0bGUgPSB0aHJvdHRsZSh0aGlzLnByb3BzLm9uQ2hhbmdlLCAyMCk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgaWYgKCF0aGlzLl9hbmltYXRpb24gJiYgdGhpcy5zdGF0ZS5pc0FuaW1hdGluZykge1xuICAgICAgdGhpcy5fYW5pbWF0aW9uID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuX25leHRGcmFtZSk7XG4gICAgfVxuICB9XG5cbiAgZG9tYWluU2VsZWN0b3IgPSBwcm9wcyA9PiBwcm9wcy5kb21haW47XG4gIHRpdGxlRm9ybWF0dGVyID0gY3JlYXRlU2VsZWN0b3IodGhpcy5kb21haW5TZWxlY3RvciwgZG9tYWluID0+XG4gICAgZ2V0VGltZVdpZGdldFRpdGxlRm9ybWF0dGVyKGRvbWFpbilcbiAgKTtcblxuICBfc2xpZGVyVXBkYXRlID0gYXJncyA9PiB7XG4gICAgdGhpcy5fc2xpZGVyVGhyb3R0bGUuY2FuY2VsKCk7XG4gICAgdGhpcy5fc2xpZGVyVGhyb3R0bGUoYXJncyk7XG4gIH07XG5cbiAgX3Jlc2V0QW5pbWF0aW9uID0gKCkgPT4ge1xuICAgIGNvbnN0IHtkb21haW4sIHZhbHVlfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgdmFsdWUwID0gZG9tYWluWzBdO1xuICAgIGNvbnN0IHZhbHVlMSA9IHZhbHVlMCArIHZhbHVlWzFdIC0gdmFsdWVbMF07XG4gICAgdGhpcy5wcm9wcy5vbkNoYW5nZShbdmFsdWUwLCB2YWx1ZTFdKTtcbiAgfTtcblxuICBfc3RhcnRBbmltYXRpb24gPSAoKSA9PiB7XG4gICAgdGhpcy5fcGF1c2VBbmltYXRpb24oKTtcbiAgICB0aGlzLnByb3BzLnRvZ2dsZUFuaW1hdGlvbigpO1xuICAgIHRoaXMuc2V0U3RhdGUoe2lzQW5pbWF0aW5nOiB0cnVlfSk7XG4gIH07XG5cbiAgX3BhdXNlQW5pbWF0aW9uID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLl9hbmltYXRpb24pIHtcbiAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuX2FuaW1hdGlvbik7XG4gICAgICB0aGlzLnByb3BzLnRvZ2dsZUFuaW1hdGlvbigpO1xuICAgICAgdGhpcy5fYW5pbWF0aW9uID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7aXNBbmltYXRpbmc6IGZhbHNlfSk7XG4gIH07XG5cbiAgX25leHRGcmFtZSA9ICgpID0+IHtcbiAgICB0aGlzLl9hbmltYXRpb24gPSBudWxsO1xuXG4gICAgY29uc3Qge2RvbWFpbiwgdmFsdWV9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBzcGVlZCA9ICgoZG9tYWluWzFdIC0gZG9tYWluWzBdKSAvIEJBU0VfU1BFRUQpICogdGhpcy5wcm9wcy5zcGVlZDtcblxuICAgIC8vIGxvb3Agd2hlbiByZWFjaGVzIHRoZSBlbmRcbiAgICBjb25zdCB2YWx1ZTAgPSB2YWx1ZVsxXSArIHNwZWVkID4gZG9tYWluWzFdID8gZG9tYWluWzBdIDogdmFsdWVbMF0gKyBzcGVlZDtcbiAgICBjb25zdCB2YWx1ZTEgPSB2YWx1ZTAgKyB2YWx1ZVsxXSAtIHZhbHVlWzBdO1xuICAgIHRoaXMucHJvcHMub25DaGFuZ2UoW3ZhbHVlMCwgdmFsdWUxXSk7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtkb21haW4sIHZhbHVlLCBpc0VubGFyZ2VkfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge2lzQW5pbWF0aW5nfSA9IHRoaXMuc3RhdGU7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aW1lLXJhbmdlLXNsaWRlclwiPlxuICAgICAgICA8VGltZVRpdGxlXG4gICAgICAgICAgdGltZUZvcm1hdD17dGhpcy50aXRsZUZvcm1hdHRlcih0aGlzLnByb3BzKX1cbiAgICAgICAgICB2YWx1ZT17dmFsdWV9XG4gICAgICAgICAgaXNFbmxhcmdlZD17aXNFbmxhcmdlZH1cbiAgICAgICAgLz5cbiAgICAgICAgPFN0eWxlZFNsaWRlckNvbnRhaW5lclxuICAgICAgICAgIGNsYXNzTmFtZT1cInRpbWUtcmFuZ2Utc2xpZGVyX19jb250YWluZXJcIlxuICAgICAgICAgIGlzRW5sYXJnZWQ9e2lzRW5sYXJnZWR9PlxuICAgICAgICAgIHtpc0VubGFyZ2VkID8gPEFuaW1hdGlvbkNvbnRyb2xzXG4gICAgICAgICAgICBpc0FuaW1hdGFibGU9e3RoaXMucHJvcHMuaXNBbmltYXRhYmxlfVxuICAgICAgICAgICAgaXNFbmxhcmdlZD17aXNFbmxhcmdlZH1cbiAgICAgICAgICAgIGlzQW5pbWF0aW5nPXtpc0FuaW1hdGluZ31cbiAgICAgICAgICAgIHBhdXNlQW5pbWF0aW9uPXt0aGlzLl9wYXVzZUFuaW1hdGlvbn1cbiAgICAgICAgICAgIHJlc2V0QW5pbWF0aW9uPXt0aGlzLl9yZXNldEFuaW1hdGlvbn1cbiAgICAgICAgICAgIHN0YXJ0QW5pbWF0aW9uPXt0aGlzLl9zdGFydEFuaW1hdGlvbn1cbiAgICAgICAgICAvPiA6IG51bGx9XG4gICAgICAgICAgPFJhbmdlU2xpZGVyXG4gICAgICAgICAgICByYW5nZT17ZG9tYWlufVxuICAgICAgICAgICAgdmFsdWUwPXt2YWx1ZVswXX1cbiAgICAgICAgICAgIHZhbHVlMT17dmFsdWVbMV19XG4gICAgICAgICAgICBoaXN0b2dyYW09e3RoaXMucHJvcHMuaGlzdG9ncmFtfVxuICAgICAgICAgICAgbGluZUNoYXJ0PXt0aGlzLnByb3BzLmxpbmVDaGFydH1cbiAgICAgICAgICAgIHBsb3RUeXBlPXt0aGlzLnByb3BzLnBsb3RUeXBlfVxuICAgICAgICAgICAgaXNFbmxhcmdlZD17aXNFbmxhcmdlZH1cbiAgICAgICAgICAgIHNob3dJbnB1dD17ZmFsc2V9XG4gICAgICAgICAgICBzdGVwPXt0aGlzLnByb3BzLnN0ZXB9XG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5fc2xpZGVyVXBkYXRlfVxuICAgICAgICAgICAgeEF4aXM9e1RpbWVTbGlkZXJNYXJrZXJ9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9TdHlsZWRTbGlkZXJDb250YWluZXI+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmNvbnN0IFRpbWVWYWx1ZVdyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBoZWlnaHQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2Vjb25kYXJ5SW5wdXRIZWlnaHR9O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBmb250LXNpemU6IDExcHg7XG4gIGp1c3RpZnktY29udGVudDogJHtwcm9wcyA9PiBwcm9wcy5pc0VubGFyZ2VkID8gJ2NlbnRlcicgOiAnc3BhY2UtYmV0d2Vlbid9O1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5sYWJlbENvbG9yfTtcbiAgXG4gIC5ob3Jpem9udGFsLWJhciB7XG4gICAgcGFkZGluZzogMCAxMnB4O1xuICB9XG4gIFxuICAudGltZS12YWx1ZSB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogJHtwcm9wcyA9PiBwcm9wcy5pc0VubGFyZ2VkID8gJ3JvdycgOiAnY29sdW1uJ307XG4gICAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XG4gIH1cbiAgXG4gIC50aW1lLXZhbHVlOmxhc3QtY2hpbGQge1xuICAgIGFsaWduLWl0ZW1zOiBmbGV4LWVuZDtcbiAgfVxuYDtcblxuY29uc3QgVGltZVRpdGxlID0gKHt2YWx1ZSwgaXNFbmxhcmdlZCwgdGltZUZvcm1hdCA9IGRlZmF1bHRUaW1lRm9ybWF0fSkgPT4gKFxuICA8VGltZVZhbHVlV3JhcHBlciBpc0VubGFyZ2VkPXtpc0VubGFyZ2VkfT5cbiAgICA8VGltZVZhbHVlIGtleT17MH0gdmFsdWU9e21vbWVudC51dGModmFsdWVbMF0pLmZvcm1hdCh0aW1lRm9ybWF0KX0gc3BsaXQ9eyFpc0VubGFyZ2VkfS8+XG4gICAge2lzRW5sYXJnZWQgPyAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImhvcml6b250YWwtYmFyXCI+XG4gICAgICAgIDxNaW51cyBoZWlnaHQ9XCIxMnB4XCIvPlxuICAgICAgPC9kaXY+XG4gICAgKSA6IG51bGx9XG4gICAgPFRpbWVWYWx1ZSBrZXk9ezF9IHZhbHVlPXttb21lbnQudXRjKHZhbHVlWzBdKS5mb3JtYXQodGltZUZvcm1hdCl9IHNwbGl0PXshaXNFbmxhcmdlZH0vPlxuICA8L1RpbWVWYWx1ZVdyYXBwZXI+XG4pO1xuXG5jb25zdCBUaW1lVmFsdWUgPSAoe3ZhbHVlLCBzcGxpdH0pID0+IChcbiAgLy8gcmVuZGVyIHR3byBsaW5lcyBpZiBub3QgZW5sYXJnZWRcbiAgPGRpdiBjbGFzc05hbWU9XCJ0aW1lLXZhbHVlXCI+XG4gICAge3NwbGl0ID8gdmFsdWUuc3BsaXQoJyAnKS5tYXAoKHYsIGkpID0+IChcbiAgICAgIDxkaXYga2V5PXtpfT5cbiAgICAgICAge2kgPT09IDAgPyA8U2VsZWN0VGV4dD57dn08L1NlbGVjdFRleHQ+IDpcbiAgICAgICAgPFNlbGVjdFRleHRCb2xkPnt2fTwvU2VsZWN0VGV4dEJvbGQ+fVxuICAgICAgPC9kaXY+XG4gICAgKSkgOiA8U2VsZWN0VGV4dEJvbGQ+e3ZhbHVlfTwvU2VsZWN0VGV4dEJvbGQ+fVxuICA8L2Rpdj5cbik7XG5cbmNvbnN0IFN0eWxlZEFuaW1hdGlvbkNvbnRyb2xzID0gc3R5bGVkLmRpdmBcbiAgbWFyZ2luLWJvdHRvbTogMTJweDtcbiAgbWFyZ2luLXJpZ2h0OiA0MnB4O1xuICBcbiAgJi5kaXNhYmxlZCB7XG4gICAgb3BhY2l0eTogMC40O1xuICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICB9XG5gO1xuXG5jb25zdCBJY29uQnV0dG9uID0gQnV0dG9uLmV4dGVuZGBcbiAgc3ZnIHtcbiAgICBtYXJnaW46IDAgNnB4O1xuICB9XG5gO1xuXG5jb25zdCBBbmltYXRpb25Db250cm9scyA9ICh7XG4gIGlzQW5pbWF0YWJsZSxcbiAgaXNBbmltYXRpbmcsXG4gIHBhdXNlQW5pbWF0aW9uLFxuICByZXNldEFuaW1hdGlvbixcbiAgc3RhcnRBbmltYXRpb25cbn0pID0+IChcbiAgPFN0eWxlZEFuaW1hdGlvbkNvbnRyb2xzXG4gICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCd0aW1lLXJhbmdlLXNsaWRlcl9fY29udHJvbCcsIHtkaXNhYmxlZDogIWlzQW5pbWF0YWJsZX0pfVxuICA+XG4gICAgPEJ1dHRvbkdyb3VwPlxuICAgICAgPEljb25CdXR0b24gY2xhc3NOYW1lPVwicGxheWJhY2stY29udHJvbC1idXR0b25cIlxuICAgICAgICBvbkNsaWNrPXtyZXNldEFuaW1hdGlvbn0gc2Vjb25kYXJ5PlxuICAgICAgICA8UmVzZXQgaGVpZ2h0PVwiMTJweFwiLz5cbiAgICAgIDwvSWNvbkJ1dHRvbj5cbiAgICAgIDxJY29uQnV0dG9uIGNsYXNzTmFtZT17Y2xhc3NuYW1lcygncGxheWJhY2stY29udHJvbC1idXR0b24nLCB7YWN0aXZlOiBpc0FuaW1hdGluZ30pfVxuICAgICAgICBvbkNsaWNrPXtpc0FuaW1hdGluZyA/IHBhdXNlQW5pbWF0aW9uIDogc3RhcnRBbmltYXRpb259IHNlY29uZGFyeT5cbiAgICAgICAge2lzQW5pbWF0aW5nID8gPFBhdXNlIGhlaWdodD1cIjEycHhcIi8+IDogPFBsYXkgaGVpZ2h0PVwiMTJweFwiLz59XG4gICAgICA8L0ljb25CdXR0b24+XG4gICAgPC9CdXR0b25Hcm91cD5cbiAgPC9TdHlsZWRBbmltYXRpb25Db250cm9scz5cbik7XG5cblRpbWVSYW5nZVNsaWRlci5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG5UaW1lUmFuZ2VTbGlkZXIuZGlzcGxheU5hbWUgPSAnVGltZVJhbmdlU2xpZGVyJztcbiJdfQ==
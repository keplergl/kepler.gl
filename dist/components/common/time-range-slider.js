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

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _class, _temp, _initialiseProps;

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  margin-top: ', ';\n  align-items: flex-end;\n  display: flex;\n  flex-direction: ', ';\n  justify-content: space-between;\n'], ['\n  margin-top: ', ';\n  align-items: flex-end;\n  display: flex;\n  flex-direction: ', ';\n  justify-content: space-between;\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: flex;\n  height: ', ';\n  align-items: center;\n  font-size: 11px;\n  justify-content: ', ';\n  color: ', ';\n  \n  .horizontal-bar {\n    padding: 0 12px;\n  }\n  \n  .time-value {\n    display: flex;\n    flex-direction: ', ';\n    align-items: flex-start;\n  }\n  \n  .time-value:last-child {\n    align-items: flex-end;\n  }\n'], ['\n  display: flex;\n  height: ', ';\n  align-items: center;\n  font-size: 11px;\n  justify-content: ', ';\n  color: ', ';\n  \n  .horizontal-bar {\n    padding: 0 12px;\n  }\n  \n  .time-value {\n    display: flex;\n    flex-direction: ', ';\n    align-items: flex-start;\n  }\n  \n  .time-value:last-child {\n    align-items: flex-end;\n  }\n']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  margin-bottom: 12px;\n  &.disabled {\n    opacity: 0.4;\n    pointer-events: none;\n  }\n'], ['\n  margin-bottom: 12px;\n  &.disabled {\n    opacity: 0.4;\n    pointer-events: none;\n  }\n']),
    _templateObject4 = (0, _taggedTemplateLiteralLoose3.default)(['\n  svg {\n    margin: 0 6px;\n  }\n'], ['\n  svg {\n    margin: 0 6px;\n  }\n']);

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
}, function (props) {
  return props.isEnlarged ? 'row' : 'column';
});

var TimeRangeSlider = (_temp = _class = function (_Component) {
  (0, _inherits3.default)(TimeRangeSlider, _Component);

  function TimeRangeSlider(props) {
    (0, _classCallCheck3.default)(this, TimeRangeSlider);

    var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props));

    _initialiseProps.call(_this);

    _this.state = {
      isAnimating: false,
      width: 288
    };
    _this._animation = null;
    // this._baseSpeed = 60;
    // this._animationSpeed = this._baseSpeed;
    _this._sliderThrottle = (0, _lodash2.default)(_this.props.onChange, 20);
    return _this;
  }

  TimeRangeSlider.prototype.componentDidMount = function componentDidMount() {
    this._resize();
  };

  TimeRangeSlider.prototype.componentDidUpdate = function componentDidUpdate() {
    if (!this._animation && this.state.isAnimating) {
      this._animation = (0, _window.requestAnimationFrame)(this._nextFrame);
    }
    this._resize();
  };

  TimeRangeSlider.prototype._resize = function _resize() {
    var width = this.sliderContainer.offsetWidth;
    if (width !== this.state.width) {
      this.setState({ width: width });
    }
  };

  TimeRangeSlider.prototype.render = function render() {
    var _this2 = this;

    var _props = this.props,
        domain = _props.domain,
        value = _props.value,
        isEnlarged = _props.isEnlarged;
    var _state = this.state,
        width = _state.width,
        isAnimating = _state.isAnimating;

    var controlWidth = 130;

    var sliderWidth = isEnlarged ? width - controlWidth : width;

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
          isEnlarged: isEnlarged,
          innerRef: function innerRef(comp) {
            return _this2.sliderContainer = comp;
          } },
        isEnlarged ? _react2.default.createElement(AnimationControls, {
          isAnimatable: this.props.isAnimatable,
          isEnlarged: isEnlarged,
          isAnimating: isAnimating,
          pauseAnimation: this._pauseAnimation,
          resetAnimation: this._resetAnimation,
          startAnimation: this._startAnimation
        }) : null,
        _react2.default.createElement(_rangeSlider2.default, {
          minValue: domain[0],
          maxValue: domain[1],
          value0: value[0],
          value1: value[1],
          histogram: this.props.histogram,
          lineChart: this.props.lineChart,
          plotType: this.props.plotType,
          isRanged: true,
          isEnlarged: isEnlarged,
          showInput: false,
          step: this.props.step,
          onChange: this._sliderUpdate,
          width: sliderWidth,
          xAxis: _react2.default.createElement(_timeSliderMarker2.default, { width: sliderWidth, domain: domain })
        })
      )
    );
  };

  return TimeRangeSlider;
}(_react.Component), _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.domainSelector = function (props) {
    return props.domain;
  };

  this.titleFormatter = (0, _reselect.createSelector)(this.domainSelector, function (domain) {
    return (0, _filterUtils.getTimeWidgetTitleFormatter)(domain);
  });

  this._sliderUpdate = function (args) {
    _this3._sliderThrottle.cancel();
    _this3._sliderThrottle(args);
  };

  this._resetAnimation = function () {
    var _props2 = _this3.props,
        domain = _props2.domain,
        value = _props2.value;

    var value0 = domain[0];
    var value1 = value0 + value[1] - value[0];
    _this3.props.onChange([value0, value1]);
  };

  this._startAnimation = function () {
    _this3._pauseAnimation();
    _this3.props.toggleAnimation();
    _this3.setState({ isAnimating: true });
  };

  this._pauseAnimation = function () {
    if (_this3._animation) {
      (0, _window.cancelAnimationFrame)(_this3._animation);
      _this3.props.toggleAnimation();
      _this3._animation = null;
    }
    _this3.setState({ isAnimating: false });
  };

  this._nextFrame = function () {
    _this3._animation = null;

    var _props3 = _this3.props,
        domain = _props3.domain,
        value = _props3.value;

    console.log(_this3.props.speed);
    var speed = (domain[1] - domain[0]) / _filterUtils.BASE_SPEED * _this3.props.speed;

    // loop when reaches the end
    var value0 = value[1] + speed > domain[1] ? domain[0] : value[0] + speed;
    var value1 = value0 + value[1] - value[0];
    _this3.props.onChange([value0, value1]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi90aW1lLXJhbmdlLXNsaWRlci5qcyJdLCJuYW1lcyI6WyJwcm9wVHlwZXMiLCJvbkNoYW5nZSIsImZ1bmMiLCJpc1JlcXVpcmVkIiwiZG9tYWluIiwiYXJyYXkiLCJ2YWx1ZSIsInN0ZXAiLCJudW1iZXIiLCJwbG90VHlwZSIsInN0cmluZyIsImhpc3RvZ3JhbSIsImxpbmVDaGFydCIsIm9iamVjdCIsInRvZ2dsZUFuaW1hdGlvbiIsImlzQW5pbWF0YWJsZSIsImJvb2wiLCJpc0VubGFyZ2VkIiwic3BlZWQiLCJkZWZhdWx0VGltZUZvcm1hdCIsInV0YyIsInZhbCIsImZvcm1hdCIsIlN0eWxlZFNsaWRlckNvbnRhaW5lciIsImRpdiIsInByb3BzIiwiVGltZVJhbmdlU2xpZGVyIiwic3RhdGUiLCJpc0FuaW1hdGluZyIsIndpZHRoIiwiX2FuaW1hdGlvbiIsIl9zbGlkZXJUaHJvdHRsZSIsImNvbXBvbmVudERpZE1vdW50IiwiX3Jlc2l6ZSIsImNvbXBvbmVudERpZFVwZGF0ZSIsIl9uZXh0RnJhbWUiLCJzbGlkZXJDb250YWluZXIiLCJvZmZzZXRXaWR0aCIsInNldFN0YXRlIiwicmVuZGVyIiwiY29udHJvbFdpZHRoIiwic2xpZGVyV2lkdGgiLCJ0aXRsZUZvcm1hdHRlciIsImNvbXAiLCJfcGF1c2VBbmltYXRpb24iLCJfcmVzZXRBbmltYXRpb24iLCJfc3RhcnRBbmltYXRpb24iLCJfc2xpZGVyVXBkYXRlIiwiZG9tYWluU2VsZWN0b3IiLCJjYW5jZWwiLCJhcmdzIiwidmFsdWUwIiwidmFsdWUxIiwiY29uc29sZSIsImxvZyIsIlRpbWVWYWx1ZVdyYXBwZXIiLCJ0aGVtZSIsInNlY29uZGFyeUlucHV0SGVpZ2h0IiwibGFiZWxDb2xvciIsIlRpbWVUaXRsZSIsInRpbWVGb3JtYXQiLCJUaW1lVmFsdWUiLCJzcGxpdCIsIm1hcCIsInYiLCJpIiwiU3R5bGVkQW5pbWF0aW9uQ29udHJvbHMiLCJJY29uQnV0dG9uIiwiZXh0ZW5kIiwiQW5pbWF0aW9uQ29udHJvbHMiLCJwYXVzZUFuaW1hdGlvbiIsInJlc2V0QW5pbWF0aW9uIiwic3RhcnRBbmltYXRpb24iLCJkaXNhYmxlZCIsImFjdGl2ZSIsImRpc3BsYXlOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxZQUFZO0FBQ2hCQyxZQUFVLG9CQUFVQyxJQUFWLENBQWVDLFVBRFQ7QUFFaEJDLFVBQVEsb0JBQVVDLEtBQVYsQ0FBZ0JGLFVBRlI7QUFHaEJHLFNBQU8sb0JBQVVELEtBQVYsQ0FBZ0JGLFVBSFA7QUFJaEJJLFFBQU0sb0JBQVVDLE1BQVYsQ0FBaUJMLFVBSlA7QUFLaEJNLFlBQVUsb0JBQVVDLE1BTEo7QUFNaEJDLGFBQVcsb0JBQVVOLEtBTkw7QUFPaEJPLGFBQVcsb0JBQVVDLE1BUEw7QUFRaEJDLG1CQUFpQixvQkFBVVosSUFBVixDQUFlQyxVQVJoQjtBQVNoQlksZ0JBQWMsb0JBQVVDLElBVFI7QUFVaEJDLGNBQVksb0JBQVVELElBVk47QUFXaEJFLFNBQU8sb0JBQVVWO0FBWEQsQ0FBbEI7O0FBY0EsSUFBTVcsb0JBQW9CLFNBQXBCQSxpQkFBb0I7QUFBQSxTQUFPLGlCQUFPQyxHQUFQLENBQVdDLEdBQVgsRUFBZ0JDLE1BQWhCLENBQXVCLGlCQUF2QixDQUFQO0FBQUEsQ0FBMUI7O0FBRUEsSUFBTUMsd0JBQXdCLDJCQUFPQyxHQUEvQixrQkFDVTtBQUFBLFNBQVNDLE1BQU1SLFVBQU4sR0FBbUIsTUFBbkIsR0FBNEIsS0FBckM7QUFBQSxDQURWLEVBSWM7QUFBQSxTQUFTUSxNQUFNUixVQUFOLEdBQW1CLEtBQW5CLEdBQTJCLFFBQXBDO0FBQUEsQ0FKZCxDQUFOOztJQVFxQlMsZTs7O0FBQ25CLDJC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SndCO0FBQUEsTUFLeEJDLGNBTHdCLFNBS3hCQSxjQUx3QjtBQUFBLFNBT3hCO0FBQUMsMkJBQUQ7QUFBQTtBQUNFLGlCQUFXLDBCQUFXLDRCQUFYLEVBQXlDLEVBQUNDLFVBQVUsQ0FBQzFELFlBQVosRUFBekM7QUFEYjtBQUdFO0FBQUE7QUFBQTtBQUNFO0FBQUMsa0JBQUQ7QUFBQSxVQUFZLFdBQVUseUJBQXRCO0FBQ0UsbUJBQVN3RCxjQURYLEVBQzJCLGVBRDNCO0FBRUUsc0RBQU8sUUFBTyxNQUFkO0FBRkYsT0FERjtBQUtFO0FBQUMsa0JBQUQ7QUFBQSxVQUFZLFdBQVcsMEJBQVcseUJBQVgsRUFBc0MsRUFBQ0csUUFBUTlDLFdBQVQsRUFBdEMsQ0FBdkI7QUFDRSxtQkFBU0EsY0FBYzBDLGNBQWQsR0FBK0JFLGNBRDFDLEVBQzBELGVBRDFEO0FBRUc1QyxzQkFBYyw4Q0FBTyxRQUFPLE1BQWQsR0FBZCxHQUF1Qyw2Q0FBTSxRQUFPLE1BQWI7QUFGMUM7QUFMRjtBQUhGLEdBUHdCO0FBQUEsQ0FBMUI7O0FBdUJBRixnQkFBZ0IxQixTQUFoQixHQUE0QkEsU0FBNUI7QUFDQTBCLGdCQUFnQmlELFdBQWhCLEdBQThCLGlCQUE5QiIsImZpbGUiOiJ0aW1lLXJhbmdlLXNsaWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7cmVxdWVzdEFuaW1hdGlvbkZyYW1lLCBjYW5jZWxBbmltYXRpb25GcmFtZX0gZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCB0aHJvdHRsZSBmcm9tICdsb2Rhc2gudGhyb3R0bGUnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5pbXBvcnQge1BsYXksIFJlc2V0LCBQYXVzZSwgTWludXN9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcbmltcG9ydCB7U2VsZWN0VGV4dEJvbGQsIFNlbGVjdFRleHQsIEJ1dHRvbiwgQnV0dG9uR3JvdXB9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7Z2V0VGltZVdpZGdldFRpdGxlRm9ybWF0dGVyLCBCQVNFX1NQRUVEfSBmcm9tICd1dGlscy9maWx0ZXItdXRpbHMnO1xuaW1wb3J0IFJhbmdlU2xpZGVyIGZyb20gJy4vcmFuZ2Utc2xpZGVyJztcbmltcG9ydCBUaW1lU2xpZGVyTWFya2VyIGZyb20gJy4vdGltZS1zbGlkZXItbWFya2VyJztcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgZG9tYWluOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgdmFsdWU6IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICBzdGVwOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIHBsb3RUeXBlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBoaXN0b2dyYW06IFByb3BUeXBlcy5hcnJheSxcbiAgbGluZUNoYXJ0OiBQcm9wVHlwZXMub2JqZWN0LFxuICB0b2dnbGVBbmltYXRpb246IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGlzQW5pbWF0YWJsZTogUHJvcFR5cGVzLmJvb2wsXG4gIGlzRW5sYXJnZWQ6IFByb3BUeXBlcy5ib29sLFxuICBzcGVlZDogUHJvcFR5cGVzLm51bWJlclxufTtcblxuY29uc3QgZGVmYXVsdFRpbWVGb3JtYXQgPSB2YWwgPT4gbW9tZW50LnV0Yyh2YWwpLmZvcm1hdCgnTU0vREQvWVkgaGg6bW1hJyk7XG5cbmNvbnN0IFN0eWxlZFNsaWRlckNvbnRhaW5lciA9IHN0eWxlZC5kaXZgXG4gIG1hcmdpbi10b3A6ICR7cHJvcHMgPT4gcHJvcHMuaXNFbmxhcmdlZCA/ICcxMnB4JyA6ICcwcHgnfTtcbiAgYWxpZ24taXRlbXM6IGZsZXgtZW5kO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogJHtwcm9wcyA9PiBwcm9wcy5pc0VubGFyZ2VkID8gJ3JvdycgOiAnY29sdW1uJ307XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbmA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVSYW5nZVNsaWRlciBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBpc0FuaW1hdGluZzogZmFsc2UsXG4gICAgICB3aWR0aDogMjg4XG4gICAgfTtcbiAgICB0aGlzLl9hbmltYXRpb24gPSBudWxsO1xuICAgIC8vIHRoaXMuX2Jhc2VTcGVlZCA9IDYwO1xuICAgIC8vIHRoaXMuX2FuaW1hdGlvblNwZWVkID0gdGhpcy5fYmFzZVNwZWVkO1xuICAgIHRoaXMuX3NsaWRlclRocm90dGxlID0gdGhyb3R0bGUodGhpcy5wcm9wcy5vbkNoYW5nZSwgMjApO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5fcmVzaXplKCk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgaWYgKCF0aGlzLl9hbmltYXRpb24gJiYgdGhpcy5zdGF0ZS5pc0FuaW1hdGluZykge1xuICAgICAgdGhpcy5fYW5pbWF0aW9uID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuX25leHRGcmFtZSk7XG4gICAgfVxuICAgIHRoaXMuX3Jlc2l6ZSgpO1xuICB9XG5cbiAgZG9tYWluU2VsZWN0b3IgPSBwcm9wcyA9PiBwcm9wcy5kb21haW47XG4gIHRpdGxlRm9ybWF0dGVyID0gY3JlYXRlU2VsZWN0b3IodGhpcy5kb21haW5TZWxlY3RvciwgZG9tYWluID0+XG4gICAgZ2V0VGltZVdpZGdldFRpdGxlRm9ybWF0dGVyKGRvbWFpbilcbiAgKTtcblxuICBfc2xpZGVyVXBkYXRlID0gYXJncyA9PiB7XG4gICAgdGhpcy5fc2xpZGVyVGhyb3R0bGUuY2FuY2VsKCk7XG4gICAgdGhpcy5fc2xpZGVyVGhyb3R0bGUoYXJncyk7XG4gIH07XG5cbiAgX3Jlc2l6ZSgpIHtcbiAgICBjb25zdCB3aWR0aCA9IHRoaXMuc2xpZGVyQ29udGFpbmVyLm9mZnNldFdpZHRoO1xuICAgIGlmICh3aWR0aCAhPT0gdGhpcy5zdGF0ZS53aWR0aCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7d2lkdGh9KTtcbiAgICB9XG4gIH1cbiAgX3Jlc2V0QW5pbWF0aW9uID0gKCkgPT4ge1xuICAgIGNvbnN0IHtkb21haW4sIHZhbHVlfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgdmFsdWUwID0gZG9tYWluWzBdO1xuICAgIGNvbnN0IHZhbHVlMSA9IHZhbHVlMCArIHZhbHVlWzFdIC0gdmFsdWVbMF07XG4gICAgdGhpcy5wcm9wcy5vbkNoYW5nZShbdmFsdWUwLCB2YWx1ZTFdKTtcbiAgfTtcblxuICBfc3RhcnRBbmltYXRpb24gPSAoKSA9PiB7XG4gICAgdGhpcy5fcGF1c2VBbmltYXRpb24oKTtcbiAgICB0aGlzLnByb3BzLnRvZ2dsZUFuaW1hdGlvbigpO1xuICAgIHRoaXMuc2V0U3RhdGUoe2lzQW5pbWF0aW5nOiB0cnVlfSk7XG4gIH07XG5cbiAgX3BhdXNlQW5pbWF0aW9uID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLl9hbmltYXRpb24pIHtcbiAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuX2FuaW1hdGlvbik7XG4gICAgICB0aGlzLnByb3BzLnRvZ2dsZUFuaW1hdGlvbigpO1xuICAgICAgdGhpcy5fYW5pbWF0aW9uID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7aXNBbmltYXRpbmc6IGZhbHNlfSk7XG4gIH07XG5cbiAgX25leHRGcmFtZSA9ICgpID0+IHtcbiAgICB0aGlzLl9hbmltYXRpb24gPSBudWxsO1xuXG4gICAgY29uc3Qge2RvbWFpbiwgdmFsdWV9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zb2xlLmxvZyh0aGlzLnByb3BzLnNwZWVkKTtcbiAgICBjb25zdCBzcGVlZCA9ICgoZG9tYWluWzFdIC0gZG9tYWluWzBdKSAvIEJBU0VfU1BFRUQpICogdGhpcy5wcm9wcy5zcGVlZDtcblxuICAgIC8vIGxvb3Agd2hlbiByZWFjaGVzIHRoZSBlbmRcbiAgICBjb25zdCB2YWx1ZTAgPSB2YWx1ZVsxXSArIHNwZWVkID4gZG9tYWluWzFdID8gZG9tYWluWzBdIDogdmFsdWVbMF0gKyBzcGVlZDtcbiAgICBjb25zdCB2YWx1ZTEgPSB2YWx1ZTAgKyB2YWx1ZVsxXSAtIHZhbHVlWzBdO1xuICAgIHRoaXMucHJvcHMub25DaGFuZ2UoW3ZhbHVlMCwgdmFsdWUxXSk7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtkb21haW4sIHZhbHVlLCBpc0VubGFyZ2VkfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge3dpZHRoLCBpc0FuaW1hdGluZ30gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IGNvbnRyb2xXaWR0aCA9IDEzMDtcblxuICAgIGNvbnN0IHNsaWRlcldpZHRoID0gaXNFbmxhcmdlZCA/IHdpZHRoIC0gY29udHJvbFdpZHRoIDogd2lkdGg7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aW1lLXJhbmdlLXNsaWRlclwiPlxuICAgICAgICA8VGltZVRpdGxlXG4gICAgICAgICAgdGltZUZvcm1hdD17dGhpcy50aXRsZUZvcm1hdHRlcih0aGlzLnByb3BzKX1cbiAgICAgICAgICB2YWx1ZT17dmFsdWV9XG4gICAgICAgICAgaXNFbmxhcmdlZD17aXNFbmxhcmdlZH1cbiAgICAgICAgLz5cbiAgICAgICAgPFN0eWxlZFNsaWRlckNvbnRhaW5lclxuICAgICAgICAgIGNsYXNzTmFtZT1cInRpbWUtcmFuZ2Utc2xpZGVyX19jb250YWluZXJcIlxuICAgICAgICAgIGlzRW5sYXJnZWQ9e2lzRW5sYXJnZWR9XG4gICAgICAgICAgaW5uZXJSZWY9e2NvbXAgPT4gdGhpcy5zbGlkZXJDb250YWluZXIgPSBjb21wfT5cbiAgICAgICAgICB7aXNFbmxhcmdlZCA/IDxBbmltYXRpb25Db250cm9sc1xuICAgICAgICAgICAgaXNBbmltYXRhYmxlPXt0aGlzLnByb3BzLmlzQW5pbWF0YWJsZX1cbiAgICAgICAgICAgIGlzRW5sYXJnZWQ9e2lzRW5sYXJnZWR9XG4gICAgICAgICAgICBpc0FuaW1hdGluZz17aXNBbmltYXRpbmd9XG4gICAgICAgICAgICBwYXVzZUFuaW1hdGlvbj17dGhpcy5fcGF1c2VBbmltYXRpb259XG4gICAgICAgICAgICByZXNldEFuaW1hdGlvbj17dGhpcy5fcmVzZXRBbmltYXRpb259XG4gICAgICAgICAgICBzdGFydEFuaW1hdGlvbj17dGhpcy5fc3RhcnRBbmltYXRpb259XG4gICAgICAgICAgLz4gOiBudWxsfVxuICAgICAgICAgIDxSYW5nZVNsaWRlclxuICAgICAgICAgICAgbWluVmFsdWU9e2RvbWFpblswXX1cbiAgICAgICAgICAgIG1heFZhbHVlPXtkb21haW5bMV19XG4gICAgICAgICAgICB2YWx1ZTA9e3ZhbHVlWzBdfVxuICAgICAgICAgICAgdmFsdWUxPXt2YWx1ZVsxXX1cbiAgICAgICAgICAgIGhpc3RvZ3JhbT17dGhpcy5wcm9wcy5oaXN0b2dyYW19XG4gICAgICAgICAgICBsaW5lQ2hhcnQ9e3RoaXMucHJvcHMubGluZUNoYXJ0fVxuICAgICAgICAgICAgcGxvdFR5cGU9e3RoaXMucHJvcHMucGxvdFR5cGV9XG4gICAgICAgICAgICBpc1JhbmdlZD17dHJ1ZX1cbiAgICAgICAgICAgIGlzRW5sYXJnZWQ9e2lzRW5sYXJnZWR9XG4gICAgICAgICAgICBzaG93SW5wdXQ9e2ZhbHNlfVxuICAgICAgICAgICAgc3RlcD17dGhpcy5wcm9wcy5zdGVwfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuX3NsaWRlclVwZGF0ZX1cbiAgICAgICAgICAgIHdpZHRoPXtzbGlkZXJXaWR0aH1cbiAgICAgICAgICAgIHhBeGlzPXtcbiAgICAgICAgICAgICAgPFRpbWVTbGlkZXJNYXJrZXIgd2lkdGg9e3NsaWRlcldpZHRofSBkb21haW49e2RvbWFpbn0gLz5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1N0eWxlZFNsaWRlckNvbnRhaW5lcj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuY29uc3QgVGltZVZhbHVlV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGhlaWdodDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWNvbmRhcnlJbnB1dEhlaWdodH07XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGZvbnQtc2l6ZTogMTFweDtcbiAganVzdGlmeS1jb250ZW50OiAke3Byb3BzID0+IHByb3BzLmlzRW5sYXJnZWQgPyAnY2VudGVyJyA6ICdzcGFjZS1iZXR3ZWVuJ307XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmxhYmVsQ29sb3J9O1xuICBcbiAgLmhvcml6b250YWwtYmFyIHtcbiAgICBwYWRkaW5nOiAwIDEycHg7XG4gIH1cbiAgXG4gIC50aW1lLXZhbHVlIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiAke3Byb3BzID0+IHByb3BzLmlzRW5sYXJnZWQgPyAncm93JyA6ICdjb2x1bW4nfTtcbiAgICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAgfVxuICBcbiAgLnRpbWUtdmFsdWU6bGFzdC1jaGlsZCB7XG4gICAgYWxpZ24taXRlbXM6IGZsZXgtZW5kO1xuICB9XG5gO1xuXG5jb25zdCBUaW1lVGl0bGUgPSAoe3ZhbHVlLCBpc0VubGFyZ2VkLCB0aW1lRm9ybWF0ID0gZGVmYXVsdFRpbWVGb3JtYXR9KSA9PiAoXG4gIDxUaW1lVmFsdWVXcmFwcGVyIGlzRW5sYXJnZWQ9e2lzRW5sYXJnZWR9PlxuICAgIDxUaW1lVmFsdWUga2V5PXswfSB2YWx1ZT17bW9tZW50LnV0Yyh2YWx1ZVswXSkuZm9ybWF0KHRpbWVGb3JtYXQpfSBzcGxpdD17IWlzRW5sYXJnZWR9Lz5cbiAgICB7aXNFbmxhcmdlZCA/IChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaG9yaXpvbnRhbC1iYXJcIj5cbiAgICAgICAgPE1pbnVzIGhlaWdodD1cIjEycHhcIi8+XG4gICAgICA8L2Rpdj5cbiAgICApIDogbnVsbH1cbiAgICA8VGltZVZhbHVlIGtleT17MX0gdmFsdWU9e21vbWVudC51dGModmFsdWVbMF0pLmZvcm1hdCh0aW1lRm9ybWF0KX0gc3BsaXQ9eyFpc0VubGFyZ2VkfS8+XG4gIDwvVGltZVZhbHVlV3JhcHBlcj5cbik7XG5cbmNvbnN0IFRpbWVWYWx1ZSA9ICh7dmFsdWUsIHNwbGl0fSkgPT4gKFxuICAvLyByZW5kZXIgdHdvIGxpbmVzIGlmIG5vdCBlbmxhcmdlZFxuICA8ZGl2IGNsYXNzTmFtZT1cInRpbWUtdmFsdWVcIj5cbiAgICB7c3BsaXQgPyB2YWx1ZS5zcGxpdCgnICcpLm1hcCgodiwgaSkgPT4gKFxuICAgICAgPGRpdiBrZXk9e2l9PlxuICAgICAgICB7aSA9PT0gMCA/IDxTZWxlY3RUZXh0Pnt2fTwvU2VsZWN0VGV4dD4gOlxuICAgICAgICA8U2VsZWN0VGV4dEJvbGQ+e3Z9PC9TZWxlY3RUZXh0Qm9sZD59XG4gICAgICA8L2Rpdj5cbiAgICApKSA6IDxTZWxlY3RUZXh0Qm9sZD57dmFsdWV9PC9TZWxlY3RUZXh0Qm9sZD59XG4gIDwvZGl2PlxuKTtcblxuY29uc3QgU3R5bGVkQW5pbWF0aW9uQ29udHJvbHMgPSBzdHlsZWQuZGl2YFxuICBtYXJnaW4tYm90dG9tOiAxMnB4O1xuICAmLmRpc2FibGVkIHtcbiAgICBvcGFjaXR5OiAwLjQ7XG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIH1cbmA7XG5cbmNvbnN0IEljb25CdXR0b24gPSBCdXR0b24uZXh0ZW5kYFxuICBzdmcge1xuICAgIG1hcmdpbjogMCA2cHg7XG4gIH1cbmA7XG5cbmNvbnN0IEFuaW1hdGlvbkNvbnRyb2xzID0gKHtcbiAgaXNBbmltYXRhYmxlLFxuICBpc0FuaW1hdGluZyxcbiAgcGF1c2VBbmltYXRpb24sXG4gIHJlc2V0QW5pbWF0aW9uLFxuICBzdGFydEFuaW1hdGlvblxufSkgPT4gKFxuICA8U3R5bGVkQW5pbWF0aW9uQ29udHJvbHNcbiAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ3RpbWUtcmFuZ2Utc2xpZGVyX19jb250cm9sJywge2Rpc2FibGVkOiAhaXNBbmltYXRhYmxlfSl9XG4gID5cbiAgICA8QnV0dG9uR3JvdXA+XG4gICAgICA8SWNvbkJ1dHRvbiBjbGFzc05hbWU9XCJwbGF5YmFjay1jb250cm9sLWJ1dHRvblwiXG4gICAgICAgIG9uQ2xpY2s9e3Jlc2V0QW5pbWF0aW9ufSBzZWNvbmRhcnk+XG4gICAgICAgIDxSZXNldCBoZWlnaHQ9XCIxMnB4XCIvPlxuICAgICAgPC9JY29uQnV0dG9uPlxuICAgICAgPEljb25CdXR0b24gY2xhc3NOYW1lPXtjbGFzc25hbWVzKCdwbGF5YmFjay1jb250cm9sLWJ1dHRvbicsIHthY3RpdmU6IGlzQW5pbWF0aW5nfSl9XG4gICAgICAgIG9uQ2xpY2s9e2lzQW5pbWF0aW5nID8gcGF1c2VBbmltYXRpb24gOiBzdGFydEFuaW1hdGlvbn0gc2Vjb25kYXJ5PlxuICAgICAgICB7aXNBbmltYXRpbmcgPyA8UGF1c2UgaGVpZ2h0PVwiMTJweFwiLz4gOiA8UGxheSBoZWlnaHQ9XCIxMnB4XCIvPn1cbiAgICAgIDwvSWNvbkJ1dHRvbj5cbiAgICA8L0J1dHRvbkdyb3VwPlxuICA8L1N0eWxlZEFuaW1hdGlvbkNvbnRyb2xzPlxuKTtcblxuVGltZVJhbmdlU2xpZGVyLnByb3BUeXBlcyA9IHByb3BUeXBlcztcblRpbWVSYW5nZVNsaWRlci5kaXNwbGF5TmFtZSA9ICdUaW1lUmFuZ2VTbGlkZXInO1xuIl19
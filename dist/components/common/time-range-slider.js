'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _class, _temp, _initialiseProps;

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: flex;\n  font-size: 11px;\n  justify-content: ', ';\n  .horizontal-bar {\n    padding: 0 6px;\n  }\n'], ['\n  display: flex;\n  font-size: 11px;\n  justify-content: ', ';\n  .horizontal-bar {\n    padding: 0 6px;\n  }\n']);

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
  isEnlarged: _propTypes2.default.bool
};

var defaultTimeFormat = function defaultTimeFormat(val) {
  return _moment2.default.utc(val).format('MM/DD/YY hh:mma');
};

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
    _this._animationSpeed = 120;
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
    var width = this.props.isEnlarged ? this.refs.sliderContainer.offsetWidth : 288;
    if (width !== this.state.width) {
      this.setState({ width: width });
    }
  };

  TimeRangeSlider.prototype.render = function render() {
    var _props = this.props,
        domain = _props.domain,
        value = _props.value,
        isEnlarged = _props.isEnlarged;
    var _state = this.state,
        width = _state.width,
        isAnimating = _state.isAnimating;

    var controlWidth = 130;

    var sliderWidth = isEnlarged ? width - controlWidth : width;

    var style = {
      marginTop: isEnlarged ? '12px' : '0px',
      alignItems: 'center',
      display: 'flex',
      flexDirection: isEnlarged ? 'row' : 'column',
      justifyContent: 'space-between'
    };

    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(TimeTitle, {
        timeFormat: this.titleFormatter(this.props),
        value: value,
        isEnlarged: isEnlarged
      }),
      _react2.default.createElement(
        'div',
        { ref: 'sliderContainer', style: style },
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
        }),
        _react2.default.createElement(AnimationControls, {
          isAnimatable: this.props.isAnimatable,
          isEnlarged: isEnlarged,
          isAnimating: isAnimating,
          reduceAnimationSpeed: this._reduceAnimationSpeed,
          pauseAnimation: this._pauseAnimation,
          startAnimation: this._startAnimation,
          increaseAnimationSpeed: this._increaseAnimationSpeed
        })
      )
    );
  };

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

  this._increaseAnimationSpeed = function () {
    _this2._animationSpeed = Math.round(_this2._animationSpeed * Math.pow(0.75, 1));
  };

  this._reduceAnimationSpeed = function () {
    _this2._animationSpeed = Math.round(_this2._animationSpeed * Math.pow(0.75, -1));
  };

  this._nextFrame = function () {
    _this2._animation = null;

    var _props2 = _this2.props,
        domain = _props2.domain,
        value = _props2.value;

    var speed = (domain[1] - domain[0]) / _this2._animationSpeed;

    // loop when reaches the end
    var value0 = value[1] + speed > domain[1] ? domain[0] : value[0] + speed;
    var value1 = value0 + value[1] - value[0];
    _this2.props.onChange([value0, value1]);
  };
}, _temp);
exports.default = TimeRangeSlider;


var TimeValueWrapper = _styledComponents2.default.div(_templateObject, function (props) {
  return props.isEnlarged ? 'center' : 'space-between';
});

var TimeTitle = function TimeTitle(_ref) {
  var value = _ref.value,
      isEnlarged = _ref.isEnlarged,
      _ref$timeFormat = _ref.timeFormat,
      timeFormat = _ref$timeFormat === undefined ? defaultTimeFormat : _ref$timeFormat;
  return _react2.default.createElement(
    TimeValueWrapper,
    { isEnlarged: isEnlarged },
    _react2.default.createElement(TimeValue, { key: 0, value: _moment2.default.utc(value[0]).format(timeFormat) }),
    isEnlarged ? _react2.default.createElement(
      'div',
      { className: 'horizontal-bar' },
      _react2.default.createElement(
        _styledComponents3.SelectTextBold,
        null,
        '\u2015'
      )
    ) : null,
    _react2.default.createElement(TimeValue, { key: 1, value: _moment2.default.utc(value[0]).format(timeFormat) })
  );
};

var TimeValue = function TimeValue(_ref2) {
  var value = _ref2.value;
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      _styledComponents3.SelectTextBold,
      null,
      value
    )
  );
};

var AnimationControls = function AnimationControls(_ref3) {
  var isAnimatable = _ref3.isAnimatable,
      isAnimating = _ref3.isAnimating,
      isEnlarged = _ref3.isEnlarged,
      increaseAnimationSpeed = _ref3.increaseAnimationSpeed,
      reduceAnimationSpeed = _ref3.reduceAnimationSpeed,
      pauseAnimation = _ref3.pauseAnimation,
      startAnimation = _ref3.startAnimation;
  return _react2.default.createElement(
    'div',
    {
      className: (0, _classnames2.default)('soft-micro--top', {
        'text--center': !isEnlarged,
        'text--right': isEnlarged
      }),
      style: isAnimatable ? {
        display: 'flex',
        marginTop: isEnlarged ? 0 : 14
      } : {
        opacity: 0.4,
        pointerEvents: 'none'
      }
    },
    _react2.default.createElement(
      _styledComponents3.Button,
      { onClick: reduceAnimationSpeed },
      _react2.default.createElement('i', { className: 'icon icon_previous' })
    ),
    _react2.default.createElement(
      _styledComponents3.Button,
      { size: 'tiny', onClick: isAnimating ? pauseAnimation : startAnimation },
      _react2.default.createElement('i', {
        className: (0, _classnames2.default)({
          'icon icon_pause': isAnimating,
          'icon icon_play': !isAnimating
        })
      })
    ),
    _react2.default.createElement(
      _styledComponents3.Button,
      { onClick: increaseAnimationSpeed },
      _react2.default.createElement('i', { className: 'icon icon_skip' })
    )
  );
};

TimeRangeSlider.propTypes = propTypes;
TimeRangeSlider.displayName = 'TimeRangeSlider';
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi90aW1lLXJhbmdlLXNsaWRlci5qcyJdLCJuYW1lcyI6WyJwcm9wVHlwZXMiLCJvbkNoYW5nZSIsImZ1bmMiLCJpc1JlcXVpcmVkIiwiZG9tYWluIiwiYXJyYXkiLCJ2YWx1ZSIsInN0ZXAiLCJudW1iZXIiLCJwbG90VHlwZSIsInN0cmluZyIsImhpc3RvZ3JhbSIsImxpbmVDaGFydCIsIm9iamVjdCIsInRvZ2dsZUFuaW1hdGlvbiIsImlzQW5pbWF0YWJsZSIsImJvb2wiLCJpc0VubGFyZ2VkIiwiZGVmYXVsdFRpbWVGb3JtYXQiLCJ1dGMiLCJ2YWwiLCJmb3JtYXQiLCJUaW1lUmFuZ2VTbGlkZXIiLCJwcm9wcyIsInN0YXRlIiwiaXNBbmltYXRpbmciLCJ3aWR0aCIsIl9hbmltYXRpb24iLCJfYW5pbWF0aW9uU3BlZWQiLCJfc2xpZGVyVGhyb3R0bGUiLCJjb21wb25lbnREaWRNb3VudCIsIl9yZXNpemUiLCJjb21wb25lbnREaWRVcGRhdGUiLCJfbmV4dEZyYW1lIiwicmVmcyIsInNsaWRlckNvbnRhaW5lciIsIm9mZnNldFdpZHRoIiwic2V0U3RhdGUiLCJyZW5kZXIiLCJjb250cm9sV2lkdGgiLCJzbGlkZXJXaWR0aCIsInN0eWxlIiwibWFyZ2luVG9wIiwiYWxpZ25JdGVtcyIsImRpc3BsYXkiLCJmbGV4RGlyZWN0aW9uIiwianVzdGlmeUNvbnRlbnQiLCJ0aXRsZUZvcm1hdHRlciIsIl9zbGlkZXJVcGRhdGUiLCJfcmVkdWNlQW5pbWF0aW9uU3BlZWQiLCJfcGF1c2VBbmltYXRpb24iLCJfc3RhcnRBbmltYXRpb24iLCJfaW5jcmVhc2VBbmltYXRpb25TcGVlZCIsImRvbWFpblNlbGVjdG9yIiwiY2FuY2VsIiwiYXJncyIsIk1hdGgiLCJyb3VuZCIsInBvdyIsInNwZWVkIiwidmFsdWUwIiwidmFsdWUxIiwiVGltZVZhbHVlV3JhcHBlciIsImRpdiIsIlRpbWVUaXRsZSIsInRpbWVGb3JtYXQiLCJUaW1lVmFsdWUiLCJBbmltYXRpb25Db250cm9scyIsImluY3JlYXNlQW5pbWF0aW9uU3BlZWQiLCJyZWR1Y2VBbmltYXRpb25TcGVlZCIsInBhdXNlQW5pbWF0aW9uIiwic3RhcnRBbmltYXRpb24iLCJvcGFjaXR5IiwicG9pbnRlckV2ZW50cyIsImRpc3BsYXlOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFFQTs7QUFDQTs7QUFFQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxZQUFZO0FBQ2hCQyxZQUFVLG9CQUFVQyxJQUFWLENBQWVDLFVBRFQ7QUFFaEJDLFVBQVEsb0JBQVVDLEtBQVYsQ0FBZ0JGLFVBRlI7QUFHaEJHLFNBQU8sb0JBQVVELEtBQVYsQ0FBZ0JGLFVBSFA7QUFJaEJJLFFBQU0sb0JBQVVDLE1BQVYsQ0FBaUJMLFVBSlA7QUFLaEJNLFlBQVUsb0JBQVVDLE1BTEo7QUFNaEJDLGFBQVcsb0JBQVVOLEtBTkw7QUFPaEJPLGFBQVcsb0JBQVVDLE1BUEw7QUFRaEJDLG1CQUFpQixvQkFBVVosSUFBVixDQUFlQyxVQVJoQjtBQVNoQlksZ0JBQWMsb0JBQVVDLElBVFI7QUFVaEJDLGNBQVksb0JBQVVEO0FBVk4sQ0FBbEI7O0FBYUEsSUFBTUUsb0JBQW9CLFNBQXBCQSxpQkFBb0I7QUFBQSxTQUFPLGlCQUFPQyxHQUFQLENBQVdDLEdBQVgsRUFBZ0JDLE1BQWhCLENBQXVCLGlCQUF2QixDQUFQO0FBQUEsQ0FBMUI7O0lBRXFCQyxlOzs7QUFFbkIsMkJBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSwrREFDakIsc0JBQU1BLEtBQU4sQ0FEaUI7O0FBQUE7O0FBRWpCLFVBQUtDLEtBQUwsR0FBYTtBQUNYQyxtQkFBYSxLQURGO0FBRVhDLGFBQU87QUFGSSxLQUFiO0FBSUEsVUFBS0MsVUFBTCxHQUFrQixJQUFsQjtBQUNBLFVBQUtDLGVBQUws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LENBQTFCOztBQTJDQTlDLGdCQUFnQnRCLFNBQWhCLEdBQTRCQSxTQUE1QjtBQUNBc0IsZ0JBQWdCb0QsV0FBaEIsR0FBOEIsaUJBQTlCIiwiZmlsZSI6InRpbWUtcmFuZ2Utc2xpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHtyZXF1ZXN0QW5pbWF0aW9uRnJhbWUsIGNhbmNlbEFuaW1hdGlvbkZyYW1lfSBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHRocm90dGxlIGZyb20gJ2xvZGFzaC50aHJvdHRsZSc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7Y3JlYXRlU2VsZWN0b3J9IGZyb20gJ3Jlc2VsZWN0JztcblxuaW1wb3J0IHtTZWxlY3RUZXh0Qm9sZCwgQnV0dG9ufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge2dldFRpbWVXaWRnZXRUaXRsZUZvcm1hdHRlcn0gZnJvbSAndXRpbHMvZmlsdGVyLXV0aWxzJztcblxuaW1wb3J0IFJhbmdlU2xpZGVyIGZyb20gJy4vcmFuZ2Utc2xpZGVyJztcbmltcG9ydCBUaW1lU2xpZGVyTWFya2VyIGZyb20gJy4vdGltZS1zbGlkZXItbWFya2VyJztcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgZG9tYWluOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgdmFsdWU6IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICBzdGVwOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIHBsb3RUeXBlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBoaXN0b2dyYW06IFByb3BUeXBlcy5hcnJheSxcbiAgbGluZUNoYXJ0OiBQcm9wVHlwZXMub2JqZWN0LFxuICB0b2dnbGVBbmltYXRpb246IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGlzQW5pbWF0YWJsZTogUHJvcFR5cGVzLmJvb2wsXG4gIGlzRW5sYXJnZWQ6IFByb3BUeXBlcy5ib29sXG59O1xuXG5jb25zdCBkZWZhdWx0VGltZUZvcm1hdCA9IHZhbCA9PiBtb21lbnQudXRjKHZhbCkuZm9ybWF0KCdNTS9ERC9ZWSBoaDptbWEnKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZVJhbmdlU2xpZGVyIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaXNBbmltYXRpbmc6IGZhbHNlLFxuICAgICAgd2lkdGg6IDI4OFxuICAgIH07XG4gICAgdGhpcy5fYW5pbWF0aW9uID0gbnVsbDtcbiAgICB0aGlzLl9hbmltYXRpb25TcGVlZCA9IDEyMDtcbiAgICB0aGlzLl9zbGlkZXJUaHJvdHRsZSA9IHRocm90dGxlKHRoaXMucHJvcHMub25DaGFuZ2UsIDIwKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuX3Jlc2l6ZSgpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgIGlmICghdGhpcy5fYW5pbWF0aW9uICYmIHRoaXMuc3RhdGUuaXNBbmltYXRpbmcpIHtcbiAgICAgIHRoaXMuX2FuaW1hdGlvbiA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl9uZXh0RnJhbWUpO1xuICAgIH1cbiAgICB0aGlzLl9yZXNpemUoKTtcbiAgfVxuXG4gIGRvbWFpblNlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMuZG9tYWluO1xuICB0aXRsZUZvcm1hdHRlciA9IGNyZWF0ZVNlbGVjdG9yKHRoaXMuZG9tYWluU2VsZWN0b3IsIGRvbWFpbiA9PlxuICAgIGdldFRpbWVXaWRnZXRUaXRsZUZvcm1hdHRlcihkb21haW4pXG4gICk7XG5cbiAgX3NsaWRlclVwZGF0ZSA9IGFyZ3MgPT4ge1xuICAgIHRoaXMuX3NsaWRlclRocm90dGxlLmNhbmNlbCgpO1xuICAgIHRoaXMuX3NsaWRlclRocm90dGxlKGFyZ3MpO1xuICB9O1xuXG4gIF9yZXNpemUoKSB7XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLnByb3BzLmlzRW5sYXJnZWRcbiAgICAgID8gdGhpcy5yZWZzLnNsaWRlckNvbnRhaW5lci5vZmZzZXRXaWR0aFxuICAgICAgOiAyODg7XG4gICAgaWYgKHdpZHRoICE9PSB0aGlzLnN0YXRlLndpZHRoKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHt3aWR0aH0pO1xuICAgIH1cbiAgfVxuXG4gIF9zdGFydEFuaW1hdGlvbiA9ICgpID0+IHtcbiAgICB0aGlzLl9wYXVzZUFuaW1hdGlvbigpO1xuICAgIHRoaXMucHJvcHMudG9nZ2xlQW5pbWF0aW9uKCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7aXNBbmltYXRpbmc6IHRydWV9KTtcbiAgfTtcblxuICBfcGF1c2VBbmltYXRpb24gPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMuX2FuaW1hdGlvbikge1xuICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5fYW5pbWF0aW9uKTtcbiAgICAgIHRoaXMucHJvcHMudG9nZ2xlQW5pbWF0aW9uKCk7XG4gICAgICB0aGlzLl9hbmltYXRpb24gPSBudWxsO1xuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHtpc0FuaW1hdGluZzogZmFsc2V9KTtcbiAgfTtcblxuICBfaW5jcmVhc2VBbmltYXRpb25TcGVlZCA9ICgpID0+IHtcbiAgICB0aGlzLl9hbmltYXRpb25TcGVlZCA9IE1hdGgucm91bmQodGhpcy5fYW5pbWF0aW9uU3BlZWQgKiBNYXRoLnBvdygwLjc1LCAxKSk7XG4gIH07XG5cbiAgX3JlZHVjZUFuaW1hdGlvblNwZWVkID0gKCkgPT4ge1xuICAgIHRoaXMuX2FuaW1hdGlvblNwZWVkID0gTWF0aC5yb3VuZChcbiAgICAgIHRoaXMuX2FuaW1hdGlvblNwZWVkICogTWF0aC5wb3coMC43NSwgLTEpXG4gICAgKTtcbiAgfTtcblxuICBfbmV4dEZyYW1lID0gKCkgPT4ge1xuICAgIHRoaXMuX2FuaW1hdGlvbiA9IG51bGw7XG5cbiAgICBjb25zdCB7ZG9tYWluLCB2YWx1ZX0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHNwZWVkID0gKGRvbWFpblsxXSAtIGRvbWFpblswXSkgLyB0aGlzLl9hbmltYXRpb25TcGVlZDtcblxuICAgIC8vIGxvb3Agd2hlbiByZWFjaGVzIHRoZSBlbmRcbiAgICBjb25zdCB2YWx1ZTAgPSB2YWx1ZVsxXSArIHNwZWVkID4gZG9tYWluWzFdID8gZG9tYWluWzBdIDogdmFsdWVbMF0gKyBzcGVlZDtcbiAgICBjb25zdCB2YWx1ZTEgPSB2YWx1ZTAgKyB2YWx1ZVsxXSAtIHZhbHVlWzBdO1xuICAgIHRoaXMucHJvcHMub25DaGFuZ2UoW3ZhbHVlMCwgdmFsdWUxXSk7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtkb21haW4sIHZhbHVlLCBpc0VubGFyZ2VkfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge3dpZHRoLCBpc0FuaW1hdGluZ30gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IGNvbnRyb2xXaWR0aCA9IDEzMDtcblxuICAgIGNvbnN0IHNsaWRlcldpZHRoID0gaXNFbmxhcmdlZCA/IHdpZHRoIC0gY29udHJvbFdpZHRoIDogd2lkdGg7XG5cbiAgICBjb25zdCBzdHlsZSA9IHtcbiAgICAgIG1hcmdpblRvcDogaXNFbmxhcmdlZCA/ICcxMnB4JyA6ICcwcHgnLFxuICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICBmbGV4RGlyZWN0aW9uOiBpc0VubGFyZ2VkID8gJ3JvdycgOiAnY29sdW1uJyxcbiAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbidcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxUaW1lVGl0bGVcbiAgICAgICAgICB0aW1lRm9ybWF0PXt0aGlzLnRpdGxlRm9ybWF0dGVyKHRoaXMucHJvcHMpfVxuICAgICAgICAgIHZhbHVlPXt2YWx1ZX1cbiAgICAgICAgICBpc0VubGFyZ2VkPXtpc0VubGFyZ2VkfVxuICAgICAgICAvPlxuICAgICAgICA8ZGl2IHJlZj1cInNsaWRlckNvbnRhaW5lclwiIHN0eWxlPXtzdHlsZX0+XG4gICAgICAgICAgPFJhbmdlU2xpZGVyXG4gICAgICAgICAgICBtaW5WYWx1ZT17ZG9tYWluWzBdfVxuICAgICAgICAgICAgbWF4VmFsdWU9e2RvbWFpblsxXX1cbiAgICAgICAgICAgIHZhbHVlMD17dmFsdWVbMF19XG4gICAgICAgICAgICB2YWx1ZTE9e3ZhbHVlWzFdfVxuICAgICAgICAgICAgaGlzdG9ncmFtPXt0aGlzLnByb3BzLmhpc3RvZ3JhbX1cbiAgICAgICAgICAgIGxpbmVDaGFydD17dGhpcy5wcm9wcy5saW5lQ2hhcnR9XG4gICAgICAgICAgICBwbG90VHlwZT17dGhpcy5wcm9wcy5wbG90VHlwZX1cbiAgICAgICAgICAgIGlzUmFuZ2VkPXt0cnVlfVxuICAgICAgICAgICAgaXNFbmxhcmdlZD17aXNFbmxhcmdlZH1cbiAgICAgICAgICAgIHNob3dJbnB1dD17ZmFsc2V9XG4gICAgICAgICAgICBzdGVwPXt0aGlzLnByb3BzLnN0ZXB9XG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5fc2xpZGVyVXBkYXRlfVxuICAgICAgICAgICAgd2lkdGg9e3NsaWRlcldpZHRofVxuICAgICAgICAgICAgeEF4aXM9ezxUaW1lU2xpZGVyTWFya2VyIHdpZHRoPXtzbGlkZXJXaWR0aH0gZG9tYWluPXtkb21haW59IC8+fVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPEFuaW1hdGlvbkNvbnRyb2xzXG4gICAgICAgICAgICBpc0FuaW1hdGFibGU9e3RoaXMucHJvcHMuaXNBbmltYXRhYmxlfVxuICAgICAgICAgICAgaXNFbmxhcmdlZD17aXNFbmxhcmdlZH1cbiAgICAgICAgICAgIGlzQW5pbWF0aW5nPXtpc0FuaW1hdGluZ31cbiAgICAgICAgICAgIHJlZHVjZUFuaW1hdGlvblNwZWVkPXt0aGlzLl9yZWR1Y2VBbmltYXRpb25TcGVlZH1cbiAgICAgICAgICAgIHBhdXNlQW5pbWF0aW9uPXt0aGlzLl9wYXVzZUFuaW1hdGlvbn1cbiAgICAgICAgICAgIHN0YXJ0QW5pbWF0aW9uPXt0aGlzLl9zdGFydEFuaW1hdGlvbn1cbiAgICAgICAgICAgIGluY3JlYXNlQW5pbWF0aW9uU3BlZWQ9e3RoaXMuX2luY3JlYXNlQW5pbWF0aW9uU3BlZWR9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmNvbnN0IFRpbWVWYWx1ZVdyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBmb250LXNpemU6IDExcHg7XG4gIGp1c3RpZnktY29udGVudDogJHtwcm9wcyA9PiAocHJvcHMuaXNFbmxhcmdlZCA/ICdjZW50ZXInIDogJ3NwYWNlLWJldHdlZW4nKX07XG4gIC5ob3Jpem9udGFsLWJhciB7XG4gICAgcGFkZGluZzogMCA2cHg7XG4gIH1cbmA7XG5cbmNvbnN0IFRpbWVUaXRsZSA9ICh7dmFsdWUsIGlzRW5sYXJnZWQsIHRpbWVGb3JtYXQgPSBkZWZhdWx0VGltZUZvcm1hdH0pID0+IChcbiAgPFRpbWVWYWx1ZVdyYXBwZXIgaXNFbmxhcmdlZD17aXNFbmxhcmdlZH0+XG4gICAgPFRpbWVWYWx1ZSBrZXk9ezB9IHZhbHVlPXttb21lbnQudXRjKHZhbHVlWzBdKS5mb3JtYXQodGltZUZvcm1hdCl9IC8+XG4gICAge2lzRW5sYXJnZWQgPyAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImhvcml6b250YWwtYmFyXCI+XG4gICAgICAgIDxTZWxlY3RUZXh0Qm9sZD7igJU8L1NlbGVjdFRleHRCb2xkPlxuICAgICAgPC9kaXY+XG4gICAgKSA6IG51bGx9XG4gICAgPFRpbWVWYWx1ZSBrZXk9ezF9IHZhbHVlPXttb21lbnQudXRjKHZhbHVlWzBdKS5mb3JtYXQodGltZUZvcm1hdCl9IC8+XG4gIDwvVGltZVZhbHVlV3JhcHBlcj5cbik7XG5cbmNvbnN0IFRpbWVWYWx1ZSA9ICh7dmFsdWV9KSA9PiAoXG4gIDxkaXY+XG4gICAgPFNlbGVjdFRleHRCb2xkPnt2YWx1ZX08L1NlbGVjdFRleHRCb2xkPlxuICA8L2Rpdj5cbik7XG5cbmNvbnN0IEFuaW1hdGlvbkNvbnRyb2xzID0gKHtcbiAgaXNBbmltYXRhYmxlLFxuICBpc0FuaW1hdGluZyxcbiAgaXNFbmxhcmdlZCxcbiAgaW5jcmVhc2VBbmltYXRpb25TcGVlZCxcbiAgcmVkdWNlQW5pbWF0aW9uU3BlZWQsXG4gIHBhdXNlQW5pbWF0aW9uLFxuICBzdGFydEFuaW1hdGlvblxufSkgPT4gKFxuICA8ZGl2XG4gICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCdzb2Z0LW1pY3JvLS10b3AnLCB7XG4gICAgICAndGV4dC0tY2VudGVyJzogIWlzRW5sYXJnZWQsXG4gICAgICAndGV4dC0tcmlnaHQnOiBpc0VubGFyZ2VkXG4gICAgfSl9XG4gICAgc3R5bGU9e1xuICAgICAgaXNBbmltYXRhYmxlXG4gICAgICAgID8ge1xuICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICAgICAgbWFyZ2luVG9wOiBpc0VubGFyZ2VkID8gMCA6IDE0XG4gICAgICAgICAgfVxuICAgICAgICA6IHtcbiAgICAgICAgICAgIG9wYWNpdHk6IDAuNCxcbiAgICAgICAgICAgIHBvaW50ZXJFdmVudHM6ICdub25lJ1xuICAgICAgICAgIH1cbiAgICB9XG4gID5cbiAgICA8QnV0dG9uIG9uQ2xpY2s9e3JlZHVjZUFuaW1hdGlvblNwZWVkfT5cbiAgICAgIDxpIGNsYXNzTmFtZT1cImljb24gaWNvbl9wcmV2aW91c1wiIC8+XG4gICAgPC9CdXR0b24+XG4gICAgPEJ1dHRvbiBzaXplPVwidGlueVwiIG9uQ2xpY2s9e2lzQW5pbWF0aW5nID8gcGF1c2VBbmltYXRpb24gOiBzdGFydEFuaW1hdGlvbn0+XG4gICAgICA8aVxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoe1xuICAgICAgICAgICdpY29uIGljb25fcGF1c2UnOiBpc0FuaW1hdGluZyxcbiAgICAgICAgICAnaWNvbiBpY29uX3BsYXknOiAhaXNBbmltYXRpbmdcbiAgICAgICAgfSl9XG4gICAgICAvPlxuICAgIDwvQnV0dG9uPlxuICAgIDxCdXR0b24gb25DbGljaz17aW5jcmVhc2VBbmltYXRpb25TcGVlZH0+XG4gICAgICA8aSBjbGFzc05hbWU9XCJpY29uIGljb25fc2tpcFwiIC8+XG4gICAgPC9CdXR0b24+XG4gIDwvZGl2PlxuKTtcblxuVGltZVJhbmdlU2xpZGVyLnByb3BUeXBlcyA9IHByb3BUeXBlcztcblRpbWVSYW5nZVNsaWRlci5kaXNwbGF5TmFtZSA9ICdUaW1lUmFuZ2VTbGlkZXInO1xuIl19
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
          xAxis: _react2.default.createElement(_timeSliderMarker2.default, {
            width: sliderWidth,
            domain: domain
          })
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
    { className: (0, _classnames2.default)('soft-micro--top', {
        'text--center': !isEnlarged,
        'text--right': isEnlarged }), style: isAnimatable ? {
        display: 'flex',
        marginTop: isEnlarged ? 0 : 14
      } : {
        opacity: 0.4,
        pointerEvents: 'none'
      } },
    _react2.default.createElement(
      _styledComponents3.Button,
      { onClick: reduceAnimationSpeed },
      _react2.default.createElement('i', { className: 'icon icon_previous' })
    ),
    _react2.default.createElement(
      _styledComponents3.Button,
      { size: 'tiny',
        onClick: isAnimating ? pauseAnimation : startAnimation },
      _react2.default.createElement('i', { className: (0, _classnames2.default)({
          'icon icon_pause': isAnimating,
          'icon icon_play': !isAnimating
        }) })
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi90aW1lLXJhbmdlLXNsaWRlci5qcyJdLCJuYW1lcyI6WyJwcm9wVHlwZXMiLCJvbkNoYW5nZSIsImZ1bmMiLCJpc1JlcXVpcmVkIiwiZG9tYWluIiwiYXJyYXkiLCJ2YWx1ZSIsInN0ZXAiLCJudW1iZXIiLCJwbG90VHlwZSIsInN0cmluZyIsImhpc3RvZ3JhbSIsImxpbmVDaGFydCIsIm9iamVjdCIsInRvZ2dsZUFuaW1hdGlvbiIsImlzQW5pbWF0YWJsZSIsImJvb2wiLCJpc0VubGFyZ2VkIiwiZGVmYXVsdFRpbWVGb3JtYXQiLCJ1dGMiLCJ2YWwiLCJmb3JtYXQiLCJUaW1lUmFuZ2VTbGlkZXIiLCJwcm9wcyIsInN0YXRlIiwiaXNBbmltYXRpbmciLCJ3aWR0aCIsIl9hbmltYXRpb24iLCJfYW5pbWF0aW9uU3BlZWQiLCJfc2xpZGVyVGhyb3R0bGUiLCJjb21wb25lbnREaWRNb3VudCIsIl9yZXNpemUiLCJjb21wb25lbnREaWRVcGRhdGUiLCJfbmV4dEZyYW1lIiwicmVmcyIsInNsaWRlckNvbnRhaW5lciIsIm9mZnNldFdpZHRoIiwic2V0U3RhdGUiLCJyZW5kZXIiLCJjb250cm9sV2lkdGgiLCJzbGlkZXJXaWR0aCIsInN0eWxlIiwibWFyZ2luVG9wIiwiYWxpZ25JdGVtcyIsImRpc3BsYXkiLCJmbGV4RGlyZWN0aW9uIiwianVzdGlmeUNvbnRlbnQiLCJ0aXRsZUZvcm1hdHRlciIsIl9zbGlkZXJVcGRhdGUiLCJfcmVkdWNlQW5pbWF0aW9uU3BlZWQiLCJfcGF1c2VBbmltYXRpb24iLCJfc3RhcnRBbmltYXRpb24iLCJfaW5jcmVhc2VBbmltYXRpb25TcGVlZCIsImRvbWFpblNlbGVjdG9yIiwiYXJncyIsImNhbmNlbCIsIk1hdGgiLCJyb3VuZCIsInBvdyIsInNwZWVkIiwidmFsdWUwIiwidmFsdWUxIiwiVGltZVZhbHVlV3JhcHBlciIsImRpdiIsIlRpbWVUaXRsZSIsInRpbWVGb3JtYXQiLCJUaW1lVmFsdWUiLCJBbmltYXRpb25Db250cm9scyIsImluY3JlYXNlQW5pbWF0aW9uU3BlZWQiLCJyZWR1Y2VBbmltYXRpb25TcGVlZCIsInBhdXNlQW5pbWF0aW9uIiwic3RhcnRBbmltYXRpb24iLCJvcGFjaXR5IiwicG9pbnRlckV2ZW50cyIsImRpc3BsYXlOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFFQTs7QUFDQTs7QUFFQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxZQUFZO0FBQ2hCQyxZQUFVLG9CQUFVQyxJQUFWLENBQWVDLFVBRFQ7QUFFaEJDLFVBQVEsb0JBQVVDLEtBQVYsQ0FBZ0JGLFVBRlI7QUFHaEJHLFNBQU8sb0JBQVVELEtBQVYsQ0FBZ0JGLFVBSFA7QUFJaEJJLFFBQU0sb0JBQVVDLE1BQVYsQ0FBaUJMLFVBSlA7QUFLaEJNLFlBQVUsb0JBQVVDLE1BTEo7QUFNaEJDLGFBQVcsb0JBQVVOLEtBTkw7QUFPaEJPLGFBQVcsb0JBQVVDLE1BUEw7QUFRaEJDLG1CQUFpQixvQkFBVVosSUFBVixDQUFlQyxVQVJoQjtBQVNoQlksZ0JBQWMsb0JBQVVDLElBVFI7QUFVaEJDLGNBQVksb0JBQVVEO0FBVk4sQ0FBbEI7O0FBYUEsSUFBTUUsb0JBQW9CLFNBQXBCQSxpQkFBb0I7QUFBQSxTQUFPLGlCQUFPQyxHQUFQLENBQVdDLEdBQVgsRUFBZ0JDLE1BQWhCLENBQXVCLGlCQUF2QixDQUFQO0FBQUEsQ0FBMUI7O0lBRXFCQyxlOzs7QUFPbkIsMkJBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSwrREFDakIsc0JBQU1BLEtBQU4sQ0FEaUI7O0FBQUE7O0FBRWpCLFVBQUtDLEtBQUwsR0FBYTtBQUNYQyxtQkFBYSxLQURGO0FBRVhDLGFBQU87QUFGSSxLQUFiO0FBSUEsVUFBS0MsVUFBTCxHQUFrQixJQUFsQjtBQUNBLFVBQUtDLGVBQUws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QUFBQSxDQUExQjs7QUFtQ0E5QyxnQkFBZ0J0QixTQUFoQixHQUE0QkEsU0FBNUI7QUFDQXNCLGdCQUFnQm9ELFdBQWhCLEdBQThCLGlCQUE5QiIsImZpbGUiOiJ0aW1lLXJhbmdlLXNsaWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7cmVxdWVzdEFuaW1hdGlvbkZyYW1lLCBjYW5jZWxBbmltYXRpb25GcmFtZX0gZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCB0aHJvdHRsZSBmcm9tICdsb2Rhc2gudGhyb3R0bGUnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5cbmltcG9ydCB7U2VsZWN0VGV4dEJvbGQsIEJ1dHRvbn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtnZXRUaW1lV2lkZ2V0VGl0bGVGb3JtYXR0ZXJ9IGZyb20gJ3V0aWxzL2ZpbHRlci11dGlscyc7XG5cbmltcG9ydCBSYW5nZVNsaWRlciBmcm9tICcuL3JhbmdlLXNsaWRlcic7XG5pbXBvcnQgVGltZVNsaWRlck1hcmtlciBmcm9tICcuL3RpbWUtc2xpZGVyLW1hcmtlcic7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGRvbWFpbjogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gIHZhbHVlOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgc3RlcDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBwbG90VHlwZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgaGlzdG9ncmFtOiBQcm9wVHlwZXMuYXJyYXksXG4gIGxpbmVDaGFydDogUHJvcFR5cGVzLm9iamVjdCxcbiAgdG9nZ2xlQW5pbWF0aW9uOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBpc0FuaW1hdGFibGU6IFByb3BUeXBlcy5ib29sLFxuICBpc0VubGFyZ2VkOiBQcm9wVHlwZXMuYm9vbFxufTtcblxuY29uc3QgZGVmYXVsdFRpbWVGb3JtYXQgPSB2YWwgPT4gbW9tZW50LnV0Yyh2YWwpLmZvcm1hdCgnTU0vREQvWVkgaGg6bW1hJyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVSYW5nZVNsaWRlciBleHRlbmRzIENvbXBvbmVudCB7XG4gIGRvbWFpblNlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMuZG9tYWluO1xuICB0aXRsZUZvcm1hdHRlciA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgIHRoaXMuZG9tYWluU2VsZWN0b3IsXG4gICAgZG9tYWluID0+IGdldFRpbWVXaWRnZXRUaXRsZUZvcm1hdHRlcihkb21haW4pXG4gICk7XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGlzQW5pbWF0aW5nOiBmYWxzZSxcbiAgICAgIHdpZHRoOiAyODhcbiAgICB9O1xuICAgIHRoaXMuX2FuaW1hdGlvbiA9IG51bGw7XG4gICAgdGhpcy5fYW5pbWF0aW9uU3BlZWQgPSAxMjA7XG4gICAgdGhpcy5fc2xpZGVyVGhyb3R0bGUgPSB0aHJvdHRsZSh0aGlzLnByb3BzLm9uQ2hhbmdlLCAyMCk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLl9yZXNpemUoKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICBpZiAoIXRoaXMuX2FuaW1hdGlvbiAmJiB0aGlzLnN0YXRlLmlzQW5pbWF0aW5nKSB7XG4gICAgICB0aGlzLl9hbmltYXRpb24gPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fbmV4dEZyYW1lKTtcbiAgICB9XG4gICAgdGhpcy5fcmVzaXplKCk7XG4gIH1cblxuICBfc2xpZGVyVXBkYXRlID0gKGFyZ3MpID0+IHtcbiAgICB0aGlzLl9zbGlkZXJUaHJvdHRsZS5jYW5jZWwoKTtcbiAgICB0aGlzLl9zbGlkZXJUaHJvdHRsZShhcmdzKTtcbiAgfTtcblxuICBfcmVzaXplKCkge1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5wcm9wcy5pc0VubGFyZ2VkID8gdGhpcy5yZWZzLnNsaWRlckNvbnRhaW5lci5vZmZzZXRXaWR0aCA6IDI4ODtcbiAgICBpZiAod2lkdGggIT09IHRoaXMuc3RhdGUud2lkdGgpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3dpZHRofSk7XG4gICAgfVxuICB9XG5cbiAgX3N0YXJ0QW5pbWF0aW9uID0gKCkgPT4ge1xuICAgIHRoaXMuX3BhdXNlQW5pbWF0aW9uKCk7XG4gICAgdGhpcy5wcm9wcy50b2dnbGVBbmltYXRpb24oKTtcbiAgICB0aGlzLnNldFN0YXRlKHtpc0FuaW1hdGluZzogdHJ1ZX0pO1xuICB9O1xuXG4gIF9wYXVzZUFuaW1hdGlvbiA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5fYW5pbWF0aW9uKSB7XG4gICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLl9hbmltYXRpb24pO1xuICAgICAgdGhpcy5wcm9wcy50b2dnbGVBbmltYXRpb24oKTtcbiAgICAgIHRoaXMuX2FuaW1hdGlvbiA9IG51bGw7XG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoe2lzQW5pbWF0aW5nOiBmYWxzZX0pO1xuICB9O1xuXG4gIF9pbmNyZWFzZUFuaW1hdGlvblNwZWVkID0gKCkgPT4ge1xuICAgIHRoaXMuX2FuaW1hdGlvblNwZWVkID0gTWF0aC5yb3VuZCh0aGlzLl9hbmltYXRpb25TcGVlZCAqXG4gICAgICBNYXRoLnBvdygwLjc1LCAxKSk7XG4gIH07XG5cbiAgX3JlZHVjZUFuaW1hdGlvblNwZWVkID0gKCkgPT4ge1xuICAgIHRoaXMuX2FuaW1hdGlvblNwZWVkID0gTWF0aC5yb3VuZCh0aGlzLl9hbmltYXRpb25TcGVlZCAqXG4gICAgICBNYXRoLnBvdygwLjc1LCAtMSkpO1xuICB9O1xuXG4gIF9uZXh0RnJhbWUgPSAoKSA9PiB7XG4gICAgdGhpcy5fYW5pbWF0aW9uID0gbnVsbDtcblxuICAgIGNvbnN0IHtkb21haW4sIHZhbHVlfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qgc3BlZWQgPSAoZG9tYWluWzFdIC0gZG9tYWluWzBdKSAvIHRoaXMuX2FuaW1hdGlvblNwZWVkO1xuXG4gICAgLy8gbG9vcCB3aGVuIHJlYWNoZXMgdGhlIGVuZFxuICAgIGNvbnN0IHZhbHVlMCA9ICh2YWx1ZVsxXSArIHNwZWVkID4gZG9tYWluWzFdKSA/IGRvbWFpblswXSA6XG4gICAgdmFsdWVbMF0gKyBzcGVlZDtcbiAgICBjb25zdCB2YWx1ZTEgPSB2YWx1ZTAgKyB2YWx1ZVsxXSAtIHZhbHVlWzBdO1xuICAgIHRoaXMucHJvcHMub25DaGFuZ2UoW3ZhbHVlMCwgdmFsdWUxXSk7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtkb21haW4sIHZhbHVlLCBpc0VubGFyZ2VkfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge3dpZHRoLCBpc0FuaW1hdGluZ30gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IGNvbnRyb2xXaWR0aCA9IDEzMDtcblxuICAgIGNvbnN0IHNsaWRlcldpZHRoID0gaXNFbmxhcmdlZCA/IHdpZHRoIC0gY29udHJvbFdpZHRoIDogd2lkdGg7XG5cbiAgICBjb25zdCBzdHlsZSA9IHtcbiAgICAgIG1hcmdpblRvcDogaXNFbmxhcmdlZCA/ICcxMnB4JyA6ICcwcHgnLFxuICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICBmbGV4RGlyZWN0aW9uOiBpc0VubGFyZ2VkID8gJ3JvdycgOiAnY29sdW1uJyxcbiAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbidcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxUaW1lVGl0bGVcbiAgICAgICAgICB0aW1lRm9ybWF0PXt0aGlzLnRpdGxlRm9ybWF0dGVyKHRoaXMucHJvcHMpfVxuICAgICAgICAgIHZhbHVlPXt2YWx1ZX1cbiAgICAgICAgICBpc0VubGFyZ2VkPXtpc0VubGFyZ2VkfVxuICAgICAgICAvPlxuICAgICAgICA8ZGl2IHJlZj1cInNsaWRlckNvbnRhaW5lclwiIHN0eWxlPXtzdHlsZX0+XG4gICAgICAgICAgPFJhbmdlU2xpZGVyXG4gICAgICAgICAgICBtaW5WYWx1ZT17ZG9tYWluWzBdfVxuICAgICAgICAgICAgbWF4VmFsdWU9e2RvbWFpblsxXX1cbiAgICAgICAgICAgIHZhbHVlMD17dmFsdWVbMF19XG4gICAgICAgICAgICB2YWx1ZTE9e3ZhbHVlWzFdfVxuICAgICAgICAgICAgaGlzdG9ncmFtPXt0aGlzLnByb3BzLmhpc3RvZ3JhbX1cbiAgICAgICAgICAgIGxpbmVDaGFydD17dGhpcy5wcm9wcy5saW5lQ2hhcnR9XG4gICAgICAgICAgICBwbG90VHlwZT17dGhpcy5wcm9wcy5wbG90VHlwZX1cbiAgICAgICAgICAgIGlzUmFuZ2VkPXt0cnVlfVxuICAgICAgICAgICAgaXNFbmxhcmdlZD17aXNFbmxhcmdlZH1cbiAgICAgICAgICAgIHNob3dJbnB1dD17ZmFsc2V9XG4gICAgICAgICAgICBzdGVwPXt0aGlzLnByb3BzLnN0ZXB9XG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5fc2xpZGVyVXBkYXRlfVxuICAgICAgICAgICAgd2lkdGg9e3NsaWRlcldpZHRofVxuICAgICAgICAgICAgeEF4aXM9e1xuICAgICAgICAgICAgICA8VGltZVNsaWRlck1hcmtlclxuICAgICAgICAgICAgICAgIHdpZHRoPXtzbGlkZXJXaWR0aH1cbiAgICAgICAgICAgICAgICBkb21haW49e2RvbWFpbn1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAvPlxuICAgICAgICAgPEFuaW1hdGlvbkNvbnRyb2xzXG4gICAgICAgICAgIGlzQW5pbWF0YWJsZT17dGhpcy5wcm9wcy5pc0FuaW1hdGFibGV9XG4gICAgICAgICAgIGlzRW5sYXJnZWQ9e2lzRW5sYXJnZWR9XG4gICAgICAgICAgIGlzQW5pbWF0aW5nPXtpc0FuaW1hdGluZ31cbiAgICAgICAgICAgcmVkdWNlQW5pbWF0aW9uU3BlZWQ9e3RoaXMuX3JlZHVjZUFuaW1hdGlvblNwZWVkfVxuICAgICAgICAgICBwYXVzZUFuaW1hdGlvbj17dGhpcy5fcGF1c2VBbmltYXRpb259XG4gICAgICAgICAgIHN0YXJ0QW5pbWF0aW9uPXt0aGlzLl9zdGFydEFuaW1hdGlvbn1cbiAgICAgICAgICAgaW5jcmVhc2VBbmltYXRpb25TcGVlZD17dGhpcy5faW5jcmVhc2VBbmltYXRpb25TcGVlZH1cbiAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5jb25zdCBUaW1lVmFsdWVXcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgZm9udC1zaXplOiAxMXB4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6ICR7cHJvcHMgPT4gcHJvcHMuaXNFbmxhcmdlZCA/ICdjZW50ZXInIDogJ3NwYWNlLWJldHdlZW4nfTtcbiAgLmhvcml6b250YWwtYmFyIHtcbiAgICBwYWRkaW5nOiAwIDZweDtcbiAgfVxuYDtcblxuY29uc3QgVGltZVRpdGxlID0gKHt2YWx1ZSwgaXNFbmxhcmdlZCwgdGltZUZvcm1hdCA9IGRlZmF1bHRUaW1lRm9ybWF0fSkgPT4gKFxuICA8VGltZVZhbHVlV3JhcHBlciBpc0VubGFyZ2VkPXtpc0VubGFyZ2VkfT5cbiAgICA8VGltZVZhbHVlIGtleT17MH0gdmFsdWU9e21vbWVudC51dGModmFsdWVbMF0pLmZvcm1hdCh0aW1lRm9ybWF0KX0vPlxuICAgIHtpc0VubGFyZ2VkID8gPGRpdiBjbGFzc05hbWU9XCJob3Jpem9udGFsLWJhclwiPjxTZWxlY3RUZXh0Qm9sZD7igJU8L1NlbGVjdFRleHRCb2xkPjwvZGl2PiA6IG51bGx9XG4gICAgPFRpbWVWYWx1ZSBrZXk9ezF9IHZhbHVlPXttb21lbnQudXRjKHZhbHVlWzBdKS5mb3JtYXQodGltZUZvcm1hdCl9Lz5cbiAgPC9UaW1lVmFsdWVXcmFwcGVyPlxuKTtcblxuY29uc3QgVGltZVZhbHVlID0gKHt2YWx1ZX0pID0+IChcbiAgPGRpdj48U2VsZWN0VGV4dEJvbGQ+e3ZhbHVlfTwvU2VsZWN0VGV4dEJvbGQ+PC9kaXY+XG4pO1xuXG5jb25zdCBBbmltYXRpb25Db250cm9scyA9ICh7XG4gIGlzQW5pbWF0YWJsZSxcbiAgaXNBbmltYXRpbmcsXG4gIGlzRW5sYXJnZWQsXG4gIGluY3JlYXNlQW5pbWF0aW9uU3BlZWQsXG4gIHJlZHVjZUFuaW1hdGlvblNwZWVkLFxuICBwYXVzZUFuaW1hdGlvbixcbiAgc3RhcnRBbmltYXRpb25cbn0pID0+IChcbiAgPGRpdiBjbGFzc05hbWU9e2NsYXNzbmFtZXMoXG4gICAgJ3NvZnQtbWljcm8tLXRvcCcsIHtcbiAgICAgICd0ZXh0LS1jZW50ZXInOiAhaXNFbmxhcmdlZCxcbiAgICAgICd0ZXh0LS1yaWdodCc6IGlzRW5sYXJnZWR9KX0gc3R5bGU9e2lzQW5pbWF0YWJsZSA/IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgbWFyZ2luVG9wOiBpc0VubGFyZ2VkID8gMCA6IDE0XG4gIH0gOiB7XG4gICAgb3BhY2l0eTogMC40LFxuICAgIHBvaW50ZXJFdmVudHM6ICdub25lJ1xuICB9fT5cbiAgICA8QnV0dG9uIG9uQ2xpY2s9e3JlZHVjZUFuaW1hdGlvblNwZWVkfT5cbiAgICAgIDxpIGNsYXNzTmFtZT1cImljb24gaWNvbl9wcmV2aW91c1wiLz5cbiAgICA8L0J1dHRvbj5cbiAgICA8QnV0dG9uIHNpemU9XCJ0aW55XCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e2lzQW5pbWF0aW5nID8gcGF1c2VBbmltYXRpb24gOiBzdGFydEFuaW1hdGlvbn0+XG4gICAgICA8aSBjbGFzc05hbWU9e2NsYXNzbmFtZXMoe1xuICAgICAgICAnaWNvbiBpY29uX3BhdXNlJzogaXNBbmltYXRpbmcsXG4gICAgICAgICdpY29uIGljb25fcGxheSc6ICFpc0FuaW1hdGluZ1xuICAgICAgfSl9Lz5cbiAgICA8L0J1dHRvbj5cbiAgICA8QnV0dG9uIG9uQ2xpY2s9e2luY3JlYXNlQW5pbWF0aW9uU3BlZWR9PlxuICAgICAgPGkgY2xhc3NOYW1lPVwiaWNvbiBpY29uX3NraXBcIi8+XG4gICAgPC9CdXR0b24+XG4gIDwvZGl2PlxuKTtcblxuVGltZVJhbmdlU2xpZGVyLnByb3BUeXBlcyA9IHByb3BUeXBlcztcblRpbWVSYW5nZVNsaWRlci5kaXNwbGF5TmFtZSA9ICdUaW1lUmFuZ2VTbGlkZXInO1xuIl19
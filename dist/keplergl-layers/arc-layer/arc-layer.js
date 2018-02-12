'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.arctVisConfigs = exports.arcRequiredColumns = exports.arcPosResolver = exports.arcPosAccessor = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _lodash = require('lodash.memoize');

var _lodash2 = _interopRequireDefault(_lodash);

var _baseLayer = require('../base-layer');

var _baseLayer2 = _interopRequireDefault(_baseLayer);

var _arcBrushingLayer = require('../../deckgl-layers/arc-brushing-layer/arc-brushing-layer');

var _arcBrushingLayer2 = _interopRequireDefault(_arcBrushingLayer);

var _colorUtils = require('../../utils/color-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var arcPosAccessor = exports.arcPosAccessor = function arcPosAccessor(_ref) {
  var lat0 = _ref.lat0,
      lng0 = _ref.lng0,
      lat1 = _ref.lat1,
      lng1 = _ref.lng1;
  return function (d) {
    return [d.data[lng0.fieldIdx], d.data[lat0.fieldIdx], 0, d.data[lng1.fieldIdx], d.data[lat1.fieldIdx], 0];
  };
};

var arcPosResolver = exports.arcPosResolver = function arcPosResolver(_ref2) {
  var lat0 = _ref2.lat0,
      lng0 = _ref2.lng0,
      lat1 = _ref2.lat1,
      lng1 = _ref2.lng1;
  return lat0.fieldIdx + '-' + lng0.fieldIdx + '-' + lat1.fieldIdx + '-' + lat1.fieldIdx + '}';
};

var arcRequiredColumns = exports.arcRequiredColumns = ['lat0', 'lng0', 'lat1', 'lng1'];

var arctVisConfigs = exports.arctVisConfigs = {
  opacity: 'opacity',
  thickness: 'thickness',
  colorRange: 'colorRange',
  sizeRange: 'strokeWidthRange',
  targetColor: 'targetColor',
  'hi-precision': 'hi-precision'
};

var ArcLayer = function (_Layer) {
  (0, _inherits3.default)(ArcLayer, _Layer);

  function ArcLayer(props) {
    (0, _classCallCheck3.default)(this, ArcLayer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ArcLayer.__proto__ || Object.getPrototypeOf(ArcLayer)).call(this, props));

    _this.registerVisConfig(arctVisConfigs);
    _this.getPosition = (0, _lodash2.default)(arcPosAccessor, arcPosResolver);
    return _this;
  }

  (0, _createClass3.default)(ArcLayer, [{
    key: 'formatLayerData',
    value: function formatLayerData(_, allData, filteredIndex, oldLayerData) {
      var _this2 = this;

      var opt = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
      var _config = this.config,
          colorScale = _config.colorScale,
          colorDomain = _config.colorDomain,
          colorField = _config.colorField,
          color = _config.color,
          columns = _config.columns,
          sizeField = _config.sizeField,
          sizeScale = _config.sizeScale,
          sizeDomain = _config.sizeDomain,
          _config$visConfig = _config.visConfig,
          sizeRange = _config$visConfig.sizeRange,
          colorRange = _config$visConfig.colorRange,
          targetColor = _config$visConfig.targetColor;

      // arc color

      var cScale = colorField && this.getVisChannelScale(colorScale, colorDomain, colorRange.colors.map(_colorUtils.hexToRgb));

      // arc thickness
      var sScale = sizeField && this.getVisChannelScale(sizeScale, sizeDomain, sizeRange);

      var getPosition = this.getPosition(columns);

      if (!oldLayerData || oldLayerData.getPosition !== getPosition) {
        this.updateLayerMeta(allData, getPosition);
      }

      var data = void 0;
      if (oldLayerData && oldLayerData.data && opt.sameData && oldLayerData.getPosition === getPosition) {
        data = oldLayerData.data;
      } else {
        data = filteredIndex.reduce(function (accu, index) {
          var pos = getPosition({ data: allData[index] });

          // if doesn't have point lat or lng, do not add the arc
          // deck.gl can't handle position == null
          if (!pos.every(Number.isFinite)) {
            return accu;
          }

          accu.push({
            index: index,
            sourcePosition: [pos[0], pos[1], pos[2]],
            targetPosition: [pos[3], pos[4], pos[5]],
            data: allData[index]
          });

          return accu;
        }, []);
      }

      var getStrokeWidth = function getStrokeWidth(d) {
        return sScale ? _this2.getEncodedChannelValue(sScale, d.data, sizeField) : 1;
      };

      var getColor = function getColor(d) {
        return cScale ? _this2.getEncodedChannelValue(cScale, d.data, colorField) : color;
      };

      var getTargetColor = function getTargetColor(d) {
        return cScale ? _this2.getEncodedChannelValue(cScale, d.data, colorField) : targetColor || color;
      };

      return {
        data: data,
        getColor: getColor,
        getSourceColor: getColor,
        getTargetColor: getTargetColor,
        getStrokeWidth: getStrokeWidth
      };
    }
  }, {
    key: 'updateLayerMeta',
    value: function updateLayerMeta(allData, getPosition) {
      // get bounds from arcs
      var sBounds = this.getPointsBounds(allData, function (d) {
        var pos = getPosition({ data: d });
        return [pos[0], pos[1]];
      });

      var tBounds = this.getPointsBounds(allData, function (d) {
        var pos = getPosition({ data: d });
        return [pos[3], pos[4]];
      });

      var bounds = [Math.min(sBounds[0], tBounds[0]), Math.min(sBounds[1], tBounds[1]), Math.max(sBounds[2], tBounds[2]), Math.max(sBounds[3], tBounds[3])];

      this.updateMeta({ bounds: bounds });
    }
  }, {
    key: 'renderLayer',
    value: function renderLayer(_ref3) {
      var data = _ref3.data,
          idx = _ref3.idx,
          layerInteraction = _ref3.layerInteraction,
          objectHovered = _ref3.objectHovered,
          mapState = _ref3.mapState,
          interactionConfig = _ref3.interactionConfig;
      var brush = interactionConfig.brush;


      var colorUpdateTriggers = {
        color: this.config.color,
        colorField: this.config.colorField,
        colorRange: this.config.visConfig.colorRange,
        colorScale: this.config.colorScale
      };

      return [
      // base layer
      new _arcBrushingLayer2.default((0, _extends3.default)({}, layerInteraction, data, {
        id: this.id,
        idx: idx,
        brushRadius: brush.config.size * 1000,
        brushSource: true,
        brushTarget: true,
        enableBrushing: brush.enabled,
        fp64: this.config.visConfig['hi-precision'],
        opacity: this.config.visConfig.opacity,
        pickable: true,
        pickedColor: this.config.highlightColor,
        strokeScale: this.config.visConfig.thickness,
        updateTriggers: {
          getStrokeWidth: {
            sizeField: this.config.sizeField,
            sizeRange: this.config.visConfig.sizeRange
          },
          getColor: colorUpdateTriggers,
          getSourceColor: colorUpdateTriggers,
          getTargetColor: colorUpdateTriggers
        }
      }))];
    }
  }, {
    key: 'type',
    get: function get() {
      return 'arc';
    }
  }, {
    key: 'isAggregated',
    get: function get() {
      return false;
    }
  }, {
    key: 'requiredLayerColumns',
    get: function get() {
      return arcRequiredColumns;
    }
  }, {
    key: 'columnPairs',
    get: function get() {
      return this.defaultLinkColumnPairs;
    }
  }, {
    key: 'visualChannels',
    get: function get() {
      return (0, _extends3.default)({}, (0, _get3.default)(ArcLayer.prototype.__proto__ || Object.getPrototypeOf(ArcLayer.prototype), 'visualChannels', this), {
        size: (0, _extends3.default)({}, (0, _get3.default)(ArcLayer.prototype.__proto__ || Object.getPrototypeOf(ArcLayer.prototype), 'visualChannels', this).size, {
          property: 'stroke'
        })
      });
    }
  }]);
  return ArcLayer;
}(_baseLayer2.default);

exports.default = ArcLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXBsZXJnbC1sYXllcnMvYXJjLWxheWVyL2FyYy1sYXllci5qcyJdLCJuYW1lcyI6WyJhcmNQb3NBY2Nlc3NvciIsImxhdDAiLCJsbmcwIiwibGF0MSIsImxuZzEiLCJkIiwiZGF0YSIsImZpZWxkSWR4IiwiYXJjUG9zUmVzb2x2ZXIiLCJhcmNSZXF1aXJlZENvbHVtbnMiLCJhcmN0VmlzQ29uZmlncyIsIm9wYWNpdHkiLCJ0aGlja25lc3MiLCJjb2xvclJhbmdlIiwic2l6ZVJhbmdlIiwidGFyZ2V0Q29sb3IiLCJBcmNMYXllciIsInByb3BzIiwicmVnaXN0ZXJWaXNDb25maWciLCJnZXRQb3NpdGlvbiIsIl8iLCJhbGxEYXRhIiwiZmlsdGVyZWRJbmRleCIsIm9sZExheWVyRGF0YSIsIm9wdCIsImNvbmZpZyIsImNvbG9yU2NhbGUiLCJjb2xvckRvbWFpbiIsImNvbG9yRmllbGQiLCJjb2xvciIsImNvbHVtbnMiLCJzaXplRmllbGQiLCJzaXplU2NhbGUiLCJzaXplRG9tYWluIiwidmlzQ29uZmlnIiwiY1NjYWxlIiwiZ2V0VmlzQ2hhbm5lbFNjYWxlIiwiY29sb3JzIiwibWFwIiwic1NjYWxlIiwidXBkYXRlTGF5ZXJNZXRhIiwic2FtZURhdGEiLCJyZWR1Y2UiLCJhY2N1IiwiaW5kZXgiLCJwb3MiLCJldmVyeSIsIk51bWJlciIsImlzRmluaXRlIiwicHVzaCIsInNvdXJjZVBvc2l0aW9uIiwidGFyZ2V0UG9zaXRpb24iLCJnZXRTdHJva2VXaWR0aCIsImdldEVuY29kZWRDaGFubmVsVmFsdWUiLCJnZXRDb2xvciIsImdldFRhcmdldENvbG9yIiwiZ2V0U291cmNlQ29sb3IiLCJzQm91bmRzIiwiZ2V0UG9pbnRzQm91bmRzIiwidEJvdW5kcyIsImJvdW5kcyIsIk1hdGgiLCJtaW4iLCJtYXgiLCJ1cGRhdGVNZXRhIiwiaWR4IiwibGF5ZXJJbnRlcmFjdGlvbiIsIm9iamVjdEhvdmVyZWQiLCJtYXBTdGF0ZSIsImludGVyYWN0aW9uQ29uZmlnIiwiYnJ1c2giLCJjb2xvclVwZGF0ZVRyaWdnZXJzIiwiaWQiLCJicnVzaFJhZGl1cyIsInNpemUiLCJicnVzaFNvdXJjZSIsImJydXNoVGFyZ2V0IiwiZW5hYmxlQnJ1c2hpbmciLCJlbmFibGVkIiwiZnA2NCIsInBpY2thYmxlIiwicGlja2VkQ29sb3IiLCJoaWdobGlnaHRDb2xvciIsInN0cm9rZVNjYWxlIiwidXBkYXRlVHJpZ2dlcnMiLCJkZWZhdWx0TGlua0NvbHVtblBhaXJzIiwicHJvcGVydHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVPLElBQU1BLDBDQUFpQixTQUFqQkEsY0FBaUI7QUFBQSxNQUFFQyxJQUFGLFFBQUVBLElBQUY7QUFBQSxNQUFRQyxJQUFSLFFBQVFBLElBQVI7QUFBQSxNQUFjQyxJQUFkLFFBQWNBLElBQWQ7QUFBQSxNQUFvQkMsSUFBcEIsUUFBb0JBLElBQXBCO0FBQUEsU0FBOEI7QUFBQSxXQUFLLENBQy9EQyxFQUFFQyxJQUFGLENBQU9KLEtBQUtLLFFBQVosQ0FEK0QsRUFFL0RGLEVBQUVDLElBQUYsQ0FBT0wsS0FBS00sUUFBWixDQUYrRCxFQUcvRCxDQUgrRCxFQUkvREYsRUFBRUMsSUFBRixDQUFPRixLQUFLRyxRQUFaLENBSitELEVBSy9ERixFQUFFQyxJQUFGLENBQU9ILEtBQUtJLFFBQVosQ0FMK0QsRUFNL0QsQ0FOK0QsQ0FBTDtBQUFBLEdBQTlCO0FBQUEsQ0FBdkI7O0FBU0EsSUFBTUMsMENBQWlCLFNBQWpCQSxjQUFpQjtBQUFBLE1BQUVQLElBQUYsU0FBRUEsSUFBRjtBQUFBLE1BQVFDLElBQVIsU0FBUUEsSUFBUjtBQUFBLE1BQWNDLElBQWQsU0FBY0EsSUFBZDtBQUFBLE1BQW9CQyxJQUFwQixTQUFvQkEsSUFBcEI7QUFBQSxTQUN6QkgsS0FBS00sUUFEb0IsU0FDUkwsS0FBS0ssUUFERyxTQUNTSixLQUFLSSxRQURkLFNBQzBC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QWEsSUFOZjtBQU9FQyxxQkFBYSxJQVBmO0FBUUVDLHdCQUFnQlAsTUFBTVEsT0FSeEI7QUFTRUMsY0FBTSxLQUFLdEQsTUFBTCxDQUFZUyxTQUFaLENBQXNCLGNBQXRCLENBVFI7QUFVRXZCLGlCQUFTLEtBQUtjLE1BQUwsQ0FBWVMsU0FBWixDQUFzQnZCLE9BVmpDO0FBV0VxRSxrQkFBVSxJQVhaO0FBWUVDLHFCQUFhLEtBQUt4RCxNQUFMLENBQVl5RCxjQVozQjtBQWFFQyxxQkFBYSxLQUFLMUQsTUFBTCxDQUFZUyxTQUFaLENBQXNCdEIsU0FickM7QUFjRXdFLHdCQUFnQjtBQUNkaEMsMEJBQWdCO0FBQ2RyQix1QkFBVyxLQUFLTixNQUFMLENBQVlNLFNBRFQ7QUFFZGpCLHVCQUFXLEtBQUtXLE1BQUwsQ0FBWVMsU0FBWixDQUFzQnBCO0FBRm5CLFdBREY7QUFLZHdDLG9CQUFVaUIsbUJBTEk7QUFNZGYsMEJBQWdCZSxtQkFORjtBQU9kaEIsMEJBQWdCZ0I7QUFQRjtBQWRsQixTQUZLLENBQVA7QUEyQkQ7Ozt3QkE3S1U7QUFDVCxhQUFPLEtBQVA7QUFDRDs7O3dCQUVrQjtBQUNqQixhQUFPLEtBQVA7QUFDRDs7O3dCQUUwQjtBQUN6QixhQUFPOUQsa0JBQVA7QUFDRDs7O3dCQUVpQjtBQUNoQixhQUFPLEtBQUs0RSxzQkFBWjtBQUNEOzs7d0JBRW9CO0FBQ25CO0FBRUVYLHlDQUNLLHNIQUFxQkEsSUFEMUI7QUFFRVksb0JBQVU7QUFGWjtBQUZGO0FBT0Q7Ozs7O2tCQS9Ca0J0RSxRIiwiZmlsZSI6ImFyYy1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtZW1vaXplIGZyb20gJ2xvZGFzaC5tZW1vaXplJztcblxuaW1wb3J0IExheWVyIGZyb20gJy4uL2Jhc2UtbGF5ZXInO1xuaW1wb3J0IEFyY0JydXNoaW5nTGF5ZXIgZnJvbSAnLi4vLi4vZGVja2dsLWxheWVycy9hcmMtYnJ1c2hpbmctbGF5ZXIvYXJjLWJydXNoaW5nLWxheWVyJztcbmltcG9ydCB7aGV4VG9SZ2J9IGZyb20gJy4uLy4uL3V0aWxzL2NvbG9yLXV0aWxzJztcblxuZXhwb3J0IGNvbnN0IGFyY1Bvc0FjY2Vzc29yID0gKHtsYXQwLCBsbmcwLCBsYXQxLCBsbmcxfSkgPT4gZCA9PiBbXG4gIGQuZGF0YVtsbmcwLmZpZWxkSWR4XSxcbiAgZC5kYXRhW2xhdDAuZmllbGRJZHhdLFxuICAwLFxuICBkLmRhdGFbbG5nMS5maWVsZElkeF0sXG4gIGQuZGF0YVtsYXQxLmZpZWxkSWR4XSxcbiAgMFxuXTtcblxuZXhwb3J0IGNvbnN0IGFyY1Bvc1Jlc29sdmVyID0gKHtsYXQwLCBsbmcwLCBsYXQxLCBsbmcxfSkgPT5cbiAgYCR7bGF0MC5maWVsZElkeH0tJHtsbmcwLmZpZWxkSWR4fS0ke2xhdDEuZmllbGRJZHh9LSR7bGF0MS5maWVsZElkeH19YDtcblxuZXhwb3J0IGNvbnN0IGFyY1JlcXVpcmVkQ29sdW1ucyA9IFsnbGF0MCcsICdsbmcwJywgJ2xhdDEnLCAnbG5nMSddO1xuXG5leHBvcnQgY29uc3QgYXJjdFZpc0NvbmZpZ3MgPSB7XG4gIG9wYWNpdHk6ICdvcGFjaXR5JyxcbiAgdGhpY2tuZXNzOiAndGhpY2tuZXNzJyxcbiAgY29sb3JSYW5nZTogJ2NvbG9yUmFuZ2UnLFxuICBzaXplUmFuZ2U6ICdzdHJva2VXaWR0aFJhbmdlJyxcbiAgdGFyZ2V0Q29sb3I6ICd0YXJnZXRDb2xvcicsXG4gICdoaS1wcmVjaXNpb24nOiAnaGktcHJlY2lzaW9uJ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXJjTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMucmVnaXN0ZXJWaXNDb25maWcoYXJjdFZpc0NvbmZpZ3MpO1xuICAgIHRoaXMuZ2V0UG9zaXRpb24gPSBtZW1vaXplKGFyY1Bvc0FjY2Vzc29yLCBhcmNQb3NSZXNvbHZlcik7XG4gIH1cblxuICBnZXQgdHlwZSgpIHtcbiAgICByZXR1cm4gJ2FyYyc7XG4gIH1cblxuICBnZXQgaXNBZ2dyZWdhdGVkKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldCByZXF1aXJlZExheWVyQ29sdW1ucygpIHtcbiAgICByZXR1cm4gYXJjUmVxdWlyZWRDb2x1bW5zO1xuICB9XG5cbiAgZ2V0IGNvbHVtblBhaXJzKCkge1xuICAgIHJldHVybiB0aGlzLmRlZmF1bHRMaW5rQ29sdW1uUGFpcnM7XG4gIH1cblxuICBnZXQgdmlzdWFsQ2hhbm5lbHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN1cGVyLnZpc3VhbENoYW5uZWxzLFxuICAgICAgc2l6ZToge1xuICAgICAgICAuLi5zdXBlci52aXN1YWxDaGFubmVscy5zaXplLFxuICAgICAgICBwcm9wZXJ0eTogJ3N0cm9rZSdcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgZm9ybWF0TGF5ZXJEYXRhKF8sIGFsbERhdGEsIGZpbHRlcmVkSW5kZXgsIG9sZExheWVyRGF0YSwgb3B0ID0ge30pIHtcbiAgICBjb25zdCB7XG4gICAgICBjb2xvclNjYWxlLFxuICAgICAgY29sb3JEb21haW4sXG4gICAgICBjb2xvckZpZWxkLFxuICAgICAgY29sb3IsXG4gICAgICBjb2x1bW5zLFxuICAgICAgc2l6ZUZpZWxkLFxuICAgICAgc2l6ZVNjYWxlLFxuICAgICAgc2l6ZURvbWFpbixcbiAgICAgIHZpc0NvbmZpZzoge3NpemVSYW5nZSwgY29sb3JSYW5nZSwgdGFyZ2V0Q29sb3J9XG4gICAgfSA9IHRoaXMuY29uZmlnO1xuXG4gICAgLy8gYXJjIGNvbG9yXG4gICAgY29uc3QgY1NjYWxlID1cbiAgICAgIGNvbG9yRmllbGQgJiZcbiAgICAgIHRoaXMuZ2V0VmlzQ2hhbm5lbFNjYWxlKFxuICAgICAgICBjb2xvclNjYWxlLFxuICAgICAgICBjb2xvckRvbWFpbixcbiAgICAgICAgY29sb3JSYW5nZS5jb2xvcnMubWFwKGhleFRvUmdiKVxuICAgICAgKTtcblxuICAgIC8vIGFyYyB0aGlja25lc3NcbiAgICBjb25zdCBzU2NhbGUgPVxuICAgICAgc2l6ZUZpZWxkICYmIHRoaXMuZ2V0VmlzQ2hhbm5lbFNjYWxlKHNpemVTY2FsZSwgc2l6ZURvbWFpbiwgc2l6ZVJhbmdlKTtcblxuICAgIGNvbnN0IGdldFBvc2l0aW9uID0gdGhpcy5nZXRQb3NpdGlvbihjb2x1bW5zKTtcblxuICAgIGlmICghb2xkTGF5ZXJEYXRhIHx8IG9sZExheWVyRGF0YS5nZXRQb3NpdGlvbiAhPT0gZ2V0UG9zaXRpb24pIHtcbiAgICAgIHRoaXMudXBkYXRlTGF5ZXJNZXRhKGFsbERhdGEsIGdldFBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBsZXQgZGF0YTtcbiAgICBpZiAoXG4gICAgICBvbGRMYXllckRhdGEgJiZcbiAgICAgIG9sZExheWVyRGF0YS5kYXRhICYmXG4gICAgICBvcHQuc2FtZURhdGEgJiZcbiAgICAgIG9sZExheWVyRGF0YS5nZXRQb3NpdGlvbiA9PT0gZ2V0UG9zaXRpb25cbiAgICApIHtcbiAgICAgIGRhdGEgPSBvbGRMYXllckRhdGEuZGF0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YSA9IGZpbHRlcmVkSW5kZXgucmVkdWNlKChhY2N1LCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBwb3MgPSBnZXRQb3NpdGlvbih7ZGF0YTogYWxsRGF0YVtpbmRleF19KTtcblxuICAgICAgICAvLyBpZiBkb2Vzbid0IGhhdmUgcG9pbnQgbGF0IG9yIGxuZywgZG8gbm90IGFkZCB0aGUgYXJjXG4gICAgICAgIC8vIGRlY2suZ2wgY2FuJ3QgaGFuZGxlIHBvc2l0aW9uID09IG51bGxcbiAgICAgICAgaWYgKCFwb3MuZXZlcnkoTnVtYmVyLmlzRmluaXRlKSkge1xuICAgICAgICAgIHJldHVybiBhY2N1O1xuICAgICAgICB9XG5cbiAgICAgICAgYWNjdS5wdXNoKHtcbiAgICAgICAgICBpbmRleCxcbiAgICAgICAgICBzb3VyY2VQb3NpdGlvbjogW3Bvc1swXSwgcG9zWzFdLCBwb3NbMl1dLFxuICAgICAgICAgIHRhcmdldFBvc2l0aW9uOiBbcG9zWzNdLCBwb3NbNF0sIHBvc1s1XV0sXG4gICAgICAgICAgZGF0YTogYWxsRGF0YVtpbmRleF1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGFjY3U7XG4gICAgICB9LCBbXSk7XG4gICAgfVxuXG4gICAgY29uc3QgZ2V0U3Ryb2tlV2lkdGggPSBkID0+XG4gICAgICBzU2NhbGUgPyB0aGlzLmdldEVuY29kZWRDaGFubmVsVmFsdWUoc1NjYWxlLCBkLmRhdGEsIHNpemVGaWVsZCkgOiAxO1xuXG4gICAgY29uc3QgZ2V0Q29sb3IgPSBkID0+XG4gICAgICBjU2NhbGUgPyB0aGlzLmdldEVuY29kZWRDaGFubmVsVmFsdWUoY1NjYWxlLCBkLmRhdGEsIGNvbG9yRmllbGQpIDogY29sb3I7XG5cbiAgICBjb25zdCBnZXRUYXJnZXRDb2xvciA9IGQgPT5cbiAgICAgIGNTY2FsZVxuICAgICAgICA/IHRoaXMuZ2V0RW5jb2RlZENoYW5uZWxWYWx1ZShjU2NhbGUsIGQuZGF0YSwgY29sb3JGaWVsZClcbiAgICAgICAgOiB0YXJnZXRDb2xvciB8fCBjb2xvcjtcblxuICAgIHJldHVybiB7XG4gICAgICBkYXRhLFxuICAgICAgZ2V0Q29sb3IsXG4gICAgICBnZXRTb3VyY2VDb2xvcjogZ2V0Q29sb3IsXG4gICAgICBnZXRUYXJnZXRDb2xvcixcbiAgICAgIGdldFN0cm9rZVdpZHRoXG4gICAgfTtcbiAgfVxuXG4gIHVwZGF0ZUxheWVyTWV0YShhbGxEYXRhLCBnZXRQb3NpdGlvbikge1xuICAgIC8vIGdldCBib3VuZHMgZnJvbSBhcmNzXG4gICAgY29uc3Qgc0JvdW5kcyA9IHRoaXMuZ2V0UG9pbnRzQm91bmRzKGFsbERhdGEsIGQgPT4ge1xuICAgICAgY29uc3QgcG9zID0gZ2V0UG9zaXRpb24oe2RhdGE6IGR9KTtcbiAgICAgIHJldHVybiBbcG9zWzBdLCBwb3NbMV1dO1xuICAgIH0pO1xuXG4gICAgY29uc3QgdEJvdW5kcyA9IHRoaXMuZ2V0UG9pbnRzQm91bmRzKGFsbERhdGEsIGQgPT4ge1xuICAgICAgY29uc3QgcG9zID0gZ2V0UG9zaXRpb24oe2RhdGE6IGR9KTtcbiAgICAgIHJldHVybiBbcG9zWzNdLCBwb3NbNF1dO1xuICAgIH0pO1xuXG4gICAgY29uc3QgYm91bmRzID0gW1xuICAgICAgTWF0aC5taW4oc0JvdW5kc1swXSwgdEJvdW5kc1swXSksXG4gICAgICBNYXRoLm1pbihzQm91bmRzWzFdLCB0Qm91bmRzWzFdKSxcbiAgICAgIE1hdGgubWF4KHNCb3VuZHNbMl0sIHRCb3VuZHNbMl0pLFxuICAgICAgTWF0aC5tYXgoc0JvdW5kc1szXSwgdEJvdW5kc1szXSlcbiAgICBdO1xuXG4gICAgdGhpcy51cGRhdGVNZXRhKHtib3VuZHN9KTtcbiAgfVxuXG4gIHJlbmRlckxheWVyKHtcbiAgICBkYXRhLFxuICAgIGlkeCxcbiAgICBsYXllckludGVyYWN0aW9uLFxuICAgIG9iamVjdEhvdmVyZWQsXG4gICAgbWFwU3RhdGUsXG4gICAgaW50ZXJhY3Rpb25Db25maWdcbiAgfSkge1xuICAgIGNvbnN0IHticnVzaH0gPSBpbnRlcmFjdGlvbkNvbmZpZztcblxuICAgIGNvbnN0IGNvbG9yVXBkYXRlVHJpZ2dlcnMgPSB7XG4gICAgICBjb2xvcjogdGhpcy5jb25maWcuY29sb3IsXG4gICAgICBjb2xvckZpZWxkOiB0aGlzLmNvbmZpZy5jb2xvckZpZWxkLFxuICAgICAgY29sb3JSYW5nZTogdGhpcy5jb25maWcudmlzQ29uZmlnLmNvbG9yUmFuZ2UsXG4gICAgICBjb2xvclNjYWxlOiB0aGlzLmNvbmZpZy5jb2xvclNjYWxlXG4gICAgfTtcblxuICAgIHJldHVybiBbXG4gICAgICAvLyBiYXNlIGxheWVyXG4gICAgICBuZXcgQXJjQnJ1c2hpbmdMYXllcih7XG4gICAgICAgIC4uLmxheWVySW50ZXJhY3Rpb24sXG4gICAgICAgIC4uLmRhdGEsXG4gICAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAgICBpZHgsXG4gICAgICAgIGJydXNoUmFkaXVzOiBicnVzaC5jb25maWcuc2l6ZSAqIDEwMDAsXG4gICAgICAgIGJydXNoU291cmNlOiB0cnVlLFxuICAgICAgICBicnVzaFRhcmdldDogdHJ1ZSxcbiAgICAgICAgZW5hYmxlQnJ1c2hpbmc6IGJydXNoLmVuYWJsZWQsXG4gICAgICAgIGZwNjQ6IHRoaXMuY29uZmlnLnZpc0NvbmZpZ1snaGktcHJlY2lzaW9uJ10sXG4gICAgICAgIG9wYWNpdHk6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5vcGFjaXR5LFxuICAgICAgICBwaWNrYWJsZTogdHJ1ZSxcbiAgICAgICAgcGlja2VkQ29sb3I6IHRoaXMuY29uZmlnLmhpZ2hsaWdodENvbG9yLFxuICAgICAgICBzdHJva2VTY2FsZTogdGhpcy5jb25maWcudmlzQ29uZmlnLnRoaWNrbmVzcyxcbiAgICAgICAgdXBkYXRlVHJpZ2dlcnM6IHtcbiAgICAgICAgICBnZXRTdHJva2VXaWR0aDoge1xuICAgICAgICAgICAgc2l6ZUZpZWxkOiB0aGlzLmNvbmZpZy5zaXplRmllbGQsXG4gICAgICAgICAgICBzaXplUmFuZ2U6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5zaXplUmFuZ2VcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldENvbG9yOiBjb2xvclVwZGF0ZVRyaWdnZXJzLFxuICAgICAgICAgIGdldFNvdXJjZUNvbG9yOiBjb2xvclVwZGF0ZVRyaWdnZXJzLFxuICAgICAgICAgIGdldFRhcmdldENvbG9yOiBjb2xvclVwZGF0ZVRyaWdnZXJzXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgXTtcbiAgfVxufVxuIl19
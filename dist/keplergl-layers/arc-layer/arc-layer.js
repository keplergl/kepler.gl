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

    var _this = (0, _possibleConstructorReturn3.default)(this, _Layer.call(this, props));

    _this.registerVisConfig(arctVisConfigs);
    _this.getPosition = (0, _lodash2.default)(arcPosAccessor, arcPosResolver);
    return _this;
  }

  ArcLayer.prototype.formatLayerData = function formatLayerData(_, allData, filteredIndex, oldLayerData) {
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
  };

  ArcLayer.prototype.updateLayerMeta = function updateLayerMeta(allData, getPosition) {
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
  };

  ArcLayer.prototype.renderLayer = function renderLayer(_ref3) {
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
  };

  (0, _createClass3.default)(ArcLayer, [{
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
      return (0, _extends3.default)({}, _Layer.prototype.visualChannels, {
        size: (0, _extends3.default)({}, _Layer.prototype.visualChannels.size, {
          property: 'stroke'
        })
      });
    }
  }]);
  return ArcLayer;
}(_baseLayer2.default);

exports.default = ArcLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXBsZXJnbC1sYXllcnMvYXJjLWxheWVyL2FyYy1sYXllci5qcyJdLCJuYW1lcyI6WyJhcmNQb3NBY2Nlc3NvciIsImxhdDAiLCJsbmcwIiwibGF0MSIsImxuZzEiLCJkIiwiZGF0YSIsImZpZWxkSWR4IiwiYXJjUG9zUmVzb2x2ZXIiLCJhcmNSZXF1aXJlZENvbHVtbnMiLCJhcmN0VmlzQ29uZmlncyIsIm9wYWNpdHkiLCJ0aGlja25lc3MiLCJjb2xvclJhbmdlIiwic2l6ZVJhbmdlIiwidGFyZ2V0Q29sb3IiLCJBcmNMYXllciIsInByb3BzIiwicmVnaXN0ZXJWaXNDb25maWciLCJnZXRQb3NpdGlvbiIsImZvcm1hdExheWVyRGF0YSIsIl8iLCJhbGxEYXRhIiwiZmlsdGVyZWRJbmRleCIsIm9sZExheWVyRGF0YSIsIm9wdCIsImNvbmZpZyIsImNvbG9yU2NhbGUiLCJjb2xvckRvbWFpbiIsImNvbG9yRmllbGQiLCJjb2xvciIsImNvbHVtbnMiLCJzaXplRmllbGQiLCJzaXplU2NhbGUiLCJzaXplRG9tYWluIiwidmlzQ29uZmlnIiwiY1NjYWxlIiwiZ2V0VmlzQ2hhbm5lbFNjYWxlIiwiY29sb3JzIiwibWFwIiwic1NjYWxlIiwidXBkYXRlTGF5ZXJNZXRhIiwic2FtZURhdGEiLCJyZWR1Y2UiLCJhY2N1IiwiaW5kZXgiLCJwb3MiLCJldmVyeSIsIk51bWJlciIsImlzRmluaXRlIiwicHVzaCIsInNvdXJjZVBvc2l0aW9uIiwidGFyZ2V0UG9zaXRpb24iLCJnZXRTdHJva2VXaWR0aCIsImdldEVuY29kZWRDaGFubmVsVmFsdWUiLCJnZXRDb2xvciIsImdldFRhcmdldENvbG9yIiwiZ2V0U291cmNlQ29sb3IiLCJzQm91bmRzIiwiZ2V0UG9pbnRzQm91bmRzIiwidEJvdW5kcyIsImJvdW5kcyIsIk1hdGgiLCJtaW4iLCJtYXgiLCJ1cGRhdGVNZXRhIiwicmVuZGVyTGF5ZXIiLCJpZHgiLCJsYXllckludGVyYWN0aW9uIiwib2JqZWN0SG92ZXJlZCIsIm1hcFN0YXRlIiwiaW50ZXJhY3Rpb25Db25maWciLCJicnVzaCIsImNvbG9yVXBkYXRlVHJpZ2dlcnMiLCJpZCIsImJydXNoUmFkaXVzIiwic2l6ZSIsImJydXNoU291cmNlIiwiYnJ1c2hUYXJnZXQiLCJlbmFibGVCcnVzaGluZyIsImVuYWJsZWQiLCJmcDY0IiwicGlja2FibGUiLCJwaWNrZWRDb2xvciIsImhpZ2hsaWdodENvbG9yIiwic3Ryb2tlU2NhbGUiLCJ1cGRhdGVUcmlnZ2VycyIsImRlZmF1bHRMaW5rQ29sdW1uUGFpcnMiLCJ2aXN1YWxDaGFubmVscyIsInByb3BlcnR5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVPLElBQU1BLDBDQUFpQixTQUFqQkEsY0FBaUI7QUFBQSxNQUFFQyxJQUFGLFFBQUVBLElBQUY7QUFBQSxNQUFRQyxJQUFSLFFBQVFBLElBQVI7QUFBQSxNQUFjQyxJQUFkLFFBQWNBLElBQWQ7QUFBQSxNQUFvQkMsSUFBcEIsUUFBb0JBLElBQXBCO0FBQUEsU0FBOEI7QUFBQSxXQUFLLENBQy9EQyxFQUFFQyxJQUFGLENBQU9KLEtBQUtLLFFBQVosQ0FEK0QsRUFFL0RGLEVBQUVDLElBQUYsQ0FBT0wsS0FBS00sUUFBWixDQUYrRCxFQUcvRCxDQUgrRCxFQUkvREYsRUFBRUMsSUFBRixDQUFPRixLQUFLRyxRQUFaLENBSitELEVBSy9ERixFQUFFQyxJQUFGLENBQU9ILEtBQUtJLFFBQVosQ0FMK0QsRUFNL0QsQ0FOK0QsQ0FBTDtBQUFBLEdBQTlCO0FBQUEsQ0FBdkI7O0FBU0EsSUFBTUMsMENBQWlCLFNBQWpCQSxjQUFpQjtBQUFBLE1BQUVQLElBQUYsU0FBRUEsSUFBRjtBQUFBLE1BQVFDLElBQVIsU0FBUUEsSUFBUjtBQUFBLE1BQWNDLElBQWQsU0FBY0EsSUFBZDtBQUFBLE1BQW9CQyxJQUFwQixTQUFvQkEsSUFBcEI7QUFBQSxTQUN6QkgsS0FBS00s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b0UsVUFBSSxLQUFLQSxFQUhYO0FBSUVQLGNBSkY7QUFLRVEsbUJBQWFILE1BQU05QyxNQUFOLENBQWFrRCxJQUFiLEdBQW9CLElBTG5DO0FBTUVDLG1CQUFhLElBTmY7QUFPRUMsbUJBQWEsSUFQZjtBQVFFQyxzQkFBZ0JQLE1BQU1RLE9BUnhCO0FBU0VDLFlBQU0sS0FBS3ZELE1BQUwsQ0FBWVMsU0FBWixDQUFzQixjQUF0QixDQVRSO0FBVUV4QixlQUFTLEtBQUtlLE1BQUwsQ0FBWVMsU0FBWixDQUFzQnhCLE9BVmpDO0FBV0V1RSxnQkFBVSxJQVhaO0FBWUVDLG1CQUFhLEtBQUt6RCxNQUFMLENBQVkwRCxjQVozQjtBQWFFQyxtQkFBYSxLQUFLM0QsTUFBTCxDQUFZUyxTQUFaLENBQXNCdkIsU0FickM7QUFjRTBFLHNCQUFnQjtBQUNkakMsd0JBQWdCO0FBQ2RyQixxQkFBVyxLQUFLTixNQUFMLENBQVlNLFNBRFQ7QUFFZGxCLHFCQUFXLEtBQUtZLE1BQUwsQ0FBWVMsU0FBWixDQUFzQnJCO0FBRm5CLFNBREY7QUFLZHlDLGtCQUFVa0IsbUJBTEk7QUFNZGhCLHdCQUFnQmdCLG1CQU5GO0FBT2RqQix3QkFBZ0JpQjtBQVBGO0FBZGxCLE9BRkssQ0FBUDtBQTJCRCxHOzs7O3dCQTdLVTtBQUNULGFBQU8sS0FBUDtBQUNEOzs7d0JBRWtCO0FBQ2pCLGFBQU8sS0FBUDtBQUNEOzs7d0JBRTBCO0FBQ3pCLGFBQU9oRSxrQkFBUDtBQUNEOzs7d0JBRWlCO0FBQ2hCLGFBQU8sS0FBSzhFLHNCQUFaO0FBQ0Q7Ozt3QkFFb0I7QUFDbkIsd0NBQ0ssaUJBQU1DLGNBRFg7QUFFRVoseUNBQ0ssaUJBQU1ZLGNBQU4sQ0FBcUJaLElBRDFCO0FBRUVhLG9CQUFVO0FBRlo7QUFGRjtBQU9EOzs7OztrQkEvQmtCekUsUSIsImZpbGUiOiJhcmMtbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbWVtb2l6ZSBmcm9tICdsb2Rhc2gubWVtb2l6ZSc7XG5cbmltcG9ydCBMYXllciBmcm9tICcuLi9iYXNlLWxheWVyJztcbmltcG9ydCBBcmNCcnVzaGluZ0xheWVyIGZyb20gJy4uLy4uL2RlY2tnbC1sYXllcnMvYXJjLWJydXNoaW5nLWxheWVyL2FyYy1icnVzaGluZy1sYXllcic7XG5pbXBvcnQge2hleFRvUmdifSBmcm9tICcuLi8uLi91dGlscy9jb2xvci11dGlscyc7XG5cbmV4cG9ydCBjb25zdCBhcmNQb3NBY2Nlc3NvciA9ICh7bGF0MCwgbG5nMCwgbGF0MSwgbG5nMX0pID0+IGQgPT4gW1xuICBkLmRhdGFbbG5nMC5maWVsZElkeF0sXG4gIGQuZGF0YVtsYXQwLmZpZWxkSWR4XSxcbiAgMCxcbiAgZC5kYXRhW2xuZzEuZmllbGRJZHhdLFxuICBkLmRhdGFbbGF0MS5maWVsZElkeF0sXG4gIDBcbl07XG5cbmV4cG9ydCBjb25zdCBhcmNQb3NSZXNvbHZlciA9ICh7bGF0MCwgbG5nMCwgbGF0MSwgbG5nMX0pID0+XG4gIGAke2xhdDAuZmllbGRJZHh9LSR7bG5nMC5maWVsZElkeH0tJHtsYXQxLmZpZWxkSWR4fS0ke2xhdDEuZmllbGRJZHh9fWA7XG5cbmV4cG9ydCBjb25zdCBhcmNSZXF1aXJlZENvbHVtbnMgPSBbJ2xhdDAnLCAnbG5nMCcsICdsYXQxJywgJ2xuZzEnXTtcblxuZXhwb3J0IGNvbnN0IGFyY3RWaXNDb25maWdzID0ge1xuICBvcGFjaXR5OiAnb3BhY2l0eScsXG4gIHRoaWNrbmVzczogJ3RoaWNrbmVzcycsXG4gIGNvbG9yUmFuZ2U6ICdjb2xvclJhbmdlJyxcbiAgc2l6ZVJhbmdlOiAnc3Ryb2tlV2lkdGhSYW5nZScsXG4gIHRhcmdldENvbG9yOiAndGFyZ2V0Q29sb3InLFxuICAnaGktcHJlY2lzaW9uJzogJ2hpLXByZWNpc2lvbidcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFyY0xheWVyIGV4dGVuZHMgTGF5ZXIge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnJlZ2lzdGVyVmlzQ29uZmlnKGFyY3RWaXNDb25maWdzKTtcbiAgICB0aGlzLmdldFBvc2l0aW9uID0gbWVtb2l6ZShhcmNQb3NBY2Nlc3NvciwgYXJjUG9zUmVzb2x2ZXIpO1xuICB9XG5cbiAgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuICdhcmMnO1xuICB9XG5cbiAgZ2V0IGlzQWdncmVnYXRlZCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXQgcmVxdWlyZWRMYXllckNvbHVtbnMoKSB7XG4gICAgcmV0dXJuIGFyY1JlcXVpcmVkQ29sdW1ucztcbiAgfVxuXG4gIGdldCBjb2x1bW5QYWlycygpIHtcbiAgICByZXR1cm4gdGhpcy5kZWZhdWx0TGlua0NvbHVtblBhaXJzO1xuICB9XG5cbiAgZ2V0IHZpc3VhbENoYW5uZWxzKCkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdXBlci52aXN1YWxDaGFubmVscyxcbiAgICAgIHNpemU6IHtcbiAgICAgICAgLi4uc3VwZXIudmlzdWFsQ2hhbm5lbHMuc2l6ZSxcbiAgICAgICAgcHJvcGVydHk6ICdzdHJva2UnXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGZvcm1hdExheWVyRGF0YShfLCBhbGxEYXRhLCBmaWx0ZXJlZEluZGV4LCBvbGRMYXllckRhdGEsIG9wdCA9IHt9KSB7XG4gICAgY29uc3Qge1xuICAgICAgY29sb3JTY2FsZSxcbiAgICAgIGNvbG9yRG9tYWluLFxuICAgICAgY29sb3JGaWVsZCxcbiAgICAgIGNvbG9yLFxuICAgICAgY29sdW1ucyxcbiAgICAgIHNpemVGaWVsZCxcbiAgICAgIHNpemVTY2FsZSxcbiAgICAgIHNpemVEb21haW4sXG4gICAgICB2aXNDb25maWc6IHtzaXplUmFuZ2UsIGNvbG9yUmFuZ2UsIHRhcmdldENvbG9yfVxuICAgIH0gPSB0aGlzLmNvbmZpZztcblxuICAgIC8vIGFyYyBjb2xvclxuICAgIGNvbnN0IGNTY2FsZSA9XG4gICAgICBjb2xvckZpZWxkICYmXG4gICAgICB0aGlzLmdldFZpc0NoYW5uZWxTY2FsZShcbiAgICAgICAgY29sb3JTY2FsZSxcbiAgICAgICAgY29sb3JEb21haW4sXG4gICAgICAgIGNvbG9yUmFuZ2UuY29sb3JzLm1hcChoZXhUb1JnYilcbiAgICAgICk7XG5cbiAgICAvLyBhcmMgdGhpY2tuZXNzXG4gICAgY29uc3Qgc1NjYWxlID1cbiAgICAgIHNpemVGaWVsZCAmJiB0aGlzLmdldFZpc0NoYW5uZWxTY2FsZShzaXplU2NhbGUsIHNpemVEb21haW4sIHNpemVSYW5nZSk7XG5cbiAgICBjb25zdCBnZXRQb3NpdGlvbiA9IHRoaXMuZ2V0UG9zaXRpb24oY29sdW1ucyk7XG5cbiAgICBpZiAoIW9sZExheWVyRGF0YSB8fCBvbGRMYXllckRhdGEuZ2V0UG9zaXRpb24gIT09IGdldFBvc2l0aW9uKSB7XG4gICAgICB0aGlzLnVwZGF0ZUxheWVyTWV0YShhbGxEYXRhLCBnZXRQb3NpdGlvbik7XG4gICAgfVxuXG4gICAgbGV0IGRhdGE7XG4gICAgaWYgKFxuICAgICAgb2xkTGF5ZXJEYXRhICYmXG4gICAgICBvbGRMYXllckRhdGEuZGF0YSAmJlxuICAgICAgb3B0LnNhbWVEYXRhICYmXG4gICAgICBvbGRMYXllckRhdGEuZ2V0UG9zaXRpb24gPT09IGdldFBvc2l0aW9uXG4gICAgKSB7XG4gICAgICBkYXRhID0gb2xkTGF5ZXJEYXRhLmRhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGEgPSBmaWx0ZXJlZEluZGV4LnJlZHVjZSgoYWNjdSwgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc3QgcG9zID0gZ2V0UG9zaXRpb24oe2RhdGE6IGFsbERhdGFbaW5kZXhdfSk7XG5cbiAgICAgICAgLy8gaWYgZG9lc24ndCBoYXZlIHBvaW50IGxhdCBvciBsbmcsIGRvIG5vdCBhZGQgdGhlIGFyY1xuICAgICAgICAvLyBkZWNrLmdsIGNhbid0IGhhbmRsZSBwb3NpdGlvbiA9PSBudWxsXG4gICAgICAgIGlmICghcG9zLmV2ZXJ5KE51bWJlci5pc0Zpbml0ZSkpIHtcbiAgICAgICAgICByZXR1cm4gYWNjdTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFjY3UucHVzaCh7XG4gICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgc291cmNlUG9zaXRpb246IFtwb3NbMF0sIHBvc1sxXSwgcG9zWzJdXSxcbiAgICAgICAgICB0YXJnZXRQb3NpdGlvbjogW3Bvc1szXSwgcG9zWzRdLCBwb3NbNV1dLFxuICAgICAgICAgIGRhdGE6IGFsbERhdGFbaW5kZXhdXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBhY2N1O1xuICAgICAgfSwgW10pO1xuICAgIH1cblxuICAgIGNvbnN0IGdldFN0cm9rZVdpZHRoID0gZCA9PlxuICAgICAgc1NjYWxlID8gdGhpcy5nZXRFbmNvZGVkQ2hhbm5lbFZhbHVlKHNTY2FsZSwgZC5kYXRhLCBzaXplRmllbGQpIDogMTtcblxuICAgIGNvbnN0IGdldENvbG9yID0gZCA9PlxuICAgICAgY1NjYWxlID8gdGhpcy5nZXRFbmNvZGVkQ2hhbm5lbFZhbHVlKGNTY2FsZSwgZC5kYXRhLCBjb2xvckZpZWxkKSA6IGNvbG9yO1xuXG4gICAgY29uc3QgZ2V0VGFyZ2V0Q29sb3IgPSBkID0+XG4gICAgICBjU2NhbGVcbiAgICAgICAgPyB0aGlzLmdldEVuY29kZWRDaGFubmVsVmFsdWUoY1NjYWxlLCBkLmRhdGEsIGNvbG9yRmllbGQpXG4gICAgICAgIDogdGFyZ2V0Q29sb3IgfHwgY29sb3I7XG5cbiAgICByZXR1cm4ge1xuICAgICAgZGF0YSxcbiAgICAgIGdldENvbG9yLFxuICAgICAgZ2V0U291cmNlQ29sb3I6IGdldENvbG9yLFxuICAgICAgZ2V0VGFyZ2V0Q29sb3IsXG4gICAgICBnZXRTdHJva2VXaWR0aFxuICAgIH07XG4gIH1cblxuICB1cGRhdGVMYXllck1ldGEoYWxsRGF0YSwgZ2V0UG9zaXRpb24pIHtcbiAgICAvLyBnZXQgYm91bmRzIGZyb20gYXJjc1xuICAgIGNvbnN0IHNCb3VuZHMgPSB0aGlzLmdldFBvaW50c0JvdW5kcyhhbGxEYXRhLCBkID0+IHtcbiAgICAgIGNvbnN0IHBvcyA9IGdldFBvc2l0aW9uKHtkYXRhOiBkfSk7XG4gICAgICByZXR1cm4gW3Bvc1swXSwgcG9zWzFdXTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHRCb3VuZHMgPSB0aGlzLmdldFBvaW50c0JvdW5kcyhhbGxEYXRhLCBkID0+IHtcbiAgICAgIGNvbnN0IHBvcyA9IGdldFBvc2l0aW9uKHtkYXRhOiBkfSk7XG4gICAgICByZXR1cm4gW3Bvc1szXSwgcG9zWzRdXTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGJvdW5kcyA9IFtcbiAgICAgIE1hdGgubWluKHNCb3VuZHNbMF0sIHRCb3VuZHNbMF0pLFxuICAgICAgTWF0aC5taW4oc0JvdW5kc1sxXSwgdEJvdW5kc1sxXSksXG4gICAgICBNYXRoLm1heChzQm91bmRzWzJdLCB0Qm91bmRzWzJdKSxcbiAgICAgIE1hdGgubWF4KHNCb3VuZHNbM10sIHRCb3VuZHNbM10pXG4gICAgXTtcblxuICAgIHRoaXMudXBkYXRlTWV0YSh7Ym91bmRzfSk7XG4gIH1cblxuICByZW5kZXJMYXllcih7XG4gICAgZGF0YSxcbiAgICBpZHgsXG4gICAgbGF5ZXJJbnRlcmFjdGlvbixcbiAgICBvYmplY3RIb3ZlcmVkLFxuICAgIG1hcFN0YXRlLFxuICAgIGludGVyYWN0aW9uQ29uZmlnXG4gIH0pIHtcbiAgICBjb25zdCB7YnJ1c2h9ID0gaW50ZXJhY3Rpb25Db25maWc7XG5cbiAgICBjb25zdCBjb2xvclVwZGF0ZVRyaWdnZXJzID0ge1xuICAgICAgY29sb3I6IHRoaXMuY29uZmlnLmNvbG9yLFxuICAgICAgY29sb3JGaWVsZDogdGhpcy5jb25maWcuY29sb3JGaWVsZCxcbiAgICAgIGNvbG9yUmFuZ2U6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5jb2xvclJhbmdlLFxuICAgICAgY29sb3JTY2FsZTogdGhpcy5jb25maWcuY29sb3JTY2FsZVxuICAgIH07XG5cbiAgICByZXR1cm4gW1xuICAgICAgLy8gYmFzZSBsYXllclxuICAgICAgbmV3IEFyY0JydXNoaW5nTGF5ZXIoe1xuICAgICAgICAuLi5sYXllckludGVyYWN0aW9uLFxuICAgICAgICAuLi5kYXRhLFxuICAgICAgICBpZDogdGhpcy5pZCxcbiAgICAgICAgaWR4LFxuICAgICAgICBicnVzaFJhZGl1czogYnJ1c2guY29uZmlnLnNpemUgKiAxMDAwLFxuICAgICAgICBicnVzaFNvdXJjZTogdHJ1ZSxcbiAgICAgICAgYnJ1c2hUYXJnZXQ6IHRydWUsXG4gICAgICAgIGVuYWJsZUJydXNoaW5nOiBicnVzaC5lbmFibGVkLFxuICAgICAgICBmcDY0OiB0aGlzLmNvbmZpZy52aXNDb25maWdbJ2hpLXByZWNpc2lvbiddLFxuICAgICAgICBvcGFjaXR5OiB0aGlzLmNvbmZpZy52aXNDb25maWcub3BhY2l0eSxcbiAgICAgICAgcGlja2FibGU6IHRydWUsXG4gICAgICAgIHBpY2tlZENvbG9yOiB0aGlzLmNvbmZpZy5oaWdobGlnaHRDb2xvcixcbiAgICAgICAgc3Ryb2tlU2NhbGU6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy50aGlja25lc3MsXG4gICAgICAgIHVwZGF0ZVRyaWdnZXJzOiB7XG4gICAgICAgICAgZ2V0U3Ryb2tlV2lkdGg6IHtcbiAgICAgICAgICAgIHNpemVGaWVsZDogdGhpcy5jb25maWcuc2l6ZUZpZWxkLFxuICAgICAgICAgICAgc2l6ZVJhbmdlOiB0aGlzLmNvbmZpZy52aXNDb25maWcuc2l6ZVJhbmdlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRDb2xvcjogY29sb3JVcGRhdGVUcmlnZ2VycyxcbiAgICAgICAgICBnZXRTb3VyY2VDb2xvcjogY29sb3JVcGRhdGVUcmlnZ2VycyxcbiAgICAgICAgICBnZXRUYXJnZXRDb2xvcjogY29sb3JVcGRhdGVUcmlnZ2Vyc1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIF07XG4gIH1cbn1cbiJdfQ==
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXBsZXJnbC1sYXllcnMvYXJjLWxheWVyL2FyYy1sYXllci5qcyJdLCJuYW1lcyI6WyJhcmNQb3NBY2Nlc3NvciIsImxhdDAiLCJsbmcwIiwibGF0MSIsImxuZzEiLCJkIiwiZGF0YSIsImZpZWxkSWR4IiwiYXJjUG9zUmVzb2x2ZXIiLCJhcmNSZXF1aXJlZENvbHVtbnMiLCJhcmN0VmlzQ29uZmlncyIsIm9wYWNpdHkiLCJ0aGlja25lc3MiLCJjb2xvclJhbmdlIiwic2l6ZVJhbmdlIiwidGFyZ2V0Q29sb3IiLCJBcmNMYXllciIsInByb3BzIiwicmVnaXN0ZXJWaXNDb25maWciLCJnZXRQb3NpdGlvbiIsImZvcm1hdExheWVyRGF0YSIsIl8iLCJhbGxEYXRhIiwiZmlsdGVyZWRJbmRleCIsIm9sZExheWVyRGF0YSIsIm9wdCIsImNvbmZpZyIsImNvbG9yU2NhbGUiLCJjb2xvckRvbWFpbiIsImNvbG9yRmllbGQiLCJjb2xvciIsImNvbHVtbnMiLCJzaXplRmllbGQiLCJzaXplU2NhbGUiLCJzaXplRG9tYWluIiwidmlzQ29uZmlnIiwiY1NjYWxlIiwiZ2V0VmlzQ2hhbm5lbFNjYWxlIiwiY29sb3JzIiwibWFwIiwic1NjYWxlIiwidXBkYXRlTGF5ZXJNZXRhIiwic2FtZURhdGEiLCJyZWR1Y2UiLCJhY2N1IiwiaW5kZXgiLCJwb3MiLCJldmVyeSIsIk51bWJlciIsImlzRmluaXRlIiwicHVzaCIsInNvdXJjZVBvc2l0aW9uIiwidGFyZ2V0UG9zaXRpb24iLCJnZXRTdHJva2VXaWR0aCIsImdldEVuY29kZWRDaGFubmVsVmFsdWUiLCJnZXRDb2xvciIsImdldFRhcmdldENvbG9yIiwiZ2V0U291cmNlQ29sb3IiLCJzQm91bmRzIiwiZ2V0UG9pbnRzQm91bmRzIiwidEJvdW5kcyIsImJvdW5kcyIsIk1hdGgiLCJtaW4iLCJtYXgiLCJ1cGRhdGVNZXRhIiwicmVuZGVyTGF5ZXIiLCJpZHgiLCJsYXllckludGVyYWN0aW9uIiwib2JqZWN0SG92ZXJlZCIsIm1hcFN0YXRlIiwiaW50ZXJhY3Rpb25Db25maWciLCJicnVzaCIsImNvbG9yVXBkYXRlVHJpZ2dlcnMiLCJpZCIsImJydXNoUmFkaXVzIiwic2l6ZSIsImJydXNoU291cmNlIiwiYnJ1c2hUYXJnZXQiLCJlbmFibGVCcnVzaGluZyIsImVuYWJsZWQiLCJmcDY0IiwicGlja2FibGUiLCJwaWNrZWRDb2xvciIsImhpZ2hsaWdodENvbG9yIiwic3Ryb2tlU2NhbGUiLCJ1cGRhdGVUcmlnZ2VycyIsImRlZmF1bHRMaW5rQ29sdW1uUGFpcnMiLCJ2aXN1YWxDaGFubmVscyIsInByb3BlcnR5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVPLElBQU1BLDBDQUFpQixTQUFqQkEsY0FBaUI7QUFBQSxNQUFFQyxJQUFGLFFBQUVBLElBQUY7QUFBQSxNQUFRQyxJQUFSLFFBQVFBLElBQVI7QUFBQSxNQUFjQyxJQUFkLFFBQWNBLElBQWQ7QUFBQSxNQUFvQkMsSUFBcEIsUUFBb0JBLElBQXBCO0FBQUEsU0FBOEI7QUFBQSxXQUFLLENBQy9EQyxFQUFFQyxJQUFGLENBQU9KLEtBQUtLLFFBQVosQ0FEK0QsRUFFL0RGLEVBQUVDLElBQUYsQ0FBT0wsS0FBS00sUUFBWixDQUYrRCxFQUcvRCxDQUgrRCxFQUkvREYsRUFBRUMsSUFBRixDQUFPRixLQUFLRyxRQUFaLENBSitELEVBSy9ERixFQUFFQyxJQUFGLENBQU9ILEtBQUtJLFFBQVosQ0FMK0QsRUFNL0QsQ0FOK0QsQ0FBTDtBQUFBLEdBQTlCO0FBQUEsQ0FBdkI7O0FBU0EsSUFBTUMsMENBQWlCLFNBQWpCQSxjQUFpQjtBQUFBLE1BQUVQLElBQUYsU0FBRUEsSUFBRjtBQUFBLE1BQVFDLElBQVIsU0FBUUEsSUFBUjtBQUFBLE1BQWNDLElBQWQsU0FBY0EsSUFBZDtBQUFBLE1BQW9CQyxJQUFwQixTQUFvQkEsSUFBcEI7QUFBQSxTQUN6QkgsS0FBS00sUUFEb0IsU0FDUkwsS0FBS0ssUUFERyxTQUNTSixLQUFLSSxRQURkLFNBQzBCSixLQUFLSSxRQUQvQjtBQUFBLENBQXZCOztBQUdBLElBQU1FLGtEQUFxQixDQUFDLE1BQUQsRUFBUyxNQUFULEVBQWlCLE1BQWpCLEVBQXlCLE1BQXpCLENBQTNCOztBQUVBLElBQU1DLDBDQUFpQjtBQUM1QkMsV0FBUyxTQURtQjtBQUU1QkMsYUFBVyxXQUZpQjtBQUc1QkMsY0FBWSxZQUhnQjtBQUk1QkMsYUFBVyxrQkFKaUI7QUFLNUJDLGVBQWEsYUFMZTtBQU01QixrQkFBZ0I7QUFOWSxDQUF2Qjs7SUFTY0MsUTs7O0FBQ25CLG9CQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsK0RBQ2pCLGtCQUFNQSxLQUFOLENBRGlCOztBQUVqQixVQUFLQyxpQkFBTCxDQUF1QlIsY0FBdkI7QUFDQSxVQUFLUyxXQUFMLEdBQW1CLHNCQUFRbkIsY0FBUixFQUF3QlEsY0FBeEIsQ0FBbkI7QUFIaUI7QUFJbEI7O3FCQTRCRFksZSw0QkFBZ0JDLEMsRUFBR0MsTyxFQUFTQyxhLEVBQWVDLFksRUFBd0I7QUFBQTs7QUFBQSxRQUFWQyxHQUFVLHVFQUFKLEVBQUk7QUFBQSxrQkFFWixLQUFLQyxNQUZPO0FBQUEsUUFDMURDLFVBRDBELFdBQzFEQSxVQUQwRDtBQUFBLFFBQzlDQyxXQUQ4QyxXQUM5Q0EsV0FEOEM7QUFBQSxRQUNqQ0MsVUFEaUMsV0FDakNBLFVBRGlDO0FBQUEsUUFDckJDLEtBRHFCLFdBQ3JCQSxLQURxQjtBQUFBLFFBQ2RDLE9BRGMsV0FDZEEsT0FEYztBQUFBLFFBQ0xDLFNBREssV0FDTEEsU0FESztBQUFBLFFBQ01DLFNBRE4sV0FDTUEsU0FETjtBQUFBLFFBQ2lCQyxVQURqQixXQUNpQkEsVUFEakI7QUFBQSxvQ0FFL0RDLFNBRitEO0FBQUEsUUFFbkRyQixTQUZtRCxxQkFFbkRBLFNBRm1EO0FBQUEsUUFFeENELFVBRndDLHFCQUV4Q0EsVUFGd0M7QUFBQSxRQUU1QkUsV0FGNEIscUJBRTVCQSxXQUY0Qjs7QUFJakU7O0FBQ0EsUUFBTXFCLFNBQVNQLGNBQWMsS0FBS1Esa0JBQUwsQ0FDM0JWLFVBRDJCLEVBRTNCQyxXQUYyQixFQUczQmYsV0FBV3lCLE1BQVgsQ0FBa0JDLEdBQWxCLHNCQUgyQixDQUE3Qjs7QUFNQTtBQUNBLFFBQU1DLFNBQVNSLGFBQWEsS0FBS0ssa0JBQUwsQ0FDMUJKLFNBRDBCLEVBRTFCQyxVQUYwQixFQUcxQnBCLFNBSDBCLENBQTVCOztBQU1BLFFBQU1LLGNBQWMsS0FBS0EsV0FBTCxDQUFpQlksT0FBakIsQ0FBcEI7O0FBRUEsUUFBSSxDQUFDUCxZQUFELElBQWlCQSxhQUFhTCxXQUFiLEtBQTZCQSxXQUFsRCxFQUErRDtBQUM3RCxXQUFLc0IsZUFBTCxDQUFxQm5CLE9BQXJCLEVBQThCSCxXQUE5QjtBQUNEOztBQUVELFFBQUliLGFBQUo7QUFDQSxRQUFJa0IsZ0JBQWdCQSxhQUFhbEIsSUFBN0IsSUFBcUNtQixJQUFJaUIsUUFBekMsSUFDQ2xCLGFBQWFMLFdBQWIsS0FBNkJBLFdBRGxDLEVBQytDO0FBQzdDYixhQUFPa0IsYUFBYWxCLElBQXBCO0FBQ0QsS0FIRCxNQUdPO0FBQ0xBLGFBQU9pQixjQUFjb0IsTUFBZCxDQUFxQixVQUFDQyxJQUFELEVBQU9DLEtBQVAsRUFBaUI7QUFDM0MsWUFBTUMsTUFBTTNCLFlBQVksRUFBQ2IsTUFBTWdCLFFBQVF1QixLQUFSLENBQVAsRUFBWixDQUFaOztBQUVBO0FBQ0E7QUFDQSxZQUFJLENBQUNDLElBQUlDLEtBQUosQ0FBVUMsT0FBT0MsUUFBakIsQ0FBTCxFQUFpQztBQUMvQixpQkFBT0wsSUFBUDtBQUNEOztBQUVEQSxhQUFLTSxJQUFMLENBQVU7QUFDUkwsc0JBRFE7QUFFUk0sMEJBQWdCLENBQUNMLElBQUksQ0FBSixDQUFELEVBQVNBLElBQUksQ0FBSixDQUFULEVBQWlCQSxJQUFJLENBQUosQ0FBakIsQ0FGUjtBQUdSTSwwQkFBZ0IsQ0FBQ04sSUFBSSxDQUFKLENBQUQsRUFBU0EsSUFBSSxDQUFKLENBQVQsRUFBaUJBLElBQUksQ0FBSixDQUFqQixDQUhSO0FBSVJ4QyxnQkFBTWdCLFFBQVF1QixLQUFSO0FBSkUsU0FBVjs7QUFPQSxlQUFPRCxJQUFQO0FBQ0QsT0FqQk0sRUFpQkosRUFqQkksQ0FBUDtBQWtCRDs7QUFFRCxRQUFNUyxpQkFBaUIsU0FBakJBLGNBQWlCO0FBQUEsYUFBS2IsU0FDMUIsT0FBS2Msc0JBQUwsQ0FBNEJkLE1BQTVCLEVBQW9DbkMsRUFBRUMsSUFBdEMsRUFBNEMwQixTQUE1QyxDQUQwQixHQUMrQixDQURwQztBQUFBLEtBQXZCOztBQUdBLFFBQU11QixXQUFXLFNBQVhBLFFBQVc7QUFBQSxhQUFLbkIsU0FDcEIsT0FBS2tCLHNCQUFMLENBQTRCbEIsTUFBNUIsRUFBb0MvQixFQUFFQyxJQUF0QyxFQUE0Q3VCLFVBQTVDLENBRG9CLEdBQ3NDQyxLQUQzQztBQUFBLEtBQWpCOztBQUdBLFFBQU0wQixpQkFBaUIsU0FBakJBLGNBQWlCO0FBQUEsYUFBS3BCLFNBQzFCLE9BQUtrQixzQkFBTCxDQUE0QmxCLE1BQTVCLEVBQW9DL0IsRUFBRUMsSUFBdEMsRUFBNEN1QixVQUE1QyxDQUQwQixHQUNpQ2QsZUFBZWUsS0FEckQ7QUFBQSxLQUF2Qjs7QUFHQSxXQUFPO0FBQ0x4QixnQkFESztBQUVMaUQsd0JBRks7QUFHTEUsc0JBQWdCRixRQUhYO0FBSUxDLG9DQUpLO0FBS0xIO0FBTEssS0FBUDtBQU9ELEc7O3FCQUVEWixlLDRCQUFnQm5CLE8sRUFBU0gsVyxFQUFhO0FBQ3BDO0FBQ0EsUUFBTXVDLFVBQVUsS0FBS0MsZUFBTCxDQUFxQnJDLE9BQXJCLEVBQThCLGFBQUs7QUFDakQsVUFBTXdCLE1BQU0zQixZQUFZLEVBQUNiLE1BQU1ELENBQVAsRUFBWixDQUFaO0FBQ0EsYUFBTyxDQUFDeUMsSUFBSSxDQUFKLENBQUQsRUFBU0EsSUFBSSxDQUFKLENBQVQsQ0FBUDtBQUNELEtBSGUsQ0FBaEI7O0FBS0EsUUFBTWMsVUFBVSxLQUFLRCxlQUFMLENBQXFCckMsT0FBckIsRUFBOEIsYUFBSztBQUNqRCxVQUFNd0IsTUFBTTNCLFlBQVksRUFBQ2IsTUFBTUQsQ0FBUCxFQUFaLENBQVo7QUFDQSxhQUFPLENBQUN5QyxJQUFJLENBQUosQ0FBRCxFQUFTQSxJQUFJLENBQUosQ0FBVCxDQUFQO0FBQ0QsS0FIZSxDQUFoQjs7QUFLQSxRQUFNZSxTQUFTLENBQ2JDLEtBQUtDLEdBQUwsQ0FBU0wsUUFBUSxDQUFSLENBQVQsRUFBcUJFLFFBQVEsQ0FBUixDQUFyQixDQURhLEVBRWJFLEtBQUtDLEdBQUwsQ0FBU0wsUUFBUSxDQUFSLENBQVQsRUFBcUJFLFFBQVEsQ0FBUixDQUFyQixDQUZhLEVBR2JFLEtBQUtFLEdBQUwsQ0FBU04sUUFBUSxDQUFSLENBQVQsRUFBcUJFLFFBQVEsQ0FBUixDQUFyQixDQUhhLEVBSWJFLEtBQUtFLEdBQUwsQ0FBU04sUUFBUSxDQUFSLENBQVQsRUFBcUJFLFFBQVEsQ0FBUixDQUFyQixDQUphLENBQWY7O0FBT0EsU0FBS0ssVUFBTCxDQUFnQixFQUFDSixjQUFELEVBQWhCO0FBQ0QsRzs7cUJBRURLLFcsK0JBQXVGO0FBQUEsUUFBMUU1RCxJQUEwRSxTQUExRUEsSUFBMEU7QUFBQSxRQUFwRTZELEdBQW9FLFNBQXBFQSxHQUFvRTtBQUFBLFFBQS9EQyxnQkFBK0QsU0FBL0RBLGdCQUErRDtBQUFBLFFBQTdDQyxhQUE2QyxTQUE3Q0EsYUFBNkM7QUFBQSxRQUE5QkMsUUFBOEIsU0FBOUJBLFFBQThCO0FBQUEsUUFBcEJDLGlCQUFvQixTQUFwQkEsaUJBQW9CO0FBQUEsUUFDOUVDLEtBRDhFLEdBQ3JFRCxpQkFEcUUsQ0FDOUVDLEtBRDhFOzs7QUFHckYsUUFBTUMsc0JBQXNCO0FBQzFCM0MsYUFBTyxLQUFLSixNQUFMLENBQVlJLEtBRE87QUFFMUJELGtCQUFZLEtBQUtILE1BQUwsQ0FBWUcsVUFGRTtBQUcxQmhCLGtCQUFZLEtBQUthLE1BQUwsQ0FBWVMsU0FBWixDQUFzQnRCLFVBSFI7QUFJMUJjLGtCQUFZLEtBQUtELE1BQUwsQ0FBWUM7QUFKRSxLQUE1Qjs7QUFPQSxXQUFPO0FBQ0w7QUFDQSw4REFDS3lDLGdCQURMLEVBRUs5RCxJQUZMO0FBR0VvRSxVQUFJLEtBQUtBLEVBSFg7QUFJRVAsY0FKRjtBQUtFUSxtQkFBYUgsTUFBTTlDLE1BQU4sQ0FBYWtELElBQWIsR0FBb0IsSUFMbkM7QUFNRUMsbUJBQWEsSUFOZjtBQU9FQyxtQkFBYSxJQVBmO0FBUUVDLHNCQUFnQlAsTUFBTVEsT0FSeEI7QUFTRUMsWUFBTSxLQUFLdkQsTUFBTCxDQUFZUyxTQUFaLENBQXNCLGNBQXRCLENBVFI7QUFVRXhCLGVBQVMsS0FBS2UsTUFBTCxDQUFZUyxTQUFaLENBQXNCeEIsT0FWakM7QUFXRXVFLGdCQUFVLElBWFo7QUFZRUMsbUJBQWEsS0FBS3pELE1BQUwsQ0FBWTBELGNBWjNCO0FBYUVDLG1CQUFhLEtBQUszRCxNQUFMLENBQVlTLFNBQVosQ0FBc0J2QixTQWJyQztBQWNFMEUsc0JBQWdCO0FBQ2RqQyx3QkFBZ0I7QUFDZHJCLHFCQUFXLEtBQUtOLE1BQUwsQ0FBWU0sU0FEVDtBQUVkbEIscUJBQVcsS0FBS1ksTUFBTCxDQUFZUyxTQUFaLENBQXNCckI7QUFGbkIsU0FERjtBQUtkeUMsa0JBQVVrQixtQkFMSTtBQU1kaEIsd0JBQWdCZ0IsbUJBTkY7QUFPZGpCLHdCQUFnQmlCO0FBUEY7QUFkbEIsT0FGSyxDQUFQO0FBMkJELEc7Ozs7d0JBeEpVO0FBQ1QsYUFBTyxLQUFQO0FBQ0Q7Ozt3QkFFa0I7QUFDakIsYUFBTyxLQUFQO0FBQ0Q7Ozt3QkFFMEI7QUFDekIsYUFBT2hFLGtCQUFQO0FBQ0Q7Ozt3QkFFaUI7QUFDaEIsYUFBTyxLQUFLOEUsc0JBQVo7QUFDRDs7O3dCQUVvQjtBQUNuQix3Q0FDSyxpQkFBTUMsY0FEWDtBQUVFWix5Q0FDSyxpQkFBTVksY0FBTixDQUFxQlosSUFEMUI7QUFFRWEsb0JBQVU7QUFGWjtBQUZGO0FBT0Q7Ozs7O2tCQS9Ca0J6RSxRIiwiZmlsZSI6ImFyYy1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtZW1vaXplIGZyb20gJ2xvZGFzaC5tZW1vaXplJztcblxuaW1wb3J0IExheWVyIGZyb20gJy4uL2Jhc2UtbGF5ZXInO1xuaW1wb3J0IEFyY0JydXNoaW5nTGF5ZXIgZnJvbSAnLi4vLi4vZGVja2dsLWxheWVycy9hcmMtYnJ1c2hpbmctbGF5ZXIvYXJjLWJydXNoaW5nLWxheWVyJztcbmltcG9ydCB7aGV4VG9SZ2J9IGZyb20gJy4uLy4uL3V0aWxzL2NvbG9yLXV0aWxzJztcblxuZXhwb3J0IGNvbnN0IGFyY1Bvc0FjY2Vzc29yID0gKHtsYXQwLCBsbmcwLCBsYXQxLCBsbmcxfSkgPT4gZCA9PiBbXG4gIGQuZGF0YVtsbmcwLmZpZWxkSWR4XSxcbiAgZC5kYXRhW2xhdDAuZmllbGRJZHhdLFxuICAwLFxuICBkLmRhdGFbbG5nMS5maWVsZElkeF0sXG4gIGQuZGF0YVtsYXQxLmZpZWxkSWR4XSxcbiAgMFxuXTtcblxuZXhwb3J0IGNvbnN0IGFyY1Bvc1Jlc29sdmVyID0gKHtsYXQwLCBsbmcwLCBsYXQxLCBsbmcxfSkgPT5cbiAgYCR7bGF0MC5maWVsZElkeH0tJHtsbmcwLmZpZWxkSWR4fS0ke2xhdDEuZmllbGRJZHh9LSR7bGF0MS5maWVsZElkeH19YDtcblxuZXhwb3J0IGNvbnN0IGFyY1JlcXVpcmVkQ29sdW1ucyA9IFsnbGF0MCcsICdsbmcwJywgJ2xhdDEnLCAnbG5nMSddO1xuXG5leHBvcnQgY29uc3QgYXJjdFZpc0NvbmZpZ3MgPSB7XG4gIG9wYWNpdHk6ICdvcGFjaXR5JyxcbiAgdGhpY2tuZXNzOiAndGhpY2tuZXNzJyxcbiAgY29sb3JSYW5nZTogJ2NvbG9yUmFuZ2UnLFxuICBzaXplUmFuZ2U6ICdzdHJva2VXaWR0aFJhbmdlJyxcbiAgdGFyZ2V0Q29sb3I6ICd0YXJnZXRDb2xvcicsXG4gICdoaS1wcmVjaXNpb24nOiAnaGktcHJlY2lzaW9uJ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXJjTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMucmVnaXN0ZXJWaXNDb25maWcoYXJjdFZpc0NvbmZpZ3MpO1xuICAgIHRoaXMuZ2V0UG9zaXRpb24gPSBtZW1vaXplKGFyY1Bvc0FjY2Vzc29yLCBhcmNQb3NSZXNvbHZlcik7XG4gIH1cblxuICBnZXQgdHlwZSgpIHtcbiAgICByZXR1cm4gJ2FyYyc7XG4gIH1cblxuICBnZXQgaXNBZ2dyZWdhdGVkKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldCByZXF1aXJlZExheWVyQ29sdW1ucygpIHtcbiAgICByZXR1cm4gYXJjUmVxdWlyZWRDb2x1bW5zO1xuICB9XG5cbiAgZ2V0IGNvbHVtblBhaXJzKCkge1xuICAgIHJldHVybiB0aGlzLmRlZmF1bHRMaW5rQ29sdW1uUGFpcnM7XG4gIH1cblxuICBnZXQgdmlzdWFsQ2hhbm5lbHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN1cGVyLnZpc3VhbENoYW5uZWxzLFxuICAgICAgc2l6ZToge1xuICAgICAgICAuLi5zdXBlci52aXN1YWxDaGFubmVscy5zaXplLFxuICAgICAgICBwcm9wZXJ0eTogJ3N0cm9rZSdcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgZm9ybWF0TGF5ZXJEYXRhKF8sIGFsbERhdGEsIGZpbHRlcmVkSW5kZXgsIG9sZExheWVyRGF0YSwgb3B0ID0ge30pIHtcbiAgICBjb25zdCB7Y29sb3JTY2FsZSwgY29sb3JEb21haW4sIGNvbG9yRmllbGQsIGNvbG9yLCBjb2x1bW5zLCBzaXplRmllbGQsIHNpemVTY2FsZSwgc2l6ZURvbWFpbixcbiAgICAgIHZpc0NvbmZpZzoge3NpemVSYW5nZSwgY29sb3JSYW5nZSwgdGFyZ2V0Q29sb3J9fSA9IHRoaXMuY29uZmlnO1xuXG4gICAgLy8gYXJjIGNvbG9yXG4gICAgY29uc3QgY1NjYWxlID0gY29sb3JGaWVsZCAmJiB0aGlzLmdldFZpc0NoYW5uZWxTY2FsZShcbiAgICAgIGNvbG9yU2NhbGUsXG4gICAgICBjb2xvckRvbWFpbixcbiAgICAgIGNvbG9yUmFuZ2UuY29sb3JzLm1hcChoZXhUb1JnYilcbiAgICApO1xuXG4gICAgLy8gYXJjIHRoaWNrbmVzc1xuICAgIGNvbnN0IHNTY2FsZSA9IHNpemVGaWVsZCAmJiB0aGlzLmdldFZpc0NoYW5uZWxTY2FsZShcbiAgICAgIHNpemVTY2FsZSxcbiAgICAgIHNpemVEb21haW4sXG4gICAgICBzaXplUmFuZ2VcbiAgICApO1xuXG4gICAgY29uc3QgZ2V0UG9zaXRpb24gPSB0aGlzLmdldFBvc2l0aW9uKGNvbHVtbnMpO1xuXG4gICAgaWYgKCFvbGRMYXllckRhdGEgfHwgb2xkTGF5ZXJEYXRhLmdldFBvc2l0aW9uICE9PSBnZXRQb3NpdGlvbikge1xuICAgICAgdGhpcy51cGRhdGVMYXllck1ldGEoYWxsRGF0YSwgZ2V0UG9zaXRpb24pO1xuICAgIH1cblxuICAgIGxldCBkYXRhO1xuICAgIGlmIChvbGRMYXllckRhdGEgJiYgb2xkTGF5ZXJEYXRhLmRhdGEgJiYgb3B0LnNhbWVEYXRhXG4gICAgICAmJiBvbGRMYXllckRhdGEuZ2V0UG9zaXRpb24gPT09IGdldFBvc2l0aW9uKSB7XG4gICAgICBkYXRhID0gb2xkTGF5ZXJEYXRhLmRhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGEgPSBmaWx0ZXJlZEluZGV4LnJlZHVjZSgoYWNjdSwgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc3QgcG9zID0gZ2V0UG9zaXRpb24oe2RhdGE6IGFsbERhdGFbaW5kZXhdfSk7XG5cbiAgICAgICAgLy8gaWYgZG9lc24ndCBoYXZlIHBvaW50IGxhdCBvciBsbmcsIGRvIG5vdCBhZGQgdGhlIGFyY1xuICAgICAgICAvLyBkZWNrLmdsIGNhbid0IGhhbmRsZSBwb3NpdGlvbiA9PSBudWxsXG4gICAgICAgIGlmICghcG9zLmV2ZXJ5KE51bWJlci5pc0Zpbml0ZSkpIHtcbiAgICAgICAgICByZXR1cm4gYWNjdTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFjY3UucHVzaCh7XG4gICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgc291cmNlUG9zaXRpb246IFtwb3NbMF0sIHBvc1sxXSwgcG9zWzJdXSxcbiAgICAgICAgICB0YXJnZXRQb3NpdGlvbjogW3Bvc1szXSwgcG9zWzRdLCBwb3NbNV1dLFxuICAgICAgICAgIGRhdGE6IGFsbERhdGFbaW5kZXhdXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBhY2N1O1xuICAgICAgfSwgW10pO1xuICAgIH1cblxuICAgIGNvbnN0IGdldFN0cm9rZVdpZHRoID0gZCA9PiBzU2NhbGUgP1xuICAgICAgdGhpcy5nZXRFbmNvZGVkQ2hhbm5lbFZhbHVlKHNTY2FsZSwgZC5kYXRhLCBzaXplRmllbGQpIDogMTtcblxuICAgIGNvbnN0IGdldENvbG9yID0gZCA9PiBjU2NhbGUgP1xuICAgICAgdGhpcy5nZXRFbmNvZGVkQ2hhbm5lbFZhbHVlKGNTY2FsZSwgZC5kYXRhLCBjb2xvckZpZWxkKSA6IGNvbG9yO1xuXG4gICAgY29uc3QgZ2V0VGFyZ2V0Q29sb3IgPSBkID0+IGNTY2FsZSA/XG4gICAgICB0aGlzLmdldEVuY29kZWRDaGFubmVsVmFsdWUoY1NjYWxlLCBkLmRhdGEsIGNvbG9yRmllbGQpIDogKHRhcmdldENvbG9yIHx8IGNvbG9yKTtcblxuICAgIHJldHVybiB7XG4gICAgICBkYXRhLFxuICAgICAgZ2V0Q29sb3IsXG4gICAgICBnZXRTb3VyY2VDb2xvcjogZ2V0Q29sb3IsXG4gICAgICBnZXRUYXJnZXRDb2xvcixcbiAgICAgIGdldFN0cm9rZVdpZHRoXG4gICAgfTtcbiAgfVxuXG4gIHVwZGF0ZUxheWVyTWV0YShhbGxEYXRhLCBnZXRQb3NpdGlvbikge1xuICAgIC8vIGdldCBib3VuZHMgZnJvbSBhcmNzXG4gICAgY29uc3Qgc0JvdW5kcyA9IHRoaXMuZ2V0UG9pbnRzQm91bmRzKGFsbERhdGEsIGQgPT4ge1xuICAgICAgY29uc3QgcG9zID0gZ2V0UG9zaXRpb24oe2RhdGE6IGR9KTtcbiAgICAgIHJldHVybiBbcG9zWzBdLCBwb3NbMV1dO1xuICAgIH0pO1xuXG4gICAgY29uc3QgdEJvdW5kcyA9IHRoaXMuZ2V0UG9pbnRzQm91bmRzKGFsbERhdGEsIGQgPT4ge1xuICAgICAgY29uc3QgcG9zID0gZ2V0UG9zaXRpb24oe2RhdGE6IGR9KTtcbiAgICAgIHJldHVybiBbcG9zWzNdLCBwb3NbNF1dO1xuICAgIH0pO1xuXG4gICAgY29uc3QgYm91bmRzID0gW1xuICAgICAgTWF0aC5taW4oc0JvdW5kc1swXSwgdEJvdW5kc1swXSksXG4gICAgICBNYXRoLm1pbihzQm91bmRzWzFdLCB0Qm91bmRzWzFdKSxcbiAgICAgIE1hdGgubWF4KHNCb3VuZHNbMl0sIHRCb3VuZHNbMl0pLFxuICAgICAgTWF0aC5tYXgoc0JvdW5kc1szXSwgdEJvdW5kc1szXSlcbiAgICBdO1xuXG4gICAgdGhpcy51cGRhdGVNZXRhKHtib3VuZHN9KTtcbiAgfVxuXG4gIHJlbmRlckxheWVyKHtkYXRhLCBpZHgsIGxheWVySW50ZXJhY3Rpb24sIG9iamVjdEhvdmVyZWQsIG1hcFN0YXRlLCBpbnRlcmFjdGlvbkNvbmZpZ30pIHtcbiAgICBjb25zdCB7YnJ1c2h9ID0gaW50ZXJhY3Rpb25Db25maWc7XG5cbiAgICBjb25zdCBjb2xvclVwZGF0ZVRyaWdnZXJzID0ge1xuICAgICAgY29sb3I6IHRoaXMuY29uZmlnLmNvbG9yLFxuICAgICAgY29sb3JGaWVsZDogdGhpcy5jb25maWcuY29sb3JGaWVsZCxcbiAgICAgIGNvbG9yUmFuZ2U6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5jb2xvclJhbmdlLFxuICAgICAgY29sb3JTY2FsZTogdGhpcy5jb25maWcuY29sb3JTY2FsZVxuICAgIH07XG5cbiAgICByZXR1cm4gW1xuICAgICAgLy8gYmFzZSBsYXllclxuICAgICAgbmV3IEFyY0JydXNoaW5nTGF5ZXIoe1xuICAgICAgICAuLi5sYXllckludGVyYWN0aW9uLFxuICAgICAgICAuLi5kYXRhLFxuICAgICAgICBpZDogdGhpcy5pZCxcbiAgICAgICAgaWR4LFxuICAgICAgICBicnVzaFJhZGl1czogYnJ1c2guY29uZmlnLnNpemUgKiAxMDAwLFxuICAgICAgICBicnVzaFNvdXJjZTogdHJ1ZSxcbiAgICAgICAgYnJ1c2hUYXJnZXQ6IHRydWUsXG4gICAgICAgIGVuYWJsZUJydXNoaW5nOiBicnVzaC5lbmFibGVkLFxuICAgICAgICBmcDY0OiB0aGlzLmNvbmZpZy52aXNDb25maWdbJ2hpLXByZWNpc2lvbiddLFxuICAgICAgICBvcGFjaXR5OiB0aGlzLmNvbmZpZy52aXNDb25maWcub3BhY2l0eSxcbiAgICAgICAgcGlja2FibGU6IHRydWUsXG4gICAgICAgIHBpY2tlZENvbG9yOiB0aGlzLmNvbmZpZy5oaWdobGlnaHRDb2xvcixcbiAgICAgICAgc3Ryb2tlU2NhbGU6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy50aGlja25lc3MsXG4gICAgICAgIHVwZGF0ZVRyaWdnZXJzOiB7XG4gICAgICAgICAgZ2V0U3Ryb2tlV2lkdGg6IHtcbiAgICAgICAgICAgIHNpemVGaWVsZDogdGhpcy5jb25maWcuc2l6ZUZpZWxkLFxuICAgICAgICAgICAgc2l6ZVJhbmdlOiB0aGlzLmNvbmZpZy52aXNDb25maWcuc2l6ZVJhbmdlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRDb2xvcjogY29sb3JVcGRhdGVUcmlnZ2VycyxcbiAgICAgICAgICBnZXRTb3VyY2VDb2xvcjogY29sb3JVcGRhdGVUcmlnZ2VycyxcbiAgICAgICAgICBnZXRUYXJnZXRDb2xvcjogY29sb3JVcGRhdGVUcmlnZ2Vyc1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIF07XG4gIH1cbn1cbiJdfQ==
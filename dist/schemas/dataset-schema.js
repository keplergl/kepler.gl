'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _datasetSchema;

var _lodash = require('lodash.pick');

var _lodash2 = _interopRequireDefault(_lodash);

var _window = require('global/window');

var _versions = require('./versions');

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

var _dataUtils = require('../utils/data-utils');

var _dataProcessor = require('../processor/data-processor');

var _defaultSettings = require('../constants/default-settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// version v0
var fieldPropertiesV0 = {
  name: null,
  type: null
};

var fieldPropertiesV1 = {
  name: null,
  type: null,
  format: null
};

var FieldSchema = function (_Schema) {
  (0, _inherits3.default)(FieldSchema, _Schema);

  function FieldSchema() {
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, FieldSchema);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Schema.call.apply(_Schema, [this].concat(args))), _this), _this.key = 'fields', _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  FieldSchema.prototype.save = function save(fields) {
    var _this2 = this,
        _ref;

    return _ref = {}, _ref[this.key] = fields.map(function (f) {
      return _this2.savePropertiesOrApplySchema(f)[_this2.key];
    }), _ref;
  };

  FieldSchema.prototype.load = function load(fields) {
    var _ref2;

    return _ref2 = {}, _ref2[this.key] = fields, _ref2;
  };

  return FieldSchema;
}(_schema2.default);

var propertiesV0 = {
  id: null,
  label: null,
  color: null,
  allData: null,
  fields: new FieldSchema({
    version: _versions.VERSIONS.v0,
    properties: fieldPropertiesV0
  })
};

var propertiesV1 = (0, _extends3.default)({}, propertiesV0, {
  fields: new FieldSchema({
    version: _versions.VERSIONS.v1,
    properties: fieldPropertiesV1
  })
});

var DatasetSchema = function (_Schema2) {
  (0, _inherits3.default)(DatasetSchema, _Schema2);

  function DatasetSchema() {
    var _temp2, _this3, _ret2;

    (0, _classCallCheck3.default)(this, DatasetSchema);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp2 = (_this3 = (0, _possibleConstructorReturn3.default)(this, _Schema2.call.apply(_Schema2, [this].concat(args))), _this3), _this3.key = 'dataset', _temp2), (0, _possibleConstructorReturn3.default)(_this3, _ret2);
  }

  DatasetSchema.prototype.save = function save(dataset) {
    return this.savePropertiesOrApplySchema(dataset)[this.key];
  };

  DatasetSchema.prototype.load = function load(dataset) {
    var fields = dataset.fields,
        allData = dataset.allData;

    var updatedFields = fields;

    // recalculate field type
    // because we have updated type-analyzer
    // we need to add format to each field
    var needCalculateMeta = !fields[0].format;

    if (needCalculateMeta) {
      var fieldOrder = fields.map(function (f) {
        return f.name;
      });

      var sampleData = (0, _dataUtils.getSampleForTypeAnalyze)({ fields: fields, allData: allData });
      var meta = (0, _dataProcessor.getFieldsFromData)(sampleData, fieldOrder);

      updatedFields = fields.map(function (f, i) {
        return (0, _extends3.default)({}, f, {
          // note here we add format to timestamp field
          format: f.type === _defaultSettings.ALL_FIELD_TYPES.timestamp ? meta[i].format : ''
        });
      });

      updatedFields.forEach(function (f, i) {
        if (meta[i].type !== f.type) {
          // if newly detected field type is different from saved type
          // we log it but won't update it, cause we don't want to break people's map
          _window.console.warn('detect ' + f.name + ' type is now ' + meta[i].type + ' instead of ' + f.type);
        }
      });
    }

    // get format of all fields
    return {
      data: { fields: updatedFields, rows: dataset.allData },
      info: (0, _lodash2.default)(dataset, ['id', 'label', 'color'])
    };
  };

  return DatasetSchema;
}(_schema2.default);

var datasetSchema = (_datasetSchema = {}, _datasetSchema[_versions.VERSIONS.v0] = new DatasetSchema({
  version: _versions.VERSIONS.v0,
  properties: propertiesV0
}), _datasetSchema[_versions.VERSIONS.v1] = new DatasetSchema({
  version: _versions.VERSIONS.v1,
  properties: propertiesV1
}), _datasetSchema);

exports.default = datasetSchema;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWFzL2RhdGFzZXQtc2NoZW1hLmpzIl0sIm5hbWVzIjpbImZpZWxkUHJvcGVydGllc1YwIiwibmFtZSIsInR5cGUiLCJmaWVsZFByb3BlcnRpZXNWMSIsImZvcm1hdCIsIkZpZWxkU2NoZW1hIiwia2V5Iiwic2F2ZSIsImZpZWxkcyIsIm1hcCIsInNhdmVQcm9wZXJ0aWVzT3JBcHBseVNjaGVtYSIsImYiLCJsb2FkIiwicHJvcGVydGllc1YwIiwiaWQiLCJsYWJlbCIsImNvbG9yIiwiYWxsRGF0YSIsInZlcnNpb24iLCJ2MCIsInByb3BlcnRpZXMiLCJwcm9wZXJ0aWVzVjEiLCJ2MSIsIkRhdGFzZXRTY2hlbWEiLCJkYXRhc2V0IiwidXBkYXRlZEZpZWxkcyIsIm5lZWRDYWxjdWxhdGVNZXRhIiwiZmllbGRPcmRlciIsInNhbXBsZURhdGEiLCJtZXRhIiwiaSIsInRpbWVzdGFtcCIsImZvckVhY2giLCJ3YXJuIiwiZGF0YSIsInJvd3MiLCJpbmZvIiwiZGF0YXNldFNjaGVtYSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFFQTs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOzs7O0FBRUE7QUFDQSxJQUFNQSxvQkFBb0I7QUFDeEJDLFFBQU0sSUFEa0I7QUFFeEJDLFFBQU07QUFGa0IsQ0FBMUI7O0FBS0EsSUFBTUMsb0JBQW9CO0FBQ3hCRixRQUFNLElBRGtCO0FBRXhCQyxRQUFNLElBRmtCO0FBR3hCRSxVQUFRO0FBSGdCLENBQTFCOztJQU1NQyxXOzs7Ozs7Ozs7Ozs7b0pBQ0pDLEcsR0FBTSxROzs7d0JBQ05DLEksaUJBQUtDLE0sRUFBUTtBQUFBO0FBQUE7O0FBQ1gsMkJBQ0csS0FBS0YsR0FEUixJQUNjRSxPQUFPQyxHQUFQLENBQVc7QUFBQSxhQUNyQixPQUFLQywyQkFBTCxDQUFpQ0MsQ0FBakMsRUFBb0MsT0FBS0wsR0FBekMsQ0FEcUI7QUFBQSxLQUFYLENBRGQ7QUFJRCxHOzt3QkFDRE0sSSxpQkFBS0osTSxFQUFRO0FBQUE7O0FBQ1gsNkJBQVMsS0FBS0YsR0FBZCxJQUFvQkUsTUFBcEI7QUFDRCxHOzs7OztBQUdILElBQU1LLGVBQWU7QUFDbkJDLE1BQUksSUFEZTtBQUVuQkMsU0FBTyxJQUZZO0FBR25CQyxTQUFPLElBSFk7QUFJbkJDLFdBQVMsSUFKVTtBQUtuQlQsVUFBUSxJQUFJSCxXQUFKLENBQWdCO0FBQ3RCYSxhQUFTLG1CQUFTQyxFQURJO0FBRXRCQyxnQkFBWXBCO0FBRlUsR0FBaEI7QUFMVyxDQUFyQjs7QUFXQSxJQUFNcUIsMENBQ0RSLFlBREM7QUFFSkwsVUFBUSxJQUFJSCxXQUFKLENBQWdCO0FBQ3RCYSxhQUFTLG1CQUFTSSxFQURJO0FBRXRCRixnQkFBWWpCO0FBRlUsR0FBaEI7QUFGSixFQUFOOztJQVFNb0IsYTs7Ozs7Ozs7Ozs7OzJKQUNKakIsRyxHQUFNLFM7OzswQkFFTkMsSSxpQkFBS2lCLE8sRUFBUztBQUNaLFdBQU8sS0FBS2QsMkJBQUwsQ0FBaUNjLE9BQWpDLEVBQTBDLEtBQUtsQixHQUEvQyxDQUFQO0FBQ0QsRzs7MEJBQ0RNLEksaUJBQUtZLE8sRUFBUztBQUFBLFFBQ0xoQixNQURLLEdBQ2NnQixPQURkLENBQ0xoQixNQURLO0FBQUEsUUFDR1MsT0FESCxHQUNjTyxPQURkLENBQ0dQLE9BREg7O0FBRVosUUFBSVEsZ0JBQWdCakIsTUFBcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBTWtCLG9CQUFvQixDQUFDbEIsT0FBTyxDQUFQLEVBQVVKLE1BQXJDOztBQUVBLFFBQUlzQixpQkFBSixFQUF1QjtBQUNyQixVQUFNQyxhQUFhbkIsT0FBT0MsR0FBUCxDQUFXO0FBQUEsZUFBS0UsRUFBRVYsSUFBUDtBQUFBLE9BQVgsQ0FBbkI7O0FBRUEsVUFBTTJCLGFBQWEsd0NBQXdCLEVBQUNwQixjQUFELEVBQVNTLGdCQUFULEVBQXhCLENBQW5CO0FBQ0EsVUFBTVksT0FBTyxzQ0FBa0JELFVBQWxCLEVBQThCRCxVQUE5QixDQUFiOztBQUVBRixzQkFBZ0JqQixPQUFPQyxHQUFQLENBQVcsVUFBQ0UsQ0FBRCxFQUFJbUIsQ0FBSjtBQUFBLDBDQUN0Qm5CLENBRHNCO0FBRXpCO0FBQ0FQLGtCQUFRTyxFQUFFVCxJQUFGLEtBQVcsaUNBQWdCNkIsU0FBM0IsR0FBdUNGLEtBQUtDLENBQUwsRUFBUTFCLE1BQS9DLEdBQXdEO0FBSHZDO0FBQUEsT0FBWCxDQUFoQjs7QUFNQXFCLG9CQUFjTyxPQUFkLENBQXNCLFVBQUNyQixDQUFELEVBQUltQixDQUFKLEVBQVU7QUFDOUIsWUFBSUQsS0FBS0MsQ0FBTCxFQUFRNUIsSUFBUixLQUFpQlMsRUFBRVQsSUFBdkIsRUFBNkI7QUFDM0I7QUFDQTtBQUNBLDBCQUFjK0IsSUFBZCxhQUE2QnRCLEVBQUVWLElBQS9CLHFCQUFtRDRCLEtBQUtDLENBQUwsRUFBUTVCLElBQTNELG9CQUE4RVMsRUFBRVQsSUFBaEY7QUFDRDtBQUNGLE9BTkQ7QUFPRDs7QUFFRDtBQUNBLFdBQU87QUFDTGdDLFlBQU0sRUFBQzFCLFFBQVFpQixhQUFULEVBQXdCVSxNQUFNWCxRQUFRUCxPQUF0QyxFQUREO0FBRUxtQixZQUFNLHNCQUFLWixPQUFMLEVBQWMsQ0FBQyxJQUFELEVBQU8sT0FBUCxFQUFnQixPQUFoQixDQUFkO0FBRkQsS0FBUDtBQUlELEc7Ozs7O0FBR0gsSUFBTWEscURBQ0gsbUJBQVNsQixFQUROLElBQ1csSUFBSUksYUFBSixDQUFrQjtBQUMvQkwsV0FBUyxtQkFBU0MsRUFEYTtBQUUvQkMsY0FBWVA7QUFGbUIsQ0FBbEIsQ0FEWCxpQkFLSCxtQkFBU1MsRUFMTixJQUtXLElBQUlDLGFBQUosQ0FBa0I7QUFDL0JMLFdBQVMsbUJBQVNJLEVBRGE7QUFFL0JGLGNBQVlDO0FBRm1CLENBQWxCLENBTFgsaUJBQU47O2tCQVdlZ0IsYSIsImZpbGUiOiJkYXRhc2V0LXNjaGVtYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwaWNrIGZyb20gJ2xvZGFzaC5waWNrJztcbmltcG9ydCB7Y29uc29sZSBhcyBnbG9iYWxDb25zb2xlfSBmcm9tICdnbG9iYWwvd2luZG93JztcblxuaW1wb3J0IHtWRVJTSU9OU30gZnJvbSAnLi92ZXJzaW9ucyc7XG5pbXBvcnQgU2NoZW1hIGZyb20gJy4vc2NoZW1hJztcbmltcG9ydCB7Z2V0U2FtcGxlRm9yVHlwZUFuYWx5emV9IGZyb20gJ3V0aWxzL2RhdGEtdXRpbHMnO1xuaW1wb3J0IHtnZXRGaWVsZHNGcm9tRGF0YX0gZnJvbSAncHJvY2Vzc29yL2RhdGEtcHJvY2Vzc29yJztcbmltcG9ydCB7QUxMX0ZJRUxEX1RZUEVTfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbi8vIHZlcnNpb24gdjBcbmNvbnN0IGZpZWxkUHJvcGVydGllc1YwID0ge1xuICBuYW1lOiBudWxsLFxuICB0eXBlOiBudWxsXG59O1xuXG5jb25zdCBmaWVsZFByb3BlcnRpZXNWMSA9IHtcbiAgbmFtZTogbnVsbCxcbiAgdHlwZTogbnVsbCxcbiAgZm9ybWF0OiBudWxsXG59O1xuXG5jbGFzcyBGaWVsZFNjaGVtYSBleHRlbmRzIFNjaGVtYSB7XG4gIGtleSA9ICdmaWVsZHMnO1xuICBzYXZlKGZpZWxkcykge1xuICAgIHJldHVybiB7XG4gICAgICBbdGhpcy5rZXldOiBmaWVsZHMubWFwKGYgPT5cbiAgICAgICAgdGhpcy5zYXZlUHJvcGVydGllc09yQXBwbHlTY2hlbWEoZilbdGhpcy5rZXldKVxuICAgIH07XG4gIH1cbiAgbG9hZChmaWVsZHMpIHtcbiAgICByZXR1cm4ge1t0aGlzLmtleV06IGZpZWxkc307XG4gIH1cbn1cblxuY29uc3QgcHJvcGVydGllc1YwID0ge1xuICBpZDogbnVsbCxcbiAgbGFiZWw6IG51bGwsXG4gIGNvbG9yOiBudWxsLFxuICBhbGxEYXRhOiBudWxsLFxuICBmaWVsZHM6IG5ldyBGaWVsZFNjaGVtYSh7XG4gICAgdmVyc2lvbjogVkVSU0lPTlMudjAsXG4gICAgcHJvcGVydGllczogZmllbGRQcm9wZXJ0aWVzVjBcbiAgfSlcbn07XG5cbmNvbnN0IHByb3BlcnRpZXNWMSA9IHtcbiAgLi4ucHJvcGVydGllc1YwLFxuICBmaWVsZHM6IG5ldyBGaWVsZFNjaGVtYSh7XG4gICAgdmVyc2lvbjogVkVSU0lPTlMudjEsXG4gICAgcHJvcGVydGllczogZmllbGRQcm9wZXJ0aWVzVjFcbiAgfSlcbn07XG5cbmNsYXNzIERhdGFzZXRTY2hlbWEgZXh0ZW5kcyBTY2hlbWEge1xuICBrZXkgPSAnZGF0YXNldCc7XG5cbiAgc2F2ZShkYXRhc2V0KSB7XG4gICAgcmV0dXJuIHRoaXMuc2F2ZVByb3BlcnRpZXNPckFwcGx5U2NoZW1hKGRhdGFzZXQpW3RoaXMua2V5XTtcbiAgfVxuICBsb2FkKGRhdGFzZXQpIHtcbiAgICBjb25zdCB7ZmllbGRzLCBhbGxEYXRhfSA9IGRhdGFzZXQ7XG4gICAgbGV0IHVwZGF0ZWRGaWVsZHMgPSBmaWVsZHM7XG5cbiAgICAvLyByZWNhbGN1bGF0ZSBmaWVsZCB0eXBlXG4gICAgLy8gYmVjYXVzZSB3ZSBoYXZlIHVwZGF0ZWQgdHlwZS1hbmFseXplclxuICAgIC8vIHdlIG5lZWQgdG8gYWRkIGZvcm1hdCB0byBlYWNoIGZpZWxkXG4gICAgY29uc3QgbmVlZENhbGN1bGF0ZU1ldGEgPSAhZmllbGRzWzBdLmZvcm1hdDtcblxuICAgIGlmIChuZWVkQ2FsY3VsYXRlTWV0YSkge1xuICAgICAgY29uc3QgZmllbGRPcmRlciA9IGZpZWxkcy5tYXAoZiA9PiBmLm5hbWUpO1xuXG4gICAgICBjb25zdCBzYW1wbGVEYXRhID0gZ2V0U2FtcGxlRm9yVHlwZUFuYWx5emUoe2ZpZWxkcywgYWxsRGF0YX0pO1xuICAgICAgY29uc3QgbWV0YSA9IGdldEZpZWxkc0Zyb21EYXRhKHNhbXBsZURhdGEsIGZpZWxkT3JkZXIpO1xuXG4gICAgICB1cGRhdGVkRmllbGRzID0gZmllbGRzLm1hcCgoZiwgaSkgPT4gKHtcbiAgICAgICAgLi4uZixcbiAgICAgICAgLy8gbm90ZSBoZXJlIHdlIGFkZCBmb3JtYXQgdG8gdGltZXN0YW1wIGZpZWxkXG4gICAgICAgIGZvcm1hdDogZi50eXBlID09PSBBTExfRklFTERfVFlQRVMudGltZXN0YW1wID8gbWV0YVtpXS5mb3JtYXQgOiAnJ1xuICAgICAgfSkpO1xuXG4gICAgICB1cGRhdGVkRmllbGRzLmZvckVhY2goKGYsIGkpID0+IHtcbiAgICAgICAgaWYgKG1ldGFbaV0udHlwZSAhPT0gZi50eXBlKSB7XG4gICAgICAgICAgLy8gaWYgbmV3bHkgZGV0ZWN0ZWQgZmllbGQgdHlwZSBpcyBkaWZmZXJlbnQgZnJvbSBzYXZlZCB0eXBlXG4gICAgICAgICAgLy8gd2UgbG9nIGl0IGJ1dCB3b24ndCB1cGRhdGUgaXQsIGNhdXNlIHdlIGRvbid0IHdhbnQgdG8gYnJlYWsgcGVvcGxlJ3MgbWFwXG4gICAgICAgICAgZ2xvYmFsQ29uc29sZS53YXJuKGBkZXRlY3QgJHtmLm5hbWV9IHR5cGUgaXMgbm93ICR7bWV0YVtpXS50eXBlfSBpbnN0ZWFkIG9mICR7Zi50eXBlfWApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBnZXQgZm9ybWF0IG9mIGFsbCBmaWVsZHNcbiAgICByZXR1cm4ge1xuICAgICAgZGF0YToge2ZpZWxkczogdXBkYXRlZEZpZWxkcywgcm93czogZGF0YXNldC5hbGxEYXRhfSxcbiAgICAgIGluZm86IHBpY2soZGF0YXNldCwgWydpZCcsICdsYWJlbCcsICdjb2xvciddKVxuICAgIH07XG4gIH1cbn1cblxuY29uc3QgZGF0YXNldFNjaGVtYSA9IHtcbiAgW1ZFUlNJT05TLnYwXTogbmV3IERhdGFzZXRTY2hlbWEoe1xuICAgIHZlcnNpb246IFZFUlNJT05TLnYwLFxuICAgIHByb3BlcnRpZXM6IHByb3BlcnRpZXNWMFxuICB9KSxcbiAgW1ZFUlNJT05TLnYxXTogbmV3IERhdGFzZXRTY2hlbWEoe1xuICAgIHZlcnNpb246IFZFUlNJT05TLnYxLFxuICAgIHByb3BlcnRpZXM6IHByb3BlcnRpZXNWMVxuICB9KVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZGF0YXNldFNjaGVtYTtcbiJdfQ==
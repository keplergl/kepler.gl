'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

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
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, FieldSchema);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = FieldSchema.__proto__ || Object.getPrototypeOf(FieldSchema)).call.apply(_ref, [this].concat(args))), _this), _this.key = 'fields', _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(FieldSchema, [{
    key: 'save',
    value: function save(fields) {
      var _this2 = this;

      return (0, _defineProperty3.default)({}, this.key, fields.map(function (f) {
        return _this2.savePropertiesOrApplySchema(f)[_this2.key];
      }));
    }
  }, {
    key: 'load',
    value: function load(fields) {
      return (0, _defineProperty3.default)({}, this.key, fields);
    }
  }]);
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
    var _ref4;

    var _temp2, _this3, _ret2;

    (0, _classCallCheck3.default)(this, DatasetSchema);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp2 = (_this3 = (0, _possibleConstructorReturn3.default)(this, (_ref4 = DatasetSchema.__proto__ || Object.getPrototypeOf(DatasetSchema)).call.apply(_ref4, [this].concat(args))), _this3), _this3.key = 'dataset', _temp2), (0, _possibleConstructorReturn3.default)(_this3, _ret2);
  }

  (0, _createClass3.default)(DatasetSchema, [{
    key: 'save',
    value: function save(dataset) {
      return this.savePropertiesOrApplySchema(dataset)[this.key];
    }
  }, {
    key: 'load',
    value: function load(dataset) {
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
    }
  }]);
  return DatasetSchema;
}(_schema2.default);

var datasetSchema = (_datasetSchema = {}, (0, _defineProperty3.default)(_datasetSchema, _versions.VERSIONS.v0, new DatasetSchema({
  version: _versions.VERSIONS.v0,
  properties: propertiesV0
})), (0, _defineProperty3.default)(_datasetSchema, _versions.VERSIONS.v1, new DatasetSchema({
  version: _versions.VERSIONS.v1,
  properties: propertiesV1
})), _datasetSchema);

exports.default = datasetSchema;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWFzL2RhdGFzZXQtc2NoZW1hLmpzIl0sIm5hbWVzIjpbImZpZWxkUHJvcGVydGllc1YwIiwibmFtZSIsInR5cGUiLCJmaWVsZFByb3BlcnRpZXNWMSIsImZvcm1hdCIsIkZpZWxkU2NoZW1hIiwia2V5IiwiZmllbGRzIiwibWFwIiwic2F2ZVByb3BlcnRpZXNPckFwcGx5U2NoZW1hIiwiZiIsInByb3BlcnRpZXNWMCIsImlkIiwibGFiZWwiLCJjb2xvciIsImFsbERhdGEiLCJ2ZXJzaW9uIiwidjAiLCJwcm9wZXJ0aWVzIiwicHJvcGVydGllc1YxIiwidjEiLCJEYXRhc2V0U2NoZW1hIiwiZGF0YXNldCIsInVwZGF0ZWRGaWVsZHMiLCJuZWVkQ2FsY3VsYXRlTWV0YSIsImZpZWxkT3JkZXIiLCJzYW1wbGVEYXRhIiwibWV0YSIsImkiLCJ0aW1lc3RhbXAiLCJmb3JFYWNoIiwid2FybiIsImRhdGEiLCJyb3dzIiwiaW5mbyIsImRhdGFzZXRTY2hlbWEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFFQTs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOzs7O0FBRUE7QUFDQSxJQUFNQSxvQkFBb0I7QUFDeEJDLFFBQU0sSUFEa0I7QUFFeEJDLFFBQU07QUFGa0IsQ0FBMUI7O0FBS0EsSUFBTUMsb0JBQW9CO0FBQ3hCRixRQUFNLElBRGtCO0FBRXhCQyxRQUFNLElBRmtCO0FBR3hCRSxVQUFRO0FBSGdCLENBQTFCOztJQU1NQyxXOzs7Ozs7Ozs7Ozs7Ozs4TUFDSkMsRyxHQUFNLFE7Ozs7O3lCQUNEQyxNLEVBQVE7QUFBQTs7QUFDWCwrQ0FDRyxLQUFLRCxHQURSLEVBQ2NDLE9BQU9DLEdBQVAsQ0FBVztBQUFBLGVBQUssT0FBS0MsMkJBQUwsQ0FBaUNDLENBQWpDLEVBQW9DLE9BQUtKLEdBQXpDLENBQUw7QUFBQSxPQUFYLENBRGQ7QUFHRDs7O3lCQUNJQyxNLEVBQVE7QUFDWCwrQ0FBUyxLQUFLRCxHQUFkLEVBQW9CQyxNQUFwQjtBQUNEOzs7OztBQUdILElBQU1JLGVBQWU7QUFDbkJDLE1BQUksSUFEZTtBQUVuQkMsU0FBTyxJQUZZO0FBR25CQyxTQUFPLElBSFk7QUFJbkJDLFdBQVMsSUFKVTtBQUtuQlIsVUFBUSxJQUFJRixXQUFKLENBQWdCO0FBQ3RCVyxhQUFTLG1CQUFTQyxFQURJO0FBRXRCQyxnQkFBWWxCO0FBRlUsR0FBaEI7QUFMVyxDQUFyQjs7QUFXQSxJQUFNbUIsMENBQ0RSLFlBREM7QUFFSkosVUFBUSxJQUFJRixXQUFKLENBQWdCO0FBQ3RCVyxhQUFTLG1CQUFTSSxFQURJO0FBRXRCRixnQkFBWWY7QUFGVSxHQUFoQjtBQUZKLEVBQU47O0lBUU1rQixhOzs7Ozs7Ozs7Ozs7Ozt5TkFDSmYsRyxHQUFNLFM7Ozs7O3lCQUVEZ0IsTyxFQUFTO0FBQ1osYUFBTyxLQUFLYiwyQkFBTCxDQUFpQ2EsT0FBakMsRUFBMEMsS0FBS2hCLEdBQS9DLENBQVA7QUFDRDs7O3lCQUNJZ0IsTyxFQUFTO0FBQUEsVUFDTGYsTUFESyxHQUNjZSxPQURkLENBQ0xmLE1BREs7QUFBQSxVQUNHUSxPQURILEdBQ2NPLE9BRGQsQ0FDR1AsT0FESDs7QUFFWixVQUFJUSxnQkFBZ0JoQixNQUFwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFNaUIsb0JBQW9CLENBQUNqQixPQUFPLENBQVAsRUFBVUgsTUFBckM7O0FBRUEsVUFBSW9CLGlCQUFKLEVBQXVCO0FBQ3JCLFlBQU1DLGFBQWFsQixPQUFPQyxHQUFQLENBQVc7QUFBQSxpQkFBS0UsRUFBRVQsSUFBUDtBQUFBLFNBQVgsQ0FBbkI7O0FBRUEsWUFBTXlCLGFBQWEsd0NBQXdCLEVBQUNuQixjQUFELEVBQVNRLGdCQUFULEVBQXhCLENBQW5CO0FBQ0EsWUFBTVksT0FBTyxzQ0FBa0JELFVBQWxCLEVBQThCRCxVQUE5QixDQUFiOztBQUVBRix3QkFBZ0JoQixPQUFPQyxHQUFQLENBQVcsVUFBQ0UsQ0FBRCxFQUFJa0IsQ0FBSjtBQUFBLDRDQUN0QmxCLENBRHNCO0FBRXpCO0FBQ0FOLG9CQUFRTSxFQUFFUixJQUFGLEtBQVcsaUNBQWdCMkIsU0FBM0IsR0FBdUNGLEtBQUtDLENBQUwsRUFBUXhCLE1BQS9DLEdBQXdEO0FBSHZDO0FBQUEsU0FBWCxDQUFoQjs7QUFNQW1CLHNCQUFjTyxPQUFkLENBQXNCLFVBQUNwQixDQUFELEVBQUlrQixDQUFKLEVBQVU7QUFDOUIsY0FBSUQsS0FBS0MsQ0FBTCxFQUFRMUIsSUFBUixLQUFpQlEsRUFBRVIsSUFBdkIsRUFBNkI7QUFDM0I7QUFDQTtBQUNBLDRCQUFjNkIsSUFBZCxhQUNZckIsRUFBRVQsSUFEZCxxQkFDa0MwQixLQUFLQyxDQUFMLEVBQVExQixJQUQxQyxvQkFDNkRRLEVBQUVSLElBRC9EO0FBR0Q7QUFDRixTQVJEO0FBU0Q7O0FBRUQ7QUFDQSxhQUFPO0FBQ0w4QixjQUFNLEVBQUN6QixRQUFRZ0IsYUFBVCxFQUF3QlUsTUFBTVgsUUFBUVAsT0FBdEMsRUFERDtBQUVMbUIsY0FBTSxzQkFBS1osT0FBTCxFQUFjLENBQUMsSUFBRCxFQUFPLE9BQVAsRUFBZ0IsT0FBaEIsQ0FBZDtBQUZELE9BQVA7QUFJRDs7Ozs7QUFHSCxJQUFNYSxvRkFDSCxtQkFBU2xCLEVBRE4sRUFDVyxJQUFJSSxhQUFKLENBQWtCO0FBQy9CTCxXQUFTLG1CQUFTQyxFQURhO0FBRS9CQyxjQUFZUDtBQUZtQixDQUFsQixDQURYLGlEQUtILG1CQUFTUyxFQUxOLEVBS1csSUFBSUMsYUFBSixDQUFrQjtBQUMvQkwsV0FBUyxtQkFBU0ksRUFEYTtBQUUvQkYsY0FBWUM7QUFGbUIsQ0FBbEIsQ0FMWCxrQkFBTjs7a0JBV2VnQixhIiwiZmlsZSI6ImRhdGFzZXQtc2NoZW1hLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBpY2sgZnJvbSAnbG9kYXNoLnBpY2snO1xuaW1wb3J0IHtjb25zb2xlIGFzIGdsb2JhbENvbnNvbGV9IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuXG5pbXBvcnQge1ZFUlNJT05TfSBmcm9tICcuL3ZlcnNpb25zJztcbmltcG9ydCBTY2hlbWEgZnJvbSAnLi9zY2hlbWEnO1xuaW1wb3J0IHtnZXRTYW1wbGVGb3JUeXBlQW5hbHl6ZX0gZnJvbSAndXRpbHMvZGF0YS11dGlscyc7XG5pbXBvcnQge2dldEZpZWxkc0Zyb21EYXRhfSBmcm9tICdwcm9jZXNzb3IvZGF0YS1wcm9jZXNzb3InO1xuaW1wb3J0IHtBTExfRklFTERfVFlQRVN9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuLy8gdmVyc2lvbiB2MFxuY29uc3QgZmllbGRQcm9wZXJ0aWVzVjAgPSB7XG4gIG5hbWU6IG51bGwsXG4gIHR5cGU6IG51bGxcbn07XG5cbmNvbnN0IGZpZWxkUHJvcGVydGllc1YxID0ge1xuICBuYW1lOiBudWxsLFxuICB0eXBlOiBudWxsLFxuICBmb3JtYXQ6IG51bGxcbn07XG5cbmNsYXNzIEZpZWxkU2NoZW1hIGV4dGVuZHMgU2NoZW1hIHtcbiAga2V5ID0gJ2ZpZWxkcyc7XG4gIHNhdmUoZmllbGRzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFt0aGlzLmtleV06IGZpZWxkcy5tYXAoZiA9PiB0aGlzLnNhdmVQcm9wZXJ0aWVzT3JBcHBseVNjaGVtYShmKVt0aGlzLmtleV0pXG4gICAgfTtcbiAgfVxuICBsb2FkKGZpZWxkcykge1xuICAgIHJldHVybiB7W3RoaXMua2V5XTogZmllbGRzfTtcbiAgfVxufVxuXG5jb25zdCBwcm9wZXJ0aWVzVjAgPSB7XG4gIGlkOiBudWxsLFxuICBsYWJlbDogbnVsbCxcbiAgY29sb3I6IG51bGwsXG4gIGFsbERhdGE6IG51bGwsXG4gIGZpZWxkczogbmV3IEZpZWxkU2NoZW1hKHtcbiAgICB2ZXJzaW9uOiBWRVJTSU9OUy52MCxcbiAgICBwcm9wZXJ0aWVzOiBmaWVsZFByb3BlcnRpZXNWMFxuICB9KVxufTtcblxuY29uc3QgcHJvcGVydGllc1YxID0ge1xuICAuLi5wcm9wZXJ0aWVzVjAsXG4gIGZpZWxkczogbmV3IEZpZWxkU2NoZW1hKHtcbiAgICB2ZXJzaW9uOiBWRVJTSU9OUy52MSxcbiAgICBwcm9wZXJ0aWVzOiBmaWVsZFByb3BlcnRpZXNWMVxuICB9KVxufTtcblxuY2xhc3MgRGF0YXNldFNjaGVtYSBleHRlbmRzIFNjaGVtYSB7XG4gIGtleSA9ICdkYXRhc2V0JztcblxuICBzYXZlKGRhdGFzZXQpIHtcbiAgICByZXR1cm4gdGhpcy5zYXZlUHJvcGVydGllc09yQXBwbHlTY2hlbWEoZGF0YXNldClbdGhpcy5rZXldO1xuICB9XG4gIGxvYWQoZGF0YXNldCkge1xuICAgIGNvbnN0IHtmaWVsZHMsIGFsbERhdGF9ID0gZGF0YXNldDtcbiAgICBsZXQgdXBkYXRlZEZpZWxkcyA9IGZpZWxkcztcblxuICAgIC8vIHJlY2FsY3VsYXRlIGZpZWxkIHR5cGVcbiAgICAvLyBiZWNhdXNlIHdlIGhhdmUgdXBkYXRlZCB0eXBlLWFuYWx5emVyXG4gICAgLy8gd2UgbmVlZCB0byBhZGQgZm9ybWF0IHRvIGVhY2ggZmllbGRcbiAgICBjb25zdCBuZWVkQ2FsY3VsYXRlTWV0YSA9ICFmaWVsZHNbMF0uZm9ybWF0O1xuXG4gICAgaWYgKG5lZWRDYWxjdWxhdGVNZXRhKSB7XG4gICAgICBjb25zdCBmaWVsZE9yZGVyID0gZmllbGRzLm1hcChmID0+IGYubmFtZSk7XG5cbiAgICAgIGNvbnN0IHNhbXBsZURhdGEgPSBnZXRTYW1wbGVGb3JUeXBlQW5hbHl6ZSh7ZmllbGRzLCBhbGxEYXRhfSk7XG4gICAgICBjb25zdCBtZXRhID0gZ2V0RmllbGRzRnJvbURhdGEoc2FtcGxlRGF0YSwgZmllbGRPcmRlcik7XG5cbiAgICAgIHVwZGF0ZWRGaWVsZHMgPSBmaWVsZHMubWFwKChmLCBpKSA9PiAoe1xuICAgICAgICAuLi5mLFxuICAgICAgICAvLyBub3RlIGhlcmUgd2UgYWRkIGZvcm1hdCB0byB0aW1lc3RhbXAgZmllbGRcbiAgICAgICAgZm9ybWF0OiBmLnR5cGUgPT09IEFMTF9GSUVMRF9UWVBFUy50aW1lc3RhbXAgPyBtZXRhW2ldLmZvcm1hdCA6ICcnXG4gICAgICB9KSk7XG5cbiAgICAgIHVwZGF0ZWRGaWVsZHMuZm9yRWFjaCgoZiwgaSkgPT4ge1xuICAgICAgICBpZiAobWV0YVtpXS50eXBlICE9PSBmLnR5cGUpIHtcbiAgICAgICAgICAvLyBpZiBuZXdseSBkZXRlY3RlZCBmaWVsZCB0eXBlIGlzIGRpZmZlcmVudCBmcm9tIHNhdmVkIHR5cGVcbiAgICAgICAgICAvLyB3ZSBsb2cgaXQgYnV0IHdvbid0IHVwZGF0ZSBpdCwgY2F1c2Ugd2UgZG9uJ3Qgd2FudCB0byBicmVhayBwZW9wbGUncyBtYXBcbiAgICAgICAgICBnbG9iYWxDb25zb2xlLndhcm4oXG4gICAgICAgICAgICBgZGV0ZWN0ICR7Zi5uYW1lfSB0eXBlIGlzIG5vdyAke21ldGFbaV0udHlwZX0gaW5zdGVhZCBvZiAke2YudHlwZX1gXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gZ2V0IGZvcm1hdCBvZiBhbGwgZmllbGRzXG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGE6IHtmaWVsZHM6IHVwZGF0ZWRGaWVsZHMsIHJvd3M6IGRhdGFzZXQuYWxsRGF0YX0sXG4gICAgICBpbmZvOiBwaWNrKGRhdGFzZXQsIFsnaWQnLCAnbGFiZWwnLCAnY29sb3InXSlcbiAgICB9O1xuICB9XG59XG5cbmNvbnN0IGRhdGFzZXRTY2hlbWEgPSB7XG4gIFtWRVJTSU9OUy52MF06IG5ldyBEYXRhc2V0U2NoZW1hKHtcbiAgICB2ZXJzaW9uOiBWRVJTSU9OUy52MCxcbiAgICBwcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzVjBcbiAgfSksXG4gIFtWRVJTSU9OUy52MV06IG5ldyBEYXRhc2V0U2NoZW1hKHtcbiAgICB2ZXJzaW9uOiBWRVJTSU9OUy52MSxcbiAgICBwcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzVjFcbiAgfSlcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRhdGFzZXRTY2hlbWE7XG4iXX0=
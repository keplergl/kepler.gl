'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _window = require('global/window');

var _visStateSchema = require('./vis-state-schema');

var _visStateSchema2 = _interopRequireDefault(_visStateSchema);

var _datasetSchema = require('./dataset-schema');

var _datasetSchema2 = _interopRequireDefault(_datasetSchema);

var _mapStyleSchema = require('./map-style-schema');

var _mapStyleSchema2 = _interopRequireDefault(_mapStyleSchema);

var _mapStateSchema = require('./map-state-schema');

var _mapStateSchema2 = _interopRequireDefault(_mapStateSchema);

var _versions = require('./versions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var REDUCER_SCHEMAS = {
  visState: _visStateSchema2.default,
  mapState: _mapStateSchema2.default,
  mapStyle: _mapStyleSchema2.default
};

var KeplerGLSchema = function () {
  function KeplerGLSchema() {
    (0, _classCallCheck3.default)(this, KeplerGLSchema);

    this._validVersions = _versions.VERSIONS;
    this._version = _versions.CURRENT_VERSION;
    this._reducerSchemas = REDUCER_SCHEMAS;
    this._datasetSchema = _datasetSchema2.default;

    this._datasetLastSaved = null;
    this._savedDataset = null;
  }

  /**
   * stateToSave = {
   *   datasets: [
   *     {
   *       version: 'v0',
   *       data: {id, label, color, allData, fields}
   *     },
   *     {
   *       version: 'v0',
   *       data: {id, label, color, allData, fields}
   *     }
   *   ],
   *   config: {
   *     version: 'v0',
   *     config: {}
   *   }
   * }
   *
   * Get config and data of current map to save
   * @param {Object} state
   * @returns {Object | null} app state to save
   */


  (0, _createClass3.default)(KeplerGLSchema, [{
    key: 'save',
    value: function save(state) {
      return {
        datasets: this.getDatasetToSave(state),
        config: this.getConfigToSave(state)
      };
    }
  }, {
    key: 'load',
    value: function load(savedDatasets, savedConfig) {
      return {
        datasets: this.parseSavedData(savedDatasets),
        config: savedConfig ? this.parseSavedConfig(savedConfig) : undefined
      };
    }
    /**
     * Get data to save
     * @param {Object} state - app state
     * @returns {{version: String, data: Object}} - dataset to save
     */

  }, {
    key: 'getDatasetToSave',
    value: function getDatasetToSave(state) {
      var _this = this;

      var dataChangedSinceLastSave = this.hasDataChanged(state);
      if (!dataChangedSinceLastSave) {
        return this._savedDataset;
      }

      var visState = state.visState;


      var datasets = Object.values(visState.datasets).map(function (ds) {
        return {
          version: _this._version,
          data: _this._datasetSchema[_this._version].save(ds)
        };
      });

      // keep a copy of formatted datasets to save
      this._datasetLastSaved = visState.datasets;
      this._savedDataset = datasets;

      return datasets;
    }

    /**
     * Get App config to save
     * @param {Object} state - app state
     * @returns {{version: String, config: Object}} - config to save
     */

  }, {
    key: 'getConfigToSave',
    value: function getConfigToSave(state) {
      var _this2 = this;

      var config = Object.keys(this._reducerSchemas).reduce(function (accu, key) {
        return (0, _extends3.default)({}, accu, _this2._reducerSchemas[key][_this2._version].save(state[key]));
      }, {});

      return {
        version: this._version,
        config: config
      };
    }

    /**
     * Parse saved data
     * @param {Array} datasets
     * @returns {Object | null} - data to save
     */

  }, {
    key: 'parseSavedData',
    value: function parseSavedData(datasets) {
      var _this3 = this;

      return datasets.reduce(function (accu, ds) {
        var validVersion = _this3.validateVersion(ds.version);
        if (!validVersion) {
          return accu;
        }
        accu.push(_this3._datasetSchema[validVersion].load(ds.data));
        return accu;
      }, []);
    }

    /**
     * Parse saved App config
     * @param {String} opt.version - config version
     * @param {Object} opt.config - saved config
     * @param {Object} state - current App State
     * @returns {Object | null} - parsed config
     */

  }, {
    key: 'parseSavedConfig',
    value: function parseSavedConfig(_ref) {
      var _this4 = this;

      var version = _ref.version,
          config = _ref.config;
      var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var validVersion = this.validateVersion(version);
      if (!validVersion) {
        return null;
      }

      return Object.keys(config).reduce(function (accu, key) {
        return (0, _extends3.default)({}, accu, key in _this4._reducerSchemas ? _this4._reducerSchemas[key][validVersion].load(config[key], state[key]) : {});
      }, {});
    }

    /**
     * Validate version
     * @param {String} version
     * @returns {String | null} validVersion
     */

  }, {
    key: 'validateVersion',
    value: function validateVersion(version) {
      if (!version) {
        _window.console.error('There is no version number associated with this saved map');
        return null;
      }

      if (!this._validVersions[version]) {
        _window.console.error(version + ' is not a valid version');
        return null;
      }

      return version;
    }

    /**
     * Check if data has changed since last save
     * @param {Object} state
     * @returns {boolean} - whether data has changed or not
     */

  }, {
    key: 'hasDataChanged',
    value: function hasDataChanged(state) {
      return this._datasetLastSaved !== state.visState.datasets;
    }
  }]);
  return KeplerGLSchema;
}();

var KeplerGLSchemaManager = new KeplerGLSchema();

exports.default = KeplerGLSchemaManager;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWFzL2luZGV4LmpzIl0sIm5hbWVzIjpbIlJFRFVDRVJfU0NIRU1BUyIsInZpc1N0YXRlIiwibWFwU3RhdGUiLCJtYXBTdHlsZSIsIktlcGxlckdMU2NoZW1hIiwiX3ZhbGlkVmVyc2lvbnMiLCJfdmVyc2lvbiIsIl9yZWR1Y2VyU2NoZW1hcyIsIl9kYXRhc2V0U2NoZW1hIiwiX2RhdGFzZXRMYXN0U2F2ZWQiLCJfc2F2ZWREYXRhc2V0Iiwic3RhdGUiLCJkYXRhc2V0cyIsImdldERhdGFzZXRUb1NhdmUiLCJjb25maWciLCJnZXRDb25maWdUb1NhdmUiLCJzYXZlZERhdGFzZXRzIiwic2F2ZWRDb25maWciLCJwYXJzZVNhdmVkRGF0YSIsInBhcnNlU2F2ZWRDb25maWciLCJ1bmRlZmluZWQiLCJkYXRhQ2hhbmdlZFNpbmNlTGFzdFNhdmUiLCJoYXNEYXRhQ2hhbmdlZCIsIk9iamVjdCIsInZhbHVlcyIsIm1hcCIsInZlcnNpb24iLCJkYXRhIiwic2F2ZSIsImRzIiwia2V5cyIsInJlZHVjZSIsImFjY3UiLCJrZXkiLCJ2YWxpZFZlcnNpb24iLCJ2YWxpZGF0ZVZlcnNpb24iLCJwdXNoIiwibG9hZCIsImVycm9yIiwiS2VwbGVyR0xTY2hlbWFNYW5hZ2VyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBRUEsSUFBTUEsa0JBQWtCO0FBQ3RCQyxvQ0FEc0I7QUFFdEJDLG9DQUZzQjtBQUd0QkM7QUFIc0IsQ0FBeEI7O0lBTU1DLGM7QUFDSiw0QkFBYztBQUFBOztBQUNaLFNBQUtDLGNBQUw7QUFDQSxTQUFLQyxRQUFMO0FBQ0EsU0FBS0MsZUFBTCxHQUF1QlAsZUFBdkI7QUFDQSxTQUFLUSxjQUFMOztBQUVBLFNBQUtDLGlCQUFMLEdBQXlCLElBQXpCO0FBQ0EsU0FBS0MsYUFBTCxHQUFxQixJQUFyQjtBQUNEOztBQUVEOzs7Ozs7Ozs7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LENBREYsRUFFRXRCLE1BQU1zQixHQUFOLENBRkYsQ0FEQSxHQUtBLEVBUFI7QUFBQSxPQURLLEVBVUwsRUFWSyxDQUFQO0FBWUQ7O0FBRUQ7Ozs7Ozs7O29DQUtnQlAsTyxFQUFTO0FBQ3ZCLFVBQUksQ0FBQ0EsT0FBTCxFQUFjO0FBQ1osd0JBQVFZLEtBQVIsQ0FDRSwyREFERjtBQUdBLGVBQU8sSUFBUDtBQUNEOztBQUVELFVBQUksQ0FBQyxLQUFLakMsY0FBTCxDQUFvQnFCLE9BQXBCLENBQUwsRUFBbUM7QUFDakMsd0JBQVFZLEtBQVIsQ0FBaUJaLE9BQWpCO0FBQ0EsZUFBTyxJQUFQO0FBQ0Q7O0FBRUQsYUFBT0EsT0FBUDtBQUNEOztBQUVEOzs7Ozs7OzttQ0FLZWYsSyxFQUFPO0FBQ3BCLGFBQU8sS0FBS0YsaUJBQUwsS0FBMkJFLE1BQU1WLFFBQU4sQ0FBZVcsUUFBakQ7QUFDRDs7Ozs7QUFHSCxJQUFNMkIsd0JBQXdCLElBQUluQyxjQUFKLEVBQTlCOztrQkFFZW1DLHFCIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtjb25zb2xlIGFzIENvbnNvbGV9IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuXG5pbXBvcnQgdmlzU3RhdGVTY2hlbWEgZnJvbSAnLi92aXMtc3RhdGUtc2NoZW1hJztcbmltcG9ydCBkYXRhc2V0U2NoZW1hIGZyb20gJy4vZGF0YXNldC1zY2hlbWEnO1xuaW1wb3J0IG1hcFN0eWxlU2NoZW1hIGZyb20gJy4vbWFwLXN0eWxlLXNjaGVtYSc7XG5pbXBvcnQgbWFwU3RhdGVTY2hlbWEgZnJvbSAnLi9tYXAtc3RhdGUtc2NoZW1hJztcblxuaW1wb3J0IHtDVVJSRU5UX1ZFUlNJT04sIFZFUlNJT05TfSBmcm9tICcuL3ZlcnNpb25zJztcblxuY29uc3QgUkVEVUNFUl9TQ0hFTUFTID0ge1xuICB2aXNTdGF0ZTogdmlzU3RhdGVTY2hlbWEsXG4gIG1hcFN0YXRlOiBtYXBTdGF0ZVNjaGVtYSxcbiAgbWFwU3R5bGU6IG1hcFN0eWxlU2NoZW1hXG59O1xuXG5jbGFzcyBLZXBsZXJHTFNjaGVtYSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX3ZhbGlkVmVyc2lvbnMgPSBWRVJTSU9OUztcbiAgICB0aGlzLl92ZXJzaW9uID0gQ1VSUkVOVF9WRVJTSU9OO1xuICAgIHRoaXMuX3JlZHVjZXJTY2hlbWFzID0gUkVEVUNFUl9TQ0hFTUFTO1xuICAgIHRoaXMuX2RhdGFzZXRTY2hlbWEgPSBkYXRhc2V0U2NoZW1hO1xuXG4gICAgdGhpcy5fZGF0YXNldExhc3RTYXZlZCA9IG51bGw7XG4gICAgdGhpcy5fc2F2ZWREYXRhc2V0ID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBzdGF0ZVRvU2F2ZSA9IHtcbiAgICogICBkYXRhc2V0czogW1xuICAgKiAgICAge1xuICAgKiAgICAgICB2ZXJzaW9uOiAndjAnLFxuICAgKiAgICAgICBkYXRhOiB7aWQsIGxhYmVsLCBjb2xvciwgYWxsRGF0YSwgZmllbGRzfVxuICAgKiAgICAgfSxcbiAgICogICAgIHtcbiAgICogICAgICAgdmVyc2lvbjogJ3YwJyxcbiAgICogICAgICAgZGF0YToge2lkLCBsYWJlbCwgY29sb3IsIGFsbERhdGEsIGZpZWxkc31cbiAgICogICAgIH1cbiAgICogICBdLFxuICAgKiAgIGNvbmZpZzoge1xuICAgKiAgICAgdmVyc2lvbjogJ3YwJyxcbiAgICogICAgIGNvbmZpZzoge31cbiAgICogICB9XG4gICAqIH1cbiAgICpcbiAgICogR2V0IGNvbmZpZyBhbmQgZGF0YSBvZiBjdXJyZW50IG1hcCB0byBzYXZlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZVxuICAgKiBAcmV0dXJucyB7T2JqZWN0IHwgbnVsbH0gYXBwIHN0YXRlIHRvIHNhdmVcbiAgICovXG4gIHNhdmUoc3RhdGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGF0YXNldHM6IHRoaXMuZ2V0RGF0YXNldFRvU2F2ZShzdGF0ZSksXG4gICAgICBjb25maWc6IHRoaXMuZ2V0Q29uZmlnVG9TYXZlKHN0YXRlKVxuICAgIH07XG4gIH1cblxuICBsb2FkKHNhdmVkRGF0YXNldHMsIHNhdmVkQ29uZmlnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGFzZXRzOiB0aGlzLnBhcnNlU2F2ZWREYXRhKHNhdmVkRGF0YXNldHMpLFxuICAgICAgY29uZmlnOiBzYXZlZENvbmZpZyA/IHRoaXMucGFyc2VTYXZlZENvbmZpZyhzYXZlZENvbmZpZykgOiB1bmRlZmluZWRcbiAgICB9O1xuICB9XG4gIC8qKlxuICAgKiBHZXQgZGF0YSB0byBzYXZlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZSAtIGFwcCBzdGF0ZVxuICAgKiBAcmV0dXJucyB7e3ZlcnNpb246IFN0cmluZywgZGF0YTogT2JqZWN0fX0gLSBkYXRhc2V0IHRvIHNhdmVcbiAgICovXG4gIGdldERhdGFzZXRUb1NhdmUoc3RhdGUpIHtcbiAgICBjb25zdCBkYXRhQ2hhbmdlZFNpbmNlTGFzdFNhdmUgPSB0aGlzLmhhc0RhdGFDaGFuZ2VkKHN0YXRlKTtcbiAgICBpZiAoIWRhdGFDaGFuZ2VkU2luY2VMYXN0U2F2ZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX3NhdmVkRGF0YXNldDtcbiAgICB9XG5cbiAgICBjb25zdCB7dmlzU3RhdGV9ID0gc3RhdGU7XG5cbiAgICBjb25zdCBkYXRhc2V0cyA9IE9iamVjdC52YWx1ZXModmlzU3RhdGUuZGF0YXNldHMpLm1hcChkcyA9PiAoe1xuICAgICAgdmVyc2lvbjogdGhpcy5fdmVyc2lvbixcbiAgICAgIGRhdGE6IHRoaXMuX2RhdGFzZXRTY2hlbWFbdGhpcy5fdmVyc2lvbl0uc2F2ZShkcylcbiAgICB9KSk7XG5cbiAgICAvLyBrZWVwIGEgY29weSBvZiBmb3JtYXR0ZWQgZGF0YXNldHMgdG8gc2F2ZVxuICAgIHRoaXMuX2RhdGFzZXRMYXN0U2F2ZWQgPSB2aXNTdGF0ZS5kYXRhc2V0cztcbiAgICB0aGlzLl9zYXZlZERhdGFzZXQgPSBkYXRhc2V0cztcblxuICAgIHJldHVybiBkYXRhc2V0cztcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgQXBwIGNvbmZpZyB0byBzYXZlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZSAtIGFwcCBzdGF0ZVxuICAgKiBAcmV0dXJucyB7e3ZlcnNpb246IFN0cmluZywgY29uZmlnOiBPYmplY3R9fSAtIGNvbmZpZyB0byBzYXZlXG4gICAqL1xuICBnZXRDb25maWdUb1NhdmUoc3RhdGUpIHtcbiAgICBjb25zdCBjb25maWcgPSBPYmplY3Qua2V5cyh0aGlzLl9yZWR1Y2VyU2NoZW1hcykucmVkdWNlKFxuICAgICAgKGFjY3UsIGtleSkgPT4gKHtcbiAgICAgICAgLi4uYWNjdSxcbiAgICAgICAgLi4udGhpcy5fcmVkdWNlclNjaGVtYXNba2V5XVt0aGlzLl92ZXJzaW9uXS5zYXZlKHN0YXRlW2tleV0pXG4gICAgICB9KSxcbiAgICAgIHt9XG4gICAgKTtcblxuICAgIHJldHVybiB7XG4gICAgICB2ZXJzaW9uOiB0aGlzLl92ZXJzaW9uLFxuICAgICAgY29uZmlnXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXJzZSBzYXZlZCBkYXRhXG4gICAqIEBwYXJhbSB7QXJyYXl9IGRhdGFzZXRzXG4gICAqIEByZXR1cm5zIHtPYmplY3QgfCBudWxsfSAtIGRhdGEgdG8gc2F2ZVxuICAgKi9cbiAgcGFyc2VTYXZlZERhdGEoZGF0YXNldHMpIHtcbiAgICByZXR1cm4gZGF0YXNldHMucmVkdWNlKChhY2N1LCBkcykgPT4ge1xuICAgICAgY29uc3QgdmFsaWRWZXJzaW9uID0gdGhpcy52YWxpZGF0ZVZlcnNpb24oZHMudmVyc2lvbik7XG4gICAgICBpZiAoIXZhbGlkVmVyc2lvbikge1xuICAgICAgICByZXR1cm4gYWNjdTtcbiAgICAgIH1cbiAgICAgIGFjY3UucHVzaCh0aGlzLl9kYXRhc2V0U2NoZW1hW3ZhbGlkVmVyc2lvbl0ubG9hZChkcy5kYXRhKSk7XG4gICAgICByZXR1cm4gYWNjdTtcbiAgICB9LCBbXSk7XG4gIH1cblxuICAvKipcbiAgICogUGFyc2Ugc2F2ZWQgQXBwIGNvbmZpZ1xuICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0LnZlcnNpb24gLSBjb25maWcgdmVyc2lvblxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0LmNvbmZpZyAtIHNhdmVkIGNvbmZpZ1xuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGUgLSBjdXJyZW50IEFwcCBTdGF0ZVxuICAgKiBAcmV0dXJucyB7T2JqZWN0IHwgbnVsbH0gLSBwYXJzZWQgY29uZmlnXG4gICAqL1xuICBwYXJzZVNhdmVkQ29uZmlnKHt2ZXJzaW9uLCBjb25maWd9LCBzdGF0ZSA9IHt9KSB7XG4gICAgY29uc3QgdmFsaWRWZXJzaW9uID0gdGhpcy52YWxpZGF0ZVZlcnNpb24odmVyc2lvbik7XG4gICAgaWYgKCF2YWxpZFZlcnNpb24pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBPYmplY3Qua2V5cyhjb25maWcpLnJlZHVjZShcbiAgICAgIChhY2N1LCBrZXkpID0+ICh7XG4gICAgICAgICAgLi4uYWNjdSxcbiAgICAgICAgICAuLi4oa2V5IGluIHRoaXMuX3JlZHVjZXJTY2hlbWFzXG4gICAgICAgICAgICA/IHRoaXMuX3JlZHVjZXJTY2hlbWFzW2tleV1bdmFsaWRWZXJzaW9uXS5sb2FkKFxuICAgICAgICAgICAgICAgIGNvbmZpZ1trZXldLFxuICAgICAgICAgICAgICAgIHN0YXRlW2tleV1cbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgOiB7fSlcbiAgICAgICAgfSksXG4gICAgICB7fVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdGUgdmVyc2lvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gdmVyc2lvblxuICAgKiBAcmV0dXJucyB7U3RyaW5nIHwgbnVsbH0gdmFsaWRWZXJzaW9uXG4gICAqL1xuICB2YWxpZGF0ZVZlcnNpb24odmVyc2lvbikge1xuICAgIGlmICghdmVyc2lvbikge1xuICAgICAgQ29uc29sZS5lcnJvcihcbiAgICAgICAgJ1RoZXJlIGlzIG5vIHZlcnNpb24gbnVtYmVyIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHNhdmVkIG1hcCdcbiAgICAgICk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX3ZhbGlkVmVyc2lvbnNbdmVyc2lvbl0pIHtcbiAgICAgIENvbnNvbGUuZXJyb3IoYCR7dmVyc2lvbn0gaXMgbm90IGEgdmFsaWQgdmVyc2lvbmApO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZlcnNpb247XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgZGF0YSBoYXMgY2hhbmdlZCBzaW5jZSBsYXN0IHNhdmVcbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIHdoZXRoZXIgZGF0YSBoYXMgY2hhbmdlZCBvciBub3RcbiAgICovXG4gIGhhc0RhdGFDaGFuZ2VkKHN0YXRlKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGFzZXRMYXN0U2F2ZWQgIT09IHN0YXRlLnZpc1N0YXRlLmRhdGFzZXRzO1xuICB9XG59XG5cbmNvbnN0IEtlcGxlckdMU2NoZW1hTWFuYWdlciA9IG5ldyBLZXBsZXJHTFNjaGVtYSgpO1xuXG5leHBvcnQgZGVmYXVsdCBLZXBsZXJHTFNjaGVtYU1hbmFnZXI7XG4iXX0=
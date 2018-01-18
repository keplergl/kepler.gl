'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

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


  KeplerGLSchema.prototype.save = function save(state) {
    return {
      datasets: this.getDatasetToSave(state),
      config: this.getConfigToSave(state)
    };
  };

  KeplerGLSchema.prototype.load = function load(savedDatasets, savedConfig) {
    return {
      datasets: this.parseSavedData(savedDatasets),
      config: savedConfig ? this.parseSavedConfig(savedConfig) : undefined
    };
  };
  /**
   * Get data to save
   * @param {Object} state - app state
   * @returns {{version: String, data: Object}} - dataset to save
   */


  KeplerGLSchema.prototype.getDatasetToSave = function getDatasetToSave(state) {
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
  };

  /**
   * Get App config to save
   * @param {Object} state - app state
   * @returns {{version: String, config: Object}} - config to save
   */


  KeplerGLSchema.prototype.getConfigToSave = function getConfigToSave(state) {
    var _this2 = this;

    var config = Object.keys(this._reducerSchemas).reduce(function (accu, key) {
      return (0, _extends3.default)({}, accu, _this2._reducerSchemas[key][_this2._version].save(state[key]));
    }, {});

    return {
      version: this._version,
      config: config
    };
  };

  /**
   * Parse saved data
   * @param {Array} datasets
   * @returns {Object | null} - data to save
   */


  KeplerGLSchema.prototype.parseSavedData = function parseSavedData(datasets) {
    var _this3 = this;

    return datasets.reduce(function (accu, ds) {
      var validVersion = _this3.validateVersion(ds.version);
      if (!validVersion) {
        return accu;
      }
      accu.push(_this3._datasetSchema[validVersion].load(ds.data));
      return accu;
    }, []);
  };

  /**
   * Parse saved App config
   * @param {String} opt.version - config version
   * @param {Object} opt.config - saved config
   * @param {Object} state - current App State
   * @returns {Object | null} - parsed config
   */


  KeplerGLSchema.prototype.parseSavedConfig = function parseSavedConfig(_ref) {
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
  };

  /**
   * Validate version
   * @param {String} version
   * @returns {String | null} validVersion
   */


  KeplerGLSchema.prototype.validateVersion = function validateVersion(version) {
    if (!version) {
      _window.console.error('There is no version number associated with this saved map');
      return null;
    }

    if (!this._validVersions[version]) {
      _window.console.error(version + ' is not a valid version');
      return null;
    }

    return version;
  };

  /**
   * Check if data has changed since last save
   * @param {Object} state
   * @returns {boolean} - whether data has changed or not
   */


  KeplerGLSchema.prototype.hasDataChanged = function hasDataChanged(state) {
    return this._datasetLastSaved !== state.visState.datasets;
  };

  return KeplerGLSchema;
}();

var KeplerGLSchemaManager = new KeplerGLSchema();

exports.default = KeplerGLSchemaManager;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWFzL2luZGV4LmpzIl0sIm5hbWVzIjpbIlJFRFVDRVJfU0NIRU1BUyIsInZpc1N0YXRlIiwibWFwU3RhdGUiLCJtYXBTdHlsZSIsIktlcGxlckdMU2NoZW1hIiwiX3ZhbGlkVmVyc2lvbnMiLCJfdmVyc2lvbiIsIl9yZWR1Y2VyU2NoZW1hcyIsIl9kYXRhc2V0U2NoZW1hIiwiX2RhdGFzZXRMYXN0U2F2ZWQiLCJfc2F2ZWREYXRhc2V0Iiwic2F2ZSIsInN0YXRlIiwiZGF0YXNldHMiLCJnZXREYXRhc2V0VG9TYXZlIiwiY29uZmlnIiwiZ2V0Q29uZmlnVG9TYXZlIiwibG9hZCIsInNhdmVkRGF0YXNldHMiLCJzYXZlZENvbmZpZyIsInBhcnNlU2F2ZWREYXRhIiwicGFyc2VTYXZlZENvbmZpZyIsInVuZGVmaW5lZCIsImRhdGFDaGFuZ2VkU2luY2VMYXN0U2F2ZSIsImhhc0RhdGFDaGFuZ2VkIiwiT2JqZWN0IiwidmFsdWVzIiwibWFwIiwidmVyc2lvbiIsImRhdGEiLCJkcyIsImtleXMiLCJyZWR1Y2UiLCJhY2N1Iiwia2V5IiwidmFsaWRWZXJzaW9uIiwidmFsaWRhdGVWZXJzaW9uIiwicHVzaCIsImVycm9yIiwiS2VwbGVyR0xTY2hlbWFNYW5hZ2VyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFFQSxJQUFNQSxrQkFBa0I7QUFDdEJDLG9DQURzQjtBQUV0QkMsb0NBRnNCO0FBR3RCQztBQUhzQixDQUF4Qjs7SUFNTUMsYztBQUNKLDRCQUFjO0FBQUE7O0FBQ1osU0FBS0MsY0FBTDtBQUNBLFNBQUtDLFFBQUw7QUFDQSxTQUFLQyxlQUFMLEdBQXVCUCxlQUF2QjtBQUNBLFNBQUtRLGNBQUw7O0FBRUEsU0FBS0MsaUJBQUwsR0FBeUIsSUFBekI7QUFDQSxTQUFLQyxhQUFMLEdBQXFCLElBQXJCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7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QUFyQixFQUEwQkMsWUFBMUIsRUFBd0NsQixJQUF4QyxDQUNFRixPQUFPbUIsR0FBUCxDQURGLEVBRUV0QixNQUFNc0IsR0FBTixDQUZGLENBREEsR0FLQSxFQVBOO0FBQUEsS0FESyxFQVVMLEVBVkssQ0FBUDtBQVlELEc7O0FBRUQ7Ozs7Ozs7MkJBS0FFLGUsNEJBQWdCUixPLEVBQVM7QUFDdkIsUUFBSSxDQUFDQSxPQUFMLEVBQWM7QUFDWixzQkFBUVUsS0FBUixDQUNFLDJEQURGO0FBR0EsYUFBTyxJQUFQO0FBQ0Q7O0FBRUQsUUFBSSxDQUFDLEtBQUtqQyxjQUFMLENBQW9CdUIsT0FBcEIsQ0FBTCxFQUFtQztBQUNqQyxzQkFBUVUsS0FBUixDQUFpQlYsT0FBakI7QUFDQSxhQUFPLElBQVA7QUFDRDs7QUFFRCxXQUFPQSxPQUFQO0FBQ0QsRzs7QUFFRDs7Ozs7OzsyQkFLQUosYywyQkFBZVosSyxFQUFPO0FBQ3BCLFdBQU8sS0FBS0gsaUJBQUwsS0FBMkJHLE1BQU1YLFFBQU4sQ0FBZVksUUFBakQ7QUFDRCxHOzs7OztBQUdILElBQU0wQix3QkFBd0IsSUFBSW5DLGNBQUosRUFBOUI7O2tCQUVlbUMscUIiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2NvbnNvbGUgYXMgQ29uc29sZX0gZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5cbmltcG9ydCB2aXNTdGF0ZVNjaGVtYSBmcm9tICcuL3Zpcy1zdGF0ZS1zY2hlbWEnO1xuaW1wb3J0IGRhdGFzZXRTY2hlbWEgZnJvbSAnLi9kYXRhc2V0LXNjaGVtYSc7XG5pbXBvcnQgbWFwU3R5bGVTY2hlbWEgZnJvbSAnLi9tYXAtc3R5bGUtc2NoZW1hJztcbmltcG9ydCBtYXBTdGF0ZVNjaGVtYSBmcm9tICcuL21hcC1zdGF0ZS1zY2hlbWEnO1xuXG5pbXBvcnQge0NVUlJFTlRfVkVSU0lPTiwgVkVSU0lPTlN9IGZyb20gJy4vdmVyc2lvbnMnO1xuXG5jb25zdCBSRURVQ0VSX1NDSEVNQVMgPSB7XG4gIHZpc1N0YXRlOiB2aXNTdGF0ZVNjaGVtYSxcbiAgbWFwU3RhdGU6IG1hcFN0YXRlU2NoZW1hLFxuICBtYXBTdHlsZTogbWFwU3R5bGVTY2hlbWFcbn07XG5cbmNsYXNzIEtlcGxlckdMU2NoZW1hIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fdmFsaWRWZXJzaW9ucyA9IFZFUlNJT05TO1xuICAgIHRoaXMuX3ZlcnNpb24gPSBDVVJSRU5UX1ZFUlNJT047XG4gICAgdGhpcy5fcmVkdWNlclNjaGVtYXMgPSBSRURVQ0VSX1NDSEVNQVM7XG4gICAgdGhpcy5fZGF0YXNldFNjaGVtYSA9IGRhdGFzZXRTY2hlbWE7XG5cbiAgICB0aGlzLl9kYXRhc2V0TGFzdFNhdmVkID0gbnVsbDtcbiAgICB0aGlzLl9zYXZlZERhdGFzZXQgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIHN0YXRlVG9TYXZlID0ge1xuICAgKiAgIGRhdGFzZXRzOiBbXG4gICAqICAgICB7XG4gICAqICAgICAgIHZlcnNpb246ICd2MCcsXG4gICAqICAgICAgIGRhdGE6IHtpZCwgbGFiZWwsIGNvbG9yLCBhbGxEYXRhLCBmaWVsZHN9XG4gICAqICAgICB9LFxuICAgKiAgICAge1xuICAgKiAgICAgICB2ZXJzaW9uOiAndjAnLFxuICAgKiAgICAgICBkYXRhOiB7aWQsIGxhYmVsLCBjb2xvciwgYWxsRGF0YSwgZmllbGRzfVxuICAgKiAgICAgfVxuICAgKiAgIF0sXG4gICAqICAgY29uZmlnOiB7XG4gICAqICAgICB2ZXJzaW9uOiAndjAnLFxuICAgKiAgICAgY29uZmlnOiB7fVxuICAgKiAgIH1cbiAgICogfVxuICAgKlxuICAgKiBHZXQgY29uZmlnIGFuZCBkYXRhIG9mIGN1cnJlbnQgbWFwIHRvIHNhdmVcbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlXG4gICAqIEByZXR1cm5zIHtPYmplY3QgfCBudWxsfSBhcHAgc3RhdGUgdG8gc2F2ZVxuICAgKi9cbiAgc2F2ZShzdGF0ZSkge1xuICAgIHJldHVybiB7XG4gICAgICBkYXRhc2V0czogdGhpcy5nZXREYXRhc2V0VG9TYXZlKHN0YXRlKSxcbiAgICAgIGNvbmZpZzogdGhpcy5nZXRDb25maWdUb1NhdmUoc3RhdGUpXG4gICAgfTtcbiAgfVxuXG4gIGxvYWQoc2F2ZWREYXRhc2V0cywgc2F2ZWRDb25maWcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGF0YXNldHM6IHRoaXMucGFyc2VTYXZlZERhdGEoc2F2ZWREYXRhc2V0cyksXG4gICAgICBjb25maWc6IHNhdmVkQ29uZmlnID8gdGhpcy5wYXJzZVNhdmVkQ29uZmlnKHNhdmVkQ29uZmlnKSA6IHVuZGVmaW5lZFxuICAgIH07XG4gIH1cbiAgLyoqXG4gICAqIEdldCBkYXRhIHRvIHNhdmVcbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlIC0gYXBwIHN0YXRlXG4gICAqIEByZXR1cm5zIHt7dmVyc2lvbjogU3RyaW5nLCBkYXRhOiBPYmplY3R9fSAtIGRhdGFzZXQgdG8gc2F2ZVxuICAgKi9cbiAgZ2V0RGF0YXNldFRvU2F2ZShzdGF0ZSkge1xuICAgIGNvbnN0IGRhdGFDaGFuZ2VkU2luY2VMYXN0U2F2ZSA9IHRoaXMuaGFzRGF0YUNoYW5nZWQoc3RhdGUpO1xuICAgIGlmICghZGF0YUNoYW5nZWRTaW5jZUxhc3RTYXZlKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2F2ZWREYXRhc2V0O1xuICAgIH1cblxuICAgIGNvbnN0IHt2aXNTdGF0ZX0gPSBzdGF0ZTtcblxuICAgIGNvbnN0IGRhdGFzZXRzID0gT2JqZWN0LnZhbHVlcyh2aXNTdGF0ZS5kYXRhc2V0cykubWFwKGRzID0+ICh7XG4gICAgICB2ZXJzaW9uOiB0aGlzLl92ZXJzaW9uLFxuICAgICAgZGF0YTogdGhpcy5fZGF0YXNldFNjaGVtYVt0aGlzLl92ZXJzaW9uXS5zYXZlKGRzKVxuICAgIH0pKTtcblxuICAgIC8vIGtlZXAgYSBjb3B5IG9mIGZvcm1hdHRlZCBkYXRhc2V0cyB0byBzYXZlXG4gICAgdGhpcy5fZGF0YXNldExhc3RTYXZlZCA9IHZpc1N0YXRlLmRhdGFzZXRzO1xuICAgIHRoaXMuX3NhdmVkRGF0YXNldCA9IGRhdGFzZXRzO1xuXG4gICAgcmV0dXJuIGRhdGFzZXRzO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBBcHAgY29uZmlnIHRvIHNhdmVcbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlIC0gYXBwIHN0YXRlXG4gICAqIEByZXR1cm5zIHt7dmVyc2lvbjogU3RyaW5nLCBjb25maWc6IE9iamVjdH19IC0gY29uZmlnIHRvIHNhdmVcbiAgICovXG4gIGdldENvbmZpZ1RvU2F2ZShzdGF0ZSkge1xuICAgIGNvbnN0IGNvbmZpZyA9IE9iamVjdC5rZXlzKHRoaXMuX3JlZHVjZXJTY2hlbWFzKS5yZWR1Y2UoXG4gICAgICAoYWNjdSwga2V5KSA9PiAoe1xuICAgICAgICAuLi5hY2N1LFxuICAgICAgICAuLi50aGlzLl9yZWR1Y2VyU2NoZW1hc1trZXldW3RoaXMuX3ZlcnNpb25dLnNhdmUoc3RhdGVba2V5XSlcbiAgICAgIH0pLFxuICAgICAge31cbiAgICApO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHZlcnNpb246IHRoaXMuX3ZlcnNpb24sXG4gICAgICBjb25maWdcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFBhcnNlIHNhdmVkIGRhdGFcbiAgICogQHBhcmFtIHtBcnJheX0gZGF0YXNldHNcbiAgICogQHJldHVybnMge09iamVjdCB8IG51bGx9IC0gZGF0YSB0byBzYXZlXG4gICAqL1xuICBwYXJzZVNhdmVkRGF0YShkYXRhc2V0cykge1xuICAgIHJldHVybiBkYXRhc2V0cy5yZWR1Y2UoKGFjY3UsIGRzKSA9PiB7XG4gICAgICBjb25zdCB2YWxpZFZlcnNpb24gPSB0aGlzLnZhbGlkYXRlVmVyc2lvbihkcy52ZXJzaW9uKTtcbiAgICAgIGlmICghdmFsaWRWZXJzaW9uKSB7XG4gICAgICAgIHJldHVybiBhY2N1O1xuICAgICAgfVxuICAgICAgYWNjdS5wdXNoKHRoaXMuX2RhdGFzZXRTY2hlbWFbdmFsaWRWZXJzaW9uXS5sb2FkKGRzLmRhdGEpKTtcbiAgICAgIHJldHVybiBhY2N1O1xuICAgIH0sIFtdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXJzZSBzYXZlZCBBcHAgY29uZmlnXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBvcHQudmVyc2lvbiAtIGNvbmZpZyB2ZXJzaW9uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHQuY29uZmlnIC0gc2F2ZWQgY29uZmlnXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZSAtIGN1cnJlbnQgQXBwIFN0YXRlXG4gICAqIEByZXR1cm5zIHtPYmplY3QgfCBudWxsfSAtIHBhcnNlZCBjb25maWdcbiAgICovXG4gIHBhcnNlU2F2ZWRDb25maWcoe3ZlcnNpb24sIGNvbmZpZ30sIHN0YXRlID0ge30pIHtcbiAgICBjb25zdCB2YWxpZFZlcnNpb24gPSB0aGlzLnZhbGlkYXRlVmVyc2lvbih2ZXJzaW9uKTtcbiAgICBpZiAoIXZhbGlkVmVyc2lvbikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGNvbmZpZykucmVkdWNlKFxuICAgICAgKGFjY3UsIGtleSkgPT4gKHtcbiAgICAgICAgLi4uYWNjdSxcbiAgICAgICAgLi4uKGtleSBpbiB0aGlzLl9yZWR1Y2VyU2NoZW1hc1xuICAgICAgICAgID8gdGhpcy5fcmVkdWNlclNjaGVtYXNba2V5XVt2YWxpZFZlcnNpb25dLmxvYWQoXG4gICAgICAgICAgICAgIGNvbmZpZ1trZXldLFxuICAgICAgICAgICAgICBzdGF0ZVtrZXldXG4gICAgICAgICAgICApXG4gICAgICAgICAgOiB7fSlcbiAgICAgIH0pLFxuICAgICAge31cbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIHZlcnNpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHZlcnNpb25cbiAgICogQHJldHVybnMge1N0cmluZyB8IG51bGx9IHZhbGlkVmVyc2lvblxuICAgKi9cbiAgdmFsaWRhdGVWZXJzaW9uKHZlcnNpb24pIHtcbiAgICBpZiAoIXZlcnNpb24pIHtcbiAgICAgIENvbnNvbGUuZXJyb3IoXG4gICAgICAgICdUaGVyZSBpcyBubyB2ZXJzaW9uIG51bWJlciBhc3NvY2lhdGVkIHdpdGggdGhpcyBzYXZlZCBtYXAnXG4gICAgICApO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLl92YWxpZFZlcnNpb25zW3ZlcnNpb25dKSB7XG4gICAgICBDb25zb2xlLmVycm9yKGAke3ZlcnNpb259IGlzIG5vdCBhIHZhbGlkIHZlcnNpb25gKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB2ZXJzaW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGRhdGEgaGFzIGNoYW5nZWQgc2luY2UgbGFzdCBzYXZlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSB3aGV0aGVyIGRhdGEgaGFzIGNoYW5nZWQgb3Igbm90XG4gICAqL1xuICBoYXNEYXRhQ2hhbmdlZChzdGF0ZSkge1xuICAgIHJldHVybiB0aGlzLl9kYXRhc2V0TGFzdFNhdmVkICE9PSBzdGF0ZS52aXNTdGF0ZS5kYXRhc2V0cztcbiAgfVxufVxuXG5jb25zdCBLZXBsZXJHTFNjaGVtYU1hbmFnZXIgPSBuZXcgS2VwbGVyR0xTY2hlbWEoKTtcblxuZXhwb3J0IGRlZmF1bHQgS2VwbGVyR0xTY2hlbWFNYW5hZ2VyO1xuIl19
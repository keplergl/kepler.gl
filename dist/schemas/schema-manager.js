"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.KeplerGLSchema = exports.reducerSchema = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _window = require("global/window");

var _visStateSchema = _interopRequireDefault(require("./vis-state-schema"));

var _datasetSchema = _interopRequireDefault(require("./dataset-schema"));

var _mapStyleSchema = _interopRequireDefault(require("./map-style-schema"));

var _mapStateSchema = _interopRequireDefault(require("./map-state-schema"));

var _versions = require("./versions");

var _utils = require("../utils/utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var reducerSchema = {
  visState: _visStateSchema["default"],
  mapState: _mapStateSchema["default"],
  mapStyle: _mapStyleSchema["default"]
};
/** @type {typeof import('./schema-manager').KeplerGLSchema} */

exports.reducerSchema = reducerSchema;

var KeplerGLSchema = /*#__PURE__*/function () {
  function KeplerGLSchema() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$reducers = _ref.reducers,
        reducers = _ref$reducers === void 0 ? reducerSchema : _ref$reducers,
        _ref$datasets = _ref.datasets,
        datasets = _ref$datasets === void 0 ? _datasetSchema["default"] : _ref$datasets,
        _ref$validVersions = _ref.validVersions,
        validVersions = _ref$validVersions === void 0 ? _versions.VERSIONS : _ref$validVersions,
        _ref$version = _ref.version,
        version = _ref$version === void 0 ? _versions.CURRENT_VERSION : _ref$version;

    (0, _classCallCheck2["default"])(this, KeplerGLSchema);
    this._validVersions = validVersions;
    this._version = version;
    this._reducerSchemas = reducers;
    this._datasetSchema = datasets;
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
   *   },
   *   info: {
   *     app: 'kepler.gl',
   *     create_at: 'Mon May 28 2018 21:04:46 GMT-0700 (PDT)'
   *   }
   * }
   *
   * Get config and data of current map to save
   * @param state
   * @returns app state to save
   */


  (0, _createClass2["default"])(KeplerGLSchema, [{
    key: "save",
    value: function save(state) {
      return {
        datasets: this.getDatasetToSave(state),
        config: this.getConfigToSave(state),
        info: _objectSpread({
          app: 'kepler.gl',
          created_at: new Date().toString()
        }, this.getMapInfo(state))
      };
    }
  }, {
    key: "getMapInfo",
    value: function getMapInfo(state) {
      return state.visState.mapInfo;
    }
    /**
     *  Load saved map, argument can be (datasets, config) or ({datasets, config})
     * @param savedDatasets
     * @param savedConfig
     */

  }, {
    key: "load",
    value: function load(savedDatasets, savedConfig) {
      // if pass dataset and config in as a single object
      if (arguments.length === 1 && (0, _utils.isPlainObject)(arguments[0]) && (Array.isArray(arguments[0].datasets) || (0, _utils.isPlainObject)(arguments[0].config))) {
        return this.load(arguments[0].datasets, arguments[0].config);
      }

      return _objectSpread(_objectSpread({}, Array.isArray(savedDatasets) ? {
        datasets: this.parseSavedData(savedDatasets)
      } : {}), savedConfig ? {
        config: this.parseSavedConfig(savedConfig)
      } : {});
    }
    /**
     * Get data to save
     * @param state - app state
     * @returns - dataset to save
     */

  }, {
    key: "getDatasetToSave",
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
      }); // keep a copy of formatted datasets to save

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
    key: "getConfigToSave",
    value: function getConfigToSave(state) {
      var _this2 = this;

      var config = Object.keys(this._reducerSchemas).reduce(function (accu, key) {
        return _objectSpread(_objectSpread({}, accu), state[key] ? _this2._reducerSchemas[key][_this2._version].save(state[key]) : {});
      }, {});
      return {
        version: this._version,
        config: config
      };
    }
    /**
     * Parse saved data
     * @param datasets
     * @returns - dataset to pass to addDataToMap
     */

  }, {
    key: "parseSavedData",
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
     */

  }, {
    key: "parseSavedConfig",
    value: function parseSavedConfig(_ref2) {
      var _this4 = this;

      var version = _ref2.version,
          config = _ref2.config;
      var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var validVersion = this.validateVersion(version);

      if (!validVersion) {
        return null;
      }

      return Object.keys(config).reduce(function (accu, key) {
        return _objectSpread(_objectSpread({}, accu), key in _this4._reducerSchemas ? _this4._reducerSchemas[key][validVersion].load(config[key]) : {});
      }, {});
    }
    /**
     * Validate version
     * @param version
     * @returns validVersion
     */

  }, {
    key: "validateVersion",
    value: function validateVersion(version) {
      if (!version) {
        _window.console.error('There is no version number associated with this saved map');

        return null;
      }

      if (!this._validVersions[version]) {
        _window.console.error("".concat(version, " is not a valid version"));

        return null;
      }

      return version;
    }
    /**
     * Check if data has changed since last save
     * @param state
     * @returns - whether data has changed or not
     */

  }, {
    key: "hasDataChanged",
    value: function hasDataChanged(state) {
      return this._datasetLastSaved !== state.visState.datasets;
    }
  }]);
  return KeplerGLSchema;
}();

exports.KeplerGLSchema = KeplerGLSchema;
var KeplerGLSchemaManager = new KeplerGLSchema();
var _default = KeplerGLSchemaManager;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWFzL3NjaGVtYS1tYW5hZ2VyLmpzIl0sIm5hbWVzIjpbInJlZHVjZXJTY2hlbWEiLCJ2aXNTdGF0ZSIsInZpc1N0YXRlU2NoZW1hIiwibWFwU3RhdGUiLCJtYXBTdGF0ZVNjaGVtYSIsIm1hcFN0eWxlIiwibWFwU3R5bGVTY2hlbWEiLCJLZXBsZXJHTFNjaGVtYSIsInJlZHVjZXJzIiwiZGF0YXNldHMiLCJkYXRhc2V0U2NoZW1hIiwidmFsaWRWZXJzaW9ucyIsIlZFUlNJT05TIiwidmVyc2lvbiIsIkNVUlJFTlRfVkVSU0lPTiIsIl92YWxpZFZlcnNpb25zIiwiX3ZlcnNpb24iLCJfcmVkdWNlclNjaGVtYXMiLCJfZGF0YXNldFNjaGVtYSIsIl9kYXRhc2V0TGFzdFNhdmVkIiwiX3NhdmVkRGF0YXNldCIsInN0YXRlIiwiZ2V0RGF0YXNldFRvU2F2ZSIsImNvbmZpZyIsImdldENvbmZpZ1RvU2F2ZSIsImluZm8iLCJhcHAiLCJjcmVhdGVkX2F0IiwiRGF0ZSIsInRvU3RyaW5nIiwiZ2V0TWFwSW5mbyIsIm1hcEluZm8iLCJzYXZlZERhdGFzZXRzIiwic2F2ZWRDb25maWciLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJBcnJheSIsImlzQXJyYXkiLCJsb2FkIiwicGFyc2VTYXZlZERhdGEiLCJwYXJzZVNhdmVkQ29uZmlnIiwiZGF0YUNoYW5nZWRTaW5jZUxhc3RTYXZlIiwiaGFzRGF0YUNoYW5nZWQiLCJPYmplY3QiLCJ2YWx1ZXMiLCJtYXAiLCJkcyIsImRhdGEiLCJzYXZlIiwia2V5cyIsInJlZHVjZSIsImFjY3UiLCJrZXkiLCJ2YWxpZFZlcnNpb24iLCJ2YWxpZGF0ZVZlcnNpb24iLCJwdXNoIiwiQ29uc29sZSIsImVycm9yIiwiS2VwbGVyR0xTY2hlbWFNYW5hZ2VyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7Ozs7OztBQUVPLElBQU1BLGFB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MkRBQWQ7O0FBQ0EsZUFBTyxJQUFQO0FBQ0Q7O0FBRUQsVUFBSSxDQUFDLEtBQUsxQyxjQUFMLENBQW9CRixPQUFwQixDQUFMLEVBQW1DO0FBQ2pDMkMsd0JBQVFDLEtBQVIsV0FBaUI1QyxPQUFqQjs7QUFDQSxlQUFPLElBQVA7QUFDRDs7QUFFRCxhQUFPQSxPQUFQO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBOzs7O1dBQ0Usd0JBQWVRLEtBQWYsRUFBc0I7QUFDcEIsYUFBTyxLQUFLRixpQkFBTCxLQUEyQkUsS0FBSyxDQUFDcEIsUUFBTixDQUFlUSxRQUFqRDtBQUNEOzs7Ozs7QUFHSCxJQUFNaUQscUJBQXFCLEdBQUcsSUFBSW5ELGNBQUosRUFBOUI7ZUFFZW1ELHFCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHtjb25zb2xlIGFzIENvbnNvbGV9IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuXG5pbXBvcnQgdmlzU3RhdGVTY2hlbWEgZnJvbSAnLi92aXMtc3RhdGUtc2NoZW1hJztcbmltcG9ydCBkYXRhc2V0U2NoZW1hIGZyb20gJy4vZGF0YXNldC1zY2hlbWEnO1xuaW1wb3J0IG1hcFN0eWxlU2NoZW1hIGZyb20gJy4vbWFwLXN0eWxlLXNjaGVtYSc7XG5pbXBvcnQgbWFwU3RhdGVTY2hlbWEgZnJvbSAnLi9tYXAtc3RhdGUtc2NoZW1hJztcblxuaW1wb3J0IHtDVVJSRU5UX1ZFUlNJT04sIFZFUlNJT05TfSBmcm9tICcuL3ZlcnNpb25zJztcbmltcG9ydCB7aXNQbGFpbk9iamVjdH0gZnJvbSAndXRpbHMvdXRpbHMnO1xuXG5leHBvcnQgY29uc3QgcmVkdWNlclNjaGVtYSA9IHtcbiAgdmlzU3RhdGU6IHZpc1N0YXRlU2NoZW1hLFxuICBtYXBTdGF0ZTogbWFwU3RhdGVTY2hlbWEsXG4gIG1hcFN0eWxlOiBtYXBTdHlsZVNjaGVtYVxufTtcblxuLyoqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3NjaGVtYS1tYW5hZ2VyJykuS2VwbGVyR0xTY2hlbWF9ICovXG5leHBvcnQgY2xhc3MgS2VwbGVyR0xTY2hlbWEge1xuICBjb25zdHJ1Y3Rvcih7XG4gICAgcmVkdWNlcnMgPSByZWR1Y2VyU2NoZW1hLFxuICAgIGRhdGFzZXRzID0gZGF0YXNldFNjaGVtYSxcbiAgICB2YWxpZFZlcnNpb25zID0gVkVSU0lPTlMsXG4gICAgdmVyc2lvbiA9IENVUlJFTlRfVkVSU0lPTlxuICB9ID0ge30pIHtcbiAgICB0aGlzLl92YWxpZFZlcnNpb25zID0gdmFsaWRWZXJzaW9ucztcbiAgICB0aGlzLl92ZXJzaW9uID0gdmVyc2lvbjtcbiAgICB0aGlzLl9yZWR1Y2VyU2NoZW1hcyA9IHJlZHVjZXJzO1xuICAgIHRoaXMuX2RhdGFzZXRTY2hlbWEgPSBkYXRhc2V0cztcblxuICAgIHRoaXMuX2RhdGFzZXRMYXN0U2F2ZWQgPSBudWxsO1xuICAgIHRoaXMuX3NhdmVkRGF0YXNldCA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogc3RhdGVUb1NhdmUgPSB7XG4gICAqICAgZGF0YXNldHM6IFtcbiAgICogICAgIHtcbiAgICogICAgICAgdmVyc2lvbjogJ3YwJyxcbiAgICogICAgICAgZGF0YToge2lkLCBsYWJlbCwgY29sb3IsIGFsbERhdGEsIGZpZWxkc31cbiAgICogICAgIH0sXG4gICAqICAgICB7XG4gICAqICAgICAgIHZlcnNpb246ICd2MCcsXG4gICAqICAgICAgIGRhdGE6IHtpZCwgbGFiZWwsIGNvbG9yLCBhbGxEYXRhLCBmaWVsZHN9XG4gICAqICAgICB9XG4gICAqICAgXSxcbiAgICogICBjb25maWc6IHtcbiAgICogICAgIHZlcnNpb246ICd2MCcsXG4gICAqICAgICBjb25maWc6IHt9XG4gICAqICAgfSxcbiAgICogICBpbmZvOiB7XG4gICAqICAgICBhcHA6ICdrZXBsZXIuZ2wnLFxuICAgKiAgICAgY3JlYXRlX2F0OiAnTW9uIE1heSAyOCAyMDE4IDIxOjA0OjQ2IEdNVC0wNzAwIChQRFQpJ1xuICAgKiAgIH1cbiAgICogfVxuICAgKlxuICAgKiBHZXQgY29uZmlnIGFuZCBkYXRhIG9mIGN1cnJlbnQgbWFwIHRvIHNhdmVcbiAgICogQHBhcmFtIHN0YXRlXG4gICAqIEByZXR1cm5zIGFwcCBzdGF0ZSB0byBzYXZlXG4gICAqL1xuICBzYXZlKHN0YXRlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGFzZXRzOiB0aGlzLmdldERhdGFzZXRUb1NhdmUoc3RhdGUpLFxuICAgICAgY29uZmlnOiB0aGlzLmdldENvbmZpZ1RvU2F2ZShzdGF0ZSksXG4gICAgICBpbmZvOiB7XG4gICAgICAgIGFwcDogJ2tlcGxlci5nbCcsXG4gICAgICAgIGNyZWF0ZWRfYXQ6IG5ldyBEYXRlKCkudG9TdHJpbmcoKSxcbiAgICAgICAgLi4udGhpcy5nZXRNYXBJbmZvKHN0YXRlKVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBnZXRNYXBJbmZvKHN0YXRlKSB7XG4gICAgcmV0dXJuIHN0YXRlLnZpc1N0YXRlLm1hcEluZm87XG4gIH1cbiAgLyoqXG4gICAqICBMb2FkIHNhdmVkIG1hcCwgYXJndW1lbnQgY2FuIGJlIChkYXRhc2V0cywgY29uZmlnKSBvciAoe2RhdGFzZXRzLCBjb25maWd9KVxuICAgKiBAcGFyYW0gc2F2ZWREYXRhc2V0c1xuICAgKiBAcGFyYW0gc2F2ZWRDb25maWdcbiAgICovXG4gIGxvYWQoc2F2ZWREYXRhc2V0cywgc2F2ZWRDb25maWcpIHtcbiAgICAvLyBpZiBwYXNzIGRhdGFzZXQgYW5kIGNvbmZpZyBpbiBhcyBhIHNpbmdsZSBvYmplY3RcbiAgICBpZiAoXG4gICAgICBhcmd1bWVudHMubGVuZ3RoID09PSAxICYmXG4gICAgICBpc1BsYWluT2JqZWN0KGFyZ3VtZW50c1swXSkgJiZcbiAgICAgIChBcnJheS5pc0FycmF5KGFyZ3VtZW50c1swXS5kYXRhc2V0cykgfHwgaXNQbGFpbk9iamVjdChhcmd1bWVudHNbMF0uY29uZmlnKSlcbiAgICApIHtcbiAgICAgIHJldHVybiB0aGlzLmxvYWQoYXJndW1lbnRzWzBdLmRhdGFzZXRzLCBhcmd1bWVudHNbMF0uY29uZmlnKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uKEFycmF5LmlzQXJyYXkoc2F2ZWREYXRhc2V0cykgPyB7ZGF0YXNldHM6IHRoaXMucGFyc2VTYXZlZERhdGEoc2F2ZWREYXRhc2V0cyl9IDoge30pLFxuICAgICAgLi4uKHNhdmVkQ29uZmlnID8ge2NvbmZpZzogdGhpcy5wYXJzZVNhdmVkQ29uZmlnKHNhdmVkQ29uZmlnKX0gOiB7fSlcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBkYXRhIHRvIHNhdmVcbiAgICogQHBhcmFtIHN0YXRlIC0gYXBwIHN0YXRlXG4gICAqIEByZXR1cm5zIC0gZGF0YXNldCB0byBzYXZlXG4gICAqL1xuICBnZXREYXRhc2V0VG9TYXZlKHN0YXRlKSB7XG4gICAgY29uc3QgZGF0YUNoYW5nZWRTaW5jZUxhc3RTYXZlID0gdGhpcy5oYXNEYXRhQ2hhbmdlZChzdGF0ZSk7XG4gICAgaWYgKCFkYXRhQ2hhbmdlZFNpbmNlTGFzdFNhdmUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zYXZlZERhdGFzZXQ7XG4gICAgfVxuXG4gICAgY29uc3Qge3Zpc1N0YXRlfSA9IHN0YXRlO1xuXG4gICAgY29uc3QgZGF0YXNldHMgPSBPYmplY3QudmFsdWVzKHZpc1N0YXRlLmRhdGFzZXRzKS5tYXAoZHMgPT4gKHtcbiAgICAgIHZlcnNpb246IHRoaXMuX3ZlcnNpb24sXG4gICAgICBkYXRhOiB0aGlzLl9kYXRhc2V0U2NoZW1hW3RoaXMuX3ZlcnNpb25dLnNhdmUoZHMpXG4gICAgfSkpO1xuXG4gICAgLy8ga2VlcCBhIGNvcHkgb2YgZm9ybWF0dGVkIGRhdGFzZXRzIHRvIHNhdmVcbiAgICB0aGlzLl9kYXRhc2V0TGFzdFNhdmVkID0gdmlzU3RhdGUuZGF0YXNldHM7XG4gICAgdGhpcy5fc2F2ZWREYXRhc2V0ID0gZGF0YXNldHM7XG5cbiAgICByZXR1cm4gZGF0YXNldHM7XG4gIH1cblxuICAvKipcbiAgICogR2V0IEFwcCBjb25maWcgdG8gc2F2ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGUgLSBhcHAgc3RhdGVcbiAgICogQHJldHVybnMge3t2ZXJzaW9uOiBTdHJpbmcsIGNvbmZpZzogT2JqZWN0fX0gLSBjb25maWcgdG8gc2F2ZVxuICAgKi9cbiAgZ2V0Q29uZmlnVG9TYXZlKHN0YXRlKSB7XG4gICAgY29uc3QgY29uZmlnID0gT2JqZWN0LmtleXModGhpcy5fcmVkdWNlclNjaGVtYXMpLnJlZHVjZShcbiAgICAgIChhY2N1LCBrZXkpID0+ICh7XG4gICAgICAgIC4uLmFjY3UsXG4gICAgICAgIC4uLihzdGF0ZVtrZXldID8gdGhpcy5fcmVkdWNlclNjaGVtYXNba2V5XVt0aGlzLl92ZXJzaW9uXS5zYXZlKHN0YXRlW2tleV0pIDoge30pXG4gICAgICB9KSxcbiAgICAgIHt9XG4gICAgKTtcblxuICAgIHJldHVybiB7XG4gICAgICB2ZXJzaW9uOiB0aGlzLl92ZXJzaW9uLFxuICAgICAgY29uZmlnXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXJzZSBzYXZlZCBkYXRhXG4gICAqIEBwYXJhbSBkYXRhc2V0c1xuICAgKiBAcmV0dXJucyAtIGRhdGFzZXQgdG8gcGFzcyB0byBhZGREYXRhVG9NYXBcbiAgICovXG4gIHBhcnNlU2F2ZWREYXRhKGRhdGFzZXRzKSB7XG4gICAgcmV0dXJuIGRhdGFzZXRzLnJlZHVjZSgoYWNjdSwgZHMpID0+IHtcbiAgICAgIGNvbnN0IHZhbGlkVmVyc2lvbiA9IHRoaXMudmFsaWRhdGVWZXJzaW9uKGRzLnZlcnNpb24pO1xuICAgICAgaWYgKCF2YWxpZFZlcnNpb24pIHtcbiAgICAgICAgcmV0dXJuIGFjY3U7XG4gICAgICB9XG4gICAgICBhY2N1LnB1c2godGhpcy5fZGF0YXNldFNjaGVtYVt2YWxpZFZlcnNpb25dLmxvYWQoZHMuZGF0YSkpO1xuICAgICAgcmV0dXJuIGFjY3U7XG4gICAgfSwgW10pO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhcnNlIHNhdmVkIEFwcCBjb25maWdcbiAgICovXG4gIHBhcnNlU2F2ZWRDb25maWcoe3ZlcnNpb24sIGNvbmZpZ30sIHN0YXRlID0ge30pIHtcbiAgICBjb25zdCB2YWxpZFZlcnNpb24gPSB0aGlzLnZhbGlkYXRlVmVyc2lvbih2ZXJzaW9uKTtcbiAgICBpZiAoIXZhbGlkVmVyc2lvbikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGNvbmZpZykucmVkdWNlKFxuICAgICAgKGFjY3UsIGtleSkgPT4gKHtcbiAgICAgICAgLi4uYWNjdSxcbiAgICAgICAgLi4uKGtleSBpbiB0aGlzLl9yZWR1Y2VyU2NoZW1hc1xuICAgICAgICAgID8gdGhpcy5fcmVkdWNlclNjaGVtYXNba2V5XVt2YWxpZFZlcnNpb25dLmxvYWQoY29uZmlnW2tleV0pXG4gICAgICAgICAgOiB7fSlcbiAgICAgIH0pLFxuICAgICAge31cbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIHZlcnNpb25cbiAgICogQHBhcmFtIHZlcnNpb25cbiAgICogQHJldHVybnMgdmFsaWRWZXJzaW9uXG4gICAqL1xuICB2YWxpZGF0ZVZlcnNpb24odmVyc2lvbikge1xuICAgIGlmICghdmVyc2lvbikge1xuICAgICAgQ29uc29sZS5lcnJvcignVGhlcmUgaXMgbm8gdmVyc2lvbiBudW1iZXIgYXNzb2NpYXRlZCB3aXRoIHRoaXMgc2F2ZWQgbWFwJyk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX3ZhbGlkVmVyc2lvbnNbdmVyc2lvbl0pIHtcbiAgICAgIENvbnNvbGUuZXJyb3IoYCR7dmVyc2lvbn0gaXMgbm90IGEgdmFsaWQgdmVyc2lvbmApO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZlcnNpb247XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgZGF0YSBoYXMgY2hhbmdlZCBzaW5jZSBsYXN0IHNhdmVcbiAgICogQHBhcmFtIHN0YXRlXG4gICAqIEByZXR1cm5zIC0gd2hldGhlciBkYXRhIGhhcyBjaGFuZ2VkIG9yIG5vdFxuICAgKi9cbiAgaGFzRGF0YUNoYW5nZWQoc3RhdGUpIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0YXNldExhc3RTYXZlZCAhPT0gc3RhdGUudmlzU3RhdGUuZGF0YXNldHM7XG4gIH1cbn1cblxuY29uc3QgS2VwbGVyR0xTY2hlbWFNYW5hZ2VyID0gbmV3IEtlcGxlckdMU2NoZW1hKCk7XG5cbmV4cG9ydCBkZWZhdWx0IEtlcGxlckdMU2NoZW1hTWFuYWdlcjtcbiJdfQ==
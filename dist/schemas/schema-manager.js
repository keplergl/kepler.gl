"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

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

var REDUCER_SCHEMAS = {
  visState: _visStateSchema["default"],
  mapState: _mapStateSchema["default"],
  mapStyle: _mapStyleSchema["default"]
};
/** @type {typeof import('./schema-manager').KeplerGLSchema} */

var KeplerGLSchema =
/*#__PURE__*/
function () {
  function KeplerGLSchema() {
    (0, _classCallCheck2["default"])(this, KeplerGLSchema);
    this._validVersions = _versions.VERSIONS;
    this._version = _versions.CURRENT_VERSION;
    this._reducerSchemas = REDUCER_SCHEMAS;
    this._datasetSchema = _datasetSchema["default"];
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

      return _objectSpread({}, Array.isArray(savedDatasets) ? {
        datasets: this.parseSavedData(savedDatasets)
      } : {}, {}, savedConfig ? {
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
        return _objectSpread({}, accu, {}, state[key] ? _this2._reducerSchemas[key][_this2._version].save(state[key]) : {});
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
        return _objectSpread({}, accu, {}, key in _this4._reducerSchemas ? _this4._reducerSchemas[key][validVersion].load(config[key]) : {});
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

var KeplerGLSchemaManager = new KeplerGLSchema();
var _default = KeplerGLSchemaManager;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWFzL3NjaGVtYS1tYW5hZ2VyLmpzIl0sIm5hbWVzIjpbIlJFRFVDRVJfU0NIRU1BUyIsInZpc1N0YXRlIiwidmlzU3RhdGVTY2hlbWEiLCJtYXBTdGF0ZSIsIm1hcFN0YXRlU2NoZW1hIiwibWFwU3R5bGUiLCJtYXBTdHlsZVNjaGVtYSIsIktlcGxlckdMU2NoZW1hIiwiX3ZhbGlkVmVyc2lvbnMiLCJWRVJTSU9OUyIsIl92ZXJzaW9uIiwiQ1VSUkVOVF9WRVJTSU9OIiwiX3JlZHVjZXJTY2hlbWFzIiwiX2RhdGFzZXRTY2hlbWEiLCJkYXRhc2V0U2NoZW1hIiwiX2RhdGFzZXRMYXN0U2F2ZWQiLCJfc2F2ZWREYXRhc2V0Iiwic3RhdGUiLCJkYXRhc2V0cyIsImdldERhdGFzZXRUb1NhdmUiLCJjb25maWciLCJnZXRDb25maWdUb1NhdmUiLCJpbmZvIiwiYXBwIiwiY3JlYXRlZF9hdCIsIkRhdGUiLCJ0b1N0cmluZyIsImdldE1hcEluZm8iLCJtYXBJbmZvIiwic2F2ZWREYXRhc2V0cyIsInNhdmVkQ29uZmlnIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiQXJyYXkiLCJpc0FycmF5IiwibG9hZCIsInBhcnNlU2F2ZWREYXRhIiwicGFyc2VTYXZlZENvbmZpZyIsImRhdGFDaGFuZ2VkU2luY2VMYXN0U2F2ZSIsImhhc0RhdGFDaGFuZ2VkIiwiT2JqZWN0IiwidmFsdWVzIiwibWFwIiwiZHMiLCJ2ZXJzaW9uIiwiZGF0YSIsInNhdmUiLCJrZXlzIiwicmVkdWNlIiwiYWNjdSIsImtleSIsInZhbGlkVmVyc2lvbiIsInZhbGlkYXRlVmVyc2lvbiIsInB1c2giLCJDb25zb2xlIiwiZXJyb3IiLCJLZXBsZXJHTFNjaGVtYU1hbmFnZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsZUFBZSxHQUFHO0FBQ3RCQyxFQUFBQSxRQUFR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LE9BQXJCLENBQXJCOztBQUNBLFVBQUksQ0FBQ08sWUFBTCxFQUFtQjtBQUNqQixlQUFPLElBQVA7QUFDRDs7QUFFRCxhQUFPWCxNQUFNLENBQUNPLElBQVAsQ0FBWTNCLE1BQVosRUFBb0I0QixNQUFwQixDQUNMLFVBQUNDLElBQUQsRUFBT0MsR0FBUDtBQUFBLGlDQUNLRCxJQURMLE1BRU1DLEdBQUcsSUFBSSxNQUFJLENBQUN0QyxlQUFaLEdBQ0EsTUFBSSxDQUFDQSxlQUFMLENBQXFCc0MsR0FBckIsRUFBMEJDLFlBQTFCLEVBQXdDaEIsSUFBeEMsQ0FBNkNmLE1BQU0sQ0FBQzhCLEdBQUQsQ0FBbkQsQ0FEQSxHQUVBLEVBSk47QUFBQSxPQURLLEVBT0wsRUFQSyxDQUFQO0FBU0Q7QUFFRDs7Ozs7Ozs7b0NBS2dCTixPLEVBQVM7QUFDdkIsVUFBSSxDQUFDQSxPQUFMLEVBQWM7QUFDWlUsd0JBQVFDLEtBQVIsQ0FBYywyREFBZDs7QUFDQSxlQUFPLElBQVA7QUFDRDs7QUFFRCxVQUFJLENBQUMsS0FBSy9DLGNBQUwsQ0FBb0JvQyxPQUFwQixDQUFMLEVBQW1DO0FBQ2pDVSx3QkFBUUMsS0FBUixXQUFpQlgsT0FBakI7O0FBQ0EsZUFBTyxJQUFQO0FBQ0Q7O0FBRUQsYUFBT0EsT0FBUDtBQUNEO0FBRUQ7Ozs7Ozs7O21DQUtlM0IsSyxFQUFPO0FBQ3BCLGFBQU8sS0FBS0YsaUJBQUwsS0FBMkJFLEtBQUssQ0FBQ2hCLFFBQU4sQ0FBZWlCLFFBQWpEO0FBQ0Q7Ozs7O0FBR0gsSUFBTXNDLHFCQUFxQixHQUFHLElBQUlqRCxjQUFKLEVBQTlCO2VBRWVpRCxxQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCB7Y29uc29sZSBhcyBDb25zb2xlfSBmcm9tICdnbG9iYWwvd2luZG93JztcblxuaW1wb3J0IHZpc1N0YXRlU2NoZW1hIGZyb20gJy4vdmlzLXN0YXRlLXNjaGVtYSc7XG5pbXBvcnQgZGF0YXNldFNjaGVtYSBmcm9tICcuL2RhdGFzZXQtc2NoZW1hJztcbmltcG9ydCBtYXBTdHlsZVNjaGVtYSBmcm9tICcuL21hcC1zdHlsZS1zY2hlbWEnO1xuaW1wb3J0IG1hcFN0YXRlU2NoZW1hIGZyb20gJy4vbWFwLXN0YXRlLXNjaGVtYSc7XG5cbmltcG9ydCB7Q1VSUkVOVF9WRVJTSU9OLCBWRVJTSU9OU30gZnJvbSAnLi92ZXJzaW9ucyc7XG5pbXBvcnQge2lzUGxhaW5PYmplY3R9IGZyb20gJ3V0aWxzL3V0aWxzJztcblxuY29uc3QgUkVEVUNFUl9TQ0hFTUFTID0ge1xuICB2aXNTdGF0ZTogdmlzU3RhdGVTY2hlbWEsXG4gIG1hcFN0YXRlOiBtYXBTdGF0ZVNjaGVtYSxcbiAgbWFwU3R5bGU6IG1hcFN0eWxlU2NoZW1hXG59O1xuXG4vKiogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vc2NoZW1hLW1hbmFnZXInKS5LZXBsZXJHTFNjaGVtYX0gKi9cbmNsYXNzIEtlcGxlckdMU2NoZW1hIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fdmFsaWRWZXJzaW9ucyA9IFZFUlNJT05TO1xuICAgIHRoaXMuX3ZlcnNpb24gPSBDVVJSRU5UX1ZFUlNJT047XG4gICAgdGhpcy5fcmVkdWNlclNjaGVtYXMgPSBSRURVQ0VSX1NDSEVNQVM7XG4gICAgdGhpcy5fZGF0YXNldFNjaGVtYSA9IGRhdGFzZXRTY2hlbWE7XG5cbiAgICB0aGlzLl9kYXRhc2V0TGFzdFNhdmVkID0gbnVsbDtcbiAgICB0aGlzLl9zYXZlZERhdGFzZXQgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIHN0YXRlVG9TYXZlID0ge1xuICAgKiAgIGRhdGFzZXRzOiBbXG4gICAqICAgICB7XG4gICAqICAgICAgIHZlcnNpb246ICd2MCcsXG4gICAqICAgICAgIGRhdGE6IHtpZCwgbGFiZWwsIGNvbG9yLCBhbGxEYXRhLCBmaWVsZHN9XG4gICAqICAgICB9LFxuICAgKiAgICAge1xuICAgKiAgICAgICB2ZXJzaW9uOiAndjAnLFxuICAgKiAgICAgICBkYXRhOiB7aWQsIGxhYmVsLCBjb2xvciwgYWxsRGF0YSwgZmllbGRzfVxuICAgKiAgICAgfVxuICAgKiAgIF0sXG4gICAqICAgY29uZmlnOiB7XG4gICAqICAgICB2ZXJzaW9uOiAndjAnLFxuICAgKiAgICAgY29uZmlnOiB7fVxuICAgKiAgIH0sXG4gICAqICAgaW5mbzoge1xuICAgKiAgICAgYXBwOiAna2VwbGVyLmdsJyxcbiAgICogICAgIGNyZWF0ZV9hdDogJ01vbiBNYXkgMjggMjAxOCAyMTowNDo0NiBHTVQtMDcwMCAoUERUKSdcbiAgICogICB9XG4gICAqIH1cbiAgICpcbiAgICogR2V0IGNvbmZpZyBhbmQgZGF0YSBvZiBjdXJyZW50IG1hcCB0byBzYXZlXG4gICAqIEBwYXJhbSBzdGF0ZVxuICAgKiBAcmV0dXJucyBhcHAgc3RhdGUgdG8gc2F2ZVxuICAgKi9cbiAgc2F2ZShzdGF0ZSkge1xuICAgIHJldHVybiB7XG4gICAgICBkYXRhc2V0czogdGhpcy5nZXREYXRhc2V0VG9TYXZlKHN0YXRlKSxcbiAgICAgIGNvbmZpZzogdGhpcy5nZXRDb25maWdUb1NhdmUoc3RhdGUpLFxuICAgICAgaW5mbzoge1xuICAgICAgICBhcHA6ICdrZXBsZXIuZ2wnLFxuICAgICAgICBjcmVhdGVkX2F0OiBuZXcgRGF0ZSgpLnRvU3RyaW5nKCksXG4gICAgICAgIC4uLnRoaXMuZ2V0TWFwSW5mbyhzdGF0ZSlcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgZ2V0TWFwSW5mbyhzdGF0ZSkge1xuICAgIHJldHVybiBzdGF0ZS52aXNTdGF0ZS5tYXBJbmZvO1xuICB9XG4gIC8qKlxuICAgKiAgTG9hZCBzYXZlZCBtYXAsIGFyZ3VtZW50IGNhbiBiZSAoZGF0YXNldHMsIGNvbmZpZykgb3IgKHtkYXRhc2V0cywgY29uZmlnfSlcbiAgICogQHBhcmFtIHNhdmVkRGF0YXNldHNcbiAgICogQHBhcmFtIHNhdmVkQ29uZmlnXG4gICAqL1xuICBsb2FkKHNhdmVkRGF0YXNldHMsIHNhdmVkQ29uZmlnKSB7XG4gICAgLy8gaWYgcGFzcyBkYXRhc2V0IGFuZCBjb25maWcgaW4gYXMgYSBzaW5nbGUgb2JqZWN0XG4gICAgaWYgKFxuICAgICAgYXJndW1lbnRzLmxlbmd0aCA9PT0gMSAmJlxuICAgICAgaXNQbGFpbk9iamVjdChhcmd1bWVudHNbMF0pICYmXG4gICAgICAoQXJyYXkuaXNBcnJheShhcmd1bWVudHNbMF0uZGF0YXNldHMpIHx8IGlzUGxhaW5PYmplY3QoYXJndW1lbnRzWzBdLmNvbmZpZykpXG4gICAgKSB7XG4gICAgICByZXR1cm4gdGhpcy5sb2FkKGFyZ3VtZW50c1swXS5kYXRhc2V0cywgYXJndW1lbnRzWzBdLmNvbmZpZyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLihBcnJheS5pc0FycmF5KHNhdmVkRGF0YXNldHMpID8ge2RhdGFzZXRzOiB0aGlzLnBhcnNlU2F2ZWREYXRhKHNhdmVkRGF0YXNldHMpfSA6IHt9KSxcbiAgICAgIC4uLihzYXZlZENvbmZpZyA/IHtjb25maWc6IHRoaXMucGFyc2VTYXZlZENvbmZpZyhzYXZlZENvbmZpZyl9IDoge30pXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgZGF0YSB0byBzYXZlXG4gICAqIEBwYXJhbSBzdGF0ZSAtIGFwcCBzdGF0ZVxuICAgKiBAcmV0dXJucyAtIGRhdGFzZXQgdG8gc2F2ZVxuICAgKi9cbiAgZ2V0RGF0YXNldFRvU2F2ZShzdGF0ZSkge1xuICAgIGNvbnN0IGRhdGFDaGFuZ2VkU2luY2VMYXN0U2F2ZSA9IHRoaXMuaGFzRGF0YUNoYW5nZWQoc3RhdGUpO1xuICAgIGlmICghZGF0YUNoYW5nZWRTaW5jZUxhc3RTYXZlKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2F2ZWREYXRhc2V0O1xuICAgIH1cblxuICAgIGNvbnN0IHt2aXNTdGF0ZX0gPSBzdGF0ZTtcblxuICAgIGNvbnN0IGRhdGFzZXRzID0gT2JqZWN0LnZhbHVlcyh2aXNTdGF0ZS5kYXRhc2V0cykubWFwKGRzID0+ICh7XG4gICAgICB2ZXJzaW9uOiB0aGlzLl92ZXJzaW9uLFxuICAgICAgZGF0YTogdGhpcy5fZGF0YXNldFNjaGVtYVt0aGlzLl92ZXJzaW9uXS5zYXZlKGRzKVxuICAgIH0pKTtcblxuICAgIC8vIGtlZXAgYSBjb3B5IG9mIGZvcm1hdHRlZCBkYXRhc2V0cyB0byBzYXZlXG4gICAgdGhpcy5fZGF0YXNldExhc3RTYXZlZCA9IHZpc1N0YXRlLmRhdGFzZXRzO1xuICAgIHRoaXMuX3NhdmVkRGF0YXNldCA9IGRhdGFzZXRzO1xuXG4gICAgcmV0dXJuIGRhdGFzZXRzO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBBcHAgY29uZmlnIHRvIHNhdmVcbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlIC0gYXBwIHN0YXRlXG4gICAqIEByZXR1cm5zIHt7dmVyc2lvbjogU3RyaW5nLCBjb25maWc6IE9iamVjdH19IC0gY29uZmlnIHRvIHNhdmVcbiAgICovXG4gIGdldENvbmZpZ1RvU2F2ZShzdGF0ZSkge1xuICAgIGNvbnN0IGNvbmZpZyA9IE9iamVjdC5rZXlzKHRoaXMuX3JlZHVjZXJTY2hlbWFzKS5yZWR1Y2UoXG4gICAgICAoYWNjdSwga2V5KSA9PiAoe1xuICAgICAgICAuLi5hY2N1LFxuICAgICAgICAuLi4oc3RhdGVba2V5XSA/IHRoaXMuX3JlZHVjZXJTY2hlbWFzW2tleV1bdGhpcy5fdmVyc2lvbl0uc2F2ZShzdGF0ZVtrZXldKSA6IHt9KVxuICAgICAgfSksXG4gICAgICB7fVxuICAgICk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgdmVyc2lvbjogdGhpcy5fdmVyc2lvbixcbiAgICAgIGNvbmZpZ1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogUGFyc2Ugc2F2ZWQgZGF0YVxuICAgKiBAcGFyYW0gZGF0YXNldHNcbiAgICogQHJldHVybnMgLSBkYXRhc2V0IHRvIHBhc3MgdG8gYWRkRGF0YVRvTWFwXG4gICAqL1xuICBwYXJzZVNhdmVkRGF0YShkYXRhc2V0cykge1xuICAgIHJldHVybiBkYXRhc2V0cy5yZWR1Y2UoKGFjY3UsIGRzKSA9PiB7XG4gICAgICBjb25zdCB2YWxpZFZlcnNpb24gPSB0aGlzLnZhbGlkYXRlVmVyc2lvbihkcy52ZXJzaW9uKTtcbiAgICAgIGlmICghdmFsaWRWZXJzaW9uKSB7XG4gICAgICAgIHJldHVybiBhY2N1O1xuICAgICAgfVxuICAgICAgYWNjdS5wdXNoKHRoaXMuX2RhdGFzZXRTY2hlbWFbdmFsaWRWZXJzaW9uXS5sb2FkKGRzLmRhdGEpKTtcbiAgICAgIHJldHVybiBhY2N1O1xuICAgIH0sIFtdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXJzZSBzYXZlZCBBcHAgY29uZmlnXG4gICAqL1xuICBwYXJzZVNhdmVkQ29uZmlnKHt2ZXJzaW9uLCBjb25maWd9LCBzdGF0ZSA9IHt9KSB7XG4gICAgY29uc3QgdmFsaWRWZXJzaW9uID0gdGhpcy52YWxpZGF0ZVZlcnNpb24odmVyc2lvbik7XG4gICAgaWYgKCF2YWxpZFZlcnNpb24pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBPYmplY3Qua2V5cyhjb25maWcpLnJlZHVjZShcbiAgICAgIChhY2N1LCBrZXkpID0+ICh7XG4gICAgICAgIC4uLmFjY3UsXG4gICAgICAgIC4uLihrZXkgaW4gdGhpcy5fcmVkdWNlclNjaGVtYXNcbiAgICAgICAgICA/IHRoaXMuX3JlZHVjZXJTY2hlbWFzW2tleV1bdmFsaWRWZXJzaW9uXS5sb2FkKGNvbmZpZ1trZXldKVxuICAgICAgICAgIDoge30pXG4gICAgICB9KSxcbiAgICAgIHt9XG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZSB2ZXJzaW9uXG4gICAqIEBwYXJhbSB2ZXJzaW9uXG4gICAqIEByZXR1cm5zIHZhbGlkVmVyc2lvblxuICAgKi9cbiAgdmFsaWRhdGVWZXJzaW9uKHZlcnNpb24pIHtcbiAgICBpZiAoIXZlcnNpb24pIHtcbiAgICAgIENvbnNvbGUuZXJyb3IoJ1RoZXJlIGlzIG5vIHZlcnNpb24gbnVtYmVyIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHNhdmVkIG1hcCcpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLl92YWxpZFZlcnNpb25zW3ZlcnNpb25dKSB7XG4gICAgICBDb25zb2xlLmVycm9yKGAke3ZlcnNpb259IGlzIG5vdCBhIHZhbGlkIHZlcnNpb25gKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB2ZXJzaW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGRhdGEgaGFzIGNoYW5nZWQgc2luY2UgbGFzdCBzYXZlXG4gICAqIEBwYXJhbSBzdGF0ZVxuICAgKiBAcmV0dXJucyAtIHdoZXRoZXIgZGF0YSBoYXMgY2hhbmdlZCBvciBub3RcbiAgICovXG4gIGhhc0RhdGFDaGFuZ2VkKHN0YXRlKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGFzZXRMYXN0U2F2ZWQgIT09IHN0YXRlLnZpc1N0YXRlLmRhdGFzZXRzO1xuICB9XG59XG5cbmNvbnN0IEtlcGxlckdMU2NoZW1hTWFuYWdlciA9IG5ldyBLZXBsZXJHTFNjaGVtYSgpO1xuXG5leHBvcnQgZGVmYXVsdCBLZXBsZXJHTFNjaGVtYU1hbmFnZXI7XG4iXX0=
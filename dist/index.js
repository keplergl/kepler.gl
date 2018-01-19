'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.KeplerGl = exports.wrapTo = exports.unwrap = exports.isForwardAction = exports.getActionForwardAddress = exports.forwardTo = exports.actionFor = exports.keplerGlReducer = exports.VERSIONS = exports.CURRENT_VERSION = exports.KeplerGlSchema = exports.getFileType = exports.getFileHandler = exports.Processor = exports.ALL_FIELD_TYPES = exports.DIMENSIONS = exports.uiStateUpdaters = exports.mapStyleUpdaters = exports.mapStateUpdaters = exports.visStateUpdaters = exports.ActionTypes = undefined;

var _actions = require('./actions/actions');

Object.keys(_actions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _actions[key];
    }
  });
});

var _actionTypes = require('./constants/action-types');

Object.defineProperty(exports, 'ActionTypes', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_actionTypes).default;
  }
});

var _defaultSettings = require('./constants/default-settings');

Object.defineProperty(exports, 'DIMENSIONS', {
  enumerable: true,
  get: function get() {
    return _defaultSettings.DIMENSIONS;
  }
});
Object.defineProperty(exports, 'ALL_FIELD_TYPES', {
  enumerable: true,
  get: function get() {
    return _defaultSettings.ALL_FIELD_TYPES;
  }
});

var _fileHandler = require('./processor/file-handler');

Object.defineProperty(exports, 'getFileHandler', {
  enumerable: true,
  get: function get() {
    return _fileHandler.getFileHandler;
  }
});
Object.defineProperty(exports, 'getFileType', {
  enumerable: true,
  get: function get() {
    return _fileHandler.getFileType;
  }
});

var _schemas = require('./schemas');

Object.defineProperty(exports, 'KeplerGlSchema', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_schemas).default;
  }
});

var _versions = require('./schemas/versions');

Object.defineProperty(exports, 'CURRENT_VERSION', {
  enumerable: true,
  get: function get() {
    return _versions.CURRENT_VERSION;
  }
});
Object.defineProperty(exports, 'VERSIONS', {
  enumerable: true,
  get: function get() {
    return _versions.VERSIONS;
  }
});

var _root = require('./reducers/root');

Object.defineProperty(exports, 'keplerGlReducer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_root).default;
  }
});

var _actionWrapper = require('./actions/action-wrapper');

Object.defineProperty(exports, 'actionFor', {
  enumerable: true,
  get: function get() {
    return _actionWrapper.actionFor;
  }
});
Object.defineProperty(exports, 'forwardTo', {
  enumerable: true,
  get: function get() {
    return _actionWrapper.forwardTo;
  }
});
Object.defineProperty(exports, 'getActionForwardAddress', {
  enumerable: true,
  get: function get() {
    return _actionWrapper.getActionForwardAddress;
  }
});
Object.defineProperty(exports, 'isForwardAction', {
  enumerable: true,
  get: function get() {
    return _actionWrapper.isForwardAction;
  }
});
Object.defineProperty(exports, 'unwrap', {
  enumerable: true,
  get: function get() {
    return _actionWrapper.unwrap;
  }
});
Object.defineProperty(exports, 'wrapTo', {
  enumerable: true,
  get: function get() {
    return _actionWrapper.wrapTo;
  }
});

var _container = require('./components/container');

Object.defineProperty(exports, 'KeplerGl', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_container).default;
  }
});
Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_container).default;
  }
});

var _visStateUpdaters2 = require('./reducers/vis-state-updaters');

var _visStateUpdaters = _interopRequireWildcard(_visStateUpdaters2);

var _mapStateUpdaters2 = require('./reducers/map-state-updaters');

var _mapStateUpdaters = _interopRequireWildcard(_mapStateUpdaters2);

var _mapStyleUpdaters2 = require('./reducers/map-style-updaters');

var _mapStyleUpdaters = _interopRequireWildcard(_mapStyleUpdaters2);

var _uiStateUpdaters2 = require('./reducers/ui-state-updaters');

var _uiStateUpdaters = _interopRequireWildcard(_uiStateUpdaters2);

var _dataProcessor = require('./processor/data-processor');

var _Processor = _interopRequireWildcard(_dataProcessor);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// reducer updaters


exports.visStateUpdaters = _visStateUpdaters;
exports.mapStateUpdaters = _mapStateUpdaters;
exports.mapStyleUpdaters = _mapStyleUpdaters;
exports.uiStateUpdaters = _uiStateUpdaters;

// Constants


// Processor

exports.Processor = _Processor;

// File Handlers
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0IiwiRElNRU5TSU9OUyIsIkFMTF9GSUVMRF9UWVBFUyIsImdldEZpbGVIYW5kbGVyIiwiZ2V0RmlsZVR5cGUiLCJDVVJSRU5UX1ZFUlNJT04iLCJWRVJTSU9OUyIsImFjdGlvbkZvciIsImZvcndhcmRUbyIsImdldEFjdGlvbkZvcndhcmRBZGRyZXNzIiwiaXNGb3J3YXJkQWN0aW9uIiwidW53cmFwIiwid3JhcFRvIiwidmlzU3RhdGVVcGRhdGVycyIsIm1hcFN0YXRlVXBkYXRlcnMiLCJtYXBTdHlsZVVwZGF0ZXJzIiwidWlTdGF0ZVVwZGF0ZXJzIiwiUHJvY2Vzc29yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7Z0RBRVFBLE87Ozs7Ozs7Ozs0QkFTQUMsVTs7Ozs7OzRCQUFZQyxlOzs7Ozs7Ozs7d0JBTVpDLGM7Ozs7Ozt3QkFBZ0JDLFc7Ozs7Ozs7Ozs0Q0FHaEJKLE87Ozs7Ozs7OztxQkFDQUssZTs7Ozs7O3FCQUFpQkMsUTs7Ozs7Ozs7O3lDQUdqQk4sTzs7Ozs7Ozs7OzBCQUlOTyxTOzs7Ozs7MEJBQ0FDLFM7Ozs7OzswQkFDQUMsdUI7Ozs7OzswQkFDQUMsZTs7Ozs7OzBCQUNBQyxNOzs7Ozs7MEJBQ0FDLE07Ozs7Ozs7Ozs4Q0FJTVosTzs7Ozs7OzhDQUNBQSxPOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbENSOzs7UUFDWWEsZ0I7UUFDQUMsZ0I7UUFDQUMsZ0I7UUFDQUMsZTs7QUFFWjs7O0FBR0E7O1FBQ1lDLFM7O0FBRVoiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBBY3Rpb25zXG5leHBvcnQgKiBmcm9tICdhY3Rpb25zL2FjdGlvbnMnO1xuXG5leHBvcnQge2RlZmF1bHQgYXMgQWN0aW9uVHlwZXN9IGZyb20gJ2NvbnN0YW50cy9hY3Rpb24tdHlwZXMnO1xuXG4vLyByZWR1Y2VyIHVwZGF0ZXJzXG5leHBvcnQgKiBhcyB2aXNTdGF0ZVVwZGF0ZXJzIGZyb20gJ3JlZHVjZXJzL3Zpcy1zdGF0ZS11cGRhdGVycyc7XG5leHBvcnQgKiBhcyBtYXBTdGF0ZVVwZGF0ZXJzIGZyb20gJ3JlZHVjZXJzL21hcC1zdGF0ZS11cGRhdGVycyc7XG5leHBvcnQgKiBhcyBtYXBTdHlsZVVwZGF0ZXJzIGZyb20gJ3JlZHVjZXJzL21hcC1zdHlsZS11cGRhdGVycyc7XG5leHBvcnQgKiBhcyB1aVN0YXRlVXBkYXRlcnMgZnJvbSAncmVkdWNlcnMvdWktc3RhdGUtdXBkYXRlcnMnO1xuXG4vLyBDb25zdGFudHNcbmV4cG9ydCB7RElNRU5TSU9OUywgQUxMX0ZJRUxEX1RZUEVTfSBmcm9tICcuL2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuLy8gUHJvY2Vzc29yXG5leHBvcnQgKiBhcyBQcm9jZXNzb3IgZnJvbSAncHJvY2Vzc29yL2RhdGEtcHJvY2Vzc29yJztcblxuLy8gRmlsZSBIYW5kbGVyc1xuZXhwb3J0IHtnZXRGaWxlSGFuZGxlciwgZ2V0RmlsZVR5cGV9IGZyb20gJy4vcHJvY2Vzc29yL2ZpbGUtaGFuZGxlcic7XG5cbi8vIFNjaGVtYXNcbmV4cG9ydCB7ZGVmYXVsdCBhcyBLZXBsZXJHbFNjaGVtYX0gZnJvbSAnc2NoZW1hcyc7XG5leHBvcnQge0NVUlJFTlRfVkVSU0lPTiwgVkVSU0lPTlN9IGZyb20gJ3NjaGVtYXMvdmVyc2lvbnMnO1xuXG4vLyBSZWR1Y2Vyc1xuZXhwb3J0IHtkZWZhdWx0IGFzIGtlcGxlckdsUmVkdWNlcn0gZnJvbSAncmVkdWNlcnMvcm9vdCc7XG5cbi8vIERpc3BhdGNoXG5leHBvcnQge1xuICBhY3Rpb25Gb3IsXG4gIGZvcndhcmRUbyxcbiAgZ2V0QWN0aW9uRm9yd2FyZEFkZHJlc3MsXG4gIGlzRm9yd2FyZEFjdGlvbixcbiAgdW53cmFwLFxuICB3cmFwVG9cbn0gZnJvbSAnYWN0aW9ucy9hY3Rpb24td3JhcHBlcic7XG5cbi8vIENvbXBvbmVudHNcbmV4cG9ydCB7ZGVmYXVsdCBhcyBLZXBsZXJHbH0gZnJvbSAnY29tcG9uZW50cy9jb250YWluZXInO1xuZXhwb3J0IHtkZWZhdWx0fSBmcm9tICdjb21wb25lbnRzL2NvbnRhaW5lcic7XG4iXX0=
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0IiwiRElNRU5TSU9OUyIsIkFMTF9GSUVMRF9UWVBFUyIsImdldEZpbGVIYW5kbGVyIiwiZ2V0RmlsZVR5cGUiLCJDVVJSRU5UX1ZFUlNJT04iLCJWRVJTSU9OUyIsImFjdGlvbkZvciIsImZvcndhcmRUbyIsImdldEFjdGlvbkZvcndhcmRBZGRyZXNzIiwiaXNGb3J3YXJkQWN0aW9uIiwidW53cmFwIiwid3JhcFRvIiwidmlzU3RhdGVVcGRhdGVycyIsIm1hcFN0YXRlVXBkYXRlcnMiLCJtYXBTdHlsZVVwZGF0ZXJzIiwidWlTdGF0ZVVwZGF0ZXJzIiwiUHJvY2Vzc29yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7Z0RBRVFBLE87Ozs7Ozs7Ozs0QkFVTkMsVTs7Ozs7OzRCQUNBQyxlOzs7Ozs7Ozs7d0JBUUFDLGM7Ozs7Ozt3QkFBZ0JDLFc7Ozs7Ozs7Ozs0Q0FJVkosTzs7Ozs7Ozs7O3FCQUNBSyxlOzs7Ozs7cUJBQWlCQyxROzs7Ozs7Ozs7eUNBR2pCTixPOzs7Ozs7Ozs7MEJBSU5PLFM7Ozs7OzswQkFDQUMsUzs7Ozs7OzBCQUNBQyx1Qjs7Ozs7OzBCQUNBQyxlOzs7Ozs7MEJBQ0FDLE07Ozs7OzswQkFDQUMsTTs7Ozs7Ozs7OzhDQUlNWixPOzs7Ozs7OENBQ0FBLE87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF2Q1I7OztRQUNZYSxnQjtRQUNBQyxnQjtRQUNBQyxnQjtRQUNBQyxlOztBQUVaOzs7QUFNQTs7UUFDWUMsUzs7QUFFWiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEFjdGlvbnNcbmV4cG9ydCAqIGZyb20gJ2FjdGlvbnMvYWN0aW9ucyc7XG5cbmV4cG9ydCB7ZGVmYXVsdCBhcyBBY3Rpb25UeXBlc30gZnJvbSAnY29uc3RhbnRzL2FjdGlvbi10eXBlcyc7XG5cbi8vIHJlZHVjZXIgdXBkYXRlcnNcbmV4cG9ydCAqIGFzIHZpc1N0YXRlVXBkYXRlcnMgZnJvbSAncmVkdWNlcnMvdmlzLXN0YXRlLXVwZGF0ZXJzJztcbmV4cG9ydCAqIGFzIG1hcFN0YXRlVXBkYXRlcnMgZnJvbSAncmVkdWNlcnMvbWFwLXN0YXRlLXVwZGF0ZXJzJztcbmV4cG9ydCAqIGFzIG1hcFN0eWxlVXBkYXRlcnMgZnJvbSAncmVkdWNlcnMvbWFwLXN0eWxlLXVwZGF0ZXJzJztcbmV4cG9ydCAqIGFzIHVpU3RhdGVVcGRhdGVycyBmcm9tICdyZWR1Y2Vycy91aS1zdGF0ZS11cGRhdGVycyc7XG5cbi8vIENvbnN0YW50c1xuZXhwb3J0IHtcbiAgRElNRU5TSU9OUyxcbiAgQUxMX0ZJRUxEX1RZUEVTXG59IGZyb20gJy4vY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG4vLyBQcm9jZXNzb3JcbmV4cG9ydCAqIGFzIFByb2Nlc3NvciBmcm9tICdwcm9jZXNzb3IvZGF0YS1wcm9jZXNzb3InO1xuXG4vLyBGaWxlIEhhbmRsZXJzXG5leHBvcnQge1xuICBnZXRGaWxlSGFuZGxlciwgZ2V0RmlsZVR5cGVcbn0gZnJvbSAnLi9wcm9jZXNzb3IvZmlsZS1oYW5kbGVyJztcblxuLy8gU2NoZW1hc1xuZXhwb3J0IHtkZWZhdWx0IGFzIEtlcGxlckdsU2NoZW1hfSBmcm9tICdzY2hlbWFzJztcbmV4cG9ydCB7Q1VSUkVOVF9WRVJTSU9OLCBWRVJTSU9OU30gZnJvbSAnc2NoZW1hcy92ZXJzaW9ucyc7XG5cbi8vIFJlZHVjZXJzXG5leHBvcnQge2RlZmF1bHQgYXMga2VwbGVyR2xSZWR1Y2VyfSBmcm9tICdyZWR1Y2Vycy9yb290JztcblxuLy8gRGlzcGF0Y2hcbmV4cG9ydCB7XG4gIGFjdGlvbkZvcixcbiAgZm9yd2FyZFRvLFxuICBnZXRBY3Rpb25Gb3J3YXJkQWRkcmVzcyxcbiAgaXNGb3J3YXJkQWN0aW9uLFxuICB1bndyYXAsXG4gIHdyYXBUb1xufSBmcm9tICdhY3Rpb25zL2FjdGlvbi13cmFwcGVyJztcblxuLy8gQ29tcG9uZW50c1xuZXhwb3J0IHtkZWZhdWx0IGFzIEtlcGxlckdsfSBmcm9tICdjb21wb25lbnRzL2NvbnRhaW5lcic7XG5leHBvcnQge2RlZmF1bHQgYXMgZGVmYXVsdH0gZnJvbSAnY29tcG9uZW50cy9jb250YWluZXInO1xuIl19
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.KeplerGl = exports.wrapTo = exports.getActionForwardAddress = exports.forwardTo = exports.keplerGlReducer = exports.VERSIONS = exports.CURRENT_VERSION = exports.KeplerGlSchema = exports.getFileType = exports.getFileHandler = exports.Processor = exports.ALL_FIELD_TYPES = exports.DIMENSIONS = undefined;

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

var _dataProcessor = require('./processor/data-processor');

var _Processor = _interopRequireWildcard(_dataProcessor);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Processor = _Processor;

// File Handlers


// Processor
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJESU1FTlNJT05TIiwiQUxMX0ZJRUxEX1RZUEVTIiwiZ2V0RmlsZUhhbmRsZXIiLCJnZXRGaWxlVHlwZSIsImRlZmF1bHQiLCJDVVJSRU5UX1ZFUlNJT04iLCJWRVJTSU9OUyIsImZvcndhcmRUbyIsImdldEFjdGlvbkZvcndhcmRBZGRyZXNzIiwid3JhcFRvIiwiUHJvY2Vzc29yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7NEJBSUVBLFU7Ozs7Ozs0QkFDQUMsZTs7Ozs7Ozs7O3dCQVFBQyxjOzs7Ozs7d0JBQWdCQyxXOzs7Ozs7Ozs7NENBSVZDLE87Ozs7Ozs7OztxQkFDQUMsZTs7Ozs7O3FCQUFpQkMsUTs7Ozs7Ozs7O3lDQUdqQkYsTzs7Ozs7Ozs7OzBCQUlORyxTOzs7Ozs7MEJBQ0FDLHVCOzs7Ozs7MEJBQ0FDLE07Ozs7Ozs7Ozs4Q0FJTUwsTzs7Ozs7OzhDQUNBQSxPOzs7Ozs7Ozs7Ozs7UUF2QklNLFM7O0FBRVo7OztBQUhBIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQWN0aW9uc1xuLy8gcmVxdWlyZSgnYmFiZWwtcG9seWZpbGwnKTtcbmV4cG9ydCAqIGZyb20gJy4vYWN0aW9ucy9hY3Rpb25zJztcblxuLy8gQ29uc3RhbnRzXG5leHBvcnQge1xuICBESU1FTlNJT05TLFxuICBBTExfRklFTERfVFlQRVNcbn0gZnJvbSAnLi9jb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbi8vIFByb2Nlc3NvclxuZXhwb3J0ICogYXMgUHJvY2Vzc29yIGZyb20gJy4vcHJvY2Vzc29yL2RhdGEtcHJvY2Vzc29yJztcblxuLy8gRmlsZSBIYW5kbGVyc1xuZXhwb3J0IHtcbiAgZ2V0RmlsZUhhbmRsZXIsIGdldEZpbGVUeXBlXG59IGZyb20gJy4vcHJvY2Vzc29yL2ZpbGUtaGFuZGxlcic7XG5cbi8vIFNjaGVtYXNcbmV4cG9ydCB7ZGVmYXVsdCBhcyBLZXBsZXJHbFNjaGVtYX0gZnJvbSAnLi9zY2hlbWFzJztcbmV4cG9ydCB7Q1VSUkVOVF9WRVJTSU9OLCBWRVJTSU9OU30gZnJvbSAnLi9zY2hlbWFzL3ZlcnNpb25zJztcblxuLy8gUmVkdWNlcnNcbmV4cG9ydCB7ZGVmYXVsdCBhcyBrZXBsZXJHbFJlZHVjZXJ9IGZyb20gJy4vcmVkdWNlcnMvcm9vdCc7XG5cbi8vIERpc3BhdGNoXG5leHBvcnQge1xuICBmb3J3YXJkVG8sXG4gIGdldEFjdGlvbkZvcndhcmRBZGRyZXNzLFxuICB3cmFwVG9cbn0gZnJvbSAnLi9hY3Rpb25zL2FjdGlvbi13cmFwcGVyJztcblxuLy8gQ29tcG9uZW50c1xuZXhwb3J0IHtkZWZhdWx0IGFzIEtlcGxlckdsfSBmcm9tICcuL2NvbXBvbmVudHMvY29udGFpbmVyJztcbmV4cG9ydCB7ZGVmYXVsdCBhcyBkZWZhdWx0fSBmcm9tICcuL2NvbXBvbmVudHMvY29udGFpbmVyJztcbiJdfQ==
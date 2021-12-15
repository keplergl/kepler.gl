"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function get() {
    return _schemaManager["default"];
  }
});
Object.defineProperty(exports, "KeplerGlSchema", {
  enumerable: true,
  get: function get() {
    return _schemaManager["default"];
  }
});
Object.defineProperty(exports, "reducerSchema", {
  enumerable: true,
  get: function get() {
    return _schemaManager.reducerSchema;
  }
});
Object.defineProperty(exports, "KeplerGLSchemaClass", {
  enumerable: true,
  get: function get() {
    return _schemaManager.KeplerGLSchema;
  }
});
Object.defineProperty(exports, "CURRENT_VERSION", {
  enumerable: true,
  get: function get() {
    return _versions.CURRENT_VERSION;
  }
});
Object.defineProperty(exports, "VERSIONS", {
  enumerable: true,
  get: function get() {
    return _versions.VERSIONS;
  }
});
Object.defineProperty(exports, "visStateSchemaV1", {
  enumerable: true,
  get: function get() {
    return _visStateSchema.visStateSchemaV1;
  }
});
Object.defineProperty(exports, "FilterSchemaV0", {
  enumerable: true,
  get: function get() {
    return _visStateSchema.FilterSchemaV0;
  }
});
Object.defineProperty(exports, "LayerSchemaV0", {
  enumerable: true,
  get: function get() {
    return _visStateSchema.LayerSchemaV0;
  }
});
Object.defineProperty(exports, "InteractionSchemaV1", {
  enumerable: true,
  get: function get() {
    return _visStateSchema.InteractionSchemaV1;
  }
});
Object.defineProperty(exports, "DimensionFieldSchema", {
  enumerable: true,
  get: function get() {
    return _visStateSchema.DimensionFieldSchema;
  }
});
Object.defineProperty(exports, "SplitMapsSchema", {
  enumerable: true,
  get: function get() {
    return _visStateSchema.SplitMapsSchema;
  }
});
Object.defineProperty(exports, "filterPropsV1", {
  enumerable: true,
  get: function get() {
    return _visStateSchema.filterPropsV1;
  }
});
Object.defineProperty(exports, "visStateSchema", {
  enumerable: true,
  get: function get() {
    return _visStateSchema["default"];
  }
});
Object.defineProperty(exports, "datasetSchema", {
  enumerable: true,
  get: function get() {
    return _datasetSchema["default"];
  }
});
Object.defineProperty(exports, "mapStyleSchema", {
  enumerable: true,
  get: function get() {
    return _mapStyleSchema["default"];
  }
});
Object.defineProperty(exports, "mapStateSchema", {
  enumerable: true,
  get: function get() {
    return _mapStateSchema["default"];
  }
});
Object.defineProperty(exports, "Schema", {
  enumerable: true,
  get: function get() {
    return _schema["default"];
  }
});

var _schemaManager = _interopRequireWildcard(require("./schema-manager"));

var _versions = require("./versions");

var _visStateSchema = _interopRequireWildcard(require("./vis-state-schema"));

var _datasetSchema = _interopRequireDefault(require("./dataset-schema"));

var _mapStyleSchema = _interopRequireDefault(require("./map-style-schema"));

var _mapStateSchema = _interopRequireDefault(require("./map-state-schema"));

var _schema = _interopRequireDefault(require("./schema"));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWFzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQkE7O0FBTUE7O0FBQ0E7O0FBVUE7O0FBQ0E7O0FBQ0E7O0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG4vLyBTY2hlbWFzXG5leHBvcnQge1xuICBkZWZhdWx0LFxuICBkZWZhdWx0IGFzIEtlcGxlckdsU2NoZW1hLFxuICByZWR1Y2VyU2NoZW1hLFxuICBLZXBsZXJHTFNjaGVtYSBhcyBLZXBsZXJHTFNjaGVtYUNsYXNzXG59IGZyb20gJy4vc2NoZW1hLW1hbmFnZXInO1xuZXhwb3J0IHtDVVJSRU5UX1ZFUlNJT04sIFZFUlNJT05TfSBmcm9tICcuL3ZlcnNpb25zJztcbmV4cG9ydCB7XG4gIHZpc1N0YXRlU2NoZW1hVjEsXG4gIEZpbHRlclNjaGVtYVYwLFxuICBMYXllclNjaGVtYVYwLFxuICBJbnRlcmFjdGlvblNjaGVtYVYxLFxuICBEaW1lbnNpb25GaWVsZFNjaGVtYSxcbiAgU3BsaXRNYXBzU2NoZW1hLFxuICBmaWx0ZXJQcm9wc1YxLFxuICBkZWZhdWx0IGFzIHZpc1N0YXRlU2NoZW1hXG59IGZyb20gJy4vdmlzLXN0YXRlLXNjaGVtYSc7XG5leHBvcnQge2RlZmF1bHQgYXMgZGF0YXNldFNjaGVtYX0gZnJvbSAnLi9kYXRhc2V0LXNjaGVtYSc7XG5leHBvcnQge2RlZmF1bHQgYXMgbWFwU3R5bGVTY2hlbWF9IGZyb20gJy4vbWFwLXN0eWxlLXNjaGVtYSc7XG5leHBvcnQge2RlZmF1bHQgYXMgbWFwU3RhdGVTY2hlbWF9IGZyb20gJy4vbWFwLXN0YXRlLXNjaGVtYSc7XG5leHBvcnQge2RlZmF1bHQgYXMgU2NoZW1hfSBmcm9tICcuL3NjaGVtYSc7XG4iXX0=
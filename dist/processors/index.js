"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "formatCsv", {
  enumerable: true,
  get: function get() {
    return _dataProcessor.formatCsv;
  }
});
Object.defineProperty(exports, "processGeojson", {
  enumerable: true,
  get: function get() {
    return _dataProcessor.processGeojson;
  }
});
Object.defineProperty(exports, "processCsvData", {
  enumerable: true,
  get: function get() {
    return _dataProcessor.processCsvData;
  }
});
Object.defineProperty(exports, "processRowObject", {
  enumerable: true,
  get: function get() {
    return _dataProcessor.processRowObject;
  }
});
Object.defineProperty(exports, "processKeplerglJSON", {
  enumerable: true,
  get: function get() {
    return _dataProcessor.processKeplerglJSON;
  }
});
Object.defineProperty(exports, "analyzerTypeToFieldType", {
  enumerable: true,
  get: function get() {
    return _dataProcessor.analyzerTypeToFieldType;
  }
});
Object.defineProperty(exports, "getFieldsFromData", {
  enumerable: true,
  get: function get() {
    return _dataProcessor.getFieldsFromData;
  }
});
Object.defineProperty(exports, "parseCsvRowsByFieldType", {
  enumerable: true,
  get: function get() {
    return _dataProcessor.parseCsvRowsByFieldType;
  }
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function get() {
    return _dataProcessor.Processors;
  }
});
Object.defineProperty(exports, "getFileHandler", {
  enumerable: true,
  get: function get() {
    return _fileHandler.getFileHandler;
  }
});
Object.defineProperty(exports, "getFileType", {
  enumerable: true,
  get: function get() {
    return _fileHandler.getFileType;
  }
});
Object.defineProperty(exports, "readFile", {
  enumerable: true,
  get: function get() {
    return _fileHandler.readFile;
  }
});
Object.defineProperty(exports, "filesToDataPayload", {
  enumerable: true,
  get: function get() {
    return _fileHandler.filesToDataPayload;
  }
});

var _dataProcessor = require("./data-processor");

var _fileHandler = require("./file-handler");
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcm9jZXNzb3JzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXFCQTs7QUFZQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbi8vIERhdGEgUHJvY2Vzc29yXG5leHBvcnQge1xuICBmb3JtYXRDc3YsXG4gIHByb2Nlc3NHZW9qc29uLFxuICBwcm9jZXNzQ3N2RGF0YSxcbiAgcHJvY2Vzc1Jvd09iamVjdCxcbiAgcHJvY2Vzc0tlcGxlcmdsSlNPTixcbiAgYW5hbHl6ZXJUeXBlVG9GaWVsZFR5cGUsXG4gIGdldEZpZWxkc0Zyb21EYXRhLFxuICBwYXJzZUNzdlJvd3NCeUZpZWxkVHlwZVxufSBmcm9tICcuL2RhdGEtcHJvY2Vzc29yJztcblxuLy8gRmlsZSBIYW5kbGVyc1xuZXhwb3J0IHtnZXRGaWxlSGFuZGxlciwgZ2V0RmlsZVR5cGUsIHJlYWRGaWxlLCBmaWxlc1RvRGF0YVBheWxvYWR9IGZyb20gJy4vZmlsZS1oYW5kbGVyJztcblxuZXhwb3J0IHtQcm9jZXNzb3JzIGFzIGRlZmF1bHR9IGZyb20gJy4vZGF0YS1wcm9jZXNzb3InO1xuIl19
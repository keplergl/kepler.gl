"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getVertices = getVertices;
exports.getCentroid = getCentroid;
exports.idToPolygonGeo = idToPolygonGeo;
Object.defineProperty(exports, "h3GetResolution", {
  enumerable: true,
  get: function get() {
    return _h3Js.h3GetResolution;
  }
});
Object.defineProperty(exports, "h3IsValid", {
  enumerable: true,
  get: function get() {
    return _h3Js.h3IsValid;
  }
});
exports.getHexFields = exports.isHexField = void 0;

var _h3Js = require("h3-js");

var _defaultSettings = require("../../constants/default-settings");

var _dataUtils = require("../../utils/data-utils");

// Copyright (c) 2021 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
// get vertices should return [lon, lat]
function getVertices(_ref) {
  var id = _ref.id;
  // always reverse it
  return (0, _h3Js.h3ToGeoBoundary)(id, true);
} // get centroid should return [lon, lat]


function getCentroid(_ref2) {
  var id = _ref2.id;
  // always reverse it to [lng, lat]
  return (0, _h3Js.h3ToGeo)(id).reverse();
}

function idToPolygonGeo(object, properties) {
  if (!object || !object.id) {
    return null;
  }

  var vertices = getVertices(object);
  return {
    geometry: {
      coordinates: vertices,
      type: 'LineString'
    },
    properties: properties
  };
}

var isHexField = function isHexField(field, fieldIdx, allData) {
  if (field.type !== _defaultSettings.ALL_FIELD_TYPES.string) {
    return false;
  }

  var firstDP = allData.find(function (d) {
    return (0, _dataUtils.notNullorUndefined)(d[fieldIdx]);
  });
  return firstDP && (0, _h3Js.h3IsValid)(firstDP[fieldIdx]);
};

exports.isHexField = isHexField;

var getHexFields = function getHexFields(fields, allData) {
  return fields.filter(function (f, i) {
    return isHexField(f, i, allData);
  });
};

exports.getHexFields = getHexFields;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvaDMtaGV4YWdvbi1sYXllci9oMy11dGlscy5qcyJdLCJuYW1lcyI6WyJnZXRWZXJ0aWNlcyIsImlkIiwiZ2V0Q2VudHJvaWQiLCJyZXZlcnNlIiwiaWRUb1BvbHlnb25HZW8iLCJvYmplY3QiLCJwcm9wZXJ0aWVzIiwidmVydGljZXMiLCJnZW9tZXRyeSIsImNvb3JkaW5hdGVzIiwidHlwZSIsImlzSGV4RmllbGQiLCJmaWVsZCIsImZpZWxkSWR4IiwiYWxsRGF0YSIsIkFMTF9GSUVMRF9UWVBFUyIsInN0cmluZyIsImZpcnN0RFAiLCJmaW5kIiwiZCIsImdldEhleEZpZWxkcyIsImZpZWxkcyIsImZpbHRlciIsImYiLCJpIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQXRCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVFBO0FBQ08sU0FBU0EsV0FBVCxPQUEyQjtBQUFBLE1BQUxDLEVBQUssUUFBTEEsRUFBSztBQUNoQztBQUNBLFNBQU8sMkJBQWdCQSxFQUFoQixFQUFvQixJQUFwQixDQUFQO0FBQ0QsQyxDQUVEOzs7QUFDTyxTQUFTQyxXQUFULFFBQTJCO0FBQUEsTUFBTEQsRUFBSyxTQUFMQSxFQUFLO0FBQ2hDO0FBQ0EsU0FBTyxtQkFBUUEsRUFBUixFQUFZRSxPQUFaLEVBQVA7QUFDRDs7QUFFTSxTQUFTQyxjQUFULENBQXdCQyxNQUF4QixFQUFnQ0MsVUFBaEMsRUFBNEM7QUFDakQsTUFBSSxDQUFDRCxNQUFELElBQVcsQ0FBQ0EsTUFBTSxDQUFDSixFQUF2QixFQUEyQjtBQUN6QixXQUFPLElBQVA7QUFDRDs7QUFFRCxNQUFNTSxRQUFRLEdBQUdQLFdBQVcsQ0FBQ0ssTUFBRCxDQUE1QjtBQUVBLFNBQU87QUFDTEcsSUFBQUEsUUFBUSxFQUFFO0FBQ1JDLE1BQUFBLFdBQVcsRUFBRUYsUUFETDtBQUVSRyxNQUFBQSxJQUFJLEVBQUU7QUFGRSxLQURMO0FBS0xKLElBQUFBLFVBQVUsRUFBVkE7QUFMSyxHQUFQO0FBT0Q7O0FBRU0sSUFBTUssVUFBVSxHQUFHLFNBQWJBLFVBQWEsQ0FBQ0MsS0FBRCxFQUFRQyxRQUFSLEVBQWtCQyxPQUFsQixFQUE4QjtBQUN0RCxNQUFJRixLQUFLLENBQUNGLElBQU4sS0FBZUssaUNBQWdCQyxNQUFuQyxFQUEyQztBQUN6QyxXQUFPLEtBQVA7QUFDRDs7QUFDRCxNQUFNQyxPQUFPLEdBQUdILE9BQU8sQ0FBQ0ksSUFBUixDQUFhLFVBQUFDLENBQUM7QUFBQSxXQUFJLG1DQUFtQkEsQ0FBQyxDQUFDTixRQUFELENBQXBCLENBQUo7QUFBQSxHQUFkLENBQWhCO0FBQ0EsU0FBT0ksT0FBTyxJQUFJLHFCQUFVQSxPQUFPLENBQUNKLFFBQUQsQ0FBakIsQ0FBbEI7QUFDRCxDQU5NOzs7O0FBUUEsSUFBTU8sWUFBWSxHQUFHLFNBQWZBLFlBQWUsQ0FBQ0MsTUFBRCxFQUFTUCxPQUFUO0FBQUEsU0FBcUJPLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLFVBQUNDLENBQUQsRUFBSUMsQ0FBSjtBQUFBLFdBQVViLFVBQVUsQ0FBQ1ksQ0FBRCxFQUFJQyxDQUFKLEVBQU9WLE9BQVAsQ0FBcEI7QUFBQSxHQUFkLENBQXJCO0FBQUEsQ0FBckIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQge2gzR2V0UmVzb2x1dGlvbiwgaDNJc1ZhbGlkLCBoM1RvR2VvLCBoM1RvR2VvQm91bmRhcnl9IGZyb20gJ2gzLWpzJztcbmltcG9ydCB7QUxMX0ZJRUxEX1RZUEVTfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5pbXBvcnQge25vdE51bGxvclVuZGVmaW5lZH0gZnJvbSAndXRpbHMvZGF0YS11dGlscyc7XG5cbmV4cG9ydCB7aDNHZXRSZXNvbHV0aW9uLCBoM0lzVmFsaWR9O1xuXG4vLyBnZXQgdmVydGljZXMgc2hvdWxkIHJldHVybiBbbG9uLCBsYXRdXG5leHBvcnQgZnVuY3Rpb24gZ2V0VmVydGljZXMoe2lkfSkge1xuICAvLyBhbHdheXMgcmV2ZXJzZSBpdFxuICByZXR1cm4gaDNUb0dlb0JvdW5kYXJ5KGlkLCB0cnVlKTtcbn1cblxuLy8gZ2V0IGNlbnRyb2lkIHNob3VsZCByZXR1cm4gW2xvbiwgbGF0XVxuZXhwb3J0IGZ1bmN0aW9uIGdldENlbnRyb2lkKHtpZH0pIHtcbiAgLy8gYWx3YXlzIHJldmVyc2UgaXQgdG8gW2xuZywgbGF0XVxuICByZXR1cm4gaDNUb0dlbyhpZCkucmV2ZXJzZSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaWRUb1BvbHlnb25HZW8ob2JqZWN0LCBwcm9wZXJ0aWVzKSB7XG4gIGlmICghb2JqZWN0IHx8ICFvYmplY3QuaWQpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IHZlcnRpY2VzID0gZ2V0VmVydGljZXMob2JqZWN0KTtcblxuICByZXR1cm4ge1xuICAgIGdlb21ldHJ5OiB7XG4gICAgICBjb29yZGluYXRlczogdmVydGljZXMsXG4gICAgICB0eXBlOiAnTGluZVN0cmluZydcbiAgICB9LFxuICAgIHByb3BlcnRpZXNcbiAgfTtcbn1cblxuZXhwb3J0IGNvbnN0IGlzSGV4RmllbGQgPSAoZmllbGQsIGZpZWxkSWR4LCBhbGxEYXRhKSA9PiB7XG4gIGlmIChmaWVsZC50eXBlICE9PSBBTExfRklFTERfVFlQRVMuc3RyaW5nKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNvbnN0IGZpcnN0RFAgPSBhbGxEYXRhLmZpbmQoZCA9PiBub3ROdWxsb3JVbmRlZmluZWQoZFtmaWVsZElkeF0pKTtcbiAgcmV0dXJuIGZpcnN0RFAgJiYgaDNJc1ZhbGlkKGZpcnN0RFBbZmllbGRJZHhdKTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRIZXhGaWVsZHMgPSAoZmllbGRzLCBhbGxEYXRhKSA9PiBmaWVsZHMuZmlsdGVyKChmLCBpKSA9PiBpc0hleEZpZWxkKGYsIGksIGFsbERhdGEpKTtcbiJdfQ==
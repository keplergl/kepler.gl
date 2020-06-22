"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = MultiSelectFilterFactory;

var _react = _interopRequireDefault(require("react"));

var _itemSelector = _interopRequireDefault(require("../common/item-selector/item-selector"));

var _styledComponents = require("../common/styled-components");

var _reactIntl = require("react-intl");

// Copyright (c) 2020 Uber Technologies, Inc.
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
function MultiSelectFilterFactory() {
  var MultiSelectFilter = function MultiSelectFilter(_ref) {
    var filter = _ref.filter,
        setFilter = _ref.setFilter;
    return _react["default"].createElement("div", null, _react["default"].createElement(_styledComponents.PanelLabel, {
      htmlFor: "filter-".concat(filter.id)
    }, _react["default"].createElement(_reactIntl.FormattedMessage, {
      id: 'misc.valuesIn'
    })), _react["default"].createElement(_itemSelector["default"], {
      options: filter.domain,
      selectedItems: filter.value,
      onChange: setFilter
    }));
  };

  return MultiSelectFilter;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2ZpbHRlcnMvbXVsdGktc2VsZWN0LWZpbHRlci5qcyJdLCJuYW1lcyI6WyJNdWx0aVNlbGVjdEZpbHRlckZhY3RvcnkiLCJNdWx0aVNlbGVjdEZpbHRlciIsImZpbHRlciIsInNldEZpbHRlciIsImlkIiwiZG9tYWluIiwidmFsdWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUF2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFPZSxTQUFTQSx3QkFBVCxHQUFvQztBQUNqRCxNQUFNQyxpQkFBaUIsR0FBRyxTQUFwQkEsaUJBQW9CO0FBQUEsUUFBRUMsTUFBRixRQUFFQSxNQUFGO0FBQUEsUUFBVUMsU0FBVixRQUFVQSxTQUFWO0FBQUEsV0FDeEIsNkNBQ0UsZ0NBQUMsNEJBQUQ7QUFBWSxNQUFBLE9BQU8sbUJBQVlELE1BQU0sQ0FBQ0UsRUFBbkI7QUFBbkIsT0FDRSxnQ0FBQywyQkFBRDtBQUFrQixNQUFBLEVBQUUsRUFBRTtBQUF0QixNQURGLENBREYsRUFJRSxnQ0FBQyx3QkFBRDtBQUFjLE1BQUEsT0FBTyxFQUFFRixNQUFNLENBQUNHLE1BQTlCO0FBQXNDLE1BQUEsYUFBYSxFQUFFSCxNQUFNLENBQUNJLEtBQTVEO0FBQW1FLE1BQUEsUUFBUSxFQUFFSDtBQUE3RSxNQUpGLENBRHdCO0FBQUEsR0FBMUI7O0FBUUEsU0FBT0YsaUJBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgSXRlbVNlbGVjdG9yIGZyb20gJy4uL2NvbW1vbi9pdGVtLXNlbGVjdG9yL2l0ZW0tc2VsZWN0b3InO1xuaW1wb3J0IHtQYW5lbExhYmVsfSBmcm9tICcuLi9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtGb3JtYXR0ZWRNZXNzYWdlfSBmcm9tICdyZWFjdC1pbnRsJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTXVsdGlTZWxlY3RGaWx0ZXJGYWN0b3J5KCkge1xuICBjb25zdCBNdWx0aVNlbGVjdEZpbHRlciA9ICh7ZmlsdGVyLCBzZXRGaWx0ZXJ9KSA9PiAoXG4gICAgPGRpdj5cbiAgICAgIDxQYW5lbExhYmVsIGh0bWxGb3I9e2BmaWx0ZXItJHtmaWx0ZXIuaWR9YH0+XG4gICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnbWlzYy52YWx1ZXNJbid9IC8+XG4gICAgICA8L1BhbmVsTGFiZWw+XG4gICAgICA8SXRlbVNlbGVjdG9yIG9wdGlvbnM9e2ZpbHRlci5kb21haW59IHNlbGVjdGVkSXRlbXM9e2ZpbHRlci52YWx1ZX0gb25DaGFuZ2U9e3NldEZpbHRlcn0gLz5cbiAgICA8L2Rpdj5cbiAgKTtcbiAgcmV0dXJuIE11bHRpU2VsZWN0RmlsdGVyO1xufVxuIl19
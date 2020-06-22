"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = SingleSelectFilterFactory;

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
function SingleSelectFilterFactory() {
  var SingleSelectFilter = function SingleSelectFilter(_ref) {
    var filter = _ref.filter,
        setFilter = _ref.setFilter;
    return _react["default"].createElement(_styledComponents.SidePanelSection, null, _react["default"].createElement(_styledComponents.PanelLabel, null, _react["default"].createElement(_reactIntl.FormattedMessage, {
      id: 'misc.valueEquals'
    })), _react["default"].createElement(_itemSelector["default"], {
      selectedItems: filter.value,
      placeholder: "placeholder.selectValue",
      options: filter.domain,
      multiSelect: false,
      searchable: false,
      displayOption: function displayOption(d) {
        return String(d);
      },
      getOptionValue: function getOptionValue(d) {
        return d;
      },
      onChange: setFilter,
      inputTheme: "secondary"
    }));
  };

  SingleSelectFilter.displayName = 'SingleSelectFilter';
  return SingleSelectFilter;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2ZpbHRlcnMvc2luZ2xlLXNlbGVjdC1maWx0ZXIuanMiXSwibmFtZXMiOlsiU2luZ2xlU2VsZWN0RmlsdGVyRmFjdG9yeSIsIlNpbmdsZVNlbGVjdEZpbHRlciIsImZpbHRlciIsInNldEZpbHRlciIsInZhbHVlIiwiZG9tYWluIiwiZCIsIlN0cmluZyIsImRpc3BsYXlOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBT2UsU0FBU0EseUJBQVQsR0FBcUM7QUFDbEQsTUFBTUMsa0JBQWtCLEdBQUcsU0FBckJBLGtCQUFxQjtBQUFBLFFBQUVDLE1BQUYsUUFBRUEsTUFBRjtBQUFBLFFBQVVDLFNBQVYsUUFBVUEsU0FBVjtBQUFBLFdBQ3pCLGdDQUFDLGtDQUFELFFBQ0UsZ0NBQUMsNEJBQUQsUUFDRSxnQ0FBQywyQkFBRDtBQUFrQixNQUFBLEVBQUUsRUFBRTtBQUF0QixNQURGLENBREYsRUFJRSxnQ0FBQyx3QkFBRDtBQUNFLE1BQUEsYUFBYSxFQUFFRCxNQUFNLENBQUNFLEtBRHhCO0FBRUUsTUFBQSxXQUFXLEVBQUMseUJBRmQ7QUFHRSxNQUFBLE9BQU8sRUFBRUYsTUFBTSxDQUFDRyxNQUhsQjtBQUlFLE1BQUEsV0FBVyxFQUFFLEtBSmY7QUFLRSxNQUFBLFVBQVUsRUFBRSxLQUxkO0FBTUUsTUFBQSxhQUFhLEVBQUUsdUJBQUFDLENBQUM7QUFBQSxlQUFJQyxNQUFNLENBQUNELENBQUQsQ0FBVjtBQUFBLE9BTmxCO0FBT0UsTUFBQSxjQUFjLEVBQUUsd0JBQUFBLENBQUM7QUFBQSxlQUFJQSxDQUFKO0FBQUEsT0FQbkI7QUFRRSxNQUFBLFFBQVEsRUFBRUgsU0FSWjtBQVNFLE1BQUEsVUFBVSxFQUFDO0FBVGIsTUFKRixDQUR5QjtBQUFBLEdBQTNCOztBQW1CQUYsRUFBQUEsa0JBQWtCLENBQUNPLFdBQW5CLEdBQWlDLG9CQUFqQztBQUVBLFNBQU9QLGtCQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IEl0ZW1TZWxlY3RvciBmcm9tICcuLi9jb21tb24vaXRlbS1zZWxlY3Rvci9pdGVtLXNlbGVjdG9yJztcbmltcG9ydCB7UGFuZWxMYWJlbCwgU2lkZVBhbmVsU2VjdGlvbn0gZnJvbSAnLi4vY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7Rm9ybWF0dGVkTWVzc2FnZX0gZnJvbSAncmVhY3QtaW50bCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNpbmdsZVNlbGVjdEZpbHRlckZhY3RvcnkoKSB7XG4gIGNvbnN0IFNpbmdsZVNlbGVjdEZpbHRlciA9ICh7ZmlsdGVyLCBzZXRGaWx0ZXJ9KSA9PiAoXG4gICAgPFNpZGVQYW5lbFNlY3Rpb24+XG4gICAgICA8UGFuZWxMYWJlbD5cbiAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtaXNjLnZhbHVlRXF1YWxzJ30gLz5cbiAgICAgIDwvUGFuZWxMYWJlbD5cbiAgICAgIDxJdGVtU2VsZWN0b3JcbiAgICAgICAgc2VsZWN0ZWRJdGVtcz17ZmlsdGVyLnZhbHVlfVxuICAgICAgICBwbGFjZWhvbGRlcj1cInBsYWNlaG9sZGVyLnNlbGVjdFZhbHVlXCJcbiAgICAgICAgb3B0aW9ucz17ZmlsdGVyLmRvbWFpbn1cbiAgICAgICAgbXVsdGlTZWxlY3Q9e2ZhbHNlfVxuICAgICAgICBzZWFyY2hhYmxlPXtmYWxzZX1cbiAgICAgICAgZGlzcGxheU9wdGlvbj17ZCA9PiBTdHJpbmcoZCl9XG4gICAgICAgIGdldE9wdGlvblZhbHVlPXtkID0+IGR9XG4gICAgICAgIG9uQ2hhbmdlPXtzZXRGaWx0ZXJ9XG4gICAgICAgIGlucHV0VGhlbWU9XCJzZWNvbmRhcnlcIlxuICAgICAgLz5cbiAgICA8L1NpZGVQYW5lbFNlY3Rpb24+XG4gICk7XG5cbiAgU2luZ2xlU2VsZWN0RmlsdGVyLmRpc3BsYXlOYW1lID0gJ1NpbmdsZVNlbGVjdEZpbHRlcic7XG5cbiAgcmV0dXJuIFNpbmdsZVNlbGVjdEZpbHRlcjtcbn1cbiJdfQ==
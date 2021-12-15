"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _multiSelectFilter = _interopRequireDefault(require("../multi-select-filter"));

var _filterPanelWithFieldSelect = _interopRequireDefault(require("./filter-panel-with-field-select"));

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
MultiSelectFilterPanelFactory.deps = [_filterPanelWithFieldSelect["default"], _multiSelectFilter["default"]];

function MultiSelectFilterPanelFactory(FieldPanelWithFieldSelect, MultiSelectFilter) {
  /** @type {import('./filter-panel-types').FilterPanelComponent} */
  var MultiSelectFilterPanel = /*#__PURE__*/_react["default"].memo(function (_ref) {
    var idx = _ref.idx,
        datasets = _ref.datasets,
        allAvailableFields = _ref.allAvailableFields,
        filter = _ref.filter,
        isAnyFilterAnimating = _ref.isAnyFilterAnimating,
        enlargeFilter = _ref.enlargeFilter,
        setFilter = _ref.setFilter,
        removeFilter = _ref.removeFilter,
        toggleAnimation = _ref.toggleAnimation;
    var onSetFilter = (0, _react.useCallback)(function (value) {
      return setFilter(idx, 'value', value);
    }, [idx, setFilter]);
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: "multi-select-filter-panel"
    }, /*#__PURE__*/_react["default"].createElement(FieldPanelWithFieldSelect, {
      allAvailableFields: allAvailableFields,
      datasets: datasets,
      filter: filter,
      idx: idx,
      removeFilter: removeFilter,
      setFilter: setFilter
    }, filter.type && !filter.enlarged && /*#__PURE__*/_react["default"].createElement("div", {
      className: "filter-panel__filter"
    }, /*#__PURE__*/_react["default"].createElement(MultiSelectFilter, {
      filter: filter,
      idx: idx,
      isAnyFilterAnimating: isAnyFilterAnimating,
      toggleAnimation: toggleAnimation,
      setFilter: onSetFilter
    }))));
  });

  MultiSelectFilterPanel.displayName = 'MultiSelectFilterPanel';
  return MultiSelectFilterPanel;
}

var _default = MultiSelectFilterPanelFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2ZpbHRlcnMvZmlsdGVyLXBhbmVscy9tdWx0aS1zZWxlY3QtZmlsdGVyLXBhbmVsLmpzIl0sIm5hbWVzIjpbIk11bHRpU2VsZWN0RmlsdGVyUGFuZWxGYWN0b3J5IiwiZGVwcyIsIkZpZWxkUGFuZWxXaXRoRmllbGRTZWxlY3RGYWN0b3J5IiwiTXVsdGlTZWxlY3RGaWx0ZXJGYWN0b3J5IiwiRmllbGRQYW5lbFdpdGhGaWVsZFNlbGVjdCIsIk11bHRpU2VsZWN0RmlsdGVyIiwiTXVsdGlTZWxlY3RGaWx0ZXJQYW5lbCIsIlJlYWN0IiwibWVtbyIsImlkeCIsImRhdGFzZXRzIiwiYWxsQXZhaWxhYmxlRmllbGRzIiwiZmlsdGVyIiwiaXNBbnlGaWx0ZXJBbmltYXRpbmciLCJlbmxhcmdlRmlsdGVyIiwic2V0RmlsdGVyIiwicmVtb3ZlRmlsdGVyIiwidG9nZ2xlQW5pbWF0aW9uIiwib25TZXRGaWx0ZXIiLCJ2YWx1ZSIsInR5cGUiLCJlbmxhcmdlZCIsImRpc3BsYXlOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUF0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFNQUEsNkJBQTZCLENBQUNDLElBQTlCLEdBQXFDLENBQUNDLHNDQUFELEVBQW1DQyw2QkFBbkMsQ0FBckM7O0FBRUEsU0FBU0gsNkJBQVQsQ0FBdUNJLHlCQUF2QyxFQUFrRUMsaUJBQWxFLEVBQXFGO0FBQ25GO0FBQ0EsTUFBTUMsc0JBQXNCLGdCQUFHQyxrQkFBTUMsSUFBTixDQUM3QixnQkFVTTtBQUFBLFFBVEpDLEdBU0ksUUFUSkEsR0FTSTtBQUFBLFFBUkpDLFFBUUksUUFSSkEsUUFRSTtBQUFBLFFBUEpDLGtCQU9JLFFBUEpBLGtCQU9JO0FBQUEsUUFOSkMsTUFNSSxRQU5KQSxNQU1JO0FBQUEsUUFMSkMsb0JBS0ksUUFMSkEsb0JBS0k7QUFBQSxRQUpKQyxhQUlJLFFBSkpBLGFBSUk7QUFBQSxRQUhKQyxTQUdJLFFBSEpBLFNBR0k7QUFBQSxRQUZKQyxZQUVJLFFBRkpBLFlBRUk7QUFBQSxRQURKQyxlQUNJLFFBREpBLGVBQ0k7QUFDSixRQUFNQyxXQUFXLEdBQUcsd0JBQVksVUFBQUMsS0FBSztBQUFBLGFBQUlKLFNBQVMsQ0FBQ04sR0FBRCxFQUFNLE9BQU4sRUFBZVUsS0FBZixDQUFiO0FBQUEsS0FBakIsRUFBcUQsQ0FBQ1YsR0FBRCxFQUFNTSxTQUFOLENBQXJELENBQXBCO0FBRUEsd0JBQ0U7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLG9CQUNFLGdDQUFDLHlCQUFEO0FBQ0UsTUFBQSxrQkFBa0IsRUFBRUosa0JBRHRCO0FBRUUsTUFBQSxRQUFRLEVBQUVELFFBRlo7QUFHRSxNQUFBLE1BQU0sRUFBRUUsTUFIVjtBQUlFLE1BQUEsR0FBRyxFQUFFSCxHQUpQO0FBS0UsTUFBQSxZQUFZLEVBQUVPLFlBTGhCO0FBTUUsTUFBQSxTQUFTLEVBQUVEO0FBTmIsT0FRR0gsTUFBTSxDQUFDUSxJQUFQLElBQWUsQ0FBQ1IsTUFBTSxDQUFDUyxRQUF2QixpQkFDQztBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsb0JBQ0UsZ0NBQUMsaUJBQUQ7QUFDRSxNQUFBLE1BQU0sRUFBRVQsTUFEVjtBQUVFLE1BQUEsR0FBRyxFQUFFSCxHQUZQO0FBR0UsTUFBQSxvQkFBb0IsRUFBRUksb0JBSHhCO0FBSUUsTUFBQSxlQUFlLEVBQUVJLGVBSm5CO0FBS0UsTUFBQSxTQUFTLEVBQUVDO0FBTGIsTUFERixDQVRKLENBREYsQ0FERjtBQXdCRCxHQXRDNEIsQ0FBL0I7O0FBeUNBWixFQUFBQSxzQkFBc0IsQ0FBQ2dCLFdBQXZCLEdBQXFDLHdCQUFyQztBQUVBLFNBQU9oQixzQkFBUDtBQUNEOztlQUVjTiw2QiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge3VzZUNhbGxiYWNrfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgTXVsdGlTZWxlY3RGaWx0ZXJGYWN0b3J5IGZyb20gJ2NvbXBvbmVudHMvZmlsdGVycy9tdWx0aS1zZWxlY3QtZmlsdGVyJztcbmltcG9ydCBGaWVsZFBhbmVsV2l0aEZpZWxkU2VsZWN0RmFjdG9yeSBmcm9tICdjb21wb25lbnRzL2ZpbHRlcnMvZmlsdGVyLXBhbmVscy9maWx0ZXItcGFuZWwtd2l0aC1maWVsZC1zZWxlY3QnO1xuXG5NdWx0aVNlbGVjdEZpbHRlclBhbmVsRmFjdG9yeS5kZXBzID0gW0ZpZWxkUGFuZWxXaXRoRmllbGRTZWxlY3RGYWN0b3J5LCBNdWx0aVNlbGVjdEZpbHRlckZhY3RvcnldO1xuXG5mdW5jdGlvbiBNdWx0aVNlbGVjdEZpbHRlclBhbmVsRmFjdG9yeShGaWVsZFBhbmVsV2l0aEZpZWxkU2VsZWN0LCBNdWx0aVNlbGVjdEZpbHRlcikge1xuICAvKiogQHR5cGUge2ltcG9ydCgnLi9maWx0ZXItcGFuZWwtdHlwZXMnKS5GaWx0ZXJQYW5lbENvbXBvbmVudH0gKi9cbiAgY29uc3QgTXVsdGlTZWxlY3RGaWx0ZXJQYW5lbCA9IFJlYWN0Lm1lbW8oXG4gICAgKHtcbiAgICAgIGlkeCxcbiAgICAgIGRhdGFzZXRzLFxuICAgICAgYWxsQXZhaWxhYmxlRmllbGRzLFxuICAgICAgZmlsdGVyLFxuICAgICAgaXNBbnlGaWx0ZXJBbmltYXRpbmcsXG4gICAgICBlbmxhcmdlRmlsdGVyLFxuICAgICAgc2V0RmlsdGVyLFxuICAgICAgcmVtb3ZlRmlsdGVyLFxuICAgICAgdG9nZ2xlQW5pbWF0aW9uXG4gICAgfSkgPT4ge1xuICAgICAgY29uc3Qgb25TZXRGaWx0ZXIgPSB1c2VDYWxsYmFjayh2YWx1ZSA9PiBzZXRGaWx0ZXIoaWR4LCAndmFsdWUnLCB2YWx1ZSksIFtpZHgsIHNldEZpbHRlcl0pO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm11bHRpLXNlbGVjdC1maWx0ZXItcGFuZWxcIj5cbiAgICAgICAgICA8RmllbGRQYW5lbFdpdGhGaWVsZFNlbGVjdFxuICAgICAgICAgICAgYWxsQXZhaWxhYmxlRmllbGRzPXthbGxBdmFpbGFibGVGaWVsZHN9XG4gICAgICAgICAgICBkYXRhc2V0cz17ZGF0YXNldHN9XG4gICAgICAgICAgICBmaWx0ZXI9e2ZpbHRlcn1cbiAgICAgICAgICAgIGlkeD17aWR4fVxuICAgICAgICAgICAgcmVtb3ZlRmlsdGVyPXtyZW1vdmVGaWx0ZXJ9XG4gICAgICAgICAgICBzZXRGaWx0ZXI9e3NldEZpbHRlcn1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7ZmlsdGVyLnR5cGUgJiYgIWZpbHRlci5lbmxhcmdlZCAmJiAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmlsdGVyLXBhbmVsX19maWx0ZXJcIj5cbiAgICAgICAgICAgICAgICA8TXVsdGlTZWxlY3RGaWx0ZXJcbiAgICAgICAgICAgICAgICAgIGZpbHRlcj17ZmlsdGVyfVxuICAgICAgICAgICAgICAgICAgaWR4PXtpZHh9XG4gICAgICAgICAgICAgICAgICBpc0FueUZpbHRlckFuaW1hdGluZz17aXNBbnlGaWx0ZXJBbmltYXRpbmd9XG4gICAgICAgICAgICAgICAgICB0b2dnbGVBbmltYXRpb249e3RvZ2dsZUFuaW1hdGlvbn1cbiAgICAgICAgICAgICAgICAgIHNldEZpbHRlcj17b25TZXRGaWx0ZXJ9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvRmllbGRQYW5lbFdpdGhGaWVsZFNlbGVjdD5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgKTtcblxuICBNdWx0aVNlbGVjdEZpbHRlclBhbmVsLmRpc3BsYXlOYW1lID0gJ011bHRpU2VsZWN0RmlsdGVyUGFuZWwnO1xuXG4gIHJldHVybiBNdWx0aVNlbGVjdEZpbHRlclBhbmVsO1xufVxuXG5leHBvcnQgZGVmYXVsdCBNdWx0aVNlbGVjdEZpbHRlclBhbmVsRmFjdG9yeTtcbiJdfQ==
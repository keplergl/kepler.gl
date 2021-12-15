"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = require("../../common/styled-components");

var _filterPanelHeader = _interopRequireDefault(require("../../side-panel/filter-panel/filter-panel-header"));

var _panelHeaderAction = _interopRequireDefault(require("../../side-panel/panel-header-action"));

var _sourceDataSelector = _interopRequireDefault(require("../../side-panel/common/source-data-selector"));

var _fieldSelector = _interopRequireDefault(require("../../common/field-selector"));

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
FieldPanelWithFieldSelectFactory.deps = [_filterPanelHeader["default"], _sourceDataSelector["default"], _fieldSelector["default"], _panelHeaderAction["default"]];

function FieldPanelWithFieldSelectFactory(FilterPanelHeader, SourceDataSelector, FieldSelector, PanelHeaderAction) {
  /** @type {import('./filter-panel-types').FilterPanelComponent} */
  var FilterPanelWithFieldSelect = /*#__PURE__*/_react["default"].memo(function (_ref) {
    var allAvailableFields = _ref.allAvailableFields,
        children = _ref.children,
        datasets = _ref.datasets,
        filter = _ref.filter,
        idx = _ref.idx,
        removeFilter = _ref.removeFilter,
        setFilter = _ref.setFilter,
        _ref$panelActions = _ref.panelActions,
        panelActions = _ref$panelActions === void 0 ? [] : _ref$panelActions;
    var onFieldSelector = (0, _react.useCallback)(function (field) {
      return setFilter(idx, 'name', field.name);
    }, [idx, setFilter]);
    var onSourceDataSelector = (0, _react.useCallback)(function (value) {
      return setFilter(idx, 'dataId', [value]);
    }, [idx, setFilter]);
    var fieldValue = (0, _react.useMemo)(function () {
      return Array.isArray(filter.name) ? filter.name[0] : filter.name;
    }, [filter.name]);
    return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(FilterPanelHeader, {
      datasets: [datasets[filter.dataId[0]]],
      allAvailableFields: allAvailableFields,
      idx: idx,
      filter: filter,
      removeFilter: removeFilter
    }, /*#__PURE__*/_react["default"].createElement(FieldSelector, {
      inputTheme: "secondary",
      fields: allAvailableFields,
      value: fieldValue,
      erasable: false,
      onSelect: onFieldSelector
    }), panelActions && panelActions.map(function (panelAction) {
      return /*#__PURE__*/_react["default"].createElement(PanelHeaderAction, {
        id: panelAction.id,
        key: panelAction.id,
        onClick: panelAction.onClick,
        tooltip: panelAction.tooltip,
        IconComponent: panelAction.iconComponent,
        active: panelAction.active
      });
    })), /*#__PURE__*/_react["default"].createElement(_styledComponents.StyledFilterContent, {
      className: "filter-panel__content"
    }, Object.keys(datasets).length > 1 && /*#__PURE__*/_react["default"].createElement(SourceDataSelector, {
      inputTheme: "secondary",
      datasets: datasets,
      disabled: filter.freeze,
      dataId: filter.dataId,
      onSelect: onSourceDataSelector
    }), children));
  });

  FilterPanelWithFieldSelect.displayName = 'FilterPanelWithFieldSelect';
  return FilterPanelWithFieldSelect;
}

var _default = FieldPanelWithFieldSelectFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2ZpbHRlcnMvZmlsdGVyLXBhbmVscy9maWx0ZXItcGFuZWwtd2l0aC1maWVsZC1zZWxlY3QuanMiXSwibmFtZXMiOlsiRmllbGRQYW5lbFdpdGhGaWVsZFNlbGVjdEZhY3RvcnkiLCJkZXBzIiwiRmlsdGVyUGFuZWxIZWFkZXJGYWN0b3J5IiwiU291cmNlRGF0YVNlbGVjdG9yRmFjdG9yeSIsIkZpZWxkU2VsZWN0b3JGYWN0b3J5IiwiUGFuZWxIZWFkZXJBY3Rpb25GYWN0b3J5IiwiRmlsdGVyUGFuZWxIZWFkZXIiLCJTb3VyY2VEYXRhU2VsZWN0b3IiLCJGaWVsZFNlbGVjdG9yIiwiUGFuZWxIZWFkZXJBY3Rpb24iLCJGaWx0ZXJQYW5lbFdpdGhGaWVsZFNlbGVjdCIsIlJlYWN0IiwibWVtbyIsImFsbEF2YWlsYWJsZUZpZWxkcyIsImNoaWxkcmVuIiwiZGF0YXNldHMiLCJmaWx0ZXIiLCJpZHgiLCJyZW1vdmVGaWx0ZXIiLCJzZXRGaWx0ZXIiLCJwYW5lbEFjdGlvbnMiLCJvbkZpZWxkU2VsZWN0b3IiLCJmaWVsZCIsIm5hbWUiLCJvblNvdXJjZURhdGFTZWxlY3RvciIsInZhbHVlIiwiZmllbGRWYWx1ZSIsIkFycmF5IiwiaXNBcnJheSIsImRhdGFJZCIsIm1hcCIsInBhbmVsQWN0aW9uIiwiaWQiLCJvbkNsaWNrIiwidG9vbHRpcCIsImljb25Db21wb25lbnQiLCJhY3RpdmUiLCJPYmplY3QiLCJrZXlzIiwibGVuZ3RoIiwiZnJlZXplIiwiZGlzcGxheU5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQXpCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVNBQSxnQ0FBZ0MsQ0FBQ0MsSUFBakMsR0FBd0MsQ0FD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QUFHRSxNQUFBLFFBQVEsRUFBRUMsTUFBTSxDQUFDd0IsTUFIbkI7QUFJRSxNQUFBLE1BQU0sRUFBRXhCLE1BQU0sQ0FBQ2EsTUFKakI7QUFLRSxNQUFBLFFBQVEsRUFBRUw7QUFMWixNQUZKLEVBVUdWLFFBVkgsQ0EzQkYsQ0FERjtBQTBDRCxHQXBFZ0MsQ0FBbkM7O0FBdUVBSixFQUFBQSwwQkFBMEIsQ0FBQytCLFdBQTNCLEdBQXlDLDRCQUF6QztBQUVBLFNBQU8vQiwwQkFBUDtBQUNEOztlQUVjVixnQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge3VzZUNhbGxiYWNrLCB1c2VNZW1vfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1N0eWxlZEZpbHRlckNvbnRlbnR9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBGaWx0ZXJQYW5lbEhlYWRlckZhY3RvcnkgZnJvbSAnY29tcG9uZW50cy9zaWRlLXBhbmVsL2ZpbHRlci1wYW5lbC9maWx0ZXItcGFuZWwtaGVhZGVyJztcbmltcG9ydCBQYW5lbEhlYWRlckFjdGlvbkZhY3RvcnkgZnJvbSAnY29tcG9uZW50cy9zaWRlLXBhbmVsL3BhbmVsLWhlYWRlci1hY3Rpb24nO1xuaW1wb3J0IFNvdXJjZURhdGFTZWxlY3RvckZhY3RvcnkgZnJvbSAnY29tcG9uZW50cy9zaWRlLXBhbmVsL2NvbW1vbi9zb3VyY2UtZGF0YS1zZWxlY3Rvcic7XG5pbXBvcnQgRmllbGRTZWxlY3RvckZhY3RvcnkgZnJvbSAnLi4vLi4vY29tbW9uL2ZpZWxkLXNlbGVjdG9yJztcblxuRmllbGRQYW5lbFdpdGhGaWVsZFNlbGVjdEZhY3RvcnkuZGVwcyA9IFtcbiAgRmlsdGVyUGFuZWxIZWFkZXJGYWN0b3J5LFxuICBTb3VyY2VEYXRhU2VsZWN0b3JGYWN0b3J5LFxuICBGaWVsZFNlbGVjdG9yRmFjdG9yeSxcbiAgUGFuZWxIZWFkZXJBY3Rpb25GYWN0b3J5XG5dO1xuXG5mdW5jdGlvbiBGaWVsZFBhbmVsV2l0aEZpZWxkU2VsZWN0RmFjdG9yeShcbiAgRmlsdGVyUGFuZWxIZWFkZXIsXG4gIFNvdXJjZURhdGFTZWxlY3RvcixcbiAgRmllbGRTZWxlY3RvcixcbiAgUGFuZWxIZWFkZXJBY3Rpb25cbikge1xuICAvKiogQHR5cGUge2ltcG9ydCgnLi9maWx0ZXItcGFuZWwtdHlwZXMnKS5GaWx0ZXJQYW5lbENvbXBvbmVudH0gKi9cbiAgY29uc3QgRmlsdGVyUGFuZWxXaXRoRmllbGRTZWxlY3QgPSBSZWFjdC5tZW1vKFxuICAgICh7XG4gICAgICBhbGxBdmFpbGFibGVGaWVsZHMsXG4gICAgICBjaGlsZHJlbixcbiAgICAgIGRhdGFzZXRzLFxuICAgICAgZmlsdGVyLFxuICAgICAgaWR4LFxuICAgICAgcmVtb3ZlRmlsdGVyLFxuICAgICAgc2V0RmlsdGVyLFxuICAgICAgcGFuZWxBY3Rpb25zID0gW11cbiAgICB9KSA9PiB7XG4gICAgICBjb25zdCBvbkZpZWxkU2VsZWN0b3IgPSB1c2VDYWxsYmFjayhmaWVsZCA9PiBzZXRGaWx0ZXIoaWR4LCAnbmFtZScsIGZpZWxkLm5hbWUpLCBbXG4gICAgICAgIGlkeCxcbiAgICAgICAgc2V0RmlsdGVyXG4gICAgICBdKTtcblxuICAgICAgY29uc3Qgb25Tb3VyY2VEYXRhU2VsZWN0b3IgPSB1c2VDYWxsYmFjayh2YWx1ZSA9PiBzZXRGaWx0ZXIoaWR4LCAnZGF0YUlkJywgW3ZhbHVlXSksIFtcbiAgICAgICAgaWR4LFxuICAgICAgICBzZXRGaWx0ZXJcbiAgICAgIF0pO1xuXG4gICAgICBjb25zdCBmaWVsZFZhbHVlID0gdXNlTWVtbyhcbiAgICAgICAgKCkgPT4gKChBcnJheS5pc0FycmF5KGZpbHRlci5uYW1lKSA/IGZpbHRlci5uYW1lWzBdIDogZmlsdGVyLm5hbWUpKSxcbiAgICAgICAgW2ZpbHRlci5uYW1lXVxuICAgICAgKTtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPD5cbiAgICAgICAgICA8RmlsdGVyUGFuZWxIZWFkZXJcbiAgICAgICAgICAgIGRhdGFzZXRzPXtbZGF0YXNldHNbZmlsdGVyLmRhdGFJZFswXV1dfVxuICAgICAgICAgICAgYWxsQXZhaWxhYmxlRmllbGRzPXthbGxBdmFpbGFibGVGaWVsZHN9XG4gICAgICAgICAgICBpZHg9e2lkeH1cbiAgICAgICAgICAgIGZpbHRlcj17ZmlsdGVyfVxuICAgICAgICAgICAgcmVtb3ZlRmlsdGVyPXtyZW1vdmVGaWx0ZXJ9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPEZpZWxkU2VsZWN0b3JcbiAgICAgICAgICAgICAgaW5wdXRUaGVtZT1cInNlY29uZGFyeVwiXG4gICAgICAgICAgICAgIGZpZWxkcz17YWxsQXZhaWxhYmxlRmllbGRzfVxuICAgICAgICAgICAgICB2YWx1ZT17ZmllbGRWYWx1ZX1cbiAgICAgICAgICAgICAgZXJhc2FibGU9e2ZhbHNlfVxuICAgICAgICAgICAgICBvblNlbGVjdD17b25GaWVsZFNlbGVjdG9yfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIHtwYW5lbEFjdGlvbnMgJiZcbiAgICAgICAgICAgICAgcGFuZWxBY3Rpb25zLm1hcChwYW5lbEFjdGlvbiA9PiAoXG4gICAgICAgICAgICAgICAgPFBhbmVsSGVhZGVyQWN0aW9uXG4gICAgICAgICAgICAgICAgICBpZD17cGFuZWxBY3Rpb24uaWR9XG4gICAgICAgICAgICAgICAgICBrZXk9e3BhbmVsQWN0aW9uLmlkfVxuICAgICAgICAgICAgICAgICAgb25DbGljaz17cGFuZWxBY3Rpb24ub25DbGlja31cbiAgICAgICAgICAgICAgICAgIHRvb2x0aXA9e3BhbmVsQWN0aW9uLnRvb2x0aXB9XG4gICAgICAgICAgICAgICAgICBJY29uQ29tcG9uZW50PXtwYW5lbEFjdGlvbi5pY29uQ29tcG9uZW50fVxuICAgICAgICAgICAgICAgICAgYWN0aXZlPXtwYW5lbEFjdGlvbi5hY3RpdmV9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9GaWx0ZXJQYW5lbEhlYWRlcj5cbiAgICAgICAgICA8U3R5bGVkRmlsdGVyQ29udGVudCBjbGFzc05hbWU9XCJmaWx0ZXItcGFuZWxfX2NvbnRlbnRcIj5cbiAgICAgICAgICAgIHtPYmplY3Qua2V5cyhkYXRhc2V0cykubGVuZ3RoID4gMSAmJiAoXG4gICAgICAgICAgICAgIDxTb3VyY2VEYXRhU2VsZWN0b3JcbiAgICAgICAgICAgICAgICBpbnB1dFRoZW1lPVwic2Vjb25kYXJ5XCJcbiAgICAgICAgICAgICAgICBkYXRhc2V0cz17ZGF0YXNldHN9XG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ9e2ZpbHRlci5mcmVlemV9XG4gICAgICAgICAgICAgICAgZGF0YUlkPXtmaWx0ZXIuZGF0YUlkfVxuICAgICAgICAgICAgICAgIG9uU2VsZWN0PXtvblNvdXJjZURhdGFTZWxlY3Rvcn1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICB7Y2hpbGRyZW59XG4gICAgICAgICAgPC9TdHlsZWRGaWx0ZXJDb250ZW50PlxuICAgICAgICA8Lz5cbiAgICAgICk7XG4gICAgfVxuICApO1xuXG4gIEZpbHRlclBhbmVsV2l0aEZpZWxkU2VsZWN0LmRpc3BsYXlOYW1lID0gJ0ZpbHRlclBhbmVsV2l0aEZpZWxkU2VsZWN0JztcblxuICByZXR1cm4gRmlsdGVyUGFuZWxXaXRoRmllbGRTZWxlY3Q7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEZpZWxkUGFuZWxXaXRoRmllbGRTZWxlY3RGYWN0b3J5O1xuIl19
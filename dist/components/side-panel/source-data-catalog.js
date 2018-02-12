'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DatasetTag = undefined;

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  transition: ', ';\n'], ['\n  transition: ', ';\n']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n  color: ', ';\n  display: flex;\n  align-items: center;\n  :hover {\n    color: ', ';\n    cursor: ', ';\n\n    .dataset-action {\n      color: ', ';\n      opacity: 1;\n    }\n\n    .dataset-action:hover {\n      color: white;\n    }\n  }\n'], ['\n  color: ', ';\n  display: flex;\n  align-items: center;\n  :hover {\n    color: ', ';\n    cursor: ', ';\n\n    .dataset-action {\n      color: ', ';\n      opacity: 1;\n    }\n\n    .dataset-action:hover {\n      color: white;\n    }\n  }\n']),
    _templateObject3 = (0, _taggedTemplateLiteral3.default)(['\n  display: inline-block;\n  color: ', ';\n  font-size: 11px;\n  letter-spacing: 0.2px;\n'], ['\n  display: inline-block;\n  color: ', ';\n  font-size: 11px;\n  letter-spacing: 0.2px;\n']),
    _templateObject4 = (0, _taggedTemplateLiteral3.default)(['\n  margin-left: 12px;\n  height: 16px;\n  opacity: 0;\n'], ['\n  margin-left: 12px;\n  height: 16px;\n  opacity: 0;\n']),
    _templateObject5 = (0, _taggedTemplateLiteral3.default)(['\n  font-size: 11px;\n  color: ', ';\n  padding-left: 19px;\n'], ['\n  font-size: 11px;\n  color: ', ';\n  padding-left: 19px;\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _d3Format = require('d3-format');

var _styledComponents3 = require('../common/styled-components');

var _icons = require('../common/icons');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultRemoveDataset = function defaultRemoveDataset(datasetKey) {};
var numFormat = (0, _d3Format.format)(',');

var SourceDataCatelog = _styledComponents2.default.div(_templateObject, function (props) {
  return props.theme.transition;
});

var DatasetTitle = _styledComponents2.default.div(_templateObject2, function (props) {
  return props.theme.textColor;
}, function (props) {
  return props.clickable ? props.theme.textColorHl : props.theme.textColor;
}, function (props) {
  return props.clickable ? 'pointer' : 'auto';
}, function (props) {
  return props.theme.textColorHl;
});
var DatasetTagWrapper = _styledComponents2.default.div(_templateObject3, function (props) {
  return props.theme.textColor;
});

var DataTagAction = _styledComponents2.default.div(_templateObject4);

var DataRowCount = _styledComponents2.default.div(_templateObject5, function (props) {
  return props.theme.subtextColor;
});

var DatasetTag = exports.DatasetTag = function DatasetTag(_ref) {
  var onClick = _ref.onClick,
      dataset = _ref.dataset;
  return _react2.default.createElement(
    DatasetTagWrapper,
    { className: 'source-data-tag', onClick: onClick },
    _react2.default.createElement(_styledComponents3.DatasetSquare, { className: 'dataset-color', color: dataset.color }),
    _react2.default.createElement(
      'span',
      { className: 'dataset-name' },
      dataset.label
    )
  );
};

var SourceDataCatalog = function SourceDataCatalog(_ref2) {
  var datasets = _ref2.datasets,
      showDatasetTable = _ref2.showDatasetTable,
      removeDataset = _ref2.removeDataset,
      _ref2$showDeleteDatas = _ref2.showDeleteDataset,
      showDeleteDataset = _ref2$showDeleteDatas === undefined ? false : _ref2$showDeleteDatas;
  return _react2.default.createElement(
    SourceDataCatelog,
    { className: 'source-data-catalog' },
    Object.values(datasets).map(function (dataset, index) {
      return _react2.default.createElement(
        _styledComponents3.SidePanelSection,
        { key: dataset.id },
        _react2.default.createElement(
          DatasetTitle,
          { clickable: Boolean(showDatasetTable) },
          _react2.default.createElement(DatasetTag, {
            dataset: dataset,
            onClick: showDatasetTable ? function () {
              return showDatasetTable(dataset.id);
            } : null
          }),
          showDatasetTable ? _react2.default.createElement(_icons.ArrowRight, { height: '12px' }) : null,
          showDatasetTable ? _react2.default.createElement(ShowDataTable, {
            id: dataset.id,
            showDatasetTable: showDatasetTable
          }) : null,
          showDeleteDataset ? _react2.default.createElement(RemoveDataset, {
            datasetKey: dataset.id,
            removeDataset: removeDataset
          }) : null
        ),
        showDatasetTable ? _react2.default.createElement(
          DataRowCount,
          { className: 'source-data-rows' },
          numFormat(dataset.allData.length) + ' rows'
        ) : null
      );
    })
  );
};

var ShowDataTable = function ShowDataTable(_ref3) {
  var id = _ref3.id,
      showDatasetTable = _ref3.showDatasetTable;
  return _react2.default.createElement(
    DataTagAction,
    {
      className: 'dataset-action show-data-table',
      'data-tip': true,
      'data-for': 'data-table-' + id
    },
    _react2.default.createElement(_icons.Table, { height: '16px', onClick: function onClick() {
        return showDatasetTable(id);
      } }),
    _react2.default.createElement(
      _styledComponents3.Tooltip,
      { id: 'data-table-' + id, effect: 'solid' },
      _react2.default.createElement(
        'span',
        null,
        'Show data table'
      )
    )
  );
};

var RemoveDataset = function RemoveDataset(_ref4) {
  var datasetKey = _ref4.datasetKey,
      _ref4$removeDataset = _ref4.removeDataset,
      removeDataset = _ref4$removeDataset === undefined ? defaultRemoveDataset : _ref4$removeDataset;
  return _react2.default.createElement(
    DataTagAction,
    {
      className: 'dataset-action remove-dataset',
      'data-tip': true,
      'data-for': 'delete-' + datasetKey
    },
    _react2.default.createElement(_icons.Trash, {
      height: '16px',
      onClick: function onClick(e) {
        e.stopPropagation();
        removeDataset(datasetKey);
      }
    }),
    _react2.default.createElement(
      _styledComponents3.Tooltip,
      { id: 'delete-' + datasetKey, effect: 'solid', type: 'error' },
      _react2.default.createElement(
        'span',
        null,
        'Remove dataset'
      )
    )
  );
};

exports.default = SourceDataCatalog;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvc291cmNlLWRhdGEtY2F0YWxvZy5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0UmVtb3ZlRGF0YXNldCIsIm51bUZvcm1hdCIsIlNvdXJjZURhdGFDYXRlbG9nIiwiZGl2IiwicHJvcHMiLCJ0aGVtZSIsInRyYW5zaXRpb24iLCJEYXRhc2V0VGl0bGUiLCJ0ZXh0Q29sb3IiLCJjbGlja2FibGUiLCJ0ZXh0Q29sb3JIbCIsIkRhdGFzZXRUYWdXcmFwcGVyIiwiRGF0YVRhZ0FjdGlvbiIsIkRhdGFSb3dDb3VudCIsInN1YnRleHRDb2xvciIsIkRhdGFzZXRUYWciLCJvbkNsaWNrIiwiZGF0YXNldCIsImNvbG9yIiwibGFiZWwiLCJTb3VyY2VEYXRhQ2F0YWxvZyIsImRhdGFzZXRzIiwic2hvd0RhdGFzZXRUYWJsZSIsInJlbW92ZURhdGFzZXQiLCJzaG93RGVsZXRlRGF0YXNldCIsIk9iamVjdCIsInZhbHVlcyIsIm1hcCIsImluZGV4IiwiaWQiLCJCb29sZWFuIiwiYWxsRGF0YSIsImxlbmd0aCIsIlNob3dEYXRhVGFibGUiLCJSZW1vdmVEYXRhc2V0IiwiZGF0YXNldEtleSIsImUiLCJzdG9wUHJvcGFnYXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOztBQUVBOztBQUNBOzs7O0FBRUEsSUFBTUEsdUJBQXVCLFNBQXZCQSxvQkFBdUIsYUFBYyxDQUFFLENBQTdDO0FBQ0EsSUFBTUMsWUFBWSxzQkFBTyxHQUFQLENBQWxCOztBQUVBLElBQU1DLG9CQUFvQiwyQkFBT0MsR0FBM0Isa0JBQ1U7QUFBQSxTQUFTQyxNQUFNQyxLQUFOLENBQVlDLFVBQXJCO0FBQUEsQ0FEVixDQUFOOztBQUlBLElBQU1DLGVBQWUsMkJBQU9KLEdBQXRCLG1CQUNLO0FBQUEsU0FBU0MsTUFBTUMsS0FBTixDQUFZRyxTQUFyQjtBQUFBLENBREwsRUFLTztBQUFBLFNBQ1BK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QUEsUUFBUyxvQkFBa0JBLEVBQTNCLEVBQWlDLFFBQU8sT0FBeEM7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREY7QUFORixHQURvQjtBQUFBLENBQXRCOztBQWFBLElBQU1LLGdCQUFnQixTQUFoQkEsYUFBZ0I7QUFBQSxNQUFFQyxVQUFGLFNBQUVBLFVBQUY7QUFBQSxrQ0FBY1osYUFBZDtBQUFBLE1BQWNBLGFBQWQsdUNBQThCdkIsb0JBQTlCO0FBQUEsU0FDcEI7QUFBQyxpQkFBRDtBQUFBO0FBQ0UsaUJBQVUsK0JBRFo7QUFFRSxzQkFGRjtBQUdFLDhCQUFvQm1DO0FBSHRCO0FBS0U7QUFDRSxjQUFPLE1BRFQ7QUFFRSxlQUFTLG9CQUFLO0FBQ1pDLFVBQUVDLGVBQUY7QUFDQWQsc0JBQWNZLFVBQWQ7QUFDRDtBQUxILE1BTEY7QUFZRTtBQUFBO0FBQUEsUUFBUyxnQkFBY0EsVUFBdkIsRUFBcUMsUUFBTyxPQUE1QyxFQUFvRCxNQUFLLE9BQXpEO0FBQ0U7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQURGO0FBWkYsR0FEb0I7QUFBQSxDQUF0Qjs7a0JBbUJlZixpQiIsImZpbGUiOiJzb3VyY2UtZGF0YS1jYXRhbG9nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtmb3JtYXR9IGZyb20gJ2QzLWZvcm1hdCc7XG5cbmltcG9ydCB7U2lkZVBhbmVsU2VjdGlvbiwgVG9vbHRpcCwgRGF0YXNldFNxdWFyZX0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtUYWJsZSwgVHJhc2gsIEFycm93UmlnaHR9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcblxuY29uc3QgZGVmYXVsdFJlbW92ZURhdGFzZXQgPSBkYXRhc2V0S2V5ID0+IHt9O1xuY29uc3QgbnVtRm9ybWF0ID0gZm9ybWF0KCcsJyk7XG5cbmNvbnN0IFNvdXJjZURhdGFDYXRlbG9nID0gc3R5bGVkLmRpdmBcbiAgdHJhbnNpdGlvbjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50cmFuc2l0aW9ufTtcbmA7XG5cbmNvbnN0IERhdGFzZXRUaXRsZSA9IHN0eWxlZC5kaXZgXG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvcn07XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIDpob3ZlciB7XG4gICAgY29sb3I6ICR7cHJvcHMgPT5cbiAgICAgIHByb3BzLmNsaWNrYWJsZSA/IHByb3BzLnRoZW1lLnRleHRDb2xvckhsIDogcHJvcHMudGhlbWUudGV4dENvbG9yfTtcbiAgICBjdXJzb3I6ICR7cHJvcHMgPT4gKHByb3BzLmNsaWNrYWJsZSA/ICdwb2ludGVyJyA6ICdhdXRvJyl9O1xuXG4gICAgLmRhdGFzZXQtYWN0aW9uIHtcbiAgICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckhsfTtcbiAgICAgIG9wYWNpdHk6IDE7XG4gICAgfVxuXG4gICAgLmRhdGFzZXQtYWN0aW9uOmhvdmVyIHtcbiAgICAgIGNvbG9yOiB3aGl0ZTtcbiAgICB9XG4gIH1cbmA7XG5jb25zdCBEYXRhc2V0VGFnV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yfTtcbiAgZm9udC1zaXplOiAxMXB4O1xuICBsZXR0ZXItc3BhY2luZzogMC4ycHg7XG5gO1xuXG5jb25zdCBEYXRhVGFnQWN0aW9uID0gc3R5bGVkLmRpdmBcbiAgbWFyZ2luLWxlZnQ6IDEycHg7XG4gIGhlaWdodDogMTZweDtcbiAgb3BhY2l0eTogMDtcbmA7XG5cbmNvbnN0IERhdGFSb3dDb3VudCA9IHN0eWxlZC5kaXZgXG4gIGZvbnQtc2l6ZTogMTFweDtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc3VidGV4dENvbG9yfTtcbiAgcGFkZGluZy1sZWZ0OiAxOXB4O1xuYDtcblxuZXhwb3J0IGNvbnN0IERhdGFzZXRUYWcgPSAoe29uQ2xpY2ssIGRhdGFzZXR9KSA9PiAoXG4gIDxEYXRhc2V0VGFnV3JhcHBlciBjbGFzc05hbWU9XCJzb3VyY2UtZGF0YS10YWdcIiBvbkNsaWNrPXtvbkNsaWNrfT5cbiAgICA8RGF0YXNldFNxdWFyZSBjbGFzc05hbWU9XCJkYXRhc2V0LWNvbG9yXCIgY29sb3I9e2RhdGFzZXQuY29sb3J9IC8+XG4gICAgPHNwYW4gY2xhc3NOYW1lPVwiZGF0YXNldC1uYW1lXCI+e2RhdGFzZXQubGFiZWx9PC9zcGFuPlxuICA8L0RhdGFzZXRUYWdXcmFwcGVyPlxuKTtcblxuY29uc3QgU291cmNlRGF0YUNhdGFsb2cgPSAoe1xuICBkYXRhc2V0cyxcbiAgc2hvd0RhdGFzZXRUYWJsZSxcbiAgcmVtb3ZlRGF0YXNldCxcbiAgc2hvd0RlbGV0ZURhdGFzZXQgPSBmYWxzZVxufSkgPT4gKFxuICA8U291cmNlRGF0YUNhdGVsb2cgY2xhc3NOYW1lPVwic291cmNlLWRhdGEtY2F0YWxvZ1wiPlxuICAgIHtPYmplY3QudmFsdWVzKGRhdGFzZXRzKS5tYXAoKGRhdGFzZXQsIGluZGV4KSA9PiAoXG4gICAgICA8U2lkZVBhbmVsU2VjdGlvbiBrZXk9e2RhdGFzZXQuaWR9PlxuICAgICAgICA8RGF0YXNldFRpdGxlIGNsaWNrYWJsZT17Qm9vbGVhbihzaG93RGF0YXNldFRhYmxlKX0+XG4gICAgICAgICAgPERhdGFzZXRUYWdcbiAgICAgICAgICAgIGRhdGFzZXQ9e2RhdGFzZXR9XG4gICAgICAgICAgICBvbkNsaWNrPXtcbiAgICAgICAgICAgICAgc2hvd0RhdGFzZXRUYWJsZSA/ICgpID0+IHNob3dEYXRhc2V0VGFibGUoZGF0YXNldC5pZCkgOiBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgLz5cbiAgICAgICAgICB7c2hvd0RhdGFzZXRUYWJsZSA/IDxBcnJvd1JpZ2h0IGhlaWdodD1cIjEycHhcIiAvPiA6IG51bGx9XG4gICAgICAgICAge3Nob3dEYXRhc2V0VGFibGUgPyAoXG4gICAgICAgICAgICA8U2hvd0RhdGFUYWJsZVxuICAgICAgICAgICAgICBpZD17ZGF0YXNldC5pZH1cbiAgICAgICAgICAgICAgc2hvd0RhdGFzZXRUYWJsZT17c2hvd0RhdGFzZXRUYWJsZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAge3Nob3dEZWxldGVEYXRhc2V0ID8gKFxuICAgICAgICAgICAgPFJlbW92ZURhdGFzZXRcbiAgICAgICAgICAgICAgZGF0YXNldEtleT17ZGF0YXNldC5pZH1cbiAgICAgICAgICAgICAgcmVtb3ZlRGF0YXNldD17cmVtb3ZlRGF0YXNldH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDwvRGF0YXNldFRpdGxlPlxuICAgICAgICB7c2hvd0RhdGFzZXRUYWJsZSA/IChcbiAgICAgICAgICA8RGF0YVJvd0NvdW50IGNsYXNzTmFtZT1cInNvdXJjZS1kYXRhLXJvd3NcIj57YCR7bnVtRm9ybWF0KFxuICAgICAgICAgICAgZGF0YXNldC5hbGxEYXRhLmxlbmd0aFxuICAgICAgICAgICl9IHJvd3NgfTwvRGF0YVJvd0NvdW50PlxuICAgICAgICApIDogbnVsbH1cbiAgICAgIDwvU2lkZVBhbmVsU2VjdGlvbj5cbiAgICApKX1cbiAgPC9Tb3VyY2VEYXRhQ2F0ZWxvZz5cbik7XG5cbmNvbnN0IFNob3dEYXRhVGFibGUgPSAoe2lkLCBzaG93RGF0YXNldFRhYmxlfSkgPT4gKFxuICA8RGF0YVRhZ0FjdGlvblxuICAgIGNsYXNzTmFtZT1cImRhdGFzZXQtYWN0aW9uIHNob3ctZGF0YS10YWJsZVwiXG4gICAgZGF0YS10aXBcbiAgICBkYXRhLWZvcj17YGRhdGEtdGFibGUtJHtpZH1gfVxuICA+XG4gICAgPFRhYmxlIGhlaWdodD1cIjE2cHhcIiBvbkNsaWNrPXsoKSA9PiBzaG93RGF0YXNldFRhYmxlKGlkKX0gLz5cbiAgICA8VG9vbHRpcCBpZD17YGRhdGEtdGFibGUtJHtpZH1gfSBlZmZlY3Q9XCJzb2xpZFwiPlxuICAgICAgPHNwYW4+U2hvdyBkYXRhIHRhYmxlPC9zcGFuPlxuICAgIDwvVG9vbHRpcD5cbiAgPC9EYXRhVGFnQWN0aW9uPlxuKTtcblxuY29uc3QgUmVtb3ZlRGF0YXNldCA9ICh7ZGF0YXNldEtleSwgcmVtb3ZlRGF0YXNldCA9IGRlZmF1bHRSZW1vdmVEYXRhc2V0fSkgPT4gKFxuICA8RGF0YVRhZ0FjdGlvblxuICAgIGNsYXNzTmFtZT1cImRhdGFzZXQtYWN0aW9uIHJlbW92ZS1kYXRhc2V0XCJcbiAgICBkYXRhLXRpcFxuICAgIGRhdGEtZm9yPXtgZGVsZXRlLSR7ZGF0YXNldEtleX1gfVxuICA+XG4gICAgPFRyYXNoXG4gICAgICBoZWlnaHQ9XCIxNnB4XCJcbiAgICAgIG9uQ2xpY2s9e2UgPT4ge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICByZW1vdmVEYXRhc2V0KGRhdGFzZXRLZXkpO1xuICAgICAgfX1cbiAgICAvPlxuICAgIDxUb29sdGlwIGlkPXtgZGVsZXRlLSR7ZGF0YXNldEtleX1gfSBlZmZlY3Q9XCJzb2xpZFwiIHR5cGU9XCJlcnJvclwiPlxuICAgICAgPHNwYW4+UmVtb3ZlIGRhdGFzZXQ8L3NwYW4+XG4gICAgPC9Ub29sdGlwPlxuICA8L0RhdGFUYWdBY3Rpb24+XG4pO1xuXG5leHBvcnQgZGVmYXVsdCBTb3VyY2VEYXRhQ2F0YWxvZztcbiJdfQ==
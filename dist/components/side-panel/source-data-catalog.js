'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DatasetTag = undefined;

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  transition: ', ';\n'], ['\n  transition: ', ';\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  color: ', ';\n  display: flex;\n  align-items: center;\n  :hover {\n    color: ', ';\n    cursor: ', ';\n\n    .dataset-action {\n      color: ', ';\n      opacity: 1;\n    }\n\n    .dataset-action:hover {\n      color: white;\n    }\n  }\n'], ['\n  color: ', ';\n  display: flex;\n  align-items: center;\n  :hover {\n    color: ', ';\n    cursor: ', ';\n\n    .dataset-action {\n      color: ', ';\n      opacity: 1;\n    }\n\n    .dataset-action:hover {\n      color: white;\n    }\n  }\n']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: inline-block;\n  color: ', ';\n  font-size: 11px;\n\n  .dataset-name {\n    padding: 0 4px 0 12px;\n  }\n'], ['\n  display: inline-block;\n  color: ', ';\n  font-size: 11px;\n\n  .dataset-name {\n    padding: 0 4px 0 12px;\n  }\n']),
    _templateObject4 = (0, _taggedTemplateLiteralLoose3.default)(['\n  margin-left: 12px;\n  height: 16px;\n  opacity: 0;\n'], ['\n  margin-left: 12px;\n  height: 16px;\n  opacity: 0;\n']),
    _templateObject5 = (0, _taggedTemplateLiteralLoose3.default)(['\n  font-size: 11px;\n  color: ', ';\n  padding-left: 19px;\n'], ['\n  font-size: 11px;\n  color: ', ';\n  padding-left: 19px;\n']),
    _templateObject6 = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: inline-block;\n  width: 8px;\n  height: 8px;\n  background-color: rgb(', ');\n'], ['\n  display: inline-block;\n  width: 8px;\n  height: 8px;\n  background-color: rgb(', ');\n']);

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
    {
      className: 'source-data-tag',
      onClick: onClick
    },
    _react2.default.createElement(Square, { color: dataset.color }),
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
          showDatasetTable ? _react2.default.createElement(ShowDataTable, { id: dataset.id, showDatasetTable: showDatasetTable }) : null,
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

var Square = _styledComponents2.default.div(_templateObject6, function (props) {
  return props.color.join(',');
});

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
    _react2.default.createElement(_icons.Table, {
      height: '16px',
      onClick: function onClick() {
        return showDatasetTable(id);
      }
    }),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvc291cmNlLWRhdGEtY2F0YWxvZy5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0UmVtb3ZlRGF0YXNldCIsIm51bUZvcm1hdCIsIlNvdXJjZURhdGFDYXRlbG9nIiwiZGl2IiwicHJvcHMiLCJ0aGVtZSIsInRyYW5zaXRpb24iLCJEYXRhc2V0VGl0bGUiLCJ0ZXh0Q29sb3IiLCJjbGlja2FibGUiLCJ0ZXh0Q29sb3JIbCIsIkRhdGFzZXRUYWdXcmFwcGVyIiwiRGF0YVRhZ0FjdGlvbiIsIkRhdGFSb3dDb3VudCIsInN1YnRleHRDb2xvciIsIkRhdGFzZXRUYWciLCJvbkNsaWNrIiwiZGF0YXNldCIsImNvbG9yIiwibGFiZWwiLCJTb3VyY2VEYXRhQ2F0YWxvZyIsImRhdGFzZXRzIiwic2hvd0RhdGFzZXRUYWJsZSIsInJlbW92ZURhdGFzZXQiLCJzaG93RGVsZXRlRGF0YXNldCIsIk9iamVjdCIsInZhbHVlcyIsIm1hcCIsImluZGV4IiwiaWQiLCJCb29sZWFuIiwiYWxsRGF0YSIsImxlbmd0aCIsIlNxdWFyZSIsImpvaW4iLCJTaG93RGF0YVRhYmxlIiwiUmVtb3ZlRGF0YXNldCIsImRhdGFzZXRLZXkiLCJlIiwic3RvcFByb3BhZ2F0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7O0FBRUE7O0FBQ0E7Ozs7QUFFQSxJQUFNQSx1QkFBdUIsU0FBdkJBLG9CQUF1QixhQUFjLENBQUUsQ0FBN0M7QUFDQSxJQUFNQyxZQUFZLHNCQUFPLEdBQVAsQ0FBbEI7O0FBRUEsSUFBTUMsb0JBQW9CLDJCQUFPQyxHQUEzQixrQkFDVTtBQUFBLFNBQVNDLE1BQU1DLEtBQU4sQ0FBWUMsVUFBckI7QUFBQSxDQURWLENBQU47O0FBSUEsSUFBTUMsZUFBZSwyQkFBT0osR0FBdEIsbUJBQ0s7QUFBQSxTQUFTQyxNQUFNQyxLQUFOLENBQVlHLFNBQXJCO0FBQUEsQ0FE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QUZGO0FBR0Usa0NBQXdCTztBQUgxQjtBQUtFO0FBQ0UsY0FBTyxNQURUO0FBRUUsZUFBUztBQUFBLGVBQU1QLGlCQUFpQk8sRUFBakIsQ0FBTjtBQUFBO0FBRlgsTUFMRjtBQVNFO0FBQUE7QUFBQSxRQUFTLG9CQUFrQkEsRUFBM0IsRUFBaUMsUUFBTyxPQUF4QztBQUNFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFERjtBQVRGLEdBRG9CO0FBQUEsQ0FBdEI7O0FBZ0JBLElBQU1PLGdCQUFnQixTQUFoQkEsYUFBZ0I7QUFBQSxNQUFFQyxVQUFGLFNBQUVBLFVBQUY7QUFBQSxrQ0FBY2QsYUFBZDtBQUFBLE1BQWNBLGFBQWQsdUNBQThCdkIsb0JBQTlCO0FBQUEsU0FDcEI7QUFBQyxpQkFBRDtBQUFBO0FBQ0UsaUJBQVUsK0JBRFo7QUFFRSxzQkFGRjtBQUdFLDhCQUFvQnFDO0FBSHRCO0FBS0U7QUFDRSxjQUFPLE1BRFQ7QUFFRSxlQUFTLG9CQUFLO0FBQ1pDLFVBQUVDLGVBQUY7QUFDQWhCLHNCQUFjYyxVQUFkO0FBQ0Q7QUFMSCxNQUxGO0FBWUU7QUFBQTtBQUFBLFFBQVMsZ0JBQWNBLFVBQXZCLEVBQXFDLFFBQU8sT0FBNUMsRUFBb0QsTUFBSyxPQUF6RDtBQUNFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFERjtBQVpGLEdBRG9CO0FBQUEsQ0FBdEI7O2tCQW1CZWpCLGlCIiwiZmlsZSI6InNvdXJjZS1kYXRhLWNhdGFsb2cuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge2Zvcm1hdH0gZnJvbSAnZDMtZm9ybWF0JztcblxuaW1wb3J0IHtTaWRlUGFuZWxTZWN0aW9uLCBUb29sdGlwfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cydcbmltcG9ydCB7VGFibGUsIFRyYXNoLCBBcnJvd1JpZ2h0fSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5cbmNvbnN0IGRlZmF1bHRSZW1vdmVEYXRhc2V0ID0gZGF0YXNldEtleSA9PiB7fTtcbmNvbnN0IG51bUZvcm1hdCA9IGZvcm1hdCgnLCcpO1xuXG5jb25zdCBTb3VyY2VEYXRhQ2F0ZWxvZyA9IHN0eWxlZC5kaXZgXG4gIHRyYW5zaXRpb246ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudHJhbnNpdGlvbn07XG5gO1xuXG5jb25zdCBEYXRhc2V0VGl0bGUgPSBzdHlsZWQuZGl2YFxuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICA6aG92ZXIge1xuICAgIGNvbG9yOiAke3Byb3BzID0+XG4gICAgICBwcm9wcy5jbGlja2FibGUgPyBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbCA6IHByb3BzLnRoZW1lLnRleHRDb2xvcn07XG4gICAgY3Vyc29yOiAke3Byb3BzID0+IChwcm9wcy5jbGlja2FibGUgPyAncG9pbnRlcicgOiAnYXV0bycpfTtcblxuICAgIC5kYXRhc2V0LWFjdGlvbiB7XG4gICAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbH07XG4gICAgICBvcGFjaXR5OiAxO1xuICAgIH1cblxuICAgIC5kYXRhc2V0LWFjdGlvbjpob3ZlciB7XG4gICAgICBjb2xvcjogd2hpdGU7XG4gICAgfVxuICB9XG5gO1xuY29uc3QgRGF0YXNldFRhZ1dyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvcn07XG4gIGZvbnQtc2l6ZTogMTFweDtcblxuICAuZGF0YXNldC1uYW1lIHtcbiAgICBwYWRkaW5nOiAwIDRweCAwIDEycHg7XG4gIH1cbmA7XG5cbmNvbnN0IERhdGFUYWdBY3Rpb24gPSBzdHlsZWQuZGl2YFxuICBtYXJnaW4tbGVmdDogMTJweDtcbiAgaGVpZ2h0OiAxNnB4O1xuICBvcGFjaXR5OiAwO1xuYDtcblxuY29uc3QgRGF0YVJvd0NvdW50ID0gc3R5bGVkLmRpdmBcbiAgZm9udC1zaXplOiAxMXB4O1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zdWJ0ZXh0Q29sb3J9O1xuICBwYWRkaW5nLWxlZnQ6IDE5cHg7XG5gO1xuXG5leHBvcnQgY29uc3QgRGF0YXNldFRhZyA9ICh7b25DbGljaywgZGF0YXNldH0pID0+IChcbiAgPERhdGFzZXRUYWdXcmFwcGVyXG4gICAgY2xhc3NOYW1lPVwic291cmNlLWRhdGEtdGFnXCJcbiAgICBvbkNsaWNrPXtvbkNsaWNrfVxuICA+XG4gICAgPFNxdWFyZSBjb2xvcj17ZGF0YXNldC5jb2xvcn0gLz5cbiAgICA8c3BhbiBjbGFzc05hbWU9XCJkYXRhc2V0LW5hbWVcIj57ZGF0YXNldC5sYWJlbH08L3NwYW4+XG4gIDwvRGF0YXNldFRhZ1dyYXBwZXI+XG4pO1xuXG5jb25zdCBTb3VyY2VEYXRhQ2F0YWxvZyA9ICh7XG4gIGRhdGFzZXRzLFxuICBzaG93RGF0YXNldFRhYmxlLFxuICByZW1vdmVEYXRhc2V0LFxuICBzaG93RGVsZXRlRGF0YXNldCA9IGZhbHNlXG59KSA9PiAoXG4gIDxTb3VyY2VEYXRhQ2F0ZWxvZyBjbGFzc05hbWU9XCJzb3VyY2UtZGF0YS1jYXRhbG9nXCI+XG4gICAge09iamVjdC52YWx1ZXMoZGF0YXNldHMpLm1hcCgoZGF0YXNldCwgaW5kZXgpID0+IChcbiAgICAgIDxTaWRlUGFuZWxTZWN0aW9uIGtleT17ZGF0YXNldC5pZH0+XG4gICAgICAgIDxEYXRhc2V0VGl0bGUgY2xpY2thYmxlPXtCb29sZWFuKHNob3dEYXRhc2V0VGFibGUpfT5cbiAgICAgICAgICA8RGF0YXNldFRhZ1xuICAgICAgICAgICAgZGF0YXNldD17ZGF0YXNldH1cbiAgICAgICAgICAgIG9uQ2xpY2s9e3Nob3dEYXRhc2V0VGFibGUgPyAoKSA9PiBzaG93RGF0YXNldFRhYmxlKGRhdGFzZXQuaWQpIDogbnVsbH1cbiAgICAgICAgICAvPlxuICAgICAgICAgIHtzaG93RGF0YXNldFRhYmxlID8gPEFycm93UmlnaHQgaGVpZ2h0PVwiMTJweFwiIC8+IDogbnVsbH1cbiAgICAgICAgICB7c2hvd0RhdGFzZXRUYWJsZSA/IChcbiAgICAgICAgICAgIDxTaG93RGF0YVRhYmxlIGlkPXtkYXRhc2V0LmlkfSBzaG93RGF0YXNldFRhYmxlPXtzaG93RGF0YXNldFRhYmxlfSAvPlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgIHtzaG93RGVsZXRlRGF0YXNldCA/IChcbiAgICAgICAgICAgIDxSZW1vdmVEYXRhc2V0XG4gICAgICAgICAgICAgIGRhdGFzZXRLZXk9e2RhdGFzZXQuaWR9XG4gICAgICAgICAgICAgIHJlbW92ZURhdGFzZXQ9e3JlbW92ZURhdGFzZXR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICA8L0RhdGFzZXRUaXRsZT5cbiAgICAgICAge3Nob3dEYXRhc2V0VGFibGUgPyAoXG4gICAgICAgICAgPERhdGFSb3dDb3VudCBjbGFzc05hbWU9XCJzb3VyY2UtZGF0YS1yb3dzXCI+e2Ake251bUZvcm1hdChcbiAgICAgICAgICAgIGRhdGFzZXQuYWxsRGF0YS5sZW5ndGhcbiAgICAgICAgICApfSByb3dzYH08L0RhdGFSb3dDb3VudD5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICA8L1NpZGVQYW5lbFNlY3Rpb24+XG4gICAgKSl9XG4gIDwvU291cmNlRGF0YUNhdGVsb2c+XG4pO1xuXG5jb25zdCBTcXVhcmUgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIHdpZHRoOiA4cHg7XG4gIGhlaWdodDogOHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoJHtwcm9wcyA9PiBwcm9wcy5jb2xvci5qb2luKCcsJyl9KTtcbmA7XG5cbmNvbnN0IFNob3dEYXRhVGFibGUgPSAoe2lkLCBzaG93RGF0YXNldFRhYmxlfSkgPT4gKFxuICA8RGF0YVRhZ0FjdGlvblxuICAgIGNsYXNzTmFtZT1cImRhdGFzZXQtYWN0aW9uIHNob3ctZGF0YS10YWJsZVwiXG4gICAgZGF0YS10aXBcbiAgICBkYXRhLWZvcj17YGRhdGEtdGFibGUtJHtpZH1gfVxuICA+XG4gICAgPFRhYmxlXG4gICAgICBoZWlnaHQ9XCIxNnB4XCJcbiAgICAgIG9uQ2xpY2s9eygpID0+IHNob3dEYXRhc2V0VGFibGUoaWQpfVxuICAgIC8+XG4gICAgPFRvb2x0aXAgaWQ9e2BkYXRhLXRhYmxlLSR7aWR9YH0gZWZmZWN0PVwic29saWRcIj5cbiAgICAgIDxzcGFuPlNob3cgZGF0YSB0YWJsZTwvc3Bhbj5cbiAgICA8L1Rvb2x0aXA+XG4gIDwvRGF0YVRhZ0FjdGlvbj5cbik7XG5cbmNvbnN0IFJlbW92ZURhdGFzZXQgPSAoe2RhdGFzZXRLZXksIHJlbW92ZURhdGFzZXQgPSBkZWZhdWx0UmVtb3ZlRGF0YXNldH0pID0+IChcbiAgPERhdGFUYWdBY3Rpb25cbiAgICBjbGFzc05hbWU9XCJkYXRhc2V0LWFjdGlvbiByZW1vdmUtZGF0YXNldFwiXG4gICAgZGF0YS10aXBcbiAgICBkYXRhLWZvcj17YGRlbGV0ZS0ke2RhdGFzZXRLZXl9YH1cbiAgPlxuICAgIDxUcmFzaFxuICAgICAgaGVpZ2h0PVwiMTZweFwiXG4gICAgICBvbkNsaWNrPXtlID0+IHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgcmVtb3ZlRGF0YXNldChkYXRhc2V0S2V5KTtcbiAgICAgIH19XG4gICAgLz5cbiAgICA8VG9vbHRpcCBpZD17YGRlbGV0ZS0ke2RhdGFzZXRLZXl9YH0gZWZmZWN0PVwic29saWRcIiB0eXBlPVwiZXJyb3JcIj5cbiAgICAgIDxzcGFuPlJlbW92ZSBkYXRhc2V0PC9zcGFuPlxuICAgIDwvVG9vbHRpcD5cbiAgPC9EYXRhVGFnQWN0aW9uPlxuKTtcblxuZXhwb3J0IGRlZmF1bHQgU291cmNlRGF0YUNhdGFsb2c7XG4iXX0=
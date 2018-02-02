'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DatasetTag = undefined;

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  transition: ', ';\n'], ['\n  transition: ', ';\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  color: ', ';\n  display: flex;\n  align-items: center;\n  :hover {\n    color: ', ';\n    cursor: ', ';\n\n    .dataset-action {\n      color: ', ';\n      opacity: 1;\n    }\n\n    .dataset-action:hover {\n      color: white;\n    }\n  }\n'], ['\n  color: ', ';\n  display: flex;\n  align-items: center;\n  :hover {\n    color: ', ';\n    cursor: ', ';\n\n    .dataset-action {\n      color: ', ';\n      opacity: 1;\n    }\n\n    .dataset-action:hover {\n      color: white;\n    }\n  }\n']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: inline-block;\n  color: ', ';\n  font-size: 11px;\n  letter-spacing: 0.2px;\n\n  .dataset-name {\n    padding: 0 4px 0 12px;\n  }\n'], ['\n  display: inline-block;\n  color: ', ';\n  font-size: 11px;\n  letter-spacing: 0.2px;\n\n  .dataset-name {\n    padding: 0 4px 0 12px;\n  }\n']),
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
    { className: 'source-data-tag', onClick: onClick },
    _react2.default.createElement(Square, { className: 'dataset-color', color: dataset.color }),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvc291cmNlLWRhdGEtY2F0YWxvZy5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0UmVtb3ZlRGF0YXNldCIsIm51bUZvcm1hdCIsIlNvdXJjZURhdGFDYXRlbG9nIiwiZGl2IiwicHJvcHMiLCJ0aGVtZSIsInRyYW5zaXRpb24iLCJEYXRhc2V0VGl0bGUiLCJ0ZXh0Q29sb3IiLCJjbGlja2FibGUiLCJ0ZXh0Q29sb3JIbCIsIkRhdGFzZXRUYWdXcmFwcGVyIiwiRGF0YVRhZ0FjdGlvbiIsIkRhdGFSb3dDb3VudCIsInN1YnRleHRDb2xvciIsIkRhdGFzZXRUYWciLCJvbkNsaWNrIiwiZGF0YXNldCIsImNvbG9yIiwibGFiZWwiLCJTb3VyY2VEYXRhQ2F0YWxvZyIsImRhdGFzZXRzIiwic2hvd0RhdGFzZXRUYWJsZSIsInJlbW92ZURhdGFzZXQiLCJzaG93RGVsZXRlRGF0YXNldCIsIk9iamVjdCIsInZhbHVlcyIsIm1hcCIsImluZGV4IiwiaWQiLCJCb29sZWFuIiwiYWxsRGF0YSIsImxlbmd0aCIsIlNxdWFyZSIsImpvaW4iLCJTaG93RGF0YVRhYmxlIiwiUmVtb3ZlRGF0YXNldCIsImRhdGFzZXRLZXkiLCJlIiwic3RvcFByb3BhZ2F0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7O0FBRUE7O0FBQ0E7Ozs7QUFFQSxJQUFNQSx1QkFBdUIsU0FBdkJBLG9CQUF1QixhQUFjLENBQUUsQ0FBN0M7QUFDQSxJQUFNQyxZQUFZLHNCQUFPLEdBQVAsQ0FBbEI7O0FBRUEsSUFBTUMsb0JBQW9CLDJCQUFPQyxHQUEzQixrQkFDVTtBQUFBLFNBQVNDLE1BQU1DLEtBQU4sQ0FBWUMsVUFBckI7QUFBQSxDQURWLENBQU47O0FBSUEsSUFBTUMsZUFBZSwyQkFBT0osR0FBdEIsbUJBQ0s7QUFBQSxTQUFTQyxNQUFNQyxLQUFOLENBQVlHLFNBQXJCO0FBQUEsQ0FE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aUJBQVUsZ0NBRFo7QUFFRSxzQkFGRjtBQUdFLGtDQUF3Qk87QUFIMUI7QUFLRSxrREFBTyxRQUFPLE1BQWQsRUFBcUIsU0FBUztBQUFBLGVBQU1QLGlCQUFpQk8sRUFBakIsQ0FBTjtBQUFBLE9BQTlCLEdBTEY7QUFNRTtBQUFBO0FBQUEsUUFBUyxvQkFBa0JBLEVBQTNCLEVBQWlDLFFBQU8sT0FBeEM7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREY7QUFORixHQURvQjtBQUFBLENBQXRCOztBQWFBLElBQU1PLGdCQUFnQixTQUFoQkEsYUFBZ0I7QUFBQSxNQUFFQyxVQUFGLFNBQUVBLFVBQUY7QUFBQSxrQ0FBY2QsYUFBZDtBQUFBLE1BQWNBLGFBQWQsdUNBQThCdkIsb0JBQTlCO0FBQUEsU0FDcEI7QUFBQyxpQkFBRDtBQUFBO0FBQ0UsaUJBQVUsK0JBRFo7QUFFRSxzQkFGRjtBQUdFLDhCQUFvQnFDO0FBSHRCO0FBS0U7QUFDRSxjQUFPLE1BRFQ7QUFFRSxlQUFTLG9CQUFLO0FBQ1pDLFVBQUVDLGVBQUY7QUFDQWhCLHNCQUFjYyxVQUFkO0FBQ0Q7QUFMSCxNQUxGO0FBWUU7QUFBQTtBQUFBLFFBQVMsZ0JBQWNBLFVBQXZCLEVBQXFDLFFBQU8sT0FBNUMsRUFBb0QsTUFBSyxPQUF6RDtBQUNFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFERjtBQVpGLEdBRG9CO0FBQUEsQ0FBdEI7O2tCQW1CZWpCLGlCIiwiZmlsZSI6InNvdXJjZS1kYXRhLWNhdGFsb2cuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge2Zvcm1hdH0gZnJvbSAnZDMtZm9ybWF0JztcblxuaW1wb3J0IHtTaWRlUGFuZWxTZWN0aW9uLCBUb29sdGlwfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge1RhYmxlLCBUcmFzaCwgQXJyb3dSaWdodH0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuXG5jb25zdCBkZWZhdWx0UmVtb3ZlRGF0YXNldCA9IGRhdGFzZXRLZXkgPT4ge307XG5jb25zdCBudW1Gb3JtYXQgPSBmb3JtYXQoJywnKTtcblxuY29uc3QgU291cmNlRGF0YUNhdGVsb2cgPSBzdHlsZWQuZGl2YFxuICB0cmFuc2l0aW9uOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRyYW5zaXRpb259O1xuYDtcblxuY29uc3QgRGF0YXNldFRpdGxlID0gc3R5bGVkLmRpdmBcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yfTtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgOmhvdmVyIHtcbiAgICBjb2xvcjogJHtwcm9wcyA9PlxuICAgICAgcHJvcHMuY2xpY2thYmxlID8gcHJvcHMudGhlbWUudGV4dENvbG9ySGwgOiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuICAgIGN1cnNvcjogJHtwcm9wcyA9PiAocHJvcHMuY2xpY2thYmxlID8gJ3BvaW50ZXInIDogJ2F1dG8nKX07XG5cbiAgICAuZGF0YXNldC1hY3Rpb24ge1xuICAgICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9ySGx9O1xuICAgICAgb3BhY2l0eTogMTtcbiAgICB9XG5cbiAgICAuZGF0YXNldC1hY3Rpb246aG92ZXIge1xuICAgICAgY29sb3I6IHdoaXRlO1xuICAgIH1cbiAgfVxuYDtcbmNvbnN0IERhdGFzZXRUYWdXcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuICBmb250LXNpemU6IDExcHg7XG4gIGxldHRlci1zcGFjaW5nOiAwLjJweDtcblxuICAuZGF0YXNldC1uYW1lIHtcbiAgICBwYWRkaW5nOiAwIDRweCAwIDEycHg7XG4gIH1cbmA7XG5cbmNvbnN0IERhdGFUYWdBY3Rpb24gPSBzdHlsZWQuZGl2YFxuICBtYXJnaW4tbGVmdDogMTJweDtcbiAgaGVpZ2h0OiAxNnB4O1xuICBvcGFjaXR5OiAwO1xuYDtcblxuY29uc3QgRGF0YVJvd0NvdW50ID0gc3R5bGVkLmRpdmBcbiAgZm9udC1zaXplOiAxMXB4O1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zdWJ0ZXh0Q29sb3J9O1xuICBwYWRkaW5nLWxlZnQ6IDE5cHg7XG5gO1xuXG5leHBvcnQgY29uc3QgRGF0YXNldFRhZyA9ICh7b25DbGljaywgZGF0YXNldH0pID0+IChcbiAgPERhdGFzZXRUYWdXcmFwcGVyIGNsYXNzTmFtZT1cInNvdXJjZS1kYXRhLXRhZ1wiIG9uQ2xpY2s9e29uQ2xpY2t9PlxuICAgIDxTcXVhcmUgY2xhc3NOYW1lPVwiZGF0YXNldC1jb2xvclwiIGNvbG9yPXtkYXRhc2V0LmNvbG9yfSAvPlxuICAgIDxzcGFuIGNsYXNzTmFtZT1cImRhdGFzZXQtbmFtZVwiPntkYXRhc2V0LmxhYmVsfTwvc3Bhbj5cbiAgPC9EYXRhc2V0VGFnV3JhcHBlcj5cbik7XG5cbmNvbnN0IFNvdXJjZURhdGFDYXRhbG9nID0gKHtcbiAgZGF0YXNldHMsXG4gIHNob3dEYXRhc2V0VGFibGUsXG4gIHJlbW92ZURhdGFzZXQsXG4gIHNob3dEZWxldGVEYXRhc2V0ID0gZmFsc2Vcbn0pID0+IChcbiAgPFNvdXJjZURhdGFDYXRlbG9nIGNsYXNzTmFtZT1cInNvdXJjZS1kYXRhLWNhdGFsb2dcIj5cbiAgICB7T2JqZWN0LnZhbHVlcyhkYXRhc2V0cykubWFwKChkYXRhc2V0LCBpbmRleCkgPT4gKFxuICAgICAgPFNpZGVQYW5lbFNlY3Rpb24ga2V5PXtkYXRhc2V0LmlkfT5cbiAgICAgICAgPERhdGFzZXRUaXRsZSBjbGlja2FibGU9e0Jvb2xlYW4oc2hvd0RhdGFzZXRUYWJsZSl9PlxuICAgICAgICAgIDxEYXRhc2V0VGFnXG4gICAgICAgICAgICBkYXRhc2V0PXtkYXRhc2V0fVxuICAgICAgICAgICAgb25DbGljaz17XG4gICAgICAgICAgICAgIHNob3dEYXRhc2V0VGFibGUgPyAoKSA9PiBzaG93RGF0YXNldFRhYmxlKGRhdGFzZXQuaWQpIDogbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICAgIC8+XG4gICAgICAgICAge3Nob3dEYXRhc2V0VGFibGUgPyA8QXJyb3dSaWdodCBoZWlnaHQ9XCIxMnB4XCIgLz4gOiBudWxsfVxuICAgICAgICAgIHtzaG93RGF0YXNldFRhYmxlID8gKFxuICAgICAgICAgICAgPFNob3dEYXRhVGFibGVcbiAgICAgICAgICAgICAgaWQ9e2RhdGFzZXQuaWR9XG4gICAgICAgICAgICAgIHNob3dEYXRhc2V0VGFibGU9e3Nob3dEYXRhc2V0VGFibGV9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgIHtzaG93RGVsZXRlRGF0YXNldCA/IChcbiAgICAgICAgICAgIDxSZW1vdmVEYXRhc2V0XG4gICAgICAgICAgICAgIGRhdGFzZXRLZXk9e2RhdGFzZXQuaWR9XG4gICAgICAgICAgICAgIHJlbW92ZURhdGFzZXQ9e3JlbW92ZURhdGFzZXR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICA8L0RhdGFzZXRUaXRsZT5cbiAgICAgICAge3Nob3dEYXRhc2V0VGFibGUgPyAoXG4gICAgICAgICAgPERhdGFSb3dDb3VudCBjbGFzc05hbWU9XCJzb3VyY2UtZGF0YS1yb3dzXCI+e2Ake251bUZvcm1hdChcbiAgICAgICAgICAgIGRhdGFzZXQuYWxsRGF0YS5sZW5ndGhcbiAgICAgICAgICApfSByb3dzYH08L0RhdGFSb3dDb3VudD5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICA8L1NpZGVQYW5lbFNlY3Rpb24+XG4gICAgKSl9XG4gIDwvU291cmNlRGF0YUNhdGVsb2c+XG4pO1xuXG5jb25zdCBTcXVhcmUgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIHdpZHRoOiA4cHg7XG4gIGhlaWdodDogOHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoJHtwcm9wcyA9PiBwcm9wcy5jb2xvci5qb2luKCcsJyl9KTtcbmA7XG5cbmNvbnN0IFNob3dEYXRhVGFibGUgPSAoe2lkLCBzaG93RGF0YXNldFRhYmxlfSkgPT4gKFxuICA8RGF0YVRhZ0FjdGlvblxuICAgIGNsYXNzTmFtZT1cImRhdGFzZXQtYWN0aW9uIHNob3ctZGF0YS10YWJsZVwiXG4gICAgZGF0YS10aXBcbiAgICBkYXRhLWZvcj17YGRhdGEtdGFibGUtJHtpZH1gfVxuICA+XG4gICAgPFRhYmxlIGhlaWdodD1cIjE2cHhcIiBvbkNsaWNrPXsoKSA9PiBzaG93RGF0YXNldFRhYmxlKGlkKX0gLz5cbiAgICA8VG9vbHRpcCBpZD17YGRhdGEtdGFibGUtJHtpZH1gfSBlZmZlY3Q9XCJzb2xpZFwiPlxuICAgICAgPHNwYW4+U2hvdyBkYXRhIHRhYmxlPC9zcGFuPlxuICAgIDwvVG9vbHRpcD5cbiAgPC9EYXRhVGFnQWN0aW9uPlxuKTtcblxuY29uc3QgUmVtb3ZlRGF0YXNldCA9ICh7ZGF0YXNldEtleSwgcmVtb3ZlRGF0YXNldCA9IGRlZmF1bHRSZW1vdmVEYXRhc2V0fSkgPT4gKFxuICA8RGF0YVRhZ0FjdGlvblxuICAgIGNsYXNzTmFtZT1cImRhdGFzZXQtYWN0aW9uIHJlbW92ZS1kYXRhc2V0XCJcbiAgICBkYXRhLXRpcFxuICAgIGRhdGEtZm9yPXtgZGVsZXRlLSR7ZGF0YXNldEtleX1gfVxuICA+XG4gICAgPFRyYXNoXG4gICAgICBoZWlnaHQ9XCIxNnB4XCJcbiAgICAgIG9uQ2xpY2s9e2UgPT4ge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICByZW1vdmVEYXRhc2V0KGRhdGFzZXRLZXkpO1xuICAgICAgfX1cbiAgICAvPlxuICAgIDxUb29sdGlwIGlkPXtgZGVsZXRlLSR7ZGF0YXNldEtleX1gfSBlZmZlY3Q9XCJzb2xpZFwiIHR5cGU9XCJlcnJvclwiPlxuICAgICAgPHNwYW4+UmVtb3ZlIGRhdGFzZXQ8L3NwYW4+XG4gICAgPC9Ub29sdGlwPlxuICA8L0RhdGFUYWdBY3Rpb24+XG4pO1xuXG5leHBvcnQgZGVmYXVsdCBTb3VyY2VEYXRhQ2F0YWxvZztcbiJdfQ==
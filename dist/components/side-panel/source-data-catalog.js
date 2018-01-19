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
    { className: 'source-data-tag', onClick: onClick },
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvc291cmNlLWRhdGEtY2F0YWxvZy5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0UmVtb3ZlRGF0YXNldCIsIm51bUZvcm1hdCIsIlNvdXJjZURhdGFDYXRlbG9nIiwiZGl2IiwicHJvcHMiLCJ0aGVtZSIsInRyYW5zaXRpb24iLCJEYXRhc2V0VGl0bGUiLCJ0ZXh0Q29sb3IiLCJjbGlja2FibGUiLCJ0ZXh0Q29sb3JIbCIsIkRhdGFzZXRUYWdXcmFwcGVyIiwiRGF0YVRhZ0FjdGlvbiIsIkRhdGFSb3dDb3VudCIsInN1YnRleHRDb2xvciIsIkRhdGFzZXRUYWciLCJvbkNsaWNrIiwiZGF0YXNldCIsImNvbG9yIiwibGFiZWwiLCJTb3VyY2VEYXRhQ2F0YWxvZyIsImRhdGFzZXRzIiwic2hvd0RhdGFzZXRUYWJsZSIsInJlbW92ZURhdGFzZXQiLCJzaG93RGVsZXRlRGF0YXNldCIsIk9iamVjdCIsInZhbHVlcyIsIm1hcCIsImluZGV4IiwiaWQiLCJCb29sZWFuIiwiYWxsRGF0YSIsImxlbmd0aCIsIlNxdWFyZSIsImpvaW4iLCJTaG93RGF0YVRhYmxlIiwiUmVtb3ZlRGF0YXNldCIsImRhdGFzZXRLZXkiLCJlIiwic3RvcFByb3BhZ2F0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7O0FBRUE7O0FBQ0E7Ozs7QUFFQSxJQUFNQSx1QkFBdUIsU0FBdkJBLG9CQUF1QixhQUFjLENBQUUsQ0FBN0M7QUFDQSxJQUFNQyxZQUFZLHNCQUFPLEdBQVAsQ0FBbEI7O0FBRUEsSUFBTUMsb0JBQW9CLDJCQUFPQyxHQUEzQixrQkFDVTtBQUFBLFNBQVNDLE1BQU1DLEtBQU4sQ0FBWUMsVUFBckI7QUFBQSxDQURWLENBQU47O0FBSUEsSUFBTUMsZUFBZSwyQkFBT0osR0FBdEIsbUJBQ0s7QUFBQSxTQUFTQyxNQUFNQyxLQUFOLENBQVlHLFNBQXJCO0FBQUEsQ0FETCxFQUtPO0FBQUEsU0FDUEosTUFBTUssU0FBTixHQUFrQkwsTUFBTUMsS0FBTixDQUFZSyxXQUE5QixHQUE0Q04sTUFBTUMsS0FBTixDQUFZRyxTQURqRDtBQUFBLENBTFAsRUFPUTtBQUFBLFNBQVVKLE1BQU1LLFNBQU4sR0FBa0IsU0FBbEIsR0FBOEIsTUFBeEM7QUFBQSxDQVBSLEVBVVM7QUFBQSxTQUFTTCxNQUFNQyxLQUFOLENBQVlLLFdBQXJCO0FBQUEsQ0FWVCxDQUFOO0FBbUJBLElBQU1DLG9CQUFvQiwyQkFBT1IsR0FBM0IsbUJBRUs7QUFBQSxTQUFTQyxNQUFNQyxLQUFOLENBQVlHLFNBQXJCO0FBQUEsQ0FGTCxDQUFOOztBQVVBLElBQU1JLGdCQUFnQiwyQkFBT1QsR0FBdkIsa0JBQU47O0FBTUEsSUFBTVUsZUFBZSwyQkFBT1YsR0FBdEIsbUJBRUs7QUFBQSxTQUFTQyxNQUFNQyxLQUFOLENBQVlTLFlBQXJCO0FBQUEsQ0FGTCxDQUFOOztBQU1PLElBQU1DLGtDQUFhLFNBQWJBLFVBQWE7QUFBQSxNQUFFQyxPQUFGLFFBQUVBLE9BQUY7QUFBQSxNQUFXQyxPQUFYLFFBQVdBLE9BQVg7QUFBQSxTQUN4QjtBQUFDLHFCQUFEO0FBQUEsTUFBbUIsV0FBVSxpQkFBN0IsRUFBK0MsU0FBU0QsT0FBeEQ7QUFDRSxrQ0FBQyxNQUFELElBQVEsT0FBT0MsUUFBUUMsS0FBdkIsR0FERjtBQUVFO0FBQUE7QUFBQSxRQUFNLFdBQVUsY0FBaEI7QUFBZ0NELGNBQVFFO0FBQXhDO0FBRkYsR0FEd0I7QUFBQSxDQUFuQjs7QUFPUCxJQUFNQyxvQkFBb0IsU0FBcEJBLGlCQUFvQjtBQUFBLE1BQ3hCQyxRQUR3QixTQUN4QkEsUUFEd0I7QUFBQSxNQUV4QkMsZ0JBRndCLFNBRXhCQSxnQkFGd0I7QUFBQSxNQUd4QkMsYUFId0IsU0FHeEJBLGFBSHdCO0FBQUEsb0NBSXhCQyxpQkFKd0I7QUFBQSxNQUl4QkEsaUJBSndCLHlDQUlKLEtBSkk7QUFBQSxTQU14QjtBQUFDLHFCQUFEO0FBQUEsTUFBbUIsV0FBVSxxQkFBN0I7QUFDR0MsV0FBT0MsTUFBUCxDQUFjTCxRQUFkLEVBQXdCTSxHQUF4QixDQUE0QixVQUFDVixPQUFELEVBQVVXLEtBQVY7QUFBQSxhQUMzQjtBQUFBO0FBQUEsVUFBa0IsS0FBS1gsUUFBUVksRUFBL0I7QUFDRTtBQUFDLHNCQUFEO0FBQUEsWUFBYyxXQUFXQyxRQUFRUixnQkFBUixDQUF6QjtBQUNFLHdDQUFDLFVBQUQ7QUFDRSxxQkFBU0wsT0FEWDtBQUVFLHFCQUNFSyxtQkFBbUI7QUFBQSxxQkFBTUEsaUJBQWlCTCxRQUFRWSxFQUF6QixDQUFOO0FBQUEsYUFBbkIsR0FBd0Q7QUFINUQsWUFERjtBQU9HUCw2QkFBbUIsbURBQVksUUFBTyxNQUFuQixHQUFuQixHQUFrRCxJQVByRDtBQVFHQSw2QkFDQyw4QkFBQyxhQUFEO0FBQ0UsZ0JBQUlMLFFBQVFZLEVBRGQ7QUFFRSw4QkFBa0JQO0FBRnBCLFlBREQsR0FLRyxJQWJOO0FBY0dFLDhCQUNDLDhCQUFDLGFBQUQ7QUFDRSx3QkFBWVAsUUFBUVksRUFEdEI7QUFFRSwyQkFBZU47QUFGakIsWUFERCxHQUtHO0FBbkJOLFNBREY7QUFzQkdELDJCQUNDO0FBQUMsc0JBQUQ7QUFBQSxZQUFjLFdBQVUsa0JBQXhCO0FBQStDckIsb0JBQzdDZ0IsUUFBUWMsT0FBUixDQUFnQkMsTUFENkIsQ0FBL0M7QUFBQSxTQURELEdBSUc7QUExQk4sT0FEMkI7QUFBQSxLQUE1QjtBQURILEdBTndCO0FBQUEsQ0FBMUI7O0FBd0NBLElBQU1DLFNBQVMsMkJBQU85QixHQUFoQixtQkFJb0I7QUFBQSxTQUFTQyxNQUFNYyxLQUFOLENBQVlnQixJQUFaLENBQWlCLEdBQWpCLENBQVQ7QUFBQSxDQUpwQixDQUFOOztBQU9BLElBQU1DLGdCQUFnQixTQUFoQkEsYUFBZ0I7QUFBQSxNQUFFTixFQUFGLFNBQUVBLEVBQUY7QUFBQSxNQUFNUCxnQkFBTixTQUFNQSxnQkFBTjtBQUFBLFNBQ3BCO0FBQUMsaUJBQUQ7QUFBQTtBQUNFLGlCQUFVLGdDQURaO0FBRUUsc0JBRkY7QUFHRSxrQ0FBd0JPO0FBSDFCO0FBS0Usa0RBQU8sUUFBTyxNQUFkLEVBQXFCLFNBQVM7QUFBQSxlQUFNUCxpQkFBaUJPLEVBQWpCLENBQU47QUFBQSxPQUE5QixHQUxGO0FBTUU7QUFBQTtBQUFBLFFBQVMsb0JBQWtCQSxFQUEzQixFQUFpQyxRQUFPLE9BQXhDO0FBQ0U7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQURGO0FBTkYsR0FEb0I7QUFBQSxDQUF0Qjs7QUFhQSxJQUFNTyxnQkFBZ0IsU0FBaEJBLGFBQWdCO0FBQUEsTUFBRUMsVUFBRixTQUFFQSxVQUFGO0FBQUEsa0NBQWNkLGFBQWQ7QUFBQSxNQUFjQSxhQUFkLHVDQUE4QnZCLG9CQUE5QjtBQUFBLFNBQ3BCO0FBQUMsaUJBQUQ7QUFBQTtBQUNFLGlCQUFVLCtCQURaO0FBRUUsc0JBRkY7QUFHRSw4QkFBb0JxQztBQUh0QjtBQUtFO0FBQ0UsY0FBTyxNQURUO0FBRUUsZUFBUyxvQkFBSztBQUNaQyxVQUFFQyxlQUFGO0FBQ0FoQixzQkFBY2MsVUFBZDtBQUNEO0FBTEgsTUFMRjtBQVlFO0FBQUE7QUFBQSxRQUFTLGdCQUFjQSxVQUF2QixFQUFxQyxRQUFPLE9BQTVDLEVBQW9ELE1BQUssT0FBekQ7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREY7QUFaRixHQURvQjtBQUFBLENBQXRCOztrQkFtQmVqQixpQiIsImZpbGUiOiJzb3VyY2UtZGF0YS1jYXRhbG9nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtmb3JtYXR9IGZyb20gJ2QzLWZvcm1hdCc7XG5cbmltcG9ydCB7U2lkZVBhbmVsU2VjdGlvbiwgVG9vbHRpcH0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtUYWJsZSwgVHJhc2gsIEFycm93UmlnaHR9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcblxuY29uc3QgZGVmYXVsdFJlbW92ZURhdGFzZXQgPSBkYXRhc2V0S2V5ID0+IHt9O1xuY29uc3QgbnVtRm9ybWF0ID0gZm9ybWF0KCcsJyk7XG5cbmNvbnN0IFNvdXJjZURhdGFDYXRlbG9nID0gc3R5bGVkLmRpdmBcbiAgdHJhbnNpdGlvbjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50cmFuc2l0aW9ufTtcbmA7XG5cbmNvbnN0IERhdGFzZXRUaXRsZSA9IHN0eWxlZC5kaXZgXG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvcn07XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIDpob3ZlciB7XG4gICAgY29sb3I6ICR7cHJvcHMgPT5cbiAgICAgIHByb3BzLmNsaWNrYWJsZSA/IHByb3BzLnRoZW1lLnRleHRDb2xvckhsIDogcHJvcHMudGhlbWUudGV4dENvbG9yfTtcbiAgICBjdXJzb3I6ICR7cHJvcHMgPT4gKHByb3BzLmNsaWNrYWJsZSA/ICdwb2ludGVyJyA6ICdhdXRvJyl9O1xuXG4gICAgLmRhdGFzZXQtYWN0aW9uIHtcbiAgICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckhsfTtcbiAgICAgIG9wYWNpdHk6IDE7XG4gICAgfVxuXG4gICAgLmRhdGFzZXQtYWN0aW9uOmhvdmVyIHtcbiAgICAgIGNvbG9yOiB3aGl0ZTtcbiAgICB9XG4gIH1cbmA7XG5jb25zdCBEYXRhc2V0VGFnV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yfTtcbiAgZm9udC1zaXplOiAxMXB4O1xuXG4gIC5kYXRhc2V0LW5hbWUge1xuICAgIHBhZGRpbmc6IDAgNHB4IDAgMTJweDtcbiAgfVxuYDtcblxuY29uc3QgRGF0YVRhZ0FjdGlvbiA9IHN0eWxlZC5kaXZgXG4gIG1hcmdpbi1sZWZ0OiAxMnB4O1xuICBoZWlnaHQ6IDE2cHg7XG4gIG9wYWNpdHk6IDA7XG5gO1xuXG5jb25zdCBEYXRhUm93Q291bnQgPSBzdHlsZWQuZGl2YFxuICBmb250LXNpemU6IDExcHg7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnN1YnRleHRDb2xvcn07XG4gIHBhZGRpbmctbGVmdDogMTlweDtcbmA7XG5cbmV4cG9ydCBjb25zdCBEYXRhc2V0VGFnID0gKHtvbkNsaWNrLCBkYXRhc2V0fSkgPT4gKFxuICA8RGF0YXNldFRhZ1dyYXBwZXIgY2xhc3NOYW1lPVwic291cmNlLWRhdGEtdGFnXCIgb25DbGljaz17b25DbGlja30+XG4gICAgPFNxdWFyZSBjb2xvcj17ZGF0YXNldC5jb2xvcn0gLz5cbiAgICA8c3BhbiBjbGFzc05hbWU9XCJkYXRhc2V0LW5hbWVcIj57ZGF0YXNldC5sYWJlbH08L3NwYW4+XG4gIDwvRGF0YXNldFRhZ1dyYXBwZXI+XG4pO1xuXG5jb25zdCBTb3VyY2VEYXRhQ2F0YWxvZyA9ICh7XG4gIGRhdGFzZXRzLFxuICBzaG93RGF0YXNldFRhYmxlLFxuICByZW1vdmVEYXRhc2V0LFxuICBzaG93RGVsZXRlRGF0YXNldCA9IGZhbHNlXG59KSA9PiAoXG4gIDxTb3VyY2VEYXRhQ2F0ZWxvZyBjbGFzc05hbWU9XCJzb3VyY2UtZGF0YS1jYXRhbG9nXCI+XG4gICAge09iamVjdC52YWx1ZXMoZGF0YXNldHMpLm1hcCgoZGF0YXNldCwgaW5kZXgpID0+IChcbiAgICAgIDxTaWRlUGFuZWxTZWN0aW9uIGtleT17ZGF0YXNldC5pZH0+XG4gICAgICAgIDxEYXRhc2V0VGl0bGUgY2xpY2thYmxlPXtCb29sZWFuKHNob3dEYXRhc2V0VGFibGUpfT5cbiAgICAgICAgICA8RGF0YXNldFRhZ1xuICAgICAgICAgICAgZGF0YXNldD17ZGF0YXNldH1cbiAgICAgICAgICAgIG9uQ2xpY2s9e1xuICAgICAgICAgICAgICBzaG93RGF0YXNldFRhYmxlID8gKCkgPT4gc2hvd0RhdGFzZXRUYWJsZShkYXRhc2V0LmlkKSA6IG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAvPlxuICAgICAgICAgIHtzaG93RGF0YXNldFRhYmxlID8gPEFycm93UmlnaHQgaGVpZ2h0PVwiMTJweFwiIC8+IDogbnVsbH1cbiAgICAgICAgICB7c2hvd0RhdGFzZXRUYWJsZSA/IChcbiAgICAgICAgICAgIDxTaG93RGF0YVRhYmxlXG4gICAgICAgICAgICAgIGlkPXtkYXRhc2V0LmlkfVxuICAgICAgICAgICAgICBzaG93RGF0YXNldFRhYmxlPXtzaG93RGF0YXNldFRhYmxlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICB7c2hvd0RlbGV0ZURhdGFzZXQgPyAoXG4gICAgICAgICAgICA8UmVtb3ZlRGF0YXNldFxuICAgICAgICAgICAgICBkYXRhc2V0S2V5PXtkYXRhc2V0LmlkfVxuICAgICAgICAgICAgICByZW1vdmVEYXRhc2V0PXtyZW1vdmVEYXRhc2V0fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgPC9EYXRhc2V0VGl0bGU+XG4gICAgICAgIHtzaG93RGF0YXNldFRhYmxlID8gKFxuICAgICAgICAgIDxEYXRhUm93Q291bnQgY2xhc3NOYW1lPVwic291cmNlLWRhdGEtcm93c1wiPntgJHtudW1Gb3JtYXQoXG4gICAgICAgICAgICBkYXRhc2V0LmFsbERhdGEubGVuZ3RoXG4gICAgICAgICAgKX0gcm93c2B9PC9EYXRhUm93Q291bnQ+XG4gICAgICAgICkgOiBudWxsfVxuICAgICAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuICAgICkpfVxuICA8L1NvdXJjZURhdGFDYXRlbG9nPlxuKTtcblxuY29uc3QgU3F1YXJlID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICB3aWR0aDogOHB4O1xuICBoZWlnaHQ6IDhweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKCR7cHJvcHMgPT4gcHJvcHMuY29sb3Iuam9pbignLCcpfSk7XG5gO1xuXG5jb25zdCBTaG93RGF0YVRhYmxlID0gKHtpZCwgc2hvd0RhdGFzZXRUYWJsZX0pID0+IChcbiAgPERhdGFUYWdBY3Rpb25cbiAgICBjbGFzc05hbWU9XCJkYXRhc2V0LWFjdGlvbiBzaG93LWRhdGEtdGFibGVcIlxuICAgIGRhdGEtdGlwXG4gICAgZGF0YS1mb3I9e2BkYXRhLXRhYmxlLSR7aWR9YH1cbiAgPlxuICAgIDxUYWJsZSBoZWlnaHQ9XCIxNnB4XCIgb25DbGljaz17KCkgPT4gc2hvd0RhdGFzZXRUYWJsZShpZCl9IC8+XG4gICAgPFRvb2x0aXAgaWQ9e2BkYXRhLXRhYmxlLSR7aWR9YH0gZWZmZWN0PVwic29saWRcIj5cbiAgICAgIDxzcGFuPlNob3cgZGF0YSB0YWJsZTwvc3Bhbj5cbiAgICA8L1Rvb2x0aXA+XG4gIDwvRGF0YVRhZ0FjdGlvbj5cbik7XG5cbmNvbnN0IFJlbW92ZURhdGFzZXQgPSAoe2RhdGFzZXRLZXksIHJlbW92ZURhdGFzZXQgPSBkZWZhdWx0UmVtb3ZlRGF0YXNldH0pID0+IChcbiAgPERhdGFUYWdBY3Rpb25cbiAgICBjbGFzc05hbWU9XCJkYXRhc2V0LWFjdGlvbiByZW1vdmUtZGF0YXNldFwiXG4gICAgZGF0YS10aXBcbiAgICBkYXRhLWZvcj17YGRlbGV0ZS0ke2RhdGFzZXRLZXl9YH1cbiAgPlxuICAgIDxUcmFzaFxuICAgICAgaGVpZ2h0PVwiMTZweFwiXG4gICAgICBvbkNsaWNrPXtlID0+IHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgcmVtb3ZlRGF0YXNldChkYXRhc2V0S2V5KTtcbiAgICAgIH19XG4gICAgLz5cbiAgICA8VG9vbHRpcCBpZD17YGRlbGV0ZS0ke2RhdGFzZXRLZXl9YH0gZWZmZWN0PVwic29saWRcIiB0eXBlPVwiZXJyb3JcIj5cbiAgICAgIDxzcGFuPlJlbW92ZSBkYXRhc2V0PC9zcGFuPlxuICAgIDwvVG9vbHRpcD5cbiAgPC9EYXRhVGFnQWN0aW9uPlxuKTtcblxuZXhwb3J0IGRlZmF1bHQgU291cmNlRGF0YUNhdGFsb2c7XG4iXX0=
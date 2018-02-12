'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeleteDatasetModal = undefined;

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  margin-top: 24px;\n'], ['\n  margin-top: 24px;\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _datasetLabel = require('../common/dataset-label');

var _datasetLabel2 = _interopRequireDefault(_datasetLabel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StyledMsg = _styledComponents2.default.div(_templateObject);
var DeleteDatasetModal = exports.DeleteDatasetModal = function DeleteDatasetModal(_ref) {
  var _ref$dataset = _ref.dataset,
      dataset = _ref$dataset === undefined ? {} : _ref$dataset,
      _ref$layers = _ref.layers,
      layers = _ref$layers === undefined ? [] : _ref$layers;

  // retrieve only layers related to the current dataset
  var currDatasetLayers = layers.filter(function (layer) {
    return layer.config.dataId === dataset.id;
  });

  return _react2.default.createElement(
    'div',
    { className: 'delete-dataset-modal' },
    _react2.default.createElement(_datasetLabel2.default, { dataset: dataset }),
    _react2.default.createElement(
      StyledMsg,
      { className: 'delete-dataset-msg' },
      'you are going to delete this dataset. It will affect ' + currDatasetLayers.length + ' layers'
    )
  );
};
exports.default = DeleteDatasetModal;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9kZWxldGUtZGF0YS1tb2RhbC5qcyJdLCJuYW1lcyI6WyJTdHlsZWRNc2ciLCJkaXYiLCJEZWxldGVEYXRhc2V0TW9kYWwiLCJkYXRhc2V0IiwibGF5ZXJzIiwiY3VyckRhdGFzZXRMYXllcnMiLCJmaWx0ZXIiLCJsYXllciIsImNvbmZpZyIsImRhdGFJZCIsImlkIiwibGVuZ3RoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxZQUFZLDJCQUFPQyxHQUFuQixpQkFBTjtBQUdPLElBQU1DLGtEQUFxQixTQUFyQkEsa0JBQXFCLE9BQWlDO0FBQUEsMEJBQS9CQyxPQUErQjtBQUFBLE1BQS9CQSxPQUErQixnQ0FBckIsRUFBcUI7QUFBQSx5QkFBakJDLE1BQWlCO0FBQUEsTUFBakJBLE1BQWlCLCtCQUFSLEVBQVE7O0FBQ2pFO0FBQ0EsTUFBTUMsb0JBQW9CRCxPQUFPRSxNQUFQLENBQ3hCO0FBQUEsV0FBU0MsTUFBTUMsTUFBTixDQUFhQyxNQUFiLEtBQXdCTixRQUFRTyxFQUF6QztBQUFBLEdBRHdCLENBQTFCOztBQUlBLFNBQ0U7QUFBQTtBQUFBLE1BQUssV0FBVSxzQkFBZjtBQUNFLDREQUFjLFNBQVNQLE9BQXZCLEdBREY7QUFFRTtBQUFDLGVBQUQ7QUFBQSxRQUFXLFdBQVUsb0JBQXJCO0FBQUEsZ0VBQ0VFLGtCQUFrQk0sTUFEcEI7QUFBQTtBQUZGLEdBREY7QUFRRCxDQWRNO2tCQWVRVCxrQiIsImZpbGUiOiJkZWxldGUtZGF0YS1tb2RhbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBEYXRhc2V0TGFiZWwgZnJvbSAnY29tcG9uZW50cy9jb21tb24vZGF0YXNldC1sYWJlbCc7XG5cbmNvbnN0IFN0eWxlZE1zZyA9IHN0eWxlZC5kaXZgXG4gIG1hcmdpbi10b3A6IDI0cHg7XG5gO1xuZXhwb3J0IGNvbnN0IERlbGV0ZURhdGFzZXRNb2RhbCA9ICh7ZGF0YXNldCA9IHt9LCBsYXllcnMgPSBbXX0pID0+IHtcbiAgLy8gcmV0cmlldmUgb25seSBsYXllcnMgcmVsYXRlZCB0byB0aGUgY3VycmVudCBkYXRhc2V0XG4gIGNvbnN0IGN1cnJEYXRhc2V0TGF5ZXJzID0gbGF5ZXJzLmZpbHRlcihcbiAgICBsYXllciA9PiBsYXllci5jb25maWcuZGF0YUlkID09PSBkYXRhc2V0LmlkXG4gICk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImRlbGV0ZS1kYXRhc2V0LW1vZGFsXCI+XG4gICAgICA8RGF0YXNldExhYmVsIGRhdGFzZXQ9e2RhdGFzZXR9IC8+XG4gICAgICA8U3R5bGVkTXNnIGNsYXNzTmFtZT1cImRlbGV0ZS1kYXRhc2V0LW1zZ1wiPntgeW91IGFyZSBnb2luZyB0byBkZWxldGUgdGhpcyBkYXRhc2V0LiBJdCB3aWxsIGFmZmVjdCAke1xuICAgICAgICBjdXJyRGF0YXNldExheWVycy5sZW5ndGhcbiAgICAgIH0gbGF5ZXJzYH08L1N0eWxlZE1zZz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5leHBvcnQgZGVmYXVsdCBEZWxldGVEYXRhc2V0TW9kYWw7XG4iXX0=
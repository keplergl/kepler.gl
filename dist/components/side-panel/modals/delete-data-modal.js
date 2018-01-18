'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeleteDatasetModal = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Much generic component to ask for confirmation
var DeleteDataModal = function DeleteDataModal(_ref) {
  var title = _ref.title,
      subtitle = _ref.subtitle,
      message = _ref.message,
      deleteAction = _ref.deleteAction,
      cancelAction = _ref.cancelAction;

  return _react2.default.createElement(
    'div',
    { className: 'dataset-modal' },
    _react2.default.createElement(
      'h2',
      null,
      title
    ),
    _react2.default.createElement(
      'h4',
      null,
      subtitle
    ),
    _react2.default.createElement(
      'p',
      null,
      message
    ),
    _react2.default.createElement(
      'button',
      { className: 'btn btn--link float--right',
        style: { backgroundColor: 'red', color: 'white' },
        onClick: deleteAction },
      'Delete'
    ),
    _react2.default.createElement(
      'button',
      { className: 'btn btn--link float--right',
        style: { marginRight: '12px' },
        onClick: cancelAction },
      'Cancel'
    )
  );
};

var DeleteDatasetModal = exports.DeleteDatasetModal = function DeleteDatasetModal(_ref2) {
  var _ref2$dataset = _ref2.dataset,
      dataset = _ref2$dataset === undefined ? {} : _ref2$dataset,
      _ref2$layers = _ref2.layers,
      layers = _ref2$layers === undefined ? [] : _ref2$layers,
      deleteAction = _ref2.deleteAction,
      cancelAction = _ref2.cancelAction;
  var label = dataset.label;
  // retrieve dataset color

  var subtitle = _react2.default.createElement(
    'ul',
    { style: { listStyleTypes: 'square' } },
    _react2.default.createElement(
      'li',
      { style: { color: 'rgb(' + dataset.color.join(',') + ')' } },
      _react2.default.createElement(
        'span',
        {
          className: 'dataset-label',
          style: { color: 'black' } },
        label
      )
    )
  );

  // retrieve only layers related to the current dataset
  var currDatasetLayers = layers.filter(function (layer) {
    return layer.config.dataId === dataset.id;
  });

  return _react2.default.createElement(DeleteDataModal, {
    cancelAction: cancelAction,
    deleteAction: deleteAction,
    message: 'you are going to delete this dataset. It will affect ' + currDatasetLayers.length + ' layers',
    subtitle: subtitle,
    title: 'Delete Dataset'
  });
};
exports.default = DeleteDataModal;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbW9kYWxzL2RlbGV0ZS1kYXRhLW1vZGFsLmpzIl0sIm5hbWVzIjpbIkRlbGV0ZURhdGFNb2RhbCIsInRpdGxlIiwic3VidGl0bGUiLCJtZXNzYWdlIiwiZGVsZXRlQWN0aW9uIiwiY2FuY2VsQWN0aW9uIiwiYmFja2dyb3VuZENvbG9yIiwiY29sb3IiLCJtYXJnaW5SaWdodCIsIkRlbGV0ZURhdGFzZXRNb2RhbCIsImRhdGFzZXQiLCJsYXllcnMiLCJsYWJlbCIsImxpc3RTdHlsZVR5cGVzIiwiam9pbiIsImN1cnJEYXRhc2V0TGF5ZXJzIiwiZmlsdGVyIiwibGF5ZXIiLCJjb25maWciLCJkYXRhSWQiLCJpZCIsImxlbmd0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7Ozs7QUFFQTtBQUNBLElBQU1BLGtCQUFrQixTQUFsQkEsZUFBa0IsT0FBNEQ7QUFBQSxNQUExREMsS0FBMEQsUUFBMURBLEtBQTBEO0FBQUEsTUFBbkRDLFFBQW1ELFFBQW5EQSxRQUFtRDtBQUFBLE1BQXpDQyxPQUF5QyxRQUF6Q0EsT0FBeUM7QUFBQSxNQUFoQ0MsWUFBZ0MsUUFBaENBLFlBQWdDO0FBQUEsTUFBbEJDLFlBQWtCLFFBQWxCQSxZQUFrQjs7QUFDbEYsU0FDRTtBQUFBO0FBQUEsTUFBSyxXQUFVLGVBQWY7QUFDRTtBQUFBO0FBQUE7QUFBS0o7QUFBTCxLQURGO0FBRUU7QUFBQTtBQUFBO0FBQUtDO0FBQUwsS0FGRjtBQUdFO0FBQUE7QUFBQTtBQUFJQztBQUFKLEtBSEY7QUFJRTtBQUFBO0FBQUEsUUFBUSxXQUFVLDRCQUFsQjtBQUNRLGVBQU8sRUFBQ0csaUJBQWlCLEtBQWxCLEVBQXlCQyxPQUFPLE9BQWhDLEVBRGY7QUFFUSxpQkFBU0gsWUFGakI7QUFBQTtBQUFBLEtBSkY7QUFPRTtBQUFBO0FBQUEsUUFBUSxXQUFVLDRCQUFsQjtBQUNRLGVBQU8sRUFBQ0ksYUFBYSxNQUFkLEVBRGY7QUFFUSxpQkFBU0gsWUFGakI7QUFBQTtBQUFBO0FBUEYsR0FERjtBQWFELENBZEQ7O0FBZ0JPLElBQU1JLGtEQUFxQixTQUFyQkEsa0JBQXFCLFFBQTZEO0FBQUEsNEJBQTNEQyxPQUEyRDtBQUFBLE1BQTNEQSxPQUEyRCxpQ0FBakQsRUFBaUQ7QUFBQSwyQkFBN0NDLE1BQTZDO0FBQUEsTUFBN0NBLE1BQTZDLGdDQUFwQyxFQUFvQztBQUFBLE1BQWhDUCxZQUFnQyxTQUFoQ0EsWUFBZ0M7QUFBQSxNQUFsQkMsWUFBa0IsU0FBbEJBLFlBQWtCO0FBQUEsTUFDdEZPLEtBRHNGLEdBQzdFRixPQUQ2RSxDQUN0RkUsS0FEc0Y7QUFFN0Y7O0FBQ0EsTUFBTVYsV0FDSjtBQUFBO0FBQUEsTUFBSSxPQUFPLEVBQUNXLGdCQUFnQixRQUFqQixFQUFYO0FBQ0U7QUFBQTtBQUFBLFFBQUksT0FBTyxFQUFDTixnQkFBY0csUUFBUUgsS0FBUixDQUFjTyxJQUFkLENBQW1CLEdBQW5CLENBQWQsTUFBRCxFQUFYO0FBQ0U7QUFBQTtBQUFBO0FBQ0UscUJBQVUsZUFEWjtBQUVFLGlCQUFPLEVBQUNQLE9BQU8sT0FBUixFQUZUO0FBR0dLO0FBSEg7QUFERjtBQURGLEdBREY7O0FBWUE7QUFDQSxNQUFNRyxvQkFBb0JKLE9BQU9LLE1BQVAsQ0FBYztBQUFBLFdBQVNDLE1BQU1DLE1BQU4sQ0FBYUMsTUFBYixLQUF3QlQsUUFBUVUsRUFBekM7QUFBQSxHQUFkLENBQTFCOztBQUVBLFNBQ0UsOEJBQUMsZUFBRDtBQUNFLGtCQUFjZixZQURoQjtBQUVFLGtCQUFjRCxZQUZoQjtBQUdFLHVFQUFpRVcsa0JBQWtCTSxNQUFuRixZQUhGO0FBSUUsY0FBVW5CLFFBSlo7QUFLRSxXQUFNO0FBTFIsSUFERjtBQVNELENBM0JNO2tCQTRCUUYsZSIsImZpbGUiOiJkZWxldGUtZGF0YS1tb2RhbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbi8vIE11Y2ggZ2VuZXJpYyBjb21wb25lbnQgdG8gYXNrIGZvciBjb25maXJtYXRpb25cbmNvbnN0IERlbGV0ZURhdGFNb2RhbCA9ICh7dGl0bGUsIHN1YnRpdGxlLCBtZXNzYWdlLCBkZWxldGVBY3Rpb24sIGNhbmNlbEFjdGlvbn0pID0+IHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT0nZGF0YXNldC1tb2RhbCc+XG4gICAgICA8aDI+e3RpdGxlfTwvaDI+XG4gICAgICA8aDQ+e3N1YnRpdGxlfTwvaDQ+XG4gICAgICA8cD57bWVzc2FnZX08L3A+XG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tLWxpbmsgZmxvYXQtLXJpZ2h0XCJcbiAgICAgICAgICAgICAgc3R5bGU9e3tiYWNrZ3JvdW5kQ29sb3I6ICdyZWQnLCBjb2xvcjogJ3doaXRlJ319XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e2RlbGV0ZUFjdGlvbn0+RGVsZXRlPC9idXR0b24+XG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tLWxpbmsgZmxvYXQtLXJpZ2h0XCJcbiAgICAgICAgICAgICAgc3R5bGU9e3ttYXJnaW5SaWdodDogJzEycHgnfX1cbiAgICAgICAgICAgICAgb25DbGljaz17Y2FuY2VsQWN0aW9ufT5DYW5jZWw8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBEZWxldGVEYXRhc2V0TW9kYWwgPSAoe2RhdGFzZXQgPSB7fSwgbGF5ZXJzID0gW10sIGRlbGV0ZUFjdGlvbiwgY2FuY2VsQWN0aW9ufSkgPT4ge1xuICBjb25zdCB7bGFiZWx9ID0gZGF0YXNldDtcbiAgLy8gcmV0cmlldmUgZGF0YXNldCBjb2xvclxuICBjb25zdCBzdWJ0aXRsZSA9IChcbiAgICA8dWwgc3R5bGU9e3tsaXN0U3R5bGVUeXBlczogJ3NxdWFyZSd9fT5cbiAgICAgIDxsaSBzdHlsZT17e2NvbG9yOiBgcmdiKCR7ZGF0YXNldC5jb2xvci5qb2luKCcsJyl9KWB9fT5cbiAgICAgICAgPHNwYW5cbiAgICAgICAgICBjbGFzc05hbWU9XCJkYXRhc2V0LWxhYmVsXCJcbiAgICAgICAgICBzdHlsZT17e2NvbG9yOiAnYmxhY2snfX0+XG4gICAgICAgICAge2xhYmVsfVxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L2xpPlxuICAgIDwvdWw+XG4gICk7XG5cbiAgLy8gcmV0cmlldmUgb25seSBsYXllcnMgcmVsYXRlZCB0byB0aGUgY3VycmVudCBkYXRhc2V0XG4gIGNvbnN0IGN1cnJEYXRhc2V0TGF5ZXJzID0gbGF5ZXJzLmZpbHRlcihsYXllciA9PiBsYXllci5jb25maWcuZGF0YUlkID09PSBkYXRhc2V0LmlkKTtcblxuICByZXR1cm4gKFxuICAgIDxEZWxldGVEYXRhTW9kYWxcbiAgICAgIGNhbmNlbEFjdGlvbj17Y2FuY2VsQWN0aW9ufVxuICAgICAgZGVsZXRlQWN0aW9uPXtkZWxldGVBY3Rpb259XG4gICAgICBtZXNzYWdlPXtgeW91IGFyZSBnb2luZyB0byBkZWxldGUgdGhpcyBkYXRhc2V0LiBJdCB3aWxsIGFmZmVjdCAke2N1cnJEYXRhc2V0TGF5ZXJzLmxlbmd0aH0gbGF5ZXJzYH1cbiAgICAgIHN1YnRpdGxlPXtzdWJ0aXRsZX1cbiAgICAgIHRpdGxlPVwiRGVsZXRlIERhdGFzZXRcIlxuICAgIC8+XG4gICk7XG59O1xuZXhwb3J0IGRlZmF1bHQgRGVsZXRlRGF0YU1vZGFsO1xuIl19
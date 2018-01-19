"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeleteDatasetModal = undefined;

var _react = require("react");

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
    "div",
    { className: "dataset-modal" },
    _react2.default.createElement(
      "h2",
      null,
      title
    ),
    _react2.default.createElement(
      "h4",
      null,
      subtitle
    ),
    _react2.default.createElement(
      "p",
      null,
      message
    ),
    _react2.default.createElement(
      "button",
      {
        className: "btn btn--link float--right",
        style: { backgroundColor: 'red', color: 'white' },
        onClick: deleteAction
      },
      "Delete"
    ),
    _react2.default.createElement(
      "button",
      {
        className: "btn btn--link float--right",
        style: { marginRight: '12px' },
        onClick: cancelAction
      },
      "Cancel"
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
    "ul",
    { style: { listStyleTypes: 'square' } },
    _react2.default.createElement(
      "li",
      { style: { color: "rgb(" + dataset.color.join(',') + ")" } },
      _react2.default.createElement(
        "span",
        { className: "dataset-label", style: { color: 'black' } },
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
    message: "you are going to delete this dataset. It will affect " + currDatasetLayers.length + " layers",
    subtitle: subtitle,
    title: "Delete Dataset"
  });
};
exports.default = DeleteDataModal;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbW9kYWxzL2RlbGV0ZS1kYXRhLW1vZGFsLmpzIl0sIm5hbWVzIjpbIkRlbGV0ZURhdGFNb2RhbCIsInRpdGxlIiwic3VidGl0bGUiLCJtZXNzYWdlIiwiZGVsZXRlQWN0aW9uIiwiY2FuY2VsQWN0aW9uIiwiYmFja2dyb3VuZENvbG9yIiwiY29sb3IiLCJtYXJnaW5SaWdodCIsIkRlbGV0ZURhdGFzZXRNb2RhbCIsImRhdGFzZXQiLCJsYXllcnMiLCJsYWJlbCIsImxpc3RTdHlsZVR5cGVzIiwiam9pbiIsImN1cnJEYXRhc2V0TGF5ZXJzIiwiZmlsdGVyIiwibGF5ZXIiLCJjb25maWciLCJkYXRhSWQiLCJpZCIsImxlbmd0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7Ozs7QUFFQTtBQUNBLElBQU1BLGtCQUFrQixTQUFsQkEsZUFBa0IsT0FNbEI7QUFBQSxNQUxKQyxLQUtJLFFBTEpBLEtBS0k7QUFBQSxNQUpKQyxRQUlJLFFBSkpBLFFBSUk7QUFBQSxNQUhKQyxPQUdJLFFBSEpBLE9BR0k7QUFBQSxNQUZKQyxZQUVJLFFBRkpBLFlBRUk7QUFBQSxNQURKQyxZQUNJLFFBREpBLFlBQ0k7O0FBQ0osU0FDRTtBQUFBO0FBQUEsTUFBSyxXQUFVLGVBQWY7QUFDRTtBQUFBO0FBQUE7QUFBS0o7QUFBTCxLQURGO0FBRUU7QUFBQTtBQUFBO0FBQUtDO0FBQUwsS0FGRjtBQUdFO0FBQUE7QUFBQTtBQUFJQztBQUFKLEtBSEY7QUFJRTtBQUFBO0FBQUE7QUFDRSxtQkFBVSw0QkFEWjtBQUVFLGVBQU8sRUFBQ0csaUJBQWlCLEtBQWxCLEVBQXlCQyxPQUFPLE9BQWhDLEVBRlQ7QUFHRSxpQkFBU0g7QUFIWDtBQUFBO0FBQUEsS0FKRjtBQVdFO0FBQUE7QUFBQTtBQUNFLG1CQUFVLDRCQURaO0FBRUUsZUFBTyxFQUFDSSxhQUFhLE1BQWQsRUFGVDtBQUdFLGlCQUFTSDtBQUhYO0FBQUE7QUFBQTtBQVhGLEdBREY7QUFxQkQsQ0E1QkQ7O0FBOEJPLElBQU1JLGtEQUFxQixTQUFyQkEsa0JBQXFCLFFBSzVCO0FBQUEsNEJBSkpDLE9BSUk7QUFBQSxNQUpKQSxPQUlJLGlDQUpNLEVBSU47QUFBQSwyQkFISkMsTUFHSTtBQUFBLE1BSEpBLE1BR0ksZ0NBSEssRUFHTDtBQUFBLE1BRkpQLFlBRUksU0FGSkEsWUFFSTtBQUFBLE1BREpDLFlBQ0ksU0FESkEsWUFDSTtBQUFBLE1BQ0dPLEtBREgsR0FDWUYsT0FEWixDQUNHRSxLQURIO0FBRUo7O0FBQ0EsTUFBTVYsV0FDSjtBQUFBO0FBQUEsTUFBSSxPQUFPLEVBQUNXLGdCQUFnQixRQUFqQixFQUFYO0FBQ0U7QUFBQTtBQUFBLFFBQUksT0FBTyxFQUFDTixnQkFBY0csUUFBUUgsS0FBUixDQUFjTyxJQUFkLENBQW1CLEdBQW5CLENBQWQsTUFBRCxFQUFYO0FBQ0U7QUFBQTtBQUFBLFVBQU0sV0FBVSxlQUFoQixFQUFnQyxPQUFPLEVBQUNQLE9BQU8sT0FBUixFQUF2QztBQUNHSztBQURIO0FBREY7QUFERixHQURGOztBQVVBO0FBQ0EsTUFBTUcsb0JBQW9CSixPQUFPSyxNQUFQLENBQ3hCO0FBQUEsV0FBU0MsTUFBTUMsTUFBTixDQUFhQyxNQUFiLEtBQXdCVCxRQUFRVSxFQUF6QztBQUFBLEdBRHdCLENBQTFCOztBQUlBLFNBQ0UsOEJBQUMsZUFBRDtBQUNFLGtCQUFjZixZQURoQjtBQUVFLGtCQUFjRCxZQUZoQjtBQUdFLHVFQUNFVyxrQkFBa0JNLE1BRHBCLFlBSEY7QUFNRSxjQUFVbkIsUUFOWjtBQU9FLFdBQU07QUFQUixJQURGO0FBV0QsQ0FsQ007a0JBbUNRRixlIiwiZmlsZSI6ImRlbGV0ZS1kYXRhLW1vZGFsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuLy8gTXVjaCBnZW5lcmljIGNvbXBvbmVudCB0byBhc2sgZm9yIGNvbmZpcm1hdGlvblxuY29uc3QgRGVsZXRlRGF0YU1vZGFsID0gKHtcbiAgdGl0bGUsXG4gIHN1YnRpdGxlLFxuICBtZXNzYWdlLFxuICBkZWxldGVBY3Rpb24sXG4gIGNhbmNlbEFjdGlvblxufSkgPT4ge1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZGF0YXNldC1tb2RhbFwiPlxuICAgICAgPGgyPnt0aXRsZX08L2gyPlxuICAgICAgPGg0PntzdWJ0aXRsZX08L2g0PlxuICAgICAgPHA+e21lc3NhZ2V9PC9wPlxuICAgICAgPGJ1dHRvblxuICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLS1saW5rIGZsb2F0LS1yaWdodFwiXG4gICAgICAgIHN0eWxlPXt7YmFja2dyb3VuZENvbG9yOiAncmVkJywgY29sb3I6ICd3aGl0ZSd9fVxuICAgICAgICBvbkNsaWNrPXtkZWxldGVBY3Rpb259XG4gICAgICA+XG4gICAgICAgIERlbGV0ZVxuICAgICAgPC9idXR0b24+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tLWxpbmsgZmxvYXQtLXJpZ2h0XCJcbiAgICAgICAgc3R5bGU9e3ttYXJnaW5SaWdodDogJzEycHgnfX1cbiAgICAgICAgb25DbGljaz17Y2FuY2VsQWN0aW9ufVxuICAgICAgPlxuICAgICAgICBDYW5jZWxcbiAgICAgIDwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IERlbGV0ZURhdGFzZXRNb2RhbCA9ICh7XG4gIGRhdGFzZXQgPSB7fSxcbiAgbGF5ZXJzID0gW10sXG4gIGRlbGV0ZUFjdGlvbixcbiAgY2FuY2VsQWN0aW9uXG59KSA9PiB7XG4gIGNvbnN0IHtsYWJlbH0gPSBkYXRhc2V0O1xuICAvLyByZXRyaWV2ZSBkYXRhc2V0IGNvbG9yXG4gIGNvbnN0IHN1YnRpdGxlID0gKFxuICAgIDx1bCBzdHlsZT17e2xpc3RTdHlsZVR5cGVzOiAnc3F1YXJlJ319PlxuICAgICAgPGxpIHN0eWxlPXt7Y29sb3I6IGByZ2IoJHtkYXRhc2V0LmNvbG9yLmpvaW4oJywnKX0pYH19PlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJkYXRhc2V0LWxhYmVsXCIgc3R5bGU9e3tjb2xvcjogJ2JsYWNrJ319PlxuICAgICAgICAgIHtsYWJlbH1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuICApO1xuXG4gIC8vIHJldHJpZXZlIG9ubHkgbGF5ZXJzIHJlbGF0ZWQgdG8gdGhlIGN1cnJlbnQgZGF0YXNldFxuICBjb25zdCBjdXJyRGF0YXNldExheWVycyA9IGxheWVycy5maWx0ZXIoXG4gICAgbGF5ZXIgPT4gbGF5ZXIuY29uZmlnLmRhdGFJZCA9PT0gZGF0YXNldC5pZFxuICApO1xuXG4gIHJldHVybiAoXG4gICAgPERlbGV0ZURhdGFNb2RhbFxuICAgICAgY2FuY2VsQWN0aW9uPXtjYW5jZWxBY3Rpb259XG4gICAgICBkZWxldGVBY3Rpb249e2RlbGV0ZUFjdGlvbn1cbiAgICAgIG1lc3NhZ2U9e2B5b3UgYXJlIGdvaW5nIHRvIGRlbGV0ZSB0aGlzIGRhdGFzZXQuIEl0IHdpbGwgYWZmZWN0ICR7XG4gICAgICAgIGN1cnJEYXRhc2V0TGF5ZXJzLmxlbmd0aFxuICAgICAgfSBsYXllcnNgfVxuICAgICAgc3VidGl0bGU9e3N1YnRpdGxlfVxuICAgICAgdGl0bGU9XCJEZWxldGUgRGF0YXNldFwiXG4gICAgLz5cbiAgKTtcbn07XG5leHBvcnQgZGVmYXVsdCBEZWxldGVEYXRhTW9kYWw7XG4iXX0=
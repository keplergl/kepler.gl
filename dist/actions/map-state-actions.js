'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleFullScreen = exports.toggleSplitMap = exports.togglePerspective = exports.fitBounds = exports.updateMap = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _reduxActions = require('redux-actions');

var _actionTypes = require('../constants/action-types');

var _actionTypes2 = _interopRequireDefault(_actionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// second argument of createAction is expected
// to be payloadCreator or undefined
var _map = [_actionTypes2.default.TOGGLE_PERSPECTIVE, _actionTypes2.default.FIT_BOUNDS, _actionTypes2.default.UPDATE_MAP, _actionTypes2.default.TOGGLE_SPLIT_MAP, _actionTypes2.default.TOGGLE_FULLSCREEN].map(function (action) {
  return (0, _reduxActions.createAction)(action);
}),
    _map2 = (0, _slicedToArray3.default)(_map, 5),
    togglePerspective = _map2[0],
    fitBounds = _map2[1],
    updateMap = _map2[2],
    toggleSplitMap = _map2[3],
    toggleFullScreen = _map2[4];

exports.updateMap = updateMap;
exports.fitBounds = fitBounds;
exports.togglePerspective = togglePerspective;
exports.toggleSplitMap = toggleSplitMap;
exports.toggleFullScreen = toggleFullScreen;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL21hcC1zdGF0ZS1hY3Rpb25zLmpzIl0sIm5hbWVzIjpbIlRPR0dMRV9QRVJTUEVDVElWRSIsIkZJVF9CT1VORFMiLCJVUERBVEVfTUFQIiwiVE9HR0xFX1NQTElUX01BUCIsIlRPR0dMRV9GVUxMU0NSRUVOIiwibWFwIiwiYWN0aW9uIiwidG9nZ2xlUGVyc3BlY3RpdmUiLCJmaXRCb3VuZHMiLCJ1cGRhdGVNYXAiLCJ0b2dnbGVTcGxpdE1hcCIsInRvZ2dsZUZ1bGxTY3JlZW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7OztBQUVBO0FBQ0E7V0FPSSxDQUNGLHNCQUFZQSxrQkFEVixFQUVGLHNCQUFZQyxVQUZWLEVBR0Ysc0JBQVlDLFVBSFYsRUFJRixzQkFBWUMsZ0JBSlYsRUFLRixzQkFBWUMsaUJBTFYsRUFNRkMsR0FORSxDQU1FO0FBQUEsU0FBVSxnQ0FBYUMsTUFBYixDQUFWO0FBQUEsQ0FORixDOztJQUxGQyxpQjtJQUNBQyxTO0lBQ0FDLFM7SUFDQUMsYztJQUNBQyxnQjs7UUFVQUYsUyxHQUFBQSxTO1FBQ0FELFMsR0FBQUEsUztRQUNBRCxpQixHQUFBQSxpQjtRQUNBRyxjLEdBQUFBLGM7UUFDQUMsZ0IsR0FBQUEsZ0IiLCJmaWxlIjoibWFwLXN0YXRlLWFjdGlvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2NyZWF0ZUFjdGlvbn0gZnJvbSAncmVkdXgtYWN0aW9ucyc7XG5pbXBvcnQgQWN0aW9uVHlwZXMgZnJvbSAnLi4vY29uc3RhbnRzL2FjdGlvbi10eXBlcyc7XG5cbi8vIHNlY29uZCBhcmd1bWVudCBvZiBjcmVhdGVBY3Rpb24gaXMgZXhwZWN0ZWRcbi8vIHRvIGJlIHBheWxvYWRDcmVhdG9yIG9yIHVuZGVmaW5lZFxuY29uc3QgW1xuICB0b2dnbGVQZXJzcGVjdGl2ZSxcbiAgZml0Qm91bmRzLFxuICB1cGRhdGVNYXAsXG4gIHRvZ2dsZVNwbGl0TWFwLFxuICB0b2dnbGVGdWxsU2NyZWVuXG5dID0gW1xuICBBY3Rpb25UeXBlcy5UT0dHTEVfUEVSU1BFQ1RJVkUsXG4gIEFjdGlvblR5cGVzLkZJVF9CT1VORFMsXG4gIEFjdGlvblR5cGVzLlVQREFURV9NQVAsXG4gIEFjdGlvblR5cGVzLlRPR0dMRV9TUExJVF9NQVAsXG4gIEFjdGlvblR5cGVzLlRPR0dMRV9GVUxMU0NSRUVOXG5dLm1hcChhY3Rpb24gPT4gY3JlYXRlQWN0aW9uKGFjdGlvbikpO1xuXG5leHBvcnQge1xuICB1cGRhdGVNYXAsXG4gIGZpdEJvdW5kcyxcbiAgdG9nZ2xlUGVyc3BlY3RpdmUsXG4gIHRvZ2dsZVNwbGl0TWFwLFxuICB0b2dnbGVGdWxsU2NyZWVuXG59O1xuIl19
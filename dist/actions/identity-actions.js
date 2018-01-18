'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteEntry = exports.registerEntry = exports.DELETE_ENTRY = exports.REGISTER_ENTRY = undefined;

var _reduxActions = require('redux-actions');

var _defaultSettings = require('../constants/default-settings');

// Actions to add and remove entries
var REGISTER_ENTRY = exports.REGISTER_ENTRY = _defaultSettings.ACTION_PREFIX + 'REGISTER_ENTRY';
var DELETE_ENTRY = exports.DELETE_ENTRY = _defaultSettings.ACTION_PREFIX + 'DELETE_ENTRY';

var _map = [REGISTER_ENTRY, DELETE_ENTRY].map(function (a) {
  return (0, _reduxActions.createAction)(a);
});

var registerEntry = _map[0],
    deleteEntry = _map[1];
exports.registerEntry = registerEntry;
exports.deleteEntry = deleteEntry;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL2lkZW50aXR5LWFjdGlvbnMuanMiXSwibmFtZXMiOlsiUkVHSVNURVJfRU5UUlkiLCJERUxFVEVfRU5UUlkiLCJtYXAiLCJhIiwicmVnaXN0ZXJFbnRyeSIsImRlbGV0ZUVudHJ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7QUFDTyxJQUFNQSwyRkFBTjtBQUNBLElBQU1DLHFGQUFOOztXQUtILENBQ0ZELGNBREUsRUFFRkMsWUFGRSxFQUdGQyxHQUhFLENBR0U7QUFBQSxTQUFLLGdDQUFhQyxDQUFiLENBQUw7QUFBQSxDQUhGLEM7O0lBRkZDLGE7SUFDQUMsVyIsImZpbGUiOiJpZGVudGl0eS1hY3Rpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtjcmVhdGVBY3Rpb259IGZyb20gJ3JlZHV4LWFjdGlvbnMnO1xuaW1wb3J0IHtBQ1RJT05fUFJFRklYfSBmcm9tICcuLi9jb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbi8vIEFjdGlvbnMgdG8gYWRkIGFuZCByZW1vdmUgZW50cmllc1xuZXhwb3J0IGNvbnN0IFJFR0lTVEVSX0VOVFJZID0gYCR7QUNUSU9OX1BSRUZJWH1SRUdJU1RFUl9FTlRSWWA7XG5leHBvcnQgY29uc3QgREVMRVRFX0VOVFJZID0gYCR7QUNUSU9OX1BSRUZJWH1ERUxFVEVfRU5UUllgO1xuXG5leHBvcnQgY29uc3QgW1xuICByZWdpc3RlckVudHJ5LFxuICBkZWxldGVFbnRyeVxuXSA9IFtcbiAgUkVHSVNURVJfRU5UUlksXG4gIERFTEVURV9FTlRSWVxuXS5tYXAoYSA9PiBjcmVhdGVBY3Rpb24oYSkpO1xuIl19
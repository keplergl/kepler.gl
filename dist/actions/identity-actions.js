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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL2lkZW50aXR5LWFjdGlvbnMuanMiXSwibmFtZXMiOlsiUkVHSVNURVJfRU5UUlkiLCJERUxFVEVfRU5UUlkiLCJtYXAiLCJhIiwicmVnaXN0ZXJFbnRyeSIsImRlbGV0ZUVudHJ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7QUFDTyxJQUFNQSwyRkFBTjtBQUNBLElBQU1DLHFGQUFOOztXQUVxQyxDQUFDRCxjQUFELEVBQWlCQyxZQUFqQixFQUErQkMsR0FBL0IsQ0FDMUM7QUFBQSxTQUFLLGdDQUFhQyxDQUFiLENBQUw7QUFBQSxDQUQwQyxDOztJQUE5QkMsYTtJQUFlQyxXIiwiZmlsZSI6ImlkZW50aXR5LWFjdGlvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2NyZWF0ZUFjdGlvbn0gZnJvbSAncmVkdXgtYWN0aW9ucyc7XG5pbXBvcnQge0FDVElPTl9QUkVGSVh9IGZyb20gJy4uL2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuLy8gQWN0aW9ucyB0byBhZGQgYW5kIHJlbW92ZSBlbnRyaWVzXG5leHBvcnQgY29uc3QgUkVHSVNURVJfRU5UUlkgPSBgJHtBQ1RJT05fUFJFRklYfVJFR0lTVEVSX0VOVFJZYDtcbmV4cG9ydCBjb25zdCBERUxFVEVfRU5UUlkgPSBgJHtBQ1RJT05fUFJFRklYfURFTEVURV9FTlRSWWA7XG5cbmV4cG9ydCBjb25zdCBbcmVnaXN0ZXJFbnRyeSwgZGVsZXRlRW50cnldID0gW1JFR0lTVEVSX0VOVFJZLCBERUxFVEVfRU5UUlldLm1hcChcbiAgYSA9PiBjcmVhdGVBY3Rpb24oYSlcbik7XG4iXX0=
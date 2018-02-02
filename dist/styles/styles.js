'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _popoverPin;

var COLORS = exports.COLORS = {
  'uber-blue': '#11939A',
  'uber-black-40': '#939393',
  'uber-black-95': '#1C1B1B',
  'uber-yellow-20': '#FEFAE7',
  'uber-yellow': '#ECAB20',
  'uber-orange': '#CA3B27',
  'uber-orange-20': '#FEEFEB'
};

var mapPopover = exports.mapPopover = {
  fontSize: '11px',
  fontWeight: 500,
  backgroundColor: 'white',
  zIndex: 1001,
  position: 'absolute',
  padding: '12px 12px 12px 12px',
  ' .gutter': {
    height: '18px'
  },
  overflowX: 'scroll',

  ' .popover-pin': (_popoverPin = {
    position: 'absolute',
    left: '50%',
    marginLeft: '8px',
    transform: 'rotate(30deg)',
    top: '10px'
  }, _popoverPin[' path'] = {
    fill: '#CA3B27'
  }, _popoverPin[' :hover'] = {
    cursor: 'pointer'
  }, _popoverPin[' :hover path'] = {
    fill: COLORS['uber-orange-20']
  }, _popoverPin),
  ' .popover-table': {
    marginBottom: 0,

    td: {
      color: COLORS['uber-black-95']
    }
  },

  ' .popover-table tbody': {
    border: 0
  },

  ' .popover-table th, .popover-table td, .popover-table th, .popover-table td': {
    padding: '3px 6px'
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHlsZXMvc3R5bGVzLmpzIl0sIm5hbWVzIjpbIkNPTE9SUyIsIm1hcFBvcG92ZXIiLCJmb250U2l6ZSIsImZvbnRXZWlnaHQiLCJiYWNrZ3JvdW5kQ29sb3IiLCJ6SW5kZXgiLCJwb3NpdGlvbiIsInBhZGRpbmciLCJoZWlnaHQiLCJvdmVyZmxvd1giLCJsZWZ0IiwibWFyZ2luTGVmdCIsInRyYW5zZm9ybSIsInRvcCIsImZpbGwiLCJjdXJzb3IiLCJtYXJnaW5Cb3R0b20iLCJ0ZCIsImNvbG9yIiwiYm9yZGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFPLElBQU1BLDBCQUFTO0FBQ3BCLGVBQWEsU0FETztBQUVwQixtQkFBaUIsU0FGRztBQUdwQixtQkFBaUIsU0FIRztBQUlwQixvQkFBa0IsU0FKRTtBQUtwQixpQkFBZSxTQUxLO0FBTXBCLGlCQUFlLFNBTks7QUFPcEIsb0JBQWtCO0FBUEUsQ0FBZjs7QUFVQSxJQUFNQyxrQ0FBYTtBQUN4QkMsWUFBVSxNQURjO0FBRXhCQyxjQUFZLEdBRlk7QUFHeEJDLG1CQUFpQixPQUhPO0FBSXhCQyxVQUFRLElBSmdCO0FBS3hCQyxZQUFVLFVBTGM7QUFNeEJDLFdBQVMscUJBTmU7QUFPeEIsY0FBWTtBQUNWQyxZQUFRO0FBREUsR0FQWTtBQVV4QkMsYUFBVyxRQVZhOztBQVl4QjtBQUNFSCxjQUFVLFVBRFo7QUFFRUksVUFBTSxLQUZSO0FBR0VDLGdCQUFZLEtBSGQ7QUFJRUMsZUFBVyxlQUpiO0FBS0VDLFNBQUs7QUFMUCxpQkFNRyxPQU5ILElBTWE7QUFDVEMsVUFBTTtBQURHLEdBTmIsY0FTRSxTQVRGLElBU2E7QUFDVEMsWUFBUTtBQURDLEdBVGIsY0FhRSxjQWJGLElBYWtCO0FBQ2RELFVBQU1kLE9BQU8sZ0JBQVA7QUFEUSxHQWJsQixjQVp3QjtBQTZCeEIscUJBQW1CO0FBQ2pCZ0Isa0JBQWMsQ0FERzs7QUFHakJDLFFBQUk7QUFDRkMsYUFBT2xCLE9BQU8sZUFBUDtBQURMO0FBSGEsR0E3Qks7O0FBcUN4QiwyQkFBeUI7QUFDdkJtQixZQUFRO0FBRGUsR0FyQ0Q7O0FBeUN4QixpRkFBK0U7QUFDN0VaLGFBQVM7QUFEb0U7QUF6Q3ZELENBQW5CIiwiZmlsZSI6InN0eWxlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBDT0xPUlMgPSB7XG4gICd1YmVyLWJsdWUnOiAnIzExOTM5QScsXG4gICd1YmVyLWJsYWNrLTQwJzogJyM5MzkzOTMnLFxuICAndWJlci1ibGFjay05NSc6ICcjMUMxQjFCJyxcbiAgJ3ViZXIteWVsbG93LTIwJzogJyNGRUZBRTcnLFxuICAndWJlci15ZWxsb3cnOiAnI0VDQUIyMCcsXG4gICd1YmVyLW9yYW5nZSc6ICcjQ0EzQjI3JyxcbiAgJ3ViZXItb3JhbmdlLTIwJzogJyNGRUVGRUInXG59O1xuXG5leHBvcnQgY29uc3QgbWFwUG9wb3ZlciA9IHtcbiAgZm9udFNpemU6ICcxMXB4JyxcbiAgZm9udFdlaWdodDogNTAwLFxuICBiYWNrZ3JvdW5kQ29sb3I6ICd3aGl0ZScsXG4gIHpJbmRleDogMTAwMSxcbiAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gIHBhZGRpbmc6ICcxMnB4IDEycHggMTJweCAxMnB4JyxcbiAgJyAuZ3V0dGVyJzoge1xuICAgIGhlaWdodDogJzE4cHgnXG4gIH0sXG4gIG92ZXJmbG93WDogJ3Njcm9sbCcsXG5cbiAgJyAucG9wb3Zlci1waW4nOiB7XG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgbGVmdDogJzUwJScsXG4gICAgbWFyZ2luTGVmdDogJzhweCcsXG4gICAgdHJhbnNmb3JtOiAncm90YXRlKDMwZGVnKScsXG4gICAgdG9wOiAnMTBweCcsXG4gICAgWycgcGF0aCddOiB7XG4gICAgICBmaWxsOiAnI0NBM0IyNydcbiAgICB9LFxuICAgICcgOmhvdmVyJzoge1xuICAgICAgY3Vyc29yOiAncG9pbnRlcidcbiAgICB9LFxuXG4gICAgJyA6aG92ZXIgcGF0aCc6IHtcbiAgICAgIGZpbGw6IENPTE9SU1sndWJlci1vcmFuZ2UtMjAnXVxuICAgIH1cbiAgfSxcbiAgJyAucG9wb3Zlci10YWJsZSc6IHtcbiAgICBtYXJnaW5Cb3R0b206IDAsXG5cbiAgICB0ZDoge1xuICAgICAgY29sb3I6IENPTE9SU1sndWJlci1ibGFjay05NSddXG4gICAgfVxuICB9LFxuXG4gICcgLnBvcG92ZXItdGFibGUgdGJvZHknOiB7XG4gICAgYm9yZGVyOiAwXG4gIH0sXG5cbiAgJyAucG9wb3Zlci10YWJsZSB0aCwgLnBvcG92ZXItdGFibGUgdGQsIC5wb3BvdmVyLXRhYmxlIHRoLCAucG9wb3Zlci10YWJsZSB0ZCc6IHtcbiAgICBwYWRkaW5nOiAnM3B4IDZweCdcbiAgfVxufTtcbiJdfQ==
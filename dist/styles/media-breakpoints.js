"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.media = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _styledComponents = require("styled-components");

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n    @media (min-width: ", "px) {\n      ", ";\n    }\n  "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n    @media (max-width: ", "px) {\n      ", ";\n    }\n  "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n    @media (max-width: ", "px) {\n      ", ";\n    }\n  "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

// These are useful for test or when theme doesn't define them
var breakPoints = {
  palm: 588,
  desk: 768
};
var media = {
  palm: function palm() {
    return (0, _styledComponents.css)(_templateObject(), function (props) {
      return (props.theme.breakPoints || breakPoints).palm;
    }, _styledComponents.css.apply(void 0, arguments));
  },
  portable: function portable() {
    return (0, _styledComponents.css)(_templateObject2(), function (props) {
      return (props.theme.breakPoints || breakPoints).desk;
    }, _styledComponents.css.apply(void 0, arguments));
  },
  desk: function desk() {
    return (0, _styledComponents.css)(_templateObject3(), function (props) {
      return (props.theme.breakPoints || breakPoints).desk + 1;
    }, _styledComponents.css.apply(void 0, arguments));
  }
};
exports.media = media;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHlsZXMvbWVkaWEtYnJlYWtwb2ludHMuanMiXSwibmFtZXMiOlsiYnJlYWtQb2ludHMiLCJwYWxtIiwiZGVzayIsIm1lZGlhIiwiY3NzIiwicHJvcHMiLCJ0aGVtZSIsInBvcnRhYmxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQW9CQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTtBQUNBLElBQU1BLFdBQVcsR0FBRztBQUNsQkMsRUFBQUEsSUFBSSxFQUFFLEdBRFk7QUFFbEJDLEVBQUFBLElBQUksRUFBRTtBQUZZLENBQXBCO0FBS08sSUFBTUMsS0FBSyxHQUFHO0FBQ25CRixFQUFBQSxJQUFJLEVBQUU7QUFBQSxlQUFhRyxxQkFBYixxQkFDaUIsVUFBQUMsS0FBSztBQUFBLGFBQUksQ0FBQ0EsS0FBSyxDQUFDQyxLQUFOLENBQVlOLFdBQVosSUFBMkJBLFdBQTVCLEVBQXlDQyxJQUE3QztBQUFBLEtBRHRCLEVBRUFHLDhDQUZBO0FBQUEsR0FEYTtBQU9uQkcsRUFBQUEsUUFBUSxFQUFFO0FBQUEsZUFBYUgscUJBQWIsc0JBQ2EsVUFBQUMsS0FBSztBQUFBLGFBQUksQ0FBQ0EsS0FBSyxDQUFDQyxLQUFOLENBQVlOLFdBQVosSUFBMkJBLFdBQTVCLEVBQXlDRSxJQUE3QztBQUFBLEtBRGxCLEVBRUpFLDhDQUZJO0FBQUEsR0FQUztBQWFuQkYsRUFBQUEsSUFBSSxFQUFFO0FBQUEsZUFBYUUscUJBQWIsc0JBQ2lCLFVBQUFDLEtBQUs7QUFBQSxhQUFJLENBQUNBLEtBQUssQ0FBQ0MsS0FBTixDQUFZTixXQUFaLElBQTJCQSxXQUE1QixFQUF5Q0UsSUFBekMsR0FBZ0QsQ0FBcEQ7QUFBQSxLQUR0QixFQUVBRSw4Q0FGQTtBQUFBO0FBYmEsQ0FBZCIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCB7Y3NzfSBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5cbi8vIFRoZXNlIGFyZSB1c2VmdWwgZm9yIHRlc3Qgb3Igd2hlbiB0aGVtZSBkb2Vzbid0IGRlZmluZSB0aGVtXG5jb25zdCBicmVha1BvaW50cyA9IHtcbiAgcGFsbTogNTg4LFxuICBkZXNrOiA3Njhcbn07XG5cbmV4cG9ydCBjb25zdCBtZWRpYSA9IHtcbiAgcGFsbTogKC4uLmFyZ3MpID0+IGNzc2BcbiAgICBAbWVkaWEgKG1heC13aWR0aDogJHtwcm9wcyA9PiAocHJvcHMudGhlbWUuYnJlYWtQb2ludHMgfHwgYnJlYWtQb2ludHMpLnBhbG19cHgpIHtcbiAgICAgICR7Y3NzKC4uLmFyZ3MpfTtcbiAgICB9XG4gIGAsXG5cbiAgcG9ydGFibGU6ICguLi5hcmdzKSA9PiBjc3NgXG4gICAgQG1lZGlhIChtYXgtd2lkdGg6ICR7cHJvcHMgPT4gKHByb3BzLnRoZW1lLmJyZWFrUG9pbnRzIHx8IGJyZWFrUG9pbnRzKS5kZXNrfXB4KSB7XG4gICAgICAke2NzcyguLi5hcmdzKX07XG4gICAgfVxuICBgLFxuXG4gIGRlc2s6ICguLi5hcmdzKSA9PiBjc3NgXG4gICAgQG1lZGlhIChtaW4td2lkdGg6ICR7cHJvcHMgPT4gKHByb3BzLnRoZW1lLmJyZWFrUG9pbnRzIHx8IGJyZWFrUG9pbnRzKS5kZXNrICsgMX1weCkge1xuICAgICAgJHtjc3MoLi4uYXJncyl9O1xuICAgIH1cbiAgYFxufTtcbiJdfQ==
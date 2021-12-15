"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.media = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _styledComponents = require("styled-components");

var _templateObject, _templateObject2, _templateObject3;

// These are useful for test or when theme doesn't define them
var breakPoints = {
  palm: 588,
  desk: 768
};
var media = {
  palm: function palm() {
    return (0, _styledComponents.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n    @media (max-width: ", "px) {\n      ", ";\n    }\n  "])), function (props) {
      return (props.theme.breakPoints || breakPoints).palm;
    }, _styledComponents.css.apply(void 0, arguments));
  },
  portable: function portable() {
    return (0, _styledComponents.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n    @media (max-width: ", "px) {\n      ", ";\n    }\n  "])), function (props) {
      return (props.theme.breakPoints || breakPoints).desk;
    }, _styledComponents.css.apply(void 0, arguments));
  },
  desk: function desk() {
    return (0, _styledComponents.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n    @media (min-width: ", "px) {\n      ", ";\n    }\n  "])), function (props) {
      return (props.theme.breakPoints || breakPoints).desk + 1;
    }, _styledComponents.css.apply(void 0, arguments));
  }
};
exports.media = media;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHlsZXMvbWVkaWEtYnJlYWtwb2ludHMuanMiXSwibmFtZXMiOlsiYnJlYWtQb2ludHMiLCJwYWxtIiwiZGVzayIsIm1lZGlhIiwiY3NzIiwicHJvcHMiLCJ0aGVtZSIsInBvcnRhYmxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQW9CQTs7OztBQUVBO0FBQ0EsSUFBTUEsV0FBVyxHQUFHO0FBQ2xCQyxFQUFBQSxJQUFJLEVBQUUsR0FEWTtBQUVsQkMsRUFBQUEsSUFBSSxFQUFFO0FBRlksQ0FBcEI7QUFLTyxJQUFNQyxLQUFLLEdBQUc7QUFDbkJGLEVBQUFBLElBQUksRUFBRTtBQUFBLGVBQWFHLHFCQUFiLGtKQUNpQixVQUFBQyxLQUFLO0FBQUEsYUFBSSxDQUFDQSxLQUFLLENBQUNDLEtBQU4sQ0FBWU4sV0FBWixJQUEyQkEsV0FBNUIsRUFBeUNDLElBQTdDO0FBQUEsS0FEdEIsRUFFQUcsOENBRkE7QUFBQSxHQURhO0FBT25CRyxFQUFBQSxRQUFRLEVBQUU7QUFBQSxlQUFhSCxxQkFBYixvSkFDYSxVQUFBQyxLQUFLO0FBQUEsYUFBSSxDQUFDQSxLQUFLLENBQUNDLEtBQU4sQ0FBWU4sV0FBWixJQUEyQkEsV0FBNUIsRUFBeUNFLElBQTdDO0FBQUEsS0FEbEIsRUFFSkUsOENBRkk7QUFBQSxHQVBTO0FBYW5CRixFQUFBQSxJQUFJLEVBQUU7QUFBQSxlQUFhRSxxQkFBYixvSkFDaUIsVUFBQUMsS0FBSztBQUFBLGFBQUksQ0FBQ0EsS0FBSyxDQUFDQyxLQUFOLENBQVlOLFdBQVosSUFBMkJBLFdBQTVCLEVBQXlDRSxJQUF6QyxHQUFnRCxDQUFwRDtBQUFBLEtBRHRCLEVBRUFFLDhDQUZBO0FBQUE7QUFiYSxDQUFkIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHtjc3N9IGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcblxuLy8gVGhlc2UgYXJlIHVzZWZ1bCBmb3IgdGVzdCBvciB3aGVuIHRoZW1lIGRvZXNuJ3QgZGVmaW5lIHRoZW1cbmNvbnN0IGJyZWFrUG9pbnRzID0ge1xuICBwYWxtOiA1ODgsXG4gIGRlc2s6IDc2OFxufTtcblxuZXhwb3J0IGNvbnN0IG1lZGlhID0ge1xuICBwYWxtOiAoLi4uYXJncykgPT4gY3NzYFxuICAgIEBtZWRpYSAobWF4LXdpZHRoOiAke3Byb3BzID0+IChwcm9wcy50aGVtZS5icmVha1BvaW50cyB8fCBicmVha1BvaW50cykucGFsbX1weCkge1xuICAgICAgJHtjc3MoLi4uYXJncyl9O1xuICAgIH1cbiAgYCxcblxuICBwb3J0YWJsZTogKC4uLmFyZ3MpID0+IGNzc2BcbiAgICBAbWVkaWEgKG1heC13aWR0aDogJHtwcm9wcyA9PiAocHJvcHMudGhlbWUuYnJlYWtQb2ludHMgfHwgYnJlYWtQb2ludHMpLmRlc2t9cHgpIHtcbiAgICAgICR7Y3NzKC4uLmFyZ3MpfTtcbiAgICB9XG4gIGAsXG5cbiAgZGVzazogKC4uLmFyZ3MpID0+IGNzc2BcbiAgICBAbWVkaWEgKG1pbi13aWR0aDogJHtwcm9wcyA9PiAocHJvcHMudGhlbWUuYnJlYWtQb2ludHMgfHwgYnJlYWtQb2ludHMpLmRlc2sgKyAxfXB4KSB7XG4gICAgICAke2NzcyguLi5hcmdzKX07XG4gICAgfVxuICBgXG59O1xuIl19
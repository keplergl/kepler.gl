"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = _interopRequireDefault(require("lodash.get"));

var _defaultSettings = require("../../constants/default-settings");

// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/**
 * A wrapper component in modals contain a image preview of the map with cloud providers
 * It sets export image size based on provider thumbnail size
 * @component
 */
var ImageModalContainer =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(ImageModalContainer, _Component);

  function ImageModalContainer() {
    (0, _classCallCheck2["default"])(this, ImageModalContainer);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ImageModalContainer).apply(this, arguments));
  }

  (0, _createClass2["default"])(ImageModalContainer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this._updateThumbSize(true);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      // set thumbnail size if provider changes
      if (this.props.currentProvider !== prevProps.currentProvider && this.props.currentProvider) {
        this._updateThumbSize();
      }
    }
  }, {
    key: "_updateThumbSize",
    value: function _updateThumbSize(initialMount) {
      var _this = this;

      if (this.props.currentProvider && this.props.cloudProviders.length) {
        var provider = this.props.cloudProviders.find(function (p) {
          return p.name === _this.props.currentProvider;
        });

        if (provider && provider.thumbnail) {
          this.props.onUpdateImageSetting({
            mapW: (0, _lodash["default"])(provider, ['thumbnail', 'width']) || _defaultSettings.MAP_THUMBNAIL_DIMENSION.width,
            mapH: (0, _lodash["default"])(provider, ['thumbnail', 'height']) || _defaultSettings.MAP_THUMBNAIL_DIMENSION.height,
            ratio: _defaultSettings.EXPORT_IMG_RATIOS.CUSTOM,
            legend: false
          });
        }
      } else if (initialMount) {
        this.props.onUpdateImageSetting({
          mapW: _defaultSettings.MAP_THUMBNAIL_DIMENSION.width,
          mapH: _defaultSettings.MAP_THUMBNAIL_DIMENSION.height,
          ratio: _defaultSettings.EXPORT_IMG_RATIOS.CUSTOM
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      return _react["default"].createElement(_react["default"].Fragment, null, this.props.children);
    }
  }]);
  return ImageModalContainer;
}(_react.Component);

exports["default"] = ImageModalContainer;
(0, _defineProperty2["default"])(ImageModalContainer, "propTypes", {
  onUpdateImageSetting: _propTypes["default"].func.isRequired,
  cloudProviders: _propTypes["default"].arrayOf(_propTypes["default"].object),
  currentProvider: _propTypes["default"].string
});
(0, _defineProperty2["default"])(ImageModalContainer, "defaultProps", {
  cloudProviders: [],
  currentProvider: null
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9pbWFnZS1tb2RhbC1jb250YWluZXIuanMiXSwibmFtZXMiOlsiSW1hZ2VNb2RhbENvbnRhaW5lciIsIl91cGRhdGVUaHVtYlNpemUiLCJwcmV2UHJvcHMiLCJwcm9wcyIsImN1cnJlbnRQcm92aWRlciIsImluaXRpYWxNb3VudCIsImNsb3VkUHJvdmlkZXJzIiwibGVuZ3RoIiwicHJvdmlkZXIiLCJmaW5kIiwicCIsIm5hbWUiLCJ0aHVtYm5haWwiLCJvblVwZGF0ZUltYWdlU2V0dGluZyIsIm1hcFciLCJNQVBfVEhVTUJOQUlMX0RJTUVOU0lPTiIsIndpZHRoIiwibWFwSCIsImhlaWdodCIsInJhdGlvIiwiRVhQT1JUX0lNR19SQVRJT1MiLCJDVVNUT00iLCJsZWdlbmQiLCJjaGlsZHJlbiIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsImZ1bmMiLCJpc1JlcXVpcmVkIiwiYXJyYXlPZiIsIm9iamVjdCIsInN0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQVFBOzs7OztJQUtxQkEsbUI7Ozs7Ozs7Ozs7Ozt3Q0FZQztBQUNsQixXQUFLQyxnQkFBTCxDQUFzQixJQUF0QjtBQUNEOzs7dUNBRWtCQyxTLEVBQVc7QUFDNUI7QUFDQSxVQUFJLEtBQUtDLEtBQUwsQ0FBV0MsZUFBWCxLQUErQkYsU0FBUyxDQUFDRSxlQUF6QyxJQUE0RCxLQUFLRCxLQUFMLENBQVdDLGVBQTNFLEVBQTRGO0FBQzFGLGFBQUtILGdCQUFMO0FBQ0Q7QUFDRjs7O3FDQUVnQkksWSxFQUFjO0FBQUE7O0FBQzdCLFVBQUksS0FBS0YsS0FBTCxDQUFXQyxlQUFYLElBQThCLEtBQUtELEtBQUwsQ0FBV0csY0FBWCxDQUEwQkMsTUFBNUQsRUFBb0U7QUFDbEUsWUFBTUMsUUFBUSxHQUFHLEtBQUtMLEtBQUwsQ0FBV0csY0FBWCxDQUEwQkcsSUFBMUIsQ0FBK0IsVUFBQUMsQ0FBQztBQUFBLGlCQUFJQSxDQUFDLENBQUNDLElBQUYsS0FBVyxLQUFJLENBQUNSLEtBQUwsQ0FBV0MsZUFBMUI7QUFBQSxTQUFoQyxDQUFqQjs7QUFFQSxZQUFJSSxRQUFRLElBQUlBLFFBQVEsQ0FBQ0ksU0FBekIsRUFBb0M7QUFDbEMsZUFBS1QsS0FBTCxDQUFXVSxvQkFBWCxDQUFnQztBQUM5QkMsWUFBQUEsSUFBSSxFQUFFLHdCQUFJTixRQUFKLEVBQWMsQ0FBQyxXQUFELEVBQWMsT0FBZCxDQUFkLEtBQXlDTyx5Q0FBd0JDLEtBRHpDO0FBRTlCQyxZQUFBQSxJQUFJLEVBQUUsd0JBQUlULFFBQUosRUFBYyxDQUFDLFdBQUQsRUFBYyxRQUFkLENBQWQsS0FBMENPLHlDQUF3QkcsTUFGMUM7QUFHOUJDLFlBQUFBLEtBQUssRUFBRUMsbUNBQWtCQyxNQUhLO0FBSTlCQyxZQUFBQSxNQUFNLEVBQUU7QUFKc0IsV0FBaEM7QUFNRDtBQUNGLE9BWEQsTUFXTyxJQUFJakIsWUFBSixFQUFrQjtBQUN2QixhQUFLRixLQUFMLENBQVdVLG9CQUFYLENBQWdDO0FBQzlCQyxVQUFBQSxJQUFJLEVBQUVDLHlDQUF3QkMsS0FEQTtBQUU5QkMsVUFBQUEsSUFBSSxFQUFFRix5Q0FBd0JHLE1BRkE7QUFHOUJDLFVBQUFBLEtBQUssRUFBRUMsbUNBQWtCQztBQUhLLFNBQWhDO0FBS0Q7QUFDRjs7OzZCQUVRO0FBQ1AsYUFBTyxrRUFBRyxLQUFLbEIsS0FBTCxDQUFXb0IsUUFBZCxDQUFQO0FBQ0Q7OztFQTlDOENDLGdCOzs7aUNBQTVCeEIsbUIsZUFDQTtBQUNqQmEsRUFBQUEsb0JBQW9CLEVBQUVZLHNCQUFVQyxJQUFWLENBQWVDLFVBRHBCO0FBRWpCckIsRUFBQUEsY0FBYyxFQUFFbUIsc0JBQVVHLE9BQVYsQ0FBa0JILHNCQUFVSSxNQUE1QixDQUZDO0FBR2pCekIsRUFBQUEsZUFBZSxFQUFFcUIsc0JBQVVLO0FBSFYsQztpQ0FEQTlCLG1CLGtCQU9HO0FBQ3BCTSxFQUFBQSxjQUFjLEVBQUUsRUFESTtBQUVwQkYsRUFBQUEsZUFBZSxFQUFFO0FBRkcsQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBnZXQgZnJvbSAnbG9kYXNoLmdldCc7XG5cbmltcG9ydCB7TUFQX1RIVU1CTkFJTF9ESU1FTlNJT04sIEVYUE9SVF9JTUdfUkFUSU9TfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbi8qKlxuICogQSB3cmFwcGVyIGNvbXBvbmVudCBpbiBtb2RhbHMgY29udGFpbiBhIGltYWdlIHByZXZpZXcgb2YgdGhlIG1hcCB3aXRoIGNsb3VkIHByb3ZpZGVyc1xuICogSXQgc2V0cyBleHBvcnQgaW1hZ2Ugc2l6ZSBiYXNlZCBvbiBwcm92aWRlciB0aHVtYm5haWwgc2l6ZVxuICogQGNvbXBvbmVudFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbWFnZU1vZGFsQ29udGFpbmVyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBvblVwZGF0ZUltYWdlU2V0dGluZzogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBjbG91ZFByb3ZpZGVyczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCksXG4gICAgY3VycmVudFByb3ZpZGVyOiBQcm9wVHlwZXMuc3RyaW5nXG4gIH07XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBjbG91ZFByb3ZpZGVyczogW10sXG4gICAgY3VycmVudFByb3ZpZGVyOiBudWxsXG4gIH07XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5fdXBkYXRlVGh1bWJTaXplKHRydWUpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcykge1xuICAgIC8vIHNldCB0aHVtYm5haWwgc2l6ZSBpZiBwcm92aWRlciBjaGFuZ2VzXG4gICAgaWYgKHRoaXMucHJvcHMuY3VycmVudFByb3ZpZGVyICE9PSBwcmV2UHJvcHMuY3VycmVudFByb3ZpZGVyICYmIHRoaXMucHJvcHMuY3VycmVudFByb3ZpZGVyKSB7XG4gICAgICB0aGlzLl91cGRhdGVUaHVtYlNpemUoKTtcbiAgICB9XG4gIH1cblxuICBfdXBkYXRlVGh1bWJTaXplKGluaXRpYWxNb3VudCkge1xuICAgIGlmICh0aGlzLnByb3BzLmN1cnJlbnRQcm92aWRlciAmJiB0aGlzLnByb3BzLmNsb3VkUHJvdmlkZXJzLmxlbmd0aCkge1xuICAgICAgY29uc3QgcHJvdmlkZXIgPSB0aGlzLnByb3BzLmNsb3VkUHJvdmlkZXJzLmZpbmQocCA9PiBwLm5hbWUgPT09IHRoaXMucHJvcHMuY3VycmVudFByb3ZpZGVyKTtcblxuICAgICAgaWYgKHByb3ZpZGVyICYmIHByb3ZpZGVyLnRodW1ibmFpbCkge1xuICAgICAgICB0aGlzLnByb3BzLm9uVXBkYXRlSW1hZ2VTZXR0aW5nKHtcbiAgICAgICAgICBtYXBXOiBnZXQocHJvdmlkZXIsIFsndGh1bWJuYWlsJywgJ3dpZHRoJ10pIHx8IE1BUF9USFVNQk5BSUxfRElNRU5TSU9OLndpZHRoLFxuICAgICAgICAgIG1hcEg6IGdldChwcm92aWRlciwgWyd0aHVtYm5haWwnLCAnaGVpZ2h0J10pIHx8IE1BUF9USFVNQk5BSUxfRElNRU5TSU9OLmhlaWdodCxcbiAgICAgICAgICByYXRpbzogRVhQT1JUX0lNR19SQVRJT1MuQ1VTVE9NLFxuICAgICAgICAgIGxlZ2VuZDogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChpbml0aWFsTW91bnQpIHtcbiAgICAgIHRoaXMucHJvcHMub25VcGRhdGVJbWFnZVNldHRpbmcoe1xuICAgICAgICBtYXBXOiBNQVBfVEhVTUJOQUlMX0RJTUVOU0lPTi53aWR0aCxcbiAgICAgICAgbWFwSDogTUFQX1RIVU1CTkFJTF9ESU1FTlNJT04uaGVpZ2h0LFxuICAgICAgICByYXRpbzogRVhQT1JUX0lNR19SQVRJT1MuQ1VTVE9NXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIDw+e3RoaXMucHJvcHMuY2hpbGRyZW59PC8+O1xuICB9XG59XG4iXX0=
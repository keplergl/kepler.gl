"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _lodash = _interopRequireDefault(require("lodash.get"));

var _defaultSettings = require("../../constants/default-settings");

// Copyright (c) 2021 Uber Technologies, Inc.
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

/** @typedef {import('./image-modal-container').ImageModalContainerProps} ImageModalContainerProps */

/**
 * A wrapper component in modals contain a image preview of the map with cloud providers
 * It sets export image size based on provider thumbnail size
 * @type {React.FunctionComponent<ImageModalContainerProps>}
 */
var ImageModalContainer = function ImageModalContainer(_ref) {
  var onUpdateImageSetting = _ref.onUpdateImageSetting,
      cleanupExportImage = _ref.cleanupExportImage,
      cloudProviders = _ref.cloudProviders,
      currentProvider = _ref.currentProvider,
      children = _ref.children;
  (0, _react.useEffect)(function () {
    onUpdateImageSetting({
      exporting: true
    });
    return function () {
      cleanupExportImage();
    };
  }, [onUpdateImageSetting, cleanupExportImage]);
  (0, _react.useEffect)(function () {
    if (currentProvider && cloudProviders && cloudProviders.length) {
      var provider = cloudProviders.find(function (p) {
        return p.name === currentProvider;
      });

      if (provider && provider.thumbnail) {
        onUpdateImageSetting({
          mapW: (0, _lodash["default"])(provider, ['thumbnail', 'width']) || _defaultSettings.MAP_THUMBNAIL_DIMENSION.width,
          mapH: (0, _lodash["default"])(provider, ['thumbnail', 'height']) || _defaultSettings.MAP_THUMBNAIL_DIMENSION.height,
          ratio: _defaultSettings.EXPORT_IMG_RATIOS.CUSTOM,
          legend: false
        });
      }
    } else {
      onUpdateImageSetting({
        mapW: _defaultSettings.MAP_THUMBNAIL_DIMENSION.width,
        mapH: _defaultSettings.MAP_THUMBNAIL_DIMENSION.height,
        ratio: _defaultSettings.EXPORT_IMG_RATIOS.CUSTOM,
        legend: false
      });
    }
  }, [currentProvider, cloudProviders, onUpdateImageSetting]);
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, children);
};

ImageModalContainer.defaultProps = {
  cloudProviders: []
};
var _default = ImageModalContainer;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9pbWFnZS1tb2RhbC1jb250YWluZXIuanMiXSwibmFtZXMiOlsiSW1hZ2VNb2RhbENvbnRhaW5lciIsIm9uVXBkYXRlSW1hZ2VTZXR0aW5nIiwiY2xlYW51cEV4cG9ydEltYWdlIiwiY2xvdWRQcm92aWRlcnMiLCJjdXJyZW50UHJvdmlkZXIiLCJjaGlsZHJlbiIsImV4cG9ydGluZyIsImxlbmd0aCIsInByb3ZpZGVyIiwiZmluZCIsInAiLCJuYW1lIiwidGh1bWJuYWlsIiwibWFwVyIsIk1BUF9USFVNQk5BSUxfRElNRU5TSU9OIiwid2lkdGgiLCJtYXBIIiwiaGVpZ2h0IiwicmF0aW8iLCJFWFBPUlRfSU1HX1JBVElPUyIsIkNVU1RPTSIsImxlZ2VuZCIsImRlZmF1bHRQcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBRUE7O0FBdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQU9BOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNQSxtQkFBbUIsR0FBRyxTQUF0QkEsbUJBQXNCLE9BTXRCO0FBQUEsTUFMSkMsb0JBS0ksUUFMSkEsb0JBS0k7QUFBQSxNQUpKQyxrQkFJSSxRQUpKQSxrQkFJSTtBQUFBLE1BSEpDLGNBR0ksUUFISkEsY0FHSTtBQUFBLE1BRkpDLGVBRUksUUFGSkEsZUFFSTtBQUFBLE1BREpDLFFBQ0ksUUFESkEsUUFDSTtBQUNKLHdCQUFVLFlBQU07QUFDZEosSUFBQUEsb0JBQW9CLENBQUM7QUFBQ0ssTUFBQUEsU0FBUyxFQUFFO0FBQVosS0FBRCxDQUFwQjtBQUNBLFdBQU8sWUFBTTtBQUNYSixNQUFBQSxrQkFBa0I7QUFDbkIsS0FGRDtBQUdELEdBTEQsRUFLRyxDQUFDRCxvQkFBRCxFQUF1QkMsa0JBQXZCLENBTEg7QUFPQSx3QkFBVSxZQUFNO0FBQ2QsUUFBSUUsZUFBZSxJQUFJRCxjQUFuQixJQUFxQ0EsY0FBYyxDQUFDSSxNQUF4RCxFQUFnRTtBQUM5RCxVQUFNQyxRQUFRLEdBQUdMLGNBQWMsQ0FBQ00sSUFBZixDQUFvQixVQUFBQyxDQUFDO0FBQUEsZUFBSUEsQ0FBQyxDQUFDQyxJQUFGLEtBQVdQLGVBQWY7QUFBQSxPQUFyQixDQUFqQjs7QUFFQSxVQUFJSSxRQUFRLElBQUlBLFFBQVEsQ0FBQ0ksU0FBekIsRUFBb0M7QUFDbENYLFFBQUFBLG9CQUFvQixDQUFDO0FBQ25CWSxVQUFBQSxJQUFJLEVBQUUsd0JBQUlMLFFBQUosRUFBYyxDQUFDLFdBQUQsRUFBYyxPQUFkLENBQWQsS0FBeUNNLHlDQUF3QkMsS0FEcEQ7QUFFbkJDLFVBQUFBLElBQUksRUFBRSx3QkFBSVIsUUFBSixFQUFjLENBQUMsV0FBRCxFQUFjLFFBQWQsQ0FBZCxLQUEwQ00seUNBQXdCRyxNQUZyRDtBQUduQkMsVUFBQUEsS0FBSyxFQUFFQyxtQ0FBa0JDLE1BSE47QUFJbkJDLFVBQUFBLE1BQU0sRUFBRTtBQUpXLFNBQUQsQ0FBcEI7QUFNRDtBQUNGLEtBWEQsTUFXTztBQUNMcEIsTUFBQUEsb0JBQW9CLENBQUM7QUFDbkJZLFFBQUFBLElBQUksRUFBRUMseUNBQXdCQyxLQURYO0FBRW5CQyxRQUFBQSxJQUFJLEVBQUVGLHlDQUF3QkcsTUFGWDtBQUduQkMsUUFBQUEsS0FBSyxFQUFFQyxtQ0FBa0JDLE1BSE47QUFJbkJDLFFBQUFBLE1BQU0sRUFBRTtBQUpXLE9BQUQsQ0FBcEI7QUFNRDtBQUNGLEdBcEJELEVBb0JHLENBQUNqQixlQUFELEVBQWtCRCxjQUFsQixFQUFrQ0Ysb0JBQWxDLENBcEJIO0FBc0JBLHNCQUFPLGtFQUFHSSxRQUFILENBQVA7QUFDRCxDQXJDRDs7QUF1Q0FMLG1CQUFtQixDQUFDc0IsWUFBcEIsR0FBbUM7QUFDakNuQixFQUFBQSxjQUFjLEVBQUU7QUFEaUIsQ0FBbkM7ZUFJZUgsbUIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHt1c2VFZmZlY3R9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBnZXQgZnJvbSAnbG9kYXNoLmdldCc7XG5cbmltcG9ydCB7TUFQX1RIVU1CTkFJTF9ESU1FTlNJT04sIEVYUE9SVF9JTUdfUkFUSU9TfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuL2ltYWdlLW1vZGFsLWNvbnRhaW5lcicpLkltYWdlTW9kYWxDb250YWluZXJQcm9wc30gSW1hZ2VNb2RhbENvbnRhaW5lclByb3BzICovXG5cbi8qKlxuICogQSB3cmFwcGVyIGNvbXBvbmVudCBpbiBtb2RhbHMgY29udGFpbiBhIGltYWdlIHByZXZpZXcgb2YgdGhlIG1hcCB3aXRoIGNsb3VkIHByb3ZpZGVyc1xuICogSXQgc2V0cyBleHBvcnQgaW1hZ2Ugc2l6ZSBiYXNlZCBvbiBwcm92aWRlciB0aHVtYm5haWwgc2l6ZVxuICogQHR5cGUge1JlYWN0LkZ1bmN0aW9uQ29tcG9uZW50PEltYWdlTW9kYWxDb250YWluZXJQcm9wcz59XG4gKi9cbmNvbnN0IEltYWdlTW9kYWxDb250YWluZXIgPSAoe1xuICBvblVwZGF0ZUltYWdlU2V0dGluZyxcbiAgY2xlYW51cEV4cG9ydEltYWdlLFxuICBjbG91ZFByb3ZpZGVycyxcbiAgY3VycmVudFByb3ZpZGVyLFxuICBjaGlsZHJlblxufSkgPT4ge1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIG9uVXBkYXRlSW1hZ2VTZXR0aW5nKHtleHBvcnRpbmc6IHRydWV9KTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgY2xlYW51cEV4cG9ydEltYWdlKCk7XG4gICAgfTtcbiAgfSwgW29uVXBkYXRlSW1hZ2VTZXR0aW5nLCBjbGVhbnVwRXhwb3J0SW1hZ2VdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChjdXJyZW50UHJvdmlkZXIgJiYgY2xvdWRQcm92aWRlcnMgJiYgY2xvdWRQcm92aWRlcnMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBwcm92aWRlciA9IGNsb3VkUHJvdmlkZXJzLmZpbmQocCA9PiBwLm5hbWUgPT09IGN1cnJlbnRQcm92aWRlcik7XG5cbiAgICAgIGlmIChwcm92aWRlciAmJiBwcm92aWRlci50aHVtYm5haWwpIHtcbiAgICAgICAgb25VcGRhdGVJbWFnZVNldHRpbmcoe1xuICAgICAgICAgIG1hcFc6IGdldChwcm92aWRlciwgWyd0aHVtYm5haWwnLCAnd2lkdGgnXSkgfHwgTUFQX1RIVU1CTkFJTF9ESU1FTlNJT04ud2lkdGgsXG4gICAgICAgICAgbWFwSDogZ2V0KHByb3ZpZGVyLCBbJ3RodW1ibmFpbCcsICdoZWlnaHQnXSkgfHwgTUFQX1RIVU1CTkFJTF9ESU1FTlNJT04uaGVpZ2h0LFxuICAgICAgICAgIHJhdGlvOiBFWFBPUlRfSU1HX1JBVElPUy5DVVNUT00sXG4gICAgICAgICAgbGVnZW5kOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgb25VcGRhdGVJbWFnZVNldHRpbmcoe1xuICAgICAgICBtYXBXOiBNQVBfVEhVTUJOQUlMX0RJTUVOU0lPTi53aWR0aCxcbiAgICAgICAgbWFwSDogTUFQX1RIVU1CTkFJTF9ESU1FTlNJT04uaGVpZ2h0LFxuICAgICAgICByYXRpbzogRVhQT1JUX0lNR19SQVRJT1MuQ1VTVE9NLFxuICAgICAgICBsZWdlbmQ6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gIH0sIFtjdXJyZW50UHJvdmlkZXIsIGNsb3VkUHJvdmlkZXJzLCBvblVwZGF0ZUltYWdlU2V0dGluZ10pO1xuXG4gIHJldHVybiA8PntjaGlsZHJlbn08Lz47XG59O1xuXG5JbWFnZU1vZGFsQ29udGFpbmVyLmRlZmF1bHRQcm9wcyA9IHtcbiAgY2xvdWRQcm92aWRlcnM6IFtdXG59O1xuXG5leHBvcnQgZGVmYXVsdCBJbWFnZU1vZGFsQ29udGFpbmVyO1xuIl19
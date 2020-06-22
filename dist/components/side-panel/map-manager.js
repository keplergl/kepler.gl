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

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = require("../common/styled-components");

var _mapStyleSelector = _interopRequireDefault(require("./map-style-panel/map-style-selector"));

var _mapLayerSelector = _interopRequireDefault(require("./map-style-panel/map-layer-selector"));

var _icons = require("../common/icons");

var _defaultSettings = require("../../constants/default-settings");

var _colorSelector = _interopRequireDefault(require("./layer-panel/color-selector"));

var _reselect = require("reselect");

var _reactIntl = require("react-intl");

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
MapManagerFactory.deps = [_mapStyleSelector["default"], _mapLayerSelector["default"]];

function MapManagerFactory(MapStyleSelector, LayerGroupSelector) {
  var MapManager =
  /*#__PURE__*/
  function (_Component) {
    (0, _inherits2["default"])(MapManager, _Component);

    function MapManager() {
      var _getPrototypeOf2;

      var _this;

      (0, _classCallCheck2["default"])(this, MapManager);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(MapManager)).call.apply(_getPrototypeOf2, [this].concat(args)));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "state", {
        isSelecting: false
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "buildingColorSelector", function (props) {
        return props.mapStyle.threeDBuildingColor;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "setColorSelector", function (props) {
        return props.set3dBuildingColor;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_toggleSelecting", function () {
        _this.setState({
          isSelecting: !_this.state.isSelecting
        });
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_selectStyle", function (val) {
        _this.props.onStyleChange(val);

        _this._toggleSelecting();
      });
      return _this;
    }

    (0, _createClass2["default"])(MapManager, [{
      key: "render",
      value: function render() {
        var _this$props = this.props,
            mapStyle = _this$props.mapStyle,
            intl = _this$props.intl;

        var editableLayers = _defaultSettings.DEFAULT_LAYER_GROUPS.map(function (lg) {
          return lg.slug;
        });

        var hasBuildingLayer = mapStyle.visibleLayerGroups['3d building'];
        var colorSetSelector = (0, _reselect.createSelector)(this.buildingColorSelector, this.setColorSelector, function (selectedColor, setColor) {
          return [{
            selectedColor: selectedColor,
            setColor: setColor,
            isRange: false,
            label: intl.formatMessage({
              id: 'mapManager.3dBuildingColor'
            })
          }];
        });
        var colorSets = colorSetSelector(this.props);
        return _react["default"].createElement("div", {
          className: "map-style-panel"
        }, _react["default"].createElement("div", null, _react["default"].createElement(MapStyleSelector, {
          mapStyle: mapStyle,
          isSelecting: this.state.isSelecting,
          onChange: this._selectStyle,
          toggleActive: this._toggleSelecting
        }), editableLayers.length ? _react["default"].createElement(LayerGroupSelector, {
          layers: mapStyle.visibleLayerGroups,
          editableLayers: editableLayers,
          topLayers: mapStyle.topLayerGroups,
          onChange: this.props.onConfigChange
        }) : null, _react["default"].createElement(_styledComponents.SidePanelSection, null, _react["default"].createElement(_colorSelector["default"], {
          colorSets: colorSets,
          disabled: !hasBuildingLayer
        })), _react["default"].createElement(_styledComponents.Button, {
          className: "add-map-style-button",
          onClick: this.props.showAddMapStyleModal,
          secondary: true
        }, _react["default"].createElement(_icons.Add, {
          height: "12px"
        }), _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'mapManager.addMapStyle'
        }))));
      }
    }]);
    return MapManager;
  }(_react.Component);

  (0, _defineProperty2["default"])(MapManager, "propTypes", {
    mapStyle: _propTypes["default"].object.isRequired,
    onConfigChange: _propTypes["default"].func.isRequired,
    onStyleChange: _propTypes["default"].func.isRequired,
    showAddMapStyleModal: _propTypes["default"].func.isRequired
  });
  return (0, _reactIntl.injectIntl)(MapManager);
}

var _default = MapManagerFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbWFwLW1hbmFnZXIuanMiXSwibmFtZXMiOlsiTWFwTWFuYWdlckZhY3RvcnkiLCJkZXBzIiwiTWFwU3R5bGVTZWxlY3RvckZhY3RvcnkiLCJMYXllckdyb3VwU2VsZWN0b3JGYWN0b3J5IiwiTWFwU3R5bGVTZWxlY3RvciIsIkxheWVyR3JvdXBTZWxlY3RvciIsIk1hcE1hbmFnZXIiLCJpc1NlbGVjdGluZyIsInByb3BzIiwibWFwU3R5bGUiLCJ0aHJlZURCdWlsZGluZ0NvbG9yIiwic2V0M2RCdWlsZGluZ0NvbG9yIiwic2V0U3RhdGUiLCJzdGF0ZSIsInZhbCIsIm9uU3R5bGVDaGFuZ2UiLCJfdG9nZ2xlU2VsZWN0aW5nIiwiaW50bCIsImVkaXRhYmxlTGF5ZXJzIiwiREVGQVVMVF9MQVlFUl9HUk9VUFMiLCJtYXAiLCJsZyIsInNsdWciLCJoYXNCdWlsZGluZ0xheWVyIiwidmlzaWJsZUxheWVyR3JvdXBzIiwiY29sb3JTZXRTZWxlY3RvciIsImJ1aWxkaW5nQ29sb3JTZWxlY3RvciIsInNldENvbG9yU2VsZWN0b3IiLCJzZWxlY3RlZENvbG9yIiwic2V0Q29sb3IiLCJpc1JhbmdlIiwibGFiZWwiLCJmb3JtYXRNZXNzYWdlIiwiaWQiLCJjb2xvclNldHMiLCJfc2VsZWN0U3R5bGUiLCJsZW5ndGgiLCJ0b3BMYXllckdyb3VwcyIsIm9uQ29uZmlnQ2hhbmdlIiwic2hvd0FkZE1hcFN0eWxlTW9kYWwiLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUEvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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LE9BQU8sRUFBRSxLQUFLZixLQUFMLENBQVcrQixvQkFGdEI7QUFHRSxVQUFBLFNBQVM7QUFIWCxXQUtFLGdDQUFDLFVBQUQ7QUFBSyxVQUFBLE1BQU0sRUFBQztBQUFaLFVBTEYsRUFNRSxnQ0FBQywyQkFBRDtBQUFrQixVQUFBLEVBQUUsRUFBRTtBQUF0QixVQU5GLENBbEJGLENBREYsQ0FERjtBQStCRDtBQTNFNEQ7QUFBQTtBQUFBLElBQ3RDQyxnQkFEc0M7O0FBQUEsbUNBQ3pEbEMsVUFEeUQsZUFFMUM7QUFDakJHLElBQUFBLFFBQVEsRUFBRWdDLHNCQUFVQyxNQUFWLENBQWlCQyxVQURWO0FBRWpCTCxJQUFBQSxjQUFjLEVBQUVHLHNCQUFVRyxJQUFWLENBQWVELFVBRmQ7QUFHakI1QixJQUFBQSxhQUFhLEVBQUUwQixzQkFBVUcsSUFBVixDQUFlRCxVQUhiO0FBSWpCSixJQUFBQSxvQkFBb0IsRUFBRUUsc0JBQVVHLElBQVYsQ0FBZUQ7QUFKcEIsR0FGMEM7QUE2RS9ELFNBQU8sMkJBQVdyQyxVQUFYLENBQVA7QUFDRDs7ZUFFY04saUIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCB7QnV0dG9uLCBTaWRlUGFuZWxTZWN0aW9ufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgTWFwU3R5bGVTZWxlY3RvckZhY3RvcnkgZnJvbSAnY29tcG9uZW50cy9zaWRlLXBhbmVsL21hcC1zdHlsZS1wYW5lbC9tYXAtc3R5bGUtc2VsZWN0b3InO1xuaW1wb3J0IExheWVyR3JvdXBTZWxlY3RvckZhY3RvcnkgZnJvbSAnY29tcG9uZW50cy9zaWRlLXBhbmVsL21hcC1zdHlsZS1wYW5lbC9tYXAtbGF5ZXItc2VsZWN0b3InO1xuXG5pbXBvcnQge0FkZH0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuaW1wb3J0IHtERUZBVUxUX0xBWUVSX0dST1VQU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IENvbG9yU2VsZWN0b3IgZnJvbSAnLi9sYXllci1wYW5lbC9jb2xvci1zZWxlY3Rvcic7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5pbXBvcnQge0Zvcm1hdHRlZE1lc3NhZ2UsIGluamVjdEludGx9IGZyb20gJ3JlYWN0LWludGwnO1xuXG5NYXBNYW5hZ2VyRmFjdG9yeS5kZXBzID0gW01hcFN0eWxlU2VsZWN0b3JGYWN0b3J5LCBMYXllckdyb3VwU2VsZWN0b3JGYWN0b3J5XTtcblxuZnVuY3Rpb24gTWFwTWFuYWdlckZhY3RvcnkoTWFwU3R5bGVTZWxlY3RvciwgTGF5ZXJHcm91cFNlbGVjdG9yKSB7XG4gIGNsYXNzIE1hcE1hbmFnZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgICBtYXBTdHlsZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgb25Db25maWdDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICBvblN0eWxlQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgc2hvd0FkZE1hcFN0eWxlTW9kYWw6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbiAgICB9O1xuXG4gICAgc3RhdGUgPSB7XG4gICAgICBpc1NlbGVjdGluZzogZmFsc2VcbiAgICB9O1xuXG4gICAgYnVpbGRpbmdDb2xvclNlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMubWFwU3R5bGUudGhyZWVEQnVpbGRpbmdDb2xvcjtcbiAgICBzZXRDb2xvclNlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMuc2V0M2RCdWlsZGluZ0NvbG9yO1xuXG4gICAgX3RvZ2dsZVNlbGVjdGluZyA9ICgpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2lzU2VsZWN0aW5nOiAhdGhpcy5zdGF0ZS5pc1NlbGVjdGluZ30pO1xuICAgIH07XG5cbiAgICBfc2VsZWN0U3R5bGUgPSB2YWwgPT4ge1xuICAgICAgdGhpcy5wcm9wcy5vblN0eWxlQ2hhbmdlKHZhbCk7XG4gICAgICB0aGlzLl90b2dnbGVTZWxlY3RpbmcoKTtcbiAgICB9O1xuXG4gICAgcmVuZGVyKCkge1xuICAgICAgY29uc3Qge21hcFN0eWxlLCBpbnRsfSA9IHRoaXMucHJvcHM7XG4gICAgICBjb25zdCBlZGl0YWJsZUxheWVycyA9IERFRkFVTFRfTEFZRVJfR1JPVVBTLm1hcChsZyA9PiBsZy5zbHVnKTtcbiAgICAgIGNvbnN0IGhhc0J1aWxkaW5nTGF5ZXIgPSBtYXBTdHlsZS52aXNpYmxlTGF5ZXJHcm91cHNbJzNkIGJ1aWxkaW5nJ107XG4gICAgICBjb25zdCBjb2xvclNldFNlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgICAgIHRoaXMuYnVpbGRpbmdDb2xvclNlbGVjdG9yLFxuICAgICAgICB0aGlzLnNldENvbG9yU2VsZWN0b3IsXG4gICAgICAgIChzZWxlY3RlZENvbG9yLCBzZXRDb2xvcikgPT4gW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNlbGVjdGVkQ29sb3IsXG4gICAgICAgICAgICBzZXRDb2xvcixcbiAgICAgICAgICAgIGlzUmFuZ2U6IGZhbHNlLFxuICAgICAgICAgICAgbGFiZWw6IGludGwuZm9ybWF0TWVzc2FnZSh7aWQ6ICdtYXBNYW5hZ2VyLjNkQnVpbGRpbmdDb2xvcid9KVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgKTtcblxuICAgICAgY29uc3QgY29sb3JTZXRzID0gY29sb3JTZXRTZWxlY3Rvcih0aGlzLnByb3BzKTtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXAtc3R5bGUtcGFuZWxcIj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPE1hcFN0eWxlU2VsZWN0b3JcbiAgICAgICAgICAgICAgbWFwU3R5bGU9e21hcFN0eWxlfVxuICAgICAgICAgICAgICBpc1NlbGVjdGluZz17dGhpcy5zdGF0ZS5pc1NlbGVjdGluZ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuX3NlbGVjdFN0eWxlfVxuICAgICAgICAgICAgICB0b2dnbGVBY3RpdmU9e3RoaXMuX3RvZ2dsZVNlbGVjdGluZ31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICB7ZWRpdGFibGVMYXllcnMubGVuZ3RoID8gKFxuICAgICAgICAgICAgICA8TGF5ZXJHcm91cFNlbGVjdG9yXG4gICAgICAgICAgICAgICAgbGF5ZXJzPXttYXBTdHlsZS52aXNpYmxlTGF5ZXJHcm91cHN9XG4gICAgICAgICAgICAgICAgZWRpdGFibGVMYXllcnM9e2VkaXRhYmxlTGF5ZXJzfVxuICAgICAgICAgICAgICAgIHRvcExheWVycz17bWFwU3R5bGUudG9wTGF5ZXJHcm91cHN9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMucHJvcHMub25Db25maWdDaGFuZ2V9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgIDxTaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgICAgICAgICA8Q29sb3JTZWxlY3RvciBjb2xvclNldHM9e2NvbG9yU2V0c30gZGlzYWJsZWQ9eyFoYXNCdWlsZGluZ0xheWVyfSAvPlxuICAgICAgICAgICAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhZGQtbWFwLXN0eWxlLWJ1dHRvblwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMucHJvcHMuc2hvd0FkZE1hcFN0eWxlTW9kYWx9XG4gICAgICAgICAgICAgIHNlY29uZGFyeVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8QWRkIGhlaWdodD1cIjEycHhcIiAvPlxuICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21hcE1hbmFnZXIuYWRkTWFwU3R5bGUnfSAvPlxuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGluamVjdEludGwoTWFwTWFuYWdlcik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hcE1hbmFnZXJGYWN0b3J5O1xuIl19
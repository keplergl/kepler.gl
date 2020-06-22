"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = TextLabelPanelFactory;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactIntl = require("react-intl");

var _styledComponents = require("../../common/styled-components");

var _icons = require("../../common/icons");

var _colorSelector = _interopRequireDefault(require("./color-selector"));

var _fieldSelector = _interopRequireDefault(require("../../common/field-selector"));

var _itemSelector = _interopRequireDefault(require("../../common/item-selector/item-selector"));

var _layerConfigGroup = _interopRequireWildcard(require("./layer-config-group"));

var _rangeSlider = _interopRequireDefault(require("../../common/range-slider"));

var _layerFactory = require("../../../layers/layer-factory");

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
TextLabelPanelFactory.deps = [_rangeSlider["default"]];

function TextLabelPanelFactory(RangeSlider) {
  var TextLabelPanel =
  /*#__PURE__*/
  function (_Component) {
    (0, _inherits2["default"])(TextLabelPanel, _Component);

    function TextLabelPanel() {
      (0, _classCallCheck2["default"])(this, TextLabelPanel);
      return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(TextLabelPanel).apply(this, arguments));
    }

    (0, _createClass2["default"])(TextLabelPanel, [{
      key: "render",
      value: function render() {
        var _this$props = this.props,
            updateLayerTextLabel = _this$props.updateLayerTextLabel,
            textLabel = _this$props.textLabel,
            fields = _this$props.fields;
        var currentFields = textLabel.map(function (tl) {
          return tl.field && tl.field.name;
        }).filter(function (d) {
          return d;
        });
        return _react["default"].createElement(_layerConfigGroup["default"], {
          label: 'panel.text.label',
          collapsible: true
        }, _react["default"].createElement(_layerConfigGroup.ConfigGroupCollapsibleHeader, null, _react["default"].createElement(_fieldSelector["default"], {
          fields: fields,
          value: currentFields,
          onSelect: function onSelect(selected) {
            return updateLayerTextLabel('all', 'fields', selected);
          },
          multiSelect: true
        })), _react["default"].createElement(_layerConfigGroup.ConfigGroupCollapsibleContent, null, textLabel.map(function (tl, idx) {
          return _react["default"].createElement("div", {
            key: tl.field ? tl.field.name : "null-".concat(idx)
          }, _react["default"].createElement(_styledComponents.PanelLabel, null, _react["default"].createElement(_reactIntl.FormattedMessage, {
            id: 'panel.text.labelWithId',
            values: {
              labelId: idx + 1
            }
          })), _react["default"].createElement(_styledComponents.SidePanelSection, null, _react["default"].createElement(_fieldSelector["default"], {
            fields: fields,
            value: tl.field && tl.field.name || 'placeholder.selectField',
            placeholder: 'placeholder.empty',
            onSelect: function onSelect(v) {
              return updateLayerTextLabel(idx, 'field', v);
            },
            erasable: true
          })), _react["default"].createElement(_styledComponents.SidePanelSection, null, _react["default"].createElement(_styledComponents.PanelLabel, null, _react["default"].createElement(_reactIntl.FormattedMessage, {
            id: "panel.text.fontSize"
          })), _react["default"].createElement(RangeSlider, (0, _extends2["default"])({}, _layerFactory.LAYER_TEXT_CONFIGS.fontSize, {
            value1: tl.size,
            isRange: false,
            onChange: function onChange(v) {
              return updateLayerTextLabel(idx, 'size', v[1]);
            }
          }))), _react["default"].createElement(_styledComponents.SidePanelSection, null, _react["default"].createElement(_styledComponents.PanelLabel, null, _react["default"].createElement(_reactIntl.FormattedMessage, {
            id: "panel.text.fontColor"
          })), _react["default"].createElement(_colorSelector["default"], {
            colorSets: [{
              selectedColor: tl.color,
              setColor: function setColor(v) {
                return updateLayerTextLabel(idx, 'color', v);
              }
            }]
          })), _react["default"].createElement(_styledComponents.SidePanelSection, null, _react["default"].createElement(_styledComponents.SpaceBetweenFlexbox, null, _react["default"].createElement(_styledComponents.SBFlexboxItem, null, _react["default"].createElement(_styledComponents.PanelLabel, null, _react["default"].createElement(_reactIntl.FormattedMessage, {
            id: "panel.text.textAnchor"
          })), _react["default"].createElement(_itemSelector["default"], (0, _extends2["default"])({}, _layerFactory.LAYER_TEXT_CONFIGS.textAnchor, {
            selectedItems: tl.anchor,
            onChange: function onChange(val) {
              return updateLayerTextLabel(idx, 'anchor', val);
            }
          }))), _react["default"].createElement(_styledComponents.SBFlexboxItem, null, _react["default"].createElement(_styledComponents.PanelLabel, null, _react["default"].createElement(_reactIntl.FormattedMessage, {
            id: "panel.text.alignment"
          })), _react["default"].createElement(_itemSelector["default"], (0, _extends2["default"])({}, _layerFactory.LAYER_TEXT_CONFIGS.textAlignment, {
            selectedItems: tl.alignment,
            onChange: function onChange(val) {
              return updateLayerTextLabel(idx, 'alignment', val);
            }
          }))))));
        }), _react["default"].createElement(_styledComponents.SidePanelSection, null, _react["default"].createElement(_styledComponents.Button, {
          link: true,
          onClick: function onClick(val) {
            return updateLayerTextLabel(textLabel.length);
          }
        }, _react["default"].createElement(_icons.Add, {
          height: "12px"
        }), _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: "panel.text.addMoreLabel"
        })))));
      }
    }]);
    return TextLabelPanel;
  }(_react.Component);

  (0, _defineProperty2["default"])(TextLabelPanel, "propTypes", {
    fields: _propTypes["default"].arrayOf(_propTypes["default"].object),
    textLabel: _propTypes["default"].arrayOf(_propTypes["default"].object),
    updateLayerTextLabel: _propTypes["default"].func.isRequired
  });
  return TextLabelPanel;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvdGV4dC1sYWJlbC1wYW5lbC5qcyJdLCJuYW1lcyI6WyJUZXh0TGFiZWxQYW5lbEZhY3RvcnkiLCJkZXBzIiwiUmFuZ2VTbGlkZXJGYWN0b3J5IiwiUmFuZ2VTbGlkZXIiLCJUZXh0TGFiZWxQYW5lbCIsInByb3BzIiwidXBkYXRlTGF5ZXJUZXh0TGFiZWwiLCJ0ZXh0TGFiZWwiLCJmaWVsZHMiLCJjdXJyZW50RmllbGRzIiwibWFwIiwidGwiLCJmaWVsZCIsIm5hbWUiLCJmaWx0ZXIiLCJkIiwic2VsZWN0ZWQiLCJpZHgiLCJsYWJlbElkIiwidiIsIkxBWUVSX1RFWFRfQ09ORklHUyIsImZvbnRTaXplIiwic2l6ZSIsInNlbGVjdGVkQ29sb3IiLCJjb2xvciIsInNldENvbG9yIiwidGV4dEFuY2hvciIsImFuY2hvciIsInZhbCIsInRleHRBbGlnbm1lbnQiLCJhbGlnbm1lbnQiLCJsZW5ndGgiLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJhcnJheU9mIiwib2JqZWN0IiwiZnVuYyIsImlzUmVxdWlyZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBT0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBSUE7O0FBRUE7O0FBekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBeUJBQSxxQkFBcUIsQ0FBQ0MsSUFBdEIsR0FBNkIsQ0FBQ0MsdUJBQUQsQ0FBN0I7O0FBRWUsU0FBU0YscUJBQVQsQ0FBK0JHLFdBQS9CLEVBQTRDO0FBQUEsTUFDbkRDLGNBRG1EO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSwrQkFROUM7QUFBQSww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QUFBLElBQzVCQyxnQkFENEI7O0FBQUEsbUNBQ25ENUIsY0FEbUQsZUFFcEM7QUFDakJJLElBQUFBLE1BQU0sRUFBRXlCLHNCQUFVQyxPQUFWLENBQWtCRCxzQkFBVUUsTUFBNUIsQ0FEUztBQUVqQjVCLElBQUFBLFNBQVMsRUFBRTBCLHNCQUFVQyxPQUFWLENBQWtCRCxzQkFBVUUsTUFBNUIsQ0FGTTtBQUdqQjdCLElBQUFBLG9CQUFvQixFQUFFMkIsc0JBQVVHLElBQVYsQ0FBZUM7QUFIcEIsR0FGb0M7QUFrR3pELFNBQU9qQyxjQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge0Zvcm1hdHRlZE1lc3NhZ2V9IGZyb20gJ3JlYWN0LWludGwnO1xuXG5pbXBvcnQge1xuICBCdXR0b24sXG4gIFBhbmVsTGFiZWwsXG4gIFNCRmxleGJveEl0ZW0sXG4gIFNpZGVQYW5lbFNlY3Rpb24sXG4gIFNwYWNlQmV0d2VlbkZsZXhib3hcbn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtBZGR9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcbmltcG9ydCBDb2xvclNlbGVjdG9yIGZyb20gJy4vY29sb3Itc2VsZWN0b3InO1xuaW1wb3J0IEZpZWxkU2VsZWN0b3IgZnJvbSAnY29tcG9uZW50cy9jb21tb24vZmllbGQtc2VsZWN0b3InO1xuaW1wb3J0IEl0ZW1TZWxlY3RvciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL2l0ZW0tc2VsZWN0b3InO1xuaW1wb3J0IExheWVyQ29uZmlnR3JvdXAsIHtcbiAgQ29uZmlnR3JvdXBDb2xsYXBzaWJsZUNvbnRlbnQsXG4gIENvbmZpZ0dyb3VwQ29sbGFwc2libGVIZWFkZXJcbn0gZnJvbSAnLi9sYXllci1jb25maWctZ3JvdXAnO1xuaW1wb3J0IFJhbmdlU2xpZGVyRmFjdG9yeSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9yYW5nZS1zbGlkZXInO1xuXG5pbXBvcnQge0xBWUVSX1RFWFRfQ09ORklHU30gZnJvbSAnbGF5ZXJzL2xheWVyLWZhY3RvcnknO1xuXG5UZXh0TGFiZWxQYW5lbEZhY3RvcnkuZGVwcyA9IFtSYW5nZVNsaWRlckZhY3RvcnldO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBUZXh0TGFiZWxQYW5lbEZhY3RvcnkoUmFuZ2VTbGlkZXIpIHtcbiAgY2xhc3MgVGV4dExhYmVsUGFuZWwgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgICBmaWVsZHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLFxuICAgICAgdGV4dExhYmVsOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KSxcbiAgICAgIHVwZGF0ZUxheWVyVGV4dExhYmVsOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gICAgfTtcblxuICAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnN0IHt1cGRhdGVMYXllclRleHRMYWJlbCwgdGV4dExhYmVsLCBmaWVsZHN9ID0gdGhpcy5wcm9wcztcbiAgICAgIGNvbnN0IGN1cnJlbnRGaWVsZHMgPSB0ZXh0TGFiZWwubWFwKHRsID0+IHRsLmZpZWxkICYmIHRsLmZpZWxkLm5hbWUpLmZpbHRlcihkID0+IGQpO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPExheWVyQ29uZmlnR3JvdXAgbGFiZWw9eydwYW5lbC50ZXh0LmxhYmVsJ30gY29sbGFwc2libGU+XG4gICAgICAgICAgPENvbmZpZ0dyb3VwQ29sbGFwc2libGVIZWFkZXI+XG4gICAgICAgICAgICA8RmllbGRTZWxlY3RvclxuICAgICAgICAgICAgICBmaWVsZHM9e2ZpZWxkc31cbiAgICAgICAgICAgICAgdmFsdWU9e2N1cnJlbnRGaWVsZHN9XG4gICAgICAgICAgICAgIG9uU2VsZWN0PXtzZWxlY3RlZCA9PiB1cGRhdGVMYXllclRleHRMYWJlbCgnYWxsJywgJ2ZpZWxkcycsIHNlbGVjdGVkKX1cbiAgICAgICAgICAgICAgbXVsdGlTZWxlY3RcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9Db25maWdHcm91cENvbGxhcHNpYmxlSGVhZGVyPlxuICAgICAgICAgIDxDb25maWdHcm91cENvbGxhcHNpYmxlQ29udGVudD5cbiAgICAgICAgICAgIHt0ZXh0TGFiZWwubWFwKCh0bCwgaWR4KSA9PiAoXG4gICAgICAgICAgICAgIDxkaXYga2V5PXt0bC5maWVsZCA/IHRsLmZpZWxkLm5hbWUgOiBgbnVsbC0ke2lkeH1gfT5cbiAgICAgICAgICAgICAgICA8UGFuZWxMYWJlbD5cbiAgICAgICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsncGFuZWwudGV4dC5sYWJlbFdpdGhJZCd9IHZhbHVlcz17e2xhYmVsSWQ6IGlkeCArIDF9fSAvPlxuICAgICAgICAgICAgICAgIDwvUGFuZWxMYWJlbD5cbiAgICAgICAgICAgICAgICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgICAgICAgICAgIDxGaWVsZFNlbGVjdG9yXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkcz17ZmllbGRzfVxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17KHRsLmZpZWxkICYmIHRsLmZpZWxkLm5hbWUpIHx8ICdwbGFjZWhvbGRlci5zZWxlY3RGaWVsZCd9XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXsncGxhY2Vob2xkZXIuZW1wdHknfVxuICAgICAgICAgICAgICAgICAgICBvblNlbGVjdD17diA9PiB1cGRhdGVMYXllclRleHRMYWJlbChpZHgsICdmaWVsZCcsIHYpfVxuICAgICAgICAgICAgICAgICAgICBlcmFzYWJsZVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L1NpZGVQYW5lbFNlY3Rpb24+XG4gICAgICAgICAgICAgICAgPFNpZGVQYW5lbFNlY3Rpb24+XG4gICAgICAgICAgICAgICAgICA8UGFuZWxMYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9XCJwYW5lbC50ZXh0LmZvbnRTaXplXCIgLz5cbiAgICAgICAgICAgICAgICAgIDwvUGFuZWxMYWJlbD5cbiAgICAgICAgICAgICAgICAgIDxSYW5nZVNsaWRlclxuICAgICAgICAgICAgICAgICAgICB7Li4uTEFZRVJfVEVYVF9DT05GSUdTLmZvbnRTaXplfVxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTE9e3RsLnNpemV9XG4gICAgICAgICAgICAgICAgICAgIGlzUmFuZ2U9e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17diA9PiB1cGRhdGVMYXllclRleHRMYWJlbChpZHgsICdzaXplJywgdlsxXSl9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvU2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgICAgICAgICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgICAgICAgICAgIDxQYW5lbExhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD1cInBhbmVsLnRleHQuZm9udENvbG9yXCIgLz5cbiAgICAgICAgICAgICAgICAgIDwvUGFuZWxMYWJlbD5cbiAgICAgICAgICAgICAgICAgIDxDb2xvclNlbGVjdG9yXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yU2V0cz17W1xuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkQ29sb3I6IHRsLmNvbG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q29sb3I6IHYgPT4gdXBkYXRlTGF5ZXJUZXh0TGFiZWwoaWR4LCAnY29sb3InLCB2KVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXX1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgICAgICAgICAgIDxTaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgICAgICAgICAgICAgPFNwYWNlQmV0d2VlbkZsZXhib3g+XG4gICAgICAgICAgICAgICAgICAgIDxTQkZsZXhib3hJdGVtPlxuICAgICAgICAgICAgICAgICAgICAgIDxQYW5lbExhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9XCJwYW5lbC50ZXh0LnRleHRBbmNob3JcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgIDwvUGFuZWxMYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICA8SXRlbVNlbGVjdG9yXG4gICAgICAgICAgICAgICAgICAgICAgICB7Li4uTEFZRVJfVEVYVF9DT05GSUdTLnRleHRBbmNob3J9XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEl0ZW1zPXt0bC5hbmNob3J9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17dmFsID0+IHVwZGF0ZUxheWVyVGV4dExhYmVsKGlkeCwgJ2FuY2hvcicsIHZhbCl9XG4gICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPC9TQkZsZXhib3hJdGVtPlxuICAgICAgICAgICAgICAgICAgICA8U0JGbGV4Ym94SXRlbT5cbiAgICAgICAgICAgICAgICAgICAgICA8UGFuZWxMYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPVwicGFuZWwudGV4dC5hbGlnbm1lbnRcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgIDwvUGFuZWxMYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICA8SXRlbVNlbGVjdG9yXG4gICAgICAgICAgICAgICAgICAgICAgICB7Li4uTEFZRVJfVEVYVF9DT05GSUdTLnRleHRBbGlnbm1lbnR9XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEl0ZW1zPXt0bC5hbGlnbm1lbnR9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17dmFsID0+IHVwZGF0ZUxheWVyVGV4dExhYmVsKGlkeCwgJ2FsaWdubWVudCcsIHZhbCl9XG4gICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPC9TQkZsZXhib3hJdGVtPlxuICAgICAgICAgICAgICAgICAgPC9TcGFjZUJldHdlZW5GbGV4Ym94PlxuICAgICAgICAgICAgICAgIDwvU2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDxTaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgICAgICAgICA8QnV0dG9uIGxpbmsgb25DbGljaz17dmFsID0+IHVwZGF0ZUxheWVyVGV4dExhYmVsKHRleHRMYWJlbC5sZW5ndGgpfT5cbiAgICAgICAgICAgICAgICA8QWRkIGhlaWdodD1cIjEycHhcIiAvPlxuICAgICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPVwicGFuZWwudGV4dC5hZGRNb3JlTGFiZWxcIiAvPlxuICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgIDwvU2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgICA8L0NvbmZpZ0dyb3VwQ29sbGFwc2libGVDb250ZW50PlxuICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBUZXh0TGFiZWxQYW5lbDtcbn1cbiJdfQ==
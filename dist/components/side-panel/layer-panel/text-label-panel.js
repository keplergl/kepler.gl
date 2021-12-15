"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _localization = require("../../../localization");

var _styledComponents = require("../../common/styled-components");

var _icons = require("../../common/icons");

var _colorSelector = _interopRequireDefault(require("./color-selector"));

var _itemSelector = _interopRequireDefault(require("../../common/item-selector/item-selector"));

var _layerConfigGroup = _interopRequireWildcard(require("./layer-config-group"));

var _rangeSlider = _interopRequireDefault(require("../../common/range-slider"));

var _layerFactory = require("../../../layers/layer-factory");

var _fieldSelector = _interopRequireDefault(require("../../common/field-selector"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

TextLabelPanelFactory.deps = [_rangeSlider["default"], _layerConfigGroup["default"], _fieldSelector["default"]];

function TextLabelPanelFactory(RangeSlider, LayerConfigGroup, FieldSelector) {
  var TextLabelPanel = /*#__PURE__*/function (_Component) {
    (0, _inherits2["default"])(TextLabelPanel, _Component);

    var _super = _createSuper(TextLabelPanel);

    function TextLabelPanel() {
      (0, _classCallCheck2["default"])(this, TextLabelPanel);
      return _super.apply(this, arguments);
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
        return /*#__PURE__*/_react["default"].createElement(LayerConfigGroup, {
          label: 'panel.text.label',
          collapsible: true
        }, /*#__PURE__*/_react["default"].createElement(_layerConfigGroup.ConfigGroupCollapsibleHeader, null, /*#__PURE__*/_react["default"].createElement(FieldSelector, {
          fields: fields,
          value: currentFields,
          onSelect: function onSelect(selected) {
            return updateLayerTextLabel('all', 'fields', selected);
          },
          multiSelect: true
        })), /*#__PURE__*/_react["default"].createElement(_layerConfigGroup.ConfigGroupCollapsibleContent, null, textLabel.map(function (tl, idx) {
          return /*#__PURE__*/_react["default"].createElement("div", {
            key: tl.field ? tl.field.name : "null-".concat(idx)
          }, /*#__PURE__*/_react["default"].createElement(_styledComponents.PanelLabel, null, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
            id: 'panel.text.labelWithId',
            values: {
              labelId: idx + 1
            }
          })), /*#__PURE__*/_react["default"].createElement(_styledComponents.SidePanelSection, null, /*#__PURE__*/_react["default"].createElement(FieldSelector, {
            fields: fields,
            value: tl.field && tl.field.name || 'placeholder.selectField',
            placeholder: 'placeholder.empty',
            onSelect: function onSelect(v) {
              return updateLayerTextLabel(idx, 'field', v);
            },
            erasable: true
          })), /*#__PURE__*/_react["default"].createElement(_styledComponents.SidePanelSection, null, /*#__PURE__*/_react["default"].createElement(_styledComponents.PanelLabel, null, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
            id: "panel.text.fontSize"
          })), /*#__PURE__*/_react["default"].createElement(RangeSlider, (0, _extends2["default"])({}, _layerFactory.LAYER_TEXT_CONFIGS.fontSize, {
            value1: tl.size,
            isRange: false,
            onChange: function onChange(v) {
              return updateLayerTextLabel(idx, 'size', v[1]);
            }
          }))), /*#__PURE__*/_react["default"].createElement(_styledComponents.SidePanelSection, null, /*#__PURE__*/_react["default"].createElement(_styledComponents.PanelLabel, null, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
            id: "panel.text.fontColor"
          })), /*#__PURE__*/_react["default"].createElement(_colorSelector["default"], {
            colorSets: [{
              selectedColor: tl.color,
              setColor: function setColor(v) {
                return updateLayerTextLabel(idx, 'color', v);
              }
            }]
          })), /*#__PURE__*/_react["default"].createElement(_styledComponents.SidePanelSection, null, /*#__PURE__*/_react["default"].createElement(_styledComponents.SpaceBetweenFlexbox, null, /*#__PURE__*/_react["default"].createElement(_styledComponents.SBFlexboxItem, null, /*#__PURE__*/_react["default"].createElement(_styledComponents.PanelLabel, null, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
            id: "panel.text.textAnchor"
          })), /*#__PURE__*/_react["default"].createElement(_itemSelector["default"], (0, _extends2["default"])({}, _layerFactory.LAYER_TEXT_CONFIGS.textAnchor, {
            selectedItems: tl.anchor,
            onChange: function onChange(val) {
              return updateLayerTextLabel(idx, 'anchor', val);
            }
          }))), /*#__PURE__*/_react["default"].createElement(_styledComponents.SBFlexboxItem, null, /*#__PURE__*/_react["default"].createElement(_styledComponents.PanelLabel, null, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
            id: "panel.text.alignment"
          })), /*#__PURE__*/_react["default"].createElement(_itemSelector["default"], (0, _extends2["default"])({}, _layerFactory.LAYER_TEXT_CONFIGS.textAlignment, {
            selectedItems: tl.alignment,
            onChange: function onChange(val) {
              return updateLayerTextLabel(idx, 'alignment', val);
            }
          }))))));
        }), /*#__PURE__*/_react["default"].createElement(_styledComponents.SidePanelSection, null, /*#__PURE__*/_react["default"].createElement(_styledComponents.Button, {
          link: true,
          onClick: function onClick(val) {
            return updateLayerTextLabel(textLabel.length);
          }
        }, /*#__PURE__*/_react["default"].createElement(_icons.Add, {
          height: "12px"
        }), /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
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

var _default = TextLabelPanelFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvdGV4dC1sYWJlbC1wYW5lbC5qcyJdLCJuYW1lcyI6WyJUZXh0TGFiZWxQYW5lbEZhY3RvcnkiLCJkZXBzIiwiUmFuZ2VTbGlkZXJGYWN0b3J5IiwiTGF5ZXJDb25maWdHcm91cEZhY3RvcnkiLCJGaWVsZFNlbGVjdG9yRmFjdG9yeSIsIlJhbmdlU2xpZGVyIiwiTGF5ZXJDb25maWdHcm91cCIsIkZpZWxkU2VsZWN0b3IiLCJUZXh0TGFiZWxQYW5lbCIsInByb3BzIiwidXBkYXRlTGF5ZXJUZXh0TGFiZWwiLCJ0ZXh0TGFiZWwiLCJmaWVsZHMiLCJjdXJyZW50RmllbGRzIiwibWFwIiwidGwiLCJmaWVsZCIsIm5hbWUiLCJmaWx0ZXIiLCJkIiwic2VsZWN0ZWQiLCJpZHgiLCJsYWJlbElkIiwidiIsIkxBWUVSX1RFWFRfQ09ORklHUyIsImZvbnRTaXplIiwic2l6ZSIsInNlbGVjdGVkQ29sb3IiLCJjb2xvciIsInNldENvbG9yIiwidGV4dEFuY2hvciIsImFuY2hvciIsInZhbCIsInRleHRBbGlnbm1lbnQiLCJhbGlnbm1lbnQiLCJsZW5ndGgiLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJhcnJheU9mIiwib2JqZWN0IiwiZnVuYyIsImlzUmVxdWlyZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBT0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBSUE7O0FBRUE7O0FBQ0E7Ozs7OztBQUVBQSxxQkFBcUIsQ0FBQ0MsSUFBdEIsR0FBNkIsQ0FBQ0MsdUJBQUQsRUFBcUJDLDRCQUFyQixFQUE4Q0MseUJBQTlDLENBQTdCOztBQUNBLFNBQVNKLHFCQUFULENBQStCSyxXQUEvQixFQUE0Q0MsZ0JBQTVDLEVBQThEQyxhQUE5RCxFQUE2RTtBQUFBLE1BQ3JFQyxjQURxRTtBQUFBOztBQUFBOztBQUFBO0FB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QSxFQUFFLEVBQUM7QUFBckIsVUFGRixDQURGLENBakVGLENBVEYsQ0FERjtBQW9GRDtBQS9Gd0U7QUFBQTtBQUFBLElBQzlDQyxnQkFEOEM7O0FBQUEsbUNBQ3JFNUIsY0FEcUUsZUFFdEQ7QUFDakJJLElBQUFBLE1BQU0sRUFBRXlCLHNCQUFVQyxPQUFWLENBQWtCRCxzQkFBVUUsTUFBNUIsQ0FEUztBQUVqQjVCLElBQUFBLFNBQVMsRUFBRTBCLHNCQUFVQyxPQUFWLENBQWtCRCxzQkFBVUUsTUFBNUIsQ0FGTTtBQUdqQjdCLElBQUFBLG9CQUFvQixFQUFFMkIsc0JBQVVHLElBQVYsQ0FBZUM7QUFIcEIsR0FGc0Q7QUFrRzNFLFNBQU9qQyxjQUFQO0FBQ0Q7O2VBRWNSLHFCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtGb3JtYXR0ZWRNZXNzYWdlfSBmcm9tICdsb2NhbGl6YXRpb24nO1xuXG5pbXBvcnQge1xuICBCdXR0b24sXG4gIFBhbmVsTGFiZWwsXG4gIFNCRmxleGJveEl0ZW0sXG4gIFNpZGVQYW5lbFNlY3Rpb24sXG4gIFNwYWNlQmV0d2VlbkZsZXhib3hcbn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtBZGR9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcbmltcG9ydCBDb2xvclNlbGVjdG9yIGZyb20gJy4vY29sb3Itc2VsZWN0b3InO1xuaW1wb3J0IEl0ZW1TZWxlY3RvciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL2l0ZW0tc2VsZWN0b3InO1xuaW1wb3J0IExheWVyQ29uZmlnR3JvdXBGYWN0b3J5LCB7XG4gIENvbmZpZ0dyb3VwQ29sbGFwc2libGVDb250ZW50LFxuICBDb25maWdHcm91cENvbGxhcHNpYmxlSGVhZGVyXG59IGZyb20gJy4vbGF5ZXItY29uZmlnLWdyb3VwJztcbmltcG9ydCBSYW5nZVNsaWRlckZhY3RvcnkgZnJvbSAnY29tcG9uZW50cy9jb21tb24vcmFuZ2Utc2xpZGVyJztcblxuaW1wb3J0IHtMQVlFUl9URVhUX0NPTkZJR1N9IGZyb20gJ2xheWVycy9sYXllci1mYWN0b3J5JztcbmltcG9ydCBGaWVsZFNlbGVjdG9yRmFjdG9yeSBmcm9tICcuLi8uLi9jb21tb24vZmllbGQtc2VsZWN0b3InO1xuXG5UZXh0TGFiZWxQYW5lbEZhY3RvcnkuZGVwcyA9IFtSYW5nZVNsaWRlckZhY3RvcnksIExheWVyQ29uZmlnR3JvdXBGYWN0b3J5LCBGaWVsZFNlbGVjdG9yRmFjdG9yeV07XG5mdW5jdGlvbiBUZXh0TGFiZWxQYW5lbEZhY3RvcnkoUmFuZ2VTbGlkZXIsIExheWVyQ29uZmlnR3JvdXAsIEZpZWxkU2VsZWN0b3IpIHtcbiAgY2xhc3MgVGV4dExhYmVsUGFuZWwgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgICBmaWVsZHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLFxuICAgICAgdGV4dExhYmVsOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KSxcbiAgICAgIHVwZGF0ZUxheWVyVGV4dExhYmVsOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gICAgfTtcblxuICAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnN0IHt1cGRhdGVMYXllclRleHRMYWJlbCwgdGV4dExhYmVsLCBmaWVsZHN9ID0gdGhpcy5wcm9wcztcbiAgICAgIGNvbnN0IGN1cnJlbnRGaWVsZHMgPSB0ZXh0TGFiZWwubWFwKHRsID0+IHRsLmZpZWxkICYmIHRsLmZpZWxkLm5hbWUpLmZpbHRlcihkID0+IGQpO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPExheWVyQ29uZmlnR3JvdXAgbGFiZWw9eydwYW5lbC50ZXh0LmxhYmVsJ30gY29sbGFwc2libGU+XG4gICAgICAgICAgPENvbmZpZ0dyb3VwQ29sbGFwc2libGVIZWFkZXI+XG4gICAgICAgICAgICA8RmllbGRTZWxlY3RvclxuICAgICAgICAgICAgICBmaWVsZHM9e2ZpZWxkc31cbiAgICAgICAgICAgICAgdmFsdWU9e2N1cnJlbnRGaWVsZHN9XG4gICAgICAgICAgICAgIG9uU2VsZWN0PXtzZWxlY3RlZCA9PiB1cGRhdGVMYXllclRleHRMYWJlbCgnYWxsJywgJ2ZpZWxkcycsIHNlbGVjdGVkKX1cbiAgICAgICAgICAgICAgbXVsdGlTZWxlY3RcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9Db25maWdHcm91cENvbGxhcHNpYmxlSGVhZGVyPlxuICAgICAgICAgIDxDb25maWdHcm91cENvbGxhcHNpYmxlQ29udGVudD5cbiAgICAgICAgICAgIHt0ZXh0TGFiZWwubWFwKCh0bCwgaWR4KSA9PiAoXG4gICAgICAgICAgICAgIDxkaXYga2V5PXt0bC5maWVsZCA/IHRsLmZpZWxkLm5hbWUgOiBgbnVsbC0ke2lkeH1gfT5cbiAgICAgICAgICAgICAgICA8UGFuZWxMYWJlbD5cbiAgICAgICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsncGFuZWwudGV4dC5sYWJlbFdpdGhJZCd9IHZhbHVlcz17e2xhYmVsSWQ6IGlkeCArIDF9fSAvPlxuICAgICAgICAgICAgICAgIDwvUGFuZWxMYWJlbD5cbiAgICAgICAgICAgICAgICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgICAgICAgICAgIDxGaWVsZFNlbGVjdG9yXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkcz17ZmllbGRzfVxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17KHRsLmZpZWxkICYmIHRsLmZpZWxkLm5hbWUpIHx8ICdwbGFjZWhvbGRlci5zZWxlY3RGaWVsZCd9XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXsncGxhY2Vob2xkZXIuZW1wdHknfVxuICAgICAgICAgICAgICAgICAgICBvblNlbGVjdD17diA9PiB1cGRhdGVMYXllclRleHRMYWJlbChpZHgsICdmaWVsZCcsIHYpfVxuICAgICAgICAgICAgICAgICAgICBlcmFzYWJsZVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L1NpZGVQYW5lbFNlY3Rpb24+XG4gICAgICAgICAgICAgICAgPFNpZGVQYW5lbFNlY3Rpb24+XG4gICAgICAgICAgICAgICAgICA8UGFuZWxMYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9XCJwYW5lbC50ZXh0LmZvbnRTaXplXCIgLz5cbiAgICAgICAgICAgICAgICAgIDwvUGFuZWxMYWJlbD5cbiAgICAgICAgICAgICAgICAgIDxSYW5nZVNsaWRlclxuICAgICAgICAgICAgICAgICAgICB7Li4uTEFZRVJfVEVYVF9DT05GSUdTLmZvbnRTaXplfVxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTE9e3RsLnNpemV9XG4gICAgICAgICAgICAgICAgICAgIGlzUmFuZ2U9e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17diA9PiB1cGRhdGVMYXllclRleHRMYWJlbChpZHgsICdzaXplJywgdlsxXSl9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvU2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgICAgICAgICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgICAgICAgICAgIDxQYW5lbExhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD1cInBhbmVsLnRleHQuZm9udENvbG9yXCIgLz5cbiAgICAgICAgICAgICAgICAgIDwvUGFuZWxMYWJlbD5cbiAgICAgICAgICAgICAgICAgIDxDb2xvclNlbGVjdG9yXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yU2V0cz17W1xuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkQ29sb3I6IHRsLmNvbG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q29sb3I6IHYgPT4gdXBkYXRlTGF5ZXJUZXh0TGFiZWwoaWR4LCAnY29sb3InLCB2KVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXX1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgICAgICAgICAgIDxTaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgICAgICAgICAgICAgPFNwYWNlQmV0d2VlbkZsZXhib3g+XG4gICAgICAgICAgICAgICAgICAgIDxTQkZsZXhib3hJdGVtPlxuICAgICAgICAgICAgICAgICAgICAgIDxQYW5lbExhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9XCJwYW5lbC50ZXh0LnRleHRBbmNob3JcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgIDwvUGFuZWxMYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICA8SXRlbVNlbGVjdG9yXG4gICAgICAgICAgICAgICAgICAgICAgICB7Li4uTEFZRVJfVEVYVF9DT05GSUdTLnRleHRBbmNob3J9XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEl0ZW1zPXt0bC5hbmNob3J9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17dmFsID0+IHVwZGF0ZUxheWVyVGV4dExhYmVsKGlkeCwgJ2FuY2hvcicsIHZhbCl9XG4gICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPC9TQkZsZXhib3hJdGVtPlxuICAgICAgICAgICAgICAgICAgICA8U0JGbGV4Ym94SXRlbT5cbiAgICAgICAgICAgICAgICAgICAgICA8UGFuZWxMYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPVwicGFuZWwudGV4dC5hbGlnbm1lbnRcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgIDwvUGFuZWxMYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICA8SXRlbVNlbGVjdG9yXG4gICAgICAgICAgICAgICAgICAgICAgICB7Li4uTEFZRVJfVEVYVF9DT05GSUdTLnRleHRBbGlnbm1lbnR9XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEl0ZW1zPXt0bC5hbGlnbm1lbnR9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17dmFsID0+IHVwZGF0ZUxheWVyVGV4dExhYmVsKGlkeCwgJ2FsaWdubWVudCcsIHZhbCl9XG4gICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPC9TQkZsZXhib3hJdGVtPlxuICAgICAgICAgICAgICAgICAgPC9TcGFjZUJldHdlZW5GbGV4Ym94PlxuICAgICAgICAgICAgICAgIDwvU2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDxTaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgICAgICAgICA8QnV0dG9uIGxpbmsgb25DbGljaz17dmFsID0+IHVwZGF0ZUxheWVyVGV4dExhYmVsKHRleHRMYWJlbC5sZW5ndGgpfT5cbiAgICAgICAgICAgICAgICA8QWRkIGhlaWdodD1cIjEycHhcIiAvPlxuICAgICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPVwicGFuZWwudGV4dC5hZGRNb3JlTGFiZWxcIiAvPlxuICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgIDwvU2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgICA8L0NvbmZpZ0dyb3VwQ29sbGFwc2libGVDb250ZW50PlxuICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBUZXh0TGFiZWxQYW5lbDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgVGV4dExhYmVsUGFuZWxGYWN0b3J5O1xuIl19
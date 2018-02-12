'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  display: flex;\n  justify-content: space-between;\n'], ['\n  display: flex;\n  justify-content: space-between;\n']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n  display: flex;\n  margin-bottom: 8px;\n  align-items: center;\n'], ['\n  display: flex;\n  margin-bottom: 8px;\n  align-items: center;\n']),
    _templateObject3 = (0, _taggedTemplateLiteral3.default)(['\n  width: 30%;\n'], ['\n  width: 30%;\n']),
    _templateObject4 = (0, _taggedTemplateLiteral3.default)(['\n  width: 70%;\n'], ['\n  width: 70%;\n']),
    _templateObject5 = (0, _taggedTemplateLiteral3.default)(['\n  display: flex;\n  justify-content: flex-end;\n  color: ', ';\n\n  :hover {\n    cursor: pointer;\n    color: ', ';\n  }\n'], ['\n  display: flex;\n  justify-content: flex-end;\n  color: ', ';\n\n  :hover {\n    cursor: pointer;\n    color: ', ';\n  }\n']),
    _templateObject6 = (0, _taggedTemplateLiteral3.default)(['\n  margin-right: 4px;\n'], ['\n  margin-right: 4px;\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _defaultSettings = require('../../../constants/default-settings');

var _fieldSelector = require('../../common/field-selector');

var _fieldSelector2 = _interopRequireDefault(_fieldSelector);

var _itemSelector = require('../../common/item-selector/item-selector');

var _itemSelector2 = _interopRequireDefault(_itemSelector);

var _icons = require('../../common/icons');

var _styledComponents3 = require('../../common/styled-components');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  layer: _react.PropTypes.object.isRequired,
  fields: _react.PropTypes.array.isRequired,
  updateLayerConfig: _react.PropTypes.func.isRequired,
  updateLayerType: _react.PropTypes.func.isRequired,
  openModal: _react.PropTypes.func.isRequired,
  fieldPairs: _react.PropTypes.array
};

var typeOptions = Object.keys(_defaultSettings.LAYER_TYPES);

var TopRow = _styledComponents2.default.div(_templateObject);

var LayerColumnConfig = function (_Component) {
  (0, _inherits3.default)(LayerColumnConfig, _Component);

  function LayerColumnConfig() {
    (0, _classCallCheck3.default)(this, LayerColumnConfig);
    return (0, _possibleConstructorReturn3.default)(this, (LayerColumnConfig.__proto__ || Object.getPrototypeOf(LayerColumnConfig)).apply(this, arguments));
  }

  (0, _createClass3.default)(LayerColumnConfig, [{
    key: '_updateColumn',
    value: function _updateColumn(key, value) {
      var layer = this.props.layer;


      var columns = value.pair && layer.columnPairs ? layer.assignColumnPairs(key, value.pair) : layer.assignColumn(key, value);

      this.props.updateLayerConfig({ columns: columns });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          layer = _props.layer,
          fields = _props.fields,
          fieldPairs = _props.fieldPairs;

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          _styledComponents3.SidePanelSection,
          null,
          _react2.default.createElement(TypeSelector, { layer: layer, onSelect: this.props.updateLayerType })
        ),
        _react2.default.createElement(
          _styledComponents3.SidePanelSection,
          null,
          _react2.default.createElement(
            'div',
            { className: 'layer-config__column' },
            _react2.default.createElement(
              TopRow,
              null,
              _react2.default.createElement(
                _styledComponents3.PanelLabel,
                null,
                'Columns'
              ),
              _react2.default.createElement(
                _styledComponents3.PanelLabel,
                null,
                '* Required'
              )
            ),
            Object.keys(layer.config.columns).map(function (key) {
              return _react2.default.createElement(ColumnSelector, {
                column: layer.config.columns[key],
                label: key,
                key: key,
                allFields: fields,
                fieldPairs: layer.columnPairs ? fieldPairs.map(function (fp) {
                  return {
                    name: fp.defaultName,
                    type: 'point',
                    pair: fp.pair
                  };
                }) : null,
                onSelect: function onSelect(val) {
                  return _this2._updateColumn(key, val);
                }
              });
            }),
            layer.type === _defaultSettings.LAYER_TYPES.icon && _react2.default.createElement(IconLayerInfo, { openModal: this.props.openModal })
          )
        )
      );
    }
  }]);
  return LayerColumnConfig;
}(_react.Component);

exports.default = LayerColumnConfig;


LayerColumnConfig.propTypes = propTypes;

var ColumnRow = _styledComponents2.default.div(_templateObject2);

var ColumnName = _styledComponents2.default.div(_templateObject3);
var ColumnSelect = _styledComponents2.default.div(_templateObject4);

var ColumnSelector = function ColumnSelector(_ref) {
  var column = _ref.column,
      label = _ref.label,
      allFields = _ref.allFields,
      onSelect = _ref.onSelect,
      fieldPairs = _ref.fieldPairs;
  return _react2.default.createElement(
    ColumnRow,
    { className: 'layer-config__column__selector' },
    _react2.default.createElement(
      ColumnName,
      { className: 'layer-config__column__name' },
      _react2.default.createElement(
        _styledComponents3.PanelLabel,
        null,
        label
      ),
      !column.optional ? _react2.default.createElement(
        _styledComponents3.PanelLabel,
        null,
        '  *'
      ) : null
    ),
    _react2.default.createElement(
      ColumnSelect,
      { className: 'layer-config__column__select' },
      _react2.default.createElement(_fieldSelector2.default, {
        suggested: fieldPairs,
        error: !column.optional && !column.value,
        fields: allFields,
        value: column.value,
        erasable: Boolean(column.optional),
        onSelect: onSelect
      })
    )
  );
};

var TypeSelector = function TypeSelector(_ref2) {
  var layer = _ref2.layer,
      onSelect = _ref2.onSelect;
  return _react2.default.createElement(
    'div',
    { className: 'layer-config__type' },
    _react2.default.createElement(
      _styledComponents3.PanelLabel,
      null,
      'Layer type'
    ),
    _react2.default.createElement(_itemSelector2.default, {
      selectedItems: layer.type,
      options: typeOptions,
      multiSelect: false,
      placeholder: 'Select A Type',
      onChange: onSelect
    })
  );
};

var LayerInstruction = _styledComponents2.default.div(_templateObject5, function (props) {
  return props.theme.textColor;
}, function (props) {
  return props.theme.textColorHL;
});

var InfoIcon = _styledComponents2.default.div(_templateObject6);

var IconLayerInfo = function IconLayerInfo(_ref3) {
  var openModal = _ref3.openModal;
  return _react2.default.createElement(
    LayerInstruction,
    { className: 'layer-config__info',
      onClick: function onClick() {
        return openModal('iconInfo');
      } },
    _react2.default.createElement(
      InfoIcon,
      null,
      _react2.default.createElement(_icons.Docs, { height: '16px' })
    ),
    _react2.default.createElement(
      _styledComponents3.PanelLabel,
      null,
      'How to draw icon layer'
    )
  );
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvbGF5ZXItY29sdW1uLWNvbmZpZy5qcyJdLCJuYW1lcyI6WyJwcm9wVHlwZXMiLCJsYXllciIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJmaWVsZHMiLCJhcnJheSIsInVwZGF0ZUxheWVyQ29uZmlnIiwiZnVuYyIsInVwZGF0ZUxheWVyVHlwZSIsIm9wZW5Nb2RhbCIsImZpZWxkUGFpcnMiLCJ0eXBlT3B0aW9ucyIsIk9iamVjdCIsImtleXMiLCJUb3BSb3ciLCJkaXYiLCJMYXllckNvbHVtbkNvbmZpZyIsImtleSIsInZhbHVlIiwicHJvcHMiLCJjb2x1bW5zIiwicGFpciIsImNvbHVtblBhaXJzIiwiYXNzaWduQ29sdW1uUGFpcnMiLCJhc3NpZ25Db2x1bW4iLCJjb25maWciLCJtYXAiLCJuYW1lIiwiZnAiLCJkZWZhdWx0TmFtZSIsInR5cGUiLCJfdXBkYXRlQ29sdW1uIiwidmFsIiwiaWNvbiIsIkNvbHVtblJvdyIsIkNvbHVtbk5hbWUiLCJDb2x1bW5TZWxlY3QiLCJDb2x1bW5TZWxlY3RvciIsImNvbHVtbiIsImxhYmVsIiwiYWxsRmllbGRzIiwib25TZWxlY3QiLCJvcHRpb25hbCIsIkJvb2xlYW4iLCJUeXBlU2VsZWN0b3IiLCJMYXllckluc3RydWN0aW9uIiwidGhlbWUiLCJ0ZXh0Q29sb3IiLCJ0ZXh0Q29sb3JITCIsIkluZm9JY29uIiwiSWNvbkxheWVySW5mbyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFFQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBRUE7Ozs7QUFLQSxJQUFNQSxZQUFZO0FBQ2hCQyxTQUFPLGlCQUFVQyxNQUFWLENBQWlCQyxVQURSO0FBRWhCQyxVQUFRLGlCQUFVQyxLQUFWLENBQWdCRixVQUZSO0FBR2hCRyxxQkFBbUIsaUJBQVVDLElBQVYsQ0FBZUos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QUEsU0FDcEI7QUFBQyxvQkFBRDtBQUFBLE1BQWtCLFdBQVUsb0JBQTVCO0FBQ0UsZUFBUztBQUFBLGVBQU1BLFVBQVUsVUFBVixDQUFOO0FBQUEsT0FEWDtBQUVFO0FBQUMsY0FBRDtBQUFBO0FBQVUsbURBQU0sUUFBTyxNQUFiO0FBQVYsS0FGRjtBQUdFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFIRixHQURvQjtBQUFBLENBQXRCIiwiZmlsZSI6ImxheWVyLWNvbHVtbi1jb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnQsIFByb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5cbmltcG9ydCB7TEFZRVJfVFlQRVN9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcbmltcG9ydCBGaWVsZFNlbGVjdG9yIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ZpZWxkLXNlbGVjdG9yJztcbmltcG9ydCBJdGVtU2VsZWN0b3IgZnJvbSAnY29tcG9uZW50cy9jb21tb24vaXRlbS1zZWxlY3Rvci9pdGVtLXNlbGVjdG9yJztcbmltcG9ydCB7RG9jc30gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuXG5pbXBvcnQge1xuICBQYW5lbExhYmVsLFxuICBTaWRlUGFuZWxTZWN0aW9uXG59IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICBsYXllcjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBmaWVsZHM6IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICB1cGRhdGVMYXllckNvbmZpZzogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgdXBkYXRlTGF5ZXJUeXBlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBvcGVuTW9kYWw6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGZpZWxkUGFpcnM6IFByb3BUeXBlcy5hcnJheVxufTtcblxuY29uc3QgdHlwZU9wdGlvbnMgPSBPYmplY3Qua2V5cyhMQVlFUl9UWVBFUyk7XG5cbmNvbnN0IFRvcFJvdyA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbmA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExheWVyQ29sdW1uQ29uZmlnIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgX3VwZGF0ZUNvbHVtbihrZXksIHZhbHVlKSB7XG4gICAgY29uc3Qge2xheWVyfSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCBjb2x1bW5zID1cbiAgICAgIHZhbHVlLnBhaXIgJiYgbGF5ZXIuY29sdW1uUGFpcnNcbiAgICAgICAgPyBsYXllci5hc3NpZ25Db2x1bW5QYWlycyhrZXksIHZhbHVlLnBhaXIpXG4gICAgICAgIDogbGF5ZXIuYXNzaWduQ29sdW1uKGtleSwgdmFsdWUpO1xuXG4gICAgdGhpcy5wcm9wcy51cGRhdGVMYXllckNvbmZpZyh7Y29sdW1uc30pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtsYXllciwgZmllbGRzLCBmaWVsZFBhaXJzfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxTaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgICAgIDxUeXBlU2VsZWN0b3IgbGF5ZXI9e2xheWVyfSBvblNlbGVjdD17dGhpcy5wcm9wcy51cGRhdGVMYXllclR5cGV9IC8+XG4gICAgICAgIDwvU2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgPFNpZGVQYW5lbFNlY3Rpb24+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsYXllci1jb25maWdfX2NvbHVtblwiPlxuICAgICAgICAgIDxUb3BSb3c+XG4gICAgICAgICAgICA8UGFuZWxMYWJlbD5Db2x1bW5zPC9QYW5lbExhYmVsPlxuICAgICAgICAgICAgPFBhbmVsTGFiZWw+KiBSZXF1aXJlZDwvUGFuZWxMYWJlbD5cbiAgICAgICAgICA8L1RvcFJvdz5cbiAgICAgICAgICB7T2JqZWN0LmtleXMobGF5ZXIuY29uZmlnLmNvbHVtbnMpLm1hcChrZXkgPT4gKFxuICAgICAgICAgICAgPENvbHVtblNlbGVjdG9yXG4gICAgICAgICAgICAgIGNvbHVtbj17bGF5ZXIuY29uZmlnLmNvbHVtbnNba2V5XX1cbiAgICAgICAgICAgICAgbGFiZWw9e2tleX1cbiAgICAgICAgICAgICAga2V5PXtrZXl9XG4gICAgICAgICAgICAgIGFsbEZpZWxkcz17ZmllbGRzfVxuICAgICAgICAgICAgICBmaWVsZFBhaXJzPXtcbiAgICAgICAgICAgICAgICBsYXllci5jb2x1bW5QYWlyc1xuICAgICAgICAgICAgICAgICAgPyBmaWVsZFBhaXJzLm1hcChmcCA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGZwLmRlZmF1bHROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwb2ludCcsXG4gICAgICAgICAgICAgICAgICAgICAgcGFpcjogZnAucGFpclxuICAgICAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICAgIDogbnVsbFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG9uU2VsZWN0PXt2YWwgPT4gdGhpcy5fdXBkYXRlQ29sdW1uKGtleSwgdmFsKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSl9XG4gICAgICAgICAge2xheWVyLnR5cGUgPT09IExBWUVSX1RZUEVTLmljb24gJiYgKFxuICAgICAgICAgICAgPEljb25MYXllckluZm8gb3Blbk1vZGFsPXt0aGlzLnByb3BzLm9wZW5Nb2RhbH0gLz5cbiAgICAgICAgICApfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L1NpZGVQYW5lbFNlY3Rpb24+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbkxheWVyQ29sdW1uQ29uZmlnLnByb3BUeXBlcyA9IHByb3BUeXBlcztcblxuY29uc3QgQ29sdW1uUm93ID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgbWFyZ2luLWJvdHRvbTogOHB4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuYDtcblxuY29uc3QgQ29sdW1uTmFtZSA9IHN0eWxlZC5kaXZgXG4gIHdpZHRoOiAzMCU7XG5gO1xuY29uc3QgQ29sdW1uU2VsZWN0ID0gc3R5bGVkLmRpdmBcbiAgd2lkdGg6IDcwJTtcbmA7XG5cbmNvbnN0IENvbHVtblNlbGVjdG9yID0gKHtjb2x1bW4sIGxhYmVsLCBhbGxGaWVsZHMsIG9uU2VsZWN0LCBmaWVsZFBhaXJzfSkgPT4gKFxuICA8Q29sdW1uUm93IGNsYXNzTmFtZT1cImxheWVyLWNvbmZpZ19fY29sdW1uX19zZWxlY3RvclwiPlxuICAgIDxDb2x1bW5OYW1lIGNsYXNzTmFtZT1cImxheWVyLWNvbmZpZ19fY29sdW1uX19uYW1lXCI+XG4gICAgICA8UGFuZWxMYWJlbD57bGFiZWx9PC9QYW5lbExhYmVsPlxuICAgICAgeyFjb2x1bW4ub3B0aW9uYWwgPyA8UGFuZWxMYWJlbD57YCAgKmB9PC9QYW5lbExhYmVsPiA6IG51bGx9XG4gICAgPC9Db2x1bW5OYW1lPlxuICAgIDxDb2x1bW5TZWxlY3QgY2xhc3NOYW1lPVwibGF5ZXItY29uZmlnX19jb2x1bW5fX3NlbGVjdFwiPlxuICAgICAgPEZpZWxkU2VsZWN0b3JcbiAgICAgICAgc3VnZ2VzdGVkPXtmaWVsZFBhaXJzfVxuICAgICAgICBlcnJvcj17IWNvbHVtbi5vcHRpb25hbCAmJiAhY29sdW1uLnZhbHVlfVxuICAgICAgICBmaWVsZHM9e2FsbEZpZWxkc31cbiAgICAgICAgdmFsdWU9e2NvbHVtbi52YWx1ZX1cbiAgICAgICAgZXJhc2FibGU9e0Jvb2xlYW4oY29sdW1uLm9wdGlvbmFsKX1cbiAgICAgICAgb25TZWxlY3Q9e29uU2VsZWN0fVxuICAgICAgLz5cbiAgICA8L0NvbHVtblNlbGVjdD5cbiAgPC9Db2x1bW5Sb3c+XG4pO1xuXG5jb25zdCBUeXBlU2VsZWN0b3IgPSAoe2xheWVyLCBvblNlbGVjdH0pID0+IChcbiAgPGRpdiBjbGFzc05hbWU9XCJsYXllci1jb25maWdfX3R5cGVcIj5cbiAgICA8UGFuZWxMYWJlbD5MYXllciB0eXBlPC9QYW5lbExhYmVsPlxuICAgIDxJdGVtU2VsZWN0b3JcbiAgICAgIHNlbGVjdGVkSXRlbXM9e2xheWVyLnR5cGV9XG4gICAgICBvcHRpb25zPXt0eXBlT3B0aW9uc31cbiAgICAgIG11bHRpU2VsZWN0PXtmYWxzZX1cbiAgICAgIHBsYWNlaG9sZGVyPVwiU2VsZWN0IEEgVHlwZVwiXG4gICAgICBvbkNoYW5nZT17b25TZWxlY3R9XG4gICAgLz5cbiAgPC9kaXY+XG4pO1xuXG5jb25zdCBMYXllckluc3RydWN0aW9uID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yfTtcblxuICA6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JITH07XG4gIH1cbmA7XG5cbmNvbnN0IEluZm9JY29uID0gc3R5bGVkLmRpdmBcbiAgbWFyZ2luLXJpZ2h0OiA0cHg7XG5gO1xuXG5jb25zdCBJY29uTGF5ZXJJbmZvID0gKHtvcGVuTW9kYWx9KSA9PiAoXG4gIDxMYXllckluc3RydWN0aW9uIGNsYXNzTmFtZT1cImxheWVyLWNvbmZpZ19faW5mb1wiXG4gICAgb25DbGljaz17KCkgPT4gb3Blbk1vZGFsKCdpY29uSW5mbycpfT5cbiAgICA8SW5mb0ljb24+PERvY3MgaGVpZ2h0PVwiMTZweFwiLz48L0luZm9JY29uPlxuICAgIDxQYW5lbExhYmVsPkhvdyB0byBkcmF3IGljb24gbGF5ZXI8L1BhbmVsTGFiZWw+XG4gIDwvTGF5ZXJJbnN0cnVjdGlvbj5cbik7XG4iXX0=
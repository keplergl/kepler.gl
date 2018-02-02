'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: flex;\n  justify-content: space-between;\n'], ['\n  display: flex;\n  justify-content: space-between;\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: flex;\n  margin-bottom: 8px;\n  align-items: center;\n'], ['\n  display: flex;\n  margin-bottom: 8px;\n  align-items: center;\n']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  width: 30%;\n'], ['\n  width: 30%;\n']),
    _templateObject4 = (0, _taggedTemplateLiteralLoose3.default)(['\n  width: 70%;\n'], ['\n  width: 70%;\n']),
    _templateObject5 = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: flex;\n  justify-content: flex-end;\n  color: ', ';\n\n  :hover {\n    cursor: pointer;\n    color: ', ';\n  }\n'], ['\n  display: flex;\n  justify-content: flex-end;\n  color: ', ';\n\n  :hover {\n    cursor: pointer;\n    color: ', ';\n  }\n']),
    _templateObject6 = (0, _taggedTemplateLiteralLoose3.default)(['\n  margin-right: 4px;\n'], ['\n  margin-right: 4px;\n']);

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
    return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
  }

  LayerColumnConfig.prototype._updateColumn = function _updateColumn(key, value) {
    var layer = this.props.layer;


    var columns = value.pair && layer.columnPairs ? layer.assignColumnPairs(key, value.pair) : layer.assignColumn(key, value);

    this.props.updateLayerConfig({ columns: columns });
  };

  LayerColumnConfig.prototype.render = function render() {
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
  };

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvbGF5ZXItY29sdW1uLWNvbmZpZy5qcyJdLCJuYW1lcyI6WyJwcm9wVHlwZXMiLCJsYXllciIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJmaWVsZHMiLCJhcnJheSIsInVwZGF0ZUxheWVyQ29uZmlnIiwiZnVuYyIsInVwZGF0ZUxheWVyVHlwZSIsIm9wZW5Nb2RhbCIsImZpZWxkUGFpcnMiLCJ0eXBlT3B0aW9ucyIsIk9iamVjdCIsImtleXMiLCJUb3BSb3ciLCJkaXYiLCJMYXllckNvbHVtbkNvbmZpZyIsIl91cGRhdGVDb2x1bW4iLCJrZXkiLCJ2YWx1ZSIsInByb3BzIiwiY29sdW1ucyIsInBhaXIiLCJjb2x1bW5QYWlycyIsImFzc2lnbkNvbHVtblBhaXJzIiwiYXNzaWduQ29sdW1uIiwicmVuZGVyIiwiY29uZmlnIiwibWFwIiwibmFtZSIsImZwIiwiZGVmYXVsdE5hbWUiLCJ0eXBlIiwidmFsIiwiaWNvbiIsIkNvbHVtblJvdyIsIkNvbHVtbk5hbWUiLCJDb2x1bW5TZWxlY3QiLCJDb2x1bW5TZWxlY3RvciIsImNvbHVtbiIsImxhYmVsIiwiYWxsRmllbGRzIiwib25TZWxlY3QiLCJvcHRpb25hbCIsIkJvb2xlYW4iLCJUeXBlU2VsZWN0b3IiLCJMYXllckluc3RydWN0aW9uIiwidGhlbWUiLCJ0ZXh0Q29sb3IiLCJ0ZXh0Q29sb3JITCIsIkluZm9JY29uIiwiSWNvbkxheWVySW5mbyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUVBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFFQTs7OztBQUtBLElBQU1BLFlBQVk7QUFDaEJDLFNBQU8saUJBQVVDLE1BQVYsQ0FBaUJDLFVBRFI7QUFFaEJDLFVBQVEsaUJBQVVDLEtBQVYsQ0FBZ0JGLFVBRlI7QUFHaEJHLHFCQUFtQixpQkFBVUMsSUFBVixD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QUUxQyxTQUFGLFNBQUVBLFNBQUY7QUFBQSxTQUNwQjtBQUFDLG9CQUFEO0FBQUEsTUFBa0IsV0FBVSxvQkFBNUI7QUFDRSxlQUFTO0FBQUEsZUFBTUEsVUFBVSxVQUFWLENBQU47QUFBQSxPQURYO0FBRUU7QUFBQyxjQUFEO0FBQUE7QUFBVSxtREFBTSxRQUFPLE1BQWI7QUFBVixLQUZGO0FBR0U7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUhGLEdBRG9CO0FBQUEsQ0FBdEIiLCJmaWxlIjoibGF5ZXItY29sdW1uLWNvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudCwgUHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcblxuaW1wb3J0IHtMQVlFUl9UWVBFU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IEZpZWxkU2VsZWN0b3IgZnJvbSAnY29tcG9uZW50cy9jb21tb24vZmllbGQtc2VsZWN0b3InO1xuaW1wb3J0IEl0ZW1TZWxlY3RvciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL2l0ZW0tc2VsZWN0b3InO1xuaW1wb3J0IHtEb2NzfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5cbmltcG9ydCB7XG4gIFBhbmVsTGFiZWwsXG4gIFNpZGVQYW5lbFNlY3Rpb25cbn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIGxheWVyOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGZpZWxkczogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gIHVwZGF0ZUxheWVyQ29uZmlnOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB1cGRhdGVMYXllclR5cGU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIG9wZW5Nb2RhbDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgZmllbGRQYWlyczogUHJvcFR5cGVzLmFycmF5XG59O1xuXG5jb25zdCB0eXBlT3B0aW9ucyA9IE9iamVjdC5rZXlzKExBWUVSX1RZUEVTKTtcblxuY29uc3QgVG9wUm93ID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuYDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGF5ZXJDb2x1bW5Db25maWcgZXh0ZW5kcyBDb21wb25lbnQge1xuICBfdXBkYXRlQ29sdW1uKGtleSwgdmFsdWUpIHtcbiAgICBjb25zdCB7bGF5ZXJ9ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IGNvbHVtbnMgPVxuICAgICAgdmFsdWUucGFpciAmJiBsYXllci5jb2x1bW5QYWlyc1xuICAgICAgICA/IGxheWVyLmFzc2lnbkNvbHVtblBhaXJzKGtleSwgdmFsdWUucGFpcilcbiAgICAgICAgOiBsYXllci5hc3NpZ25Db2x1bW4oa2V5LCB2YWx1ZSk7XG5cbiAgICB0aGlzLnByb3BzLnVwZGF0ZUxheWVyQ29uZmlnKHtjb2x1bW5zfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge2xheWVyLCBmaWVsZHMsIGZpZWxkUGFpcnN9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPFNpZGVQYW5lbFNlY3Rpb24+XG4gICAgICAgICAgPFR5cGVTZWxlY3RvciBsYXllcj17bGF5ZXJ9IG9uU2VsZWN0PXt0aGlzLnByb3BzLnVwZGF0ZUxheWVyVHlwZX0gLz5cbiAgICAgICAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxheWVyLWNvbmZpZ19fY29sdW1uXCI+XG4gICAgICAgICAgPFRvcFJvdz5cbiAgICAgICAgICAgIDxQYW5lbExhYmVsPkNvbHVtbnM8L1BhbmVsTGFiZWw+XG4gICAgICAgICAgICA8UGFuZWxMYWJlbD4qIFJlcXVpcmVkPC9QYW5lbExhYmVsPlxuICAgICAgICAgIDwvVG9wUm93PlxuICAgICAgICAgIHtPYmplY3Qua2V5cyhsYXllci5jb25maWcuY29sdW1ucykubWFwKGtleSA9PiAoXG4gICAgICAgICAgICA8Q29sdW1uU2VsZWN0b3JcbiAgICAgICAgICAgICAgY29sdW1uPXtsYXllci5jb25maWcuY29sdW1uc1trZXldfVxuICAgICAgICAgICAgICBsYWJlbD17a2V5fVxuICAgICAgICAgICAgICBrZXk9e2tleX1cbiAgICAgICAgICAgICAgYWxsRmllbGRzPXtmaWVsZHN9XG4gICAgICAgICAgICAgIGZpZWxkUGFpcnM9e1xuICAgICAgICAgICAgICAgIGxheWVyLmNvbHVtblBhaXJzXG4gICAgICAgICAgICAgICAgICA/IGZpZWxkUGFpcnMubWFwKGZwID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgbmFtZTogZnAuZGVmYXVsdE5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3BvaW50JyxcbiAgICAgICAgICAgICAgICAgICAgICBwYWlyOiBmcC5wYWlyXG4gICAgICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgICAgOiBudWxsXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgb25TZWxlY3Q9e3ZhbCA9PiB0aGlzLl91cGRhdGVDb2x1bW4oa2V5LCB2YWwpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApKX1cbiAgICAgICAgICB7bGF5ZXIudHlwZSA9PT0gTEFZRVJfVFlQRVMuaWNvbiAmJiAoXG4gICAgICAgICAgICA8SWNvbkxheWVySW5mbyBvcGVuTW9kYWw9e3RoaXMucHJvcHMub3Blbk1vZGFsfSAvPlxuICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvU2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuTGF5ZXJDb2x1bW5Db25maWcucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuXG5jb25zdCBDb2x1bW5Sb3cgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBtYXJnaW4tYm90dG9tOiA4cHg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5gO1xuXG5jb25zdCBDb2x1bW5OYW1lID0gc3R5bGVkLmRpdmBcbiAgd2lkdGg6IDMwJTtcbmA7XG5jb25zdCBDb2x1bW5TZWxlY3QgPSBzdHlsZWQuZGl2YFxuICB3aWR0aDogNzAlO1xuYDtcblxuY29uc3QgQ29sdW1uU2VsZWN0b3IgPSAoe2NvbHVtbiwgbGFiZWwsIGFsbEZpZWxkcywgb25TZWxlY3QsIGZpZWxkUGFpcnN9KSA9PiAoXG4gIDxDb2x1bW5Sb3cgY2xhc3NOYW1lPVwibGF5ZXItY29uZmlnX19jb2x1bW5fX3NlbGVjdG9yXCI+XG4gICAgPENvbHVtbk5hbWUgY2xhc3NOYW1lPVwibGF5ZXItY29uZmlnX19jb2x1bW5fX25hbWVcIj5cbiAgICAgIDxQYW5lbExhYmVsPntsYWJlbH08L1BhbmVsTGFiZWw+XG4gICAgICB7IWNvbHVtbi5vcHRpb25hbCA/IDxQYW5lbExhYmVsPntgICAqYH08L1BhbmVsTGFiZWw+IDogbnVsbH1cbiAgICA8L0NvbHVtbk5hbWU+XG4gICAgPENvbHVtblNlbGVjdCBjbGFzc05hbWU9XCJsYXllci1jb25maWdfX2NvbHVtbl9fc2VsZWN0XCI+XG4gICAgICA8RmllbGRTZWxlY3RvclxuICAgICAgICBzdWdnZXN0ZWQ9e2ZpZWxkUGFpcnN9XG4gICAgICAgIGVycm9yPXshY29sdW1uLm9wdGlvbmFsICYmICFjb2x1bW4udmFsdWV9XG4gICAgICAgIGZpZWxkcz17YWxsRmllbGRzfVxuICAgICAgICB2YWx1ZT17Y29sdW1uLnZhbHVlfVxuICAgICAgICBlcmFzYWJsZT17Qm9vbGVhbihjb2x1bW4ub3B0aW9uYWwpfVxuICAgICAgICBvblNlbGVjdD17b25TZWxlY3R9XG4gICAgICAvPlxuICAgIDwvQ29sdW1uU2VsZWN0PlxuICA8L0NvbHVtblJvdz5cbik7XG5cbmNvbnN0IFR5cGVTZWxlY3RvciA9ICh7bGF5ZXIsIG9uU2VsZWN0fSkgPT4gKFxuICA8ZGl2IGNsYXNzTmFtZT1cImxheWVyLWNvbmZpZ19fdHlwZVwiPlxuICAgIDxQYW5lbExhYmVsPkxheWVyIHR5cGU8L1BhbmVsTGFiZWw+XG4gICAgPEl0ZW1TZWxlY3RvclxuICAgICAgc2VsZWN0ZWRJdGVtcz17bGF5ZXIudHlwZX1cbiAgICAgIG9wdGlvbnM9e3R5cGVPcHRpb25zfVxuICAgICAgbXVsdGlTZWxlY3Q9e2ZhbHNlfVxuICAgICAgcGxhY2Vob2xkZXI9XCJTZWxlY3QgQSBUeXBlXCJcbiAgICAgIG9uQ2hhbmdlPXtvblNlbGVjdH1cbiAgICAvPlxuICA8L2Rpdj5cbik7XG5cbmNvbnN0IExheWVySW5zdHJ1Y3Rpb24gPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuXG4gIDpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckhMfTtcbiAgfVxuYDtcblxuY29uc3QgSW5mb0ljb24gPSBzdHlsZWQuZGl2YFxuICBtYXJnaW4tcmlnaHQ6IDRweDtcbmA7XG5cbmNvbnN0IEljb25MYXllckluZm8gPSAoe29wZW5Nb2RhbH0pID0+IChcbiAgPExheWVySW5zdHJ1Y3Rpb24gY2xhc3NOYW1lPVwibGF5ZXItY29uZmlnX19pbmZvXCJcbiAgICBvbkNsaWNrPXsoKSA9PiBvcGVuTW9kYWwoJ2ljb25JbmZvJyl9PlxuICAgIDxJbmZvSWNvbj48RG9jcyBoZWlnaHQ9XCIxNnB4XCIvPjwvSW5mb0ljb24+XG4gICAgPFBhbmVsTGFiZWw+SG93IHRvIGRyYXcgaWNvbiBsYXllcjwvUGFuZWxMYWJlbD5cbiAgPC9MYXllckluc3RydWN0aW9uPlxuKTtcbiJdfQ==
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: flex;\n  margin-bottom: 12px;\n'], ['\n  display: flex;\n  margin-bottom: 12px;\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  width: 30%;\n'], ['\n  width: 30%;\n']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  width: 70%;\n'], ['\n  width: 70%;\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _defaultSettings = require('../../../constants/default-settings');

var _fieldSelector = require('../../common/field-selector');

var _fieldSelector2 = _interopRequireDefault(_fieldSelector);

var _itemSelector = require('../../common/item-selector/item-selector');

var _itemSelector2 = _interopRequireDefault(_itemSelector);

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
          { style: { display: 'flex', justifyContent: 'space-between' } },
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
    );
  };

  return LayerColumnConfig;
}(_react.Component);

exports.default = LayerColumnConfig;


LayerColumnConfig.propTypes = propTypes;

var ColumnRow = _styledComponents2.default.div(_templateObject);

var ColumnName = _styledComponents2.default.div(_templateObject2);
var ColumnSelect = _styledComponents2.default.div(_templateObject3);

var ColumnSelector = function ColumnSelector(_ref) {
  var column = _ref.column,
      label = _ref.label,
      allFields = _ref.allFields,
      onSelect = _ref.onSelect,
      fieldPairs = _ref.fieldPairs;
  return _react2.default.createElement(
    ColumnRow,
    null,
    _react2.default.createElement(
      ColumnName,
      null,
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
      null,
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
    null,
    _react2.default.createElement(
      _styledComponents3.PanelLabel,
      null,
      'layer type'
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

var IconLayerInfo = function IconLayerInfo(_ref3) {
  var openModal = _ref3.openModal;
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'a',
      { className: 'info-link link-btn', onClick: function onClick() {
          return openModal('iconInfo');
        } },
      _react2.default.createElement('i', { className: 'icon icon_help push-tiny--right zeta' }),
      _react2.default.createElement(
        'span',
        { className: 'small transition--slow' },
        'How to draw icon layer'
      )
    )
  );
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvbGF5ZXItY29sdW1uLWNvbmZpZy5qcyJdLCJuYW1lcyI6WyJwcm9wVHlwZXMiLCJsYXllciIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJmaWVsZHMiLCJhcnJheSIsInVwZGF0ZUxheWVyQ29uZmlnIiwiZnVuYyIsInVwZGF0ZUxheWVyVHlwZSIsIm9wZW5Nb2RhbCIsImZpZWxkUGFpcnMiLCJ0eXBlT3B0aW9ucyIsIk9iamVjdCIsImtleXMiLCJMYXllckNvbHVtbkNvbmZpZyIsIl91cGRhdGVDb2x1bW4iLCJrZXkiLCJ2YWx1ZSIsInByb3BzIiwiY29sdW1ucyIsInBhaXIiLCJjb2x1bW5QYWlycyIsImFzc2lnbkNvbHVtblBhaXJzIiwiYXNzaWduQ29sdW1uIiwicmVuZGVyIiwiZGlzcGxheSIsImp1c3RpZnlDb250ZW50IiwiY29uZmlnIiwibWFwIiwibmFtZSIsImZwIiwiZGVmYXVsdE5hbWUiLCJ0eXBlIiwidmFsIiwiaWNvbiIsIkNvbHVtblJvdyIsImRpdiIsIkNvbHVtbk5hbWUiLCJDb2x1bW5TZWxlY3QiLCJDb2x1bW5TZWxlY3RvciIsImNvbHVtbiIsImxhYmVsIiwiYWxsRmllbGRzIiwib25TZWxlY3QiLCJvcHRpb25hbCIsIkJvb2xlYW4iLCJUeXBlU2VsZWN0b3IiLCJJY29uTGF5ZXJJbmZvIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBRUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUEsSUFBTUEsWUFBWTtBQUNoQkMsU0FBTyxpQkFBVUMsTUFBVixDQUFpQkMsVUFEUjtBQUVoQkMsVUFBUSxpQkFBVUMsS0FBVixDQUFnQkYsVUFGUjtBQUdoQkcscUJBQW1CLGlCQUFVQyxJQUFWLENBQWVKLFVBSGxCO0FBSWhCSyxtQkFBaUIsaUJBQVVELElBQVYsQ0FBZUosVUFKaEI7QUFLaEJN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QU9JLFFBQVIsR0FBbUI7QUFBQTtBQUFBO0FBQUE7QUFBQSxPQUFuQixHQUFzRDtBQUZ6RCxLQURGO0FBS0U7QUFBQyxrQkFBRDtBQUFBO0FBQ0U7QUFDRSxtQkFBV2xDLFVBRGI7QUFFRSxlQUFPLENBQUM4QixPQUFPSSxRQUFSLElBQW9CLENBQUNKLE9BQU92QixLQUZyQztBQUdFLGdCQUFReUIsU0FIVjtBQUlFLGVBQU9GLE9BQU92QixLQUpoQjtBQUtFLGtCQUFVNEIsUUFBUUwsT0FBT0ksUUFBZixDQUxaO0FBTUUsa0JBQVVEO0FBTlo7QUFERjtBQUxGLEdBRHFCO0FBQUEsQ0FBdkI7O0FBbUJBLElBQU1HLGVBQWUsU0FBZkEsWUFBZTtBQUFBLE1BQUU3QyxLQUFGLFNBQUVBLEtBQUY7QUFBQSxNQUFTMEMsUUFBVCxTQUFTQSxRQUFUO0FBQUEsU0FDbkI7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQURGO0FBRUU7QUFDRSxxQkFBZTFDLE1BQU0rQixJQUR2QjtBQUVFLGVBQVNyQixXQUZYO0FBR0UsbUJBQWEsS0FIZjtBQUlFLG1CQUFZLGVBSmQ7QUFLRSxnQkFBVWdDO0FBTFo7QUFGRixHQURtQjtBQUFBLENBQXJCOztBQWFBLElBQU1JLGdCQUFnQixTQUFoQkEsYUFBZ0I7QUFBQSxNQUFFdEMsU0FBRixTQUFFQSxTQUFGO0FBQUEsU0FDcEI7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLFFBQUcsV0FBVSxvQkFBYixFQUFrQyxTQUFTO0FBQUEsaUJBQU1BLFVBQVUsVUFBVixDQUFOO0FBQUEsU0FBM0M7QUFDRSwyQ0FBRyxXQUFVLHNDQUFiLEdBREY7QUFFRTtBQUFBO0FBQUEsVUFBTSxXQUFVLHdCQUFoQjtBQUFBO0FBQUE7QUFGRjtBQURGLEdBRG9CO0FBQUEsQ0FBdEIiLCJmaWxlIjoibGF5ZXItY29sdW1uLWNvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudCwgUHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcblxuaW1wb3J0IHtMQVlFUl9UWVBFU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IEZpZWxkU2VsZWN0b3IgZnJvbSAnY29tcG9uZW50cy9jb21tb24vZmllbGQtc2VsZWN0b3InO1xuaW1wb3J0IEl0ZW1TZWxlY3RvciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL2l0ZW0tc2VsZWN0b3InO1xuaW1wb3J0IHtQYW5lbExhYmVsLCBTaWRlUGFuZWxTZWN0aW9ufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgbGF5ZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgZmllbGRzOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgdXBkYXRlTGF5ZXJDb25maWc6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHVwZGF0ZUxheWVyVHlwZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgb3Blbk1vZGFsOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBmaWVsZFBhaXJzOiBQcm9wVHlwZXMuYXJyYXlcbn07XG5cbmNvbnN0IHR5cGVPcHRpb25zID0gT2JqZWN0LmtleXMoTEFZRVJfVFlQRVMpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXllckNvbHVtbkNvbmZpZyBleHRlbmRzIENvbXBvbmVudCB7XG4gIF91cGRhdGVDb2x1bW4oa2V5LCB2YWx1ZSkge1xuICAgIGNvbnN0IHtsYXllcn0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgY29sdW1ucyA9IHZhbHVlLnBhaXIgJiYgbGF5ZXIuY29sdW1uUGFpcnMgP1xuICAgICAgbGF5ZXIuYXNzaWduQ29sdW1uUGFpcnMoa2V5LCB2YWx1ZS5wYWlyKSA6XG4gICAgICBsYXllci5hc3NpZ25Db2x1bW4oa2V5LCB2YWx1ZSk7XG5cbiAgICB0aGlzLnByb3BzLnVwZGF0ZUxheWVyQ29uZmlnKHtjb2x1bW5zfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge2xheWVyLCBmaWVsZHMsIGZpZWxkUGFpcnN9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgICAgIDxUeXBlU2VsZWN0b3IgbGF5ZXI9e2xheWVyfSBvblNlbGVjdD17dGhpcy5wcm9wcy51cGRhdGVMYXllclR5cGV9Lz5cbiAgICAgICAgICA8L1NpZGVQYW5lbFNlY3Rpb24+XG4gICAgICAgICAgPFNpZGVQYW5lbFNlY3Rpb24+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTogJ2ZsZXgnLCBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nfX0+XG4gICAgICAgICAgICAgIDxQYW5lbExhYmVsPkNvbHVtbnM8L1BhbmVsTGFiZWw+XG4gICAgICAgICAgICAgIDxQYW5lbExhYmVsPiogUmVxdWlyZWQ8L1BhbmVsTGFiZWw+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIHtPYmplY3Qua2V5cyhsYXllci5jb25maWcuY29sdW1ucykubWFwKGtleSA9PiAoXG4gICAgICAgICAgICAgIDxDb2x1bW5TZWxlY3RvclxuICAgICAgICAgICAgICAgIGNvbHVtbj17bGF5ZXIuY29uZmlnLmNvbHVtbnNba2V5XX1cbiAgICAgICAgICAgICAgICBsYWJlbD17a2V5fVxuICAgICAgICAgICAgICAgIGtleT17a2V5fVxuICAgICAgICAgICAgICAgIGFsbEZpZWxkcz17ZmllbGRzfVxuICAgICAgICAgICAgICAgIGZpZWxkUGFpcnM9e2xheWVyLmNvbHVtblBhaXJzID8gZmllbGRQYWlycy5tYXAoZnAgPT4gKHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6IGZwLmRlZmF1bHROYW1lLFxuICAgICAgICAgICAgICAgICAgdHlwZTogJ3BvaW50JyxcbiAgICAgICAgICAgICAgICAgIHBhaXI6IGZwLnBhaXJcbiAgICAgICAgICAgICAgICB9KSkgOiBudWxsfVxuICAgICAgICAgICAgICAgIG9uU2VsZWN0PXt2YWwgPT4gdGhpcy5fdXBkYXRlQ29sdW1uKGtleSwgdmFsKX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgICAge2xheWVyLnR5cGUgPT09IExBWUVSX1RZUEVTLmljb24gJiYgKFxuICAgICAgICAgICAgICA8SWNvbkxheWVySW5mbyBvcGVuTW9kYWw9e3RoaXMucHJvcHMub3Blbk1vZGFsfSAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L1NpZGVQYW5lbFNlY3Rpb24+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbkxheWVyQ29sdW1uQ29uZmlnLnByb3BUeXBlcyA9IHByb3BUeXBlcztcblxuY29uc3QgQ29sdW1uUm93ID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgbWFyZ2luLWJvdHRvbTogMTJweDtcbmA7XG5cbmNvbnN0IENvbHVtbk5hbWUgPSBzdHlsZWQuZGl2YFxuICB3aWR0aDogMzAlO1xuYDtcbmNvbnN0IENvbHVtblNlbGVjdCA9IHN0eWxlZC5kaXZgXG4gIHdpZHRoOiA3MCU7XG5gO1xuXG5jb25zdCBDb2x1bW5TZWxlY3RvciA9ICh7Y29sdW1uLCBsYWJlbCwgYWxsRmllbGRzLCBvblNlbGVjdCwgZmllbGRQYWlyc30pID0+IChcbiAgPENvbHVtblJvdz5cbiAgICA8Q29sdW1uTmFtZT5cbiAgICAgIDxQYW5lbExhYmVsPntsYWJlbH08L1BhbmVsTGFiZWw+XG4gICAgICB7IWNvbHVtbi5vcHRpb25hbCA/IDxQYW5lbExhYmVsPntgICAqYH08L1BhbmVsTGFiZWw+IDogbnVsbH1cbiAgICA8L0NvbHVtbk5hbWU+XG4gICAgPENvbHVtblNlbGVjdD5cbiAgICAgIDxGaWVsZFNlbGVjdG9yXG4gICAgICAgIHN1Z2dlc3RlZD17ZmllbGRQYWlyc31cbiAgICAgICAgZXJyb3I9eyFjb2x1bW4ub3B0aW9uYWwgJiYgIWNvbHVtbi52YWx1ZX1cbiAgICAgICAgZmllbGRzPXthbGxGaWVsZHN9XG4gICAgICAgIHZhbHVlPXtjb2x1bW4udmFsdWV9XG4gICAgICAgIGVyYXNhYmxlPXtCb29sZWFuKGNvbHVtbi5vcHRpb25hbCl9XG4gICAgICAgIG9uU2VsZWN0PXtvblNlbGVjdH1cbiAgICAgIC8+XG4gICAgPC9Db2x1bW5TZWxlY3Q+XG4gIDwvQ29sdW1uUm93PlxuKTtcblxuY29uc3QgVHlwZVNlbGVjdG9yID0gKHtsYXllciwgb25TZWxlY3R9KSA9PiAoXG4gIDxkaXY+XG4gICAgPFBhbmVsTGFiZWw+bGF5ZXIgdHlwZTwvUGFuZWxMYWJlbD5cbiAgICA8SXRlbVNlbGVjdG9yXG4gICAgICBzZWxlY3RlZEl0ZW1zPXtsYXllci50eXBlfVxuICAgICAgb3B0aW9ucz17dHlwZU9wdGlvbnN9XG4gICAgICBtdWx0aVNlbGVjdD17ZmFsc2V9XG4gICAgICBwbGFjZWhvbGRlcj1cIlNlbGVjdCBBIFR5cGVcIlxuICAgICAgb25DaGFuZ2U9e29uU2VsZWN0fVxuICAgIC8+XG4gIDwvZGl2PlxuKTtcblxuY29uc3QgSWNvbkxheWVySW5mbyA9ICh7b3Blbk1vZGFsfSkgPT4gKFxuICA8ZGl2PlxuICAgIDxhIGNsYXNzTmFtZT1cImluZm8tbGluayBsaW5rLWJ0blwiIG9uQ2xpY2s9eygpID0+IG9wZW5Nb2RhbCgnaWNvbkluZm8nKX0+XG4gICAgICA8aSBjbGFzc05hbWU9XCJpY29uIGljb25faGVscCBwdXNoLXRpbnktLXJpZ2h0IHpldGFcIiAvPlxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic21hbGwgdHJhbnNpdGlvbi0tc2xvd1wiPkhvdyB0byBkcmF3IGljb24gbGF5ZXI8L3NwYW4+XG4gICAgPC9hPlxuICA8L2Rpdj5cbik7XG4iXX0=
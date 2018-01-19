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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvbGF5ZXItY29sdW1uLWNvbmZpZy5qcyJdLCJuYW1lcyI6WyJwcm9wVHlwZXMiLCJsYXllciIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJmaWVsZHMiLCJhcnJheSIsInVwZGF0ZUxheWVyQ29uZmlnIiwiZnVuYyIsInVwZGF0ZUxheWVyVHlwZSIsIm9wZW5Nb2RhbCIsImZpZWxkUGFpcnMiLCJ0eXBlT3B0aW9ucyIsIk9iamVjdCIsImtleXMiLCJMYXllckNvbHVtbkNvbmZpZyIsIl91cGRhdGVDb2x1bW4iLCJrZXkiLCJ2YWx1ZSIsInByb3BzIiwiY29sdW1ucyIsInBhaXIiLCJjb2x1bW5QYWlycyIsImFzc2lnbkNvbHVtblBhaXJzIiwiYXNzaWduQ29sdW1uIiwicmVuZGVyIiwiZGlzcGxheSIsImp1c3RpZnlDb250ZW50IiwiY29uZmlnIiwibWFwIiwibmFtZSIsImZwIiwiZGVmYXVsdE5hbWUiLCJ0eXBlIiwidmFsIiwiaWNvbiIsIkNvbHVtblJvdyIsImRpdiIsIkNvbHVtbk5hbWUiLCJDb2x1bW5TZWxlY3QiLCJDb2x1bW5TZWxlY3RvciIsImNvbHVtbiIsImxhYmVsIiwiYWxsRmllbGRzIiwib25TZWxlY3QiLCJvcHRpb25hbCIsIkJvb2xlYW4iLCJUeXBlU2VsZWN0b3IiLCJJY29uTGF5ZXJJbmZvIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBRUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBS0EsSUFBTUEsWUFBWTtBQUNoQkMsU0FBTyxpQkFBVUMsTUFBVixDQUFpQkMsVUFEUjtBQUVoQkMsVUFBUSxpQkFBVUMsS0FBVixDQUFnQkYsVUFGUjtBQUdoQkcscUJBQW1CLGlCQUFVQyxJQUFWLENBQWVKLFVBSGxCO0FBSWhCSyxtQkFBaUIsaUJBQVVELElBQVYsQ0FBZUosVUFKaEI7QUFLaEJN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QUFSLEdBQW1CO0FBQUE7QUFBQTtBQUFBO0FBQUEsT0FBbkIsR0FBc0Q7QUFGekQsS0FERjtBQUtFO0FBQUMsa0JBQUQ7QUFBQTtBQUNFO0FBQ0UsbUJBQVdsQyxVQURiO0FBRUUsZUFBTyxDQUFDOEIsT0FBT0ksUUFBUixJQUFvQixDQUFDSixPQUFPdkIsS0FGckM7QUFHRSxnQkFBUXlCLFNBSFY7QUFJRSxlQUFPRixPQUFPdkIsS0FKaEI7QUFLRSxrQkFBVTRCLFFBQVFMLE9BQU9JLFFBQWYsQ0FMWjtBQU1FLGtCQUFVRDtBQU5aO0FBREY7QUFMRixHQURxQjtBQUFBLENBQXZCOztBQW1CQSxJQUFNRyxlQUFlLFNBQWZBLFlBQWU7QUFBQSxNQUFFN0MsS0FBRixTQUFFQSxLQUFGO0FBQUEsTUFBUzBDLFFBQVQsU0FBU0EsUUFBVDtBQUFBLFNBQ25CO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FERjtBQUVFO0FBQ0UscUJBQWUxQyxNQUFNK0IsSUFEdkI7QUFFRSxlQUFTckIsV0FGWDtBQUdFLG1CQUFhLEtBSGY7QUFJRSxtQkFBWSxlQUpkO0FBS0UsZ0JBQVVnQztBQUxaO0FBRkYsR0FEbUI7QUFBQSxDQUFyQjs7QUFhQSxJQUFNSSxnQkFBZ0IsU0FBaEJBLGFBQWdCO0FBQUEsTUFBRXRDLFNBQUYsU0FBRUEsU0FBRjtBQUFBLFNBQ3BCO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxRQUFHLFdBQVUsb0JBQWIsRUFBa0MsU0FBUztBQUFBLGlCQUFNQSxVQUFVLFVBQVYsQ0FBTjtBQUFBLFNBQTNDO0FBQ0UsMkNBQUcsV0FBVSxzQ0FBYixHQURGO0FBRUU7QUFBQTtBQUFBLFVBQU0sV0FBVSx3QkFBaEI7QUFBQTtBQUFBO0FBRkY7QUFERixHQURvQjtBQUFBLENBQXRCIiwiZmlsZSI6ImxheWVyLWNvbHVtbi1jb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnQsIFByb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5cbmltcG9ydCB7TEFZRVJfVFlQRVN9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcbmltcG9ydCBGaWVsZFNlbGVjdG9yIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ZpZWxkLXNlbGVjdG9yJztcbmltcG9ydCBJdGVtU2VsZWN0b3IgZnJvbSAnY29tcG9uZW50cy9jb21tb24vaXRlbS1zZWxlY3Rvci9pdGVtLXNlbGVjdG9yJztcbmltcG9ydCB7XG4gIFBhbmVsTGFiZWwsXG4gIFNpZGVQYW5lbFNlY3Rpb25cbn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIGxheWVyOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGZpZWxkczogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gIHVwZGF0ZUxheWVyQ29uZmlnOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB1cGRhdGVMYXllclR5cGU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIG9wZW5Nb2RhbDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgZmllbGRQYWlyczogUHJvcFR5cGVzLmFycmF5XG59O1xuXG5jb25zdCB0eXBlT3B0aW9ucyA9IE9iamVjdC5rZXlzKExBWUVSX1RZUEVTKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGF5ZXJDb2x1bW5Db25maWcgZXh0ZW5kcyBDb21wb25lbnQge1xuICBfdXBkYXRlQ29sdW1uKGtleSwgdmFsdWUpIHtcbiAgICBjb25zdCB7bGF5ZXJ9ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IGNvbHVtbnMgPVxuICAgICAgdmFsdWUucGFpciAmJiBsYXllci5jb2x1bW5QYWlyc1xuICAgICAgICA/IGxheWVyLmFzc2lnbkNvbHVtblBhaXJzKGtleSwgdmFsdWUucGFpcilcbiAgICAgICAgOiBsYXllci5hc3NpZ25Db2x1bW4oa2V5LCB2YWx1ZSk7XG5cbiAgICB0aGlzLnByb3BzLnVwZGF0ZUxheWVyQ29uZmlnKHtjb2x1bW5zfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge2xheWVyLCBmaWVsZHMsIGZpZWxkUGFpcnN9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPFNpZGVQYW5lbFNlY3Rpb24+XG4gICAgICAgICAgPFR5cGVTZWxlY3RvciBsYXllcj17bGF5ZXJ9IG9uU2VsZWN0PXt0aGlzLnByb3BzLnVwZGF0ZUxheWVyVHlwZX0gLz5cbiAgICAgICAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTogJ2ZsZXgnLCBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nfX0+XG4gICAgICAgICAgICA8UGFuZWxMYWJlbD5Db2x1bW5zPC9QYW5lbExhYmVsPlxuICAgICAgICAgICAgPFBhbmVsTGFiZWw+KiBSZXF1aXJlZDwvUGFuZWxMYWJlbD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICB7T2JqZWN0LmtleXMobGF5ZXIuY29uZmlnLmNvbHVtbnMpLm1hcChrZXkgPT4gKFxuICAgICAgICAgICAgPENvbHVtblNlbGVjdG9yXG4gICAgICAgICAgICAgIGNvbHVtbj17bGF5ZXIuY29uZmlnLmNvbHVtbnNba2V5XX1cbiAgICAgICAgICAgICAgbGFiZWw9e2tleX1cbiAgICAgICAgICAgICAga2V5PXtrZXl9XG4gICAgICAgICAgICAgIGFsbEZpZWxkcz17ZmllbGRzfVxuICAgICAgICAgICAgICBmaWVsZFBhaXJzPXtcbiAgICAgICAgICAgICAgICBsYXllci5jb2x1bW5QYWlyc1xuICAgICAgICAgICAgICAgICAgPyBmaWVsZFBhaXJzLm1hcChmcCA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGZwLmRlZmF1bHROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwb2ludCcsXG4gICAgICAgICAgICAgICAgICAgICAgcGFpcjogZnAucGFpclxuICAgICAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICAgIDogbnVsbFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG9uU2VsZWN0PXt2YWwgPT4gdGhpcy5fdXBkYXRlQ29sdW1uKGtleSwgdmFsKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSl9XG4gICAgICAgICAge2xheWVyLnR5cGUgPT09IExBWUVSX1RZUEVTLmljb24gJiYgKFxuICAgICAgICAgICAgPEljb25MYXllckluZm8gb3Blbk1vZGFsPXt0aGlzLnByb3BzLm9wZW5Nb2RhbH0gLz5cbiAgICAgICAgICApfVxuICAgICAgICA8L1NpZGVQYW5lbFNlY3Rpb24+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbkxheWVyQ29sdW1uQ29uZmlnLnByb3BUeXBlcyA9IHByb3BUeXBlcztcblxuY29uc3QgQ29sdW1uUm93ID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgbWFyZ2luLWJvdHRvbTogMTJweDtcbmA7XG5cbmNvbnN0IENvbHVtbk5hbWUgPSBzdHlsZWQuZGl2YFxuICB3aWR0aDogMzAlO1xuYDtcbmNvbnN0IENvbHVtblNlbGVjdCA9IHN0eWxlZC5kaXZgXG4gIHdpZHRoOiA3MCU7XG5gO1xuXG5jb25zdCBDb2x1bW5TZWxlY3RvciA9ICh7Y29sdW1uLCBsYWJlbCwgYWxsRmllbGRzLCBvblNlbGVjdCwgZmllbGRQYWlyc30pID0+IChcbiAgPENvbHVtblJvdz5cbiAgICA8Q29sdW1uTmFtZT5cbiAgICAgIDxQYW5lbExhYmVsPntsYWJlbH08L1BhbmVsTGFiZWw+XG4gICAgICB7IWNvbHVtbi5vcHRpb25hbCA/IDxQYW5lbExhYmVsPntgICAqYH08L1BhbmVsTGFiZWw+IDogbnVsbH1cbiAgICA8L0NvbHVtbk5hbWU+XG4gICAgPENvbHVtblNlbGVjdD5cbiAgICAgIDxGaWVsZFNlbGVjdG9yXG4gICAgICAgIHN1Z2dlc3RlZD17ZmllbGRQYWlyc31cbiAgICAgICAgZXJyb3I9eyFjb2x1bW4ub3B0aW9uYWwgJiYgIWNvbHVtbi52YWx1ZX1cbiAgICAgICAgZmllbGRzPXthbGxGaWVsZHN9XG4gICAgICAgIHZhbHVlPXtjb2x1bW4udmFsdWV9XG4gICAgICAgIGVyYXNhYmxlPXtCb29sZWFuKGNvbHVtbi5vcHRpb25hbCl9XG4gICAgICAgIG9uU2VsZWN0PXtvblNlbGVjdH1cbiAgICAgIC8+XG4gICAgPC9Db2x1bW5TZWxlY3Q+XG4gIDwvQ29sdW1uUm93PlxuKTtcblxuY29uc3QgVHlwZVNlbGVjdG9yID0gKHtsYXllciwgb25TZWxlY3R9KSA9PiAoXG4gIDxkaXY+XG4gICAgPFBhbmVsTGFiZWw+bGF5ZXIgdHlwZTwvUGFuZWxMYWJlbD5cbiAgICA8SXRlbVNlbGVjdG9yXG4gICAgICBzZWxlY3RlZEl0ZW1zPXtsYXllci50eXBlfVxuICAgICAgb3B0aW9ucz17dHlwZU9wdGlvbnN9XG4gICAgICBtdWx0aVNlbGVjdD17ZmFsc2V9XG4gICAgICBwbGFjZWhvbGRlcj1cIlNlbGVjdCBBIFR5cGVcIlxuICAgICAgb25DaGFuZ2U9e29uU2VsZWN0fVxuICAgIC8+XG4gIDwvZGl2PlxuKTtcblxuY29uc3QgSWNvbkxheWVySW5mbyA9ICh7b3Blbk1vZGFsfSkgPT4gKFxuICA8ZGl2PlxuICAgIDxhIGNsYXNzTmFtZT1cImluZm8tbGluayBsaW5rLWJ0blwiIG9uQ2xpY2s9eygpID0+IG9wZW5Nb2RhbCgnaWNvbkluZm8nKX0+XG4gICAgICA8aSBjbGFzc05hbWU9XCJpY29uIGljb25faGVscCBwdXNoLXRpbnktLXJpZ2h0IHpldGFcIiAvPlxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic21hbGwgdHJhbnNpdGlvbi0tc2xvd1wiPkhvdyB0byBkcmF3IGljb24gbGF5ZXI8L3NwYW4+XG4gICAgPC9hPlxuICA8L2Rpdj5cbik7XG4iXX0=
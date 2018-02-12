'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  height: 85%;\n  width: 90%;\n  top: 80px;\n  padding: 32px 0 0 0;\n'], ['\n  height: 85%;\n  width: 90%;\n  top: 80px;\n  padding: 32px 0 0 0;\n']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n  width: 40%;\n  padding: 40px 40px 32px 40px;\n'], ['\n  width: 40%;\n  padding: 40px 40px 32px 40px;\n']);

// modal


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = require('styled-components');

var _reactDom = require('react-dom');

var _modal = require('./common/modal');

var _modal2 = _interopRequireDefault(_modal);

var _deleteDataModal = require('./modals/delete-data-modal');

var _deleteDataModal2 = _interopRequireDefault(_deleteDataModal);

var _iconInfoModal = require('./modals/icon-info-modal');

var _iconInfoModal2 = _interopRequireDefault(_iconInfoModal);

var _dataTableModal = require('./modals/data-table-modal');

var _dataTableModal2 = _interopRequireDefault(_dataTableModal);

var _loadDataModal = require('./modals/load-data-modal');

var _loadDataModal2 = _interopRequireDefault(_loadDataModal);

var _defaultSettings = require('../constants/default-settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  rootNode: _propTypes2.default.object,
  containerW: _propTypes2.default.number,
  containerH: _propTypes2.default.number,
  uiState: _propTypes2.default.object.isRequired,
  visState: _propTypes2.default.object.isRequired,
  visStateActions: _propTypes2.default.object.isRequired
};

var DataTableModalStyle = (0, _styledComponents.css)(_templateObject);

var DeleteDatasetModalStyled = (0, _styledComponents.css)(_templateObject2);

var ModalWrapper = function (_Component) {
  (0, _inherits3.default)(ModalWrapper, _Component);

  function ModalWrapper() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, ModalWrapper);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = ModalWrapper.__proto__ || Object.getPrototypeOf(ModalWrapper)).call.apply(_ref, [this].concat(args))), _this), _this._closeModal = function () {
      _this.props.uiStateActions.toggleModal(null);
    }, _this._deleteDataset = function (key) {
      _this.props.visStateActions.removeDataset(key);
      _this._closeModal();
    }, _this._onFileUpload = function (blob) {
      _this.props.visStateActions.loadFiles(blob);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(ModalWrapper, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          containerW = _props.containerW,
          containerH = _props.containerH,
          uiState = _props.uiState,
          visState = _props.visState,
          rootNode = _props.rootNode,
          visStateActions = _props.visStateActions;
      var currentModal = uiState.currentModal,
          datasetKeyToRemove = uiState.datasetKeyToRemove;
      var datasets = visState.datasets,
          layers = visState.layers,
          editingDataset = visState.editingDataset;


      var template = null;
      var modalProps = {};

      switch (currentModal) {
        case 'iconInfo':
          template = _react2.default.createElement(_iconInfoModal2.default, null);
          modalProps.title = 'How to draw icons';
          break;

        case _defaultSettings.DATA_TABLE_ID:
          template = _react2.default.createElement(_dataTableModal2.default, {
            width: containerW * 0.9,
            height: containerH * 0.85,
            datasets: datasets,
            dataId: editingDataset,
            showDatasetTable: visStateActions.showDatasetTable
          });
          modalProps.cssStyle = DataTableModalStyle;
          break;
        case _defaultSettings.DELETE_DATA_ID:
          // validate options
          if (datasetKeyToRemove && datasets && datasets[datasetKeyToRemove]) {
            template = _react2.default.createElement(_deleteDataModal2.default, {
              dataset: datasets[datasetKeyToRemove],
              layers: layers
            });

            modalProps = {
              title: 'Delete Dataset',
              cssStyle: DeleteDatasetModalStyled,
              footer: true,
              onConfirm: function onConfirm() {
                return _this2._deleteDataset(datasetKeyToRemove);
              },
              onCancel: this._closeModal,
              confirmButton: {
                negative: true,
                large: true,
                children: 'Delete'
              }
            };
          }
          break; // in case we add a new case after this one
        case _defaultSettings.ADD_DATA_ID:
          template = _react2.default.createElement(_loadDataModal2.default, {
            onClose: this._closeModal,
            onFileUpload: this._onFileUpload
          });
          modalProps = {
            title: 'Add Data To Map',
            footer: true,
            onConfirm: this._closeModal
          };
          break;
        default:
          break;
      }

      return this.props.rootNode ? _react2.default.createElement(
        _modal2.default,
        (0, _extends3.default)({}, modalProps, {
          parentSelector: function parentSelector() {
            return (0, _reactDom.findDOMNode)(rootNode);
          },
          isOpen: Boolean(currentModal),
          close: this._closeModal
        }),
        template
      ) : null;
    }
  }]);
  return ModalWrapper;
}(_react.Component);

exports.default = ModalWrapper;


ModalWrapper.propTypes = propTypes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFsLXdyYXBwZXIuanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwicm9vdE5vZGUiLCJvYmplY3QiLCJjb250YWluZXJXIiwibnVtYmVyIiwiY29udGFpbmVySCIsInVpU3RhdGUiLCJpc1JlcXVpcmVkIiwidmlzU3RhdGUiLCJ2aXNTdGF0ZUFjdGlvbnMiLCJEYXRhVGFibGVNb2RhbFN0eWxlIiwiRGVsZXRlRGF0YXNldE1vZGFsU3R5bGVkIiwiTW9kYWxXcmFwcGVyIiwiX2Nsb3NlTW9kYWwiLCJwcm9wcyIsInVpU3RhdGVBY3Rpb25zIiwidG9nZ2xlTW9kYWwiLCJfZGVsZXRlRGF0YXNldCIsInJlbW92ZURhdGFzZXQiLCJrZXkiLCJfb25GaWxlVXBsb2FkIiwibG9hZEZpbGVzIiwiYmxvYiIsImN1cnJlbnRNb2RhbCIsImRhdGFzZXRLZXlUb1JlbW92ZSIsImRhdGFzZXRzIiwibGF5ZXJzIiwiZWRpdGluZ0RhdGFzZXQiLCJ0ZW1wbGF0ZSIsIm1vZGFsUHJvcHMiLCJ0aXRsZSIsInNob3dEYXRhc2V0VGFibGUiLCJjc3NTdHlsZSIsImZvb3RlciIsIm9uQ29uZmlybSIsIm9uQ2FuY2VsIiwiY29uZmlybUJ1dHRvbiIsIm5lZ2F0aXZlIiwibGFyZ2UiLCJjaGlsZHJlbiIsIkJvb2xlYW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPQTs7O0FBUEE7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztBQUVBOzs7O0FBR0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQU1BLElBQU1BLFlBQVk7QUFDaEJDLFlBQVUsb0JBQVVDLE1BREo7QUFFaEJDLGNBQVksb0JBQVVDLE1BRk47QUFHaEJDLGNBQVksb0JBQVVELE1BSE47QUFJaEJFLFdBQVMsb0JBQVVKLE1BQVYsQ0FBaUJLLFVBSlY7QUFLaEJDLFlBQVUsb0JBQVVOLE1BQVYsQ0FBaUJLLFVBTFg7QUFN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R2U7QUFOSCxPQURLLEdBU0gsSUFUSjtBQVVEOzs7OztrQkFuR2tCaEIsWTs7O0FBc0dyQkEsYUFBYVosU0FBYixHQUF5QkEsU0FBekIiLCJmaWxlIjoibW9kYWwtd3JhcHBlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7Y3NzfSBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge2ZpbmRET01Ob2RlfSBmcm9tICdyZWFjdC1kb20nO1xuXG5pbXBvcnQgTW9kYWxEaWFsb2cgZnJvbSAnLi9jb21tb24vbW9kYWwnO1xuXG4vLyBtb2RhbFxuaW1wb3J0IERlbGV0ZURhdGFzZXRNb2RhbCBmcm9tICcuL21vZGFscy9kZWxldGUtZGF0YS1tb2RhbCc7XG5pbXBvcnQgSWNvbkluZm9Nb2RhbCBmcm9tICcuL21vZGFscy9pY29uLWluZm8tbW9kYWwnO1xuaW1wb3J0IERhdGFUYWJsZU1vZGFsIGZyb20gJy4vbW9kYWxzL2RhdGEtdGFibGUtbW9kYWwnO1xuaW1wb3J0IExvYWREYXRhTW9kYWwgZnJvbSAnLi9tb2RhbHMvbG9hZC1kYXRhLW1vZGFsJztcblxuaW1wb3J0IHtcbiAgREFUQV9UQUJMRV9JRCxcbiAgREVMRVRFX0RBVEFfSUQsXG4gIEFERF9EQVRBX0lEXG59IGZyb20gJy4uL2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICByb290Tm9kZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgY29udGFpbmVyVzogUHJvcFR5cGVzLm51bWJlcixcbiAgY29udGFpbmVySDogUHJvcFR5cGVzLm51bWJlcixcbiAgdWlTdGF0ZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICB2aXNTdGF0ZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICB2aXNTdGF0ZUFjdGlvbnM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcblxuY29uc3QgRGF0YVRhYmxlTW9kYWxTdHlsZSA9IGNzc2BcbiAgaGVpZ2h0OiA4NSU7XG4gIHdpZHRoOiA5MCU7XG4gIHRvcDogODBweDtcbiAgcGFkZGluZzogMzJweCAwIDAgMDtcbmA7XG5cbmNvbnN0IERlbGV0ZURhdGFzZXRNb2RhbFN0eWxlZCA9IGNzc2BcbiAgd2lkdGg6IDQwJTtcbiAgcGFkZGluZzogNDBweCA0MHB4IDMycHggNDBweDtcbmA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vZGFsV3JhcHBlciBleHRlbmRzIENvbXBvbmVudCB7XG4gIF9jbG9zZU1vZGFsID0gKCkgPT4ge1xuICAgIHRoaXMucHJvcHMudWlTdGF0ZUFjdGlvbnMudG9nZ2xlTW9kYWwobnVsbCk7XG4gIH07XG5cbiAgX2RlbGV0ZURhdGFzZXQgPSBrZXkgPT4ge1xuICAgIHRoaXMucHJvcHMudmlzU3RhdGVBY3Rpb25zLnJlbW92ZURhdGFzZXQoa2V5KTtcbiAgICB0aGlzLl9jbG9zZU1vZGFsKCk7XG4gIH07XG5cbiAgX29uRmlsZVVwbG9hZCA9IGJsb2IgPT4ge1xuICAgIHRoaXMucHJvcHMudmlzU3RhdGVBY3Rpb25zLmxvYWRGaWxlcyhibG9iKTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG5cbiAgICBjb25zdCB7XG4gICAgICBjb250YWluZXJXLFxuICAgICAgY29udGFpbmVySCxcbiAgICAgIHVpU3RhdGUsXG4gICAgICB2aXNTdGF0ZSxcbiAgICAgIHJvb3ROb2RlLFxuICAgICAgdmlzU3RhdGVBY3Rpb25zXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge2N1cnJlbnRNb2RhbCwgZGF0YXNldEtleVRvUmVtb3ZlfSA9IHVpU3RhdGU7XG4gICAgY29uc3Qge2RhdGFzZXRzLCBsYXllcnMsIGVkaXRpbmdEYXRhc2V0fSA9IHZpc1N0YXRlO1xuXG4gICAgbGV0IHRlbXBsYXRlID0gbnVsbDtcbiAgICBsZXQgbW9kYWxQcm9wcyA9IHt9O1xuXG4gICAgc3dpdGNoIChjdXJyZW50TW9kYWwpIHtcbiAgICAgIGNhc2UgJ2ljb25JbmZvJzpcbiAgICAgICAgdGVtcGxhdGUgPSA8SWNvbkluZm9Nb2RhbCAvPjtcbiAgICAgICAgbW9kYWxQcm9wcy50aXRsZSA9ICdIb3cgdG8gZHJhdyBpY29ucyc7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIERBVEFfVEFCTEVfSUQ6XG4gICAgICAgIHRlbXBsYXRlID0gKFxuICAgICAgICAgIDxEYXRhVGFibGVNb2RhbFxuICAgICAgICAgICAgd2lkdGg9e2NvbnRhaW5lclcgKiAwLjl9XG4gICAgICAgICAgICBoZWlnaHQ9eyhjb250YWluZXJIKSAqIDAuODV9XG4gICAgICAgICAgICBkYXRhc2V0cz17ZGF0YXNldHN9XG4gICAgICAgICAgICBkYXRhSWQ9e2VkaXRpbmdEYXRhc2V0fVxuICAgICAgICAgICAgc2hvd0RhdGFzZXRUYWJsZT17dmlzU3RhdGVBY3Rpb25zLnNob3dEYXRhc2V0VGFibGV9XG4gICAgICAgICAgLz5cbiAgICAgICAgKTtcbiAgICAgICAgbW9kYWxQcm9wcy5jc3NTdHlsZSA9IERhdGFUYWJsZU1vZGFsU3R5bGU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBERUxFVEVfREFUQV9JRDpcbiAgICAgICAgLy8gdmFsaWRhdGUgb3B0aW9uc1xuICAgICAgICBpZiAoZGF0YXNldEtleVRvUmVtb3ZlICYmIGRhdGFzZXRzICYmIGRhdGFzZXRzW2RhdGFzZXRLZXlUb1JlbW92ZV0pIHtcbiAgICAgICAgICB0ZW1wbGF0ZSA9IChcbiAgICAgICAgICAgIDxEZWxldGVEYXRhc2V0TW9kYWxcbiAgICAgICAgICAgICAgZGF0YXNldD17ZGF0YXNldHNbZGF0YXNldEtleVRvUmVtb3ZlXX1cbiAgICAgICAgICAgICAgbGF5ZXJzPXtsYXllcnN9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBtb2RhbFByb3BzID0ge1xuICAgICAgICAgICAgdGl0bGU6ICdEZWxldGUgRGF0YXNldCcsXG4gICAgICAgICAgICBjc3NTdHlsZTogRGVsZXRlRGF0YXNldE1vZGFsU3R5bGVkLFxuICAgICAgICAgICAgZm9vdGVyOiB0cnVlLFxuICAgICAgICAgICAgb25Db25maXJtOiAoKSA9PiB0aGlzLl9kZWxldGVEYXRhc2V0KGRhdGFzZXRLZXlUb1JlbW92ZSksXG4gICAgICAgICAgICBvbkNhbmNlbDogdGhpcy5fY2xvc2VNb2RhbCxcbiAgICAgICAgICAgIGNvbmZpcm1CdXR0b246IHtcbiAgICAgICAgICAgICAgbmVnYXRpdmU6IHRydWUsXG4gICAgICAgICAgICAgIGxhcmdlOiB0cnVlLFxuICAgICAgICAgICAgICBjaGlsZHJlbjogJ0RlbGV0ZSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrOyAvLyBpbiBjYXNlIHdlIGFkZCBhIG5ldyBjYXNlIGFmdGVyIHRoaXMgb25lXG4gICAgICBjYXNlIEFERF9EQVRBX0lEOlxuICAgICAgICB0ZW1wbGF0ZSA9IChcbiAgICAgICAgICA8TG9hZERhdGFNb2RhbFxuICAgICAgICAgICAgb25DbG9zZT17dGhpcy5fY2xvc2VNb2RhbH1cbiAgICAgICAgICAgIG9uRmlsZVVwbG9hZD17dGhpcy5fb25GaWxlVXBsb2FkfVxuICAgICAgICAgIC8+XG4gICAgICAgICk7XG4gICAgICAgIG1vZGFsUHJvcHMgPSB7XG4gICAgICAgICAgdGl0bGU6ICdBZGQgRGF0YSBUbyBNYXAnLFxuICAgICAgICAgIGZvb3RlcjogdHJ1ZSxcbiAgICAgICAgICBvbkNvbmZpcm06IHRoaXMuX2Nsb3NlTW9kYWxcbiAgICAgICAgfTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wcm9wcy5yb290Tm9kZSA/IChcbiAgICAgIDxNb2RhbERpYWxvZ1xuICAgICAgICB7Li4ubW9kYWxQcm9wc31cbiAgICAgICAgcGFyZW50U2VsZWN0b3I9eygpID0+IGZpbmRET01Ob2RlKHJvb3ROb2RlKX1cbiAgICAgICAgaXNPcGVuPXtCb29sZWFuKGN1cnJlbnRNb2RhbCl9XG4gICAgICAgIGNsb3NlPXt0aGlzLl9jbG9zZU1vZGFsfVxuICAgICAgPlxuICAgICAgICB7dGVtcGxhdGV9XG4gICAgICA8L01vZGFsRGlhbG9nPlxuICAgICkgOiBudWxsO1xuICB9XG59XG5cbk1vZGFsV3JhcHBlci5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG4iXX0=
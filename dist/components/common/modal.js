'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  width: 60%;\n  padding: 77px 96px;\n  position: absolute;\n  top: 92px;\n  left: 0;\n  right: 0;\n  margin-left: auto;\n  background-color: #ffffff;\n  border-radius: 4px;\n  transition: ', ';\n  min-width: 600px;\n  overflow: hidden;\n  box-sizing: border-box;\n  margin-right: auto;\n  font-size: 12px;\n  color: ', ';\n  ', ';\n'], ['\n  width: 60%;\n  padding: 77px 96px;\n  position: absolute;\n  top: 92px;\n  left: 0;\n  right: 0;\n  margin-left: auto;\n  background-color: #ffffff;\n  border-radius: 4px;\n  transition: ', ';\n  min-width: 600px;\n  overflow: hidden;\n  box-sizing: border-box;\n  margin-right: auto;\n  font-size: 12px;\n  color: ', ';\n  ', ';\n']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n  color: ', ';\n  display: flex;\n  justify-content: flex-end;\n  left: 0;\n  padding: 24px;\n  position: absolute;\n  top: 0;\n  width: 100%;\n  z-index: 10005;\n\n  :hover {\n    cursor: pointer;\n  }\n'], ['\n  color: ', ';\n  display: flex;\n  justify-content: flex-end;\n  left: 0;\n  padding: 24px;\n  position: absolute;\n  top: 0;\n  width: 100%;\n  z-index: 10005;\n\n  :hover {\n    cursor: pointer;\n  }\n']),
    _templateObject3 = (0, _taggedTemplateLiteral3.default)(['\n  font-size: ', ';\n  color: ', ';\n  margin-bottom: 10px;\n  position: relative;\n  z-index: 10003;\n'], ['\n  font-size: ', ';\n  color: ', ';\n  margin-bottom: 10px;\n  position: relative;\n  z-index: 10003;\n']),
    _templateObject4 = (0, _taggedTemplateLiteral3.default)(['\n  width: 100%;\n  left: 0;\n  bottom: 0;\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-end;\n  padding-top: 36px;\n  //padding-bottom: 64px;\n  //background-color: ', ';\n  //height: 234px;\n  //position: absolute;\n  z-index: 10001;\n'], ['\n  width: 100%;\n  left: 0;\n  bottom: 0;\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-end;\n  padding-top: 36px;\n  //padding-bottom: 64px;\n  //background-color: ', ';\n  //height: 234px;\n  //position: absolute;\n  z-index: 10001;\n']),
    _templateObject5 = (0, _taggedTemplateLiteral3.default)(['\n  position: relative;\n  z-index: 10002;\n'], ['\n  position: relative;\n  z-index: 10002;\n']),
    _templateObject6 = (0, _taggedTemplateLiteral3.default)(['\n  display: flex;\n  justify-content: flex-end;\n  //padding-right: 96px;\n'], ['\n  display: flex;\n  justify-content: flex-end;\n  //padding-right: 96px;\n']),
    _templateObject7 = (0, _taggedTemplateLiteral3.default)(['\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  z-index: 10000;\n  transition: ', ';\n'], ['\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  z-index: 10000;\n  transition: ', ';\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _reactModal = require('react-modal');

var _reactModal2 = _interopRequireDefault(_reactModal);

var _icons = require('./icons');

var _styledComponents3 = require('./styled-components');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  footer: _propTypes2.default.bool,
  close: _propTypes2.default.func.isRequired,
  onConfirm: _propTypes2.default.func,
  onCancel: _propTypes2.default.func,
  confirmButton: _propTypes2.default.object,
  confirmButtonLabel: _propTypes2.default.string,
  cancelButton: _propTypes2.default.object,
  cancelButtonLabel: _propTypes2.default.string,
  cssStyle: _propTypes2.default.array
};

var defaultProps = {
  footer: false,
  close: function close() {},
  onConfirm: function onConfirm() {},
  onCancel: function onCancel() {},
  cancelButton: {
    link: true,
    large: true,
    children: 'Cancel'
  },
  confirmButton: {
    large: true,
    width: '160px',
    children: 'Confirm'
  },
  cssStyle: []
};

var ModalContentWrapper = _styledComponents2.default.div(_templateObject, function (props) {
  return props.theme.transition;
}, function (props) {
  return props.theme.labelColorLT;
}, function (props) {
  return props.cssStyle || '';
});

var CloseButton = _styledComponents2.default.div(_templateObject2, function (props) {
  return props.theme.titleColorLT;
});

var ModalTitle = _styledComponents2.default.div(_templateObject3, function (props) {
  return props.theme.modalTitleFontSize;
}, function (props) {
  return props.theme.modalTitleColor;
});

var ModalFooter = _styledComponents2.default.div(_templateObject4, function (props) {
  return props.theme.modalFooterBgd;
});

var ModalContent = _styledComponents2.default.div(_templateObject5);

var FooterActionWrapper = _styledComponents2.default.div(_templateObject6);

var Footer = function Footer(_ref) {
  var cancel = _ref.cancel,
      confirm = _ref.confirm,
      cancelButton = _ref.cancelButton,
      confirmButton = _ref.confirmButton;
  return _react2.default.createElement(
    ModalFooter,
    { className: 'modal--footer' },
    _react2.default.createElement(
      FooterActionWrapper,
      null,
      _react2.default.createElement(
        _styledComponents3.Button,
        (0, _extends3.default)({}, cancelButton, { onClick: cancel }),
        cancelButton.children
      ),
      _react2.default.createElement(
        _styledComponents3.Button,
        (0, _extends3.default)({}, confirmButton, { onClick: confirm }),
        confirmButton.children
      )
    )
  );
};

var ModalDialog = function (_Component) {
  (0, _inherits3.default)(ModalDialog, _Component);

  function ModalDialog() {
    (0, _classCallCheck3.default)(this, ModalDialog);
    return (0, _possibleConstructorReturn3.default)(this, (ModalDialog.__proto__ || Object.getPrototypeOf(ModalDialog)).apply(this, arguments));
  }

  (0, _createClass3.default)(ModalDialog, [{
    key: 'render',
    value: function render() {
      var props = this.props;

      return _react2.default.createElement(
        _reactModal2.default,
        (0, _extends3.default)({}, props, {
          ariaHideApp: false,
          style: {
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 10000,
              overflowY: 'auto',
              position: 'absolute'
            }
          }
        }),
        _react2.default.createElement(
          ModalContentWrapper,
          {
            className: 'modal--content',
            cssStyle: props.cssStyle,
            footer: props.footer
          },
          props.close ? _react2.default.createElement(
            CloseButton,
            { className: 'modal--close', onClick: props.close },
            _react2.default.createElement(_icons.Delete, { height: '14px' })
          ) : null,
          props.title ? _react2.default.createElement(
            ModalTitle,
            { className: 'modal--title' },
            props.title
          ) : null,
          _react2.default.createElement(
            ModalContent,
            { className: 'content' },
            props.children
          ),
          props.footer ? _react2.default.createElement(Footer, {
            cancel: props.close,
            confirm: props.onConfirm,
            cancelButton: props.cancelButton,
            confirmButton: props.confirmButton
          }) : null
        )
      );
    }
  }]);
  return ModalDialog;
}(_react.Component);

ModalDialog.defaultProps = defaultProps;
ModalDialog.propTypes = propTypes;

var StyledModal = (0, _styledComponents2.default)(ModalDialog)(_templateObject7, function (props) {
  return props.theme.transition;
});

exports.default = StyledModal;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9tb2RhbC5qcyJdLCJuYW1lcyI6WyJwcm9wVHlwZXMiLCJmb290ZXIiLCJib29sIiwiY2xvc2UiLCJmdW5jIiwiaXNSZXF1aXJlZCIsIm9uQ29uZmlybSIsIm9uQ2FuY2VsIiwiY29uZmlybUJ1dHRvbiIsIm9iamVjdCIsImNvbmZpcm1CdXR0b25MYWJlbCIsInN0cmluZyIsImNhbmNlbEJ1dHRvbiIsImNhbmNlbEJ1dHRvbkxhYmVsIiwiY3NzU3R5bGUiLCJhcnJheSIsImRlZmF1bHRQcm9wcyIsImxpbmsiLCJsYXJnZSIsImNoaWxkcmVuIiwid2lkdGgiLCJNb2RhbENvbnRlbnRXcmFwcGVyIiwiZGl2IiwicHJvcHMiLCJ0aGVtZSIsInRyYW5zaXRpb24iLCJsYWJlbENvbG9yTFQiLCJDbG9zZUJ1dHRvbiIsInRpdGxlQ29sb3JMVCIsIk1vZGFsVGl0bGUiLCJtb2RhbFRpdGxlRm9udFNpemUiLCJtb2RhbFRpdGxlQ29sb3IiLCJNb2RhbEZvb3RlciIsIm1vZGFsRm9vdGVyQmdkIiwiTW9kYWxDb250ZW50IiwiRm9vdGVyQWN0aW9uV3JhcHBlciIsIkZvb3RlciIsImNhbmNlbCIsImNvbmZpcm0iLCJNb2RhbERpYWxvZyIsIm92ZXJsYXkiLCJiYWNrZ3JvdW5kQ29sb3IiLCJ6SW5kZXgiLCJvdmVyZmxvd1kiLCJwb3NpdGlvbiIsInRpdGxlIiwiU3R5bGVkTW9kYWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUVBLElBQU1BLFlBQVk7QUFDaEJDLFVBQVEsb0JBQVVDLElBREY7QUFFaEJDLFNBQU8sb0JBQVVDLElBQVYsQ0FBZUMsVUFGTjtBQUdoQkMsYUFBVyxvQkFBVUYsSUFITDtBQUloQkcsWUFBVSxvQkFBVUgsSUFKSjtBQUtoQkksaUJBQWUsb0JBQVVDLE1B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QUFVLGNBQXRCO0FBQXNDdEIsa0JBQU1zQjtBQUE1QyxXQURELEdBRUcsSUFaTjtBQWFFO0FBQUMsd0JBQUQ7QUFBQSxjQUFjLFdBQVUsU0FBeEI7QUFBbUN0QixrQkFBTUo7QUFBekMsV0FiRjtBQWNHSSxnQkFBTXRCLE1BQU4sR0FDQyw4QkFBQyxNQUFEO0FBQ0Usb0JBQVFzQixNQUFNcEIsS0FEaEI7QUFFRSxxQkFBU29CLE1BQU1qQixTQUZqQjtBQUdFLDBCQUFjaUIsTUFBTVgsWUFIdEI7QUFJRSwyQkFBZVcsTUFBTWY7QUFKdkIsWUFERCxHQU9HO0FBckJOO0FBWkYsT0FERjtBQXNDRDs7Ozs7QUFHSCtCLFlBQVl2QixZQUFaLEdBQTJCQSxZQUEzQjtBQUNBdUIsWUFBWXZDLFNBQVosR0FBd0JBLFNBQXhCOztBQUVBLElBQU04QyxjQUFjLGdDQUFPUCxXQUFQLENBQWQsbUJBTVU7QUFBQSxTQUFTaEIsTUFBTUMsS0FBTixDQUFZQyxVQUFyQjtBQUFBLENBTlYsQ0FBTjs7a0JBU2VxQixXIiwiZmlsZSI6Im1vZGFsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBNb2RhbCBmcm9tICdyZWFjdC1tb2RhbCc7XG5pbXBvcnQge0RlbGV0ZX0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuaW1wb3J0IHtCdXR0b259IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICBmb290ZXI6IFByb3BUeXBlcy5ib29sLFxuICBjbG9zZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgb25Db25maXJtOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25DYW5jZWw6IFByb3BUeXBlcy5mdW5jLFxuICBjb25maXJtQnV0dG9uOiBQcm9wVHlwZXMub2JqZWN0LFxuICBjb25maXJtQnV0dG9uTGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGNhbmNlbEJ1dHRvbjogUHJvcFR5cGVzLm9iamVjdCxcbiAgY2FuY2VsQnV0dG9uTGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGNzc1N0eWxlOiBQcm9wVHlwZXMuYXJyYXlcbn07XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgZm9vdGVyOiBmYWxzZSxcbiAgY2xvc2U6ICgpID0+IHt9LFxuICBvbkNvbmZpcm06ICgpID0+IHt9LFxuICBvbkNhbmNlbDogKCkgPT4ge30sXG4gIGNhbmNlbEJ1dHRvbjoge1xuICAgIGxpbms6IHRydWUsXG4gICAgbGFyZ2U6IHRydWUsXG4gICAgY2hpbGRyZW46ICdDYW5jZWwnXG4gIH0sXG4gIGNvbmZpcm1CdXR0b246IHtcbiAgICBsYXJnZTogdHJ1ZSxcbiAgICB3aWR0aDogJzE2MHB4JyxcbiAgICBjaGlsZHJlbjogJ0NvbmZpcm0nXG4gIH0sXG4gIGNzc1N0eWxlOiBbXVxufTtcblxuY29uc3QgTW9kYWxDb250ZW50V3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIHdpZHRoOiA2MCU7XG4gIHBhZGRpbmc6IDc3cHggOTZweDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDkycHg7XG4gIGxlZnQ6IDA7XG4gIHJpZ2h0OiAwO1xuICBtYXJnaW4tbGVmdDogYXV0bztcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICB0cmFuc2l0aW9uOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRyYW5zaXRpb259O1xuICBtaW4td2lkdGg6IDYwMHB4O1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICBtYXJnaW4tcmlnaHQ6IGF1dG87XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGFiZWxDb2xvckxUfTtcbiAgJHtwcm9wcyA9PiBwcm9wcy5jc3NTdHlsZSB8fCAnJ307XG5gO1xuXG5jb25zdCBDbG9zZUJ1dHRvbiA9IHN0eWxlZC5kaXZgXG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRpdGxlQ29sb3JMVH07XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG4gIGxlZnQ6IDA7XG4gIHBhZGRpbmc6IDI0cHg7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICB3aWR0aDogMTAwJTtcbiAgei1pbmRleDogMTAwMDU7XG5cbiAgOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gIH1cbmA7XG5cbmNvbnN0IE1vZGFsVGl0bGUgPSBzdHlsZWQuZGl2YFxuICBmb250LXNpemU6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubW9kYWxUaXRsZUZvbnRTaXplfTtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubW9kYWxUaXRsZUNvbG9yfTtcbiAgbWFyZ2luLWJvdHRvbTogMTBweDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB6LWluZGV4OiAxMDAwMztcbmA7XG5cbmNvbnN0IE1vZGFsRm9vdGVyID0gc3R5bGVkLmRpdmBcbiAgd2lkdGg6IDEwMCU7XG4gIGxlZnQ6IDA7XG4gIGJvdHRvbTogMDtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgcGFkZGluZy10b3A6IDM2cHg7XG4gIC8vcGFkZGluZy1ib3R0b206IDY0cHg7XG4gIC8vYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5tb2RhbEZvb3RlckJnZH07XG4gIC8vaGVpZ2h0OiAyMzRweDtcbiAgLy9wb3NpdGlvbjogYWJzb2x1dGU7XG4gIHotaW5kZXg6IDEwMDAxO1xuYDtcblxuY29uc3QgTW9kYWxDb250ZW50ID0gc3R5bGVkLmRpdmBcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB6LWluZGV4OiAxMDAwMjtcbmA7XG5cbmNvbnN0IEZvb3RlckFjdGlvbldyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuICAvL3BhZGRpbmctcmlnaHQ6IDk2cHg7XG5gO1xuXG5jb25zdCBGb290ZXIgPSAoe2NhbmNlbCwgY29uZmlybSwgY2FuY2VsQnV0dG9uLCBjb25maXJtQnV0dG9ufSkgPT4gKFxuICA8TW9kYWxGb290ZXIgY2xhc3NOYW1lPVwibW9kYWwtLWZvb3RlclwiPlxuICAgIDxGb290ZXJBY3Rpb25XcmFwcGVyPlxuICAgICAgPEJ1dHRvbiB7Li4uY2FuY2VsQnV0dG9ufSBvbkNsaWNrPXtjYW5jZWx9PlxuICAgICAgICB7Y2FuY2VsQnV0dG9uLmNoaWxkcmVufVxuICAgICAgPC9CdXR0b24+XG4gICAgICA8QnV0dG9uIHsuLi5jb25maXJtQnV0dG9ufSBvbkNsaWNrPXtjb25maXJtfT5cbiAgICAgICAge2NvbmZpcm1CdXR0b24uY2hpbGRyZW59XG4gICAgICA8L0J1dHRvbj5cbiAgICA8L0Zvb3RlckFjdGlvbldyYXBwZXI+XG4gIDwvTW9kYWxGb290ZXI+XG4pO1xuXG5jbGFzcyBNb2RhbERpYWxvZyBleHRlbmRzIENvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7cHJvcHN9ID0gdGhpcztcbiAgICByZXR1cm4gKFxuICAgICAgPE1vZGFsXG4gICAgICAgIHsuLi5wcm9wc31cbiAgICAgICAgYXJpYUhpZGVBcHA9e2ZhbHNlfVxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIG92ZXJsYXk6IHtcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMC41KScsXG4gICAgICAgICAgICB6SW5kZXg6IDEwMDAwLFxuICAgICAgICAgICAgb3ZlcmZsb3dZOiAnYXV0bycsXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJ1xuICAgICAgICAgIH1cbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPE1vZGFsQ29udGVudFdyYXBwZXJcbiAgICAgICAgICBjbGFzc05hbWU9XCJtb2RhbC0tY29udGVudFwiXG4gICAgICAgICAgY3NzU3R5bGU9e3Byb3BzLmNzc1N0eWxlfVxuICAgICAgICAgIGZvb3Rlcj17cHJvcHMuZm9vdGVyfVxuICAgICAgICA+XG4gICAgICAgICAge3Byb3BzLmNsb3NlID8gKFxuICAgICAgICAgICAgPENsb3NlQnV0dG9uIGNsYXNzTmFtZT1cIm1vZGFsLS1jbG9zZVwiIG9uQ2xpY2s9e3Byb3BzLmNsb3NlfT5cbiAgICAgICAgICAgICAgPERlbGV0ZSBoZWlnaHQ9XCIxNHB4XCIgLz5cbiAgICAgICAgICAgIDwvQ2xvc2VCdXR0b24+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAge3Byb3BzLnRpdGxlID8gKFxuICAgICAgICAgICAgPE1vZGFsVGl0bGUgY2xhc3NOYW1lPVwibW9kYWwtLXRpdGxlXCI+e3Byb3BzLnRpdGxlfTwvTW9kYWxUaXRsZT5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICA8TW9kYWxDb250ZW50IGNsYXNzTmFtZT1cImNvbnRlbnRcIj57cHJvcHMuY2hpbGRyZW59PC9Nb2RhbENvbnRlbnQ+XG4gICAgICAgICAge3Byb3BzLmZvb3RlciA/IChcbiAgICAgICAgICAgIDxGb290ZXJcbiAgICAgICAgICAgICAgY2FuY2VsPXtwcm9wcy5jbG9zZX1cbiAgICAgICAgICAgICAgY29uZmlybT17cHJvcHMub25Db25maXJtfVxuICAgICAgICAgICAgICBjYW5jZWxCdXR0b249e3Byb3BzLmNhbmNlbEJ1dHRvbn1cbiAgICAgICAgICAgICAgY29uZmlybUJ1dHRvbj17cHJvcHMuY29uZmlybUJ1dHRvbn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDwvTW9kYWxDb250ZW50V3JhcHBlcj5cbiAgICAgIDwvTW9kYWw+XG4gICAgKTtcbiAgfVxufVxuXG5Nb2RhbERpYWxvZy5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG5Nb2RhbERpYWxvZy5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG5cbmNvbnN0IFN0eWxlZE1vZGFsID0gc3R5bGVkKE1vZGFsRGlhbG9nKWBcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbiAgdG9wOiAwO1xuICBsZWZ0OiAwO1xuICB6LWluZGV4OiAxMDAwMDtcbiAgdHJhbnNpdGlvbjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50cmFuc2l0aW9ufTtcbmA7XG5cbmV4cG9ydCBkZWZhdWx0IFN0eWxlZE1vZGFsO1xuIl19
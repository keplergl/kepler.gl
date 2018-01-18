'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  width: 60%;\n  padding-top: 77px;\n  padding-bottom: ', ';\n  position: absolute;\n  top: 92px;\n  left: 0;\n  right: 0;\n  margin-left: auto;\n  background-color: #ffffff;\n  border-radius: 4px;\n  transition: ', ';\n  min-width: 600px;\n  overflow: hidden;\n  box-sizing: border-box;\n  margin-right: auto;\n  font-size: 12px;\n  ', ';\n'], ['\n  width: 60%;\n  padding-top: 77px;\n  padding-bottom: ', ';\n  position: absolute;\n  top: 92px;\n  left: 0;\n  right: 0;\n  margin-left: auto;\n  background-color: #ffffff;\n  border-radius: 4px;\n  transition: ', ';\n  min-width: 600px;\n  overflow: hidden;\n  box-sizing: border-box;\n  margin-right: auto;\n  font-size: 12px;\n  ', ';\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  color: ', ';\n  display: flex;\n  justify-content: flex-end;\n  left: 0;\n  padding: 24px;\n  position: absolute;\n  top: 0;\n  width: 100%;\n  z-index: 10005;\n\n  :hover {\n    cursor: pointer;\n  }\n'], ['\n  color: ', ';\n  display: flex;\n  justify-content: flex-end;\n  left: 0;\n  padding: 24px;\n  position: absolute;\n  top: 0;\n  width: 100%;\n  z-index: 10005;\n\n  :hover {\n    cursor: pointer;\n  }\n']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  font-size: ', ';\n  color: ', ';\n  margin-bottom: 10px;\n  padding: 0 96px;\n  position: relative;\n  z-index: 10003;\n'], ['\n  font-size: ', ';\n  color: ', ';\n  margin-bottom: 10px;\n  padding: 0 96px;\n  position: relative;\n  z-index: 10003;\n']),
    _templateObject4 = (0, _taggedTemplateLiteralLoose3.default)(['\n  width: 100%;\n  left: 0;\n  bottom: 0;\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-end;\n  padding-bottom: 64px;\n  background-color: ', ';\n  height: 234px;\n  position: absolute;\n  z-index: 10001;\n'], ['\n  width: 100%;\n  left: 0;\n  bottom: 0;\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-end;\n  padding-bottom: 64px;\n  background-color: ', ';\n  height: 234px;\n  position: absolute;\n  z-index: 10001;\n']),
    _templateObject5 = (0, _taggedTemplateLiteralLoose3.default)(['\n  position: relative;\n  z-index: 10002;\n'], ['\n  position: relative;\n  z-index: 10002;\n']),
    _templateObject6 = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: flex;\n  justify-content: flex-end;\n  padding-right: 96px;\n'], ['\n  display: flex;\n  justify-content: flex-end;\n  padding-right: 96px;\n']),
    _templateObject7 = (0, _taggedTemplateLiteralLoose3.default)(['\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  z-index: 10000;\n  transition: ', ';\n'], ['\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  z-index: 10000;\n  transition: ', ';\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _reactModal = require('react-modal');

var _reactModal2 = _interopRequireDefault(_reactModal);

var _icons = require('./icons');

var _styledComponents3 = require('./styled-components');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ModalContentWrapper = _styledComponents2.default.div(_templateObject, function (props) {
  return props.footer ? '150px' : '77px';
}, function (props) {
  return props.theme.transition;
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
      confirm = _ref.confirm;
  return _react2.default.createElement(
    ModalFooter,
    null,
    _react2.default.createElement(
      FooterActionWrapper,
      null,
      _react2.default.createElement(
        _styledComponents3.Button,
        { link: true, large: true, onClick: cancel },
        'Cancel'
      ),
      _react2.default.createElement(
        _styledComponents3.Button,
        { large: true, onClick: confirm, width: '160px' },
        'Confirm'
      )
    )
  );
};

var ModalDialog = function (_Component) {
  (0, _inherits3.default)(ModalDialog, _Component);

  function ModalDialog() {
    (0, _classCallCheck3.default)(this, ModalDialog);
    return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
  }

  ModalDialog.prototype.render = function render() {
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
        { cssStyle: props.cssStyle, footer: props.footer },
        _react2.default.createElement(
          CloseButton,
          { onClick: props.close },
          _react2.default.createElement(_icons.Delete, { height: '14px' })
        ),
        props.title ? _react2.default.createElement(
          ModalTitle,
          null,
          props.title
        ) : null,
        _react2.default.createElement(
          ModalContent,
          null,
          props.children
        ),
        props.footer ? _react2.default.createElement(Footer, { cancel: props.onClose, confirm: props.onConfirm }) : null
      )
    );
  };

  return ModalDialog;
}(_react.Component);

var StyledModal = (0, _styledComponents2.default)(ModalDialog)(_templateObject7, function (props) {
  return props.theme.transition;
});

exports.default = StyledModal;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9tb2RhbC5qcyJdLCJuYW1lcyI6WyJNb2RhbENvbnRlbnRXcmFwcGVyIiwiZGl2IiwicHJvcHMiLCJmb290ZXIiLCJ0aGVtZSIsInRyYW5zaXRpb24iLCJjc3NTdHlsZSIsIkNsb3NlQnV0dG9uIiwidGl0bGVDb2xvckxUIiwiTW9kYWxUaXRsZSIsIm1vZGFsVGl0bGVGb250U2l6ZSIsIm1vZGFsVGl0bGVDb2xvciIsIk1vZGFsRm9vdGVyIiwibW9kYWxGb290ZXJCZ2QiLCJNb2RhbENvbnRlbnQiLCJGb290ZXJBY3Rpb25XcmFwcGVyIiwiRm9vdGVyIiwiY2FuY2VsIiwiY29uZmlybSIsIk1vZGFsRGlhbG9nIiwicmVuZGVyIiwib3ZlcmxheSIsImJhY2tncm91bmRDb2xvciIsInpJbmRleCIsIm92ZXJmbG93WSIsInBvc2l0aW9uIiwiY2xvc2UiLCJ0aXRsZSIsImNoaWxkcmVuIiwib25DbG9zZSIsIm9uQ29uZmlybSIsIlN0eWxlZE1vZGFsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxzQkFBc0IsMkJBQU9DLEdBQTdCLGtCQUdjO0FBQUEsU0FBVUMsTUFBTUMsTUFBTixHQUFlLE9BQWYsR0FBeUIsTUFBbkM7QUFBQSxDQUhkLEVBV1U7QUFBQSxTQUFTRCxNQUFNRSxLQUFOLENBQVlDLFVBQXJCO0FBQUEsQ0FYVixFQWlCRjtBQUFBLFNBQVNILE1BQU1JLFFBQU4sSUFBa0IsRUFBM0I7QUFBQSxDQWpCRSxDQUFOOztBQW9CQSxJQUFNQyxjQUFjLDJCQUFPTixHQUFyQixtQkFDSztBQUFBLFNBQVNDLE1BQU1FLEtBQU4sQ0FBWUksWUFBckI7QUFBQSxDQURMLENBQU47O0FBZ0JBLElBQU1DLGFBQWEsMkJBQU9SLEdBQXBCLG1CQUNTO0FBQUEsU0FBU0MsTUFBTUUsS0FBTixDQUFZTSxrQkFBckI7QUFBQSxDQURULEVBRUs7QUFBQSxTQUFTUixNQUFNRSxLQUFOLENBQVlPLGVBQXJCO0FBQUEsQ0FGTCxDQUFOOztBQVNBLElBQU1DLGNBQWMsMkJBQU9YLEdBQXJCLG1CQVFnQjtBQUFBLFNBQVNDLE1BQU1FLEtBQU4sQ0FBWVMsY0FBckI7QUFBQSxDQVJoQixDQUFOOztBQWNBLElBQU1DLGVBQWUsMkJBQU9iLEdBQXRCLGtCQUFOOztBQUtBLElBQU1jLHNCQUFzQiwyQkFBT2QsR0FBN0Isa0JBQU47O0FBTUEsSUFBTWUsU0FBUyxTQUFUQSxNQUFTO0FBQUEsTUFBRUMsTUFBRixRQUFFQSxNQUFGO0FBQUEsTUFBVUMsT0FBVixRQUFVQSxPQUFWO0FBQUEsU0FDYjtBQUFDLGVBQUQ7QUFBQTtBQUNFO0FBQUMseUJBQUQ7QUFBQTtBQUNFO0FBQUE7QUFBQSxVQUFRLFVBQVIsRUFBYSxXQUFiLEVBQW1CLFNBQVNELE1BQTVCO0FBQUE7QUFBQSxPQURGO0FBSUU7QUFBQTtBQUFBLFVBQVEsV0FBUixFQUFjLFNBQVNDLE9BQXZCLEVBQWdDLE9BQU0sT0FBdEM7QUFBQTtBQUFBO0FBSkY7QUFERixHQURhO0FBQUEsQ0FBZjs7SUFhTUMsVzs7Ozs7Ozs7d0JBRUpDLE0scUJBQVM7QUFBQSxRQUNBbEIsS0FEQSxHQUNTLElBRFQsQ0FDQUEsS0FEQTs7QUFFUCxXQUNFO0FBQUE7QUFBQSxpQ0FDTUEsS0FETjtBQUVFLHFCQUFhLEtBRmY7QUFHRSxlQUFPO0FBQ0xtQixtQkFBUztBQUNQQyw2QkFBaUIsb0JBRFY7QUFFUEMsb0JBQVEsS0FGRDtBQUdQQyx1QkFBVyxNQUhKO0FBSVBDLHNCQUFVO0FBSkg7QUFESjtBQUhUO0FBWUU7QUFBQywyQkFBRDtBQUFBLFVBQXFCLFVBQVV2QixNQUFNSSxRQUFyQyxFQUErQyxRQUFRSixNQUFNQyxNQUE3RDtBQUNFO0FBQUMscUJBQUQ7QUFBQSxZQUFhLFNBQVNELE1BQU13QixLQUE1QjtBQUNFLHlEQUFRLFFBQU8sTUFBZjtBQURGLFNBREY7QUFJR3hCLGNBQU15QixLQUFOLEdBQWM7QUFBQyxvQkFBRDtBQUFBO0FBQWF6QixnQkFBTXlCO0FBQW5CLFNBQWQsR0FBdUQsSUFKMUQ7QUFLRTtBQUFDLHNCQUFEO0FBQUE7QUFBZXpCLGdCQUFNMEI7QUFBckIsU0FMRjtBQU1HMUIsY0FBTUMsTUFBTixHQUNDLDhCQUFDLE1BQUQsSUFBUSxRQUFRRCxNQUFNMkIsT0FBdEIsRUFBK0IsU0FBUzNCLE1BQU00QixTQUE5QyxHQURELEdBRUc7QUFSTjtBQVpGLEtBREY7QUF5QkQsRzs7Ozs7QUFHSCxJQUFNQyxjQUFjLGdDQUFPWixXQUFQLENBQWQsbUJBTVU7QUFBQSxTQUFTakIsTUFBTUUsS0FBTixDQUFZQyxVQUFyQjtBQUFBLENBTlYsQ0FBTjs7a0JBU2UwQixXIiwiZmlsZSI6Im1vZGFsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBNb2RhbCBmcm9tICdyZWFjdC1tb2RhbCc7XG5pbXBvcnQge0RlbGV0ZX0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuaW1wb3J0IHtCdXR0b259IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcblxuY29uc3QgTW9kYWxDb250ZW50V3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIHdpZHRoOiA2MCU7XG4gIHBhZGRpbmctdG9wOiA3N3B4O1xuICBwYWRkaW5nLWJvdHRvbTogJHtwcm9wcyA9PiAocHJvcHMuZm9vdGVyID8gJzE1MHB4JyA6ICc3N3B4Jyl9O1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogOTJweDtcbiAgbGVmdDogMDtcbiAgcmlnaHQ6IDA7XG4gIG1hcmdpbi1sZWZ0OiBhdXRvO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmO1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIHRyYW5zaXRpb246ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudHJhbnNpdGlvbn07XG4gIG1pbi13aWR0aDogNjAwcHg7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIG1hcmdpbi1yaWdodDogYXV0bztcbiAgZm9udC1zaXplOiAxMnB4O1xuICAke3Byb3BzID0+IHByb3BzLmNzc1N0eWxlIHx8ICcnfTtcbmA7XG5cbmNvbnN0IENsb3NlQnV0dG9uID0gc3R5bGVkLmRpdmBcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGl0bGVDb2xvckxUfTtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgbGVmdDogMDtcbiAgcGFkZGluZzogMjRweDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDA7XG4gIHdpZHRoOiAxMDAlO1xuICB6LWluZGV4OiAxMDAwNTtcblxuICA6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgfVxuYDtcblxuY29uc3QgTW9kYWxUaXRsZSA9IHN0eWxlZC5kaXZgXG4gIGZvbnQtc2l6ZTogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5tb2RhbFRpdGxlRm9udFNpemV9O1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5tb2RhbFRpdGxlQ29sb3J9O1xuICBtYXJnaW4tYm90dG9tOiAxMHB4O1xuICBwYWRkaW5nOiAwIDk2cHg7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgei1pbmRleDogMTAwMDM7XG5gO1xuXG5jb25zdCBNb2RhbEZvb3RlciA9IHN0eWxlZC5kaXZgXG4gIHdpZHRoOiAxMDAlO1xuICBsZWZ0OiAwO1xuICBib3R0b206IDA7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG4gIHBhZGRpbmctYm90dG9tOiA2NHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLm1vZGFsRm9vdGVyQmdkfTtcbiAgaGVpZ2h0OiAyMzRweDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB6LWluZGV4OiAxMDAwMTtcbmA7XG5cbmNvbnN0IE1vZGFsQ29udGVudCA9IHN0eWxlZC5kaXZgXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgei1pbmRleDogMTAwMDI7XG5gO1xuXG5jb25zdCBGb290ZXJBY3Rpb25XcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgcGFkZGluZy1yaWdodDogOTZweDtcbmA7XG5cbmNvbnN0IEZvb3RlciA9ICh7Y2FuY2VsLCBjb25maXJtfSkgPT4gKFxuICA8TW9kYWxGb290ZXI+XG4gICAgPEZvb3RlckFjdGlvbldyYXBwZXI+XG4gICAgICA8QnV0dG9uIGxpbmsgbGFyZ2Ugb25DbGljaz17Y2FuY2VsfT5cbiAgICAgICAgQ2FuY2VsXG4gICAgICA8L0J1dHRvbj5cbiAgICAgIDxCdXR0b24gbGFyZ2Ugb25DbGljaz17Y29uZmlybX0gd2lkdGg9XCIxNjBweFwiPlxuICAgICAgICBDb25maXJtXG4gICAgICA8L0J1dHRvbj5cbiAgICA8L0Zvb3RlckFjdGlvbldyYXBwZXI+XG4gIDwvTW9kYWxGb290ZXI+XG4pO1xuXG5jbGFzcyBNb2RhbERpYWxvZyBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtwcm9wc30gPSB0aGlzO1xuICAgIHJldHVybiAoXG4gICAgICA8TW9kYWxcbiAgICAgICAgey4uLnByb3BzfVxuICAgICAgICBhcmlhSGlkZUFwcD17ZmFsc2V9XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgb3ZlcmxheToge1xuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAncmdiYSgwLCAwLCAwLCAwLjUpJyxcbiAgICAgICAgICAgIHpJbmRleDogMTAwMDAsXG4gICAgICAgICAgICBvdmVyZmxvd1k6ICdhdXRvJyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnXG4gICAgICAgICAgfVxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8TW9kYWxDb250ZW50V3JhcHBlciBjc3NTdHlsZT17cHJvcHMuY3NzU3R5bGV9IGZvb3Rlcj17cHJvcHMuZm9vdGVyfT5cbiAgICAgICAgICA8Q2xvc2VCdXR0b24gb25DbGljaz17cHJvcHMuY2xvc2V9PlxuICAgICAgICAgICAgPERlbGV0ZSBoZWlnaHQ9XCIxNHB4XCIgLz5cbiAgICAgICAgICA8L0Nsb3NlQnV0dG9uPlxuICAgICAgICAgIHtwcm9wcy50aXRsZSA/IDxNb2RhbFRpdGxlPntwcm9wcy50aXRsZX08L01vZGFsVGl0bGU+IDogbnVsbH1cbiAgICAgICAgICA8TW9kYWxDb250ZW50Pntwcm9wcy5jaGlsZHJlbn08L01vZGFsQ29udGVudD5cbiAgICAgICAgICB7cHJvcHMuZm9vdGVyID8gKFxuICAgICAgICAgICAgPEZvb3RlciBjYW5jZWw9e3Byb3BzLm9uQ2xvc2V9IGNvbmZpcm09e3Byb3BzLm9uQ29uZmlybX0gLz5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgPC9Nb2RhbENvbnRlbnRXcmFwcGVyPlxuICAgICAgPC9Nb2RhbD5cbiAgICApO1xuICB9XG59XG5cbmNvbnN0IFN0eWxlZE1vZGFsID0gc3R5bGVkKE1vZGFsRGlhbG9nKWBcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbiAgdG9wOiAwO1xuICBsZWZ0OiAwO1xuICB6LWluZGV4OiAxMDAwMDtcbiAgdHJhbnNpdGlvbjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50cmFuc2l0aW9ufTtcbmA7XG5cbmV4cG9ydCBkZWZhdWx0IFN0eWxlZE1vZGFsO1xuIl19
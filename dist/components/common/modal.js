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
        props.footer ? _react2.default.createElement(Footer, { cancel: props.close, confirm: props.onConfirm }) : null
      )
    );
  };

  return ModalDialog;
}(_react.Component);

var StyledModal = (0, _styledComponents2.default)(ModalDialog)(_templateObject7, function (props) {
  return props.theme.transition;
});

exports.default = StyledModal;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9tb2RhbC5qcyJdLCJuYW1lcyI6WyJNb2RhbENvbnRlbnRXcmFwcGVyIiwiZGl2IiwicHJvcHMiLCJmb290ZXIiLCJ0aGVtZSIsInRyYW5zaXRpb24iLCJjc3NTdHlsZSIsIkNsb3NlQnV0dG9uIiwidGl0bGVDb2xvckxUIiwiTW9kYWxUaXRsZSIsIm1vZGFsVGl0bGVGb250U2l6ZSIsIm1vZGFsVGl0bGVDb2xvciIsIk1vZGFsRm9vdGVyIiwibW9kYWxGb290ZXJCZ2QiLCJNb2RhbENvbnRlbnQiLCJGb290ZXJBY3Rpb25XcmFwcGVyIiwiRm9vdGVyIiwiY2FuY2VsIiwiY29uZmlybSIsIk1vZGFsRGlhbG9nIiwicmVuZGVyIiwib3ZlcmxheSIsImJhY2tncm91bmRDb2xvciIsInpJbmRleCIsIm92ZXJmbG93WSIsInBvc2l0aW9uIiwiY2xvc2UiLCJ0aXRsZSIsImNoaWxkcmVuIiwib25Db25maXJtIiwiU3R5bGVkTW9kYWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUVBLElBQU1BLHNCQUFzQiwyQkFBT0MsR0FBN0Isa0JBR2M7QUFBQSxTQUFVQyxNQUFNQyxNQUFOLEdBQWUsT0FBZixHQUF5QixNQUFuQztBQUFBLENBSGQsRUFXVTtBQUFBLFNBQVNELE1BQU1FLEtBQU4sQ0FBWUMsVUFBckI7QUFBQSxDQVhWLEVBaUJGO0FBQUEsU0FBU0gsTUFBTUksUUFBTixJQUFrQixFQUEzQjtBQUFBLENBakJFLENBQU47O0FBb0JBLElBQU1DLGNBQWMsMkJBQU9OLEdBQXJCLG1CQUNLO0FBQUEsU0FBU0MsTUFBTUUsS0FBTixDQUFZSSxZQUFyQjtBQUFBLENBREwsQ0FBTjs7QUFnQkEsSUFBTUMsYUFBYSwyQkFBT1IsR0FBcEIsbUJBQ1M7QUFBQSxTQUFTQyxNQUFNRSxLQUFOLENBQVlNLGtCQUFyQjtBQUFBLENBRFQsRUFFSztBQUFBLFNBQVNSLE1BQU1FLEtBQU4sQ0FBWU8sZUFBckI7QUFBQSxDQUZMLENBQU47O0FBU0EsSUFBTUMsY0FBYywyQkFBT1gsR0FBckIsbUJBUWdCO0FBQUEsU0FBU0MsTUFBTUUsS0FBTixDQUFZUyxjQUFyQjtBQUFBLENBUmhCLENBQU47O0FBY0EsSUFBTUMsZUFBZSwyQkFBT2IsR0FBdEIsa0JBQU47O0FBS0EsSUFBTWMsc0JBQXNCLDJCQUFPZCxHQUE3QixrQkFBTjs7QUFNQSxJQUFNZSxTQUFTLFNBQVRBLE1BQVM7QUFBQSxNQUFFQyxNQUFGLFFBQUVBLE1BQUY7QUFBQSxNQUFVQyxPQUFWLFFBQVVBLE9BQVY7QUFBQSxTQUNiO0FBQUMsZUFBRDtBQUFBO0FBQ0U7QUFBQyx5QkFBRDtBQUFBO0FBQ0U7QUFBQTtBQUFBLFVBQVEsVUFBUixFQUFhLFdBQWIsRUFBbUIsU0FBU0QsTUFBNUI7QUFBQTtBQUFBLE9BREY7QUFJRTtBQUFBO0FBQUEsVUFBUSxXQUFSLEVBQWMsU0FBU0MsT0FBdkIsRUFBZ0MsT0FBTSxPQUF0QztBQUFBO0FBQUE7QUFKRjtBQURGLEdBRGE7QUFBQSxDQUFmOztJQWFNQyxXOzs7Ozs7Ozt3QkFDSkMsTSxxQkFBUztBQUFBLFFBQ0FsQixLQURBLEdBQ1MsSUFEVCxDQUNBQSxLQURBOztBQUVQLFdBQ0U7QUFBQTtBQUFBLGlDQUNNQSxLQUROO0FBRUUscUJBQWEsS0FGZjtBQUdFLGVBQU87QUFDTG1CLG1CQUFTO0FBQ1BDLDZCQUFpQixvQkFEVjtBQUVQQyxvQkFBUSxLQUZEO0FBR1BDLHVCQUFXLE1BSEo7QUFJUEMsc0JBQVU7QUFKSDtBQURKO0FBSFQ7QUFZRTtBQUFDLDJCQUFEO0FBQUEsVUFBcUIsVUFBVXZCLE1BQU1JLFFBQXJDLEVBQStDLFFBQVFKLE1BQU1DLE1BQTdEO0FBQ0U7QUFBQyxxQkFBRDtBQUFBLFlBQWEsU0FBU0QsTUFBTXdCLEtBQTVCO0FBQ0UseURBQVEsUUFBTyxNQUFmO0FBREYsU0FERjtBQUlHeEIsY0FBTXlCLEtBQU4sR0FBYztBQUFDLG9CQUFEO0FBQUE7QUFBYXpCLGdCQUFNeUI7QUFBbkIsU0FBZCxHQUF1RCxJQUoxRDtBQUtFO0FBQUMsc0JBQUQ7QUFBQTtBQUFlekIsZ0JBQU0wQjtBQUFyQixTQUxGO0FBTUcxQixjQUFNQyxNQUFOLEdBQ0MsOEJBQUMsTUFBRCxJQUFRLFFBQVFELE1BQU13QixLQUF0QixFQUE2QixTQUFTeEIsTUFBTTJCLFNBQTVDLEdBREQsR0FFRztBQVJOO0FBWkYsS0FERjtBQXlCRCxHOzs7OztBQUdILElBQU1DLGNBQWMsZ0NBQU9YLFdBQVAsQ0FBZCxtQkFNVTtBQUFBLFNBQVNqQixNQUFNRSxLQUFOLENBQVlDLFVBQXJCO0FBQUEsQ0FOVixDQUFOOztrQkFTZXlCLFciLCJmaWxlIjoibW9kYWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IE1vZGFsIGZyb20gJ3JlYWN0LW1vZGFsJztcbmltcG9ydCB7RGVsZXRlfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5pbXBvcnQge0J1dHRvbn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuXG5jb25zdCBNb2RhbENvbnRlbnRXcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgd2lkdGg6IDYwJTtcbiAgcGFkZGluZy10b3A6IDc3cHg7XG4gIHBhZGRpbmctYm90dG9tOiAke3Byb3BzID0+IChwcm9wcy5mb290ZXIgPyAnMTUwcHgnIDogJzc3cHgnKX07XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiA5MnB4O1xuICBsZWZ0OiAwO1xuICByaWdodDogMDtcbiAgbWFyZ2luLWxlZnQ6IGF1dG87XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgdHJhbnNpdGlvbjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50cmFuc2l0aW9ufTtcbiAgbWluLXdpZHRoOiA2MDBweDtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgbWFyZ2luLXJpZ2h0OiBhdXRvO1xuICBmb250LXNpemU6IDEycHg7XG4gICR7cHJvcHMgPT4gcHJvcHMuY3NzU3R5bGUgfHwgJyd9O1xuYDtcblxuY29uc3QgQ2xvc2VCdXR0b24gPSBzdHlsZWQuZGl2YFxuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50aXRsZUNvbG9yTFR9O1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuICBsZWZ0OiAwO1xuICBwYWRkaW5nOiAyNHB4O1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgd2lkdGg6IDEwMCU7XG4gIHotaW5kZXg6IDEwMDA1O1xuXG4gIDpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICB9XG5gO1xuXG5jb25zdCBNb2RhbFRpdGxlID0gc3R5bGVkLmRpdmBcbiAgZm9udC1zaXplOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLm1vZGFsVGl0bGVGb250U2l6ZX07XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLm1vZGFsVGl0bGVDb2xvcn07XG4gIG1hcmdpbi1ib3R0b206IDEwcHg7XG4gIHBhZGRpbmc6IDAgOTZweDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB6LWluZGV4OiAxMDAwMztcbmA7XG5cbmNvbnN0IE1vZGFsRm9vdGVyID0gc3R5bGVkLmRpdmBcbiAgd2lkdGg6IDEwMCU7XG4gIGxlZnQ6IDA7XG4gIGJvdHRvbTogMDtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgcGFkZGluZy1ib3R0b206IDY0cHg7XG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubW9kYWxGb290ZXJCZ2R9O1xuICBoZWlnaHQ6IDIzNHB4O1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHotaW5kZXg6IDEwMDAxO1xuYDtcblxuY29uc3QgTW9kYWxDb250ZW50ID0gc3R5bGVkLmRpdmBcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB6LWluZGV4OiAxMDAwMjtcbmA7XG5cbmNvbnN0IEZvb3RlckFjdGlvbldyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuICBwYWRkaW5nLXJpZ2h0OiA5NnB4O1xuYDtcblxuY29uc3QgRm9vdGVyID0gKHtjYW5jZWwsIGNvbmZpcm19KSA9PiAoXG4gIDxNb2RhbEZvb3Rlcj5cbiAgICA8Rm9vdGVyQWN0aW9uV3JhcHBlcj5cbiAgICAgIDxCdXR0b24gbGluayBsYXJnZSBvbkNsaWNrPXtjYW5jZWx9PlxuICAgICAgICBDYW5jZWxcbiAgICAgIDwvQnV0dG9uPlxuICAgICAgPEJ1dHRvbiBsYXJnZSBvbkNsaWNrPXtjb25maXJtfSB3aWR0aD1cIjE2MHB4XCI+XG4gICAgICAgIENvbmZpcm1cbiAgICAgIDwvQnV0dG9uPlxuICAgIDwvRm9vdGVyQWN0aW9uV3JhcHBlcj5cbiAgPC9Nb2RhbEZvb3Rlcj5cbik7XG5cbmNsYXNzIE1vZGFsRGlhbG9nIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtwcm9wc30gPSB0aGlzO1xuICAgIHJldHVybiAoXG4gICAgICA8TW9kYWxcbiAgICAgICAgey4uLnByb3BzfVxuICAgICAgICBhcmlhSGlkZUFwcD17ZmFsc2V9XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgb3ZlcmxheToge1xuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAncmdiYSgwLCAwLCAwLCAwLjUpJyxcbiAgICAgICAgICAgIHpJbmRleDogMTAwMDAsXG4gICAgICAgICAgICBvdmVyZmxvd1k6ICdhdXRvJyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnXG4gICAgICAgICAgfVxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8TW9kYWxDb250ZW50V3JhcHBlciBjc3NTdHlsZT17cHJvcHMuY3NzU3R5bGV9IGZvb3Rlcj17cHJvcHMuZm9vdGVyfT5cbiAgICAgICAgICA8Q2xvc2VCdXR0b24gb25DbGljaz17cHJvcHMuY2xvc2V9PlxuICAgICAgICAgICAgPERlbGV0ZSBoZWlnaHQ9XCIxNHB4XCIgLz5cbiAgICAgICAgICA8L0Nsb3NlQnV0dG9uPlxuICAgICAgICAgIHtwcm9wcy50aXRsZSA/IDxNb2RhbFRpdGxlPntwcm9wcy50aXRsZX08L01vZGFsVGl0bGU+IDogbnVsbH1cbiAgICAgICAgICA8TW9kYWxDb250ZW50Pntwcm9wcy5jaGlsZHJlbn08L01vZGFsQ29udGVudD5cbiAgICAgICAgICB7cHJvcHMuZm9vdGVyID8gKFxuICAgICAgICAgICAgPEZvb3RlciBjYW5jZWw9e3Byb3BzLmNsb3NlfSBjb25maXJtPXtwcm9wcy5vbkNvbmZpcm19IC8+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDwvTW9kYWxDb250ZW50V3JhcHBlcj5cbiAgICAgIDwvTW9kYWw+XG4gICAgKTtcbiAgfVxufVxuXG5jb25zdCBTdHlsZWRNb2RhbCA9IHN0eWxlZChNb2RhbERpYWxvZylgXG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgei1pbmRleDogMTAwMDA7XG4gIHRyYW5zaXRpb246ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudHJhbnNpdGlvbn07XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBTdHlsZWRNb2RhbDtcbiJdfQ==
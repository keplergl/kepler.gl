'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('./styled-components');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  description: _react2.default.PropTypes.string.isRequired,
  containerClass: _react2.default.PropTypes.string,
  tooltipSize: _react2.default.PropTypes.string,
  icon: _react2.default.PropTypes.string
};

var InfoHelper = function InfoHelper(_ref) {
  var description = _ref.description,
      containerClass = _ref.containerClass,
      icon = _ref.icon,
      id = _ref.id;
  return _react2.default.createElement(
    'div',
    { className: 'info-helper ' + (containerClass || '') },
    _react2.default.createElement(
      'a',
      { 'data-tip': true, 'data-for': id },
      _react2.default.createElement('i', { className: 'icon icon_' + (icon || 'info') + ' zeta transition--slow' }),
      _react2.default.createElement(
        _styledComponents.Tooltip,
        { id: id, effect: 'solid' },
        _react2.default.createElement(
          'div',
          { className: 'info-helper__content' },
          description
        )
      )
    )
  );
};

InfoHelper.propTypes = propTypes;

exports.default = InfoHelper;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pbmZvLWhlbHBlci5qcyJdLCJuYW1lcyI6WyJwcm9wVHlwZXMiLCJkZXNjcmlwdGlvbiIsIlByb3BUeXBlcyIsInN0cmluZyIsImlzUmVxdWlyZWQiLCJjb250YWluZXJDbGFzcyIsInRvb2x0aXBTaXplIiwiaWNvbiIsIkluZm9IZWxwZXIiLCJpZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUVBLElBQU1BLFlBQVk7QUFDaEJDLGVBQWEsZ0JBQU1DLFNBQU4sQ0FBZ0JDLE1BQWhCLENBQXVCQyxVQURwQjtBQUVoQkMsa0JBQWdCLGdCQUFNSCxTQUFOLENBQWdCQyxNQUZoQjtBQUdoQkcsZUFBYSxnQkFBTUosU0FBTixDQUFnQkMsTUFIYjtBQUloQkksUUFBTSxnQkFBTUwsU0FBTixDQUFnQkM7QUFKTixDQUFsQjs7QUFPQSxJQUFNSyxhQUFhLFNBQWJBLFVBQWE7QUFBQSxNQUFFUCxXQUFGLFFBQUVBLFdBQUY7QUFBQSxNQUFlSSxjQUFmLFFBQWVBLGNBQWY7QUFBQSxNQUErQkUsSUFBL0IsUUFBK0JBLElBQS9CO0FBQUEsTUFBcUNFLEVBQXJDLFFBQXFDQSxFQUFyQztBQUFBLFNBQ2pCO0FBQUE7QUFBQSxNQUFLLDZCQUEwQkosa0JBQWtCLEVBQTVDLENBQUw7QUFDRTtBQUFBO0FBQUEsUUFBRyxnQkFBSCxFQUFZLFlBQVVJLEVBQXRCO0FBQ0UsMkNBQUcsMkJBQXdCRixRQUFRLE1BQWhDLDRCQUFILEdBREY7QUFFRTtBQUFBO0FBQUEsVUFBUyxJQUFJRSxFQUFiLEVBQWlCLFFBQU8sT0FBeEI7QUFDRTtBQUFBO0FBQUEsWUFBSyxXQUFVLHNCQUFmO0FBQXVDUjtBQUF2QztBQURGO0FBRkY7QUFERixHQURpQjtBQUFBLENBQW5COztBQVdBTyxXQUFXUixTQUFYLEdBQXVCQSxTQUF2Qjs7a0JBRWVRLFUiLCJmaWxlIjoiaW5mby1oZWxwZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtUb29sdGlwfSBmcm9tICcuL3N0eWxlZC1jb21wb25lbnRzJztcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICBkZXNjcmlwdGlvbjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBjb250YWluZXJDbGFzczogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgdG9vbHRpcFNpemU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gIGljb246IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcbn07XG5cbmNvbnN0IEluZm9IZWxwZXIgPSAoe2Rlc2NyaXB0aW9uLCBjb250YWluZXJDbGFzcywgaWNvbiwgaWR9KSA9PiAoXG4gIDxkaXYgY2xhc3NOYW1lPXtgaW5mby1oZWxwZXIgJHtjb250YWluZXJDbGFzcyB8fCAnJ31gfT5cbiAgICA8YSBkYXRhLXRpcCBkYXRhLWZvcj17aWR9PlxuICAgICAgPGkgY2xhc3NOYW1lPXtgaWNvbiBpY29uXyR7aWNvbiB8fCAnaW5mbyd9IHpldGEgdHJhbnNpdGlvbi0tc2xvd2B9IC8+XG4gICAgICA8VG9vbHRpcCBpZD17aWR9IGVmZmVjdD1cInNvbGlkXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5mby1oZWxwZXJfX2NvbnRlbnRcIj57ZGVzY3JpcHRpb259PC9kaXY+XG4gICAgICA8L1Rvb2x0aXA+XG4gICAgPC9hPlxuICA8L2Rpdj5cbik7XG5cbkluZm9IZWxwZXIucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuXG5leHBvcnQgZGVmYXVsdCBJbmZvSGVscGVyO1xuIl19
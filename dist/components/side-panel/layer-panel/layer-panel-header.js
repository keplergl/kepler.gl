'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  .layer__remove-layer {\n    opacity: 0;\n  }\n  :hover {\n    cursor: pointer;\n    background-color: ', ';\n    \n    .layer__drag-handle {\n      opacity: 1;\n    }\n    \n    .layer__remove-layer {\n      opacity: 1;  \n    }\n    \n    .layer__enable-config {\n      color: white\n    }\n  }\n'], ['\n  .layer__remove-layer {\n    opacity: 0;\n  }\n  :hover {\n    cursor: pointer;\n    background-color: ', ';\n    \n    .layer__drag-handle {\n      opacity: 1;\n    }\n    \n    .layer__remove-layer {\n      opacity: 1;  \n    }\n    \n    .layer__enable-config {\n      color: white\n    }\n  }\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: flex;\n  color: ', ';\n'], ['\n  display: flex;\n  color: ', ';\n']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: flex;\n'], ['\n  display: flex;\n']),
    _templateObject4 = (0, _taggedTemplateLiteralLoose3.default)(['\n  margin-left: 12px;\n\n  .layer__title__type {\n    color: ', ';\n    font-size: 10px;\n    line-height: 12px;\n    letter-spacing: 0.37px;\n    text-transform: capitalize;\n  }\n'], ['\n  margin-left: 12px;\n\n  .layer__title__type {\n    color: ', ';\n    font-size: 10px;\n    line-height: 12px;\n    letter-spacing: 0.37px;\n    text-transform: capitalize;\n  }\n']),
    _templateObject5 = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: flex;\n  align-items: center;\n  opacity: 0;\n  \n  :hover {\n    cursor: move;\n    color: ', ';\n  }\n'], ['\n  display: flex;\n  align-items: center;\n  opacity: 0;\n  \n  :hover {\n    cursor: move;\n    color: ', ';\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _panelHeaderAction = require('../panel-header-action');

var _panelHeaderAction2 = _interopRequireDefault(_panelHeaderAction);

var _icons = require('../../common/icons');

var _styledComponents3 = require('../../common/styled-components');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  // required
  id: _react2.default.PropTypes.string.isRequired,
  isDragNDropEnabled: _react2.default.PropTypes.bool,
  isVisible: _react2.default.PropTypes.bool.isRequired,
  label: _react2.default.PropTypes.string.isRequired,
  onToggleVisibility: _react2.default.PropTypes.func.isRequired,

  // optional
  className: _react2.default.PropTypes.string,
  idx: _react2.default.PropTypes.number,
  isConfigActive: _react2.default.PropTypes.bool,
  labelRCGColorValues: _react2.default.PropTypes.array,
  onUpdateLayerLabel: _react2.default.PropTypes.func,
  onRemoveLayer: _react2.default.PropTypes.func
};

var defaultProps = {
  isDragNDropEnabled: true,
  showRemoveLayer: true
};

var StyledLayerPanelHeader = _styledComponents3.StyledPanelHeader.extend(_templateObject, function (props) {
  return props.theme.panelBackgroundHover;
});

var HeaderLabelSection = _styledComponents2.default.div(_templateObject2, function (props) {
  return props.theme.textColor;
});

var HeaderActionSection = _styledComponents2.default.div(_templateObject3);

var LayerTitleSection = _styledComponents2.default.div(_templateObject4, function (props) {
  return props.theme.subtextColor;
});

var DragHandle = _styledComponents2.default.div(_templateObject5, function (props) {
  return props.theme.textColorHl;
});

var LayerPanelHeader = function LayerPanelHeader(_ref) {
  var className = _ref.className,
      idx = _ref.idx,
      isConfigActive = _ref.isConfigActive,
      isDragNDropEnabled = _ref.isDragNDropEnabled,
      isVisible = _ref.isVisible,
      label = _ref.label,
      layerId = _ref.layerId,
      layerType = _ref.layerType,
      labelRCGColorValues = _ref.labelRCGColorValues,
      onToggleVisibility = _ref.onToggleVisibility,
      onUpdateLayerLabel = _ref.onUpdateLayerLabel,
      onToggleEnableConfig = _ref.onToggleEnableConfig,
      onRemoveLayer = _ref.onRemoveLayer,
      showRemoveLayer = _ref.showRemoveLayer;
  return _react2.default.createElement(
    StyledLayerPanelHeader,
    {
      className: (0, _classnames2.default)('layer-panel__header', {
        'sort--handle': !isConfigActive
      }),
      active: isConfigActive,
      labelRCGColorValues: labelRCGColorValues,
      onClick: onToggleEnableConfig
    },
    _react2.default.createElement(
      HeaderLabelSection,
      { className: 'layer-panel__header__content' },
      isDragNDropEnabled && _react2.default.createElement(
        DragHandle,
        { className: 'layer__drag-handle' },
        _react2.default.createElement(_icons.VertDots, { height: '20px' })
      ),
      _react2.default.createElement(_panelHeaderAction2.default, {
        className: 'layer__visibility-toggle',
        id: layerId,
        tooltip: isVisible ? 'hide layer' : 'show layer',
        onClick: onToggleVisibility,
        IconComponent: isVisible ? _icons.EyeSeen : _icons.EyeUnseen,
        active: isVisible,
        flush: true
      }),
      _react2.default.createElement(
        LayerTitleSection,
        { className: 'layer__title' },
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(LayerLabelEditor, { label: label, onEdit: onUpdateLayerLabel }),
          _react2.default.createElement(
            'div',
            { className: 'layer__title__type' },
            layerType
          )
        )
      )
    ),
    _react2.default.createElement(
      HeaderActionSection,
      { className: 'layer-panel__header__actions' },
      showRemoveLayer ? _react2.default.createElement(_panelHeaderAction2.default, {
        className: 'layer__remove-layer',
        id: layerId,
        tooltip: 'Remove layer',
        onClick: onRemoveLayer,
        tooltipType: 'error',
        IconComponent: _icons.Trash
      }) : null,
      _react2.default.createElement(_panelHeaderAction2.default, {
        className: 'layer__enable-config',
        id: layerId,
        tooltip: 'Layer settings',
        onClick: onToggleEnableConfig,
        IconComponent: _icons.ArrowDown
      })
    )
  );
};

var LayerLabelEditor = function LayerLabelEditor(_ref2) {
  var label = _ref2.label,
      onEdit = _ref2.onEdit;
  return _react2.default.createElement(_styledComponents3.InlineInput, {
    type: 'text',
    className: 'layer__title__editor',
    value: label,
    onClick: function onClick(e) {
      e.stopPropagation();
    },
    onChange: onEdit,
    id: 'input-layer-label'
  });
};

LayerPanelHeader.propTypes = propTypes;
LayerPanelHeader.defaultProps = defaultProps;

exports.default = LayerPanelHeader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvbGF5ZXItcGFuZWwtaGVhZGVyLmpzIl0sIm5hbWVzIjpbInByb3BUeXBlcyIsImlkIiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsImlzRHJhZ05Ecm9wRW5hYmxlZCIsImJvb2wiLCJpc1Zpc2libGUiLCJsYWJlbCIsIm9uVG9nZ2xlVmlzaWJpbGl0eSIsImZ1bmMiLCJjbGFzc05hbWUiLCJpZHgiLCJudW1iZXIiLCJpc0NvbmZpZ0FjdGl2ZSIsImxhYmVsUkNHQ29sb3JWYWx1ZXMiLCJhcnJheSIsIm9uVXBkYXRlTGF5ZXJMYWJlbCIsIm9uUmVtb3ZlTGF5ZXIiLCJkZWZhdWx0UHJvcHMiLCJzaG93UmVtb3ZlTGF5ZXIiLCJTdHlsZWRMYXllclBhbmVsSGVhZGVyIiwiZXh0ZW5kIiwicHJvcHMiLCJ0aGVtZSIsInBhbmVsQmFja2dyb3VuZEhvdmVyIiwiSGVhZGVyTGFiZWxTZWN0aW9uIiwiZGl2IiwidGV4dENvbG9yIiwiSGVhZGVyQWN0aW9uU2VjdGlvbiIsIkxheWVyVGl0bGVTZWN0aW9uIiwic3VidGV4dENvbG9yIiwiRHJhZ0hhbmRsZSIsInRleHRDb2xvckhsIiwiTGF5ZXJQYW5lbEhlYWRlciIsImxheWVySWQiLCJsYXllclR5cGUiLCJvblRvZ2dsZUVuYWJsZUNvbmZpZyIsIkxheWVyTGFiZWxFZGl0b3IiLCJvbkVkaXQiLCJlIiwic3RvcFByb3BhZ2F0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFRQTs7OztBQUVBLElBQU1BLFlBQVk7QUFDaEI7QUFDQUMsTUFBSSxnQkFBTUMsU0FBTixDQUFnQkMsTUFBaEIsQ0FBdUJDLFVBRlg7QUFHaEJDLHNCQUFvQixnQkFBTUgsU0FBTixDQUFnQkksSUFIcEI7QUFJaEJDLGFBQVcsZ0JBQU1MLFNBQU4sQ0FB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UyxrQkFBeEMsR0FERjtBQUVFO0FBQUE7QUFBQSxjQUFLLFdBQVUsb0JBQWY7QUFBcUNtQjtBQUFyQztBQUZGO0FBREY7QUFmRixLQVJGO0FBOEJFO0FBQUMseUJBQUQ7QUFBQSxRQUFxQixXQUFVLDhCQUEvQjtBQUNHaEIsd0JBQ0M7QUFDRSxtQkFBVSxxQkFEWjtBQUVFLFlBQUllLE9BRk47QUFHRSxpQkFBUyxjQUhYO0FBSUUsaUJBQVNqQixhQUpYO0FBS0UscUJBQVksT0FMZDtBQU1FO0FBTkYsUUFERCxHQVNHLElBVk47QUFXRTtBQUNFLG1CQUFVLHNCQURaO0FBRUUsWUFBSWlCLE9BRk47QUFHRSxpQkFBUyxnQkFIWDtBQUlFLGlCQUFTRSxvQkFKWDtBQUtFO0FBTEY7QUFYRjtBQTlCRixHQWhCdUI7QUFBQSxDQUF6Qjs7QUFvRUEsSUFBTUMsbUJBQW1CLFNBQW5CQSxnQkFBbUI7QUFBQSxNQUFFOUIsS0FBRixTQUFFQSxLQUFGO0FBQUEsTUFBUytCLE1BQVQsU0FBU0EsTUFBVDtBQUFBLFNBQ3ZCO0FBQ0UsVUFBSyxNQURQO0FBRUUsZUFBVSxzQkFGWjtBQUdFLFdBQU8vQixLQUhUO0FBSUUsYUFBUyxvQkFBSztBQUNaZ0MsUUFBRUMsZUFBRjtBQUNELEtBTkg7QUFPRSxjQUFVRixNQVBaO0FBUUUsUUFBRztBQVJMLElBRHVCO0FBQUEsQ0FBekI7O0FBYUFMLGlCQUFpQmxDLFNBQWpCLEdBQTZCQSxTQUE3QjtBQUNBa0MsaUJBQWlCZixZQUFqQixHQUFnQ0EsWUFBaEM7O2tCQUVlZSxnQiIsImZpbGUiOiJsYXllci1wYW5lbC1oZWFkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBQYW5lbEhlYWRlckFjdGlvbiBmcm9tICdjb21wb25lbnRzL3NpZGUtcGFuZWwvcGFuZWwtaGVhZGVyLWFjdGlvbic7XG5pbXBvcnQge1xuICBFeWVTZWVuLFxuICBFeWVVbnNlZW4sXG4gIFZlcnREb3RzLFxuICBBcnJvd0Rvd24sXG4gIFRyYXNoXG59IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcblxuaW1wb3J0IHtJbmxpbmVJbnB1dCwgU3R5bGVkUGFuZWxIZWFkZXJ9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICAvLyByZXF1aXJlZFxuICBpZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBpc0RyYWdORHJvcEVuYWJsZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICBpc1Zpc2libGU6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gIGxhYmVsOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIG9uVG9nZ2xlVmlzaWJpbGl0eTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAvLyBvcHRpb25hbFxuICBjbGFzc05hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gIGlkeDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgaXNDb25maWdBY3RpdmU6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICBsYWJlbFJDR0NvbG9yVmFsdWVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXksXG4gIG9uVXBkYXRlTGF5ZXJMYWJlbDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gIG9uUmVtb3ZlTGF5ZXI6IFJlYWN0LlByb3BUeXBlcy5mdW5jXG59O1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIGlzRHJhZ05Ecm9wRW5hYmxlZDogdHJ1ZSxcbiAgc2hvd1JlbW92ZUxheWVyOiB0cnVlXG59O1xuXG5jb25zdCBTdHlsZWRMYXllclBhbmVsSGVhZGVyID0gU3R5bGVkUGFuZWxIZWFkZXIuZXh0ZW5kYFxuICAubGF5ZXJfX3JlbW92ZS1sYXllciB7XG4gICAgb3BhY2l0eTogMDtcbiAgfVxuICA6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsQmFja2dyb3VuZEhvdmVyfTtcbiAgICBcbiAgICAubGF5ZXJfX2RyYWctaGFuZGxlIHtcbiAgICAgIG9wYWNpdHk6IDE7XG4gICAgfVxuICAgIFxuICAgIC5sYXllcl9fcmVtb3ZlLWxheWVyIHtcbiAgICAgIG9wYWNpdHk6IDE7ICBcbiAgICB9XG4gICAgXG4gICAgLmxheWVyX19lbmFibGUtY29uZmlnIHtcbiAgICAgIGNvbG9yOiB3aGl0ZVxuICAgIH1cbiAgfVxuYDtcblxuY29uc3QgSGVhZGVyTGFiZWxTZWN0aW9uID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yfTtcbmA7XG5cbmNvbnN0IEhlYWRlckFjdGlvblNlY3Rpb24gPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuYDtcblxuY29uc3QgTGF5ZXJUaXRsZVNlY3Rpb24gPSBzdHlsZWQuZGl2YFxuICBtYXJnaW4tbGVmdDogMTJweDtcblxuICAubGF5ZXJfX3RpdGxlX190eXBlIHtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zdWJ0ZXh0Q29sb3J9O1xuICAgIGZvbnQtc2l6ZTogMTBweDtcbiAgICBsaW5lLWhlaWdodDogMTJweDtcbiAgICBsZXR0ZXItc3BhY2luZzogMC4zN3B4O1xuICAgIHRleHQtdHJhbnNmb3JtOiBjYXBpdGFsaXplO1xuICB9XG5gO1xuXG5jb25zdCBEcmFnSGFuZGxlID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgb3BhY2l0eTogMDtcbiAgXG4gIDpob3ZlciB7XG4gICAgY3Vyc29yOiBtb3ZlO1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckhsfTtcbiAgfVxuYDtcblxuY29uc3QgTGF5ZXJQYW5lbEhlYWRlciA9ICh7XG4gIGNsYXNzTmFtZSxcbiAgaWR4LFxuICBpc0NvbmZpZ0FjdGl2ZSxcbiAgaXNEcmFnTkRyb3BFbmFibGVkLFxuICBpc1Zpc2libGUsXG4gIGxhYmVsLFxuICBsYXllcklkLFxuICBsYXllclR5cGUsXG4gIGxhYmVsUkNHQ29sb3JWYWx1ZXMsXG4gIG9uVG9nZ2xlVmlzaWJpbGl0eSxcbiAgb25VcGRhdGVMYXllckxhYmVsLFxuICBvblRvZ2dsZUVuYWJsZUNvbmZpZyxcbiAgb25SZW1vdmVMYXllcixcbiAgc2hvd1JlbW92ZUxheWVyXG59KSA9PiAoXG4gIDxTdHlsZWRMYXllclBhbmVsSGVhZGVyXG4gICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCdsYXllci1wYW5lbF9faGVhZGVyJywge1xuICAgICAgJ3NvcnQtLWhhbmRsZSc6ICFpc0NvbmZpZ0FjdGl2ZVxuICAgIH0pfVxuICAgIGFjdGl2ZT17aXNDb25maWdBY3RpdmV9XG4gICAgbGFiZWxSQ0dDb2xvclZhbHVlcz17bGFiZWxSQ0dDb2xvclZhbHVlc31cbiAgICBvbkNsaWNrPXtvblRvZ2dsZUVuYWJsZUNvbmZpZ31cbiAgPlxuICAgIDxIZWFkZXJMYWJlbFNlY3Rpb24gY2xhc3NOYW1lPVwibGF5ZXItcGFuZWxfX2hlYWRlcl9fY29udGVudFwiPlxuICAgICAge2lzRHJhZ05Ecm9wRW5hYmxlZCAmJiAoXG4gICAgICAgIDxEcmFnSGFuZGxlIGNsYXNzTmFtZT1cImxheWVyX19kcmFnLWhhbmRsZVwiPlxuICAgICAgICAgIDxWZXJ0RG90cyBoZWlnaHQ9XCIyMHB4XCIgLz5cbiAgICAgICAgPC9EcmFnSGFuZGxlPlxuICAgICAgKX1cbiAgICAgIDxQYW5lbEhlYWRlckFjdGlvblxuICAgICAgICBjbGFzc05hbWU9XCJsYXllcl9fdmlzaWJpbGl0eS10b2dnbGVcIlxuICAgICAgICBpZD17bGF5ZXJJZH1cbiAgICAgICAgdG9vbHRpcD17aXNWaXNpYmxlID8gJ2hpZGUgbGF5ZXInIDogJ3Nob3cgbGF5ZXInfVxuICAgICAgICBvbkNsaWNrPXtvblRvZ2dsZVZpc2liaWxpdHl9XG4gICAgICAgIEljb25Db21wb25lbnQ9e2lzVmlzaWJsZSA/IEV5ZVNlZW4gOiBFeWVVbnNlZW59XG4gICAgICAgIGFjdGl2ZT17aXNWaXNpYmxlfVxuICAgICAgICBmbHVzaFxuICAgICAgLz5cbiAgICAgIDxMYXllclRpdGxlU2VjdGlvbiBjbGFzc05hbWU9XCJsYXllcl9fdGl0bGVcIj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8TGF5ZXJMYWJlbEVkaXRvciBsYWJlbD17bGFiZWx9IG9uRWRpdD17b25VcGRhdGVMYXllckxhYmVsfSAvPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGF5ZXJfX3RpdGxlX190eXBlXCI+e2xheWVyVHlwZX08L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L0xheWVyVGl0bGVTZWN0aW9uPlxuICAgIDwvSGVhZGVyTGFiZWxTZWN0aW9uPlxuICAgIDxIZWFkZXJBY3Rpb25TZWN0aW9uIGNsYXNzTmFtZT1cImxheWVyLXBhbmVsX19oZWFkZXJfX2FjdGlvbnNcIj5cbiAgICAgIHtzaG93UmVtb3ZlTGF5ZXIgPyAoXG4gICAgICAgIDxQYW5lbEhlYWRlckFjdGlvblxuICAgICAgICAgIGNsYXNzTmFtZT1cImxheWVyX19yZW1vdmUtbGF5ZXJcIlxuICAgICAgICAgIGlkPXtsYXllcklkfVxuICAgICAgICAgIHRvb2x0aXA9eydSZW1vdmUgbGF5ZXInfVxuICAgICAgICAgIG9uQ2xpY2s9e29uUmVtb3ZlTGF5ZXJ9XG4gICAgICAgICAgdG9vbHRpcFR5cGU9XCJlcnJvclwiXG4gICAgICAgICAgSWNvbkNvbXBvbmVudD17VHJhc2h9XG4gICAgICAgIC8+XG4gICAgICApIDogbnVsbH1cbiAgICAgIDxQYW5lbEhlYWRlckFjdGlvblxuICAgICAgICBjbGFzc05hbWU9XCJsYXllcl9fZW5hYmxlLWNvbmZpZ1wiXG4gICAgICAgIGlkPXtsYXllcklkfVxuICAgICAgICB0b29sdGlwPXsnTGF5ZXIgc2V0dGluZ3MnfVxuICAgICAgICBvbkNsaWNrPXtvblRvZ2dsZUVuYWJsZUNvbmZpZ31cbiAgICAgICAgSWNvbkNvbXBvbmVudD17QXJyb3dEb3dufVxuICAgICAgLz5cbiAgICA8L0hlYWRlckFjdGlvblNlY3Rpb24+XG4gIDwvU3R5bGVkTGF5ZXJQYW5lbEhlYWRlcj5cbik7XG5cbmNvbnN0IExheWVyTGFiZWxFZGl0b3IgPSAoe2xhYmVsLCBvbkVkaXR9KSA9PiAoXG4gIDxJbmxpbmVJbnB1dFxuICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICBjbGFzc05hbWU9XCJsYXllcl9fdGl0bGVfX2VkaXRvclwiXG4gICAgdmFsdWU9e2xhYmVsfVxuICAgIG9uQ2xpY2s9e2UgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9fVxuICAgIG9uQ2hhbmdlPXtvbkVkaXR9XG4gICAgaWQ9XCJpbnB1dC1sYXllci1sYWJlbFwiXG4gIC8+XG4pO1xuXG5MYXllclBhbmVsSGVhZGVyLnByb3BUeXBlcyA9IHByb3BUeXBlcztcbkxheWVyUGFuZWxIZWFkZXIuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuXG5leHBvcnQgZGVmYXVsdCBMYXllclBhbmVsSGVhZGVyO1xuIl19
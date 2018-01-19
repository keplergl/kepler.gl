'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connect = undefined;

var _reactRedux = require('react-redux');

var _withLocalSelector = require('./with-local-selector');

var _withLocalSelector2 = _interopRequireDefault(_withLocalSelector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultMapStateToProps = function defaultMapStateToProps(state) {
  return state;
};
var defaultMapDispatchToProps = function defaultMapDispatchToProps(dispatch) {
  return { dispatch: dispatch };
};

var connect = exports.connect = function connect() {
  var mapStateToProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultMapStateToProps;
  var mapDispatchToProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultMapDispatchToProps;
  var reduxMergeProps = arguments[2];
  var options = arguments[3];
  return function (BaseComponent) {
    var reduxMapState = function reduxMapState(state, props) {
      return mapStateToProps(props.selector(state), props, state);
    };

    var reduxMapDispatch = function reduxMapDispatch(dispatch, props) {
      return mapDispatchToProps(props.dispatch, props, dispatch);
    };

    // const reduxMergeProps = (stateProps, dispatchProps, ownProps) =>
    //   ({ ...stateProps, ...dispatchProps, ...ownProps });

    var ReduxComponent = (0, _reactRedux.connect)(reduxMapState, reduxMapDispatch, reduxMergeProps, options)(BaseComponent);

    // save selector to context so it can be accessed by its children
    return (0, _withLocalSelector2.default)(ReduxComponent);
  };
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb25uZWN0L2tlcGxlcmdsLWNvbm5lY3QuanMiXSwibmFtZXMiOlsiZGVmYXVsdE1hcFN0YXRlVG9Qcm9wcyIsInN0YXRlIiwiZGVmYXVsdE1hcERpc3BhdGNoVG9Qcm9wcyIsImRpc3BhdGNoIiwiY29ubmVjdCIsIm1hcFN0YXRlVG9Qcm9wcyIsIm1hcERpc3BhdGNoVG9Qcm9wcyIsInJlZHV4TWVyZ2VQcm9wcyIsIm9wdGlvbnMiLCJyZWR1eE1hcFN0YXRlIiwicHJvcHMiLCJzZWxlY3RvciIsInJlZHV4TWFwRGlzcGF0Y2giLCJSZWR1eENvbXBvbmVudCIsIkJhc2VDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEseUJBQXlCLFNBQXpCQSxzQkFBeUI7QUFBQSxTQUFTQyxLQUFUO0FBQUEsQ0FBL0I7QUFDQSxJQUFNQyw0QkFBNEIsU0FBNUJBLHlCQUE0QjtBQUFBLFNBQWEsRUFBQ0Msa0JBQUQsRUFBYjtBQUFBLENBQWxDOztBQUVPLElBQU1DLDRCQUFVLFNBQVZBLE9BQVU7QUFBQSxNQUNyQkMsZUFEcUIsdUVBQ0hMLHNCQURHO0FBQUEsTUFFckJNLGtCQUZxQix1RUFFQUoseUJBRkE7QUFBQSxNQUdyQkssZUFIcUI7QUFBQSxNQUlyQkMsT0FKcUI7QUFBQSxTQUtsQix5QkFBaUI7QUFDcEIsUUFBTUMsZ0JBQWdCLFNBQWhCQSxhQUFnQixDQUFDUixLQUFELEVBQVFTLEtBQVI7QUFBQSxhQUNwQkwsZ0JBQWdCSyxNQUFNQyxRQUFOLENBQWVWLEtBQWYsQ0FBaEIsRUFBdUNTLEtBQXZDLEVBQThDVCxLQUE5QyxDQURvQjtBQUFBLEtBQXRCOztBQUdBLFFBQU1XLG1CQUFtQixTQUFuQkEsZ0JBQW1CLENBQUNULFFBQUQsRUFBV08sS0FBWDtBQUFBLGFBQ3ZCSixtQkFBbUJJLE1BQU1QLFFBQXpCLEVBQW1DTyxLQUFuQyxFQUEwQ1AsUUFBMUMsQ0FEdUI7QUFBQSxLQUF6Qjs7QUFHQTtBQUNBOztBQUVBLFFBQU1VLGlCQUFpQix5QkFDckJKLGFBRHFCLEVBRXJCRyxnQkFGcUIsRUFHckJMLGVBSHFCLEVBSXJCQyxPQUpxQixFQUtyQk0sYUFMcUIsQ0FBdkI7O0FBT0E7QUFDQSxXQUFPLGlDQUFrQkQsY0FBbEIsQ0FBUDtBQUNELEdBeEJzQjtBQUFBLENBQWhCIiwiZmlsZSI6ImtlcGxlcmdsLWNvbm5lY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2Nvbm5lY3QgYXMgcmVkdXhDb25uZWN0fSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgd2l0aExvY2FsU2VsZWN0b3IgZnJvbSAnLi93aXRoLWxvY2FsLXNlbGVjdG9yJztcblxuY29uc3QgZGVmYXVsdE1hcFN0YXRlVG9Qcm9wcyA9IHN0YXRlID0+IHN0YXRlO1xuY29uc3QgZGVmYXVsdE1hcERpc3BhdGNoVG9Qcm9wcyA9IGRpc3BhdGNoID0+ICh7ZGlzcGF0Y2h9KTtcblxuZXhwb3J0IGNvbnN0IGNvbm5lY3QgPSAoXG4gIG1hcFN0YXRlVG9Qcm9wcyA9IGRlZmF1bHRNYXBTdGF0ZVRvUHJvcHMsXG4gIG1hcERpc3BhdGNoVG9Qcm9wcyA9IGRlZmF1bHRNYXBEaXNwYXRjaFRvUHJvcHMsXG4gIHJlZHV4TWVyZ2VQcm9wcyxcbiAgb3B0aW9uc1xuKSA9PiBCYXNlQ29tcG9uZW50ID0+IHtcbiAgY29uc3QgcmVkdXhNYXBTdGF0ZSA9IChzdGF0ZSwgcHJvcHMpID0+XG4gICAgbWFwU3RhdGVUb1Byb3BzKHByb3BzLnNlbGVjdG9yKHN0YXRlKSwgcHJvcHMsIHN0YXRlKTtcblxuICBjb25zdCByZWR1eE1hcERpc3BhdGNoID0gKGRpc3BhdGNoLCBwcm9wcykgPT5cbiAgICBtYXBEaXNwYXRjaFRvUHJvcHMocHJvcHMuZGlzcGF0Y2gsIHByb3BzLCBkaXNwYXRjaCk7XG5cbiAgLy8gY29uc3QgcmVkdXhNZXJnZVByb3BzID0gKHN0YXRlUHJvcHMsIGRpc3BhdGNoUHJvcHMsIG93blByb3BzKSA9PlxuICAvLyAgICh7IC4uLnN0YXRlUHJvcHMsIC4uLmRpc3BhdGNoUHJvcHMsIC4uLm93blByb3BzIH0pO1xuXG4gIGNvbnN0IFJlZHV4Q29tcG9uZW50ID0gcmVkdXhDb25uZWN0KFxuICAgIHJlZHV4TWFwU3RhdGUsXG4gICAgcmVkdXhNYXBEaXNwYXRjaCxcbiAgICByZWR1eE1lcmdlUHJvcHMsXG4gICAgb3B0aW9uc1xuICApKEJhc2VDb21wb25lbnQpO1xuXG4gIC8vIHNhdmUgc2VsZWN0b3IgdG8gY29udGV4dCBzbyBpdCBjYW4gYmUgYWNjZXNzZWQgYnkgaXRzIGNoaWxkcmVuXG4gIHJldHVybiB3aXRoTG9jYWxTZWxlY3RvcihSZWR1eENvbXBvbmVudCk7XG59O1xuIl19
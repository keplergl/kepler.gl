import {connect as reduxConnect} from 'react-redux'
import withLocalSelector from './with-local-selector';

const defaultMapStateToProps = state => state;
const defaultMapDispatchToProps = dispatch => ({dispatch});

export const connect = (
  mapStateToProps = defaultMapStateToProps,
  mapDispatchToProps = defaultMapDispatchToProps,
  reduxMergeProps,
  options
  ) =>
    BaseComponent => {
      const reduxMapState = (state, props)  =>
        mapStateToProps(props.selector(state), props, state);

      const reduxMapDispatch = (dispatch, props) =>
        mapDispatchToProps(props.dispatch, props, dispatch);

      // const reduxMergeProps = (stateProps, dispatchProps, ownProps) =>
      //   ({ ...stateProps, ...dispatchProps, ...ownProps });

      const ReduxComponent = reduxConnect(
        reduxMapState,
        reduxMapDispatch,
        reduxMergeProps,
        options
      )(BaseComponent);

      // save selector to context so it can be accessed by its children
      return withLocalSelector(ReduxComponent)
    }
;

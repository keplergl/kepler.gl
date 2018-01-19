import React, {Component} from 'react';
import {connect} from 'react-redux';
import memoize from 'lodash.memoize';

import KeplerGl from './kepler-gl';
import {forwardTo} from 'actions/action-wrapper';

import {registerEntry, deleteEntry} from 'actions/identity-actions';

// default id and address if not provided
const defaultProps = {
  id: 'map',
  getAddress: state => state.keplerGl
};

class Container extends Component {
  constructor(props, ctx) {
    super(props, ctx);

    this.getSelector = memoize((id, getAddress) => state =>
      getAddress(state)[id]
    );
    this.getDispatch = memoize((id, dispatch) => forwardTo(id, dispatch));
  }

  componentWillMount() {
    // add a new entry to reducer
    this.props.dispatch(registerEntry(this.props.id));
  }

  componentWillReceiveProps(nextProps) {
    // TODO: need to check if id has changed
  }

  componentWillUnmount() {
    // delete entry in reducer
    this.props.dispatch(deleteEntry(this.props.id));
  }

  render() {
    const {id, getAddress, dispatch} = this.props;

    return (
      <KeplerGl
        {...this.props}
        id={id}
        selector={this.getSelector(id, getAddress)}
        dispatch={this.getDispatch(id, dispatch)}
      />
    );
  }
}

Container.defaultProps = defaultProps;

const mapStateToProps = (state, props) => props;
const dispatchToProps = dispatch => ({dispatch});

const ConnectedWrapper = connect(mapStateToProps, dispatchToProps)(Container);

export default ConnectedWrapper;

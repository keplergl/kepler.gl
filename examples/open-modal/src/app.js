// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {addDataToMap, wrapTo} from '@kepler.gl/actions';

import Modal from 'react-modal';
import {showModal} from './app-reducer';
import sampleData from './data/sample-data';

import FreshMap from './components/fresh-map';
import SavedMap from './components/saved-map';

const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

class App extends Component {
  componentDidUpdate(prevProps) {
    if (!prevProps.keplerGl.bar && this.props.keplerGl.bar) {
      this.props.dispatch(
        wrapTo(
          'bar',
          addDataToMap({
            datasets: sampleData,
            options: {
              centerMap: true
            },
            config: {
              mapStyle: {
                styleType: 'light'
              }
            }
          })
        )
      );
    }
  }
  _closeModal = () => {
    this.props.dispatch(showModal(null));
  };

  _openModal = id => {
    this.props.dispatch(showModal(id));
  };

  render() {
    const {
      app: {modal}
    } = this.props;

    return (
      <div style={{position: 'absolute', width: '100%', height: '100%'}}>
        <button onClick={() => this._openModal('foo')}>Show Kepler.gl id: foo</button>
        <button onClick={() => this._openModal('bar')}>Show Kepler.gl id: bar</button>

        <Modal isOpen={modal === 'foo'}>
          <div>
            This Kepler.gl component will always load a fresh state when re mounted, state inside
            this component will be destroyed once its unmounted.
          </div>
          <button onClick={this._closeModal}>Close</button>
          <FreshMap dispatch={this.props.dispatch} mapboxApiAccessToken={MAPBOX_TOKEN} id="foo" />
        </Modal>

        <Modal isOpen={modal === 'bar'}>
          By passing in mint: false, This Kepler.gl instance will keep the state of "bar" even when
          it is unmounted.
          <button onClick={this._closeModal}>Close</button>
          <SavedMap dispatch={this.props.dispatch} mapboxApiAccessToken={MAPBOX_TOKEN} id="bar" />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(App);

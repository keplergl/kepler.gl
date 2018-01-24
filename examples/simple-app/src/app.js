import React, {Component} from 'react';
import {connect} from 'react-redux';
import window from 'global/window';
import KeplerGl, {updateVisData} from 'kepler.gl';

import sampleData from './data/sample-data';
import sampleTripData from './data/sample-trip-data';

class App extends Component {
  state = {
    width: window.innerWidth,
    height: 800
  };

  componentWillMount() {
    this._handleResize();
    window.addEventListener('resize', this._handleResize);
  }

  componentWillUnMount() {
    window.removeEventListener('resize', this._handleResize)
  }

  componentDidMount() {
    this.props.dispatch(updateVisData(sampleData));
    this.props.dispatch(updateVisData(sampleTripData));
  }

  _handleResize = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  render() {
    return (
      <div style={{position: 'absolute', width: '100%', height: '100%'}}>
        <KeplerGl
          id="kepler.gl"
          width={this.state.width}
          height={this.state.height}
        />
      </div>
    );
  }
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(
  mapStateToProps,
  dispatchToProps
)(App);

import React, {Component} from 'react';
import KeplerGl from 'kepler.gl';
import {connect} from 'react-redux';
import window from 'global/window';

class App extends Component {
  state = {
    width: window.inner,
    height: 800
  };

  _handleResize = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  componentWillMount() {
    this._handleResize();
    window.addEventListener('resize', this._handleResize);
  }

  componentWillUnMount() {
    window.removeEventListener('resize', this._handleResize)
  }

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

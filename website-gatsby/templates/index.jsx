import React from 'react';
import {connect} from 'react-redux';
import {Home} from 'gatsby-theme-ocular/components';
import './style.css';

import {toggleDarkMode} from '../src/state/test';

import HeroExample from '../src/components/home';
// const HeroExample = 'div';

if (typeof window !== 'undefined') {
  window.website = true;
}

const DarkButton = ({isDarkMode, dispatch}) => (
  <button
    style={isDarkMode ? {background: 'black', color: 'white'} : null}
    onClick={() => dispatch(toggleDarkMode())}
  >
    Dark Mode
  </button>
);

class IndexPage extends React.Component {
  render() {
    const {isDarkMode, dispatch} = this.props;
    return (
      <div style={{top: 60, position: 'absolute'}}>
        <DarkButton dispatch={dispatch} isDarkMode={isDarkMode} />
        <Home HeroExample={HeroExample} />
      </div>
    );
  }
}

export default connect(state => ({
  isDarkMode: state.app.isDarkMode
}), null)(IndexPage);

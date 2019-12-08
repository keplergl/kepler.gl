import React from 'react';
import {Home} from 'gatsby-theme-ocular/components';
import './style.css';

if (typeof window !== 'undefined') {
  window.website = true;
}

const HeroExample = 'div';

// require('./example-gltf').default;

export default class IndexPage extends React.Component {
  render() {
    return <Home HeroExample={HeroExample} />;
  }
}

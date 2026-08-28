// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component, createRef} from 'react';
import ReactDOM from 'react-dom';

const WIDTH = 400;
const HEIGHT = 800;
const style = {border: 0};

export default class Frame extends Component {
  componentDidMount() {
    this.renderFrameContents();
  }
  componentDidUpdate() {
    this.renderFrameContents();
  }

  componentWillUnmount() {
    this.root.current.unmount();
  }

  root = createRef();
  innerHtml = createRef();

  renderFrameContents = () => {
    const doc = this.root.current.contentDocument;
    if (doc.readyState === 'complete') {
      ReactDOM.render(
        <html
          ref={this.innerHtml}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: this.props.children
          }}
        />,
        doc
      );
    } else {
      setTimeout(this.renderFrameContents.bind(this), 0);
    }
  };

  render() {
    return <iframe width={`${WIDTH}px`} height={`${HEIGHT}px`} style={style} ref={this.root} />;
  }
}

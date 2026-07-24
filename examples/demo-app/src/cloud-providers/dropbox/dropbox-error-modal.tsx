// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component, createRef} from 'react';
import {createRoot, Root} from 'react-dom/client';

const WIDTH = 400;
const HEIGHT = 800;
const style = {border: 0};

interface FrameProps {
  children: string;
}

export default class Frame extends Component<FrameProps> {
  root = createRef<HTMLIFrameElement>();
  innerHtml = createRef<HTMLHtmlElement>();
  _reactRoot?: Root;

  componentDidMount() {
    this.renderFrameContents();
  }
  componentDidUpdate() {
    this.renderFrameContents();
  }

  componentWillUnmount() {
    this._reactRoot?.unmount();
  }

  renderFrameContents = () => {
    const doc = this.root.current?.contentDocument;
    if (doc && doc.readyState === 'complete') {
      if (!this._reactRoot) {
        this._reactRoot = createRoot(doc);
      }
      this._reactRoot.render(
        <html
          ref={this.innerHtml}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: this.props.children
          }}
        />
      );
    } else {
      setTimeout(this.renderFrameContents.bind(this), 0);
    }
  };

  render() {
    return <iframe width={`${WIDTH}px`} height={`${HEIGHT}px`} style={style} ref={this.root} />;
  }
}

// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, {Component, createRef} from 'react';
import ReactDOM from 'react-dom';

const WIDTH = 400;
const HEIGHT = 800;
const style = {borther: 0};

export default class Frame extends Component {
  componentDidMount() {
    this.renderFrameContents();
  }
  componentDidUpdate() {
    this.renderFrameContents();
  }

  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this.root.current.contentDocument);
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

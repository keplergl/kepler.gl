// Copyright (c) 2019 Uber Technologies, Inc.
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

import React, {Component} from 'react';
import {Editor} from 'react-map-gl-draw';
import keymirror from 'keymirror';

const HANDLE_SHAPES = keymirror({
  circle: null,
  rect: null
});

class Draw extends Component {
  static defaultProps = {
    clickRadius: 6
  };

  _getEditHandleShape = ({feature}) => {
    return feature.properties.renderType === 'Point' ?
      HANDLE_SHAPES.circle : HANDLE_SHAPES.rect;
  };

  render() {
    const {clickRadius, editor, features} = this.props;
    const {selectedFeature = {}} = editor;

    return (
      <Editor
        clickRadius={clickRadius}
        mode={editor.mode}
        features={features}
        selectedFeatureId={(selectedFeature || {}).selectedFeatureId}
        onSelect={this.props.onSelect}
        onUpdate={this.props.onUpdate}
        getEditHandleShape={this._getEditHandleShape}
      />
    );
  }
}

export default Draw;

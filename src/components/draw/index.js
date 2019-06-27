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
import {EditorModes} from 'react-map-gl-draw';

const HANDLE_SHAPES = keymirror({
  circle: null,
  rect: null
});

class Draw extends Component {
  static defaultProps = {
    clickRadius: 12,
    mode: EditorModes.READ_ONLY
  };

  constructor(props) {
    super(props);
  }

  // TODO: replace with redux actions
  _onSelect = selectedFeatureId => {
    console.log('OnSelect:', selectedFeatureId);
  };

  _onUpdate = features => {
    this.props.onUpdate(features);
  };

  _getEditHandleShape = ({feature}) => {
    return feature.properties.renderType === 'Point' ?
      HANDLE_SHAPES.circle : HANDLE_SHAPES.rect;
  };

  render() {
    const {clickRadius, editor, mode} = this.props;

    return (
      <Editor
        clickRadius={clickRadius}
        mode={mode}
        features={editor.features}
        selectedFeatureId={editor.selectedFeatureId}
        onSelect={this._onSelect}
        onUpdate={this._onUpdate}
        getEditHandleShape={this._getEditHandleShape}
      />
    )
  }
}

export default Draw;

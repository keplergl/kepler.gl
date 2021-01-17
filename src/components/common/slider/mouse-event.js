// Copyright (c) 2021 Uber Technologies, Inc.
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

import document from 'global/document';

function nope(...args) {}

export default class MouseEventHandler {
  constructor({
    vertical = false,
    valueListener = nope,
    toggleMouseOver = nope,
    track,
    setAnchor = null
  }) {
    this._vertical = vertical;
    this._valueListener = valueListener;
    this._toggleMouseOver = toggleMouseOver;
    this._track = track;
    this._setAnchor = setAnchor;
  }

  handleMouseDown = e => {
    document.addEventListener('mouseup', this._mouseup);
    document.addEventListener('mousemove', this._mousemove);
    if (this._setAnchor) {
      const pos = this._getMousePos(e);
      this._setAnchor(this._getDistanceToTrack(pos));
    }
    this._toggleMouseOver();
  };

  _getMousePos(e) {
    return this._vertical ? e.clientY : e.clientX;
  }

  _getTouchPosition(e) {
    return this._vertical ? e.touches[0].clientY : e.touches[0].clientX;
  }

  _mouseup = () => {
    document.removeEventListener('mouseup', this._mouseup);
    document.removeEventListener('mousemove', this._mousemove);
    this._toggleMouseOver();
  };

  _getDistanceToTrack(pos) {
    const trackRect = this._track.current.getBoundingClientRect();
    return pos - (this._vertical ? trackRect.bottom : trackRect.left);
  }

  _mousemove = e => {
    e.preventDefault();
    const pos = this._getMousePos(e);
    this._valueListener(this._getDistanceToTrack(pos));
  };

  handleTouchStart = e => {
    // TODO: fix touch event
    document.addEventListener('touchend', this._touchend);
    document.addEventListener('touchmove', this._touchmove);
    if (this._setAnchor) {
      const pos = this._getTouchPosition(e);
      this._setAnchor(this._getDistanceToTrack(pos));
    }
    this._toggleMouseOver();
  };

  _touchmove = e => {
    // TODO: touch not tested
    const pos = this._getTouchPosition(e);
    this._valueListener(this._getDistanceToTrack(pos));
  };

  _touchend = () => {
    document.removeEventListener('touchend', this._touchend);
    document.removeEventListener('touchmove', this._touchmove);
    this._toggleMouseOver();
  };
}

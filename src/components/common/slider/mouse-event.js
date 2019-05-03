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
import document from 'global/document';

function nope() {}

export default class MouseEventHandler {
  constructor({
    vertical = false,
    valueListener = nope,
    toggleMouseOver = nope
  }) {
    this._vertical = vertical;
    this._valueListener = valueListener;
    this._toggleMouseOver = toggleMouseOver;

    this._prev = 0;
  }

  handleMouseDown = (e) => {
    document.addEventListener('mouseup', this._mouseup);
    document.addEventListener('mousemove', this._mousemove);
    this._prev = this._getMousePos(e);
    this._toggleMouseOver();
  };

  _getMousePos(e) {
    return this._vertical ? e.clientY : e.pageX;
  }
  _getTouchPosition(e) {
    return this._vertical ? e.touches[0].clientY : e.touches[0].pageX;
  }

  _getMouseDelta(e) {

    // movementX might not be supported in some browser
    // https://stackoverflow.com/questions/41774726/mouseevent-movementx-property-apparently-not-supported-in-internet-explorer
    const mouseCoord = this._vertical ? e.movementY : e.movementX;
    const clientCoord = this._getMousePos(e)

    const delta = mouseCoord === 0 ? clientCoord - this._prev : mouseCoord;

    return delta;
  };

  _mouseup = () => {
    document.removeEventListener('mouseup', this._mouseup);
    document.removeEventListener('mousemove', this._mousemove);
    this._toggleMouseOver();
  };

  _mousemove = e => {
    e.preventDefault();

    const delta = this._getMouseDelta(e);
    this._prev = this._getMousePos(e);

    this._valueListener(delta);
  };

  handleTouchStart = e => {
    document.addEventListener('touchend', this._touchend);
    document.addEventListener('touchmove', this._touchmove);
    this._prev = this._getTouchPosition(e);
    this._toggleMouseOver();
  };

  _touchmove = e => {
    const delta = this._getTouchPosition(e) - this._prev;
    this._prev = this._getTouchPosition(e);
    this.props._valueListener(delta);
  };

  _touchend = () => {
    document.removeEventListener('touchend', this._touchend);
    document.removeEventListener('touchmove', this._touchmove);
    this._toggleMouseOver();
  };
}

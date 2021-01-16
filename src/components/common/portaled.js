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

import React, {Component, createRef} from 'react';
import debounce from 'lodash.debounce';
import isEqual from 'lodash.isequal';

import {canUseDOM} from 'exenv';
import {withTheme} from 'styled-components';
import {RootContext} from 'components/context';
import Modal from 'react-modal';
import window from 'global/window';
import {theme} from 'styles/base';

const listeners = {};

const startListening = () => Object.keys(listeners).forEach(key => listeners[key]());

const getPageOffset = () => ({
  x:
    window.pageXOffset !== undefined
      ? window.pageXOffset
      : (document.documentElement || document.body.parentNode || document.body).scrollLeft,
  y:
    window.pageYOffset !== undefined
      ? window.pageYOffset
      : (document.documentElement || document.body.parentNode || document.body).scrollTop
});

const addEventListeners = () => {
  if (document && document.body)
    document.body.addEventListener('mousewheel', debounce(startListening, 100, true));
  window.addEventListener('resize', debounce(startListening, 50, true));
};

export const getChildPos = ({offsets, rect, childRect, pageOffset, padding}) => {
  const {topOffset, leftOffset, rightOffset} = offsets;

  const anchorLeft = leftOffset !== undefined;
  const pos = {
    top: pageOffset.y + rect.top + (topOffset || 0),
    ...(anchorLeft
      ? {left: pageOffset.x + rect.left + leftOffset}
      : {right: window.innerWidth - rect.right - pageOffset.x + (rightOffset || 0)})
  };

  const leftOrRight = anchorLeft ? 'left' : 'right';

  if (pos[leftOrRight] && pos[leftOrRight] < 0) {
    pos[leftOrRight] = padding;
  } else if (pos[leftOrRight] && pos[leftOrRight] + childRect.width > window.innerWidth) {
    pos[leftOrRight] = window.innerWidth - childRect.width - padding;
  }

  if (pos.top < 0) {
    pos.top = padding;
  } else if (pos.top + childRect.height > window.innerHeight) {
    pos.top = window.innerHeight - childRect.height - padding;
  }

  return pos;
};

if (canUseDOM) {
  if (document.body) {
    addEventListeners();
  } else {
    document.addEventListener('DOMContentLoaded', addEventListeners);
  }
}

let listenerIdCounter = 0;
function subscribe(fn) {
  listenerIdCounter += 1;
  const id = listenerIdCounter;
  listeners[id] = fn;
  return () => delete listeners[id];
}

const defaultModalStyle = {
  content: {
    top: 0,
    left: 0,
    border: 0,
    right: 'auto',
    bottom: 'auto',
    padding: '0px 0px 0px 0px'
  },
  overlay: {
    right: 'auto',
    bottom: 'auto',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0)'
  }
};

const WINDOW_PAD = 40;

const noop = () => {};

class Portaled extends Component {
  static defaultProps = {
    component: 'div',
    onClose: noop,
    theme
  };

  state = {
    pos: null,
    isVisible: false
  };

  componentDidMount() {
    // relative
    this.unsubscribe = subscribe(this.handleScroll);
    this.handleScroll();
  }

  componentDidUpdate(prevProps) {
    const didOpen = this.props.isOpened && !prevProps.isOpened;
    const didClose = !this.props.isOpened && prevProps.isOpened;
    if (didOpen || didClose) {
      window.requestAnimationFrame(() => {
        if (this._unmounted) return;
        this.setState({isVisible: didOpen});
      });
    }

    this.handleScroll();
  }

  componentWillUnmount() {
    this._unmounted = true;
    // @ts-ignore
    this.unsubscribe();
  }

  element = createRef();
  child = createRef();

  // eslint-disable-next-line complexity
  handleScroll = () => {
    if (this.child.current) {
      const rect = this.element.current.getBoundingClientRect();
      const childRect = this.child.current && this.child.current.getBoundingClientRect();
      const pageOffset = getPageOffset();
      const {top: topOffset, left: leftOffset, right: rightOffset} = this.props;

      const pos = getChildPos({
        offsets: {topOffset, leftOffset, rightOffset},
        rect,
        childRect,
        pageOffset,
        padding: WINDOW_PAD
      });

      if (!isEqual(pos, this.state.pos)) {
        this.setState({pos});
      }
    }
  };

  render() {
    const {
      // relative
      component: Comp,
      overlayZIndex,
      isOpened,
      onClose,

      // Modal
      children,
      modalProps,
      modalStyle = {}
    } = this.props;

    const {isVisible, pos} = this.state;

    const newModalStyle = {
      ...defaultModalStyle,
      content: {
        ...(modalStyle.content || {})
      },
      overlay: {
        ...defaultModalStyle.overlay,
        ...(modalStyle.overlay || {}),
        // needs to be on top of existing modal
        zIndex: overlayZIndex || 9999
      }
    };

    return (
      <RootContext.Consumer>
        {context => (
          <Comp ref={this.element}>
            {isOpened ? (
              <Modal
                className="modal-portal"
                {...modalProps}
                ariaHideApp={false}
                isOpen
                style={newModalStyle}
                parentSelector={() => {
                  // React modal issue: https://github.com/reactjs/react-modal/issues/769
                  // failed to execute removeChild on parent node when it is already unmounted
                  return (
                    // @ts-ignore
                    (context && context.current) || {
                      removeChild: () => {},
                      appendChild: () => {}
                    }
                  );
                }}
                onRequestClose={onClose}
              >
                <div
                  className="portaled-content"
                  key="item"
                  style={{
                    position: 'fixed',
                    opacity: isVisible ? 1 : 0,
                    top: this.state.top,
                    transition: this.props.theme.transition,
                    marginTop: isVisible ? '0px' : '14px',
                    // @ts-ignore
                    ...pos
                  }}
                >
                  <div
                    ref={this.child}
                    style={{
                      position: 'absolute',
                      zIndex: overlayZIndex ? overlayZIndex + 1 : 10000
                    }}
                  >
                    {children}
                  </div>
                </div>
              </Modal>
            ) : null}
          </Comp>
        )}
      </RootContext.Consumer>
    );
  }
}

export default withTheme(Portaled);

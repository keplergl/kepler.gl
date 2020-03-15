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
import debounce from 'lodash.debounce';
import {canUseDOM} from 'exenv';
import {withTheme} from 'styled-components';
import {RootContext} from 'components/context';
import Modal from 'react-modal';

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
    backgroundColor: 'rgba(0, 0, 0, 0)'
  }
};

class Portaled extends Component {
  static defaultProps = {
    left: 0,
    top: 0,
    component: 'span',
    closeOnEsc: true,
    onHide: () => null
  };

  state = {
    right: 0,
    left: 0,
    top: 0,
    isPortalOpened: false,
    isVisible: false
  };

  UNSAFE_componentWillMount() {
    if (this.props.isOpened) {
      this.setState({
        isPortalOpened: true,
        isVisible: true
      });
    }
  }

  componentDidMount() {
    // relative
    this.handleScroll = () => {
      if (this.element.current) {
        const rect = this.element.current.getBoundingClientRect();
        const pageOffset = getPageOffset();
        const top = pageOffset.y + rect.top;
        const right = window.innerWidth - rect.right - pageOffset.x;
        const left = pageOffset.x + rect.left;

        if (top !== this.state.top || left !== this.state.left || right !== this.state.right) {
          this.setState({left, top, right});
        }
      }
    };
    this.unsubscribe = subscribe(this.handleScroll);
    this.handleScroll();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {isOpened} = this.props;
    const {isVisible, isPortalOpened} = this.state;

    const willOpen = !isOpened && nextProps.isOpened;
    if (willOpen) this.setState({isPortalOpened: true});

    const willClose = isOpened && !nextProps.isOpened;
    if (willClose) this.setState({isVisible: false});

    const hasReopened = willOpen && !isVisible && isPortalOpened;
    if (hasReopened) this.setState({isVisible: true});
  }

  componentDidUpdate(prevProps) {
    const didOpen = this.props.isOpened && !prevProps.isOpened;
    if (didOpen) {
      window.requestAnimationFrame(() => {
        if (this._unmounted) return;
        this.setState({isVisible: true});
      });
    }
    this.handleScroll();
  }

  componentWillUnmount() {
    this._unmounted = true;
    this.unsubscribe();
  }

  element = createRef();

  handleRest = () => {
    if (!this.state.isVisible) {
      this.setState({isPortalOpened: false});
      this.props.onHide();
    }
  };

  render() {
    const {
      // relative
      component: Comp,
      top,
      left,
      right,
      fullWidth,
      overlayZIndex,

      // Mortal
      children,
      modalProps
    } = this.props;

    const {isPortalOpened, isVisible} = this.state;

    const fromLeftOrRight =
      right !== undefined ? {right: this.state.right + right} : {left: this.state.left + left};

    const horizontalPosition = fullWidth
      ? {right: this.state.right + right, left: this.state.left + left}
      : fromLeftOrRight;

    const modalStyle = {
      ...defaultModalStyle,
      overlay: {
        ...defaultModalStyle.overlay,
        // needs to be on top of existing modal
        zIndex: overlayZIndex
      }
    };

    return (
      <RootContext.Consumer>
        {context =>
          isPortalOpened ? (
            <Comp ref={this.element}>
              <Modal
                className="modal-portal"
                {...modalProps}
                ariaHideApp={false}
                isOpen
                style={modalStyle}
                parentSelector={() => {
                  // React modal issue: https://github.com/reactjs/react-modal/issues/769
                  // failed to execute removeChild on parent node when it is already unmounted
                  return (
                    (context && context.current) || {
                      removeChild: () => {},
                      appendChild: () => {}
                    }
                  );
                }}
              >
                <div
                  key="item"
                  style={{
                    position: 'fixed',
                    opacity: isVisible ? 1 : 0,
                    top: this.state.top + top,
                    ...horizontalPosition
                  }}
                >
                  {children}
                </div>
              </Modal>
            </Comp>
          ) : null
        }
      </RootContext.Consumer>
    );
  }
}

export default withTheme(Portaled);

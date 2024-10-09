// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component, createRef, ElementType, PropsWithChildren} from 'react';
import debounce from 'lodash.debounce';
import isEqual from 'lodash.isequal';

import {canUseDOM} from 'exenv';
import {withTheme} from 'styled-components';
import {RootContext} from '../context';
import Modal from 'react-modal';
import window from 'global/window';
import {theme} from '@kepler.gl/styles';

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
    document.body.addEventListener('mousewheel', debounce(startListening, 100, {leading: true}));
  window.addEventListener('resize', debounce(startListening, 50, {leading: true}));
};

interface GetChildPosProps {
  offsets: Partial<{
    topOffset: number;
    leftOffset: number;
    rightOffset: number;
  }>;
  rect: DOMRect;
  childRect: DOMRect;
  pageOffset: {
    x: number;
    y: number;
  };
  padding: number;
}

export const getChildPos = ({offsets, rect, childRect, pageOffset, padding}: GetChildPosProps) => {
  const {topOffset, leftOffset, rightOffset} = offsets;

  const anchorLeft = leftOffset !== undefined;
  const pos = {
    top: pageOffset.y + rect.top + (topOffset || 0),
    ...(anchorLeft
      ? {left: pageOffset.x + rect.left + (leftOffset || 0)}
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

const noop = () => {
  return;
};

type PortaledProps = PropsWithChildren<{
  component: ElementType;
  onClose?: (
    event: React.MouseEvent<Element, globalThis.MouseEvent> | React.KeyboardEvent<Element>
  ) => void;
  theme?: any;
  isOpened?: boolean;
  top: number;
  left?: number;
  right?: number;
  overlayZIndex?: number;
  modalProps?: Partial<ReactModal.Props>;
  modalStyle?: Partial<typeof defaultModalStyle>;
}>;

interface PortaledState {
  pos:
    | {
        left: number;
        top: number;
      }
    | {
        right: number;
        top: number;
      }
    | null;
  isVisible: boolean;
}

class Portaled extends Component<PortaledProps, PortaledState> {
  // Make Portaled a component with Error Boundary, so React can recreate
  // this component if the child 'ColorPicker' throws cross-origin error.
  // see function componentDidCatch()
  static getDerivedStateFromError() {
    return {hasError: true};
  }

  static defaultProps = {
    component: 'div',
    onClose: noop,
    theme
  };

  state = {
    pos: null,
    isVisible: false
  };

  unsubscribe: (() => boolean) | undefined = undefined;
  _unmounted = false;

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
        this.setState({isVisible: Boolean(didOpen)});
      });
    }

    this.handleScroll();
  }

  // ColorPicker will throw a cross-origin error when it is closed
  // when the app is within an iframe.
  // This is a known issue of react-color component:
  // see: https://github.com/casesandberg/react-color/issues/806
  componentDidCatch() {
    // Do nothing here, since React will try to recreate this component
    // tree from scratch using the error boundary, which is this component
    // itself. This is a temporal fix for a crash.
  }

  componentWillUnmount() {
    this._unmounted = true;
    // @ts-ignore
    this.unsubscribe();
  }

  element = createRef<HTMLDivElement>();
  child = createRef<HTMLDivElement>();

  // eslint-disable-next-line complexity
  handleScroll = () => {
    if (this.child.current && this.element.current) {
      const rect = this.element.current.getBoundingClientRect();
      const childRect = this.child.current.getBoundingClientRect();
      const pageOffset = getPageOffset();
      const {top: topOffset, left: leftOffset = 0, right: rightOffset} = this.props;

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
                  return (context && context.current) || document.body;
                }}
                onRequestClose={onClose}
              >
                <div
                  className="portaled-content"
                  key="item"
                  style={{
                    position: 'fixed',
                    opacity: isVisible ? 1 : 0,
                    transition: this.props.theme.transitionFast,
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

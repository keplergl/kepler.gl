/** @jsx createElement */
import createElement from 'react-stylematic';

import React from 'react';
import {ReactBaseComponent} from '../../utils/react-utils';
import window from 'global/window';
import {ArrowLeft} from '../common/icons';

import {sideBar} from '../../styles/side-panel';

const DEFAULT_WIDTH = 330;

export default class SideBar extends ReactBaseComponent {
  defaultProps = {
    width: DEFAULT_WIDTH,
    height: window.innerHeight,
    top: 0,
    minifiedWidth: 0,
    isOpen: false,
    onOpenOrClose: function noop() {}
  };

  static propTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    top: React.PropTypes.number,
    isOpen: React.PropTypes.bool,
    minifiedWidth: React.PropTypes.number,
    onOpenOrClose: React.PropTypes.func
  };

  _onOpenOrClose() {
    this.props.onOpenOrClose({isOpen: !this.props.isOpen});
  }

  render() {
    const {isOpen, minifiedWidth, width, top, height} = this.props;
    const horizontalOffset = isOpen ? 0 : minifiedWidth - width;
    const contentWidth = isOpen ? width : minifiedWidth;

    const containerStyle = {
      ...sideBar,
      top,
      width,
      height,
      left: horizontalOffset
    };

    const wrapperStyle = {height};

    const innerStyle = {
      width: contentWidth
    };

    return (
      <div className="side-bar" style={containerStyle}>
        <div className="side-bar__wrapper" style={wrapperStyle}>
          <div className="side-bar__inner" style={innerStyle}>
            <div>
              <SideBarTitle onClick={this._onOpenOrClose} title={this.props.title}/>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const SideBarTitle = ({onClick, title}) => (
  <div className="side-bar__top" onClick={onClick}>
    <div className="side-bar__title">{title}</div>
    <div className="button button-link">
      <ArrowLeft/>Collapse
    </div>
  </div>
);

SideBar.displayName = 'SideBar';

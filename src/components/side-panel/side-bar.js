/** @jsx createElement */
import React, {Component} from 'react';
import createElement from 'react-stylematic';
import PropTypes from 'prop-types';
import window from 'global/window';
import {ArrowLeft} from 'components/common/icons';

import {sideBar} from 'styles/side-panel';

const DEFAULT_WIDTH = 330;

const  defaultProps = {
  width: DEFAULT_WIDTH,
  height: window.innerHeight,
  top: 0,
  minifiedWidth: 0,
  isOpen: false,
  onOpenOrClose: function noop() {}
};

const propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  top: PropTypes.number,
  isOpen: PropTypes.bool,
  minifiedWidth: PropTypes.number,
  onOpenOrClose: PropTypes.func
};

export default class SideBar extends Component {

  _onOpenOrClose = () => {
    this.props.onOpenOrClose({isOpen: !this.props.isOpen});
  };

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

SideBar.propTypes = propTypes;
SideBar.defaultProps = defaultProps;

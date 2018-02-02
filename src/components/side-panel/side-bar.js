import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {ArrowRight} from 'components/common/icons';

const defaultProps = {
  width: 300,
  minifiedWidth: 0,
  isOpen: true,
  onOpenOrClose: function noop() {}
};

const propTypes = {
  width: PropTypes.number,
  isOpen: PropTypes.bool,
  minifiedWidth: PropTypes.number,
  onOpenOrClose: PropTypes.func
};

const StyledSidePanelContainer = styled.div`
  z-index: 99;
  height: 100%;
  width: ${props => props.width + 2 * props.theme.sidePanel.margin}px;
  display: flex;
  transition: width 250ms;
  position: absolute;
  padding: ${props => props.theme.sidePanel.margin}px;
`;

const SideBarContainer = styled.div`
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: left 250ms, right 250ms;
  left: ${props => props.left}px;
  align-items: stretch;
  flex-grow: 1;
`;

const SideBarInner = styled.div`
  background-color: ${props => props.theme.sidePanelBg};
  border-radius: 1px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const CollapseButton = styled.div`
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  justify-content: center;
  background-color: ${props => props.theme.sideBarCloseBtnBgd};
  border-radius: 1px;
  color: ${props => props.theme.sideBarCloseBtnColor};
  display: flex;
  height: 20px;
  position: absolute;
  right: -8px;
  top: ${props => props.theme.sidePanel.margin}px;
  width: 20px;

  :hover {
    cursor: pointer;
    box-shadow: none;
    background-color: ${props => props.theme.sideBarCloseBtnBgdHover};
  }
`;

export default class SideBar extends Component {
  _onOpenOrClose = () => {
    this.props.onOpenOrClose({isOpen: !this.props.isOpen});
  };

  render() {
    const {isOpen, minifiedWidth, width} = this.props;
    const horizontalOffset = isOpen ? 0 : minifiedWidth - width;

    return (
      <StyledSidePanelContainer
        width={isOpen ? width : 0}
        className="side-panel--container"
      >
        <SideBarContainer className="side-bar" style={{width: `${width}px`}}
                          left={horizontalOffset}>
          {isOpen ? (
            <SideBarInner className="side-bar__inner">
              {this.props.children}
            </SideBarInner>
          ) : null}
          <CollapseButton
            className="side-bar__close"
            onClick={this._onOpenOrClose}
          >
            <ArrowRight
              height="12px"
              style={{transform: `rotate(${isOpen ? 180 : 0}deg)`}}
            />
          </CollapseButton>
        </SideBarContainer>
      </StyledSidePanelContainer>
    );
  }
}

SideBar.propTypes = propTypes;
SideBar.defaultProps = defaultProps;

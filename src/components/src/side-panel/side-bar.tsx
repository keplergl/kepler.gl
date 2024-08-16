// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import styled from 'styled-components';
import {ArrowRight} from '../common/icons';

export type CollapseButtonProps = {
  isOpen: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
};

export type SideBarProps = {
  width: number;
  isOpen: boolean;
  minifiedWidth: number;
  onOpenOrClose: (arg: {isOpen: boolean}) => void;
  shouldShowCollapseButton?: boolean | null;
  children?: React.ReactNode;
};

const StyledSidePanelContainer = styled.div<{width: number}>`
  z-index: 99;
  height: 100%;
  width: ${props => props.width + 2 * props.theme.sidePanel.margin.left}px;
  display: flex;
  transition: width 250ms;
  position: absolute;
  padding-top: ${props => props.theme.sidePanel.margin.top}px;
  padding-right: ${props => props.theme.sidePanel.margin.right}px;
  padding-bottom: ${props => props.theme.sidePanel.margin.bottom}px;
  padding-left: ${props => props.theme.sidePanel.margin.left}px;
  pointer-events: none; /* prevent padding from blocking input */
  & > * {
    /* all children should allow input */
    pointer-events: all;
  }
`;

const SideBarContainer = styled.div<{left: number}>`
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
  border-left: ${props => props.theme.sidePanelBorder}px solid
    ${props => props.theme.sidePanelBorderColor};
`;

const StyledCollapseButton = styled.div`
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
  top: ${props => props.theme.sidePanel.margin.top}px;
  width: 20px;

  :hover {
    cursor: pointer;
    box-shadow: none;
    background-color: ${props => props.theme.sideBarCloseBtnBgdHover};
  }
`;

export const CollapseButtonFactory = () => {
  const CollapseButton = ({onClick, isOpen}: CollapseButtonProps) => (
    <StyledCollapseButton className="side-bar__close" onClick={onClick}>
      <ArrowRight height="12px" style={{transform: `rotate(${isOpen ? 180 : 0}deg)`}} />
    </StyledCollapseButton>
  );
  return CollapseButton;
};

SidebarFactory.deps = [CollapseButtonFactory];

function SidebarFactory(CollapseButton: ReturnType<typeof CollapseButtonFactory>) {
  return class SideBar extends Component<SideBarProps> {
    static defaultProps = {
      width: 300,
      minifiedWidth: 0,
      isOpen: true,
      onOpenOrClose: function noop() {
        return;
      },
      shouldShowCollapseButton: true
    };

    _onOpenOrClose = () => {
      this.props.onOpenOrClose({isOpen: !this.props.isOpen});
    };

    render() {
      const {isOpen, minifiedWidth, width, shouldShowCollapseButton} = this.props;
      const horizontalOffset = isOpen ? 0 : minifiedWidth - width;

      return (
        <StyledSidePanelContainer width={isOpen ? width : 0} className="side-panel--container">
          <SideBarContainer
            className="side-bar"
            style={{width: `${width}px`}}
            left={horizontalOffset}
          >
            {isOpen ? (
              <SideBarInner className="side-bar__inner">{this.props.children}</SideBarInner>
            ) : null}
            {shouldShowCollapseButton ? (
              <CollapseButton isOpen={isOpen} onClick={this._onOpenOrClose} />
            ) : null}
          </SideBarContainer>
        </StyledSidePanelContainer>
      );
    }
  };
}

export default SidebarFactory;

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {scaleLinear} from 'd3-scale';
import React, {Component, createRef, ReactElement} from 'react';
import styled from 'styled-components';

import {observeDimensions, unobserveDimensions} from '@kepler.gl/utils';

export enum LayoutSplitterMode {
  VERTICAL = 'VERTICAL',
  HORIZONTAL = 'HORIZONTAL'
}

export interface VirtualElement {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

export interface LayoutSplitterProps {
  size?: number;
  color?: string;
  shadowColor?: string;
  mode: LayoutSplitterMode;
  referenceElement: HTMLElement | VirtualElement;
  renderHandle?: () => ReactElement;
  percentageSplit: number;
  resizeThrottleDelay?: number;
  onMove?: (percentageSplit: number) => void;
  onRelease?: (percentageSplit: number) => void;
}

const Layout = styled.div<{mode: LayoutSplitterMode; shadowColor?: string}>(
  props => `
    position: absolute;
    z-index: 3;
    touch-action: none;
    & > .splitter {
      box-shadow: 0 0 2px ${props.shadowColor || 'rgba(0, 0, 0, 0.3)'};
      transition: box-shadow 0.3s ease;
    }
    &:hover > .splitter {
      box-shadow: 0 0 10px ${props.shadowColor || 'rgba(0, 0, 0, 0.3)'};
    }
    ${
      props.mode === LayoutSplitterMode.VERTICAL
        ? `width: 20px;
           margin-left: -10px;
           height: 100%;
           top: 0;
           cursor: ew-resize;`
        : `width: 100%;
           height: 20px;
           margin-top: -10px;
           left: 0;
           cursor: ns-resize;`
    }
`
);

type SplitterLineProps = {
  mode: LayoutSplitterMode;
  size?: number;
  color?: React.CSSProperties['color'];
};

const SplitterLine = styled.div<SplitterLineProps>(
  props => `
  position: absolute;
  background: ${props.color || '#FFFFFF'};
    ${
      props.mode === LayoutSplitterMode.VERTICAL
        ? `left: 50%;
           transform: translateX(-50%);
           width: ${props.size}px;
           height: 100%;
        `
        : `top: 50%;
           transform: translateY(-50%);
           height: ${props.size}px;
           width: 100%;
        `
    }`
);

const HandleWrapper = styled.div<{mode: LayoutSplitterMode}>(
  ({mode}) => `
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    ${mode === LayoutSplitterMode.VERTICAL ? 'top: 50%;' : 'left: 50%;'}
`
);

const Handle = styled.div`
  display: flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  padding: 4px;
  background-color: ${props => props.theme.panelBackground || '#29323C'};
  color: ${props => props.theme.textColor || '#FFFFFF'};
  border: 2px solid #FFFFFF;
  border-radius: 50%;
  background-position: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const ArrowIcon: React.FC<{size?: number; mode: LayoutSplitterMode}> = ({size = 20, mode}) => (
  <svg width={size} height={size} viewBox="-15 -15 30 30">
    <g transform={mode === LayoutSplitterMode.HORIZONTAL ? 'rotate(90)' : ''}>
      <path d="M-15,0 L-5,-6 L-5,6Z" fill="currentColor" />
      <path d="M15,0 L5,-6 L5,6Z" fill="currentColor" />
    </g>
  </svg>
);

export default class LayoutSplitter extends Component<LayoutSplitterProps> {
  static defaultProps = {
    mode: LayoutSplitterMode.VERTICAL,
    size: 2,
    resizeThrottleDelay: 50
  };

  componentDidMount(): void {
    const {referenceElement, resizeThrottleDelay} = this.props;
    if (referenceElement instanceof HTMLElement) {
      observeDimensions(referenceElement, this.handleResize, resizeThrottleDelay);
    }
  }

  componentWillUnmount(): void {
    const {referenceElement} = this.props;
    if (referenceElement instanceof HTMLElement) {
      unobserveDimensions(referenceElement);
    }
  }

  ref = createRef<HTMLDivElement>();
  dragging = false;

  getReferenceBoundingBox(): VirtualElement | undefined {
    const {referenceElement} = this.props;
    if (referenceElement instanceof HTMLElement) {
      if (referenceElement.getBoundingClientRect) {
        return referenceElement.getBoundingClientRect();
      }
      return undefined;
    }
    return referenceElement as VirtualElement;
  }

  getNextValue(clientX: number, clientY: number): number {
    const {mode} = this.props;
    const bbox = this.getReferenceBoundingBox();
    if (!bbox) return this.props.percentageSplit;

    const {left, right, top, bottom} = bbox;
    const scale = scaleLinear().domain([0, 100]).clamp(true);

    if (mode === LayoutSplitterMode.VERTICAL) {
      scale.range([left, right]);
      return scale.invert(clientX);
    } else {
      scale.range([top, bottom]);
      return scale.invert(clientY);
    }
  }

  handlePointerDown = (evt: React.PointerEvent): void => {
    evt.stopPropagation();
    evt.preventDefault();
    this.dragging = true;
    (evt.currentTarget as HTMLElement).setPointerCapture(evt.pointerId);
  };

  handlePointerMove = (evt: React.PointerEvent): void => {
    if (!this.dragging) return;
    evt.stopPropagation();
    evt.preventDefault();
    const nextValue = this.getNextValue(evt.clientX, evt.clientY);
    const {percentageSplit, onMove} = this.props;
    if (nextValue !== percentageSplit && onMove) {
      onMove(nextValue);
    }
  };

  handlePointerUp = (evt: React.PointerEvent): void => {
    if (!this.dragging) return;
    evt.stopPropagation();
    evt.preventDefault();
    this.dragging = false;
    (evt.currentTarget as HTMLElement).releasePointerCapture(evt.pointerId);

    const nextValue = this.getNextValue(evt.clientX, evt.clientY);
    const {percentageSplit, onMove, onRelease} = this.props;
    if (nextValue !== percentageSplit && onMove) {
      onMove(nextValue);
    }
    if (onRelease) onRelease(nextValue);
  };

  handleResize = (): void => {
    this.forceUpdate();
  };

  renderHandle(): React.ReactNode {
    const {mode, renderHandle} = this.props;
    return (
      <HandleWrapper mode={mode}>
        {renderHandle ? (
          renderHandle()
        ) : (
          <Handle>
            <ArrowIcon mode={mode} />
          </Handle>
        )}
      </HandleWrapper>
    );
  }

  getPositioningStyle(): {[x: string]: number} {
    const {mode, percentageSplit} = this.props;
    const bbox = this.getReferenceBoundingBox();
    if (!bbox) return {[mode === LayoutSplitterMode.VERTICAL ? 'left' : 'top']: 0};

    const {left, right, top, bottom} = bbox;
    const scale = scaleLinear().domain([0, 100]).clamp(true);

    if (mode === LayoutSplitterMode.VERTICAL) {
      scale.range([0, right - left]);
    } else {
      scale.range([0, bottom - top]);
    }

    return {
      [mode === LayoutSplitterMode.VERTICAL ? 'left' : 'top']: scale(percentageSplit)
    };
  }

  render(): React.ReactNode {
    const {mode, size, color, shadowColor} = this.props;
    return (
      <Layout
        className="layout-splitter"
        ref={this.ref}
        mode={mode}
        shadowColor={shadowColor}
        style={this.getPositioningStyle()}
        onPointerDown={this.handlePointerDown}
        onPointerMove={this.handlePointerMove}
        onPointerUp={this.handlePointerUp}
        onPointerCancel={this.handlePointerUp}
        onClick={e => e.stopPropagation()}
      >
        <SplitterLine className="splitter" mode={mode} size={size} color={color} />
        {this.renderHandle()}
      </Layout>
    );
  }
}

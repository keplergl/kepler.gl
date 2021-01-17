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

import React, {useState, useCallback, useRef, useLayoutEffect} from 'react';
import styled from 'styled-components';
import LayerHoverInfoFactory from './layer-hover-info';
import CoordinateInfoFactory from './coordinate-info';
import {Pin, ArrowLeft, ArrowRight} from 'components/common/icons';
import ErrorBoundary from 'components/common/error-boundary';
import {injectIntl} from 'react-intl';
import {FormattedMessage} from 'localization';

const MAX_WIDTH = 500;
const MAX_HEIGHT = 600;

const StyledMapPopover = styled.div`
  ${props => props.theme.scrollBar};
  font-size: 11px;
  font-weight: 500;
  background-color: ${props => props.theme.panelBackground};
  color: ${props => props.theme.textColor};
  z-index: 1000;
  position: absolute;
  overflow-x: auto;
  box-shadow: ${props => props.theme.panelBoxShadow};

  :hover {
    background-color: ${props => `${props.theme.panelBackground}dd`};
  }

  .gutter {
    height: 6px;
    margin-bottom: 20px;
  }

  .primary-label {
    color: ${props => props.theme.notificationColors.success};
    position: absolute;
    right: 18px;
    top: 10px;
    font-size: 10px;
  }

  table {
    margin: 2px 12px 12px 12px;
    width: auto;

    tbody {
      border-top: transparent;
      border-bottom: transparent;
    }

    td {
      border-color: transparent;
      padding: 4px;
      color: ${props => props.theme.textColor};
    }

    td.row__value {
      text-align: right;
      font-weight: 500;
      color: ${props => props.theme.textColorHl};
    }
  }
`;

const StyledIcon = styled.div`
  position: absolute;
  left: 50%;
  transform: rotate(30deg);
  top: 10px;
  color: ${props => props.theme.activeColor};

  &.popover-arrow-left {
    left: 40%;
    transform: rotate(0deg);
  }

  &.popover-arrow-right {
    left: 60%;
    transform: rotate(0deg);
  }

  :hover {
    cursor: pointer;
    color: ${props => props.theme.linkBtnColor};
  }
`;

MapPopoverFactory.deps = [LayerHoverInfoFactory, CoordinateInfoFactory];

export function getPosition({x, y, mapW, mapH, width, height, isLeft}) {
  const topOffset = 20;
  const leftOffset = 20;
  if (![x, y, mapW, mapH, width, height].every(Number.isFinite)) {
    return {};
  }

  const pos = {};
  if (x + leftOffset + width > mapW || isLeft) {
    pos.right = mapW - x + leftOffset;
  } else {
    pos.left = x + leftOffset;
  }

  if (y + topOffset + height > mapH) {
    pos.bottom = 10;
  } else {
    pos.top = y + topOffset;
  }

  return pos;
}

function hasPosChanged({oldPos = {}, newPos = {}}) {
  for (const key in newPos) {
    if (oldPos[key] !== newPos[key]) {
      return true;
    }
  }
  for (const key in oldPos) {
    if (oldPos[key] !== newPos[key]) {
      return true;
    }
  }
  return false;
}

// hooks
export function usePosition({layerHoverProp, x, y, mapW, mapH}, popover) {
  const [isLeft, setIsLeft] = useState(false);
  const [pos, setPosition] = useState({});

  const moveLeft = useCallback(() => setIsLeft(true), [setIsLeft]);
  const moveRight = useCallback(() => setIsLeft(false), [setIsLeft]);
  const hoverData = layerHoverProp && layerHoverProp.data;

  useLayoutEffect(() => {
    const node = popover.current;

    if (!node || !hoverData) {
      return;
    }

    const width = Math.round(node.offsetWidth);
    const height = Math.round(node.offsetHeight);

    if (Number.isFinite(width) && width > 0 && Number.isFinite(height) && height > 0) {
      const newPos = getPosition({
        x,
        y,
        mapW,
        mapH,
        width,
        height,
        isLeft
      });
      if (hasPosChanged({oldPos: pos, newPos})) {
        setPosition(newPos);
      }
    }
  }, [x, y, mapH, mapW, isLeft, hoverData, pos, popover]);

  return {moveLeft, moveRight, isLeft, pos};
}
export default function MapPopoverFactory(LayerHoverInfo, CoordinateInfo) {
  /** @type {typeof import('./map-popover').MapPopover} */
  const MapPopover = ({
    x,
    y,
    mapW,
    mapH,
    frozen,
    coordinate,
    layerHoverProp,
    isBase,
    zoom,
    onClose
  }) => {
    const popover = useRef(null);
    const {moveLeft, moveRight, isLeft, pos} = usePosition(
      {layerHoverProp, x, y, mapW, mapH},
      popover
    );

    return (
      <ErrorBoundary>
        <StyledMapPopover
          ref={popover}
          className="map-popover"
          style={{
            ...pos,
            maxWidth: MAX_WIDTH,
            maxHeight: MAX_HEIGHT
          }}
        >
          {frozen ? (
            <div className="map-popover__top">
              <div className="gutter" />
              {!isLeft && (
                <StyledIcon className="popover-arrow-left" onClick={moveLeft}>
                  <ArrowLeft />
                </StyledIcon>
              )}
              <StyledIcon className="popover-pin" onClick={onClose}>
                <Pin height="16px" />
              </StyledIcon>
              {isLeft && (
                <StyledIcon className="popover-arrow-right" onClick={moveRight}>
                  <ArrowRight />
                </StyledIcon>
              )}
              {isBase && (
                <div className="primary-label">
                  <FormattedMessage id="mapPopover.primary" />
                </div>
              )}
            </div>
          ) : null}
          {Array.isArray(coordinate) && <CoordinateInfo coordinate={coordinate} zoom={zoom} />}
          {layerHoverProp && <LayerHoverInfo {...layerHoverProp} />}
        </StyledMapPopover>
      </ErrorBoundary>
    );
  };

  return injectIntl(MapPopover);
}

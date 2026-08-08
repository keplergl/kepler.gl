// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import styled from 'styled-components';
import React, {useRef, useState, useCallback, useEffect} from 'react';

import {MapState} from '@kepler.gl/types';
import {MapSplitMode} from '@kepler.gl/constants';

import {MapViewStateContextProvider} from './map-view-state-context';
import LayoutSplitter, {LayoutSplitterMode} from './common/layout-splitter';

const Outer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
`;

type MapWrapperProps = {
  $relative?: boolean;
};

const MapWrapper = styled.div<MapWrapperProps>`
  position: ${props => (props.$relative ? 'relative' : 'absolute')};
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

const SwipeInputBlock = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 2;
`;

MapsLayoutFactory.deps = [];

interface MapsLayoutProps {
  mapState: MapState;
  className?: string;
  children?: React.ReactNode;
  onSetSwipeComparePercentage?: (payload: {percentage: number}) => void;
}

export default function MapsLayoutFactory(): React.ComponentType<MapsLayoutProps> {
  const MapsLayout: React.FC<MapsLayoutProps> = ({
    mapState,
    className,
    children,
    onSetSwipeComparePercentage
  }) => {
    const containerElementRef = useRef<HTMLDivElement>(null);
    const [containerMounted, setContainerMounted] = useState(false);
    const childrenArray = React.Children.toArray(children);
    const isSwipe =
      childrenArray.length > 1 && mapState.mapSplitMode === MapSplitMode.SWIPE_COMPARE;

    const percentage = mapState.swipeComparePercentage ?? 50;
    const [internalPercentage, setInternalPercentage] = useState(percentage);
    const [isSwiping, setSwiping] = useState(false);
    const lastReleasedValue = useRef<number | null>(null);

    useEffect(() => {
      if (containerElementRef.current) {
        setContainerMounted(true);
      }
    }, []);

    useEffect(() => {
      if (!isSwiping) {
        // Only sync from props if the store has caught up with our last released value,
        // or if we never released (external prop change).
        if (lastReleasedValue.current === null || percentage === lastReleasedValue.current) {
          setInternalPercentage(percentage);
          lastReleasedValue.current = null;
        }
      }
    }, [percentage, isSwiping]);

    const handleMove = useCallback((v: number) => {
      setSwiping(true);
      setInternalPercentage(v);
    }, []);

    const handleRelease = useCallback(
      (v: number) => {
        lastReleasedValue.current = v;
        setInternalPercentage(v);
        setSwiping(false);
        if (v !== percentage && onSetSwipeComparePercentage) {
          onSetSwipeComparePercentage({percentage: v});
        }
      },
      [percentage, onSetSwipeComparePercentage]
    );

    const splitMapStyle = {
      clipPath: `polygon(0 0, 0 100%, ${internalPercentage}% 100%, ${internalPercentage}% 0)`,
      overflow: 'hidden' as const
    };

    return (
      <Outer className={className} ref={containerElementRef}>
        <MapViewStateContextProvider mapState={mapState}>
          {isSwipe ? (
            <>
              <MapWrapper key={1}>{childrenArray[1]}</MapWrapper>
              <MapWrapper key={0} style={splitMapStyle}>
                {childrenArray[0]}
              </MapWrapper>
              {containerMounted && containerElementRef.current && (
                <>
                  {isSwiping && <SwipeInputBlock />}
                  <LayoutSplitter
                    mode={LayoutSplitterMode.VERTICAL}
                    referenceElement={containerElementRef.current}
                    percentageSplit={internalPercentage}
                    onMove={handleMove}
                    onRelease={handleRelease}
                  />
                </>
              )}
            </>
          ) : (
            childrenArray
          )}
        </MapViewStateContextProvider>
      </Outer>
    );
  };

  return MapsLayout;
}

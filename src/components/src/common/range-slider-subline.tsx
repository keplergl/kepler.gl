// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
// eslint-disable-next-line no-unused-vars
import {CSSProperties} from 'react';
import {ArrowDownFull, TimelineMarker} from '../common/icons';

const BACKGROUND_LINE_STYLE: CSSProperties = {
  height: '4px',
  backgroundColor: '#1C2233',
  position: 'relative',
  width: '100%',
  marginTop: '20px'
};

const TIMELINE_MARKER_STYLE: CSSProperties = {
  position: 'absolute',
  top: '-8px',
  fill: '#3D4866',
  color: '#3D4866'
};

const TIMELINE_INDICATOR_STYLE: CSSProperties = {
  position: 'absolute',
  top: '-14px',
  fill: '#C4C4C4',
  color: '#C4C4C4'
};

function RangeSliderSublineFactory() {
  const RangeSliderSubline = ({line, scaledValue}) => {
    const style: CSSProperties = {
      left: `${line[0]}%`,
      top: '0',
      width: `${line[1] - line[0]}%`,
      height: '100%',
      position: 'absolute',
      backgroundColor: '#5558DB'
    };

    const value = scaledValue[line[2]];

    const leftMarketStyle = useMemo(
      () => ({
        left: `calc(${line[0]}% - 4px)`,
        ...TIMELINE_MARKER_STYLE
      }),
      [line]
    );

    const rightMarketStyle = useMemo(
      () => ({
        left: `calc(${line[1]}% - 4px)`,
        ...TIMELINE_MARKER_STYLE
      }),
      [line]
    );

    const indicatorStyle = useMemo(
      () => ({
        ...TIMELINE_INDICATOR_STYLE,
        left: `calc(${value}% - 2px)`
      }),
      [value]
    );

    return (
      <div style={BACKGROUND_LINE_STYLE}>
        <div style={style} />
        <ArrowDownFull style={leftMarketStyle} />
        <ArrowDownFull style={rightMarketStyle} />
        <TimelineMarker style={indicatorStyle} />
      </div>
    );
  };

  return RangeSliderSubline;
}

export default RangeSliderSublineFactory;

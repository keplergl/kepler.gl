// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
// eslint-disable-next-line no-unused-vars
import {CSSProperties} from 'react';
import {ArrowDownFull, TimelineMarker} from '../common/icons';
import {Tooltip} from '../common/styled-components';

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

const containerStyle = {
  display: 'flex',
  width: '100%',
  height: '24px'
};

const iconWrapperStyle = {
  marginRight: '8px',
  cursor: 'pointer'
};

const TIMELINE_INDICATOR_STYLE: CSSProperties = {
  position: 'absolute',
  top: '-14px',
  fill: '#C4C4C4',
  color: '#C4C4C4'
};

function RangeSliderTimelineFactory() {
  const RangeSliderTimeline = ({timeline, scaledValue, style}) => {
    const {startTime, endTime, syncMode, Icon, label} = timeline;

    const progressStyle: CSSProperties = {
      left: `${startTime}%`,
      top: '0',
      width: `${endTime - startTime}%`,
      height: '100%',
      position: 'absolute',
      backgroundColor: '#5558DB'
    };

    const progressBarContainer = useMemo(
      () => ({
        ...BACKGROUND_LINE_STYLE,
        flex: 1,
        ...style
      }),
      [style]
    );

    const value = scaledValue[syncMode];

    const leftMarketStyle = useMemo(
      () => ({
        left: `calc(${startTime}% - 4px)`,
        ...TIMELINE_MARKER_STYLE
      }),
      [startTime]
    );

    const rightMarketStyle = useMemo(
      () => ({
        left: `calc(${endTime}% - 4px)`,
        ...TIMELINE_MARKER_STYLE
      }),
      [endTime]
    );

    const indicatorStyle = useMemo(
      () => ({
        ...TIMELINE_INDICATOR_STYLE,
        left: `calc(${value}% - 3px)`
      }),
      [value]
    );

    return (
      <div style={containerStyle}>
        <div data-tip data-for={label} style={iconWrapperStyle}>
          <Icon height="24px" color="#F7F8FA" />
          <Tooltip id={label} place="right" effect="solid">
            <span>{label}</span>
          </Tooltip>
        </div>
        <div style={progressBarContainer}>
          <div style={progressStyle} />
          <ArrowDownFull style={leftMarketStyle} />
          <ArrowDownFull style={rightMarketStyle} />
          <TimelineMarker style={indicatorStyle} />
        </div>
      </div>
    );
  };

  return RangeSliderTimeline;
}

export default RangeSliderTimelineFactory;

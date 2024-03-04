// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
import RangeSliderTimelineFactory from './range-slider-timeline';
import {Layers} from '../common/icons';
import {Tooltip} from '../common/styled-components';

function RangeSliderTimelinePanelFactory(RangeSliderTimeline) {
  const RangeSliderTimelinePanel = ({timelines, scaledValue, timelineLabel, style}) => {
    const containerStyle = useMemo(
      () => ({
        display: 'flex',
        justifyContent: 'spaceBetween',
        flexWrap: 'wrap',
        ...style
      }),
      [style]
    );

    const iconWrapperStyle = {
      marginRight: '8px',
      cursor: 'pointer'
    };

    return (
      <div style={containerStyle}>
        <div data-tip data-for="layers" style={iconWrapperStyle}>
          <Layers height="24px" color="#F7F8FA" />
          <Tooltip id="layers" place="right" effect="solid">
            <span>{timelineLabel}</span>
          </Tooltip>
        </div>
        <div style={{flex: 1}}>
          {timelines.map((timeline, index) => (
            <RangeSliderTimeline key={index} line={timeline} scaledValue={scaledValue} />
          ))}
        </div>
      </div>
    );
  };

  return RangeSliderTimelinePanel;
}

RangeSliderTimelinePanelFactory.deps = [RangeSliderTimelineFactory];

export default RangeSliderTimelinePanelFactory;

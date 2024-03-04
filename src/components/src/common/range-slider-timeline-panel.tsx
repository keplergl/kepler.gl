// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
import RangeSliderTimelineFactory from './range-slider-timeline';

function RangeSliderTimelinePanelFactory(RangeSliderTimeline) {
  const RangeSliderTimelinePanel = ({timelines, scaledValue, style}) => {
    const containerStyle = useMemo(
      () => ({
        display: 'flex',
        justifyContent: 'spaceBetween',
        flexWrap: 'wrap',
        ...style
      }),
      [style]
    );

    return (
      <div style={containerStyle}>
        {timelines.map((timeline, index) => (
          <RangeSliderTimeline key={index} timeline={timeline} scaledValue={scaledValue} />
        ))}
      </div>
    );
  };

  return RangeSliderTimelinePanel;
}

RangeSliderTimelinePanelFactory.deps = [RangeSliderTimelineFactory];

export default RangeSliderTimelinePanelFactory;

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
import RangeSliderTimelineFactory from './range-slider-timeline';

function RangeSliderSubAnimationPanelFactory(RangeSliderTimeline) {
  const RangeSliderSubAnimationPanel = ({subAnimations, scaledValue, style}) => {
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
        {subAnimations.map((subAnimation, index) => (
          <RangeSliderTimeline key={index} subAnimation={subAnimation} scaledValue={scaledValue} />
        ))}
      </div>
    );
  };

  return RangeSliderSubAnimationPanel;
}

RangeSliderSubAnimationPanelFactory.deps = [RangeSliderTimelineFactory];

export default RangeSliderSubAnimationPanelFactory;

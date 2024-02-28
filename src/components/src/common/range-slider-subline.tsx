// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {TimelineMarker} from '../common/icons';

const LINE_STYLE = {
  height: '4px',
  width: '100%',
  backgroundColor: '#5558DB'
};

const TIMELINE_MARKER_LEFT_STYLE = {position: 'absolute', top: '0', left: '-2px'};
const TIMELINE_MARKER_RIGHT_STYLE = {position: 'absolute', top: '0', right: '-2px'};

function RangeSliderSublineFactory() {
  const RangeSliderSubline = ({line}) => {
    return (
      <div
        style={{
          marginLeft: `${line[0]}%`,
          paddingTop: '14px',
          width: `${line[1] - line[0]}%`,
          position: 'relative'
        }}
      >
        <TimelineMarker height="12px" width="5px" style={TIMELINE_MARKER_LEFT_STYLE} />
        <div style={LINE_STYLE} />
        <TimelineMarker height="12px" width="5px" style={TIMELINE_MARKER_RIGHT_STYLE} />
      </div>
    );
  };

  return RangeSliderSubline;
}

export default RangeSliderSublineFactory;

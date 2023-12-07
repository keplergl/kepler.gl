// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {MapPopoverFactory} from '@kepler.gl/components';

const CustomMapPopoverFactory = (...deps) => {
  const MapPopover = MapPopoverFactory(...deps);
  const MapPopoverWrapper = props => {
    // Disable tooltip for point layer
    if (props.layerHoverProp?.layer?.id === 'point_layer') {
      return null;
    }

    return <MapPopover {...props} />;
  };

  return MapPopoverWrapper;
};
CustomMapPopoverFactory.deps = MapPopoverFactory.deps;
export default CustomMapPopoverFactory;

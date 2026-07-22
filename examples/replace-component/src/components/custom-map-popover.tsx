// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {MapPopoverFactory} from '@kepler.gl/components';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomMapPopoverFactory = (...deps: any[]) => {
  const MapPopover = (MapPopoverFactory as (...args: any[]) => any)(...deps);
  const MapPopoverWrapper = (props: any) => {
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

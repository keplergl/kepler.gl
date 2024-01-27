// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {Icons} from '@kepler.gl/components';

function CustomSidePanelsFactory() {
  const CustomPanels = props => {
    if (props.activeSidePanel === 'rocket') {
      return <div className="rocket-panel">Rocket</div>;
    } else if (props.activeSidePanel === 'chart') {
      return <div className="rocket-panel">Charts?</div>;
    }

    return null;
  };

  CustomPanels.defaultProps = {
    panels: [
      {
        id: 'rocket',
        label: 'Rocket',
        iconComponent: Icons.Rocket
      },
      {
        id: 'chart',
        label: 'Chart',
        iconComponent: Icons.LineChart
      }
    ],
    getProps: props => ({
      layers: props.layers
    })
  };

  return CustomPanels;
}

export default CustomSidePanelsFactory;

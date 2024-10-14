// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {Icons} from '@kepler.gl/components';

function CustomSidePanelsFactory() {
  const defaultPanels = [
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
  ];
  const defaultGetProps = props => ({
    layers: props.layers
  });
  const CustomPanels = props => {
    if (props.activeSidePanel === 'rocket') {
      return <div className="rocket-panel">Rocket</div>;
    } else if (props.activeSidePanel === 'chart') {
      return <div className="rocket-panel">Charts?</div>;
    }

    return null;
  };

  CustomPanels.panels = defaultPanels;
  CustomPanels.getProps = defaultGetProps;

  return CustomPanels;
}

export default CustomSidePanelsFactory;

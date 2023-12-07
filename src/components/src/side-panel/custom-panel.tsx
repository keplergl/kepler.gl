// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {SidePanelItem} from '../types';

export type CustomPanelsProps<P> = {
  panels: SidePanelItem[];
  getProps?: (props: SidePanelItem) => P;
};

// This is a dummy component that can be replaced to inject more side panel sub panels into the side bar
function CustomPanelsFactory<P>() {
  const CustomPanels: React.FC<CustomPanelsProps<P>> = props => {
    return <div />;
  };

  CustomPanels.defaultProps = {
    // provide a list of additional panels
    panels: [
      // {
      //   id: 'rocket',
      //   label: 'Rocket',
      //   iconComponent: Icons.Rocket
      // },
      // {
      //   id: 'chart',
      //   label: 'Chart',
      //   iconComponent: Icons.LineChart
      // }
    ],
    // prop selector from side panel props
    getProps: (sidePanelProps: SidePanelItem) => ({} as P)
  };

  return CustomPanels;
}

export default CustomPanelsFactory;

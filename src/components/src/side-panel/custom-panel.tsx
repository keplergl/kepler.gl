// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {SidePanelItem, SidePanelProps} from '../types';
import {RGBColor} from '@kepler.gl/types';

export type CustomPanelsStaticProps<P> = {
  panels: SidePanelItem[];
  getProps?: (props: SidePanelProps) => P;
};
export type CustomPanelsProps = {
  activeSidePanel: string | null;
  updateTableColor: (dataId: string, newColor: RGBColor) => void;
};

// This is a dummy component that can be replaced to inject more side panel sub panels into the side bar
function CustomPanelsFactory<P>() {
  const CustomPanels: React.FC<CustomPanelsProps> & CustomPanelsStaticProps<P> = () => {
    return <div />;
  };
  // provide a list of additional panels
  CustomPanels.panels = [
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
  ];

  // prop selector from side panel props
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  CustomPanels.getProps = (sidePanelProps: SidePanelProps) => ({} as P);

  return CustomPanels;
}

export default CustomPanelsFactory;

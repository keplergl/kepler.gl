// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {PanelHeaderFactory} from '@kepler.gl/components';

// Custom Panel Header renders default panel header, changing its default props
// to avoid rendering any action items on the top right
export function CustomPanelHeaderFactory() {
  const PanelHeader = PanelHeaderFactory();

  PanelHeader.defaultProps = {
    ...PanelHeader.defaultProps,
    actionItems: []
  };
  return PanelHeader;
}

export default CustomPanelHeaderFactory;

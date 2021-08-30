// Copyright (c) 2021 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React from 'react';
import styled from 'styled-components';
import KeplerGlLogo from 'components/common/logo';

// factories
import SplitMapButtonFactory from './split-map-button';
import Toggle3dButtonFactory from './toggle-3d-button';
import LayerSelectorPanelFactory from './layer-selector-panel';
import MapLegendPanelFactory from './map-legend-panel';
import MapDrawPanelFactory from './map-draw-panel';
import LocalePanelFactory from './locale-panel';

const StyledMapControl = styled.div`
  right: 0;
  padding: ${props => props.theme.mapControl.padding}px;
  z-index: 10;
  margin-top: ${props => props.top || 0}px;
  position: absolute;
  display: grid;
  row-gap: 8px;
  justify-items: end;
  pointer-events: none; /* prevent padding from blocking input */
  & > * {
    /* all children should allow input */
    pointer-events: all;
  }
`;

const LegendLogo = <KeplerGlLogo version={false} appName="kepler.gl" />;

MapControlFactory.deps = [
  MapDrawPanelFactory,
  Toggle3dButtonFactory,
  SplitMapButtonFactory,
  MapLegendPanelFactory,
  LayerSelectorPanelFactory,
  LocalePanelFactory
];

function MapControlFactory(
  MapDrawPanel,
  Toggle3dButton,
  SplitMapButton,
  MapLegendPanel,
  LayerSelectorPanel,
  LocalePanel
) {
  const DEFAULT_ACTIONS = [
    SplitMapButton,
    LayerSelectorPanel,
    Toggle3dButton,
    MapLegendPanel,
    MapDrawPanel,
    LocalePanel
  ];

  /** @type {import('./map-control').MapControl} */
  const MapControl = ({actionComponents = DEFAULT_ACTIONS, ...props}) => {
    return (
      <StyledMapControl className="map-control" top={props.top}>
        {actionComponents.map((ActionComponent, index) => (
          <ActionComponent key={index} className="map-control-action" {...props} />
        ))}
      </StyledMapControl>
    );
  };

  MapControl.defaultProps = {
    isSplit: false,
    top: 0,
    mapIndex: 0,
    logoComponent: LegendLogo
  };

  MapControl.displayName = 'MapControl';

  return React.memo(MapControl);
}

export default MapControlFactory;

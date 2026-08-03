// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as React from 'react';

import {MapControlFactory, AnnotationManagerFactory} from '@kepler.gl/components';

// Matches theme.rightPanelMarginTop / theme.rightPanelMarginRight
const RIGHT_PANEL_MARGIN = 12;
const BOTTOM_WIDGET_PADDING = 30;

const overlayStyle: React.CSSProperties = {
  position: 'absolute',
  right: 0,
  zIndex: 1,
  display: 'flex',
  // let clicks pass through to the map everywhere except on the controls themselves
  pointerEvents: 'none'
};

// The default MapControl positions itself with `right: 0`, so it needs a
// positioned ancestor to anchor against instead of the whole map.
const buttonsStyle: React.CSSProperties = {
  position: 'relative',
  pointerEvents: 'all'
};

const panelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  pointerEvents: 'all'
};

CustomMapControlFactory.deps = [AnnotationManagerFactory, ...MapControlFactory.deps];

function CustomMapControlFactory(
  AnnotationManager: ReturnType<typeof AnnotationManagerFactory>,
  ...deps: Parameters<typeof MapControlFactory>
) {
  const MapControl = MapControlFactory(...deps);

  const CustomMapControl = (props: React.ComponentProps<typeof MapControl>) => {
    const showAnnotations = Boolean(props.mapControls?.annotation?.active);

    return (
      <div
        style={{
          ...overlayStyle,
          top: props.top,
          marginTop: showAnnotations ? RIGHT_PANEL_MARGIN : 0,
          marginRight: showAnnotations ? RIGHT_PANEL_MARGIN : 0,
          maxHeight: `calc(100% - ${RIGHT_PANEL_MARGIN + BOTTOM_WIDGET_PADDING}px)`
        }}
      >
        <div style={buttonsStyle}>
          <MapControl {...props} top={0} />
        </div>
        {showAnnotations ? (
          <div style={panelStyle}>
            <AnnotationManager />
          </div>
        ) : null}
      </div>
    );
  };

  return CustomMapControl;
}

export function replaceMapControl(): [typeof MapControlFactory, typeof CustomMapControlFactory] {
  return [MapControlFactory, CustomMapControlFactory];
}

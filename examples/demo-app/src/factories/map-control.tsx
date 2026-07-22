// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';

import {
  withState,
  MapControlFactory,
  EffectControlFactory,
  EffectManagerFactory
} from '@kepler.gl/components';
// AnnotationManagerFactory is available in the workspace source (src/components) but not yet
// published in the @kepler.gl/components version this example currently depends on.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AnnotationManagerFactory = (require('@kepler.gl/components') as any).AnnotationManagerFactory;
import AiAssistantControlFactory from '../ai-assistant-v2/map/ai-assistant-control';

import {BannerMapPanel, SampleMapPanel} from '../components/map-control/map-control';
import SqlPanelControlFactory from '../components/map-control/sql-panel-control';

const StyledMapControlPanel = styled.div`
  position: relative;
`;

const StyledMapControlContextPanel = styled.div`
  max-height: 100%;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none !important; /* prevent padding from blocking input */
  & > * {
    /* all children should allow input */
    pointer-events: all;
  }
`;

interface StyledMapControlOverlayProps {
  top?: number;
  rightPanelVisible?: boolean;
  fullHeight?: boolean;
}

const StyledMapControlOverlay = styled.div<StyledMapControlOverlayProps>`
  position: absolute;
  display: flex;
  top: ${props => props.top}px;
  right: 0;
  z-index: 1;
  pointer-events: none !important; /* prevent padding from blocking input */
  & > * {
    /* all children should allow input */
    pointer-events: all;
  }

  margin-top: ${props => (props.rightPanelVisible ? props.theme.rightPanelMarginTop : 0)}px;
  margin-right: ${props => (props.rightPanelVisible ? props.theme.rightPanelMarginRight : 0)}px;
  ${props => (props.fullHeight ? 'height' : 'max-height')}: calc(100% - ${props =>
    props.theme.rightPanelMarginTop + props.theme.bottomWidgetPaddingBottom}px);

  .map-control {
    ${props => (props.rightPanelVisible ? 'padding-top: 0px;' : '')}
  }
`;

// `AnnotationManagerFactory` may be missing when this example is built against a published
// `@kepler.gl/components` that predates it (see the require shim above). The component
// injector calls `.deps` on every entry of this array and on their transitive deps, so an
// `undefined` here crashes injection at startup. Substitute a harmless no-op factory so the
// deps array stays positionally aligned with `CustomMapControlFactory`'s parameters while
// remaining injectable. `CustomMapControlFactory` already renders the annotation manager
// conditionally, so the stub is never actually mounted.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NoopAnnotationManagerFactory: any = () => () => null;
NoopAnnotationManagerFactory.deps = [];
const SafeAnnotationManagerFactory = AnnotationManagerFactory || NoopAnnotationManagerFactory;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
CustomMapControlFactory.deps = [
  EffectControlFactory,
  EffectManagerFactory,
  SafeAnnotationManagerFactory,
  SqlPanelControlFactory,
  AiAssistantControlFactory,
  ...MapControlFactory.deps
];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomMapControlFactory(
  EffectControl: any,
  EffectManager: any,
  AnnotationManager: any,
  SqlPanelControl: any,
  AiAssistantControl: any,
  ...deps: any[]
) {
  const MapControl = (MapControlFactory as (...args: any[]) => any)(...deps);
  const actionComponents = [
    ...(MapControl.defaultActionComponents ?? []),
    EffectControl,
    SqlPanelControl,
    AiAssistantControl
  ];

  const CustomMapControl = (props: any) => {
    const showEffects = Boolean(props.mapControls?.effect?.active);
    const showAnnotations = Boolean(props.mapControls?.annotation?.active);
    const rightPanelVisible = showEffects || showAnnotations;
    return (
      <StyledMapControlOverlay top={props.top} rightPanelVisible={rightPanelVisible}>
        <StyledMapControlPanel>
          {<BannerMapPanel {...props} />}
          {!props.isExport && props.currentSample ? <SampleMapPanel {...props} /> : null}
          <MapControl {...props} top={0} actionComponents={actionComponents} />
        </StyledMapControlPanel>
        <StyledMapControlContextPanel>
          {showEffects ? <EffectManager /> : null}
          {showAnnotations ? <AnnotationManager /> : null}
        </StyledMapControlContextPanel>
      </StyledMapControlOverlay>
    );
  };

  return withState([], state => ({...state.demo.app}))(CustomMapControl);
}

export function replaceMapControl() {
  return [MapControlFactory, CustomMapControlFactory];
}

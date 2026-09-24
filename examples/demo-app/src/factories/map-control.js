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
import {getApplicationConfig} from '@kepler.gl/utils';
// AnnotationManagerFactory / ChartManagerFactory are available in the workspace source
// (src/components) but may not yet be published in the @kepler.gl/components version this
// example currently depends on.
const {AnnotationManagerFactory, ChartManagerFactory} = require('@kepler.gl/components');
import {AiAssistantControlFactory} from '@openassistant/kepler-assistant';

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

const StyledMapControlOverlay = styled.div`
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

// These manager factories may be missing when this example is built against a published
// `@kepler.gl/components` that predates them (see the require shim above). The component
// injector calls `.deps` on every entry of this array and on their transitive deps, so an
// `undefined` here crashes injection at startup. Substitute a harmless no-op factory so the
// deps array stays positionally aligned with `CustomMapControlFactory`'s parameters while
// remaining injectable. `CustomMapControlFactory` already renders the managers
// conditionally, so the stubs are never actually mounted.
const noopManagerFactory = () => () => null;
noopManagerFactory.deps = [];
const SafeAnnotationManagerFactory = AnnotationManagerFactory || noopManagerFactory;
const SafeChartManagerFactory = ChartManagerFactory || noopManagerFactory;

CustomMapControlFactory.deps = [
  EffectControlFactory,
  EffectManagerFactory,
  SafeAnnotationManagerFactory,
  SafeChartManagerFactory,
  SqlPanelControlFactory,
  AiAssistantControlFactory,
  ...MapControlFactory.deps
];
function CustomMapControlFactory(
  EffectControl,
  EffectManager,
  AnnotationManager,
  ChartManager,
  SqlPanelControl,
  AiAssistantControl,
  ...deps
) {
  const MapControl = MapControlFactory(...deps);
  const actionComponents = [
    ...(MapControl.defaultActionComponents ?? []),
    EffectControl,
    SqlPanelControl,
    AiAssistantControl
  ];

  const CustomMapControl = props => {
    const chartsEnabled = Boolean(getApplicationConfig().enableChartsPanel);
    const showEffects = Boolean(props.mapControls?.effect?.active);
    const showAnnotations = Boolean(props.mapControls?.annotation?.active);
    const showChartsPanel = chartsEnabled && Boolean(props.mapControls?.chart?.active);
    const hasPinnedCharts =
      chartsEnabled && (props.charts || []).some(chart => chart.pinned !== false);
    const showCharts = showChartsPanel || hasPinnedCharts;
    const rightPanelVisible = showEffects || showAnnotations || showCharts;
    return (
      <StyledMapControlOverlay top={props.top} rightPanelVisible={rightPanelVisible}>
        <StyledMapControlPanel>
          {<BannerMapPanel {...props} />}
          {!props.isExport && props.currentSample ? <SampleMapPanel {...props} /> : null}
          <MapControl {...props} top={0} actionComponents={actionComponents} />
        </StyledMapControlPanel>
        <StyledMapControlContextPanel>
          {showAnnotations ? <AnnotationManager /> : null}
          {showCharts ? <ChartManager panelActive={showChartsPanel} /> : null}
          {showEffects ? <EffectManager /> : null}
        </StyledMapControlContextPanel>
      </StyledMapControlOverlay>
    );
  };

  return withState([], state => ({...state.demo.app}))(CustomMapControl);
}

export function replaceMapControl() {
  return [MapControlFactory, CustomMapControlFactory];
}

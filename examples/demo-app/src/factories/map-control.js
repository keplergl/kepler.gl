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
import {AiAssistantControlFactory} from '@kepler.gl/ai-assistant';

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

CustomMapControlFactory.deps = [
  EffectControlFactory,
  EffectManagerFactory,
  SqlPanelControlFactory,
  AiAssistantControlFactory,
  ...MapControlFactory.deps
];
function CustomMapControlFactory(
  EffectControl,
  EffectManager,
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
    const showEffects = Boolean(props.mapControls?.effect?.active);
    return (
      <StyledMapControlOverlay top={props.top} rightPanelVisible={showEffects}>
        <StyledMapControlPanel>
          {<BannerMapPanel {...props} />}
          {!props.isExport && props.currentSample ? <SampleMapPanel {...props} /> : null}
          <MapControl {...props} top={0} actionComponents={actionComponents} />
        </StyledMapControlPanel>
        <StyledMapControlContextPanel>
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

// Copyright (c) 2023 Uber Technologies, Inc.
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
import {
  withState,
  MapControlFactory,
  EffectControlFactory,
  EffectManagerFactory
} from '@kepler.gl/components';
import {SampleMapPanel} from '../components/map-control/map-control';

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
  ...MapControlFactory.deps
];
function CustomMapControlFactory(EffectControl, EffectManager, ...deps) {
  const MapControl = MapControlFactory(...deps);
  const actionComponents = [...(MapControl.defaultProps?.actionComponents ?? []), EffectControl];

  const CustomMapControl = props => {
    const showEffects = Boolean(props.mapControls?.effect?.active);
    return (
      <StyledMapControlOverlay top={props.top} rightPanelVisible={showEffects}>
        <StyledMapControlPanel>
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

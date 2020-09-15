// Copyright (c) 2020 Uber Technologies, Inc.
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
import {MapControlFactory, withState} from 'kepler.gl/components';
import {SampleMapPanel} from '../components/map-control/map-control';

CustomMapControlFactory.deps = MapControlFactory.deps;
function CustomMapControlFactory(...deps) {
  const MapControl = MapControlFactory(...deps);
  const StyledMapControlOverlay = styled.div`
    position: absolute;
    top: ${props => props.top}px;
    right: 0px;
    z-index: 1;
  `;

  const CustomMapControl = props => (
    <StyledMapControlOverlay top={props.top}>
      {!props.isExport && props.currentSample ? <SampleMapPanel {...props} /> : null}
      <MapControl {...props} top={0} />
    </StyledMapControlOverlay>
  );

  return withState([], state => ({...state.demo.app}))(CustomMapControl);
}

export function replaceMapControl() {
  return [MapControlFactory, CustomMapControlFactory];
}

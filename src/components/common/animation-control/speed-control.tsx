// Copyright (c) 2022 Uber Technologies, Inc.
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
import AnimationSpeedSliderFactory from './animation-speed-slider';
import {Button, CenterFlexbox} from 'components/common/styled-components';
import {Rocket} from 'components/common/icons';
import {preciseRound} from '@kepler.gl/utils';

const StyledSpeedToggle = styled.div`
  display: flex;
  flex-grow: 0;
  color: ${props => props.theme.textColor};
  position: relative;
`;

const StyledSpeedText = styled.div`
  display: inline-block;
  width: 24px;
  text-align: left;
`;

SpeedControlFactory.deps = [AnimationSpeedSliderFactory];

function SpeedControlFactory(AnimationSpeedSlider: ReturnType<typeof AnimationSpeedSliderFactory>) {
  const SpeedControl = ({
    onClick,
    updateAnimationSpeed,
    speed,
    showSpeedControl,
    buttonHeight = '18px'
  }) => (
    <StyledSpeedToggle className="animation-control__speed-control">
      <Button link width="80px" onClick={onClick}>
        <CenterFlexbox className="bottom-widget__icon speed">
          <Rocket height={buttonHeight} />
        </CenterFlexbox>
        <StyledSpeedText style={{visibility: !showSpeedControl ? 'visible' : 'hidden'}}>
          {preciseRound(speed, 1)}x
        </StyledSpeedText>
      </Button>
      {showSpeedControl ? (
        <AnimationSpeedSlider
          onHide={onClick}
          updateAnimationSpeed={updateAnimationSpeed}
          speed={speed}
        />
      ) : null}
    </StyledSpeedToggle>
  );
  return SpeedControl;
}
export default SpeedControlFactory;

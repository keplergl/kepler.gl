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

import styled from 'styled-components';
import React, {useState} from 'react';
import {RootContext} from '../';
import Tippy, {TippyProps} from '@tippyjs/react';

const TippyArrow = styled.div`
  position: absolute;
  width: 15px;
  height: 15px;
  fill: ${props => props.theme.tooltipBg};
  text-align: initial;

  > svg {
    position: absolute;
  }
`;

const TippyTooltipContent = styled(({children, ...props}) => (
  <div {...props}>
    {children}
    <TippyArrow className="svg-arrow" data-popper-arrow="">
      <svg width={15} height={15}>
        <path d="M2,7.5 7.5,2 13,7.5Z" />
      </svg>
    </TippyArrow>
  </div>
))`
  font-family: ${props => props.theme.fontFamily};
  font-size: ${props => props.theme.tooltipFontSize};
  font-weight: 400;
  padding: 7px 18px;
  box-shadow: ${props => props.theme.tooltipBoxShadow};
  background-color: ${props => props.theme.tooltipBg};
  color: ${props => props.theme.tooltipColor};
  border-radius: ${props => props.theme.primaryBtnRadius};
  &[data-placement^='top'] > .svg-arrow {
    bottom: 0;
    &::after,
    > svg {
      top: 7px;
      transform: rotate(180deg);
    }
  }

  &[data-placement^='bottom'] > .svg-arrow {
    top: 0;
    > svg {
      bottom: 7px;
    }
  }

  &[data-placement^='left'] > .svg-arrow {
    right: 0;
    &::after,
    > svg {
      transform: rotate(90deg);
      left: 7px;
    }
  }

  &[data-placement^='right'] > .svg-arrow {
    left: 0;
    &::after,
    > svg {
      transform: rotate(-90deg);
      right: 7px;
    }
  }
`;

const TippyTooltip = ({children, render, duration = 200, ...rest}: TippyProps) => {
  const [opacity, setOpacity] = useState(0);
  const [timer, setTimer] = useState(null);
  function onMount() {
    setOpacity(1);
    if (timer) {
      // @ts-ignore
      clearTimeout(timer);
    }
  }

  function onHide(instance) {
    const {unmount} = instance;
    const timeout = setTimeout(() => {
      if (!instance.state?.isDestroyed) {
        unmount();
      }
    }, duration[0] || duration);
    // @ts-ignore
    setTimer(timeout);
    setOpacity(0);
  }

  return (
    <RootContext.Consumer>
      {context => (
        <Tippy
          {...rest}
          // Using document.body would result in the CSS styles not being applied
          // to the tooltip content when embedding the map widget as a Shadow DOM element.
          appendTo={context?.current || 'parent'}
          animation={true}
          render={attrs => (
            <TippyTooltipContent {...attrs} style={{opacity, transition: `opacity ${duration}ms`}}>
              {render?.(attrs)}
            </TippyTooltipContent>
          )}
          onMount={onMount}
          onHide={onHide}
        >
          {children}
        </Tippy>
      )}
    </RootContext.Consumer>
  );
};

export default TippyTooltip;

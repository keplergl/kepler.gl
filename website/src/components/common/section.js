// Copyright (c) 2018 Uber Technologies, Inc.
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

import React, {PureComponent} from 'react';
import styled, {keyframes} from 'styled-components';
import Waypoint from 'react-waypoint';
import FadeIn from './fade-in';

export const SectionIcon = styled.img`
  width: 64px;
`;

export const SectionContainer = styled.div`
  color: ${props => props.theme === 'dark' ? 'white' : 'black'};
  background: ${props => props.theme === 'dark' ? '#242730' : 'white'};
  padding: 46px 0px;
  margin-top: 32px;
`;

export const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

export const SectionTitle = styled.div`
  font-size: 30px;
  font-weight: 500;
`;

export const SectionDescription = styled.div`
  font-size: 20px;
`;

export const SectionBody = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

class Section extends PureComponent {
  _onSectionEnter = () => {
    console.log('Entering section: ', this.props.title);
  };

  _onSectionLeave = () => {
    console.log('Leaving section: ', this.props.title);
  };

  render() {
    const {icon, title, description, theme, children} = this.props;
    return (
      <Waypoint onEnter={this._onSectionEnter} onLeave={this._onSectionLeave}>
        <SectionContainer theme={theme}>
          <SectionHeader>
            <FadeIn>
              <SectionIcon src={icon} />
            </FadeIn>
            <FadeIn transitionDelay={300}>
              <SectionTitle>{title}</SectionTitle>
            </FadeIn>
            <FadeIn transitionDelay={600}>
              <SectionDescription>{description}</SectionDescription>
            </FadeIn>
          </SectionHeader>
          {children}
        </SectionContainer>
      </Waypoint>
    );
  }
}

export default Section;

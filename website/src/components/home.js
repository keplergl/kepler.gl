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
import styled, {ThemeProvider} from 'styled-components';

import {theme} from '../styles';
import {SECTIONS} from '../content';
import Hero from './hero';
import Showcase from './showcase';
import Examples from './examples';
import Tutorials from './tutorials';
import Walkthrough from './walkthrough';
import Features from './features';
import Footer from './footer';
import Section from './common/section';

const SECTION_CONTENT = {
  showcase: Showcase,
  walkthrough: Walkthrough,
  features: Features,
  examples: Examples,
  tutorials: Tutorials
};

const StyledKGContent = styled.div`
  width: 100vw;
  font-weight: 400;
  font-size: 0.875em;
  line-height: 1.71429;
`;

export default class Home extends PureComponent {
  render() {
    return (
      <StyledKGContent className="kg-web-content">
        <ThemeProvider theme={theme}>
          <div>
            <Hero />
            {SECTIONS.map(
              ({id, title, description, icon, isDark, background}, i) => {
                const SectionContent = SECTION_CONTENT[id];
                return (
                  <Section
                    key={`section-${i}`}
                    title={title}
                    description={description}
                    icon={icon}
                    isDark={isDark}
                    background={background}
                  >
                    <SectionContent />
                  </Section>
                );
              }
            )}
            <Footer />
          </div>
        </ThemeProvider>
      </StyledKGContent>
    );
  }
}

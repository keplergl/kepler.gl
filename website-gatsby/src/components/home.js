// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {PureComponent} from 'react';
import {ThemeProvider} from 'styled-components';
import window from 'global/window';

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
import Header from './header';
import Banner from '../../../examples/demo-app/src/components/banner';
import Announcement from '../../../examples/demo-app/src/components/announcement';

const BannerKey = 'kgHideBanner-iiba';
const BannerHeight = 30;
const BACKGROUND_COLOR = '#82368c';

const SECTION_CONTENT = {
  showcase: Showcase,
  walkthrough: Walkthrough,
  features: Features,
  examples: Examples,
  tutorials: Tutorials
};

export default class Home extends PureComponent {
  state = {
    showBanner: false
  };

  componentDidMount() {
    // delay 2s to show the banner
    // if (!window.localStorage.getItem(BannerKey)) {
    //  window.setTimeout(this._showBanner, 3000);
    // }
  }

  _showBanner = () => {
    this.setState({showBanner: true});
  };

  _hideBanner = () => {
    this.setState({showBanner: false});
  };

  _disableBanner = () => {
    this._hideBanner();
    window.localStorage.setItem(BannerKey, 'true');
  };

  render() {
    return (
      <ThemeProvider theme={theme}>
        <div>
          <Banner
            show={this.state.showBanner}
            height={BannerHeight}
            bgColor={BACKGROUND_COLOR}
            onClose={this._hideBanner}
          >
            <Announcement onDisable={this._disableBanner}/>
          </Banner>
          <Header/>
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
    );
  }
}

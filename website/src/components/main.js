import React, {PureComponent} from 'react';

import {cdnUrl} from '../utils';
import {SECTIONS} from '../content/home';
import Hero from './home';
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

class Main extends PureComponent {
  render() {
    return (
      <div>
        <Hero />
        {SECTIONS.map(({id, title, description, icon, theme}) => {
          const SectionContent = SECTION_CONTENT[id];
          return (
            <Section
              title={title}
              description={description}
              icon={icon}
              theme={theme}
            >
              <SectionContent />
            </Section>
          );
        })}
        <Footer />
      </div>
    );
  }
}

export default Main;

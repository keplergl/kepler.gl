// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {PureComponent} from 'react';
import styled, {ThemeProvider} from 'styled-components';
import {Container, Content, HeroImage, LogoImage, StyledCaption} from './common/styles';
import {theme} from '../styles';
import Header from './header';

const GITHUB_PROJECT = 'https://github.com/keplergl/kepler.gl';
const GITHUB_PROJECT_ISSUES = `${GITHUB_PROJECT}/issues`;
const MAILING_LIST_URL = 'https://groups.google.com/d/forum/kepler-gl';
const CONTRIBUTING_URL = 'https://docs.kepler.gl/contributing';

const StyledContainer = styled(Container)`
  background-color: black;
  height: 100vh;

  max-width: unset;

  .description {
    max-width: 800px;
  }

  .description-content {
    font-weight: 500;
  }

  h3 {
    margin-bottom: 24px;
  }

  a {
    text-decoration: underline;
    color: white;
  }

  a:visited {
    color: white;
  }

  img.hero-image {
    height: 100vh;
  }
`;

export default class Home extends PureComponent {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <div>
          <Header />
          <StyledContainer>
            <HeroImage className="hero-image" />
            <Content>
              <LogoImage />
              <StyledCaption>
                <div className="kg-home__caption__subtitle">Support Policy</div>
                <div className="description">
                  <h3>
                    <a href="https://kepler.gl">Kepler.gl</a> is an open source project. Its source
                    code is available at <a href={GITHUB_PROJECT}>Kepler.gl Github project</a>.
                  </h3>
                  <span className="description-content">
                    As an open source project, questions and bug reports can be filed with the
                    project community, and you can participate in the development of the project's
                    source code. Bug reports and issues can be submitted at{' '}
                    <a href={GITHUB_PROJECT_ISSUES}>Kepler.gl Github issues</a>. Questions can be
                    asked on the project's mailing lists, which you can subscribe at{' '}
                    <a href={MAILING_LIST_URL}>Kepler.gl Mailing list</a>
                    Please review the applicable{' '}
                    <a href={CONTRIBUTING_URL}>contributing guidelines</a> and procedures in
                    connection with your submissions. Please note that the Kepler.gl project and
                    Urban Computing Foundation do not otherwise provide support for users of
                    Kepler.gl software.
                  </span>
                </div>
              </StyledCaption>
            </Content>
          </StyledContainer>
        </div>
      </ThemeProvider>
    );
  }
}

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {PureComponent} from 'react';
import styled, {keyframes} from 'styled-components';
import {window} from 'global';

import {cdnUrl} from '../utils';
import {media, breakPoints} from '../styles';
import {HERO_IMAGES, HERO_IMAGES_SCALED} from '../content';
import SlideShow from './common/slideshow';
import {LinkButton} from './common/styled-components';
import {DEMO_LINK} from '../constants';

import {Container, Content, HeroImage, LogoImage, StyledCaption} from './common/styles';

const SlideShowAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translate(0, 20px);
  }

  100% {
    opacity: 1.0
  }
`;

const FadeIn = styled.div`
  animation-name: ${SlideShowAnimation};
  animation-timing-function: ease-in-out;
  animation-duration: 1s;
  animation-delay: 500ms;
  animation-fill-mode: both;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;

  a {
    width: 160px;
  }

  ${media.palm`
    display: flex;
    justify-content: center;
    width: 100%;

    a {
      width: 50%;
    }
  `};
`;

export default class Hero extends PureComponent {
  state = {
    window: window.innerWidth,
    height: window.innerHeight
  };

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  render() {
    const isPalm = this.state.width <= breakPoints.palm;
    return (
      <Container>
        <HeroImage />
        <Content>
          <LogoImage />
          <StyledCaption>
            <div className="kg-home__caption__subtitle">
              Make an impact with your location data
            </div>
            <div className="kg-home__caption__description">
              <span>Kepler.gl is a powerful </span>
              <span className="t-bold"> open source </span>
              <span>geospatial analysis tool&nbsp;for </span>
              <span className="t-bold">large-scale&nbsp;</span>
              <span>data sets.</span>
            </div>
            <ButtonContainer>
              <LinkButton large href={DEMO_LINK}>
                Get Started
              </LinkButton>
              <LinkButton
                large
                outlineDark
                href="https://github.com/keplergl/kepler.gl"
                style={{marginLeft: '5px'}}
              >
                <img src={cdnUrl('icons/github.svg')} /> Github
              </LinkButton>
            </ButtonContainer>
          </StyledCaption>
          <FadeIn>
            <SlideShow images={isPalm ? HERO_IMAGES_SCALED : HERO_IMAGES} />
          </FadeIn>
        </Content>
      </Container>
    );
  }
}

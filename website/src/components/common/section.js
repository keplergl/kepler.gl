// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import StaggeredScrollAnimation from './staggered-scroll-animation';

import {media} from '../../styles';

export const SectionIcon = styled.img`
  width: 64px;
  ${media.palm`
    width: 48px;
  `};
`;

export const SectionContainer = styled.div`
  color: ${props => (props.isDark ? 'white' : 'black')};
  background: ${props =>
    props.isDark
      ? props.theme.darkBackgroundColor
      : props.background
      ? `url(${props.background})`
      : 'white'};
  padding: ${props => props.theme.margins.huge};
  // margin-bottom: ${props => props.theme.margins.large};
  background-size: cover;

  ${media.portable`
    padding: ${props => props.theme.margins.large}
  `} ${media.palm`
    padding: ${props => props.theme.margins.medium}
  `};
`;

export const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.margins.large};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
`;

export const SectionTitle = styled.div`
  font-size: 30px;
  font-weight: 500;
  ${media.palm`
    font-size: 24px;
  `};
`;

export const SectionDescription = styled.div`
  font-size: 20px;
  max-width: 700px;
  ${media.palm`
    font-size: 16px;
  `};
`;

class Section extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    isDark: PropTypes.bool,
    background: PropTypes.string,
    children: PropTypes.node.isRequired
  };

  static defaultProps = {
    isDark: false
  };

  render() {
    const {icon, title, description, isDark, background, children} = this.props;
    return (
      <SectionContainer isDark={isDark} background={background}>
        <StaggeredScrollAnimation Container={SectionHeader}>
          <SectionIcon src={icon} />
          <SectionTitle>{title}</SectionTitle>
          <SectionDescription>{description}</SectionDescription>
        </StaggeredScrollAnimation>
        {children}
      </SectionContainer>
    );
  }
}

export default Section;

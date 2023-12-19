// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {setInterval, clearInterval} from 'global/window';
import {media} from '../../styles';

const imageRatio = 696 / 1080;

const StyledImgContainer = styled.div`
  box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.5);
  flex-shrink: 0;
  opacity: 1;
  position: relative;

  width: calc(100vw - 60px);
  height: ${imageRatio * 100}vw;

  max-width: 800px;
  max-height: ${800 * imageRatio}px;

  ${media.palm`
    width: calc(100vw - 60px);
    height: ${imageRatio * 100}vw;
  `};
`;

const StyledImg = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  position: absolute;
  top: 0;
  transition: opacity ${props => props.fadeDuration}ms;
  opacity: ${props => (props.isVisible ? '1.0' : '0.0')};
`;

export default class SlideShow extends PureComponent {
  static propTypes = {
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    slideDuration: PropTypes.number,
    fadeDuration: PropTypes.number
  };

  static defaultProps = {
    slideDuration: 5000,
    fadeDuration: 2000
  };

  constructor(props) {
    super(props);
    this._intervalId = null;
  }

  state = {
    currentIndex: 0
  };

  componentDidMount() {
    this._intervalId = setInterval(this._transitionImage, this.props.slideDuration);
  }

  componentWillUnmount() {
    clearInterval(this._intervalId);
  }

  _transitionImage = () => {
    const {images} = this.props;
    const {currentIndex} = this.state;
    this.setState({
      currentIndex: currentIndex === images.length - 1 ? 0 : currentIndex + 1
    });
  };

  render() {
    const {images, fadeDuration} = this.props;
    return (
      <StyledImgContainer>
        {images.map((src, i) => (
          <StyledImg
            key={src}
            src={src}
            fadeDuration={fadeDuration}
            isVisible={i <= this.state.currentIndex}
          />
        ))}
      </StyledImgContainer>
    );
  }
}

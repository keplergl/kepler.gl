// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {PureComponent} from 'react';
import styled from 'styled-components';

import {WALKTHROUGH_ITEMS} from '../content';
import {media} from '../styles';
import Swipeable from './common/swipeable';

const WalkthroughItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  ${media.palm`
    width: 100%;
    font-size: 12px;
  `};
`;

const VideoContainer = styled.div`
  width: 640px;
  ${media.portable`
    width: 500px;
  `} ${media.palm`
    width: 100%;
  `};

  video {
    width: 100%;
  }
`;

const VideoDescription = styled.div`
  margin-top: 16px;
`;

const VideoWrapperHeader = styled.div`
  height: 15px;
  background: #e5e5e4;
  border-radius: 3px 3px 0px 0px;
  display: flex;
  align-items: center;
  padding: 0px 5px;
`;

const VideoWrapperHeaderCircle = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 10px;
  background: ${props => props.color};
  margin-left: 5px;
`;

const VideoWrapper = ({children}) => (
  <div>
    <VideoWrapperHeader>
      <VideoWrapperHeaderCircle color="#12BB00" />
      <VideoWrapperHeaderCircle color="#D3AE00" />
      <VideoWrapperHeaderCircle color="#DE3131" />
    </VideoWrapperHeader>
    {children}
  </div>
);

class Walkthrough extends PureComponent {
  constructor(props) {
    super(props);
    this.videoElements = {};
  }
  state = {
    selectedIndex: 0
  };

  _onChange = index => {
    this.setState({selectedIndex: index});
    const videoElement = this.videoElements[index];
    videoElement.load();
    videoElement.play();
  };

  _onVideoEnded = () => {
    const {selectedIndex} = this.state;
    const newIndex = (selectedIndex + 1) % WALKTHROUGH_ITEMS.length;
    this._onChange(newIndex);
  };

  _assignVideoRef = (element, index) => {
    this.videoElements[index] = element;
  };

  render() {
    const {selectedIndex} = this.state;
    return (
      <div>
        <Swipeable onChange={this._onChange} selectedIndex={selectedIndex}>
          {WALKTHROUGH_ITEMS.map(({videoUrl, imageUrl, description}, i) => (
            <WalkthroughItem key={i}>
              <VideoWrapper key={videoUrl}>
                <VideoContainer>
                  <video
                    muted
                    src={videoUrl}
                    poster={imageUrl}
                    autoPlay={i === selectedIndex}
                    ref={elt => this._assignVideoRef(elt, i)}
                    onEnded={this._onVideoEnded}
                  />
                </VideoContainer>
              </VideoWrapper>
              <VideoDescription>{description}</VideoDescription>
            </WalkthroughItem>
          ))}
        </Swipeable>
      </div>
    );
  }
}

export default Walkthrough;

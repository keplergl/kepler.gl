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
import styled from 'styled-components';

import {WALKTHROUGH_ITEMS} from '../content';
import {media} from '../styles';
import YoutubeVideo from './common/youtube-video';
import Swipeable from './common/swipeable';

const ItemWrapper = styled.div`
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
  height: 420px;

  ${media.portable`
    width: 500px;
    height: 330px;
  `} ${media.palm`
    width: 100%;
    height: 250px;
  `};
`;

const ItemDescription = styled.div`
  margin-top: 16px;
`;

class Walkthrough extends PureComponent {
  render() {
    return (
      <div>
        <Swipeable>
          {WALKTHROUGH_ITEMS.map(({videoUrl, description}) => (
            <ItemWrapper>
              <VideoContainer>
                <YoutubeVideo src={videoUrl} width="100%" height />
              </VideoContainer>
              <ItemDescription>{description}</ItemDescription>
            </ItemWrapper>
          ))}
        </Swipeable>
      </div>
    );
  }
}

export default Walkthrough;

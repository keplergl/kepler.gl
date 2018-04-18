import React, {PureComponent} from 'react';
import styled, {keyframes} from 'styled-components';

import {WALKTHROUGH_ITEMS} from '../content/walkthrough';
import YoutubeVideo from './common/youtube-video';
import Swipeable from './common/Swipeable';
import FadeIn from './common/fade-in';

const ItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ItemDescription = styled.div`
  margin-top: 16px;
`
class Walkthrough extends PureComponent {
  render() {
    return (
      <div>
        <Swipeable>
          {WALKTHROUGH_ITEMS.map(({videoUrl, description}) => (
            <ItemWrapper>
              <FadeIn>
                <YoutubeVideo src={videoUrl} />
              </FadeIn>
              <FadeIn>
                <ItemDescription>{description}</ItemDescription>
              </FadeIn>
            </ItemWrapper>
          ))}
        </Swipeable>
      </div>
    );
  }
}

export default Walkthrough;


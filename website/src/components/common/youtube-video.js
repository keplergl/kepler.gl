import React, {PureComponent} from 'react';

export default class YoutubeVideo extends PureComponent {
  render() {
    const {src} = this.props;
    return (
      <iframe
        width="640"
        height="480"
        src={src}
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
        style={{border: 'none'}}
      />
    );
  }
}

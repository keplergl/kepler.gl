import React, {PureComponent} from 'react';
import SlickSlider from 'react-slick';

export default class Slider extends PureComponent {
  render() { 
    return (
      <div>
        <SlickSlider
          dots={true}
          infinite={true}
          speed={1000}
          slideToShow={1}
          slideToScroll={1}>
          {this.props.children}
        </SlickSlider>
      </div>
    );
  }
}
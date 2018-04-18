import React, {PureComponent} from 'react';
import styled, {keyframes} from 'styled-components';

import {TUTORIALS} from '../content/tutorials';
import {HorizontalCard} from './common/card';

class Tutorials extends PureComponent {
  render() {
    return (
      <div>
        {TUTORIALS.map(({title, description, image}) => (
          <HorizontalCard 
            title={title}
            description={description}
            image={image}
            style={{maxWidth: '50%'}} /> 
        ))}
      </div>
    );
  }
}

export default Tutorials;


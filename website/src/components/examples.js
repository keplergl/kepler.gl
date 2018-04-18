import React, {PureComponent} from 'react';
import styled, {keyframes} from 'styled-components';

import {EXAMPLES} from '../content/examples';
import {VerticalCard} from './common/card';

const SectionBody = styled.div`
  display: flex;
  justify-content: center;
`;

class Examples extends PureComponent {
  render() {
    return (
      <SectionBody>
        {EXAMPLES.map(({title, description, image}) => (
          <VerticalCard title={title} description={description} image={image} />
        ))}
      </SectionBody>
    );
  }
}

export default Examples;


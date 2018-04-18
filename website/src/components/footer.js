import React, {PureComponent} from 'react';
import styled from 'styled-components';

import {cdnUrl} from '../utils';

const Container = styled.div`
  background: #242730;
  padding: 60px 48px;
`;

const LogosContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const CreatedBy = styled.div`
  display: inline-flex;
  margin-left: 10px;
  align-items: center;

  a {
    display: inline-flex;
    align-items: center;
    img {
      height: 20px;
    }
  }
`;




export default class Footer extends PureComponent {
  render() {
    return (
      <Container>
        <LogosContainer>
          <img src={cdnUrl('icons/kepler.svg')} />
          <div>
            <img src={cdnUrl('icons/uber.svg')} />
            <CreatedBy>
              <div> Created By </div>
              <a target="_blank" rel="noopener noreferrer" href="http://vis.gl">
                <img src={cdnUrl('icons/viz_logo_bw.png')} /> VIS.GL
              </a>
            </CreatedBy>
          </div>
        </LogosContainer>
      </Container>
    );
  }
}
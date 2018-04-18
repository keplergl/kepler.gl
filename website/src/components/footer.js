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
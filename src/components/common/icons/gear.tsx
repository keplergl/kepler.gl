// Copyright (c) 2022 Uber Technologies, Inc.
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

import React, {Component} from 'react';
import {Base, BaseProps} from '@kepler.gl/constants';

export default class Gear extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-gear'
  };

  render() {
    return (
      <Base {...this.props}>
        <g>
          <path d="M39.1740741,58 L26.2185185,58 L25.9240741,52.012963 C24.9425926,51.7185185 24.0592593,51.3259259 23.1759259,50.9333333 L18.562963,54.7611111 L9.63148148,45.8296296 L13.6555556,41.2166667 C13.262963,40.3333333 12.8703704,39.45 12.5759259,38.5666667 L6.49074074,38.2722222 L6.49074074,25.3166667 L12.6740741,25.0222222 C12.9685185,24.0407407 13.3611111,23.1574074 13.7537037,22.3722222 L9.72962963,17.7592593 L18.6611111,8.82777778 L23.2740741,12.7537037 C24.0592593,12.3611111 24.9425926,11.8703704 26.0222222,11.5759259 L26.3166667,5.58888889 L39.1740741,5.58888889 L39.4685185,11.4777778 C40.45,11.7722222 41.3333333,12.1648148 42.412963,12.7537037 L46.7314815,8.92592593 L55.662963,17.8574074 L51.9333333,22.1759259 C52.4240741,23.2555556 52.8166667,24.237037 53.2092593,25.1203704 L58.9018519,25.4148148 L58.9018519,38.2722222 L53.2092593,38.5666667 C52.9148148,39.5481481 52.4240741,40.6277778 51.9333333,41.6092593 L55.5648148,45.9277778 L46.6333333,54.8592593 L42.3148148,51.0314815 C41.2351852,51.5222222 40.3518519,51.9148148 39.3703704,52.3074074 L39.1740741,58 Z M30.1444444,53.9759259 L35.3462963,53.9759259 L35.6407407,49.0685185 L37.112963,48.6759259 C38.5851852,48.2833333 40.0574074,47.6944444 41.8240741,46.712963 L43.1,46.0259259 L46.7314815,49.2648148 L50.362963,45.6333333 L47.2222222,42.0018519 L48.0074074,40.7259259 C48.7925926,39.3518519 49.4796296,37.6833333 49.8722222,36.112963 L50.2648148,34.6407407 L55.0740741,34.3462963 L55.0740741,29.1444444 L50.1666667,28.85 L49.7740741,27.3777778 C49.3814815,25.9055556 48.7925926,24.4333333 47.8111111,22.6666667 L47.1240741,21.4888889 L50.1666667,17.8574074 L46.5351852,14.2259259 L42.9037037,17.4648148 L41.7259259,16.7777778 C39.9592593,15.7962963 38.487037,15.2074074 37.0148148,14.8148148 L35.5425926,14.4222222 L35.2481481,9.51481481 L30.0462963,9.51481481 L29.7518519,14.6185185 L28.2796296,15.0111111 C26.9055556,15.4037037 25.6296296,15.8944444 23.9611111,16.8759259 L22.6851852,17.6611111 L18.7592593,14.2259259 L15.1277778,17.8574074 L18.562963,21.7833333 L17.7777778,23.0592593 C17.0907407,24.237037 16.5018519,25.7092593 16.0111111,27.4759259 L15.6185185,28.85 L10.4166667,29.1444444 L10.4166667,34.3462963 L15.6185185,34.6407407 L16.0111111,36.112963 C16.4037037,37.7814815 16.9925926,39.1555556 17.7777778,40.4314815 L18.562963,41.7074074 L15.1277778,45.6333333 L18.7592593,49.2648148 L22.6851852,46.0259259 L23.9611111,46.8111111 C25.3351852,47.5962963 26.6111111,48.1851852 28.2796296,48.5777778 L29.7518519,48.9703704 L30.1444444,53.9759259 Z" />
          <path d="M32.8068966,45.2275862 C25.2758621,45.2275862 19.1931034,39.2413793 19.1931034,31.9034483 C19.1931034,24.3724138 25.2758621,18.2896552 32.8068966,18.2896552 C40.337931,18.2896552 46.1310345,24.2758621 46.1310345,31.9034483 C46.2275862,39.2413793 40.1448276,45.2275862 32.8068966,45.2275862 Z M32.8068966,22.6344828 C27.6896552,22.6344828 23.537931,26.7862069 23.537931,31.9034483 C23.537931,36.9241379 27.6896552,40.9793103 32.8068966,40.9793103 C37.8275862,40.9793103 41.8827586,36.9241379 41.8827586,31.9034483 C41.8827586,26.6896552 37.9241379,22.6344828 32.8068966,22.6344828 Z" />
        </g>
      </Base>
    );
  }
}

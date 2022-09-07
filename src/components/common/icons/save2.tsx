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

export default class Save2 extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-save2'
  };

  render() {
    return (
      <Base {...this.props}>
        <g>
          <path d="M37.9069767,38 L24.0930233,38 C22.9368372,38 22,38.8952 22,40 C22,41.1048 22.9368372,42 24.0930233,42 L37.9069767,42 C39.0631628,42 40,41.1048 40,40 C40,38.8952 39.0631628,38 37.9069767,38 Z" />
          <path d="M37.9069767,46 L24.0930233,46 C22.9368372,46 22,46.8952 22,48 C22,49.1048 22.9368372,50 24.0930233,50 L37.9069767,50 C39.0631628,50 40,49.1048 40,48 C40,46.8952 39.0631628,46 37.9069767,46 Z" />
          <path d="M47.9591688,8.6 C46.8447431,7.56810345 45.4006509,7 43.8938457,7 L39.6276717,7 L17.8756081,7 L13.0382379,7 C9.70852048,7 7,9.75517241 7,13.1422414 L7,50.8577586 C7,54.2448276 9.70852048,57 13.0382379,57 L17.8756081,57 L46.1243919,57 L50.9617621,57 C54.2914795,57 57,54.2448276 57,50.8577586 L57,19.6896552 C57,17.9637931 56.2804963,16.3086207 55.0270852,15.1474138 L47.9591688,8.6 Z M37.5089917,11.3103448 L37.5089917,17.275 C37.5089917,18.2655172 36.7157579,19.0724138 35.7420126,19.0724138 L21.7612671,19.0724138 C20.7875218,19.0724138 19.994288,18.2655172 19.994288,17.275 L19.994288,11.3103448 L37.5089917,11.3103448 Z M19.994288,52.6896552 L19.994288,34.9448276 C19.994288,33.9543103 20.7875218,33.1474138 21.7612671,33.1474138 L42.2387329,33.1474138 C43.2124782,33.1474138 44.005712,33.9543103 44.005712,34.9448276 L44.005712,52.6896552 L19.994288,52.6896552 Z M52.7634875,50.8577586 C52.7634875,51.8681034 51.9558467,52.6896552 50.9626095,52.6896552 L48.2439194,52.6896552 L48.2439194,34.9448276 C48.2439194,31.5775862 45.5506534,28.837069 42.2395803,28.837069 L21.7612671,28.837069 C18.4501941,28.837069 15.7569281,31.5775862 15.7569281,34.9448276 L15.7569281,52.6896552 L13.0382379,52.6896552 C12.0450008,52.6896552 11.23736,51.8681034 11.23736,50.8577586 L11.23736,13.1422414 C11.23736,12.1318966 12.0450008,11.3103448 13.0382379,11.3103448 L15.7569281,11.3103448 L15.7569281,17.275 C15.7569281,20.6422414 18.4501941,23.3827586 21.7612671,23.3827586 L35.7420126,23.3827586 C39.0530856,23.3827586 41.7463516,20.6422414 41.7463516,17.275 L41.7463516,11.3103448 L43.8938457,11.3103448 C44.3430058,11.3103448 44.7735216,11.4793103 45.1057306,11.787931 L52.175342,18.3353448 C52.5490771,18.6810345 52.7634875,19.1758621 52.7634875,19.6896552 L52.7634875,50.8577586 Z" />
          <path d="M32.8214286,17.6428571 C33.3022857,17.6428571 33.7685714,17.4440777 34.111,17.1073997 C34.4461429,16.7626531 34.6428571,16.2939445 34.6428571,15.8090988 C34.6428571,15.3242531 34.4461429,14.8555444 34.111,14.5181329 C33.4334286,13.8286397 32.2094286,13.8286397 31.5391429,14.5100643 C31.1967143,14.8555444 31,15.3242531 31,15.8090988 C31,16.2939445 31.1967143,16.7626531 31.5391429,17.1073997 C31.8742857,17.4440777 32.3405714,17.6428571 32.8214286,17.6428571 Z" />
        </g>
      </Base>
    );
  }
}

// Copyright (c) 2023 Uber Technologies, Inc.
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

import test from 'tape';
import {setStyleSheetBaseHref} from '../../../src/utils/src/dom-utils';

const MOCK_CSS = `div#header { 
    background-image: url('images/header-background.jpg');
}`;
const EXPECTED_CSS = `div#header { 
    background-image: url('http://mock.kepler.com/js/v1.1.1/images/header-background.jpg');
}`;
const MOCK_CSS_1 = `div#header { 
    background-image: url('./images/header-background.jpg');
}`;
const EXPECTED_CSS_1 = `div#header { 
    background-image: url('http://mock.kepler.com/js/v1.1.1/images/header-background.jpg');
}`;
const MOCK_CSS_2 = `div#header { 
    background-image: url('../images/header-background.jpg');
}`;
const EXPECTED_CSS_2 = `div#header { 
    background-image: url('http://mock.kepler.com/js/images/header-background.jpg');
}`;

const MOCK_CSS_3 = `@font-face {
    src: url("data:application/font-woff;base64,d09GRg");
}`;
const MOCK_CSS_4 = `div#header { 
    background-image: url('http://mock.kepler.com/js/images/header-background.jpg');
}`;
const BASE_HREF = 'http://mock.kepler.com/js/v1.1.1/main.css';

test('dom-to-image: setStyleSheetBaseHref', t => {
  const TEST_CASES = [
    {
      args: {
        text: MOCK_CSS,
        base: BASE_HREF
      },
      expected: EXPECTED_CSS,
      msg: 'should replace relative path'
    },
    {
      args: {
        text: MOCK_CSS_1,
        base: BASE_HREF
      },
      expected: EXPECTED_CSS_1,
      msg: 'should replace relative path'
    },
    {
      args: {
        text: MOCK_CSS_2,
        base: BASE_HREF
      },
      expected: EXPECTED_CSS_2,
      msg: 'should replace relative path'
    },
    {
      args: {
        text: MOCK_CSS_3,
        base: BASE_HREF
      },
      expected: MOCK_CSS_3,
      msg: 'should not change data url'
    },
    {
      args: {
        text: MOCK_CSS_4,
        base: BASE_HREF
      },
      expected: MOCK_CSS_4,
      msg: 'should not change absolute url'
    }
  ];

  TEST_CASES.forEach(tc => {
    const result = setStyleSheetBaseHref(tc.args.text, tc.args.base);
    t.equal(result, tc.expected, tc.msg);
  });

  t.end();
});

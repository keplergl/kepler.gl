// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {setStyleSheetBaseHref} from '@kepler.gl/utils';

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

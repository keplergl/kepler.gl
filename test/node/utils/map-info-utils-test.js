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

import test from 'tape';
import {isValidMapInfo} from '../../../src/utils';

test('mapInfoUtils -> isValidMapInfo', t => {
  t.equal(
    isValidMapInfo({title: 'example', description: ''}),
    true,
    'Should validate map info with no description'
  );
  t.equal(
    isValidMapInfo({title: 'example', description: 'this is a map'}),
    true,
    'Should validate map info with description'
  );
  t.equal(
    isValidMapInfo({
      title:
        'this is a really long title for a map that is not going to work because i really do not like this kind of long title',
      description: 'this is a map'
    }),
    false,
    'Should validate map with a really long title'
  );
  t.equal(
    isValidMapInfo({
      description:
        'this is a really long description for a map that is not going to work because i really do not like this kind of long title',
      title: 'this is a map'
    }),
    false,
    'Should validate map with a really long description'
  );
  t.end();
});

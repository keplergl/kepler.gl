// Copyright (c) 2019 Uber Technologies, Inc.
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

import {findFieldsToShow} from 'utils/interaction-utils';
import {DEFAULT_TOOLTIP_FIELDS} from 'constants/default-settings';

const fields = [
  {
    name: 'lat'
  },
  {
    name: '_lat'
  },
  {
    name: 'se.longitude'
  },
  {
    name: 'p longitude'
  },
  {
    name: 'hex_id'
  },
  {
    name: 'all_points',
    type: 'geojson'
  },
  {
    name: 'a'
  },
  {
    name: 'b'
  },
  {
    name: 'c'
  },
  {
    name: 'd'
  },
  {
    name: 'e'
  },
  {
    name: 'f'
  }
];

it('interactionUtil -> findFieldsToShow', () => {
  const dataId = 'random_stuff';

  const someFields = [
    ...DEFAULT_TOOLTIP_FIELDS.slice(0, 2).map(d => ({name: d})),
    ...[
      {
        name: 'random'
      },
      {
        name: 'something_else'
      }
    ]
  ];

  const expectedFields = ['random', 'something_else'];

  expect(findFieldsToShow({fields: someFields, id: dataId})).toEqual({random_stuff: expectedFields});
});

it('interactionUtil -> autoFindTooltipFields', () => {
  const expectedFields = {test: ['hex_id', 'a', 'b', 'c', 'd']};

  expect(findFieldsToShow({fields, id: 'test'})).toEqual(expectedFields);
});

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

export const rawData = `tooltip,num_array,str_array,bool_array
"{""b"": 1}","[1,2]","[""a"", ""b"", ""c""]","[true]"
"{""c"": 1}","[2,3]","[""d"", ""e""]","[false, true]"
"{""a"": 2}","[3,4]","[""f"", ""g""]","[true]"
"{""a"": 3}","[4,5,6]","[]","[true]"
"{""a"": 4}","[5,6]",,"[true]"
"{""d"": 1}","[6,7]","[""h""]","[false]"
"{""e"": 1}","[7,8]","[""i"", ""j""]","[true]"
"{""f"": 1}","[8,9]","[""k""]","[true]"`;

export const csvObjectDataId = 'test-csv-object';

export const objCsvFields = [
  {
    type: 'object',
    name: 'tooltip',
    id: 'tooltip',
    displayName: 'tooltip',
    format: '',
    fieldIdx: 0,
    analyzerType: 'OBJECT',
    valueAccessor: values => values[0]
  },
  {
    type: 'array',
    name: 'num_array',
    id: 'num_array',
    displayName: 'num_array',
    format: '',
    fieldIdx: 1,
    analyzerType: 'ARRAY',
    valueAccessor: values => values[1]
  },
  {
    type: 'array',
    name: 'str_array',
    id: 'str_array',
    displayName: 'str_array',
    format: '',
    fieldIdx: 2,
    analyzerType: 'ARRAY',
    valueAccessor: values => values[2]
  },
  {
    type: 'array',
    name: 'bool_array',
    id: 'bool_array',
    displayName: 'bool_array',
    format: '',
    fieldIdx: 3,
    analyzerType: 'ARRAY',
    valueAccessor: values => values[3]
  }
];

export const objCsvRows = [
  [{b: 1}, [1, 2], ['a', 'b', 'c'], [true]],
  [{c: 1}, [2, 3], ['d', 'e'], [false, true]],
  [{a: 2}, [3, 4], ['f', 'g'], [true]],
  [{a: 3}, [4, 5, 6], [], [true]],
  [{a: 4}, [5, 6], null, [true]],
  [{d: 1}, [6, 7], ['h'], [false]],
  [{e: 1}, [7, 8], ['i', 'j'], [true]],
  [{f: 1}, [8, 9], ['k'], [true]]
];
export default rawData;

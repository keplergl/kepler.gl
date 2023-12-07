// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

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

// Copyright (c) 2020 Uber Technologies, Inc.
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

const data = `[{"bedrooms": "Null", "bathrooms": "N/A", "effectiveyearbuilt": "Null", "roll_landbaseyear": "N/", "roll_totlandimp": "37827477", "nettaxablevalue": "37827477", "center_lon": "-118.40032195", "roll_landvalue": "10627524", "usecodedescchar1": "Residential", "usetype": "R-I", "yearbuiltTS": "1136073600000", "yearbuilt": "2006", "roll_impvalue": "27199953", "istaxableparcel": "true", "propertylocation": "3762 CLARINGTON AVE  LOS ANGELES CA  90034", "units": "116", "sqftmain": "130693", "roll_totalvalue": "37827477", "situszip5": "90034", "center_lat": "34.02322471"}, {"bedrooms": "99", "bathrooms": "99", "effectiveyearbuilt": "2006", "roll_landbaseyear": "2007", "roll_totlandimp": "37085763", "nettaxablevalue": "37097927", "center_lon": "-118.40032195", "roll_landvalue": "10419142", "usecodedescchar1": "Residential", "usetype": "R-I", "yearbuiltTS": "1136073600000", "yearbuilt": "2006", "roll_impvalue": "26666621", "istaxableparcel": "true", "propertylocation": "3762 CLARINGTON AVE  LOS ANGELES CA  90034", "units": "116", "sqftmain": "130693", "roll_totalvalue": "37097927", "situszip5": "90034", "center_lat": "34.02322471"}, {"bedrooms": "99", "bathrooms": "99", "effectiveyearbuilt": "2006", "roll_landbaseyear": "2007", "roll_totlandimp": "35463324", "nettaxablevalue": "35463324", "center_lon": "-118.40032195", "roll_landvalue": "9963324", "usecodedescchar1": "Residential", "usetype": "R-I", "yearbuiltTS": "1136073600000", "yearbuilt": "2006", "roll_impvalue": "25500000", "istaxableparcel": "true", "propertylocation": "3762 CLARINGTON AVE  LOS ANGELES CA  90034", "units": "116", "sqftmain": "130693", "roll_totalvalue": "35463324", "situszip5": "90034", "center_lat": "34.02322471"}, {"bedrooms": "99", "bathrooms": "99", "effectiveyearbuilt": "2006", "roll_landbaseyear": "2007", "roll_totlandimp": "36172590", "nettaxablevalue": "36172590", "center_lon": "-118.40032195", "roll_landvalue": "10162590", "usecodedescchar1": "Residential", "usetype": "R-I", "yearbuiltTS": "1136073600000", "yearbuilt": "2006", "roll_impvalue": "26010000", "istaxableparcel": "true", "propertylocation": "3762 CLARINGTON AVE  LOS ANGELES CA  90034", "units": "116", "sqftmain": "130693", "roll_totalvalue": "36172590", "situszip5": "90034", "center_lat": "34.02322471"}, {"bedrooms": "99", "bathrooms": "99", "effectiveyearbuilt": "2006", "roll_landbaseyear": "2007", "roll_totlandimp": "38758435", "nettaxablevalue": "38775032", "center_lon": "-118.40032195", "roll_landvalue": "10889073", "usecodedescchar1": "Residential", "usetype": "R-I", "yearbuiltTS": "1136073600000", "yearbuilt": "2006", "roll_impvalue": "27869362", "istaxableparcel": "true", "propertylocation": "3762 CLARINGTON AVE  LOS ANGELES CA  90034", "units": "116", "sqftmain": "130693", "roll_totalvalue": "38775032", "situszip5": "90034", "center_lat": "34.02322471"}, {"bedrooms": "99", "bathrooms": "99", "effectiveyearbuilt": "2006", "roll_landbaseyear": "2007", "roll_totlandimp": "36086860", "nettaxablevalue": "36092822", "center_lon": "-118.40032195", "roll_landvalue": "10138504", "usecodedescchar1": "Residential", "usetype": "R-I", "yearbuiltTS": "1136073600000", "yearbuilt": "2006", "roll_impvalue": "25948356", "istaxableparcel": "true", "propertylocation": "3762 CLARINGTON AVE  LOS ANGELES CA  90034", "units": "116", "sqftmain": "130693", "roll_totalvalue": "36092822", "situszip5": "90034", "center_lat": "34.02322471"}, {"bedrooms": "99", "bathrooms": "99", "effectiveyearbuilt": "2006", "roll_landbaseyear": "2007", "roll_totlandimp": "37999212", "nettaxablevalue": "38012236", "center_lon": "-118.40032195", "roll_landvalue": "10675772", "usecodedescchar1": "Residential", "usetype": "R-I", "yearbuiltTS": "1136073600000", "yearbuilt": "2006", "roll_impvalue": "27323440", "istaxableparcel": "true", "propertylocation": "3762 CLARINGTON AVE  LOS ANGELES CA  90034", "units": "116", "sqftmain": "130693", "roll_totalvalue": "38012236", "situszip5": "90034", "center_lat": "34.02322471"}, {"bedrooms": "99", "bathrooms": "99", "effectiveyearbuilt": "2006", "roll_landbaseyear": "2007", "roll_totlandimp": "36358593", "nettaxablevalue": "36370757", "center_lon": "-118.40032195", "roll_landvalue": "10214846", "usecodedescchar1": "Residential", "usetype": "R-I", "yearbuiltTS": "1136073600000", "yearbuilt": "2006", "roll_impvalue": "26143747", "istaxableparcel": "true", "propertylocation": "3762 CLARINGTON AVE  LOS ANGELES CA  90034", "units": "116", "sqftmain": "130693", "roll_totalvalue": "36370757", "situszip5": "90034", "center_lat": "34.02322471"}]`;

export const parsedFields = [
  {name: 'bedrooms', format: '', tableFieldIndex: 1, type: 'integer', analyzerType: 'INT'},
  {name: 'bathrooms', format: '', tableFieldIndex: 2, type: 'integer', analyzerType: 'INT'},
  {
    name: 'effectiveyearbuilt',
    format: '',
    tableFieldIndex: 3,
    type: 'integer',
    analyzerType: 'INT'
  },
  {name: 'roll_landbaseyear', format: '', tableFieldIndex: 4, type: 'integer', analyzerType: 'INT'},
  {name: 'roll_totlandimp', format: '', tableFieldIndex: 5, type: 'integer', analyzerType: 'INT'},
  {name: 'nettaxablevalue', format: '', tableFieldIndex: 6, type: 'integer', analyzerType: 'INT'},
  {name: 'center_lon', format: '', tableFieldIndex: 7, type: 'real', analyzerType: 'FLOAT'},
  {name: 'roll_landvalue', format: '', tableFieldIndex: 8, type: 'integer', analyzerType: 'INT'},
  {
    name: 'usecodedescchar1',
    format: '',
    tableFieldIndex: 9,
    type: 'string',
    analyzerType: 'STRING'
  },
  {name: 'usetype', format: '', tableFieldIndex: 10, type: 'string', analyzerType: 'STRING'},
  {name: 'yearbuiltTS', format: 'X', tableFieldIndex: 11, type: 'timestamp', analyzerType: 'TIME'},
  {name: 'yearbuilt', format: '', tableFieldIndex: 12, type: 'integer', analyzerType: 'INT'},
  {name: 'roll_impvalue', format: '', tableFieldIndex: 13, type: 'integer', analyzerType: 'INT'},
  {
    name: 'istaxableparcel',
    format: '',
    tableFieldIndex: 14,
    type: 'boolean',
    analyzerType: 'BOOLEAN'
  },
  {
    name: 'propertylocation',
    format: '',
    tableFieldIndex: 15,
    type: 'string',
    analyzerType: 'STRING'
  },
  {name: 'units', format: '', tableFieldIndex: 16, type: 'integer', analyzerType: 'INT'},
  {name: 'sqftmain', format: '', tableFieldIndex: 17, type: 'integer', analyzerType: 'INT'},
  {name: 'roll_totalvalue', format: '', tableFieldIndex: 18, type: 'integer', analyzerType: 'INT'},
  {name: 'situszip5', format: '', tableFieldIndex: 19, type: 'integer', analyzerType: 'INT'},
  {name: 'center_lat', format: '', tableFieldIndex: 20, type: 'real', analyzerType: 'FLOAT'}
];

export const parsedRows = [
  [
    null,
    NaN,
    null,
    NaN,
    37827477,
    37827477,
    -118.40032195,
    10627524,
    'Residential',
    'R-I',
    1136073600000,
    2006,
    27199953,
    true,
    '3762 CLARINGTON AVE  LOS ANGELES CA  90034',
    116,
    130693,
    37827477,
    90034,
    34.02322471
  ],
  [
    99,
    99,
    2006,
    2007,
    37085763,
    37097927,
    -118.40032195,
    10419142,
    'Residential',
    'R-I',
    1136073600000,
    2006,
    26666621,
    true,
    '3762 CLARINGTON AVE  LOS ANGELES CA  90034',
    116,
    130693,
    37097927,
    90034,
    34.02322471
  ],
  [
    99,
    99,
    2006,
    2007,
    35463324,
    35463324,
    -118.40032195,
    9963324,
    'Residential',
    'R-I',
    1136073600000,
    2006,
    25500000,
    true,
    '3762 CLARINGTON AVE  LOS ANGELES CA  90034',
    116,
    130693,
    35463324,
    90034,
    34.02322471
  ],
  [
    99,
    99,
    2006,
    2007,
    36172590,
    36172590,
    -118.40032195,
    10162590,
    'Residential',
    'R-I',
    1136073600000,
    2006,
    26010000,
    true,
    '3762 CLARINGTON AVE  LOS ANGELES CA  90034',
    116,
    130693,
    36172590,
    90034,
    34.02322471
  ],
  [
    99,
    99,
    2006,
    2007,
    38758435,
    38775032,
    -118.40032195,
    10889073,
    'Residential',
    'R-I',
    1136073600000,
    2006,
    27869362,
    true,
    '3762 CLARINGTON AVE  LOS ANGELES CA  90034',
    116,
    130693,
    38775032,
    90034,
    34.02322471
  ],
  [
    99,
    99,
    2006,
    2007,
    36086860,
    36092822,
    -118.40032195,
    10138504,
    'Residential',
    'R-I',
    1136073600000,
    2006,
    25948356,
    true,
    '3762 CLARINGTON AVE  LOS ANGELES CA  90034',
    116,
    130693,
    36092822,
    90034,
    34.02322471
  ],
  [
    99,
    99,
    2006,
    2007,
    37999212,
    38012236,
    -118.40032195,
    10675772,
    'Residential',
    'R-I',
    1136073600000,
    2006,
    27323440,
    true,
    '3762 CLARINGTON AVE  LOS ANGELES CA  90034',
    116,
    130693,
    38012236,
    90034,
    34.02322471
  ],
  [
    99,
    99,
    2006,
    2007,
    36358593,
    36370757,
    -118.40032195,
    10214846,
    'Residential',
    'R-I',
    1136073600000,
    2006,
    26143747,
    true,
    '3762 CLARINGTON AVE  LOS ANGELES CA  90034',
    116,
    130693,
    36370757,
    90034,
    34.02322471
  ]
];

export default data;

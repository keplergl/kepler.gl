// Copyright (c) 2021 Uber Technologies, Inc.
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

/**
 *
 * Great tool to create color palette
 * http://www.perbang.dk/rgbgradient/
 */

export const SEQ = 'sequential';
export const SIN = 'singlehue';
export const QUA = 'qualitative';
export const DIV = 'diverging';

export const DataVizColors = {
  aqua: '#12939A',
  tumbleweed: '#DDB27C',
  mule_fawn: '#88572C',
  tree_poppy: '#FF991F',
  flame: '#F15C17',
  sapphire: '#223F9A',
  orchid: '#DA70BF',
  chathams_blue: '#125C77',
  med_aquamarine: '#4DC19C',
  crocodile: '#776E57',
  java: '#17B8BE',
  chalky: '#F6D18A',
  light_taupe: '#B7885E',
  peach_orange: '#FFCB99',
  apricot: '#F89570',
  portage: '#829AE3',
  light_orchid: '#E79FD5',
  blue_green: '#1E96BE',
  bermuda: '#89DAC1',
  cloudy: '#B3AD9E'
};

const quaColors = Object.values(DataVizColors);

const qualitativeColors = [
  {
    name: 'Uber Viz Qualitative 0',
    type: QUA,
    category: 'Uber',
    colors: quaColors.slice(0, 3)
  },
  {
    name: 'Uber Viz Qualitative 0.5',
    type: QUA,
    category: 'Uber',
    colors: quaColors.slice(0, 4)
  },
  {
    name: 'Uber Viz Qualitative 1',
    type: QUA,
    category: 'Uber',
    colors: quaColors.slice(0, 5)
  },
  {
    name: 'Uber Viz Qualitative 1.2',
    type: QUA,
    category: 'Uber',
    colors: quaColors.slice(0, 6)
  },
  {
    name: 'Uber Viz Qualitative 1.4',
    type: QUA,
    category: 'Uber',
    colors: quaColors.slice(0, 7)
  },
  {
    name: 'Uber Viz Qualitative 1.6',
    type: QUA,
    category: 'Uber',
    colors: quaColors.slice(0, 8)
  },
  {
    name: 'Uber Viz Qualitative 1.8',
    type: QUA,
    category: 'Uber',
    colors: quaColors.slice(0, 9)
  },
  {
    name: 'Uber Viz Qualitative 2',
    type: QUA,
    category: 'Uber',
    colors: quaColors.slice(0, 10)
  },
  {
    name: 'Uber Viz Qualitative 3',
    type: QUA,
    category: 'Uber',
    colors: quaColors.slice(0, 15)
  },
  {
    name: 'Uber Viz Qualitative 4',
    type: QUA,
    category: 'Uber',
    colors: quaColors.slice(0, 20)
  }
];

const sequantialColors = [
  {
    name: 'Uber Viz Sequential 1',
    type: SEQ,
    category: 'Uber',
    colors: ['#E6FAFA', '#89C6CA', '#00939C']
  },
  {
    name: 'Uber Viz Sequential 2',
    type: SEQ,
    category: 'Uber',
    colors: ['#E6FAFA', '#AAD7DA', '#68B4BB', '#00939C']
  },
  {
    name: 'Uber Viz Sequential 3',
    type: SEQ,
    category: 'Uber',
    colors: ['#E6FAFA', '#B8E0E1', '#89C6CA', '#56ACB3', '#00939C']
  },
  {
    name: 'Uber Viz Sequential 4',
    type: SEQ,
    category: 'Uber',
    colors: ['#E6FAFA', '#C1E5E6', '#9DD0D4', '#75BBC1', '#4BA7AF', '#00939C']
  },
  {
    name: 'Uber Viz Sequential 5',
    type: SEQ,
    category: 'Uber',
    colors: ['#E6FAFA', '#C1E5E6', '#9DD0D4', '#75BBC1', '#4BA7AF', '#00939C', '#108188']
  },
  {
    name: 'Uber Viz Sequential 6',
    type: SEQ,
    category: 'Uber',
    colors: ['#E6FAFA', '#C1E5E6', '#9DD0D4', '#75BBC1', '#4BA7AF', '#00939C', '#108188', '#0E7077']
  }
];

const divergingColors = [
  {
    name: 'Uber Viz Diverging 0',
    type: DIV,
    category: 'Uber',
    colors: ['#C22E00', '#FEEEE8', '#00939C'].reverse()
  },
  {
    name: 'Uber Viz Diverging 0.5',
    type: DIV,
    category: 'Uber',
    colors: ['#C22E00', '#EFBEAE', '#A2D4D7', '#00939C'].reverse()
  },
  {
    name: 'Uber Viz Diverging 1',
    type: DIV,
    category: 'Uber',
    colors: ['#C22E00', '#EC9370', '#FEEEE8', '#85C4C8', '#00939C'].reverse()
  },
  {
    name: 'Uber Viz Diverging 1.5',
    type: DIV,
    category: 'Uber',
    colors: ['#C22E00', '#DD7755', '#F8C0AA', '#BAE1E2', '#5DBABF', '#00939C'].reverse()
  },
  {
    name: 'Uber Viz Diverging 2',
    type: DIV,
    category: 'Uber',
    colors: ['#C22E00', '#E17449', '#F5B097', '#FEEEE8', '#A2D4D7', '#65B3BA', '#00939C'].reverse()
  },
  {
    name: 'Uber Viz Diverging 2.5',
    type: DIV,
    category: 'Uber',
    colors: [
      '#C22E00',
      '#D45F39',
      '#E68F71',
      '#F8C0AA',
      '#BAE1E2',
      '#7CC7CB',
      '#3EADB3',
      '#00939C'
    ].reverse()
  },
  {
    name: 'Uber Viz Diverging 3',
    type: DIV,
    category: 'Uber',
    colors: [
      '#C22E00',
      '#DA6436',
      '#EC9370',
      '#F8C0AA',
      '#FEEEE8',
      '#B2DCDF',
      '#65B3BA',
      '#49A6AE',
      '#00939C'
    ].reverse()
  },
  {
    name: 'Uber Viz Diverging 3.5',
    type: DIV,
    category: 'Uber',
    colors: [
      '#C22E00',
      '#D0532B',
      '#DD7755',
      '#EB9C80',
      '#F8C0AA',
      '#BAE1E2',
      '#8CCED1',
      '#5DBABF',
      '#2FA7AE',
      '#00939C'
    ].reverse()
  },
  {
    name: 'Uber Viz Diverging 4',
    type: DIV,
    category: 'Uber',
    colors: [
      '#C22E00',
      '#D55A2B',
      '#E68059',
      '#F2A587',
      '#F8C0AA',
      '#FEEEE8',
      '#BAE1E2',
      '#97CED1',
      '#71BABF',
      '#49A6AE',
      '#00939C'
    ].reverse()
  }
];

const customPalette = [
  {
    name: 'UberPool',
    type: DIV,
    category: 'Uber',
    colors: [
      '#223F9A',
      '#2C51BE',
      '#482BBD',
      '#7A0DA6',
      '#AE0E7F',
      '#CF1750',
      '#E31A1A',
      '#FD7900',
      '#FAC200',
      '#FAE300'
    ]
  },
  {
    name: 'UberPool 9',
    type: DIV,
    category: 'Uber',
    colors: [
      '#2C51BE',
      '#482BBD',
      '#7A0DA6',
      '#AE0E7F',
      '#CF1750',
      '#E31A1A',
      '#FD7900',
      '#FAC200',
      '#FAE300'
    ]
  },
  {
    name: 'UberPool 8',
    type: DIV,
    category: 'Uber',
    colors: ['#213E9A', '#3C1FA7', '#811CB5', '#C318B0', '#D01367', '#DE0F0E', '#EC7007', '#F9E200']
  },
  {
    name: 'UberPool 7',
    type: DIV,
    category: 'Uber',
    colors: ['#213E9A', '#461FA9', '#9B1BBA', '#CA168E', '#DA102C', '#E95E08', '#F9E200']
  },
  {
    name: 'UberPool 6',
    type: DIV,
    category: 'Uber',
    colors: ['#213E9A', '#551EAD', '#C019BD', '#D31256', '#E6470A', '#F9E200']
  },
  {
    name: 'UberPool 5',
    type: DIV,
    category: 'Uber',
    colors: ['#213E9A', '#6E1DB2', '#CA168E', '#E2260C', '#F9E200']
  },
  {
    name: 'UberPool 4',
    type: DIV,
    category: 'Uber',
    colors: ['#213E9A', '#9B1BBA', '#DA102C', '#F9E200']
  },
  {
    name: 'UberPool 3',
    type: DIV,
    category: 'Uber',
    colors: ['#213E9A', '#CA168E', '#F9E200']
  },
  {
    name: 'Ice And Fire 3',
    type: DIV,
    category: 'Uber',
    colors: ['#0198BD', '#FAFEB3', '#D50255']
  },
  {
    name: 'Ice And Fire 4',
    type: DIV,
    category: 'Uber',
    colors: ['#0198BD', '#E8FEB5', '#FEAD54', '#D50255']
  },
  {
    name: 'Ice And Fire 5',
    type: DIV,
    category: 'Uber',
    colors: ['#0198BD', '#49E3CE', '#FAFEB3', '#FEAD54', '#D50255']
  },
  {
    name: 'Ice And Fire',
    type: DIV,
    category: 'Uber',
    colors: ['#0198BD', '#49E3CE', '#E8FEB5', '#FEEDB1', '#FEAD54', '#D50255']
  },
  {
    name: 'Ice And Fire 7',
    type: DIV,
    category: 'Uber',
    colors: ['#0198BD', '#54BAB9', '#A7DCB6', '#FAFEB3', '#FCD583', '#FEAD54', '#D50255']
  },
  {
    name: 'Ice And Fire 8',
    type: DIV,
    category: 'Uber',
    colors: ['#007A99', '#0198BD', '#49E3CE', '#E8FEB5', '#FEEDB1', '#FEAD54', '#D50255', '#7F1941']
  },
  {
    name: 'Global Warming 3',
    type: SEQ,
    category: 'Uber',
    colors: ['#5A1846', '#C70039', '#FFC300']
  },
  {
    name: 'Global Warming 4',
    type: SEQ,
    category: 'Uber',
    colors: ['#5A1846', '#831A3D', '#E3611C', '#FFC300']
  },
  {
    name: 'Global Warming 5',
    type: SEQ,
    category: 'Uber',
    colors: ['#5A1846', '#831A3D', '#AC1C17', '#D55D0E', '#FFC300']
  },
  {
    name: 'Global Warming',
    type: SEQ,
    category: 'Uber',
    colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
  },
  {
    name: 'Global Warming 7',
    type: SEQ,
    category: 'Uber',
    colors: ['#5A1846', '#751A43', '#911932', '#AC1C17', '#C84411', '#E37B0A', '#FFC300']
  },
  {
    name: 'Global Warming 8',
    type: SEQ,
    category: 'Uber',
    colors: ['#4C0035', '#650031', '#7F0023', '#98000A', '#B21800', '#CB4600', '#E57F00', '#FFC300']
  },
  {
    name: 'Sunrise 3',
    type: SEQ,
    category: 'Uber',
    colors: ['#355C7D', '#C06C84', '#F8B195']
  },
  {
    name: 'Sunrise 4',
    type: SEQ,
    category: 'Uber',
    colors: ['#355C7D', '#9A627C', '#C86A7E', '#F8B195']
  },
  {
    name: 'Sunrise',
    type: SEQ,
    category: 'Uber',
    colors: ['#355C7D', '#6C5B7B', '#C06C84', '#F67280', '#F8B195']
  },
  {
    name: 'Sunrise 6',
    type: SEQ,
    category: 'Uber',
    colors: ['#355C7D', '#63617F', '#916681', '#D88185', '#E8998D', '#F8B195']
  },
  {
    name: 'Sunrise 7',
    type: SEQ,
    category: 'Uber',
    colors: ['#355C7D', '#63617F', '#916681', '#C06C84', '#D28389', '#E59A8F', '#F8B195']
  },
  {
    name: 'Sunrise 8',
    type: SEQ,
    category: 'Uber',
    colors: ['#194266', '#355C7D', '#63617F', '#916681', '#C06C84', '#D28389', '#E59A8F', '#F8B195']
  },
  {
    name: 'Ocean Green 3',
    type: SEQ,
    category: 'Uber',
    colors: ['#3A748A', '#3EACA8', '#E5EEc1']
  },
  {
    name: 'Ocean Green 4',
    type: SEQ,
    category: 'Uber',
    colors: ['#547A82', '#3EACA8', '#A2D4AB', '#E5EEc1']
  },
  {
    name: 'Ocean Green 5',
    type: SEQ,
    category: 'Uber',
    colors: ['#3A748A', '#54A38F', '#73BC84', '#A9D597', '#E5EEc1']
  },
  {
    name: 'Ocean Green 6',
    type: SEQ,
    category: 'Uber',
    colors: ['#37535E', '#3A748A', '#4095B5', '#52AEC9', '#72BFC4', '#93CFBF']
  },
  {
    name: 'Ocean Green 7',
    type: SEQ,
    category: 'Uber',
    colors: ['#3A748A', '#4B9A95', '#5EAB8B', '#73BC84', '#92CC8B', '#BEDDA5', '#E5EEc1']
  },
  {
    name: 'Ocean Green 8',
    type: SEQ,
    category: 'Uber',
    colors: ['#37535E', '#3A748A', '#4B9A95', '#5EAB8B', '#73BC84', '#92CC8B', '#BEDDA5', '#E5EEc1']
  },
  {
    name: 'Pink Wine 3',
    type: SEQ,
    category: 'Uber',
    colors: ['#50315E', '#956485', '#EDD1CA']
  },
  {
    name: 'Pink Wine 4',
    type: SEQ,
    category: 'Uber',
    colors: ['#50315E', '#774976', '#B28294', '#EDD1CA']
  },
  {
    name: 'Pink Wine 5',
    type: SEQ,
    category: 'Uber',
    colors: ['#50315E', '#643D68', '#956485', '#C1939D', '#EDD1CA']
  },
  {
    name: 'Pink Wine 6',
    type: SEQ,
    category: 'Uber',
    colors: ['#2C1E3D', '#573660', '#83537C', '#A6758E', '#C99DA4', '#EDD1CA']
  },
  {
    name: 'Pink Wine 7',
    type: SEQ,
    category: 'Uber',
    colors: ['#2C1E3D', '#4F315A', '#774976', '#956485', '#B28294', '#CFA4A8', '#EDD1CA']
  },
  {
    name: 'Pink Wine',
    type: SEQ,
    category: 'Uber',
    colors: ['#2C1E3D', '#50315E', '#764476', '#9A5B88', '#B77495', '#CF91A3', '#E0B1B3', '#EDD1CA']
  },
  {
    name: 'Purple Blue Yellow 3',
    type: SEQ,
    category: 'Uber',
    colors: ['#2B1E3E', '#5EA28D', '#D6DEBF']
  },
  {
    name: 'Purple Blue Yellow 4',
    type: SEQ,
    category: 'Uber',
    colors: ['#2B1E3E', '#466373', '#7BA889', '#D6DEBF']
  },
  {
    name: 'Purple Blue Yellow 5',
    type: SEQ,
    category: 'Uber',
    colors: ['#2B1E3E', '#3A4B66', '#5F8E86', '#8BB68D', '#D6DEBF']
  },
  {
    name: 'Purple Blue Yellow 6',
    type: SEQ,
    category: 'Uber',
    colors: ['#2B1E3E', '#343D5E', '#4F777E', '#709E87', '#99BE95', '#D6DEBF']
  },
  {
    name: 'Purple Blue Yellow 7',
    type: SEQ,
    category: 'Uber',
    colors: ['#2B1E3E', '#303558', '#466373', '#5F8E86', '#7BA889', '#A4C39B', '#D6DEBF']
  },
  {
    name: 'Purple Blue Yellow',
    type: SEQ,
    category: 'Uber',
    colors: ['#2B1E3E', '#383C65', '#3E5F7E', '#49838A', '#5EA28D', '#82BB92', '#AECEA1', '#D6DEBF']
  }
];

export const VizColorPalette = [
  ...divergingColors,
  ...sequantialColors,
  ...qualitativeColors,
  ...customPalette
];

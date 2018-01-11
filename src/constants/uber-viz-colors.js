import UberColors from './uber-colors';

export const SEQ = 'sequential';
export const QUA = 'qualitative';
export const DIV = 'diverging';

export const uberDataVizColors = {
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

const quaColors = Object.values(uberDataVizColors);

const qualitativeColors = [
  {
    name: 'Uber Viz Qualitative 1',
    type: QUA,
    category: 'Uber',
    colors: quaColors.slice(0, 5)
  }, {
    name: 'Uber Viz Qualitative 2',
    type: QUA,
    category: 'Uber',
    colors: quaColors.slice(0, 10)
  }, {
    name: 'Uber Viz Qualitative 3',
    type: QUA,
    category: 'Uber',
    colors: quaColors.slice(0, 15)
  }, {
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
    colors: [
      '#E6FAFA',
      '#89C6CA',
      '#00939C'
    ]
  }, {
    name: 'Uber Viz Sequential 2',
    type: SEQ,
    category: 'Uber',
    colors: [
      '#E6FAFA',
      '#AAD7DA',
      '#68B4BB',
      '#00939C'
    ]
  }, {
    name: 'Uber Viz Sequential 3',
    type: SEQ,
    category: 'Uber',
    colors: [
      '#E6FAFA',
      '#B8E0E1',
      '#89C6CA',
      '#56ACB3',
      '#00939C'
    ]
  }, {
    name: 'Uber Viz Sequential 4',
    type: SEQ,
    category: 'Uber',
    colors: [
      '#E6FAFA',
      '#C1E5E6',
      '#9DD0D4',
      '#75BBC1',
      '#4BA7AF',
      '#00939C'
    ]
  }
];

const divergingColors = [
  {
    name: 'Uber Viz Diverging 1',
    type: DIV,
    category: 'Uber',
    colors: [
      '#C22E00',
      '#EC9370',
      '#FEEEE8',
      '#85C4C8',
      '#00939C'
    ].reverse()
  }, {
    name: 'Uber Viz Diverging 2',
    type: DIV,
    category: 'Uber',
    colors: [
      '#C22E00',
      '#E17449',
      '#F5B097',
      '#FEEEE8',
      '#A2D4D7',
      '#65B3BA',
      '#00939C'
    ].reverse()
  }, {
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
  }, {
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

const customPalette = [{
  name: 'UberPool',
  type: DIV,
  category: 'Uber',
  colors: ['blue_9', 'navy_9',
    'indigo_8', 'purple_9', 'violet_9', 'magenta_9',
    'red_7', 'orange_8', 'gold_9', 'yellow_9']
    .map(k => UberColors[k])
}, {
  name: 'Ice And Fire',
  type: DIV,
  category: 'Uber',
  colors: [
    '#0198BD',
    '#49E3CE',
    '#E8FEB5',
    '#FEEDB1',
    '#FEAD54',
    '#D50255'
  ]
}, {
  name: 'Global Warming',
  type: SEQ,
  category: 'Uber',
  colors: [
    '#5A1846',
    '#900C3F',
    '#C70039',
    '#E3611C',
    '#F1920E',
    '#FFC300'
  ]
}, {
  name: 'Sunrise',
  type: SEQ,
  category: 'Uber',
  colors: [
    '#355C7D',
    '#6C5B7B',
    '#C06C84',
    '#F67280',
    '#F8B195'
  ]
}, {
  name: 'Ocean Green 4',
  type: SEQ,
  category: 'Uber',
  colors: [
    '#547A82',
    '#3EACA8',
    '#A2D4AB',
    '#E5EEc1'
  ]
}, {
  name: 'Ocean Green 6',
  type: SEQ,
  category: 'Uber',
  colors: [
    '#37535E',
    '#3A748A',
    '#4095B5',
    '#52AEC9',
    '#72BFC4',
    '#93CFBF'
  ]
}, {
  name: 'Pink Wine',
  type: SEQ,
  category: 'Uber',
  colors: [
    '#2C1E3D',
    '#50315E',
    '#764476',
    '#9A5B88',
    '#B77495',
    '#CF91A3',
    '#E0B1B3',
    '#EDD1CA'
  ]
}, {
  name: 'Purple Blue Yellow',
  type: SEQ,
  category: 'Uber',
  colors: [
    '#2B1E3E',
    '#383C65',
    '#3E5F7E',
    '#49838A',
    '#5EA28D',
    '#82BB92',
    '#AECEA1',
    '#D6DEBF'
  ]
}];

export const UberVizColorPalette = [
  ...divergingColors,
  ...sequantialColors,
  ...qualitativeColors,
  ...customPalette
];

export const defaultUberColorRange = UberVizColorPalette
  .find(({name}) => name === 'Global Warming');

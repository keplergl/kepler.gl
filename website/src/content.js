import {cdnUrl} from './utils';
import {VIDEO_TYPES} from './constants';

export const SECTIONS = [
  {
    id: 'showcase',
    title: 'Map Enthusiast?',
    description: 'Make beautiful data-driven maps.',
    icon: cdnUrl('icons/showcase.png')
  },
  {
    id: 'walkthrough',
    title: 'Data Scientist?',
    description:
      'Gain insights from location data and deliver business outcomes.',
    icon: cdnUrl('icons/walkthrough.png'),
    isDark: true
  },
  {
    id: 'features',
    title: 'Software Engineer?',
    description:
      'A customizable geospatial toolbox to help make data-driven decisions.',
    icon: cdnUrl('icons/features.png')
  },
  {
    id: 'examples',
    title: 'See What People Created',
    description: 'See what others have been creating with Kepler.gl.',
    icon: cdnUrl('icons/examples.png'),
    background: cdnUrl('examples/section-background.png')
  },
  {
    id: 'tutorials',
    title: 'Getting Started',
    description: 'Get started with tutorials created by our team.',
    icon: cdnUrl('icons/tutorials.png')
  }
];

export const HERO_IMAGES = [
  cdnUrl('hero/kepler.gl-hexagon.png'),
  cdnUrl('hero/kepler.gl-points.png'),
  cdnUrl('hero/kepler.gl-contours.png')
];

export const HERO_IMAGES_SCALED = [
  cdnUrl('hero/kepler.gl-hexagon_s.png'),
  cdnUrl('hero/kepler.gl-points_s.png'),
  cdnUrl('hero/kepler.gl-contours_s.png')
];

export const SHOWCASE_ITEMS = [
  {
    text: 'Arc',
    image: cdnUrl('showcase/arcs-s.png'),
    icon: cdnUrl('showcase/icons/arc.png')
  },
  {
    text: 'Line',
    image: cdnUrl('showcase/lines-s.png'),
    icon: cdnUrl('showcase/icons/line.png')
  },
  {
    text: 'Hexagon',
    image: cdnUrl('showcase/hexagons-s.png'),
    icon: cdnUrl('showcase/icons/hexagon.png')
  },
  {
    text: 'Point',
    image: cdnUrl('showcase/points-s.png'),
    icon: cdnUrl('showcase/icons/point.png')
  },
  // {
  //   text: 'H3',
  //   image: cdnUrl('showcase/h3.png'),
  //   icon: cdnUrl('showcase/icons/h3.png')
  // },
  {
    text: 'Heatmap',
    image: cdnUrl('showcase/heatmap-s.png'),
    icon: cdnUrl('showcase/icons/heatmap.png')
  },
  {
    text: 'GeoJSON',
    image: cdnUrl('showcase/geojson-s.png'),
    icon: cdnUrl('showcase/icons/geojson.png')
  },
  {
    text: 'Buildings',
    image: cdnUrl('showcase/buildings-s.png'),
    icon: cdnUrl('showcase/icons/heatmap.png')
  }
];

export const WALKTHROUGH_ITEMS = [
  {
    videoUrl: 'https://www.youtube.com/embed/nLy3OQYsXWA',
    videoType: VIDEO_TYPES.YOUTUBE,
    description:
      'Easily import various formats of data by simplily drag and drop'
  },
  {
    videoUrl: 'https://www.youtube.com/embed/pjzCMQBqjFw',
    videoType: VIDEO_TYPES.YOUTUBE,
    description:
      'Easily import various formats of data by simplily drag and drop'
  },
  {
    videoUrl: 'https://www.youtube.com/embed/LPQGHJldEvU',
    videoType: VIDEO_TYPES.YOUTUBE,
    description:
      'Easily import various formats of data by simplily drag and drop'
  }
];

export const FEATURES = [
  {
    title: 'Performance',
    description:
      'Kepler.gl utilized the latest WebGL technologies so you can  render large datasets quickly and effeciently.',
    image: cdnUrl('showcase/points.png')
  },
  {
    title: 'Embeddable',
    description:
      'Kepler.gl is built on top of React & Redux and can be embedded within your mapping application.',
    image: cdnUrl('showcase/points.png')
  },
  {
    title: 'Ease of Use',
    description:
      'Drag and drop datasets to visualize them, and easily apply filtering, scaling, etc.',
    image: cdnUrl('showcase/points.png')
  }
];

export const EXAMPLES = [
  {
    title: 'California Earthquakes',
    description: 'Some description is needed here. This is just a placeholder',
    image: cdnUrl('examples/cali-earthquakes.png'),
    url: '#/demo/earthquakes'
  },
  {
    title: 'New York City Cab Rides',
    description: 'Some description is needed here. This is just a placeholder',
    image: cdnUrl('examples/ny-taxis.png'),
    url: '#/demo/nyctrips'
  },
  {
    title: 'San Francisco Elevation Contour',
    description: 'Some description is needed here. This is just a placeholder',
    image: cdnUrl('examples/sf-elevation.png'),
    url: '#/demo/sfcontour'
  },
  {
    title: 'New york city population',
    description: 'Some description is needed here. This is just a placeholder',
    image: cdnUrl('examples/ny-population.png'),
    url: '#/demo/nyc_census'
  },
  {
    title: 'San Francisco Street Tree Map',
    description: 'Some description is needed here. This is just a placeholder',
    image: cdnUrl('examples/sf-street-trees.png'),
    url: '#/demo/sftrees'
  },
  {
    title: 'Commute Patterns in the UK',
    description: 'Some description is needed here. This is just a placeholder',
    image: cdnUrl('examples/uk-commute.png'),
    url: '#/demo/ukcommute'
  }
];

export const TUTORIALS = [
  {
    title: 'How to create a map in 3 minutes',
    description: 'Some description is needed here. This is just a placeholder',
    image: cdnUrl('examples/earthquake.png')
  },
  {
    title: '5 tips for creating an elegant map',
    description: 'Some description is needed here. This is just a placeholder',
    image: cdnUrl('examples/earthquake.png')
  },
  {
    title: 'Bay Area forest mapping',
    description: 'Some description is needed here. This is just a placeholder',
    image: cdnUrl('examples/earthquake.png')
  }
  // {
  //   title: 'How to create a map in 3 minutes',
  //   description: 'Some description is needed here. This is just a placeholder',
  //   image: cdnUrl('examples/earthquake.png')
  // }
];

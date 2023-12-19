// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {cdnUrl} from './utils';

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
    title: 'Developer?',
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

export const HEADER_NAVS = [
  {
    text: 'User Guide',
    link: 'https://docs.kepler.gl/docs/user-guides'
  },
  {
    text: 'Documentation',
    link: 'https://docs.kepler.gl/docs/api-reference'
  },
  {
    text: 'Github',
    link: 'https://github.com/keplergl/kepler.gl'
  },
  {
    text: 'Support Policy',
    link: '/policy'
  }
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
    icon: cdnUrl('showcase/icons/cluster.png')
  }
];

export const WALKTHROUGH_ITEMS = [
  {
    videoUrl: cdnUrl('videos/0.upload_file.mp4'),
    imageUrl: cdnUrl('videos/0.upload_file.png'),
    description:
      'Easily add data to map by drag and drop files'
  },
  {
    videoUrl: cdnUrl('videos/1.time_filter.mp4'),
    imageUrl: cdnUrl('videos/1.time_filter.png'),
    description:
      'Free form filtering with time playback'
  },
  {
    videoUrl: cdnUrl('videos/2.aggregation.mp4'),
    imageUrl: cdnUrl('videos/2.aggregation.png'),
    description:
      'Gain deeper insights by performing geo aggregation'
  },
  {
    videoUrl: cdnUrl('videos/3.brushing.mp4'),
    imageUrl: cdnUrl('videos/3.brushing.png'),
    description:
      'Explore origin-destination correlations with brushing'
  }
];

export const FEATURES = [
  {
    title: 'Performance',
    description:
      'Built with Deck.gl, Kepler.gl utilizes WebGL to render large datasets quickly and efficiently.',
    image: cdnUrl('features/performance.svg')
  },
  {
    title: 'Interaction',
    description:
      'You can easily drag and drop a dataset, add filters, apply scales, and do aggregation on the fly.',
    image: cdnUrl('features/interaction.svg')
  },
  {
    title: 'Embeddable',
    description:
      'Built on React & Redux, Kepler.gl can be embedded inside your own mapping applications.',
    image: cdnUrl('features/embeddable.svg')
  }
];

export const EXAMPLES = [
  {
    title: 'California Earthquakes',
    description: 'Location, maginitude and magtype of 2.5+ magnitude earthquakes in california',
    image: cdnUrl('examples/cali-earthquakes.png'),
    url: '/demo/earthquakes'
  },
  {
    title: 'New York City Cab Rides',
    description: 'A small sample of yellow and green taxi trip records in New York City',
    image: cdnUrl('examples/ny-taxis.png'),
    url: '/demo/nyctrips'
  },
  {
    title: 'San Francisco Elevation Contour',
    description: 'Elevation contours of San Francisco mainland and Treasure Island/Yerba Island',
    image: cdnUrl('examples/sf-elevation.png'),
    url: '/demo/sfcontour'
  },
  {
    title: 'Travel Times from Uber Movement',
    description: 'Pittsburgh travel times before and during heavy inclement weather conditions',
    image: cdnUrl('examples/movement-pittsburgh.png'),
    url: '/demo/movement_pittsburgh'
  },
  {
    title: 'New york city population',
    description: 'This dataset contains the 2010 Census tract population data of NYC',
    image: cdnUrl('examples/ny-population.png'),
    url: '/demo/nyc_census'
  },
  {
    title: 'San Francisco Street Tree Map',
    description: 'A 3d hexbin density map showing every single streets in San Francisco',
    image: cdnUrl('examples/sf-street-trees.png'),
    url: '/demo/sftrees'
  },
  {
    title: 'Commute Patterns in the UK',
    description: 'A origin destination map using 3d arcs to show commute patterns of England and Wales residence',
    image: cdnUrl('examples/uk-commute.png'),
    url: '/demo/ukcommute'
  }
];

export const TUTORIALS = [
  {
    title: 'How to create a map in 3 minutes',
    description: 'Animating 40 years of California Earthquakes.',
    image: cdnUrl('examples/earthquake.png'),
    url: 'https://medium.com/vis-gl/animating-40-years-of-california-earthquakes-e4ffcdd4a289'
  },
  {
    title: 'Adding altitude to points',
    description: 'Mapping the Parisian trees.',
    image: cdnUrl('examples/parisian.png'),
    url: 'https://medium.com/vis-gl/mapping-the-parisian-trees-6dc30f6aabc7'
  },
  {
    description: 'Visualizing U.S. County Unemployment with kepler.gl',
    title: 'Making a choropleth map',
    image: cdnUrl('examples/unemployment.png'),
    url: 'https://medium.com/vis-gl/visualizing-u-s-county-unemployment-with-kepler-gl-c5f2ed31c71'
  },
  {
    title: 'Uber Movement and kepler.gl',
    description: 'Using kepler.gl and Movement data to Visualize Traffic Effects of a Rainstorm',
    image: cdnUrl('examples/movement.png'),
    url: 'https://medium.com/@uber_movement/movement-in-kepler-d00e843f464d'
  }
];

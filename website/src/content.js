// Copyright (c) 2018 Uber Technologies, Inc.
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
    videoUrl: cdnUrl('videos/0.upload_file.mp4'),
    imageUrl: cdnUrl('videos/0.upload_file.png'),
    description:
      'Easily import various formats of data by simplily drag and drop'
  },
  {
    videoUrl: cdnUrl('videos/1.time_filter.mp4'),
    imageUrl: cdnUrl('videos/1.time_filter.png'),
    description:
      'Easily import various formats of data by simplily drag and drop'
  },
  {
    videoUrl: cdnUrl('videos/2.aggregation.mp4'),
    imageUrl: cdnUrl('videos/2.aggregation.png'),
    description:
      'Easily import various formats of data by simplily drag and drop'
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
    url: '#/demo/earthquakes'
  },
  {
    title: 'New York City Cab Rides',
    description: 'A small sample of yellow and green taxi trip records in New York City',
    image: cdnUrl('examples/ny-taxis.png'),
    url: '#/demo/nyctrips'
  },
  {
    title: 'San Francisco Elevation Contour',
    description: 'Elevation contours of San Francisco mainland and Treasure Island/Yerba Island',
    image: cdnUrl('examples/sf-elevation.png'),
    url: '#/demo/sfcontour'
  },
  {
    title: 'Travel Times from Uber Movement',
    description: 'Pittsburgh travel times before and during heavy inclement weather conditions',
    image: cdnUrl('examples/movement-pittsburgh.png'),
    url: '#/demo/movement_pittsburgh'
  },
  {
    title: 'New york city population',
    description: 'This dataset contains the 2010 Census tract population data of NYC',
    image: cdnUrl('examples/ny-population.png'),
    url: '#/demo/nyc_census'
  },
  {
    title: 'San Francisco Street Tree Map',
    description: 'A 3d hexbin density map showing every single streets in San Francisco',
    image: cdnUrl('examples/sf-street-trees.png'),
    url: '#/demo/sftrees'
  },
  {
    title: 'Commute Patterns in the UK',
    description: 'A origin destination map using 3d arcs to show commute patterns of England and Wales residence',
    image: cdnUrl('examples/uk-commute.png'),
    url: '#/demo/ukcommute'
  }
];

export const TUTORIALS = [
  {
    title: 'How to create a map in 3 minutes',
    description: 'Some description is needed here. This is just a placeholder',
    image: cdnUrl('examples/earthquake.png'),
    url: '<placeholder>'
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

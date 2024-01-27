// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const resolve = require('path').resolve;

const DOCS = require('../docs/table-of-contents.json');
const DEPENDENCIES = require('./package.json').dependencies;
// eslint-disable-next-line import/no-extraneous-dependencies
const ALIASES = require('ocular-dev-tools/config/ocular.config')({
  root: resolve(__dirname, '..')
}).aliases;

// When duplicating example dependencies in website, autogenerate
// aliases to ensure the website version is picked up
// NOTE: module dependencies are automatically injected
// TODO - should this be automatically done by ocular-gatsby?
const dependencyAliases = {};
for (const dependency in DEPENDENCIES) {
  dependencyAliases[dependency] = `${__dirname}/node_modules/${dependency}`;
}

const GATSBY_CONFIG = {
  plugins: [
    {
      resolve: `gatsby-theme-ocular`,
      options: {
        logLevel: 2, // Adjusts amount of debug information from ocular-gatsby

        // NOTE - we currently need custom excludes in gatsby-config.js to support multiple directories
        DOC_FOLDERS: [`${__dirname}/../docs/`],
        ROOT_FOLDER: `${__dirname}/../`,
        DIR_NAME: `${__dirname}`,

        DOCS,

        PROJECT_TYPE: 'github',

        PROJECT_NAME: 'kepler.gl',
        PROJECT_ORG: 'keplergl',
        PROJECT_URL: 'https://github.com/kepler/kepler.gl',
        PROJECT_DESC: 'Open source exploratory geospatial data analysis',
        PATH_PREFIX: '/',

        FOOTER_LOGO: '',

        GA_TRACKING: null,

        // For showing star counts and contributors.
        // Should be like btoa('YourUsername:YourKey') and should be readonly.
        GITHUB_KEY: null,

        HOME_PATH: '/',

        HOME_HEADING: 'A powerful open source geospatial analysis tool for large-scale data sets',

        HOME_RIGHT: null,

        HOME_BULLETS: [
          {
            text: 'Performance',
            desc: 'Built with deck.gl, kepler.gl utilizes WebGL to render large datasets quickly and efficiently.',
            img: 'images/icon-high-precision.svg'
            // TODO image: cdnUrl('features/performance.svg')
          },
          {
            text: 'Interaction',
            desc:
              'You can easily drag and drop a dataset, add filters, apply scales, and do aggregation on the fly.',
            // TODO image: cdnUrl('features/interaction.svg')
            img: 'images/icon-high-precision.svg'
          },
          {
            text: 'Embeddable',
            desc:
              'Built on React & Redux, Kepler.gl can be embedded inside your own mapping applications.',
            // TODO image: cdnUrl('features/embeddable.svg')
            img: 'images/icon-high-precision.svg'
          }
        ],

        PROJECTS: [
          {
            name: 'deck.gl',
            url: 'https://deck.gl'
          },
          {
            name: 'luma.gl',
            url: 'https://luma.gl'
          },
          {
            name: 'react-map-gl',
            url: 'https://visgl.github.io/react-map-gl'
          },
          {
            name: 'nebula.gl',
            url: 'https://nebula.gl/'
          }
        ],

        LINK_TO_GET_STARTED: 'docs/developer-guide/get-started',

        ADDITIONAL_LINKS: [],

        INDEX_PAGE_URL: resolve(__dirname, './templates/index.jsx'),

        EXAMPLES: [
          // {
          //   title: '3D Tiles',
          //   image: 'images/example-3d-tiles.png',
          //   componentUrl: resolve(__dirname, '../examples/deck.gl/3d-tiles/app.js'),
          //   path: 'examples/3d-tiles'
          // },
        ],

        // Ocular adds this to gatsby's webpack config
        webpack: {
          resolve: {
            alias: Object.assign({}, ALIASES, dependencyAliases, {})
          }
        }
      }
    },
    // {resolve: 'gatsby-plugin-no-sourcemaps'}
  ]
};

module.exports = GATSBY_CONFIG;

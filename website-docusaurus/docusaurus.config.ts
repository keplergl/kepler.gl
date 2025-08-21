import path from 'path';
import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'kepler.gl',
  tagline:
    'Kepler.gl is a powerful open source geospatial analysis tool for large-scale data sets.',
  favicon: 'img/favicon.png',
  future: {
    v4: true // Improve compatibility with the upcoming Docusaurus v4
  },
  url: 'https://kepler.gl',
  baseUrl: process.env.STAGING ? '/kepler.gl/' : '/',
  organizationName: 'keplergl',
  projectName: 'kepler.gl',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  trailingSlash: false,
  i18n: {
    defaultLocale: 'en',
    locales: ['en']
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: '../docs',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/keplergl/kepler.gl/tree/master/website-docusaurus/',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex]
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true
          },
          editUrl: 'https://github.com/keplergl/kepler.gl/tree/master/website-docusaurus/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn'
        },
        theme: {
          customCss: './src/css/custom.css'
        }
      }
    ]
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Kepler.GL',
      logo: {
        alt: 'kepler.gl logo',
        src: 'img/favicon.png',
        srcDark: 'img/favicon.png'
      },
      items: [
        {to: 'https://medium.com/vis-gl', label: 'Blog', position: 'left'},
        {to: '/docs/user-guides', label: 'User Guide', position: 'left'},
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentation'
        },
        {
          href: 'https://kepler.gl/policy',
          label: 'Support Policy',
          position: 'right'
        },
        {
          href: 'https://github.com/keplergl/kepler.gl',
          label: 'GitHub',
          position: 'right'
        }
      ]
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Resources',
          items: [
            {
              label: 'API Reference',
              to: '/docs/api-reference/core/deck'
            },
            {
              label: 'Starter templates',
              href: 'https://github.com/visgl/deck.gl/tree/master/examples/get-started'
            },
            {
              label: 'Playground',
              href: '/playground'
            },
            {
              label: 'Codepen demos',
              href: 'https://codepen.io/vis-gl/'
            }
          ]
        },
        {
          title: 'Other vis.gl Libraries',
          items: [
            {
              label: 'deck.gl',
              href: 'https://visgl.github.io/deck.gl/'
            },
            {
              label: 'deck.gl-community',
              href: 'https://visgl.github.io/deck.gl-community/'
            },
            {
              label: 'luma.gl',
              href: 'https://luma.gl'
            },
            {
              label: 'loaders.gl',
              href: 'https://loaders.gl'
            },
            {
              label: 'react-map-gl',
              href: 'https://visgl.github.io/react-map-gl'
            }
          ]
        },
        {
          title: 'More',
          items: [
            {
              label: 'Slack workspace',
              href: 'https://join.slack.com/t/deckgl/shared_invite/zt-7oeoqie8-NQqzSp5SLTFMDeNSPxi7eg'
            },
            {
              label: 'vis.gl blog on Medium',
              href: 'https://medium.com/vis-gl'
            },
            {
              label: 'GitHub',
              href: 'https://github.com/keplergl/kepler.gl'
            }
          ]
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} OpenJS Foundation`
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark
    }
  },
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css',
      type: 'text/css',
      integrity: 'sha384-nB0miv6/jRmo5UMMR1wu3Gz6NLsoTkbqJghGIsx//Rlm+ZU03BU6SQNC66uf4l5+',
      crossorigin: 'anonymous'
    }
  ]
};

export default config;

// Copyright (c) 2019 Uber Technologies, Inc.
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

import React, {useEffect, useState, useRef} from 'react';
const ReactHelmet = require('react-helmet');
const Helmet = ReactHelmet ? ReactHelmet.Helmet : null;

import {
  SidebarFactory,
  AddDataButtonFactory,
  PanelHeaderFactory,
  injectComponents
} from 'kepler.gl/components';

import CustomPanelHeaderFactory from './panel-header';
import CustomSidebarFactory from './side-bar';

const CustomAddDataButtonFactory = () => {
  const CustomAddDataButton = () => <div />;
  return CustomAddDataButton;
};

const KeplerGl = injectComponents([
  [AddDataButtonFactory, CustomAddDataButtonFactory],
  [SidebarFactory, CustomSidebarFactory],
  [PanelHeaderFactory, CustomPanelHeaderFactory]
]);

const MAPBOX_TOKEN = process.env.MapboxAccessTokenJupyter; // eslint-disable-line

function App() {
  const rootElm = useRef(null);
  const [windowDimension, setDimension] = useState({});

  const handleResize = () => {
    if (!rootElm.current) {
      return;
    }
    const {width, height} = rootElm.current.getBoundingClientRect();
    if (width !== windowDimension.width || height !== windowDimension.height) {
      setDimension({width, height});
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      style={{width: '100%', height: `100%`}}
      ref={rootElm}
      className="keplergl-widget-container"
    >
      {Helmet ? (
        <Helmet>
          <meta charSet="utf-8" />
          <title>Kepler.gl Jupyter</title>
          <link
            rel="stylesheet"
            href="http://d1a3f4spazzrp4.cloudfront.net/kepler.gl/uber-fonts/4.0.0/superfine.css"
          />
          <link
            rel="stylesheet"
            href="http://api.tiles.mapbox.com/mapbox-gl-js/v1.1.1/mapbox-gl.css"
          />
          <style type="text/css">
            {`font-family: ff-clan-web-pro, 'Helvetica Neue', Helvetica, sans-serif;
                font-weight: 400;
                font-size: 0.875em;
                line-height: 1.71429;
                *,
                *:before,
                *:after {
                  -webkit-box-sizing: border-box;
                  -moz-box-sizing: border-box;
                  box-sizing: border-box;
                }
                body {
                  margin: 0; padding: 0;
                }
                .kepler-gl .ReactModal__Overlay.ReactModal__Overlay--after-open {
                  position: absolute !important;
                }
                `}
          </style>
          <script async src="https://www.googletagmanager.com/gtag/js?id=UA-64694404-19"/>
          <script>{`
            window.dataLayer=window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'UA-64694404-19', {
              page_path: '/jupyter-notebook'
            });
          `}</script>
        </Helmet>
      ) : null}
      <KeplerGl
        mapboxApiAccessToken={MAPBOX_TOKEN}
        width={windowDimension.width || 800}
        height={windowDimension.height || 400}
        appName="Kepler.gl Jupyter"
        version="0.1.0a9"
        getMapboxRef={handleResize}
      />
    </div>
  );
}

export default App;

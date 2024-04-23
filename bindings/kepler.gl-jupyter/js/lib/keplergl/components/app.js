// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect, useState, useRef} from 'react';
import styled from 'styled-components';
const ReactHelmet = require('react-helmet');
const Helmet = ReactHelmet ? ReactHelmet.Helmet : null;

import {
  SidebarFactory,
  AddDataButtonFactory,
  PanelHeaderFactory,
  CustomPanelsFactory,
  injectComponents
} from '@kepler.gl/components';

import CustomPanelHeaderFactory from './panel-header';
import CustomSidebarFactory from './side-bar';
import CustomCustomPanelsFactory from './config-panel';
export const KEPLER_GL_JUPYTER_VERSION = '__PACKAGE_VERSION__';

const CustomAddDataButtonFactory = () => {
  const CustomAddDataButton = () => <div />;
  return CustomAddDataButton;
};

const KeplerGl = injectComponents([
  [AddDataButtonFactory, CustomAddDataButtonFactory],
  [SidebarFactory, CustomSidebarFactory],
  [PanelHeaderFactory, CustomPanelHeaderFactory],
  [CustomPanelsFactory, CustomCustomPanelsFactory]
]);

const MAPBOX_TOKEN = process.env.MapboxAccessTokenJupyter; // eslint-disable-line

const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
  .kepler-gl .ReactModal__Overlay.ReactModal__Overlay--after-open {
    position: absolute !important;
  }

  .kepler-gl .side-panel__content > div {
    display: flex;
    height: 100%;
    flex-direction: column;
  }
`;

function App() {
  const rootElm = useRef(null);
  const [windowDimension, setDimension] = useState({});

  const handleResize = () => {
    if (!rootElm.current) {
      return;
    }

    const width = rootElm.current.offsetWidth;
    const height = rootElm.current.offsetHeight;
    const dimensionToSet = {
      ...(width && width !== windowDimension.width ? {width} : {}),
      ...(height && height !== windowDimension.height ? {height} : {})
    };

    setDimension(dimensionToSet);
  };

  // in Jupyter Lab,  parent component has transition when window resize.
  // need to delay call to get the final parent width,
  const resizeDelay = () => window.setTimeout(handleResize, 500);

  useEffect(() => {
    window.addEventListener('resize', resizeDelay);
    return () => window.removeEventListener('resize', resizeDelay);
  }, []);

  return (
    <StyledContainer ref={rootElm} className="keplergl-widget-container">
      {Helmet ? (
        <Helmet>
          <meta charSet="utf-8" />
          <link
            rel="stylesheet"
            href="http://d1a3f4spazzrp4.cloudfront.net/kepler.gl/uber-fonts/4.0.0/superfine.css"
          />
          <link
            rel="stylesheet"
            href="https://unpkg.com/maplibre-gl@^3/dist/maplibre-gl.css"
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
                .jupyter-widgets.keplergl-jupyter-widgets {
                  overflow: hidden;
                }
                .p-Widget.p-Panel.jp-OutputArea-output.jupyter-widgets {
                  overflow: hidden
                }
                `}
          </style>
          <script async src="https://www.googletagmanager.com/gtag/js?id=UA-64694404-19" />
          <script>{`window.dataLayer=window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'UA-64694404-19', {page_path: '/keplergl-jupyter-widget'});`}</script>
        </Helmet>
      ) : null}
      <KeplerGl
        mapboxApiAccessToken={MAPBOX_TOKEN}
        width={windowDimension.width || 800}
        height={windowDimension.height || 400}
        appName="Kepler.gl Jupyter"
        version={KEPLER_GL_JUPYTER_VERSION}
        getMapboxRef={handleResize}
      />
    </StyledContainer>
  );
}

export default App;

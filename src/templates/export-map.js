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

export const exportMapToHTML = options => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8"/>
      <title>Kepler.gl embedded map</title>
    
      <!--Uber Font-->
      <link rel="stylesheet" href="//d1a3f4spazzrp4.cloudfront.net/kepler.gl/uber-fonts/4.0.0/superfine.css">
    
      <!--MapBox css-->
      <link href="//api.tiles.mapbox.com/mapbox-gl-js/v0.42.0/mapbox-gl.css" rel="stylesheet">
    
      <!-- Load React/Redux -->
      <script src="https://unpkg.com/react@16.8.4/umd/react.production.min.js" crossorigin></script>
      <script src="https://unpkg.com/react-dom@16.8.4/umd/react-dom.production.min.js" crossorigin></script>
      <script src="https://unpkg.com/redux@3.7.2/dist/redux.js" crossorigin></script>
      <script src="https://unpkg.com/react-redux@4.4.9/dist/react-redux.min.js" crossorigin></script>
      <script src="https://unpkg.com/styled-components@4.1.3/dist/styled-components.min.js" crossorigin></script>
    
      <!-- Load Kepler.gl latest version-->
      <script src="https://unpkg.com/kepler.gl/umd/keplergl.min.js" crossorigin></script>
      <!-- You can also specify a specific versions by doing the following -->
      <!--<script src="https://unpkg.com/kepler.gl@0.2.2/umd/keplergl.min.js"></script>-->
    
      <style type="text/css">
        body {margin: 0; padding: 0; overflow: hidden;}
      </style>
    
      <!--MapBox token-->
      <script>
        /**
         * Provide your MapBox Token
         * This will be used in app.js (imported later)
         * */
        const MAPBOX_TOKEN = '${options.mapboxApiAccessToken || 'PROVIDE_MAPBOX_TOKEN'}';
        const WARNING_MESSAGE = 'Please Provide a Mapbox Token in order to use Kepler.gl. Edit this file and fill out MAPBOX_TOKEN with your access key';
      </script>
    </head>
    <body>
      <!-- We will put our React component inside this div. -->
      <div id="app">
        <!-- Kepler.gl map will be placed here-->
      </div>
    
      <!-- Load our React component. -->
      <script>
        /* Validate Mapbox Token */
        if ((MAPBOX_TOKEN || '') === '' || MAPBOX_TOKEN === 'PROVIDE_MAPBOX_TOKEN') {
          alert(WARNING_MESSAGE);
        }
    
        /** STORE **/
        const reducers = (function createReducers(redux, keplerGl) {
          return redux.combineReducers({
            // mount keplerGl reducer
            keplerGl: keplerGl.keplerGlReducer
          });
        }(Redux, KeplerGl));
    
        const middleWares = (function createMiddlewares(keplerGl) {
          return keplerGl.enhanceReduxMiddleware([
            // Add other middlewares here
          ]);
        }(KeplerGl));
    
        const enhancers = (function craeteEnhancers(redux, middles) {
          return redux.applyMiddleware(...middles);
        }(Redux, middleWares));
    
        const store = (function createStore(redux, enhancers) {
          const initialState = {};
    
          return redux.createStore(
            reducers,
            initialState,
            redux.compose(enhancers)
          );
        }(Redux, enhancers));
        /** END STORE **/
    
        /** COMPONENTS **/
        const KeplerElement = (function (react, keplerGl, mapboxToken) {
          return function(props) {
            return react.createElement(
              'div',
              {style: {position: 'absolute', left: 0, width: '100vw', height: '100vh'}},
              react.createElement(
                keplerGl.KeplerGl,
                {
                  mapboxApiAccessToken: mapboxToken,
                  id: 'map',
                  width: props.width || 1200,
                  height: props.height || 800
                }
              )
            )
          }
        }(React, KeplerGl, MAPBOX_TOKEN));
    
        const app = (function createReactReduxProvider(react, reactRedux, KeplerElement) {
          return react.createElement(
            reactRedux.Provider,
            {store},
            react.createElement(KeplerElement, null)
          )
        }(React, ReactRedux, KeplerElement));
        /** END COMPONENTS **/
    
        /** Render **/
        (function render(react, reactDOM, app) {
          reactDOM.render(app, document.getElementById('app'));
        }(React, ReactDOM, app));
      </script>
      <!-- The next script will show how to interact directly with Kepler map store -->
      <script>
        /**
         * Customize map.
         * In the following section you can use the store object to dispatch Kepler.gl actions
         * to add new data and customize behavior
         */
        (function customize(keplerGl, store) {
          const datasets = ${JSON.stringify(options.datasets)};
          const config = ${JSON.stringify(options.config)};
          
          const loadedData = keplerGl.KeplerGlSchema.load(
            datasets,
            config
          );
          
          store.dispatch(keplerGl.addDataToMap(loadedData));
        }(KeplerGl, store))
      </script>
    </body>
    </html>
  `;
};

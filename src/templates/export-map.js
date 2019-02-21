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
    
      <!-- Load React/Redux -->
      <script src="https://unpkg.com/react@15.6.2/dist/react.min.js" crossorigin></script>
      <script src="https://unpkg.com/react-dom@15.6.2/dist/react-dom.min.js" crossorigin></script>
      <script src="https://unpkg.com/redux@3.7.2/dist/redux.js" crossorigin></script>
      <script src="https://unpkg.com/react-redux@4.4.9/dist/react-redux.min.js" crossorigin></script>
    
      <!-- Load Kepler.gl latest version-->
      <script src="https://unpkg.com/kepler.gl/umd/keplergl.min.js"></script>
      <!-- You can also specify a specific versions by doing the following -->
      <!--<script src="https://unpkg.com/kepler.gl@0.2.2/umd/keplergl.min.js"></script>-->
    
      <!--MapBox token-->
      <script>
        /**
         * Provide your MapBox Token
         * This will be used in app.js (imported later)
         * */
        const MAPBOX_TOKEN = 'PROVIDE_MAPBOX_TOKEN';
      </script>
    
    </head>
    <body>
      <!-- We will put our React component inside this div. -->
      <div id="app">
        <!-- Kepler.gl map will be placed here-->
      </div>
    
      <!-- Load our React component. -->
      <script>
        const map = (function initKeplerGl(react, reactDOM, redux, reactRedux, keplerGl, mapboxToken) {
          /** STORE **/
          const reducers = redux.combineReducers({
            // mount keplerGl reducer
            keplerGl: keplerGl.keplerGlReducer
          });
    
          const middlewares = keplerGl.enhanceReduxMiddleware([
            // Add other middlewares here
          ]);
    
          const enhancers = redux.applyMiddleware(...middlewares);
    
          const initialState = {};
    
          const store = redux.createStore(
            reducers,
            initialState,
            redux.compose(enhancers)
          );
          /** END STORE **/
    
          /** COMPONENTS **/
          function App(props) {
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
    
          return {
            render: () => {
              reactDOM.render(react.createElement(
                reactRedux.Provider,
                {store},
                react.createElement(App, null)
              ), document.getElementById('app'));
            },
            // By returning store we can interact with the map, e.g. add data
            store
          };
    
          /** END COMPONENTS **/
        }(React, ReactDOM, Redux, ReactRedux, KeplerGl, MAPBOX_TOKEN));
    
        // Render kepler in the html page
        map.render();
      </script>
      <!-- The next script will show how to interact directly with Kepler map store -->
      <script>
        /**
         * Customize map.
         * Interact with map store to customize data and behavior
         */
        (function customize(keplerGl, map) {
          const datasets = ${JSON.stringify(options.datasets)};
          const config = ${JSON.stringify(options.config)};
          
          const loadedData = keplerGl.KeplerGlSchema.load(
            datasets,
            config
          );
          
          map.store.dispatch(keplerGl.addDataToMap(loadedData));
        }(KeplerGl, map))
      </script>
    </body>
    </html>
  `;
};

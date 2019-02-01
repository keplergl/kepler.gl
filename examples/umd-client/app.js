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

// create redux
/** STORE **/
const reducers = Redux.combineReducers({
  // mount keplerGl reducer
  keplerGl: KeplerGl.keplerGlReducer
});

const middlewares = KeplerGl.enhanceReduxMiddleware([
  // Add other middlewares here
]);

const enhancers = Redux.applyMiddleware(...middlewares);

const initialState = {};

const store = Redux.createStore(
  reducers,
  initialState,
  Redux.compose(enhancers)
);
/** END STORE **/

/** COMPONENTS **/
const MAPBOX_TOKEN = 'USE_YOUR_MAPBOX_TOKEN';

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

function Kepler(props) {
  // const width = props.width || 800;
  // const height = props.height || 800;
  return React.createElement(KeplerGl.KeplerGl, {
    mapboxApiAccessToken: props.MAPBOX_TOKEN,
    id: props.id,
    width: props.width || 800,
    height: props.height || 800
  });
}

function MapContainer(props) {
  return React.createElement(
    ReactVirtualized.AutoSizer,
    null,
    function (props) {
      return React.createElement(Kepler, {
        mapboxApiAccessToken: MAPBOX_TOKEN,
        id: "map",
        width: props.width,
        height: props.height
      });
    }
  );
}

function App() {
  return React.createElement(
    'div',
    {style: {position: 'absolute', width: '100%', height: '100%'}},
    React.createElement(MapContainer)
  )
}

const AppContainer = ReactRedux.connect(mapStateToProps, dispatchToProps)(App);

ReactDOM.render(React.createElement(
  ReactRedux.Provider,
  { store: store },
  React.createElement(AppContainer, null)
), document.getElementById('app'));

/** END COMPONENTS **/

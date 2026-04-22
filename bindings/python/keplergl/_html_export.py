# SPDX-License-Identifier: MIT
# Copyright contributors to the kepler.gl project

"""Generate standalone HTML export using the kepler.gl UMD bundle from CDN."""

from __future__ import annotations

import json
from typing import Optional

import pandas as pd
import geopandas as gpd

DEFAULT_KEPLER_GL_CDN_VERSION = "latest"


def _dataset_to_csv(data) -> Optional[str]:
    """Convert a dataset value to CSV string for kepler.gl processCsvData."""
    if isinstance(data, gpd.GeoDataFrame):
        import shapely.wkt

        if data.crs and data.crs.to_epsg() != 4326:
            data = data.to_crs(4326)
        df = pd.DataFrame(data)
        geom_col = data.geometry.name
        df[geom_col] = data.geometry.apply(shapely.wkt.dumps)
        return df.to_csv(index=False)
    elif isinstance(data, pd.DataFrame):
        return data.to_csv(index=False)
    elif isinstance(data, str):
        return data
    else:
        return None


def _dataset_to_geojson(data) -> Optional[dict]:
    """Try to convert dataset to GeoJSON dict."""
    if isinstance(data, gpd.GeoDataFrame):
        if data.crs and data.crs.to_epsg() != 4326:
            data = data.to_crs(4326)
        return json.loads(data.to_json())
    elif isinstance(data, dict):
        geojson_types = {
            "FeatureCollection", "Feature", "Point", "MultiPoint",
            "LineString", "MultiLineString", "Polygon", "MultiPolygon",
            "GeometryCollection",
        }
        if data.get("type") in geojson_types:
            return data
    elif isinstance(data, str):
        try:
            parsed = json.loads(data)
            if isinstance(parsed, dict) and parsed.get("type") in {
                "FeatureCollection", "Feature",
            }:
                return parsed
        except (json.JSONDecodeError, TypeError):
            pass
    return None


def _serialize_datasets_for_html(data: dict) -> str:
    """Serialize datasets dict into JS code that calls addDataToMap.

    Generates a JS snippet that processes each dataset using kepler.gl's
    processCsvData or processGeojson, then dispatches addDataToMap.
    """
    snippets = []
    for name, dataset in data.items():
        geojson = _dataset_to_geojson(dataset)
        if geojson is not None:
            snippets.append(
                f"  datasets.push({{info: {{id: {json.dumps(name, ensure_ascii=False)}, label: {json.dumps(name, ensure_ascii=False)}}}, "
                f"data: keplerGl.processGeojson({json.dumps(geojson, ensure_ascii=False)})}});"
            )
        else:
            csv_str = _dataset_to_csv(dataset)
            if csv_str is not None:
                snippets.append(
                    f"  datasets.push({{info: {{id: {json.dumps(name, ensure_ascii=False)}, label: {json.dumps(name, ensure_ascii=False)}}}, "
                    f"data: keplerGl.processCsvData({json.dumps(csv_str, ensure_ascii=False)})}});"
                )
    return "\n".join(snippets)


def export_map_html(
    data: dict,
    config: dict,
    read_only: bool = False,
    center_map: bool = False,
    mapbox_token: str = "",
    kepler_gl_version: str = DEFAULT_KEPLER_GL_CDN_VERSION,
) -> str:
    """Generate a standalone HTML string that renders a kepler.gl map.

    Loads all dependencies from CDN (unpkg). No local JS build required.
    """
    dataset_js = _serialize_datasets_for_html(data)
    config_json = json.dumps(config, ensure_ascii=False) if config else "{}"
    mapbox_token_json = json.dumps(mapbox_token)
    read_only_js = "true" if read_only else "false"
    center_map_js = "true" if center_map else "false"

    return f"""\
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8"/>
    <title>Kepler.gl embedded map</title>

    <!--Uber Font-->
    <link rel="stylesheet" href="https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/uber-fonts/4.0.0/superfine.css">

    <!--Kepler css-->
    <link href="https://unpkg.com/kepler.gl@{kepler_gl_version}/umd/keplergl.min.css" rel="stylesheet">

    <!--MapBox css-->
    <link href="https://api.tiles.mapbox.com/mapbox-gl-js/v1.1.1/mapbox-gl.css" rel="stylesheet">
    <link href="https://unpkg.com/maplibre-gl@^3/dist/maplibre-gl.css" rel="stylesheet">

    <!-- Load React/Redux -->
    <script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js" crossorigin></script>
    <script src="https://unpkg.com/redux@4.2.1/dist/redux.js" crossorigin></script>
    <script src="https://unpkg.com/react-redux@8.1.2/dist/react-redux.min.js" crossorigin></script>
    <script src="https://unpkg.com/styled-components@6.1.8/dist/styled-components.min.js" crossorigin></script>

    <!-- Load Kepler.gl -->
    <script src="https://unpkg.com/kepler.gl@{kepler_gl_version}/umd/keplergl.min.js" crossorigin></script>

    <style type="text/css">
      body {{margin: 0; padding: 0; overflow: hidden;}}
    </style>

    <script>
      const MAPBOX_TOKEN = {mapbox_token_json};
    </script>
  </head>
  <body>
    <div id="app"></div>

    <script>
      /** STORE **/
      const reducers = (function createReducers(redux, keplerGl) {{
        return redux.combineReducers({{
          keplerGl: keplerGl.keplerGlReducer.initialState({{
            uiState: {{
              readOnly: {read_only_js},
              currentModal: null
            }}
          }})
        }});
      }}(Redux, KeplerGl));

      const middleWares = (function createMiddlewares(keplerGl) {{
        return keplerGl.enhanceReduxMiddleware([]);
      }}(KeplerGl));

      const enhancers = (function createEnhancers(redux, middles) {{
        return redux.applyMiddleware(...middles);
      }}(Redux, middleWares));

      const store = (function createStore(redux, enhancers) {{
        return redux.createStore(reducers, {{}}, redux.compose(enhancers));
      }}(Redux, enhancers));
      /** END STORE **/

      /** COMPONENTS **/
      var KeplerElement = (function makeKeplerElement(react, keplerGl, mapboxToken) {{
        return function App() {{
          var rootElm = react.useRef(null);
          var _useState = react.useState({{
            width: window.innerWidth,
            height: window.innerHeight
          }});
          var windowDimension = _useState[0];
          var setDimension = _useState[1];
          react.useEffect(function sideEffect() {{
            function handleResize() {{
              setDimension({{width: window.innerWidth, height: window.innerHeight}});
            }}
            window.addEventListener('resize', handleResize);
            return function() {{ window.removeEventListener('resize', handleResize); }};
          }}, []);
          return react.createElement(
            'div',
            {{style: {{position: 'absolute', left: 0, width: '100vw', height: '100vh'}}}},
            react.createElement(keplerGl.KeplerGl, {{
              mapboxApiAccessToken: mapboxToken,
              id: "map",
              width: windowDimension.width,
              height: windowDimension.height
            }})
          );
        }};
      }}(React, KeplerGl, MAPBOX_TOKEN));

      const app = (function createReactReduxProvider(react, reactRedux, KeplerElement) {{
        return react.createElement(
          reactRedux.Provider,
          {{store}},
          react.createElement(KeplerElement, null)
        );
      }}(React, ReactRedux, KeplerElement));
      /** END COMPONENTS **/

      /** Render **/
      (function render(react, reactDOM, app) {{
        const container = document.getElementById('app');
        const root = reactDOM.createRoot(container);
        root.render(app);
      }}(React, ReactDOM, app));
    </script>

    <script>
      (function customize(keplerGl, store) {{
        var datasets = [];
{dataset_js}

        var config = {config_json};

        window.setTimeout(function() {{
          store.dispatch(keplerGl.addDataToMap({{
            datasets: datasets,
            config: config,
            options: {{
              centerMap: {center_map_js}
            }}
          }}));
        }}, 500);
      }}(KeplerGl, store));
    </script>
  </body>
</html>
"""

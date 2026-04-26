# SPDX-License-Identifier: MIT
# Copyright contributors to the kepler.gl project

"""Generate standalone HTML export using the kepler.gl UMD bundle from CDN."""

from __future__ import annotations

import json
import html
from typing import Optional

import pandas as pd
import geopandas as gpd

DEFAULT_KEPLER_GL_CDN_VERSION = "3"


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


def _dataset_to_geojson(data, json_encoder=str) -> Optional[dict]:
    """Try to convert dataset to GeoJSON dict.

    Args:
        data: Dataset value (GeoDataFrame, dict, or string).
        json_encoder: Fallback function passed as ``default`` to
            ``GeoDataFrame.to_json()`` so that non-serializable types
            (e.g. ``datetime``) are converted instead of raising.
            Defaults to ``str``.  Pass ``None`` to disable (will raise
            on non-serializable types).
    """
    if isinstance(data, gpd.GeoDataFrame):
        if data.crs and data.crs.to_epsg() != 4326:
            data = data.to_crs(4326)
        return json.loads(data.to_json(default=json_encoder))
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


def _geojson_dataset_names(data: dict, json_encoder=str) -> set:
    """Return the set of dataset names that will be serialized as GeoJSON."""
    names: set = set()
    for name, dataset in data.items():
        if _dataset_to_geojson(dataset, json_encoder=json_encoder) is not None:
            names.add(name)
    return names


def _fixup_geojson_columns(config: Optional[dict], geojson_names: set) -> Optional[dict]:
    """Rewrite layer column references for GeoJSON datasets.

    ``processGeojson`` stores the geometry as ``_geojson`` regardless of the
    original column name.  Configs produced by the Jupyter widget use the
    source GeoDataFrame column name (commonly ``geometry``), so the layer
    merger cannot match them.  This helper patches those references so the
    exported HTML applies the full config.
    """
    if not config or not geojson_names:
        return config

    import copy
    config = copy.deepcopy(config)
    layers = (config
              .get("config", {})
              .get("visState", {})
              .get("layers", []))
    for layer in layers:
        layer_cfg = layer.get("config", {})
        data_id = layer_cfg.get("dataId")
        if data_id not in geojson_names:
            continue
        columns = layer_cfg.get("columns", {})
        if "geojson" in columns and columns["geojson"] != "_geojson":
            columns["geojson"] = "_geojson"
    return config


def _serialize_datasets_for_html(data: dict, json_encoder=str) -> str:
    """Serialize datasets dict into JS code that calls addDataToMap.

    Generates a JS snippet that processes each dataset using kepler.gl's
    processCsvData or processGeojson, then dispatches addDataToMap.

    Args:
        data: Dict mapping dataset names to data objects.
        json_encoder: Fallback encoder passed to ``_dataset_to_geojson``.
    """
    snippets = []
    for name, dataset in data.items():
        geojson = _dataset_to_geojson(dataset, json_encoder=json_encoder)
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
    config: Optional[dict],
    read_only: bool = False,
    center_map: bool = False,
    mapbox_token: str = "",
    kepler_gl_version: str = DEFAULT_KEPLER_GL_CDN_VERSION,
    json_encoder=str,
    app_name: str = "kepler.gl",
    theme: str = "",
) -> str:
    """Generate a standalone HTML string that renders a kepler.gl map.

    Loads all dependencies from CDN (unpkg). No local JS build required.

    Args:
        data: Dict of dataset name to data.
        config: Map config dict.
        read_only: If True, hide side panel to disable map customization.
        center_map: If True, fit map bounds to the data.
        mapbox_token: Mapbox API access token.
        kepler_gl_version: kepler.gl UMD bundle version tag for unpkg.
        json_encoder: Fallback function passed as ``default`` when
            JSON-serializing GeoDataFrame data.  Defaults to ``str`` so
            that ``datetime`` and other non-native JSON types are
            converted automatically.  Pass ``None`` to disable.
        app_name: Application name displayed in the side panel header
            and used as the HTML ``<title>``.  Defaults to ``"kepler.gl"``.
        theme: UI theme for the kepler.gl component.  Accepted values
            are ``"light"``, ``"dark"``, ``"base"``, or an empty string
            (default) which uses the built-in dark theme.
    """
    dataset_js = _serialize_datasets_for_html(data, json_encoder=json_encoder)
    geojson_names = _geojson_dataset_names(data, json_encoder=json_encoder)
    fixed_config = _fixup_geojson_columns(config, geojson_names)
    config_json = json.dumps(fixed_config, ensure_ascii=False) if fixed_config else "{}"
    mapbox_token_json = json.dumps(mapbox_token)
    read_only_js = "true" if read_only else "false"
    center_map_js = "true" if center_map else "false"
    app_name_json = json.dumps(app_name)
    theme_js = json.dumps(theme) if theme else "undefined"
    title_html = html.escape(app_name) if app_name else "kepler.gl"

    return f"""\
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8"/>
    <title>{title_html} embedded map</title>

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
            react.createElement(keplerGl.KeplerGl, Object.assign({{
              mapboxApiAccessToken: mapboxToken,
              id: "map",
              width: windowDimension.width,
              height: windowDimension.height,
              appName: {app_name_json}
            }}, {theme_js} !== undefined ? {{theme: {theme_js}}} : {{}}))
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

# SPDX-License-Identifier: MIT
# Copyright contributors to the kepler.gl project

"""Kepler.gl Jupyter Widget using anywidget."""

import pathlib
import copy
import anywidget
import traitlets

from .serializers import data_to_json, data_from_json
from ._html_export import export_map_html, DEFAULT_KEPLER_GL_CDN_VERSION

_STATIC_DIR = pathlib.Path(__file__).parent / "static"

class KeplerGl(anywidget.AnyWidget):
    """Kepler.gl Jupyter Widget using anywidget."""

    _esm = _STATIC_DIR / "widget.js"
    _css = _STATIC_DIR / "widget.css"

    data = traitlets.Dict({}).tag(sync=True, to_json=data_to_json, from_json=data_from_json)
    config = traitlets.Dict({}).tag(sync=True)
    height = traitlets.Int(400).tag(sync=True)
    mapbox_token = traitlets.Unicode("").tag(sync=True)

    def __init__(self, data=None, config=None, height=400, mapbox_token="", use_arrow=False, show_docs=False, **kwargs):
        """
        Initialize KeplerGl widget.

        Args:
            data: Dict of dataset name to data (DataFrame, GeoDataFrame, CSV, GeoJSON)
            config: Kepler.gl config dict
            height: Widget height in pixels
            mapbox_token: Mapbox API access token for Mapbox basemap styles
            use_arrow: If True, serialize DataFrames as Arrow IPC (more compact, preserves types)
            show_docs: Deprecated, kept for compatibility
        """
        super().__init__(**kwargs)
        self._use_arrow = use_arrow
        self.height = height
        self.mapbox_token = mapbox_token

        if config:
            self.config = config

        if data:
            self._add_data_dict(data)

    def add_data(self, data, name="data", use_arrow=None):
        """Add data to the map.

        Args:
            data: DataFrame, GeoDataFrame, CSV string, or GeoJSON dict/string
            name: Dataset name/identifier
            use_arrow: If True, serialize DataFrame as Arrow IPC. If None (default),
                falls back to the widget-level use_arrow setting.
        """
        updated = copy.deepcopy(self.data)
        updated[name] = data
        if use_arrow is not None:
            self._use_arrow = use_arrow
        self.data = updated

    def _add_data_dict(self, data_dict):
        """Add multiple datasets from a dict."""
        updated = copy.deepcopy(self.data)
        for name, data in data_dict.items():
            updated[name] = data
        self.data = updated

    def save_to_html(
        self,
        file_name="keplergl_map.html",
        data=None,
        config=None,
        read_only=False,
        center_map=True,
        mapbox_token="",
    ):
        """Export the map to a standalone HTML file.

        The exported HTML loads kepler.gl from the unpkg CDN (no local build needed)
        and embeds the current data and configuration.

        Args:
            file_name: Output HTML file path (default: 'keplergl_map.html')
            data: Dict of dataset name to data. If None, uses current widget data.
            config: Map config dict. If None, uses current widget config.
            read_only: If True, hide side panel to disable map customization.
            center_map: If True, fit map bounds to the data (default: True).
            mapbox_token: Mapbox access token. Required for Mapbox basemap styles
                (e.g. "Dark", "Muted Light"). Leave empty for free MapLibre styles.
        """
        data_to_save = data if data is not None else self.data
        config_to_save = config if config is not None else self.config
        token = mapbox_token if mapbox_token else self.mapbox_token

        html = export_map_html(
            data=data_to_save,
            config=config_to_save,
            read_only=read_only,
            center_map=center_map,
            mapbox_token=token,
            kepler_gl_version=DEFAULT_KEPLER_GL_CDN_VERSION,
        )

        with open(file_name, "w", encoding="utf-8") as f:
            f.write(html)

        print(f"Map saved to {file_name}!")

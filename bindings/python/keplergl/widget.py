# SPDX-License-Identifier: MIT
# Copyright contributors to the kepler.gl project

"""Kepler.gl Jupyter Widget using anywidget."""

import pathlib
import copy
import anywidget
import traitlets

from .serializers import data_to_json, data_from_json
from ._html_export import export_map_html

_STATIC_DIR = pathlib.Path(__file__).parent / "static"

KEPLER_GL_CDN_VERSION = "3.2.6"


class KeplerGl(anywidget.AnyWidget):
    """Kepler.gl Jupyter Widget using anywidget."""

    _esm = _STATIC_DIR / "widget.js"
    _css = _STATIC_DIR / "widget.css"

    data = traitlets.Dict({}).tag(sync=True, to_json=data_to_json, from_json=data_from_json)
    config = traitlets.Dict({}).tag(sync=True)
    height = traitlets.Int(400).tag(sync=True)

    def __init__(self, data=None, config=None, height=400, show_docs=False, **kwargs):
        """
        Initialize KeplerGl widget.

        Args:
            data: Dict of dataset name to data (DataFrame, GeoDataFrame, CSV, GeoJSON)
            config: Kepler.gl config dict
            height: Widget height in pixels
            show_docs: Deprecated, kept for compatibility
        """
        super().__init__(**kwargs)
        self.height = height

        if config:
            self.config = config

        if data:
            self._add_data_dict(data)

    def add_data(self, data, name="data"):
        """Add data to the map."""
        updated = copy.deepcopy(self.data)
        updated[name] = data
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
        """
        data_to_save = data if data is not None else self.data
        config_to_save = config if config is not None else self.config

        html = export_map_html(
            data=data_to_save,
            config=config_to_save,
            read_only=read_only,
            center_map=center_map,
            kepler_gl_version=KEPLER_GL_CDN_VERSION,
        )

        with open(file_name, "w", encoding="utf-8") as f:
            f.write(html)

        print(f"Map saved to {file_name}!")

"""Kepler.gl Jupyter Widget using anywidget."""

import pathlib
import copy
import anywidget
import traitlets

from .serializers import data_to_json, data_from_json

_STATIC_DIR = pathlib.Path(__file__).parent / "static"


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
        center_map=False,
    ):
        """Export the map to a standalone HTML file.

        Note: This method is no longer supported in the new anywidget-based implementation.
        Please use the "Share" button in the map config panel to export your map.
        """
        print(
            "save_to_html() is no longer supported in this version.\n"
            "Please use the 'Share' button in the map config panel to export your map to HTML."
        )

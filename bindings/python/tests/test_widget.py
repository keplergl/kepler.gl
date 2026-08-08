# SPDX-License-Identifier: MIT
# Copyright contributors to the kepler.gl project

"""Widget tests."""

import pytest
from keplergl import KeplerGl


def test_widget_creation():
    widget = KeplerGl()
    assert widget.height == 400
    assert widget.data == {}
    assert widget.config == {}


def test_widget_with_height():
    widget = KeplerGl(height=600)
    assert widget.height == 600


def test_widget_with_dataframe(sample_df):
    widget = KeplerGl(data={"cities": sample_df})
    assert "cities" in widget.data


def test_widget_with_geodataframe(sample_gdf):
    widget = KeplerGl(data={"points": sample_gdf})
    assert "points" in widget.data


def test_add_data(sample_df):
    widget = KeplerGl()
    widget.add_data(sample_df, name="test")
    assert "test" in widget.data


def test_widget_with_config():
    config = {"version": "v1", "config": {"mapState": {"zoom": 10}}}
    widget = KeplerGl(config=config)
    assert widget.config == config


def test_widget_use_arrow_default():
    widget = KeplerGl()
    assert widget._use_arrow is False


def test_widget_use_arrow_enabled():
    widget = KeplerGl(use_arrow=True)
    assert widget._use_arrow is True


def test_widget_use_arrow_with_dataframe(sample_df):
    widget = KeplerGl(data={"test": sample_df}, use_arrow=True)
    assert "test" in widget.data
    assert widget._use_arrow is True


def test_add_data_use_arrow(sample_df):
    widget = KeplerGl()
    assert widget._use_arrow is False
    widget.add_data(sample_df, name="test", use_arrow=True)
    assert "test" in widget.data
    assert widget._use_arrow is True


def test_add_data_use_arrow_none_preserves_widget_setting(sample_df):
    widget = KeplerGl(use_arrow=True)
    widget.add_data(sample_df, name="test")
    assert widget._use_arrow is True


def test_widget_default_mapbox_token():
    widget = KeplerGl()
    assert widget.mapbox_token == ""


def test_widget_mapbox_token_stored():
    widget = KeplerGl(mapbox_token="pk.abc123")
    assert widget.mapbox_token == "pk.abc123"


def test_widget_default_theme():
    widget = KeplerGl()
    assert widget.theme == ""


def test_widget_theme_stored():
    widget = KeplerGl(theme="light")
    assert widget.theme == "light"


def test_widget_default_app_name():
    widget = KeplerGl()
    assert widget.app_name == "kepler.gl"


def test_widget_app_name_stored():
    widget = KeplerGl(app_name="My Dashboard")
    assert widget.app_name == "My Dashboard"


def test_widget_show_docs_compat():
    """show_docs is a deprecated no-op; should not raise."""
    KeplerGl(show_docs=True)


def test_add_data_replaces_existing(sample_df):
    import pandas as pd
    widget = KeplerGl(data={"cities": sample_df})
    new_df = pd.DataFrame({"x": [99]})
    widget.add_data(new_df, name="cities")
    assert "cities" in widget.data
    # Serialized data should reflect the new single-column DataFrame, not the
    # original two-column one.
    from keplergl.serializers import serialize_dataset
    stored = serialize_dataset(widget.data["cities"], "cities")
    assert stored["data"]["columns"] == ["x"]


def test_init_with_multiple_datasets(sample_df, sample_gdf):
    widget = KeplerGl(data={"tab": sample_df, "geo": sample_gdf})
    assert "tab" in widget.data
    assert "geo" in widget.data


def test_add_data_does_not_remove_existing(sample_df):
    import pandas as pd
    widget = KeplerGl(data={"first": sample_df})
    widget.add_data(pd.DataFrame({"x": [1]}), name="second")
    assert "first" in widget.data
    assert "second" in widget.data


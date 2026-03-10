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

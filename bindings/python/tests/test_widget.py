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

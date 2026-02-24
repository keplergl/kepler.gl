"""Serializer tests."""

import pytest
from keplergl.serializers import serialize_dataset


def test_serialize_dataframe(sample_df):
    result = serialize_dataset(sample_df, "test")
    assert result["id"] == "test"
    assert result["format"] == "arrow"
    assert "data" in result


def test_serialize_geodataframe(sample_gdf):
    result = serialize_dataset(sample_gdf, "test")
    assert result["id"] == "test"
    assert result["format"] == "geoarrow"
    assert "data" in result


def test_serialize_csv():
    csv_data = "lat,lng\n37.7749,-122.4194"
    result = serialize_dataset(csv_data, "test")
    assert result["format"] == "csv"
    assert result["data"] == csv_data


def test_serialize_geojson():
    geojson = {"type": "FeatureCollection", "features": []}
    result = serialize_dataset(geojson, "test")
    assert result["format"] == "geojson"
    assert result["data"] == geojson

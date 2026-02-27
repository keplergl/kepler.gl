"""Serializer tests."""

import json
import pytest
import pandas as pd
import geopandas as gpd
from shapely.geometry import Point, Polygon
from keplergl.serializers import serialize_dataset


class TestDataFrameSerialization:
    """Tests for DataFrame serialization (from DataFrame.ipynb)."""

    def test_serialize_dataframe(self, sample_df):
        result = serialize_dataset(sample_df, "test")
        assert result["id"] == "test"
        assert result["format"] == "df"
        assert "data" in result

    def test_serialize_dataframe_with_cities(self):
        """Test DataFrame with city data (from DataFrame.ipynb)."""
        df = pd.DataFrame({
            'City': ['Buenos Aires', 'Brasilia', 'Santiago', 'Bogota', 'Caracas'],
            'Country': ['Argentina', 'Brazil', 'Chile', 'Colombia', 'Venezuela'],
            'Latitude': [-34.58, -15.78, -33.45, 4.60, 10.48],
            'Longitude': [-58.66, -47.91, -70.66, -74.08, -66.86],
            'Time': ['2019-09-01 08:00', '2019-09-01 09:00', '2019-09-01 10:00',
                     '2019-09-01 11:00', '2019-09-01 12:00'],
        })
        result = serialize_dataset(df, "data_1")
        assert result["id"] == "data_1"
        assert result["format"] == "df"
        assert result["data"]["columns"] == ['City', 'Country', 'Latitude', 'Longitude', 'Time']
        assert len(result["data"]["data"]) == 5

    def test_serialize_dataframe_with_hex_data(self):
        """Test DataFrame with H3 hex IDs and mixed types (from Load kepler.gl.ipynb)."""
        df = pd.DataFrame({
            'hex_id': ['89283082c2fffff', '8928308288fffff', '89283082c07ffff'],
            'value': [64, 73, 65],
            'is_true': [True, True, True],
            'float_value': [64.1, 73.1, 65.1],
            'empty': ['', '', ''],
            'time': ['11/1/17 11:00', '11/1/17 11:00', '11/1/17 11:00'],
        })
        result = serialize_dataset(df, "data_1")
        assert result["id"] == "data_1"
        assert result["format"] == "df"
        assert 'hex_id' in result["data"]["columns"]
        assert 'value' in result["data"]["columns"]
        assert 'is_true' in result["data"]["columns"]

    def test_serialize_dataframe_with_nan_filled(self):
        """Test DataFrame with NaN values filled with empty string."""
        df = pd.DataFrame({
            'col1': [1, 2, 3],
            'col2': ['a', None, 'c'],
        })
        df = df.fillna('')
        result = serialize_dataset(df, "test")
        assert result["format"] == "df"
        assert result["data"]["data"][1][1] == ''


class TestGeoDataFrameSerialization:
    """Tests for GeoDataFrame serialization (from GeoDataFrame.ipynb)."""

    def test_serialize_geodataframe(self, sample_gdf):
        result = serialize_dataset(sample_gdf, "test")
        assert result["id"] == "test"
        assert result["format"] == "geoarrow"
        assert "data" in result

    def test_serialize_geodataframe_with_timestamp(self):
        """Test GeoDataFrame with pd.Timestamp column.

        Regression test for issue where GeoDataFrame containing Timestamp
        columns would fail during Arrow serialization.
        """
        df = pd.DataFrame({
            'City': ['Buenos Aires'],
            'Country': ['Argentina'],
            'Latitude': [-34.58],
            'Longitude': [-58.66],
            'Timestamp': pd.Timestamp(2002, 3, 3),
        })
        gdf = gpd.GeoDataFrame(
            df,
            geometry=gpd.points_from_xy(df.Longitude, df.Latitude),
        )
        result = serialize_dataset(gdf, "cities")
        assert result["id"] == "cities"
        assert result["format"] == "geoarrow"
        assert "data" in result

    def test_serialize_geodataframe_points_from_xy(self):
        """Test GeoDataFrame created with points_from_xy (from GeoDataFrame.ipynb)."""
        df = pd.DataFrame({
            'City': ['Buenos Aires', 'Brasilia', 'Santiago', 'Bogota', 'Caracas'],
            'Country': ['Argentina', 'Brazil', 'Chile', 'Colombia', 'Venezuela'],
            'Latitude': [-34.58, -15.78, -33.45, 4.60, 10.48],
            'Longitude': [-58.66, -47.91, -70.66, -74.08, -66.86],
        })
        gdf = gpd.GeoDataFrame(
            df,
            geometry=gpd.points_from_xy(df.Longitude, df.Latitude),
        )
        result = serialize_dataset(gdf, "cities")
        assert result["id"] == "cities"
        assert result["format"] == "geoarrow"
        assert "data" in result

    def test_serialize_geodataframe_with_polygons(self):
        """Test GeoDataFrame with Polygon geometries (like zipcode boundaries)."""
        gdf = gpd.GeoDataFrame({
            'ZIP_CODE': ['94107', '94105'],
            'geometry': [
                Polygon([(-122.40, 37.78), (-122.39, 37.78),
                         (-122.39, 37.77), (-122.40, 37.77)]),
                Polygon([(-122.39, 37.79), (-122.38, 37.79),
                         (-122.38, 37.78), (-122.39, 37.78)]),
            ],
        })
        result = serialize_dataset(gdf, "zipcode")
        assert result["id"] == "zipcode"
        assert result["format"] == "geoarrow"
        assert "data" in result

    def test_serialize_geodataframe_with_crs(self):
        """Test GeoDataFrame with explicit CRS."""
        gdf = gpd.GeoDataFrame(
            {"name": ["SF", "LA"]},
            geometry=[Point(-122.4194, 37.7749), Point(-118.2437, 34.0522)],
            crs="EPSG:4326",
        )
        result = serialize_dataset(gdf, "test")
        assert result["format"] == "geoarrow"
        assert "data" in result


class TestGeoJSONSerialization:
    """Tests for GeoJSON serialization (from GeoJSON.ipynb)."""

    def test_serialize_geojson_dict(self):
        """Test GeoJSON as dict."""
        geojson = {"type": "FeatureCollection", "features": []}
        result = serialize_dataset(geojson, "test")
        assert result["format"] == "geojson"
        assert result["data"] == geojson

    def test_serialize_geojson_feature_collection(self):
        """Test GeoJSON FeatureCollection with features."""
        geojson = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {"type": "Point", "coordinates": [-122.4, 37.8]},
                    "properties": {"name": "San Francisco"},
                },
                {
                    "type": "Feature",
                    "geometry": {"type": "Point", "coordinates": [-118.2, 34.0]},
                    "properties": {"name": "Los Angeles"},
                },
            ],
        }
        result = serialize_dataset(geojson, "geojson")
        assert result["id"] == "geojson"
        assert result["format"] == "geojson"
        assert result["data"]["type"] == "FeatureCollection"
        assert len(result["data"]["features"]) == 2

    def test_serialize_geojson_string(self):
        """Test GeoJSON as string (from GeoJSON.ipynb - reading from file)."""
        geojson_str = json.dumps({
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {"type": "Point", "coordinates": [-122.4, 37.8]},
                    "properties": {"name": "Test"},
                },
            ],
        })
        result = serialize_dataset(geojson_str, "geojson")
        assert result["id"] == "geojson"
        assert result["format"] == "geojson"
        assert result["data"]["type"] == "FeatureCollection"

    def test_serialize_geojson_polygon(self):
        """Test GeoJSON with Polygon geometry."""
        geojson = {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-122.4, 37.8], [-122.3, 37.8],
                    [-122.3, 37.7], [-122.4, 37.7], [-122.4, 37.8],
                ]],
            },
            "properties": {"name": "Test Area"},
        }
        result = serialize_dataset(geojson, "polygon")
        assert result["format"] == "geojson"


class TestCSVSerialization:
    """Tests for CSV string serialization."""

    def test_serialize_csv(self):
        csv_data = "lat,lng\n37.7749,-122.4194"
        result = serialize_dataset(csv_data, "test")
        assert result["format"] == "csv"
        assert result["data"] == csv_data

    def test_serialize_csv_multirow(self):
        """Test CSV with multiple rows."""
        csv_data = "City,Latitude,Longitude\nSF,37.77,-122.42\nLA,34.05,-118.24"
        result = serialize_dataset(csv_data, "cities")
        assert result["id"] == "cities"
        assert result["format"] == "csv"
        assert result["data"] == csv_data


class TestEdgeCases:
    """Tests for edge cases and error handling."""

    def test_serialize_unsupported_type(self):
        """Test that unsupported types raise ValueError."""
        with pytest.raises(ValueError, match="Unsupported data type"):
            serialize_dataset([1, 2, 3], "test")

    def test_serialize_empty_dataframe(self):
        """Test serializing empty DataFrame."""
        df = pd.DataFrame({'col1': [], 'col2': []})
        result = serialize_dataset(df, "empty")
        assert result["format"] == "df"
        assert result["data"]["columns"] == ['col1', 'col2']
        assert result["data"]["data"] == []

    def test_serialize_single_row_dataframe(self):
        """Test serializing single-row DataFrame."""
        df = pd.DataFrame({'lat': [37.77], 'lng': [-122.42]})
        result = serialize_dataset(df, "single")
        assert result["format"] == "df"
        assert len(result["data"]["data"]) == 1

    def test_serialize_dataframe_with_various_dtypes(self):
        """Test DataFrame with various data types."""
        df = pd.DataFrame({
            'int_col': [1, 2, 3],
            'float_col': [1.1, 2.2, 3.3],
            'str_col': ['a', 'b', 'c'],
            'bool_col': [True, False, True],
        })
        result = serialize_dataset(df, "mixed")
        assert result["format"] == "df"
        assert len(result["data"]["columns"]) == 4

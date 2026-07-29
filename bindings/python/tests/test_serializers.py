# SPDX-License-Identifier: MIT
# Copyright contributors to the kepler.gl project

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

    def test_serialize_empty_geodataframe(self):
        """Test that an empty GeoDataFrame serializes without error."""
        gdf = gpd.GeoDataFrame(
            {"name": pd.Series([], dtype="str")},
            geometry=gpd.GeoSeries([], crs="EPSG:4326"),
        )
        result = serialize_dataset(gdf, "empty")
        assert result["id"] == "empty"
        assert result["format"] == "geoarrow"
        assert "data" in result

    def test_serialize_all_null_geometry_geodataframe(self):
        """Test that a GeoDataFrame with all-null geometries serializes without error."""
        gdf = gpd.GeoDataFrame(
            {"name": ["a", "b"]},
            geometry=[None, None],
        )
        result = serialize_dataset(gdf, "nulls")
        assert result["id"] == "nulls"
        assert result["format"] == "geoarrow"
        assert "data" in result

    def test_serialize_geodataframe_multiple_geometry_columns(self):
        """GeoDataFrame with multiple geometry columns must not raise.

        Regression test for the serialization error reported in
        https://github.com/keplergl/kepler.gl/issues/2283 — when a GeoDataFrame
        has more than one geometry-typed column, pa.array() would fail on the
        non-active geometry columns.  The active geometry column is encoded as
        GeoArrow; secondary ones are converted to WKT strings.
        """
        import base64
        import pyarrow as pa

        gdf = gpd.GeoDataFrame(
            {"name": ["SF", "LA"], "value": [1, 2]},
            geometry=[Point(-122.4194, 37.7749), Point(-118.2437, 34.0522)],
            crs="EPSG:4326",
        )
        # buffer() on a geographic CRS gives imprecise results — acceptable here
        # since we only care about serialization, not geometric accuracy.
        import warnings
        with warnings.catch_warnings():
            warnings.simplefilter("ignore", UserWarning)
            gdf["buffer"] = gdf.geometry.buffer(0.01)

        result = serialize_dataset(gdf, "multi_geom")
        assert result["id"] == "multi_geom"
        assert result["format"] == "geoarrow"

        # Decode the Arrow table and verify all columns survived
        arrow_bytes = base64.b64decode(result["data"])
        table = pa.ipc.open_stream(arrow_bytes).read_all()
        assert "name" in table.column_names
        assert "value" in table.column_names
        assert "geometry" in table.column_names
        assert "buffer" in table.column_names
        assert table.num_rows == 2

        # The secondary geometry column must be WKT strings, not raw geometry objects
        buffer_col = table.column("buffer")
        assert pa.types.is_string(buffer_col.type) or pa.types.is_large_string(buffer_col.type), (
            f"Expected secondary geometry column to be WKT string, got {buffer_col.type}"
        )
        assert buffer_col[0].as_py().startswith("POLYGON")

    def test_serialize_geodataframe_non_default_active_geometry(self):
        """Active geometry column with non-default name is encoded as GeoArrow.

        When a GeoDataFrame has two geometry columns and the active one is
        not named 'geometry', the active column must still be GeoArrow-encoded
        and the other must be WKT.
        """
        import base64
        import pyarrow as pa

        gdf = gpd.GeoDataFrame(
            {"name": ["A", "B"]},
            geometry=[Point(0, 0), Point(1, 1)],
        )
        gdf["secondary"] = gdf.geometry.buffer(0.1)
        # Switch the active geometry to the buffered column
        gdf = gdf.set_geometry("secondary")

        result = serialize_dataset(gdf, "swapped")
        assert result["format"] == "geoarrow"

        arrow_bytes = base64.b64decode(result["data"])
        table = pa.ipc.open_stream(arrow_bytes).read_all()
        assert "geometry" in table.column_names
        assert "secondary" in table.column_names

        # Original (now non-active) column must be WKT
        orig_col = table.column("geometry")
        assert pa.types.is_string(orig_col.type) or pa.types.is_large_string(orig_col.type)

    def test_serialize_geodataframe_null_secondary_geometry(self):
        """A secondary geometry column that is all-null serializes as WKT nulls."""
        import base64
        import pyarrow as pa

        gdf = gpd.GeoDataFrame(
            {"name": ["A", "B"]},
            geometry=[Point(0, 0), Point(1, 1)],
        )
        gdf["empty_geom"] = gpd.GeoSeries([None, None])

        result = serialize_dataset(gdf, "null_secondary")
        assert result["format"] == "geoarrow"

        arrow_bytes = base64.b64decode(result["data"])
        table = pa.ipc.open_stream(arrow_bytes).read_all()
        assert "empty_geom" in table.column_names
        assert table.num_rows == 2


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


class TestArrowSerialization:
    """Tests for Arrow IPC serialization of DataFrames."""

    def test_serialize_dataframe_arrow(self, sample_df):
        """Test basic DataFrame Arrow serialization."""
        result = serialize_dataset(sample_df, "test", use_arrow=True)
        assert result["id"] == "test"
        assert result["format"] == "arrow"
        assert isinstance(result["data"], str)

    def test_serialize_dataframe_arrow_roundtrip(self, sample_df):
        """Test that Arrow-serialized data can be deserialized back."""
        import base64
        import pyarrow as pa

        result = serialize_dataset(sample_df, "test", use_arrow=True)
        arrow_bytes = base64.b64decode(result["data"])
        reader = pa.ipc.open_stream(arrow_bytes)
        table = reader.read_all()
        assert table.num_rows == len(sample_df)
        assert table.num_columns == len(sample_df.columns)
        assert set(table.column_names) == set(sample_df.columns)

    def test_serialize_dataframe_arrow_preserves_types(self):
        """Test that Arrow serialization preserves numeric types accurately."""
        import base64
        import pyarrow as pa

        df = pd.DataFrame({
            'int_col': [1, 2, 3],
            'float_col': [1.1, 2.2, 3.3],
            'str_col': ['a', 'b', 'c'],
            'bool_col': [True, False, True],
        })
        result = serialize_dataset(df, "typed", use_arrow=True)
        assert result["format"] == "arrow"

        arrow_bytes = base64.b64decode(result["data"])
        table = pa.ipc.open_stream(arrow_bytes).read_all()
        assert table.column('int_col').to_pylist() == [1, 2, 3]
        assert table.column('float_col').to_pylist() == pytest.approx([1.1, 2.2, 3.3])
        assert table.column('str_col').to_pylist() == ['a', 'b', 'c']
        assert table.column('bool_col').to_pylist() == [True, False, True]

    def test_serialize_dataframe_arrow_with_cities(self):
        """Test Arrow serialization with city data (parallel to JSON test)."""
        import base64
        import pyarrow as pa

        df = pd.DataFrame({
            'City': ['Buenos Aires', 'Brasilia', 'Santiago', 'Bogota', 'Caracas'],
            'Country': ['Argentina', 'Brazil', 'Chile', 'Colombia', 'Venezuela'],
            'Latitude': [-34.58, -15.78, -33.45, 4.60, 10.48],
            'Longitude': [-58.66, -47.91, -70.66, -74.08, -66.86],
        })
        result = serialize_dataset(df, "cities", use_arrow=True)
        assert result["format"] == "arrow"

        arrow_bytes = base64.b64decode(result["data"])
        table = pa.ipc.open_stream(arrow_bytes).read_all()
        assert table.num_rows == 5
        assert 'City' in table.column_names
        assert 'Latitude' in table.column_names
        assert table.column('City').to_pylist()[0] == 'Buenos Aires'

    def test_serialize_dataframe_arrow_empty(self):
        """Test Arrow serialization of empty DataFrame."""
        import base64
        import pyarrow as pa

        df = pd.DataFrame({'col1': pd.Series([], dtype='float64'), 'col2': pd.Series([], dtype='str')})
        result = serialize_dataset(df, "empty", use_arrow=True)
        assert result["format"] == "arrow"

        arrow_bytes = base64.b64decode(result["data"])
        table = pa.ipc.open_stream(arrow_bytes).read_all()
        assert table.num_rows == 0
        assert set(table.column_names) == {'col1', 'col2'}

    def test_serialize_dataframe_arrow_default_off(self, sample_df):
        """Test that use_arrow=False (default) still produces JSON format."""
        result = serialize_dataset(sample_df, "test", use_arrow=False)
        assert result["format"] == "df"
        assert "columns" in result["data"]
        assert "data" in result["data"]

    def test_serialize_geodataframe_ignores_use_arrow(self, sample_gdf):
        """Test that GeoDataFrame always uses geoarrow regardless of use_arrow flag."""
        result = serialize_dataset(sample_gdf, "test", use_arrow=True)
        assert result["format"] == "geoarrow"


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

    def test_serialize_geojson_string_is_detected(self):
        """A valid GeoJSON string should be routed to geojson format, not csv."""
        import json
        geojson_str = json.dumps({
            "type": "FeatureCollection",
            "features": [],
        })
        result = serialize_dataset(geojson_str, "geo")
        assert result["format"] == "geojson"
        assert result["data"]["type"] == "FeatureCollection"

    def test_serialize_plain_csv_string_is_csv(self):
        """A plain CSV string should not be confused with GeoJSON."""
        csv = "lat,lng\n37.77,-122.42"
        result = serialize_dataset(csv, "csv")
        assert result["format"] == "csv"
        assert result["data"] == csv

    def test_serialize_dataframe_with_nan(self):
        """NaN values in a DataFrame should not raise during serialization,
        and the row containing NaN should be preserved (not dropped)."""
        import math
        df = pd.DataFrame({'a': [1.0, float('nan'), 3.0]})
        result = serialize_dataset(df, "nan_test")
        assert result["format"] == "df"
        rows = result["data"]["data"]
        assert len(rows) == 3
        assert rows[0][0] == pytest.approx(1.0)
        assert math.isnan(rows[1][0])
        assert rows[2][0] == pytest.approx(3.0)

    def test_serialize_dataframe_arrow_with_nan(self):
        """Arrow serialization of a DataFrame containing NaN should not raise,
        and NaN should round-trip as null in Arrow."""
        import base64
        import pyarrow as pa
        df = pd.DataFrame({'a': [1.0, float('nan'), 3.0]})
        result = serialize_dataset(df, "nan_arrow", use_arrow=True)
        assert result["format"] == "arrow"
        table = pa.ipc.open_stream(base64.b64decode(result["data"])).read_all()
        assert table.num_rows == 3
        values = table.column('a').to_pylist()
        assert values[0] == pytest.approx(1.0)
        assert values[1] is None  # NaN becomes null in Arrow
        assert values[2] == pytest.approx(3.0)

    def test_data_to_json_returns_all_datasets(self, sample_df, sample_gdf):
        """data_to_json should serialize every dataset in the dict."""
        from keplergl.serializers import data_to_json

        class FakeWidget:
            _use_arrow = False

        result = data_to_json({"tab": sample_df, "geo": sample_gdf}, FakeWidget())
        assert "tab" in result
        assert "geo" in result
        assert result["tab"]["format"] == "df"
        assert result["geo"]["format"] == "geoarrow"

    def test_data_from_json_passthrough(self, sample_df):
        """data_from_json is a passthrough — returned value equals input."""
        from keplergl.serializers import data_from_json
        payload = {"foo": {"id": "foo", "format": "csv", "data": "a,b\n1,2"}}
        assert data_from_json(payload, None) is payload

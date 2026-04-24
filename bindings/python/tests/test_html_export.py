# SPDX-License-Identifier: MIT
# Copyright contributors to the kepler.gl project

"""Tests for save_to_html and HTML export functionality."""

import json
import os
import pandas as pd
import geopandas as gpd
import pytest
from shapely.geometry import Point

from keplergl import KeplerGl
from keplergl._html_export import (
    _dataset_to_csv,
    _dataset_to_geojson,
    _serialize_datasets_for_html,
    export_map_html,
)


class TestDatasetToCsv:
    """Tests for _dataset_to_csv conversion."""

    def test_dataframe(self, sample_df):
        result = _dataset_to_csv(sample_df)
        assert "lat" in result
        assert "lng" in result
        assert "37.7749" in result

    def test_geodataframe_converts_geometry_to_wkt(self, sample_gdf):
        result = _dataset_to_csv(sample_gdf)
        assert "name" in result
        assert "POINT" in result

    def test_geodataframe_reprojects_to_4326(self):
        gdf = gpd.GeoDataFrame(
            {"name": ["A"]},
            geometry=[Point(500000, 4649776)],
            crs="EPSG:32610",
        )
        result = _dataset_to_csv(gdf)
        assert "POINT" in result
        assert "name" in result

    def test_geodataframe_already_4326_no_reproject(self, sample_gdf):
        """Ensure CRS EPSG:4326 data is not needlessly reprojected."""
        result = _dataset_to_csv(sample_gdf)
        assert "POINT" in result
        assert "-122.41" in result
        assert "37.77" in result

    def test_geodataframe_no_crs_skips_reproject(self):
        """GeoDataFrame with no CRS should not trigger reprojection."""
        gdf = gpd.GeoDataFrame(
            {"name": ["A"]},
            geometry=[Point(-122.4, 37.8)],
        )
        assert gdf.crs is None
        result = _dataset_to_csv(gdf)
        assert "POINT" in result

    def test_csv_string_passthrough(self):
        csv = "lat,lng\n37.7749,-122.4194"
        assert _dataset_to_csv(csv) == csv

    def test_unsupported_type_returns_none(self):
        assert _dataset_to_csv(12345) is None

    def test_empty_dataframe(self):
        df = pd.DataFrame({"a": [], "b": []})
        result = _dataset_to_csv(df)
        assert "a" in result
        assert "b" in result


class TestDatasetToGeojson:
    """Tests for _dataset_to_geojson conversion."""

    def test_geodataframe(self, sample_gdf):
        result = _dataset_to_geojson(sample_gdf)
        assert result is not None
        assert result["type"] == "FeatureCollection"
        assert len(result["features"]) == 2

    def test_geodataframe_reprojects_non_4326(self):
        """GeoDataFrame in non-4326 CRS should be reprojected."""
        gdf = gpd.GeoDataFrame(
            {"name": ["A"]},
            geometry=[Point(500000, 4649776)],
            crs="EPSG:32610",
        )
        result = _dataset_to_geojson(gdf)
        assert result is not None
        coords = result["features"][0]["geometry"]["coordinates"]
        assert -125 < coords[0] < -119
        assert 37 < coords[1] < 43

    def test_geodataframe_already_4326_no_reproject(self, sample_gdf):
        """Ensure CRS EPSG:4326 data is not needlessly reprojected."""
        result = _dataset_to_geojson(sample_gdf)
        coords = result["features"][0]["geometry"]["coordinates"]
        assert abs(coords[0] - (-122.4194)) < 1e-4
        assert abs(coords[1] - 37.7749) < 1e-4

    def test_geodataframe_no_crs_skips_reproject(self):
        """GeoDataFrame with no CRS should not trigger reprojection."""
        gdf = gpd.GeoDataFrame(
            {"name": ["A"]},
            geometry=[Point(-122.4, 37.8)],
        )
        assert gdf.crs is None
        result = _dataset_to_geojson(gdf)
        assert result is not None
        coords = result["features"][0]["geometry"]["coordinates"]
        assert abs(coords[0] - (-122.4)) < 1e-4

    def test_geojson_dict(self):
        geojson = {"type": "FeatureCollection", "features": []}
        assert _dataset_to_geojson(geojson) is geojson

    def test_geojson_feature_dict(self):
        feature = {
            "type": "Feature",
            "geometry": {"type": "Point", "coordinates": [0, 0]},
            "properties": {},
        }
        assert _dataset_to_geojson(feature) is feature

    def test_geojson_string(self):
        geojson_str = json.dumps({"type": "FeatureCollection", "features": []})
        result = _dataset_to_geojson(geojson_str)
        assert result is not None
        assert result["type"] == "FeatureCollection"

    def test_non_geojson_dict_returns_none(self):
        assert _dataset_to_geojson({"key": "value"}) is None

    def test_non_geojson_string_returns_none(self):
        assert _dataset_to_geojson("just a csv string\n1,2,3") is None

    def test_dataframe_returns_none(self):
        df = pd.DataFrame({"x": [1]})
        assert _dataset_to_geojson(df) is None

    def test_int_returns_none(self):
        assert _dataset_to_geojson(42) is None

    def test_geodataframe_with_datetime(self):
        """GeoDataFrame with datetime column should serialize without error."""
        gdf = gpd.GeoDataFrame(
            {
                "name": ["A", "B"],
                "timestamp": pd.to_datetime(["2024-01-01", "2024-06-15"]),
            },
            geometry=[Point(-122.4, 37.8), Point(-118.2, 34.0)],
            crs="EPSG:4326",
        )
        result = _dataset_to_geojson(gdf)
        assert result is not None
        assert result["type"] == "FeatureCollection"
        assert len(result["features"]) == 2
        ts_val = result["features"][0]["properties"]["timestamp"]
        assert "2024" in str(ts_val)

    def test_geodataframe_with_datetime_custom_encoder(self):
        """json_encoder=None should raise on datetime columns."""
        gdf = gpd.GeoDataFrame(
            {
                "name": ["A"],
                "timestamp": pd.to_datetime(["2024-01-01"]),
            },
            geometry=[Point(-122.4, 37.8)],
            crs="EPSG:4326",
        )
        with pytest.raises(TypeError):
            _dataset_to_geojson(gdf, json_encoder=None)


class TestSerializeDatasetsForHtml:
    """Tests for _serialize_datasets_for_html JS snippet generation."""

    def test_dataframe_produces_processCsvData_call(self, sample_df):
        js = _serialize_datasets_for_html({"cities": sample_df})
        assert "processCsvData" in js
        assert '"cities"' in js

    def test_geojson_dict_produces_processGeojson_call(self):
        geojson = {"type": "FeatureCollection", "features": []}
        js = _serialize_datasets_for_html({"geo": geojson})
        assert "processGeojson" in js
        assert '"geo"' in js

    def test_geodataframe_produces_processGeojson_call(self, sample_gdf):
        js = _serialize_datasets_for_html({"points": sample_gdf})
        assert "processGeojson" in js
        assert '"points"' in js

    def test_csv_string_produces_processCsvData_call(self):
        js = _serialize_datasets_for_html({"csv": "a,b\n1,2"})
        assert "processCsvData" in js

    def test_multiple_datasets(self, sample_df, sample_gdf):
        js = _serialize_datasets_for_html({
            "tabular": sample_df,
            "spatial": sample_gdf,
        })
        assert "processCsvData" in js
        assert "processGeojson" in js
        assert '"tabular"' in js
        assert '"spatial"' in js

    def test_empty_data(self):
        js = _serialize_datasets_for_html({})
        assert js == ""

    def test_geodataframe_with_datetime(self):
        """Datetime columns in GeoDataFrame should not break JS snippet generation."""
        gdf = gpd.GeoDataFrame(
            {
                "name": ["A"],
                "ts": pd.to_datetime(["2024-03-01"]),
            },
            geometry=[Point(-122.4, 37.8)],
            crs="EPSG:4326",
        )
        js = _serialize_datasets_for_html({"events": gdf})
        assert "processGeojson" in js
        assert "2024" in js


class TestExportMapHtml:
    """Tests for the full export_map_html function."""

    def test_returns_valid_html(self, sample_df):
        html = export_map_html(data={"test": sample_df}, config={})
        assert html.startswith("<!DOCTYPE html>")
        assert "</html>" in html

    def test_contains_kepler_gl_cdn_script(self, sample_df):
        html = export_map_html(
            data={"test": sample_df},
            config={},
            kepler_gl_version="3.2.6",
        )
        assert "unpkg.com/kepler.gl@3.2.6/umd/keplergl.min.js" in html
        assert "unpkg.com/kepler.gl@3.2.6/umd/keplergl.min.css" in html

    def test_default_uses_latest_stable_cdn_tag(self, sample_df):
        html = export_map_html(data={"test": sample_df}, config={})
        assert "unpkg.com/kepler.gl@3/umd/keplergl.min.js" in html
        assert "unpkg.com/kepler.gl@3/umd/keplergl.min.css" in html

    def test_contains_react_redux_deps(self, sample_df):
        html = export_map_html(data={"test": sample_df}, config={})
        assert "react.production.min.js" in html
        assert "react-dom.production.min.js" in html
        assert "redux.js" in html
        assert "react-redux.min.js" in html
        assert "styled-components.min.js" in html

    def test_contains_dataset(self, sample_df):
        html = export_map_html(data={"my_data": sample_df}, config={})
        assert "my_data" in html
        assert "processCsvData" in html

    def test_read_only_mode(self, sample_df):
        html = export_map_html(data={"d": sample_df}, config={}, read_only=True)
        assert "readOnly: true" in html

    def test_edit_mode(self, sample_df):
        html = export_map_html(data={"d": sample_df}, config={}, read_only=False)
        assert "readOnly: false" in html

    def test_center_map(self, sample_df):
        html = export_map_html(data={"d": sample_df}, config={}, center_map=True)
        assert "centerMap: true" in html

    def test_mapbox_token_embedded(self, sample_df):
        html = export_map_html(
            data={"d": sample_df},
            config={},
            mapbox_token="pk.test_token_123",
        )
        assert "pk.test_token_123" in html

    def test_config_embedded(self, sample_df):
        config = {"version": "v1", "config": {"mapState": {"zoom": 12}}}
        html = export_map_html(data={"d": sample_df}, config=config)
        assert '"zoom": 12' in html
        assert '"version": "v1"' in html

    def test_empty_config(self, sample_df):
        html = export_map_html(data={"d": sample_df}, config={})
        assert "var config = {};" in html

    def test_none_config(self, sample_df):
        html = export_map_html(data={"d": sample_df}, config=None)
        assert "var config = {};" in html

    def test_addDataToMap_dispatch(self, sample_df):
        html = export_map_html(data={"d": sample_df}, config={})
        assert "addDataToMap" in html
        assert "store.dispatch" in html

    def test_geojson_dataset(self):
        geojson = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [-122.4, 37.8]},
                "properties": {"name": "SF"},
            }],
        }
        html = export_map_html(data={"geo": geojson}, config={})
        assert "processGeojson" in html
        assert "FeatureCollection" in html


class TestSaveToHtml:
    """Tests for the KeplerGl.save_to_html widget method."""

    def test_saves_file(self, sample_df, tmp_path):
        widget = KeplerGl(data={"cities": sample_df})
        out = str(tmp_path / "map.html")
        widget.save_to_html(file_name=out)
        assert os.path.exists(out)
        with open(out) as f:
            content = f.read()
        assert "<!DOCTYPE html>" in content
        assert "cities" in content
        assert "unpkg.com/kepler.gl@3/umd/keplergl.min.js" in content

    def test_saves_with_config(self, sample_df, tmp_path):
        config = {"version": "v1", "config": {"mapState": {"zoom": 5}}}
        widget = KeplerGl(data={"d": sample_df}, config=config)
        out = str(tmp_path / "map.html")
        widget.save_to_html(file_name=out)
        with open(out) as f:
            content = f.read()
        assert '"zoom": 5' in content

    def test_saves_with_override_data(self, sample_df, tmp_path):
        widget = KeplerGl(data={"original": sample_df})
        override = pd.DataFrame({"x": [1, 2], "y": [3, 4]})
        out = str(tmp_path / "map.html")
        widget.save_to_html(file_name=out, data={"override": override})
        with open(out) as f:
            content = f.read()
        assert "override" in content
        assert "original" not in content

    def test_saves_with_geodataframe(self, sample_gdf, tmp_path):
        widget = KeplerGl(data={"geo": sample_gdf})
        out = str(tmp_path / "map.html")
        widget.save_to_html(file_name=out)
        with open(out) as f:
            content = f.read()
        assert "processGeojson" in content

    def test_saves_read_only(self, sample_df, tmp_path):
        widget = KeplerGl(data={"d": sample_df})
        out = str(tmp_path / "map.html")
        widget.save_to_html(file_name=out, read_only=True)
        with open(out) as f:
            content = f.read()
        assert "readOnly: true" in content

    def test_default_filename(self, sample_df, tmp_path):
        original_cwd = os.getcwd()
        try:
            os.chdir(tmp_path)
            widget = KeplerGl(data={"d": sample_df})
            widget.save_to_html()
            assert os.path.exists("keplergl_map.html")
        finally:
            os.chdir(original_cwd)

    def test_print_message(self, sample_df, tmp_path, capsys):
        widget = KeplerGl(data={"d": sample_df})
        out = str(tmp_path / "test.html")
        widget.save_to_html(file_name=out)
        captured = capsys.readouterr()
        assert "Map saved to" in captured.out
        assert out in captured.out

    def test_html_is_utf8(self, tmp_path):
        df = pd.DataFrame({"city": ["São Paulo", "Zürich"], "lat": [-23.5, 47.4], "lng": [-46.6, 8.5]})
        widget = KeplerGl(data={"intl": df})
        out = str(tmp_path / "map.html")
        widget.save_to_html(file_name=out)
        with open(out, encoding="utf-8") as f:
            content = f.read()
        assert "São Paulo" in content
        assert "Zürich" in content

    def test_saves_geodataframe_with_datetime(self, tmp_path):
        """Regression: GeoDataFrame with datetime column should export to HTML."""
        gdf = gpd.GeoDataFrame(
            {
                "name": ["SF"],
                "timestamp": pd.to_datetime(["2024-01-15 10:30:00"]),
            },
            geometry=[Point(-122.4, 37.8)],
            crs="EPSG:4326",
        )
        widget = KeplerGl(data={"events": gdf})
        out = str(tmp_path / "map.html")
        widget.save_to_html(file_name=out)
        with open(out, encoding="utf-8") as f:
            content = f.read()
        assert "processGeojson" in content
        assert "2024" in content

    def test_saves_with_custom_json_encoder(self, sample_gdf, tmp_path):
        """json_encoder parameter is forwarded through save_to_html."""
        widget = KeplerGl(data={"geo": sample_gdf})
        out = str(tmp_path / "map.html")
        widget.save_to_html(file_name=out, json_encoder=repr)
        assert os.path.exists(out)

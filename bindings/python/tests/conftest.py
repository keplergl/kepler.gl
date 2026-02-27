"""Pytest configuration."""

import pytest
import pandas as pd
import geopandas as gpd
from shapely.geometry import Point


@pytest.fixture
def sample_df():
    return pd.DataFrame({
        "lat": [37.7749, 34.0522],
        "lng": [-122.4194, -118.2437],
        "value": [100, 200],
    })


@pytest.fixture
def sample_gdf():
    return gpd.GeoDataFrame(
        {"name": ["SF", "LA"]},
        geometry=[Point(-122.4194, 37.7749), Point(-118.2437, 34.0522)],
        crs="EPSG:4326",
    )

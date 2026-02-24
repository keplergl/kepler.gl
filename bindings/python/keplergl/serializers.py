"""Data serialization for Python <-> JavaScript communication."""

import base64
from typing import Any

import pandas as pd
import geopandas as gpd
import pyarrow as pa

DEBUG = False

def _debug(msg):
    if DEBUG:
        print(f"[keplergl-serializer] {msg}")


def _try_parse_geojson(data: str) -> dict | None:
    """Try to parse a string as GeoJSON. Returns parsed dict if valid GeoJSON, None otherwise."""
    import json
    try:
        parsed = json.loads(data)
        if isinstance(parsed, dict):
            # Check for GeoJSON indicators
            geojson_types = {"FeatureCollection", "Feature", "Point", "MultiPoint",
                           "LineString", "MultiLineString", "Polygon", "MultiPolygon",
                           "GeometryCollection"}
            if parsed.get("type") in geojson_types:
                return parsed
    except (json.JSONDecodeError, TypeError):
        pass
    return None


def data_to_json(data: dict, widget) -> dict:
    """Serialize Python data for JavaScript consumption."""
    _debug(f"data_to_json called with {len(data)} datasets")
    result = {}
    for name, dataset in data.items():
        _debug(f"  Serializing dataset '{name}' of type {type(dataset).__name__}")
        result[name] = serialize_dataset(dataset, name)
        _debug(f"  Result format: {result[name].get('format')}")
    _debug(f"data_to_json result: {list(result.keys())}")
    return result


def data_from_json(data: dict, widget) -> dict:
    """Deserialize JavaScript data to Python (passthrough)."""
    return data


def serialize_dataset(data: Any, name: str) -> dict:
    """Serialize a single dataset."""
    if isinstance(data, gpd.GeoDataFrame):
        return serialize_geodataframe(data, name)
    elif isinstance(data, pd.DataFrame):
        return serialize_dataframe(data, name)
    elif isinstance(data, str):
        # Try to detect if the string is GeoJSON
        geojson_data = _try_parse_geojson(data)
        if geojson_data is not None:
            _debug(f"  Detected GeoJSON string for '{name}'")
            return {"id": name, "data": geojson_data, "format": "geojson"}
        # Otherwise treat as CSV
        return {"id": name, "data": data, "format": "csv"}
    elif isinstance(data, dict):
        return {"id": name, "data": data, "format": "geojson"}
    else:
        raise ValueError(f"Unsupported data type: {type(data)}")


def serialize_dataframe(df: pd.DataFrame, name: str) -> dict:
    """Serialize DataFrame to JSON format for kepler.gl.
    
    We use JSON format instead of Arrow to avoid version mismatch issues
    between the apache-arrow package used here and the one bundled with kepler.gl.
    """
    columns = df.columns.tolist()
    rows = df.values.tolist()
    _debug(f"serialize_dataframe: {len(columns)} columns, {len(rows)} rows")
    _debug(f"  columns: {columns}")
    _debug(f"  first row: {rows[0] if rows else 'empty'}")
    return {
        "id": name,
        "data": {
            "columns": columns,
            "data": rows,
        },
        "format": "df",
    }


def serialize_geodataframe(gdf: gpd.GeoDataFrame, name: str) -> dict:
    """Serialize GeoDataFrame to GeoArrow format."""
    import geoarrow.pyarrow as ga

    # Convert geometry column to geoarrow format
    geom_col = gdf.geometry.name
    geom_array = ga.as_geoarrow(gdf.geometry)

    # Build table with non-geometry columns as regular Arrow arrays
    non_geom_cols = [c for c in gdf.columns if c != geom_col]
    arrays = [pa.array(gdf[c]) for c in non_geom_cols]
    arrays.append(geom_array)
    col_names = non_geom_cols + [geom_col]

    table = pa.table(dict(zip(col_names, arrays)))
    sink = pa.BufferOutputStream()
    with pa.ipc.new_stream(sink, table.schema) as writer:
        writer.write_table(table)
    arrow_bytes = sink.getvalue().to_pybytes()
    return {
        "id": name,
        "data": base64.b64encode(arrow_bytes).decode("utf-8"),
        "format": "geoarrow",
    }

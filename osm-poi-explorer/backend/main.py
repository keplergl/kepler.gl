from fastapi import FastAPI, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import asyncpg
import pyarrow as pa
import pyarrow.parquet as pq
import io

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.environ.get("DATABASE_URL")

class POI(BaseModel):
    id: int
    name: Optional[str]
    category: str
    subcategory: str
    lat: float
    lon: float

@app.get("/api/pois")
async def get_pois(
    min_lon: float = Query(...),
    min_lat: float = Query(...),
    max_lon: float = Query(...),
    max_lat: float = Query(...)
):
    conn = await asyncpg.connect(DATABASE_URL)
    # Limit to 10k to prevent overload, but MVT will handle the full view
    query = """
        SELECT osm_id, name, category, subcategory, tags, ST_X(geom) as lon, ST_Y(geom) as lat
        FROM pois
        WHERE geom && ST_MakeEnvelope($1, $2, $3, $4, 4326)
        LIMIT 10000
    """
    rows = await conn.fetch(query, min_lon, min_lat, max_lon, max_lat)
    await conn.close()
    
    return [
        {
            "id": row["osm_id"],
            "name": row["name"],
            "category": row["category"],
            "subcategory": row["subcategory"],
            "lat": row["lat"],
            "lon": row["lon"]
        }
        for row in rows
    ]

@app.get("/api/search")
async def search_pois(q: str = Query(..., min_length=3)):
    conn = await asyncpg.connect(DATABASE_URL)
    query = """
        SELECT osm_id, name, category, subcategory, ST_Y(geom) as lat, ST_X(geom) as lon
        FROM pois
        WHERE name ILIKE $1
        LIMIT 10
    """
    # Add wildcards for partial matching
    search_term = f"%{q}%"
    rows = await conn.fetch(query, search_term)
    await conn.close()
    
    return [
        {
            "id": row["osm_id"],
            "name": row["name"],
            "category": row["category"],
            "subcategory": row["subcategory"],
            "lat": row["lat"],
            "lon": row["lon"]
        }
        for row in rows
    ]

@app.get("/api/tiles/{z}/{x}/{y}.pbf")
async def get_tile(z: int, x: int, y: int):
    conn = await asyncpg.connect(DATABASE_URL)
    
    # Calculate tile envelope
    # We use ST_TileEnvelope in PostGIS 3.0+
    # Or manually calculate bounds if needed, but ST_TileEnvelope is standard
    
    query = """
        WITH mvtgeom AS (
            SELECT 
                ST_AsMVTGeom(
                    ST_Transform(geom, 3857),
                    ST_TileEnvelope($1, $2, $3)
                ) AS geom,
                name,
                category,
                subcategory
            FROM pois
            WHERE ST_Transform(geom, 3857) && ST_TileEnvelope($1, $2, $3)
        )
        SELECT ST_AsMVT(mvtgeom.*, 'pois', 4096, 'geom') AS mvt
        FROM mvtgeom;
    """
    
    try:
        mvt = await conn.fetchval(query, z, x, y)
    except Exception as e:
        print(f"Error generating tile: {e}")
        mvt = b""
    finally:
        await conn.close()
        
    return Response(content=mvt, media_type="application/x-protobuf")

@app.get("/api/pois/parquet")
async def get_pois_parquet(
    min_lon: float = Query(...),
    min_lat: float = Query(...),
    max_lon: float = Query(...),
    max_lat: float = Query(...)
):
    conn = await asyncpg.connect(DATABASE_URL)
    # Fetch more data for local analysis since Parquet is efficient
    query = """
        SELECT osm_id, name, category, subcategory, ST_X(geom) as lon, ST_Y(geom) as lat
        FROM pois
        WHERE geom && ST_MakeEnvelope($1, $2, $3, $4, 4326)
        LIMIT 50000
    """
    rows = await conn.fetch(query, min_lon, min_lat, max_lon, max_lat)
    await conn.close()
    
    # Convert to PyArrow Table
    data = {
        "id": [row["osm_id"] for row in rows],
        "name": [row["name"] for row in rows],
        "category": [row["category"] for row in rows],
        "subcategory": [row["subcategory"] for row in rows],
        "lat": [row["lat"] for row in rows],
        "lon": [row["lon"] for row in rows]
    }
    table = pa.Table.from_pydict(data)
    
    # Write to Buffer
    sink = io.BytesIO()
    pq.write_table(table, sink)
    sink.seek(0)
    
    return Response(content=sink.getvalue(), media_type="application/vnd.apache.parquet")

@app.get("/")
def read_root():
    return {"message": "OSM POI Explorer API"}

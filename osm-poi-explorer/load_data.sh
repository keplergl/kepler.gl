#!/bin/bash
set -e

# Usage: ./load_data.sh <path_to_pbf> <database_url>

PBF_FILE=$1
DATABASE_URL=$2

if [ -z "$PBF_FILE" ] || [ -z "$DATABASE_URL" ]; then
    echo "Usage: ./load_data.sh <path_to_pbf> <database_url>"
    echo "Example: ./load_data.sh north-america-latest.osm.pbf postgresql://user:pass@host:port/db"
    exit 1
fi

if ! command -v osm2pgsql &> /dev/null; then
    echo "osm2pgsql could not be found. Please install it (e.g., brew install osm2pgsql)"
    exit 1
fi

echo "Starting ingestion of $PBF_FILE into Railway PostGIS..."
echo "Using style file: pois.lua"

# Run osm2pgsql
# -c: create (overwrite)
# -O flex: use the new flex backend (required for lua scripts)
# -S pois.lua: our custom style
# -d: database URL
osm2pgsql -c -O flex -S pois.lua -d "$DATABASE_URL" "$PBF_FILE"

echo "Ingestion complete!"

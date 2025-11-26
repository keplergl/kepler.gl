#!/bin/bash
set -e

echo "=========================================="
echo "   Geospatial Platform Setup Assistant"
echo "=========================================="

# 1. Check Homebrew
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew is not installed."
    echo "Homebrew is a package manager for Mac that we need to install tools."
    echo ""
    echo "👉 Please copy and run this command in your terminal, then re-run this script:"
    echo '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
    exit 1
fi

# 2. Install Dependencies
echo "✅ Homebrew found."
echo "📦 Checking/Installing Node.js and osm2pgsql..."
brew install node osm2pgsql

# 3. Setup Frontend & Python Utils
echo "🚀 Setting up Frontend dependencies..."
pip3 install psycopg2-binary
cd geo-platform
npm install
cd ..

# 4. Make scripts executable
chmod +x osm-poi-explorer/load_data.sh

echo ""
echo "=========================================="
echo "   Data Ingestion"
echo "=========================================="
echo "We need to load your map data into Railway."
# Hardcoded paths as requested
PBF_PATH="/Users/peterrose/Downloads/north-america-latest.osm.pbf"
DB_URL="postgres://postgres:2AFFgBG4cgAfc1gDdBD2gBbCCgcCCCcC@trolley.proxy.rlwy.net:48980/railway"

echo "Using PBF File: $PBF_PATH"
echo "Using DB URL: $DB_URL"

# Remove quotes if present (just in case)
PBF_PATH="${PBF_PATH%\"}"
PBF_PATH="${PBF_PATH#\"}"
PBF_PATH="${PBF_PATH%\'}"
PBF_PATH="${PBF_PATH#\'}"

echo ""
echo "⏳ Ingesting data... (This might take a while for large files)"
cd osm-poi-explorer
./load_data.sh "$PBF_PATH" "$DB_URL"
cd ..

echo ""
echo "=========================================="
echo "   Starting Application"
echo "=========================================="
echo "Opening the app in your browser..."
cd geo-platform
npm run dev

import json
import os

def generate_sql_schema(taxonomy_path):
    with open(taxonomy_path, 'r') as f:
        taxonomy = json.load(f)

    sql_statements = []
    
    # Create main POI table
    sql_statements.append("""
    CREATE TABLE IF NOT EXISTS pois (
        id SERIAL PRIMARY KEY,
        osm_id BIGINT,
        name TEXT,
        category TEXT,
        subcategory TEXT,
        tags JSONB,
        geom GEOMETRY(Point, 4326)
    );
    """)
    
    # Create indexes
    sql_statements.append("CREATE INDEX IF NOT EXISTS idx_pois_geom ON pois USING GIST (geom);")
    sql_statements.append("CREATE INDEX IF NOT EXISTS idx_pois_category ON pois (category);")
    
    print("-- SQL Schema for OSM POIs")
    print("\n".join(sql_statements))
    
    print("\n-- Taxonomy Mapping Logic (Pseudo-code for ingestion)")
    for category, details in taxonomy.items():
        print(f"-- Category: {category}")
        for tag_key, tag_values in details['tags'].items():
            for value in tag_values:
                print(f"--   IF {tag_key} = '{value}' THEN category = '{category}', subcategory = '{value}'")

if __name__ == "__main__":
    generate_sql_schema('taxonomy.json')

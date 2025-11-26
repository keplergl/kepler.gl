import sys
import psycopg2

def check_coords(db_url):
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    # Get bounding box of all data
    cur.execute("""
        SELECT 
            ST_XMin(ST_Extent(geom)) as min_lon,
            ST_YMin(ST_Extent(geom)) as min_lat,
            ST_XMax(ST_Extent(geom)) as max_lon,
            ST_YMax(ST_Extent(geom)) as max_lat
        FROM pois;
    """)
    bbox = cur.fetchone()
    
    print(f"Data Bounding Box:")
    print(f"  Min Lon: {bbox[0]}")
    print(f"  Min Lat: {bbox[1]}")
    print(f"  Max Lon: {bbox[2]}")
    print(f"  Max Lat: {bbox[3]}")
    
    # Get sample coordinates
    cur.execute("SELECT name, ST_X(geom) as lon, ST_Y(geom) as lat FROM pois LIMIT 10;")
    print("\nSample POI Coordinates:")
    for row in cur.fetchall():
        print(f"  {row[0]}: ({row[1]}, {row[2]})")
    
    conn.close()

if __name__ == "__main__":
    check_coords(sys.argv[1])

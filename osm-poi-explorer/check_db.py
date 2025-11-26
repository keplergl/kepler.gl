import os
import sys
import psycopg2

def check_db(db_url):
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        # Check if table exists
        cur.execute("SELECT to_regclass('public.pois');")
        if cur.fetchone()[0] is None:
            print("❌ Table 'pois' does NOT exist.")
            return

        # Count rows
        cur.execute("SELECT count(*) FROM pois;")
        count = cur.fetchone()[0]
        
        print(f"✅ Connection successful!")
        print(f"📊 Total POIs found: {count}")
        
        if count == 0:
            print("⚠️ The table exists but is empty. Ingestion might have failed or the PBF was empty.")
        else:
            print("🎉 Data ingestion looks good!")
            
        # Check sample
        cur.execute("SELECT name, category FROM pois LIMIT 5;")
        rows = cur.fetchall()
        print("\nSample Data:")
        for row in rows:
            print(f"- {row[0]} ({row[1]})")

        conn.close()
    except Exception as e:
        print(f"❌ Error connecting to database: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 check_db.py <DATABASE_URL>")
        sys.exit(1)
    
    check_db(sys.argv[1])

import asyncio
import asyncpg
import os

# PASTE YOUR RAILWAY DATABASE URL HERE
# (Or set it as an environment variable: export DATABASE_URL="...")
DATABASE_URL = os.environ.get("DATABASE_URL")

async def optimize():
    if not DATABASE_URL:
        print("❌ Error: DATABASE_URL is not set.")
        print("Please export it: export DATABASE_URL='postgres://...'")
        return

    print(f"🔌 Connecting to database...")
    try:
        conn = await asyncpg.connect(DATABASE_URL)
        
        print("🚀 Creating Spatial Index (this might take a minute)...")
        await conn.execute("CREATE INDEX IF NOT EXISTS pois_geom_idx ON pois USING GIST (geom);")
        print("✅ Index created!")

        print("🧹 Optimizing table statistics (VACUUM ANALYZE)...")
        await conn.execute("VACUUM ANALYZE pois;")
        print("✅ Optimization complete!")
        
        await conn.close()
        print("✨ Database is now optimized for spatial queries!")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(optimize())

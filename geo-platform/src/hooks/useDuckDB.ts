import { useState, useEffect, useCallback } from 'react';
import * as duckdb from '@duckdb/duckdb-wasm';
import duckdb_wasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url';
import mvp_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url';
import duckdb_eh from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url';
import eh_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url';

const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
    mvp: {
        mainModule: duckdb_wasm,
        mainWorker: mvp_worker,
    },
    eh: {
        mainModule: duckdb_eh,
        mainWorker: eh_worker,
    },
};

export const useDuckDB = () => {
    const [db, setDb] = useState<duckdb.AsyncDuckDB | null>(null);
    const [conn, setConn] = useState<duckdb.AsyncDuckDBConnection | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            try {
                // Select bundle based on browser support
                const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);

                // Instantiate worker
                const worker = new Worker(bundle.mainWorker!);
                const logger = new duckdb.ConsoleLogger();
                const dbInstance = new duckdb.AsyncDuckDB(logger, worker);

                await dbInstance.instantiate(bundle.mainModule, bundle.pthreadWorker);
                const connection = await dbInstance.connect();

                setDb(dbInstance);
                setConn(connection);
                setIsLoading(false);
                console.log("🦆 DuckDB Initialized!");
            } catch (err: any) {
                console.error("Failed to initialize DuckDB:", err);
                setError(err.message);
                setIsLoading(false);
            }
        };

        init();

        return () => {
            if (conn) conn.close();
            if (db) db.terminate();
        };
    }, []);

    const query = useCallback(async (sql: string) => {
        if (!conn) return null;
        try {
            const result = await conn.query(sql);
            return result.toArray().map((row) => row.toJSON());
        } catch (err: any) {
            console.error("DuckDB Query Error:", err);
            throw err;
        }
    }, [conn]);

    const importParquet = useCallback(async (url: string, tableName: string) => {
        if (!db || !conn) return;
        try {
            await db.registerFileURL(tableName + '.parquet', url, duckdb.DuckDBDataProtocol.HTTP, false);
            await conn.query(`CREATE TABLE ${tableName} AS SELECT * FROM read_parquet('${tableName}.parquet')`);
            console.log(`Loaded ${tableName} from ${url}`);
        } catch (err: any) {
            console.error("Failed to import Parquet:", err);
            throw err;
        }
    }, [db, conn]);

    return { db, conn, isLoading, error, query, importParquet };
};

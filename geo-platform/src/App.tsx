import { useState } from 'react';
import { SidePanel } from './components/SidePanel';

import { Button } from './components/Button';
import { MapView } from './components/MapView';
import { ProjectList } from './components/ProjectList';
import { SearchBar } from './components/SearchBar';
import { useDuckDB } from './hooks/useDuckDB';
import { colors } from './theme/tokens';


const INITIAL_VIEW_STATE = {
    longitude: -98.5795,
    latitude: 39.8283,
    zoom: 4,
    pitch: 0,
    bearing: 0
};

// const BACKEND_URL = 'http://localhost:8000';
const BACKEND_URL = 'https://osm-poi-explorer-backend-production.up.railway.app';
const TILE_URL = `${BACKEND_URL}/api/tiles/{z}/{x}/{y}.pbf`;



function App() {
    // App State
    const [view, setView] = useState<'projects' | 'analysis'>('projects');
    const [activeProject, setActiveProject] = useState<any>(null);

    // Map State
    const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
    const [useTiles, setUseTiles] = useState(true);

    // Data State for Local Analysis
    const [data, setData] = useState<any[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const { conn, query, importParquet } = useDuckDB();



    // --- Project Management ---
    const handleOpenProject = (project: any) => {
        setActiveProject(project);
        setView('analysis');
    };

    // --- Data Loading (DuckDB) ---
    const handleLoadLocalData = async () => {
        setIsLoadingData(true);
        try {
            // Load Parquet data from backend into DuckDB
            const parquetUrl = `${BACKEND_URL}/api/pois/parquet?min_lon=-125&min_lat=25&max_lon=-65&max_lat=50`;

            if (conn && importParquet) {
                await importParquet(parquetUrl, 'pois');
                const result = await query('SELECT * FROM pois LIMIT 10000');
                if (result) {
                    setData(result);
                    setUseTiles(false); // Switch to local view
                }
            }
        } catch (err) {
            console.error("Failed to load data:", err);
        } finally {
            setIsLoadingData(false);
        }
    };


    // --- Search ---
    const handleSearch = async (q: string) => {
        if (!q || q.length < 3) return [];

        try {
            const response = await fetch(`${BACKEND_URL}/api/search?q=${encodeURIComponent(q)}`);
            if (response.ok) {
                const results = await response.json();
                return results;
            }
        } catch (err) {
            console.error("Search failed:", err);
        }
        return [];
    };

    const handleSelectSearchResult = (result: any) => {
        setViewState({
            ...viewState,
            longitude: result.lon,
            latitude: result.lat,
            zoom: 14,
            transitionDuration: 1000
        } as any);
        // TODO: Show POI details in a panel
    };

    // --- Render ---
    if (view === 'projects') {
        return (
            <div style={{ background: colors.background, minHeight: '100vh' }}>
                <ProjectList
                    projects={[
                        {
                            id: '1',
                            name: 'North America Retail Analysis',
                            description: 'Analyzing coffee shop density and competitor locations.',
                            lastModified: new Date().toISOString(),
                            datasetCount: 1,
                        }
                    ]}
                    onNewProject={() => console.log("New Project")}
                    onOpenProject={handleOpenProject}
                />
            </div>
        );
    }

    // Analysis View

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', background: colors.background }}>
            <MapView
                viewState={viewState}
                onViewStateChange={setViewState}
                tileUrl={TILE_URL}
                points={useTiles ? [] : data}
                showTiles={useTiles}
                onPointClick={() => { }}
            />

            {/* Top Bar (Search & Project Nav) */}
            <div style={{
                position: 'absolute', top: '20px', left: '20px', right: '20px',
                display: 'flex', gap: '16px', pointerEvents: 'none', zIndex: 10
            }}>
                <div style={{ pointerEvents: 'auto' }}>
                    <Button variant="secondary" onClick={() => setView('projects')}>← Projects</Button>
                </div>
                <div style={{ flex: 1, maxWidth: '400px', pointerEvents: 'auto' }}>
                    <SearchBar onSearch={handleSearch} onSelect={handleSelectSearchResult} />
                </div>
            </div>

            {/* Side Panel */}
            <SidePanel>
                <div style={{ marginBottom: '24px' }}>
                    <h2 style={{ margin: '0 0 8px 0', color: colors.text, fontFamily: 'Inter', fontWeight: 600 }}>{activeProject?.name}</h2>
                    <p style={{ margin: 0, color: colors.textMuted, fontSize: '13px', fontFamily: 'Inter' }}>
                        {useTiles ? 'Viewing Vector Tiles (Server)' : `Viewing Local Data (DuckDB) - ${data.length.toLocaleString()} POIs`}
                    </p>
                </div>

                <div style={{ marginBottom: '24px', display: 'flex', gap: '8px' }}>
                    <Button
                        variant={useTiles ? 'primary' : 'secondary'}
                        onClick={() => setUseTiles(true)}
                        size="sm"
                    >
                        Global Map
                    </Button>
                    <Button
                        variant={!useTiles ? 'primary' : 'secondary'}
                        onClick={handleLoadLocalData}
                        size="sm"
                        disabled={isLoadingData}
                    >
                        {isLoadingData ? 'Loading...' : 'Local Analysis'}
                    </Button>
                </div>

                {!useTiles && data.length > 0 && (
                    <div style={{ padding: '16px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', fontSize: '14px', color: '#10B981', fontFamily: 'Inter' }}>
                        ✓ Loaded {data.length.toLocaleString()} POIs into DuckDB for local analysis.
                    </div>
                )}

                {useTiles && (
                    <div style={{ padding: '16px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', fontSize: '14px', color: '#93C5FD', fontFamily: 'Inter' }}>
                        Showing all 2.3M+ POIs via vector tiles from the backend.
                    </div>
                )}
            </SidePanel>
        </div>
    );
}

export default App;

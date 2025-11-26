import React from 'react';
import DeckGL from '@deck.gl/react';
import { Map } from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import { MVTLayer } from '@deck.gl/geo-layers';
import { ScatterplotLayer } from '@deck.gl/layers';
import { getCategoryColor } from '../theme/tokens';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

interface ViewState {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch: number;
    bearing: number;
}

interface MapViewProps {
    viewState: ViewState;
    onViewStateChange: (viewState: ViewState) => void;
    tileUrl?: string;
    points?: any[]; // For fallback/filtered view
    showTiles?: boolean;
    onPointClick?: (poi: any) => void;
}

export const MapView: React.FC<MapViewProps> = ({
    viewState,
    onViewStateChange,
    tileUrl,
    points = [],
    showTiles = true,
    onPointClick,
}) => {
    const layers = [
        // Vector Tile Layer (for seeing all points)
        showTiles && tileUrl && new MVTLayer({
            id: 'pois-mvt',
            data: tileUrl,
            minZoom: 0,
            maxZoom: 23,
            getLineColor: [0, 0, 0],
            getFillColor: (d: any) => {
                const color = getCategoryColor(d.properties.category);
                const rgb = color.match(/\w\w/g)?.map(x => parseInt(x, 16)) || [200, 200, 200];
                return rgb;
            },
            getPointRadius: 4,
            pointRadiusMinPixels: 2,
            pointRadiusMaxPixels: 10,
            pickable: true,
            onClick: (info: any) => {
                if (info.object && onPointClick) {
                    onPointClick({
                        id: info.object.properties.osm_id,
                        name: info.object.properties.name,
                        category: info.object.properties.category,
                        subcategory: info.object.properties.subcategory,
                        lat: info.coordinate[1],
                        lon: info.coordinate[0],
                        tags: info.object.properties.tags ? JSON.parse(info.object.properties.tags) : {}
                    });
                }
            }
        }),

        // Scatterplot Layer (for filtered/local data)
        !showTiles && new ScatterplotLayer({
            id: 'pois-scatter',
            data: points,
            pickable: true,
            opacity: 0.8,
            stroked: true,
            filled: true,
            radiusScale: 6,
            radiusMinPixels: 3,
            radiusMaxPixels: 100,
            lineWidthMinPixels: 1,
            getPosition: (d: any) => [d.lon, d.lat],
            getFillColor: (d: any) => {
                const color = getCategoryColor(d.category);
                const rgb = color.match(/\w\w/g)?.map(x => parseInt(x, 16)) || [200, 200, 200];
                return rgb;
            },
            getLineColor: [0, 0, 0],
            onClick: (info: any) => {
                if (info.object && onPointClick) {
                    onPointClick(info.object);
                }
            }
        })
    ].filter(Boolean);

    return (
        <DeckGL
            viewState={viewState}
            controller={true}
            layers={layers}
            onViewStateChange={({ viewState }: any) => onViewStateChange(viewState)}
            getTooltip={({ object }: any) => object && (object.name || object.properties?.name)}
        >
            <Map
                mapLib={maplibregl as any}
                mapStyle={MAP_STYLE}
            />
        </DeckGL>
    );
};

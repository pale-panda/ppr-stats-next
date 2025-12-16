'use client';

import { useEffect, useMemo, memo } from 'react';
import '@/components/track-map.css';
import { APIProvider, useMap, Map } from '@vis.gl/react-google-maps';
import { LatLngLiteral, Telemetry } from '@/types';

interface TrackMapProps {
  telemetry?: Telemetry;
  selectedLap: number;
  comparisonLap: number | null;
  showComparison: boolean;
  center: LatLngLiteral;
}

type TelemetryEntry = NonNullable<TrackMapProps['telemetry']>[number];

const MapTypeId = {
  HYBRID: 'hybrid',
  ROADMAP: 'roadmap',
  SATELLITE: 'satellite',
  TERRAIN: 'terrain',
};
export type MapConfig = {
  id: string;
  label: string;
  mapId?: string;
  mapTypeId?: string;
  styles?: google.maps.MapTypeStyle[];
};

const mapConfig: MapConfig = {
  id: 'satellite',
  label: 'Satellite',
  mapTypeId: MapTypeId.SATELLITE,
};

interface TelemetryPolylineProps {
  path: google.maps.LatLngLiteral[];
  options: google.maps.PolylineOptions;
}

const TelemetryPolyline = memo(function TelemetryPolyline({
  path,
  options,
}: TelemetryPolylineProps) {
  const map = useMap();

  useEffect(() => {
    if (!map || path.length < 2) {
      return;
    }

    const mapsApi = window.google?.maps;
    if (!mapsApi?.Polyline) {
      return;
    }

    const polyline = new mapsApi.Polyline({
      ...options,
      path,
      map,
    });

    return () => {
      polyline.setMap(null);
    };
  }, [map, options, path]);

  return null;
});

function TrackMap({
  telemetry,
  selectedLap,
  comparisonLap,
  showComparison,
  center,
}: TrackMapProps) {
  const API_KEY =
    (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string) ??
    globalThis.GOOGLE_MAPS_API_KEY;

  const sortedTelemetry = useMemo<TelemetryEntry[]>(() => {
    if (!telemetry?.length) {
      console.error('No telemetry data available: ', telemetry);
      return [];
    }

    return [...telemetry].sort((a, b) => a.record_number - b.record_number);
  }, [telemetry]);

  const selectedLapPath = useMemo<google.maps.LatLngLiteral[]>(() => {
    return sortedTelemetry
      .filter((entry) => entry.lap_number === selectedLap)
      .map((entry) => {
        if (entry.gps_point) return entry.gps_point;
        else return { lat: 0, lng: 0 };
      });
  }, [selectedLap, sortedTelemetry]);

  const comparisonLapPath = useMemo<google.maps.LatLngLiteral[]>(() => {
    if (!showComparison || comparisonLap === null) {
      return [];
    }

    return sortedTelemetry
      .filter((entry) => entry.lap_number === comparisonLap)
      .map((entry) => {
        if (entry.gps_point) return entry.gps_point;
        else return { lat: 0, lng: 0 };
      });
  }, [comparisonLap, showComparison, sortedTelemetry]);

  const selectedPolylineOptions = useMemo<google.maps.PolylineOptions>(
    () => ({
      strokeColor: 'oklch(64.022% 0.24527 24.891)',
      strokeOpacity: 0.8,
      strokeWeight: 3,
      geodesic: true,
      zIndex: 2,
    }),
    []
  );

  const comparisonPolylineOptions = useMemo<google.maps.PolylineOptions>(
    () => ({
      strokeColor: 'oklch(0.75 0.15 85)',
      strokeOpacity: 0.8,
      strokeWeight: 3,
      geodesic: true,
      zIndex: 1,
    }),
    []
  );

  console.log(selectedLapPath);

  return (
    <APIProvider apiKey={API_KEY}>
      <Map
        className='rounded-xl w-full h-full min-h-[400px] border shadow-sm border-border'
        id='track-map'
        defaultCenter={center}
        defaultZoom={15}
        gestureHandling='greedy'
        disableDefaultUI
        mapId={mapConfig.mapId}
        mapTypeId={mapConfig.mapTypeId}
        styles={mapConfig.styles}>
        {selectedLapPath.length > 1 && (
          <TelemetryPolyline
            path={selectedLapPath}
            options={selectedPolylineOptions}
          />
        )}
        {showComparison &&
          comparisonLap !== null &&
          comparisonLapPath.length > 1 && (
            <TelemetryPolyline
              path={comparisonLapPath}
              options={comparisonPolylineOptions}
            />
          )}
      </Map>
    </APIProvider>
  );
}

export default memo(TrackMap);

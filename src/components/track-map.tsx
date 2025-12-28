'use client';

import { useEffect, useMemo, memo } from 'react';
import '@/components/track-map.css';
import { APIProvider, useMap, Map } from '@vis.gl/react-google-maps';
import { LatLngLiteral, Telemetry } from '@/types';
import { useFetchLapTelemetryQuery } from '@/state/services/track-session';

interface TrackMapProps {
  sessionId: string;
  telemetry: Telemetry;
  selectedLap: number;
  comparisonLap: number | null;
  showComparison: boolean;
  center: LatLngLiteral;
}

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
  sessionId,
  telemetry,
  //selectedLap,
  comparisonLap,
  showComparison,
  center,
}: TrackMapProps) {
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

  const selectedLapPath = useMemo<google.maps.LatLngLiteral[]>(() => {
    if (!telemetry) {
      return [];
    }
    return telemetry.map((entry) => {
      if (entry.gps_point) return entry.gps_point;
      else return { lat: 0, lng: 0 };
    });
  }, [telemetry]);

  const {
    data: comparisonTelemetry,
    isLoading: comparisonLoading,
    error: comparisonError,
  } = useFetchLapTelemetryQuery({
    sessionId: sessionId,
    lapNumber: comparisonLap || 0,
    isComparison: true,
  });

  const comparisonLapPath = useMemo<google.maps.LatLngLiteral[]>(() => {
    if (!showComparison || comparisonLap === null || !comparisonTelemetry) {
      return [];
    }

    return comparisonTelemetry.map((entry) => {
      if (entry.gps_point) return entry.gps_point;
      else return { lat: 0, lng: 0 };
    });
  }, [comparisonLap, comparisonTelemetry, showComparison]);

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

  if (comparisonLoading) {
    return <div>Loading comparison telemetry data...</div>;
  }

  if (comparisonError) {
    return <div>Error loading comparison telemetry data.</div>;
  }

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

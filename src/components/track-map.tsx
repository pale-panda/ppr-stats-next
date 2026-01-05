'use client';

import '@/components/track-map.css';
import { LatLngLiteral } from '@/types';
import type { TelemetryPointApp } from '@/types/telemetry.type';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import { memo, useEffect, useMemo } from 'react';

interface TrackMapProps {
  telemetry: TelemetryPointApp[] | [];
  telemetryComparison: TelemetryPointApp[] | [];
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
  telemetry,
  telemetryComparison,
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
      // support both DB (gps_point) and app (gpsPoint) shapes
      const gp = entry.gpsPoint;
      if (gp) return gp as google.maps.LatLngLiteral;
      return { lat: 0, lng: 0 };
    });
  }, [telemetry]);

  const comparisonLapPath = useMemo<google.maps.LatLngLiteral[]>(() => {
    if (!showComparison || comparisonLap === null || !telemetryComparison) {
      return [];
    }

    return telemetryComparison.map((entry) => {
      const gp = entry.gpsPoint;
      if (gp) return gp as google.maps.LatLngLiteral;
      return { lat: 0, lng: 0 };
    });
  }, [comparisonLap, telemetryComparison, showComparison]);

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

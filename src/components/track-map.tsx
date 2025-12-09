'use client';

import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { trackCoordinates } from '@/lib/sessions-data';
import './track-map.css';

interface TrackMapProps {
  selectedLap: number;
  comparisonLap: number | null;
  showComparison: boolean;
}

export function TrackMap({
  selectedLap,
  comparisonLap,
  showComparison,
}: TrackMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = rect.width;
    const height = rect.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate bounds
    const lats = trackCoordinates.map((c) => c.lat);
    const lngs = trackCoordinates.map((c) => c.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const padding = 40;
    const scaleX = (width - padding * 2) / (maxLng - minLng);
    const scaleY = (height - padding * 2) / (maxLat - minLat);
    const scale = Math.min(scaleX, scaleY);

    const offsetX = (width - (maxLng - minLng) * scale) / 2;
    const offsetY = (height - (maxLat - minLat) * scale) / 2;

    const toCanvas = (lat: number, lng: number) => ({
      x: offsetX + (lng - minLng) * scale,
      y: height - offsetY - (lat - minLat) * scale,
    });

    // Draw track background (gray asphalt)
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 24;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    trackCoordinates.forEach((coord, i) => {
      const { x, y } = toCanvas(coord.lat, coord.lng);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw racing line for selected lap
    const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--primary')
      .trim();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    trackCoordinates.forEach((coord, i) => {
      const jitter = Math.sin(i * 0.5 + selectedLap) * 0.00002;
      const { x, y } = toCanvas(coord.lat + jitter, coord.lng + jitter);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw comparison line if enabled
    if (showComparison && comparisonLap) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 4]);
      ctx.beginPath();
      trackCoordinates.forEach((coord, i) => {
        const jitter = Math.sin(i * 0.5 + comparisonLap) * 0.00003;
        const { x, y } = toCanvas(coord.lat + jitter, coord.lng + jitter);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw start/finish line marker
    const startPos = toCanvas(trackCoordinates[0].lat, trackCoordinates[0].lng);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(startPos.x, startPos.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(startPos.x, startPos.y, 5, 0, Math.PI * 2);
    ctx.fill();

    // Draw sector markers
    const sectorIndices = [5, 10, 14];
    sectorIndices.forEach((idx, sectorNum) => {
      const coord = trackCoordinates[idx];
      const { x, y } = toCanvas(coord.lat, coord.lng);

      ctx.fillStyle = '#6b7280';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#9ca3af';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`S${sectorNum + 1}`, x, y - 10);
    });
  }, [selectedLap, comparisonLap, showComparison]);

  return (
    <Card className='bg-card border-border p-4 h-[400px] lg:h-[450px] relative'>
      <div className='absolute top-4 left-4 z-10'>
        <div className='text-xs text-muted-foreground uppercase tracking-wider'>
          Track Map
        </div>
        <div className='text-lg font-semibold text-foreground'>
          Mantorp Park
        </div>
      </div>

      {showComparison && comparisonLap && (
        <div className='absolute top-4 right-4 z-10 flex items-center gap-4 text-xs'>
          <div className='flex items-center gap-2'>
            <div className='w-4 h-0.5 bg-red-500'></div>
            <span className='text-muted-foreground'>Lap {selectedLap}</span>
            <div className='flex items-center gap-2'>
              <div className='w-4 h-0.5 bg-blue-500 bg-dashed-blue'></div>
              <span className='text-muted-foreground'>Lap {comparisonLap}</span>
            </div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className='w-full h-full block' />
    </Card>
  );
}

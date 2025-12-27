export function formatTime(seconds: number | null): string {
  if (!seconds) return '0:00.000';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toFixed(3).padStart(6, '0')}`;
}

export function formatLapTime(seconds: number | null): string {
  if (!seconds) return '--:--:---';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toFixed(3).padStart(6, '0')}`;
}

export function formatSessionDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatDuration(seconds: number | null): string {
  if (!seconds) return 'N/A';

  const minutes = Math.floor(seconds / 60);

  return `${minutes} min`;
}

interface FormatSpeedOptions {
  unit?: string;
  showUnit: boolean;
}

export function formatSpeed(
  kmh: number | null,
  options: FormatSpeedOptions = {
    unit: 'km/h',
    showUnit: true,
  }
) {
  if (kmh === null || kmh === undefined) return 'N/A';

  const { unit, showUnit } = options || {};

  return `${kmh.toFixed(2)} ${showUnit === false ? '' : unit || 'km/h'}`;
}

export function formatMinMaxSpeed(
  minKmh: number | null,
  maxKmh: number | null
): string {
  const minSpeed =
    minKmh === null || minKmh === undefined ? 'N/A' : minKmh.toFixed(2);
  const maxSpeed =
    maxKmh === null || maxKmh === undefined ? 'N/A' : maxKmh.toFixed(2);
  return `${maxSpeed} / ${minSpeed} km/h`;
}

export function formatLeanAngle(angle: number | null): string {
  if (angle === null || angle === undefined) return 'N/A';
  return `${angle.toFixed(2)}°`;
}

export function formatTrackLength(lengthMeters: number | null): string {
  if (lengthMeters === null || lengthMeters === undefined) return 'N/A';
  const lengthKm = lengthMeters / 1000;
  return `${lengthKm.toFixed(2)} km`;
}

export function formatGForce(gForce: number | null): string {
  if (gForce === null || gForce === undefined) return 'N/A';
  return `${gForce.toFixed(2)}g`;
}

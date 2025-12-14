import type {
  RaceBoxCSVHeader,
  RaceBoxCSVLapSummary,
  RaceBoxCSVRecord,
} from './types/database';

export function parseRaceBoxCSV(csvContent: string): {
  header: RaceBoxCSVHeader;
  records: RaceBoxCSVRecord[];
} {
  const lines = csvContent.trim().split(/\r?\n/);

  const header: RaceBoxCSVHeader = {
    format: '',
    dataSource: '',
    dateUtc: '',
    date: '',
    time: '',
    sessionIndex: 1,
    sessionType: 'Track',
    track: '',
    configuration: '',
    laps: 0,
    bestLapTime: 0,
    lapSummaries: [],
  };

  let dataStartIndex = lines.length;
  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    if (!rawLine) continue;

    const trimmedLine = rawLine.trim();
    if (!trimmedLine) continue;

    if (trimmedLine.startsWith('Record,Time,')) {
      dataStartIndex = i + 1;
      break;
    }

    if (lapLineRegex.test(trimmedLine)) {
      const lapSummary = parseLapSummaryLine(trimmedLine);
      if (lapSummary) {
        header.lapSummaries.push(lapSummary);
      }
      continue;
    }

    const [rawKey, ...rest] = trimmedLine.split(',');
    const key = (rawKey || '').trim();
    const value = rest.join(',').trim();

    if (!key) continue;

    switch (key) {
      case 'Format':
        header.format = value || '';
        break;
      case 'Data Source':
        header.dataSource = value || '';
        break;
      case 'Date UTC':
        header.dateUtc = value || '';
        break;
      case 'Date':
        header.date = value || '';
        break;
      case 'Time':
        header.time = value || '';
        break;
      case 'Session Index':
        header.sessionIndex = Number.parseInt(value || '1', 10);
        break;
      case 'Session Type':
        header.sessionType = value || 'Track';
        break;
      case 'Track':
        header.track = value || '';
        break;
      case 'Configuration':
        header.configuration = value || '';
        break;
      case 'Laps':
        header.laps = Number.parseInt(value || '0', 10);
        break;
      case 'Best Lap Time':
        header.bestLapTime = Number.parseFloat(value || '0');
        break;
    }
  }

  if (header.laps === 0 && header.lapSummaries.length > 0) {
    header.laps = header.lapSummaries.length;
  }

  if (header.lapSummaries.length > 1) {
    header.lapSummaries.sort((a, b) => a.lapNumber - b.lapNumber);
  }

  // Parse telemetry records
  const records: RaceBoxCSVRecord[] = [];
  for (let i = dataStartIndex; i < lines.length; i++) {
    const line = lines[i];
    if (!line || line.trim() === '') continue;

    const parts = line.split(',').map((part) => part.trim());
    if (parts.length < 13) continue;

    records.push({
      record: Number.parseInt(parts[0], 10),
      time: parts[1],
      latitude: Number.parseFloat(parts[2]),
      longitude: Number.parseFloat(parts[3]),
      altitude: Number.parseFloat(parts[4]),
      speed: Number.parseFloat(parts[5]),
      gForceX: Number.parseFloat(parts[6]),
      gForceZ: Number.parseFloat(parts[7]),
      lap: Number.parseInt(parts[8], 10),
      leanAngle: Number.parseFloat(parts[9]),
      gyroX: Number.parseFloat(parts[10]),
      gyroY: Number.parseFloat(parts[11]),
      gyroZ: Number.parseFloat(parts[12]),
    });
  }

  return { header, records };
}

const lapLineRegex = /^Lap\s+\d+/i;

function parseLapSummaryLine(line: string): RaceBoxCSVLapSummary | null {
  const parts = line.split(',').map((part) => part.trim());
  if (parts.length < 2) {
    return null;
  }

  const match = /^Lap\s+(\d+)/i.exec(parts[0]);
  if (!match) {
    return null;
  }

  const lapNumber = Number.parseInt(match[1], 10);
  if (Number.isNaN(lapNumber)) {
    return null;
  }

  const lapTimeValue = Number.parseFloat(parts[1]);
  const lapTimeSeconds = Number.isNaN(lapTimeValue) ? null : lapTimeValue;

  const sectorLabelIndex = parts.findIndex((part) =>
    part.toLowerCase().startsWith('sector')
  );
  const sectorStartIndex = sectorLabelIndex !== -1 ? sectorLabelIndex + 1 : 2;

  const sectorTimes: number[] = [];
  for (let i = sectorStartIndex; i < parts.length; i++) {
    if (!parts[i]) continue;
    const sectorValue = Number.parseFloat(parts[i]);
    if (!Number.isNaN(sectorValue)) {
      sectorTimes.push(sectorValue);
    }
  }

  return {
    lapNumber,
    lapTimeSeconds,
    sectorTimes,
  };
}

// Calculate lap times from telemetry data
export function calculateLapData(records: RaceBoxCSVRecord[]): {
  lapNumber: number;
  lapTimeSeconds: number | null;
  maxSpeedKmh: number;
  maxLeanAngle: number;
  maxGForceX: number;
  maxGForceZ: number;
  startTime: string;
  endTime: string;
}[] {
  const lapGroups = new Map<number, RaceBoxCSVRecord[]>();

  // Group records by lap number
  for (const record of records) {
    const lapNum = record.lap;
    if (!lapGroups.has(lapNum)) {
      lapGroups.set(lapNum, []);
    }
    lapGroups.get(lapNum)!.push(record);
  }

  const laps: {
    lapNumber: number;
    lapTimeSeconds: number | null;
    maxSpeedKmh: number;
    maxLeanAngle: number;
    maxGForceX: number;
    maxGForceZ: number;
    startTime: string;
    endTime: string;
  }[] = [];

  // Sort lap numbers and process each
  const sortedLapNumbers = Array.from(lapGroups.keys()).sort((a, b) => a - b);

  for (const lapNum of sortedLapNumbers) {
    const lapRecords = lapGroups.get(lapNum)!;
    if (lapRecords.length === 0) continue;

    // Sort by timestamp
    lapRecords.sort(
      (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
    );

    const startTime = lapRecords[0].time;
    const endTime = lapRecords[lapRecords.length - 1].time;

    // Calculate lap time in seconds
    const startMs = new Date(startTime).getTime();
    const endMs = new Date(endTime).getTime();
    const lapTimeSeconds = (endMs - startMs) / 1000;

    // Calculate max values
    let maxSpeedKmh = 0;
    let maxLeanAngle = 0;
    let maxGForceX = 0;
    let maxGForceZ = 0;

    for (const record of lapRecords) {
      maxSpeedKmh = Math.max(maxSpeedKmh, record.speed);
      maxLeanAngle = Math.max(maxLeanAngle, Math.abs(record.leanAngle));
      maxGForceX = Math.max(maxGForceX, Math.abs(record.gForceX));
      maxGForceZ = Math.max(maxGForceZ, Math.abs(record.gForceZ));
    }

    laps.push({
      lapNumber: lapNum,
      lapTimeSeconds: lapTimeSeconds > 0 ? lapTimeSeconds : null,
      maxSpeedKmh,
      maxLeanAngle,
      maxGForceX,
      maxGForceZ,
      startTime,
      endTime,
    });
  }

  return laps;
}

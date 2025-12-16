import { LatLngLiteral } from '@/types';

export type Track = {
  id: string;
  name: string;
  country: string;
  length_meters: number;
  turns: number;
  configuration: string;
  description: string;
  image_url: string;
  gps_point: LatLngLiteral;
  created_at: string;
  updated_at: string;
};

export type Tracks = Array<Track>;

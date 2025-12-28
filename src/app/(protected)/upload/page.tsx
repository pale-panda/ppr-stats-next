import { Card } from '@/components/ui/card';
import { UploadDropZone } from '@/components/upload-drop-zone';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upload Session',
  description: 'Import your RaceBox CSV session data',
  keywords: ['Pale Panda Racing Team', 'Upload', 'Session'],
};

export default function UploadPage() {
  return (
    <>
      <main className='container mx-auto px-4 py-8 max-w-4xl'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-foreground mb-2'>
            Upload Session
          </h1>
          <p className='text-muted-foreground'>
            Import your RaceBox CSV session data
          </p>
        </div>

        <Card className='p-8'>
          <UploadDropZone />

          {/* Instructions */}
          <div className='mt-8 pt-6 border-t border-border'>
            <h4 className='font-semibold text-foreground mb-3'>
              File Requirements
            </h4>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li className='flex items-start gap-2'>
                <span className='text-primary mt-1'>•</span>
                <span>
                  RaceBox CSV format with header metadata and telemetry data
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-primary mt-1'>•</span>
                <span>
                  File must include Track name, Date, and Lap information
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-primary mt-1'>•</span>
                <span>
                  Telemetry data with GPS coordinates, speed, lean angle, and
                  G-forces
                </span>
              </li>
            </ul>
          </div>
        </Card>
      </main>
    </>
  );
}

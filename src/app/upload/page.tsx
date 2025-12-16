'use client';

import type React from 'react';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
} from 'lucide-react';

interface UploadResult {
  success: boolean;
  message: string;
  sessionId?: string;
  trackName?: string;
  laps?: number;
}

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].name.endsWith('.csv')) {
      setSelectedFile(files[0]);
      setResult(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/upload-session', {
        method: 'POST',
        body: formData,
      });

      const data: UploadResult = await response.json();
      setResult(data);

      if (data.success) {
        setSelectedFile(null);
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Upload failed',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className='min-h-screen bg-background'>
      <Header />

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
          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-muted/30'
            }`}>
            <Upload
              className={`w-12 h-12 mx-auto mb-4 ${
                isDragging ? 'text-primary' : 'text-muted-foreground'
              }`}
            />

            <h3 className='text-lg font-semibold text-foreground mb-2'>
              {selectedFile ? selectedFile.name : 'Drop your CSV file here'}
            </h3>

            <p className='text-sm text-muted-foreground mb-4'>
              or click to browse
            </p>

            <input
              type='file'
              accept='.csv'
              onChange={handleFileSelect}
              className='hidden'
              id='file-upload'
              disabled={isUploading}
            />

            <label htmlFor='file-upload'>
              <Button variant='outline' disabled={isUploading} asChild>
                <span className='cursor-pointer'>
                  <FileText className='w-4 h-4 mr-2' />
                  Select CSV File
                </span>
              </Button>
            </label>
          </div>

          {/* Selected File Info */}
          {selectedFile && (
            <div className='mt-6 p-4 bg-muted rounded-lg flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <FileText className='w-5 h-5 text-primary' />
                <div>
                  <p className='font-medium text-foreground'>
                    {selectedFile.name}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className='w-4 h-4 mr-2' />
                    Upload
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Result Message */}
          {result && (
            <div
              className={`mt-6 p-4 rounded-lg flex items-start gap-3 ${
                result.success
                  ? 'bg-green-500/10 border border-green-500/20'
                  : 'bg-red-500/10 border border-red-500/20'
              }`}>
              {result.success ? (
                <CheckCircle2 className='w-5 h-5 text-green-500 mt-0.5' />
              ) : (
                <AlertCircle className='w-5 h-5 text-red-500 mt-0.5' />
              )}

              <div className='flex-1'>
                <p
                  className={`font-medium ${
                    result.success ? 'text-green-500' : 'text-red-500'
                  }`}>
                  {result.success ? 'Upload Successful!' : 'Upload Failed'}
                </p>
                <p className='text-sm text-foreground mt-1'>{result.message}</p>

                {result.success && result.sessionId && (
                  <Button
                    variant='outline'
                    size='sm'
                    className='mt-3 bg-transparent'
                    asChild>
                    <a href={`/session/${result.sessionId}`}>View Session</a>
                  </Button>
                )}
              </div>
            </div>
          )}

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
    </div>
  );
}

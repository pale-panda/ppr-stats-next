'use client';
import Image from 'next/image';

export function AppImage({
  src,
  alt,
  ...props
}: React.ComponentProps<typeof Image>) {
  return <img src={src as string} alt={alt} {...props} />;
}

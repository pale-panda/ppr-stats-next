'use client';
import Image from 'next/image';

export const AppImage = ({
  src,
  alt,
  ...props
}: React.ComponentProps<typeof Image>) => (
  <Image src={src as string} alt={alt} {...props} />
);

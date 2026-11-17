'use client';

import { useEffect, useState } from 'react';

const LOGO_SRC = '/branding/lingotheory-logo-approved.png';
/** Intrinsic size of the approved artwork. Do not crop or stretch it. */
const LOGO_WIDTH = 2048;
const LOGO_HEIGHT = 684;

const heights = {
  compact: 'max-h-9',
  /** Mobile stays compact; desktop header height is 64px. Width follows the artwork. */
  header: 'max-h-12 md:max-h-16',
  hero: 'max-h-16 sm:max-h-[4.75rem]',
} as const;

/**
 * The approved file is matted on black. Near-black pixels are drawn transparent
 * so the same artwork can sit on the white header without cropping or scaling.
 */
function useLogoOnLight() {
  const [src, setSrc] = useState(LOGO_SRC);
  useEffect(() => {
    const image = new window.Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');
      if (!context) return;
      context.drawImage(image, 0, 0);
      const frame = context.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = frame.data;
      for (let index = 0; index < pixels.length; index += 4) {
        if (pixels[index] < 16 && pixels[index + 1] < 16 && pixels[index + 2] < 16) {
          pixels[index + 3] = 0;
        }
      }
      context.putImageData(frame, 0, 0);
      setSrc(canvas.toDataURL('image/png'));
    };
    image.src = LOGO_SRC;
  }, []);
  return src;
}

export default function BrandLogo({
  size = 'header',
  priority = false,
  className = '',
}: {
  size?: keyof typeof heights;
  priority?: boolean;
  className?: string;
}) {
  const src = useLogoOnLight();
  return (
    <img
      src={src}
      alt="LingoTheory — UK Driving Theory Test"
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      fetchPriority={priority ? 'high' : 'auto'}
      className={`block h-auto w-auto max-w-full object-contain ${heights[size]} ${className}`}
    />
  );
}

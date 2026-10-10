"use client";

import Image from "next/image";
import type { ReactNode } from "react";

// ZoomableImage — drop-in replacement for next/image.
// Zoom functionality has been disabled; images are displayed statically.

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  priority?: boolean;
  loading?: "lazy" | "eager";
  className?: string;
  showEnlargeHint?: boolean;
  children?: ReactNode;
};

export function ZoomableImage({
  src,
  alt,
  width,
  height,
  sizes,
  priority,
  loading,
  className,
  children,
}: Props) {
  return (
    <div
      className={
        "group relative block w-full border-0 bg-transparent p-0 text-left rounded-[inherit] " +
        (className ?? "")
      }
    >
      {children ?? <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        loading={loading}
        className="block w-full h-auto"
      />}
    </div>
  );
}

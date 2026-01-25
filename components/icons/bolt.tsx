"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface BoltIconProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  className?: string;
}

export function BoltIcon({ className, ...props }: BoltIconProps) {
  return (
    <video
      className={cn("h-6 w-6 rounded-full object-cover", className)}
      src="/lightning-bolt.mp4"
      autoPlay
      loop
      muted
      playsInline
      {...props}
    />
  );
}

export default BoltIcon;

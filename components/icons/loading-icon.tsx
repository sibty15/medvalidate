"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface LoadingIconProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  className?: string;
}

export function LoadingIcon({ className, ...props }: LoadingIconProps) {
  return (
    <video
      className={cn("h-36 w-36 rounded-full object-cover", className)}
      src="/loading.mp4"
      autoPlay
      loop
      muted
      playsInline
      {...props}
    />
  );
}

export default LoadingIcon;

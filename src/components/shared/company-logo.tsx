"use client";

import { useState } from "react";
import Image from "next/image";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompanyLogoProps {
  src: string | null;
  alt: string;
  size?: number;
  className?: string;
  iconClassName?: string;
}

export function CompanyLogo({
  src,
  alt,
  size = 48,
  className,
  iconClassName,
}: CompanyLogoProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-muted shrink-0",
          className
        )}
        style={{ width: size, height: size }}
      >
        <Building2
          className={cn("text-muted-foreground", iconClassName)}
          style={{ width: size * 0.5, height: size * 0.5 }}
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn("rounded-lg object-cover bg-muted shrink-0", className)}
      onError={() => setFailed(true)}
    />
  );
}

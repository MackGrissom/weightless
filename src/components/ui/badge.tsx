import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "accent";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors",
        {
          "bg-accent text-accent-foreground": variant === "default",
          "bg-muted text-muted-foreground": variant === "secondary",
          "border border-border text-foreground": variant === "outline",
          "bg-accent/10 text-accent border border-accent/20":
            variant === "accent",
        },
        className
      )}
      {...props}
    />
  );
}

import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimezoneBadgeProps {
  timezoneMin?: number | null;
  timezoneMax?: number | null;
  isAsyncFriendly?: boolean;
  className?: string;
}

export function TimezoneBadge({
  timezoneMin,
  timezoneMax,
  isAsyncFriendly,
  className,
}: TimezoneBadgeProps) {
  if (timezoneMin == null && timezoneMax == null && !isAsyncFriendly) {
    return null;
  }

  const fmt = (n: number) => `UTC${n >= 0 ? "+" : ""}${n}`;

  let label = "Worldwide";
  if (timezoneMin != null && timezoneMax != null) {
    const spread = timezoneMax - timezoneMin;
    if (spread >= 20) {
      label = "Worldwide";
    } else {
      label = `${fmt(timezoneMin)} to ${fmt(timezoneMax)}`;
    }
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs",
        isAsyncFriendly
          ? "bg-green-500/10 text-green-400 border border-green-500/20"
          : "bg-muted text-muted-foreground",
        className
      )}
    >
      <Globe className="h-3 w-3" />
      {label}
      {isAsyncFriendly && " · Async OK"}
    </div>
  );
}

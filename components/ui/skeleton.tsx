import * as React from "react"
import { cn } from "@/lib/utils"

/** Flat shimmer placeholder using the muted token. Pass width/height via className. */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }

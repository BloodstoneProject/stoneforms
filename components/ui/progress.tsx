import * as React from "react"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: number }
>(({ className, value = 0, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative h-2 w-full overflow-hidden bg-gray-200", className)}
    {...props}
  >
    <div
      className="h-full transition-all duration-300 ease-out"
      style={{ 
        width: `${value}%`,
        backgroundColor: '#142c1c',
      }}
    />
  </div>
))
Progress.displayName = "Progress"

export { Progress }

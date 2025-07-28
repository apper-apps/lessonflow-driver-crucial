import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const ProgressBar = forwardRef(({ 
  className, 
  value = 0, 
  max = 100,
  showLabel = false,
  label,
  size = "md",
  animated = true,
  ...props 
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  const sizes = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  }
  
  const barClasses = animated ? "progress-bar" : "bg-gradient-to-r from-primary-500 to-primary-600"
  
  return (
    <div className={cn("w-full", className)} ref={ref} {...props}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-surface-700">
            {label || "진행률"}
          </span>
          <span className="text-sm text-surface-600">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className={cn("bg-surface-200 rounded-full overflow-hidden", sizes[size])}>
        <div
          className={cn("h-full rounded-full transition-all duration-500 ease-out", barClasses)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
})

ProgressBar.displayName = "ProgressBar"

export default ProgressBar
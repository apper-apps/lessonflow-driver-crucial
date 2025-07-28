import React from "react"
import { cn } from "@/utils/cn"

const Loading = ({ className, type = "skeleton" }) => {
  if (type === "spinner") {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  return (
    <div className={cn("animate-pulse space-y-4", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-surface-200 overflow-hidden">
            <div className="aspect-video bg-surface-200"></div>
            <div className="p-6">
              <div className="h-4 bg-surface-200 rounded w-3/4 mb-3"></div>
              <div className="space-y-2">
                <div className="h-3 bg-surface-200 rounded"></div>
                <div className="h-3 bg-surface-200 rounded w-5/6"></div>
              </div>
              <div className="mt-4 h-2 bg-surface-200 rounded"></div>
              <div className="mt-4 flex justify-between items-center">
                <div className="h-3 bg-surface-200 rounded w-20"></div>
                <div className="h-3 bg-surface-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Loading
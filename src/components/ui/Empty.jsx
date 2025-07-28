import React from "react"
import { cn } from "@/utils/cn"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  className, 
  icon = "BookOpen",
  title = "데이터가 없습니다", 
  description = "표시할 내용이 없습니다.",
  action,
  actionLabel = "새로 만들기"
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center", className)}>
      <div className="w-16 h-16 bg-gradient-to-br from-surface-100 to-surface-200 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={icon} className="text-surface-400" size={32} />
      </div>
      <h3 className="text-lg font-semibold text-surface-900 mb-2">{title}</h3>
      <p className="text-surface-600 mb-6 max-w-md">{description}</p>
      {action && (
        <Button variant="primary" onClick={action}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default Empty
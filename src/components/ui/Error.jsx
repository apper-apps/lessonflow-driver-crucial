import React from "react"
import { cn } from "@/utils/cn"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Error = ({ 
  className, 
  message = "데이터를 불러오는 중 오류가 발생했습니다.", 
  onRetry 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center", className)}>
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertCircle" className="text-red-600" size={32} />
      </div>
      <h3 className="text-lg font-semibold text-surface-900 mb-2">오류가 발생했습니다</h3>
      <p className="text-surface-600 mb-6 max-w-md">{message}</p>
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          다시 시도
        </Button>
      )}
    </div>
  )
}

export default Error
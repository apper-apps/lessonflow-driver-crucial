import React from "react"
import { Link } from "react-router-dom"
import { cn } from "@/utils/cn"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import ProgressBar from "@/components/atoms/ProgressBar"
import ApperIcon from "@/components/ApperIcon"

const LessonCard = ({ lesson, progress, className }) => {
  const progressPct = progress?.progress_pct || 0
  
  const getTierBadgeVariant = (tierRequired) => {
    switch (tierRequired) {
      case 1: return "guest"
      case 2: return "member" 
      case 3: return "admin"
      default: return "default"
    }
  }
  
  const getTierName = (tierRequired) => {
    switch (tierRequired) {
      case 1: return "무료"
      case 2: return "프리미엄"
      case 3: return "VIP"
      default: return "일반"
    }
  }
  
  return (
    <Link to={`/lessons/${lesson.Id}`}>
      <Card 
        variant="elevated" 
        hover 
        className={cn("overflow-hidden group", className)}
      >
        <div className="aspect-video bg-gradient-to-br from-primary-500 to-secondary-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
          <div className="absolute top-4 left-4">
            <Badge variant={getTierBadgeVariant(lesson.tier_required)}>
              {getTierName(lesson.tier_required)}
            </Badge>
          </div>
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 text-white text-xs font-medium">
            <ApperIcon name="Clock" size={12} className="inline mr-1" />
            {lesson.duration_minutes}분
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <ApperIcon name="Play" className="text-white ml-1" size={24} />
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="font-semibold text-lg text-surface-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
            {lesson.title}
          </h3>
          <p className="text-surface-600 text-sm mb-4 line-clamp-3">
            {lesson.description}
          </p>
          
          {progressPct > 0 && (
            <div className="mb-4">
              <ProgressBar
                value={progressPct}
                showLabel
                label="학습 진행률"
                size="sm"
              />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-surface-500">
              <ApperIcon name="Users" size={16} className="mr-1" />
              <span>1,234명 수강</span>
            </div>
            <div className="flex items-center text-primary-600 font-medium">
              <span className="mr-1">시작하기</span>
              <ApperIcon name="ArrowRight" size={16} />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default LessonCard
import React, { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { cn } from "@/utils/cn"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import ProgressBar from "@/components/atoms/ProgressBar"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import favoritesService from "@/services/api/favoritesService"
const LessonCard = ({ lesson, progress, isFavorited = false, onFavoriteChange, className }) => {
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false)

  const handleFavoriteToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isTogglingFavorite) return
    
    setIsTogglingFavorite(true)
    
    try {
      const userId = 1 // Mock current user ID
      
      if (isFavorited) {
        await favoritesService.removeFavorite(userId, lesson.Id)
        toast.success("즐겨찾기에서 제거되었습니다")
      } else {
        await favoritesService.addFavorite(userId, lesson.Id)
        toast.success("즐겨찾기에 추가되었습니다")
      }
      
      if (onFavoriteChange) {
        onFavoriteChange(lesson.Id, !isFavorited)
      }
    } catch (error) {
      toast.error(error.message || "오류가 발생했습니다")
    } finally {
      setIsTogglingFavorite(false)
    }
  }
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
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 text-white text-xs font-medium">
              <ApperIcon name="Clock" size={12} className="inline mr-1" />
              {lesson.duration_minutes}분
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavoriteToggle}
              disabled={isTogglingFavorite}
              className={cn(
                "w-8 h-8 p-0 bg-white/20 backdrop-blur-sm hover:bg-white/30 border-none transition-all duration-200",
                isFavorited ? "text-red-400 hover:text-red-300" : "text-white/70 hover:text-white",
                isTogglingFavorite && "opacity-50 cursor-not-allowed"
              )}
            >
              <ApperIcon 
                name={isFavorited ? "Heart" : "Heart"} 
                size={16} 
                className={cn(
                  "transition-all duration-200",
                  isFavorited ? "fill-current" : "fill-none"
                )}
              />
            </Button>
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
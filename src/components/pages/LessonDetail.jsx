import React, { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import ProgressBar from "@/components/atoms/ProgressBar"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import lessonService from "@/services/api/lessonService"
import progressService from "@/services/api/progressService"
import { formatKoreanDate } from "@/utils/dateFormat"

const LessonDetail = () => {
  const { id } = useParams()
  const [lesson, setLesson] = useState(null)
  const [progress, setProgress] = useState(null)
  const [relatedLessons, setRelatedLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  
  useEffect(() => {
    loadLessonData()
  }, [id])
  
const loadLessonData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const lessonData = await lessonService.getById(parseInt(id))
      if (!lessonData) {
        throw new Error("레슨을 찾을 수 없습니다.")
      }
      
      setLesson(lessonData)
      
      // 진행률 데이터 로드 - handle lookup field properly
      const allProgress = await progressService.getAll()
      const lessonProgress = allProgress.find(p => {
        const lessonIdValue = p.lesson_id?.Id || p.lesson_id
        return lessonIdValue === parseInt(id)
      })
      setProgress(lessonProgress)
      
      // 관련 레슨 로드 (동일 티어의 다른 레슨들) - handle lookup field properly
      const allLessons = await lessonService.getAll()
      const tierRequiredValue = lessonData.tier_required?.Id || lessonData.tier_required
      const related = allLessons
        .filter(l => {
          const lessonTierValue = l.tier_required?.Id || l.tier_required
          return l.Id !== parseInt(id) && lessonTierValue === tierRequiredValue
        })
        .slice(0, 3)
      setRelatedLessons(related)
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const handleStartLesson = () => {
    setIsPlaying(true)
    // 실제 구현에서는 비디오 플레이어 시작
  }
  
const handleUpdateProgress = async (newProgress) => {
    try {
      if (progress) {
        // Update existing progress - use database field names and handle lookup fields
        await progressService.update(progress.Id, {
          Name: progress.Name,
          progress_pct: newProgress,
          last_seen_at: new Date().toISOString(),
          user_id: progress.user_id?.Id || progress.user_id,
          lesson_id: progress.lesson_id?.Id || progress.lesson_id
        })
      } else {
        // Create new progress - use database field names and handle lookup fields
        await progressService.create({
          user_id: 1, // 현재 사용자 ID
          lesson_id: parseInt(id),
          progress_pct: newProgress,
          last_seen_at: new Date().toISOString()
        })
      }
      
      // 진행률 새로고침 - handle lookup field properly
      const allProgress = await progressService.getAll()
      const lessonProgress = allProgress.find(p => {
        const lessonIdValue = p.lesson_id?.Id || p.lesson_id
        return lessonIdValue === parseInt(id)
      })
      setProgress(lessonProgress)
      
    } catch (err) {
      console.error("진행률 업데이트 실패:", err)
    }
  }
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
  
  if (loading) return <Loading type="spinner" />
  if (error) return <Error message={error} onRetry={loadLessonData} />
  if (!lesson) return <Error message="레슨을 찾을 수 없습니다." />
  
  const progressPct = progress?.progress_pct || 0
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Video Player */}
          <Card variant="elevated" className="overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-primary-500 to-secondary-600 relative">
              {!isPlaying ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={handleStartLesson}
                    className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 group"
                  >
                    <ApperIcon name="Play" className="text-white ml-1 group-hover:scale-110 transition-transform" size={32} />
                  </button>
                </div>
              ) : (
                <div className="absolute inset-0 bg-black flex items-center justify-center">
                  <div className="text-white text-center">
                    <ApperIcon name="Play" size={48} className="mx-auto mb-4" />
                    <p>비디오 플레이어 (데모)</p>
                  </div>
                </div>
              )}
              
              <div className="absolute top-4 left-4">
                <Badge variant={getTierBadgeVariant(lesson.tier_required)}>
                  {getTierName(lesson.tier_required)}
                </Badge>
              </div>
              
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm font-medium">
                <ApperIcon name="Clock" size={14} className="inline mr-1" />
                {lesson.duration_minutes}분
              </div>
            </div>
          </Card>
          
          {/* Lesson Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-surface-900 mb-4">{lesson.title}</h1>
              <p className="text-lg text-surface-700 leading-relaxed">{lesson.description}</p>
            </div>
            
            {/* Progress */}
            {progressPct > 0 && (
              <Card variant="glass" className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-surface-900">학습 진행률</h3>
                  <span className="text-sm text-surface-600 korean-date">
                    마지막 학습: {progress && formatKoreanDate(progress.last_seen_at)}
                  </span>
                </div>
                <ProgressBar
                  value={progressPct}
                  showLabel
                  label="완료율"
                  className="mb-4"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateProgress(Math.min(progressPct + 10, 100))}
                  >
                    +10% 진행
                  </Button>
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={() => handleUpdateProgress(100)}
                  >
                    완료 표시
                  </Button>
                </div>
              </Card>
            )}
            
            {/* Lesson Content */}
            <Card variant="elevated" className="p-8">
              <h3 className="text-xl font-semibold text-surface-900 mb-6">레슨 내용</h3>
              <div className="space-y-4">
                {[
                  "기본 인사말과 자기소개",
                  "일상 대화에서 자주 사용하는 표현",
                  "발음 연습과 억양 교정",
                  "실제 상황에서의 대화 연습",
                  "문법 포인트와 활용법"
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium mr-4">
                      {index + 1}
                    </div>
                    <span className="text-surface-700">{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card variant="elevated" className="p-6">
            <h3 className="font-semibold text-surface-900 mb-4">빠른 액션</h3>
            <div className="space-y-3">
              <Button variant="primary" size="lg" className="w-full" onClick={handleStartLesson}>
                <ApperIcon name="Play" size={16} className="mr-2" />
                {progressPct > 0 ? "이어서 학습하기" : "학습 시작하기"}
              </Button>
              <Button variant="outline" className="w-full">
                <ApperIcon name="Download" size={16} className="mr-2" />
                자료 다운로드
              </Button>
              <Button variant="ghost" className="w-full">
                <ApperIcon name="Heart" size={16} className="mr-2" />
                즐겨찾기 추가
              </Button>
            </div>
          </Card>
          
          {/* Lesson Stats */}
          <Card variant="glass" className="p-6">
            <h3 className="font-semibold text-surface-900 mb-4">레슨 정보</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-surface-600">난이도</span>
                <Badge variant={getTierBadgeVariant(lesson.tier_required)} size="sm">
                  {getTierName(lesson.tier_required)}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-600">소요시간</span>
                <span className="font-medium">{lesson.duration_minutes}분</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-600">수강생</span>
                <span className="font-medium">1,234명</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-600">평점</span>
                <div className="flex items-center">
                  <ApperIcon name="Star" className="text-yellow-400 mr-1" size={16} />
                  <span className="font-medium">4.8</span>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Related Lessons */}
          {relatedLessons.length > 0 && (
            <Card variant="elevated" className="p-6">
              <h3 className="font-semibold text-surface-900 mb-4">관련 레슨</h3>
              <div className="space-y-4">
                {relatedLessons.map((relatedLesson) => (
                  <Link
                    key={relatedLesson.Id}
                    to={`/lessons/${relatedLesson.Id}`}
                    className="block p-3 rounded-lg border border-surface-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-surface-900 text-sm line-clamp-1">
                        {relatedLesson.title}
                      </h4>
                      <Badge variant={getTierBadgeVariant(relatedLesson.tier_required)} size="xs">
                        {getTierName(relatedLesson.tier_required)}
                      </Badge>
                    </div>
                    <p className="text-xs text-surface-600 line-clamp-2">
                      {relatedLesson.description}
                    </p>
                    <div className="flex items-center mt-2 text-xs text-surface-500">
                      <ApperIcon name="Clock" size={12} className="mr-1" />
                      {relatedLesson.duration_minutes}분
                    </div>
                  </Link>
                ))}
              </div>
              <Link to="/lessons">
                <Button variant="outline" size="sm" className="w-full mt-4">
                  전체 레슨 보기
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default LessonDetail
import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { cn } from "@/utils/cn"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ProgressBar from "@/components/atoms/ProgressBar"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import progressService from "@/services/api/progressService"
import lessonService from "@/services/api/lessonService"
import { formatKoreanDate, formatRelativeTime } from "@/utils/dateFormat"

const MyLearning = () => {
  const [progressData, setProgressData] = useState([])
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("all") // all, in-progress, completed
  
  const filterOptions = [
    { id: "all", name: "전체", icon: "BookOpen" },
    { id: "in-progress", name: "학습 중", icon: "Play" },
    { id: "completed", name: "완료", icon: "CheckCircle" }
  ]
  
  useEffect(() => {
    loadLearningData()
  }, [])
  
  const loadLearningData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [progressList, lessonsList] = await Promise.all([
        progressService.getAll(),
        lessonService.getAll()
      ])
      
      // 진행률 데이터에 레슨 정보 추가
      const progressWithLessons = await Promise.all(
        progressList.map(async (progress) => {
          const lesson = lessonsList.find(l => l.Id === progress.lesson_id)
          return { ...progress, lesson }
        })
      )
      
      setProgressData(progressWithLessons)
      setLessons(lessonsList)
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const getFilteredProgress = () => {
    switch (filter) {
      case "in-progress":
        return progressData.filter(p => p.progress_pct > 0 && p.progress_pct < 100)
      case "completed":
        return progressData.filter(p => p.progress_pct === 100)
      default:
        return progressData
    }
  }
  
  const calculateStats = () => {
    const totalLessons = progressData.length
    const completedLessons = progressData.filter(p => p.progress_pct === 100).length
    const inProgressLessons = progressData.filter(p => p.progress_pct > 0 && p.progress_pct < 100).length
    const totalProgress = progressData.reduce((sum, p) => sum + p.progress_pct, 0)
    const averageProgress = totalLessons > 0 ? Math.round(totalProgress / totalLessons) : 0
    
    return {
      totalLessons,
      completedLessons,
      inProgressLessons,
      averageProgress
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
  
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadLearningData} />
  
  const stats = calculateStats()
  const filteredProgress = getFilteredProgress()
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900 mb-4">내 학습</h1>
        <p className="text-lg text-surface-600">학습 진행 상황을 확인하고 관리하세요</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card variant="gradient" className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="BookOpen" className="text-white" size={24} />
          </div>
          <div className="text-2xl font-bold text-surface-900 mb-1">
            {stats.totalLessons}
          </div>
          <div className="text-sm text-surface-600">학습한 레슨</div>
        </Card>
        
        <Card variant="gradient" className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="CheckCircle" className="text-white" size={24} />
          </div>
          <div className="text-2xl font-bold text-surface-900 mb-1">
            {stats.completedLessons}
          </div>
          <div className="text-sm text-surface-600">완료한 레슨</div>
        </Card>
        
        <Card variant="gradient" className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-accent-500 to-accent-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Play" className="text-white" size={24} />
          </div>
          <div className="text-2xl font-bold text-surface-900 mb-1">
            {stats.inProgressLessons}
          </div>
          <div className="text-sm text-surface-600">학습 중인 레슨</div>
        </Card>
        
        <Card variant="gradient" className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="TrendingUp" className="text-white" size={24} />
          </div>
          <div className="text-2xl font-bold text-surface-900 mb-1">
            {stats.averageProgress}%
          </div>
          <div className="text-sm text-surface-600">평균 진행률</div>
        </Card>
      </div>
      
      {/* Overall Progress */}
      {stats.totalLessons > 0 && (
        <Card variant="elevated" className="p-8 mb-8">
          <h2 className="text-xl font-semibold text-surface-900 mb-6">전체 학습 진행률</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <ProgressBar
                value={stats.averageProgress}
                showLabel
                label="평균 완료율"
                size="lg"
                className="mb-4"
              />
              <div className="text-sm text-surface-600">
                {stats.totalLessons}개 레슨 중 {stats.completedLessons}개 완료
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-surface-700">완료한 레슨</span>
                <span className="font-medium">{stats.completedLessons}개</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-surface-700">학습 중인 레슨</span>
                <span className="font-medium">{stats.inProgressLessons}개</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-surface-700">총 학습 시간</span>
                <span className="font-medium">
                  {progressData.reduce((total, p) => total + (p.lesson?.duration_minutes || 0), 0)}분
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}
      
      {/* Filter Tabs */}
      <Card variant="elevated" className="p-6 mb-8">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-surface-700 mr-4 flex items-center">
            <ApperIcon name="Filter" size={16} className="mr-1" />
            필터:
          </span>
          {filterOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setFilter(option.id)}
              className={cn(
                "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                filter === option.id
                  ? "bg-primary-100 text-primary-700 border border-primary-200"
                  : "bg-surface-100 text-surface-600 hover:bg-surface-200"
              )}
            >
              <ApperIcon name={option.icon} size={16} className="mr-2" />
              {option.name}
            </button>
          ))}
        </div>
      </Card>
      
      {/* Learning Progress List */}
      {filteredProgress.length === 0 ? (
        <Empty
          icon="BookOpen"
          title="학습 기록이 없습니다"
          description="새로운 레슨을 시작해서 학습을 진행해보세요!"
          action={() => window.location.href = "/lessons"}
          actionLabel="레슨 둘러보기"
        />
      ) : (
        <div className="space-y-6">
          {filteredProgress.map((progress) => (
            <Card key={progress.Id} variant="elevated" hover className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Lesson Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-surface-900">
                      {progress.lesson?.title || "알 수 없는 레슨"}
                    </h3>
                    <Badge variant={getTierBadgeVariant(progress.lesson?.tier_required)} size="sm">
                      {getTierName(progress.lesson?.tier_required)}
                    </Badge>
                    {progress.progress_pct === 100 && (
                      <Badge variant="success" size="sm">
                        <ApperIcon name="CheckCircle" size={12} className="mr-1" />
                        완료
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-surface-600 mb-4 line-clamp-2">
                    {progress.lesson?.description}
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-surface-500">
                    <span className="flex items-center">
                      <ApperIcon name="Clock" size={16} className="mr-1" />
                      {progress.lesson?.duration_minutes || 0}분
                    </span>
                    <span className="flex items-center korean-date">
                      <ApperIcon name="Calendar" size={16} className="mr-1" />
                      마지막 학습: {formatRelativeTime(progress.last_seen_at)}
                    </span>
                  </div>
                </div>
                
                {/* Progress and Actions */}
                <div className="md:w-80">
                  <ProgressBar
                    value={progress.progress_pct}
                    showLabel
                    label="진행률"
                    className="mb-4"
                  />
                  
                  <div className="flex gap-3">
                    <Link to={`/lessons/${progress.lesson_id}`} className="flex-1">
                      <Button variant="primary" className="w-full">
                        <ApperIcon name="Play" size={16} className="mr-2" />
                        {progress.progress_pct === 100 ? "다시 보기" : "이어서 학습"}
                      </Button>
                    </Link>
                    <Button variant="outline" size="md">
                      <ApperIcon name="MoreHorizontal" size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* Recommendations */}
      {progressData.length > 0 && (
        <Card variant="glass" className="p-8 mt-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Target" className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-surface-900 mb-4">
              다음 단계를 위한 추천 레슨
            </h3>
            <p className="text-surface-600 mb-6">
              현재 학습 진행률을 바탕으로 다음 레슨을 추천해드립니다
            </p>
            <Link to="/lessons">
              <Button variant="accent" size="lg">
                <ApperIcon name="ArrowRight" size={20} className="mr-2" />
                추천 레슨 보기
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  )
}

export default MyLearning
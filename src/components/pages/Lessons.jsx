import React, { useEffect, useState } from "react";
import favoritesService from "@/services/api/favoritesService";
import progressService from "@/services/api/progressService";
import lessonService from "@/services/api/lessonService";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import LessonCard from "@/components/molecules/LessonCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";
import { toast } from "react-toastify";

const Lessons = () => {
const [lessons, setLessons] = useState([])
  const [progress, setProgress] = useState([])
  const [favorites, setFavorites] = useState([])
  const [filteredLessons, setFilteredLessons] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTier, setSelectedTier] = useState(0) // 0 = 전체
  const [sortBy, setSortBy] = useState("newest") // newest, popular, progress
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  const tiers = [
    { id: 0, name: "전체", color: "default" },
    { id: 1, name: "무료", color: "guest" },
    { id: 2, name: "프리미엄", color: "member" },
    { id: 3, name: "VIP", color: "admin" }
  ]
  
  const sortOptions = [
    { id: "newest", name: "최신순", icon: "Calendar" },
    { id: "popular", name: "인기순", icon: "TrendingUp" },
    { id: "progress", name: "진행률순", icon: "BarChart" }
  ]
  
  useEffect(() => {
    loadLessons()
  }, [])
  
  useEffect(() => {
    filterAndSortLessons()
  }, [lessons, progress, searchQuery, selectedTier, sortBy])
  
const loadLessons = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [lessonsData, progressData, favoritesData] = await Promise.all([
        lessonService.getAll(),
        progressService.getAll(),
        favoritesService.getByUserId(1) // Mock current user ID
      ])
      
      setLessons(lessonsData)
      setProgress(progressData)
      setFavorites(favoritesData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const filterAndSortLessons = () => {
    let filtered = [...lessons]
    
    // 검색 필터
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(lesson => 
        lesson.title.toLowerCase().includes(query) ||
        lesson.description.toLowerCase().includes(query)
      )
    }
    
    // 티어 필터
    if (selectedTier > 0) {
      filtered = filtered.filter(lesson => lesson.tier_required === selectedTier)
    }
    
    // 정렬
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => b.Id - a.Id)
        break
      case "popular":
        // 인기순 (임시로 ID 역순으로 정렬)
        filtered.sort((a, b) => a.Id - b.Id)
        break
      case "progress":
        // 진행률이 높은 순
        filtered.sort((a, b) => {
          const progressA = progress.find(p => p.lesson_id === a.Id)?.progress_pct || 0
          const progressB = progress.find(p => p.lesson_id === b.Id)?.progress_pct || 0
          return progressB - progressA
        })
        break
    }
    
    setFilteredLessons(filtered)
  }
  
  const handleSearch = (query) => {
    console.log("Algolia 검색:", query)
    // 실제 Algolia 검색 구현 예정
  }
  
const getLessonProgress = (lessonId) => {
    return progress.find(p => p.lesson_id === lessonId)
  }

  const isLessonFavorited = (lessonId) => {
    return favorites.some(fav => fav.lesson_id === lessonId)
  }

const handleFavoriteChange = async (lessonId, isFavorited) => {
    try {
      if (isFavorited) {
        // Add to favorites - use database operations
        const newFavorite = await favoritesService.addFavorite(1, lessonId)
        if (newFavorite) {
          setFavorites(prev => [...prev, newFavorite])
          toast.success("즐겨찾기에 추가되었습니다.")
        }
      } else {
        // Remove from favorites - use database operations
        await favoritesService.removeFavorite(1, lessonId)
        setFavorites(prev => {
          const lessonIdValue = typeof lessonId === 'object' ? lessonId.Id : lessonId
          return prev.filter(fav => {
            const favLessonIdValue = fav.lesson_id?.Id || fav.lesson_id
            return favLessonIdValue !== lessonIdValue
          })
        })
        toast.success("즐겨찾기에서 제거되었습니다.")
      }
    } catch (err) {
      toast.error(err.message || "즐겨찾기 처리 중 오류가 발생했습니다.")
    }
  }
  
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadLessons} />
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900 mb-4">전체 레슨</h1>
        <p className="text-lg text-surface-600">
          {filteredLessons.length}개의 레슨이 있습니다
        </p>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6 mb-8">
        <div className="space-y-6">
          {/* Search Bar */}
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            placeholder="레슨 제목이나 내용으로 검색..."
          />
          
          {/* Filter and Sort */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Tier Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-surface-700 mr-2 flex items-center">
                <ApperIcon name="Filter" size={16} className="mr-1" />
                등급:
              </span>
              {tiers.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                    selectedTier === tier.id
                      ? "bg-primary-100 text-primary-700 border border-primary-200"
                      : "bg-surface-100 text-surface-600 hover:bg-surface-200"
                  )}
                >
                  {tier.name}
                </button>
              ))}
            </div>
            
            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-surface-700 mr-2 flex items-center">
                <ApperIcon name="ArrowUpDown" size={16} className="mr-1" />
                정렬:
              </span>
              <div className="flex gap-1">
                {sortOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSortBy(option.id)}
                    className={cn(
                      "flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                      sortBy === option.id
                        ? "bg-primary-100 text-primary-700 border border-primary-200"
                        : "bg-surface-100 text-surface-600 hover:bg-surface-200"
                    )}
                  >
                    <ApperIcon name={option.icon} size={14} className="mr-1" />
                    {option.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Lessons Grid */}
      {filteredLessons.length === 0 ? (
        <Empty
          icon="BookOpen"
          title="레슨을 찾을 수 없습니다"
          description="검색 조건을 변경하거나 필터를 다시 설정해보세요."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{filteredLessons.map((lesson) => (
            <LessonCard
              key={lesson.Id}
              lesson={lesson}
              progress={getLessonProgress(lesson.Id)}
              isFavorited={isLessonFavorited(lesson.Id)}
              onFavoriteChange={handleFavoriteChange}
            />
          ))}
        </div>
      )}
      
      {/* Load More Button */}
      {filteredLessons.length > 0 && filteredLessons.length >= 12 && (
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            <ApperIcon name="MoreHorizontal" size={20} className="mr-2" />
            더 많은 레슨 보기
          </Button>
        </div>
      )}
      
      {/* Stats */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {lessons.length}
            </div>
            <div className="text-surface-600">전체 레슨</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-secondary-600 mb-2">
              {lessons.filter(l => l.tier_required === 1).length}
            </div>
            <div className="text-surface-600">무료 레슨</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent-600 mb-2">
              {progress.length}
            </div>
            <div className="text-surface-600">학습 중인 레슨</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {progress.filter(p => p.progress_pct === 100).length}
            </div>
            <div className="text-surface-600">완료된 레슨</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Lessons
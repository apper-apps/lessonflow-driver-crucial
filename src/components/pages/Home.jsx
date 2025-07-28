import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import ProgressBar from "@/components/atoms/ProgressBar"
import LessonCard from "@/components/molecules/LessonCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import lessonService from "@/services/api/lessonService"
import progressService from "@/services/api/progressService"
import { formatKoreanDate } from "@/utils/dateFormat"

const Home = () => {
  const [featuredLessons, setFeaturedLessons] = useState([])
  const [recentProgress, setRecentProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  useEffect(() => {
    loadHomeData()
  }, [])
  
const loadHomeData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [lessons, progress] = await Promise.all([
        lessonService.getAll(),
        progressService.getAll()
      ])
      
      // 추천 레슨 (처음 6개)
      setFeaturedLessons(lessons.slice(0, 6))
      
      // 최근 학습 진행률 (최근 3개) - handle lookup fields properly
      const recentProgressWithLessons = await Promise.all(
        progress.slice(0, 3).map(async (prog) => {
          const lessonIdValue = prog.lesson_id?.Id || prog.lesson_id
          const lesson = await lessonService.getById(lessonIdValue)
          return { ...prog, lesson }
        })
      )
      setRecentProgress(recentProgressWithLessons)
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadHomeData} />
  
  const stats = [
    { 
      name: "전체 레슨", 
      value: "150+", 
      icon: "BookOpen",
      gradient: "from-primary-500 to-primary-600"
    },
    { 
      name: "활성 학습자", 
      value: "1,234", 
      icon: "Users",
      gradient: "from-secondary-500 to-secondary-600"
    },
    { 
      name: "완료된 학습", 
      value: "5,678", 
      icon: "Award",
      gradient: "from-accent-500 to-accent-600"
    },
    { 
      name: "평균 만족도", 
      value: "4.9", 
      icon: "Star",
      gradient: "from-green-500 to-green-600"
    }
  ]
  
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                <span className="block">한국어 학습의</span>
                <span className="block bg-gradient-to-r from-accent-400 to-accent-300 bg-clip-text text-transparent">
                  새로운 기준
                </span>
              </h1>
              <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                체계적인 커리큘럼과 전문 강사진과 함께 
                효과적이고 즐거운 한국어 학습을 시작하세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="accent" 
                  size="xl"
                  className="text-lg font-semibold"
                >
                  <ApperIcon name="Play" size={20} className="mr-2" />
                  무료 체험 시작
                </Button>
                <Button 
                  variant="outline" 
                  size="xl"
                  className="text-white border-white hover:bg-white hover:text-primary-700"
                >
                  <ApperIcon name="Info" size={20} className="mr-2" />
                  자세히 알아보기
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-white/10 backdrop-blur-sm rounded-2xl p-8 glass">
                <div className="grid grid-cols-2 gap-4 h-full">
                  {stats.map((stat, index) => (
                    <div key={stat.name} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex flex-col justify-center items-center text-center">
                      <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-lg flex items-center justify-center mb-3`}>
                        <ApperIcon name={stat.icon} className="text-white" size={24} />
                      </div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-sm text-primary-200">{stat.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Recent Progress */}
      {recentProgress.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-surface-900">최근 학습 진행률</h2>
            <Link to="/my-learning">
              <Button variant="outline">
                전체 보기
                <ApperIcon name="ArrowRight" size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentProgress.map((progress) => (
              <Card key={progress.Id} variant="elevated" className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-surface-900">{progress.lesson?.title}</h3>
                  <span className="text-sm text-surface-500 korean-date">
                    {formatKoreanDate(progress.last_seen_at)}
                  </span>
                </div>
                <ProgressBar
                  value={progress.progress_pct}
                  showLabel
                  label="완료율"
                  className="mb-4"
                />
                <Link to={`/lessons/${progress.lesson_id}`}>
                  <Button variant="primary" size="sm" className="w-full">
                    <ApperIcon name="Play" size={16} className="mr-2" />
                    이어서 학습하기
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </section>
      )}
      
      {/* Featured Lessons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-surface-900">추천 레슨</h2>
          <Link to="/lessons">
            <Button variant="outline">
              전체 레슨 보기
              <ApperIcon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredLessons.map((lesson) => (
            <LessonCard key={lesson.Id} lesson={lesson} />
          ))}
        </div>
      </section>
      
      {/* Features */}
      <section className="bg-gradient-to-r from-surface-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-surface-900 mb-4">
              왜 레슨플로우를 선택해야 할까요?
            </h2>
            <p className="text-xl text-surface-600 max-w-3xl mx-auto">
              효과적인 학습을 위한 모든 기능을 제공합니다
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "Target",
                title: "개인 맞춤 학습",
                description: "개인의 수준과 목표에 맞는 커스텀 학습 경로를 제공합니다.",
                gradient: "from-primary-500 to-primary-600"
              },
              {
                icon: "Users",
                title: "활발한 커뮤니티",
                description: "동료 학습자들과 소통하며함께 성장할 수 있는 공간입니다.",
                gradient: "from-secondary-500 to-secondary-600"
              },
              {
                icon: "Award",
                title: "검증된 강사진",
                description: "경험 많은 전문 강사들이 질 높은 교육을 제공합니다.",
                gradient: "from-accent-500 to-accent-600"
              },
              {
                icon: "Smartphone",
                title: "언제 어디서나",
                description: "모바일과 데스크톱에서 언제든 편리하게 학습하세요.",
                gradient: "from-green-500 to-green-600"
              },
              {
                icon: "TrendingUp",
                title: "학습 진도 추적",
                description: "상세한 진도 관리로 학습 효과를 극대화할 수 있습니다.",
                gradient: "from-purple-500 to-purple-600"
              },
              {
                icon: "Clock",
                title: "유연한 스케줄",
                description: "본인의 일정에 맞춰 자유롭게 학습 계획을 세울 수 있습니다.",
                gradient: "from-pink-500 to-pink-600"
              }
            ].map((feature, index) => (
              <Card key={index} variant="elevated" hover className="p-8 text-center group">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <ApperIcon name={feature.icon} className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-surface-900 mb-4">{feature.title}</h3>
                <p className="text-surface-600 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            지금 바로 한국어 학습을 시작하세요
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            무료 체험으로 레슨플로우의 모든 기능을 경험해보세요. 
            언제든 원하는 플랜으로 업그레이드할 수 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="accent" size="xl" className="text-lg font-semibold">
              <ApperIcon name="Rocket" size={20} className="mr-2" />
              무료로 시작하기
            </Button>
            <Link to="/membership">
              <Button 
                variant="outline" 
                size="xl"
                className="text-white border-white hover:bg-white hover:text-primary-700"
              >
                <ApperIcon name="Crown" size={20} className="mr-2" />
                플랜 살펴보기
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
import React, { useState, useEffect } from "react"
import { cn } from "@/utils/cn"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Avatar from "@/components/atoms/Avatar"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import postService from "@/services/api/postService"
import userService from "@/services/api/userService"
import lessonService from "@/services/api/lessonService"
import { formatKoreanDateTime } from "@/utils/dateFormat"
import { toast } from "react-toastify"

const AdminDashboard = () => {
  const [flaggedPosts, setFlaggedPosts] = useState([])
  const [users, setUsers] = useState([])
  const [lessons, setLessons] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("flagged") // flagged, users, lessons, stats
  
  const tabs = [
    { id: "flagged", name: "신고된 게시글", icon: "Flag", count: flaggedPosts.length },
    { id: "users", name: "사용자 관리", icon: "Users", count: users.length },
    { id: "lessons", name: "레슨 관리", icon: "BookOpen", count: lessons.length },
    { id: "stats", name: "통계", icon: "BarChart", count: null }
  ]
  
  useEffect(() => {
    loadDashboardData()
  }, [])
  
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [postsData, usersData, lessonsData] = await Promise.all([
        postService.getAll(),
        userService.getAll(),
        lessonService.getAll()
      ])
      
      // 신고된 게시글만 필터링
      const flagged = postsData.filter(post => post.has_flagged)
      
      // 게시글에 작성자 정보 추가
      const flaggedWithAuthors = flagged.map(post => {
        const author = usersData.find(user => user.Id === post.user_id)
        return {
          ...post,
          author_name: author?.name || "알 수 없음",
          author_email: author?.email || ""
        }
      })
      
      setFlaggedPosts(flaggedWithAuthors)
      setUsers(usersData)
      setLessons(lessonsData)
      
      // 통계 계산
      const statsData = {
        totalUsers: usersData.length,
        totalLessons: lessonsData.length,
        totalPosts: postsData.length,
        flaggedPosts: flagged.length,
        adminUsers: usersData.filter(u => u.role === "admin").length,
        memberUsers: usersData.filter(u => u.role === "member").length,
        guestUsers: usersData.filter(u => u.role === "guest").length
      }
      
      setStats(statsData)
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const handleUnflagPost = async (postId) => {
    try {
      const post = flaggedPosts.find(p => p.Id === postId)
      if (!post) return
      
      await postService.update(postId, {
        ...post,
        has_flagged: false,
        flag_reason: null
      })
      
      toast.success("신고가 해제되었습니다.")
      loadDashboardData()
      
    } catch (err) {
      toast.error("신고 해제에 실패했습니다.")
    }
  }
  
  const handleDeletePost = async (postId) => {
    if (!confirm("정말로 이 게시글을 삭제하시겠습니까?")) return
    
    try {
      await postService.delete(postId)
      toast.success("게시글이 삭제되었습니다.")
      loadDashboardData()
      
    } catch (err) {
      toast.error("게시글 삭제에 실패했습니다.")
    }
  }
  
  const handleChangeUserRole = async (userId, newRole) => {
    try {
      const user = users.find(u => u.Id === userId)
      if (!user) return
      
      await userService.update(userId, {
        ...user,
        role: newRole
      })
      
      toast.success(`사용자 권한이 ${newRole}로 변경되었습니다.`)
      loadDashboardData()
      
    } catch (err) {
      toast.error("권한 변경에 실패했습니다.")
    }
  }
  
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadDashboardData} />
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900 mb-4">관리자 대시보드</h1>
        <p className="text-lg text-surface-600">플랫폼 관리와 모니터링을 위한 관리자 도구</p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card variant="gradient" className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Users" className="text-white" size={24} />
          </div>
          <div className="text-2xl font-bold text-surface-900 mb-1">
            {stats.totalUsers}
          </div>
          <div className="text-sm text-surface-600">전체 사용자</div>
        </Card>
        
        <Card variant="gradient" className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="BookOpen" className="text-white" size={24} />
          </div>
          <div className="text-2xl font-bold text-surface-900 mb-1">
            {stats.totalLessons}
          </div>
          <div className="text-sm text-surface-600">전체 레슨</div>
        </Card>
        
        <Card variant="gradient" className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-accent-500 to-accent-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="MessageCircle" className="text-white" size={24} />
          </div>
          <div className="text-2xl font-bold text-surface-900 mb-1">
            {stats.totalPosts}
          </div>
          <div className="text-sm text-surface-600">전체 게시글</div>
        </Card>
        
        <Card variant="gradient" className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Flag" className="text-white" size={24} />
          </div>
          <div className="text-2xl font-bold text-surface-900 mb-1">
            {stats.flaggedPosts}
          </div>
          <div className="text-sm text-surface-600">신고된 게시글</div>
        </Card>
      </div>
      
      {/* Navigation Tabs */}
      <Card variant="elevated" className="p-6 mb-8">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === tab.id
                  ? "bg-primary-100 text-primary-700 border border-primary-200"
                  : "bg-surface-100 text-surface-600 hover:bg-surface-200"
              )}
            >
              <ApperIcon name={tab.icon} size={16} className="mr-2" />
              {tab.name}
              {tab.count !== null && (
                <Badge variant="default" size="xs" className="ml-2">
                  {tab.count}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </Card>
      
      {/* Content based on active tab */}
      {activeTab === "flagged" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-surface-900">신고된 게시글</h2>
            <Button variant="outline" onClick={loadDashboardData}>
              <ApperIcon name="RefreshCw" size={16} className="mr-2" />
              새로고침
            </Button>
          </div>
          
          {flaggedPosts.length === 0 ? (
            <Empty
              icon="Flag"
              title="신고된 게시글이 없습니다"
              description="현재 처리가 필요한 신고된 게시글이 없습니다."
            />
          ) : (
            <div className="space-y-4">
              {flaggedPosts.map((post) => (
                <Card key={post.Id} variant="elevated" className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar name={post.author_name} size="sm" />
                      <div>
                        <h4 className="font-medium text-surface-900">{post.author_name}</h4>
                        <p className="text-sm text-surface-500">{post.author_email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="error" size="sm">
                        <ApperIcon name="Flag" size={12} className="mr-1" />
                        신고됨
                      </Badge>
                      <span className="text-sm text-surface-500 korean-date">
                        {formatKoreanDateTime(post.created_at)}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-surface-900 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-surface-700 mb-4 line-clamp-3">
                    {post.content}
                  </p>
                  
                  {post.flag_reason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center mb-2">
                        <ApperIcon name="AlertTriangle" className="text-red-500 mr-2" size={16} />
                        <span className="font-medium text-red-800">신고 사유</span>
                      </div>
                      <p className="text-red-700">{post.flag_reason}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleUnflagPost(post.Id)}
                    >
                      <ApperIcon name="Check" size={14} className="mr-1" />
                      신고 해제
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeletePost(post.Id)}
                    >
                      <ApperIcon name="Trash2" size={14} className="mr-1" />
                      게시글 삭제
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
      
      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-surface-900">사용자 관리</h2>
            <div className="flex gap-2">
              <Badge variant="admin" size="sm">관리자: {stats.adminUsers}</Badge>
              <Badge variant="member" size="sm">멤버: {stats.memberUsers}</Badge>
              <Badge variant="guest" size="sm">게스트: {stats.guestUsers}</Badge>
            </div>
          </div>
          
          <Card variant="elevated" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-surface-700">사용자</th>
                    <th className="text-left py-4 px-6 font-medium text-surface-700">이메일</th>
                    <th className="text-left py-4 px-6 font-medium text-surface-700">권한</th>
                    <th className="text-left py-4 px-6 font-medium text-surface-700">멤버십</th>
                    <th className="text-left py-4 px-6 font-medium text-surface-700">액션</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.Id} className="border-t border-surface-200">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <Avatar name={user.name} size="sm" />
                          <span className="font-medium text-surface-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-surface-600">{user.email}</td>
                      <td className="py-4 px-6">
                        <Badge variant={user.role} size="sm">{user.role}</Badge>
                      </td>
                      <td className="py-4 px-6 text-surface-600">
                        {user.tier_id ? `티어 ${user.tier_id}` : "없음"}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <select
                            value={user.role}
                            onChange={(e) => handleChangeUserRole(user.Id, e.target.value)}
                            className="text-sm border border-surface-300 rounded px-2 py-1"
                          >
                            <option value="guest">guest</option>
                            <option value="member">member</option>
                            <option value="admin">admin</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
      
      {activeTab === "lessons" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-surface-900">레슨 관리</h2>
            <Button variant="primary">
              <ApperIcon name="Plus" size={16} className="mr-2" />
              새 레슨 추가
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <Card key={lesson.Id} variant="elevated" hover className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant={lesson.tier_required === 1 ? "guest" : lesson.tier_required === 2 ? "member" : "admin"} size="sm">
                    {lesson.tier_required === 1 ? "무료" : lesson.tier_required === 2 ? "프리미엄" : "VIP"}
                  </Badge>
                  <div className="flex items-center text-sm text-surface-500">
                    <ApperIcon name="Clock" size={14} className="mr-1" />
                    {lesson.duration_minutes}분
                  </div>
                </div>
                
                <h3 className="font-semibold text-surface-900 mb-2 line-clamp-2">
                  {lesson.title}
                </h3>
                
                <p className="text-surface-600 text-sm mb-4 line-clamp-3">
                  {lesson.description}
                </p>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <ApperIcon name="Edit" size={14} className="mr-1" />
                    수정
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ApperIcon name="MoreHorizontal" size={14} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === "stats" && (
        <div className="space-y-8">
          <h2 className="text-xl font-semibold text-surface-900">플랫폼 통계</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Distribution */}
            <Card variant="elevated" className="p-6">
              <h3 className="text-lg font-semibold text-surface-900 mb-6">사용자 분포</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-surface-700">관리자</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-surface-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${(stats.adminUsers / stats.totalUsers) * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-medium w-8 text-right">{stats.adminUsers}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-surface-700">멤버</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-surface-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                        style={{ width: `${(stats.memberUsers / stats.totalUsers) * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-medium w-8 text-right">{stats.memberUsers}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-surface-700">게스트</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-surface-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-gradient-to-r from-surface-400 to-surface-500 h-2 rounded-full"
                        style={{ width: `${(stats.guestUsers / stats.totalUsers) * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-medium w-8 text-right">{stats.guestUsers}</span>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Content Stats */}
            <Card variant="elevated" className="p-6">
              <h3 className="text-lg font-semibold text-surface-900 mb-6">콘텐츠 현황</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <ApperIcon name="BookOpen" className="text-primary-500 mr-3" size={20} />
                    <span className="text-surface-700">전체 레슨</span>
                  </div>
                  <span className="text-xl font-bold text-surface-900">{stats.totalLessons}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <ApperIcon name="MessageCircle" className="text-secondary-500 mr-3" size={20} />
                    <span className="text-surface-700">전체 게시글</span>
                  </div>
                  <span className="text-xl font-bold text-surface-900">{stats.totalPosts}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <ApperIcon name="Flag" className="text-red-500 mr-3" size={20} />
                    <span className="text-surface-700">신고된 게시글</span>
                  </div>
                  <span className="text-xl font-bold text-red-600">{stats.flaggedPosts}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
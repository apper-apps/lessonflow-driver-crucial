import React, { useState, useEffect } from "react"
import { cn } from "@/utils/cn"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Card from "@/components/atoms/Card"
import PostItem from "@/components/molecules/PostItem"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import postService from "@/services/api/postService"
import userService from "@/services/api/userService"
import { toast } from "react-toastify"

const Community = () => {
  const [posts, setPosts] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newPost, setNewPost] = useState({ title: "", content: "" })
  const [creating, setCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  
  const sortOptions = [
    { id: "newest", name: "최신순", icon: "Calendar" },
    { id: "popular", name: "인기순", icon: "TrendingUp" },
    { id: "flagged", name: "신고된 글", icon: "Flag" }
  ]
  
  useEffect(() => {
    loadData()
  }, [])
  
  useEffect(() => {
    filterAndSortPosts()
  }, [posts, searchQuery, sortBy])
  
const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [postsData, usersData] = await Promise.all([
        postService.getAll(),
        userService.getAll()
      ])
      
      // 포스트에 작성자 정보 추가 - handle lookup field properly
      const postsWithAuthors = postsData.map(post => {
        const userIdValue = post.user_id?.Id || post.user_id
        const author = usersData.find(user => user.Id === userIdValue)
        return {
          ...post,
          author_name: author?.Name || "알 수 없음"
        }
      })
      
      setPosts(postsWithAuthors)
      
      // 현재 사용자 설정 (데모용)
      if (usersData.length > 0) {
        setCurrentUser(usersData[0])
      }
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const filterAndSortPosts = () => {
    let filtered = [...posts]
    
    // 검색 필터
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.author_name.toLowerCase().includes(query)
      )
    }
    
    // 정렬
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        break
      case "popular":
        // 인기순 (임시로 ID 순으로 정렬)
        filtered.sort((a, b) => a.Id - b.Id)
        break
      case "flagged":
        // 관리자만 신고된 글 보기
        if (currentUser?.role === "admin") {
          filtered = filtered.filter(post => post.has_flagged)
        }
        break
    }
    
    setPosts(filtered)
  }
  
const handleCreatePost = async (e) => {
    e.preventDefault()
    
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error("제목과 내용을 모두 입력해주세요.")
      return
    }
    
    try {
      setCreating(true)
      
      // Use database field names and handle lookup fields
      const createdPost = await postService.create({
        title: newPost.title.trim(),
        content: newPost.content.trim(),
        user_id: currentUser?.Id || 1,
        has_flagged: false,
        flag_reason: null,
        created_at: new Date().toISOString()
      })
      
      if (createdPost) {
        setNewPost({ title: "", content: "" })
        setShowCreateForm(false)
        toast.success("게시글이 작성되었습니다.")
        
        // 목록 새로고침
        await loadData()
      }
      
    } catch (err) {
      toast.error("게시글 작성에 실패했습니다.")
    } finally {
      setCreating(false)
    }
  }
  
const handleFlagPost = async (postId, reason) => {
    try {
      const post = posts.find(p => p.Id === postId)
      if (!post) return
      
      // Use database field names and handle lookup fields
      const updatedPost = await postService.update(postId, {
        Name: post.Name,
        Tags: post.Tags,
        Owner: post.Owner,
        title: post.title,
        content: post.content,
        has_flagged: true,
        flag_reason: reason,
        created_at: post.created_at,
        user_id: post.user_id?.Id || post.user_id
      })
      
      if (updatedPost) {
        toast.success("게시글이 신고되었습니다.")
        
        // 목록 새로고침
        await loadData()
      }
      
    } catch (err) {
      toast.error("신고 처리에 실패했습니다.")
    }
  }
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />
  
  const filteredPosts = posts.filter(post => {
    let shouldShow = true
    
    // 검색 필터
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      shouldShow = post.title.toLowerCase().includes(query) ||
                   post.content.toLowerCase().includes(query) ||
                   post.author_name.toLowerCase().includes(query)
    }
    
    // 신고된 글 필터 (관리자가 아닌 경우 숨김)
    if (sortBy === "flagged" && currentUser?.role !== "admin") {
      shouldShow = false
    } else if (sortBy !== "flagged" && post.has_flagged && currentUser?.role !== "admin") {
      shouldShow = false
    }
    
    return shouldShow
  })
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-surface-900 mb-2">커뮤니티</h1>
          <p className="text-surface-600">함께 배우고 성장하는 학습 공간</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setShowCreateForm(true)}
          className="mt-4 sm:mt-0"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          글 작성하기
        </Button>
      </div>
      
      {/* Search and Sort */}
      <Card variant="elevated" className="p-6 mb-8">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <ApperIcon 
              name="Search" 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400"
              size={20}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="게시글 검색..."
              className="w-full pl-10 pr-4 py-3 border border-surface-300 rounded-xl bg-white text-surface-900 placeholder-surface-500 transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none"
            />
          </div>
          
          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-surface-700 mr-2 flex items-center">
              <ApperIcon name="ArrowUpDown" size={16} className="mr-1" />
              정렬:
            </span>
            <div className="flex gap-1">
              {sortOptions.map((option) => {
                // 신고된 글은 관리자만 볼 수 있음
                if (option.id === "flagged" && currentUser?.role !== "admin") {
                  return null
                }
                
                return (
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
                )
              })}
            </div>
          </div>
        </div>
      </Card>
      
      {/* Create Post Form */}
      {showCreateForm && (
        <Card variant="elevated" className="p-6 mb-8">
          <h3 className="text-lg font-semibold text-surface-900 mb-4">새 글 작성</h3>
          <form onSubmit={handleCreatePost} className="space-y-4">
            <Input
              label="제목"
              value={newPost.title}
              onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
              placeholder="게시글 제목을 입력하세요..."
              required
            />
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                내용
              </label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                placeholder="게시글 내용을 입력하세요..."
                rows={6}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg bg-white text-surface-900 placeholder-surface-500 transition-all duration-200 form-input focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                required
              />
            </div>
            <div className="flex gap-3">
              <Button 
                type="submit" 
                variant="primary" 
                disabled={creating}
                className="flex-1"
              >
                {creating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    작성 중...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Send" size={16} className="mr-2" />
                    게시하기
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowCreateForm(false)
                  setNewPost({ title: "", content: "" })
                }}
              >
                취소
              </Button>
            </div>
          </form>
        </Card>
      )}
      
      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <Empty
          icon="MessageCircle"
          title="게시글이 없습니다"
          description="첫 번째 게시글을 작성해보세요!"
          action={() => setShowCreateForm(true)}
          actionLabel="글 작성하기"
        />
      ) : (
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <PostItem
              key={post.Id}
              post={post}
              currentUser={currentUser}
              onFlag={handleFlagPost}
            />
          ))}
        </div>
      )}
      
      {/* Load More */}
      {filteredPosts.length >= 10 && (
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            <ApperIcon name="MoreHorizontal" size={20} className="mr-2" />
            더 많은 게시글 보기
          </Button>
        </div>
      )}
    </div>
  )
}

export default Community
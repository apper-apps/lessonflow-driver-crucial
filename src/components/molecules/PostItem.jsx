import React from "react"
import { cn } from "@/utils/cn"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Avatar from "@/components/atoms/Avatar"
import ApperIcon from "@/components/ApperIcon"
import { formatRelativeTime } from "@/utils/dateFormat"

const PostItem = ({ post, currentUser, onFlag, className }) => {
  const canFlag = currentUser && currentUser.Id !== post.user_id && !post.has_flagged
  const isAdmin = currentUser?.role === "admin"
  
  const handleFlag = () => {
    const reason = prompt("신고 사유를 입력해주세요:")
    if (reason && reason.trim()) {
      onFlag(post.Id, reason.trim())
    }
  }
  
  return (
    <Card variant="elevated" hover className={cn("p-6", className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar name={post.author_name} size="sm" />
          <div>
            <h4 className="font-medium text-surface-900">{post.author_name}</h4>
            <p className="text-sm text-surface-500 korean-date">
              {formatRelativeTime(post.created_at)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {post.has_flagged && isAdmin && (
            <Badge variant="error" size="xs">
              <ApperIcon name="Flag" size={12} className="mr-1" />
              신고됨
            </Badge>
          )}
          {canFlag && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFlag}
              className="text-surface-500 hover:text-red-600"
            >
              <ApperIcon name="Flag" size={16} className="mr-1" />
              신고
            </Button>
          )}
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-surface-900 mb-3 hover:text-primary-600 transition-colors duration-200 cursor-pointer">
        {post.title}
      </h3>
      
      <p className="text-surface-700 line-clamp-3 mb-4">
        {post.content}
      </p>
      
      {post.has_flagged && post.flag_reason && isAdmin && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="flex items-center mb-1">
            <ApperIcon name="AlertTriangle" className="text-red-500 mr-2" size={16} />
            <span className="text-sm font-medium text-red-800">신고 사유</span>
          </div>
          <p className="text-sm text-red-700">{post.flag_reason}</p>
        </div>
      )}
      
      <div className="flex items-center justify-between text-sm text-surface-500">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <ApperIcon name="Heart" size={16} className="mr-1" />
            24
          </span>
          <span className="flex items-center">
            <ApperIcon name="MessageCircle" size={16} className="mr-1" />
            8
          </span>
        </div>
        <Button variant="ghost" size="sm" className="text-primary-600">
          자세히 보기
        </Button>
      </div>
    </Card>
  )
}

export default PostItem
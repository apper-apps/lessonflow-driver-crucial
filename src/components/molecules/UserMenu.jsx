import React, { useState } from "react"
import { Link } from "react-router-dom"
import { cn } from "@/utils/cn"
import Avatar from "@/components/atoms/Avatar"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"

const UserMenu = ({ user, className }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  if (!user) {
    return (
      <div className={cn("flex items-center space-x-3", className)}>
        <button className="text-surface-600 hover:text-primary-600 transition-colors duration-200">
          로그인
        </button>
        <button className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200">
          회원가입
        </button>
      </div>
    )
  }
  
  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-surface-100 transition-colors duration-200"
      >
        <Avatar name={user.name} size="sm" />
        <div className="text-left hidden md:block">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-surface-900">{user.name}</span>
            <Badge variant={user.role} size="xs">{user.role}</Badge>
          </div>
          <p className="text-xs text-surface-500">{user.email}</p>
        </div>
        <ApperIcon 
          name="ChevronDown" 
          size={16} 
          className={cn("text-surface-500 transition-transform duration-200", isOpen && "rotate-180")}
        />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-surface-200 py-2 z-50 animate-fade-in">
          <div className="px-4 py-3 border-b border-surface-100">
            <div className="flex items-center space-x-3">
              <Avatar name={user.name} size="md" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-surface-900">{user.name}</span>
                  <Badge variant={user.role} size="xs">{user.role}</Badge>
                </div>
                <p className="text-sm text-surface-500">{user.email}</p>
              </div>
            </div>
          </div>
          
          <div className="py-2">
            <Link
              to="/my-learning"
              className="flex items-center px-4 py-2 text-surface-700 hover:bg-surface-50 transition-colors duration-200"
            >
              <ApperIcon name="BookOpen" size={16} className="mr-3" />
              내 학습
            </Link>
            <Link
              to="/membership"
              className="flex items-center px-4 py-2 text-surface-700 hover:bg-surface-50 transition-colors duration-200"
            >
              <ApperIcon name="Crown" size={16} className="mr-3" />
              멤버십
            </Link>
            {user.role === "admin" && (
              <Link
                to="/admin"
                className="flex items-center px-4 py-2 text-surface-700 hover:bg-surface-50 transition-colors duration-200"
              >
                <ApperIcon name="Shield" size={16} className="mr-3" />
                관리자 대시보드
              </Link>
            )}
            <hr className="my-2 border-surface-100" />
            <button className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200">
              <ApperIcon name="LogOut" size={16} className="mr-3" />
              로그아웃
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMenu
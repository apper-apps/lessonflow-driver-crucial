import React, { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/utils/cn"
import SearchBar from "@/components/molecules/SearchBar"
import UserMenu from "@/components/molecules/UserMenu"
import ApperIcon from "@/components/ApperIcon"

const Header = ({ user }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const location = useLocation()
  
  const navigation = [
    { name: "홈", href: "/", icon: "Home" },
    { name: "레슨", href: "/lessons", icon: "BookOpen" },
    { name: "커뮤니티", href: "/community", icon: "Users" },
    { name: "내 학습", href: "/my-learning", icon: "GraduationCap" },
    { name: "멤버십", href: "/membership", icon: "Crown" }
  ]
  
  const handleSearch = (query) => {
    console.log("검색:", query)
    // Algolia 검색 로직 구현 예정
  }
  
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-surface-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="GraduationCap" className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              레슨플로우
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-primary-50 text-primary-600" 
                      : "text-surface-600 hover:text-primary-600 hover:bg-surface-50"
                  )}
                >
                  <ApperIcon name={item.icon} size={16} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
          
          {/* Search Bar */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              placeholder="레슨, 강사, 주제 검색..."
            />
          </div>
          
          {/* User Menu */}
          <div className="hidden md:block">
            <UserMenu user={user} />
          </div>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-surface-600 hover:text-primary-600 hover:bg-surface-50 transition-colors duration-200"
          >
            <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>
        
        {/* Mobile Search */}
        <div className="lg:hidden pb-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            placeholder="레슨, 강사, 주제 검색..."
          />
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-surface-200 animate-slide-up">
          <div className="px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-200",
                    isActive 
                      ? "bg-primary-50 text-primary-600" 
                      : "text-surface-600 hover:text-primary-600 hover:bg-surface-50"
                  )}
                >
                  <ApperIcon name={item.icon} size={20} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
            
            {user && (
              <>
                <hr className="border-surface-200 my-4" />
                <div className="px-3 py-2">
                  <UserMenu user={user} />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
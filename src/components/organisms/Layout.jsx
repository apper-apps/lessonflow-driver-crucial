import React, { useState, useEffect } from "react"
import Header from "@/components/organisms/Header"
import userService from "@/services/api/userService"

const Layout = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadCurrentUser()
  }, [])
  
  const loadCurrentUser = async () => {
    try {
      // 실제 구현에서는 토큰 기반 인증을 사용
      // 여기서는 demo 목적으로 첫 번째 사용자를 현재 사용자로 설정
      const users = await userService.getAll()
      if (users.length > 0) {
        setCurrentUser(users[0])
      }
    } catch (error) {
      console.error("사용자 정보 로드 실패:", error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-surface-50">
      <Header user={currentUser} />
      <main className="pb-16">
        {children}
      </main>
      <footer className="bg-white border-t border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">LF</span>
                </div>
                <span className="text-xl font-bold text-surface-900">레슨플로우</span>
              </div>
              <p className="text-surface-600 mb-4">
                한국어 학습자를 위한 프리미엄 온라인 교육 플랫폼으로, 
                체계적인 레슨과 커뮤니티를 통해 효과적인 학습 경험을 제공합니다.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-surface-400 hover:text-primary-600 transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                </a>
                <a href="#" className="text-surface-400 hover:text-primary-600 transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.348-1.051-2.348-2.348c0-1.297 1.051-2.348 2.348-2.348c1.297 0 2.348 1.051 2.348 2.348c0 1.297-1.051 2.348-2.348 2.348zM15.568 16.988c-1.297 0-2.348-1.051-2.348-2.348c0-1.297 1.051-2.348 2.348-2.348c1.297 0 2.348 1.051 2.348 2.348c0 1.297-1.051 2.348-2.348 2.348z"/>
                  </svg>
                </a>
                <a href="#" className="text-surface-400 hover:text-primary-600 transition-colors">
                  <span className="sr-only">YouTube</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-surface-900 tracking-wider uppercase">학습</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-surface-500 hover:text-surface-900">전체 레슨</a></li>
                <li><a href="#" className="text-base text-surface-500 hover:text-surface-900">초급 과정</a></li>
                <li><a href="#" className="text-base text-surface-500 hover:text-surface-900">중급 과정</a></li>
                <li><a href="#" className="text-base text-surface-500 hover:text-surface-900">고급 과정</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-surface-900 tracking-wider uppercase">지원</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-surface-500 hover:text-surface-900">고객센터</a></li>
                <li><a href="#" className="text-base text-surface-500 hover:text-surface-900">자주 묻는 질문</a></li>
                <li><a href="#" className="text-base text-surface-500 hover:text-surface-900">학습 가이드</a></li>
                <li><a href="#" className="text-base text-surface-500 hover:text-surface-900">문의하기</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 border-t border-surface-200 pt-8">
            <p className="text-base text-surface-400 text-center">
              &copy; 2024 레슨플로우. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
import React, { useState, useEffect } from "react"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import MembershipCard from "@/components/molecules/MembershipCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import membershipService from "@/services/api/membershipService"
import userService from "@/services/api/userService"
import { toast } from "react-toastify"

const Membership = () => {
  const [tiers, setTiers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [currentTier, setCurrentTier] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedTier, setSelectedTier] = useState(null)
  
  useEffect(() => {
    loadMembershipData()
  }, [])
  
const loadMembershipData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [tiersData, usersData] = await Promise.all([
        membershipService.getAll(),
        userService.getAll()
      ])
      
      // 활성화된 티어만 표시 - handle lookup field properly
      const activeTiers = tiersData.filter(tier => tier.is_active)
      setTiers(activeTiers)
      
      // 현재 사용자 정보 (데모용)
      if (usersData.length > 0) {
        const user = usersData[0]
        setCurrentUser(user)
        
        // 현재 사용자의 멤버십 티어 정보 - handle lookup field properly
        if (user.tier_id) {
          const tierIdValue = user.tier_id?.Id || user.tier_id
          const userTier = tiersData.find(tier => tier.Id === tierIdValue)
          setCurrentTier(userTier)
        }
      }
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const handleSelectTier = (tier) => {
    if (currentTier?.Id === tier.Id) {
      toast.info("이미 현재 플랜을 이용중입니다.")
      return
    }
    
    setSelectedTier(tier)
    setShowPaymentModal(true)
  }
  
const handlePayment = async () => {
    try {
      // Stripe 결제 프로세스 시뮬레이션
      toast.info("결제 처리 중...")
      
      // 실제 구현에서는 Stripe Checkout 세션 생성
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // 사용자 멤버십 업데이트 - use database field names and handle lookup fields
      if (currentUser && selectedTier) {
        const updatedUser = await userService.update(currentUser.Id, {
          Name: currentUser.Name,
          Tags: currentUser.Tags,
          Owner: currentUser.Owner,
          email: currentUser.email,
          tier_id: selectedTier.Id,
          role: selectedTier.Id > 1 ? "member" : "guest"
        })
        
        if (updatedUser) {
          setCurrentTier(selectedTier)
          setCurrentUser(prev => ({
            ...prev,
            tier_id: selectedTier.Id,
            role: selectedTier.Id > 1 ? "member" : "guest"
          }))
          
          toast.success(`${selectedTier.Name} 플랜으로 업그레이드되었습니다!`)
        }
      }
      
      setShowPaymentModal(false)
      setSelectedTier(null)
      
    } catch (err) {
      toast.error("결제 처리 중 오류가 발생했습니다.")
    }
  }
  
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadMembershipData} />
  
  const features = [
    {
      category: "기본 기능",
      items: [
        { name: "무료 레슨 시청", free: true, premium: true, vip: true },
        { name: "커뮤니티 참여", free: true, premium: true, vip: true },
        { name: "학습 진도 추적", free: true, premium: true, vip: true },
        { name: "모바일 앱 이용", free: true, premium: true, vip: true }
      ]
    },
    {
      category: "프리미엄 기능",
      items: [
        { name: "전체 레슨 무제한", free: false, premium: true, vip: true },
        { name: "오프라인 다운로드", free: false, premium: true, vip: true },
        { name: "학습 자료 PDF", free: false, premium: true, vip: true },
        { name: "우선 고객지원", free: false, premium: true, vip: true }
      ]
    },
    {
      category: "VIP 전용",
      items: [
        { name: "1:1 개인 코칭", free: false, premium: false, vip: true },
        { name: "실시간 화상 수업", free: false, premium: false, vip: true },
        { name: "맞춤형 학습 계획", free: false, premium: false, vip: true },
        { name: "전용 VIP 라운지", free: false, premium: false, vip: true }
      ]
    }
  ]
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-surface-900 mb-4">멤버십 플랜</h1>
        <p className="text-xl text-surface-600 max-w-2xl mx-auto">
          학습 목표에 맞는 플랜을 선택하고 더 나은 한국어 실력을 만들어보세요
        </p>
      </div>
      
      {/* Current Plan */}
      {currentTier && (
        <Card variant="gradient" className="p-6 mb-12 border-2 border-primary-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <ApperIcon name="Crown" className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-surface-900">
                  현재 플랜: {currentTier.name}
                </h3>
                <p className="text-surface-600">
                  월 ₩{new Intl.NumberFormat("ko-KR").format(currentTier.price_monthly)}
                </p>
              </div>
            </div>
            <Button variant="outline">
              <ApperIcon name="Settings" size={16} className="mr-2" />
              플랜 관리
            </Button>
          </div>
        </Card>
      )}
      
      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {tiers.map((tier) => (
          <MembershipCard
            key={tier.Id}
            tier={tier}
            currentTier={currentTier}
            onSelect={handleSelectTier}
          />
        ))}
      </div>
      
      {/* Feature Comparison */}
      <Card variant="elevated" className="overflow-hidden mb-12">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-surface-900 mb-8 text-center">
            플랜별 기능 비교
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200">
                  <th className="text-left py-4 px-6">기능</th>
                  <th className="text-center py-4 px-6">무료</th>
                  <th className="text-center py-4 px-6">프리미엄</th>
                  <th className="text-center py-4 px-6">VIP</th>
                </tr>
              </thead>
              <tbody>
                {features.map((category) => (
                  <React.Fragment key={category.category}>
                    <tr className="bg-surface-50">
                      <td colSpan={4} className="py-3 px-6 font-semibold text-surface-900">
                        {category.category}
                      </td>
                    </tr>
                    {category.items.map((item) => (
                      <tr key={item.name} className="border-b border-surface-100">
                        <td className="py-4 px-6 text-surface-700">{item.name}</td>
                        <td className="text-center py-4 px-6">
                          {item.free ? (
                            <ApperIcon name="Check" className="text-green-500 mx-auto" size={20} />
                          ) : (
                            <ApperIcon name="X" className="text-surface-300 mx-auto" size={20} />
                          )}
                        </td>
                        <td className="text-center py-4 px-6">
                          {item.premium ? (
                            <ApperIcon name="Check" className="text-green-500 mx-auto" size={20} />
                          ) : (
                            <ApperIcon name="X" className="text-surface-300 mx-auto" size={20} />
                          )}
                        </td>
                        <td className="text-center py-4 px-6">
                          {item.vip ? (
                            <ApperIcon name="Check" className="text-green-500 mx-auto" size={20} />
                          ) : (
                            <ApperIcon name="X" className="text-surface-300 mx-auto" size={20} />
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
      
      {/* FAQ */}
      <Card variant="glass" className="p-8">
        <h2 className="text-2xl font-bold text-surface-900 mb-8 text-center">
          자주 묻는 질문
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              question: "언제든지 플랜을 변경할 수 있나요?",
              answer: "네, 언제든지 플랜을 업그레이드하거나 다운그레이드할 수 있습니다. 변경사항은 다음 결제 주기부터 적용됩니다."
            },
            {
              question: "무료 체험 기간이 있나요?",
              answer: "프리미엄과 VIP 플랜 모두 7일 무료 체험을 제공합니다. 체험 기간 중 언제든 취소할 수 있습니다."
            },
            {
              question: "결제는 어떻게 이루어지나요?",
              answer: "신용카드, 체크카드를 통해 안전하게 결제할 수 있습니다. 모든 결제는 Stripe을 통해 암호화되어 처리됩니다."
            },
            {
              question: "환불 정책은 어떻게 되나요?",
              answer: "14일 이내에 환불을 요청하실 수 있습니다. 단, 이미 다운로드한 자료가 있는 경우 일부 제한이 있을 수 있습니다."
            }
          ].map((faq, index) => (
            <div key={index} className="space-y-3">
              <h3 className="font-semibold text-surface-900 flex items-start">
                <ApperIcon name="HelpCircle" className="text-primary-500 mr-2 mt-0.5 flex-shrink-0" size={18} />
                {faq.question}
              </h3>
              <p className="text-surface-600 ml-6">{faq.answer}</p>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Payment Modal */}
      {showPaymentModal && selectedTier && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card variant="elevated" className="w-full max-w-md animate-scale-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-surface-900">결제하기</h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-surface-500 hover:text-surface-700 transition-colors"
                >
                  <ApperIcon name="X" size={24} />
                </button>
              </div>
              
              <div className="bg-surface-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-surface-900">{selectedTier.name} 플랜</span>
                  <span className="text-lg font-bold text-primary-600">
                    ₩{new Intl.NumberFormat("ko-KR").format(selectedTier.price_monthly)}/월
                  </span>
                </div>
                <p className="text-sm text-surface-600">
                  7일 무료 체험 후 매월 자동 결제
                </p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    카드 번호
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      만료일
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      CVC
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handlePayment}
                >
                  <ApperIcon name="CreditCard" size={16} className="mr-2" />
                  결제하기
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPaymentModal(false)}
                >
                  취소
                </Button>
              </div>
              
              <p className="text-xs text-surface-500 mt-4 text-center">
                결제 정보는 Stripe을 통해 안전하게 처리됩니다
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default Membership
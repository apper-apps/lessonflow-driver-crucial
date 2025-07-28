import React from "react"
import { cn } from "@/utils/cn"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"

const MembershipCard = ({ tier, currentTier, onSelect, className }) => {
  const isCurrentTier = currentTier?.Id === tier.Id
  const isPopular = tier.name === "프리미엄"
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR").format(price)
  }
  
  return (
    <Card 
      variant={isCurrentTier ? "gradient" : "elevated"} 
      className={cn("relative overflow-hidden", className)}
    >
      {isPopular && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-accent-500 to-accent-600 text-white text-center py-2 text-sm font-medium">
          <ApperIcon name="Star" size={16} className="inline mr-1" />
          가장 인기있는 플랜
        </div>
      )}
      
      <div className={cn("p-6", isPopular && "pt-12")}>
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-surface-900 mb-2">{tier.name}</h3>
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl font-bold text-primary-600">
              ₩{formatPrice(tier.price_monthly)}
            </span>
            <span className="text-surface-600 ml-2">/월</span>
          </div>
          {isCurrentTier && (
            <Badge variant="primary" size="md">현재 플랜</Badge>
          )}
        </div>
        
        <div className="space-y-3 mb-8">
          {tier.features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <ApperIcon name="Check" className="text-success mr-3 flex-shrink-0" size={20} />
              <span className="text-surface-700">{feature}</span>
            </div>
          ))}
        </div>
        
        <Button
          variant={isCurrentTier ? "outline" : "primary"}
          size="lg"
          className="w-full"
          onClick={() => onSelect && onSelect(tier)}
          disabled={isCurrentTier}
        >
          {isCurrentTier ? "현재 이용중" : "선택하기"}
        </Button>
      </div>
    </Card>
  )
}

export default MembershipCard
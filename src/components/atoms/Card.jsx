import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Card = forwardRef(({ 
  className, 
  variant = "default",
  hover = false,
  children, 
  ...props 
}, ref) => {
  const baseStyles = "rounded-xl border transition-all duration-250"
  
  const variants = {
    default: "bg-white border-surface-200 shadow-sm",
    glass: "glass border-white/20 shadow-lg",
    elevated: "bg-white border-surface-200 shadow-lg",
    gradient: "bg-gradient-to-br from-white to-surface-50 border-surface-200 shadow-md"
  }
  
  const hoverStyles = hover ? "card-hover cursor-pointer" : ""
  
  return (
    <div
      className={cn(baseStyles, variants[variant], hoverStyles, className)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = "Card"

export default Card
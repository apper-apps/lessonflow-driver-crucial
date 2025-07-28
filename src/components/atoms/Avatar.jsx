import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Avatar = forwardRef(({ 
  className, 
  src, 
  alt, 
  name,
  size = "md",
  ...props 
}, ref) => {
  const sizes = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl"
  }
  
  const getInitials = (name) => {
    if (!name) return "?"
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
  }
  
  const baseStyles = "relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white font-medium overflow-hidden"
  
  return (
    <div
      className={cn(baseStyles, sizes[size], className)}
      ref={ref}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt || name || "Avatar"}
          className="w-full h-full object-cover"
        />
      ) : name ? (
        <span>{getInitials(name)}</span>
      ) : (
        <ApperIcon name="User" className="w-1/2 h-1/2" />
      )}
    </div>
  )
})

Avatar.displayName = "Avatar"

export default Avatar
import React, { useState } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Input from "@/components/atoms/Input"

const SearchBar = ({ 
  className, 
  placeholder = "레슨 검색...", 
  onSearch,
  value = "",
  onChange
}) => {
  const [isFocused, setIsFocused] = useState(false)
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch && value.trim()) {
      onSearch(value.trim())
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          className={cn(
            "absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200",
            isFocused ? "text-primary-500" : "text-surface-400"
          )}
          size={20}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-surface-300 rounded-xl bg-white text-surface-900 placeholder-surface-500 transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange && onChange("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors duration-200"
          >
            <ApperIcon name="X" size={16} />
          </button>
        )}
      </div>
    </form>
  )
}

export default SearchBar
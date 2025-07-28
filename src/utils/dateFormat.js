import { format } from "date-fns"
import { ko } from "date-fns/locale"

export const formatKoreanDate = (date) => {
  if (!date) return ""
  return format(new Date(date), "yyyy.MM.dd", { locale: ko })
}

export const formatKoreanDateTime = (date) => {
  if (!date) return ""
  return format(new Date(date), "yyyy.MM.dd HH:mm", { locale: ko })
}

export const formatRelativeTime = (date) => {
  if (!date) return ""
  const now = new Date()
  const targetDate = new Date(date)
  const diffInMinutes = Math.floor((now - targetDate) / (1000 * 60))
  
  if (diffInMinutes < 1) return "방금 전"
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}시간 전`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}일 전`
  
  return formatKoreanDate(date)
}
import favoritesData from '@/services/mockData/favorites.json'

const favorites = [...favoritesData]

const favoritesService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 200))
    return [...favorites]
  },

  async getByUserId(userId) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return favorites.filter(fav => fav.user_id === userId)
  },

  async getByLessonId(lessonId) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return favorites.find(fav => fav.lesson_id === lessonId) || null
  },

  async isFavorited(userId, lessonId) {
    await new Promise(resolve => setTimeout(resolve, 100))
    return favorites.some(fav => fav.user_id === userId && fav.lesson_id === lessonId)
  },

  async addFavorite(userId, lessonId) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Check if already favorited
    const existing = favorites.find(fav => fav.user_id === userId && fav.lesson_id === lessonId)
    if (existing) {
      throw new Error("이미 즐겨찾기에 추가된 레슨입니다.")
    }

    const newFavorite = {
      Id: Math.max(...favorites.map(f => f.Id), 0) + 1,
      user_id: userId,
      lesson_id: lessonId,
      created_at: new Date().toISOString()
    }
    
    favorites.push(newFavorite)
    return newFavorite
  },

  async removeFavorite(userId, lessonId) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = favorites.findIndex(fav => fav.user_id === userId && fav.lesson_id === lessonId)
    if (index === -1) {
      throw new Error("즐겨찾기를 찾을 수 없습니다.")
    }
    
    favorites.splice(index, 1)
    return true
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = favorites.findIndex(fav => fav.Id === id)
    if (index === -1) {
      throw new Error("즐겨찾기를 찾을 수 없습니다.")
    }
    favorites.splice(index, 1)
    return true
  }
}

export default favoritesService
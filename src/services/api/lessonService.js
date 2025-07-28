import lessonData from "@/services/mockData/lessons.json"

let lessons = [...lessonData]

const lessonService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...lessons]
  },
  
  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return lessons.find(lesson => lesson.Id === id) || null
  },
  
  async getFavorites(userId) {
    await new Promise(resolve => setTimeout(resolve, 300))
    // This would typically be handled by favoritesService
    // but keeping for backward compatibility
    return [...lessons]
  },
  
  async create(lesson) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newLesson = {
      ...lesson,
      Id: Math.max(...lessons.map(l => l.Id)) + 1
    }
    lessons.push(newLesson)
    return newLesson
  },
  
  async update(id, lessonData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = lessons.findIndex(lesson => lesson.Id === id)
    if (index === -1) {
      throw new Error("레슨을 찾을 수 없습니다.")
    }
    lessons[index] = { ...lessons[index], ...lessonData }
    return lessons[index]
  },
  
  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = lessons.findIndex(lesson => lesson.Id === id)
    if (index === -1) {
      throw new Error("레슨을 찾을 수 없습니다.")
    }
    lessons.splice(index, 1)
    return true
  }
}

export default lessonService
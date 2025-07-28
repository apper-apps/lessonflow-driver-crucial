import progressData from "@/services/mockData/lessonProgress.json"

let progress = [...progressData]

const progressService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...progress]
  },
  
  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return progress.find(p => p.Id === id) || null
  },
  
  async getByUserId(userId) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return progress.filter(p => p.user_id === userId)
  },
  
  async getByLessonId(lessonId) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return progress.filter(p => p.lesson_id === lessonId)
  },
  
  async create(progressData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newProgress = {
      ...progressData,
      Id: Math.max(...progress.map(p => p.Id)) + 1
    }
    progress.push(newProgress)
    return newProgress
  },
  
  async update(id, progressData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = progress.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error("진행률 데이터를 찾을 수 없습니다.")
    }
    progress[index] = { ...progress[index], ...progressData }
    return progress[index]
  },
  
  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = progress.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error("진행률 데이터를 찾을 수 없습니다.")
    }
    progress.splice(index, 1)
    return true
  }
}

export default progressService
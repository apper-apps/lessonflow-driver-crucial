import userData from "@/services/mockData/users.json"

let users = [...userData]

const userService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...users]
  },
  
  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return users.find(user => user.Id === id) || null
  },
  
  async create(user) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newUser = {
      ...user,
      Id: Math.max(...users.map(u => u.Id)) + 1
    }
    users.push(newUser)
    return newUser
  },
  
  async update(id, userData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = users.findIndex(user => user.Id === id)
    if (index === -1) {
      throw new Error("사용자를 찾을 수 없습니다.")
    }
    users[index] = { ...users[index], ...userData }
    return users[index]
  },
  
  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = users.findIndex(user => user.Id === id)
    if (index === -1) {
      throw new Error("사용자를 찾을 수 없습니다.")
    }
    users.splice(index, 1)
    return true
  }
}

export default userService
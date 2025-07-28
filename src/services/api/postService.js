import postData from "@/services/mockData/posts.json"

let posts = [...postData]

const postService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...posts]
  },
  
  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return posts.find(post => post.Id === id) || null
  },
  
  async getFlagged() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return posts.filter(post => post.has_flagged)
  },
  
  async create(post) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newPost = {
      ...post,
      Id: Math.max(...posts.map(p => p.Id)) + 1
    }
    posts.push(newPost)
    return newPost
  },
  
  async update(id, postData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = posts.findIndex(post => post.Id === id)
    if (index === -1) {
      throw new Error("게시글을 찾을 수 없습니다.")
    }
    posts[index] = { ...posts[index], ...postData }
    return posts[index]
  },
  
  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = posts.findIndex(post => post.Id === id)
    if (index === -1) {
      throw new Error("게시글을 찾을 수 없습니다.")
    }
    posts.splice(index, 1)
    return true
  }
}

export default postService
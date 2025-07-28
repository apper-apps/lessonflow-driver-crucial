import membershipData from "@/services/mockData/membershipTiers.json"

let tiers = [...membershipData]

const membershipService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...tiers]
  },
  
  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return tiers.find(tier => tier.Id === id) || null
  },
  
  async create(tier) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newTier = {
      ...tier,
      Id: Math.max(...tiers.map(t => t.Id)) + 1
    }
    tiers.push(newTier)
    return newTier
  },
  
  async update(id, tierData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = tiers.findIndex(tier => tier.Id === id)
    if (index === -1) {
      throw new Error("멤버십 티어를 찾을 수 없습니다.")
    }
    tiers[index] = { ...tiers[index], ...tierData }
    return tiers[index]
  },
  
  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = tiers.findIndex(tier => tier.Id === id)
    if (index === -1) {
      throw new Error("멤버십 티어를 찾을 수 없습니다.")
    }
    tiers.splice(index, 1)
    return true
  }
}

export default membershipService
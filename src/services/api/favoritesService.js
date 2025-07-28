import { toast } from 'react-toastify'

const favoritesService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "created_at" } },
          { field: { Name: "user_id" } },
          { field: { Name: "lesson_id" } }
        ],
        orderBy: [
          { fieldName: "created_at", sorttype: "DESC" }
        ]
      }
      
      const response = await apperClient.fetchRecords('favorite', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching favorites:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return []
    }
  },

  async getByUserId(userId) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "created_at" } },
          { field: { Name: "user_id" } },
          { field: { Name: "lesson_id" } }
        ],
        where: [
          {
            FieldName: "user_id",
            Operator: "EqualTo",
            Values: [userId]
          }
        ],
        orderBy: [
          { fieldName: "created_at", sorttype: "DESC" }
        ]
      }
      
      const response = await apperClient.fetchRecords('favorite', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching user favorites:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return []
    }
  },

  async getByLessonId(lessonId) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "created_at" } },
          { field: { Name: "user_id" } },
          { field: { Name: "lesson_id" } }
        ],
        where: [
          {
            FieldName: "lesson_id",
            Operator: "EqualTo",
            Values: [lessonId]
          }
        ]
      }
      
      const response = await apperClient.fetchRecords('favorite', params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      return response.data && response.data.length > 0 ? response.data[0] : null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching lesson favorites:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  },

  async isFavorited(userId, lessonId) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          { field: { Name: "Name" } }
        ],
        where: [
          {
            FieldName: "user_id",
            Operator: "EqualTo",
            Values: [userId]
          },
          {
            FieldName: "lesson_id",
            Operator: "EqualTo",
            Values: [lessonId]
          }
        ]
      }
      
      const response = await apperClient.fetchRecords('favorite', params)
      
      if (!response.success) {
        return false
      }
      
      return response.data && response.data.length > 0
    } catch (error) {
      console.error("Error checking favorite status:", error.message)
      return false
    }
  },

  async addFavorite(userId, lessonId) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Check if already favorited
      const alreadyFavorited = await this.isFavorited(userId, lessonId)
      if (alreadyFavorited) {
        throw new Error("이미 즐겨찾기에 추가된 레슨입니다.")
      }
      
      // Only include Updateable fields, handle lookup fields as integers
      const params = {
        records: [{
          Name: `Favorite ${lessonId}`,
          created_at: new Date().toISOString(),
          user_id: parseInt(userId),
          lesson_id: parseInt(lessonId)
        }]
      }
      
      const response = await apperClient.createRecord('favorite', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create favorites ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating favorite:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      throw error
    }
  },

  async removeFavorite(userId, lessonId) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // First find the favorite record
      const params = {
        fields: [
          { field: { Name: "Name" } }
        ],
        where: [
          {
            FieldName: "user_id",
            Operator: "EqualTo",
            Values: [userId]
          },
          {
            FieldName: "lesson_id",
            Operator: "EqualTo",
            Values: [lessonId]
          }
        ]
      }
      
      const response = await apperClient.fetchRecords('favorite', params)
      
      if (!response.success || !response.data || response.data.length === 0) {
        throw new Error("즐겨찾기를 찾을 수 없습니다.")
      }
      
      const favoriteId = response.data[0].Id
      
      // Delete the favorite
      const deleteParams = {
        RecordIds: [favoriteId]
      }
      
      const deleteResponse = await apperClient.deleteRecord('favorite', deleteParams)
      
      if (!deleteResponse.success) {
        console.error(deleteResponse.message)
        toast.error(deleteResponse.message)
        return false
      }
      
      return true
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error removing favorite:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      throw error
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        RecordIds: [id]
      }
      
      const response = await apperClient.deleteRecord('favorite', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete favorites ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulDeletions.length > 0
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting favorite:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return false
    }
  }
}

export default favoritesService
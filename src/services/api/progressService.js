import { toast } from 'react-toastify'

const progressService = {
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
          { field: { Name: "progress_pct" } },
          { field: { Name: "last_seen_at" } },
          { field: { Name: "user_id" } },
          { field: { Name: "lesson_id" } }
        ],
        orderBy: [
          { fieldName: "last_seen_at", sorttype: "DESC" }
        ]
      }
      
      const response = await apperClient.fetchRecords('lesson_progress', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
if (error?.response?.data?.message) {
        console.error("Error fetching progress:", error?.response?.data?.message)
        toast.error(`진도를 불러오는데 실패했습니다: ${error.response.data.message}`)
      } else if (error?.message?.includes('Network Error') || error?.code === 'NETWORK_ERROR') {
        console.error("Network error fetching progress:", error.message)
        toast.error("네트워크 연결을 확인해주세요")
      } else {
        console.error("Error fetching progress:", error?.message || "Unknown error")
        toast.error("진도를 불러오는데 실패했습니다")
      }
      return []
    }
  },
  
  async getById(id) {
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
          { field: { Name: "progress_pct" } },
          { field: { Name: "last_seen_at" } },
          { field: { Name: "user_id" } },
          { field: { Name: "lesson_id" } }
        ]
      }
      
      const response = await apperClient.getRecordById('lesson_progress', id, params)
      
      if (!response || !response.data) {
        return null
      }
      
      return response.data
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching progress with ID ${id}:`, error?.response?.data?.message)
} else if (error?.message?.includes('Network Error') || error?.code === 'NETWORK_ERROR') {
        console.error("Network error fetching progress by ID:", error.message)
        toast.error("네트워크 연결을 확인해주세요")
      } else {
        console.error("Error fetching progress by ID:", error?.message || "Unknown error")
        toast.error("진도를 불러오는데 실패했습니다")
      }
      return null
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
          { field: { Name: "progress_pct" } },
          { field: { Name: "last_seen_at" } },
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
          { fieldName: "last_seen_at", sorttype: "DESC" }
        ]
      }
      
      const response = await apperClient.fetchRecords('lesson_progress', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
if (error?.response?.data?.message) {
        console.error("Error fetching user progress:", error?.response?.data?.message)
        toast.error(`사용자 진도를 불러오는데 실패했습니다: ${error.response.data.message}`)
      } else if (error?.message?.includes('Network Error') || error?.code === 'NETWORK_ERROR') {
        console.error("Network error fetching user progress:", error.message)
        toast.error("네트워크 연결을 확인해주세요")
      } else {
        console.error("Error fetching user progress:", error?.message || "Unknown error")
        toast.error("사용자 진도를 불러오는데 실패했습니다")
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
          { field: { Name: "progress_pct" } },
          { field: { Name: "last_seen_at" } },
          { field: { Name: "user_id" } },
          { field: { Name: "lesson_id" } }
        ],
        where: [
          {
            FieldName: "lesson_id",
            Operator: "EqualTo",
            Values: [lessonId]
          }
        ],
        orderBy: [
          { fieldName: "last_seen_at", sorttype: "DESC" }
        ]
      }
      
      const response = await apperClient.fetchRecords('lesson_progress', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
if (error?.response?.data?.message) {
        console.error("Error fetching lesson progress:", error?.response?.data?.message)
        toast.error(`강의 진도를 불러오는데 실패했습니다: ${error.response.data.message}`)
      } else if (error?.message?.includes('Network Error') || error?.code === 'NETWORK_ERROR') {
        console.error("Network error fetching lesson progress:", error.message)
        toast.error("네트워크 연결을 확인해주세요")
      } else {
        console.error("Error fetching lesson progress:", error?.message || "Unknown error")
        toast.error("강의 진도를 불러오는데 실패했습니다")
      }
      return []
    }
  },
  
  async create(progressData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Only include Updateable fields, handle lookup fields as integers  
      const params = {
        records: [{
          Name: `Progress ${progressData.lesson_id}`,
          progress_pct: progressData.progress_pct,
          last_seen_at: progressData.last_seen_at,
          user_id: parseInt(progressData.user_id),
          lesson_id: parseInt(progressData.lesson_id)
        }]
      }
      
      const response = await apperClient.createRecord('lesson_progress', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create progress ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
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
        console.error("Error creating progress:", error?.response?.data?.message)
        toast.error(`진도 생성에 실패했습니다: ${error.response.data.message}`)
      } else if (error?.message?.includes('Network Error') || error?.code === 'NETWORK_ERROR') {
        console.error("Network error creating progress:", error.message)
        toast.error("네트워크 연결을 확인해주세요")
      } else {
        console.error("Error creating progress:", error?.message || "Unknown error")
        toast.error("진도 생성에 실패했습니다")
      }
      return null
    }
  },
  
  async update(id, progressData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Only include Updateable fields, handle lookup fields as integers
      const params = {
        records: [{
          Id: id,
          Name: `Progress ${progressData.lesson_id}`,
          progress_pct: progressData.progress_pct,
          last_seen_at: progressData.last_seen_at,
          user_id: parseInt(progressData.user_id),
          lesson_id: parseInt(progressData.lesson_id)
        }]
      }
      
      const response = await apperClient.updateRecord('lesson_progress', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update progress ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null
      }
} catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating progress:", error?.response?.data?.message)
        toast.error(`진도 수정에 실패했습니다: ${error.response.data.message}`)
      } else if (error?.message?.includes('Network Error') || error?.code === 'NETWORK_ERROR') {
        console.error("Network error updating progress:", error.message)
        toast.error("네트워크 연결을 확인해주세요")
      } else {
        console.error("Error updating progress:", error?.message || "Unknown error")
        toast.error("진도 수정에 실패했습니다")
      }
      return null
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
      
      const response = await apperClient.deleteRecord('lesson_progress', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete progress ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulDeletions.length > 0
      }
    } catch (error) {
      if (error?.response?.data?.message) {
console.error("Error deleting progress:", error?.response?.data?.message)
        toast.error(`진도 삭제에 실패했습니다: ${error.response.data.message}`)
      } else if (error?.message?.includes('Network Error') || error?.code === 'NETWORK_ERROR') {
        console.error("Network error deleting progress:", error.message)
        toast.error("네트워크 연결을 확인해주세요")
      } else {
        console.error("Error deleting progress:", error?.message || "Unknown error")
        toast.error("진도 삭제에 실패했습니다")
      }
      return false
    }
  }
}

export default progressService
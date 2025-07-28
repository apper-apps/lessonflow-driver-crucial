import { toast } from "react-toastify";
import React from "react";

const userService = {
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
          { field: { Name: "email" } },
          { field: { Name: "role" } },
          { field: { Name: "tier_id" } }
        ],
        orderBy: [
          { fieldName: "Name", sorttype: "ASC" }
        ]
      }
      
      const response = await apperClient.fetchRecords('app_User', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
} catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching users:", error?.response?.data?.message)
        toast.error(`사용자를 불러오는데 실패했습니다: ${error.response.data.message}`)
      } else if (error?.message?.includes('Network Error') || error?.code === 'NETWORK_ERROR') {
        console.error("Network error fetching users:", error.message)
        toast.error("네트워크 연결을 확인해주세요")
      } else {
        console.error("Error fetching users:", error?.message || "Unknown error")
        toast.error("사용자를 불러오는데 실패했습니다")
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
          { field: { Name: "email" } },
          { field: { Name: "role" } },
          { field: { Name: "tier_id" } }
        ]
      }
      
      const response = await apperClient.getRecordById('app_User', id, params)
      
      if (!response || !response.data) {
        return null
      }
      
      return response.data
} catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching user with ID ${id}:`, error?.response?.data?.message)
        toast.error(`사용자를 불러오는데 실패했습니다: ${error.response.data.message}`)
      } else if (error?.message?.includes('Network Error') || error?.code === 'NETWORK_ERROR') {
        console.error("Network error fetching user by ID:", error.message)
        toast.error("네트워크 연결을 확인해주세요")
      } else {
        console.error("Error fetching user by ID:", error?.message || "Unknown error")
        toast.error("사용자를 불러오는데 실패했습니다")
      }
      return null
    }
  },
  
  async create(user) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Only include Updateable fields, handle lookup fields as integers
      const params = {
        records: [{
          Name: user.Name,
          Tags: user.Tags,
          Owner: parseInt(user.Owner),
          email: user.email,
          role: user.role,
          tier_id: user.tier_id ? parseInt(user.tier_id?.Id || user.tier_id) : null
        }]
      }
      
      const response = await apperClient.createRecord('app_User', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create users ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
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
        console.error("Error creating user:", error?.response?.data?.message)
        toast.error(`사용자 생성에 실패했습니다: ${error.response.data.message}`)
      } else if (error?.message?.includes('Network Error') || error?.code === 'NETWORK_ERROR') {
        console.error("Network error creating user:", error.message)
        toast.error("네트워크 연결을 확인해주세요")
      } else {
        console.error("Error creating user:", error?.message || "Unknown error")
        toast.error("사용자 생성에 실패했습니다")
      }
      return null
    }
  },
  
  async update(id, userData) {
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
          Name: userData.Name,
          Tags: userData.Tags,
          Owner: parseInt(userData.Owner),
          email: userData.email,
          role: userData.role,
          tier_id: userData.tier_id ? parseInt(userData.tier_id?.Id || userData.tier_id) : null
        }]
      }
      
      const response = await apperClient.updateRecord('app_User', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update users ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          
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
        console.error("Error updating user:", error?.response?.data?.message)
        toast.error(`사용자 수정에 실패했습니다: ${error.response.data.message}`)
      } else if (error?.message?.includes('Network Error') || error?.code === 'NETWORK_ERROR') {
        console.error("Network error updating user:", error.message)
        toast.error("네트워크 연결을 확인해주세요")
      } else {
        console.error("Error updating user:", error?.message || "Unknown error")
        toast.error("사용자 수정에 실패했습니다")
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
      
      const response = await apperClient.deleteRecord('app_User', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete users ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulDeletions.length > 0
      }
} catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting user:", error?.response?.data?.message)
        toast.error(`사용자 삭제에 실패했습니다: ${error.response.data.message}`)
      } else if (error?.message?.includes('Network Error') || error?.code === 'NETWORK_ERROR') {
        console.error("Network error deleting user:", error.message)
        toast.error("네트워크 연결을 확인해주세요")
      } else {
        console.error("Error deleting user:", error?.message || "Unknown error")
        toast.error("사용자 삭제에 실패했습니다")
      }
      return false
    }
  }
}

export default userService
import { toast } from 'react-toastify'

const postService = {
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
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "has_flagged" } },
          { field: { Name: "flag_reason" } },
          { field: { Name: "created_at" } },
          { field: { Name: "user_id" } }
        ],
        orderBy: [
          { fieldName: "created_at", sorttype: "DESC" }
        ]
      }
      
      const response = await apperClient.fetchRecords('post', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
} catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching posts:", error?.response?.data?.message)
        toast.error(`게시물을 불러오는데 실패했습니다: ${error.response.data.message}`)
      } else if (error?.message?.includes('Network Error') || error?.code === 'NETWORK_ERROR') {
        console.error("Network error fetching posts:", error.message)
        toast.error("네트워크 연결을 확인해주세요")
      } else {
        console.error("Error fetching posts:", error?.message || "Unknown error")
        toast.error("게시물을 불러오는데 실패했습니다")
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
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "has_flagged" } },
          { field: { Name: "flag_reason" } },
          { field: { Name: "created_at" } },
          { field: { Name: "user_id" } }
        ]
      }
      
      const response = await apperClient.getRecordById('post', id, params)
      
      if (!response || !response.data) {
        return null
      }
      
      return response.data
} catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching post with ID ${id}:`, error?.response?.data?.message)
        toast.error(`게시물을 불러오는데 실패했습니다: ${error.response.data.message}`)
      } else if (error?.message?.includes('Network Error') || error?.code === 'NETWORK_ERROR') {
        console.error(`Network error fetching post with ID ${id}:`, error.message)
        toast.error("네트워크 연결을 확인해주세요")
      } else {
        console.error(`Error fetching post with ID ${id}:`, error?.message || "Unknown error")
        toast.error("게시물을 불러오는데 실패했습니다")
      }
      return null
    }
  },
  
  async getFlagged() {
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
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "has_flagged" } },
          { field: { Name: "flag_reason" } },
          { field: { Name: "created_at" } },
          { field: { Name: "user_id" } }
        ],
        where: [
          {
            FieldName: "has_flagged",
            Operator: "EqualTo",
            Values: [true]
          }
        ],
        orderBy: [
          { fieldName: "created_at", sorttype: "DESC" }
        ]
      }
      
      const response = await apperClient.fetchRecords('post', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
} catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching flagged posts:", error?.response?.data?.message)
        toast.error(`신고된 게시물을 불러오는데 실패했습니다: ${error.response.data.message}`)
      } else if (error?.message?.includes('Network Error') || error?.code === 'NETWORK_ERROR') {
        console.error("Network error fetching flagged posts:", error.message)
        toast.error("네트워크 연결을 확인해주세요")
      } else {
        console.error("Error fetching flagged posts:", error?.message || "Unknown error")
        toast.error("신고된 게시물을 불러오는데 실패했습니다")
      }
      return []
    }
  },
  
  async create(post) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Only include Updateable fields, handle lookup fields as integers
      const params = {
        records: [{
          Name: post.title,
          Tags: post.Tags,
          Owner: parseInt(post.Owner),
          title: post.title,
          content: post.content,
          has_flagged: post.has_flagged || false,
          flag_reason: post.flag_reason,
          created_at: post.created_at,
          user_id: parseInt(post.user_id)
        }]
      }
      
      const response = await apperClient.createRecord('post', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create posts ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
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
        console.error("Error creating post:", error?.response?.data?.message)
        toast.error(`게시물 작성에 실패했습니다: ${error.response.data.message}`)
      } else if (error?.message?.includes('Network Error') || error?.code === 'NETWORK_ERROR') {
        console.error("Network error creating post:", error.message)
        toast.error("네트워크 연결을 확인해주세요")
      } else {
        console.error("Error creating post:", error?.message || "Unknown error")
        toast.error("게시물 작성에 실패했습니다")
      }
      return null
    }
  },
  
  async update(id, postData) {
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
          Name: postData.title,
          Tags: postData.Tags,
          Owner: parseInt(postData.Owner),
          title: postData.title,
          content: postData.content,
          has_flagged: postData.has_flagged,
          flag_reason: postData.flag_reason,
          created_at: postData.created_at,
          user_id: parseInt(postData.user_id)
        }]
      }
      
      const response = await apperClient.updateRecord('post', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update posts ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          
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
        console.error("Error updating post:", error?.response?.data?.message)
        toast.error(`게시물 수정에 실패했습니다: ${error.response.data.message}`)
      } else if (error?.message?.includes('Network Error') || error?.code === 'NETWORK_ERROR') {
        console.error("Network error updating post:", error.message)
        toast.error("네트워크 연결을 확인해주세요")
      } else {
        console.error("Error updating post:", error?.message || "Unknown error")
        toast.error("게시물 수정에 실패했습니다")
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
      
      const response = await apperClient.deleteRecord('post', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete posts ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulDeletions.length > 0
      }
} catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting post:", error?.response?.data?.message)
        toast.error(`게시물 삭제에 실패했습니다: ${error.response.data.message}`)
      } else if (error?.message?.includes('Network Error') || error?.code === 'NETWORK_ERROR') {
        console.error("Network error deleting post:", error.message)
        toast.error("네트워크 연결을 확인해주세요")
      } else {
        console.error("Error deleting post:", error?.message || "Unknown error")
        toast.error("게시물 삭제에 실패했습니다")
      }
      return false
    }
  }
}

export default postService
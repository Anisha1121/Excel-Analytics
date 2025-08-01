import api from './api'

export const fileService = {
  async uploadFile(file) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'File upload failed')
    }
  },

  async getFiles() {
    try {
      const response = await api.get('/files')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get files')
    }
  },

  async getFileData(fileId) {
    try {
      const response = await api.get(`/files/${fileId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get file data')
    }
  },

  async deleteFile(fileId) {
    try {
      const response = await api.delete(`/files/${fileId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete file')
    }
  },

  async generateChart(fileId, chartConfig) {
    try {
      const response = await api.post(`/files/${fileId}/analyze`, chartConfig)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to generate chart')
    }
  },

  async saveChart(fileId, chartConfig, chartData = null) {
    try {
      const payload = {
        ...chartConfig,
        chartData: chartData
      }
      const response = await api.post(`/files/${fileId}/save-chart`, payload)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to save chart')
    }
  },

  async save3DChart(chartConfig, chartData, metadata = {}) {
    try {
      const payload = {
        chartType: '3d',
        config: chartConfig,
        data: chartData,
        metadata: {
          ...metadata,
          created: new Date().toISOString(),
          chartFormat: '3D'
        }
      }
      const response = await api.post('/charts/save-3d', payload)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to save 3D chart')
    }
  },

  async getSavedCharts() {
    try {
      const response = await api.get('/users/analytics')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get saved charts')
    }
  }
}

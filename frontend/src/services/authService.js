import api from './api'

export const authService = {
  async login(email, password) {
    try {
      console.log('Attempting login with:', { email }); // Debug log (don't log password)
      const response = await api.post('/auth/login', { email, password })
      console.log('Login successful:', response.data); // Debug log
      return response.data
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message); // Debug log
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed')
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me')
      return response.data.user
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get user data')
    }
  },

  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Token refresh failed')
    }
  }
}

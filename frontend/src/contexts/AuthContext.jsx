import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          // Add a simple token validation before making API call
          const tokenData = JSON.parse(atob(token.split('.')[1]))
          const isExpired = tokenData.exp * 1000 < Date.now()
          
          if (isExpired) {
            localStorage.removeItem('token')
            setLoading(false)
            return
          }

          // Use cached user data if available
          const cachedUser = localStorage.getItem('userData')
          if (cachedUser) {
            setUser(JSON.parse(cachedUser))
            setLoading(false)
            
            // Validate in background
            try {
              const userData = await authService.getCurrentUser()
              setUser(userData)
              localStorage.setItem('userData', JSON.stringify(userData))
            } catch (error) {
              console.error('Background auth validation failed:', error)
            }
          } else {
            const userData = await authService.getCurrentUser()
            setUser(userData)
            localStorage.setItem('userData', JSON.stringify(userData))
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('userData')
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password)
      localStorage.setItem('token', data.token)
      localStorage.setItem('userData', JSON.stringify(data.user))
      setUser(data.user)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const register = async (userData) => {
    try {
      const data = await authService.register(userData)
      localStorage.setItem('token', data.token)
      localStorage.setItem('userData', JSON.stringify(data.user))
      setUser(data.user)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userData')
    setUser(null)
  }
      localStorage.setItem('token', data.token)
      setUser(data.user)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

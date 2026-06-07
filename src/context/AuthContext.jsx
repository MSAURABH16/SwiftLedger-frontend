import { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios.js'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('swiftledger_token'))
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem('swiftledger_user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    }
    setLoading(false)
  }, [token])

  const handleAuthSuccess = (data) => {
    const { user: currentUser, token: jwt } = data
    localStorage.setItem('swiftledger_token', jwt)
    localStorage.setItem('swiftledger_user', JSON.stringify(currentUser))
    setToken(jwt)
    setUser(currentUser)
    setMessage('Authenticated successfully.')
  }

  const parseAuthError = (err, fallback = 'Unable to authenticate. Please try again.') => {
    const response = err.response
    if (!response) {
      return 'Cannot reach authentication server. Start backend or set VITE_API_BASE_URL.'
    }

    const status = response.status
    const data = response.data || {}
    const validation = data.errors || data.error || data.validation || data.details
    const message = data.message || data.error

    if (status === 401) {
      return 'Wrong email or password.'
    }
    if (status === 429) {
      return 'Too many attempts. Try again later.'
    }
    if (status === 409) {
      return 'An account with that email already exists.'
    }
    if (status === 422 || status === 400) {
      if (typeof validation === 'string') {
        return validation
      }
      if (Array.isArray(validation)) {
        return validation.map((item) => item.msg || item.message || item).join(' ')
      }
      if (typeof validation === 'object' && validation !== null) {
        return Object.values(validation)
          .flat()
          .map((item) => (typeof item === 'string' ? item : item.msg || item.message || 'Invalid input.'))
          .join(' ')
      }
      return message || fallback
    }

    return message || fallback
  }

  const login = async (credentials) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post('/auth/login', credentials)
      handleAuthSuccess(response.data)
      setMessage('Signed in successfully.')
      navigate('/')
    } catch (err) {
      // If no response, likely the API server is unreachable
      if (!err.response) {
        setError('Cannot reach authentication server. Start backend or set VITE_API_BASE_URL.')
      } else {
        setError(parseAuthError(err, 'Unable to login. Please try again.'))
      }
    } finally {
      setLoading(false)
    }
  }

  const register = async (payload) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post('/auth/register', payload)
      handleAuthSuccess(response.data)
      setMessage('Account created successfully.')
      navigate('/')
    } catch (err) {
      if (!err.response) {
        setError('Cannot reach authentication server. Start backend or set VITE_API_BASE_URL.')
      } else {
        setError(parseAuthError(err, 'Unable to register. Please try again.'))
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (err) {
      // ignore logout failure and clear local data anyway
    }
    localStorage.removeItem('swiftledger_token')
    localStorage.removeItem('swiftledger_user')
    setToken(null)
    setUser(null)
    navigate('/login')
  }

  const clearMessages = () => {
    setError(null)
    setMessage(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        message,
        login,
        register,
        logout,
        clearMessages,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

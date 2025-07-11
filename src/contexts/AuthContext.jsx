import { createContext, useContext, useState, useEffect } from 'react'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '../config/firebase'

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
  const [isAdmin, setIsAdmin] = useState(false)

  // Admin credentials - in production, this should be in environment variables
  const ADMIN_EMAIL = 'forrest@creationbase.io'
  const ADMIN_PASSWORD = 'admin123'
  
  // Development login credentials from .env
  const DEV_EMAIL = import.meta.env.VITE_DEV_EMAIL || 'dev@lavendair.com'
  const DEV_PASSWORD = import.meta.env.VITE_DEV_PASSWORD || 'dev123'

  // Persist user state in localStorage
  const saveUserToStorage = (userData, adminStatus) => {
    localStorage.setItem('lavendair_user', JSON.stringify(userData))
    localStorage.setItem('lavendair_isAdmin', JSON.stringify(adminStatus))
  }

  const clearUserFromStorage = () => {
    localStorage.removeItem('lavendair_user')
    localStorage.removeItem('lavendair_isAdmin')
  }

  const loadUserFromStorage = () => {
    try {
      const userData = localStorage.getItem('lavendair_user')
      const adminStatus = localStorage.getItem('lavendair_isAdmin')
      if (userData && adminStatus) {
        return {
          user: JSON.parse(userData),
          isAdmin: JSON.parse(adminStatus)
        }
      }
    } catch (error) {
      console.error('Error loading user from storage:', error)
    }
    return null
  }

  useEffect(() => {
    // First, try to load user from localStorage
    const storedAuth = loadUserFromStorage()
    if (storedAuth) {
      setUser(storedAuth.user)
      setIsAdmin(storedAuth.isAdmin)
      setLoading(false)
      return
    }

    if (!auth) {
      setLoading(false)
      return
    }
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        const adminStatus = user.email === ADMIN_EMAIL
        setIsAdmin(adminStatus)
        saveUserToStorage(user, adminStatus)
      } else {
        setUser(null)
        setIsAdmin(false)
        clearUserFromStorage()
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [ADMIN_EMAIL])

  const login = async (email, password) => {
    if (!auth) {
      return { success: false, error: 'Firebase authentication not configured. Please add your Firebase credentials.' }
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return { success: true, user: result.user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const register = async (email, password) => {
    if (!auth) {
      return { success: false, error: 'Firebase authentication not configured. Please add your Firebase credentials.' }
    }
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      return { success: true, user: result.user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      if (auth) {
        await signOut(auth)
      }
      setUser(null)
      setIsAdmin(false)
      clearUserFromStorage()
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const adminLogin = async (email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Create a mock admin user for demo purposes
      const adminUser = {
        uid: 'admin-uid',
        email: ADMIN_EMAIL,
        displayName: 'Administrator'
      }
      setUser(adminUser)
      setIsAdmin(true)
      saveUserToStorage(adminUser, true)
      return { success: true, user: adminUser }
    } else {
      return { success: false, error: 'Invalid admin credentials' }
    }
  }

  const devLogin = async (email, password) => {
    if (email === DEV_EMAIL && password === DEV_PASSWORD) {
      // Create a mock dev user for development purposes
      const devUser = {
        uid: 'dev-uid',
        email: DEV_EMAIL,
        displayName: 'Developer'
      }
      setUser(devUser)
      setIsAdmin(false)
      saveUserToStorage(devUser, false)
      return { success: true, user: devUser }
    } else {
      return { success: false, error: 'Invalid development credentials' }
    }
  }

  const value = {
    user,
    isAdmin,
    login,
    register,
    logout,
    adminLogin,
    devLogin,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [isAdminLogin, setIsAdminLogin] = useState(false)
  const [isDevLogin, setIsDevLogin] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login, register, adminLogin, devLogin } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let result
      if (isAdminLogin) {
        result = await adminLogin(formData.email, formData.password)
      } else if (isDevLogin) {
        result = await devLogin(formData.email, formData.password)
      } else if (isLogin) {
        result = await login(formData.email, formData.password)
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match')
          setLoading(false)
          return
        }
        result = await register(formData.email, formData.password)
      }

      if (result.success) {
        navigate('/')
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address'
      case 'auth/wrong-password':
        return 'Incorrect password'
      case 'auth/email-already-in-use':
        return 'An account with this email already exists'
      case 'auth/weak-password':
        return 'Password should be at least 6 characters'
      case 'auth/invalid-email':
        return 'Invalid email address'
      default:
        return 'An error occurred. Please try again.'
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg px-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 mb-6">
            <img 
              src="/images/logo.png" 
              alt="Lavendair" 
              className="h-6 w-auto"
            />
           
          </Link>
          <h2 className="text-3xl font-bold text-dark-text mb-2">
            {isAdminLogin ? 'Admin Access' : isDevLogin ? 'Development Login' : isLogin ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-dark-text-secondary">
            {isAdminLogin 
              ? 'Administrator login for system management'
              : isDevLogin
                ? 'Development environment login'
                : isLogin 
                  ? 'Sign in to your account to continue' 
                  : 'Get started with your air quality monitoring'
            }
          </p>
        </div>

        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-dark-text-secondary" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input w-full pl-10"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-dark-text-secondary" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input w-full pl-10 pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-dark-text-secondary hover:text-dark-text" />
                  ) : (
                    <Eye className="h-5 w-5 text-dark-text-secondary hover:text-dark-text" />
                  )}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-dark-text-secondary" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="input w-full pl-10"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-dark-border rounded bg-dark-card"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-dark-text">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="text-primary hover:text-primary-light">
                    Forgot your password?
                  </a>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>

          {/* Login Mode Toggles */}
          <div className="mt-4 text-center space-y-2">
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  const newIsAdminLogin = !isAdminLogin
                  setIsAdminLogin(newIsAdminLogin)
                  setIsDevLogin(false)
                  setIsLogin(true)
                  setError('')
                  setFormData({ 
                    email: newIsAdminLogin ? 'forrest@creationbase.io' : '', 
                    password: newIsAdminLogin ? 'admin123' : '', 
                    confirmPassword: '' 
                  })
                }}
                className={`text-sm font-medium transition-colors ${
                  isAdminLogin 
                    ? 'text-red-400 hover:text-red-300' 
                    : 'text-dark-text-secondary hover:text-dark-text'
                }`}
              >
                {isAdminLogin ? '← Back' : 'Admin'}
              </button>
              <button
                onClick={() => {
                  const newIsDevLogin = !isDevLogin
                  setIsDevLogin(newIsDevLogin)
                  setIsAdminLogin(false)
                  setIsLogin(true)
                  setError('')
                  setFormData({ 
                    email: newIsDevLogin ? 'dev@lavendair.com' : '', 
                    password: newIsDevLogin ? 'dev123' : '', 
                    confirmPassword: '' 
                  })
                }}
                className={`text-sm font-medium transition-colors ${
                  isDevLogin 
                    ? 'text-blue-400 hover:text-blue-300' 
                    : 'text-dark-text-secondary hover:text-dark-text'
                }`}
              >
                {isDevLogin ? '← Back' : 'Dev'}
              </button>
            </div>
            {isAdminLogin && (
              <p className="text-xs text-dark-text-secondary">
                Use forrest@creationbase.io / admin123
              </p>
            )}
            {isDevLogin && (
              <p className="text-xs text-dark-text-secondary">
                Use dev@lavendair.com / dev123 (or set VITE_DEV_EMAIL/VITE_DEV_PASSWORD)
              </p>
            )}
          </div>

          {/* Toggle between login and register */}
          {!isAdminLogin && !isDevLogin && (
            <div className="mt-6 text-center">
            <p className="text-dark-text-secondary">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError('')
                  setFormData({ email: '', password: '', confirmPassword: '' })
                }}
                className="ml-2 text-primary hover:text-primary-light font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-8 text-center">
          <p className="text-dark-text-secondary text-sm mb-4">Trusted by environmental agencies worldwide</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-primary text-lg font-semibold">24/7</div>
              <div className="text-dark-text-secondary text-xs">Monitoring</div>
            </div>
            <div>
              <div className="text-primary text-lg font-semibold">99.9%</div>
              <div className="text-dark-text-secondary text-xs">Uptime</div>
            </div>
            <div>
              <div className="text-primary text-lg font-semibold">EPA</div>
              <div className="text-dark-text-secondary text-xs">Compliant</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
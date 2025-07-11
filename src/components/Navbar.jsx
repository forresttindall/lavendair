import { Link, useLocation } from 'react-router-dom'
import { BarChart3, Settings, Download, Radio, LogOut, Mail } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const location = useLocation()
  const { user, logout } = useAuth()

  const navItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3 },
    { path: '/sensors', label: 'Sensors', icon: Radio },
    { path: '/exports', label: 'Exports', icon: Download },
    { path: '/settings', label: 'Settings', icon: Settings },
    { path: '/contact', label: 'Contact', icon: Mail },
  ]

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-card border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/images/logo.png" 
              alt="Lavendair" 
              className="h-6 w-auto"
            />
          </Link>

          {/* Navigation Links */}
          {user && (
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-link flex items-center space-x-2 ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-dark-text-secondary text-sm">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-dark-text-secondary hover:text-dark-text transition-colors"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {user && (
        <div className="md:hidden border-t border-dark-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link flex items-center space-x-3 block ${isActive ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
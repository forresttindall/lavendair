import { useAuth } from '../contexts/AuthContext'
import { Users, Settings, Database, Activity, Shield, AlertTriangle } from 'lucide-react'

const AdminPanel = () => {
  const { isAdmin } = useAuth()

  if (!isAdmin) {
    return (
      <div className="card">
        <div className="flex items-center space-x-3 text-red-400">
          <AlertTriangle size={24} />
          <div>
            <h3 className="text-lg font-semibold">Access Denied</h3>
            <p className="text-dark-text-secondary">You need administrator privileges to view this content.</p>
          </div>
        </div>
      </div>
    )
  }

  const adminStats = [
    { label: 'Total Users', value: '1,234', icon: Users, color: 'text-blue-400' },
    { label: 'Active Sensors', value: '89', icon: Activity, color: 'text-green-400' },
    { label: 'System Health', value: '99.9%', icon: Shield, color: 'text-purple-400' },
    { label: 'Data Points', value: '2.1M', icon: Database, color: 'text-yellow-400' },
  ]

  const recentActivity = [
    { action: 'New user registered', user: 'john@example.com', time: '2 minutes ago' },
    { action: 'Sensor data exported', user: 'admin@lavendair.com', time: '15 minutes ago' },
    { action: 'System backup completed', user: 'system', time: '1 hour ago' },
    { action: 'API key generated', user: 'jane@example.com', time: '2 hours ago' },
  ]

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="card">
        <div className="flex items-center space-x-3">
          <Shield className="text-red-400" size={32} />
          <div>
            <h2 className="text-2xl font-bold text-dark-text">Administrator Dashboard</h2>
            <p className="text-dark-text-secondary">System management and monitoring</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-text-secondary text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-dark-text">{stat.value}</p>
                </div>
                <Icon className={stat.color} size={24} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-dark-text mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-dark-border last:border-b-0">
              <div>
                <p className="text-dark-text">{activity.action}</p>
                <p className="text-dark-text-secondary text-sm">{activity.user}</p>
              </div>
              <span className="text-dark-text-secondary text-sm">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-dark-text mb-4">User Management</h3>
          <div className="space-y-3">
            <button className="btn-secondary w-full">View All Users</button>
            <button className="btn-secondary w-full">Export User Data</button>
            <button className="btn-secondary w-full">Manage Permissions</button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-dark-text mb-4">System Management</h3>
          <div className="space-y-3">
            <button className="btn-secondary w-full">System Logs</button>
            <button className="btn-secondary w-full">Database Backup</button>
            <button className="btn-secondary w-full">API Configuration</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
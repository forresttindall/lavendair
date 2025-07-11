import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Activity, Radio, RadioReceiver, Calendar, TrendingUp } from 'lucide-react'
import { format, subDays } from 'date-fns'
import { useAuth } from '../contexts/AuthContext'
import { getSensorData } from '../services/purpleAirService'
import AdminPanel from '../components/AdminPanel'

const Dashboard = () => {
  const { user, isAdmin } = useAuth()
  const [sensorData, setSensorData] = useState([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState(30) // days - default to 30 days
  const [selectedMetric, setSelectedMetric] = useState('pm2_5') // default to PM2.5

  // Generate realistic mock data based on date range
  const generateMockData = (days) => {
    const data = []
    const now = new Date()
    const baseValues = { pm1: 8, pm2_5: 12, pm10: 16 }
    
    if (days === 1) {
      // 24 hours - hourly data points
      for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
        const hour = timestamp.getHours()
        
        // Simulate daily patterns: higher pollution during rush hours and lower at night
        let multiplier = 1
        if (hour >= 7 && hour <= 9) multiplier = 1.4 // Morning rush
        else if (hour >= 17 && hour <= 19) multiplier = 1.6 // Evening rush
        else if (hour >= 22 || hour <= 5) multiplier = 0.7 // Night time
        else if (hour >= 10 && hour <= 16) multiplier = 1.1 // Daytime
        
        // Add some random variation
        const variation = 0.8 + Math.random() * 0.4
        
        data.push({
          time: format(timestamp, 'HH:mm'),
          pm1: Math.round((baseValues.pm1 * multiplier * variation) * 10) / 10,
          pm2_5: Math.round((baseValues.pm2_5 * multiplier * variation) * 10) / 10,
          pm10: Math.round((baseValues.pm10 * multiplier * variation) * 10) / 10,
          timestamp: timestamp.getTime()
        })
      }
    } else if (days === 7) {
      // 7 days - daily averages
      for (let i = 6; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        const dayOfWeek = timestamp.getDay()
        
        // Weekend vs weekday patterns
        let multiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 0.8 : 1.2
        const variation = 0.7 + Math.random() * 0.6
        
        data.push({
          time: format(timestamp, 'MMM dd'),
          pm1: Math.round((baseValues.pm1 * multiplier * variation) * 10) / 10,
          pm2_5: Math.round((baseValues.pm2_5 * multiplier * variation) * 10) / 10,
          pm10: Math.round((baseValues.pm10 * multiplier * variation) * 10) / 10,
          timestamp: timestamp.getTime()
        })
      }
    } else {
      // 30 days - daily averages with seasonal trends
      for (let i = 29; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        const dayOfMonth = timestamp.getDate()
        
        // Simulate monthly patterns and weather effects
        let multiplier = 1 + Math.sin(dayOfMonth / 30 * Math.PI) * 0.3
        const variation = 0.6 + Math.random() * 0.8
        
        data.push({
          time: format(timestamp, 'MMM dd'),
          pm1: Math.round((baseValues.pm1 * multiplier * variation) * 10) / 10,
          pm2_5: Math.round((baseValues.pm2_5 * multiplier * variation) * 10) / 10,
          pm10: Math.round((baseValues.pm10 * multiplier * variation) * 10) / 10,
          timestamp: timestamp.getTime()
        })
      }
    }
    
    return data
  }

  const sensors = [
    { id: 1, name: 'City Hall Plaza', status: 'online', lastSeen: new Date(), pm2_5: 15.2 },
    { id: 2, name: 'Westside Manufacturing District', status: 'online', lastSeen: new Date(), pm2_5: 23.8 },
    { id: 3, name: 'Maple Grove Neighborhood', status: 'online', lastSeen: subDays(new Date(), 0), pm2_5: 8.4 },
    { id: 4, name: 'Riverside Community Park', status: 'online', lastSeen: new Date(), pm2_5: 6.1 },
    { id: 5, name: 'Interstate 405 & Harbor Blvd', status: 'offline', lastSeen: subDays(new Date(), 2), pm2_5: null },
    { id: 6, name: 'Lincoln Elementary School', status: 'online', lastSeen: new Date(), pm2_5: 11.7 },
  ]

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Generate mock data based on selected date range
        const data = generateMockData(dateRange)
        setSensorData(data)
      } catch (error) {
        console.error('Error fetching sensor data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dateRange])

  const getAQIColor = (value) => {
    if (value <= 12) return 'text-green-400'
    if (value <= 35) return 'text-yellow-400'
    if (value <= 55) return 'text-orange-400'
    return 'text-red-400'
  }

  const getAQILevel = (value) => {
    if (value <= 12) return 'Good'
    if (value <= 35) return 'Moderate'
    if (value <= 55) return 'Unhealthy for Sensitive Groups'
    return 'Unhealthy'
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark-text mb-4">Welcome to Lavendair</h2>
          <p className="text-dark-text-secondary mb-6">Please log in to access your air quality dashboard</p>
          <a href="/login" className="btn-primary">Login</a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Admin Panel - Only visible to admins */}
      {isAdmin && (
        <div className="mb-8">
          <AdminPanel />
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-text mb-2">
          {isAdmin ? 'Admin Dashboard' : 'Air Quality Dashboard'}
        </h1>
        <p className="text-dark-text-secondary">
          {isAdmin ? 'System overview and user management' : 'Monitor your environmental sensors in real-time'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-text-secondary text-sm">Active Sensors</p>
              <p className="text-2xl font-bold text-dark-text">
                {sensors.filter(s => s.status === 'online').length}
              </p>
            </div>
            <div className="p-3 bg-primary/20 rounded-lg">
              <Radio className="text-primary" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-text-secondary text-sm">Avg PM2.5</p>
              <p className="text-2xl font-bold text-dark-text">
                {sensors.filter(s => s.pm2_5 !== null).length > 0 
                  ? Math.round(sensors.filter(s => s.pm2_5 !== null).reduce((sum, s) => sum + s.pm2_5, 0) / sensors.filter(s => s.pm2_5 !== null).length * 10) / 10
                  : 0} μg/m³
              </p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Activity className="text-yellow-500" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-text-secondary text-sm">Data Points {dateRange === 1 ? 'Today' : `Last ${dateRange} days`}</p>
              <p className="text-2xl font-bold text-dark-text">
                {sensorData.length * sensors.filter(s => s.status === 'online').length}
              </p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <TrendingUp className="text-green-500" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="card mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-xl font-semibold text-dark-text mb-4 sm:mb-0">Air Quality Trends</h2>
          <div className="flex space-x-4">
            <select 
              value={selectedMetric} 
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="input"
            >
              <option value="pm2_5">PM2.5</option>
              <option value="pm1">PM1.0</option>
              <option value="pm10">PM10</option>
            </select>
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(Number(e.target.value))}
              className="input"
            >
              <option value={1}>Last 24 hours</option>
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sensorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis 
                dataKey="time" 
                stroke="#A3A3A3"
                fontSize={12}
              />
              <YAxis 
                stroke="#A3A3A3"
                fontSize={12}
                label={{ value: 'μg/m³', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A1A1A', 
                  border: '1px solid #2A2A2A',
                  borderRadius: '8px',
                  color: '#E5E5E5'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={selectedMetric} 
                stroke="#8A2EFF" 
                strokeWidth={2}
                dot={{ fill: '#8A2EFF', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#8A2EFF', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Sensors List */}
      <div className="card">
        <h2 className="text-xl font-semibold text-dark-text mb-6">Sensor Status</h2>
        <div className="space-y-4">
          {sensors.map((sensor) => (
            <div key={sensor.id} className="flex items-center justify-between p-4 bg-dark-bg rounded-lg border border-dark-border">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${
                  sensor.status === 'online' ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  {sensor.status === 'online' ? (
                    <Radio className="text-green-500" size={20} />
                  ) : (
                    <RadioReceiver className="text-red-500" size={20} />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-dark-text">{sensor.name}</h3>
                  <p className="text-sm text-dark-text-secondary">
                    Last seen: {format(sensor.lastSeen, 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {sensor.pm2_5 !== null ? (
                  <>
                    <p className={`text-lg font-semibold ${getAQIColor(sensor.pm2_5)}`}>
                      {sensor.pm2_5} μg/m³
                    </p>
                    <p className={`text-sm ${getAQIColor(sensor.pm2_5)}`}>
                      {getAQILevel(sensor.pm2_5)}
                    </p>
                  </>
                ) : (
                  <p className="text-dark-text-secondary">No data</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
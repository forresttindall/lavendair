import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Radio, RadioReceiver, Settings, X } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import { useAuth } from '../contexts/AuthContext'

const Sensors = () => {
  const { user } = useAuth()
  const [sensors, setSensors] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingSensor, setEditingSensor] = useState(null)
  const [showDataModal, setShowDataModal] = useState(false)
  const [selectedSensor, setSelectedSensor] = useState(null)
  const [sensorData, setSensorData] = useState([])
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState(30)
  const [selectedMetric, setSelectedMetric] = useState('pm2_5')
  const [formData, setFormData] = useState({
    name: '',
    sensorId: '',
    apiKey: '',
    calibrationFactor: 1.0,
    location: '',
    description: ''
  })

  // Mock sensors data - matching Dashboard sensors
  const mockSensors = [
    {
      id: 1,
      name: 'City Hall Plaza',
      sensorId: '12345',
      location: '200 N Main St, City Hall Plaza',
      status: 'online',
      lastReading: new Date(),
      calibrationFactor: 1.0,
      description: 'Primary downtown monitoring station',
      pm2_5: 15.2
    },
    {
      id: 2,
      name: 'Westside Manufacturing District',
      sensorId: '67890',
      location: '1500 Industrial Blvd, Manufacturing Zone',
      status: 'online',
      lastReading: new Date(),
      calibrationFactor: 0.95,
      description: 'Industrial emissions monitoring',
      pm2_5: 23.8
    },
    {
      id: 3,
      name: 'Maple Grove Neighborhood',
      sensorId: '54321',
      location: '850 Maple Grove Dr, Residential Area',
      status: 'online',
      lastReading: new Date(),
      calibrationFactor: 1.05,
      description: 'Suburban residential air quality',
      pm2_5: 8.4
    },
    {
      id: 4,
      name: 'Riverside Community Park',
      sensorId: '98765',
      location: '300 Riverside Dr, Community Park',
      status: 'online',
      lastReading: new Date(),
      calibrationFactor: 1.0,
      description: 'Recreational area environmental monitoring',
      pm2_5: 6.1
    },
    {
      id: 5,
      name: 'Interstate 405 & Harbor Blvd',
      sensorId: '11111',
      location: 'I-405 & Harbor Blvd Interchange',
      status: 'offline',
      lastReading: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      calibrationFactor: 0.98,
      description: 'Highway traffic emissions monitoring',
      pm2_5: null
    },
    {
      id: 6,
      name: 'Lincoln Elementary School',
      sensorId: '22222',
      location: '425 Lincoln Ave, School Campus',
      status: 'online',
      lastReading: new Date(),
      calibrationFactor: 1.02,
      description: 'School zone air quality protection',
      pm2_5: 11.7
    }
  ]

  // Generate realistic mock data based on date range - same as Dashboard
  const generateMockData = (days, sensorId) => {
    const data = []
    const now = new Date()
    const baseValues = { pm1: 8, pm2_5: 12, pm10: 16 }
    
    // Add some sensor-specific variation
    const sensorMultiplier = sensorId ? (parseInt(sensorId) % 3 + 1) * 0.8 : 1
    
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
          pm1: Math.round((baseValues.pm1 * multiplier * variation * sensorMultiplier) * 10) / 10,
          pm2_5: Math.round((baseValues.pm2_5 * multiplier * variation * sensorMultiplier) * 10) / 10,
          pm10: Math.round((baseValues.pm10 * multiplier * variation * sensorMultiplier) * 10) / 10,
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
          pm1: Math.round((baseValues.pm1 * multiplier * variation * sensorMultiplier) * 10) / 10,
          pm2_5: Math.round((baseValues.pm2_5 * multiplier * variation * sensorMultiplier) * 10) / 10,
          pm10: Math.round((baseValues.pm10 * multiplier * variation * sensorMultiplier) * 10) / 10,
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
          pm1: Math.round((baseValues.pm1 * multiplier * variation * sensorMultiplier) * 10) / 10,
          pm2_5: Math.round((baseValues.pm2_5 * multiplier * variation * sensorMultiplier) * 10) / 10,
          pm10: Math.round((baseValues.pm10 * multiplier * variation * sensorMultiplier) * 10) / 10,
          timestamp: timestamp.getTime()
        })
      }
    }
    
    return data
  }

  useEffect(() => {
    // In a real app, fetch sensors from Firestore
    setSensors(mockSensors)
  }, [])

  // Fetch sensor data when modal opens or date range changes
  useEffect(() => {
    if (showDataModal && selectedSensor) {
      setLoading(true)
      // Simulate API delay
      setTimeout(() => {
        const data = generateMockData(dateRange, selectedSensor.sensorId)
        setSensorData(data)
        setLoading(false)
      }, 500)
    }
  }, [showDataModal, selectedSensor, dateRange])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingSensor) {
      // Update existing sensor
      setSensors(sensors.map(sensor => 
        sensor.id === editingSensor.id 
          ? { ...sensor, ...formData, id: editingSensor.id }
          : sensor
      ))
    } else {
      // Add new sensor
      const newSensor = {
        ...formData,
        id: Date.now(),
        status: 'offline',
        lastReading: new Date()
      }
      setSensors([...sensors, newSensor])
    }
    
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      sensorId: '',
      apiKey: '',
      calibrationFactor: 1.0,
      location: '',
      description: ''
    })
    setShowAddModal(false)
    setEditingSensor(null)
  }

  const handleEdit = (sensor) => {
    setEditingSensor(sensor)
    setFormData({
      name: sensor.name,
      sensorId: sensor.sensorId,
      apiKey: '••••••••', // Don't show actual API key
      calibrationFactor: sensor.calibrationFactor,
      location: sensor.location,
      description: sensor.description
    })
    setShowAddModal(true)
  }

  const handleDelete = (sensorId) => {
    if (window.confirm('Are you sure you want to delete this sensor?')) {
      setSensors(sensors.filter(sensor => sensor.id !== sensorId))
    }
  }

  const testConnection = async (sensorId) => {
    // In a real app, test the PurpleAir API connection
    alert(`Testing connection for sensor ${sensorId}...`)
  }

  const handleViewData = (sensor) => {
    setSelectedSensor(sensor)
    setShowDataModal(true)
    setDateRange(30) // Default to 30 days
    setSelectedMetric('pm2_5') // Default to PM2.5
  }

  const closeDataModal = () => {
    setShowDataModal(false)
    setSelectedSensor(null)
    setSensorData([])
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark-text mb-4">Access Denied</h2>
          <p className="text-dark-text-secondary mb-6">Please log in to manage your sensors</p>
          <a href="/login" className="btn-primary">Login</a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark-text mb-2">Sensor Management</h1>
          <p className="text-dark-text-secondary">Configure and monitor your PurpleAir sensors</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Sensor</span>
        </button>
      </div>

      {/* Sensors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sensors.map((sensor) => (
          <div key={sensor.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
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
                  <h3 className="font-semibold text-dark-text">{sensor.name}</h3>
                  <p className="text-sm text-dark-text-secondary">ID: {sensor.sensorId}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(sensor)}
                  className="p-2 text-dark-text-secondary hover:text-dark-text transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(sensor.id)}
                  className="p-2 text-dark-text-secondary hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div>
                <span className="text-sm text-dark-text-secondary">Location:</span>
                <p className="text-dark-text">{sensor.location}</p>
              </div>
              <div>
                <span className="text-sm text-dark-text-secondary">Current PM2.5:</span>
                {sensor.pm2_5 !== null ? (
                  <p className={`text-lg font-semibold ${
                    sensor.pm2_5 <= 12 ? 'text-green-400' :
                    sensor.pm2_5 <= 35 ? 'text-yellow-400' :
                    sensor.pm2_5 <= 55 ? 'text-orange-400' :
                    'text-red-400'
                  }`}>
                    {sensor.pm2_5} μg/m³
                  </p>
                ) : (
                  <p className="text-dark-text-secondary">No data</p>
                )}
              </div>
              <div>
                <span className="text-sm text-dark-text-secondary">Calibration Factor:</span>
                <p className="text-dark-text">{sensor.calibrationFactor}</p>
              </div>
              <div>
                <span className="text-sm text-dark-text-secondary">Last Reading:</span>
                <p className="text-dark-text">
                  {sensor.lastReading.toLocaleDateString()} {sensor.lastReading.toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => testConnection(sensor.sensorId)}
                className="btn-secondary flex-1 flex items-center justify-center space-x-2"
              >
                <Settings size={16} />
                <span>Test</span>
              </button>
              <button 
                onClick={() => handleViewData(sensor)}
                className="btn-primary flex-1"
              >
                View Data
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-card border border-dark-border rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold text-dark-text mb-4">
              {editingSensor ? 'Edit Sensor' : 'Add New Sensor'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-text mb-1">
                  Sensor Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text mb-1">
                  PurpleAir Sensor ID
                </label>
                <input
                  type="text"
                  value={formData.sensorId}
                  onChange={(e) => setFormData({ ...formData, sensorId: e.target.value })}
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text mb-1">
                  API Key
                </label>
                <input
                  type="password"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  className="input w-full"
                  placeholder="Enter your PurpleAir API key"
                  required={!editingSensor}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text mb-1">
                  Calibration Factor
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  max="2.0"
                  value={formData.calibrationFactor}
                  onChange={(e) => setFormData({ ...formData, calibrationFactor: parseFloat(e.target.value) })}
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input w-full h-20 resize-none"
                  placeholder="Optional description"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  {editingSensor ? 'Update' : 'Add'} Sensor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sensor Data Visualization Modal */}
      {showDataModal && selectedSensor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-card border border-dark-border rounded-lg p-6 w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-dark-text">{selectedSensor.name}</h2>
                <p className="text-dark-text-secondary">{selectedSensor.location}</p>
              </div>
              <button
                onClick={closeDataModal}
                className="p-2 text-dark-text-secondary hover:text-dark-text transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Chart Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h3 className="text-xl font-semibold text-dark-text mb-4 sm:mb-0">Air Quality Trends</h3>
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
            
            {/* Chart */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
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

            {/* Sensor Info */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card">
                <p className="text-dark-text-secondary text-sm">Current PM2.5</p>
                {selectedSensor.pm2_5 !== null ? (
                  <p className={`text-2xl font-bold ${
                    selectedSensor.pm2_5 <= 12 ? 'text-green-400' :
                    selectedSensor.pm2_5 <= 35 ? 'text-yellow-400' :
                    selectedSensor.pm2_5 <= 55 ? 'text-orange-400' :
                    'text-red-400'
                  }`}>
                    {selectedSensor.pm2_5} μg/m³
                  </p>
                ) : (
                  <p className="text-2xl font-bold text-dark-text-secondary">No data</p>
                )}
              </div>
              <div className="card">
                <p className="text-dark-text-secondary text-sm">Status</p>
                <p className={`text-2xl font-bold ${
                  selectedSensor.status === 'online' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {selectedSensor.status === 'online' ? 'Online' : 'Offline'}
                </p>
              </div>
              <div className="card">
                <p className="text-dark-text-secondary text-sm">Data Points</p>
                <p className="text-2xl font-bold text-dark-text">
                  {sensorData.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sensors
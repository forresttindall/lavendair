import React, { useState, useEffect } from 'react'
import { Download, Upload, Calendar, FileText, Database, Globe, CheckCircle, AlertCircle, Clock, Settings } from 'lucide-react'
import { exportToEagleIo, downloadAQSXML, exportToCSV, exportToJSON, getExportHistory } from '../services/exportService'
import { getSensorData } from '../services/purpleAirService'
import { format, subDays } from 'date-fns'
import { useAuth } from '../contexts/AuthContext'

const Exports = () => {
  const { user } = useAuth()
  const [exportHistory, setExportHistory] = useState([])
  const [showExportModal, setShowExportModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [exportForm, setExportForm] = useState({
    startDate: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    sensors: [],
    format: 'csv',
    destination: 'download'
  })
  const [scheduleForm, setScheduleForm] = useState({
    name: '',
    frequency: 'daily',
    time: '09:00',
    sensors: [],
    format: 'csv',
    destination: 'eagle_io',
    eagleConfig: {
      endpoint: '',
      apiKey: ''
    },
    aqsConfig: {
      facilityId: '',
      username: '',
      password: ''
    }
  })

  // Mock data
  const mockExports = [
    {
      id: 1,
      name: 'Weekly Report - Downtown',
      date: new Date(),
      status: 'completed',
      format: 'csv',
      destination: 'download',
      fileSize: '2.3 MB',
      records: 1247
    },
    {
      id: 2,
      name: 'Eagle.io Sync',
      date: subDays(new Date(), 1),
      status: 'completed',
      format: 'json',
      destination: 'eagle_io',
      records: 3456
    },
    {
      id: 3,
      name: 'AQS Compliance Report',
      date: subDays(new Date(), 2),
      status: 'failed',
      format: 'csv',
      destination: 'aqs',
      error: 'Authentication failed'
    }
  ]

  const mockSchedules = [
    {
      id: 1,
      name: 'Daily Eagle.io Sync',
      frequency: 'daily',
      time: '09:00',
      destination: 'eagle_io',
      status: 'active',
      lastRun: new Date(),
      nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000)
    },
    {
      id: 2,
      name: 'Weekly AQS Report',
      frequency: 'weekly',
      time: '08:00',
      destination: 'aqs',
      status: 'active',
      lastRun: subDays(new Date(), 7),
      nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
  ]

  const sensors = [
    { id: 1, name: 'Downtown Station' },
    { id: 2, name: 'Industrial Area' },
    { id: 3, name: 'Residential Zone' }
  ]

  useEffect(() => {
    setExportHistory(mockExports)
  }, [])

  const handleExport = async (e) => {
    e.preventDefault()
    
    const newExport = {
      id: Date.now(),
      name: `Export ${format(new Date(), 'yyyy-MM-dd HH:mm')}`,
      date: new Date(),
      status: 'processing',
      format: exportForm.format,
      destination: exportForm.destination,
      records: 0
    }
    
    setExportHistory([newExport, ...exportHistory])
    setShowExportModal(false)
    
    try {
      // Get sensor data (mock for now)
      const sensorData = await getSensorData(exportForm.sensors)
      
      let result
      switch (exportForm.destination) {
        case 'download':
          if (exportForm.format === 'csv') {
            result = await exportToCSV(sensorData)
          } else {
            result = await exportToJSON(sensorData)
          }
          break
        case 'eagle_io':
          result = await exportToEagleIo(sensorData, {
            apiUrl: 'https://api.eagle.io',
            apiKey: 'your-eagle-io-key'
          })
          break
        case 'aqs':
          result = downloadAQSXML(sensorData, {
            stateCode: '06',
            countyCode: '001',
            siteNumber: '0001',
            submitterName: 'Lavendair User',
            submitterEmail: user?.email || 'user@example.com',
            organizationName: 'Lavendair'
          })
          break
        default:
          throw new Error('Unsupported export destination')
      }

      if (result.success) {
        setExportHistory(prev => prev.map(exp => 
          exp.id === newExport.id 
            ? { 
                ...exp, 
                status: 'completed', 
                records: result.recordCount || 1247, 
                fileSize: result.fileSize || '2.1 MB' 
              }
            : exp
        ))
      } else {
        throw new Error(result.error || 'Export failed')
      }
    } catch (error) {
      console.error('Export error:', error)
      setExportHistory(prev => prev.map(exp => 
        exp.id === newExport.id 
          ? { ...exp, status: 'failed', error: error.message }
          : exp
      ))
    }
  }

  const handleSchedule = (e) => {
    e.preventDefault()
    // In a real app, save the schedule to the database
    alert('Export schedule created successfully!')
    setShowScheduleModal(false)
  }

  const downloadFile = (exportId) => {
    // In a real app, generate and download the file
    alert(`Downloading export ${exportId}...`)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-500" size={20} />
      case 'failed':
        return <AlertCircle className="text-red-500" size={20} />
      case 'processing':
        return <Clock className="text-yellow-500" size={20} />
      default:
        return <Clock className="text-gray-500" size={20} />
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark-text mb-4">Access Denied</h2>
          <p className="text-dark-text-secondary mb-6">Please log in to access exports</p>
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
          <h1 className="text-3xl font-bold text-dark-text mb-2">Data Exports</h1>
          <p className="text-dark-text-secondary">Export and schedule data delivery to external systems</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowScheduleModal(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Clock size={20} />
            <span>Schedule Export</span>
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Download size={20} />
            <span>New Export</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="text-center">
            <p className="text-2xl font-bold text-dark-text">12</p>
            <p className="text-dark-text-secondary text-sm">Total Exports</p>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-500">8</p>
            <p className="text-dark-text-secondary text-sm">Successful</p>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-500">2</p>
            <p className="text-dark-text-secondary text-sm">Scheduled</p>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">15.2 MB</p>
            <p className="text-dark-text-secondary text-sm">Data Exported</p>
          </div>
        </div>
      </div>

      {/* Export History */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold text-dark-text mb-6">Recent Exports</h2>
        <div className="space-y-4">
          {exportHistory.map((exp) => (
            <div key={exp.id} className="flex items-center justify-between p-4 bg-dark-bg rounded-lg border border-dark-border">
              <div className="flex items-center space-x-4">
                {getStatusIcon(exp.status)}
                <div>
                  <h3 className="font-medium text-dark-text">{exp.name}</h3>
                  <p className="text-sm text-dark-text-secondary">
                    {format(exp.date, 'MMM dd, yyyy HH:mm')} • {exp.format.toUpperCase()} • {exp.destination.replace('_', '.')}
                  </p>
                  {exp.error && (
                    <p className="text-sm text-red-400">Error: {exp.error}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {exp.records > 0 && (
                  <div className="text-right">
                    <p className="text-sm text-dark-text">{exp.records.toLocaleString()} records</p>
                    {exp.fileSize && (
                      <p className="text-sm text-dark-text-secondary">{exp.fileSize}</p>
                    )}
                  </div>
                )}
                {exp.status === 'completed' && exp.destination === 'download' && (
                  <button
                    onClick={() => downloadFile(exp.id)}
                    className="btn-secondary"
                  >
                    <Download size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scheduled Exports */}
      <div className="card">
        <h2 className="text-xl font-semibold text-dark-text mb-6">Scheduled Exports</h2>
        <div className="space-y-4">
          {mockSchedules.map((schedule) => (
            <div key={schedule.id} className="flex items-center justify-between p-4 bg-dark-bg rounded-lg border border-dark-border">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${
                  schedule.status === 'active' ? 'bg-green-500/20' : 'bg-gray-500/20'
                }`}>
                  <Clock className={schedule.status === 'active' ? 'text-green-500' : 'text-gray-500'} size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-dark-text">{schedule.name}</h3>
                  <p className="text-sm text-dark-text-secondary">
                    {schedule.frequency} at {schedule.time} • {schedule.destination.replace('_', '.')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-dark-text">
                    Next: {format(schedule.nextRun, 'MMM dd, HH:mm')}
                  </p>
                  <p className="text-sm text-dark-text-secondary">
                    Last: {format(schedule.lastRun, 'MMM dd, HH:mm')}
                  </p>
                </div>
                <button className="btn-secondary">
                  <Settings size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-card border border-dark-border rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold text-dark-text mb-4">Create Export</h2>
            
            <form onSubmit={handleExport} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={exportForm.startDate}
                    onChange={(e) => setExportForm({ ...exportForm, startDate: e.target.value })}
                    className="input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={exportForm.endDate}
                    onChange={(e) => setExportForm({ ...exportForm, endDate: e.target.value })}
                    className="input w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text mb-1">
                  Format
                </label>
                <select
                  value={exportForm.format}
                  onChange={(e) => setExportForm({ ...exportForm, format: e.target.value })}
                  className="input w-full"
                >
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text mb-1">
                  Destination
                </label>
                <select
                  value={exportForm.destination}
                  onChange={(e) => setExportForm({ ...exportForm, destination: e.target.value })}
                  className="input w-full"
                >
                  <option value="download">Download</option>
                  <option value="eagle_io">Eagle.io</option>
                  <option value="aqs">AQS (EPA)</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowExportModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Export Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-card border border-dark-border rounded-lg p-6 w-full max-w-lg mx-4">
            <h2 className="text-xl font-semibold text-dark-text mb-4">Schedule Export</h2>
            
            <form onSubmit={handleSchedule} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-text mb-1">
                  Schedule Name
                </label>
                <input
                  type="text"
                  value={scheduleForm.name}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, name: e.target.value })}
                  className="input w-full"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-1">
                    Frequency
                  </label>
                  <select
                    value={scheduleForm.frequency}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, frequency: e.target.value })}
                    className="input w-full"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={scheduleForm.time}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                    className="input w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text mb-1">
                  Destination
                </label>
                <select
                  value={scheduleForm.destination}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, destination: e.target.value })}
                  className="input w-full"
                >
                  <option value="eagle_io">Eagle.io</option>
                  <option value="aqs">AQS (EPA)</option>
                </select>
              </div>

              {scheduleForm.destination === 'eagle_io' && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-dark-text">Eagle.io Configuration</h3>
                  <input
                    type="url"
                    placeholder="API Endpoint"
                    value={scheduleForm.eagleConfig.endpoint}
                    onChange={(e) => setScheduleForm({
                      ...scheduleForm,
                      eagleConfig: { ...scheduleForm.eagleConfig, endpoint: e.target.value }
                    })}
                    className="input w-full"
                  />
                  <input
                    type="password"
                    placeholder="API Key"
                    value={scheduleForm.eagleConfig.apiKey}
                    onChange={(e) => setScheduleForm({
                      ...scheduleForm,
                      eagleConfig: { ...scheduleForm.eagleConfig, apiKey: e.target.value }
                    })}
                    className="input w-full"
                  />
                </div>
              )}

              {scheduleForm.destination === 'aqs' && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-dark-text">AQS Configuration</h3>
                  <input
                    type="text"
                    placeholder="Facility ID"
                    value={scheduleForm.aqsConfig.facilityId}
                    onChange={(e) => setScheduleForm({
                      ...scheduleForm,
                      aqsConfig: { ...scheduleForm.aqsConfig, facilityId: e.target.value }
                    })}
                    className="input w-full"
                  />
                  <input
                    type="text"
                    placeholder="Username"
                    value={scheduleForm.aqsConfig.username}
                    onChange={(e) => setScheduleForm({
                      ...scheduleForm,
                      aqsConfig: { ...scheduleForm.aqsConfig, username: e.target.value }
                    })}
                    className="input w-full"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={scheduleForm.aqsConfig.password}
                    onChange={(e) => setScheduleForm({
                      ...scheduleForm,
                      aqsConfig: { ...scheduleForm.aqsConfig, password: e.target.value }
                    })}
                    className="input w-full"
                  />
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Create Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Exports
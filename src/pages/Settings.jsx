import { useState, useEffect } from 'react'
import { Save, Key, User, Bell, Shield, ExternalLink, Mail } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { setApiKey as setPurpleAirApiKey, getApiKey as getPurpleAirApiKey } from '../services/purpleAirService'

const Settings = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [profileForm, setProfileForm] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    organization: '',
    phone: ''
  })
  const [apiForm, setApiForm] = useState({
    purpleAirKey: '',
    eagleIoEndpoint: '',
    eagleIoKey: '',
    aqsStateCode: '06',
    aqsCountyCode: '001',
    aqsSiteNumber: '0001',
    aqsSubmitterName: '',
    aqsSubmitterEmail: '',
    aqsOrganizationName: 'Lavendair'
  })
  const [emailForm, setEmailForm] = useState({
    serviceId: '',
    templateId: '',
    publicKey: ''
  })
  const [notificationForm, setNotificationForm] = useState({
    emailAlerts: true,
    sensorOffline: true,
    dataExports: true,
    weeklyReports: false,
    maintenanceAlerts: true
  })
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    // Load existing PurpleAir API key
    const existingApiKey = getPurpleAirApiKey()
    if (existingApiKey) {
      setApiForm(prev => ({
        ...prev,
        purpleAirKey: existingApiKey
      }))
    }
  }, [])

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'email', label: 'Email Settings', icon: Mail },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield }
  ]

  const handleProfileSave = (e) => {
    e.preventDefault()
    // In a real app, update user profile in Firebase
    alert('Profile updated successfully!')
  }

  const handleApiSave = (e) => {
    e.preventDefault()
    // Save PurpleAir API key
    if (apiForm.purpleAirKey) {
      setPurpleAirApiKey(apiForm.purpleAirKey)
    }
    // In a real app, save other API keys securely
    alert('API keys updated successfully!')
  }

  const handleEmailSave = (e) => {
    e.preventDefault()
    // In a real app, save EmailJS configuration
    localStorage.setItem('emailjs_config', JSON.stringify(emailForm))
    alert('Email settings updated successfully!')
  }

  const handleNotificationSave = (e) => {
    e.preventDefault()
    // In a real app, save notification preferences
    alert('Notification preferences updated!')
  }

  const handleSecuritySave = (e) => {
    e.preventDefault()
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    // In a real app, update password in Firebase
    alert('Password updated successfully!')
    setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  const testApiConnection = async (service) => {
    // In a real app, test the API connection
    alert(`Testing ${service} connection...`)
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark-text mb-4">Access Denied</h2>
          <p className="text-dark-text-secondary mb-6">Please log in to access settings</p>
          <a href="/login" className="btn-primary">Login</a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-text mb-2">Settings</h1>
        <p className="text-dark-text-secondary">Manage your account and application preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary/20 text-primary'
                      : 'text-dark-text-secondary hover:text-dark-text hover:bg-dark-border'
                  }`}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="card">
              <h2 className="text-xl font-semibold text-dark-text mb-6">Profile Information</h2>
              <form onSubmit={handleProfileSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.displayName}
                      onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
                      className="input w-full"
                      placeholder="Your display name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="input w-full"
                      disabled
                    />
                    <p className="text-xs text-dark-text-secondary mt-1">
                      Email cannot be changed here. Contact support if needed.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      Organization
                    </label>
                    <input
                      type="text"
                      value={profileForm.organization}
                      onChange={(e) => setProfileForm({ ...profileForm, organization: e.target.value })}
                      className="input w-full"
                      placeholder="Your organization name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="input w-full"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="btn-primary flex items-center space-x-2">
                    <Save size={16} />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* API Keys Tab */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              {/* PurpleAir API */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-dark-text">PurpleAir API</h3>
                  <a
                    href="https://api.purpleair.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-light flex items-center space-x-1"
                  >
                    <span>Get API Key</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
                <form onSubmit={handleApiSave} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      API Key
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="password"
                        value={apiForm.purpleAirKey}
                        onChange={(e) => setApiForm({ ...apiForm, purpleAirKey: e.target.value })}
                        className="input flex-1"
                        placeholder="Enter your PurpleAir API key"
                      />
                      <button
                        type="button"
                        onClick={() => testApiConnection('PurpleAir')}
                        className="btn-secondary"
                      >
                        Test
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Eagle.io API */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-dark-text">Eagle.io Integration</h3>
                  <a
                    href="https://eagle.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-light flex items-center space-x-1"
                  >
                    <span>Learn More</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      API Endpoint
                    </label>
                    <input
                      type="url"
                      value={apiForm.eagleIoEndpoint}
                      onChange={(e) => setApiForm({ ...apiForm, eagleIoEndpoint: e.target.value })}
                      className="input w-full"
                      placeholder="https://api.eagle.io/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      API Key
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="password"
                        value={apiForm.eagleIoKey}
                        onChange={(e) => setApiForm({ ...apiForm, eagleIoKey: e.target.value })}
                        className="input flex-1"
                        placeholder="Enter your Eagle.io API key"
                      />
                      <button
                        type="button"
                        onClick={() => testApiConnection('Eagle.io')}
                        className="btn-secondary"
                      >
                        Test
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* AQS API */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-dark-text">AQS (EPA) Integration</h3>
                  <a
                    href="https://www.epa.gov/aqs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-light flex items-center space-x-1"
                  >
                    <span>EPA AQS</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-dark-text mb-2">
                        State Code
                      </label>
                      <input
                        type="text"
                        value={apiForm.aqsStateCode}
                        onChange={(e) => setApiForm({ ...apiForm, aqsStateCode: e.target.value })}
                        className="input w-full"
                        placeholder="06"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-text mb-2">
                        County Code
                      </label>
                      <input
                        type="text"
                        value={apiForm.aqsCountyCode}
                        onChange={(e) => setApiForm({ ...apiForm, aqsCountyCode: e.target.value })}
                        className="input w-full"
                        placeholder="001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-text mb-2">
                        Site Number
                      </label>
                      <input
                        type="text"
                        value={apiForm.aqsSiteNumber}
                        onChange={(e) => setApiForm({ ...apiForm, aqsSiteNumber: e.target.value })}
                        className="input w-full"
                        placeholder="0001"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-dark-text mb-2">
                        Submitter Name
                      </label>
                      <input
                        type="text"
                        value={apiForm.aqsSubmitterName}
                        onChange={(e) => setApiForm({ ...apiForm, aqsSubmitterName: e.target.value })}
                        className="input w-full"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-text mb-2">
                        Submitter Email
                      </label>
                      <input
                        type="email"
                        value={apiForm.aqsSubmitterEmail}
                        onChange={(e) => setApiForm({ ...apiForm, aqsSubmitterEmail: e.target.value })}
                        className="input w-full"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      value={apiForm.aqsOrganizationName}
                      onChange={(e) => setApiForm({ ...apiForm, aqsOrganizationName: e.target.value })}
                      className="input w-full"
                      placeholder="Lavendair"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleApiSave}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>Save API Keys</span>
                </button>
              </div>
            </div>
          )}

          {/* Email Settings Tab */}
          {activeTab === 'email' && (
            <div className="card">
              <h2 className="text-xl font-semibold text-dark-text mb-6">Email Configuration</h2>
              <p className="text-dark-text-secondary mb-6">
                Configure EmailJS settings for sending email notifications and reports.
              </p>
              <form onSubmit={handleEmailSave} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    Service ID
                  </label>
                  <input
                    type="text"
                    value={emailForm.serviceId}
                    onChange={(e) => setEmailForm({ ...emailForm, serviceId: e.target.value })}
                    className="input w-full"
                    placeholder="Your EmailJS service ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    Template ID
                  </label>
                  <input
                    type="text"
                    value={emailForm.templateId}
                    onChange={(e) => setEmailForm({ ...emailForm, templateId: e.target.value })}
                    className="input w-full"
                    placeholder="Your EmailJS template ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    Public Key
                  </label>
                  <input
                    type="text"
                    value={emailForm.publicKey}
                    onChange={(e) => setEmailForm({ ...emailForm, publicKey: e.target.value })}
                    className="input w-full"
                    placeholder="Your EmailJS public key"
                  />
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="btn-primary flex items-center space-x-2">
                    <Save size={16} />
                    <span>Save Email Settings</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="card">
              <h2 className="text-xl font-semibold text-dark-text mb-6">Notification Preferences</h2>
              <form onSubmit={handleNotificationSave} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-dark-text font-medium">Email Alerts</h3>
                      <p className="text-sm text-dark-text-secondary">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationForm.emailAlerts}
                        onChange={(e) => setNotificationForm({ ...notificationForm, emailAlerts: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-dark-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-dark-text font-medium">Sensor Offline Alerts</h3>
                      <p className="text-sm text-dark-text-secondary">Get notified when sensors go offline</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationForm.sensorOffline}
                        onChange={(e) => setNotificationForm({ ...notificationForm, sensorOffline: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-dark-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-dark-text font-medium">Data Export Notifications</h3>
                      <p className="text-sm text-dark-text-secondary">Notifications for export completion</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationForm.dataExports}
                        onChange={(e) => setNotificationForm({ ...notificationForm, dataExports: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-dark-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-dark-text font-medium">Weekly Reports</h3>
                      <p className="text-sm text-dark-text-secondary">Receive weekly summary reports</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationForm.weeklyReports}
                        onChange={(e) => setNotificationForm({ ...notificationForm, weeklyReports: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-dark-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-dark-text font-medium">Maintenance Alerts</h3>
                      <p className="text-sm text-dark-text-secondary">Alerts for sensor maintenance needs</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationForm.maintenanceAlerts}
                        onChange={(e) => setNotificationForm({ ...notificationForm, maintenanceAlerts: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-dark-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button type="submit" className="btn-primary flex items-center space-x-2">
                    <Save size={16} />
                    <span>Save Preferences</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="card">
              <h2 className="text-xl font-semibold text-dark-text mb-6">Security Settings</h2>
              <form onSubmit={handleSecuritySave} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={securityForm.currentPassword}
                    onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                    className="input w-full max-w-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={securityForm.newPassword}
                    onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                    className="input w-full max-w-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={securityForm.confirmPassword}
                    onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                    className="input w-full max-w-md"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="btn-primary flex items-center space-x-2">
                    <Save size={16} />
                    <span>Update Password</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings
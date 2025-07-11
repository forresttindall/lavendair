import axios from 'axios'

const PURPLE_AIR_BASE_URL = 'https://api.purpleair.com/v1'

// Store API key in memory (user must provide it)
let userApiKey = null

// Function to set API key
export const setApiKey = (apiKey) => {
  userApiKey = apiKey
}

// Function to get current API key
export const getApiKey = () => {
  return userApiKey
}

// Create axios instance with default config
const purpleAirApi = axios.create({
  baseURL: PURPLE_AIR_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add request interceptor to include API key
purpleAirApi.interceptors.request.use(
  (config) => {
    if (userApiKey) {
      config.headers['X-API-Key'] = userApiKey
    } else {
      throw new Error('PurpleAir API key not set. Please configure your API key in Settings.')
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
purpleAirApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('PurpleAir API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

/**
 * Get sensor data by sensor ID
 * @param {string} sensorId - The PurpleAir sensor ID
 * @param {string} fields - Comma-separated list of fields to retrieve
 * @returns {Promise} Sensor data
 */
export const getSensorById = async (sensorId, fields = 'pm2.5_atm,pm1.0_atm,pm10.0_atm,humidity,temperature,pressure') => {
  try {
    const response = await purpleAirApi.get(`/sensors/${sensorId}`, {
      params: { fields }
    })
    return response.data
  } catch (error) {
    throw new Error(`Failed to fetch sensor ${sensorId}: ${error.message}`)
  }
}

/**
 * Get multiple sensors data
 * @param {Array} sensorIds - Array of sensor IDs
 * @param {string} fields - Comma-separated list of fields to retrieve
 * @returns {Promise} Array of sensor data
 */
export const getMultipleSensors = async (sensorIds, fields = 'pm2.5_atm,pm1.0_atm,pm10.0_atm,humidity,temperature,pressure') => {
  try {
    const response = await purpleAirApi.get('/sensors', {
      params: {
        show_only: sensorIds.join(','),
        fields
      }
    })
    return response.data
  } catch (error) {
    throw new Error(`Failed to fetch multiple sensors: ${error.message}`)
  }
}

/**
 * Get sensor history data
 * @param {string} sensorId - The PurpleAir sensor ID
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @param {string} fields - Comma-separated list of fields to retrieve
 * @returns {Promise} Historical sensor data
 */
export const getSensorHistory = async (sensorId, startDate, endDate, fields = 'pm2.5_atm,pm1.0_atm,pm10.0_atm,humidity,temperature') => {
  try {
    const response = await purpleAirApi.get(`/sensors/${sensorId}/history`, {
      params: {
        start_timestamp: new Date(startDate).getTime() / 1000,
        end_timestamp: new Date(endDate).getTime() / 1000,
        average: '60', // 1-hour averages
        fields
      }
    })
    return response.data
  } catch (error) {
    throw new Error(`Failed to fetch sensor history: ${error.message}`)
  }
}

/**
 * Test API connection with a sensor
 * @param {string} sensorId - The PurpleAir sensor ID
 * @param {string} apiKey - API key to test
 * @returns {Promise} Connection test result
 */
export const testConnection = async (sensorId, apiKey) => {
  try {
    const response = await axios.get(`${PURPLE_AIR_BASE_URL}/sensors/${sensorId}`, {
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json'
      },
      params: {
        fields: 'name,last_seen'
      },
      timeout: 5000
    })
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.description || error.message
    }
  }
}

/**
 * Clean and normalize sensor data
 * @param {Object} rawData - Raw sensor data from PurpleAir
 * @param {number} calibrationFactor - Calibration factor to apply
 * @returns {Object} Cleaned and normalized data
 */
export const cleanSensorData = (rawData, calibrationFactor = 1.0) => {
  if (!rawData || !rawData.sensor) {
    throw new Error('Invalid sensor data')
  }

  const sensor = rawData.sensor
  
  // Apply calibration factor and remove outliers
  const cleanValue = (value, min = 0, max = 1000) => {
    if (value === null || value === undefined || isNaN(value)) {
      return null
    }
    const calibrated = value * calibrationFactor
    return calibrated >= min && calibrated <= max ? Math.round(calibrated * 10) / 10 : null
  }

  return {
    sensorId: sensor.sensor_index,
    name: sensor.name,
    lastSeen: new Date(sensor.last_seen * 1000),
    location: {
      latitude: sensor.latitude,
      longitude: sensor.longitude
    },
    measurements: {
      pm1_0: cleanValue(sensor['pm1.0_atm']),
      pm2_5: cleanValue(sensor['pm2.5_atm']),
      pm10_0: cleanValue(sensor['pm10.0_atm']),
      humidity: cleanValue(sensor.humidity, 0, 100),
      temperature: cleanValue(sensor.temperature, -50, 70),
      pressure: cleanValue(sensor.pressure, 800, 1200)
    },
    timestamp: new Date()
  }
}

/**
 * Format data for Eagle.io export
 * @param {Array} sensorDataArray - Array of cleaned sensor data
 * @returns {Object} Eagle.io formatted data
 */
export const formatForEagleIo = (sensorDataArray) => {
  return {
    timestamp: new Date().toISOString(),
    data: sensorDataArray.map(sensor => ({
      nodeId: sensor.sensorId,
      name: sensor.name,
      timestamp: sensor.timestamp.toISOString(),
      parameters: {
        'PM1.0': {
          value: sensor.measurements.pm1_0,
          unit: 'μg/m³',
          quality: sensor.measurements.pm1_0 !== null ? 'good' : 'bad'
        },
        'PM2.5': {
          value: sensor.measurements.pm2_5,
          unit: 'μg/m³',
          quality: sensor.measurements.pm2_5 !== null ? 'good' : 'bad'
        },
        'PM10': {
          value: sensor.measurements.pm10_0,
          unit: 'μg/m³',
          quality: sensor.measurements.pm10_0 !== null ? 'good' : 'bad'
        },
        'Humidity': {
          value: sensor.measurements.humidity,
          unit: '%',
          quality: sensor.measurements.humidity !== null ? 'good' : 'bad'
        },
        'Temperature': {
          value: sensor.measurements.temperature,
          unit: '°C',
          quality: sensor.measurements.temperature !== null ? 'good' : 'bad'
        }
      }
    }))
  }
}

/**
 * Format data for AQS (EPA) export
 * @param {Array} sensorDataArray - Array of cleaned sensor data
 * @param {string} facilityId - EPA facility ID
 * @returns {Object} AQS formatted data
 */
export const formatForAQS = (sensorDataArray, facilityId) => {
  return {
    facility_id: facilityId,
    submission_date: new Date().toISOString().split('T')[0],
    data: sensorDataArray.map(sensor => ({
      monitor_id: sensor.sensorId,
      parameter_code: '88101', // PM2.5 parameter code
      poc: '1', // Parameter Occurrence Code
      unit_code: '105', // Micrograms per cubic meter
      method_code: 'PURPLEAIR',
      sample_duration: '1', // 1 hour
      frequency: 'H', // Hourly
      date: sensor.timestamp.toISOString().split('T')[0],
      time: sensor.timestamp.toISOString().split('T')[1].split('.')[0],
      sample_value: sensor.measurements.pm2_5,
      null_data_code: sensor.measurements.pm2_5 === null ? 'AS' : null,
      qualifier: sensor.measurements.pm2_5 !== null ? 'V' : null
    }))
  }
}

/**
 * Convert data to CSV format
 * @param {Array} sensorDataArray - Array of cleaned sensor data
 * @returns {string} CSV formatted data
 */
export const formatToCSV = (sensorDataArray) => {
  const headers = [
    'Sensor ID',
    'Name',
    'Timestamp',
    'PM1.0 (μg/m³)',
    'PM2.5 (μg/m³)',
    'PM10 (μg/m³)',
    'Humidity (%)',
    'Temperature (°C)',
    'Pressure (hPa)',
    'Latitude',
    'Longitude'
  ]

  const rows = sensorDataArray.map(sensor => [
    sensor.sensorId,
    sensor.name,
    sensor.timestamp.toISOString(),
    sensor.measurements.pm1_0 || '',
    sensor.measurements.pm2_5 || '',
    sensor.measurements.pm10_0 || '',
    sensor.measurements.humidity || '',
    sensor.measurements.temperature || '',
    sensor.measurements.pressure || '',
    sensor.location.latitude || '',
    sensor.location.longitude || ''
  ])

  return [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n')
}

/**
 * Get sensor data for dashboard (mock implementation)
 * @param {number} days - Number of days to fetch
 * @returns {Promise} Dashboard data
 */
export const getSensorData = async (days = 7) => {
  // This would normally fetch real data from PurpleAir API
  // For now, return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData = []
      const now = new Date()
      
      for (let i = days * 24; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
        mockData.push({
          time: timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          pm1: Math.random() * 20 + 5,
          pm2_5: Math.random() * 25 + 8,
          pm10: Math.random() * 30 + 12,
          timestamp: timestamp.getTime()
        })
      }
      
      resolve(mockData)
    }, 1000)
  })
}
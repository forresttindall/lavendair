import axios from 'axios'
import { formatForEagleIo, formatForAQS, formatToCSV } from './purpleAirService'

/**
 * Export data to Eagle.io
 * @param {Array} sensorData - Array of cleaned sensor data
 * @param {Object} config - Eagle.io configuration
 * @returns {Promise} Export result
 */
export const exportToEagleIo = async (sensorData, config) => {
  try {
    const formattedData = formatForEagleIo(sensorData)
    
    const response = await axios.post(
      `${config.apiUrl || import.meta.env.VITE_EAGLE_IO_API_URL}/v1/nodes/data`,
      formattedData,
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    )

    return {
      success: true,
      message: 'Data exported to Eagle.io successfully',
      recordsExported: sensorData.length,
      response: response.data
    }
  } catch (error) {
    console.error('Eagle.io export error:', error)
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      recordsExported: 0
    }
  }
}

/**
 * Generate EPA AQS XML format
 * @param {Array} sensorData - Array of cleaned sensor data
 * @param {Object} config - AQS configuration
 * @returns {Object} XML generation result
 */
export const generateAQSXML = (sensorData, config = {}) => {
  try {
    const timestamp = new Date().toISOString()
    const submissionId = `LAVENDAIR_${Date.now()}`
    
    // Format data for AQS XML
    const aqsRecords = sensorData.map((sensor, index) => {
      const collectionDate = new Date(sensor.last_seen * 1000)
      return {
        recordId: index + 1,
        stateCode: config.stateCode || '06', // Default to California
        countyCode: config.countyCode || '001',
        siteNumber: config.siteNumber || '0001',
        parameterCode: '88101', // PM2.5
        poc: 1,
        latitude: sensor.latitude,
        longitude: sensor.longitude,
        datum: 'WGS84',
        collectionDate: collectionDate.toISOString().split('T')[0],
        collectionTime: collectionDate.toTimeString().split(' ')[0],
        sampleValue: sensor.pm2_5_atm,
        unitsOfMeasure: 'Micrograms/cubic meter (LC)',
        mdl: 0.1,
        uncertainty: null,
        qualifier: null,
        methodType: 'FEM',
        methodCode: '170',
        methodDescription: 'PurpleAir Sensor',
        sampleDuration: '1 HOUR',
        sampleFrequency: 'CONTINUOUS'
      }
    })

    // Generate EPA AQS XML format
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<AQSSubmission xmlns="http://www.epa.gov/aqs" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Header>
    <SubmissionId>${submissionId}</SubmissionId>
    <SubmissionDate>${timestamp}</SubmissionDate>
    <SubmitterName>${config.submitterName || 'Lavendair User'}</SubmitterName>
    <SubmitterEmail>${config.submitterEmail || 'user@example.com'}</SubmitterEmail>
    <OrganizationName>${config.organizationName || 'Lavendair'}</OrganizationName>
  </Header>
  <RawData>
${aqsRecords.map(record => `    <Record>
      <StateCode>${record.stateCode}</StateCode>
      <CountyCode>${record.countyCode}</CountyCode>
      <SiteNumber>${record.siteNumber}</SiteNumber>
      <ParameterCode>${record.parameterCode}</ParameterCode>
      <POC>${record.poc}</POC>
      <Latitude>${record.latitude}</Latitude>
      <Longitude>${record.longitude}</Longitude>
      <Datum>${record.datum}</Datum>
      <CollectionDate>${record.collectionDate}</CollectionDate>
      <CollectionTime>${record.collectionTime}</CollectionTime>
      <SampleValue>${record.sampleValue}</SampleValue>
      <UnitsOfMeasure>${record.unitsOfMeasure}</UnitsOfMeasure>
      <MDL>${record.mdl}</MDL>
      <MethodType>${record.methodType}</MethodType>
      <MethodCode>${record.methodCode}</MethodCode>
      <MethodDescription>${record.methodDescription}</MethodDescription>
      <SampleDuration>${record.sampleDuration}</SampleDuration>
      <SampleFrequency>${record.sampleFrequency}</SampleFrequency>
    </Record>`).join('\n')}
  </RawData>
</AQSSubmission>`

    return {
      success: true,
      xmlContent,
      filename: `AQS_Export_${submissionId}.xml`,
      recordCount: aqsRecords.length,
      submissionId
    }
  } catch (error) {
    console.error('AQS XML generation error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Download AQS XML file
 * @param {Array} sensorData - Array of cleaned sensor data
 * @param {Object} config - AQS configuration
 * @returns {Object} Download result
 */
export const downloadAQSXML = (sensorData, config = {}) => {
  const result = generateAQSXML(sensorData, config)
  
  if (!result.success) {
    return result
  }

  try {
    const blob = new Blob([result.xmlContent], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = result.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    return {
      success: true,
      message: 'AQS XML file downloaded successfully',
      filename: result.filename,
      recordCount: result.recordCount
    }
  } catch (error) {
    console.error('AQS XML download error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Export data as CSV file
 * @param {Array} sensorData - Array of cleaned sensor data
 * @param {string} filename - Optional filename
 * @returns {Promise} Export result
 */
export const exportToCSV = async (sensorData, filename) => {
  try {
    const csvData = formatToCSV(sensorData)
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
    
    // Create download link
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename || `lavendair_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    return {
      success: true,
      message: 'CSV file downloaded successfully',
      recordsExported: sensorData.length
    }
  } catch (error) {
    console.error('CSV export error:', error)
    return {
      success: false,
      error: error.message,
      recordsExported: 0
    }
  }
}

/**
 * Export data as JSON file
 * @param {Array} sensorData - Array of cleaned sensor data
 * @param {string} filename - Optional filename
 * @returns {Promise} Export result
 */
export const exportToJSON = async (sensorData, filename) => {
  try {
    const jsonData = JSON.stringify(sensorData, null, 2)
    const blob = new Blob([jsonData], { type: 'application/json;charset=utf-8;' })
    
    // Create download link
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename || `lavendair_export_${new Date().toISOString().split('T')[0]}.json`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    return {
      success: true,
      message: 'JSON file downloaded successfully',
      recordsExported: sensorData.length
    }
  } catch (error) {
    console.error('JSON export error:', error)
    return {
      success: false,
      error: error.message,
      recordsExported: 0
    }
  }
}

/**
 * Test Eagle.io connection
 * @param {Object} config - Eagle.io configuration
 * @returns {Promise} Connection test result
 */
export const testEagleIoConnection = async (config) => {
  try {
    const response = await axios.get(
      `${config.apiUrl || import.meta.env.VITE_EAGLE_IO_API_URL}/v1/nodes`,
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    )

    return {
      success: true,
      message: 'Eagle.io connection successful',
      data: response.data
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message
    }
  }
}

/**
 * Test AQS connection
 * @param {Object} config - AQS configuration
 * @returns {Promise} Connection test result
 */
export const testAQSConnection = async (config) => {
  try {
    const response = await axios.get(
      `${config.apiUrl || import.meta.env.VITE_AQS_API_URL}/metaData/isAvailable`,
      {
        params: {
          email: config.email || import.meta.env.VITE_AQS_EMAIL,
          key: config.apiKey || import.meta.env.VITE_AQS_KEY
        },
        timeout: 10000
      }
    )

    return {
      success: true,
      message: 'AQS connection successful',
      data: response.data
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message
    }
  }
}

/**
 * Schedule automatic export
 * @param {Object} exportConfig - Export configuration
 * @returns {Promise} Schedule result
 */
export const scheduleExport = async (exportConfig) => {
  try {
    // In a real implementation, this would save to a database
    // and set up a cron job or scheduled function
    const scheduledExport = {
      id: Date.now().toString(),
      ...exportConfig,
      createdAt: new Date().toISOString(),
      status: 'active'
    }

    // Save to localStorage for demo purposes
    const existingSchedules = JSON.parse(localStorage.getItem('scheduledExports') || '[]')
    existingSchedules.push(scheduledExport)
    localStorage.setItem('scheduledExports', JSON.stringify(existingSchedules))

    return {
      success: true,
      message: 'Export scheduled successfully',
      scheduleId: scheduledExport.id
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Get scheduled exports
 * @returns {Array} List of scheduled exports
 */
export const getScheduledExports = () => {
  try {
    return JSON.parse(localStorage.getItem('scheduledExports') || '[]')
  } catch (error) {
    console.error('Error getting scheduled exports:', error)
    return []
  }
}

/**
 * Delete scheduled export
 * @param {string} scheduleId - Schedule ID to delete
 * @returns {Promise} Delete result
 */
export const deleteScheduledExport = async (scheduleId) => {
  try {
    const existingSchedules = JSON.parse(localStorage.getItem('scheduledExports') || '[]')
    const updatedSchedules = existingSchedules.filter(schedule => schedule.id !== scheduleId)
    localStorage.setItem('scheduledExports', JSON.stringify(updatedSchedules))

    return {
      success: true,
      message: 'Scheduled export deleted successfully'
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Get export history (mock implementation)
 * @returns {Array} Export history
 */
export const getExportHistory = () => {
  // Mock export history data
  return [
    {
      id: '1',
      destination: 'Eagle.io',
      type: 'Manual',
      status: 'Success',
      recordsExported: 1440,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      duration: '2.3s'
    },
    {
      id: '2',
      destination: 'CSV Download',
      type: 'Manual',
      status: 'Success',
      recordsExported: 720,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      duration: '1.1s'
    },
    {
      id: '3',
      destination: 'AQS',
      type: 'Scheduled',
      status: 'Failed',
      recordsExported: 0,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      duration: '0.5s',
      error: 'Invalid API credentials'
    },
    {
      id: '4',
      destination: 'Eagle.io',
      type: 'Scheduled',
      status: 'Success',
      recordsExported: 2880,
      timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
      duration: '4.2s'
    }
  ]
}
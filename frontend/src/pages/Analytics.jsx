import { useState, useEffect } from 'react'
import { fileService } from '../services/fileService'
import { BarChart3, FileSpreadsheet, Download } from 'lucide-react'

const Analytics = () => {
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileData, setFileData] = useState(null)
  const [chartConfig, setChartConfig] = useState({
    xAxis: '',
    yAxis: '',
    chartType: 'bar'
  })
  const [loading, setLoading] = useState(true)
  const [chartLoading, setChartLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const result = await fileService.getFiles()
        setFiles(result.files || [])
      } catch (error) {
        setError('Failed to load files')
      } finally {
        setLoading(false)
      }
    }

    fetchFiles()
  }, [])

  const handleFileSelect = async (fileId) => {
    setSelectedFile(fileId)
    setFileData(null)
    setChartConfig({ xAxis: '', yAxis: '', chartType: 'bar' })
    
    try {
      const result = await fileService.getFileData(fileId)
      setFileData(result.data)
    } catch (error) {
      setError('Failed to load file data')
    }
  }

  const handleCreateChart = async () => {
    if (!selectedFile || !chartConfig.xAxis || !chartConfig.yAxis) {
      setError('Please select both X and Y axes')
      return
    }

    setChartLoading(true)
    setError('')

    try {
      const result = await fileService.generateChart(selectedFile, chartConfig)
      // Handle chart creation result
      console.log('Chart created:', result)
    } catch (error) {
      setError('Failed to create chart')
    } finally {
      setChartLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Visualization</h1>
        <p className="text-gray-600 mt-2">
          Create interactive charts from your uploaded Excel data.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* File Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Select File</h3>
            </div>
            <div className="p-6">
              {files.length > 0 ? (
                <div className="space-y-3">
                  {files.map((file) => (
                    <button
                      key={file._id}
                      onClick={() => handleFileSelect(file._id)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedFile === file._id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <FileSpreadsheet className="h-5 w-5 text-green-600 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {file.originalName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(file.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No files available</p>
                  <a
                    href="/upload"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Upload a file to get started
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chart Configuration */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Chart Configuration</h3>
            </div>
            <div className="p-6">
              {selectedFile && fileData ? (
                <div className="space-y-6">
                  {/* Axis Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        X-Axis (Categories)
                      </label>
                      <select
                        value={chartConfig.xAxis}
                        onChange={(e) => setChartConfig({ ...chartConfig, xAxis: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Select X-axis column</option>
                        {fileData.columns?.map((column) => (
                          <option key={column} value={column}>
                            {column}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Y-Axis (Values)
                      </label>
                      <select
                        value={chartConfig.yAxis}
                        onChange={(e) => setChartConfig({ ...chartConfig, yAxis: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Select Y-axis column</option>
                        {fileData.columns?.map((column) => (
                          <option key={column} value={column}>
                            {column}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Chart Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chart Type
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { value: 'bar', label: 'Bar Chart' },
                        { value: 'line', label: 'Line Chart' },
                        { value: 'pie', label: 'Pie Chart' },
                        { value: 'scatter', label: 'Scatter Plot' }
                      ].map((type) => (
                        <button
                          key={type.value}
                          onClick={() => setChartConfig({ ...chartConfig, chartType: type.value })}
                          className={`p-3 text-sm font-medium rounded-lg border transition-colors ${
                            chartConfig.chartType === type.value
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Data Preview */}
                  {fileData.preview && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Data Preview</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md">
                          <thead className="bg-gray-50">
                            <tr>
                              {fileData.columns?.slice(0, 5).map((column) => (
                                <th
                                  key={column}
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  {column}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {fileData.preview.slice(0, 3).map((row, index) => (
                              <tr key={index}>
                                {fileData.columns?.slice(0, 5).map((column) => (
                                  <td
                                    key={column}
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                  >
                                    {row[column]}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Create Chart Button */}
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={handleCreateChart}
                      disabled={!chartConfig.xAxis || !chartConfig.yAxis || chartLoading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {chartLoading ? (
                        <>
                          <div className="spinner mr-2"></div>
                          Creating Chart...
                        </>
                      ) : (
                        <>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Create Chart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a file to create charts
                  </h3>
                  <p className="text-gray-600">
                    Choose a file from the left panel to start creating visualizations.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics

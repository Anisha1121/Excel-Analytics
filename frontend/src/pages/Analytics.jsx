import { useState, useEffect } from 'react'
import { fileService } from '../services/fileService'
import { BarChart3, FileSpreadsheet, Download } from 'lucide-react'
import ChartDisplay from '../components/charts/ChartDisplay'

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
  const [generatedChart, setGeneratedChart] = useState(null)

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
      // Generate chart data from file data
      const chartData = generateChartData(fileData, chartConfig)
      console.log('Generated chart data:', { chartType: chartConfig.chartType, chartData })
      
      // For 3D charts, skip backend call and display directly
      if (['bar3d', 'scatter3d', 'surface3d'].includes(chartConfig.chartType)) {
        setGeneratedChart({
          data: chartData,
          config: chartConfig,
          analytics: { type: '3D Chart', created: new Date() }
        })
        console.log('3D Chart created:', { chartType: chartConfig.chartType, data: chartData })
      } else {
        // For 2D charts, call backend to save analytics record
        const result = await fileService.generateChart(selectedFile, chartConfig)
        
        // Set the generated chart for display
        setGeneratedChart({
          data: chartData,
          config: chartConfig,
          analytics: result.analytics
        })
        
        console.log('2D Chart created:', result)
      }
    } catch (error) {
      console.error('Chart creation error:', error)
      setError('Failed to create chart')
    } finally {
      setChartLoading(false)
    }
  }

  const generateChartData = (fileData, config) => {
    if (!fileData || !fileData.preview) return null

    const { xAxis, yAxis, chartType } = config
    const data = fileData.preview

    console.log('Generating chart data:', { xAxis, yAxis, chartType, dataLength: data.length })

    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
      '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
    ]

    if (chartType === 'scatter' || chartType === 'scatter3d') {
      // For scatter plots, show all data points with original row data
      const scatterData = data
        .filter(row => row[xAxis] && row[yAxis])
        .map((row, index) => {
          const result = {
            x: parseFloat(row[xAxis]) || 0,
            y: parseFloat(row[yAxis]) || 0
          };
          
          // For 3D scatter, try to find a third numeric column or use index
          if (chartType === 'scatter3d') {
            const allKeys = Object.keys(row);
            const numericKeys = allKeys.filter(key => 
              key !== xAxis && key !== yAxis && 
              !isNaN(parseFloat(row[key])) && 
              isFinite(row[key])
            );
            
            if (numericKeys.length > 0) {
              result.z = parseFloat(row[numericKeys[0]]) || 0;
            } else {
              result.z = index; // Use index as Z if no other numeric column
            }
          }
          
          return result;
        })
        .slice(0, 100) // Limit to 100 points for performance

      // Create labels from the actual data - try to find a meaningful identifier
      const labels = data
        .filter(row => row[xAxis] && row[yAxis])
        .slice(0, 100)
        .map((row, index) => {
          // Try to use common identifier columns first
          const possibleLabels = ['name', 'title', 'product', 'item', 'category', 'id', 'label'];
          for (const labelCol of possibleLabels) {
            if (row[labelCol]) {
              return String(row[labelCol]);
            }
          }
          
          // If no common identifier, use the first text column
          const textColumns = Object.keys(row).filter(key => 
            key !== xAxis && key !== yAxis && 
            row[key] && 
            typeof row[key] === 'string' && 
            row[key].trim() !== ''
          );
          
          if (textColumns.length > 0) {
            return String(row[textColumns[0]]);
          }
          
          // Last resort: use row index from Excel
          return `Row ${index + 1}`;
        });

      // Store original data for detailed tooltips
      const originalData = data
        .filter(row => row[xAxis] && row[yAxis])
        .slice(0, 100)
        .map((row, index) => ({
          ...row,
          label: labels[index],
          rowIndex: index + 1
        }));

      return {
        labels: labels,
        datasets: [
          {
            label: `${yAxis} vs ${xAxis}`,
            data: scatterData,
            backgroundColor: colors[0],
            borderColor: colors[0],
            pointRadius: 4,
          },
        ],
        originalData: originalData
      }
    }

    // For other chart types, group by categories
    const categoryData = {}
    
    data.forEach(row => {
      if (!row[xAxis] || !row[yAxis]) return
      
      const category = String(row[xAxis])
      const value = parseFloat(row[yAxis]) || 0
      
      if (!categoryData[category]) {
        categoryData[category] = []
      }
      categoryData[category].push(value)
    })

    // Limit categories for readability
    const categories = Object.keys(categoryData).slice(0, 20)
    
    if (chartType === 'pie') {
      // For pie charts, sum values for each category
      const pieValues = categories.map(category => 
        categoryData[category].reduce((sum, val) => sum + val, 0)
      )

      return {
        labels: categories,
        datasets: [
          {
            label: yAxis,
            data: pieValues,
            backgroundColor: colors.slice(0, categories.length),
            borderColor: colors.slice(0, categories.length),
            borderWidth: 2,
          },
        ],
      }
    }

    // For 3D charts, use the same data structure as 2D but with type identifier
    if (['bar3d', 'surface3d'].includes(chartType)) {
      const chartValues = categories.map(category => 
        categoryData[category].reduce((sum, val) => sum + val, 0)
      )

      return {
        labels: categories,
        datasets: [
          {
            label: `Total ${yAxis}`,
            data: chartValues,
            backgroundColor: colors.slice(0, categories.length),
            borderColor: colors.slice(0, categories.length),
            borderWidth: 1,
          },
        ],
      }
    }

    // For bar and line charts
    let chartValues
    if (chartType === 'line') {
      // For line charts, use average values
      chartValues = categories.map(category => {
        const values = categoryData[category]
        return values.reduce((sum, val) => sum + val, 0) / values.length
      })
    } else {
      // For bar charts, use sum of values
      chartValues = categories.map(category => 
        categoryData[category].reduce((sum, val) => sum + val, 0)
      )
    }

    return {
      labels: categories,
      datasets: [
        {
          label: chartType === 'line' ? `Average ${yAxis}` : `Total ${yAxis}`,
          data: chartValues,
          backgroundColor: chartType === 'line' ? 'transparent' : chartType === 'bar' ? colors.slice(0, categories.length) : colors[0],
          borderColor: chartType === 'line' ? colors[0] : chartType === 'bar' ? colors.slice(0, categories.length) : colors[0],
          borderWidth: chartType === 'line' ? 3 : 1,
          fill: chartType === 'line' ? false : true,
          tension: chartType === 'line' ? 0.1 : 0,
          pointBackgroundColor: chartType === 'line' ? colors[0] : undefined,
          pointBorderColor: chartType === 'line' ? colors[0] : undefined,
          pointRadius: chartType === 'line' ? 4 : 0,
        },
      ],
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
                    
                    {/* 2D Charts */}
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-600 mb-2">2D Charts</h5>
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

                    {/* 3D Charts */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-2">3D Charts</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                          { value: 'bar3d', label: '3D Bar Chart' },
                          { value: 'scatter3d', label: '3D Scatter Plot' },
                          { value: 'surface3d', label: '3D Surface' }
                        ].map((type) => (
                          <button
                            key={type.value}
                            onClick={() => setChartConfig({ ...chartConfig, chartType: type.value })}
                            className={`p-3 text-sm font-medium rounded-lg border transition-colors ${
                              chartConfig.chartType === type.value
                                ? 'border-purple-500 bg-purple-50 text-purple-700'
                                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <span className="block">{type.label}</span>
                            <span className="text-xs text-gray-500">Interactive 3D</span>
                          </button>
                        ))}
                      </div>
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

      {/* Generated Chart Display */}
      {generatedChart && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Generated Chart</h2>
          <ChartDisplay 
            chartData={generatedChart.data} 
            chartConfig={generatedChart.config} 
            fileId={selectedFile}
          />
        </div>
      )}
    </div>
  )
}

export default Analytics

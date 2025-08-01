import { useState, useEffect } from 'react'
import { fileService } from '../services/fileService'
import { BarChart3, FileSpreadsheet, Download, Brain, ChevronDown, ChevronUp, Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react'
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
  const [showAIReport, setShowAIReport] = useState(false)

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
      
      // Generate AI analysis
      const aiAnalysis = generateAIAnalysis(chartData, chartConfig, fileData)
      console.log('Generated AI analysis:', aiAnalysis)
      
      // For 3D charts, skip backend call and display directly
      if (['bar3d', 'scatter3d', 'surface3d'].includes(chartConfig.chartType)) {
        setGeneratedChart({
          data: chartData,
          config: chartConfig,
          analytics: { type: '3D Chart', created: new Date() },
          aiAnalysis: aiAnalysis
        })
        setShowAIReport(true) // Auto-show AI report when chart is generated
        console.log('3D Chart created:', { chartType: chartConfig.chartType, data: chartData })
      } else {
        // For 2D charts, call backend to save analytics record
        const result = await fileService.generateChart(selectedFile, chartConfig)
        
        // Set the generated chart for display
        setGeneratedChart({
          data: chartData,
          config: chartConfig,
          analytics: result.analytics,
          aiAnalysis: aiAnalysis
        })
        setShowAIReport(true) // Auto-show AI report when chart is generated
        
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
      '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16',
      '#F472B6', '#22D3EE', '#FB7185', '#34D399', '#FBBF24',
      '#A78BFA', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
      '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE'
    ]

    // Extended vibrant colors for multi-dataset charts
    const vibrantColors = [
      '#FF6B35', '#F7931E', '#FFD23F', '#06FFA5', '#118AB2',
      '#073B4C', '#E63946', '#F77F00', '#FCBF49', '#06D6A0',
      '#8338EC', '#FB5607', '#FFBE0B', '#8ECAE6', '#219EBC',
      '#023047', '#FF006E', '#FB8500', '#FFB700', '#028090'
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
            backgroundColor: vibrantColors[0],
            borderColor: vibrantColors[0],
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBorderWidth: 2,
            pointBorderColor: '#ffffff',
            pointHoverBorderColor: '#ffffff',
            pointHoverBorderWidth: 3,
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
          backgroundColor: chartType === 'line' ? 'transparent' : chartType === 'bar' ? vibrantColors.slice(0, categories.length) : vibrantColors[0],
          borderColor: chartType === 'line' ? vibrantColors[0] : chartType === 'bar' ? vibrantColors.slice(0, categories.length) : vibrantColors[0],
          borderWidth: chartType === 'line' ? 4 : 1,
          fill: chartType === 'line' ? false : true,
          tension: chartType === 'line' ? 0.4 : 0,
          pointBackgroundColor: chartType === 'line' ? vibrantColors[0] : undefined,
          pointBorderColor: chartType === 'line' ? '#ffffff' : undefined,
          pointBorderWidth: chartType === 'line' ? 2 : 0,
          pointRadius: chartType === 'line' ? 6 : 0,
          pointHoverRadius: chartType === 'line' ? 8 : 0,
          pointHoverBorderWidth: chartType === 'line' ? 3 : 0,
          gradient: chartType === 'line' ? true : false,
        },
      ],
    }
  }

  // AI Analysis Function
  const generateAIAnalysis = (chartData, chartConfig, fileData) => {
    if (!chartData || !chartConfig) return null

    const { xAxis, yAxis, chartType } = chartConfig
    const data = chartData.datasets?.[0]?.data || []
    const labels = chartData.labels || []
    
    let analysis = {
      summary: '',
      insights: [],
      recommendations: [],
      keyFindings: []
    }

    try {
      // Calculate basic statistics
      const values = Array.isArray(data) ? data.map(d => typeof d === 'object' ? d.y || d.value || 0 : d) : []
      const numericValues = values.filter(v => typeof v === 'number' && !isNaN(v))
      
      if (numericValues.length === 0) {
        return {
          summary: 'Unable to generate analysis due to insufficient numeric data.',
          insights: ['Please ensure your data contains valid numeric values for analysis.'],
          recommendations: ['Check data quality and try again.'],
          keyFindings: []
        }
      }

      const total = numericValues.reduce((sum, val) => sum + val, 0)
      const average = total / numericValues.length
      const max = Math.max(...numericValues)
      const min = Math.min(...numericValues)
      const range = max - min
      
      // Find highest and lowest performers
      const maxIndex = values.indexOf(max)
      const minIndex = values.indexOf(min)
      const maxLabel = labels[maxIndex] || `Item ${maxIndex + 1}`
      const minLabel = labels[minIndex] || `Item ${minIndex + 1}`

      // Generate analysis based on chart type
      switch (chartType) {
        case 'bar':
        case 'bar3d':
          analysis.summary = `This bar chart shows the distribution of ${yAxis} across different ${xAxis} categories. The data reveals significant variations with ${maxLabel} leading at ${max.toLocaleString()} and ${minLabel} showing the lowest value at ${min.toLocaleString()}.`
          
          analysis.insights = [
            `📊 Total ${yAxis}: ${total.toLocaleString()}`,
            `📈 Highest performer: ${maxLabel} (${max.toLocaleString()})`,
            `📉 Lowest performer: ${minLabel} (${min.toLocaleString()})`,
            `📊 Average ${yAxis}: ${average.toFixed(2)}`,
            `📏 Range: ${range.toLocaleString()} (${((range/average)*100).toFixed(1)}% of average)`
          ]

          if (max > average * 2) {
            analysis.keyFindings.push(`🎯 ${maxLabel} significantly outperforms others, being ${(max/average).toFixed(1)}x above average`)
          }
          
          if (min < average * 0.5) {
            analysis.keyFindings.push(`⚠️ ${minLabel} underperforms significantly, being ${((average-min)/average*100).toFixed(1)}% below average`)
          }

          const aboveAverage = numericValues.filter(v => v > average).length
          analysis.keyFindings.push(`📊 ${aboveAverage} out of ${numericValues.length} categories (${((aboveAverage/numericValues.length)*100).toFixed(1)}%) perform above average`)

          analysis.recommendations = [
            `Focus on replicating ${maxLabel}'s success factors across other categories`,
            `Investigate why ${minLabel} is underperforming and develop improvement strategies`,
            `Consider resource reallocation from lower to higher performing categories`
          ]
          break

        case 'line':
          analysis.summary = `This line chart tracks ${yAxis} trends over ${xAxis}. The data shows ${average > values[0] ? 'an overall upward' : 'a declining'} trend with an average value of ${average.toFixed(2)}.`
          
          // Calculate trend
          const firstHalf = values.slice(0, Math.floor(values.length/2))
          const secondHalf = values.slice(Math.floor(values.length/2))
          const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length
          const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length
          const trendDirection = secondAvg > firstAvg ? 'upward' : 'downward'
          const trendStrength = Math.abs(((secondAvg - firstAvg) / firstAvg) * 100)

          analysis.insights = [
            `📈 Trend direction: ${trendDirection} (${trendStrength.toFixed(1)}% change)`,
            `🎯 Peak value: ${max.toLocaleString()} at ${maxLabel}`,
            `📉 Lowest point: ${min.toLocaleString()} at ${minLabel}`,
            `📊 Overall average: ${average.toFixed(2)}`,
            `📏 Volatility range: ${range.toLocaleString()}`
          ]

          analysis.keyFindings.push(`📊 The data shows a ${trendDirection} trend with ${trendStrength.toFixed(1)}% change from first to second half`)
          
          if (trendStrength > 20) {
            analysis.keyFindings.push(`🚀 Strong ${trendDirection} momentum detected - ${trendStrength.toFixed(1)}% change indicates significant growth pattern`)
          }

          analysis.recommendations = [
            trendDirection === 'upward' ? 'Capitalize on the positive trend by maintaining current strategies' : 'Investigate causes of decline and implement corrective measures',
            `Monitor closely around ${maxLabel} period to understand peak performance factors`,
            'Consider smoothing out volatility through strategic planning'
          ]
          break

        case 'pie':
          const percentages = values.map(v => (v / total) * 100)
          const dominantIndex = percentages.indexOf(Math.max(...percentages))
          const dominantLabel = labels[dominantIndex]
          const dominantPercent = percentages[dominantIndex]

          analysis.summary = `This pie chart shows the composition of ${yAxis} across ${xAxis} categories. ${dominantLabel} dominates with ${dominantPercent.toFixed(1)}% of the total.`
          
          analysis.insights = [
            `🥧 Total ${yAxis}: ${total.toLocaleString()}`,
            `👑 Largest segment: ${dominantLabel} (${dominantPercent.toFixed(1)}%)`,
            `📊 Smallest segment: ${minLabel} (${((min/total)*100).toFixed(1)}%)`,
            `⚖️ Distribution: ${percentages.filter(p => p > 10).length} major segments (>10%)`,
            `📈 Top 3 segments account for ${percentages.sort((a,b) => b-a).slice(0,3).reduce((sum,p) => sum+p, 0).toFixed(1)}% of total`
          ]

          if (dominantPercent > 50) {
            analysis.keyFindings.push(`🎯 ${dominantLabel} represents majority share at ${dominantPercent.toFixed(1)}%`)
          }

          const balancedDistribution = percentages.filter(p => p >= 10 && p <= 30).length
          if (balancedDistribution >= 3) {
            analysis.keyFindings.push(`⚖️ Well-balanced distribution with ${balancedDistribution} segments between 10-30%`)
          }

          analysis.recommendations = [
            dominantPercent > 60 ? `Consider diversifying to reduce dependency on ${dominantLabel}` : 'Current distribution shows healthy diversity',
            `Evaluate if ${minLabel}'s small share (${((min/total)*100).toFixed(1)}%) is optimal or needs improvement`,
            'Monitor segment performance to maintain balanced growth'
          ]
          break

        case 'scatter':
        case 'scatter3d':
          // For scatter plots, analyze correlation
          const xValues = data.map(d => d.x || 0)
          const yValues = data.map(d => d.y || 0)
          
          // Simple correlation calculation
          const n = Math.min(xValues.length, yValues.length)
          const sumX = xValues.reduce((sum, val) => sum + val, 0)
          const sumY = yValues.reduce((sum, val) => sum + val, 0)
          const sumXY = xValues.reduce((sum, val, i) => sum + val * yValues[i], 0)
          const sumXX = xValues.reduce((sum, val) => sum + val * val, 0)
          const sumYY = yValues.reduce((sum, val) => sum + val * val, 0)
          
          const correlation = (n * sumXY - sumX * sumY) / Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY))
          const correlationStrength = Math.abs(correlation)
          const correlationType = correlation > 0 ? 'positive' : 'negative'

          analysis.summary = `This scatter plot reveals ${correlationStrength > 0.7 ? 'a strong' : correlationStrength > 0.4 ? 'a moderate' : 'a weak'} ${correlationType} correlation (${correlation.toFixed(3)}) between ${xAxis} and ${yAxis}.`
          
          analysis.insights = [
            `🔗 Correlation coefficient: ${correlation.toFixed(3)}`,
            `📊 Relationship strength: ${correlationStrength > 0.7 ? 'Strong' : correlationStrength > 0.4 ? 'Moderate' : 'Weak'}`,
            `📈 Direction: ${correlationType} relationship`,
            `📍 Data points analyzed: ${n}`,
            `🎯 ${xAxis} range: ${Math.min(...xValues).toFixed(2)} to ${Math.max(...xValues).toFixed(2)}`
          ]

          if (correlationStrength > 0.7) {
            analysis.keyFindings.push(`🎯 Strong ${correlationType} correlation suggests ${xAxis} is a reliable predictor of ${yAxis}`)
          } else if (correlationStrength < 0.2) {
            analysis.keyFindings.push(`❓ Weak correlation indicates ${xAxis} and ${yAxis} may be largely independent`)
          }

          analysis.recommendations = [
            correlationStrength > 0.5 ? `Leverage the ${correlationType} relationship between ${xAxis} and ${yAxis} for predictions` : `Look for other factors that might influence ${yAxis}`,
            'Consider additional variables that might strengthen the relationship',
            'Investigate outliers that might be affecting the correlation'
          ]
          break

        case 'surface3d':
          analysis.summary = `This 3D surface visualization shows the complex relationship between ${xAxis}, ${yAxis}, and the surface height values.`
          
          analysis.insights = [
            `🏔️ 3D surface shows multi-dimensional relationships`,
            `📊 Height range: ${min.toFixed(2)} to ${max.toFixed(2)}`,
            `🎯 Peak elevation at: ${maxLabel}`,
            `📉 Valley at: ${minLabel}`,
            `📈 Average elevation: ${average.toFixed(2)}`
          ]

          analysis.keyFindings.push(`🏞️ 3D visualization reveals complex patterns not visible in 2D charts`)
          
          analysis.recommendations = [
            'Explore different viewing angles to understand the surface topology',
            'Identify peaks and valleys for strategic decision making',
            'Consider creating 2D slices for detailed analysis of specific regions'
          ]
          break

        default:
          analysis.summary = `This ${chartType} visualization displays ${yAxis} data across ${xAxis} categories.`
          analysis.insights = [`📊 Data points: ${numericValues.length}`, `📈 Range: ${min.toFixed(2)} to ${max.toFixed(2)}`]
      }

      // Add data quality insights
      const dataQuality = (numericValues.length / (fileData?.preview?.length || 1)) * 100
      if (dataQuality < 80) {
        analysis.keyFindings.push(`⚠️ Data quality note: ${dataQuality.toFixed(1)}% of records contain valid numeric values`)
      }

    } catch (error) {
      console.error('Error generating AI analysis:', error)
      return {
        summary: 'Analysis could not be completed due to data processing error.',
        insights: ['Please check your data format and try again.'],
        recommendations: ['Ensure data contains valid numeric values.'],
        keyFindings: []
      }
    }

    return analysis
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
            Analytics & Visualization
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Transform your Excel data into stunning interactive charts and gain powerful insights with our advanced visualization tools.
          </p>
          <div className="flex items-center justify-center space-x-6 mt-6">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Real-time Processing</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Interactive 3D Charts</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Export Ready</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 rounded-r-lg shadow-md">
            <div className="flex items-center p-4">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Enhanced File Selection */}
          <div className="xl:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden sticky top-8">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <FileSpreadsheet className="h-5 w-5 mr-2" />
                  Select Data File
                </h3>
                <p className="text-blue-100 text-sm mt-1">Choose your Excel file to visualize</p>
              </div>
              <div className="p-6">
                {files.length > 0 ? (
                  <div className="space-y-3">
                    {files.map((file) => (
                      <button
                        key={file._id}
                        onClick={() => handleFileSelect(file._id)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-[1.02] ${
                          selectedFile === file._id
                            ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start">
                          <div className={`p-2 rounded-lg mr-3 ${
                            selectedFile === file._id ? 'bg-blue-100' : 'bg-green-100'
                          }`}>
                            <FileSpreadsheet className={`h-5 w-5 ${
                              selectedFile === file._id ? 'text-blue-600' : 'text-green-600'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.originalName}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Uploaded: {new Date(file.uploadDate).toLocaleDateString()}
                            </p>
                            {selectedFile === file._id && (
                              <div className="mt-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Active
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FileSpreadsheet className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-3">No files available</p>
                    <a
                      href="/upload"
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                    >
                      Upload File
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Chart Configuration */}
          <div className="xl:col-span-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Chart Configuration
                </h3>
                <p className="text-purple-100 text-sm mt-1">Configure your visualization settings</p>
              </div>
              <div className="p-8 space-y-8">
                {selectedFile && fileData ? (
                  <div className="space-y-10">
                    {/* Enhanced Axis Selection */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                          <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                          X-Axis (Categories)
                        </label>
                        <select
                          value={chartConfig.xAxis}
                          onChange={(e) => setChartConfig({ ...chartConfig, xAxis: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50"
                        >
                          <option value="">Select X-axis column</option>
                          {fileData.columns?.map((column) => (
                            <option key={column} value={column}>
                              {column}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                          <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                          Y-Axis (Values)
                        </label>
                        <select
                          value={chartConfig.yAxis}
                          onChange={(e) => setChartConfig({ ...chartConfig, yAxis: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50"
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

                    {/* Enhanced Chart Type Selection */}
                    <div className="space-y-8">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3"></div>
                        Choose Visualization Type
                      </h4>
                      
                      {/* 2D Charts */}
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                        <h5 className="text-md font-semibold text-blue-900 mb-4 flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                          2D Charts - Classic Visualizations
                        </h5>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          {[
                            { value: 'bar', label: 'Bar Chart', icon: '📊', desc: 'Compare categories' },
                            { value: 'line', label: 'Line Chart', icon: '📈', desc: 'Show trends' },
                            { value: 'pie', label: 'Pie Chart', icon: '🥧', desc: 'Show proportions' },
                            { value: 'scatter', label: 'Scatter Plot', icon: '🔵', desc: 'Find correlations' }
                          ].map((type) => (
                            <button
                              key={type.value}
                              onClick={() => setChartConfig({ ...chartConfig, chartType: type.value })}
                              className={`group p-4 text-center rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                                chartConfig.chartType === type.value
                                  ? 'border-blue-500 bg-blue-100 shadow-lg scale-105'
                                  : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                              }`}
                            >
                              <div className="text-2xl mb-2">{type.icon}</div>
                              <div className="text-sm font-semibold text-gray-900 mb-1">{type.label}</div>
                              <div className="text-xs text-gray-600">{type.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 3D Charts */}
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                        <h5 className="text-md font-semibold text-purple-900 mb-4 flex items-center">
                          <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                          3D Charts - Interactive Experiences
                        </h5>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          {[
                            { value: 'bar3d', label: '3D Bar Chart', icon: '🏗️', desc: 'Interactive 3D bars' },
                            { value: 'scatter3d', label: '3D Scatter Plot', icon: '🌌', desc: 'Multi-dimensional data' },
                            { value: 'surface3d', label: '3D Surface', icon: '🏔️', desc: 'Complex relationships' }
                          ].map((type) => (
                            <button
                              key={type.value}
                              onClick={() => setChartConfig({ ...chartConfig, chartType: type.value })}
                              className={`group p-4 text-center rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                                chartConfig.chartType === type.value
                                  ? 'border-purple-500 bg-purple-100 shadow-lg scale-105'
                                  : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50'
                              }`}
                            >
                              <div className="text-2xl mb-2">{type.icon}</div>
                              <div className="text-sm font-semibold text-gray-900 mb-1">{type.label}</div>
                              <div className="text-xs text-gray-600">{type.desc}</div>
                              <div className="text-xs text-purple-600 font-medium mt-1">Interactive</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Data Preview with Dark Theme */}
                    {fileData.preview && (
                      <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-xl">
                        <h4 className="text-md font-semibold text-white mb-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-teal-400 rounded-lg mr-3"></div>
                            Data Preview
                          </div>
                          <div className="text-sm text-gray-300 bg-gray-800/80 px-3 py-1 rounded-full border border-gray-600">
                            {fileData.preview.length} rows × {fileData.columns?.length} columns
                          </div>
                        </h4>
                        <div className="overflow-auto max-h-96 border-2 border-gray-600/50 rounded-xl bg-gray-800/50 backdrop-blur-sm shadow-inner">
                          <table className="min-w-full divide-y divide-gray-600">
                            <thead className="bg-gray-800/80 backdrop-blur-sm sticky top-0">
                              <tr>
                                {fileData.columns?.map((column, index) => (
                                  <th
                                    key={column}
                                    className="px-6 py-4 text-left text-xs font-bold text-gray-200 uppercase tracking-wider border-r border-gray-600/50 last:border-r-0"
                                  >
                                    <div className="flex items-center">
                                      <div className={`w-2 h-2 rounded-full mr-2 ${
                                        index % 6 === 0 ? 'bg-blue-400' :
                                        index % 6 === 1 ? 'bg-green-400' :
                                        index % 6 === 2 ? 'bg-purple-400' :
                                        index % 6 === 3 ? 'bg-pink-400' :
                                        index % 6 === 4 ? 'bg-yellow-400' : 'bg-red-400'
                                      }`}></div>
                                      {column}
                                    </div>
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="bg-gray-800/30 backdrop-blur-sm divide-y divide-gray-600/30">
                              {fileData.preview.map((row, index) => (
                                <tr key={index} className={`transition-colors hover:bg-gray-700/50 ${
                                  index % 2 === 0 ? 'bg-gray-800/20' : 'bg-gray-700/20'
                                }`}>
                                  {fileData.columns?.map((column) => (
                                    <td
                                      key={column}
                                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-200 border-r border-gray-600/30 last:border-r-0"
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

                    {/* Enhanced Create Chart Button */}
                    <div className="flex justify-center">
                      <button
                        onClick={handleCreateChart}
                        disabled={!chartConfig.xAxis || !chartConfig.yAxis || chartLoading}
                        className="group inline-flex items-center px-8 py-4 border-2 border-transparent text-lg font-semibold rounded-2xl text-white bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-105 shadow-xl"
                      >
                        {chartLoading ? (
                          <>
                            <div className="animate-spin h-5 w-5 mr-3">
                              <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"></circle>
                                <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" opacity="0.75"></path>
                              </svg>
                            </div>
                            Creating Chart...
                          </>
                        ) : (
                          <>
                            <BarChart3 className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                            Create Visualization
                            <div className="ml-2 opacity-75">✨</div>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <BarChart3 className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Ready to Create Amazing Visualizations?
                    </h3>
                    <p className="text-gray-600 max-w-sm mx-auto">
                      Select a file from the panel to start creating beautiful, interactive charts from your data.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Generated Chart Display */}
        {generatedChart && (
          <div className="mt-16 space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
                Your Visualization is Ready! 🎉
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Interact with your chart below. You can zoom, pan, and explore your data in new ways.
              </p>
            </div>
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 border-b border-gray-700/50">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
                  {chartConfig.chartType?.includes('3d') ? '3D Interactive Chart' : '2D Chart Visualization'}
                </h3>
                <p className="text-gray-300 text-sm mt-1">
                  {chartConfig.xAxis} vs {chartConfig.yAxis} • {chartConfig.chartType.toUpperCase()}
                </p>
              </div>
              <div className="p-6 bg-gray-800/30 backdrop-blur-sm">
                <ChartDisplay 
                  chartData={generatedChart.data} 
                  chartConfig={generatedChart.config} 
                  fileId={selectedFile}
                />
              </div>
            </div>

            {/* AI Analysis Report */}
            {generatedChart.aiAnalysis && (
              <div className="bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-pink-900/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-indigo-700/50 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-800 via-purple-800 to-pink-800 p-6 border-b border-indigo-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Brain className="h-6 w-6 mr-3 text-indigo-300" />
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          AI Analysis Report
                        </h3>
                        <p className="text-indigo-200 text-sm mt-1">
                          Intelligent insights and recommendations from your data
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAIReport(!showAIReport)}
                      className="flex items-center px-4 py-2 bg-indigo-700/50 hover:bg-indigo-600/50 text-white text-sm font-medium rounded-lg transition-all duration-200 border border-indigo-600/50"
                    >
                      {showAIReport ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-2" />
                          Hide Report
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-2" />
                          View Report
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {showAIReport && (
                  <div className="p-8 space-y-8">
                    {/* Summary Section */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center mr-3">
                          <TrendingUp className="h-4 w-4 text-white" />
                        </div>
                        <h4 className="text-lg font-semibold text-white">Executive Summary</h4>
                      </div>
                      <p className="text-gray-200 leading-relaxed text-base">
                        {generatedChart.aiAnalysis.summary}
                      </p>
                    </div>

                    {/* Key Insights */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                        <div className="flex items-center mb-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg flex items-center justify-center mr-3">
                            <BarChart3 className="h-4 w-4 text-white" />
                          </div>
                          <h4 className="text-lg font-semibold text-white">Key Insights</h4>
                        </div>
                        <div className="space-y-3">
                          {generatedChart.aiAnalysis.insights.map((insight, index) => (
                            <div key={index} className="flex items-start">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <p className="text-gray-200 text-sm">{insight}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                        <div className="flex items-center mb-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg flex items-center justify-center mr-3">
                            <Lightbulb className="h-4 w-4 text-white" />
                          </div>
                          <h4 className="text-lg font-semibold text-white">Recommendations</h4>
                        </div>
                        <div className="space-y-3">
                          {generatedChart.aiAnalysis.recommendations.map((recommendation, index) => (
                            <div key={index} className="flex items-start">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <p className="text-gray-200 text-sm">{recommendation}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Key Findings */}
                    {generatedChart.aiAnalysis.keyFindings.length > 0 && (
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                        <div className="flex items-center mb-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-pink-400 rounded-lg flex items-center justify-center mr-3">
                            <AlertTriangle className="h-4 w-4 text-white" />
                          </div>
                          <h4 className="text-lg font-semibold text-white">Key Findings</h4>
                        </div>
                        <div className="space-y-3">
                          {generatedChart.aiAnalysis.keyFindings.map((finding, index) => (
                            <div key={index} className="flex items-start">
                              <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <p className="text-gray-200 text-sm">{finding}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Report Footer */}
                    <div className="text-center pt-6 border-t border-white/20">
                      <p className="text-gray-300 text-sm">
                        📊 AI Analysis generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        This analysis is based on the current dataset and may vary with different data
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Analytics

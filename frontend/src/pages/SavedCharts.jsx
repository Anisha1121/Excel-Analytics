import { useState, useEffect } from 'react'
import { fileService } from '../services/fileService'
import ChartDisplay from '../components/charts/ChartDisplay'
import { BarChart3, Calendar, FileText, Trash2, Eye } from 'lucide-react'

const SavedCharts = () => {
  const [savedCharts, setSavedCharts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedChart, setSelectedChart] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'detail'

  useEffect(() => {
    fetchSavedCharts()
  }, [])

  const fetchSavedCharts = async () => {
    try {
      setLoading(true)
      const result = await fileService.getSavedCharts()
      setSavedCharts(result.data.analytics || [])
    } catch (error) {
      setError(error.message || 'Failed to load saved charts')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getChartTypeIcon = (chartType) => {
    switch (chartType) {
      case 'bar':
      case 'bar3d':
        return <BarChart3 className="h-5 w-5" />
      default:
        return <BarChart3 className="h-5 w-5" />
    }
  }

  const getChartTypeColor = (chartType) => {
    switch (chartType) {
      case 'bar':
        return 'bg-blue-100 text-blue-800'
      case 'bar3d':
        return 'bg-purple-100 text-purple-800'
      case 'line':
        return 'bg-green-100 text-green-800'
      case 'pie':
        return 'bg-orange-100 text-orange-800'
      case 'scatter':
        return 'bg-red-100 text-red-800'
      case 'scatter3d':
        return 'bg-pink-100 text-pink-800'
      case 'surface3d':
        return 'bg-indigo-100 text-indigo-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading saved charts...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <BarChart3 className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Charts</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchSavedCharts}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (viewMode === 'detail' && selectedChart) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <button
              onClick={() => {
                setViewMode('grid')
                setSelectedChart(null)
              }}
              className="flex items-center text-primary-600 hover:text-primary-700 mb-4"
            >
              ← Back to Saved Charts
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{selectedChart.title}</h1>
            <p className="text-gray-600 mt-2">{selectedChart.description}</p>
            <div className="flex items-center mt-4 space-x-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getChartTypeColor(selectedChart.chartType)}`}>
                {getChartTypeIcon(selectedChart.chartType)}
                <span className="ml-1">{selectedChart.chartType.toUpperCase()}</span>
              </span>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(selectedChart.createdAt)}
              </div>
              {selectedChart.fileId && (
                <div className="flex items-center text-sm text-gray-500">
                  <FileText className="h-4 w-4 mr-1" />
                  {selectedChart.fileId.originalName || 'Unknown File'}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <ChartDisplay 
              chartData={selectedChart.chartConfig.chartData}
              chartConfig={selectedChart.chartConfig}
              fileId={selectedChart.fileId?._id}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Saved Charts</h1>
          <p className="text-gray-600 mt-2">
            View and manage your saved chart visualizations
          </p>
        </div>

        {savedCharts.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Saved Charts</h3>
            <p className="text-gray-600 mb-6">
              Create and save charts from the Analytics page to see them here.
            </p>
            <a
              href="/analytics"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Go to Analytics
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedCharts.map((chart) => (
              <div
                key={chart._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {chart.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {chart.description || 'No description'}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getChartTypeColor(chart.chartType)}`}>
                      {getChartTypeIcon(chart.chartType)}
                      <span className="ml-1">{chart.chartType.toUpperCase()}</span>
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(chart.createdAt)}
                      </div>
                      {chart.fileId && (
                        <div className="flex items-center mt-1">
                          <FileText className="h-4 w-4 mr-1" />
                          {chart.fileId.originalName || 'Unknown File'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">X:</span> {chart.xAxis} • 
                      <span className="font-medium ml-1">Y:</span> {chart.yAxis}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedChart(chart)
                        setViewMode('detail')
                      }}
                      className="flex items-center px-3 py-1 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {savedCharts.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Showing {savedCharts.length} saved chart{savedCharts.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SavedCharts

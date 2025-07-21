import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { fileService } from '../services/fileService'
import { BarChart3, Upload, FileSpreadsheet, TrendingUp } from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalCharts: 0,
    recentUploads: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filesData = await fileService.getFiles()
        setFiles(filesData.files || [])
        
        // Calculate stats
        const totalFiles = filesData.files?.length || 0
        const recentUploads = filesData.files?.filter(file => {
          const uploadDate = new Date(file.uploadDate)
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          return uploadDate > weekAgo
        }).length || 0

        setStats({
          totalFiles,
          totalCharts: 0, // Will be calculated from analytics data
          recentUploads
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's an overview of your Excel analytics activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <FileSpreadsheet className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Files</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalFiles}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Charts Created</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalCharts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recent Uploads</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.recentUploads}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Files */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Files</h3>
          </div>
          <div className="p-6">
            {files.length > 0 ? (
              <div className="space-y-4">
                {files.slice(0, 5).map((file) => (
                  <div key={file._id} className="flex items-center justify-between">
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
                    <span className="text-xs text-gray-400">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No files uploaded yet</p>
                <p className="text-sm text-gray-400">Upload your first Excel file to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <a
                href="/upload"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Upload className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Upload Excel File</p>
                  <p className="text-xs text-gray-500">Upload and analyze your data</p>
                </div>
              </a>

              <a
                href="/analytics"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-green-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Create Charts</p>
                  <p className="text-xs text-gray-500">Generate visualizations from your data</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

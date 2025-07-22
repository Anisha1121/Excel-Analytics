import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { fileService } from '../services/fileService'
import { BarChart3, Upload, FileSpreadsheet, TrendingUp, Activity, Star, Zap } from 'lucide-react'

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
          totalCharts: totalFiles * 2, // Estimate 2 charts per file
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
      <div className="flex flex-col justify-center items-center min-h-96">
        <div className="spinner mb-4"></div>
        <p className="text-gray-600 animate-pulse">Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Beautiful Welcome Section */}
      <div className="page-header fade-in-up">
        <h1 className="page-title">
          Welcome back, {user?.username}! 🎉
        </h1>
        <p className="page-subtitle">
          Transform your Excel data into stunning visualizations and unlock powerful insights 
          with our advanced analytics platform.
        </p>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="stats-card group">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                <FileSpreadsheet className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Files</p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {stats.totalFiles}
                </p>
              </div>
            </div>
            <div className="text-blue-500 opacity-20 group-hover:opacity-40 transition-opacity">
              <Activity className="h-12 w-12" />
            </div>
          </div>
        </div>

        <div className="stats-card group">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
                <BarChart3 className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Charts Created</p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                  {stats.totalCharts}
                </p>
              </div>
            </div>
            <div className="text-green-500 opacity-20 group-hover:opacity-40 transition-opacity">
              <Star className="h-12 w-12" />
            </div>
          </div>
        </div>

        <div className="stats-card group">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
                <TrendingUp className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Recent Activity</p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                  {stats.recentUploads}
                </p>
              </div>
            </div>
            <div className="text-purple-500 opacity-20 group-hover:opacity-40 transition-opacity">
              <Zap className="h-12 w-12" />
            </div>
          </div>
      </div>

      {/* Modern Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Files Card */}
        <div className="modern-card">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <FileSpreadsheet className="h-6 w-6 text-blue-500 mr-2" />
              Recent Files
            </h3>
          </div>
          <div className="p-6">
            {files.length > 0 ? (
              <div className="space-y-4">
                {files.slice(0, 5).map((file, index) => (
                  <div key={file._id} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors fade-in-up" 
                       style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-green-100">
                        <FileSpreadsheet className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {file.originalName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(file.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-blue-600">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6">
                  <FileSpreadsheet className="h-12 w-12 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No files uploaded yet</h4>
                <p className="text-gray-500 mb-6">Upload your first Excel file to get started with analytics</p>
                <a href="/upload" className="btn-primary">
                  <Upload className="h-4 w-4" />
                  Upload File
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="modern-card">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <Zap className="h-6 w-6 text-purple-500 mr-2" />
              Quick Actions
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <a
              href="/upload"
              className="group flex items-center p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-300"
            >
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl group-hover:scale-110 transition-transform">
                <Upload className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="font-semibold text-gray-900 group-hover:text-blue-600">Upload Excel File</p>
                <p className="text-sm text-gray-500">Start analyzing your data</p>
              </div>
            </a>

            <a
              href="/analytics"
              className="group flex items-center p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50/50 transition-all duration-300"
            >
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl group-hover:scale-110 transition-transform">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="font-semibold text-gray-900 group-hover:text-green-600">Create Visualizations</p>
                <p className="text-sm text-gray-500">Build charts and graphs</p>
              </div>
            </a>

            <a
              href="/analytics"
              className="group flex items-center p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all duration-300"
            >
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="font-semibold text-gray-900 group-hover:text-purple-600">View Analytics</p>
                <p className="text-sm text-gray-500">Explore data insights</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
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

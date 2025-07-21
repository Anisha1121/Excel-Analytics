import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { fileService } from '../services/fileService'
import { Upload as UploadIcon, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react'

const Upload = () => {
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)
  const [error, setError] = useState('')

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

    // Validate file type
    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload only Excel files (.xls or .xlsx)')
      return
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }

    setUploading(true)
    setError('')
    setUploadResult(null)

    try {
      const result = await fileService.uploadFile(file)
      setUploadResult(result)
    } catch (error) {
      setError(error.message)
    } finally {
      setUploading(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false
  })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Upload Excel File</h1>
        <p className="text-gray-600 mt-2">
          Upload your Excel file to start analyzing and creating visualizations.
        </p>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-lg shadow p-8">
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''} ${uploading ? 'pointer-events-none opacity-50' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="text-center">
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="spinner mb-4"></div>
                <p className="text-gray-600">Uploading and processing file...</p>
              </div>
            ) : (
              <>
                <UploadIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {isDragActive ? 'Drop the file here' : 'Drop your Excel file here'}
                </h3>
                <p className="text-gray-600 mb-4">
                  or click to browse and select a file
                </p>
                <div className="text-sm text-gray-500">
                  <p>Supports: .xls, .xlsx files</p>
                  <p>Maximum file size: 10MB</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Success Message */}
        {uploadResult && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex items-center mb-3">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-700 font-medium">File uploaded successfully!</span>
            </div>
            
            <div className="bg-white rounded-md p-4 mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">File Details:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">File name:</span>
                  <p className="font-medium">{uploadResult.file?.originalName}</p>
                </div>
                <div>
                  <span className="text-gray-600">File size:</span>
                  <p className="font-medium">{(uploadResult.file?.size / 1024).toFixed(1)} KB</p>
                </div>
                <div>
                  <span className="text-gray-600">Sheets detected:</span>
                  <p className="font-medium">{uploadResult.file?.metadata?.sheets?.length || 0}</p>
                </div>
                <div>
                  <span className="text-gray-600">Total rows:</span>
                  <p className="font-medium">{uploadResult.file?.metadata?.rowCount || 0}</p>
                </div>
              </div>

              {uploadResult.file?.metadata?.sheets && (
                <div className="mt-4">
                  <span className="text-gray-600 text-sm">Available sheets:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {uploadResult.file.metadata.sheets.map((sheet, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        <FileSpreadsheet className="h-3 w-3 mr-1" />
                        {sheet}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex space-x-3">
              <a
                href="/analytics"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Create Visualization
              </a>
              <button
                onClick={() => {
                  setUploadResult(null)
                  setError('')
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Upload Another File
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Tips */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-4">Upload Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">Supported Formats:</h4>
            <ul className="space-y-1">
              <li>• Excel 97-2003 (.xls)</li>
              <li>• Excel 2007+ (.xlsx)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Best Practices:</h4>
            <ul className="space-y-1">
              <li>• Use clear column headers</li>
              <li>• Avoid merged cells</li>
              <li>• Keep data organized in tables</li>
              <li>• Remove unnecessary formatting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Upload

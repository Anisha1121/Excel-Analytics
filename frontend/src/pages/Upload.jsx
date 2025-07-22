import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { fileService } from '../services/fileService'
import { Upload as UploadIcon, FileSpreadsheet, CheckCircle, AlertCircle, Sparkles, CloudUpload } from 'lucide-react'

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
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Beautiful Header */}
      <div className="page-header fade-in-up">
        <h1 className="page-title flex items-center justify-center">
          <CloudUpload className="h-12 w-12 mr-4 text-blue-500" />
          Upload Excel File
        </h1>
        <p className="page-subtitle">
          Transform your spreadsheet data into powerful visualizations and insights. 
          Simply drag and drop or click to upload your Excel file.
        </p>
      </div>

      {/* Enhanced Upload Area */}
      <div className="modern-card">
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''} ${uploading ? 'pointer-events-none opacity-60' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="text-center">
            {uploading ? (
              <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-blue-600 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Processing Your File...</h3>
                  <p className="text-gray-600">We're analyzing your data and preparing it for visualization</p>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-100 rounded-2xl flex items-center justify-center shadow-lg">
                    <UploadIcon className={`h-16 w-16 ${isDragActive ? 'text-blue-600 animate-bounce' : 'text-gray-400'} transition-all duration-300`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {isDragActive ? 'Drop it like it\'s hot! 🔥' : 'Upload Your Excel File'}
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    {isDragActive ? 'Release to upload your file' : 'Drag and drop your file here, or click to browse'}
                  </p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full">
                    <FileSpreadsheet className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-700">.xlsx files</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
                    <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">.xls files</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-full">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">Max 10MB</span>
                  </div>
                </div>

                {!isDragActive && (
                  <button className="btn-primary">
                    <UploadIcon className="h-5 w-5" />
                    Choose File
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Enhanced Error Message */}
        {error && (
          <div className="mt-8 error-message fade-in-up">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Beautiful Success Message */}
        {uploadResult && (
          <div className="mt-8 modern-card border-l-4 border-green-500 fade-in-up">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Upload Successful! 🎉</h3>
                  <p className="text-gray-600">Your file has been processed and is ready for analysis</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <FileSpreadsheet className="h-5 w-5 text-green-600 mr-2" />
                  File Details
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{uploadResult.file?.originalName?.split('.')[0]}</div>
                    <div className="text-sm text-gray-600">File Name</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{(uploadResult.file?.size / 1024).toFixed(1)}</div>
                    <div className="text-sm text-gray-600">Size (KB)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{uploadResult.file?.metadata?.sheets?.length || 0}</div>
                    <div className="text-sm text-gray-600">Sheets</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{uploadResult.file?.metadata?.rowCount || 0}</div>
                    <div className="text-sm text-gray-600">Total Rows</div>
                  </div>
                </div>

                {uploadResult.file?.metadata?.sheets && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-gray-700 mb-3">Available Worksheets:</p>
                    <div className="flex flex-wrap gap-2">
                      {uploadResult.file.metadata.sheets.map((sheet, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white border border-green-200 text-green-700 shadow-sm"
                        >
                          <FileSpreadsheet className="h-4 w-4 mr-2" />
                          {sheet}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/analytics"
                  className="btn-primary flex-1 justify-center"
                >
                  <Sparkles className="h-5 w-5" />
                  Create Visualizations
                </a>
                <button
                  onClick={() => {
                    setUploadResult(null)
                    setError('')
                  }}
                  className="btn-secondary flex-1 justify-center"
                >
                  Upload Another File
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Cards */}
      {!uploadResult && !uploading && (
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 fade-in-up">
          <div className="modern-card p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UploadIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Easy Upload</h3>
            <p className="text-gray-600 text-sm">Simply drag and drop your Excel files or click to browse and select</p>
          </div>
          
          <div className="modern-card p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Smart Processing</h3>
            <p className="text-gray-600 text-sm">Our AI analyzes your data structure and suggests optimal visualizations</p>
          </div>
          
          <div className="modern-card p-6 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileSpreadsheet className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Multiple Formats</h3>
            <p className="text-gray-600 text-sm">Support for .xls and .xlsx files up to 10MB in size</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Upload

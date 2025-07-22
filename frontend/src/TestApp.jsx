import React from 'react'

function TestApp() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          🎉 Excel Analytics Platform
        </h1>
        <p className="text-gray-600 mb-4">
          Frontend is working! API URL: {import.meta.env.VITE_API_URL || 'Not set'}
        </p>
        <div className="bg-green-100 p-4 rounded">
          <p className="text-green-800">✅ React is loading correctly</p>
          <p className="text-green-800">✅ Tailwind CSS is working</p>
          <p className="text-green-800">✅ Build process successful</p>
        </div>
      </div>
    </div>
  )
}

export default TestApp

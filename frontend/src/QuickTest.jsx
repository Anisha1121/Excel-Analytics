import React, { useState } from 'react'
import Chart3DSimple from './components/charts/Chart3DSimple'

function QuickTest() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testBackend = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: 'Hello from frontend!' })
      })
      
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error.message}`)
    }
    setLoading(false)
  }

  const testRegister = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        })
      })
      
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error.message}`)
    }
    setLoading(false)
  }

  const testRoutes = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/routes`);
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
    setLoading(false)
  };

  const testDebug = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/debug`);
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
    setLoading(false)
  };

  const testHealth = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/health`);
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
    setLoading(false)
  };

  const test3DChart = () => {
    // Create test data similar to the reference image with smooth gradient values
    const testData = {
      labels: ['1st hour', '2nd hour', '3rd hour', '4th hour', '5th hour', 
               'Mary', 'John', 'Chris', 'Ben', 'Ann',
               'Data A', 'Data B', 'Data C', 'Data D', 'Data E',
               'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5',
               'Point 1', 'Point 2', 'Point 3', 'Point 4', 'Point 5'],
      datasets: [{
        label: 'Surface Data',
        data: [
          20, 40, 60, 80, 100,
          30, 50, 70, 90, 85,
          25, 45, 65, 75, 95,
          35, 55, 85, 95, 80,
          15, 35, 55, 65, 75
        ]
      }],
      originalData: [
        { label: '1st hour', name: '1st hour', value: 20, category: 'Time A' },
        { label: '2nd hour', name: '2nd hour', value: 40, category: 'Time B' },
        { label: '3rd hour', name: '3rd hour', value: 60, category: 'Time C' },
        { label: '4th hour', name: '4th hour', value: 80, category: 'Time D' },
        { label: '5th hour', name: '5th hour', value: 100, category: 'Time E' }
      ]
    };

    const testConfig = {
      chartType: 'surface3d', // Test the enhanced Surface 3D
      title: 'Excel 3D Surface Plot',
      xAxis: 'Time Periods',
      yAxis: 'Values', 
      zAxis: 'Categories'
    };

    setResult(
      <div>
        <p>Testing Surface 3D Chart Component:</p>
        <Chart3DSimple chartData={testData} chartConfig={testConfig} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-6">🔧 Backend Test</h1>
        
        <div className="mb-4">
          <p><strong>API URL:</strong> {import.meta.env.VITE_API_URL || 'Not set'}</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={testHealth}
            disabled={loading}
            className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Health'}
          </button>

          <button 
            onClick={testBackend}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 ml-4"
          >
            {loading ? 'Testing...' : 'Test Backend Connection'}
          </button>

          <button 
            onClick={testRegister}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 ml-4"
          >
            {loading ? 'Testing...' : 'Test Registration'}
          </button>
        </div>

        <div className="space-y-4 mt-4">
          <button 
            onClick={testRoutes}
            disabled={loading}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'List Routes'}
          </button>

          <button 
            onClick={testDebug}
            disabled={loading}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50 ml-4"
          >
            {loading ? 'Testing...' : 'Check Environment'}
          </button>
          
          <button 
            onClick={test3DChart}
            disabled={loading}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50 ml-4"
          >
            Test 3D Chart
          </button>
        </div>

        {result && (
          <div className="mt-6">
            <h3 className="font-bold mb-2">Result:</h3>
            <div className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {typeof result === 'string' ? (
                <pre>{result}</pre>
              ) : (
                result
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuickTest

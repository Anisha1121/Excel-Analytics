import React, { useState } from 'react'
import Chart3D from './components/charts/Chart3D'

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
    const testData = {
      labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E', 'Product F', 'Product G', 'Product H', 'Product I'],
      datasets: [{
        data: [
          { x: 1, y: 2, z: 3 },
          { x: 2, y: 3, z: 1 },
          { x: 3, y: 1, z: 2 },
          { x: 4, y: 4, z: 4 },
          { x: 5, y: 2, z: 3 },
          { x: 6, y: 1, z: 2 },
          { x: 7, y: 3, z: 4 },
          { x: 8, y: 2, z: 1 },
          { x: 9, y: 4, z: 3 }
        ]
      }],
      originalData: [
        { name: 'Product A', sales: 100, profit: 20, region: 'North' },
        { name: 'Product B', sales: 150, profit: 30, region: 'South' },
        { name: 'Product C', sales: 120, profit: 25, region: 'East' },
        { name: 'Product D', sales: 200, profit: 40, region: 'West' },
        { name: 'Product E', sales: 130, profit: 28, region: 'Central' },
        { name: 'Product F', sales: 110, profit: 22, region: 'North' },
        { name: 'Product G', sales: 170, profit: 35, region: 'South' },
        { name: 'Product H', sales: 90, profit: 18, region: 'East' },
        { name: 'Product I', sales: 160, profit: 32, region: 'West' }
      ]
    };

    const testConfig = {
      chartType: 'surface3d',
      title: 'Test 3D Surface Chart',
      xAxis: 'Sales',
      yAxis: 'Profit', 
      zAxis: 'Performance'
    };

    setResult(
      <div>
        <p>Testing 3D Surface Chart Component:</p>
        <Chart3D chartData={testData} chartConfig={testConfig} />
      </div>
    );
  };

  const test3DScatter = () => {
    const testData = {
      labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
      datasets: [{
        data: [
          { x: 1, y: 2, z: 3 },
          { x: 2, y: 3, z: 1 },
          { x: 3, y: 1, z: 2 },
          { x: 4, y: 4, z: 4 },
          { x: 5, y: 2, z: 3 }
        ]
      }],
      originalData: [
        { name: 'Product A', sales: 100, profit: 20, region: 'North' },
        { name: 'Product B', sales: 150, profit: 30, region: 'South' },
        { name: 'Product C', sales: 120, profit: 25, region: 'East' },
        { name: 'Product D', sales: 200, profit: 40, region: 'West' },
        { name: 'Product E', sales: 130, profit: 28, region: 'Central' }
      ]
    };

    const testConfig = {
      chartType: 'scatter3d',
      title: 'Test 3D Scatter Chart',
      xAxis: 'Sales',
      yAxis: 'Profit', 
      zAxis: 'Performance'
    };

    setResult(
      <div>
        <p>Testing 3D Scatter Chart Component:</p>
        <Chart3D chartData={testData} chartConfig={testConfig} />
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
            Test 3D Surface
          </button>
          
          <button 
            onClick={test3DScatter}
            disabled={loading}
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 disabled:opacity-50 ml-4"
          >
            Test 3D Scatter
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

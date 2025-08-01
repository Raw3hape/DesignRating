'use client'

import { useState } from 'react'

export default function AdminTestPage() {
  const [apiKey, setApiKey] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const testAuth = async () => {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch(`/api/admin/stats?apiKey=${encodeURIComponent(apiKey)}`)
      const data = await response.json()
      
      setResult({
        status: response.status,
        ok: response.ok,
        data: data
      })
      
      if (!response.ok) {
        setError(`Error ${response.status}: ${data.error || 'Unknown error'}`)
      }
    } catch (err) {
      setError(`Network error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Admin API Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="mb-4">
            <label className="block mb-2">API Key:</label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter API key"
            />
          </div>
          
          <button
            onClick={testAuth}
            disabled={loading || !apiKey}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Authentication'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="font-bold mb-2">Response:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 bg-yellow-50 border border-yellow-200 p-4 rounded">
          <p className="text-sm">
            <strong>Expected API Key:</strong> designrating-admin-2025<br/>
            <strong>Test URL:</strong> /api/admin/stats?apiKey=YOUR_KEY
          </p>
        </div>
      </div>
    </div>
  )
}
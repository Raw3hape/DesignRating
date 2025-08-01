'use client'

import { useState, useEffect } from 'react'
import { Users, BarChart3, TrendingUp, Eye, Calendar, Mail, Activity } from 'lucide-react'

interface GlobalStats {
  totalUsers: number
  totalAnalyses: number
  createdAt: string
  updatedAt?: string
}

interface DailyStats {
  date: string
  analyses: number
  uniqueUsersCount: number
}

interface Analysis {
  id: string
  email: string
  score: number
  category: string
  createdAt: string
  imagesCount: number
}

interface StatsData {
  global: GlobalStats
  daily: DailyStats[]
  recentAnalyses: Analysis[]
  topUsers: unknown[]
}

export default function AdminPage() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Admin login attempt')
    
    if (!apiKey) {
      setError('Please enter an API key')
      return
    }
    
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/stats?apiKey=${encodeURIComponent(apiKey)}`)
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || `Authentication failed (${response.status})`)
      }
      
      const data = await response.json()
      console.log('Admin login successful')
      
      setStats(data.data)
      setIsAuthenticated(true)
      localStorage.setItem('adminApiKey', apiKey)
    } catch (err) {
      console.error('Admin login error:', err)
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    const savedApiKey = localStorage.getItem('adminApiKey')
    if (!savedApiKey) return

    setApiKey(savedApiKey)
    setLoading(true)

    try {
      const response = await fetch(`/api/admin/stats?apiKey=${encodeURIComponent(savedApiKey)}`)
      const data = await response.json()

      if (!response.ok) {
        localStorage.removeItem('adminApiKey')
        throw new Error(data.error || 'Failed to load stats')
      }

      setStats(data.data)
      setIsAuthenticated(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stats')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  const refreshStats = () => {
    loadStats()
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
            <p className="text-slate-600">Enter your API key to access analytics</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="apiKey" className="sr-only">API Key</label>
              <input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter admin API key"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !apiKey}
              className="w-full bg-slate-900 text-white py-3 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Authenticating...' : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50'
    if (score >= 80) return 'text-blue-600 bg-blue-50'
    if (score >= 70) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
            <p className="text-slate-600">Design Rating Analytics</p>
          </div>
          <button
            onClick={refreshStats}
            disabled={loading}
            className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Stats Cards */}
        {stats?.global && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-1">
                {stats.global.totalUsers.toLocaleString()}
              </h3>
              <p className="text-slate-600">Total Users</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-1">
                {stats.global.totalAnalyses.toLocaleString()}
              </h3>
              <p className="text-slate-600">Total Analyses</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-1">
                {stats.daily.length > 0 ? 
                  (stats.daily.reduce((sum, day) => sum + day.analyses, 0) / stats.daily.length).toFixed(1)
                  : '0'
                }
              </h3>
              <p className="text-slate-600">Avg Daily</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-1">
                {stats.daily[stats.daily.length - 1]?.analyses || 0}
              </h3>
              <p className="text-slate-600">Today</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Stats Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Daily Activity (Last 30 Days)
            </h2>
            
            {stats?.daily && stats.daily.length > 0 ? (
              <div className="space-y-3">
                {stats.daily.slice(-10).map((day) => (
                  <div key={day.date} className="flex items-center justify-between py-2">
                    <span className="text-sm text-slate-600">{formatDate(day.date)}</span>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium">{day.analyses} analyses</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">{day.uniqueUsersCount} users</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">No daily data available</p>
            )}
          </div>

          {/* Recent Analyses */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Recent Analyses
            </h2>
            
            {stats?.recentAnalyses && stats.recentAnalyses.length > 0 ? (
              <div className="space-y-4">
                {stats.recentAnalyses.slice(0, 10).map((analysis) => (
                  <div key={analysis.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{analysis.email}</p>
                        <p className="text-sm text-slate-600">{formatDateTime(analysis.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(analysis.score)}`}>
                        {analysis.score}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{analysis.imagesCount} images</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">No recent analyses</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>Dashboard last updated: {new Date().toLocaleString()}</p>
          <button
            onClick={() => {
              setIsAuthenticated(false)
              localStorage.removeItem('adminApiKey')
            }}
            className="text-slate-600 hover:text-slate-900 mt-2"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
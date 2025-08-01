import { put, head, list, del } from '@vercel/blob'
import { User, Analysis, GlobalStats, DailyStats } from '@/types'
import { FileStorage } from './storage'

// In-memory cache for performance
const memoryCache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_TTL = 60000 // 1 minute cache

// Fallback storage for local development
const memoryStorage = new Map<string, unknown>()

// Storage mode detection
type StorageMode = 'blob' | 'file' | 'memory'

function getStorageMode(): StorageMode {
  if (process.env.BLOB_READ_WRITE_TOKEN) return 'blob'
  if (process.env.NODE_ENV === 'production') return 'memory' // Use memory in production without Blob
  return 'file' // Use file system in development
}

export class KVService {
  static async isAvailable(): Promise<boolean> {
    const mode = getStorageMode()
    return mode !== 'memory'
  }

  static async get<T>(key: string): Promise<T | null> {
    try {
      // Check cache first
      const cached = memoryCache.get(key)
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data as T
      }

      const mode = getStorageMode()
      
      switch (mode) {
        case 'blob':
          try {
            // Try to get from Blob storage
            const blobKey = `data/${key}.json`
            const response = await head(blobKey)
            
            if (response) {
              const blob = await fetch(response.url)
              const data = await blob.json()
              
              // Update cache
              memoryCache.set(key, { data, timestamp: Date.now() })
              return data as T
            }
          } catch (blobError) {
            // File doesn't exist
            return null
          }
          break
          
        case 'file':
          const fileData = await FileStorage.get<T>(key)
          if (fileData) {
            memoryCache.set(key, { data: fileData, timestamp: Date.now() })
          }
          return fileData
          
        case 'memory':
          return (memoryStorage.get(key) as T) || null
      }
    } catch (error) {
      console.error(`Storage get error for key ${key}:`, error)
      return (memoryStorage.get(key) as T) || null
    }
    return null
  }

  static async set<T>(key: string, value: T): Promise<void> {
    try {
      // Update cache
      memoryCache.set(key, { data: value, timestamp: Date.now() })
      
      const mode = getStorageMode()
      
      switch (mode) {
        case 'blob':
          // Save to Blob storage
          const blobKey = `data/${key}.json`
          const jsonData = JSON.stringify(value, null, 2)
          const blob = new Blob([jsonData], { type: 'application/json' })
          
          await put(blobKey, blob, {
            access: 'public',
            addRandomSuffix: false
          })
          break
          
        case 'file':
          await FileStorage.set(key, value)
          break
          
        case 'memory':
          memoryStorage.set(key, value)
          break
      }
    } catch (error) {
      console.error(`Storage set error for key ${key}:`, error)
      // Fallback to memory storage
      memoryStorage.set(key, value)
    }
  }

  static async del(key: string): Promise<void> {
    try {
      // Remove from cache
      memoryCache.delete(key)
      
      const mode = getStorageMode()
      
      switch (mode) {
        case 'blob':
          const blobKey = `data/${key}.json`
          await del(blobKey)
          break
          
        case 'file':
          await FileStorage.del(key)
          break
          
        case 'memory':
          memoryStorage.delete(key)
          break
      }
    } catch (error) {
      console.error(`Storage del error for key ${key}:`, error)
      memoryStorage.delete(key)
    }
  }

  static async incr(key: string): Promise<number> {
    try {
      // Get current value
      const current = (await this.get<number>(key)) || 0
      const newValue = current + 1
      
      // Save new value
      await this.set(key, newValue)
      return newValue
    } catch (error) {
      console.error(`Storage incr error for key ${key}:`, error)
      const current = (memoryStorage.get(key) as number) || 0
      const newValue = current + 1
      memoryStorage.set(key, newValue)
      return newValue
    }
  }

  // User operations
  static async getUser(email: string): Promise<User | null> {
    return this.get<User>(`user:${email}`)
  }

  static async setUser(email: string, user: User): Promise<void> {
    return this.set(`user:${email}`, user)
  }

  static async createUser(email: string): Promise<User> {
    const user: User = {
      email,
      createdAt: new Date().toISOString(),
      analysisCount: 0,
      lastAnalysis: null
    }
    
    await this.setUser(email, user)
    return user
  }

  static async incrementUserAnalysisCount(email: string): Promise<void> {
    const user = await this.getUser(email)
    if (user) {
      user.analysisCount += 1
      user.lastAnalysis = new Date().toISOString()
      await this.setUser(email, user)
    }
  }

  // Analysis operations
  static async saveAnalysis(analysis: Analysis): Promise<void> {
    return this.set(`analysis:${analysis.id}`, analysis)
  }

  static async getAnalysis(id: string): Promise<Analysis | null> {
    return this.get<Analysis>(`analysis:${id}`)
  }

  // Statistics operations
  static async getGlobalStats(): Promise<GlobalStats> {
    const stats = await this.get<GlobalStats>('stats:global')
    return stats || {
      totalUsers: 0,
      totalAnalyses: 0,
      createdAt: new Date().toISOString()
    }
  }

  static async updateGlobalStats(updates: Partial<GlobalStats>): Promise<void> {
    const current = await this.getGlobalStats()
    const updated = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    await this.set('stats:global', updated)
  }

  static async incrementGlobalStats(userIncrement = 0, analysisIncrement = 0): Promise<void> {
    const current = await this.getGlobalStats()
    await this.updateGlobalStats({
      totalUsers: current.totalUsers + userIncrement,
      totalAnalyses: current.totalAnalyses + analysisIncrement
    })
  }

  static async getDailyStats(date: string): Promise<DailyStats> {
    const stats = await this.get<DailyStats>(`stats:daily:${date}`)
    return stats || {
      date,
      analyses: 0,
      uniqueUsers: [],
      uniqueUsersCount: 0
    }
  }

  static async updateDailyStats(date: string, email: string): Promise<void> {
    const stats = await this.getDailyStats(date)
    
    stats.analyses += 1
    
    if (!stats.uniqueUsers.includes(email)) {
      stats.uniqueUsers.push(email)
    }
    
    stats.uniqueUsersCount = stats.uniqueUsers.length
    
    await this.set(`stats:daily:${date}`, stats)
  }

  // Utility functions
  static async cleanup(): Promise<void> {
    // Clean up old daily stats (keep only last 90 days)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - 90)
    
    // In a real implementation, you'd scan for old keys and delete them
    // This is a placeholder for cleanup logic
    console.log('Cleanup placeholder - implement key scanning if needed')
  }
}
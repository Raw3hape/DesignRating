import { kv } from '@vercel/kv'
import { User, Analysis, GlobalStats, DailyStats } from '@/types'

// Fallback storage for local development
const memoryStorage = new Map<string, unknown>()

export class KVService {
  static async isAvailable(): Promise<boolean> {
    return !!process.env.KV_REST_API_URL
  }

  static async get<T>(key: string): Promise<T | null> {
    try {
      if (await this.isAvailable()) {
        return await kv.get<T>(key)
      } else {
        return (memoryStorage.get(key) as T) || null
      }
    } catch (error) {
      console.error(`KV get error for key ${key}:`, error)
      return (memoryStorage.get(key) as T) || null
    }
  }

  static async set<T>(key: string, value: T): Promise<void> {
    try {
      if (await this.isAvailable()) {
        await kv.set(key, value)
      } else {
        memoryStorage.set(key, value)
      }
    } catch (error) {
      console.error(`KV set error for key ${key}:`, error)
      // Fallback to memory storage
      memoryStorage.set(key, value)
    }
  }

  static async del(key: string): Promise<void> {
    try {
      if (await this.isAvailable()) {
        await kv.del(key)
      } else {
        memoryStorage.delete(key)
      }
    } catch (error) {
      console.error(`KV del error for key ${key}:`, error)
      memoryStorage.delete(key)
    }
  }

  static async incr(key: string): Promise<number> {
    try {
      if (await this.isAvailable()) {
        return await kv.incr(key)
      } else {
        const current = (memoryStorage.get(key) as number) || 0
        const newValue = current + 1
        memoryStorage.set(key, newValue)
        return newValue
      }
    } catch (error) {
      console.error(`KV incr error for key ${key}:`, error)
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
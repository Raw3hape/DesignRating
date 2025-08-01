import { User, Analysis, GlobalStats, DailyStats } from '@/types'
import fs from 'fs/promises'
import path from 'path'

// Simple file-based storage for MVP
// This creates a .data directory in your project root
const DATA_DIR = path.join(process.cwd(), '.data')

export class FileStorage {
  static async ensureDataDir() {
    try {
      await fs.access(DATA_DIR)
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true })
    }
  }

  static getFilePath(key: string): string {
    // Replace : with _ for valid filenames
    const safeKey = key.replace(/:/g, '_')
    return path.join(DATA_DIR, `${safeKey}.json`)
  }

  static async get<T>(key: string): Promise<T | null> {
    try {
      await this.ensureDataDir()
      const filePath = this.getFilePath(key)
      const data = await fs.readFile(filePath, 'utf-8')
      return JSON.parse(data) as T
    } catch (error) {
      // File doesn't exist or other error
      return null
    }
  }

  static async set<T>(key: string, value: T): Promise<void> {
    try {
      await this.ensureDataDir()
      const filePath = this.getFilePath(key)
      const data = JSON.stringify(value, null, 2)
      await fs.writeFile(filePath, data, 'utf-8')
    } catch (error) {
      console.error(`FileStorage set error for key ${key}:`, error)
      throw error
    }
  }

  static async del(key: string): Promise<void> {
    try {
      await this.ensureDataDir()
      const filePath = this.getFilePath(key)
      await fs.unlink(filePath)
    } catch (error) {
      // Ignore if file doesn't exist
      if ((error as any).code !== 'ENOENT') {
        console.error(`FileStorage del error for key ${key}:`, error)
      }
    }
  }

  static async incr(key: string): Promise<number> {
    const current = (await this.get<number>(key)) || 0
    const newValue = current + 1
    await this.set(key, newValue)
    return newValue
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
}
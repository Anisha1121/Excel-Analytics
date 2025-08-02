// Client-side analytics tracking
class AnalyticsTracker {
  constructor() {
    this.sessionStart = Date.now()
    this.actionsToday = this.getTodaysActions()
    this.chartTypes = this.getChartTypeStats()
  }

  // Track user actions
  trackAction(action, metadata = {}) {
    const actionData = {
      action,
      timestamp: Date.now(),
      metadata,
      userId: localStorage.getItem('userId') || 'anonymous'
    }

    // Store in localStorage for persistence
    const today = new Date().toDateString()
    const storageKey = `analytics_${today}`
    const existingData = JSON.parse(localStorage.getItem(storageKey) || '[]')
    existingData.push(actionData)
    localStorage.setItem(storageKey, JSON.stringify(existingData))

    // Also track in session storage
    const sessionActions = JSON.parse(sessionStorage.getItem('sessionActions') || '[]')
    sessionActions.push(actionData)
    sessionStorage.setItem('sessionActions', JSON.stringify(sessionActions))
  }

  // Get today's actions
  getTodaysActions() {
    const today = new Date().toDateString()
    const storageKey = `analytics_${today}`
    return JSON.parse(localStorage.getItem(storageKey) || '[]')
  }

  // Get chart type statistics
  getChartTypeStats() {
    const actions = this.getTodaysActions()
    const chartActions = actions.filter(action => action.action === 'chart_created')
    
    const typeCount = {}
    chartActions.forEach(action => {
      const type = action.metadata?.chartType || 'unknown'
      typeCount[type] = (typeCount[type] || 0) + 1
    })

    return typeCount
  }

  // Get session time
  getSessionTime() {
    const sessionTimeMs = Date.now() - this.sessionStart
    const minutes = Math.floor(sessionTimeMs / 60000)
    const seconds = Math.floor((sessionTimeMs % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  }

  // Get real statistics
  getRealStats() {
    const todaysActions = this.getTodaysActions()
    const chartActions = todaysActions.filter(action => action.action === 'chart_created')
    const fileActions = todaysActions.filter(action => action.action === 'file_uploaded')
    
    // Get most popular chart type
    const chartTypes = this.getChartTypeStats()
    const mostPopular = Object.keys(chartTypes).reduce((a, b) => 
      chartTypes[a] > chartTypes[b] ? a : b, 'Bar Chart')

    // Calculate success rate (charts created vs files uploaded)
    const successRate = fileActions.length > 0 ? 
      Math.round((chartActions.length / fileActions.length) * 100) : 100

    return {
      chartsToday: chartActions.length,
      filesToday: fileActions.length,
      topChartType: mostPopular || 'Bar Chart',
      avgSessionTime: this.getSessionTime(),
      successRate: successRate,
      actionsToday: todaysActions.length
    }
  }

  // Clean old data (keep only last 30 days)
  cleanOldData() {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('analytics_')) {
        const dateStr = key.replace('analytics_', '')
        const date = new Date(dateStr)
        if (date < thirtyDaysAgo) {
          localStorage.removeItem(key)
        }
      }
    }
  }
}

export const analyticsTracker = new AnalyticsTracker()

// Auto-track common events
export const trackEvent = (action, metadata = {}) => {
  analyticsTracker.trackAction(action, metadata)
}

export default analyticsTracker

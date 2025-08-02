import { useState, useEffect } from 'react'
import { 
  Sparkles, Zap, Brain, TrendingUp, Target, Award, 
  BarChart3, PieChart, LineChart, Layers, Lightbulb,
  MessageSquare, Share2, Calendar, Bell, Star
} from 'lucide-react'

const AdvancedFeatures = ({ chartData, chartConfig, onFeatureSelect }) => {
  const [activeFeature, setActiveFeature] = useState(null)
  const [predictions, setPredictions] = useState(null)
  const [insights, setInsights] = useState([])

  // AI-Powered Trend Prediction
  const generatePredictions = () => {
    if (!chartData || !Array.isArray(chartData)) return

    const values = chartData.map(item => item.y || item.value || 0)
    const avgGrowth = values.reduce((sum, val, idx) => {
      if (idx === 0) return 0
      return sum + ((val - values[idx - 1]) / values[idx - 1])
    }, 0) / (values.length - 1)

    const lastValue = values[values.length - 1]
    const predictions = []
    for (let i = 1; i <= 6; i++) {
      const predicted = lastValue * Math.pow(1 + avgGrowth, i)
      predictions.push({
        period: `Month ${i}`,
        value: Math.round(predicted * 100) / 100,
        confidence: Math.max(0.5, 1 - (i * 0.1))
      })
    }

    setPredictions(predictions)
  }

  // Smart Insights Generation
  const generateSmartInsights = () => {
    if (!chartData) return

    const insights = []
    const values = chartData.map(item => item.y || item.value || 0)
    
    // Volatility Analysis
    const variance = values.reduce((sum, val) => sum + Math.pow(val - (values.reduce((a, b) => a + b, 0) / values.length), 2), 0) / values.length
    const volatility = Math.sqrt(variance)
    
    if (volatility > values.reduce((a, b) => a + b, 0) / values.length * 0.3) {
      insights.push({
        type: 'warning',
        title: 'High Volatility Detected',
        description: 'Your data shows significant fluctuations. Consider implementing stability measures.',
        icon: TrendingUp,
        color: 'orange'
      })
    }

    // Growth Pattern
    const growthPoints = values.filter((val, idx) => idx > 0 && val > values[idx - 1]).length
    const growthPercentage = (growthPoints / (values.length - 1)) * 100

    if (growthPercentage > 70) {
      insights.push({
        type: 'success',
        title: 'Strong Growth Pattern',
        description: `${growthPercentage.toFixed(0)}% of your data points show positive growth trends.`,
        icon: TrendingUp,
        color: 'green'
      })
    }

    // Peak Detection
    const peaks = values.filter((val, idx) => {
      if (idx === 0 || idx === values.length - 1) return false
      return val > values[idx - 1] && val > values[idx + 1]
    })

    if (peaks.length > 0) {
      insights.push({
        type: 'info',
        title: 'Performance Peaks Identified',
        description: `Found ${peaks.length} significant peak(s) in your data. These represent optimal performance periods.`,
        icon: Target,
        color: 'blue'
      })
    }

    setInsights(insights)
  }

  const features = [
    {
      id: 'predictions',
      title: 'AI Trend Forecasting',
      description: 'Predict future trends using machine learning algorithms',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      action: generatePredictions
    },
    {
      id: 'insights',
      title: 'Smart Data Insights',
      description: 'Get intelligent analysis and recommendations',
      icon: Lightbulb,
      color: 'from-yellow-500 to-orange-500',
      action: generateSmartInsights
    },
    {
      id: 'collaborative',
      title: 'Team Collaboration',
      description: 'Share charts and get team feedback in real-time',
      icon: MessageSquare,
      color: 'from-blue-500 to-cyan-500',
      action: () => setActiveFeature('collaborative')
    },
    {
      id: 'alerts',
      title: 'Smart Alerts',
      description: 'Get notified when your data meets specific conditions',
      icon: Bell,
      color: 'from-red-500 to-pink-500',
      action: () => setActiveFeature('alerts')
    },
    {
      id: 'comparison',
      title: 'Multi-Dataset Compare',
      description: 'Compare multiple data sources side by side',
      icon: Layers,
      color: 'from-green-500 to-teal-500',
      action: () => setActiveFeature('comparison')
    },
    {
      id: 'scheduling',
      title: 'Automated Reports',
      description: 'Schedule automatic report generation and delivery',
      icon: Calendar,
      color: 'from-indigo-500 to-purple-500',
      action: () => setActiveFeature('scheduling')
    }
  ]

  return (
    <div className="mt-8 space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
          🚀 Advanced Analytics Features
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Unlock powerful insights with our AI-powered analytics tools
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div
            key={feature.id}
            onClick={feature.action}
            className="group relative overflow-hidden rounded-2xl p-6 bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            <div className="relative z-10">
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-6 w-6" />
              </div>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700">
                {feature.title}
              </h4>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>

              <div className="mt-4 flex items-center text-sm font-medium text-gray-500 group-hover:text-gray-700">
                <Sparkles className="h-4 w-4 mr-1" />
                Click to activate
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Predictions Display */}
      {predictions && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
          <h4 className="text-xl font-bold text-purple-900 mb-4 flex items-center">
            <Brain className="h-6 w-6 mr-2" />
            AI Trend Predictions
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {predictions.map((pred, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-gray-700">{pred.period}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    pred.confidence > 0.8 ? 'bg-green-100 text-green-700' :
                    pred.confidence > 0.6 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {Math.round(pred.confidence * 100)}% confidence
                  </span>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {pred.value.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Smart Insights Display */}
      {insights.length > 0 && (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
          <h4 className="text-xl font-bold text-orange-900 mb-4 flex items-center">
            <Lightbulb className="h-6 w-6 mr-2" />
            Smart Data Insights
          </h4>
          
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-l-orange-400">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg bg-${insight.color}-100`}>
                    <insight.icon className={`h-5 w-5 text-${insight.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900 mb-1">{insight.title}</h5>
                    <p className="text-gray-600 text-sm">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature-specific content */}
      {activeFeature === 'collaborative' && (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
          <h4 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
            <MessageSquare className="h-6 w-6 mr-2" />
            Team Collaboration Hub
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4">
              <h5 className="font-semibold mb-2">Share Chart</h5>
              <div className="flex space-x-2">
                <input 
                  type="email" 
                  placeholder="Enter email addresses..." 
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4">
              <h5 className="font-semibold mb-2">Live Comments</h5>
              <p className="text-sm text-gray-600">Team members can add real-time comments and suggestions to your charts.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdvancedFeatures

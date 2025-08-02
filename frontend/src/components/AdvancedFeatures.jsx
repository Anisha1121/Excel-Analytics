import React, { useState } from 'react';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  Lightbulb,
  Target,
  Bell,
  GitCompare,
  Clock
} from 'lucide-react';

const AdvancedFeatures = ({ chartData, chartType }) => {
  const [activeFeature, setActiveFeature] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const generatePredictions = async () => {
    setIsLoading(true);
    setActiveFeature('predictions');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const samplePredictions = {
        nextMonth: "Based on current trends, expect 15% growth next month",
        trend: "Upward trajectory with seasonal variations",
        confidence: 85,
        keyFactors: ["Increased user engagement", "Market expansion", "Product improvements"]
      };
      
      setPredictions(samplePredictions);
    } catch (error) {
      console.error('Error generating predictions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSmartInsights = async () => {
    setIsLoading(true);
    setActiveFeature('insights');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const sampleInsights = {
        patterns: [
          "Peak activity occurs on Tuesdays and Thursdays",
          "Mobile users show 40% higher engagement",
          "Feature adoption rate increased by 23% this quarter"
        ],
        recommendations: [
          "Focus marketing efforts on mobile platforms",
          "Schedule important releases on peak days",
          "Expand successful features to drive growth"
        ],
        anomalies: [
          "Unusual spike detected on March 15th",
          "Weekend activity 30% above normal"
        ]
      };
      
      setInsights(sampleInsights);
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const enableCollaboration = () => {
    setActiveFeature('collaboration');
    alert('Collaboration enabled! Share link: https://analytics.app/share/abc123');
  };

  const setupAlerts = () => {
    setActiveFeature('alerts');
    alert('Smart alerts configured! You will be notified of significant changes.');
  };

  const enableComparison = () => {
    setActiveFeature('comparison');
    alert('Comparison mode enabled! Select multiple datasets to compare.');
  };

  const scheduleReports = () => {
    setActiveFeature('scheduling');
    alert('Auto-reports scheduled! Weekly summaries will be sent every Monday.');
  };

  const features = [
    {
      id: 'predictions',
      title: 'AI Predictions',
      description: 'Get future trend predictions based on your data',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      action: generatePredictions
    },
    {
      id: 'insights',
      title: 'Smart Insights',
      description: 'Discover hidden patterns and actionable insights',
      icon: Lightbulb,
      color: 'from-yellow-500 to-orange-500',
      action: generateSmartInsights
    },
    {
      id: 'collaboration',
      title: 'Team Collaboration',
      description: 'Share dashboards and collaborate in real-time',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      action: enableCollaboration
    },
    {
      id: 'alerts',
      title: 'Smart Alerts',
      description: 'Get notified of important changes and anomalies',
      icon: Bell,
      color: 'from-red-500 to-pink-500',
      action: setupAlerts
    },
    {
      id: 'comparison',
      title: 'Data Comparison',
      description: 'Compare multiple datasets side by side',
      icon: GitCompare,
      color: 'from-green-500 to-teal-500',
      action: enableComparison
    },
    {
      id: 'scheduling',
      title: 'Auto Reports',
      description: 'Schedule automated report generation',
      icon: Clock,
      color: 'from-indigo-500 to-purple-500',
      action: scheduleReports
    }
  ];

  return (
    <div className="mt-8 p-6 bg-black/20 backdrop-blur-sm rounded-xl border border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <Target className="text-purple-400" size={24} />
        <h3 className="text-xl font-bold text-white">Advanced Analytics Features</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {features.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <div
              key={feature.id}
              className={`p-4 rounded-lg bg-gradient-to-r ${feature.color} opacity-90 hover:opacity-100 transition-all cursor-pointer transform hover:scale-105`}
              onClick={feature.action}
            >
              <div className="flex items-center gap-3 mb-2">
                <IconComponent className="text-white" size={20} />
                <h4 className="font-semibold text-white">{feature.title}</h4>
              </div>
              <p className="text-white/80 text-sm">{feature.description}</p>
              {isLoading && activeFeature === feature.id && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span className="text-white text-xs">Processing...</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {activeFeature === 'predictions' && predictions && !isLoading && (
        <div className="mt-6 p-4 bg-purple-900/30 rounded-lg border border-purple-500/30">
          <h4 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
            <TrendingUp size={20} />
            AI Predictions
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-white font-medium">Next Month Forecast:</p>
              <p className="text-gray-300">{predictions.nextMonth}</p>
            </div>
            <div>
              <p className="text-white font-medium">Trend Analysis:</p>
              <p className="text-gray-300">{predictions.trend}</p>
            </div>
            <div>
              <p className="text-white font-medium">Confidence Level:</p>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${predictions.confidence}%` }}
                  ></div>
                </div>
                <span className="text-purple-300">{predictions.confidence}%</span>
              </div>
            </div>
            <div>
              <p className="text-white font-medium">Key Factors:</p>
              <ul className="text-gray-300 list-disc list-inside">
                {predictions.keyFactors.map((factor, index) => (
                  <li key={index}>{factor}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeFeature === 'insights' && insights && !isLoading && (
        <div className="mt-6 p-4 bg-yellow-900/30 rounded-lg border border-yellow-500/30">
          <h4 className="text-lg font-semibold text-yellow-300 mb-3 flex items-center gap-2">
            <Lightbulb size={20} />
            Smart Insights
          </h4>
          <div className="space-y-4">
            <div>
              <p className="text-white font-medium mb-2">Discovered Patterns:</p>
              <ul className="text-gray-300 space-y-1">
                {insights.patterns.map((pattern, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">•</span>
                    {pattern}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-white font-medium mb-2">Recommendations:</p>
              <ul className="text-gray-300 space-y-1">
                {insights.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-white font-medium mb-2">Anomalies Detected:</p>
              <ul className="text-gray-300 space-y-1">
                {insights.anomalies.map((anomaly, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertTriangle className="text-red-400 mt-0.5" size={16} />
                    {anomaly}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeFeature && !['predictions', 'insights'].includes(activeFeature) && (
        <div className="mt-6 p-4 bg-green-900/30 rounded-lg border border-green-500/30">
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <p className="text-white">
              {features.find(f => f.id === activeFeature)?.title} has been activated!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFeatures;

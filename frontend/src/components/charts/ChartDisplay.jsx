import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
import Chart3DSimple from './Chart3DSimple';
import { fileService } from '../../services/fileService';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ChartDisplay = ({ chartData, chartConfig, fileId }) => {
  console.log('ChartDisplay received:', { chartData, chartConfig, fileId });
  const [selectedPoint, setSelectedPoint] = React.useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  if (!chartData || !chartConfig) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No chart data available</p>
      </div>
    );
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: chartConfig.chartType === 'pie' ? 'right' : 'top',
        display: true,
        labels: {
          color: 'white'
        }
      },
      title: {
        display: true,
        text: chartConfig.title || `${chartConfig.chartType?.toUpperCase()} Chart - ${chartConfig.xAxis} vs ${chartConfig.yAxis}`,
        font: {
          size: 16,
          weight: 'bold'
        },
        color: 'white'
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'white',
        borderWidth: 1,
        callbacks: {
          title: function(context) {
            if (chartConfig.chartType === 'scatter') {
              const dataIndex = context[0].dataIndex;
              const originalData = chartData.originalData;
              if (originalData && originalData[dataIndex]) {
                return originalData[dataIndex].label || `Entry ${dataIndex + 1}`;
              }
              return `Data Point ${dataIndex + 1}`;
            }
            return context[0].label;
          },
          label: function(context) {
            if (chartConfig.chartType === 'pie') {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.parsed * 100) / total).toFixed(1);
              return `${context.label}: ${context.parsed} (${percentage}%)`;
            } else if (chartConfig.chartType === 'scatter') {
              const dataIndex = context.dataIndex;
              const point = context.parsed;
              const originalData = chartData.originalData;
              
              let labels = [];
              labels.push(`X (${chartConfig.xAxis}): ${point.x}`);
              labels.push(`Y (${chartConfig.yAxis}): ${point.y}`);
              
              // Add original data details if available
              if (originalData && originalData[dataIndex]) {
                const original = originalData[dataIndex];
                Object.entries(original).forEach(([key, value]) => {
                  if (key !== 'x' && key !== 'y' && key !== 'label') {
                    labels.push(`${key}: ${value}`);
                  }
                });
              }
              
              return labels;
            }
            return `${context.dataset.label}: ${context.parsed.y || context.parsed}`;
          },
          footer: function(context) {
            if (chartConfig.chartType === 'scatter') {
              return 'Click for more details';
            }
            return '';
          }
        }
      }
    },
    scales: chartConfig.chartType === 'pie' ? {} : {
      x: {
        display: true,
        title: {
          display: true,
          text: chartConfig.xAxis || 'X Axis',
          color: 'white'
        },
        ticks: {
          color: 'white'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)'
        }
      },
      y: {
        display: true,
        beginAtZero: true,
        title: {
          display: true,
          text: chartConfig.yAxis || 'Y Axis',
          color: 'white'
        },
        ticks: {
          color: 'white'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)'
        }
      },
    },
    elements: {
      point: {
        radius: chartConfig.chartType === 'scatter' ? 6 : 4,
        hoverRadius: chartConfig.chartType === 'scatter' ? 8 : 6,
      }
    },
    onClick: chartConfig.chartType === 'scatter' ? (event, elements) => {
      if (elements.length > 0) {
        const dataIndex = elements[0].index;
        const datasetIndex = elements[0].datasetIndex;
        const originalData = chartData.originalData;
        const point = chartData.datasets[datasetIndex].data[dataIndex];
        
        setSelectedPoint({
          index: dataIndex,
          point: point,
          label: originalData && originalData[dataIndex] ? 
            originalData[dataIndex].label || `Entry ${dataIndex + 1}` : 
            `Entry ${dataIndex + 1}`,
          originalData: originalData ? originalData[dataIndex] : null
        });
      }
    } : undefined
  };

  const renderChart = () => {
    // Check if it's a 3D chart - fix the property name
    if (['bar3d', 'scatter3d', 'surface3d'].includes(chartConfig.chartType)) {
      return <Chart3DSimple chartData={chartData} chartConfig={chartConfig} />;
    }

    // Render 2D charts
    switch (chartConfig.chartType) {
      case 'bar':
        return <Bar data={chartData} options={options} />;
      case 'line':
        return <Line data={chartData} options={options} />;
      case 'pie':
        return <Pie data={chartData} options={options} />;
      case 'scatter':
        return <Scatter data={chartData} options={options} />;
      default:
        return <Bar data={chartData} options={options} />;
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow p-6 relative">
      <div className={['bar3d', 'scatter3d', 'surface3d'].includes(chartConfig.chartType) ? 'h-96' : 'h-96'}>
        {renderChart()}
      </div>
      
      {/* Selected Point Details for Scatter Plots */}
      {selectedPoint && chartConfig.chartType === 'scatter' && (
        <div className="absolute top-4 right-4 bg-blue-600 text-white p-3 rounded-lg max-w-xs">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-bold text-sm">Selected Point</h4>
            <button 
              onClick={() => setSelectedPoint(null)}
              className="text-white hover:text-gray-300 ml-2"
            >
              ×
            </button>
          </div>
          <div className="text-xs space-y-1">
            <div><strong>Label:</strong> {selectedPoint.label}</div>
            <div><strong>X ({chartConfig.xAxis}):</strong> {selectedPoint.point.x}</div>
            <div><strong>Y ({chartConfig.yAxis}):</strong> {selectedPoint.point.y}</div>
            {selectedPoint.originalData && (
              <div className="mt-2 pt-2 border-t border-blue-400">
                <div className="font-semibold mb-1">Full Details:</div>
                {Object.entries(selectedPoint.originalData).map(([key, value]) => (
                  <div key={key} className="truncate">
                    <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Chart Actions */}
      <div className="mt-4 flex justify-end space-x-3">
        <button
          onClick={() => {
            // Export as PNG
            if (['bar3d', 'scatter3d', 'surface3d'].includes(chartConfig.chartType)) {
              // For 3D charts, we'll capture the canvas differently
              const canvas = document.querySelector('canvas');
              if (canvas) {
                const url = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = `3d-${chartConfig.chartType}-chart-${chartConfig.xAxis}-vs-${chartConfig.yAxis}-${Date.now()}.png`;
                link.href = url;
                link.click();
              }
            } else {
              // For 2D charts
              const canvas = document.querySelector('canvas');
              if (canvas) {
                const url = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = `${chartConfig.chartType}-chart-${chartConfig.xAxis}-vs-${chartConfig.yAxis}-${Date.now()}.png`;
                link.href = url;
                link.click();
              }
            }
          }}
          className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Download PNG
        </button>
        
        <button
          onClick={async () => {
            if (!fileId) {
              setSaveMessage('Error: File ID not available');
              setTimeout(() => setSaveMessage(''), 3000);
              return;
            }

            setSaveLoading(true);
            setSaveMessage('');
            
            try {
              const result = await fileService.saveChart(fileId, chartConfig, chartData);
              setSaveMessage('Chart saved successfully!');
              console.log('Chart saved:', result);
            } catch (error) {
              console.error('Error saving chart:', error);
              setSaveMessage(error.message || 'Failed to save chart');
            } finally {
              setSaveLoading(false);
              setTimeout(() => setSaveMessage(''), 3000);
            }
          }}
          disabled={saveLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saveLoading ? 'Saving...' : 'Save Chart'}
        </button>
        
        {saveMessage && (
          <div className={`mt-2 p-2 rounded text-sm ${
            saveMessage.includes('Error') || saveMessage.includes('Failed') 
              ? 'bg-red-100 text-red-700' 
              : 'bg-green-100 text-green-700'
          }`}>
            {saveMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartDisplay;

import React from 'react';
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
import Chart3D from './Chart3D';

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

const ChartDisplay = ({ chartData, chartConfig }) => {
  console.log('ChartDisplay received:', { chartData, chartConfig });

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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'white',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            if (chartConfig.chartType === 'pie') {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.parsed * 100) / total).toFixed(1);
              return `${context.label}: ${context.parsed} (${percentage}%)`;
            }
            return `${context.dataset.label}: ${context.parsed.y || context.parsed}`;
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
    }
  };

  const renderChart = () => {
    // Check if it's a 3D chart - fix the property name
    if (['bar3d', 'scatter3d', 'surface3d'].includes(chartConfig.chartType)) {
      return <Chart3D chartData={chartData} chartConfig={chartConfig} />;
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
    <div className="bg-gray-900 rounded-lg shadow p-6">
      <div className={['bar3d', 'scatter3d', 'surface3d'].includes(chartConfig.chartType) ? 'h-96' : 'h-96'}>
        {renderChart()}
      </div>
      
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
          onClick={() => {
            // Save chart configuration
            console.log('Saving chart...', chartConfig);
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Save Chart
        </button>
      </div>
    </div>
  );
};

export default ChartDisplay;

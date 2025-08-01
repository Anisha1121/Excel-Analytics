import React from 'react';
import './ChartDataTable.css';

const ChartDataTable = ({ data, type, title }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-data-table">
        <h3>{title || 'Chart Data'}</h3>
        <p>No data available</p>
      </div>
    );
  }

  const renderScatter3DTable = () => {
    return (
      <div className="chart-data-table">
        <h3>{title || '3D Scatter Chart Data'}</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Point</th>
                <th>X-Axis</th>
                <th>Y Value</th>
                <th>Z Value</th>
                <th>Label</th>
              </tr>
            </thead>
            <tbody>
              {data.map((point, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{point.xLabel || point.x || 'N/A'}</td>
                  <td>{typeof point.y === 'number' ? point.y.toFixed(2) : point.y}</td>
                  <td>{typeof point.z === 'number' ? point.z.toFixed(2) : point.z}</td>
                  <td>{point.label || `Point ${index + 1}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderSurfaceTable = () => {
    return (
      <div className="chart-data-table">
        <h3>{title || 'Surface Chart Data'}</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Row</th>
                <th>Col</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                // Handle both old and new data formats
                if (item && typeof item === 'object' && item.row !== undefined) {
                  return (
                    <tr key={index}>
                      <td>{item.row}</td>
                      <td>{item.col}</td>
                      <td>{item.value || '0.00'}</td>
                    </tr>
                  );
                } else {
                  // Fallback for raw data
                  const size = Math.sqrt(data.length);
                  const row = Math.floor(index / size);
                  const col = index % size;
                  const value = typeof item === 'number' ? item.toFixed(2) : '0.00';
                  return (
                    <tr key={index}>
                      <td>{row}</td>
                      <td>{col}</td>
                      <td>{value}</td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderBarTable = () => {
    return (
      <div className="chart-data-table">
        <h3>{title || 'Bar Chart Data'}</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.label || `Category ${index + 1}`}</td>
                  <td>{typeof item.value === 'number' ? item.value.toFixed(2) : item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  switch (type) {
    case 'scatter3d':
      return renderScatter3DTable();
    case 'surface':
    case 'surface3d':
      return renderSurfaceTable();
    case 'bar3d':
      return renderBarTable();
    default:
      return renderScatter3DTable();
  }
};

export default ChartDataTable;

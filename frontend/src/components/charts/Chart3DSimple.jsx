import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Simple 3D Bar component
const SimpleBar3D = ({ position, height, color, label, value }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime + position[0]) * 0.05;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} position={[0, height / 2, 0]}>
        <boxGeometry args={[0.8, height, 0.8]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
};

// Simple 3D Scatter Point
const SimpleScatterPoint = ({ position, color, onHover }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(hovered ? 1.5 : 1);
    }
  });

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    onHover && onHover(position);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial 
        color={hovered ? '#FFD700' : color}
        emissive={hovered ? '#FFD700' : color}
        emissiveIntensity={hovered ? 0.3 : 0.1}
      />
    </mesh>
  );
};

// Simple Camera Controls (basic orbit)
const CameraControls = () => {
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    state.camera.position.x = Math.cos(t * 0.1) * 10;
    state.camera.position.z = Math.sin(t * 0.1) * 10;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

const Chart3DSimple = ({ chartData, chartConfig }) => {
  console.log('Chart3DSimple component called with:', { chartData, chartConfig });
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#FFB6C1', '#87CEEB', '#F0E68C'
  ];

  if (!chartData || !chartConfig) {
    return (
      <div className="h-96 w-full bg-gray-50 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No chart data available for 3D visualization</p>
      </div>
    );
  }

  console.log('Chart3DSimple received data:', { chartData, chartConfig });

  const render3DChart = () => {
    try {
      console.log('Rendering 3D chart with type:', chartConfig.chartType);
      
      switch (chartConfig.chartType) {
        case 'bar3d':
          if (!chartData.labels || !chartData.datasets || !chartData.datasets[0]) {
            return null;
          }
          
          // Find max value for proper scaling
          const maxValue = Math.max(...chartData.datasets[0].data);
          const scaleFactor = maxValue > 0 ? 3 / maxValue : 1; // Scale to max height of 3 units
          
          const bars = chartData.labels.map((label, index) => {
            const dataValue = chartData.datasets[0].data[index];
            const height = Math.max(dataValue * scaleFactor, 0.1); // Minimum height of 0.1
            
            return (
              <SimpleBar3D
                key={index}
                position={[(index - chartData.labels.length / 2) * 1.5, 0, 0]}
                height={height}
                color={colors[index % colors.length]}
                label={label}
                value={dataValue}
              />
            );
          });
          return <group>{bars}</group>;

        case 'scatter3d':
          if (!chartData.datasets || !chartData.datasets[0] || !chartData.datasets[0].data) {
            return null;
          }
          
          const scatterData = chartData.datasets[0].data;
          
          // Find min/max values for proper scaling
          const xValues = scatterData.map(p => typeof p === 'object' ? p.x : 0).filter(v => !isNaN(v));
          const yValues = scatterData.map(p => typeof p === 'object' ? p.y : 0).filter(v => !isNaN(v));
          const zValues = scatterData.map(p => typeof p === 'object' ? (p.z || 0) : 0).filter(v => !isNaN(v));
          
          const xRange = Math.max(...xValues) - Math.min(...xValues) || 1;
          const yRange = Math.max(...yValues) - Math.min(...yValues) || 1;
          const zRange = Math.max(...zValues) - Math.min(...zValues) || 1;
          
          const scatter3DData = scatterData.map((point, index) => {
            if (typeof point === 'object' && point.x !== undefined && point.y !== undefined) {
              return {
                x: ((point.x - Math.min(...xValues)) / xRange - 0.5) * 6, // Scale to -3 to +3
                y: ((point.y - Math.min(...yValues)) / yRange - 0.5) * 6,
                z: ((point.z || 0 - Math.min(...zValues)) / zRange - 0.5) * 6
              };
            } else {
              return {
                x: (index / scatterData.length - 0.5) * 6,
                y: (typeof point === 'number' ? point : 0) * 0.01,
                z: Math.random() * 2 - 1
              };
            }
          });
          
          return (
            <group>
              {scatter3DData.map((point, index) => (
                <SimpleScatterPoint
                  key={index}
                  position={[point.x, point.y, point.z]}
                  color={colors[index % colors.length]}
                  onHover={setHoveredPoint}
                />
              ))}
            </group>
          );

        case 'surface3d':
          if (!chartData.labels || !chartData.datasets || !chartData.datasets[0]) {
            return null;
          }
          
          // Create a simple surface using points
          const size = Math.ceil(Math.sqrt(chartData.labels.length));
          const points = [];
          
          for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
              const dataIndex = i * size + j;
              if (dataIndex < chartData.datasets[0].data.length) {
                const value = chartData.datasets[0].data[dataIndex] || 0;
                points.push(
                  <SimpleScatterPoint
                    key={`${i}-${j}`}
                    position={[
                      (j - size / 2) * 0.5,
                      value * 0.01,
                      (i - size / 2) * 0.5
                    ]}
                    color={colors[dataIndex % colors.length]}
                    onHover={setHoveredPoint}
                  />
                );
              }
            }
          }
          
          return <group>{points}</group>;

        default:
          return null;
      }
    } catch (error) {
      console.error('Error rendering 3D chart:', error);
      return null;
    }
  };

  return (
    <div className="relative">
      <div className="h-96 w-full bg-gray-900 rounded-lg">
        <Canvas 
          camera={{ position: [10, 10, 10], fov: 60 }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <CameraControls />
          
          {render3DChart()}
          
          {/* Simple grid */}
          <gridHelper args={[20, 20]} />
        </Canvas>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-3 rounded-lg max-w-xs">
        <h4 className="font-bold mb-2">3D Chart</h4>
        <div className="text-xs text-gray-300">
          <div>• Hover over points for interaction</div>
          <div>• Automatic rotation enabled</div>
        </div>
      </div>

      {hoveredPoint && (
        <div className="absolute bottom-4 left-4 bg-blue-600 text-white p-3 rounded-lg">
          <h4 className="font-bold">Hovered Point</h4>
          <div className="text-sm mt-1">
            <div><strong>Position:</strong> ({hoveredPoint.join(', ')})</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chart3DSimple;

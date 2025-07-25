import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';
import * as THREE from 'three';

// Simple 3D Bar component
const SimpleBar3D = ({ position, height, color, label, value, showAnimation }) => {
  const meshRef = useRef();
  
  // Only animate if showAnimation is true
  useFrame((state) => {
    if (meshRef.current && showAnimation) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime + position[0]) * 0.05;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} position={[0, height / 2, 0]}>
        <boxGeometry args={[0.8, height, 0.8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Add label text above the bar */}
      <Text
        position={[0, height + 0.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
      {/* Add value text below the bar */}
      <Text
        position={[0, -0.3, 0]}
        fontSize={0.2}
        color="lightgray"
        anchorX="center"
        anchorY="middle"
      >
        {value}
      </Text>
    </group>
  );
};

// Simple 3D Scatter Point
const SimpleScatterPoint = ({ position, color, label, onHover, showAnimation }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(hovered ? 1.5 : 1);
      // Only auto-animate if showAnimation is true
      if (showAnimation) {
        meshRef.current.rotation.x += 0.01;
      }
    }
  });

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    onHover && onHover({ position, label });
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
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
      {/* Add label for scatter point */}
      {label && (
        <Text
          position={[0, 0.4, 0]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      )}
    </group>
  );
};

// Fixed Grid and Axes - Combined into one stable component
const GridAndAxes = ({ xLabel = 'X-Axis', yLabel = 'Y-Axis', zLabel = 'Z-Axis' }) => {
  const gridRef = useRef();
  
  return (
    <group>
      {/* Grid Helper - Fixed and non-draggable */}
      <gridHelper 
        ref={gridRef}
        args={[20, 20, '#444444', '#666666']} 
        position={[0, 0, 0]}
      />
      
      {/* X-Axis Line (Red) */}
      <Line
        points={[[-10, 0, 0], [10, 0, 0]]}
        color="red"
        lineWidth={5}
      />
      <Text
        position={[11, 0, 0]}
        fontSize={0.6}
        color="red"
        anchorX="center"
        anchorY="middle"
        font="Arial"
      >
        {xLabel}
      </Text>
      
      {/* Y-Axis Line (Green) */}
      <Line
        points={[[0, 0, 0], [0, 10, 0]]}
        color="green"
        lineWidth={5}
      />
      <Text
        position={[0, 11, 0]}
        fontSize={0.6}
        color="green"
        anchorX="center"
        anchorY="middle"
        font="Arial"
      >
        {yLabel}
      </Text>
      
      {/* Z-Axis Line (Blue) */}
      <Line
        points={[[0, 0, -10], [0, 0, 10]]}
        color="blue"
        lineWidth={5}
      />
      <Text
        position={[0, 0, 11]}
        fontSize={0.6}
        color="blue"
        anchorX="center"
        anchorY="middle"
        font="Arial"
      >
        {zLabel}
      </Text>
    </group>
  );
};

const Chart3DSimple = ({ chartData, chartConfig }) => {
  console.log('Chart3DSimple component called with:', { chartData, chartConfig });
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);

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
          const scaleFactor = maxValue > 0 ? 5 / maxValue : 1; // Scale to max height of 5 units
          
          const bars = chartData.labels.map((label, index) => {
            const dataValue = chartData.datasets[0].data[index];
            const height = Math.max(dataValue * scaleFactor, 0.2); // Minimum height of 0.2
            
            return (
              <SimpleBar3D
                key={index}
                position={[(index - chartData.labels.length / 2) * 1.5, 0, 0]}
                height={height}
                color={colors[index % colors.length]}
                label={String(label)} // Ensure it's a string
                value={String(dataValue)} // Show actual value
                showAnimation={showAnimation}
              />
            );
          });
          return <group>{bars}</group>;

        case 'scatter3d':
          if (!chartData.datasets || !chartData.datasets[0] || !chartData.datasets[0].data) {
            console.log('Scatter3D: Missing data structure', { chartData });
            return null;
          }
          
          const scatterData = chartData.datasets[0].data;
          console.log('Scatter3D: Processing data', { scatterData, chartConfig });
          
          // Find min/max values for proper scaling
          const xValues = scatterData.map(p => typeof p === 'object' ? p.x : 0).filter(v => !isNaN(v));
          const yValues = scatterData.map(p => typeof p === 'object' ? p.y : 0).filter(v => !isNaN(v));
          const zValues = scatterData.map(p => typeof p === 'object' ? (p.z || 0) : 0).filter(v => !isNaN(v));
          
          if (xValues.length === 0 || yValues.length === 0) {
            console.log('Scatter3D: No valid X or Y values found', { xValues, yValues });
            return null;
          }
          
          const xRange = Math.max(...xValues) - Math.min(...xValues) || 1;
          const yRange = Math.max(...yValues) - Math.min(...yValues) || 1;
          const zRange = Math.max(...zValues) - Math.min(...zValues) || 1;
          
          console.log('Scatter3D: Value ranges', { xRange, yRange, zRange });
          
          const scatter3DData = scatterData.map((point, index) => {
            if (typeof point === 'object' && point.x !== undefined && point.y !== undefined) {
              return {
                x: ((point.x - Math.min(...xValues)) / xRange - 0.5) * 8, // Scale to -4 to +4
                y: ((point.y - Math.min(...yValues)) / yRange) * 6, // Scale to 0 to 6
                z: ((point.z || 0 - Math.min(...zValues)) / zRange - 0.5) * 8
              };
            } else {
              return {
                x: (index / scatterData.length - 0.5) * 8,
                y: (typeof point === 'number' ? point : 0) * 0.05,
                z: Math.random() * 4 - 2
              };
            }
          });
          
          console.log('Scatter3D: Final positioned data', scatter3DData.slice(0, 5));
          
          return (
            <group>
              {scatter3DData.map((point, index) => {
                // Get the corresponding label from chartData.labels
                const label = chartData.labels && chartData.labels[index] 
                  ? String(chartData.labels[index]) 
                  : `Point ${index + 1}`;
                
                return (
                  <SimpleScatterPoint
                    key={index}
                    position={[point.x, point.y, point.z]}
                    color={colors[index % colors.length]}
                    label={label}
                    onHover={setHoveredPoint}
                    showAnimation={showAnimation}
                  />
                );
              })}
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
                const label = chartData.labels[dataIndex] || `Point ${dataIndex + 1}`;
                points.push(
                  <SimpleScatterPoint
                    key={`${i}-${j}`}
                    position={[
                      (j - size / 2) * 0.8,
                      value * 0.05,
                      (i - size / 2) * 0.8
                    ]}
                    color={colors[dataIndex % colors.length]}
                    label={String(label)}
                    onHover={setHoveredPoint}
                    showAnimation={showAnimation}
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
      {/* Control Panel */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-80 text-white p-3 rounded-lg z-20 border border-gray-600">
        <h4 className="font-bold mb-2 text-emerald-400">3D Chart Controls</h4>
        <div className="space-y-2 text-sm">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRotate}
              onChange={(e) => setAutoRotate(e.target.checked)}
              className="rounded"
            />
            <span>Auto Rotate Camera</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showAnimation}
              onChange={(e) => setShowAnimation(e.target.checked)}
              className="rounded"
            />
            <span>Element Animations</span>
          </label>
        </div>
        <div className="text-xs text-gray-300 mt-3 border-t border-gray-600 pt-2">
          <div>• Drag to rotate view</div>
          <div>• Scroll to zoom in/out</div>
          <div>• Hover on points for info</div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-96 w-full bg-gray-900 rounded-lg border border-gray-700">
        <Canvas 
          camera={{ position: [12, 8, 12], fov: 60 }}
          dpr={[1, 2]}
          antialias={true}
          onCreated={({ gl }) => {
            gl.antialias = true;
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }}
        >
          {/* Enhanced Lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1} 
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-10, -10, -10]} intensity={0.4} />
          <pointLight position={[10, 5, 10]} intensity={0.3} color="#4ECDC4" />
          
          {/* Camera Controls - User has full control */}
          <OrbitControls 
            autoRotate={autoRotate}
            autoRotateSpeed={1}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={50}
            enableDamping={true}
            dampingFactor={0.05}
          />
          
          {/* Fixed Grid and Axes - Never separate */}
          <GridAndAxes 
            xLabel={chartConfig.xAxis || 'X-Axis'}
            yLabel={chartConfig.yAxis || 'Y-Axis'}
            zLabel={chartConfig.chartType === 'scatter3d' ? 'Z-Value' : 'Height'}
          />
          
          {/* Render the actual chart */}
          {render3DChart()}
        </Canvas>
      </div>

      {/* Chart Information Panel */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-80 text-white p-3 rounded-lg max-w-xs border border-gray-600">
        <h4 className="font-bold mb-2 text-cyan-400">{chartConfig.title || '3D Chart'}</h4>
        <div className="text-xs text-gray-300 space-y-1">
          <div><strong>Type:</strong> <span className="text-yellow-400">{chartConfig.chartType?.toUpperCase()}</span></div>
          <div><strong>X-Axis:</strong> {chartConfig.xAxis}</div>
          <div><strong>Y-Axis:</strong> {chartConfig.yAxis}</div>
          {chartData.labels && (
            <div><strong>Data Points:</strong> <span className="text-green-400">{chartData.labels.length}</span></div>
          )}
          {chartData.datasets && chartData.datasets[0] && (
            <div><strong>Dataset:</strong> {chartData.datasets[0].label || 'Unnamed'}</div>
          )}
        </div>
      </div>

      {/* Hover Information */}
      {hoveredPoint && (
        <div className="absolute bottom-4 left-4 bg-blue-600 bg-opacity-90 text-white p-3 rounded-lg border border-blue-400">
          <h4 className="font-bold text-blue-200">Point Details</h4>
          <div className="text-sm mt-1 space-y-1">
            {hoveredPoint.label && <div><strong>Label:</strong> {hoveredPoint.label}</div>}
            {hoveredPoint.position && (
              <div><strong>Position:</strong> ({hoveredPoint.position.map(p => Number(p).toFixed(2)).join(', ')})</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chart3DSimple;

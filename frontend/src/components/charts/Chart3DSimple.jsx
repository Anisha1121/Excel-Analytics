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
      meshRef.current.scale.setScalar(hovered ? 1.8 : 1.2); // Make bigger and more visible
      // Only auto-animate if showAnimation is true
      if (showAnimation) {
        meshRef.current.rotation.x += 0.01;
        meshRef.current.rotation.y += 0.01;
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
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial 
          color={hovered ? '#FFD700' : color}
          emissive={hovered ? '#FFD700' : color}
          emissiveIntensity={hovered ? 0.4 : 0.2}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      {/* Add label for scatter point */}
      {label && (
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="Arial"
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
          const barMaxValue = Math.max(...chartData.datasets[0].data);
          const scaleFactor = barMaxValue > 0 ? 5 / barMaxValue : 1; // Scale to max height of 5 units
          
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
          
          // Handle different data formats
          let processedData = [];
          
          if (Array.isArray(scatterData) && scatterData.length > 0) {
            processedData = scatterData.map((point, index) => {
              // Handle object format {x: value, y: value} or {x: value, y: value, z: value}
              if (typeof point === 'object' && point !== null && 
                  typeof point.x === 'number' && typeof point.y === 'number') {
                return {
                  x: point.x,
                  y: point.y,
                  z: point.z || Math.random() * 2 - 1, // Random Z if not provided
                  label: chartData.labels?.[index] || `Point ${index + 1}`
                };
              }
              // Handle simple number format
              else if (typeof point === 'number') {
                return {
                  x: index,
                  y: point,
                  z: Math.random() * 2 - 1,
                  label: chartData.labels?.[index] || `Point ${index + 1}`
                };
              }
              // Handle array format [x, y] or [x, y, z]
              else if (Array.isArray(point) && point.length >= 2) {
                return {
                  x: point[0],
                  y: point[1],
                  z: point[2] || Math.random() * 2 - 1,
                  label: chartData.labels?.[index] || `Point ${index + 1}`
                };
              }
              // Default fallback
              else {
                return {
                  x: index,
                  y: 0,
                  z: Math.random() * 2 - 1,
                  label: chartData.labels?.[index] || `Point ${index + 1}`
                };
              }
            });
          }
          
          if (processedData.length === 0) {
            console.log('Scatter3D: No valid data points found');
            return (
              <group>
                <Text position={[0, 3, 0]} fontSize={0.5} color="red" anchorX="center">
                  No scatter data available
                </Text>
              </group>
            );
          }
          
          // Find ranges for scaling
          const xValues = processedData.map(p => p.x);
          const yValues = processedData.map(p => p.y);
          const zValues = processedData.map(p => p.z);
          
          const xMin = Math.min(...xValues);
          const xMax = Math.max(...xValues);
          const yMin = Math.min(...yValues);
          const yMax = Math.max(...yValues);
          const zMin = Math.min(...zValues);
          const zMax = Math.max(...zValues);
          
          const xRange = xMax - xMin || 1;
          const yRange = yMax - yMin || 1;
          const zRange = zMax - zMin || 1;
          
          console.log('Scatter3D: Data ranges', { 
            xRange: [xMin, xMax], 
            yRange: [yMin, yMax], 
            zRange: [zMin, zMax] 
          });
          
          return (
            <group>
              {processedData.map((point, index) => {
                // Scale to visible range (-4 to +4 for X and Z, 0 to 8 for Y)
                const scaledX = ((point.x - xMin) / xRange - 0.5) * 8;
                const scaledY = ((point.y - yMin) / yRange) * 6 + 1; // Add 1 to lift above grid
                const scaledZ = ((point.z - zMin) / zRange - 0.5) * 8;
                
                return (
                  <SimpleScatterPoint
                    key={index}
                    position={[scaledX, scaledY, scaledZ]}
                    color={colors[index % colors.length]}
                    label={point.label}
                    onHover={setHoveredPoint}
                    showAnimation={showAnimation}
                  />
                );
              })}
            </group>
          );

        case 'surface3d':
          if (!chartData.labels || !chartData.datasets || !chartData.datasets[0]) {
            console.log('Surface3D: Missing required data', { chartData });
            return (
              <group>
                <Text position={[0, 3, 0]} fontSize={0.5} color="red" anchorX="center">
                  No surface data available
                </Text>
              </group>
            );
          }
          
          const surfaceData = chartData.datasets[0].data;
          const surfaceLabels = chartData.labels;
          
          if (!surfaceData || surfaceData.length === 0) {
            return (
              <group>
                <Text position={[0, 3, 0]} fontSize={0.5} color="orange" anchorX="center">
                  No surface data points
                </Text>
              </group>
            );
          }
          
          // Create a grid layout for surface visualization
          const size = Math.ceil(Math.sqrt(surfaceData.length));
          const points = [];
          
          // Find min/max values for proper scaling
          const surfaceMinValue = Math.min(...surfaceData.filter(v => typeof v === 'number' && !isNaN(v)));
          const surfaceMaxValue = Math.max(...surfaceData.filter(v => typeof v === 'number' && !isNaN(v)));
          const valueRange = surfaceMaxValue - surfaceMinValue || 1;
          
          console.log('Surface3D: Value range', { minValue: surfaceMinValue, maxValue: surfaceMaxValue, valueRange, dataLength: surfaceData.length });
          
          for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
              const dataIndex = i * size + j;
              if (dataIndex < surfaceData.length) {
                const value = surfaceData[dataIndex];
                const numericValue = typeof value === 'number' ? value : 0;
                const label = surfaceLabels?.[dataIndex] || `Point ${dataIndex + 1}`;
                
                // Scale the height to be visible (1 to 6 units)
                const scaledHeight = ((numericValue - surfaceMinValue) / valueRange) * 5 + 1;
                
                // Position points in a grid layout
                const x = (j - size / 2) * 1.2; // Spread points wider
                const z = (i - size / 2) * 1.2;
                
                points.push(
                  <SimpleScatterPoint
                    key={`surface-${i}-${j}`}
                    position={[x, scaledHeight, z]}
                    color={colors[dataIndex % colors.length]}
                    label={String(label)}
                    onHover={setHoveredPoint}
                    showAnimation={showAnimation}
                  />
                );
              }
            }
          }
          
          console.log('Surface3D: Generated points', points.length);
          
          if (points.length === 0) {
            return (
              <group>
                <Text position={[0, 3, 0]} fontSize={0.5} color="yellow" anchorX="center">
                  Failed to generate surface points
                </Text>
              </group>
            );
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

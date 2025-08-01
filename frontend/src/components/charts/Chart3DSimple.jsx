import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import ChartDataTable from './ChartDataTable';

// Enhanced 3D Surface component with smooth interpolation
const EnhancedSurface3D = ({ surfaceData, surfaceLabels, size, colors, showAnimation, onHover }) => {
  const surfaceRef = useRef();
  const [hoveredSegment, setHoveredSegment] = useState(null);

  // Create smooth surface geometry
  const surfaceGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(size * 2, size * 2, size - 1, size - 1);
    const positions = geometry.attributes.position.array;
    const colors = new Float32Array(positions.length);
    
    // Find value range for proper scaling and coloring
    const values = surfaceData.filter(v => typeof v === 'number' && !isNaN(v));
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue || 1;
    
    // Apply height and colors to vertices
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const z = positions[i + 2];
      
      // Calculate grid position
      const gridX = Math.round((x + size) / 2);
      const gridZ = Math.round((z + size) / 2);
      const dataIndex = gridZ * size + gridX;
      
      // Get height value
      const value = surfaceData[dataIndex] || 0;
      const normalizedValue = typeof value === 'number' ? (value - minValue) / valueRange : 0;
      const height = normalizedValue * 6; // Scale height
      
      positions[i + 1] = height; // Set Y position (height)
      
      // Create gradient coloring based on height (like the reference image)
      const hue = (1 - normalizedValue) * 0.75; // Blue (high) to red (low) spectrum
      const saturation = 0.9;
      const lightness = 0.4 + (normalizedValue * 0.4); // Darker at bottom, lighter at top
      const color = new THREE.Color().setHSL(hue, saturation, lightness);
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }
    
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.computeVertexNormals();
    return geometry;
  }, [surfaceData, size]);

  // Animation
  useFrame((state) => {
    if (surfaceRef.current && showAnimation) {
      surfaceRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <group>
      {/* Main surface */}
      <mesh 
        ref={surfaceRef} 
        geometry={surfaceGeometry}
        onPointerOver={(e) => {
          e.stopPropagation();
          const point = e.point;
          const x = point.x;
          const z = point.z;
          
          // Map back to data index
          const u = (x + 4) / 8;
          const v = (z + 4) / 8;
          const dataX = Math.floor(u * (size - 1));
          const dataY = Math.floor(v * (size - 1));
          const dataIndex = dataY * size + dataX;
          
          if (dataIndex < surfaceData.length && typeof surfaceData[dataIndex] === 'number') {
            const value = surfaceData[dataIndex];
            setHoveredSegment({ position: e.point, value: value.toFixed(2) });
            onHover && onHover({ 
              position: [x, point.y, z], 
              value: value.toFixed(2), 
              index: dataIndex,
              type: 'surface' 
            });
          }
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHoveredSegment(null);
          onHover && onHover(null);
          document.body.style.cursor = 'auto';
        }}
      >
        <meshStandardMaterial 
          vertexColors={true}
          side={THREE.DoubleSide}
          transparent={true}
          opacity={0.9}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      
      {/* Wireframe overlay for better definition */}
      <mesh geometry={surfaceGeometry}>
        <meshBasicMaterial 
          wireframe={true}
          color="#ffffff"
          transparent={true}
          opacity={0.1}
        />
      </mesh>
    </group>
  );
};

// Layered Surface Component (like your reference image)
const LayeredSurface3D = ({ surfaceData, surfaceLabels, size, colors, showAnimation, onHover }) => {
  const groupRef = useRef();
  const [hoveredPoint, setHoveredPoint] = useState(null);
  
  // Create surface layers with smooth transitions like in the reference image
  const surfaceGeometry = useMemo(() => {
    const segments = size - 1;
    const planeGeometry = new THREE.PlaneGeometry(8, 8, segments, segments);
    const vertices = planeGeometry.attributes.position.array;
    
    // Apply data values to Z coordinates (height)
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const y = vertices[i + 1];
      
      // Map position to data index
      const u = (x + 4) / 8; // Normalize to 0-1
      const v = (y + 4) / 8; // Normalize to 0-1
      const dataX = Math.floor(u * (size - 1));
      const dataY = Math.floor(v * (size - 1));
      const dataIndex = dataY * size + dataX;
      
      if (dataIndex < surfaceData.length && typeof surfaceData[dataIndex] === 'number') {
        // Scale the height based on data value
        vertices[i + 2] = (surfaceData[dataIndex] / Math.max(...surfaceData)) * 4;
      }
    }
    
    // Create color gradient like in reference image
    const colorAttribute = new THREE.BufferAttribute(new Float32Array(vertices.length), 3);
    for (let i = 0; i < vertices.length; i += 3) {
      const height = vertices[i + 2];
      const normalizedHeight = height / 4; // 0 to 1
      
      // Create multi-color gradient: Blue -> Green -> Yellow -> Red
      let r, g, b;
      if (normalizedHeight < 0.25) {
        // Blue to Green
        const t = normalizedHeight * 4;
        r = 0;
        g = t;
        b = 1 - t;
      } else if (normalizedHeight < 0.5) {
        // Green to Yellow
        const t = (normalizedHeight - 0.25) * 4;
        r = t;
        g = 1;
        b = 0;
      } else if (normalizedHeight < 0.75) {
        // Yellow to Orange
        const t = (normalizedHeight - 0.5) * 4;
        r = 1;
        g = 1 - t * 0.5;
        b = 0;
      } else {
        // Orange to Red
        const t = (normalizedHeight - 0.75) * 4;
        r = 1;
        g = 0.5 - t * 0.5;
        b = 0;
      }
      
      colorAttribute.setXYZ(i / 3, r, g, b);
    }
    
    planeGeometry.setAttribute('color', colorAttribute);
    planeGeometry.computeVertexNormals();
    return planeGeometry;
  }, [surfaceData, size]);

  // Animation
  useFrame((state) => {
    if (groupRef.current && showAnimation) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  const handleSurfaceHover = (e) => {
    e.stopPropagation();
    const point = e.point;
    const x = point.x;
    const z = point.z;
    
    // Map back to data index
    const u = (x + 4) / 8;
    const v = (z + 4) / 8;
    const dataX = Math.floor(u * (size - 1));
    const dataY = Math.floor(v * (size - 1));
    const dataIndex = dataY * size + dataX;
    
    if (dataIndex < surfaceData.length && typeof surfaceData[dataIndex] === 'number') {
      const value = surfaceData[dataIndex];
      onHover && onHover({ 
        position: [x, point.y, z], 
        value: value.toFixed(2), 
        index: dataIndex,
        type: 'surface' 
      });
    }
    document.body.style.cursor = 'pointer';
  };

  const handleSurfaceOut = (e) => {
    e.stopPropagation();
    onHover && onHover(null);
    document.body.style.cursor = 'auto';
  };

  return (
    <group ref={groupRef}>
      {/* Main layered surface */}
      <mesh 
        geometry={surfaceGeometry}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 2, 0]}
        onPointerOver={handleSurfaceHover}
        onPointerOut={handleSurfaceOut}
      >
        <meshStandardMaterial 
          vertexColors={true}
          side={THREE.DoubleSide}
          transparent={true}
          opacity={0.9}
          roughness={0.2}
          metalness={0.1}
          wireframe={false}
        />
      </mesh>
      
      {/* Add wireframe overlay for structure definition */}
      <mesh 
        geometry={surfaceGeometry}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 2.01, 0]}
      >
        <meshBasicMaterial 
          wireframe={true}
          color="#333333"
          transparent={true}
          opacity={0.2}
        />
      </mesh>
      
      {/* Multiple transparent layers for depth effect */}
      {[0, 1, 2].map((layer) => (
        <mesh 
          key={layer}
          geometry={surfaceGeometry}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 2 - layer * 0.3, 0]}
        >
          <meshStandardMaterial 
            vertexColors={true}
            side={THREE.DoubleSide}
            transparent={true}
            opacity={0.3 - layer * 0.1}
            roughness={0.3}
            metalness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
};

// Simple 3D Bar component
const SimpleBar3D = ({ position, height, color, label, value, showAnimation, onHover }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Only animate if showAnimation is true
  useFrame((state) => {
    if (meshRef.current && showAnimation) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime + position[0]) * 0.05;
    }
  });

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    onHover && onHover({ position, label, value, type: 'bar' });
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHovered(false);
    onHover && onHover(null);
    document.body.style.cursor = 'auto';
  };

  return (
    <group position={position}>
      <mesh 
        ref={meshRef} 
        position={[0, height / 2, 0]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[0.8, height, 0.8]} />
        <meshStandardMaterial 
          color={hovered ? '#FFD700' : color}
          emissive={hovered ? '#FFD700' : color}
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
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
    '#1E3A8A', '#3B82F6', '#06B6D4', '#10B981', '#84CC16', 
    '#EAB308', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6',
    '#6366F1', '#14B8A6', '#22C55E', '#FDE047', '#FB923C'
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
                onHover={setHoveredPoint}
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
          const originalData = chartData.originalData;
          console.log('Scatter3D: Processing data', { scatterData, originalData, chartConfig });
          
          // Handle different data formats
          let processedData = [];
          
          if (Array.isArray(scatterData) && scatterData.length > 0) {
            processedData = scatterData.map((point, index) => {
              // Get proper label from original data or X-axis value
              let label = `Point ${index + 1}`;
              
              if (originalData && originalData[index]) {
                // Use the X-axis column value as the label instead of date
                const xAxisValue = originalData[index][chartConfig.xAxis];
                if (xAxisValue && typeof xAxisValue === 'string' && !xAxisValue.includes('/') && !xAxisValue.includes('-')) {
                  label = xAxisValue;
                } else if (originalData[index].label) {
                  label = originalData[index].label;
                } else {
                  // Try to find a meaningful name column
                  const nameColumns = ['name', 'title', 'product', 'item', 'category', 'description'];
                  for (const col of nameColumns) {
                    if (originalData[index][col] && typeof originalData[index][col] === 'string') {
                      label = originalData[index][col];
                      break;
                    }
                  }
                }
              } else if (chartData.labels && chartData.labels[index]) {
                label = chartData.labels[index];
              }
              
              // Handle object format {x: value, y: value} or {x: value, y: value, z: value}
              if (typeof point === 'object' && point !== null && 
                  typeof point.x === 'number' && typeof point.y === 'number') {
                return {
                  x: point.x,
                  y: point.y,
                  z: point.z || Math.random() * 2 - 1, // Random Z if not provided
                  label: label,
                  originalData: originalData ? originalData[index] : null
                };
              }
              // Handle simple number format
              else if (typeof point === 'number') {
                return {
                  x: index,
                  y: point,
                  z: Math.random() * 2 - 1,
                  label: label,
                  originalData: originalData ? originalData[index] : null
                };
              }
              // Handle array format [x, y] or [x, y, z]
              else if (Array.isArray(point) && point.length >= 2) {
                return {
                  x: point[0],
                  y: point[1],
                  z: point[2] || Math.random() * 2 - 1,
                  label: label,
                  originalData: originalData ? originalData[index] : null
                };
              }
              // Default fallback
              else {
                return {
                  x: index,
                  y: 0,
                  z: Math.random() * 2 - 1,
                  label: label,
                  originalData: originalData ? originalData[index] : null
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
          
          // Determine grid size for surface
          const surfaceSize = Math.max(4, Math.ceil(Math.sqrt(surfaceData.length)));
          
          console.log('Surface3D: Creating enhanced surface', { 
            dataLength: surfaceData.length, 
            surfaceSize,
            sampleData: surfaceData.slice(0, 5) 
          });
          
          return (
            <group>
              {/* Title above the surface */}
              <Text 
                position={[0, 8, 0]} 
                fontSize={0.8} 
                color="#4ECDC4" 
                anchorX="center"
                anchorY="middle"
              >
                {chartConfig.title || 'Excel 3D Surface Plot'}
              </Text>
              
              {/* Choose between enhanced smooth surface or layered surface */}
              {surfaceData.length > 16 ? (
                <EnhancedSurface3D
                  surfaceData={surfaceData}
                  surfaceLabels={surfaceLabels}
                  size={surfaceSize}
                  colors={colors}
                  showAnimation={showAnimation}
                  onHover={setHoveredPoint}
                />
              ) : (
                <LayeredSurface3D
                  surfaceData={surfaceData}
                  surfaceLabels={surfaceLabels}
                  size={surfaceSize}
                  colors={colors}
                  showAnimation={showAnimation}
                  onHover={setHoveredPoint}
                />
              )}
              
              {/* Legend for surface values */}
              <group position={[surfaceSize + 2, 3, 0]}>
                <Text position={[0, 2, 0]} fontSize={0.4} color="white" anchorX="center">
                  Value Range
                </Text>
                {[0, 1, 2, 3, 4].map((level) => {
                  const height = level * 1.2;
                  const color = new THREE.Color().setHSL(level * 0.15, 0.8, 0.6);
                  return (
                    <group key={level} position={[0, height, 0]}>
                      <mesh>
                        <boxGeometry args={[0.3, 0.2, 0.3]} />
                        <meshStandardMaterial color={color} />
                      </mesh>
                      <Text 
                        position={[0.8, 0, 0]} 
                        fontSize={0.2} 
                        color="lightgray"
                        anchorX="left"
                      >
                        {`Level ${level + 1}`}
                      </Text>
                    </group>
                  );
                })}
              </group>
            </group>
          );

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
          {/* Enhanced Lighting for beautiful surface visualization */}
          <ambientLight intensity={0.4} color="#f0f8ff" />
          <directionalLight 
            position={[15, 20, 10]} 
            intensity={1.2} 
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          {/* Multiple colored lights for gradient effect */}
          <pointLight position={[-8, 8, 8]} intensity={0.6} color="#4F46E5" />
          <pointLight position={[8, 8, -8]} intensity={0.6} color="#06B6D4" />
          <pointLight position={[0, 15, 0]} intensity={0.4} color="#10B981" />
          <spotLight 
            position={[0, 25, 0]} 
            angle={0.3} 
            penumbra={0.5} 
            intensity={0.8}
            color="#ffffff"
            castShadow
          />
          
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
          <h4 className="font-bold text-blue-200">
            {hoveredPoint.type === 'bar' ? 'Bar Details' : 
             hoveredPoint.type === 'surface' ? 'Surface Point' : 'Point Details'}
          </h4>
          <div className="text-sm mt-1 space-y-1">
            {hoveredPoint.label && <div><strong>Label:</strong> {hoveredPoint.label}</div>}
            {hoveredPoint.value && <div><strong>Value:</strong> {hoveredPoint.value}</div>}
            {hoveredPoint.index !== undefined && <div><strong>Index:</strong> {hoveredPoint.index}</div>}
            {hoveredPoint.position && (
              <div><strong>Position:</strong> ({hoveredPoint.position.map(p => Number(p).toFixed(2)).join(', ')})</div>
            )}
          </div>
        </div>
      )}

      {/* Data Table for 3D Charts */}
      {(chartConfig.chartType === 'scatter3d' || chartConfig.chartType === 'surface3d' || chartConfig.chartType === 'bar3d') && 
       chartData.datasets && chartData.datasets[0] && chartData.datasets[0].data && (
        <div className="absolute top-20 right-4 max-w-xs" style={{ maxHeight: '300px', fontSize: '0.75rem' }}>
          <ChartDataTable
            data={(() => {
              if (chartConfig.chartType === 'scatter3d') {
                const scatterData = chartData.datasets[0].data;
                const originalData = chartData.originalData;
                
                return scatterData.slice(0, 8).map((point, index) => { // Limit to first 8 points
                  // Get proper label from original data or X-axis value
                  let label = `Point ${index + 1}`;
                  let xLabel = index;
                  
                  if (originalData && originalData[index]) {
                    // Use the X-axis column value as the label instead of date
                    const xAxisValue = originalData[index][chartConfig.xAxis];
                    if (xAxisValue && typeof xAxisValue === 'string' && !xAxisValue.includes('/') && !xAxisValue.includes('-')) {
                      label = xAxisValue;
                      xLabel = xAxisValue;
                    } else if (originalData[index].label) {
                      label = originalData[index].label;
                    } else {
                      // Try to find a meaningful name column
                      const nameColumns = ['name', 'title', 'product', 'item', 'category', 'description'];
                      for (const col of nameColumns) {
                        if (originalData[index][col] && typeof originalData[index][col] === 'string') {
                          label = originalData[index][col];
                          break;
                        }
                      }
                    }
                    xLabel = xAxisValue || index;
                  } else if (chartData.labels && chartData.labels[index]) {
                    label = chartData.labels[index];
                    xLabel = chartData.labels[index];
                  }
                  
                  // Handle different point formats
                  if (typeof point === 'object' && point !== null && 
                      typeof point.x === 'number' && typeof point.y === 'number') {
                    return {
                      x: point.x,
                      y: point.y,
                      z: point.z || 0,
                      label: label,
                      xLabel: xLabel
                    };
                  } else if (typeof point === 'number') {
                    return {
                      x: index,
                      y: point,
                      z: 0,
                      label: label,
                      xLabel: xLabel
                    };
                  } else if (Array.isArray(point) && point.length >= 2) {
                    return {
                      x: point[0],
                      y: point[1],
                      z: point[2] || 0,
                      label: label,
                      xLabel: xLabel
                    };
                  } else {
                    return {
                      x: index,
                      y: 0,
                      z: 0,
                      label: label,
                      xLabel: xLabel
                    };
                  }
                });
              } else if (chartConfig.chartType === 'bar3d') {
                return chartData.labels.slice(0, 6).map((label, index) => ({ // Limit to first 6 bars
                  label: label,
                  value: chartData.datasets[0].data[index]
                }));
              } else if (chartConfig.chartType === 'surface3d') {
                const surfaceData = chartData.datasets[0].data;
                const size = Math.ceil(Math.sqrt(surfaceData.length));
                return surfaceData.slice(0, 12).map((value, index) => { // Limit to first 12 points
                  const row = Math.floor(index / size);
                  const col = index % size;
                  return {
                    row: row,
                    col: col,
                    value: value
                  };
                });
              }
              return [];
            })()}
            type={chartConfig.chartType}
            title={`${chartConfig.chartType.toUpperCase()} Data (Preview)`}
          />
        </div>
      )}
    </div>
  );
};

export default Chart3DSimple;

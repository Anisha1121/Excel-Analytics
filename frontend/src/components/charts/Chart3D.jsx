import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Bar3D = ({ position, height, color, label, value }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime + position[0]) * 0.05;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, height, 0.8]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.3}
          roughness={0.4}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>
      <Text
        position={[0, -0.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
      <Text
        position={[0, height + 0.5, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {value}
      </Text>
    </group>
  );
};

const InteractiveScatterPoint = ({ position, color, label, value, originalData, onHover, onLeave, onClick }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(hovered ? 1.5 : 1);
    }
  });

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    onHover && onHover({ position, label, value, originalData });
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHovered(false);
    onLeave && onLeave();
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onClick && onClick({ position, label, value, originalData });
  };

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color={hovered ? '#FFD700' : color}
          emissive={hovered ? '#FFD700' : color}
          emissiveIntensity={hovered ? 0.3 : 0.1}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      
      {/* Always visible label */}
      <Text
        position={[0, -0.3, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
      
      {/* Hover tooltip */}
      {hovered && (
        <Html
          position={[0, 0.5, 0]}
          center
          style={{
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          <div className="bg-black bg-opacity-80 text-white p-2 rounded text-xs whitespace-nowrap">
            <div><strong>{label}</strong></div>
            <div>Value: {typeof value === 'object' ? JSON.stringify(value) : value}</div>
            {originalData && (
              <div className="text-gray-300 text-xs mt-1">
                {Object.entries(originalData).map(([key, val]) => (
                  <div key={key}>{key}: {val}</div>
                ))}
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};

const Scatter3D = ({ data, colors, labels, originalData }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);

  const points = useMemo(() => {
    return data.map((point, index) => (
      <InteractiveScatterPoint
        key={index}
        position={[point.x * 0.1, point.y * 0.1, point.z * 0.1]}
        color={colors[index % colors.length]}
        label={labels ? labels[index] : `Point ${index + 1}`}
        value={point}
        originalData={originalData ? originalData[index] : null}
        onHover={setHoveredPoint}
        onLeave={() => setHoveredPoint(null)}
        onClick={setSelectedPoint}
      />
    ));
  }, [data, colors, labels, originalData]);

  return (
    <group>
      {points}
      
      {/* Axes labels */}
      <Text
        position={[12, 0, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        X-Axis
      </Text>
      <Text
        position={[0, 12, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Y-Axis
      </Text>
      <Text
        position={[0, 0, 12]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Z-Axis
      </Text>
    </group>
  );
};

const InteractiveSurfacePoint = ({ position, value, label, originalData, color, onHover, onLeave, onClick }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(hovered ? 1.5 : 1);
    }
  });

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    onHover && onHover({ position, label, value, originalData });
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHovered(false);
    onLeave && onLeave();
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onClick && onClick({ position, label, value, originalData });
  };

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial 
          color={hovered ? '#FFD700' : color}
          emissive={hovered ? '#FFD700' : color}
          emissiveIntensity={hovered ? 0.4 : 0.1}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
      
      {/* Value label */}
      {hovered && (
        <Text
          position={[0, 0.3, 0]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {typeof value === 'number' ? value.toFixed(2) : value}
        </Text>
      )}
      
      {/* Hover tooltip */}
      {hovered && (
        <Html
          position={[0, 0.5, 0]}
          center
          style={{
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          <div className="bg-black bg-opacity-90 text-white p-2 rounded text-xs whitespace-nowrap">
            <div><strong>{label}</strong></div>
            <div>Value: {typeof value === 'number' ? value.toFixed(2) : value}</div>
            <div>Position: ({position[0].toFixed(1)}, {position[1].toFixed(1)}, {position[2].toFixed(1)})</div>
            {originalData && (
              <div className="text-gray-300 text-xs mt-1 max-w-48">
                {Object.entries(originalData).slice(0, 4).map(([key, val]) => (
                  <div key={key} className="truncate">{key}: {val}</div>
                ))}
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};

const Surface3D = ({ data, width, height, colors, labels, originalData }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);

  // Create the surface geometry
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(width, height, data.length - 1, data[0].length - 1);
    const vertices = geo.attributes.position.array;
    
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        const vertexIndex = (i * data[i].length + j) * 3;
        vertices[vertexIndex + 2] = data[i][j] * 0.1; // Z coordinate (height)
      }
    }
    
    geo.attributes.position.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, [data, width, height]);

  // Create interactive points on the surface
  const surfacePoints = useMemo(() => {
    const points = [];
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        const x = (j / (data[i].length - 1)) * width - width / 2;
        const z = (i / (data.length - 1)) * height - height / 2;
        const y = data[i][j] * 0.1;
        
        const pointIndex = i * data[i].length + j;
        const label = labels && labels[pointIndex] ? labels[pointIndex] : `Point (${i}, ${j})`;
        const originalPointData = originalData && originalData[pointIndex] ? originalData[pointIndex] : null;
        
        points.push(
          <InteractiveSurfacePoint
            key={`${i}-${j}`}
            position={[x, y, z]}
            value={data[i][j]}
            label={label}
            originalData={originalPointData}
            color={colors[pointIndex % colors.length]}
            onHover={setHoveredPoint}
            onLeave={() => setHoveredPoint(null)}
            onClick={setSelectedPoint}
          />
        );
      }
    }
    return points;
  }, [data, width, height, labels, originalData, colors]);

  return (
    <group>
      {/* Surface mesh */}
      <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial 
          color={colors[0]} 
          wireframe={false}
          side={THREE.DoubleSide}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Interactive surface points */}
      {surfacePoints}
      
      {/* Grid overlay for better visualization */}
      <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial 
          color="#ffffff" 
          wireframe={true}
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  );
};

const Chart3D = ({ chartData, chartConfig }) => {
  console.log('Chart3D component called with:', { chartData, chartConfig });
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [error, setError] = useState(null);

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#FFB6C1', '#87CEEB', '#F0E68C',
    '#FF7F50', '#20B2AA', '#778899', '#B0C4DE', '#FFFFE0',
    '#FF69B4', '#00CED1', '#32CD32', '#FFD700', '#DA70D6'
  ];

  if (error) {
    return (
      <div className="h-96 w-full bg-red-50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-bold">3D Chart Error</p>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!chartData || !chartConfig) {
    return (
      <div className="h-96 w-full bg-gray-50 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No chart data available for 3D visualization</p>
      </div>
    );
  }

  const render3DChart = () => {
    try {
      console.log('Rendering 3D chart with type:', chartConfig.chartType);
      
      switch (chartConfig.chartType) {
        case 'bar3d':
          if (!chartData.labels || !chartData.datasets || !chartData.datasets[0]) {
            return <div>No data for 3D bar chart</div>;
          }
          const bars = chartData.labels.map((label, index) => (
            <Bar3D
              key={index}
              position={[(index - chartData.labels.length / 2) * 1.5, 0, 0]}
              height={Math.max(chartData.datasets[0].data[index] * 0.01, 0.1)}
              color={colors[index % colors.length]}
              label={label}
              value={chartData.datasets[0].data[index]}
            />
          ));
          return <group>{bars}</group>;

        case 'scatter3d':
          console.log('Creating 3D scatter plot...');
          if (!chartData.datasets || !chartData.datasets[0] || !chartData.datasets[0].data) {
            console.warn('No data for 3D scatter plot');
            return <div>No data for 3D scatter plot</div>;
          }
          
          // Enhanced scatter3D with proper labels and original data
          const scatterData = chartData.datasets[0].data;
          console.log('Scatter data:', scatterData);
          
          const scatter3DData = scatterData.map((point, index) => {
            if (typeof point === 'object' && point.x !== undefined && point.y !== undefined) {
              return {
                x: point.x,
                y: point.y,
                z: point.z || (Math.random() * 10) // Use z if available, otherwise random
              };
            } else {
              return {
                x: index,
                y: typeof point === 'number' ? point : 0,
                z: Math.random() * 10
              };
            }
          });
          
          console.log('3D scatter data:', scatter3DData);
          
          // Generate labels from chart data with better logic
          const scatterLabels = [];
          if (chartData.labels) {
            // Use provided labels
            scatterLabels.push(...chartData.labels);
          } else {
            // Generate labels from original data or scatter data
            scatterData.forEach((point, index) => {
              if (typeof point === 'object' && point.label) {
                scatterLabels.push(point.label);
              } else if (chartData.originalData && chartData.originalData[index]) {
                const original = chartData.originalData[index];
                // Try to find a meaningful label from original data
                const label = original.label || original.name || original.title || 
                             original.product || original.item || original.category || 
                             `Data Point ${index + 1}`;
                scatterLabels.push(String(label));
              } else {
                scatterLabels.push(`Data Point ${index + 1}`);
              }
            });
          }
          
          console.log('Scatter labels:', scatterLabels);
          
          // Pass original data for detailed tooltips
          const originalScatterData = scatterData.map((point, index) => {
            if (typeof point === 'object') {
              return point;
            } else {
              return {
                value: point,
                index: index,
                label: scatterLabels[index]
              };
            }
          });
          
          console.log('Original scatter data:', originalScatterData);
          
          return (
            <Scatter3D 
              data={scatter3DData} 
              colors={colors} 
              labels={scatterLabels}
              originalData={originalScatterData}
            />
          );

        case 'surface3d':
          if (!chartData.labels || !chartData.datasets || !chartData.datasets[0]) {
            return <div>No data for 3D surface</div>;
          }
          // Create surface data from chart data
          const surfaceData = [];
          const size = Math.ceil(Math.sqrt(chartData.labels.length));
          const surfaceLabels = [];
          const originalSurfaceData = [];
          
          for (let i = 0; i < size; i++) {
            const row = [];
            for (let j = 0; j < size; j++) {
              const dataIndex = i * size + j;
              const value = chartData.datasets[0].data[dataIndex] || 0;
              row.push(value);
              
              // Collect labels and original data for this point
              if (dataIndex < chartData.labels.length) {
                surfaceLabels.push(chartData.labels[dataIndex]);
                originalSurfaceData.push(chartData.originalData ? chartData.originalData[dataIndex] : null);
              } else {
                surfaceLabels.push(`Point (${i}, ${j})`);
                originalSurfaceData.push(null);
              }
            }
            surfaceData.push(row);
          }
          
          return (
            <Surface3D 
              data={surfaceData} 
              width={10} 
              height={10} 
              colors={colors}
              labels={surfaceLabels}
              originalData={originalSurfaceData}
            />
          );

        default:
          console.warn('Unknown 3D chart type:', chartConfig.chartType);
          return <div>Unknown 3D chart type: {chartConfig.chartType}</div>;
      }
    } catch (error) {
      console.error('Error rendering 3D chart:', error);
      setError(error.message);
      return <div>Error rendering 3D chart: {error.message}</div>;
    }
  };

  return (
    <div className="relative">
      {/* 3D Canvas */}
      <div className="h-96 w-full bg-gray-900 rounded-lg">
        <Canvas 
          camera={{ position: [10, 10, 10], fov: 60 }}
          shadows
          gl={{ antialias: true }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1.2} 
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          
          {render3DChart()}
          
          {/* Grid */}
          <gridHelper args={[20, 20, '#444', '#666']} />
          
          {/* Axes */}
          <group>
            <mesh position={[0, 0, 10]}>
              <cylinderGeometry args={[0.05, 0.05, 20]} />
              <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[10, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.05, 0.05, 20]} />
              <meshStandardMaterial color="#00FF00" emissive="#00FF00" emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[0, 10, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 20]} />
              <meshStandardMaterial color="#0000FF" emissive="#0000FF" emissiveIntensity={0.2} />
            </mesh>
          </group>
          
          {/* Ground plane for shadows */}
          <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[30, 30]} />
            <meshStandardMaterial color="#222" transparent opacity={0.8} />
          </mesh>
        </Canvas>
      </div>

      {/* Legend and Controls */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-3 rounded-lg max-w-xs">
        <h4 className="font-bold mb-2">Chart Legend</h4>
        {chartConfig.chartType === 'scatter3d' && (
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {/* Show first 10 labels with their data */}
            {chartData.originalData ? (
              chartData.originalData.slice(0, 10).map((item, index) => (
                <div key={index} className="flex items-center text-xs">
                  <div 
                    className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="truncate">
                    {item.label || item.name || item.title || item.product || `Row ${item.rowIndex || index + 1}`}
                  </span>
                </div>
              ))
            ) : chartData.labels ? (
              chartData.labels.slice(0, 10).map((label, index) => (
                <div key={index} className="flex items-center text-xs">
                  <div 
                    className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="truncate">{label}</span>
                </div>
              ))
            ) : (
              <div className="text-xs text-gray-400">No labels available</div>
            )}
            
            {((chartData.originalData && chartData.originalData.length > 10) || 
              (chartData.labels && chartData.labels.length > 10)) && (
              <div className="text-xs text-gray-400">
                ...and {(chartData.originalData?.length || chartData.labels?.length || 0) - 10} more
              </div>
            )}
          </div>
        )}
        
        <div className="mt-3 text-xs text-gray-300">
          <div>• Hover over points for details</div>
          <div>• Click and drag to rotate</div>
          <div>• Scroll to zoom</div>
        </div>
      </div>

      {/* Selected point info */}
      {selectedInfo && (
        <div className="absolute bottom-4 left-4 bg-blue-600 text-white p-3 rounded-lg">
          <h4 className="font-bold">Selected Point</h4>
          <div className="text-sm mt-1">
            <div><strong>Label:</strong> {selectedInfo.label}</div>
            <div><strong>Position:</strong> ({selectedInfo.position.join(', ')})</div>
            <div><strong>Value:</strong> {JSON.stringify(selectedInfo.value)}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chart3D;

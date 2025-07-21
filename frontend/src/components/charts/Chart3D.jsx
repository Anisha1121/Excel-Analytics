import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
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

const Scatter3D = ({ data, colors }) => {
  const points = useMemo(() => {
    return data.map((point, index) => (
      <mesh key={index} position={[point.x * 0.1, point.y * 0.1, point.z * 0.1]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={colors[index % colors.length]} />
      </mesh>
    ));
  }, [data, colors]);

  return <group>{points}</group>;
};

const Surface3D = ({ data, width, height, colors }) => {
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

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial 
        color={colors[0]} 
        wireframe={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const Chart3D = ({ chartData, chartConfig }) => {
  console.log('Chart3D component called with:', { chartData, chartConfig });

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#FFB6C1', '#87CEEB', '#F0E68C',
    '#FF7F50', '#20B2AA', '#778899', '#B0C4DE', '#FFFFE0',
    '#FF69B4', '#00CED1', '#32CD32', '#FFD700', '#DA70D6'
  ];

  if (!chartData || !chartConfig) {
    return (
      <div className="h-96 w-full bg-gray-50 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No chart data available for 3D visualization</p>
      </div>
    );
  }

  const render3DChart = () => {
    try {
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
          if (!chartData.datasets || !chartData.datasets[0] || !chartData.datasets[0].data) {
            return <div>No data for 3D scatter plot</div>;
          }
          // Convert 2D scatter data to 3D
          const scatter3DData = chartData.datasets[0].data.map((point, index) => ({
            x: point.x || index,
            y: point.y || point,
            z: Math.random() * 10 // Add random Z component
          }));
          return <Scatter3D data={scatter3DData} colors={colors} />;

        case 'surface3d':
          if (!chartData.labels || !chartData.datasets || !chartData.datasets[0]) {
            return <div>No data for 3D surface</div>;
          }
          // Create surface data from chart data
          const surfaceData = [];
          const size = Math.ceil(Math.sqrt(chartData.labels.length));
          for (let i = 0; i < size; i++) {
            const row = [];
            for (let j = 0; j < size; j++) {
              const dataIndex = i * size + j;
              row.push(chartData.datasets[0].data[dataIndex] || 0);
            }
            surfaceData.push(row);
          }
          return <Surface3D data={surfaceData} width={10} height={10} colors={colors} />;

        default:
          return <div>Unknown 3D chart type: {chartConfig.chartType}</div>;
      }
    } catch (error) {
      console.error('Error rendering 3D chart:', error);
      return <div>Error rendering 3D chart: {error.message}</div>;
    }
  };

  return (
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
  );
};

export default Chart3D;

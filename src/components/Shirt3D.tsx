import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Center } from '@react-three/drei';
import * as THREE from 'three';
import { useAppContext } from '../store';
import { SHIRT_PATHS } from '../constants';
import { createShapeFromPath } from '../utils/svgToShape';
import { useSvgTexture } from '../hooks/useSvgTexture';

// Generate a simple procedural fabric bump map
const createFabricBumpMap = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  if (context) {
    context.fillStyle = '#808080';
    context.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 40000; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const v = Math.random() > 0.5 ? 255 : 0;
      context.fillStyle = `rgba(${v},${v},${v},0.05)`;
      context.fillRect(x, y, 2, 1);
      context.fillRect(x, y, 1, 2);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 10);
  return texture;
};

const ShirtMesh: React.FC<{ texture: THREE.CanvasTexture | null }> = ({ texture }) => {
  const { category, model, material, side, textureScale } = useAppContext();
  const meshRef = useRef<THREE.Mesh>(null);
  
  const bumpMap = useMemo(() => createFabricBumpMap(), []);
  
  useEffect(() => {
    if (bumpMap) {
      bumpMap.repeat.set(textureScale, textureScale);
      bumpMap.needsUpdate = true;
    }
  }, [bumpMap, textureScale]);

  const shape = useMemo(() => {
    const paths = SHIRT_PATHS[category]?.[model] || SHIRT_PATHS['football']['round-neck'];
    return createShapeFromPath(side === 'front' ? paths.front : paths.back);
  }, [category, model, side]);

  const extrudeSettings = {
    depth: 20,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 2,
    bevelSize: 2,
    bevelThickness: 2,
  };

  const geometry = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    
    // Fix UV mapping for planar projection based on exact SVG viewBox (300x400)
    // This ensures the texture perfectly aligns with the geometry regardless of its bounding box
    const posAttribute = geo.attributes.position as THREE.BufferAttribute;
    const uvAttribute = geo.attributes.uv as THREE.BufferAttribute;
    
    for (let i = 0; i < posAttribute.count; i++) {
      const x = posAttribute.getX(i);
      const y = posAttribute.getY(i);
      
      // Original SVG coordinates: x is [0, 300], y is [-400, 0]
      // Map to UV space [0, 1]
      const u = x / 300;
      const v = (y + 400) / 400; // v=0 at bottom (y=-400), v=1 at top (y=0)
      
      uvAttribute.setXY(i, u, v);
    }
    
    geo.attributes.uv.needsUpdate = true;
    
    // Center the geometry AFTER calculating UVs so the original coordinates are used
    geo.center();
    
    return geo;
  }, [shape]);

  // Material properties based on selection
  const materialProps = useMemo(() => {
    switch (material) {
      case 'glossy':
        return { roughness: 0.1, metalness: 0.2, clearcoat: 1.0, clearcoatRoughness: 0.1, bumpScale: 0.002 };
      case 'satin':
        return { roughness: 0.4, metalness: 0.1, clearcoat: 0.5, clearcoatRoughness: 0.3, bumpScale: 0.005 };
      case 'matte':
      default:
        return { roughness: 0.8, metalness: 0.0, bumpScale: 0.01 };
    }
  }, [material]);

  // Auto-rotate slowly
  useFrame((state) => {
    if (meshRef.current) {
      // Optional: add slight floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 2;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      <meshPhysicalMaterial 
        map={texture} 
        bumpMap={bumpMap}
        color="#ffffff"
        side={THREE.DoubleSide}
        {...materialProps}
      />
    </mesh>
  );
};

export const Shirt3D: React.FC = () => {
  const state = useAppContext();
  
  // We pass all state variables that affect the visual appearance as dependencies
  const texture = useSvgTexture('shirt-svg', [
    state.category, state.model, state.side, state.mainColor, 
    state.secondaryColor, state.pattern, state.layers
  ]);

  return (
    <div className="w-full h-full absolute inset-0 z-0">
      <Canvas shadows camera={{ position: [0, 0, 300], fov: 50 }} gl={{ preserveDrawingBuffer: true }}>
        <ambientLight intensity={0.4} />
        
        {/* Key Light */}
        <directionalLight 
          position={[100, 150, 100]} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize={[2048, 2048]} 
          shadow-bias={-0.0001}
        />
        
        {/* Fill Light */}
        <directionalLight 
          position={[-100, 50, 100]} 
          intensity={0.5} 
          color="#e0eaff" 
        />
        
        {/* Rim Light */}
        <spotLight 
          position={[0, 100, -200]} 
          intensity={1.5} 
          color="#ffffff" 
          penumbra={0.5} 
          angle={Math.PI / 4} 
        />
        
        <Center>
          <ShirtMesh texture={texture} />
        </Center>
        
        <ContactShadows position={[0, -150, 0]} opacity={0.4} scale={200} blur={2} far={100} />
        <Environment preset="city" />
        <OrbitControls enablePan={false} minDistance={100} maxDistance={500} />
      </Canvas>
    </div>
  );
};

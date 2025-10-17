import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePlayer } from "../lib/stores/usePlayer";

interface CollectibleProps {
  position: number[];
  type: string;
  onCollect: () => void;
}

export default function Collectible({ position, type, onCollect }: CollectibleProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { position: playerPos } = usePlayer();
  
  // Different colors/shapes for different resource types
  const getResourceVisuals = (type: string) => {
    switch (type) {
      case 'metal':
        return { color: "#9E9E9E", shape: 'box' };
      case 'crystal':
        return { color: "#9C27B0", shape: 'octahedron' };
      case 'energy':
        return { color: "#FFC107", shape: 'sphere' };
      case 'bio':
        return { color: "#4CAF50", shape: 'tetrahedron' };
      default:
        return { color: "#2196F3", shape: 'sphere' };
    }
  };
  
  const { color, shape } = getResourceVisuals(type);
  
  // Animation and collection logic
  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.3;
      
      // Rotation animation
      meshRef.current.rotation.y += 0.02;
      meshRef.current.rotation.x += 0.01;
      
      // Check collection distance
      const playerDistance = new THREE.Vector3(...playerPos)
        .distanceTo(new THREE.Vector3(position[0], position[1], position[2]));
      
      if (playerDistance < 2) {
        onCollect();
      }
      
      // Pulse effect when player is nearby
      if (playerDistance < 5) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.2;
        meshRef.current.scale.setScalar(scale);
      }
    }
  });
  
  const renderShape = () => {
    switch (shape) {
      case 'box':
        return <boxGeometry args={[0.8, 0.8, 0.8]} />;
      case 'octahedron':
        return <octahedronGeometry args={[0.6]} />;
      case 'tetrahedron':
        return <tetrahedronGeometry args={[0.6]} />;
      default:
        return <sphereGeometry args={[0.5]} />;
    }
  };

  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow>
        {renderShape()}
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh position={[0, 0, 0]} scale={[2, 2, 2]}>
        <sphereGeometry args={[0.5]} />
        <meshBasicMaterial 
          color={color}
          transparent
          opacity={0.1}
        />
      </mesh>
      
      {/* Collection indicator particles */}
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[0.1]} />
        <meshBasicMaterial 
          color={color}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}

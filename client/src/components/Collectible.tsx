import { useRef, useMemo } from "react";
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
  const glowRef = useRef<THREE.Mesh>(null);
  const { position: playerPos } = usePlayer();
  const collectedRef = useRef(false);
  
  // Pre-calculate random offset for floating animation
  const randomOffset = useMemo(() => Math.random() * Math.PI * 2, []);
  
  // Different colors/shapes for different resource types
  const getResourceVisuals = (type: string) => {
    switch (type) {
      case 'metal':
        return { color: "#9E9E9E", emissive: "#757575", shape: 'box' };
      case 'crystal':
        return { color: "#9C27B0", emissive: "#7B1FA2", shape: 'octahedron' };
      case 'energy':
        return { color: "#FFC107", emissive: "#FFA000", shape: 'sphere' };
      case 'bio':
        return { color: "#4CAF50", emissive: "#388E3C", shape: 'tetrahedron' };
      default:
        return { color: "#2196F3", emissive: "#1976D2", shape: 'sphere' };
    }
  };
  
  const { color, emissive, shape } = useMemo(() => getResourceVisuals(type), [type]);
  
  // Animation and collection logic
  useFrame((state) => {
    if (collectedRef.current) return;
    
    if (meshRef.current && glowRef.current) {
      // Floating animation
      const floatHeight = position[1] + Math.sin(state.clock.elapsedTime * 2 + randomOffset) * 0.3;
      meshRef.current.position.y = floatHeight;
      glowRef.current.position.y = floatHeight;
      
      // Rotation animation
      meshRef.current.rotation.y += 0.02;
      meshRef.current.rotation.x += 0.01;
      
      // Check collection distance
      const playerDistance = new THREE.Vector3(...playerPos)
        .distanceTo(new THREE.Vector3(position[0], position[1], position[2]));
      
      if (playerDistance < 2 && !collectedRef.current) {
        collectedRef.current = true;
        onCollect();
      }
      
      // Pulse and scale effect when player is nearby
      if (playerDistance < 5) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.2;
        meshRef.current.scale.setScalar(scale);
        
        // Glow intensity increases when near
        const glowScale = 2 + Math.sin(state.clock.elapsedTime * 6) * 0.5;
        glowRef.current.scale.setScalar(glowScale);
      } else {
        meshRef.current.scale.setScalar(1);
        glowRef.current.scale.setScalar(2);
      }
      
      // Rotate glow opposite direction
      glowRef.current.rotation.y -= 0.01;
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
      {/* Main collectible */}
      <mesh ref={meshRef} castShadow>
        {renderShape()}
        <meshStandardMaterial 
          color={color}
          emissive={emissive}
          emissiveIntensity={0.5}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
      
      {/* Outer glow effect */}
      <mesh ref={glowRef} position={[0, 0, 0]} scale={[2, 2, 2]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial 
          color={color}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Inner glow pulse */}
      <mesh position={[0, 0, 0]} scale={[1.5, 1.5, 1.5]}>
        <sphereGeometry args={[0.5, 12, 12]} />
        <meshBasicMaterial 
          color={emissive}
          transparent
          opacity={0.2}
        />
      </mesh>
      
      {/* Sparkle particles floating around */}
      {[...Array(3)].map((_, i) => {
        const angle = (i / 3) * Math.PI * 2 + randomOffset;
        const radius = 1;
        return (
          <mesh 
            key={i} 
            position={[
              Math.cos(angle) * radius,
              Math.sin(Date.now() * 0.002 + i) * 0.3,
              Math.sin(angle) * radius
            ]}
          >
            <sphereGeometry args={[0.05]} />
            <meshBasicMaterial 
              color={color}
              transparent
              opacity={0.8}
            />
          </mesh>
        );
      })}
    </group>
  );
}

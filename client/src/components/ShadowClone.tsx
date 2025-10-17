import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { usePlayer } from "../lib/stores/usePlayer";

enum Controls {
  clone = 'clone'
}

export default function ShadowClone() {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { position: playerPos } = usePlayer();
  const [, getKeys] = useKeyboardControls<Controls>();
  
  const cloneRef = useRef({
    active: false,
    position: [0, 1, 0],
    targetPosition: [0, 1, 0],
    cooldown: 0,
    spawnTime: 0,
    lifetime: 5 // Clone lasts 5 seconds
  });

  // Random animation offset
  const animOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  // Clone management
  useFrame((state, delta) => {
    const keys = getKeys();
    const clone = cloneRef.current;
    
    // Reduce cooldown
    if (clone.cooldown > 0) {
      clone.cooldown -= delta;
    }
    
    // Activate clone
    if (keys.clone && clone.cooldown <= 0 && !clone.active) {
      clone.active = true;
      clone.position = [...playerPos];
      clone.targetPosition = [
        playerPos[0] + (Math.random() - 0.5) * 15,
        playerPos[1],
        playerPos[2] + (Math.random() - 0.5) * 15
      ];
      clone.cooldown = 7; // 7 second cooldown
      clone.spawnTime = state.clock.elapsedTime;
      console.log("Shadow clone activated!");
    }
    
    // Update active clone
    if (clone.active) {
      const currentPos = new THREE.Vector3(...clone.position);
      const targetPos = new THREE.Vector3(...clone.targetPosition);
      const direction = targetPos.sub(currentPos);
      
      // Move towards target
      if (direction.length() > 0.5) {
        direction.normalize().multiplyScalar(5 * delta);
        clone.position[0] += direction.x;
        clone.position[2] += direction.z;
      }
      
      // Check lifetime
      const timeAlive = state.clock.elapsedTime - clone.spawnTime;
      if (timeAlive > clone.lifetime) {
        clone.active = false;
      }
      
      // Update mesh
      if (meshRef.current && groupRef.current && clone.active) {
        meshRef.current.position.set(...clone.position);
        groupRef.current.position.set(...clone.position);
        
        // Floating/phasing animation
        const floatAmount = Math.sin(state.clock.elapsedTime * 3 + animOffset) * 0.2;
        groupRef.current.position.y += floatAmount;
        
        // Fade out effect based on lifetime
        const fadeRatio = Math.min(1, (clone.lifetime - timeAlive) / clone.lifetime);
        const opacity = fadeRatio * 0.6;
        
        if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
          meshRef.current.material.opacity = opacity;
        }
        
        // Pulse scale
        const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.1;
        groupRef.current.scale.setScalar(pulseScale);
      }
    }
  });

  if (!cloneRef.current.active) {
    return null;
  }

  const clonePos = cloneRef.current.position;

  return (
    <group ref={groupRef} position={clonePos}>
      {/* Clone body (semi-transparent and glowing) */}
      <mesh ref={meshRef} position={clonePos} castShadow>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial 
          color="#4CAF50"
          emissive="#00FF00"
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
      
      {/* Clone head */}
      <mesh position={[clonePos[0], clonePos[1] + 1.5, clonePos[2]]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial 
          color="#FFC107"
          emissive="#FFEB3B"
          emissiveIntensity={0.4}
          transparent
          opacity={0.6}
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>
      
      {/* Glowing eyes */}
      <mesh position={[clonePos[0] + 0.15, clonePos[1] + 1.6, clonePos[2] + 0.3]}>
        <sphereGeometry args={[0.08]} />
        <meshBasicMaterial color="#00FF00" />
      </mesh>
      <mesh position={[clonePos[0] - 0.15, clonePos[1] + 1.6, clonePos[2] + 0.3]}>
        <sphereGeometry args={[0.08]} />
        <meshBasicMaterial color="#00FF00" />
      </mesh>
      
      {/* Energy aura layers */}
      <mesh position={clonePos} scale={[1.5, 2.5, 1.5]}>
        <boxGeometry args={[1, 2, 1]} />
        <meshBasicMaterial 
          color="#00FF00"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>
      
      <mesh position={clonePos} scale={[2, 3, 2]}>
        <boxGeometry args={[1, 2, 1]} />
        <meshBasicMaterial 
          color="#00FF00"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Shadow effect on ground */}
      <mesh position={[clonePos[0], 0.05, clonePos[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1, 16]} />
        <meshBasicMaterial 
          color="#000000"
          transparent
          opacity={0.4}
        />
      </mesh>
      
      {/* Particle trail effect */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2 + animOffset;
        const radius = 0.8;
        return (
          <mesh 
            key={i}
            position={[
              clonePos[0] + Math.cos(angle + Date.now() * 0.003) * radius,
              clonePos[1] + Math.sin(Date.now() * 0.005 + i) * 0.5,
              clonePos[2] + Math.sin(angle + Date.now() * 0.003) * radius
            ]}
          >
            <sphereGeometry args={[0.08]} />
            <meshBasicMaterial 
              color="#00FF00"
              transparent
              opacity={0.6}
            />
          </mesh>
        );
      })}
      
      {/* Ring indicator on ground */}
      <mesh position={[clonePos[0], 0.1, clonePos[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.4, 32]} />
        <meshBasicMaterial 
          color="#00FF00"
          transparent
          opacity={0.5 + Math.sin(Date.now() * 0.005) * 0.3}
        />
      </mesh>
    </group>
  );
}

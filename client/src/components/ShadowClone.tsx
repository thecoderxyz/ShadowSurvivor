import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { usePlayer } from "../lib/stores/usePlayer";

enum Controls {
  clone = 'clone'
}

export default function ShadowClone() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { position: playerPos } = usePlayer();
  const [, getKeys] = useKeyboardControls<Controls>();
  
  const cloneRef = useRef({
    active: false,
    position: [0, 1, 0],
    targetPosition: [0, 1, 0],
    cooldown: 0
  });

  // Clone management
  useFrame((_, delta) => {
    const keys = getKeys();
    const clone = cloneRef.current;
    
    // Reduce cooldown
    if (clone.cooldown > 0) {
      clone.cooldown -= delta;
    }
    
    // Activate/deactivate clone
    if (keys.clone && clone.cooldown <= 0 && !clone.active) {
      clone.active = true;
      clone.position = [...playerPos];
      clone.targetPosition = [
        playerPos[0] + (Math.random() - 0.5) * 10,
        playerPos[1],
        playerPos[2] + (Math.random() - 0.5) * 10
      ];
      clone.cooldown = 5; // 5 second cooldown
      console.log("Shadow clone activated!");
    }
    
    // Move clone towards target
    if (clone.active) {
      const currentPos = new THREE.Vector3(...clone.position);
      const targetPos = new THREE.Vector3(...clone.targetPosition);
      const direction = targetPos.sub(currentPos);
      
      if (direction.length() > 0.5) {
        direction.normalize().multiplyScalar(5 * delta);
        clone.position[0] += direction.x;
        clone.position[2] += direction.z;
      } else {
        // Reached target, deactivate after a delay
        setTimeout(() => {
          clone.active = false;
        }, 3000);
      }
    }
    
    // Update mesh position
    if (meshRef.current && clone.active) {
      meshRef.current.position.set(...clone.position);
    }
  });

  if (!cloneRef.current.active) {
    return null;
  }

  return (
    <group>
      {/* Clone body (semi-transparent) */}
      <mesh ref={meshRef} position={cloneRef.current.position} castShadow>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial 
          color="#4CAF50"
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Clone head */}
      <mesh position={[
        cloneRef.current.position[0], 
        cloneRef.current.position[1] + 1.5, 
        cloneRef.current.position[2]
      ]}>
        <sphereGeometry args={[0.3]} />
        <meshStandardMaterial 
          color="#FFC107"
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Shadow effect */}
      <mesh position={cloneRef.current.position} scale={[2, 0.1, 2]}>
        <cylinderGeometry args={[1, 1, 0.1]} />
        <meshBasicMaterial 
          color="#000000"
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

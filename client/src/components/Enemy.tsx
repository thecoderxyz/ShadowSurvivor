import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePlayer } from "../lib/stores/usePlayer";

interface EnemyProps {
  position: number[];
  health: number;
  chasing: boolean;
  onHit: (damage: number) => void;
}

export default function Enemy({ position, health, chasing, onHit }: EnemyProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { position: playerPos } = usePlayer();
  
  // Visual feedback based on state
  const enemyColor = chasing ? "#FF5722" : "#9E9E9E";
  const healthPercent = health / 100;
  
  // Attack logic
  useFrame(() => {
    if (meshRef.current && health > 0) {
      const playerDistance = new THREE.Vector3(...playerPos)
        .distanceTo(new THREE.Vector3(...position));
      
      // Attack player if very close
      if (playerDistance < 2 && chasing) {
        // Enemy attacks (simplified)
        console.log("Enemy attacking player!");
      }
      
      // Update mesh position
      meshRef.current.position.set(...position);
      
      // Bobbing animation
      meshRef.current.position.y += Math.sin(Date.now() * 0.01) * 0.1;
      
      // Face player when chasing
      if (chasing) {
        meshRef.current.lookAt(new THREE.Vector3(...playerPos));
      }
    }
  });

  if (health <= 0) {
    return null; // Don't render dead enemies
  }

  return (
    <group position={position}>
      {/* Enemy body */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[1.2, 1.8, 1.2]} />
        <meshStandardMaterial 
          color={enemyColor}
          opacity={healthPercent}
          transparent
        />
      </mesh>
      
      {/* Enemy eyes */}
      <mesh position={[0.3, 0.5, 0.6]}>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[-0.3, 0.5, 0.6]}>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Health bar */}
      {health < 100 && (
        <group position={[0, 2.5, 0]}>
          {/* Background */}
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[2, 0.2]} />
            <meshBasicMaterial color="#333333" />
          </mesh>
          {/* Health bar */}
          <mesh position={[(-1 + healthPercent), 0, 0.01]}>
            <planeGeometry args={[2 * healthPercent, 0.15]} />
            <meshBasicMaterial color="#FF5722" />
          </mesh>
        </group>
      )}
      
      {/* Weapon/Claws */}
      <mesh position={[0.8, 0, 0.8]} castShadow>
        <coneGeometry args={[0.1, 0.8]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      <mesh position={[-0.8, 0, 0.8]} castShadow>
        <coneGeometry args={[0.1, 0.8]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
    </group>
  );
}

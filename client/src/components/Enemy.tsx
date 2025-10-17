import { useRef, useEffect, useMemo } from "react";
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
  const groupRef = useRef<THREE.Group>(null);
  const { position: playerPos } = usePlayer();
  const attackCooldownRef = useRef(0);
  
  // Random animation offset for variety
  const animOffset = useMemo(() => Math.random() * Math.PI * 2, []);
  
  // Visual feedback based on state
  const enemyColor = chasing ? "#FF5722" : "#9E9E9E";
  const emissiveColor = chasing ? "#D32F2F" : "#616161";
  const healthPercent = health / 100;
  
  // Attack logic
  useFrame((state, delta) => {
    if (meshRef.current && groupRef.current && health > 0) {
      const playerDistance = new THREE.Vector3(...playerPos)
        .distanceTo(new THREE.Vector3(...position));
      
      // Update cooldown
      if (attackCooldownRef.current > 0) {
        attackCooldownRef.current -= delta;
      }
      
      // Attack player if very close
      if (playerDistance < 2 && chasing && attackCooldownRef.current <= 0) {
        onHit(10); // Deal 10 damage to player (would need player damage handler)
        attackCooldownRef.current = 1; // 1 second cooldown
      }
      
      // Update mesh position
      meshRef.current.position.set(...position);
      groupRef.current.position.set(...position);
      
      // Bobbing animation - more intense when chasing
      const bobIntensity = chasing ? 0.15 : 0.1;
      const bobSpeed = chasing ? 8 : 4;
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * bobSpeed + animOffset) * bobIntensity;
      
      // Face player when chasing
      if (chasing) {
        groupRef.current.lookAt(new THREE.Vector3(...playerPos));
        
        // Aggressive shake when chasing
        groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 20) * 0.1;
      } else {
        // Idle rotation
        groupRef.current.rotation.y += delta * 0.5;
        groupRef.current.rotation.z = 0;
      }
      
      // Pulse effect when damaged
      if (health < 100) {
        const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.05;
        meshRef.current.scale.setScalar(pulseScale);
      }
    }
  });

  if (health <= 0) {
    return null; // Don't render dead enemies
  }

  return (
    <group ref={groupRef} position={position}>
      {/* Enemy body */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[1.2, 1.8, 1.2]} />
        <meshStandardMaterial 
          color={enemyColor}
          emissive={emissiveColor}
          emissiveIntensity={chasing ? 0.5 : 0.2}
          opacity={healthPercent * 0.8 + 0.2}
          transparent
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
      
      {/* Enemy eyes - glow more when chasing */}
      <mesh position={[0.3, 0.5, 0.6]}>
        <sphereGeometry args={[0.12]} />
        <meshStandardMaterial 
          color="#FF0000" 
          emissive="#FF0000" 
          emissiveIntensity={chasing ? 1.5 : 0.5}
        />
      </mesh>
      <mesh position={[-0.3, 0.5, 0.6]}>
        <sphereGeometry args={[0.12]} />
        <meshStandardMaterial 
          color="#FF0000" 
          emissive="#FF0000" 
          emissiveIntensity={chasing ? 1.5 : 0.5}
        />
      </mesh>
      
      {/* Eye glow effect when chasing */}
      {chasing && (
        <>
          <mesh position={[0.3, 0.5, 0.65]} scale={[2, 2, 2]}>
            <sphereGeometry args={[0.15]} />
            <meshBasicMaterial color="#FF0000" transparent opacity={0.3} />
          </mesh>
          <mesh position={[-0.3, 0.5, 0.65]} scale={[2, 2, 2]}>
            <sphereGeometry args={[0.15]} />
            <meshBasicMaterial color="#FF0000" transparent opacity={0.3} />
          </mesh>
        </>
      )}
      
      {/* Health bar - only show when damaged */}
      {health < 100 && (
        <group position={[0, 2.5, 0]}>
          {/* Background */}
          <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[2, 0.2]} />
            <meshBasicMaterial color="#333333" transparent opacity={0.8} />
          </mesh>
          {/* Health bar fill */}
          <mesh position={[(-1 + healthPercent), 0, 0.01]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[2 * healthPercent, 0.15]} />
            <meshBasicMaterial 
              color={healthPercent > 0.5 ? "#4CAF50" : healthPercent > 0.25 ? "#FFC107" : "#FF5722"} 
            />
          </mesh>
          {/* Health bar border */}
          <mesh position={[0, 0, 0.02]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[2.1, 0.25]} />
            <meshBasicMaterial color="#000000" transparent opacity={0} wireframe />
          </mesh>
        </group>
      )}
      
      {/* Weapon/Claws */}
      <mesh position={[0.8, 0, 0.8]} castShadow rotation={[0, 0, Math.PI / 6]}>
        <coneGeometry args={[0.1, 0.8, 4]} />
        <meshStandardMaterial 
          color="#444444" 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[-0.8, 0, 0.8]} castShadow rotation={[0, 0, -Math.PI / 6]}>
        <coneGeometry args={[0.1, 0.8, 4]} />
        <meshStandardMaterial 
          color="#444444"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Danger indicator ring when chasing */}
      {chasing && (
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 1.7, 32]} />
          <meshBasicMaterial 
            color="#FF5722" 
            transparent 
            opacity={0.5 + Math.sin(Date.now() * 0.01) * 0.3}
          />
        </mesh>
      )}
    </group>
  );
}

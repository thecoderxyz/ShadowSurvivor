import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticlesProps {
  position: THREE.Vector3;
  type: string;
}

export default function Particles({ position, type }: ParticlesProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const particleRef = useRef({
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      Math.random() * 3 + 2,
      (Math.random() - 0.5) * 2
    ),
    life: 2,
    initialLife: 2
  });

  // Particle colors based on type
  const getParticleColor = (type: string) => {
    switch (type) {
      case 'hit':
        return "#FF5722";
      case 'collect':
        return "#4CAF50";
      case 'victory':
        return "#FFD700";
      default:
        return "#ffffff";
    }
  };

  useFrame((_, delta) => {
    if (meshRef.current) {
      const particle = particleRef.current;
      
      // Update position
      position.add(particle.velocity.clone().multiplyScalar(delta));
      
      // Apply gravity
      particle.velocity.y -= 9.8 * delta;
      
      // Update life
      particle.life -= delta;
      
      // Update mesh
      meshRef.current.position.copy(position);
      
      // Fade out based on life
      const opacity = particle.life / particle.initialLife;
      if (meshRef.current.material instanceof THREE.MeshBasicMaterial) {
        meshRef.current.material.opacity = opacity;
      }
      
      // Scale based on life
      const scale = 0.5 + (opacity * 0.5);
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.1]} />
      <meshBasicMaterial 
        color={getParticleColor(type)}
        transparent
        opacity={1}
      />
    </mesh>
  );
}

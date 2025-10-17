import { useRef, useMemo } from "react";
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
    initialLife: 2,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 10
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

  const particleColor = useMemo(() => getParticleColor(type), [type]);
  const particleSize = useMemo(() => type === 'victory' ? 0.15 : 0.1, [type]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      const particle = particleRef.current;
      
      // Update position
      position.add(particle.velocity.clone().multiplyScalar(delta));
      
      // Apply gravity
      particle.velocity.y -= 9.8 * delta;
      
      // Update life
      particle.life -= delta;
      
      // Update rotation
      particle.rotation += particle.rotationSpeed * delta;
      
      // Update mesh
      meshRef.current.position.copy(position);
      meshRef.current.rotation.z = particle.rotation;
      
      // Fade out based on life
      const opacity = particle.life / particle.initialLife;
      if (meshRef.current.material instanceof THREE.MeshBasicMaterial) {
        meshRef.current.material.opacity = opacity;
      }
      
      // Scale based on life (expand then shrink)
      const lifeRatio = particle.life / particle.initialLife;
      let scale;
      if (lifeRatio > 0.5) {
        // Growing phase
        scale = 0.3 + (1 - lifeRatio) * 1.4;
      } else {
        // Shrinking phase
        scale = lifeRatio * 2 * 1;
      }
      meshRef.current.scale.setScalar(scale);
    }
  });

  // Use different shapes for different particle types
  const renderGeometry = () => {
    if (type === 'victory') {
      return <octahedronGeometry args={[particleSize]} />;
    } else if (type === 'collect') {
      return <sphereGeometry args={[particleSize]} />;
    } else {
      return <boxGeometry args={[particleSize, particleSize, particleSize]} />;
    }
  };

  return (
    <mesh ref={meshRef} position={position}>
      {renderGeometry()}
      <meshBasicMaterial 
        color={particleColor}
        transparent
        opacity={1}
        emissive={particleColor}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

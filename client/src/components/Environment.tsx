import { useRef } from "react";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface EnvironmentProps {
  level: any;
  dayTime: number;
}

export default function Environment({ level, dayTime }: EnvironmentProps) {
  const groundRef = useRef<THREE.Mesh>(null);
  
  // Load textures based on level theme
  const groundTexture = useTexture(level.groundTexture || "/textures/grass.png");
  const skyColor = level.skyColor || "#87CEEB";
  
  // Animate environment
  useFrame((state) => {
    if (groundRef.current) {
      // Subtle ground animation
      groundRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.01;
    }
  });
  
  // Generate random obstacles/structures
  const obstacles = [];
  for (let i = 0; i < level.obstacleCount; i++) {
    const x = (Math.random() - 0.5) * 80;
    const z = (Math.random() - 0.5) * 80;
    const height = 2 + Math.random() * 4;
    
    obstacles.push(
      <mesh key={i} position={[x, height / 2, z]} castShadow receiveShadow>
        <boxGeometry args={[2, height, 2]} />
        <meshStandardMaterial 
          color={level.obstacleColor || "#8D6E63"} 
          map={groundTexture}
        />
      </mesh>
    );
  }

  return (
    <group>
      {/* Sky color */}
      <color attach="background" args={[skyColor]} />
      
      {/* Ground plane */}
      <mesh 
        ref={groundRef}
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]} 
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          map={groundTexture} 
          color={level.groundColor || "#ffffff"}
        />
      </mesh>
      
      {/* Obstacles/Structures */}
      {obstacles}
      
      {/* Environmental decorations */}
      {level.theme === 'ruins' && (
        <>
          {/* Broken pillars */}
          <mesh position={[15, 3, 10]} castShadow>
            <cylinderGeometry args={[1, 1, 6]} />
            <meshStandardMaterial color="#666666" />
          </mesh>
          <mesh position={[-20, 2, -15]} castShadow>
            <cylinderGeometry args={[0.8, 0.8, 4]} />
            <meshStandardMaterial color="#555555" />
          </mesh>
        </>
      )}
      
      {level.theme === 'alien' && (
        <>
          {/* Alien crystals */}
          <mesh position={[10, 2, 5]} castShadow>
            <octahedronGeometry args={[2]} />
            <meshStandardMaterial 
              color="#9C27B0" 
              emissive="#9C27B0" 
              emissiveIntensity={0.3}
            />
          </mesh>
          <mesh position={[-15, 3, -10]} castShadow>
            <octahedronGeometry args={[3]} />
            <meshStandardMaterial 
              color="#E91E63" 
              emissive="#E91E63" 
              emissiveIntensity={0.2}
            />
          </mesh>
        </>
      )}
      
      {level.theme === 'mechanical' && (
        <>
          {/* Mechanical structures */}
          <mesh position={[8, 1.5, 8]} castShadow>
            <boxGeometry args={[3, 3, 3]} />
            <meshStandardMaterial color="#455A64" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[-12, 2, 12]} castShadow>
            <cylinderGeometry args={[1.5, 1.5, 4]} />
            <meshStandardMaterial color="#37474F" metalness={0.9} roughness={0.1} />
          </mesh>
        </>
      )}
      
      {/* Atmospheric fog based on day/night */}
      <fog attach="fog" args={[skyColor, 20, 100]} />
    </group>
  );
}

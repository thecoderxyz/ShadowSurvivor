import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { usePlayer } from "../lib/stores/usePlayer";
import { useCollision } from "../hooks/useCollision";

enum Controls {
  forward = 'forward',
  backward = 'backward',
  leftward = 'leftward',
  rightward = 'rightward',
  jump = 'jump',
  interact = 'interact'
}

export default function Player() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const { position, velocity, onGround, updatePosition, updateVelocity, jump } = usePlayer();
  const { checkCollision } = useCollision();
  
  const [, getKeys] = useKeyboardControls<Controls>();

  // Camera follow
  useFrame(() => {
    if (meshRef.current) {
      // Third-person camera positioning
      const idealOffset = new THREE.Vector3(0, 5, 10);
      const idealPosition = new THREE.Vector3(...position).add(idealOffset);
      
      camera.position.lerp(idealPosition, 0.1);
      camera.lookAt(new THREE.Vector3(...position).add(new THREE.Vector3(0, 2, 0)));
    }
  });

  // Player movement
  useFrame((_, delta) => {
    const keys = getKeys();
    const moveSpeed = 8;
    const newVelocity = [...velocity];
    
    // Horizontal movement
    let moveX = 0;
    let moveZ = 0;
    
    if (keys.forward) moveZ -= 1;
    if (keys.backward) moveZ += 1;
    if (keys.leftward) moveX -= 1;
    if (keys.rightward) moveX += 1;
    
    // Normalize diagonal movement
    if (moveX !== 0 || moveZ !== 0) {
      const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
      moveX /= length;
      moveZ /= length;
    }
    
    newVelocity[0] = moveX * moveSpeed;
    newVelocity[2] = moveZ * moveSpeed;
    
    // Jumping
    if (keys.jump && onGround) {
      jump();
    }
    
    // Apply gravity
    if (!onGround) {
      newVelocity[1] -= 25 * delta; // Gravity
    }
    
    // Update velocity
    updateVelocity(newVelocity);
    
    // Calculate new position
    const newPosition = [
      position[0] + newVelocity[0] * delta,
      position[1] + newVelocity[1] * delta,
      position[2] + newVelocity[2] * delta
    ];
    
    // Ground collision
    if (newPosition[1] <= 1) {
      newPosition[1] = 1;
      newVelocity[1] = 0;
    }
    
    // Check collision with environment
    const collision = checkCollision(newPosition, [1, 2, 1]); // Player bounding box
    if (!collision) {
      updatePosition(newPosition);
    }
    
    // Update mesh position
    if (meshRef.current) {
      meshRef.current.position.set(...newPosition);
    }
  });

  return (
    <group>
      {/* Player body */}
      <mesh ref={meshRef} position={position} castShadow>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color="#4CAF50" />
      </mesh>
      
      {/* Player head */}
      <mesh position={[position[0], position[1] + 1.5, position[2]]} castShadow>
        <sphereGeometry args={[0.3]} />
        <meshStandardMaterial color="#FFC107" />
      </mesh>
      
      {/* Weapon/Tool */}
      <mesh position={[position[0] + 0.7, position[1], position[2]]} castShadow>
        <boxGeometry args={[0.1, 1.5, 0.1]} />
        <meshStandardMaterial color="#8D6E63" />
      </mesh>
    </group>
  );
}

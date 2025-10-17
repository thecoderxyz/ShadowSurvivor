import { useRef, useEffect, useMemo } from "react";
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
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const { position, velocity, onGround, updatePosition, updateVelocity, jump, setGrounded } = usePlayer();
  const { checkCollision } = useCollision();
  
  const [, getKeys] = useKeyboardControls<Controls>();
  
  // Animation state
  const animationRef = useRef({
    walkCycle: 0,
    jumpSquash: 1,
    landSquash: 1
  });

  // Camera follow with smooth lerp
  useFrame((state, delta) => {
    if (meshRef.current && groupRef.current) {
      // Third-person camera positioning with smooth follow
      const idealOffset = new THREE.Vector3(0, 5, 10);
      const idealPosition = new THREE.Vector3(...position).add(idealOffset);
      
      camera.position.lerp(idealPosition, 0.1);
      camera.lookAt(new THREE.Vector3(...position).add(new THREE.Vector3(0, 2, 0)));
    }
  });

  // Player movement
  useFrame((state, delta) => {
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
    
    // Calculate if moving
    const isMoving = moveX !== 0 || moveZ !== 0;
    
    // Normalize diagonal movement
    if (isMoving) {
      const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
      moveX /= length;
      moveZ /= length;
    }
    
    newVelocity[0] = moveX * moveSpeed;
    newVelocity[2] = moveZ * moveSpeed;
    
    // Jumping
    if (keys.jump && onGround) {
      jump();
      animationRef.current.jumpSquash = 0.7; // Squash before jump
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
    const wasOnGround = onGround;
    if (newPosition[1] <= 1) {
      newPosition[1] = 1;
      newVelocity[1] = 0;
      setGrounded(true);
      
      // Landing squash
      if (!wasOnGround) {
        animationRef.current.landSquash = 0.7;
      }
    } else {
      setGrounded(false);
    }
    
    // Check collision with environment
    const collision = checkCollision(newPosition, [1, 2, 1]); // Player bounding box
    if (!collision) {
      updatePosition(newPosition);
    }
    
    // Update mesh position and animations
    if (meshRef.current && groupRef.current) {
      meshRef.current.position.set(...newPosition);
      groupRef.current.position.set(...newPosition);
      
      // Walking animation
      if (isMoving && onGround) {
        animationRef.current.walkCycle += delta * 10;
        const bobAmount = Math.sin(animationRef.current.walkCycle) * 0.1;
        groupRef.current.position.y += bobAmount;
        
        // Tilt when moving
        const tiltAmount = Math.sin(animationRef.current.walkCycle) * 0.05;
        groupRef.current.rotation.z = tiltAmount;
      } else {
        groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.1);
      }
      
      // Jump/land squash and stretch animations
      animationRef.current.jumpSquash = THREE.MathUtils.lerp(
        animationRef.current.jumpSquash, 
        1, 
        0.2
      );
      animationRef.current.landSquash = THREE.MathUtils.lerp(
        animationRef.current.landSquash, 
        1, 
        0.15
      );
      
      const squashFactor = Math.min(animationRef.current.jumpSquash, animationRef.current.landSquash);
      meshRef.current.scale.set(
        1 + (1 - squashFactor) * 0.3, // Wider when squashed
        squashFactor, // Shorter when squashed
        1 + (1 - squashFactor) * 0.3  // Wider when squashed
      );
      
      // Face movement direction
      if (isMoving) {
        const targetRotation = Math.atan2(moveX, moveZ);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          groupRef.current.rotation.y,
          targetRotation,
          0.15
        );
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Player body */}
      <mesh ref={meshRef} position={position} castShadow>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial 
          color="#4CAF50"
          emissive="#2E7D32"
          emissiveIntensity={0.2}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      
      {/* Player head */}
      <mesh position={[position[0], position[1] + 1.5, position[2]]} castShadow>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial 
          color="#FFC107"
          emissive="#FF8F00"
          emissiveIntensity={0.2}
          metalness={0.3}
          roughness={0.6}
        />
      </mesh>
      
      {/* Player eyes */}
      <mesh position={[position[0] + 0.15, position[1] + 1.6, position[2] + 0.3]}>
        <sphereGeometry args={[0.08]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[position[0] - 0.15, position[1] + 1.6, position[2] + 0.3]}>
        <sphereGeometry args={[0.08]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Weapon/Tool */}
      <mesh position={[position[0] + 0.7, position[1], position[2]]} castShadow>
        <boxGeometry args={[0.1, 1.5, 0.1]} />
        <meshStandardMaterial 
          color="#8D6E63"
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
      
      {/* Energy aura/glow */}
      <mesh position={[position[0], position[1], position[2]]} scale={[1.3, 2.3, 1.3]}>
        <boxGeometry args={[1, 2, 1]} />
        <meshBasicMaterial 
          color="#4CAF50"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Ground shadow indicator */}
      {!onGround && (
        <mesh position={[position[0], 0.05, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.8, 16]} />
          <meshBasicMaterial 
            color="#000000"
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
    </group>
  );
}

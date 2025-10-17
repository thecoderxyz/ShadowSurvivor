import { useFrame } from "@react-three/fiber";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import Player from "./Player";
import Environment from "./Environment";
import Enemy from "./Enemy";
import Collectible from "./Collectible";
import ShadowClone from "./ShadowClone";
import Particles from "./Particles";
import PerformanceMonitor from "./PerformanceMonitor";
import HUD from "./UI/HUD";
import LevelComplete from "./UI/LevelComplete";
import { useGameState } from "../lib/stores/useGameState";
import { usePlayer } from "../lib/stores/usePlayer";
import { useInventory } from "../lib/stores/useInventory";
import { useAudio } from "../lib/stores/useAudio";
import { levels } from "../lib/levels";

export default function Game() {
  const { currentLevel, gameState, nextLevel, resetGame, addScore } = useGameState();
  const { position, health, resetPlayer } = usePlayer();
  const { resources, addResource } = useInventory();
  const { playSuccess, playHit } = useAudio();
  
  const [enemies, setEnemies] = useState<any[]>([]);
  const [collectibles, setCollectibles] = useState<any[]>([]);
  const [dayTime, setDayTime] = useState(0.5); // 0 = night, 1 = day
  const [particles, setParticles] = useState<any[]>([]);
  
  const gameRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const levelCompletedRef = useRef(false);

  const currentLevelData = levels[currentLevel] || levels[0];

  // Initialize level
  useEffect(() => {
    if (gameState === 'playing') {
      initializeLevel();
      levelCompletedRef.current = false;
    }
  }, [currentLevel, gameState]);

  // Game loop
  useFrame((state, delta) => {
    if (gameState !== 'playing') return;
    
    timeRef.current += delta;
    
    // Update day/night cycle (complete cycle every 120 seconds)
    const cycleTime = (timeRef.current % 120) / 120;
    setDayTime(Math.sin(cycleTime * Math.PI * 2) * 0.5 + 0.5);
    
    // Update enemies
    updateEnemies(delta);
    
    // Update particles
    updateParticles(delta);
    
    // Check win condition
    checkWinCondition();
  });

  const initializeLevel = () => {
    // Reset player position
    resetPlayer();
    
    // Generate enemies based on level
    const newEnemies = [];
    for (let i = 0; i < currentLevelData.enemyCount; i++) {
      const angle = (i / currentLevelData.enemyCount) * Math.PI * 2;
      const radius = 15 + Math.random() * 10;
      newEnemies.push({
        id: `enemy-${currentLevel}-${i}`,
        position: [
          Math.cos(angle) * radius,
          1,
          Math.sin(angle) * radius
        ],
        health: 100,
        patrolRadius: 8,
        chasing: false,
        speed: 2 + Math.random() * 2
      });
    }
    setEnemies(newEnemies);
    
    // Generate collectibles
    const newCollectibles = [];
    let collectibleId = 0;
    for (const collectibleType of currentLevelData.collectibles) {
      for (let i = 0; i < collectibleType.count; i++) {
        newCollectibles.push({
          id: `collectible-${currentLevel}-${collectibleId++}`,
          type: collectibleType.type,
          position: [
            (Math.random() - 0.5) * 40,
            1,
            (Math.random() - 0.5) * 40
          ],
          collected: false
        });
      }
    }
    setCollectibles(newCollectibles);
  };

  const updateEnemies = (delta: number) => {
    setEnemies(prev => prev.map(enemy => {
      if (enemy.health <= 0) return enemy;
      
      const playerPos = new THREE.Vector3(...position);
      const enemyPos = new THREE.Vector3(...enemy.position);
      const distance = playerPos.distanceTo(enemyPos);
      
      // Chase player if close enough
      if (distance < 10) {
        const direction = playerPos.clone().sub(enemyPos).normalize();
        const newPos = enemyPos.add(direction.multiplyScalar(enemy.speed * delta));
        
        return {
          ...enemy,
          position: [newPos.x, newPos.y, newPos.z],
          chasing: true
        };
      } else {
        // Patrol behavior
        return {
          ...enemy,
          position: [
            enemy.position[0] + Math.cos(timeRef.current * 0.5 + parseFloat(enemy.id.split('-')[2])) * 0.1,
            enemy.position[1],
            enemy.position[2] + Math.sin(timeRef.current * 0.5 + parseFloat(enemy.id.split('-')[2])) * 0.1
          ],
          chasing: false
        };
      }
    }));
  };

  const updateParticles = (delta: number) => {
    setParticles(prev => prev.filter(particle => {
      particle.life -= delta;
      particle.position.y += particle.velocity.y * delta;
      return particle.life > 0;
    }));
  };

  const checkWinCondition = () => {
    if (levelCompletedRef.current) return;
    
    const allCollected = collectibles.every(c => c.collected);
    const allEnemiesDefeated = enemies.every(e => e.health <= 0);
    
    if (allCollected && allEnemiesDefeated) {
      levelCompletedRef.current = true;
      
      // Add score for completing level
      const levelScore = currentLevelData.difficulty * 500;
      addScore(levelScore);
      
      // Create victory particles
      createParticleEffect(position, 'victory', 50);
      
      // Play success sound
      playSuccess();
      
      // Advance to next level
      nextLevel();
    }
  };

  const createParticleEffect = (pos: number[], type: string, count: number = 20) => {
    const newParticles = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: `${type}-${Date.now()}-${i}`,
        position: new THREE.Vector3(pos[0], pos[1], pos[2]),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 10,
          Math.random() * 5 + 5,
          (Math.random() - 0.5) * 10
        ),
        life: 2,
        type
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  };

  const handleCollectItem = (collectibleId: string) => {
    setCollectibles(prev => prev.map(c => 
      c.id === collectibleId ? { ...c, collected: true } : c
    ));
    
    const collectible = collectibles.find(c => c.id === collectibleId);
    if (collectible) {
      addResource(collectible.type, 1);
      addScore(50);
      createParticleEffect(collectible.position, 'collect', 15);
      playSuccess();
    }
  };

  const handleEnemyHit = (enemyId: string, damage: number) => {
    setEnemies(prev => prev.map(e => {
      if (e.id === enemyId) {
        const newHealth = Math.max(0, e.health - damage);
        if (newHealth === 0 && e.health > 0) {
          // Enemy just died
          addScore(100);
          createParticleEffect(e.position, 'hit', 30);
          playHit();
        }
        return { ...e, health: newHealth };
      }
      return e;
    }));
  };

  return (
    <>
      {/* Performance Monitor */}
      <PerformanceMonitor />
      
      <group ref={gameRef}>
        {/* Lighting based on day/night cycle */}
        <ambientLight intensity={0.2 + dayTime * 0.3} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={0.5 + dayTime * 1.5}
          color={dayTime > 0.5 ? "#ffffff" : "#4444ff"}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
        />
        
        {/* Hemisphere light for better ambient */}
        <hemisphereLight
          color="#ffffff"
          groundColor="#444444"
          intensity={0.3}
        />
        
        {/* Environment */}
        <Environment level={currentLevelData} dayTime={dayTime} />
        
        {/* Player */}
        <Player />
        
        {/* Shadow Clone */}
        <ShadowClone />
        
        {/* Enemies */}
        {enemies.map(enemy => (
          <Enemy
            key={enemy.id}
            position={enemy.position}
            health={enemy.health}
            chasing={enemy.chasing}
            onHit={(damage) => handleEnemyHit(enemy.id, damage)}
          />
        ))}
        
        {/* Collectibles */}
        {collectibles.map(collectible => (
          !collectible.collected && (
            <Collectible
              key={collectible.id}
              position={collectible.position}
              type={collectible.type}
              onCollect={() => handleCollectItem(collectible.id)}
            />
          )
        ))}
        
        {/* Particles */}
        {particles.map(particle => (
          <Particles
            key={particle.id}
            position={particle.position}
            type={particle.type}
          />
        ))}
      </group>
      
      {/* HUD */}
      <HUD />
      
      {/* Level Complete Screen */}
      {gameState === 'levelComplete' && <LevelComplete />}
    </>
  );
}

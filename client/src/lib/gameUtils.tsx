import * as THREE from "three";

// Utility functions for game mechanics

export const calculateDistance = (pos1: number[], pos2: number[]): number => {
  const dx = pos1[0] - pos2[0];
  const dy = pos1[1] - pos2[1];
  const dz = pos1[2] - pos2[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

export const normalizeVector = (vector: number[]): number[] => {
  const length = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2]);
  if (length === 0) return [0, 0, 0];
  return [vector[0] / length, vector[1] / length, vector[2] / length];
};

export const lerp = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor;
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

export const randomRange = (min: number, max: number): number => {
  return min + Math.random() * (max - min);
};

export const checkAABBCollision = (
  pos1: number[], size1: number[],
  pos2: number[], size2: number[]
): boolean => {
  return (
    pos1[0] - size1[0]/2 < pos2[0] + size2[0]/2 &&
    pos1[0] + size1[0]/2 > pos2[0] - size2[0]/2 &&
    pos1[1] - size1[1]/2 < pos2[1] + size2[1]/2 &&
    pos1[1] + size1[1]/2 > pos2[1] - size2[1]/2 &&
    pos1[2] - size1[2]/2 < pos2[2] + size2[2]/2 &&
    pos1[2] + size1[2]/2 > pos2[2] - size2[2]/2
  );
};

export const generateRandomPosition = (radius: number, height = 1): number[] => {
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * radius;
  return [
    Math.cos(angle) * distance,
    height,
    Math.sin(angle) * distance
  ];
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const saveGameState = (state: any): void => {
  try {
    localStorage.setItem('shadowSurvivorSave', JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
};

export const loadGameState = (): any | null => {
  try {
    const saved = localStorage.getItem('shadowSurvivorSave');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
};

export const clearSavedGame = (): void => {
  try {
    localStorage.removeItem('shadowSurvivorSave');
  } catch (error) {
    console.error('Failed to clear saved game:', error);
  }
};

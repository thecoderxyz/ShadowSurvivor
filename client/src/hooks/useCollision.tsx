import { useMemo } from "react";
import { checkAABBCollision } from "../lib/gameUtils";

// Static collision objects - in a real game these would come from the level data
const COLLISION_OBJECTS = [
  { position: [10, 1, 10], size: [2, 2, 2] },
  { position: [-10, 1, -10], size: [2, 2, 2] },
  { position: [15, 1.5, -5], size: [3, 3, 3] },
  { position: [-15, 1, 15], size: [2, 4, 2] },
];

export const useCollision = () => {
  const checkCollision = useMemo(() => {
    return (position: number[], size: number[]): boolean => {
      // Check world boundaries
      const worldSize = 50;
      if (
        position[0] < -worldSize || position[0] > worldSize ||
        position[2] < -worldSize || position[2] > worldSize
      ) {
        return true; // Collision with world boundary
      }
      
      // Check collision with static objects
      for (const obj of COLLISION_OBJECTS) {
        if (checkAABBCollision(position, size, obj.position, obj.size)) {
          return true;
        }
      }
      
      return false;
    };
  }, []);

  const getCollisionObjects = useMemo(() => {
    return COLLISION_OBJECTS;
  }, []);

  return {
    checkCollision,
    getCollisionObjects
  };
};

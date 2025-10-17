import { useState, useRef } from "react";
import { usePlayer } from "../lib/stores/usePlayer";

interface MobileControlsState {
  movement: { x: number; y: number };
  actions: Record<string, boolean>;
}

export const useMobileControls = () => {
  const { updateVelocity, jump } = usePlayer();
  const [controls, setControls] = useState<MobileControlsState>({
    movement: { x: 0, y: 0 },
    actions: {}
  });

  const setMovement = (x: number, y: number) => {
    setControls(prev => ({
      ...prev,
      movement: { x, y }
    }));
    
    // Apply movement to player
    const moveSpeed = 8;
    const newVelocity = [x * moveSpeed, 0, y * moveSpeed];
    updateVelocity(newVelocity);
  };

  const setAction = (action: string, pressed: boolean) => {
    setControls(prev => ({
      ...prev,
      actions: {
        ...prev.actions,
        [action]: pressed
      }
    }));
    
    // Handle specific actions
    if (pressed) {
      switch (action) {
        case 'jump':
          jump();
          break;
        case 'clone':
          // Shadow clone activation handled by ShadowClone component
          console.log("Mobile: Shadow clone activated");
          break;
        case 'interact':
          console.log("Mobile: Interact pressed");
          break;
        case 'pause':
          console.log("Mobile: Pause pressed");
          break;
      }
    }
  };

  return {
    controls,
    setMovement,
    setAction
  };
};

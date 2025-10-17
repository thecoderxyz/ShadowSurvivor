import { create } from "zustand";

interface PlayerState {
  position: number[];
  velocity: number[];
  health: number;
  maxHealth: number;
  onGround: boolean;
  
  // Actions
  updatePosition: (position: number[]) => void;
  updateVelocity: (velocity: number[]) => void;
  setGrounded: (grounded: boolean) => void;
  jump: () => void;
  takeDamage: (damage: number) => void;
  heal: (amount: number) => void;
  resetPlayer: () => void;
}

export const usePlayer = create<PlayerState>((set, get) => ({
  position: [0, 1, 0],
  velocity: [0, 0, 0],
  health: 100,
  maxHealth: 100,
  onGround: true,
  
  updatePosition: (position: number[]) => {
    set({ position: [...position] });
  },
  
  updateVelocity: (velocity: number[]) => {
    set({ velocity: [...velocity] });
  },
  
  setGrounded: (grounded: boolean) => {
    set({ onGround: grounded });
  },
  
  jump: () => {
    const { onGround } = get();
    if (onGround) {
      set({ 
        velocity: [get().velocity[0], 12, get().velocity[2]],
        onGround: false 
      });
    }
  },
  
  takeDamage: (damage: number) => {
    const { health } = get();
    set({ health: Math.max(0, health - damage) });
  },
  
  heal: (amount: number) => {
    const { health, maxHealth } = get();
    set({ health: Math.min(maxHealth, health + amount) });
  },
  
  resetPlayer: () => {
    set({
      position: [0, 1, 0],
      velocity: [0, 0, 0],
      health: 100,
      onGround: true
    });
  }
}));

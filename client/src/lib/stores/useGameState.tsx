import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GameState = "menu" | "playing" | "paused" | "levelComplete" | "gameComplete" | "gameOver";

interface GameStateStore {
  gameState: GameState;
  currentLevel: number;
  levelProgress: number;
  score: number;
  
  // Actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  nextLevel: () => void;
  resetGame: () => void;
  updateProgress: (progress: number) => void;
  addScore: (points: number) => void;
}

export const useGameState = create<GameStateStore>()(
  subscribeWithSelector((set, get) => ({
    gameState: "menu",
    currentLevel: 0,
    levelProgress: 0,
    score: 0,
    
    startGame: () => {
      set({
        gameState: "playing",
        currentLevel: 0,
        levelProgress: 0,
        score: 0
      });
    },
    
    pauseGame: () => {
      const { gameState } = get();
      if (gameState === "playing") {
        set({ gameState: "paused" });
      }
    },
    
    resumeGame: () => {
      const { gameState } = get();
      if (gameState === "paused") {
        set({ gameState: "playing" });
      }
    },
    
    nextLevel: () => {
      const { currentLevel } = get();
      const newLevel = currentLevel + 1;
      
      // Check if this was the last level (5 levels total: 0-4)
      if (newLevel >= 5) {
        set({
          gameState: "gameComplete",
          currentLevel: newLevel,
          levelProgress: 0
        });
      } else {
        set({
          gameState: "levelComplete",
          currentLevel: newLevel,
          levelProgress: 0
        });
        
        // Auto-continue to next level after a delay
        setTimeout(() => {
          set({ gameState: "playing" });
        }, 3000);
      }
    },
    
    resetGame: () => {
      set({
        gameState: "menu",
        currentLevel: 0,
        levelProgress: 0,
        score: 0
      });
    },
    
    updateProgress: (progress: number) => {
      set({ levelProgress: progress });
    },
    
    addScore: (points: number) => {
      const { score } = get();
      set({ score: score + points });
    }
  }))
);

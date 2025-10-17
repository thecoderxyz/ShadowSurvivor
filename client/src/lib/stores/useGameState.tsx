import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GameState = "menu" | "playing" | "paused" | "levelComplete" | "gameOver";

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
      set({
        gameState: "levelComplete",
        currentLevel: currentLevel + 1,
        levelProgress: 0
      });
      
      // Auto-continue to next level after a delay
      setTimeout(() => {
        set({ gameState: "playing" });
      }, 2000);
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

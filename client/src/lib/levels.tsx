// Level definitions for the post-apocalyptic survival game

export interface LevelData {
  id: number;
  name: string;
  theme: 'ruins' | 'alien' | 'mechanical' | 'wasteland' | 'underground';
  description: string;
  groundTexture: string;
  groundColor: string;
  skyColor: string;
  obstacleCount: number;
  obstacleColor: string;
  enemyCount: number;
  collectibles: Array<{
    type: 'metal' | 'crystal' | 'energy' | 'bio';
    count: number;
  }>;
  objectives: string[];
  difficulty: number; // 1-5
}

export const levels: LevelData[] = [
  {
    id: 0,
    name: "Abandoned Outpost",
    theme: "ruins",
    description: "The remnants of a once-thriving settlement. Learn the basics of survival here.",
    groundTexture: "/textures/asphalt.png",
    groundColor: "#666666",
    skyColor: "#8B7355",
    obstacleCount: 8,
    obstacleColor: "#8D6E63",
    enemyCount: 3,
    collectibles: [
      { type: 'metal', count: 5 },
      { type: 'energy', count: 3 }
    ],
    objectives: [
      "Collect all resources",
      "Defeat the scavenger bots",
      "Practice using your shadow clone"
    ],
    difficulty: 1
  },
  
  {
    id: 1,
    name: "Crystal Caves",
    theme: "alien",
    description: "Underground caverns filled with mysterious alien crystals.",
    groundTexture: "/textures/sand.jpg",
    groundColor: "#4A148C",
    skyColor: "#1A0033",
    obstacleCount: 12,
    obstacleColor: "#7B1FA2",
    enemyCount: 5,
    collectibles: [
      { type: 'crystal', count: 8 },
      { type: 'bio', count: 4 },
      { type: 'energy', count: 2 }
    ],
    objectives: [
      "Harvest alien crystals",
      "Avoid crystal guardian drones",
      "Use shadow clone to access hidden areas"
    ],
    difficulty: 2
  },
  
  {
    id: 2,
    name: "Mechanical Graveyard",
    theme: "mechanical",
    description: "A vast field of broken machinery and defunct robots.",
    groundTexture: "/textures/asphalt.png",
    groundColor: "#263238",
    skyColor: "#37474F",
    obstacleCount: 15,
    obstacleColor: "#455A64",
    enemyCount: 7,
    collectibles: [
      { type: 'metal', count: 12 },
      { type: 'energy', count: 6 },
      { type: 'crystal', count: 3 }
    ],
    objectives: [
      "Salvage mechanical parts",
      "Disable security systems",
      "Clone must activate distant switches"
    ],
    difficulty: 3
  },
  
  {
    id: 3,
    name: "Toxic Wasteland",
    theme: "wasteland",
    description: "A poisoned landscape where only the strongest survive.",
    groundTexture: "/textures/sand.jpg",
    groundColor: "#2E7D32",
    skyColor: "#4CAF50",
    obstacleCount: 18,
    obstacleColor: "#388E3C",
    enemyCount: 8,
    collectibles: [
      { type: 'bio', count: 10 },
      { type: 'metal', count: 6 },
      { type: 'energy', count: 4 }
    ],
    objectives: [
      "Collect bio-samples safely",
      "Survive toxic enemy attacks",
      "Use clone to navigate hazards"
    ],
    difficulty: 4
  },
  
  {
    id: 4,
    name: "The Nexus Core",
    theme: "alien",
    description: "The heart of the alien technology. The final challenge awaits.",
    groundTexture: "/textures/asphalt.png",
    groundColor: "#1A237E",
    skyColor: "#000051",
    obstacleCount: 25,
    obstacleColor: "#3F51B5",
    enemyCount: 12,
    collectibles: [
      { type: 'crystal', count: 15 },
      { type: 'energy', count: 10 },
      { type: 'bio', count: 8 },
      { type: 'metal', count: 8 }
    ],
    objectives: [
      "Gather enough resources to power the escape portal",
      "Defeat the Nexus Guardian",
      "Coordinate with shadow clone for complex puzzles",
      "Survive the final onslaught"
    ],
    difficulty: 5
  }
];

// Additional level configurations
export const getLevelByIndex = (index: number): LevelData => {
  return levels[index] || levels[0];
};

export const getNextLevel = (currentIndex: number): LevelData | null => {
  const nextIndex = currentIndex + 1;
  return levels[nextIndex] || null;
};

export const getTotalLevels = (): number => {
  return levels.length;
};

export const calculateLevelScore = (level: LevelData, timeCompleted: number): number => {
  const baseScore = level.difficulty * 1000;
  const timeBonus = Math.max(0, 300 - timeCompleted) * 10; // Bonus for quick completion
  return Math.round(baseScore + timeBonus);
};

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGameState } from "./lib/stores/useGameState";
import { useAudio } from "./lib/stores/useAudio";
import { useIsMobile } from "./hooks/use-is-mobile";
import Game from "./components/Game";
import MainMenu from "./components/UI/MainMenu";
import MobileControls from "./components/UI/MobileControls";
import "@fontsource/inter";
import "./index.css";

// Define control keys for the game
enum Controls {
  forward = 'forward',
  backward = 'backward',
  leftward = 'leftward',
  rightward = 'rightward',
  jump = 'jump',
  interact = 'interact',
  clone = 'clone',
  inventory = 'inventory',
  pause = 'pause'
}

const controls = [
  { name: Controls.forward, keys: ["KeyW", "ArrowUp"] },
  { name: Controls.backward, keys: ["KeyS", "ArrowDown"] },
  { name: Controls.leftward, keys: ["KeyA", "ArrowLeft"] },
  { name: Controls.rightward, keys: ["KeyD", "ArrowRight"] },
  { name: Controls.jump, keys: ["Space"] },
  { name: Controls.interact, keys: ["KeyE"] },
  { name: Controls.clone, keys: ["KeyQ"] },
  { name: Controls.inventory, keys: ["KeyI", "Tab"] },
  { name: Controls.pause, keys: ["Escape"] }
];

const queryClient = new QueryClient();

// Main App component
function App() {
  const { gameState } = useGameState();
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();
  const isMobile = useIsMobile();
  const [showCanvas, setShowCanvas] = useState(false);

  // Initialize audio
  useEffect(() => {
    const loadAudio = async () => {
      try {
        const bgMusic = new Audio('/sounds/background.mp3');
        const hitSfx = new Audio('/sounds/hit.mp3');
        const successSfx = new Audio('/sounds/success.mp3');
        
        bgMusic.loop = true;
        bgMusic.volume = 0.3;
        
        setBackgroundMusic(bgMusic);
        setHitSound(hitSfx);
        setSuccessSound(successSfx);
        
        setShowCanvas(true);
      } catch (error) {
        console.log("Audio loading failed:", error);
        setShowCanvas(true);
      }
    };
    
    loadAudio();
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  if (!showCanvas) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-screen h-screen relative overflow-hidden bg-black">
        {gameState === 'menu' && <MainMenu />}
        
        {gameState !== 'menu' && (
          <KeyboardControls map={controls}>
            <Canvas
              shadows
              camera={{
                position: [0, 5, 10],
                fov: 60,
                near: 0.1,
                far: 1000
              }}
              gl={{
                antialias: true,
                powerPreference: "high-performance",
                alpha: false
              }}
              className="w-full h-full"
            >
              <color attach="background" args={["#0a0a0a"]} />
              <Suspense fallback={null}>
                <Game />
              </Suspense>
            </Canvas>
            
            {isMobile && <MobileControls />}
          </KeyboardControls>
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;

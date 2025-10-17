import { useGameState } from "../../lib/stores/useGameState";
import { useAudio } from "../../lib/stores/useAudio";

export default function MainMenu() {
  const { startGame } = useGameState();
  const { toggleMute, isMuted } = useAudio();

  const handleStartGame = () => {
    startGame();
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
      <div className="text-center space-y-8 max-w-md mx-auto px-6">
        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-white drop-shadow-lg">
            SHADOW
          </h1>
          <h2 className="text-4xl font-bold text-purple-400 drop-shadow-lg">
            SURVIVOR
          </h2>
          <p className="text-lg text-gray-300 max-w-sm mx-auto">
            Navigate the post-apocalyptic world, collect resources, and use your shadow clone to survive
          </p>
        </div>

        {/* Menu Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleStartGame}
            className="w-full py-4 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xl rounded-lg transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            START GAME
          </button>
          
          <button
            onClick={toggleMute}
            className="w-full py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
          >
            {isMuted ? "🔇 UNMUTE" : "🔊 MUTE"}
          </button>
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-400 space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-left">
              <strong>Desktop:</strong><br />
              WASD - Move<br />
              Space - Jump<br />
              Q - Shadow Clone<br />
              E - Interact
            </div>
            <div className="text-left">
              <strong>Mobile:</strong><br />
              Joystick - Move<br />
              Tap buttons<br />
              Swipe camera<br />
              Touch interact
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="text-xs text-gray-500 max-w-xs mx-auto">
          ✨ Progressive levels • 🎯 Resource crafting • 👥 Shadow clone puzzles • 🌅 Day/night cycle
        </div>
      </div>
    </div>
  );
}

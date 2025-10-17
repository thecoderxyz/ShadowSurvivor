import { useGameState } from "../../lib/stores/useGameState";
import { useAudio } from "../../lib/stores/useAudio";
import { motion } from "framer-motion";

export default function MainMenu() {
  const { startGame } = useGameState();
  const { toggleMute, isMuted } = useAudio();

  const handleStartGame = () => {
    startGame();
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-500/30 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight 
            }}
            animate={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight 
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
          />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-6 sm:space-y-8 max-w-2xl mx-auto px-4 sm:px-6 relative z-10"
      >
        {/* Title */}
        <div className="space-y-2 sm:space-y-4">
          <motion.h1 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white drop-shadow-2xl"
          >
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              SHADOW
            </span>
          </motion.h1>
          <motion.h2 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-bold text-purple-400 drop-shadow-2xl"
          >
            SURVIVOR
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm sm:text-lg lg:text-xl text-gray-300 max-w-xl mx-auto leading-relaxed"
          >
            Navigate the post-apocalyptic world, collect resources, and use your shadow clone to survive through progressive levels
          </motion.p>
        </div>

        {/* Menu Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-3 sm:space-y-4"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartGame}
            className="w-full py-3 sm:py-4 px-6 sm:px-8 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white font-bold text-lg sm:text-xl rounded-xl transform transition-all duration-200 shadow-2xl shadow-purple-500/50 border-2 border-white/20"
          >
            <span className="flex items-center justify-center gap-2">
              <span>START GAME</span>
              <span className="text-2xl">▶</span>
            </span>
          </motion.button>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMute}
              className="py-2 sm:py-3 px-4 sm:px-6 bg-gray-700/80 backdrop-blur-sm hover:bg-gray-600/80 text-white font-medium rounded-lg transition-all duration-200 border border-white/10"
            >
              <span className="flex items-center justify-center gap-2">
                <span className="text-xl">{isMuted ? "🔇" : "🔊"}</span>
                <span className="text-sm sm:text-base">{isMuted ? "UNMUTE" : "MUTE"}</span>
              </span>
            </motion.button>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="py-2 sm:py-3 px-4 sm:px-6 bg-blue-600/20 backdrop-blur-sm text-blue-300 font-medium rounded-lg border border-blue-500/30 flex items-center justify-center gap-2"
            >
              <span className="text-xl">🎮</span>
              <span className="text-sm sm:text-base">5 LEVELS</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xs sm:text-sm text-gray-400 space-y-3 sm:space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 bg-black/30 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-white/10">
            <div className="text-left space-y-1">
              <div className="font-bold text-purple-400 mb-2">Desktop Controls:</div>
              <div className="space-y-1 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white/10 rounded text-xs font-mono">WASD</kbd>
                  <span>Move</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white/10 rounded text-xs font-mono">Space</kbd>
                  <span>Jump</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white/10 rounded text-xs font-mono">Q</kbd>
                  <span>Shadow Clone</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white/10 rounded text-xs font-mono">E</kbd>
                  <span>Interact</span>
                </div>
              </div>
            </div>
            <div className="text-left space-y-1">
              <div className="font-bold text-blue-400 mb-2">Mobile Controls:</div>
              <div className="space-y-1 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-white/10 rounded text-xs">🕹️</span>
                  <span>Joystick - Move</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-green-500/20 rounded text-xs">↑</span>
                  <span>Jump Button</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-purple-500/20 rounded text-xs">Q</span>
                  <span>Clone Button</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-blue-500/20 rounded text-xs">E</span>
                  <span>Interact Button</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-[10px] sm:text-xs text-gray-500 max-w-2xl mx-auto bg-black/20 backdrop-blur-sm p-2 sm:p-3 rounded-lg border border-white/5"
        >
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <span className="bg-purple-500/10 px-2 sm:px-3 py-1 rounded-full border border-purple-500/20">✨ Progressive Levels</span>
            <span className="bg-blue-500/10 px-2 sm:px-3 py-1 rounded-full border border-blue-500/20">🎯 Resource Crafting</span>
            <span className="bg-pink-500/10 px-2 sm:px-3 py-1 rounded-full border border-pink-500/20">👥 Shadow Clone</span>
            <span className="bg-green-500/10 px-2 sm:px-3 py-1 rounded-full border border-green-500/20">🌅 Day/Night Cycle</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

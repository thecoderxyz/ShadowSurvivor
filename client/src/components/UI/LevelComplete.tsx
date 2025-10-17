import { useEffect } from "react";
import { motion } from "framer-motion";
import { useGameState } from "../../lib/stores/useGameState";
import { useInventory } from "../../lib/stores/useInventory";
import { levels } from "../../lib/levels";

export default function LevelComplete() {
  const { currentLevel, score, resumeGame } = useGameState();
  const { resources } = useInventory();

  const currentLevelData = levels[currentLevel - 1]; // Since we already incremented
  const nextLevelData = levels[currentLevel];

  useEffect(() => {
    // Auto-continue after 3 seconds
    const timer = setTimeout(() => {
      resumeGame();
    }, 3000);

    return () => clearTimeout(timer);
  }, [resumeGame]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-xl rounded-2xl border-2 border-purple-500/50 p-6 sm:p-8 max-w-2xl w-full shadow-2xl"
      >
        {/* Confetti effect */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: ['#f59e0b', '#8b5cf6', '#ec4899', '#3b82f6'][i % 4],
                left: `${Math.random() * 100}%`,
                top: '-10%'
              }}
              animate={{
                y: ['0vh', '110vh'],
                rotate: [0, 360],
                opacity: [1, 0]
              }}
              transition={{
                duration: Math.random() * 2 + 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center space-y-6">
          {/* Victory Title */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-6xl sm:text-8xl mb-4">🎉</div>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-2">
              LEVEL COMPLETE!
            </h2>
            <p className="text-lg sm:text-xl text-purple-300">
              {currentLevelData?.name || 'Level Complete'}
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="text-yellow-400 text-3xl mb-1">⭐</div>
              <div className="text-2xl font-bold text-white">{score}</div>
              <div className="text-xs text-gray-400">Score</div>
            </div>

            {Object.entries(resources).map(([type, amount]) => (
              <div key={type} className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="text-3xl mb-1">
                  {type === 'metal' && '🔩'}
                  {type === 'crystal' && '💎'}
                  {type === 'energy' && '⚡'}
                  {type === 'bio' && '🧬'}
                </div>
                <div className="text-2xl font-bold text-white">{amount}</div>
                <div className="text-xs text-gray-400 capitalize">{type}</div>
              </div>
            ))}
          </motion.div>

          {/* Next Level Preview */}
          {nextLevelData ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20"
            >
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Next Level</h3>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-xl">
                  {currentLevel + 1}
                </div>
                <div className="text-left">
                  <div className="text-white font-semibold">{nextLevelData.name}</div>
                  <div className="text-sm text-gray-400">{nextLevelData.description}</div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3, ease: "linear" }}
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                  />
                </div>
                <span className="text-gray-400 text-xs">Auto-continue...</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/50"
            >
              <div className="text-5xl mb-3">🏆</div>
              <h3 className="text-2xl font-bold text-yellow-400 mb-2">All Levels Complete!</h3>
              <p className="text-gray-300">You've conquered all levels. Amazing work, survivor!</p>
            </motion.div>
          )}

          {/* Continue hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ delay: 1, duration: 1.5, repeat: Infinity }}
            className="text-sm text-gray-400"
          >
            {nextLevelData ? 'Advancing to next level...' : 'Returning to menu...'}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

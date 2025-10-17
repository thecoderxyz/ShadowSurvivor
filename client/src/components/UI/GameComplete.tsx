import { motion } from "framer-motion";
import { useGameState } from "../../lib/stores/useGameState";
import { useInventory } from "../../lib/stores/useInventory";

export default function GameComplete() {
  const { score, resetGame } = useGameState();
  const { resources } = useInventory();

  const totalResources = Object.values(resources).reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="bg-gradient-to-br from-yellow-900/90 via-orange-900/90 to-red-900/90 backdrop-blur-xl rounded-3xl border-4 border-yellow-500/70 p-8 sm:p-12 max-w-3xl w-full shadow-2xl relative overflow-hidden"
      >
        {/* Animated background stars */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-300 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center space-y-8">
          {/* Trophy animation */}
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -10, 10, 0],
              scale: [1, 1.1, 1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1
            }}
            className="text-9xl mb-6"
          >
            🏆
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-5xl sm:text-7xl font-bold text-yellow-300 mb-4 drop-shadow-2xl">
              VICTORY!
            </h1>
            <h2 className="text-2xl sm:text-4xl font-bold text-orange-300 mb-2">
              All Levels Completed
            </h2>
            <p className="text-lg sm:text-xl text-gray-300">
              You've conquered the post-apocalyptic world!
            </p>
          </motion.div>

          {/* Final Stats */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30"
          >
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">Final Stats</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-4">
                <div className="text-4xl mb-2">⭐</div>
                <div className="text-3xl font-bold text-white">{score}</div>
                <div className="text-sm text-gray-300">Total Score</div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-4">
                <div className="text-4xl mb-2">💎</div>
                <div className="text-3xl font-bold text-white">{totalResources}</div>
                <div className="text-sm text-gray-300">Resources</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-4 col-span-2 sm:col-span-1">
                <div className="text-4xl mb-2">🎯</div>
                <div className="text-3xl font-bold text-white">5/5</div>
                <div className="text-sm text-gray-300">Levels</div>
              </div>
            </div>
          </motion.div>

          {/* Resource Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {Object.entries(resources).map(([type, amount]) => (
              <div key={type} className="bg-black/30 rounded-lg p-3 border border-white/10">
                <div className="text-2xl mb-1">
                  {type === 'metal' && '🔩'}
                  {type === 'crystal' && '💎'}
                  {type === 'energy' && '⚡'}
                  {type === 'bio' && '🧬'}
                </div>
                <div className="text-xl font-bold text-white">{amount}</div>
                <div className="text-xs text-gray-400 capitalize">{type}</div>
              </div>
            ))}
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30"
          >
            <h3 className="text-lg font-bold text-purple-300 mb-3">Achievements Unlocked</h3>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="bg-yellow-500/20 px-3 py-1 rounded-full text-sm border border-yellow-500/40">
                🌟 Survivor
              </span>
              <span className="bg-purple-500/20 px-3 py-1 rounded-full text-sm border border-purple-500/40">
                👥 Shadow Master
              </span>
              <span className="bg-blue-500/20 px-3 py-1 rounded-full text-sm border border-blue-500/40">
                💎 Resource Hoarder
              </span>
              <span className="bg-green-500/20 px-3 py-1 rounded-full text-sm border border-green-500/40">
                ⚔️ Enemy Slayer
              </span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="space-y-3 pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetGame}
              className="w-full py-4 px-8 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 hover:from-yellow-500 hover:via-orange-500 hover:to-red-500 text-white font-bold text-xl rounded-xl shadow-2xl shadow-yellow-500/50 border-2 border-yellow-400/30"
            >
              <span className="flex items-center justify-center gap-2">
                <span>🔄</span>
                <span>PLAY AGAIN</span>
              </span>
            </motion.button>
            
            <div className="text-sm text-gray-400">
              Thank you for playing Shadow Survivor!
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

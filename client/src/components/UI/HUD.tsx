import { Html } from "@react-three/drei";
import { usePlayer } from "../../lib/stores/usePlayer";
import { useInventory } from "../../lib/stores/useInventory";
import { useGameState } from "../../lib/stores/useGameState";
import { useIsMobile } from "../../hooks/use-is-mobile";
import { motion, AnimatePresence } from "framer-motion";

export default function HUD() {
  const { health, position } = usePlayer();
  const { resources } = useInventory();
  const { currentLevel, score } = useGameState();
  const isMobile = useIsMobile();

  const healthPercent = Math.max(0, Math.min(100, health));
  const healthColor = healthPercent > 60 ? 'from-green-500 to-green-600' : healthPercent > 30 ? 'from-yellow-500 to-orange-500' : 'from-red-500 to-red-600';

  return (
    <Html
      as="div"
      transform={false}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 100
      }}
    >
      {/* Top HUD */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 flex justify-between items-start gap-2 sm:gap-4">
        {/* Health and Level */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-black/40 backdrop-blur-md rounded-lg sm:rounded-xl p-2 sm:p-3 text-white border border-white/10 shadow-2xl"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-sm sm:text-base">
                {currentLevel + 1}
              </div>
              <div className="text-xs sm:text-sm font-medium">Level {currentLevel + 1}</div>
            </div>
            <div className="hidden sm:block w-px h-6 bg-white/20"></div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="text-xs text-gray-400">HP</div>
              <div className="w-24 sm:w-32 h-3 sm:h-4 bg-gray-800/80 rounded-full overflow-hidden border border-white/10 shadow-inner">
                <motion.div 
                  className={`h-full bg-gradient-to-r ${healthColor} shadow-lg`}
                  initial={{ width: '100%' }}
                  animate={{ width: `${healthPercent}%` }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-full h-full bg-white/20 animate-pulse"></div>
                </motion.div>
              </div>
              <span className="text-xs sm:text-sm font-bold min-w-[2rem]">{Math.round(health)}</span>
            </div>
          </div>
        </motion.div>

        {/* Score */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-md rounded-lg sm:rounded-xl p-2 sm:p-3 text-white border border-white/10 shadow-2xl"
        >
          <div className="flex items-center gap-2">
            <div className="text-yellow-400 text-lg sm:text-xl">⭐</div>
            <div className="text-xs sm:text-sm font-bold">{score}</div>
          </div>
        </motion.div>
      </div>

      {/* Resource Inventory - Top Right */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-16 sm:top-20 right-2 sm:right-4"
      >
        <div className="bg-black/40 backdrop-blur-md rounded-lg sm:rounded-xl p-2 sm:p-3 text-white border border-white/10 shadow-2xl min-w-[120px] sm:min-w-[160px]">
          <h3 className="text-xs sm:text-sm font-semibold mb-2 text-gray-300">Resources</h3>
          <div className="space-y-1">
            <AnimatePresence>
              {Object.entries(resources).map(([type, amount]) => (
                <motion.div 
                  key={type} 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex justify-between items-center text-xs sm:text-sm bg-white/5 rounded px-2 py-1 backdrop-blur-sm"
                >
                  <span className="capitalize flex items-center gap-1">
                    {type === 'metal' && '🔩'}
                    {type === 'crystal' && '💎'}
                    {type === 'energy' && '⚡'}
                    {type === 'bio' && '🧬'}
                    <span className="hidden sm:inline">{type}</span>
                  </span>
                  <motion.span 
                    key={amount}
                    initial={{ scale: 1.5, color: '#fbbf24' }}
                    animate={{ scale: 1, color: '#ffffff' }}
                    className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-2 py-0.5 rounded font-bold"
                  >
                    {amount}
                  </motion.span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Minimap - Top Right Corner */}
      {!isMobile && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-2 sm:top-4 right-2 sm:right-4 lg:right-52"
        >
          <div className="bg-black/40 backdrop-blur-md rounded-lg border border-white/10 p-2 shadow-2xl">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-900/50 to-blue-900/50 relative rounded border border-green-500/30">
              {/* Grid lines */}
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="border border-green-500/10"></div>
                ))}
              </div>
              {/* Player dot */}
              <motion.div 
                animate={{ 
                  left: `${50 + (position[0] / 50) * 50}%`,
                  top: `${50 + (position[2] / 50) * 50}%`
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute w-2 h-2 bg-green-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-green-500/50"
              >
                <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Objectives - Bottom Left */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-20 sm:bottom-24 left-2 sm:left-4 max-w-[90%] sm:max-w-md"
      >
        <div className="bg-black/40 backdrop-blur-md rounded-lg sm:rounded-xl p-2 sm:p-3 text-white border border-white/10 shadow-2xl">
          <h3 className="text-xs sm:text-sm font-semibold mb-2 text-gray-300">Objectives</h3>
          <ul className="text-[10px] sm:text-xs space-y-1">
            <motion.li 
              whileHover={{ x: 5 }}
              className="flex items-center gap-2 bg-white/5 rounded px-2 py-1"
            >
              <div className="w-2 h-2 bg-yellow-400 rounded-full shadow-lg shadow-yellow-500/50 animate-pulse"></div>
              Collect all resources
            </motion.li>
            <motion.li 
              whileHover={{ x: 5 }}
              className="flex items-center gap-2 bg-white/5 rounded px-2 py-1"
            >
              <div className="w-2 h-2 bg-red-400 rounded-full shadow-lg shadow-red-500/50 animate-pulse"></div>
              Defeat all enemies
            </motion.li>
            <motion.li 
              whileHover={{ x: 5 }}
              className="flex items-center gap-2 bg-white/5 rounded px-2 py-1"
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full shadow-lg shadow-blue-500/50"></div>
              Use shadow clone (Q)
            </motion.li>
          </ul>
        </div>
      </motion.div>

      {/* Controls Help - Bottom Right */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4"
      >
        <div className="bg-black/40 backdrop-blur-md rounded-lg sm:rounded-xl p-2 sm:p-3 text-white border border-white/10 shadow-2xl text-[10px] sm:text-xs">
          {isMobile ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[8px]">🕹️</div>
                <span>Joystick: Move</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-500/30 flex items-center justify-center">↑</div>
                <span>Jump</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[9px] sm:text-xs font-mono">WASD</kbd>
                <span>Move</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[9px] sm:text-xs font-mono">Space</kbd>
                <span>Jump</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[9px] sm:text-xs font-mono">Q</kbd>
                <span>Clone</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[9px] sm:text-xs font-mono">E</kbd>
                <span>Interact</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </Html>
  );
}

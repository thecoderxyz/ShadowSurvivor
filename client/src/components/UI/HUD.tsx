import { Html } from "@react-three/drei";
import { usePlayer } from "../../lib/stores/usePlayer";
import { useInventory } from "../../lib/stores/useInventory";
import { useGameState } from "../../lib/stores/useGameState";
import { useIsMobile } from "../../hooks/use-is-mobile";

export default function HUD() {
  const { health, position } = usePlayer();
  const { resources } = useInventory();
  const { currentLevel } = useGameState();
  const isMobile = useIsMobile();

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
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
        {/* Health and Level */}
        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white">
          <div className="flex items-center gap-3">
            <div className="text-sm">Level {currentLevel + 1}</div>
            <div className="w-px h-6 bg-white/30"></div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-3 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 transition-all duration-300"
                  style={{ width: `${health}%` }}
                ></div>
              </div>
              <span className="text-sm">{Math.round(health)}</span>
            </div>
          </div>
        </div>

        {/* Minimap */}
        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-2">
          <div className="w-24 h-24 bg-green-900/50 relative rounded border">
            {/* Player dot */}
            <div 
              className="absolute w-2 h-2 bg-green-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${50 + (position[0] / 50) * 50}%`,
                top: `${50 + (position[2] / 50) * 50}%`
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Resource Inventory */}
      <div className="absolute top-4 right-4">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white min-w-[200px]">
          <h3 className="text-sm font-semibold mb-2">Resources</h3>
          <div className="space-y-1">
            {Object.entries(resources).map(([type, amount]) => (
              <div key={type} className="flex justify-between items-center text-xs">
                <span className="capitalize">{type}</span>
                <span className="bg-white/20 px-2 py-0.5 rounded">{amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Objectives */}
      <div className="absolute bottom-20 left-4 right-4">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white max-w-md">
          <h3 className="text-sm font-semibold mb-2">Objectives</h3>
          <ul className="text-xs space-y-1">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              Collect all resources
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              Defeat all enemies
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Use shadow clone (Q)
            </li>
          </ul>
        </div>
      </div>

      {/* Controls Help (Mobile) */}
      {isMobile && (
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
          <div className="bg-black/70 backdrop-blur-sm rounded-lg p-2 text-white text-xs">
            <div>Tap & drag to move</div>
            <div>Tap buttons to interact</div>
          </div>
        </div>
      )}

      {/* Controls Help (Desktop) */}
      {!isMobile && (
        <div className="absolute bottom-4 right-4">
          <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>WASD: Move</div>
              <div>Space: Jump</div>
              <div>Q: Shadow Clone</div>
              <div>E: Interact</div>
            </div>
          </div>
        </div>
      )}
    </Html>
  );
}

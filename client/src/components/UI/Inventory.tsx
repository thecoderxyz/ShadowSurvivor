import { useState } from "react";
import { useInventory } from "../../lib/stores/useInventory";

interface InventoryProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Inventory({ isOpen, onClose }: InventoryProps) {
  const { resources, craftItem, canCraft } = useInventory();
  const [selectedTab, setSelectedTab] = useState<'resources' | 'crafting'>('resources');

  const craftingRecipes = [
    {
      id: 'health_pack',
      name: 'Health Pack',
      description: 'Restore 50 HP',
      requires: { bio: 3, energy: 1 },
      icon: '❤️'
    },
    {
      id: 'energy_boost',
      name: 'Energy Boost',
      description: 'Temporary speed increase',
      requires: { energy: 2, crystal: 1 },
      icon: '⚡'
    },
    {
      id: 'shield',
      name: 'Shield',
      description: 'Damage protection',
      requires: { metal: 4, crystal: 2 },
      icon: '🛡️'
    },
    {
      id: 'clone_enhance',
      name: 'Clone Enhancer',
      description: 'Longer clone duration',
      requires: { bio: 2, energy: 3, crystal: 1 },
      icon: '👥'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900/90 rounded-xl border border-gray-700 w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Inventory</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setSelectedTab('resources')}
            className={`px-6 py-3 font-medium transition-colors ${
              selectedTab === 'resources'
                ? 'text-white border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Resources
          </button>
          <button
            onClick={() => setSelectedTab('crafting')}
            className={`px-6 py-3 font-medium transition-colors ${
              selectedTab === 'crafting'
                ? 'text-white border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Crafting
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {selectedTab === 'resources' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(resources).map(([type, amount]) => (
                <div
                  key={type}
                  className="bg-gray-800 rounded-lg p-4 text-center border border-gray-600"
                >
                  <div className="text-3xl mb-2">
                    {type === 'metal' && '🔩'}
                    {type === 'crystal' && '💎'}
                    {type === 'energy' && '⚡'}
                    {type === 'bio' && '🧬'}
                  </div>
                  <div className="text-white font-medium capitalize">{type}</div>
                  <div className="text-2xl font-bold text-yellow-400">{amount}</div>
                </div>
              ))}
            </div>
          )}

          {selectedTab === 'crafting' && (
            <div className="space-y-4">
              {craftingRecipes.map((recipe) => {
                const canCraftItem = canCraft(recipe.requires);
                
                return (
                  <div
                    key={recipe.id}
                    className={`bg-gray-800 rounded-lg p-4 border ${
                      canCraftItem ? 'border-green-500' : 'border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{recipe.icon}</div>
                        <div>
                          <div className="text-white font-medium">{recipe.name}</div>
                          <div className="text-gray-400 text-sm">{recipe.description}</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xs text-gray-400 mb-2">Requires:</div>
                        <div className="space-y-1">
                          {Object.entries(recipe.requires).map(([type, amount]) => (
                            <div
                              key={type}
                              className={`text-xs ${
                                resources[type] >= amount ? 'text-green-400' : 'text-red-400'
                              }`}
                            >
                              {type}: {amount}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => canCraftItem && craftItem(recipe.id, recipe.requires)}
                      disabled={!canCraftItem}
                      className={`w-full mt-3 py-2 px-4 rounded font-medium transition-colors ${
                        canCraftItem
                          ? 'bg-green-600 hover:bg-green-500 text-white'
                          : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {canCraftItem ? 'Craft' : 'Insufficient Resources'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

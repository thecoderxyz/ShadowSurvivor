import { create } from "zustand";

interface InventoryState {
  resources: Record<string, number>;
  inventory: Record<string, number>;
  
  // Actions
  addResource: (type: string, amount: number) => void;
  removeResource: (type: string, amount: number) => boolean;
  addItem: (type: string, amount?: number) => void;
  removeItem: (type: string, amount?: number) => boolean;
  canCraft: (requirements: Record<string, number>) => boolean;
  craftItem: (itemId: string, requirements: Record<string, number>) => boolean;
  resetInventory: () => void;
}

export const useInventory = create<InventoryState>((set, get) => ({
  resources: {
    metal: 0,
    crystal: 0,
    energy: 0,
    bio: 0
  },
  inventory: {},
  
  addResource: (type: string, amount: number) => {
    set((state) => ({
      resources: {
        ...state.resources,
        [type]: (state.resources[type] || 0) + amount
      }
    }));
  },
  
  removeResource: (type: string, amount: number) => {
    const { resources } = get();
    const currentAmount = resources[type] || 0;
    
    if (currentAmount >= amount) {
      set((state) => ({
        resources: {
          ...state.resources,
          [type]: currentAmount - amount
        }
      }));
      return true;
    }
    return false;
  },
  
  addItem: (type: string, amount = 1) => {
    set((state) => ({
      inventory: {
        ...state.inventory,
        [type]: (state.inventory[type] || 0) + amount
      }
    }));
  },
  
  removeItem: (type: string, amount = 1) => {
    const { inventory } = get();
    const currentAmount = inventory[type] || 0;
    
    if (currentAmount >= amount) {
      set((state) => ({
        inventory: {
          ...state.inventory,
          [type]: currentAmount - amount
        }
      }));
      return true;
    }
    return false;
  },
  
  canCraft: (requirements: Record<string, number>) => {
    const { resources } = get();
    
    return Object.entries(requirements).every(([type, amount]) => {
      return (resources[type] || 0) >= amount;
    });
  },
  
  craftItem: (itemId: string, requirements: Record<string, number>) => {
    const { canCraft, removeResource, addItem } = get();
    
    if (canCraft(requirements)) {
      // Remove required resources
      Object.entries(requirements).forEach(([type, amount]) => {
        removeResource(type, amount);
      });
      
      // Add crafted item
      addItem(itemId, 1);
      
      console.log(`Crafted: ${itemId}`);
      return true;
    }
    return false;
  },
  
  resetInventory: () => {
    set({
      resources: {
        metal: 0,
        crystal: 0,
        energy: 0,
        bio: 0
      },
      inventory: {}
    });
  }
}));

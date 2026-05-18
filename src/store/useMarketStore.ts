import { create } from 'zustand';

interface MarketState {
  isSoundEnabled: boolean;
  toggleSound: () => void;
  lastReadAlertId: string | null;
  setLastReadAlertId: (id: string) => void;
}

export const useMarketStore = create<MarketState>((set) => ({
  isSoundEnabled: true,
  toggleSound: () => set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),
  lastReadAlertId: null,
  setLastReadAlertId: (id) => set({ lastReadAlertId: id }),
}));

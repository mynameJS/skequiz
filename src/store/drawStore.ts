import { create } from 'zustand';

interface DrawState {
  tempDrawerId: string | null;
  setTempDrawerId: (id: string) => void;
}

export const useDrawStore = create<DrawState>(set => ({
  tempDrawerId: '',
  setTempDrawerId: (id: string) => set({ tempDrawerId: id }),
}));

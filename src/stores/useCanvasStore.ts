import create from "zustand";

interface CanvasState {
  tileSize: number;
  setTileSize: (size: number) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  tileSize: 10,
  setTileSize: (size: number) => set({ tileSize: size }),
}));

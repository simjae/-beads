import { create } from "zustand";

interface ImageData {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageState {
  uploadedImages: ImageData[];
  addImage: (img: ImageData) => void;
  updateImage: (index: number, newImage: ImageData) => void;
  tileSize: number;
  setTileSize: (size: number) => void;
  savedCanvasState: {
    images: ImageData[];
    canvasWidth: number;
    canvasHeight: number;
  } | null;
  saveCanvasState: (canvasData: {
    images: ImageData[];
    canvasWidth: number;
    canvasHeight: number;
  }) => void;
}

export const useImageStore = create<ImageState>((set) => ({
  uploadedImages: [],
  addImage: (img) =>
    set((state) => ({
      uploadedImages: [...state.uploadedImages, img],
    })),
  updateImage: (index, newImage) =>
    set((state) => {
      const newImages = [...state.uploadedImages];
      newImages[index] = newImage;
      return { uploadedImages: newImages };
    }),
  tileSize: 10,
  setTileSize: (size: number) => set({ tileSize: size }),
  savedCanvasState: null,
  saveCanvasState: (canvasData) => set({ savedCanvasState: canvasData }),
}));

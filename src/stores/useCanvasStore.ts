import { create } from "zustand";

interface ImageState {
  id: number;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
}

interface CanvasState {
  images: ImageState[];
  canvasWidth: number;
  canvasHeight: number;
  gridSize: number;
  gridColor: string;
  imageOpacity: number;
  addImage: (image: ImageState) => void;
  updateImage: (id: number, updatedImage: Partial<ImageState>) => void;
  selectImage: (id: number) => void;
  clearImages: () => void;
  updateCanvasSize: (width: number, height: number) => void;
  updateGridSize: (size: number) => void;
  updateGridColor: (color: string) => void;
  updateImageOpacity: (opacity: number) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  images: [],
  canvasWidth: 1024,
  canvasHeight: 1024,
  gridSize: 20,
  gridColor: "#ddd",
  imageOpacity: 1,
  addImage: (image) => set((state) => ({ images: [...state.images, image] })),
  updateImage: (id, updatedImage) =>
    set((state) => ({
      images: state.images.map((img) =>
        img.id === id ? { ...img, ...updatedImage } : img
      ),
    })),
  selectImage: (id) =>
    set((state) => ({
      images: state.images.map((img) =>
        img.id === id
          ? { ...img, isSelected: true }
          : { ...img, isSelected: false }
      ),
    })),
  clearImages: () => set({ images: [] }),
  updateCanvasSize: (width, height) =>
    set({ canvasWidth: width, canvasHeight: height }),
  updateGridSize: (size) => set({ gridSize: size }),
  updateGridColor: (color) => set({ gridColor: color }),
  updateImageOpacity: (opacity) => set({ imageOpacity: opacity }),
}));

interface PreviewState {
  pixelatedData: HTMLCanvasElement | null;
  setPixelatedData: (data: HTMLCanvasElement) => void;
  clearPixelatedData: () => void;
}

export const usePreviewStore = create<PreviewState>((set) => ({
  pixelatedData: null,
  setPixelatedData: (data) => set({ pixelatedData: data }),
  clearPixelatedData: () => set({ pixelatedData: null }),
}));

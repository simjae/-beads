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
  pixelCount: number; // 추가된 상태
  addImage: (image: ImageState) => void;
  updateImage: (id: number, updatedImage: Partial<ImageState>) => void;
  selectImage: (id: number) => void;
  clearImages: () => void;
  updateCanvasSize: (width: number, height: number) => void;
  updateGridSize: (size: number) => void;
  updateGridColor: (color: string) => void;
  updateImageOpacity: (opacity: number) => void;
  setPixelCount: (count: number) => void; // 추가된 메소드
}

export const useCanvasStore = create<CanvasState>((set) => ({
  images: [],
  canvasWidth: 1024,
  canvasHeight: 1024,
  gridSize: 20,
  gridColor: "#ddd",
  imageOpacity: 1,
  pixelCount: 100, // 기본값을 100피스로 설정
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
  setPixelCount: (count) => set({ pixelCount: count }), // 추가된 상태 업데이트 메소드
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

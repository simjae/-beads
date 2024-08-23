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
  pixelCount: number;
  addImage: (image: ImageState) => void;
  updateImage: (id: number, updatedImage: Partial<ImageState>) => void;
  selectImage: (id: number) => void;
  clearImages: () => void;
  updateCanvasSize: (width: number, height: number) => void;
  updateGridSize: (size: number) => void;
  updateGridColor: (color: string) => void;
  updateImageOpacity: (opacity: number) => void;
  setPixelCount: (count: number) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  images: [],
  canvasWidth: 1024,
  canvasHeight: 1024,
  gridSize: 20,
  gridColor: "#ddd",
  imageOpacity: 1,
  pixelCount: 100,
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
  setPixelCount: (count) => set({ pixelCount: count }),
}));

interface PreviewStoreState {
  pixelatedData: HTMLCanvasElement | null;
  colorStats: { [color: string]: number };
  beadPattern: string[][]; // 단순화된 패턴 상태 추가
  setPixelatedData: (data: HTMLCanvasElement) => void;
  setColorStats: (stats: { [color: string]: number }) => void;
  setBeadPattern: (pattern: string[][]) => void; // 단순화된 패턴 설정 메소드 추가
}

export const usePreviewStore = create<PreviewStoreState>((set) => ({
  pixelatedData: null,
  colorStats: {},
  beadPattern: [], // 초기 상태
  setPixelatedData: (data) => set({ pixelatedData: data }),
  setColorStats: (stats) => set({ colorStats: stats }),
  setBeadPattern: (pattern) => set({ beadPattern: pattern }), // 상태 업데이트 메소드
}));

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
  pixelatedData: HTMLCanvasElement | null;
  colorStats: { [color: string]: number };
  beadPattern: string[][]; // 단순화된 패턴 상태 추가
  simplifiedImageData: ImageData | null;
  zoomPanEnabled: boolean;
  previewZoomPanEnabled: boolean;
  previewMode: string;

  addImage: (image: ImageState) => void;
  updateImage: (id: number, updatedImage: Partial<ImageState>) => void;
  selectImage: (id: number) => void;
  clearImages: () => void;
  updateCanvasSize: (width: number, height: number) => void;
  updateGridSize: (size: number) => void;
  updateGridColor: (color: string) => void;
  updateImageOpacity: (opacity: number) => void;
  setPixelCount: (count: number) => void;

  setPixelatedData: (data: HTMLCanvasElement | null) => void;
  setColorStats: (stats: { [color: string]: number }) => void;
  setBeadPattern: (pattern: string[][]) => void; // 단순화된 패턴 설정 메소드 추가
  setSimplifiedImageData: (data: ImageData | null) => void;
  setPreviewMode: (mode: string) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  images: [],
  canvasWidth: 1024,
  canvasHeight: 1024,
  gridSize: 20,
  gridColor: "#ddd",
  imageOpacity: 1,
  pixelCount: 100,
  pixelatedData: null,
  colorStats: {},
  beadPattern: [], // 초기 상태
  simplifiedImageData: null,
  zoomPanEnabled: true,
  previewZoomPanEnabled: true,
  previewMode: "pixelated",

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

  setPixelatedData: (data) => set({ pixelatedData: data || null }),
  setColorStats: (stats) => set({ colorStats: stats || {} }),
  setBeadPattern: (pattern) => set({ beadPattern: pattern || [] }),
  setSimplifiedImageData: (data) => set({ simplifiedImageData: data || null }),
  setPreviewMode: (mode) => set({ previewMode: mode }),
}));

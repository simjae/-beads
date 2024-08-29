import { create } from "zustand";

// ImageState 인터페이스
interface ImageState {
  id: number;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
}

// CanvasState 인터페이스
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
  beadPattern: string[][];
  simplifiedImageData: ImageData | null;
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
  setBeadPattern: (pattern: string[][]) => void;
  setSimplifiedImageData: (data: ImageData | null) => void;
  resetCanvas: () => void;
  clearOptions: () => void;
}

// 통합된 상태 관리
export const useBeadsStore = create<CanvasState>((set) => ({
  images: [],
  canvasWidth: 1024,
  canvasHeight: 1024,
  gridSize: 20,
  gridColor: "#ddd",
  imageOpacity: 1,
  pixelCount: 100,
  pixelatedData: null,
  colorStats: {},
  beadPattern: [],
  simplifiedImageData: null,

  // 이미지 추가
  addImage: (image) => set((state) => ({ images: [...state.images, image] })),

  // 이미지 업데이트
  updateImage: (id, updatedImage) =>
    set((state) => ({
      images: state.images.map((img) =>
        img.id === id ? { ...img, ...updatedImage } : img
      ),
    })),

  // 이미지 선택
  selectImage: (id) =>
    set((state) => ({
      images: state.images.map((img) =>
        img.id === id
          ? { ...img, isSelected: true }
          : { ...img, isSelected: false }
      ),
    })),

  // 모든 이미지 및 프리뷰 데이터 초기화 (Clear)
  clearImages: () => {
    set({
      images: [],
      pixelatedData: null,
      colorStats: {},
      beadPattern: [],
      simplifiedImageData: null,
    });
  },

  // 캔버스 크기 업데이트
  updateCanvasSize: (width, height) =>
    set({ canvasWidth: width, canvasHeight: height }),

  // 그리드 크기 업데이트
  updateGridSize: (size) => set({ gridSize: size }),

  // 그리드 색상 업데이트
  updateGridColor: (color) => set({ gridColor: color }),

  // 이미지 불투명도 업데이트
  updateImageOpacity: (opacity) => set({ imageOpacity: opacity }),

  // 픽셀 수 업데이트
  setPixelCount: (count) => set({ pixelCount: count }),

  // 프리뷰 데이터 설정
  setPixelatedData: (data) => set({ pixelatedData: data || null }),

  // 색상 통계 설정
  setColorStats: (stats) => set({ colorStats: stats || {} }),

  // 비즈 패턴 설정
  setBeadPattern: (pattern) => set({ beadPattern: pattern || [] }),

  // 단순화된 이미지 데이터 설정
  setSimplifiedImageData: (data) => set({ simplifiedImageData: data || null }),

  // 모든 상태 초기화 (Reset)
  resetCanvas: () => {
    set({
      images: [],
      canvasWidth: 1024,
      canvasHeight: 1024,
      gridSize: 20,
      gridColor: "#ddd",
      imageOpacity: 1,
      pixelCount: 100,
      pixelatedData: null,
      colorStats: {},
      beadPattern: [],
      simplifiedImageData: null,
    });
  },

  // 옵션만 초기화 (이미지는 유지)
  clearOptions: () => {
    set({
      gridSize: 20,
      gridColor: "#ddd",
      imageOpacity: 1,
      pixelCount: 100,
    });
  },
}));

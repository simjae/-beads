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

interface PreviewStoreState {
  pixelatedData: HTMLCanvasElement | null;
  colorStats: { [color: string]: number };
  beadPattern: string[][]; // 단순화된 패턴 상태 추가
  setPixelatedData: (data: HTMLCanvasElement | null) => void;
  setColorStats: (stats: { [color: string]: number }) => void;
  setBeadPattern: (pattern: string[][]) => void; // 단순화된 패턴 설정 메소드 추가
}

export const usePreviewStore = create<PreviewStoreState>((set) => ({
  pixelatedData: null,
  colorStats: {},
  beadPattern: [], // 초기 상태
  setPixelatedData: (data) => set({ pixelatedData: data || null }), // null 체크
  setColorStats: (stats) => set({ colorStats: stats || {} }), // null 체크
  setBeadPattern: (pattern) => set({ beadPattern: pattern || [] }), // null 체크
}));
interface SimplifiedCanvasState {
  simplifiedImageData: ImageData | null;
  beadPattern: string[][]; // 단순화된 패턴 상태
  setSimplifiedImageData: (data: ImageData | null) => void;
  setBeadPattern: (pattern: string[][]) => void; // 단순화된 패턴 설정 메소드 추가
}

export const useSimplifiedCanvasStore = create<SimplifiedCanvasState>(
  (set) => ({
    simplifiedImageData: null,
    beadPattern: [], // 초기 상태
    setSimplifiedImageData: (data) =>
      set({ simplifiedImageData: data || null }), // null 체크
    setBeadPattern: (pattern) => set({ beadPattern: pattern || [] }), // null 체크
  })
);

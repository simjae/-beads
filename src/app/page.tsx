import { Canvas } from "@src/components/Canvas";
import CanvasContainer from "@src/components/Canvas/CanvasContainer";
import { Header } from "@src/components/Header";
import { ImagePreview } from "@src/components/ImagePreview";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <CanvasContainer />
    </div>
  );
}

import { Canvas } from "@src/components/Canvas";
import { Header } from "@src/components/Header";
import { ImagePreview } from "@src/components/ImagePreview";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 grid grid-cols-[300px_1fr] gap-6 p-6">
        <ImagePreview />
        <Canvas />
      </div>
    </div>
  );
}

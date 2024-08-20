import CanvasContainer from "@src/components/Canvas/CanvasContainer";
import { Header } from "@src/components/Header";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <CanvasContainer />
    </div>
  );
}

import BeadsContainer from "@src/components/Beads/BeadsContainer";
import CanvasContainer from "@src/components/Canvas/CanvasContainer";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      {/* <CanvasContainer /> */}
      <div className="flex gap-6 p-6">
        {/* <BeadsCanvasView /> */}
        <BeadsContainer />
      </div>
    </div>
  );
}

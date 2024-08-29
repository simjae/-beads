import { HeroSection } from "./HeroSection";
import Link from "next/link";
import { BeakerIcon } from "lucide-react";
import { ContactSection } from "./ContactSection";
import { Footer } from "./Footer";

export default function Component() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <HeroSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

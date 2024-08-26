import { HeroSection } from "./HeroSection";
import Link from "next/link";
import { BeakerIcon } from "lucide-react";
import { BeadsShowcase } from "./BeadsShowcaseSection";
import { ContactSection } from "./ContactSection";
import { Footer } from "./Footer";

export default function Component() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <HeroSection />
        <BeadsShowcase />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
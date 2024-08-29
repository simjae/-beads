"use client";
import { HeroSection } from "./HeroSection";
import { ContactSection } from "./ContactSection";
import { Footer } from "./Footer";
import { useEffect } from "react";
import { useAnimation } from "framer-motion";
import { ImageSlider } from "./ImageSlider";
import { BeadsArtSection } from "./BeadsArtSection";

export default function Component() {
  const controls = useAnimation();
  const images: string[] = [
    "/images/beads_1.png",
    "/images/beads_2.png",
    "/images/beads_3.png",
    "/images/beads_4.png",
    "/images/beads_5.png",
    "/images/beads_6.png",
    "/images/beads_7.jpeg",
  ];

  useEffect(() => {
    // Animate on scroll logic using Intersection Observer API
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            controls.start({ opacity: 1, y: 0 });
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".fade-in-on-scroll");
    elements.forEach((element) => observer.observe(element));

    return () => {
      elements.forEach((element) => observer.unobserve(element));
    };
  }, [controls]);

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <HeroSection controls={controls} />
        <BeadsArtSection images={images} /> {/* New section for Image Slider */}
        <ContactSection controls={controls} />
      </main>
      <Footer />
    </div>
  );
}

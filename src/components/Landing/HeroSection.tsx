"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export function HeroSection({ controls }: any) {
  return (
    <motion.section
      className="w-full py-12 md:py-24 lg:py-32 xl:py-48 fade-in-on-scroll"
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      transition={{ duration: 0.8 }}
    >
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_550px]">
          <motion.div
            className="flex flex-col justify-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-5xl text-primary-foreground">
                Upload Your Image,
                <br /> Create Bead Art Instantly!
              </h1>

              <p className="max-w-[600px] text-gray-700 md:text-xl">
                Transform any image into a unique bead art pattern with just a
                few clicks. Start creating now and bring your imagination to
                life!
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link
                href="#"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Join a Collection
              </Link>
              <Link
                href="playground"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                try it now
              </Link>
            </div>
          </motion.div>
          {/* <motion.img
            src="/placeholder.svg"
            alt="Beads"
            className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full"
            width="550"
            height="550"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          /> */}
        </div>
      </div>
    </motion.section>
  );
}

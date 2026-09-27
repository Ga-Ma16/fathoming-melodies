"use client";

import AnimatedBackground from "@/components/ui/animated-background";

const AnimatedBackgroundComp = AnimatedBackground as any;

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black text-text-50">
      {/* Background (z-0) */}
      <div className="absolute inset-0 z-0 overflow-hidden w-full h-full">
        <AnimatedBackgroundComp className="w-full h-full" style={{ width: '100%', height: '100%' }} speed={1} />
      </div>

      {/* Foreground (z-10) */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        {/* Title */}
        <h1 className="font-bebas text-7xl md:text-9xl text-white leading-none tracking-wider">
          FATHOMING
          <br />
          MELODIES
        </h1>

        {/* Subtitle */}
        <p className="font-bodoni italic text-white/90 text-xl md:text-2xl max-w-3xl mt-6">
          Calculates decision boundaries for genres and models continuous popularity distributions.(Linear Regression, Support Vector Machines, Bayesian Logistic Regression)
        </p>
      </div>
    </main>
  );
}

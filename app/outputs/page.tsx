"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import backendPayload from "@/euthymia_backend_payload.json";

const ShaderBg = dynamic(() => import("@/components/ui/shader-bg"), {
  ssr: false,
});

interface AlgorithmPayload {
  id: number;
  slug: string;
  name: string;
  subtitle: string;
  equation: string;
  theory: string;
  metrics: Record<string, string>;
  image: string;
  caption: string;
}

export default function OutputsPage() {
  const algorithms = (backendPayload.algorithms as unknown) as AlgorithmPayload[];

  return (
    <div className="relative min-h-screen bg-background-950 text-text-100 antialiased selection:bg-primary-500 selection:text-white">
      {/* 1. Root 3D Water-Plane Background */}
      <ShaderBg />

      {/* 2. Foreground Container */}
      <main className="relative z-10 container mx-auto px-6 py-24 flex flex-col gap-32 pb-40">
        {/* Page Header */}
        <header className="space-y-4 border-b border-background-800/40 pb-8 backdrop-blur-sm bg-background-950/30 p-8 rounded-xl">
          <div className="flex items-center gap-2 text-xs font-mono text-accent-400 uppercase tracking-widest">
            <span className="w-2 h-2 bg-accent-400 inline-block rounded-full animate-ping"></span>
            EUTHYMIA ENGINE :: ALGORITHMIC VISUALIZATIONS & METRICS
          </div>
          <h1 className="font-bebas text-6xl md:text-7xl font-bold tracking-wider text-primary-100 uppercase leading-none">
            EUTHYMIA ENGINE // 12 ALGORITHM OUTPUTS
          </h1>
          <p className="font-bodoni text-lg text-text-300 max-w-4xl leading-relaxed">
            Analytical closed-form solutions, robust M-estimators, Bayesian posterior distributions, 
            probabilistic generative density surfaces, and infinite-dimensional RBF kernel projections.
          </p>
        </header>

        {/* 3. Asymmetrical Split-Pane Rows for 12 Algorithms */}
        <div className="flex flex-col gap-24">
          {algorithms.map((algo) => (
            <article
              key={algo.id}
              className="grid grid-cols-1 lg:grid-cols-12 min-h-[60vh] border border-background-800/50 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-background-700/60"
            >
              {/* Left Column (Theory & Equations - col-span-5) */}
              <div className="lg:col-span-5 bg-background-950/20 backdrop-blur-md p-8 md:p-10 flex flex-col justify-between border-r border-background-800/30 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-accent-400 uppercase tracking-widest bg-accent-950/60 px-2.5 py-1 border border-accent-800/40 rounded">
                      ALGORITHM {String(algo.id).padStart(2, "0")} / 12
                    </span>
                    <span className="font-mono text-xs text-text-500">
                      ID: #{algo.slug}
                    </span>
                  </div>

                  <h2 className="font-bebas text-4xl lg:text-5xl font-bold text-primary-200 tracking-wider uppercase leading-tight">
                    {algo.name}
                  </h2>

                  <p className="font-mono text-xs text-primary-400 tracking-wider uppercase">
                    {algo.subtitle}
                  </p>

                  {/* Formula / Equation Box */}
                  <div className="p-4 bg-black/70 border border-background-800/60 font-mono text-xs text-accent-300 overflow-x-auto rounded">
                    <span className="text-[10px] text-text-500 block mb-1 uppercase tracking-widest">
                      // MATHEMATICAL CONTRACT
                    </span>
                    <code>{algo.equation}</code>
                  </div>

                  {/* Theory & Mathematical Explanation */}
                  <p className="font-bodoni text-base md:text-lg text-text-200 leading-relaxed">
                    {algo.theory}
                  </p>
                </div>

                {/* Live Numerical Metrics extracted from backend JSON */}
                <div className="border-t border-background-800/40 pt-6 space-y-3">
                  <span className="font-mono text-[10px] text-text-400 uppercase tracking-widest block font-semibold">
                    LIVE NUMERICAL METRICS & COEFFICIENTS
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
                    {Object.entries(algo.metrics).map(([key, val]) => (
                      <div
                        key={key}
                        className="flex flex-col bg-black/60 p-2.5 border border-background-800/40 rounded"
                      >
                        <span className="text-[10px] text-text-500 uppercase truncate">
                          {key}
                        </span>
                        <span className="text-text-100 font-bold tracking-tight text-sm">
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column (Visual Output - col-span-7) */}
              <div className="lg:col-span-7 bg-background-950/80 backdrop-blur-2xl p-8 md:p-10 flex flex-col items-center justify-center border border-background-800/40 rounded-xl space-y-4">
                <div className="relative w-full overflow-hidden rounded-lg border border-background-800/60 bg-black/80 shadow-2xl p-2">
                  <Image
                    src={algo.image}
                    alt={algo.name}
                    width={900}
                    height={500}
                    className="w-full h-auto object-contain rounded transition-transform duration-500 hover:scale-[1.01]"
                    priority={algo.id <= 2}
                  />
                </div>
                <figcaption className="font-bodoni text-sm italic text-text-300 text-center max-w-xl">
                  {algo.caption}
                </figcaption>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

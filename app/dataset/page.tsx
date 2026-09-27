import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";

// Mock raw dataset matrix sample representing standardized Z-scores and targets
const sampleMatrixData = [
  { id: 0, intercept: "1.000", valence: "+0.842", energy: "+1.120", danceability: "+0.450", tempo: "-0.210", rawPop: 74, targetY: 1 },
  { id: 1, intercept: "1.000", valence: "-1.025", energy: "-0.780", danceability: "-1.140", tempo: "-0.950", rawPop: 42, targetY: 0 },
  { id: 2, intercept: "1.000", valence: "+0.315", energy: "+0.950", danceability: "+1.380", tempo: "+0.610", rawPop: 81, targetY: 1 },
  { id: 3, intercept: "1.000", valence: "-0.450", energy: "+0.120", danceability: "+0.080", tempo: "+0.150", rawPop: 59, targetY: 0 },
  { id: 4, intercept: "1.000", valence: "+1.420", energy: "+1.540", danceability: "+0.910", tempo: "+1.120", rawPop: 68, targetY: 1 },
  { id: 5, intercept: "1.000", valence: "-1.510", energy: "-1.340", danceability: "-0.620", tempo: "-1.410", rawPop: 23, targetY: 0 },
  { id: 6, intercept: "1.000", valence: "+0.050", energy: "-0.210", danceability: "+0.520", tempo: "-0.430", rawPop: 61, targetY: 1 },
  { id: 7, intercept: "1.000", valence: "+0.620", energy: "+0.480", danceability: "-0.310", tempo: "+0.840", rawPop: 55, targetY: 0 },
  { id: 8, intercept: "1.000", valence: "-0.880", energy: "+0.890", danceability: "+1.050", tempo: "+0.320", rawPop: 77, targetY: 1 },
  { id: 9, intercept: "1.000", valence: "+1.110", energy: "-0.650", danceability: "-0.150", tempo: "-0.780", rawPop: 38, targetY: 0 },
];

export default function DatasetPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans pb-32">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* Header Block */}
        <header className="border-b border-zinc-800 pb-8 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 uppercase tracking-widest">
            <span className="w-2 h-2 bg-emerald-500 inline-block animate-pulse"></span>
            SYS_LOG :: DATASET_MANIFEST
          </div>
          <h1 className="font-bebas text-5xl md:text-6xl font-bold tracking-wider text-white uppercase leading-none">
            DATASET ARCHITECTURE // spotify.csv
          </h1>
          <p className="font-mono text-xs text-zinc-400 max-w-3xl leading-relaxed">
            [MANIFEST_ID: #DS-SPOTIFY-32833] :: Feature matrix extraction, Z-score standardization, 
            and binary classification thresholding for Euthymia regression and classification pipelines.
          </p>
        </header>

        {/* Section I: Metadata & Shape */}
        <section className="space-y-4">
          <h2 className="font-mono text-xs uppercase tracking-widest text-zinc-400 flex items-center gap-2">
            <span className="text-zinc-600">//</span> SECTION 01 :: METADATA & DATASET SHAPE
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 border border-zinc-800 bg-black divide-y md:divide-y-0 md:divide-x divide-zinc-800">
            <div className="p-6 space-y-2">
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block">
                Total Population
              </span>
              <div className="font-mono text-3xl font-bold text-white tracking-tight">
                32,833
              </div>
              <p className="font-mono text-xs text-zinc-500">
                raw track observations in spotify.csv
              </p>
            </div>

            <div className="p-6 space-y-2">
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block">
                Working Sample
              </span>
              <div className="font-mono text-3xl font-bold text-emerald-400 tracking-tight">
                2,000
              </div>
              <p className="font-mono text-xs text-zinc-500">
                random sample for matrix inversion stability
              </p>
            </div>

            <div className="p-6 space-y-2">
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block">
                Target Variables
              </span>
              <div className="font-mono text-base font-bold text-white tracking-tight break-words">
                track_popularity, playlist_genre
              </div>
              <p className="font-mono text-xs text-zinc-500">
                continuous (0-100) & 6 categorical genres
              </p>
            </div>
          </div>
        </section>

        {/* Section II: Feature Dictionary */}
        <section className="space-y-4">
          <h2 className="font-mono text-xs uppercase tracking-widest text-zinc-400 flex items-center gap-2">
            <span className="text-zinc-600">//</span> SECTION 02 :: CONTINUOUS AUDIO FEATURE DICTIONARY
          </h2>
          <div className="border border-zinc-800 bg-black divide-y divide-zinc-800">
            <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              <div className="space-y-1">
                <span className="font-mono text-sm font-bold text-emerald-400 uppercase tracking-wider block">
                  VALENCE
                </span>
                <span className="font-mono text-xs text-zinc-500 block">
                  range: 0.0 — 1.0
                </span>
              </div>
              <p className="font-mono text-xs text-zinc-300 md:col-span-3 leading-relaxed">
                A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. 
                Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks 
                with low valence sound more negative (e.g. sad, depressed, angry).
              </p>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              <div className="space-y-1">
                <span className="font-mono text-sm font-bold text-emerald-400 uppercase tracking-wider block">
                  ENERGY
                </span>
                <span className="font-mono text-xs text-zinc-500 block">
                  range: 0.0 — 1.0
                </span>
              </div>
              <p className="font-mono text-xs text-zinc-300 md:col-span-3 leading-relaxed">
                Energy is a measure from 0.0 to 1.0 representing a perceptual measure of intensity and activity. 
                Typically, energetic tracks feel fast, loud, and noisy. Perceptual features contributing to this 
                attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.
              </p>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              <div className="space-y-1">
                <span className="font-mono text-sm font-bold text-emerald-400 uppercase tracking-wider block">
                  DANCEABILITY
                </span>
                <span className="font-mono text-xs text-zinc-500 block">
                  range: 0.0 — 1.0
                </span>
              </div>
              <p className="font-mono text-xs text-zinc-300 md:col-span-3 leading-relaxed">
                Danceability describes how suitable a track is for dancing based on a combination of musical 
                elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 
                0.0 is least danceable and 1.0 is most danceable.
              </p>
            </div>
          </div>
        </section>

        {/* Section III: Preprocessing Pipeline */}
        <section className="space-y-4">
          <h2 className="font-mono text-xs uppercase tracking-widest text-zinc-400 flex items-center gap-2">
            <span className="text-zinc-600">//</span> SECTION 03 :: PREPROCESSING & TRANSFORMATION PIPELINE
          </h2>
          <div className="border border-zinc-800 bg-black p-6 font-mono text-xs text-zinc-300 space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-emerald-500 font-bold select-none">[01/04]</span>
              <div>
                <span className="text-white font-semibold">MISSING VALUE REMOVAL (NaN FILTRATION):</span>
                <p className="text-zinc-400 mt-1">
                  Drop all records containing missing values (NaN) across candidate audio features and popularity target variables.
                </p>
              </div>
            </div>

            <div className="border-t border-zinc-900 pt-4 flex items-start gap-3">
              <span className="text-emerald-500 font-bold select-none">[02/04]</span>
              <div>
                <span className="text-white font-semibold">Z-SCORE STANDARD SCALING:</span>
                <p className="text-zinc-400 mt-1">
                  Z-score Standard Scaling of continuous features (z = (x - μ) / σ) to standardize feature variances and stabilize matrix inversions during analytical solution of Ordinary Least Squares (OLS) and Ridge Regression.
                </p>
              </div>
            </div>

            <div className="border-t border-zinc-900 pt-4 flex items-start gap-3">
              <span className="text-emerald-500 font-bold select-none">[03/04]</span>
              <div>
                <span className="text-white font-semibold">BIAS INTERCEPT COLUMN ATTACHMENT:</span>
                <p className="text-zinc-400 mt-1">
                  Append a constant bias intercept column of 1s to feature matrix X, yielding augmented design matrix X = [1, x_1, x_2, ..., x_p].
                </p>
              </div>
            </div>

            <div className="border-t border-zinc-900 pt-4 flex items-start gap-3">
              <span className="text-emerald-500 font-bold select-none">[04/04]</span>
              <div>
                <span className="text-white font-semibold">TARGET BINARIZATION:</span>
                <p className="text-zinc-400 mt-1">
                  Binarize continuous track_popularity at threshold ≥ 60 to produce binary classification target vector Y ∈ &#123;0, 1&#125; for logistic threshold evaluation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section IV: Raw Matrix Preview (Table) */}
        <section className="space-y-4">
          <h2 className="font-mono text-xs uppercase tracking-widest text-zinc-400 flex items-center gap-2">
            <span className="text-zinc-600">//</span> SECTION 04 :: RAW DESIGN MATRIX PREVIEW (STANDARDIZED X & TARGET Y)
          </h2>
          <div className="border border-zinc-800 bg-black">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">INDEX</TableHead>
                  <TableHead>INTERCEPT (X₀)</TableHead>
                  <TableHead>VALENCE (Z)</TableHead>
                  <TableHead>ENERGY (Z)</TableHead>
                  <TableHead>DANCEABILITY (Z)</TableHead>
                  <TableHead>TEMPO (Z)</TableHead>
                  <TableHead>RAW POPULARITY</TableHead>
                  <TableHead className="text-right">TARGET (Y ≥ 60)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleMatrixData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="text-zinc-500">{`[${String(row.id).padStart(2, "0")}]`}</TableCell>
                    <TableCell className="text-zinc-400">{row.intercept}</TableCell>
                    <TableCell className={row.valence.startsWith("+") ? "text-emerald-400" : "text-amber-400"}>
                      {row.valence}
                    </TableCell>
                    <TableCell className={row.energy.startsWith("+") ? "text-emerald-400" : "text-amber-400"}>
                      {row.energy}
                    </TableCell>
                    <TableCell className={row.danceability.startsWith("+") ? "text-emerald-400" : "text-amber-400"}>
                      {row.danceability}
                    </TableCell>
                    <TableCell className={row.tempo.startsWith("+") ? "text-emerald-400" : "text-amber-400"}>
                      {row.tempo}
                    </TableCell>
                    <TableCell className="text-zinc-300 font-bold">{row.rawPop}</TableCell>
                    <TableCell className="text-right font-bold">
                      <span className={`px-2 py-0.5 border ${row.targetY === 1 ? "border-emerald-500/50 bg-emerald-950/40 text-emerald-400" : "border-zinc-800 bg-zinc-900 text-zinc-500"}`}>
                        {row.targetY}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>
                SHOWING 10 OF 2,000 STANDARDIZED FEATURE VECTORS :: DESIGN MATRIX X HAS SHAPE (2000, 5)
              </TableCaption>
            </Table>
          </div>
        </section>
      </div>
    </div>
  );
}

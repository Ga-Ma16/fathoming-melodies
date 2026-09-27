"use client";

import React from "react";
import { motion } from "framer-motion";

interface DockProps {
  children: React.ReactNode;
  className?: string;
}

export function Dock({ children, className = "" }: DockProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-md border border-zinc-800 rounded-full px-4 py-2 flex gap-4 items-center shadow-2xl ${className}`}
    >
      {React.Children.map(children, (child) => {
        if (!child) return null;
        return (
          <motion.div
            whileHover={{ scale: 1.15, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="flex items-center justify-center cursor-pointer"
          >
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default Dock;

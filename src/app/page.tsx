'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-slate-950 via-slate-900 to-black text-white overflow-hidden">

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center px-6"
      >
        <Image
          src="/aang-logo.png"
          alt="AANG Logo"
          width={180}
          height={180}
          className="mb-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
        />

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          <span className="bg-linear-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">AANG</span>
        </h1>
        <p className="mt-3 text-lg md:text-xl text-gray-300 max-w-xl">Automated API Testing Suite.</p>

        <div className="mt-8">
          <Link href="/projects">
            <Button
              size="lg"
              className=" group relative rounded-lg bg-linear-to-r from-slate-800 to-slate-700 text-slate-100 font-semibold border border-slate-700 hover:from-slate-700 hover:to-slate-600 hover:border-cyan-400 hover:text-cyan-300 shadow-md hover:shadow-cyan-500/30 transition-all duration-500 ease-in-out overflow-hidden"
            >
              <span className="inline-flex items-center justify-center">
                <span className="transform transition-transform duration-500 ease-in-out translate-x-2 group-hover:-translate-x-1">
                  Projects
                </span>
                <ArrowRight className="ml-1 w-5 h-5 text-cyan-300 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500 ease-in-out" />
              </span>
            </Button>
          </Link>
        </div>


      </motion.div>

      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] bg-cyan-500/20 blur-[180px] rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>
    </main>
  );
}

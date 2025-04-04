"use client";

import { useEffect, useState } from "react";
import Navbar from "./components/navbar/page";
import Footer from "./components/footer/page";
import { useRouter } from "next/navigation";
import GridBackgroundDemo from "@/components/ui/grid-background-demo";

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <GridBackgroundDemo />
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        <Navbar />
        <div className="lander w-full h-[77vh] flex-col items-center justify-center">
          <div className="text-center w-full h-full flex flex-col items-center justify-center">
            {/* TextHoverEffect with only mb-3 below */}
            <div className="w-full mb-3">
              <h1 className="lander-heading text-7xl font-bold">EMAILS ARE BORING</h1>
            </div>
            <p className="text-xl w-[35%] mb-6 secondary-text">
              Let's automate them. Create templates, schedule emails, and track
              opens with MFM.
            </p>
            <div className="relative inline-block">
                <button
                  className="px-4 py-3 rounded-xl cursor-pointer btn relative z-10 flex items-center gap-2"
                  onClick={() => router.push("/pages/dashboard")}
                >
                  <span>Get Started</span>
                </button>
            </div>
          </div>
        </div>
        <div className="w-[100%] h-[10vh] mx-auto flex items-center justify-center">
            <p className="text-[13px] secondary-text">MADE WITH ❤️ BY PAWAN</p>
        </div>
      </div>
    </div>
  );
}
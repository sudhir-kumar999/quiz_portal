"use client";

import Link from "next/link";
import { FaGraduationCap } from "react-icons/fa";

export default function PublicNav() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center px-6">
        <Link
          href="/"
          className="flex items-center gap-3 transition hover:opacity-90"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg">
            <FaGraduationCap className="text-xl text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white sm:text-xl">
              Quiz Portal
            </h1>
            <p className="text-xs text-gray-400">
              Organizational Quiz Portal
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
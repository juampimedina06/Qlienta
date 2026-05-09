"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { AvatarBadge } from "@/components/AvatarBadge";
import { getImagenUrl } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const pathname = usePathname();

  const isProfilePage = pathname === "/cliente/profile";

  return (
    <section className="min-h-screen flex flex-col ">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 fixed "
      >
        <source src="/videos/elegancia.mp4" type="video/mp4" />
      </video>
      {/* Premium Glass Header */}
      <header className="glass-header">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20 transition-transform hover:scale-105 active:scale-95">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-sm font-black tracking-tight text-stone-900 uppercase">
                Qlienta
              </span>
              <span className="text-[10px] font-medium text-stone-400">
                Mission Control
              </span>
            </div>
          </div>

          {/* User Profile / Navigation */}
          <div className="flex items-center justify-between gap-4">
            {user && !isProfilePage && (
              <Link
                href="/cliente/profile"
                className="group flex items-center gap-3 rounded-full border border-stone-200 bg-blue-500/10 pl-4 pr-4 transition-all duration-300 hover:border-blue-200 hover:bg-white/90 hover:shadow-md active:scale-[0.98]"
              >
                <AvatarBadge
                  name={user.name || "Usuario"}
                  avatar_url={getImagenUrl(user.avatar_url)}
                  className="h-10 w-20 ring-2 ring-transparent transition-all text-blue-500"
                />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {children}
      </main>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { AvatarBadge } from "@/components/AvatarBadge";
import { getImagenUrl } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/admin/registrarCliente", label: "Nuevo Cliente" },
  { href: "/admin/futurosClientes", label: "Prospectos" },
];

function NavLink({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative px-4 py-2 text-sm font-medium transition-all duration-300 ease-out",
        "hover:text-white",
        isActive ? "text-white" : "text-white/60",
      )}
    >
      <span className="relative z-10">{label}</span>
      {isActive && (
        <span className="absolute inset-0 -z-10 rounded-lg bg-white/10 backdrop-blur-sm" />
      )}
      {!isActive && (
        <span className="absolute inset-0 -z-10 rounded-lg bg-white/0 transition-all duration-300 hover:bg-white/5" />
      )}
    </Link>
  );
}

import { Menu, X } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when pathname changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <section className="min-h-screen flex flex-col relative">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 -z-20 bg-[#0a0a0a]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_rgba(120,119,198,0.08),_transparent_50%)]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(70,130,180,0.05),_transparent_40%)]" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 ">
        <nav className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          {/* Logo area */}
          <Link
            href="/admin"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10">
              <svg
                className="h-5 w-5 text-white/80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.277-2.172-.749-3.183a9.04 9.04 0 01-1.099-5.105c-.387-1.453-.387-2.928 0-4.381m0 13.5v.003a9.337 9.337 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M4.088 12a9.379 9.379 0 01.747-4.378 9.427 9.427 0 013.912-2.346 9.362 9.362 0 014.812.463M4.088 12V4.5"
                />
              </svg>
            </div>
            <span className="text-lg font-semibold text-white/90 tracking-tight">
              Gestión
            </span>
          </Link>

          {/* Desktop Navigation links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                isActive={
                  pathname === link.href ||
                  (link.href !== "/admin" && pathname?.startsWith(link.href))
                }
              />
            ))}
          </div>

          {/* User section & Mobile Toggle */}
          <div className="flex items-center gap-2 md:gap-4">
            {user && (
              <Link
                href="/admin/profile"
                className="group flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-2 py-1.5 transition-all duration-300 hover:bg-white/10 hover:border-white/20"
              >
                <AvatarBadge
                  name={user.name || "Usuario"}
                  avatar_url={getImagenUrl(user.avatar_url || "")}
                />
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex md:hidden h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/80 transition-all hover:bg-white/10"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 border-b border-white/5 bg-[#0a0a0a]/95 backdrop-blur-xl animate-in slide-in-from-top duration-300">
            <div className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/admin" && pathname?.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between",
                      isActive
                        ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                        : "text-white/60 hover:text-white hover:bg-white/5",
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto py-8 px-4 lg:px-8 relative">
        {children}
      </main>
    </section>
  );
}

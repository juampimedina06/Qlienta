"use client";

import Link from "next/link";
import { AvatarBadge } from "@/components/AvatarBadge";
import { getImagenUrl } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import { Menu, X, LayoutDashboard, Rocket, User } from "lucide-react";
import { cn } from "@/lib/utils";

function NavLink({
  href,
  label,
  isActive,
  icon: Icon,
}: {
  href: string;
  label: string;
  isActive: boolean;
  icon: any;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center gap-2.5 px-4 py-2 text-sm font-semibold transition-all duration-300",
        isActive ? "text-emerald-400" : "text-zinc-400 hover:text-zinc-100",
      )}
    >
      <Icon
        size={18}
        className={cn(
          "transition-transform group-hover:scale-110",
          isActive ? "text-emerald-400" : "text-zinc-500",
        )}
      />
      <span className="relative z-10">{label}</span>
      {isActive && (
        <>
          <span className="absolute inset-x-0 -bottom-[13px] h-[3px] bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] rounded-t-full" />
          <div className="absolute inset-0 bg-emerald-500/5 blur-xl rounded-full" />
        </>
      )}
    </Link>
  );
}

export default function EmpleadoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/empleado", label: "Dashboard", icon: LayoutDashboard },
    { href: "/empleado/desplegados", label: "Desplegados", icon: Rocket },
  ];

  return (
    <section className="min-h-screen flex flex-col text-zinc-100">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 fixed z-[-10] "
      >
        <source src="/videos/humo.mp4" type="video/mp4" />
      </video>

      {/* OSCURESME EL VIDEO */}
      <div className="absolute inset-0 z-0 bg-black/50 fixed z-[-10]" />

      {/* Sleek Dark Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/50 bg-[#050505]/80 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 md:px-12 lg:px-16">
          {/* Brand/Logo */}
          <Link
            href="/empleado"
            className="flex items-center gap-3 transition-transform active:scale-95"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <svg
                className="h-5 w-5 text-emerald-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-black uppercase tracking-widest text-zinc-100">
                Staff
              </span>
              <span className="text-[10px] font-bold text-emerald-500/80">
                Portal VIP
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                isActive={pathname === link.href}
                icon={link.icon}
              />
            ))}
          </div>

          {/* User & Actions */}
          <div className="flex items-center gap-4">
            {user && mounted && (
              <div className="hidden sm:block">
                <Link
                  href="/empleado/profile"
                  className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 transition-all hover:bg-zinc-900 hover:border-emerald-500/30"
                >
                  <AvatarBadge
                    name={user.name || "Staff"}
                    avatar_url={getImagenUrl(user.avatar_url)}
                    className="text-zinc-100"
                  />
                </Link>
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex md:hidden items-center justify-center h-10 w-10 rounded-xl border border-zinc-800 text-zinc-400 transition-all hover:bg-zinc-900"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 border-b border-zinc-800 bg-[#050505] p-4 animate-in slide-in-from-top duration-300">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                      isActive
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "text-zinc-400 hover:bg-zinc-900",
                    )}
                  >
                    <link.icon size={18} />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto py-8 px-4 md:px-12 lg:px-16">
        {children}
      </main>

      {/* Subtle Footer */}
      <footer className="py-6 border-t border-zinc-900">
        <div className="mx-auto max-w-[1600px] px-4 md:px-12 lg:px-16 text-center">
          <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">
            Qlienta VIP Management Platform &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </section>
  );
}

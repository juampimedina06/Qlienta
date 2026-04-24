"use client";

import Link from "next/link";
import { AvatarBadge } from "@/components/AvatarBadge";
import { getImagenUrl } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/empleado", label: "Panel" },
  { href: "/empleado/cargar", label: "Cargar" },
  { href: "/empleado/listado", label: "Clientes" },
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
        "relative px-4 py-2 text-sm font-medium transition-all duration-200",
        isActive ? "text-slate-800" : "text-slate-500 hover:text-slate-700",
      )}
    >
      <span className="relative z-10">{label}</span>
      {isActive && (
        <span className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-b from-slate-100 to-slate-50/80 shadow-sm" />
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

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="min-h-screen flex flex-col bg-black">
      {/* Background with subtle pattern */}
      <div className="fixed inset-0 -z-20 bg-slate-50" />
      <div
        className="fixed inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Header - cleaner and brighter */}
      <header className="sticky top-0 z-50 border-b border-slate-200/50  backdrop-blur-md">
        <nav className="container mx-auto flex h-14 items-center justify-between px-4 lg:px-8">
          {/* Logo area */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 shadow-sm shadow-emerald-500/20">
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <span className="text-base font-semibold text-slate-800 tracking-tight">
              Gestión
            </span>
          </div>

          {/* Navigation links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                isActive={
                  pathname === link.href ||
                  (link.href !== "/empleado" && pathname?.startsWith(link.href))
                }
              />
            ))}
          </div>

          {/* User section */}
          <div className="flex items-center gap-3">
            {user && mounted && (
              <Link
                href="/empleado/profile"
                className="group flex items-center gap-2.5 rounded-full border border-slate-200  px-1.5 py-1 pr-3.5 transition-all duration-200 hover:border-slate-300 hover:bg-white"
              >
                <AvatarBadge
                  name={user.name || "Usuario"}
                  avatar_url={getImagenUrl(user.avatar_url || "")}
                />
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto py-6 px-4 lg:px-8">
        {children}
      </main>
    </section>
  );
}

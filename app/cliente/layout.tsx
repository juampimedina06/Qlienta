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
    <section className="min-h-screen flex flex-col">
      {/* Simple header - just the essentials */}
      <header className="sticky top-0 z-50">
        <div className="flex h-16 items-center justify-between px-4 lg:px-8">
          {/* Logo / Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 shadow-sm shadow-amber-500/25">
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
                  d="M12 21a9 004-9 0 100-18 9 9 0 000 18z"
                />
              </svg>
            </div>
            <span className="text-base font-medium text-stone-500">
              {user?.name}
            </span>
          </div>

          {/* Only show when NOT on profile page */}
          {user && !isProfilePage && (
            <Link
              href="/cliente/profile"
              className="flex items-center gap-2.5 rounded-full border border-stone-200 px-2 py-1.5 pr-4 transition-all duration-200 hover:border-stone-300 hover:bg-white/70 hover:shadow-sm"
            >
              <AvatarBadge
                name={user.name || "Usuario"}
                avatar_url={getImagenUrl(user.avatar_url || "")}
              />
            </Link>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 lg:px-8 py-4">{children}</main>
    </section>
  );
}

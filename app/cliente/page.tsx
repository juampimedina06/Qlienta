"use client";
import { useAuth } from "@/context/AuthContext";
import { AvatarBadge } from "@/components/AvatarBadge";
import { getImagenUrl } from "@/lib/utils";

export default function PageClient() {
  const { user } = useAuth();

  const userName = user?.name?.split(" ")[0] || "Usuario";
  const avatarUrl = getImagenUrl(user?.avatar_url || "");

  return (
    <div className="w-full h-screen">
      {/* Premium card */}
      <div className="relative overflow-hidden border border-white/10 bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 shadow-2xl shadow-black/20 h-[90vh]">
        {/* Subtle backdrop pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#60a5fa_1px,transparent_1px),linear-gradient(180deg,#60a5fa_1px,transparent_1px)] bg-[size:20px_20px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />
        </div>

        {/* Header section */}
        <div className="relative px-4 pt-8 pb-6 sm:px-6 sm:pt-10 sm:pb-8">
          {/* Decorative top elements */}
          <div className="absolute top-4 left-6 sm:top-6 sm:left-8 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-500" />
            <div className="h-3 w-3 rounded-full bg-sky-500" />
            <div className="h-3 w-3 rounded-full bg-purple-500" />
          </div>

          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <AvatarBadge
                name={userName}
                avatar_url={avatarUrl}
                className="h-24 w-24 border-4 border-stone-900 shadow-2xl shadow-black/20"
              />
              {/* Decorative glow effect */}
              <div className="absolute -inset-1 bg-amber-500/10 rounded-full blur-xl animate-pulse" />
            </div>
          </div>

          {/* Name and title */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white tracking-tight sm:text-4xl">
              ¡Hola, {userName}! 👋
            </h1>
            <p className="mt-2 text-base text-stone-300 sm:text-lg">
              Bienvenido a tu espacio personalizado aca podras ver el proceso de
              tu pagina web
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="relative px-4 sm:px-6">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* Stats section */}
        <div className="relative px-4 py-8 sm:px-6 sm:py-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            <div className="rounded-2xl bg-stone-800/50 px-4 py-5 text-center backdrop-blur-md border border-white/5">
              <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">
                Miembro desde
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {user?.created_at?.split("T")[0] || "-"}
              </p>
            </div>
            <div className="rounded-2xl bg-stone-800/50 px-4 py-5 text-center backdrop-blur-md border border-white/5">
              <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">
                Rol
              </p>
              <p className="mt-2 text-lg font-semibold text-white capitalize">
                {user?.role === "cliente" ? "Cliente" : user?.role || "-"}
              </p>
            </div>
            <div className="rounded-2xl bg-stone-800/50 px-4 py-5 text-center backdrop-blur-md border border-white/5">
              <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">
                ID de usuario
              </p>
              <p className="mt-2 text-sm font-mono text-stone-400 truncate">
                {user?.id || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Soft footer */}
        <div className="relative rounded-b-3xl bg-stone-950/30 px-4 py-4 sm:px-6">
          <p className="text-xs text-stone-500 text-center">
            Gestiona tu cuenta de forma segura desde este panel
          </p>
        </div>
      </div>
    </div>
  );
}

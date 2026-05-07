"use client";
import { useAuth } from "@/context/AuthContext";
import { getImagenUrl } from "@/lib/utils";
import { ClienteProyectos } from "@/components/proyectos/ClienteProyectos";

export default function PageClient() {
  const { user } = useAuth();

  const userName = user?.name?.split(" ")[0] || "Usuario";
  const avatarUrl = getImagenUrl(user?.avatar_url);

  return (
    <div className="w-full space-y-10">
      {/* Premium Header Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-white p-8 sm:p-12 shadow-2xl shadow-blue-500/5 ring-1 ring-stone-100">
        {/* Abstract Background Decoration */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-50 blur-[100px]" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-50 blur-[100px]" />

        <div className="relative flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 opacity-20 blur-md animate-pulse" />
              <img
                src={avatarUrl}
                alt={userName}
                className="h-28 w-28 rounded-full border-4 border-white shadow-xl object-cover"
              />
              <div className="absolute bottom-1 right-1 h-6 w-6 rounded-full border-4 border-white bg-emerald-500 shadow-sm" />
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center gap-2 md:justify-start">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600/60">
                  Panel del Cliente
                </span>
                <span className="h-1 w-1 rounded-full bg-stone-300" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                  Status: Activo
                </span>
              </div>
              <h1 className="mt-2 text-4xl font-black tracking-tight text-stone-900 sm:text-5xl">
                ¡Hola, {userName}!{" "}
                <span className="animate-bounce inline-block">👋</span>
              </h1>
              <p className="mt-3 max-w-md text-base font-medium leading-relaxed text-stone-500">
                Bienvenido a tu centro de control. Acá podés supervisar el
                progreso de tus proyectos en tiempo real.
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid w-full grid-cols-2 gap-3 sm:w-auto sm:grid-cols-2 ">
            <div className="flex flex-col rounded-3xl bg-stone-50/50 p-4 ring-1 ring-stone-100 transition-colors hover:bg-stone-50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Miembro desde
              </span>
              <span className="mt-1 text-sm font-black text-stone-900">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString("es-AR", {
                      month: "short",
                      year: "numeric",
                    })
                  : "-"}
              </span>
            </div>
            <div className="flex flex-col rounded-3xl bg-blue-50/30 p-4 ring-1 ring-blue-100/50 transition-colors hover:bg-blue-50/50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                Soporte VIP
              </span>
              <span className="mt-1 text-sm font-black text-blue-600">
                Habilitado
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-10">
        <div className="relative">
          <div className="mb-6 flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-stone-900">
                Mis Proyectos
              </h2>
            </div>
          </div>

          <div className="glass-card rounded-[2.5rem] p-6 sm:p-10 shadow-2xl shadow-blue-500/5">
            <ClienteProyectos />
          </div>
        </div>
      </div>
    </div>
  );
}

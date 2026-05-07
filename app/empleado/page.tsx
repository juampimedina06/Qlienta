"use client";

import React from "react";
import { FuturosClientesList } from "@/components/futuros-clientes/FuturosClientesList";
import { useAuth } from "@/context/AuthContext";
import { Briefcase, TrendingUp, Users } from "lucide-react";

export default function EmpleadoPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "Staff";

  return (
    <div className="space-y-10 w-full">
      {/* Premium Obsidian Header */}
      <section className="relative overflow-hidden rounded-[3rem] bg-zinc-900/40 p-10 md:p-16 lg:p-20 border border-zinc-800 shadow-2xl">
        {/* Subtle Glows */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-teal-500/10 blur-[100px]" />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/70">
                Administrative Control
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
              Panel de <span className="text-emerald-500">Gestión</span>
            </h1>
            <p className="mt-4 max-w-md text-zinc-400 font-medium leading-relaxed">
              Bienvenido, {firstName}. Acá tenés el control total sobre los
              prospectos y el flujo de nuevos clientes.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-6 w-full md:w-auto">
            <div className="flex flex-col p-8 rounded-[2.5rem] bg-zinc-900 border border-zinc-800 hover:border-emerald-500/30 transition-all shadow-2xl min-w-[200px]">
              <div className="flex items-center gap-3 text-zinc-500 mb-3">
                <Users size={18} className="text-emerald-500" />
                <span className="text-xs font-black uppercase tracking-[0.2em]">
                  Prospectos
                </span>
              </div>
              <span className="text-4xl font-black text-white">VIP</span>
            </div>
            <div className="flex flex-col p-8 rounded-[2.5rem] bg-zinc-800/30 border border-zinc-800 hover:border-teal-500/30 transition-all shadow-2xl min-w-[200px]">
              <div className="flex items-center gap-3 text-zinc-500 mb-3">
                <TrendingUp size={18} className="text-teal-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Eficiencia
                </span>
              </div>
              <span className="text-4xl font-black text-emerald-400">98%</span>
            </div>
          </div>
        </div>
      </section>

      {/* List Section */}
      <div className="relative">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
            <Briefcase size={20} />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Pipeline de Prospectos
          </h2>
        </div>

        <div className="bg-zinc-900/20 backdrop-blur-sm rounded-[2.5rem] border border-zinc-800/50 p-8 md:p-12 lg:p-16">
          <FuturosClientesList basePath="/empleado" />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Proyecto } from "@/interface/proyecto";
import { getClienteProyectos } from "@/actions/proyectos/get-cliente-proyectos";
import { ProyectoDetail } from "@/components/proyectos/ProyectoDetail";
import { Loader2, FolderOpen } from "lucide-react";
import { toast } from "react-hot-toast";

export function ClienteProyectos() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProyecto, setSelectedProyecto] = useState<Proyecto | null>(
    null,
  );

  useEffect(() => {
    async function fetchProyectos() {
      try {
        const result = await getClienteProyectos();
        if (result.success && result.data) {
          setProyectos(result.data);
          // Auto-select first project if only one
          if (result.data.length === 1) {
            setSelectedProyecto(result.data[0]);
          }
        } else {
          toast.error(result.error || "Error al cargar tus proyectos");
        }
      } catch {
        toast.error("Error inesperado");
      } finally {
        setLoading(false);
      }
    }
    fetchProyectos();
  }, []);

  if (loading) {
    return (
      <div className=" flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="text-stone-400 animate-pulse text-xs font-bold uppercase tracking-widest">Cargando tu proyecto...</p>
      </div>
    );
  }

  if (proyectos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
        <div className="p-5 rounded-2xl bg-stone-800/50 ring-1 ring-white/5">
          <FolderOpen size={32} className="text-stone-500" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-stone-300">
            No tenés proyectos asignados
          </p>
          <p className="text-xs text-stone-500">
            Cuando el equipo vincule un proyecto a tu cuenta, lo verás acá.
          </p>
        </div>
      </div>
    );
  }

  // If multiple projects, show a selector
  if (proyectos.length > 1 && !selectedProyecto) {
    return (
      <div className=" space-y-8 animate-in fade-in zoom-in-95 duration-500 ">
        <div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight">
            Tus Proyectos
          </h2>
          <p className="text-sm text-stone-500 mt-1 font-medium">
            Seleccioná un proyecto para ver su detalle en tiempo real
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {proyectos.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProyecto(p)}
              className="group relative overflow-hidden p-6 rounded-3xl bg-white border border-stone-100 text-left transition-all duration-500 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1"
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-50 opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="relative z-10">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-50 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                  <FolderOpen size={20} />
                </div>
                <p className="text-lg font-black text-stone-900 group-hover:text-blue-600 transition-colors">
                  {p.nombre_proyecto}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 group-hover:text-stone-500">
                    {p.estado_pagina}
                  </span>
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const proyecto = selectedProyecto || proyectos[0];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500  ">
      {proyectos.length > 1 && (
        <button
          onClick={() => setSelectedProyecto(null)}
          className="group flex items-center gap-2 text-xs text-stone-400 hover:text-blue-600 transition-all font-bold uppercase tracking-widest"
        >
          <span className="transition-transform group-hover:-translate-x-1">
            ←
          </span>{" "}
          Volver a mis proyectos
        </button>
      )}
      <ProyectoDetail proyecto={proyecto} variant="cliente" />
    </div>
  );
}

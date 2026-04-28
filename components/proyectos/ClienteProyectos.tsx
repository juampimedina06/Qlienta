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
  const [selectedProyecto, setSelectedProyecto] = useState<Proyecto | null>(null);

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
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
        <p className="text-stone-400 animate-pulse">Cargando tu proyecto...</p>
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
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white">Tus Proyectos</h2>
          <p className="text-sm text-stone-400 mt-1">
            Seleccioná un proyecto para ver su detalle
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {proyectos.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProyecto(p)}
              className="p-5 rounded-2xl bg-stone-800/50 border border-white/5 text-left transition-all duration-300 hover:border-amber-500/20 hover:bg-stone-800/80 hover:shadow-lg hover:shadow-amber-500/5 group"
            >
              <p className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                {p.nombre_proyecto}
              </p>
              <p className="text-xs text-stone-500 mt-1 capitalize">{p.estado_pagina}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const proyecto = selectedProyecto || proyectos[0];

  return (
    <div className="space-y-6">
      {proyectos.length > 1 && (
        <button
          onClick={() => setSelectedProyecto(null)}
          className="text-xs text-amber-500 hover:text-amber-400 transition-colors font-medium"
        >
          ← Volver a mis proyectos
        </button>
      )}
      <ProyectoDetail proyecto={proyecto} variant="cliente" />
    </div>
  );
}

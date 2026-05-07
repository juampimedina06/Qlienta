import React from "react";
import { FuturosClientesList } from "@/components/futuros-clientes/FuturosClientesList";
import { Rocket } from "lucide-react";

export const metadata = {
  title: "Proyectos Desplegados | Empleado",
  description: "Listado de prospectos con proyectos ya desplegados.",
};

export default function DesplegadosPage() {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[3rem] bg-zinc-900/40 p-10 md:p-16 lg:p-20 border border-zinc-800 shadow-2xl">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px]" />
        
        <div className="relative flex items-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <Rocket size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white">
              Proyectos <span className="text-emerald-500">Desplegados</span>
            </h1>
            <p className="text-zinc-400 mt-2 font-medium">
              Gestioná los clientes que ya tienen su proyecto online listo para la fase de negociación.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-zinc-900/20 backdrop-blur-sm rounded-[2.5rem] border border-zinc-800/50 p-8 md:p-12 lg:p-16">
        <FuturosClientesList soloDesplegados={true} basePath="/empleado" />
      </div>
    </div>
  );
}

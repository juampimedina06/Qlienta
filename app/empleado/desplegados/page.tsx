import React from "react";
import { FuturosClientesList } from "@/components/futuros-clientes/FuturosClientesList";

export const metadata = {
  title: "Proyectos Desplegados | Empleado",
  description: "Listado de prospectos con proyectos ya desplegados.",
};

export default function DesplegadosPage() {
  return (
    <main className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Proyectos Desplegados
        </h1>
        <p className="text-muted-foreground mt-2">
          Aquí podés ver los clientes que ya tienen su proyecto online listo
          para negociar.
        </p>
      </div>
      <FuturosClientesList soloDesplegados={true} basePath="/empleado/desplegados" />
    </main>
  );
}

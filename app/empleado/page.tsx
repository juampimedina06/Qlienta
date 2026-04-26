import React from "react";
import { FuturosClientesList } from "@/components/futuros-clientes/FuturosClientesList";

export const metadata = {
  title: "Gestión de Futuros Clientes | Empleado",
  description: "Panel de administración de prospectos y futuros clientes para empleados.",
};

export default function EmpleadoPage() {
  return (
    <main className="container mx-auto py-8 px-4 md:px-6">
      <FuturosClientesList basePath="/empleado" />
    </main>
  );
}

import React from "react";
import { ClientesActivosList } from "@/components/clientes/ClientesActivosList";

export const metadata = {
  title: "Clientes Activos | Administrador",
  description: "Gestión de clientes activos de la plataforma.",
};

export default function ClientesPage() {
  return (
    <div className="space-y-6">
      <ClientesActivosList />
    </div>
  );
}
